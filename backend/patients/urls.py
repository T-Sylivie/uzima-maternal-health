from django.urls import path
from .views import PatientListCreateView, NursePatientListView

urlpatterns = [
    path('', PatientListCreateView.as_view(), name='patient-list-create'),
    path('nurse/', NursePatientListView.as_view(), name='nurse-patient-list'),
]