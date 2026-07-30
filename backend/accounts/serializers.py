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


class CreateUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.Role.choices)
    village_cell = serializers.CharField(required=False, allow_blank=True)
    catchment_area = serializers.CharField(required=False, allow_blank=True)
    health_centre_id = serializers.CharField(required=False, allow_blank=True)
    district_id = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        role = validated_data['role']
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            role=role,
        )

        if role == User.Role.CHW:
            CHWProfile.objects.create(
                user=user,
                village_cell=validated_data.get('village_cell', ''),
                health_centre_id=validated_data.get('health_centre_id', ''),
            )
        elif role == User.Role.NURSE:
            NurseProfile.objects.create(
                user=user,
                catchment_area=validated_data.get('catchment_area', ''),
                health_centre_id=validated_data.get('health_centre_id', ''),
            )
        elif role == User.Role.DISTRICT_OFFICER:
            DistrictOfficerProfile.objects.create(
                user=user,
                district_id=validated_data.get('district_id', ''),
            )

        return user