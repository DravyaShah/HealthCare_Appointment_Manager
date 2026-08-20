from django.urls import path
from ai_engine.views import GenerateInsightAPI, MedicalNewsAPIView, AnalyzeNewsAPIView, ChatbotAPIView

urlpatterns=[
    path('appointment/<int:pk>/generate-insight/',GenerateInsightAPI.as_view(),name='generate_insight'),
    path('news/', MedicalNewsAPIView.as_view(), name='medical_news'),
    path('news/<int:pk>/analyze/', AnalyzeNewsAPIView.as_view(), name='analyze_news'),
    path('chat/', ChatbotAPIView.as_view(), name='chatbot'),
]