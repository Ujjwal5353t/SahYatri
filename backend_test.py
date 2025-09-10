import requests
import sys
import json
from datetime import datetime

class TouristSafetyAPITester:
    def __init__(self, base_url="https://tourguard-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(response_data) <= 5:
                        print(f"   Response: {response_data}")
                    elif isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    return success, response_data
                except:
                    return success, {}
            else:
                self.failed_tests.append(f"{name}: Expected {expected_status}, got {response.status_code}")
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            self.failed_tests.append(f"{name}: Exception - {str(e)}")
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_user_registration(self):
        """Test user registration"""
        test_user_data = {
            "email": f"test_officer_{datetime.now().strftime('%H%M%S')}@test.com",
            "password": "TestPass123!",
            "name": "Test Officer",
            "role": "officer"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user_data
        )
        
        if success and 'email' in response:
            print(f"   Registered user: {response['email']}")
            return test_user_data
        return None

    def test_user_login(self, email, password):
        """Test user login and get token"""
        login_data = {"email": email, "password": password}
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_demo_login(self):
        """Test login with demo credentials"""
        return self.test_user_login("officer@demo.com", "demo123")

    def test_init_sample_data(self):
        """Initialize sample data"""
        success, response = self.run_test(
            "Initialize Sample Data",
            "POST",
            "init-sample-data",
            200
        )
        return success

    def test_dashboard_stats(self):
        """Test dashboard statistics"""
        success, response = self.run_test(
            "Dashboard Stats",
            "GET",
            "dashboard/stats",
            200
        )
        
        if success:
            expected_keys = ['total_tourists', 'active_tourists', 'missing_tourists', 'emergency_incidents', 'zone_stats']
            for key in expected_keys:
                if key not in response:
                    print(f"   Warning: Missing key '{key}' in response")
                    return False
            print(f"   Stats: {response['total_tourists']} total, {response['active_tourists']} active tourists")
        return success

    def test_get_tourists(self):
        """Test getting tourists list"""
        success, response = self.run_test(
            "Get Tourists",
            "GET",
            "tourists",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} tourists")
            if len(response) > 0:
                tourist = response[0]
                required_fields = ['id', 'name', 'nationality', 'safety_score', 'zone_type', 'status']
                for field in required_fields:
                    if field not in tourist:
                        print(f"   Warning: Missing field '{field}' in tourist data")
                        return False
                print(f"   Sample tourist: {tourist['name']} ({tourist['nationality']}) - Score: {tourist['safety_score']}")
        return success

    def test_get_incidents(self):
        """Test getting incidents list"""
        success, response = self.run_test(
            "Get Incidents",
            "GET",
            "incidents",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} incidents")
            if len(response) > 0:
                incident = response[0]
                required_fields = ['id', 'type', 'description', 'severity', 'status']
                for field in required_fields:
                    if field not in incident:
                        print(f"   Warning: Missing field '{field}' in incident data")
                        return False
                print(f"   Sample incident: {incident['type']} - {incident['severity']} severity")
        return success

    def test_create_incident(self):
        """Test creating a new incident"""
        incident_data = {
            "tourist_id": "test-tourist-id",
            "type": "medical",
            "description": "Tourist reported feeling unwell",
            "location": {"lat": 26.1445, "lng": 91.7362},
            "severity": "medium",
            "status": "open"
        }
        
        success, response = self.run_test(
            "Create Incident",
            "POST",
            "incidents",
            200,
            data=incident_data
        )
        
        if success and 'id' in response:
            print(f"   Created incident with ID: {response['id']}")
        return success

    def test_protected_routes_without_auth(self):
        """Test that protected routes require authentication"""
        # Temporarily remove token
        original_token = self.token
        self.token = None
        
        protected_endpoints = [
            ("dashboard/stats", "GET"),
            ("tourists", "GET"),
            ("incidents", "GET")
        ]
        
        all_protected = True
        for endpoint, method in protected_endpoints:
            success, _ = self.run_test(
                f"Protected Route {endpoint} (No Auth)",
                method,
                endpoint,
                401  # Expecting unauthorized
            )
            if not success:
                all_protected = False
        
        # Restore token
        self.token = original_token
        return all_protected

def main():
    print("🚀 Starting Tourist Safety Monitoring System API Tests")
    print("=" * 60)
    
    tester = TouristSafetyAPITester()
    
    # Test 1: Try demo login first
    print("\n📋 PHASE 1: Authentication Tests")
    demo_login_success = tester.test_demo_login()
    
    if not demo_login_success:
        print("\n⚠️  Demo login failed, trying user registration...")
        # Test user registration and login
        user_data = tester.test_user_registration()
        if user_data:
            login_success = tester.test_user_login(user_data['email'], user_data['password'])
            if not login_success:
                print("❌ Both demo login and new user login failed. Stopping tests.")
                return 1
        else:
            print("❌ User registration failed. Stopping tests.")
            return 1
    
    # Test 2: Initialize sample data
    print("\n📋 PHASE 2: Data Initialization")
    tester.test_init_sample_data()
    
    # Test 3: Protected routes without authentication
    print("\n📋 PHASE 3: Security Tests")
    tester.test_protected_routes_without_auth()
    
    # Test 4: Dashboard and data retrieval
    print("\n📋 PHASE 4: Dashboard & Data Tests")
    tester.test_dashboard_stats()
    tester.test_get_tourists()
    tester.test_get_incidents()
    
    # Test 5: Data creation
    print("\n📋 PHASE 5: Data Creation Tests")
    tester.test_create_incident()
    
    # Print final results
    print("\n" + "=" * 60)
    print("📊 FINAL TEST RESULTS")
    print("=" * 60)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.failed_tests:
        print("\n❌ FAILED TESTS:")
        for failed_test in tester.failed_tests:
            print(f"   • {failed_test}")
    
    if tester.tests_passed == tester.tests_run:
        print("\n🎉 All tests passed! Backend API is working correctly.")
        return 0
    else:
        print(f"\n⚠️  {tester.tests_run - tester.tests_passed} test(s) failed. Please check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())