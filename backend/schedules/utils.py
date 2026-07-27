from datetime import timedelta


def calculate_anc_visit_dates(lmp_date):
    return {
        'visit_1_date': lmp_date + timedelta(weeks=12),
        'visit_2_date': lmp_date + timedelta(weeks=20),
        'visit_3_date': lmp_date + timedelta(weeks=28),
        'visit_4_date': lmp_date + timedelta(weeks=36),
    }