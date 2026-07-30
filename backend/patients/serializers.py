from rest_framework import serializers
from .models import Patient
from schedules.models import ANCSchedule
from schedules.utils import calculate_anc_visit_dates
from visits.models import VisitLog


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'name', 'phone_number', 'village', 'lmp_date', 'chw', 'created_at']
        read_only_fields = ['id', 'chw', 'created_at']

    def create(self, validated_data):
        chw_profile = self.context['request'].user.chw_profile
        patient = Patient.objects.create(chw=chw_profile, **validated_data)

        visit_dates = calculate_anc_visit_dates(patient.lmp_date)
        ANCSchedule.objects.create(patient=patient, **visit_dates)

        return patient

    
class NursePatientSerializer(serializers.ModelSerializer):
    visit_1_date = serializers.DateField(source='anc_schedule.visit_1_date', read_only=True)
    visit_2_date = serializers.DateField(source='anc_schedule.visit_2_date', read_only=True)
    visit_3_date = serializers.DateField(source='anc_schedule.visit_3_date', read_only=True)
    visit_4_date = serializers.DateField(source='anc_schedule.visit_4_date', read_only=True)
    chw_name = serializers.CharField(source='chw.user.username', read_only=True)
    is_flagged = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            'id', 'name', 'phone_number', 'village', 'lmp_date',
            'visit_1_date', 'visit_2_date', 'visit_3_date', 'visit_4_date',
            'chw_name', 'created_at', 'is_flagged',
        ]

    def get_is_flagged(self, obj):
        return VisitLog.objects.filter(
            patient=obj, outcome=VisitLog.Outcome.DANGER_SIGNS
        ).exists()