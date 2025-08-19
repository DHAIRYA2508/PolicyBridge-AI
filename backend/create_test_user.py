#!/usr/bin/env python
"""
Create Test User
"""
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'policybridge_backend.settings')
django.setup()

from users.models import User

def create_test_user():
    """Create a test user with known credentials"""
    print("👤 Creating Test User...")
    
    # Check if test user already exists
    email = 'test@policybridge.com'
    if User.objects.filter(email=email).exists():
        print(f"✅ Test user {email} already exists")
        return
    
    # Create test user
    try:
        user = User.objects.create_user(
            username='testuser',
            email=email,
            password='test123',
            first_name='Test',
            last_name='User'
        )
        print(f"✅ Test user created successfully!")
        print(f"   Email: {user.email}")
        print(f"   Username: {user.username}")
        print(f"   Password: test123")
        print(f"   First Name: {user.first_name}")
        print(f"   Last Name: {user.last_name}")
        
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
    
    print("\n🎯 Test User Creation Complete!")
    print("\n📝 You can now login with:")
    print("   Email: test@policybridge.com")
    print("   Password: test123")

if __name__ == '__main__':
    create_test_user()
