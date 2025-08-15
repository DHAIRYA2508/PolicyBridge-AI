from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.conf import settings
import os
from django.db.models import Count

from .models import Policy, PolicyComparison
from .serializers import (
    PolicySerializer, PolicyCreateSerializer, PolicyComparisonSerializer,
    PolicyComparisonCreateSerializer, PolicyChatSerializer
)


class PolicyListView(generics.ListCreateAPIView):
    """List and create policies"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = PolicySerializer
    
    def get_queryset(self):
        return Policy.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PolicyCreateSerializer
        return PolicySerializer
    
    def perform_create(self, serializer):
        file_obj = self.request.FILES.get('file')
        if file_obj:
            # Get file information
            file_name = file_obj.name
            file_size = file_obj.size
            file_type = file_name.split('.')[-1].lower()
            
            # Validate file type
            if file_type not in settings.ALLOWED_FILE_TYPES:
                raise serializers.ValidationError(f"File type {file_type} is not allowed")
            
            # Validate file size
            if file_size > settings.MAX_UPLOAD_SIZE:
                raise serializers.ValidationError("File size exceeds maximum limit")
            
            # Create policy
            policy = serializer.save(
                user=self.request.user,
                file=file_obj,
                file_name=file_name,
                file_size=file_size,
                file_type=file_type
            )
            
            # TODO: Process file asynchronously with Celery
            # extract_text.delay(policy.id)
            
            return policy


class PolicyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, and delete a policy"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = PolicySerializer
    
    def get_queryset(self):
        return Policy.objects.filter(user=self.request.user)
    
    def perform_destroy(self, instance):
        # Delete the file from storage
        if instance.file and os.path.exists(instance.file.path):
            os.remove(instance.file.path)
        instance.delete()


class PolicyComparisonView(generics.ListCreateAPIView):
    """List and create policy comparisons"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = PolicyComparisonSerializer
    
    def get_queryset(self):
        return PolicyComparison.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PolicyComparisonCreateSerializer
        return PolicyComparisonSerializer
    
    def perform_create(self, serializer):
        policy_ids = serializer.validated_data['policy_ids']
        comparison_type = serializer.validated_data['comparison_type']
        
        # Get policies
        policies = Policy.objects.filter(
            id__in=policy_ids,
            user=self.request.user
        )
        
        if len(policies) != len(policy_ids):
            raise serializers.ValidationError("Some policies not found or access denied")
        
        # Create comparison
        comparison = PolicyComparison.objects.create(
            user=self.request.user,
            comparison_type=comparison_type
        )
        comparison.policies.set(policies)
        
        # TODO: Run AI comparison asynchronously
        # compare_policies.delay(comparison.id)
        
        return comparison


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def policy_chat(request):
    """Chat with a policy using AI"""
    
    serializer = PolicyChatSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    question = serializer.validated_data['question']
    policy_id = serializer.validated_data['policy_id']
    
    # Get policy
    policy = get_object_or_404(Policy, id=policy_id, user=request.user)
    
    if not policy.is_processed:
        return Response({
            'error': 'Policy is still being processed. Please wait.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # TODO: Implement AI chat functionality
    # response = ai_chat_with_policy(policy, question)
    
    # For now, return a mock response
    response = {
        'answer': f"This is a mock response to your question: {question}",
        'clause_reference': 'Section 1.2',
        'confidence': 0.85
    }
    
    return Response(response, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def policy_statistics(request):
    """Get policy statistics for the user"""
    
    user_policies = Policy.objects.filter(user=request.user)
    
    stats = {
        'total_policies': user_policies.count(),
        'processed_policies': user_policies.filter(is_processed=True).count(),
        'pending_policies': user_policies.filter(is_processed=False).count(),
        'total_file_size_mb': sum(p.get_file_size_mb() for p in user_policies),
        'file_types': user_policies.values('file_type').annotate(count=Count('file_type')),
    }
    
    return Response(stats, status=status.HTTP_200_OK)
