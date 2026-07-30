from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Q
from accounts.permissions import IsCHW, IsNurse, IsDistrictOfficer
from .models import Patient
from .serializers import PatientSerializer, NursePatientSerializer
from visits.models import VisitLog


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


class DistrictReportView(APIView):
    permission_classes = [IsAuthenticated, IsDistrictOfficer]

    def get(self, request):
        patients = Patient.objects.all()

        village_summary = (
            patients.values('village')
            .annotate(
                total_patients=Count('id'),
                flagged_count=Count(
                    'id',
                    filter=Q(visit_logs__outcome=VisitLog.Outcome.DANGER_SIGNS),
                    distinct=True,
                ),
            )
            .order_by('village')
        )

        return Response(list(village_summary))