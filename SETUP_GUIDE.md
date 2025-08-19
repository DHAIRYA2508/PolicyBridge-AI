# 🚀 PolicyBridge AI - Complete Setup Guide

Welcome to PolicyBridge AI! This guide will help you get the full-stack application up and running.

## 🎯 What You'll Get

- **Django Backend**: RESTful API with JWT authentication, policy management, and AI integration
- **React Frontend**: Modern, responsive UI with real-time policy analysis
- **AI Features**: OpenAI-powered policy analysis, comparison, and chat
- **Database**: SQLite (easily upgradable to PostgreSQL/MySQL)

## 📋 Prerequisites

- **Python 3.8+** installed
- **Node.js 16+** and npm installed
- **Git** for cloning the repository
- **Google Gemini API Key** (for AI features)

## 🚀 Quick Start (One-Click Setup)

### Option 1: Windows Batch File
```bash
# Double-click this file or run from command line
start-full-stack.bat
```

### Option 2: PowerShell Script
```powershell
# Run from PowerShell
.\start-full-stack.ps1
```

### Option 3: Manual Setup
Follow the detailed steps below.

## 🔧 Detailed Setup

### Step 1: Backend Setup

```bash
cd backend

# 1. Create virtual environment
python -m venv venv

# 2. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
copy env_example.txt .env
# Edit .env with your OpenAI API key

# 5. Run migrations
python manage.py makemigrations
python manage.py migrate

# 6. Create superuser (optional)
python manage.py createsuperuser

# 7. Start the server
python manage.py runserver
```

**Backend will be available at:** `http://localhost:8000/`

### Step 2: Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create environment file
# Create .env file with:
REACT_APP_API_URL=http://localhost:8000/api

# 3. Start the development server
npm start
```

**Frontend will be available at:** `http://localhost:3000/`

## 🔑 Environment Configuration

### Backend (.env file in backend directory)

```env
# Django Configuration
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Gemini Configuration (Required for AI features)
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-1.5-pro

# Database Configuration (SQLite by default)
DATABASE_URL=sqlite:///db.sqlite3

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-here
JWT_ACCESS_TOKEN_EXPIRES=3600
JWT_REFRESH_TOKEN_EXPIRES=604800

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# File Upload Configuration
MAX_UPLOAD_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,docx,txt

# Logging Configuration
LOG_LEVEL=INFO
LOG_FILE=logs/django.log
```

### Frontend (.env file in frontend directory)

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api

# Optional: Customize other settings
REACT_APP_APP_NAME=PolicyBridge AI
REACT_APP_VERSION=1.0.0
```

## 🎮 First Time Usage

### 1. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin

### 2. Create Your First Account
1. Go to http://localhost:3000/signup
2. Fill in your details
3. Verify your account

### 3. Upload Your First Policy
1. Login to the application
2. Go to Upload Policy page
3. Drag & drop a PDF/DOCX file
4. Add policy metadata
5. Submit for AI analysis

### 4. Start AI Conversations
1. Select a policy from your dashboard
2. Click "Start Chat" or "Analyze with AI"
3. Ask questions about your policy
4. Get AI-powered insights and recommendations

## 🧪 Testing the Setup

### Backend Health Check
```bash
curl http://localhost:8000/api/users/stats/
```

### Frontend API Test
Open browser console and run:
```javascript
fetch('http://localhost:8000/api/users/stats/')
  .then(response => response.json())
  .then(data => console.log('Backend connected:', data))
  .catch(error => console.error('Backend connection failed:', error));
```

## 🔍 Troubleshooting

### Common Issues & Solutions

#### 1. Backend Won't Start
- **Port 8000 in use**: Change port in `backend/manage.py runserver 8001`
- **Missing dependencies**: Run `pip install -r requirements.txt`
- **Database errors**: Delete `db.sqlite3` and run migrations again

#### 2. Frontend Won't Start
- **Port 3000 in use**: Frontend will automatically use next available port
- **Missing dependencies**: Run `npm install`
- **API connection errors**: Check backend is running and CORS settings

#### 3. AI Features Not Working
- **Gemini API key missing**: Add your key to backend `.env` file
- **API rate limits**: Check Google AI Studio usage dashboard
- **Model errors**: Verify `GEMINI_MODEL` setting in `.env`

#### 4. File Upload Issues
- **File size too large**: Check `MAX_UPLOAD_SIZE` in backend settings
- **File type not supported**: Verify `ALLOWED_FILE_TYPES` setting
- **Storage permissions**: Ensure backend has write access to media directory

### Debug Mode

#### Backend Debug
```bash
# Enable verbose logging
export DJANGO_LOG_LEVEL=DEBUG
python manage.py runserver --verbosity 2
```

#### Frontend Debug
```javascript
// In browser console
localStorage.setItem('debug', 'true');
```

## 🚀 Production Deployment

### Backend Production
1. Set `DEBUG=False` in environment
2. Use production database (PostgreSQL/MySQL)
3. Configure proper CORS origins
4. Set up static/media file serving
5. Use production WSGI server (Gunicorn/uWSGI)

### Frontend Production
1. Set `REACT_APP_API_URL` to production backend
2. Build with `npm run build`
3. Serve static files from web server (Nginx/Apache)

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout

### Policy Endpoints
- `GET /api/policies/` - List policies
- `POST /api/policies/` - Upload policy
- `GET /api/policies/<id>/` - Get policy details

### AI Endpoints
- `POST /api/ai/query/` - Policy analysis
- `POST /api/ai/compare/` - Policy comparison
- `GET /api/ai/conversations/` - Chat history

## 🆘 Getting Help

### Check These First
1. **Browser Console**: Look for JavaScript errors
2. **Network Tab**: Check API request/response details
3. **Backend Logs**: Review Django server output
4. **Environment Variables**: Verify all required settings

### Support Resources
- **Integration Guide**: `INTEGRATION_GUIDE.md`
- **Backend README**: `backend/README.md`
- **API Documentation**: Check backend URLs for DRF browsable API

## 🎉 You're All Set!

Your PolicyBridge AI application is now running with:
- ✅ Django backend with REST API
- ✅ React frontend with modern UI
- ✅ JWT authentication system
- ✅ Policy management and file uploads
- ✅ AI-powered analysis and chat
- ✅ Real-time data synchronization

**Happy analyzing! 🚀**

---

*Need help? Check the troubleshooting section above or review the integration guide.*
