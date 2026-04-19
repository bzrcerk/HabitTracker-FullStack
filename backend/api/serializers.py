from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Habit, HabitLog, Reminder, Todo

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

class TodoSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Todo
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

class HabitSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Habit
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

class HabitLogSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    habit_id = serializers.IntegerField()
    completed_date = serializers.DateField()
    status = serializers.ChoiceField(choices=['done', 'missed'], default='done')
    note = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)
    
    def create(self, validated_data):
        return HabitLog.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.completed_date = validated_data.get('completed_date', instance.completed_date)
        instance.status = validated_data.get('status', instance.status)
        instance.note = validated_data.get('note', instance.note)
        instance.save()
        return instance

class HabitStatsSerializer(serializers.Serializer):
    habit_id = serializers.IntegerField()
    habit_title = serializers.CharField()
    total_done = serializers.IntegerField()
    total_missed = serializers.IntegerField()
    current_streak = serializers.IntegerField()
    longest_streak = serializers.IntegerField()
    success_rate = serializers.FloatField()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords don't match")
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Username already exists")
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email already exists")
        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
    
