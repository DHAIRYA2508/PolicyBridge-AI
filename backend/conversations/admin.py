from django.contrib import admin
from .models import Conversation, Message, ConversationSummary, ConversationTag, ConversationAnalytics


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'policy', 'is_active', 'message_count', 'created_at', 'last_message_at')
    list_filter = ('is_active', 'created_at', 'last_message_at')
    search_fields = ('title', 'user__email', 'policy__title', 'summary')
    ordering = ('-updated_at',)
    readonly_fields = ('id', 'created_at', 'updated_at', 'last_message_at')
    
    def message_count(self, obj):
        return obj.get_message_count()
    message_count.short_description = 'Messages'


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('conversation', 'message_type', 'content_preview', 'ai_model', 'tokens_used', 'created_at')
    list_filter = ('message_type', 'ai_model', 'created_at')
    search_fields = ('content', 'conversation__title', 'conversation__user__email')
    ordering = ('-created_at',)
    readonly_fields = ('id', 'created_at', 'updated_at')
    
    def content_preview(self, obj):
        return obj.content[:100] + "..." if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Content Preview'


@admin.register(ConversationSummary)
class ConversationSummaryAdmin(admin.ModelAdmin):
    list_display = ('title', 'conversation', 'sentiment', 'created_at')
    list_filter = ('sentiment', 'created_at')
    search_fields = ('title', 'summary_text', 'conversation__title')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ConversationTag)
class ConversationTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'color', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)
    readonly_fields = ('created_at',)


@admin.register(ConversationAnalytics)
class ConversationAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('conversation', 'total_messages', 'total_tokens_used', 'average_response_time', 'session_duration')
    list_filter = ('created_at',)
    search_fields = ('conversation__title', 'conversation__user__email')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
