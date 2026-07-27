from rest_framework import serializers
from .models import Patient
from schedules.models import ANCSchedule
from schedules.utils import calculate_anc_visit_dates


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