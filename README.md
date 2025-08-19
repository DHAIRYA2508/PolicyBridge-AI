# 🚀 PolicyBridge AI - Full Stack Application

A comprehensive AI-powered insurance policy analysis and management system built with Django and React.

## ✨ Features

### 🔐 **User Authentication & Management**
- JWT-based authentication system
- User registration, login, and profile management
- Secure password handling with Django validators

### 📄 **Policy Management**
- Upload insurance policy documents (PDF, DOCX, TXT)
- Store policy metadata and files with validation
- Advanced search, filtering, and categorization
- Policy statistics and analytics dashboard

### 🤖 **AI-Powered Analysis**
- Google Gemini integration for intelligent policy analysis
- Natural language queries about policies
- Policy comparison and recommendations
- Conversational AI chat interface
- Usage tracking and cost monitoring

### 🎨 **Modern User Interface**
- Responsive React frontend with Tailwind CSS
- Real-time data synchronization
- Drag & drop file uploads
- Interactive dashboards and charts
- Toast notifications and loading states

## 🛠 Tech Stack

### **Backend (Django)**
- **Framework**: Django 4.2.7 + Django REST Framework
- **Authentication**: JWT with djangorestframework-simplejwt
- **Database**: SQLite (configurable for production)
- **AI Integration**: Google Gemini API with custom service layer
- **File Handling**: Django file uploads with validation
- **CORS**: django-cors-headers for frontend integration
- **Filtering**: django-filter for advanced queries

### **Frontend (React)**
- **Framework**: React 18 with modern hooks
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

### **AI & ML**
- **Language Model**: Google Gemini
- **Analysis Types**: Coverage analysis, policy comparison, Q&A
- **Conversation Memory**: Persistent chat history
- **Cost Tracking**: Token usage and cost monitoring

## 🚀 Quick Start

### **Option 1: One-Click Setup (Recommended)**
```bash
# Windows
start-full-stack.bat

# PowerShell
.\start-full-stack.ps1
```

### **Option 2: Manual Setup**
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (new terminal)
cd frontend
npm install
npm start
```

## 📁 Project Structure

```
PolicyBridge AI/
├── backend/                    # Django backend
│   ├── policybridge_backend/  # Main project settings
│   ├── users/                 # User authentication app
│   ├── policies/              # Policy management app
│   ├── ai/                    # AI integration app
│   ├── requirements.txt       # Python dependencies
│   ├── start.bat             # Backend startup script
│   └── README.md             # Backend documentation
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Application pages
│   │   ├── context/          # React context providers
│   │   ├── services/         # API service layer
│   │   └── config/           # Configuration files
│   ├── package.json          # Node.js dependencies
│   └── tailwind.config.js    # Tailwind configuration
├── start-full-stack.bat      # Windows startup script
├── start-full-stack.ps1      # PowerShell startup script
├── SETUP_GUIDE.md            # Complete setup instructions
├── INTEGRATION_GUIDE.md      # Frontend-backend integration
└── README.md                 # This file
```

## 🔑 Configuration

### **Backend Environment Variables**
Create `backend/.env` from `backend/env_example.txt`:
```env
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
DEBUG=True
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### **Frontend Environment Variables**
Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 📡 API Endpoints

### **Authentication**
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout

### **Policies**
- `GET /api/policies/` - List user policies
- `POST /api/policies/` - Upload new policy
- `GET /api/policies/<id>/` - Get policy details
- `GET /api/policies/search/` - Search policies

### **AI Integration**
- `POST /api/ai/query/` - Policy analysis
- `POST /api/ai/compare/` - Policy comparison
- `GET /api/ai/conversations/` - Chat history

## 🎮 Usage Examples

### **1. User Registration & Login**
```javascript
import { useAuth } from './context/AuthContext';

const { register, login } = useAuth();

// Register new user
await register({
  email: 'user@example.com',
  password: 'securepassword',
  first_name: 'John',
  last_name: 'Doe'
});

// Login
await login({
  email: 'user@example.com',
  password: 'securepassword'
});
```

### **2. Policy Upload**
```javascript
import { policyAPI } from './services/api';

const policyData = {
  name: 'Health Insurance Policy',
  document: file, // File object
  policy_type: 'health',
  provider: 'Insurance Co',
  description: 'Employee health coverage'
};

await policyAPI.createPolicy(policyData);
```

### **3. AI Analysis**
```javascript
import { aiAPI } from './services/api';

const analysis = await aiAPI.queryPolicy({
  policy_id: 1,
  query: 'What are the coverage limits?',
  analysis_type: 'coverage_analysis'
});
```

## 🔍 Testing

### **Backend Health Check**
```bash
curl http://localhost:8000/api/users/stats/
```

### **Frontend API Test**
```javascript
// Browser console
fetch('http://localhost:8000/api/users/stats/')
  .then(response => response.json())
  .then(data => console.log('Backend connected:', data));
```

## 🚀 Production Deployment

### **Backend**
1. Set `DEBUG=False`
2. Use production database (PostgreSQL/MySQL)
3. Configure proper CORS origins
4. Set up static/media file serving
5. Use production WSGI server

### **Frontend**
1. Set production API URL
2. Build with `npm run build`
3. Serve static files from web server

## 🔍 Troubleshooting

### **Common Issues**
1. **CORS Errors**: Check `CORS_ALLOWED_ORIGINS` in backend
2. **Authentication Failures**: Verify JWT token format
3. **File Upload Issues**: Check file size limits and types
4. **AI Features Not Working**: Verify Gemini API key

### **Debug Mode**
```bash
# Backend
export DJANGO_LOG_LEVEL=DEBUG

# Frontend (browser console)
localStorage.setItem('debug', 'true');
```

## 📚 Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Complete setup instructions
- **[Integration Guide](INTEGRATION_GUIDE.md)** - Frontend-backend integration details
- **[Backend README](backend/README.md)** - Django backend documentation
- **[API Documentation](http://localhost:8000/api/)** - Interactive API browser (when running)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

### **Getting Help**
1. Check the troubleshooting section above
2. Review the setup and integration guides
3. Check browser console and backend logs
4. Open an issue on GitHub

### **Support Resources**
- **Setup Guide**: `SETUP_GUIDE.md`
- **Integration Guide**: `INTEGRATION_GUIDE.md`
- **Gemini Setup Guide**: `GEMINI_SETUP.md`
- **Backend README**: `backend/README.md`

---

## 🎉 Ready to Go!

Your PolicyBridge AI application is now fully integrated and ready to use! 

**Quick Start:**
1. Run `start-full-stack.bat` (Windows) or `.\start-full-stack.ps1` (PowerShell)
2. Access frontend at http://localhost:3000
3. Access backend at http://localhost:8000
4. Create your first account and start analyzing policies!

**Happy analyzing! 🚀**
