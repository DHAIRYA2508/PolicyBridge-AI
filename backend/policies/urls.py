"""
URL patterns for policies app
"""
from django.urls import path
from . import views

app_name = 'policies'

urlpatterns = [
    # Policy management endpoints
    path('policies/', views.PolicyListView.as_view(), name='policy-list'),
    path('policies/search/', views.PolicySearchView.as_view(), name='policy-search'),
    path('policies/<int:pk>/', views.PolicyDetailView.as_view(), name='policy-detail'),
    path('policies/stats/', views.policy_stats_view, name='policy-stats'),
    path('policies/bulk-delete/', views.bulk_delete_policies, name='policy-bulk-delete'),
]
