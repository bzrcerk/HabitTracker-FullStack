from datetime import date, timedelta
from .models import HabitLog

def calculate_streak(habit):
    today = date.today()
    streak = 0
    check_date = today
    
    while HabitLog.objects.filter(habit=habit, completed_date=check_date, status='done').exists():
        streak += 1
        check_date -= timedelta(days=1)
    
    return streak

def calculate_global_streak(user):
    today = date.today()
    streak = 0
    check_date = today
    
    while HabitLog.objects.filter(habit__user=user, completed_date=check_date, status='done').exists():
        streak += 1
        check_date -= timedelta(days=1)
    
    return streak 
