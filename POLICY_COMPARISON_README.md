# Policy Comparison System - Complete Rewrite

## Overview

This is a complete, production-ready rewrite of the Policy Comparison feature for PolicyBridge AI. The system provides AI-powered comparison of insurance policies using Google Gemini, with ML verification and professional PDF output.

## 🏗️ Architecture

### Backend (Django REST Framework)
- **`PolicyComparisonService`**: Core service class handling all comparison logic
- **PDF Text Extraction**: Supports PDF, DOCX, and TXT files
- **AI Integration**: Google Gemini for intelligent policy analysis
- **ML Verification**: Placeholder for future ML model integration
- **Error Handling**: Comprehensive error handling with fallbacks

### Frontend (React)
- **Clean UI**: Professional, responsive design
- **Policy Selection**: Easy selection of policies to compare
- **Results Display**: Structured table format for easy reading
- **PDF Generation**: Download and share comparison results
- **Real-time Updates**: Loading states and progress indicators

## 🚀 Features

### 1. PDF Text Extraction
- **Multi-format Support**: PDF, DOCX, TXT files
- **Robust Parsing**: Handles various document structures
- **Error Recovery**: Graceful fallbacks for corrupted files

### 2. AI-Powered Comparison
- **Structured Analysis**: 7 key comparison categories
- **Professional Output**: Clear, actionable insights
- **Gemini Integration**: Latest AI model for accurate analysis

### 3. ML Verification
- **Quality Scoring**: Confidence and completeness metrics
- **Verification Status**: Clear indication of result quality
- **Extensible**: Ready for future ML model integration

### 4. Professional Output
- **Table Format**: Easy-to-read comparison tables
- **PDF Generation**: High-quality downloadable reports
- **Sharing**: Native sharing and clipboard support

## 📋 API Endpoints

### POST `/api/ai/compare/`
Compare two policies using AI analysis.

**Request:**
```json
{
  "policy1_id": 123,
  "policy2_id": 456
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "comparison_result": {
      "SUMMARY": "...",
      "COVERAGE COMPARISON": "...",
      "EXCLUSIONS & LIMITATIONS": "...",
      "PREMIUM & COST ANALYSIS": "...",
      "UNIQUE FEATURES": "...",
      "RECOMMENDATIONS": "...",
      "FINAL VERDICT": "..."
    },
    "raw_response": "...",
    "usage_info": {...},
    "policy_names": ["Policy A", "Policy B"],
    "ml_verification": {...}
  }
}
```

### GET `/api/ai/policy-extraction/<policy_id>/`
Get extracted text from a specific policy.

## 🔧 Setup & Installation

### Backend Dependencies
```bash
pip install -r requirements.txt
```

**Required Packages:**
- `PyPDF2==3.0.1` - PDF text extraction
- `python-docx==1.1.0` - Word document processing
- `google-generativeai==0.3.2` - Gemini AI integration

### Environment Variables
```bash
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

### Frontend Dependencies
```bash
npm install lucide-react react-hot-toast jspdf html2canvas
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python test_comparison.py
```

### Frontend Testing
1. Start the backend server
2. Start the frontend development server
3. Navigate to `/compare` page
4. Select two policies and run comparison

## 📊 Comparison Categories

The AI analyzes policies across these key areas:

1. **SUMMARY** - High-level overview and key differences
2. **COVERAGE COMPARISON** - What each policy covers
3. **EXCLUSIONS & LIMITATIONS** - What's NOT covered
4. **PREMIUM & COST ANALYSIS** - Pricing and deductibles
5. **UNIQUE FEATURES** - Distinctive benefits
6. **RECOMMENDATIONS** - Customer-specific advice
7. **FINAL VERDICT** - Which policy is better for different scenarios

## 🎨 UI Components

### Policy Selection Panel
- **Visual Selection**: Clear indication of selected policies
- **Validation**: Ensures exactly 2 policies are selected
- **Loading States**: Shows when fetching policies

### Comparison Results
- **Professional Table**: Clean, scannable format
- **Section Headers**: Clear organization of information
- **ML Verification**: Quality indicators and confidence scores

### Action Buttons
- **Download PDF**: Generate professional report
- **Share Results**: Native sharing or clipboard copy

## 🔒 Security & Validation

### Input Validation
- **Policy IDs**: Must be valid, user-owned policies
- **File Types**: Only supported document formats
- **User Permissions**: Users can only compare their own policies

### Error Handling
- **Graceful Degradation**: Fallback responses when AI fails
- **User Feedback**: Clear error messages and suggestions
- **Logging**: Comprehensive error logging for debugging

## 🚀 Future Enhancements

### ML Model Integration
- **Custom Models**: Train on insurance-specific data
- **Accuracy Scoring**: More sophisticated quality metrics
- **Learning**: Improve over time with user feedback

### Advanced Features
- **Batch Comparison**: Compare multiple policies at once
- **Historical Analysis**: Track policy changes over time
- **Market Insights**: Industry benchmarks and trends

## 📝 Code Quality

### Backend Standards
- **Type Hints**: Full Python type annotations
- **Documentation**: Comprehensive docstrings
- **Error Handling**: Robust exception management
- **Logging**: Structured logging throughout

### Frontend Standards
- **React Hooks**: Modern functional components
- **State Management**: Clean, predictable state
- **Error Boundaries**: Graceful error handling
- **Accessibility**: ARIA labels and keyboard navigation

## 🐛 Troubleshooting

### Common Issues

1. **PDF Extraction Fails**
   - Check file format and size
   - Verify PyPDF2 installation
   - Check file permissions

2. **Gemini API Errors**
   - Verify API key configuration
   - Check rate limits and quotas
   - Ensure model name is correct

3. **Frontend Rendering Issues**
   - Clear browser cache
   - Check console for JavaScript errors
   - Verify API endpoint connectivity

### Debug Mode
Enable detailed logging by setting:
```python
LOGGING_LEVEL = 'DEBUG'
```

## 📞 Support

For technical issues or questions:
1. Check the logs for error details
2. Verify all dependencies are installed
3. Test with the provided test script
4. Review the API documentation

---

**Built with ❤️ for PolicyBridge AI**
