#!/usr/bin/env python
"""
Simple Login API Test
"""
import requests
import json

def test_login():
    """Test the login API endpoint"""
    print("🧪 Testing Login API...")
    
    # Test credentials
    credentials = {
        'email': 'test@policybridge.com',
        'password': 'test123'
    }
    
    print(f"🔑 Testing with: {credentials['email']}")
    
    try:
        response = requests.post(
            'http://localhost:8000/api/auth/login/',
            json=credentials,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"📡 Status: {response.status_code}")
        print(f"📡 Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful!")
            print(f"   Token: {data.get('access', 'No token')[:50]}...")
            print(f"   User: {data.get('user', 'No user data')}")
        else:
            print(f"❌ Login failed with status {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    test_login()
