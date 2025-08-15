from django.contrib import admin
from .models import Policy, PolicySection, PolicyComparison, PolicyTag


@admin.register(Policy)
class PolicyAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'file_type', 'file_size', 'status', 'is_processed', 'upload_date')
    list_filter = ('status', 'file_type', 'is_processed', 'upload_date', 'category')
    search_fields = ('title', 'description', 'user__email', 'extracted_text')
    ordering = ('-upload_date',)
    readonly_fields = ('id', 'upload_date', 'last_modified', 'text_length')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'user', 'title', 'description', 'category', 'tags')
        }),
        ('File Information', {
            'fields': ('file', 'file_name', 'file_size', 'file_type', 'status')
        }),
        ('Content', {
            'fields': ('extracted_text', 'text_length', 'is_processed', 'error_message')
        }),
        ('Timestamps', {
            'fields': ('upload_date', 'last_modified')
        }),
    )


@admin.register(PolicySection)
class PolicySectionAdmin(admin.ModelAdmin):
    list_display = ('policy', 'section_title', 'section_number', 'page_number', 'created_at')
    list_filter = ('section_number', 'created_at')
    search_fields = ('section_title', 'section_content', 'policy__title')
    ordering = ('policy', 'section_number')
    readonly_fields = ('created_at',)


@admin.register(PolicyComparison)
class PolicyComparisonAdmin(admin.ModelAdmin):
    list_display = ('user', 'comparison_type', 'policies_count', 'comparison_score', 'created_at')
    list_filter = ('comparison_type', 'created_at')
    search_fields = ('user__email', 'recommendation')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    def policies_count(self, obj):
        return obj.policies.count()
    policies_count.short_description = 'Policies Count'


@admin.register(PolicyTag)
class PolicyTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'color', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)
    readonly_fields = ('created_at',)
