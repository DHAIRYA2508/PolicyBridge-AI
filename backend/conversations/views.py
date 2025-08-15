from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Conversation, Message
from .serializers import (
    ConversationSerializer, ConversationCreateSerializer,
    MessageSerializer, MessageCreateSerializer
)


class ConversationListView(generics.ListCreateAPIView):
    """List and create conversations"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationSerializer
    
    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ConversationCreateSerializer
        return ConversationSerializer
    
    def perform_create(self, serializer):
        conversation = serializer.save(user=self.request.user)
        return conversation


class ConversationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, and delete a conversation"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationSerializer
    
    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)


class MessageListView(generics.ListCreateAPIView):
    """List and create messages in a conversation"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        conversation_id = self.kwargs.get('conversation_id')
        conversation = get_object_or_404(
            Conversation, 
            id=conversation_id, 
            user=self.request.user
        )
        return Message.objects.filter(conversation=conversation)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MessageCreateSerializer
        return MessageSerializer
    
    def perform_create(self, serializer):
        conversation_id = self.kwargs.get('conversation_id')
        conversation = get_object_or_404(
            Conversation, 
            id=conversation_id, 
            user=self.request.user
        )
        
        message = serializer.save(conversation=conversation)
        
        # Update conversation last message time
        conversation.last_message_at = message.created_at
        conversation.save()
        
        # TODO: If user message, generate AI response asynchronously
        # if message.message_type == 'user':
        #     generate_ai_response.delay(conversation.id, message.id)
        
        return message


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def conversation_history(request, policy_id):
    """Get conversation history for a specific policy"""
    
    conversations = Conversation.objects.filter(
        user=request.user,
        policy_id=policy_id
    ).order_by('-updated_at')
    
    serializer = ConversationSerializer(conversations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_conversation(request, policy_id):
    """Start a new conversation for a policy"""
    
    # Check if user has access to the policy
    from policies.models import Policy
    policy = get_object_or_404(Policy, id=policy_id, user=request.user)
    
    # Create conversation
    conversation = Conversation.objects.create(
        user=request.user,
        policy=policy,
        title=f"Chat about {policy.title}"
    )
    
    serializer = ConversationSerializer(conversation)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def conversation_analytics(request, conversation_id):
    """Get analytics for a conversation"""
    
    conversation = get_object_or_404(
        Conversation, 
        id=conversation_id, 
        user=request.user
    )
    
    # Get analytics data
    analytics = {
        'total_messages': conversation.get_message_count(),
        'user_messages': conversation.messages.filter(message_type='user').count(),
        'ai_messages': conversation.messages.filter(message_type='ai').count(),
        'conversation_duration': None,  # TODO: Calculate duration
        'keywords': conversation.keywords,
    }
    
    return Response(analytics, status=status.HTTP_200_OK)
