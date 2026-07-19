from django.db import models
from accounts.models import CHWProfile


class Patient(models.Model):
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    village = models.CharField(max_length=100)
    lmp_date = models.DateField()
    chw = models.ForeignKey(CHWProfile, on_delete=models.PROTECT, related_name='patients')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name} - {self.village}'