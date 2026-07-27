from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsCHW
from .models import Patient
from .serializers import PatientSerializer


class PatientListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated, IsCHW]

    def get_queryset(self):
        chw_profile = self.request.user.chw_profile
        return Patient.objects.filter(chw__village_cell=chw_profile.village_cell)

    def perform_create(self, serializer):
        serializer.save()