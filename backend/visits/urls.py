from django.urls import path
from .views import PatientNoteListCreateView, VisitLogListCreateView

urlpatterns = [
    path('notes/', PatientNoteListCreateView.as_view(), name='patient-notes'),
    path('logs/', VisitLogListCreateView.as_view(), name='visit-logs'),
]