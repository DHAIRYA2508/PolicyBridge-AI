# PolicyBridge AI - Backend

This is the Django backend for PolicyBridge AI, a comprehensive policy document analysis platform.

## Features

- **User Authentication**: JWT-based authentication with OTP verification
- **Policy Management**: Upload, store, and manage policy documents
- **AI Chat**: Interactive conversations with policies using AI
- **Policy Comparison**: Compare multiple policies side-by-side
- **File Processing**: Support for PDF, DOCX, and TXT files
- **RESTful API**: Complete REST API with Django REST Framework

## Tech Stack

- **Framework**: Django 4.2.7
- **API**: Django REST Framework
- **Authentication**: SimpleJWT
- **Database**: SQLite (development) / PostgreSQL (production)
- **Task Queue**: Celery + Redis
- **File Storage**: Local storage with WhiteNoise
- **AI Integration**: OpenAI API

## Project Structure

```
backend/
├── policybridge/          # Main project settings
├── users/                 # User authentication & management
├── policies/              # Policy document management
├── conversations/         # AI chat functionality
├── templates/             # Email templates
├── static/                # Static files
├── media/                 # Uploaded files
├── logs/                  # Application logs
└── requirements.txt       # Python dependencies
```

## API Endpoints

### Authentication (`/api/auth/`)
- `POST /register/` - User registration
- `POST /login/` - User login
- `POST /verify-otp/` - OTP verification
- `POST /logout/` - User logout
- `GET /profile/` - User profile
- `POST /change-password/` - Change password
- `POST /forgot-password/` - Request password reset

### Policies (`/api/policies/`)
- `GET /` - List user policies
- `POST /` - Upload new policy
- `GET /<uuid>/` - Get policy details
- `PUT /<uuid>/` - Update policy
- `DELETE /<uuid>/` - Delete policy
- `POST /compare/` - Compare policies
- `POST /chat/` - AI chat with policy
- `GET /statistics/` - Policy statistics

### Conversations (`/api/conversations/`)
- `GET /` - List conversations
- `POST /` - Create conversation
- `GET /<uuid>/` - Get conversation details
- `GET /<uuid>/messages/` - Get conversation messages
- `POST /<uuid>/messages/` - Send message
- `GET /policy/<uuid>/` - Get policy conversations

## Setup Instructions

### 1. Environment Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\Activate.ps1
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Variables
Copy `env.example` to `.env` and configure:
```bash
SECRET_KEY=your-secret-key-here
DEBUG=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
OPENAI_API_KEY=your-openai-api-key
```

### 3. Database Setup
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 4. Run Development Server
```bash
python manage.py runserver
```

### 5. Run Celery Worker (Optional)
```bash
# Start Redis server first
celery -A policybridge worker --loglevel=info

# Start Celery Beat for scheduled tasks
celery -A policybridge beat --loglevel=info
```

## Development

### Running Tests
```bash
python manage.py test
```

### Code Quality
```bash
# Check for code style issues
python -m flake8

# Run security checks
python manage.py check --deploy
```

### Database Management
```bash
# Reset database
python manage.py flush

# Create backup
python manage.py dumpdata > backup.json

# Load backup
python manage.py loaddata backup.json
```

## Deployment

### Production Settings
- Set `DEBUG=False`
- Configure production database (PostgreSQL)
- Set up proper `SECRET_KEY`
- Configure email settings
- Set up Redis for Celery
- Configure static file serving

### Environment Variables
```bash
SECRET_KEY=production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
DATABASE_URL=postgresql://user:pass@host:port/db
CELERY_BROKER_URL=redis://localhost:6379/0
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
