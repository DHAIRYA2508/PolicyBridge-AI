// Frontend configuration for PolicyBridge AI
const config = {
  // API Configuration
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    timeout: 30000,
  },
  
  // App Configuration
  app: {
    name: 'PolicyBridge AI',
    version: '1.0.0',
    description: 'AI-powered insurance policy analysis and management',
  },
  
  // File Upload Configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    allowedExtensions: ['.pdf', '.docx', '.txt'],
  },
  
  // UI Configuration
  ui: {
    theme: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      success: '#10B981',
    },
    animations: {
      duration: 300,
      easing: 'ease-in-out',
    },
  },
  
  // Feature Flags
  features: {
    aiAnalysis: true,
    policyComparison: true,
    conversationHistory: true,
    fileUpload: true,
    userManagement: true,
  },
};

export default config;
