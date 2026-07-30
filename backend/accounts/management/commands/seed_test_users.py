from django.core.management.base import BaseCommand
from accounts.models import User, CHWProfile, NurseProfile, DistrictOfficerProfile


class Command(BaseCommand):
    help = 'Seeds test accounts matching local development setup'

    def handle(self, *args, **options):
        accounts_to_create = [
            {
                'username': 'chw_test', 'password': 'testpass123', 'role': User.Role.CHW,
                'profile': CHWProfile, 'profile_fields': {'village_cell': 'Kimisagara', 'health_centre_id': 'HC-001'}
            },
            {
                'username': 'chw_test2', 'password': 'testpass123', 'role': User.Role.CHW,
                'profile': CHWProfile, 'profile_fields': {'village_cell': 'Nyamirambo', 'health_centre_id': 'HC-002'}
            },
            {
                'username': 'nurse_test', 'password': 'testpass123', 'role': User.Role.NURSE,
                'profile': NurseProfile, 'profile_fields': {'catchment_area': 'Kimisagara Sector', 'health_centre_id': 'HC-001'}
            },
            {
                'username': 'officer_test', 'password': 'testpass123', 'role': User.Role.DISTRICT_OFFICER,
                'profile': DistrictOfficerProfile, 'profile_fields': {'district_id': 'DIST-001'}
            },
            {
                'username': 'sysadmin_test', 'password': 'testpass123', 'role': User.Role.SYSTEM_ADMIN,
                'profile': None, 'profile_fields': {}
            },
        ]

        for account in accounts_to_create:
            if User.objects.filter(username=account['username']).exists():
                self.stdout.write(f"Skipped (already exists): {account['username']}")
                continue

            user = User.objects.create_user(
                username=account['username'],
                password=account['password'],
                role=account['role'],
            )

            if account['profile']:
                account['profile'].objects.create(user=user, **account['profile_fields'])

            self.stdout.write(self.style.SUCCESS(f"Created: {account['username']}"))

        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser(username='admin', password='ChangeThisPassword123', email='admin@uzima.local')
            self.stdout.write(self.style.SUCCESS("Created superuser: admin"))
        else:
            self.stdout.write("Superuser already exists, skipped.")