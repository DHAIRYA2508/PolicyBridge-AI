"""
AI serializers for PolicyBridge AI
"""
from rest_framework import serializers
from .models import AIUsageLog, PolicyComparison, Conversation, Message
from policies.serializers import PolicySerializer


class PolicyComparisonRequestSerializer(serializers.Serializer):
    """
    Serializer for policy comparison requests
    """
    policy1_id = serializers.IntegerField(help_text='ID of first policy to compare')
    policy2_id = serializers.IntegerField(help_text='ID of second policy to compare')
    comparison_criteria = serializers.JSONField(
        default=dict,
        help_text='Specific criteria for comparison (e.g., coverage, exclusions, premium)'
    )


class AIUsageLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIUsageLog
        fields = '__all__'
        read_only_fields = ['user', 'created_at']


class PolicyComparisonSerializer(serializers.ModelSerializer):
    policy1_details = PolicySerializer(source='policy1', read_only=True)
    policy2_details = PolicySerializer(source='policy2', read_only=True)
    
    class Meta:
        model = PolicyComparison
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ['created_at']


class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    message_count = serializers.ReadOnlyField()
    policy_details = PolicySerializer(source='policy', read_only=True)
    
    class Meta:
        model = Conversation
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


class ConversationListSerializer(serializers.ModelSerializer):
    message_count = serializers.ReadOnlyField()
    last_message = serializers.SerializerMethodField()
    policy_details = PolicySerializer(source='policy', read_only=True)
    
    class Meta:
        model = Conversation
        fields = ['id', 'conversation_type', 'title', 'policy', 'policy_details', 'message_count', 'last_message', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def get_last_message(self, obj):
        last_message = obj.messages.last()
        if last_message:
            return {
                'content': last_message.content[:100] + '...' if len(last_message.content) > 100 else last_message.content,
                'message_type': last_message.message_type,
                'created_at': last_message.created_at
            }
        return None
