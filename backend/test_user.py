#!/usr/bin/env python
"""
Test User Login
"""
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'policybridge_backend.settings')
django.setup()

from users.models import User
from django.contrib.auth import authenticate

def test_user_login():
    """Test user login functionality"""
    print("🧪 Testing User Login...")
    
    # Check existing users
    users = User.objects.all()
    print(f"\n👥 Total users: {users.count()}")
    
    for user in users:
        print(f"\n👤 User: {user.email}")
        print(f"   Username: {user.username}")
        print(f"   First Name: {user.first_name}")
        print(f"   Last Name: {user.last_name}")
        print(f"   Is Active: {user.is_active}")
        print(f"   Date Joined: {user.date_joined}")
        
        # Test authentication
        print(f"   Testing authentication...")
        
        # Try to authenticate with email
        auth_user = authenticate(username=user.email, password='test123')
        if auth_user:
            print(f"   ✅ Authentication successful with password 'test123'")
        else:
            print(f"   ❌ Authentication failed with password 'test123'")
            
        # Try to authenticate with username
        auth_user = authenticate(username=user.username, password='test123')
        if auth_user:
            print(f"   ✅ Authentication successful with username and password 'test123'")
        else:
            print(f"   ❌ Authentication failed with username and password 'test123'")
    
    print("\n🎯 User Login Test Complete!")
    print("\n📝 To test login, try these credentials:")
    print("   Email: (use one of the emails above)")
    print("   Password: test123 (or the actual password if different)")

if __name__ == '__main__':
    test_user_login()
