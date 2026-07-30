from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsNurse, IsCHW
from .models import PatientNote, VisitLog
from .serializers import PatientNoteSerializer, VisitLogSerializer


class PatientNoteListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientNoteSerializer
    permission_classes = [IsAuthenticated, IsNurse]

    def get_queryset(self):
        patient_id = self.request.query_params.get('patient')
        queryset = PatientNote.objects.all()
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        return queryset

class VisitLogListCreateView(generics.ListCreateAPIView):
    serializer_class = VisitLogSerializer
    permission_classes = [IsAuthenticated, IsCHW]

    def get_queryset(self):
        chw_profile = self.request.user.chw_profile
        return VisitLog.objects.filter(chw__village_cell=chw_profile.village_cell)

    def perform_create(self, serializer):
        serializer.save()