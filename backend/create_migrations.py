#!/usr/bin/env python
"""
Script to create and apply database migrations for chat functionality
"""
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'policybridge_backend.settings')

# Setup Django
django.setup()

from django.core.management import execute_from_command_line

def create_migrations():
    """Create migrations for the AI app"""
    print("Creating migrations for AI app...")
    execute_from_command_line(['manage.py', 'makemigrations', 'ai'])

def apply_migrations():
    """Apply all migrations"""
    print("Applying migrations...")
    execute_from_command_line(['manage.py', 'migrate'])

if __name__ == '__main__':
    try:
        create_migrations()
        apply_migrations()
        print("✅ Migrations completed successfully!")
    except Exception as e:
        print(f"❌ Error during migrations: {e}")
        sys.exit(1)
