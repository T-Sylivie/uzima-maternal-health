from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsNurse
from .models import PatientNote
from .serializers import PatientNoteSerializer


class PatientNoteListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientNoteSerializer
    permission_classes = [IsAuthenticated, IsNurse]

    def get_queryset(self):
        patient_id = self.request.query_params.get('patient')
        queryset = PatientNote.objects.all()
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        return queryset