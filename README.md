# 🚀 PolicyBridge AI

**AI-powered policy document analysis and Q&A platform**

PolicyBridge AI is a full-stack web application that allows users to upload policy documents and ask questions about them in simple language. The AI responds with clear answers and references the exact clauses from the policy.

## ✨ Features

- **🔐 User Authentication** - Secure JWT-based login/registration
- **📄 File Upload** - Support for PDF, DOCX, and TXT files
- **🤖 AI Q&A** - Ask questions and get answers with clause references
- **📊 Policy Comparison** - Compare multiple policies side-by-side
- **💬 Conversation History** - Track all your AI interactions
- **🎨 Beautiful UI** - Responsive design with smooth animations

## 🛠 Tech Stack

### Frontend
- **React** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions

### Backend
- **Django** - Python web framework
- **Django REST Framework** - API development
- **JWT Authentication** - Secure user sessions

### Database & AI
- **MongoDB** - NoSQL database
- **OpenAI GPT-4o-mini** - AI language model
- **Vector Search** - Semantic document retrieval

### Deployment
- **Frontend** - Vercel/Netlify
- **Backend** - Render/Heroku
- **Database** - MongoDB Atlas

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📁 Project Structure

```
PolicyBridge AI/
├── backend/                 # Django backend
│   ├── policybridge/       # Django project
│   ├── api/               # REST API endpoints
│   ├── core/              # Core models and utilities
│   └── requirements.txt   # Python dependencies
├── frontend/              # React frontend
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   └── package.json      # Node dependencies
├── uploads/              # File uploads
└── README.md            # This file
```

## 🎨 UI Theme

Our design system uses a warm, professional color palette:

- **Primary**: #F5F0E6 (Warm Beige)
- **Secondary**: #4B5945 (Deep Olive)
- **Accent 1**: #D97B66 (Terracotta)
- **Accent 2**: #E6B566 (Golden Sand)
- **Background**: #FBF9F4 (Cream White)

## 🔒 Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your_django_secret_key
DEBUG=True
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
```

## 📝 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/policies/` - List user policies
- `POST /api/policies/upload` - Upload policy document
- `POST /api/chat/` - Ask AI questions about policies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ for better policy understanding**
