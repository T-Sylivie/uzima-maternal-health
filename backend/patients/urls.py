from django.urls import path
from .views import PatientListCreateView, NursePatientListView, DistrictReportView

urlpatterns = [
    path('', PatientListCreateView.as_view(), name='patient-list-create'),
    path('nurse/', NursePatientListView.as_view(), name='nurse-patient-list'),
    path('district-report/', DistrictReportView.as_view(), name='district-report'),
]