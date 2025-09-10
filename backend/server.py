from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import jwt
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your-secret-key-here"  # In production, use environment variable
ALGORITHM = "HS256"

# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    role: str = "officer"  # officer, admin
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    role: str = "officer"

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Tourist(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    passport_number: str
    nationality: str
    phone: str
    emergency_contact: str
    location: dict  # {"lat": float, "lng": float}
    safety_score: int  # 1-100
    zone_type: str  # "safe", "caution", "danger"
    last_seen: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "active"  # active, missing, emergency
    hotel_name: Optional[str] = None
    itinerary: Optional[str] = None

class Incident(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tourist_id: str
    type: str  # "panic", "missing", "medical", "security"
    description: str
    location: dict
    severity: str  # "low", "medium", "high", "critical"
    status: str = "open"  # open, investigating, resolved
    reported_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    assigned_officer: Optional[str] = None

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await db.users.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

# Auth routes
@api_router.post("/auth/register", response_model=User)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.dict()
    del user_dict['password']
    user_dict['password_hash'] = hashed_password
    
    user = User(**user_dict)
    await db.users.insert_one({**user.dict(), 'password_hash': hashed_password})
    return user

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user['email']})
    return {"access_token": access_token, "token_type": "bearer"}

# Dashboard routes
@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    total_tourists = await db.tourists.count_documents({})
    active_tourists = await db.tourists.count_documents({"status": "active"})
    missing_tourists = await db.tourists.count_documents({"status": "missing"})
    emergency_incidents = await db.incidents.count_documents({"status": "open", "severity": {"$in": ["high", "critical"]}})
    
    # Zone counts
    safe_zone_count = await db.tourists.count_documents({"zone_type": "safe"})
    caution_zone_count = await db.tourists.count_documents({"zone_type": "caution"})
    danger_zone_count = await db.tourists.count_documents({"zone_type": "danger"})
    
    return {
        "total_tourists": total_tourists,
        "active_tourists": active_tourists,
        "missing_tourists": missing_tourists,
        "emergency_incidents": emergency_incidents,
        "zone_stats": {
            "safe": safe_zone_count,
            "caution": caution_zone_count,
            "danger": danger_zone_count
        }
    }

@api_router.get("/tourists", response_model=List[Tourist])
async def get_tourists(current_user: User = Depends(get_current_user)):
    tourists = await db.tourists.find().to_list(1000)
    return [Tourist(**tourist) for tourist in tourists]

@api_router.get("/tourists/{tourist_id}", response_model=Tourist)
async def get_tourist(tourist_id: str, current_user: User = Depends(get_current_user)):
    tourist = await db.tourists.find_one({"id": tourist_id})
    if not tourist:
        raise HTTPException(status_code=404, detail="Tourist not found")
    return Tourist(**tourist)

@api_router.get("/incidents", response_model=List[Incident])
async def get_incidents(current_user: User = Depends(get_current_user)):
    incidents = await db.incidents.find().to_list(1000)
    return [Incident(**incident) for incident in incidents]

@api_router.post("/incidents", response_model=Incident)
async def create_incident(incident_data: dict, current_user: User = Depends(get_current_user)):
    incident = Incident(**incident_data)
    await db.incidents.insert_one(incident.dict())
    return incident

# Sample data initialization
@api_router.post("/init-sample-data")
async def init_sample_data():
    # Clear existing data
    await db.tourists.delete_many({})
    await db.incidents.delete_many({})
    
    # Sample tourists data
    sample_tourists = [
        {
            "name": "John Smith",
            "passport_number": "US123456789",
            "nationality": "USA",
            "phone": "+1-555-0123",
            "emergency_contact": "+1-555-0124",
            "location": {"lat": 26.1445, "lng": 91.7362},  # Guwahati
            "safety_score": 85,
            "zone_type": "safe",
            "status": "active",
            "hotel_name": "Hotel Royal",
            "itinerary": "Temple tour, Local markets"
        },
        {
            "name": "Emma Wilson",
            "passport_number": "UK987654321",
            "nationality": "UK",
            "phone": "+44-20-7946-0958",
            "emergency_contact": "+44-20-7946-0959",
            "location": {"lat": 26.1158, "lng": 91.7086},
            "safety_score": 67,
            "zone_type": "caution",
            "status": "active",
            "hotel_name": "Brahmaputra Hotel",
            "itinerary": "Wildlife sanctuary, River cruise"
        },
        {
            "name": "Hans Mueller",
            "passport_number": "DE456789123",
            "nationality": "Germany",
            "phone": "+49-30-12345678",
            "emergency_contact": "+49-30-12345679",
            "location": {"lat": 26.1733, "lng": 91.7458},
            "safety_score": 40,
            "zone_type": "danger",
            "status": "active",
            "hotel_name": "Northeast Inn",
            "itinerary": "Adventure trekking, Remote villages"
        },
        {
            "name": "Maria Garcia",
            "passport_number": "ES789123456",
            "nationality": "Spain",
            "phone": "+34-91-123-4567",
            "emergency_contact": "+34-91-123-4568",
            "location": {"lat": 26.1341, "lng": 91.7880},
            "safety_score": 78,
            "zone_type": "safe",
            "status": "active",
            "hotel_name": "Paradise Resort",
            "itinerary": "Cultural sites, Photography"
        },
        {
            "name": "Yuki Tanaka",
            "passport_number": "JP321654987",
            "nationality": "Japan",
            "phone": "+81-3-1234-5678",
            "emergency_contact": "+81-3-1234-5679",
            "location": {"lat": 26.1689, "lng": 91.7631},
            "safety_score": 92,
            "zone_type": "safe",
            "status": "active",
            "hotel_name": "Assam Palace",
            "itinerary": "Tea gardens, Monasteries"
        }
    ]
    
    # Insert sample tourists
    for tourist_data in sample_tourists:
        tourist = Tourist(**tourist_data)
        await db.tourists.insert_one(tourist.dict())
    
    # Sample incidents
    sample_incidents = [
        {
            "tourist_id": "tourist_id_placeholder",
            "type": "panic",
            "description": "Tourist activated panic button near remote area",
            "location": {"lat": 26.1733, "lng": 91.7458},
            "severity": "high",
            "status": "investigating"
        }
    ]
    
    for incident_data in sample_incidents:
        incident = Incident(**incident_data)
        await db.incidents.insert_one(incident.dict())
    
    return {"message": "Sample data initialized successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()