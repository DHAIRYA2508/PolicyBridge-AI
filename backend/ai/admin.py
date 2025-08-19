"""
Admin configuration for AI app
"""
from django.contrib import admin
from .models import AIUsageLog, PolicyComparison, Conversation, Message


@admin.register(AIUsageLog)
class AIUsageLogAdmin(admin.ModelAdmin):
    """
    Admin configuration for AIUsageLog model
    """
    list_display = ('user', 'endpoint', 'tokens_used', 'model_used', 'cost', 'success', 'created_at')
    list_filter = ('endpoint', 'model_used', 'success', 'created_at')
    search_fields = ('user__email', 'endpoint')
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Usage Information', {
            'fields': ('user', 'endpoint', 'model_used')
        }),
        ('Metrics', {
            'fields': ('tokens_used', 'processing_time', 'cost', 'success')
        }),
        ('Error Information', {
            'fields': ('error_message',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(PolicyComparison)
class PolicyComparisonAdmin(admin.ModelAdmin):
    """
    Admin configuration for PolicyComparison model
    """
    list_display = ('user', 'policy1', 'policy2', 'comparison_score', 'created_at')
    list_filter = ('comparison_score', 'created_at')
    search_fields = ('user__email', 'policy1__name', 'policy2__name')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Comparison Information', {
            'fields': ('user', 'policy1', 'policy2', 'comparison_criteria')
        }),
        ('Results', {
            'fields': ('comparison_result', 'comparison_score', 'detailed_analysis')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    """
    Admin configuration for Conversation model
    """
    list_display = ('user', 'conversation_type', 'title', 'policy', 'message_count', 'is_active', 'created_at')
    list_filter = ('conversation_type', 'is_active', 'created_at')
    search_fields = ('user__email', 'title', 'policy__name')
    readonly_fields = ('created_at', 'updated_at', 'message_count')
    
    fieldsets = (
        ('Conversation Information', {
            'fields': ('user', 'conversation_type', 'policy', 'title', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    """
    Admin configuration for Message model
    """
    list_display = ('conversation', 'message_type', 'content_preview', 'tokens_used', 'created_at')
    list_filter = ('message_type', 'created_at')
    search_fields = ('conversation__title', 'content')
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Message Information', {
            'fields': ('conversation', 'message_type', 'content', 'citations', 'ml_insights')
        }),
        ('Metrics', {
            'fields': ('tokens_used',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def content_preview(self, obj):
        """Return a preview of the message content"""
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Content Preview'
