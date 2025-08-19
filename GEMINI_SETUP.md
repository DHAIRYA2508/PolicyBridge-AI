# 🤖 Google Gemini Integration Guide for PolicyBridge AI

This guide will help you set up and use Google's Gemini AI model instead of OpenAI for your PolicyBridge AI application.

## 🎯 Why Gemini?

- **Cost Effective**: Generally more affordable than OpenAI
- **High Quality**: Excellent performance on text analysis tasks
- **Easy Integration**: Simple Python client library
- **Generous Free Tier**: 15 requests per minute, 1500 requests per day
- **Multimodal**: Can handle text, images, and more (future expansion)

## 🔑 Getting Your Gemini API Key

### Step 1: Visit Google AI Studio
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your new API key

### Step 2: Set Up Environment Variables
Create or update your `backend/.env` file:

```env
# Gemini Configuration
GEMINI_API_KEY=your-actual-api-key-here
GEMINI_MODEL=gemini-1.5-pro

# Other Django settings...
SECRET_KEY=your-secret-key-here
DEBUG=True
```

## 🚀 Testing the Integration

### Option 1: Run the Test Script
```bash
cd backend
python test_gemini.py
```

### Option 2: Test via Django Shell
```bash
cd backend
python manage.py shell

# In the shell:
from ai.services import GeminiService
service = GeminiService()
response = service.model.generate_content("What is insurance?")
print(response.text)
```

## 📊 Available Gemini Models

### Free Tier Models
- **gemini-1.5-flash**: Fast, efficient, good for most tasks
- **gemini-1.5-flash-exp**: Experimental version with latest features

### Pro Models (Paid)
- **gemini-1.5-pro**: Most capable, best for complex analysis
- **gemini-1.5-pro-exp**: Experimental pro version

### Model Selection
```env
# For development/testing (free)
GEMINI_MODEL=gemini-1.5-flash

# For production (paid, but more capable)
GEMINI_MODEL=gemini-1.5-pro
```

## 💰 Cost Structure

### Free Tier
- **15 requests per minute**
- **1500 requests per day**
- Perfect for development and testing

### Paid Tier
- **$0.0005 per 1K characters** (input + output)
- **$0.0015 per 1K characters** for Gemini Pro
- Very cost-effective for production use

### Cost Comparison Example
```
Input: 1000 characters
Output: 500 characters
Total: 1500 characters

Cost with Gemini Flash: $0.00075
Cost with Gemini Pro: $0.00225
```

## 🔧 Configuration Options

### Advanced Gemini Settings
You can customize Gemini behavior in `backend/ai/services.py`:

```python
# Temperature (creativity vs consistency)
response = self.model.generate_content(
    prompt,
    generation_config=genai.types.GenerationConfig(
        temperature=0.3,  # Lower = more consistent
        top_p=0.8,        # Nucleus sampling
        top_k=40          # Top-k sampling
    )
)

# Safety settings
safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
]

response = self.model.generate_content(
    prompt,
    safety_settings=safety_settings
)
```

## 🧪 Testing Different Use Cases

### 1. Policy Analysis
```python
from ai.services import GeminiService

service = GeminiService()
result = service.analyze_policy_query(
    user=user,
    query="What are the coverage limits?",
    policy_text="Your policy text here...",
    analysis_type="coverage"
)
```

### 2. Policy Comparison
```python
result = service.compare_policies(
    user=user,
    policy1_text="Policy 1 details...",
    policy2_text="Policy 2 details...",
    comparison_criteria="coverage, cost, exclusions"
)
```

### 3. Conversation
```python
result = service.generate_conversation_response(
    user=user,
    conversation_history=history,
    user_message="Can you explain the deductible?"
)
```

## 🚨 Troubleshooting

### Common Issues

#### 1. API Key Errors
```
ValidationError: Gemini API key not configured
```
**Solution**: Check your `.env` file and ensure `GEMINI_API_KEY` is set correctly.

#### 2. Rate Limiting
```
google.generativeai.types.BlockedPromptException: Rate limit exceeded
```
**Solution**: 
- Wait for rate limit to reset
- Use free tier models for development
- Implement request queuing for production

#### 3. Model Not Found
```
google.generativeai.types.BlockedPromptException: Model not found
```
**Solution**: Check your `GEMINI_MODEL` setting. Use one of the available models:
- `gemini-1.5-flash`
- `gemini-1.5-pro`

#### 4. Content Filtering
```
google.generativeai.types.BlockedPromptException: Content blocked
```
**Solution**: Adjust your prompt to avoid triggering safety filters.

### Debug Mode
Enable detailed logging in your Django settings:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
        },
    },
    'loggers': {
        'ai.services': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}
```

## 🔄 Migration from OpenAI

If you're migrating from OpenAI, the main differences are:

### 1. API Response Format
```python
# OpenAI (old)
response = openai.ChatCompletion.create(...)
ai_response = response.choices[0].message.content
tokens_used = response.usage.total_tokens

# Gemini (new)
response = self.model.generate_content(prompt)
ai_response = response.text
tokens_used = len(prompt.split()) + len(ai_response.split())  # Estimate
```

### 2. Cost Calculation
```python
# OpenAI pricing (approximate)
if model.startswith('gpt-4'):
    cost = (tokens_used / 1000) * 0.03
else:
    cost = (tokens_used / 1000) * 0.002

# Gemini pricing (approximate)
if 'pro' in model.name:
    cost = (tokens_used / 1000) * 0.0075
else:
    cost = (tokens_used / 1000) * 0.0005
```

## 📈 Performance Optimization

### 1. Batch Processing
```python
# Process multiple requests efficiently
def batch_analyze_policies(policies, query):
    results = []
    for policy in policies:
        result = self.analyze_policy_query(
            user=user,
            query=query,
            policy_text=policy.text
        )
        results.append(result)
    return results
```

### 2. Caching
```python
from django.core.cache import cache

def get_cached_analysis(policy_id, query):
    cache_key = f"policy_analysis_{policy_id}_{hash(query)}"
    result = cache.get(cache_key)
    
    if not result:
        result = self.analyze_policy_query(...)
        cache.set(cache_key, result, timeout=3600)  # 1 hour
    
    return result
```

### 3. Async Processing
```python
import asyncio
import aiohttp

async def async_analyze_policies(policies):
    tasks = []
    for policy in policies:
        task = self.async_analyze_policy(policy)
        tasks.append(task)
    
    results = await asyncio.gather(*tasks)
    return results
```

## 🎉 Ready to Use!

Your PolicyBridge AI application is now powered by Google Gemini! 

### Next Steps:
1. ✅ Set your `GEMINI_API_KEY` in `.env`
2. ✅ Test with `python test_gemini.py`
3. ✅ Start your Django server
4. ✅ Test AI features in the frontend
5. ✅ Monitor usage and costs

### Support Resources:
- [Google AI Studio](https://makersuite.google.com/app/apikey) - Get API keys
- [Gemini API Documentation](https://ai.google.dev/docs) - Official docs
- [Google AI Community](https://ai.google.dev/community) - Community support

---

**Happy analyzing with Gemini! 🚀**
