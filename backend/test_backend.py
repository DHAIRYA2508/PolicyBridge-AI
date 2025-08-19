#!/usr/bin/env python
"""
Simple test script to check backend connectivity
"""
import os
import sys
import django
from django.conf import settings

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'policybridge_backend.settings')
django.setup()

def test_backend():
    """Test basic backend functionality"""
    try:
        from django.contrib.auth import get_user_model
        from policies.models import Policy
        from ai.services import GeminiService
        
        User = get_user_model()
        
        print("✅ Backend is working!")
        print(f"✅ User model: {User}")
        print(f"✅ Policy model: {Policy}")
        print(f"✅ AI service: {GeminiService}")
        
        # Test database connection
        user_count = User.objects.count()
        policy_count = Policy.objects.count()
        
        print(f"✅ Database connection: OK")
        print(f"✅ Users in database: {user_count}")
        print(f"✅ Policies in database: {policy_count}")
        
        # Test AI service
        ai_service = GeminiService()
        print(f"✅ AI service initialized: {ai_service}")
        
        return True
        
    except Exception as e:
        print(f"❌ Backend test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🔍 Testing backend...")
    success = test_backend()
    if success:
        print("🎉 Backend test completed successfully!")
    else:
        print("💥 Backend test failed!")
        sys.exit(1)
