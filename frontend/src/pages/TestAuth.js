import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { aiAPI } from '../services/api';
import toast from 'react-hot-toast';

const TestAuth = () => {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState('');

  const testAIQuery = async () => {
    try {
      setTestResult('Testing AI query...');
      
      // Test with a simple query
      const response = await aiAPI.queryPolicy({
        policy_id: 1, // Use a test policy ID
        question: 'What is covered under this policy?',
        analysis_type: 'general'
      });
      
      setTestResult(`✅ AI Query Success: ${JSON.stringify(response.data, null, 2)}`);
      toast.success('AI query test successful!');
    } catch (error) {
      setTestResult(`❌ AI Query Failed: ${error.response?.data?.detail || error.message}`);
      toast.error('AI query test failed');
      console.error('AI Query Error:', error);
    }
  };

  const testPolicyComparison = async () => {
    try {
      setTestResult('Testing policy comparison...');
      
      // Test with a simple comparison
      const response = await aiAPI.comparePolicies({
        policy1_id: 1,
        policy2_id: 1, // Use same policy for testing
        comparison_criteria: 'general'
      });
      
      setTestResult(`✅ Policy Comparison Success: ${JSON.stringify(response.data, null, 2)}`);
      toast.success('Policy comparison test successful!');
    } catch (error) {
      setTestResult(`❌ Policy Comparison Failed: ${error.response?.data?.detail || error.message}`);
      toast.error('Policy comparison test failed');
      console.error('Policy Comparison Error:', error);
    }
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    setTestResult(`
🔑 Authentication Status:
- User: ${user ? 'Logged In' : 'Not Logged In'}
- Token: ${token ? 'Present' : 'Missing'}
- User Data: ${userData ? 'Present' : 'Missing'}
- Token Value: ${token ? token.substring(0, 20) + '...' : 'N/A'}
    `);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-accent to-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Authentication Required</h2>
          <p className="text-text-secondary">Please log in to test AI functionality</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-accent to-bg-secondary py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-text-primary mb-8">AI Functionality Test</h1>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Test Controls</h2>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={checkAuthStatus}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Check Auth Status
            </button>
            
            <button
              onClick={testAIQuery}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Test AI Query
            </button>
            
            <button
              onClick={testPolicyComparison}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Test Policy Comparison
            </button>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Test Results:</h3>
            <pre className="text-sm text-text-secondary whitespace-pre-wrap">{testResult}</pre>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Current User Info</h2>
          <div className="bg-gray-100 rounded-lg p-4">
            <pre className="text-sm text-text-secondary whitespace-pre-wrap">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAuth;
