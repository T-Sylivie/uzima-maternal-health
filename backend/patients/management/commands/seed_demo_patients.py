from django.core.management.base import BaseCommand
from django.db import transaction
from datetime import date
from accounts.models import User, CHWProfile
from patients.models import Patient
from schedules.models import ANCSchedule
from schedules.utils import calculate_anc_visit_dates
from visits.models import VisitLog, DangerSign


class Command(BaseCommand):
    help = 'Seeds demo patients across multiple villages for presentation purposes'

    def handle(self, *args, **options):
        villages = [
            'Kimisagara', 'Nyamirambo', 'Gisozi', 'Kacyiru', 'Remera',
            'Kicukiro', 'Nyarugenge', 'Kabuga', 'Rusororo', 'Bumbogo',
        ]

        first_names = ['Uwase', 'Mukamana', 'Niyonsaba', 'Ingabire', 'Umutoni',
                       'Mukandayisenga', 'Uwimana', 'Nyirahabimana', 'Mukamurenzi', 'Uwizeyimana']
        last_names = ['Immaculee', 'Aline', 'Claudine', 'Solange', 'Grace',
                      'Vestine', 'Beatrice', 'Josiane', 'Odette', 'Chantal']

        counter = 0
        created_patients = []

        with transaction.atomic():
            for village in villages:
                username = f"chw_{village.lower()}"

                if User.objects.filter(username=username).exists():
                    chw = CHWProfile.objects.get(user__username=username)
                    self.stdout.write(f"CHW already exists for {village}, reusing")
                else:
                    user = User.objects.create_user(username=username, password='testpass123', role=User.Role.CHW)
                    chw = CHWProfile.objects.create(user=user, village_cell=village, health_centre_id='HC-001')
                    self.stdout.write(f"Created CHW for {village}")

                name = f"{first_names[counter % len(first_names)]} {last_names[counter % len(last_names)]}"
                phone = f"+2507881{counter:05d}"
                lmp_month = 2 + (counter % 5)
                lmp_day = 5 + (counter % 20)
                lmp_date = date(2026, lmp_month, lmp_day)

                if Patient.objects.filter(name=name, village=village).exists():
                    self.stdout.write(f"Skipped (already exists): {name} - {village}")
                    counter += 1
                    continue

                patient = Patient.objects.create(
                    chw=chw, name=name, phone_number=phone, village=village, lmp_date=lmp_date
                )
                visit_dates = calculate_anc_visit_dates(patient.lmp_date)
                ANCSchedule.objects.create(patient=patient, **visit_dates)
                created_patients.append(patient)

                if counter % 4 == 0:
                    visit = VisitLog.objects.create(
                        patient=patient, visit_date=date.today(),
                        outcome=VisitLog.Outcome.DANGER_SIGNS, chw=chw
                    )
                    DangerSign.objects.create(visit_log=visit, sign_type='Danger sign observed')
                    self.stdout.write(self.style.WARNING(f"Flagged high-risk: {name}"))

                self.stdout.write(self.style.SUCCESS(f"Created: {name} - {village}"))
                counter += 1

        self.stdout.write(self.style.SUCCESS(f"Done. {len(created_patients)} new patients created."))