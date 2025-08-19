#!/usr/bin/env python
"""
Test Backend API Endpoints
"""
import os
import sys
import django
import requests
import json

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'policybridge_backend.settings')
django.setup()

from users.models import User
from policies.models import Policy

def test_backend_api():
    """Test all backend API endpoints"""
    print("🧪 Testing Backend API...")
    
    # Test 1: Check if server is running
    print("\n🌐 Server Status:")
    try:
        response = requests.get('http://localhost:8000/api/policies/', timeout=5)
        if response.status_code == 401:
            print("✅ Backend server is running (401 Unauthorized is expected)")
        else:
            print(f"⚠️ Unexpected status: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is not running")
        print("🚀 Start with: python manage.py runserver 8000")
        return
    except Exception as e:
        print(f"❌ API Error: {e}")
        return
    
    # Test 2: Check database
    print("\n📊 Database Status:")
    try:
        user_count = User.objects.count()
        policy_count = Policy.objects.count()
        print(f"✅ Users: {user_count}")
        print(f"✅ Policies: {policy_count}")
        
        # Show some sample data
        if user_count > 0:
            sample_user = User.objects.first()
            print(f"✅ Sample user: {sample_user.email}")
        
        if policy_count > 0:
            sample_policy = Policy.objects.first()
            print(f"✅ Sample policy: {sample_policy.name}")
            
    except Exception as e:
        print(f"❌ Database Error: {e}")
        return
    
    # Test 3: Test specific endpoints
    print("\n🔗 Testing API Endpoints:")
    endpoints = [
        ('/api/policies/', 'GET'),
        ('/api/policies/stats/', 'GET'),
        ('/api/auth/login/', 'POST'),
        ('/api/auth/register/', 'POST')
    ]
    
    for endpoint, method in endpoints:
        try:
            if method == 'GET':
                response = requests.get(f'http://localhost:8000{endpoint}', timeout=5)
            else:
                response = requests.post(f'http://localhost:8000{endpoint}', json={}, timeout=5)
            
            status = "✅" if response.status_code in [200, 401, 403, 400] else "❌"
            print(f"{status} {method} {endpoint}: {response.status_code}")
            
        except Exception as e:
            print(f"❌ {method} {endpoint}: Error - {e}")
    
    # Test 4: Test AI service
    print("\n🤖 AI Service Status:")
    try:
        from ai.services import GeminiService
        ai_service = GeminiService()
        if ai_service.model:
            print("✅ Gemini AI service is configured")
        else:
            print("⚠️ Gemini AI service using mock responses (no API key)")
    except Exception as e:
        print(f"❌ AI Service Error: {e}")
    
    print("\n🎯 Backend API Test Complete!")
    print("\n📝 Next Steps:")
    print("1. Set GEMINI_API_KEY in environment for real AI responses")
    print("2. Test frontend integration")
    print("3. Verify all CRUD operations work")

if __name__ == '__main__':
    test_backend_api()
