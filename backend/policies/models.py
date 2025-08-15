from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid


class Policy(models.Model):
    """Policy document model"""
    
    # Basic information
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='policies')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    # File information
    file = models.FileField(upload_to='policies/')
    file_name = models.CharField(max_length=255)
    file_size = models.BigIntegerField()  # Size in bytes
    file_type = models.CharField(max_length=10)  # pdf, docx, txt
    
    # Extracted content
    extracted_text = models.TextField(blank=True, null=True)
    text_length = models.IntegerField(default=0)
    
    # Metadata
    upload_date = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    is_processed = models.BooleanField(default=False)
    
    # Tags and categories
    tags = models.JSONField(default=list, blank=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    
    # Status
    status = models.CharField(max_length=20, choices=[
        ('uploaded', 'Uploaded'),
        ('processing', 'Processing'),
        ('processed', 'Processed'),
        ('error', 'Error'),
    ], default='uploaded')
    
    # Error handling
    error_message = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.title} - {self.user.email}"
    
    def get_file_size_mb(self):
        """Return file size in MB"""
        return round(self.file_size / (1024 * 1024), 2)
    
    def get_text_preview(self, length=200):
        """Return a preview of the extracted text"""
        if self.extracted_text:
            return self.extracted_text[:length] + "..." if len(self.extracted_text) > length else self.extracted_text
        return "No text extracted yet."
    
    class Meta:
        db_table = 'policies'
        verbose_name = 'Policy'
        verbose_name_plural = 'Policies'
        ordering = ['-upload_date']


class PolicySection(models.Model):
    """Individual sections of a policy document"""
    
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE, related_name='sections')
    section_title = models.CharField(max_length=255)
    section_content = models.TextField()
    section_number = models.IntegerField()
    page_number = models.IntegerField(blank=True, null=True)
    
    # AI analysis
    summary = models.TextField(blank=True, null=True)
    keywords = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.policy.title} - Section {self.section_number}: {self.section_title}"
    
    class Meta:
        db_table = 'policy_sections'
        verbose_name = 'Policy Section'
        verbose_name_plural = 'Policy Sections'
        ordering = ['section_number']


class PolicyComparison(models.Model):
    """Model for storing policy comparisons"""
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comparisons')
    policies = models.ManyToManyField(Policy, related_name='comparisons')
    comparison_type = models.CharField(max_length=20, choices=[
        ('coverage', 'Coverage Comparison'),
        ('costs', 'Costs Comparison'),
        ('features', 'Features Comparison'),
        ('general', 'General Comparison'),
    ])
    
    # AI analysis results
    similarities = models.JSONField(default=dict, blank=True)
    differences = models.JSONField(default=dict, blank=True)
    recommendation = models.TextField(blank=True, null=True)
    comparison_score = models.FloatField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        policy_names = ", ".join([p.title for p in self.policies.all()[:3]])
        return f"Comparison: {policy_names}"
    
    class Meta:
        db_table = 'policy_comparisons'
        verbose_name = 'Policy Comparison'
        verbose_name_plural = 'Policy Comparisons'
        ordering = ['-created_at']


class PolicyTag(models.Model):
    """Tags for categorizing policies"""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'policy_tags'
        verbose_name = 'Policy Tag'
        verbose_name_plural = 'Policy Tags'
        ordering = ['name']
