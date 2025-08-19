#!/usr/bin/env python
"""
Test Login API Endpoint
"""
import os
import sys
import django
import requests
import json

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'policybridge_backend.settings')
django.setup()

def test_login_api():
    """Test the login API endpoint directly"""
    print("🧪 Testing Login API Endpoint...")
    
    # Test credentials
    test_credentials = {
        'email': 'test@policybridge.com',
        'password': 'test123'
    }
    
    print(f"\n🔑 Testing with credentials: {test_credentials}")
    
    # Test 1: Check if server is running
    try:
        response = requests.post(
            'http://localhost:8000/api/auth/login/',
            json=test_credentials,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"\n📡 API Response:")
        print(f"   Status Code: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        print(f"   Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login API call successful!")
            data = response.json()
            if 'access' in data and 'user' in data:
                print("✅ JWT token and user data received!")
                print(f"   Access Token: {data['access'][:50]}...")
                print(f"   User: {data['user']}")
            else:
                print("❌ Missing access token or user data in response")
        else:
            print(f"❌ Login API call failed with status {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server")
        print("🚀 Make sure Django server is running on port 8000")
    except Exception as e:
        print(f"❌ Error testing login API: {e}")
    
    print("\n🎯 Login API Test Complete!")

if __name__ == '__main__':
    test_login_api()
