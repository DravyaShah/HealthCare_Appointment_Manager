from django.db import models

class MedicalArticle(models.Model):
    title = models.CharField(max_length=500)
    source = models.CharField(max_length=200)
    link = models.URLField(unique=True)
    published_date = models.DateTimeField(null=True, blank=True)
    thumbnail_url = models.URLField(max_length=1000, null=True, blank=True)
    short_description = models.TextField(null=True, blank=True)
    category = models.CharField(max_length=100, null=True, blank=True)

    # AI Enhancements
    executive_summary = models.TextField(null=True, blank=True)
    key_findings = models.TextField(null=True, blank=True)
    why_this_matters = models.TextField(null=True, blank=True)
    doctor_perspective = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class HealthAIChat(models.Model):
    patient = models.ForeignKey('patients.PatientProfile', on_delete=models.CASCADE, related_name='ai_chats')
    role = models.CharField(max_length=20) # 'user' or 'assistant'
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']
