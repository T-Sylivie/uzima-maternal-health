from django.db import models
from patients.models import Patient
from accounts.models import CHWProfile


class VisitLog(models.Model):
    class Outcome(models.TextChoices):
        ATTENDED = 'ATTENDED', 'Attended'
        MISSED = 'MISSED', 'Missed'
        DANGER_SIGNS = 'DANGER_SIGNS', 'Danger Signs Noted'

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='visit_logs')
    visit_date = models.DateField()
    outcome = models.CharField(max_length=20, choices=Outcome.choices)
    chw = models.ForeignKey(CHWProfile, on_delete=models.PROTECT, related_name='visit_logs')

    def __str__(self):
        return f'{self.patient.name} - {self.visit_date} - {self.outcome}'


class DangerSign(models.Model):
    visit_log = models.ForeignKey(VisitLog, on_delete=models.CASCADE, related_name='danger_signs')
    sign_type = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.sign_type} - {self.visit_log.patient.name}'