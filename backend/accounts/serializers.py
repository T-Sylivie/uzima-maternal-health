from rest_framework import serializers
from .models import User, CHWProfile, NurseProfile, DistrictOfficerProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']
        read_only_fields = ['id', 'role']


class CHWProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = CHWProfile
        fields = ['user', 'village_cell', 'health_centre_id']


class NurseProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = NurseProfile
        fields = ['user', 'catchment_area', 'health_centre_id']


class DistrictOfficerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = DistrictOfficerProfile
        fields = ['user', 'district_id']