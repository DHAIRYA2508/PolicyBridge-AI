import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { policyAPI, aiAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { 
  Send, 
  ArrowLeft, 
  FileText, 
  User, 
  Bot, 
  Copy, 
  Download,
  Share2,
  Bookmark,
  MoreHorizontal,
  MessageCircle,
  BarChart3
} from 'lucide-react';

const ChatView = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const prevMessagesLength = useRef(0);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Real policy data - will be fetched from backend
  const [policy, setPolicy] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    if (!user && !loading) {
      toast.error('Please log in to access AI chat');
      navigate('/login');
      return;
    }
  }, [user, loading, navigate]);

  // Debug logging
  useEffect(() => {
    console.log('ChatView Debug:', {
      policyId,
      user: !!user,
      loading,
      policy: !!policy,
      messagesCount: messages.length,
      component: 'ChatView'
    });
  }, [policyId, user, loading, policy, messages.length]);

  // Load saved messages from backend or localStorage
  useEffect(() => {
    if (user) {
      const loadMessages = async () => {
        try {
          // Try to load from backend first
          const chatKey = policyId ? `chat_${policyId}` : 'general_chat';
          const savedMessages = localStorage.getItem(chatKey);
          
          if (savedMessages) {
            try {
              const parsedMessages = JSON.parse(savedMessages);
              // Convert timestamp strings back to Date objects
              const messagesWithDates = parsedMessages.map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              }));
              setMessages(messagesWithDates);
            } catch (error) {
              console.error('Error parsing saved messages:', error);
              localStorage.removeItem(chatKey);
            }
          } else {
            // Add welcome message for new chats
            const welcomeMessage = {
              id: Date.now(),
              type: 'ai',
              content: policyId 
                ? `Welcome! I'm here to help you understand your ${policy?.name || 'policy'}. Ask me anything about coverage, exclusions, claims, or any other policy-related questions.`
                : "Hello! I'm PolicyBridge AI, your insurance assistant. I can help you understand different types of insurance, explain policy terms, and answer your questions about coverage, claims, and more. How can I help you today?",
              timestamp: new Date(),
              citations: [],
              mlInsights: {}
            };
            setMessages([welcomeMessage]);
          }
        } catch (error) {
          console.error('Error loading messages:', error);
          // Fallback to welcome message
          const welcomeMessage = {
            id: Date.now(),
            type: 'ai',
            content: policyId 
              ? `Welcome! I'm here to help you understand your ${policy?.name || 'policy'}. Ask me anything about coverage, exclusions, claims, or any other policy-related questions.`
              : "Hello! I'm PolicyBridge AI, your insurance assistant. I can help you understand different types of insurance, explain policy terms, and answer your questions about coverage, claims, and more. How can I help you today?",
            timestamp: new Date(),
            citations: [],
            mlInsights: {}
          };
          setMessages([welcomeMessage]);
        }
      };
      
      loadMessages();
    }
  }, [user, policyId, policy?.name]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (user && messages.length > 0) {
      const chatKey = policyId ? `chat_${policyId}` : 'general_chat';
      localStorage.setItem(chatKey, JSON.stringify(messages));
    }
  }, [messages, user, policyId]);

  // Fetch policy data and conversation history
  useEffect(() => {
    if (!user) return; // Don't fetch if not authenticated
    
    const fetchPolicyData = async () => {
      try {
        setLoading(true);
        
        if (policyId) {
          // Fetch specific policy data from backend
          const policyResponse = await policyAPI.getPolicy(policyId);
          setPolicy(policyResponse.data);
        } else {
          // General policy chat - no specific policy
          setPolicy({
            name: 'General Policy Assistant',
            description: 'Ask me anything about insurance policies, coverage, claims, and more!'
          });
        }
        
        // Don't reset messages here - they're loaded from localStorage
      } catch (error) {
        console.error('Error fetching policy data:', error);
        if (policyId) {
          toast.error('Failed to load policy data');
        }
        // For general chat, set a default policy object
        setPolicy({
          name: 'General Policy Assistant',
          description: 'Ask me anything about insurance policies, coverage, claims, and more!'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyData();
  }, [policyId, user]);

  useEffect(() => {
    // Only scroll to bottom when new messages are added, not on initial load
    if (messages.length > 0 && messages.length > prevMessagesLength.current) {
      scrollToBottom();
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  const quickQuestions = policyId ? [
    'What is the waiting period for pre-existing conditions?',
    'How do I file a claim?',
    'What is covered under emergency care?',
    'Are prescription drugs covered?',
    'What is the out-of-network coverage?',
    'How do I add dependents to the policy?'
  ] : [
    'What types of insurance policies are available?',
    'How do I choose the right insurance coverage?',
    'What should I look for in an insurance policy?',
    'How do insurance claims work?',
    'What is the difference between HMO and PPO?',
    'How can I save money on insurance?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearChatHistory = () => {
    const chatKey = policyId ? `chat_${policyId}` : 'general_chat';
    localStorage.removeItem(chatKey);
    setMessages([]);
    toast.success('Chat history cleared');
  };

  const exportChatHistory = () => {
    if (messages.length === 0) {
      toast.error('No messages to export');
      return;
    }

    const chatData = {
      policy: policyId ? policy?.name : 'General Chat',
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }))
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${policyId || 'general'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Chat history exported successfully');
  };

  const importChatHistory = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const chatData = JSON.parse(event.target.result);
            if (chatData.messages && Array.isArray(chatData.messages)) {
              const importedMessages = chatData.messages.map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
                id: Date.now() + Math.random()
              }));
              setMessages(importedMessages);
              toast.success('Chat history imported successfully');
            } else {
              toast.error('Invalid chat history file format');
            }
          } catch (error) {
            console.error('Error parsing chat history file:', error);
            toast.error('Failed to parse chat history file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSendMessage = async (customMessage = null) => {
    const messageToSend = customMessage || message.trim();
    if (!messageToSend) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date(),
      citations: []
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customMessage) {
      setMessage('');
    }
    setIsTyping(true);

    try {
      let response;
      
      if (policyId) {
        // Policy-specific chat
        response = await aiAPI.queryPolicy({
          policy_id: policyId,
          question: messageToSend,
          analysis_type: 'general'
        });
      } else {
        // General policy chat - use the new general chat endpoint
        response = await aiAPI.generalChat(messageToSend);
      }

      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.response,
        timestamp: new Date(),
        citations: response.citations || [],
        mlInsights: response.ml_insights || {},
        conversationId: response.conversation_id,
        messageId: response.message_id
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // Store conversation in backend (already done by the API)
      console.log('✅ Conversation stored in backend:', {
        conversationId: response.conversation_id,
        messageId: response.message_id
      });
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get AI response. Please try again.');
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
        citations: []
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };



  const handleQuickQuestion = (question) => {
    setShowSuggestions(false);
    // Automatically send the question
    handleSendMessage(question);
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const formatTimestamp = (timestamp) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-lg"></div>
          <p className="text-gray-600">
            {policyId ? 'Loading policy data...' : 'Starting policy assistant...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User size={24} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access AI chat functionality.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText size={24} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Policy Not Found</h2>
          <p className="text-gray-600 mb-4">The policy you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </motion.button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {policyId ? `Policy Chat - ${policy?.name || 'Unknown Policy'}` : 'AI Insurance Assistant'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {policyId ? 'Ask questions about your specific policy' : 'Get help with general insurance questions'}
                    {messages.length > 0 && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {messages.length} message{messages.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {policyId && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{policy?.policy_type || 'Policy Type'}</p>
                  <p className="text-xs text-gray-500">{policy?.provider || 'Provider'}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <FileText size={20} className="text-white" />
                </div>
              </div>
            )}
            
            {/* Floating Conversation Counter */}
            <div className="absolute top-4 right-4">
              <div className="bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2">
                <div className="flex items-center space-x-2">
                  <MessageCircle size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {messages.length} message{messages.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Manual Scroll to Bottom Button */}
            {messages.length > 0 && (
              <div className="absolute top-4 right-32">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToBottom}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg border border-blue-200 px-3 py-2 transition-colors duration-200"
                  title="Scroll to bottom"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Chat Messages */}
          <div className="min-h-[600px] h-[600px] overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
            {/* Chat Header with Counter */}
            {messages.length > 0 && (
              <div className="mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Conversation History
                  </h3>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      Total Messages: <span className="font-semibold text-blue-600">{messages.length}</span>
                    </span>
                    <span className="text-sm text-gray-600">
                      AI Responses: <span className="font-semibold text-emerald-600">{messages.filter(m => m.type === 'ai').length}</span>
                    </span>
                    <span className="text-sm text-gray-600">
                      Your Messages: <span className="font-semibold text-indigo-600">{messages.filter(m => m.type === 'user').length}</span>
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={importChatHistory}
                      className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-medium rounded-lg transition-colors duration-200 border border-purple-200"
                      title="Import chat history"
                    >
                      Import
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={exportChatHistory}
                      className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium rounded-lg transition-colors duration-200 border border-green-200"
                      title="Export chat history"
                    >
                      Export
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearChatHistory}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition-colors duration-200 border border-red-200"
                      title="Clear chat history"
                    >
                      Clear Chat
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
            
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                  <Bot size={32} className="text-blue-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {policyId ? 'Start chatting about your policy' : 'Welcome to PolicyBridge AI'}
                  </h3>
                  <p className="text-gray-600 max-w-md mb-6">
                    {policyId 
                      ? 'Ask me anything about your policy document. I can help explain coverage, exclusions, claims process, and more.'
                      : 'I\'m here to help with all your insurance questions. Ask me about different types of coverage, policy terms, or general insurance advice.'
                    }
                  </p>
                  
                </div>
                
                                  {/* Quick Start Questions */}
                <div className="w-full max-w-2xl">
                  <h4 className="text-lg font-medium text-gray-800 mb-4 text-center">Quick Start Questions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {policyId ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage('What is covered under this policy?')}
                        className="p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors duration-200"
                      >
                        <p className="text-sm font-medium text-blue-900">What is covered?</p>
                        <p className="text-xs text-blue-700">Understand your coverage details</p>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage('What are the exclusions?')}
                        className="p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors duration-200"
                      >
                        <p className="text-sm font-medium text-orange-900">What\'s excluded?</p>
                        <p className="text-xs text-orange-700">Know what\'s not covered</p>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage('How do I file a claim?')}
                        className="p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors duration-200"
                      >
                        <p className="text-sm font-medium text-green-900">Claims process</p>
                        <p className="text-xs text-green-700">Step-by-step guide</p>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage('What is the premium and sum assured?')}
                        className="p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors duration-200"
                      >
                        <p className="text-sm font-medium text-purple-900">Cost & benefits</p>
                        <p className="text-xs text-purple-700">Premium and coverage amounts</p>
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage('What is term life insurance?')}
                        className="p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors duration-200"
                      >
                        <p className="text-sm font-medium text-blue-900">Term Life Insurance</p>
                        <p className="text-xs text-blue-700">Basic coverage explanation</p>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage('What is the difference between health and life insurance?')}
                        className="p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors duration-200"
                      >
                        <p className="text-sm font-medium text-green-900">Insurance Types</p>
                        <p className="text-xs text-green-700">Compare different policies</p>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage('How do I choose the right insurance policy?')}
                        className="p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors duration-200"
                      >
                        <p className="text-sm font-medium text-orange-900">Policy Selection</p>
                        <p className="text-xs text-orange-700">Tips for choosing wisely</p>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage('What are common insurance terms I should know?')}
                        className="p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors duration-200"
                      >
                        <p className="text-sm font-medium text-purple-900">Insurance Terms</p>
                        <p className="text-xs text-purple-700">Key terminology explained</p>
                      </motion.button>
                    </>
                  )}
                  </div>
                  
                  {/* Test Button */}
                  <div className="mt-6 text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSendMessage('Hello! Can you explain what insurance is?')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Test Chat - Ask About Insurance
                    </motion.button>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`mb-6 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-4xl ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    }`}>
                      {msg.type === 'user' ? (
                        <User size={20} className="text-white" />
                      ) : (
                        <Bot size={20} className="text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`flex-1 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block rounded-2xl px-6 py-4 shadow-lg ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}>
                        <div className="prose prose-sm max-w-none">
                          {msg.content.split('\n').map((line, lineIndex) => (
                            <p key={lineIndex} className={lineIndex > 0 ? 'mt-2' : ''}>
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* ML Insights */}
                      {msg.mlInsights && Object.keys(msg.mlInsights).length > 0 && (
                        <div className="mt-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                          <h4 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center">
                            <BarChart3 size={16} className="mr-2" />
                            AI Insights
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {msg.mlInsights.risk_level && (
                              <div className="text-xs bg-emerald-100 rounded-lg px-3 py-2">
                                <span className="font-medium text-emerald-800">Risk:</span> {msg.mlInsights.risk_level}
                              </div>
                            )}
                            {msg.mlInsights.coverage_score && (
                              <div className="text-xs bg-teal-100 rounded-lg px-3 py-2">
                                <span className="font-medium text-teal-800">Coverage Score:</span> {msg.mlInsights.coverage_score}
                              </div>
                            )}
                            {msg.mlInsights.recommendations && (
                              <div className="text-xs bg-blue-100 rounded-lg px-3 py-2 col-span-full">
                                <span className="font-medium text-blue-800">Recommendations:</span> {msg.mlInsights.recommendations}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Message Actions */}
                      <div className={`flex items-center justify-between mt-3 ${
                        msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{formatTimestamp(msg.timestamp)}</span>
                        {msg.type === 'ai' && (
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => copyMessage(msg.content)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                              title="Copy message"
                            >
                              <Copy size={14} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                const blob = new Blob([msg.content], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `policy-chat-${new Date().toISOString().split('T')[0]}.txt`;
                                a.click();
                                URL.revokeObjectURL(url);
                                toast.success('Chat downloaded!');
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                              title="Download message"
                            >
                              <Download size={14} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                if (navigator.share) {
                                  navigator.share({
                                    title: 'Policy Chat',
                                    text: msg.content.substring(0, 100) + '...',
                                    url: window.location.href
                                  });
                                } else {
                                  copyMessage(msg.content);
                                  toast.success('Message copied to clipboard!');
                                }
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                              title="Share message"
                            >
                              <Share2 size={14} />
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div className="bg-white shadow-lg border border-gray-200 rounded-2xl px-6 py-4">
                    <div className="flex space-x-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-3 h-3 bg-emerald-500 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-3 h-3 bg-emerald-500 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-3 h-3 bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-6">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={policyId 
                    ? "Ask me anything about your policy..." 
                    : "Ask me about insurance..."
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                  rows={3}
                  disabled={isTyping}
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage()}
                disabled={!message.trim() || isTyping}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  !message.trim() || isTyping
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                }`}
              >
                <Send size={18} />
                <span>Send</span>
              </motion.button>
            </div>
            
            {/* Character count and tips */}
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <span>{message.length}/1000 characters</span>
              <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
