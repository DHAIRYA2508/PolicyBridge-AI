from django.urls import path
from .views import (
    PolicyListView, PolicyDetailView, PolicyComparisonView,
    policy_chat, policy_statistics
)

app_name = 'policies'

urlpatterns = [
    # Policy management
    path('', PolicyListView.as_view(), name='policy-list'),
    path('<uuid:pk>/', PolicyDetailView.as_view(), name='policy-detail'),
    
    # Policy comparison
    path('compare/', PolicyComparisonView.as_view(), name='policy-comparison'),
    
    # AI chat
    path('chat/', policy_chat, name='policy-chat'),
    
    # Statistics
    path('statistics/', policy_statistics, name='policy-statistics'),
]
