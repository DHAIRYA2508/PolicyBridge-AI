from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import random
import string

from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserSerializer,
    UserUpdateSerializer, PasswordChangeSerializer, PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer, OTPVerificationSerializer, OTPResendSerializer
)
from .models import OTP
from .tasks import send_otp_email

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    """User registration endpoint"""
    
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate and send OTP
        otp_code = ''.join(random.choices(string.digits, k=6))
        expires_at = timezone.now() + timedelta(minutes=5)
        
        OTP.objects.create(
            user=user,
            otp_code=otp_code,
            otp_type='email_verification',
            expires_at=expires_at
        )
        
        # Send OTP email asynchronously
        send_otp_email.delay(user.email, otp_code, 'email_verification')
        
        return Response({
            'message': 'User registered successfully. Please check your email for OTP verification.',
            'user_id': user.id,
            'email': user.email
        }, status=status.HTTP_201_CREATED)


class UserLoginView(generics.GenericAPIView):
    """User login endpoint"""
    
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        # Update last login
        user.last_login = timezone.now()
        user.save()
        
        return Response({
            'message': 'Login successful',
            'access_token': str(access_token),
            'refresh_token': str(refresh),
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)


class OTPVerificationView(generics.GenericAPIView):
    """OTP verification endpoint"""
    
    permission_classes = [AllowAny]
    serializer_class = OTPVerificationSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp']
        
        try:
            user = User.objects.get(email=email)
            otp = OTP.objects.filter(
                user=user,
                otp_code=otp_code,
                otp_type='email_verification',
                is_used=False
            ).first()
            
            if not otp:
                return Response({
                    'error': 'Invalid OTP code'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if otp.is_expired():
                return Response({
                    'error': 'OTP has expired'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Mark OTP as used and verify user
            otp.is_used = True
            otp.save()
            
            user.is_verified = True
            user.save()
            
            return Response({
                'message': 'Email verified successfully'
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)


class OTPResendView(generics.GenericAPIView):
    """OTP resend endpoint"""
    
    permission_classes = [AllowAny]
    serializer_class = OTPResendSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        otp_type = serializer.validated_data['otp_type']
        
        try:
            user = User.objects.get(email=email)
            
            # Check rate limiting
            recent_otps = OTP.objects.filter(
                user=user,
                otp_type=otp_type,
                created_at__gte=timezone.now() - timedelta(hours=1)
            ).count()
            
            if recent_otps >= 3:
                return Response({
                    'error': 'Too many OTP requests. Please wait before requesting another.'
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)
            
            # Generate new OTP
            otp_code = ''.join(random.choices(string.digits, k=6))
            expires_at = timezone.now() + timedelta(minutes=5)
            
            OTP.objects.create(
                user=user,
                otp_code=otp_code,
                otp_type=otp_type,
                expires_at=expires_at
            )
            
            # Send OTP email
            send_otp_email.delay(user.email, otp_code, otp_type)
            
            return Response({
                'message': 'OTP sent successfully'
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)


class PasswordResetRequestView(generics.GenericAPIView):
    """Password reset request endpoint"""
    
    permission_classes = [AllowAny]
    serializer_class = PasswordResetRequestSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        
        # Generate OTP for password reset
        otp_code = ''.join(random.choices(string.digits, k=6))
        expires_at = timezone.now() + timedelta(minutes=5)
        
        OTP.objects.create(
            user=user,
            otp_code=otp_code,
            otp_type='password_reset',
            expires_at=expires_at
        )
        
        # Send OTP email
        send_otp_email.delay(user.email, otp_code, 'password_reset')
        
        return Response({
            'message': 'Password reset OTP sent successfully'
        }, status=status.HTTP_200_OK)


class PasswordResetConfirmView(generics.GenericAPIView):
    """Password reset confirmation endpoint"""
    
    permission_classes = [AllowAny]
    serializer_class = PasswordResetConfirmSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password']
        
        try:
            user = User.objects.get(email=email)
            otp = OTP.objects.filter(
                user=user,
                otp_code=otp_code,
                otp_type='password_reset',
                is_used=False
            ).first()
            
            if not otp:
                return Response({
                    'error': 'Invalid OTP code'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if otp.is_expired():
                return Response({
                    'error': 'OTP has expired'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Mark OTP as used and change password
            otp.is_used = True
            otp.save()
            
            user.set_password(new_password)
            user.save()
            
            return Response({
                'message': 'Password reset successfully'
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """User profile view and update"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user


class PasswordChangeView(generics.GenericAPIView):
    """Password change endpoint"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = PasswordChangeSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']
        
        if not user.check_password(old_password):
            return Response({
                'error': 'Current password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """User logout endpoint"""
    
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Logout failed'
        }, status=status.HTTP_400_BAD_REQUEST)
