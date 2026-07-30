from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsCHW, IsNurse
from .models import Patient
from .serializers import PatientSerializer, NursePatientSerializer


class PatientListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated, IsCHW]

    def get_queryset(self):
        chw_profile = self.request.user.chw_profile
        return Patient.objects.filter(chw__village_cell=chw_profile.village_cell)

    def perform_create(self, serializer):
        serializer.save()


class NursePatientListView(generics.ListAPIView):
    serializer_class = NursePatientSerializer
    permission_classes = [IsAuthenticated, IsNurse]

    def get_queryset(self):
        nurse_profile = self.request.user.nurse_profile
        return Patient.objects.filter(
            chw__health_centre_id=nurse_profile.health_centre_id
        ).select_related('anc_schedule', 'chw__user')