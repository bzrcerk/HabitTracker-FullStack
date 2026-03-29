# HabitTracker-FullStack
HabitFlow — Smart Habit Tracker

Team:
  1. Li Nikita
  2. Aitore Zhunuskul
  3. Aitali Abdurazzakov

HabitFlow is a fullstack web application for tracking daily habits, building streaks, and staying consistent.
Users can create habits, log daily progress, earn XP, and get penalties for missed days.

Tech Stack

Frontend: Angular
Backend: Django + Django REST Framework
Auth: JWT (token-based authentication)
Database: PostgreSQL

⸻

Project Structure

project/
  frontend/   # Angular app
  backend/    # Django DRF API

⸻

⚙️ Setup

Backend

cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


⸻

Frontend

cd frontend
npm install
ng serve
