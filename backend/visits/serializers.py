from rest_framework import serializers
from .models import PatientNote


class PatientNoteSerializer(serializers.ModelSerializer):
    nurse_name = serializers.CharField(source='nurse.user.username', read_only=True)

    class Meta:
        model = PatientNote
        fields = ['id', 'patient', 'nurse_name', 'text', 'created_at']
        read_only_fields = ['id', 'nurse_name', 'created_at']

    def create(self, validated_data):
        nurse_profile = self.context['request'].user.nurse_profile
        return PatientNote.objects.create(nurse=nurse_profile, **validated_data)