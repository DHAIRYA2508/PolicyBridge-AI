from django.urls import path
from .views import (
    ConversationListView, ConversationDetailView, MessageListView,
    conversation_history, start_conversation, conversation_analytics
)

app_name = 'conversations'

urlpatterns = [
    # Conversation management
    path('', ConversationListView.as_view(), name='conversation-list'),
    path('<uuid:pk>/', ConversationDetailView.as_view(), name='conversation-detail'),
    
    # Messages in conversation
    path('<uuid:conversation_id>/messages/', MessageListView.as_view(), name='message-list'),
    
    # Policy-specific conversations
    path('policy/<uuid:policy_id>/', conversation_history, name='policy-conversations'),
    path('policy/<uuid:policy_id>/start/', start_conversation, name='start-conversation'),
    
    # Analytics
    path('<uuid:conversation_id>/analytics/', conversation_analytics, name='conversation-analytics'),
]
