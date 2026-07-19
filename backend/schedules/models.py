from django.db import models
from patients.models import Patient


class ANCSchedule(models.Model):
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, related_name='anc_schedule')
    visit_1_date = models.DateField()
    visit_2_date = models.DateField()
    visit_3_date = models.DateField()
    visit_4_date = models.DateField()

    def __str__(self):
        return f'ANC Schedule - {self.patient.name}'