#!/usr/bin/env python3
"""Script to create a demo user for testing"""

import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from passlib.context import CryptContext
import uuid
from datetime import datetime, timezone

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    role: str = "officer"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

async def create_demo_user():
    """Create a demo user for testing"""
    
    demo_email = "officer@demo.com"
    demo_password = "demo123"
    demo_name = "Demo Officer"
    
    # Check if demo user already exists
    existing_user = await db.users.find_one({"email": demo_email})
    if existing_user:
        print(f"Demo user {demo_email} already exists!")
        return
    
    # Create password hash
    password_hash = pwd_context.hash(demo_password)
    
    # Create user object
    user = User(
        email=demo_email,
        name=demo_name,
        role="officer"
    )
    
    # Insert user with password hash
    user_dict = user.dict()
    user_dict['password_hash'] = password_hash
    
    await db.users.insert_one(user_dict)
    
    print(f"Demo user created successfully!")
    print(f"Email: {demo_email}")
    print(f"Password: {demo_password}")
    
    # Close connection
    client.close()

if __name__ == "__main__":
    asyncio.run(create_demo_user())