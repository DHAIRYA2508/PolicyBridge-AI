#!/usr/bin/env python
"""
Script to check and fix policy user associations
"""
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'policybridge_backend.settings')
django.setup()

from policies.models import Policy
from users.models import User

def check_policies():
    """Check all policies and their user associations"""
    print("🔍 Checking all policies in database...")
    
    # Get all policies
    all_policies = Policy.objects.all()
    print(f"📋 Total policies found: {all_policies.count()}")
    
    # Get current user (Rutvi Bhatt)
    try:
        current_user = User.objects.get(email='rutvibhatt8141@gmail.com')
        print(f"👤 Current user: {current_user.first_name} {current_user.last_name} (ID: {current_user.id})")
    except User.DoesNotExist:
        print("❌ User not found!")
        return
    
    # Check each policy
    for policy in all_policies:
        print(f"\n📄 Policy: {policy.name}")
        print(f"   ID: {policy.id}")
        print(f"   User: {policy.user.first_name if policy.user else 'NO USER'} (ID: {policy.user.id if policy.user else 'NONE'})")
        print(f"   Provider: {policy.provider}")
        print(f"   Type: {policy.policy_type}")
        print(f"   Created: {policy.created_at}")
    
    # Count policies for current user
    user_policies = Policy.objects.filter(user=current_user)
    print(f"\n✅ Policies for {current_user.first_name}: {user_policies.count()}")
    
    # Count policies with no user
    orphaned_policies = Policy.objects.filter(user__isnull=True)
    print(f"❌ Policies with no user: {orphaned_policies.count()}")
    
    return current_user, all_policies

def fix_policies(current_user, all_policies):
    """Fix policy user associations"""
    print(f"\n🔧 Fixing policy user associations...")
    
    # Option 1: Assign all policies to current user
    print("Option 1: Assign all policies to current user")
    response = input("Do you want to assign all policies to your account? (y/n): ")
    
    if response.lower() == 'y':
        # Update all policies to belong to current user
        updated_count = Policy.objects.all().update(user=current_user)
        print(f"✅ Updated {updated_count} policies to belong to {current_user.first_name}")
        
        # Verify the fix
        user_policies = Policy.objects.filter(user=current_user)
        print(f"✅ Now you have {user_policies.count()} policies!")
        
        return True
    
    return False

if __name__ == "__main__":
    print("🚀 Policy User Association Fixer")
    print("=" * 40)
    
    try:
        current_user, all_policies = check_policies()
        
        if all_policies.count() > 0:
            fix_policies(current_user, all_policies)
        else:
            print("❌ No policies found in database!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
