#!/usr/bin/env python3
"""
Simple test script for Gemini integration
"""
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'policybridge_backend.settings')
django.setup()

from ai.services import GeminiService

def test_gemini():
    """Test Gemini service initialization and basic functionality"""
    try:
        # Test service initialization
        print("Testing Gemini service initialization...")
        service = GeminiService()
        print(f"✅ Gemini service initialized successfully with model: {service.model}")
        
        # Test basic content generation
        print("\nTesting basic content generation...")
        test_prompt = "Hello! Please provide a brief explanation of what insurance policies are."
        
        response = service.model.generate_content(test_prompt)
        print(f"✅ Gemini response received: {response.text[:100]}...")
        
        print("\n🎉 All Gemini tests passed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Gemini test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Gemini Integration for PolicyBridge AI")
    print("=" * 50)
    
    # Check if API key is set
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        print("⚠️  GEMINI_API_KEY not set. Please set it in your .env file.")
        print("   You can get a free API key from: https://makersuite.google.com/app/apikey")
        sys.exit(1)
    
    print(f"✅ GEMINI_API_KEY found: {api_key[:10]}...")
    
    # Run tests
    success = test_gemini()
    
    if success:
        print("\n🎯 Gemini integration is ready to use!")
        print("   You can now start the Django server and test the AI features.")
    else:
        print("\n🔧 Please check your configuration and try again.")
        sys.exit(1)
