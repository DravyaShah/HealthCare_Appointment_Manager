from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from appointments.models import Appointment
from reports.models import Report
from prescriptions.models import Prescription

from ai_engine.services.pdf_service import extract_pdf_text
from ai_engine.services.gemini_service import generate_health_insight, generate_news_insight
from ai_engine.services.chat_service import generate_chat_response
from ai_engine.models import MedicalArticle, HealthAIChat
from ai_engine.serializers import MedicalArticleSerializer
from ai_engine.services.news_service import fetch_latest_news


class GenerateInsightAPI(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        if request.user.role == 'doctor':
            appointment = get_object_or_404(Appointment.objects.filter(doctor=request.user.doctor_profile),pk=pk)

        elif request.user.role == 'patient':
            appointment = get_object_or_404(Appointment.objects.filter(patient=request.user.patient_profile),pk=pk)

        # Validate prescription and report exist before proceeding
        if not Prescription.objects.filter(appointment=appointment).exists():
            return Response(
                {"error": "Create a prescription before generating insights."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not Report.objects.filter(appointment=appointment).exists():
            return Response(
                {"error": "Upload a medical report first."},
                status=status.HTTP_400_BAD_REQUEST
            )

        #Fetching the prescription and report related to the specified appointment        
        prescription = get_object_or_404(Prescription,appointment=appointment)
        report = get_object_or_404(Report,appointment=appointment)

        #Extracting text from the uploaded medical report PDF
        report_text = ""
        try:
            if str(report.report_file.path).lower().endswith(".pdf"):
                report_text = extract_pdf_text(report.report_file.path)
            else:
                report_text = f"[Non-PDF file uploaded: {report.report_file.name}. Ensure it is referenced but cannot be parsed for text.]"
        except Exception as e:
            print(f"Error parsing PDF: {e}")
            report_text = "[Error parsing report file. The file may be corrupt or not a valid PDF.]"
        
        print("REPORT TEXT:")
        print(repr(report_text))

        insight = generate_health_insight(appointment.reason,prescription.medicines,prescription.diagnosis,prescription.instructions,report_text)

        return Response(insight,status=200)

class MedicalNewsAPIView(APIView):
    permission_classes = [AllowAny]
    # Public endpoint, no auth required so public blog can use it
    def get(self, request):
        category = request.query_params.get('category')
        
        # Optionally trigger a background fetch if too few articles (simplified for now)
        if MedicalArticle.objects.count() == 0:
            fetch_latest_news()

        queryset = MedicalArticle.objects.all().order_by('-published_date')
        if category and category != 'All':
            queryset = queryset.filter(category__icontains=category)
            
        serializer = MedicalArticleSerializer(queryset[:20], many=True)
        return Response(serializer.data, status=200)

class AnalyzeNewsAPIView(APIView):
    permission_classes = [AllowAny]
    # Public endpoint
    def post(self, request, pk):
        article = get_object_or_404(MedicalArticle, pk=pk)
        
        if not article.executive_summary:
            # Generate if not exists
            insight = generate_news_insight(article.title, article.short_description)
            article.executive_summary = insight.get("executive_summary", "")
            article.key_findings = "\n".join(insight.get("key_findings", []))
            article.why_this_matters = insight.get("why_this_matters", "")
            article.doctor_perspective = insight.get("doctor_perspective", "")
            article.save()
            
        return Response({
            "executive_summary": article.executive_summary,
            "key_findings": article.key_findings.split("\n") if article.key_findings else [],
            "why_this_matters": article.why_this_matters,
            "doctor_perspective": article.doctor_perspective
        }, status=200)

class ChatbotAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'patient':
            return Response({"error": "Only patients can access chat history."}, status=status.HTTP_403_FORBIDDEN)
        
        chats = HealthAIChat.objects.filter(patient=request.user.patient_profile).order_by('timestamp')
        data = [{"role": chat.role, "text": chat.message} for chat in chats]
        return Response(data, status=200)

    def post(self, request):
        question = request.data.get("question")
        if not question:
            return Response({"error": "Question is required."}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.role != 'patient':
            return Response({"error": "Only patients can use the health assistant."}, status=status.HTTP_403_FORBIDDEN)

        patient = request.user.patient_profile

        # Save user message
        HealthAIChat.objects.create(patient=patient, role="user", message=question)

        context_data = ""
        appointments = Appointment.objects.filter(patient=patient).order_by('-appointment_date')[:5]
        for appt in appointments:
            context_data += f"\nAppointment on {appt.appointment_date}:\nReason: {appt.reason}\n"
            prescription = Prescription.objects.filter(appointment=appt).first()
            if prescription:
                context_data += f"Diagnosis: {prescription.diagnosis}\nMedicines: {prescription.medicines}\nInstructions: {prescription.instructions}\n"
            
            report = Report.objects.filter(appointment=appt).first()
            if report:
                context_data += f"Report File: {report.report_file.name}\n"
                try:
                    if str(report.report_file.path).lower().endswith(".pdf"):
                        text = extract_pdf_text(report.report_file.path)
                        context_data += f"Report Content Snippet: {text[:1000]}...\n"
                except:
                    pass
        
        if not context_data.strip():
            context_data = "No medical records found for this patient. Advise them to upload reports or book an appointment."

        # Fetch recent chat history
        recent_chats = HealthAIChat.objects.filter(patient=patient).order_by('-timestamp')[:10]
        history_msgs = []
        for chat in reversed(recent_chats):
            history_msgs.append({'role': chat.role, 'message': chat.message})

        response_text = generate_chat_response(question, context_data, history_msgs)

        # Save AI message
        HealthAIChat.objects.create(patient=patient, role="assistant", message=response_text)

        return Response({"answer": response_text}, status=200)