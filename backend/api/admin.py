from django.contrib import admin
from .models import Category, Habit, HabitLog, Reminder

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'created_at']
    list_filter = ['user']
    search_fields = ['name']

@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'category', 'repeat_type', 'is_active', 'created_at']
    list_filter = ['repeat_type', 'is_active', 'user', 'category']
    search_fields = ['title', 'user__username']

@admin.register(HabitLog)
class HabitLogAdmin(admin.ModelAdmin):
    list_display = ['habit', 'completed_date', 'status', 'created_at']
    list_filter = ['status', 'completed_date']
    search_fields = ['habit__title']

@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ['habit', 'time', 'is_enabled']
    list_filter = ['is_enabled']
