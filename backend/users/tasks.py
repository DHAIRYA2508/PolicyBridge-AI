from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string


@shared_task
def send_otp_email(email, otp_code, otp_type):
    """Send OTP email to user"""
    
    subject_map = {
        'email_verification': 'Verify Your Email - PolicyBridge AI',
        'password_reset': 'Password Reset - PolicyBridge AI',
        'login': 'Login OTP - PolicyBridge AI'
    }
    
    subject = subject_map.get(otp_type, 'OTP - PolicyBridge AI')
    
    # Email templates based on OTP type
    if otp_type == 'email_verification':
        template_name = 'users/email_verification.html'
        context = {
            'otp_code': otp_code,
            'expiry_minutes': 5
        }
    elif otp_type == 'password_reset':
        template_name = 'users/password_reset.html'
        context = {
            'otp_code': otp_code,
            'expiry_minutes': 5
        }
    else:
        template_name = 'users/login_otp.html'
        context = {
            'otp_code': otp_code,
            'expiry_minutes': 5
        }
    
    try:
        # Render email template
        html_message = render_to_string(template_name, context)
        
        # Send email
        send_mail(
            subject=subject,
            message=f'Your OTP code is: {otp_code}. Valid for {5} minutes.',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
        
        return f"OTP email sent successfully to {email}"
        
    except Exception as e:
        return f"Failed to send OTP email to {email}: {str(e)}"


@shared_task
def send_welcome_email(email, first_name):
    """Send welcome email to newly verified user"""
    
    subject = 'Welcome to PolicyBridge AI!'
    
    try:
        html_message = render_to_string('users/welcome_email.html', {
            'first_name': first_name
        })
        
        send_mail(
            subject=subject,
            message=f'Welcome {first_name}! Thank you for joining PolicyBridge AI.',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
        
        return f"Welcome email sent successfully to {email}"
        
    except Exception as e:
        return f"Failed to send welcome email to {email}: {str(e)}"


@shared_task
def cleanup_expired_otps():
    """Clean up expired OTPs"""
    
    from django.utils import timezone
    from .models import OTP
    
    expired_otps = OTP.objects.filter(expires_at__lt=timezone.now())
    count = expired_otps.count()
    expired_otps.delete()
    
    return f"Cleaned up {count} expired OTPs"
