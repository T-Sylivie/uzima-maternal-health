from django.urls import path
from .views import PatientNoteListCreateView

urlpatterns = [
    path('notes/', PatientNoteListCreateView.as_view(), name='patient-notes'),
]