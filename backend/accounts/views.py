from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CHWProfile, NurseProfile, DistrictOfficerProfile
from .serializers import (
    UserSerializer,
    CHWProfileSerializer,
    NurseProfileSerializer,
    DistrictOfficerProfileSerializer,
)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == user.Role.CHW:
            profile = CHWProfile.objects.filter(user=user).first()
            if profile:
                return Response(CHWProfileSerializer(profile).data)

        elif user.role == user.Role.NURSE:
            profile = NurseProfile.objects.filter(user=user).first()
            if profile:
                return Response(NurseProfileSerializer(profile).data)

        elif user.role == user.Role.DISTRICT_OFFICER:
            profile = DistrictOfficerProfile.objects.filter(user=user).first()
            if profile:
                return Response(DistrictOfficerProfileSerializer(profile).data)

        return Response(UserSerializer(user).data)