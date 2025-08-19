"""
Admin configuration for policies app
"""
from django.contrib import admin
from .models import Policy, PolicyExtraction


@admin.register(Policy)
class PolicyAdmin(admin.ModelAdmin):
    """
    Admin configuration for Policy model
    """
    list_display = ('name', 'user', 'provider', 'policy_type', 'file_type', 'is_active', 'created_at')
    list_filter = ('policy_type', 'provider', 'is_active', 'created_at', 'file_type')
    search_fields = ('name', 'provider', 'description', 'policy_number', 'user__email')
    readonly_fields = ('file_size', 'file_type', 'created_at', 'updated_at')
    list_per_page = 25
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'name', 'provider', 'policy_type', 'policy_number')
        }),
        ('Financial Details', {
            'fields': ('coverage_amount', 'premium_amount', 'start_date', 'end_date')
        }),
        ('Document', {
            'fields': ('document', 'file_size', 'file_type')
        }),
        ('Additional Information', {
            'fields': ('description', 'tags', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(PolicyExtraction)
class PolicyExtractionAdmin(admin.ModelAdmin):
    """
    Admin configuration for PolicyExtraction model
    """
    list_display = ('policy', 'extraction_status', 'text_length', 'extraction_date')
    list_filter = ('extraction_status', 'extraction_date')
    search_fields = ('policy__name', 'policy__provider')
    readonly_fields = ('text_length', 'extraction_date')
    
    fieldsets = (
        ('Policy Information', {
            'fields': ('policy', 'extraction_status')
        }),
        ('Extracted Content', {
            'fields': ('extracted_text', 'text_length')
        }),
        ('Metadata', {
            'fields': ('extraction_date', 'error_message')
        }),
    )
