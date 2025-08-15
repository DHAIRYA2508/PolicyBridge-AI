from django.urls import path
from .views import (
    UserRegistrationView, UserLoginView, OTPVerificationView, OTPResendView,
    PasswordResetRequestView, PasswordResetConfirmView, UserProfileView,
    PasswordChangeView, logout_view
)

app_name = 'users'

urlpatterns = [
    # Authentication endpoints
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    
    # OTP endpoints
    path('verify-otp/', OTPVerificationView.as_view(), name='verify-otp'),
    path('resend-otp/', OTPResendView.as_view(), name='resend-otp'),
    
    # Password management
    path('forgot-password/', PasswordResetRequestView.as_view(), name='forgot-password'),
    path('reset-password/', PasswordResetConfirmView.as_view(), name='reset-password'),
    path('change-password/', PasswordChangeView.as_view(), name='change-password'),
    
    # User profile
    path('profile/', UserProfileView.as_view(), name='profile'),
]
