from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid


class Conversation(models.Model):
    """Conversation model for AI chat sessions"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversations')
    policy = models.ForeignKey('policies.Policy', on_delete=models.CASCADE, related_name='conversations')
    
    # Conversation metadata
    title = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_message_at = models.DateTimeField(blank=True, null=True)
    
    # AI analysis
    summary_text = models.TextField(blank=True, null=True)
    keywords = models.JSONField(default=list, blank=True)
    
    def __str__(self):
        return f"Conversation: {self.policy.title} - {self.user.email}"
    
    def get_message_count(self):
        """Return total number of messages in conversation"""
        return self.messages.count()
    
    def get_last_message(self):
        """Return the last message in the conversation"""
        return self.messages.order_by('-created_at').first()
    
    class Meta:
        db_table = 'conversations'
        verbose_name = 'Conversation'
        verbose_name_plural = 'Conversations'
        ordering = ['-updated_at']


class Message(models.Model):
    """Individual message in a conversation"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    
    # Message content
    content = models.TextField()
    message_type = models.CharField(max_length=20, choices=[
        ('user', 'User Message'),
        ('ai', 'AI Response'),
        ('system', 'System Message'),
    ])
    
    # AI-specific fields
    ai_model = models.CharField(max_length=100, blank=True, null=True)
    tokens_used = models.IntegerField(blank=True, null=True)
    response_time = models.FloatField(blank=True, null=True)  # Response time in seconds
    
    # Context and references
    policy_sections = models.JSONField(default=list, blank=True)  # Referenced policy sections
    clause_references = models.JSONField(default=list, blank=True)  # Specific clause references
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.message_type}: {self.content[:50]}..."
    
    class Meta:
        db_table = 'messages'
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
        ordering = ['created_at']


class ConversationSummary(models.Model):
    """Summary of conversation for quick reference"""
    
    conversation = models.OneToOneField(Conversation, on_delete=models.CASCADE, related_name='summary')
    
    # Summary content
    title = models.CharField(max_length=255)
    summary_text = models.TextField()
    key_points = models.JSONField(default=list, blank=True)
    
    # AI analysis
    sentiment = models.CharField(max_length=20, choices=[
        ('positive', 'Positive'),
        ('neutral', 'Neutral'),
        ('negative', 'Negative'),
    ], blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Summary: {self.title}"
    
    class Meta:
        db_table = 'conversation_summaries'
        verbose_name = 'Conversation Summary'
        verbose_name_plural = 'Conversation Summaries'


class ConversationTag(models.Model):
    """Tags for categorizing conversations"""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    color = models.CharField(max_length=7, default='#10B981')  # Hex color
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'conversation_tags'
        verbose_name = 'Conversation Tag'
        verbose_name_plural = 'Conversation Tags'
        ordering = ['name']


class ConversationAnalytics(models.Model):
    """Analytics data for conversations"""
    
    conversation = models.OneToOneField(Conversation, on_delete=models.CASCADE, related_name='analytics')
    
    # Usage metrics
    total_messages = models.IntegerField(default=0)
    user_messages = models.IntegerField(default=0)
    ai_messages = models.IntegerField(default=0)
    
    # AI performance metrics
    total_tokens_used = models.IntegerField(default=0)
    average_response_time = models.FloatField(default=0.0)
    
    # User engagement
    session_duration = models.FloatField(default=0.0)  # in minutes
    last_activity = models.DateTimeField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Analytics: {self.conversation.title}"
    
    class Meta:
        db_table = 'conversation_analytics'
        verbose_name = 'Conversation Analytics'
        verbose_name_plural = 'Conversation Analytics'
