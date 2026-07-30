from rest_framework import serializers
from .models import PatientNote, VisitLog, DangerSign


class PatientNoteSerializer(serializers.ModelSerializer):
    nurse_name = serializers.CharField(source='nurse.user.username', read_only=True)

    class Meta:
        model = PatientNote
        fields = ['id', 'patient', 'nurse_name', 'text', 'created_at']
        read_only_fields = ['id', 'nurse_name', 'created_at']

    def create(self, validated_data):
        nurse_profile = self.context['request'].user.nurse_profile
        return PatientNote.objects.create(nurse=nurse_profile, **validated_data)

class DangerSignSerializer(serializers.ModelSerializer):
    class Meta:
        model = DangerSign
        fields = ['id', 'sign_type']


class VisitLogSerializer(serializers.ModelSerializer):
    danger_signs = DangerSignSerializer(many=True, required=False)

    class Meta:
        model = VisitLog
        fields = ['id', 'patient', 'visit_date', 'outcome', 'chw', 'danger_signs']
        read_only_fields = ['id', 'chw']

    def create(self, validated_data):
        danger_signs_data = validated_data.pop('danger_signs', [])
        chw_profile = self.context['request'].user.chw_profile
        visit_log = VisitLog.objects.create(chw=chw_profile, **validated_data)

        for sign_data in danger_signs_data:
            DangerSign.objects.create(visit_log=visit_log, **sign_data)

        return visit_log