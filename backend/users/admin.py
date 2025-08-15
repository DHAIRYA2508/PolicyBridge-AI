from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OTP, UserProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_verified', 'is_active', 'created_at')
    list_filter = ('is_verified', 'is_active', 'is_staff', 'created_at')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-created_at',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('PolicyBridge Info', {
            'fields': ('is_verified', 'phone_number', 'company', 'job_title', 'profile_picture')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('PolicyBridge Info', {
            'fields': ('email', 'is_verified', 'phone_number', 'company', 'job_title')
        }),
    )


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('user', 'otp_type', 'otp_code', 'is_used', 'expires_at', 'created_at')
    list_filter = ('otp_type', 'is_used', 'created_at')
    search_fields = ('user__email', 'otp_code')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'location', 'theme_preference', 'created_at')
    list_filter = ('theme_preference', 'created_at')
    search_fields = ('user__email', 'bio', 'location')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
