from rest_framework import serializers
from .models import Policy, PolicySection, PolicyComparison, PolicyTag


class PolicyTagSerializer(serializers.ModelSerializer):
    """Serializer for policy tags"""
    
    class Meta:
        model = PolicyTag
        fields = ('id', 'name', 'description', 'color')


class PolicySectionSerializer(serializers.ModelSerializer):
    """Serializer for policy sections"""
    
    class Meta:
        model = PolicySection
        fields = ('id', 'section_title', 'section_content', 'section_number', 'page_number', 'summary', 'keywords')


class PolicySerializer(serializers.ModelSerializer):
    """Serializer for policies"""
    
    sections = PolicySectionSerializer(many=True, read_only=True)
    tags = PolicyTagSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField()
    
    class Meta:
        model = Policy
        fields = (
            'id', 'title', 'description', 'file_name', 'file_size', 'file_type',
            'extracted_text', 'text_length', 'upload_date', 'last_modified',
            'is_processed', 'status', 'category', 'tags', 'sections', 'user'
        )
        read_only_fields = ('id', 'upload_date', 'last_modified', 'text_length')


class PolicyCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating policies"""
    
    class Meta:
        model = Policy
        fields = ('title', 'description', 'file', 'category', 'tags')


class PolicyComparisonSerializer(serializers.ModelSerializer):
    """Serializer for policy comparisons"""
    
    policies = PolicySerializer(many=True, read_only=True)
    
    class Meta:
        model = PolicyComparison
        fields = (
            'id', 'policies', 'comparison_type', 'similarities', 'differences',
            'recommendation', 'comparison_score', 'created_at'
        )
        read_only_fields = ('id', 'created_at')


class PolicyComparisonCreateSerializer(serializers.Serializer):
    """Serializer for creating policy comparisons"""
    
    policy_ids = serializers.ListField(
        child=serializers.UUIDField(),
        min_length=2,
        max_length=5
    )
    comparison_type = serializers.ChoiceField(choices=[
        ('coverage', 'Coverage Comparison'),
        ('costs', 'Costs Comparison'),
        ('features', 'Features Comparison'),
        ('general', 'General Comparison'),
    ])


class PolicyChatSerializer(serializers.Serializer):
    """Serializer for policy chat"""
    
    question = serializers.CharField(max_length=1000)
    policy_id = serializers.UUIDField()
