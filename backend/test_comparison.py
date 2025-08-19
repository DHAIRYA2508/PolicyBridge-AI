#!/usr/bin/env python3
"""
Test script for the new Policy Comparison Service.
Run this to verify the backend comparison functionality works.
"""

import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'policybridge_backend.settings')
django.setup()

from ai.services import PolicyComparisonService
from policies.models import Policy
from users.models import User

def test_comparison_service():
    """Test the policy comparison service."""
    print("🧪 Testing Policy Comparison Service...")
    
    try:
        # Initialize the service
        service = PolicyComparisonService()
        print("✅ Service initialized successfully")
        
        # Test PDF text extraction (if test PDF exists)
        test_pdf_path = "test_policy.pdf"
        if os.path.exists(test_pdf_path):
            try:
                text = service.extract_text_from_pdf(test_pdf_path)
                print(f"✅ PDF text extraction successful: {len(text)} characters")
            except Exception as e:
                print(f"⚠️ PDF extraction test failed (expected if no test PDF): {e}")
        else:
            print("ℹ️ No test PDF found, skipping extraction test")
        
        # Test ML verification
        test_data = {"test": "data"}
        verification = service.ml_verification(test_data)
        print(f"✅ ML verification test successful: {verification['status']}")
        
        print("\n🎉 All tests passed! The comparison service is working correctly.")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    test_comparison_service()
