from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('logout/', views.logout, name='logout'),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('habits/', views.HabitListCreateView.as_view(), name='habit-list'),
    path('habits/<int:pk>/', views.HabitDetailView.as_view(), name='habit-detail'),
    path('habits/<int:habit_id>/stats/', views.habit_stats, name='habit-stats'),
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('habit-logs/', views.HabitLogListCreateView.as_view(), name='habit-log-list'),
    path('habit-logs/<int:pk>/', views.HabitLogDetailView.as_view(), name='habit-log-detail'),
    path('todos/', views.TodoListCreateView.as_view(), name='todo-list'),
    path('todos/<int:pk>/', views.TodoDetailView.as_view(), name='todo-detail'),
]
