from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        CHW = 'CHW', 'Community Health Worker'
        NURSE = 'NURSE', 'Nurse'
        DISTRICT_OFFICER = 'DISTRICT_OFFICER', 'District Health Officer'
        SYSTEM_ADMIN = 'SYSTEM_ADMIN', 'System Administrator'

    role = models.CharField(max_length=20, choices=Role.choices)

    def __str__(self):
        return f'{self.username} ({self.role})'


class CHWProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='chw_profile')
    village_cell = models.CharField(max_length=100)
    health_centre_id = models.CharField(max_length=50)

    def __str__(self):
        return f'CHW: {self.user.username} - {self.village_cell}'


class NurseProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='nurse_profile')
    catchment_area = models.CharField(max_length=100)
    health_centre_id = models.CharField(max_length=50)

    def __str__(self):
        return f'Nurse: {self.user.username} - {self.catchment_area}'


class DistrictOfficerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='district_officer_profile')
    district_id = models.CharField(max_length=50)

    def __str__(self):
        return f'District Officer: {self.user.username} - {self.district_id}'