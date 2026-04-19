from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from datetime import date, timedelta
from .models import Todo
from .serializers import TodoSerializer
from .models import Category, Habit, HabitLog
from .serializers import (
    CategorySerializer, HabitSerializer, HabitLogSerializer,
    HabitStatsSerializer, UserSerializer, RegisterSerializer
)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'user': UserSerializer(user).data,
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def habit_stats(request, habit_id):
    habit = get_object_or_404(Habit, id=habit_id, user=request.user)
    logs = HabitLog.objects.filter(habit=habit)
    
    total_done = logs.filter(status='done').count()
    total_missed = logs.filter(status='missed').count()
    total = total_done + total_missed
    success_rate = (total_done / total * 100) if total > 0 else 0
    
    today = date.today()
    streak = 0
    check_date = today
    while HabitLog.objects.filter(habit=habit, completed_date=check_date, status='done').exists():
        streak += 1
        check_date -= timedelta(days=1)
    
    longest_streak = 0
    current = 0
    prev_date = None
    for log in logs.filter(status='done').order_by('completed_date'):
        if prev_date and (log.completed_date - prev_date).days == 1:
            current += 1
        else:
            current = 1
        longest_streak = max(longest_streak, current)
        prev_date = log.completed_date
    
    serializer = HabitStatsSerializer({
        'habit_id': habit.id,
        'habit_title': habit.title,
        'total_done': total_done,
        'total_missed': total_missed,
        'current_streak': streak,
        'longest_streak': longest_streak,
        'success_rate': round(success_rate, 2)
    })
    return Response(serializer.data)

class TodoListCreateView(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Todo.objects.filter(user=self.request.user)
        
        status = self.request.query_params.get('status', None)
        if status == 'active':
            queryset = queryset.filter(is_completed=False)
        elif status == 'completed':
            queryset = queryset.filter(is_completed=True)
        
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category_id=category)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TodoDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)
class HabitListCreateView(generics.ListCreateAPIView):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class HabitDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user)

class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

class HabitLogListCreateView(generics.ListCreateAPIView):
    serializer_class = HabitLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return HabitLog.objects.filter(habit__user=self.request.user)
    
    def perform_create(self, serializer):
        habit = get_object_or_404(Habit, id=serializer.validated_data['habit_id'], user=self.request.user)
        serializer.save(habit=habit)

class HabitLogDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HabitLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return HabitLog.objects.filter(habit__user=self.request.user)

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        today = date.today()
        week_start = today - timedelta(days=today.weekday())
        
        habits = Habit.objects.filter(user=request.user, is_active=True)
        total_habits = habits.count()
        
        today_logs = HabitLog.objects.filter(habit__user=request.user, completed_date=today, status='done')
        completed_today = today_logs.count()
        
        week_logs = HabitLog.objects.filter(habit__user=request.user, completed_date__gte=week_start, status='done')
        weekly_completions = week_logs.count()
        
        streak = 0
        check_date = today
        while HabitLog.objects.filter(habit__user=request.user, completed_date=check_date, status='done').exists():
            streak += 1
            check_date -= timedelta(days=1)
        
        categories = Category.objects.filter(user=request.user)
        
        return Response({
            'total_habits': total_habits,
            'completed_today': completed_today,
            'weekly_completions': weekly_completions,
            'current_streak': streak,
            'categories': CategorySerializer(categories, many=True).data,
            'recent_habits': HabitSerializer(habits[:5], many=True).data
        }) 
