"""
User serializers for PolicyBridge AI
"""
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password_confirm']
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def validate(self, attrs):
        """Validate that passwords match and email is unique (case-insensitive)"""
        # Check if passwords match
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': ["Passwords don't match"]})
        
        # Check for duplicate email (case-insensitive)
        email = attrs.get('email', '').lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({'email': ['A user with this email already exists. Please use a different email address.']})
        
        # Check for duplicate username (case-insensitive)
        username = attrs.get('username', '').lower()
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError({'username': ['A user with this username already exists. Please choose a different username.']})
        
        return attrs
    
    def create(self, validated_data):
        """Create and return a new user"""
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    """
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        """Validate user credentials"""
        email = attrs.get('email')
        password = attrs.get('password')
        
        print(f"🔍 LoginSerializer: Validating email={email}, password={password}")
        
        if email and password:
            # Authenticate directly with email since USERNAME_FIELD = 'email'
            try:
                authenticated_user = authenticate(username=email, password=password)
                print(f"🔍 LoginSerializer: Authenticate result: {authenticated_user}")
                
                if not authenticated_user:
                    print(f"🔍 LoginSerializer: Authentication failed")
                    raise serializers.ValidationError({'non_field_errors': ['Wrong email or password. Please check your credentials and try again.']})
                if not authenticated_user.is_active:
                    print(f"🔍 LoginSerializer: User is not active")
                    raise serializers.ValidationError({'non_field_errors': ['Your account has been disabled. Please contact support.']})
                
                print(f"🔍 LoginSerializer: Authentication successful")
                attrs['user'] = authenticated_user
            except serializers.ValidationError:
                # Re-raise validation errors as-is
                raise
            except Exception as e:
                print(f"🔍 LoginSerializer: Authentication error: {e}")
                raise serializers.ValidationError({'non_field_errors': ['Wrong email or password. Please check your credentials and try again.']})
        else:
            print(f"🔍 LoginSerializer: Missing email or password")
            raise serializers.ValidationError({'non_field_errors': ['Email and password are required.']})
        
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'email', 'date_joined']


class UserListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing users (admin only)
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'date_joined', 'is_active']
        read_only_fields = ['id', 'date_joined']
