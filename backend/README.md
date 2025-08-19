# 🚀 PolicyBridge AI - Django Backend

A comprehensive Django backend for PolicyBridge AI, providing AI-powered insurance policy analysis and management.

## ✨ Features

### 🔐 **User Authentication**
- JWT-based authentication system
- User registration and login
- Profile management
- Secure password handling

### 📄 **Policy Management**
- Upload insurance policy documents (PDF, DOCX, TXT)
- Store policy metadata and files
- Advanced search and filtering
- Policy statistics and analytics

### 🤖 **AI Integration**
- Google Gemini integration for policy analysis
- Natural language queries about policies
- Policy comparison and recommendations
- Conversation history and chat interface
- Usage tracking and cost monitoring

## 🛠 Tech Stack

- **Framework**: Django 4.2.7 + Django REST Framework
- **Authentication**: JWT with djangorestframework-simplejwt
- **Database**: SQLite (configurable for production)
- **AI**: OpenAI API integration
- **File Handling**: Django file uploads with validation
- **CORS**: django-cors-headers for frontend integration
- **Filtering**: django-filter for advanced queries

## 📁 Project Structure

```
policybridge_backend/
├── policybridge_backend/     # Main project settings
│   ├── __init__.py
│   ├── settings.py          # Django configuration
│   ├── urls.py              # Main URL routing
│   ├── wsgi.py              # WSGI configuration
│   └── asgi.py              # ASGI configuration
├── users/                    # User authentication app
│   ├── models.py            # Custom User model
│   ├── serializers.py       # API serializers
│   ├── views.py             # Authentication views
│   ├── urls.py              # User URL patterns
│   └── admin.py             # Admin configuration
├── policies/                 # Policy management app
│   ├── models.py            # Policy and extraction models
│   ├── serializers.py       # Policy serializers
│   ├── views.py             # Policy CRUD views
│   ├── urls.py              # Policy URL patterns
│   └── admin.py             # Admin configuration
├── ai/                      # AI integration app
│   ├── models.py            # AI models (conversations, analyses)
│   ├── serializers.py       # AI serializers
│   ├── services.py          # OpenAI service layer
│   ├── views.py             # AI endpoint views
│   ├── urls.py              # AI URL patterns
│   └── admin.py             # Admin configuration
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── env_example.txt          # Environment variables template
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd policybridge_backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Copy the example file
   cp env_example.txt .env
   
   # Edit .env with your configuration
   # Especially set your OpenAI API key
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000/`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-here
JWT_ACCESS_TOKEN_EXPIRES=3600
JWT_REFRESH_TOKEN_EXPIRES=604800

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Add the key to your `.env` file

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/users/profile/` - Get user profile
- `PUT /api/users/profile/` - Update user profile

### Policy Management
- `GET /api/policies/` - List user policies
- `POST /api/policies/` - Upload new policy
- `GET /api/policies/<id>/` - Get policy details
- `PUT /api/policies/<id>/` - Update policy
- `DELETE /api/policies/<id>/` - Delete policy
- `GET /api/policies/search/` - Search policies
- `GET /api/policies/stats/` - Get policy statistics

### AI Integration
- `POST /api/ai/query/` - Ask AI about a policy
- `POST /api/ai/compare/` - Compare two policies
- `GET /api/ai/conversations/` - List conversations
- `POST /api/ai/conversations/` - Create conversation
- `GET /api/ai/conversations/<id>/` - Get conversation
- `POST /api/ai/conversations/<id>/message/` - Send message
- `GET /api/ai/usage-stats/` - Get usage statistics

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with Django's built-in validators
- CORS configuration for frontend security
- File upload validation and size limits
- User-specific data isolation
- Admin interface protection

## 📊 Database Models

### Users
- **User**: Custom user model with email authentication
- **Fields**: email, username, first_name, last_name, date_joined

### Policies
- **Policy**: Insurance policy documents and metadata
- **PolicyExtraction**: Extracted text from policy documents
- **Fields**: name, provider, type, coverage, premium, document, tags

### AI Integration
- **Conversation**: Chat conversations between users and AI
- **Message**: Individual messages in conversations
- **PolicyAnalysis**: AI-generated policy analysis results
- **PolicyComparison**: AI-generated policy comparison results
- **AIUsageLog**: API usage tracking and cost monitoring

## 🚀 Production Deployment

### Database
- Replace SQLite with PostgreSQL or MySQL
- Update `DATABASE_URL` in environment variables
- Run migrations on production database

### Static Files
- Configure `STATIC_ROOT` and `MEDIA_ROOT`
- Use a CDN or web server for file serving
- Set `DEBUG=False` in production

### Security
- Generate strong `SECRET_KEY`
- Use HTTPS in production
- Configure proper `ALLOWED_HOSTS`
- Set up proper logging

### AI Service
- Monitor OpenAI API usage and costs
- Implement rate limiting if needed
- Set up error monitoring and alerting

## 🧪 Testing

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test users
python manage.py test policies
python manage.py test ai
```

## 📝 API Documentation

### Authentication Headers
All protected endpoints require JWT authentication:
```
Authorization: Bearer <access_token>
```

### Response Format
All API responses follow this format:
```json
{
  "message": "Success message",
  "data": {...},
  "status": "success"
}
```

### Error Handling
Errors return appropriate HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (permission denied)
- `404` - Not Found
- `500` - Internal Server Error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review the Django logs
- Open an issue on GitHub

---

**Built with ❤️ for better policy understanding**
