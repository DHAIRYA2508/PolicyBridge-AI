import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  MoreHorizontal
} from 'lucide-react';

const ChatView = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Mock data
  const policy = {
    id: policyId,
    name: 'Employee Health Insurance Policy',
    type: 'Insurance',
    fileType: 'PDF',
    pages: 24,
    size: '2.4 MB'
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Hello! I've analyzed your **${policy.name}** document. I can help you understand any specific clauses, coverage details, or answer questions about this policy. What would you like to know?`,
      timestamp: new Date(Date.now() - 300000),
      citations: []
    },
    {
      id: 2,
      type: 'user',
      content: 'What are the coverage limits for dental procedures?',
      timestamp: new Date(Date.now() - 240000),
      citations: []
    },
    {
      id: 3,
      type: 'ai',
      content: `Based on your policy, dental procedures have the following coverage limits:

**Basic Dental Coverage:**
- Annual maximum: $1,500 per person
- Deductible: $50 per person, $150 per family
- Coinsurance: 80% after deductible

**Major Procedures:**
- Root canals: Covered at 50% after deductible
- Crowns: Covered at 50% after deductible
- Orthodontics: $2,000 lifetime maximum

**Reference:** Section 3.2.1 - Dental Benefits, Page 12

Would you like me to explain any specific procedure coverage in more detail?`,
      timestamp: new Date(Date.now() - 180000),
      citations: [
        { page: 12, section: '3.2.1', text: 'Dental Benefits and Coverage Limits' }
      ]
    }
  ]);

  const quickQuestions = [
    'What is the waiting period for pre-existing conditions?',
    'How do I file a claim?',
    'What is covered under emergency care?',
    'Are prescription drugs covered?',
    'What is the out-of-network coverage?',
    'How do I add dependents to the policy?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date(),
      citations: []
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateMockResponse(message.trim()),
        timestamp: new Date(),
        citations: [
          { page: Math.floor(Math.random() * 24) + 1, section: `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 5) + 1}`, text: 'Relevant policy section' }
        ]
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateMockResponse = (userQuestion) => {
    const responses = [
      `Based on your **${policy.name}**, ${userQuestion.toLowerCase().includes('coverage') ? 'the coverage details are clearly outlined in Section 4.2.' : 'this information can be found in the policy document.'} 

**Key Points:**
- The policy provides comprehensive coverage for most scenarios
- There are specific exclusions mentioned in Section 2.1
- Claims must be filed within 90 days of service

**Reference:** Section 4.2 - Coverage Details, Page 18

Would you like me to elaborate on any specific aspect?`,

      `Great question! According to your policy, ${userQuestion.toLowerCase().includes('claim') ? 'the claims process is straightforward and well-documented.' : 'this is covered under the standard benefits.'}

**Process Overview:**
- Submit claim form within 90 days
- Include all relevant documentation
- Processing time: 10-15 business days
- Appeals available if denied

**Reference:** Section 5.1 - Claims Process, Page 22

Is there anything specific about this process you'd like me to clarify?`,

      `Your **${policy.name}** addresses this in detail. Here's what you need to know:

**Important Information:**
- Coverage varies by service type
- Some services require pre-authorization
- Network vs. out-of-network benefits differ
- Annual limits apply to most services

**Reference:** Section 3.1 - Benefits Overview, Page 10

Would you like me to break down the coverage for a specific service?`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleQuickQuestion = (question) => {
    setMessage(question);
    setShowSuggestions(false);
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-soft border-b border-gray-100 sticky top-16 z-40"
        >
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 text-text-secondary hover:text-secondary-500 hover:bg-secondary-50 rounded-lg transition-colors duration-200"
                >
                  <ArrowLeft size={20} />
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-accent1-500 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-white" />
                  </div>
                  <div>
                    <h1 className="font-semibold text-text-primary">{policy.name}</h1>
                    <p className="text-sm text-text-secondary">
                      {policy.fileType} • {policy.pages} pages • {policy.size}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-text-secondary hover:text-secondary-500 hover:bg-secondary-50 rounded-lg transition-colors duration-200"
                  title="Download Policy"
                >
                  <Download size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-text-secondary hover:text-secondary-500 hover:bg-secondary-50 rounded-lg transition-colors duration-200"
                  title="Share Chat"
                >
                  <Share2 size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-text-secondary hover:text-secondary-500 hover:bg-secondary-50 rounded-lg transition-colors duration-200"
                  title="Bookmark"
                >
                  <Bookmark size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-text-secondary hover:text-secondary-500 hover:bg-secondary-50 rounded-lg transition-colors duration-200"
                  title="More Options"
                >
                  <MoreHorizontal size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat Container */}
        <div className="flex h-[calc(100vh-8rem)]">
          {/* Main Chat */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`mb-6 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-3xl ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.type === 'user' 
                          ? 'bg-secondary-500' 
                          : 'bg-gradient-to-br from-accent1-500 to-accent2-500'
                      }`}>
                        {msg.type === 'user' ? (
                          <User size={16} className="text-white" />
                        ) : (
                          <Bot size={16} className="text-white" />
                        )}
                      </div>
                      
                      <div className={`rounded-2xl px-4 py-3 ${
                        msg.type === 'user'
                          ? 'bg-secondary-500 text-white'
                          : 'bg-white shadow-soft border border-gray-100'
                      }`}>
                        <div className="prose prose-sm max-w-none">
                          <div 
                            className={`${
                              msg.type === 'user' ? 'text-white' : 'text-text-primary'
                            }`}
                            dangerouslySetInnerHTML={{ 
                              __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                            }}
                          />
                        </div>
                        
                        {/* Citations */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-text-secondary mb-2">References:</p>
                            {msg.citations.map((citation, idx) => (
                              <div key={idx} className="text-xs bg-primary-50 rounded px-2 py-1 mb-1">
                                <span className="font-medium">Page {citation.page}</span>
                                {citation.section && <span className="mx-2">•</span>}
                                {citation.section && <span className="font-medium">Section {citation.section}</span>}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className={`flex items-center justify-between mt-3 ${
                          msg.type === 'user' ? 'text-white/70' : 'text-text-muted'
                        }`}>
                          <span className="text-xs">{formatTimestamp(msg.timestamp)}</span>
                          {msg.type === 'ai' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => copyMessage(msg.content)}
                              className="p-1 hover:bg-white/20 rounded transition-colors duration-200"
                              title="Copy message"
                            >
                              <Copy size={14} />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent1-500 to-accent2-500 flex items-center justify-center">
                        <Bot size={16} className="text-white" />
                      </div>
                      <div className="bg-white shadow-soft border border-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex space-x-1">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            className="w-2 h-2 bg-accent1-500 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 bg-accent1-500 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 bg-accent1-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>

            {/* Quick Questions */}
            {showSuggestions && messages.length <= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 sm:px-6 lg:px-8 pb-4"
              >
                <p className="text-sm text-text-secondary mb-3">Quick questions to get started:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickQuestion(question)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-text-secondary hover:border-secondary-300 hover:text-secondary-600 transition-colors duration-200"
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input */}
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask a question about your policy..."
                    className="input-field w-full"
                  />
                </div>
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isTyping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
