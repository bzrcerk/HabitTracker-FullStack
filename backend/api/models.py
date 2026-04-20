from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import date

class Category(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, blank=True, default=' ')
    color = models.CharField(max_length=20, default='#4CAF50')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = 'Categories'

class Habit(models.Model):
    REPEAT_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='habits')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    repeat_type = models.CharField(max_length=20, choices=REPEAT_CHOICES, default='daily')
    target_days_per_week = models.IntegerField(default=7, validators=[MinValueValidator(1), MaxValueValidator(7)])
    week_days = models.JSONField(default=list, blank=True)
    start_date = models.DateField(default=date.today)
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
    class Meta:
        ordering = ['-created_at']

class HabitLog(models.Model):
    STATUS_CHOICES = [
        ('done', 'Done'),
        ('missed', 'Missed'),
    ]
    
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='logs')
    completed_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='done')
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['habit', 'completed_date']
        ordering = ['-completed_date']
    
    def __str__(self):
        return f"{self.habit.title} - {self.completed_date} ({self.status})"

class Reminder(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='reminders')
    time = models.TimeField(default='09:00')
    message = models.CharField(max_length=200, blank=True)
    is_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Reminder for {self.habit.title} at {self.time}"

class Todo(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todos')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='todos')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
    class Meta:
        ordering = ['-priority', 'due_date']