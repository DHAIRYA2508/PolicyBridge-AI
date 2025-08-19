# 🔗 PolicyBridge AI - Frontend-Backend Integration Guide

This guide will help you integrate your React frontend with the Django backend for PolicyBridge AI.

## 🚀 Quick Start

### 1. Start the Django Backend

```bash
cd backend
# Run the automated setup script
start.bat
```

The backend will be available at `http://localhost:8000/`

### 2. Start the React Frontend

```bash
cd frontend
npm start
```

The frontend will be available at `http://localhost:3000/`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api

# Optional: Customize other settings
REACT_APP_APP_NAME=PolicyBridge AI
REACT_APP_VERSION=1.0.0
```

### Backend Environment Variables

Copy `backend/env_example.txt` to `backend/.env` and configure:

```env
# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# OpenAI Configuration (Required for AI features)
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 📡 API Integration

### Authentication Flow

1. **User Registration**: `POST /api/auth/register/`
2. **User Login**: `POST /api/auth/login/`
3. **JWT Token**: Automatically handled by interceptors
4. **Token Refresh**: Automatic on 401 responses

### API Endpoints

| Feature | Endpoint | Method | Description |
|---------|----------|--------|-------------|
| **Auth** | `/api/auth/register/` | POST | User registration |
| **Auth** | `/api/auth/login/` | POST | User login |
| **Auth** | `/api/auth/logout/` | POST | User logout |
| **Users** | `/api/users/profile/` | GET/PUT | User profile |
| **Policies** | `/api/policies/` | GET/POST | Policy management |
| **Policies** | `/api/policies/search/` | GET | Policy search |
| **AI** | `/api/ai/query/` | POST | Policy analysis |
| **AI** | `/api/ai/compare/` | POST | Policy comparison |
| **AI** | `/api/ai/conversations/` | GET/POST | Chat conversations |

## 🔐 Authentication Integration

### Frontend Auth Context

The `AuthContext` now integrates with the Django backend:

```javascript
import { useAuth } from '../context/AuthContext';

const { user, login, register, logout } = useAuth();

// Login
const result = await login({ email, password });
if (result.success) {
  // Navigate to dashboard
}

// Register
const result = await register({ email, password, name });
if (result.success) {
  // Navigate to dashboard
}
```

### JWT Token Management

- **Automatic**: Tokens are automatically added to API requests
- **Refresh**: Invalid tokens trigger automatic logout
- **Storage**: Tokens stored in localStorage with automatic cleanup

## 📄 Policy Management Integration

### Upload Policies

```javascript
import { policyAPI } from '../services/api';

const policyData = {
  name: 'Policy Name',
  document: file, // File object
  policy_type: 'insurance',
  provider: 'Insurance Co',
  description: 'Policy description'
};

await policyAPI.createPolicy(policyData);
```

### Fetch Policies

```javascript
// Get all policies
const policies = await policyAPI.getPolicies();

// Search policies
const searchResults = await policyAPI.searchPolicies({
  query: 'health insurance',
  policy_type: 'health'
});
```

## 🤖 AI Integration

### Policy Analysis

```javascript
import { aiAPI } from '../services/api';

const analysis = await aiAPI.queryPolicy({
  policy_id: 1,
  query: 'What are the coverage limits?',
  analysis_type: 'coverage_analysis'
});
```

### Policy Comparison

```javascript
const comparison = await aiAPI.comparePolicies({
  policy1_id: 1,
  policy2_id: 2,
  comparison_criteria: 'coverage_and_cost'
});
```

### Chat Conversations

```javascript
// Create conversation
const conversation = await aiAPI.createConversation({
  title: 'Policy Discussion'
});

// Send message
const response = await aiAPI.sendMessage(conversation.id, 'Hello AI!');
```

## 🎨 UI Components

### Toast Notifications

All API interactions include toast notifications:

```javascript
import toast from 'react-hot-toast';

// Success
toast.success('Operation completed successfully!');

// Error
toast.error('Something went wrong!');

// Loading
const loadingToast = toast.loading('Processing...');
toast.dismiss(loadingToast);
```

### Loading States

Components automatically show loading states during API calls:

```javascript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await apiCall();
  } finally {
    setLoading(false);
  }
};
```

## 🚨 Error Handling

### API Error Interceptors

- **401 Unauthorized**: Automatic logout and redirect to login
- **400 Bad Request**: Display validation errors
- **500 Server Error**: Show user-friendly error messages

### User Feedback

```javascript
try {
  await apiCall();
  toast.success('Success!');
} catch (error) {
  const message = error.response?.data?.detail || 'An error occurred';
  toast.error(message);
}
```

## 🔄 Data Flow

### 1. User Authentication
```
Frontend → Login Form → AuthContext → Django Backend → JWT Token → Local Storage
```

### 2. Policy Upload
```
File Input → FormData → Policy API → Django Backend → Database → Success Response
```

### 3. AI Analysis
```
User Query → AI API → OpenAI → Analysis Result → Database → Frontend Display
```

## 🧪 Testing Integration

### Backend Health Check

```bash
curl http://localhost:8000/api/users/stats/
```

### Frontend API Test

```javascript
// Test API connection
import api from '../services/api';

const testConnection = async () => {
  try {
    const response = await api.get('/users/stats/');
    console.log('Backend connected:', response.data);
  } catch (error) {
    console.error('Backend connection failed:', error);
  }
};
```

## 🚀 Production Deployment

### Backend

1. Set `DEBUG=False` in environment
2. Configure production database (PostgreSQL/MySQL)
3. Set up proper CORS origins
4. Configure static/media file serving

### Frontend

1. Set `REACT_APP_API_URL` to production backend
2. Build with `npm run build`
3. Serve static files from web server

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**: Check `CORS_ALLOWED_ORIGINS` in backend
2. **Authentication Failures**: Verify JWT token format
3. **File Upload Issues**: Check file size limits and types
4. **API Timeouts**: Increase timeout in frontend config

### Debug Mode

Enable debug logging in frontend:

```javascript
// In browser console
localStorage.setItem('debug', 'true');
```

## 📚 Additional Resources

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [React Context API](https://reactjs.org/docs/context.html)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
- [JWT Authentication](https://jwt.io/)

## 🆘 Support

If you encounter issues:

1. Check browser console for errors
2. Verify backend is running and accessible
3. Check network tab for API request/response details
4. Review Django backend logs

---

**Happy Coding! 🎉**

Your PolicyBridge AI application is now fully integrated and ready to use!
