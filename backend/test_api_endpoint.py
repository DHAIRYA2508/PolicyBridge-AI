#!/usr/bin/env python
"""
Test API Endpoint
"""
import requests
import time

def test_api():
    """Test if the API is responding"""
    print("🧪 Testing API Endpoint...")
    
    # Wait a bit for server to start
    time.sleep(2)
    
    try:
        # Test basic server response
        response = requests.get('http://localhost:8000/', timeout=5)
        print(f"📡 Server response: {response.status_code}")
        
        # Test API endpoint
        response = requests.get('http://localhost:8000/api/', timeout=5)
        print(f"📡 API response: {response.status_code}")
        
        # Test login endpoint specifically
        response = requests.post(
            'http://localhost:8000/api/auth/login/',
            json={'email': 'test@test.com', 'password': 'test'},
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        print(f"📡 Login endpoint response: {response.status_code}")
        print(f"📡 Login response body: {response.text}")
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server - server might not be running")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    test_api()
