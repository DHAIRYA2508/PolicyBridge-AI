from rest_framework import serializers
from .models import Conversation, Message, ConversationSummary


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for messages"""
    
    class Meta:
        model = Message
        fields = (
            'id', 'content', 'message_type', 'ai_model', 'tokens_used',
            'response_time', 'policy_sections', 'clause_references', 'created_at'
        )
        read_only_fields = ('id', 'created_at')


class ConversationSummarySerializer(serializers.ModelSerializer):
    """Serializer for conversation summaries"""
    
    class Meta:
        model = ConversationSummary
        fields = ('id', 'title', 'summary_text', 'key_points', 'sentiment', 'created_at')
        read_only_fields = ('id', 'created_at')


class ConversationSerializer(serializers.ModelSerializer):
    """Serializer for conversations"""
    
    messages = MessageSerializer(many=True, read_only=True)
    summary = ConversationSummarySerializer(read_only=True)
    policy = serializers.StringRelatedField()
    user = serializers.StringRelatedField()
    
    class Meta:
        model = Conversation
        fields = (
            'id', 'title', 'policy', 'user', 'is_active', 'summary_text', 'keywords',
            'created_at', 'updated_at', 'last_message_at', 'messages'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'last_message_at')


class ConversationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating conversations"""
    
    class Meta:
        model = Conversation
        fields = ('title', 'policy')


class MessageCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating messages"""
    
    class Meta:
        model = Message
        fields = ('content', 'message_type')
