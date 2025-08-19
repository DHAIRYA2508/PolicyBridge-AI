"""
AI models for PolicyBridge AI
"""
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class AIUsageLog(models.Model):
    """
    Model to log AI API usage for monitoring and billing
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_usage_logs')
    endpoint = models.CharField(max_length=100, verbose_name='API Endpoint')
    tokens_used = models.PositiveIntegerField(verbose_name='Tokens Used')
    model_used = models.CharField(max_length=50, verbose_name='AI Model Used')
    processing_time = models.FloatField(verbose_name='Processing Time (seconds)')
    cost = models.DecimalField(max_digits=10, decimal_places=6, verbose_name='Cost (USD)')
    success = models.BooleanField(default=True, verbose_name='Request Successful')
    error_message = models.TextField(blank=True, verbose_name='Error Message')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created At')
    
    class Meta:
        verbose_name = 'AI Usage Log'
        verbose_name_plural = 'AI Usage Logs'
        db_table = 'ai_usage_logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"AI usage by {self.user.email} at {self.created_at}"


class PolicyComparison(models.Model):
    """
    Model to store policy comparison results
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='policy_comparisons')
    policy1 = models.ForeignKey('policies.Policy', on_delete=models.CASCADE, related_name='comparisons_as_policy1')
    policy2 = models.ForeignKey('policies.Policy', on_delete=models.CASCADE, related_name='comparisons_as_policy2')
    comparison_criteria = models.JSONField(default=dict, verbose_name='Comparison Criteria')
    comparison_result = models.TextField(verbose_name='Comparison Result')
    comparison_score = models.IntegerField(default=0, verbose_name='Comparison Score')
    detailed_analysis = models.JSONField(default=dict, verbose_name='Detailed Analysis')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created At')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Updated At')
    
    class Meta:
        verbose_name = 'Policy Comparison'
        verbose_name_plural = 'Policy Comparisons'
        db_table = 'policy_comparisons'
        ordering = ['-created_at']
        unique_together = ['user', 'policy1', 'policy2']
    
    def __str__(self):
        return f"Comparison: {self.policy1.name} vs {self.policy2.name}"


class Conversation(models.Model):
    """
    Model to store AI chat conversations
    """
    CONVERSATION_TYPES = [
        ('general', 'General Chat'),
        ('policy', 'Policy-Specific Chat'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversations')
    conversation_type = models.CharField(max_length=20, choices=CONVERSATION_TYPES, default='general')
    policy = models.ForeignKey('policies.Policy', on_delete=models.CASCADE, null=True, blank=True, related_name='conversations')
    title = models.CharField(max_length=255, verbose_name='Conversation Title')
    is_active = models.BooleanField(default=True, verbose_name='Active Conversation')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created At')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Updated At')
    
    class Meta:
        verbose_name = 'Conversation'
        verbose_name_plural = 'Conversations'
        db_table = 'conversations'
        ordering = ['-updated_at']
    
    def __str__(self):
        if self.policy:
            return f"Chat about {self.policy.name} - {self.user.email}"
        return f"General chat - {self.user.email}"
    
    @property
    def message_count(self):
        return self.messages.count()


class Message(models.Model):
    """
    Model to store individual messages in conversations
    """
    MESSAGE_TYPES = [
        ('user', 'User Message'),
        ('ai', 'AI Response'),
    ]
    
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, verbose_name='Message Type')
    content = models.TextField(verbose_name='Message Content')
    citations = models.JSONField(default=list, blank=True, verbose_name='Citations')
    ml_insights = models.JSONField(default=dict, blank=True, verbose_name='ML Insights')
    tokens_used = models.PositiveIntegerField(null=True, blank=True, verbose_name='Tokens Used')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created At')
    
    class Meta:
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
        db_table = 'messages'
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.message_type} message in {self.conversation.title} at {self.created_at}"
