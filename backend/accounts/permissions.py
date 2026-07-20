from rest_framework.permissions import BasePermission


class IsCHW(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.role == request.user.Role.CHW)


class IsNurse(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.role == request.user.Role.NURSE)


class IsDistrictOfficer(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.role == request.user.Role.DISTRICT_OFFICER)


class IsSystemAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.role == request.user.Role.SYSTEM_ADMIN)