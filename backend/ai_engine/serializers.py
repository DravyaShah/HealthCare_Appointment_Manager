from rest_framework import serializers
from .models import MedicalArticle

class MedicalArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalArticle
        fields = '__all__'
