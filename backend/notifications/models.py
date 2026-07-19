from django.db import models
from patients.models import Patient


class SMSLog(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        SENT = 'SENT', 'Sent'
        DELIVERED = 'DELIVERED', 'Delivered'
        FAILED = 'FAILED', 'Failed'

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='sms_logs')
    message_content = models.CharField(max_length=160)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    sent_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'{self.patient.name} - {self.status}'