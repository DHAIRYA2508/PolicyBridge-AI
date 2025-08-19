import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { policyAPI, aiAPI } from '../services/api';
import toast from 'react-hot-toast';

import { 
  Search, 
  Plus, 
  Download, 
  MessageSquare, 
  Eye, 
  Trash2, 
  FileText,
  Clock,
  BarChart3,
  Upload,
  Settings,
  RefreshCw,
  X,
  Bot,
  FileText as FileTextIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Building,
  Tag,
  Shield,
  Edit,
  Brain,
  Wifi
} from 'lucide-react';

const DashboardEnhanced = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showExtractionModal, setShowExtractionModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    provider: '',
    policy_type: '',
    file: null
  });
  const [editForm, setEditForm] = useState({
    id: null,
    name: '',
    provider: '',
    policy_type: ''
  });
  const [uploading, setUploading] = useState(false);
  const [extractedDetails, setExtractedDetails] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [policies, setPolicies] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [conversationCount, setConversationCount] = useState(0);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch policies
      const policiesResponse = await policyAPI.getPolicies();
      
      if (policiesResponse?.data?.results) {
        const policiesData = Array.isArray(policiesResponse.data.results) ? policiesResponse.data.results : [];
        setPolicies(policiesData);
        
        // Calculate total conversation count from policies
        const totalConversations = policiesData.reduce((total, policy) => {
          return total + (parseInt(policy.conversation_count) || 0);
        }, 0);
        setConversationCount(totalConversations);
      } else {
        setPolicies([]);
        setConversationCount(0);
      }
      
      // Fetch stats
      try {
        const statsResponse = await policyAPI.getPolicyStats();
        setStats(statsResponse?.data || {});
      } catch (statsError) {
        console.warn('Could not fetch stats:', statsError);
        setStats({});
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setPolicies([]);
      setConversationCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search policies
  const filteredPolicies = useMemo(() => {
    let filtered = policies || [];
    
    // Apply search filter
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(policy => 
        (policy.name && policy.name.toLowerCase().includes(searchLower)) ||
        (policy.provider && policy.provider.toLowerCase().includes(searchLower)) ||
        (policy.policy_type && policy.policy_type.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply type filter
    if (selectedFilter && selectedFilter !== 'all') {
      filtered = filtered.filter(policy => 
        policy.policy_type && policy.policy_type.toLowerCase() === selectedFilter.toLowerCase()
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered = [...filtered].sort((a, b) => {
          const nameA = (a.name || '').toLowerCase();
          const nameB = (b.name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
        break;
      case 'size':
        filtered = [...filtered].sort((a, b) => {
          const sizeA = parseInt(a.file_size) || 0;
          const sizeB = parseInt(b.file_size) || 0;
          return sizeA - sizeB;
        });
        break;
      case 'recent':
      default:
        filtered = [...filtered].sort((a, b) => {
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateB - dateA;
        });
        break;
    }
    
    return filtered;
  }, [policies, searchTerm, selectedFilter, sortBy]);

  // Fetch data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch policies
        const policiesResponse = await policyAPI.getPolicies();
        if (policiesResponse?.data?.results) {
          const policiesData = Array.isArray(policiesResponse.data.results) ? policiesResponse.data.results : [];
          setPolicies(policiesData);
          
          // Calculate total conversation count from policies
          const totalConversations = policiesData.reduce((total, policy) => {
            return total + (parseInt(policy.conversation_count) || 0);
          }, 0);
          setConversationCount(totalConversations);
        } else {
          setPolicies([]);
          setConversationCount(0);
        }
        
        // Fetch stats
        try {
          const statsResponse = await policyAPI.getPolicyStats();
          setStats(statsResponse?.data || {});
        } catch (statsError) {
          console.warn('Could not fetch stats:', statsError);
          setStats({});
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        setPolicies([]);
        setConversationCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Add focus event listener to refresh data when user returns to dashboard
    const handleFocus = () => {
      console.log('🔄 Dashboard focused, refreshing conversation count...');
      fetchDashboardData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  const handleRefreshDashboard = async () => {
    setRefreshing(true);
    try {
      await fetchDashboardData();
      toast.success('Dashboard refreshed!');
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      toast.error('Failed to refresh dashboard');
    } finally {
      setRefreshing(false);
    }
  };

  // Test API connection
  const testAPIConnection = async () => {
    try {
      console.log('🧪 Testing API connection...');
      const token = localStorage.getItem('token') || localStorage.getItem('access');
      console.log('🔑 Token available:', !!token);
      
      // Test basic connectivity
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/ai/test-endpoint/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend connection successful:', data);
        toast.success('Backend connection successful!');
        return true;
      } else {
        console.error('❌ Backend connection failed:', response.status);
        toast.error(`Backend connection failed: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error('❌ API connection test failed:', error);
      toast.error('API connection test failed. Check console for details.');
      return false;
    }
  };

  const handleExtractPolicyDetails = async (policyId) => {
    if (!policyId) {
      toast.error('Policy ID is required');
      return;
    }

    console.log('🔍 Starting policy extraction for ID:', policyId);
    setExtracting(true);
    setShowExtractionModal(true);
    
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token') || localStorage.getItem('access');
      if (!token) {
        toast.error('Please log in to analyze policies');
        return;
      }

      console.log('🔑 Token available:', !!token);
      console.log('🚀 Calling AI API for policy extraction...');

      const response = await aiAPI.extractPolicyDetails(policyId);
      
      console.log('📊 AI API Response:', response);
      console.log('📊 Response data:', response?.data);
      
      // The API is returning data directly at the top level, not under response.data
      if (response && (response.summary || response.coverage || response.mlInsights)) {
        console.log('✅ Setting extracted details:', response);
        setExtractedDetails(response);
        toast.success('Policy analysis completed!');
      } else {
        console.error('❌ No valid data structure found in response:', response);
        toast.error('Invalid response format from AI analysis');
      }
    } catch (error) {
      console.error('❌ Error in AI extraction:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 404) {
        toast.error('Policy not found or access denied.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(`Failed to analyze policy: ${error.message || 'Unknown error'}`);
      }
      
      // Fallback to mock data for demonstration
      console.log('🔄 Using fallback mock data');
      const mockData = {
        summary: `Policy analysis for policy ID ${policyId}. This is a comprehensive insurance policy with standard coverage.`,
        coverage: 'Standard insurance coverage with comprehensive protection',
        effectiveDate: 'January 1, 2024',
        expiryDate: 'December 31, 2024',
        department: 'Insurance',
        deductible: 'Standard deductible applies',
        maxOutOfPocket: 'Maximum out-of-pocket expenses as per policy terms',
        tags: ['Insurance', 'Comprehensive', 'Standard Coverage'],
        mlInsights: {
          riskAssessment: 'Low Risk',
          coverageScore: 85,
          costEfficiency: 'Good Value',
          marketComparison: 'Competitive in Market',
          optimizationTips: [
            'Consider bundling with other policies',
            'Review coverage annually',
            'Maintain good standing for discounts'
          ]
        }
      };
      setExtractedDetails(mockData);
    } finally {
      setExtracting(false);
    }
  };

  // Refresh dashboard data
  const refreshDashboardData = async () => {
    try {
      setRefreshing(true);
      console.log('🔄 Refreshing dashboard data...');
      
      // Fetch policies and stats in parallel
      const [policiesResponse, statsResponse] = await Promise.all([
        policyAPI.getPolicies(),
        policyAPI.getPolicyStats()
      ]);
      
      console.log('📄 Refreshed policies:', policiesResponse?.data);
      console.log('📊 Refreshed stats:', statsResponse?.data);
      
      // Ensure policies is always an array
      const policiesData = Array.isArray(policiesResponse?.data?.results) ? policiesResponse.data.results : [];
      setPolicies(policiesData);
      
      // Update conversation count
      const totalConversations = policiesData.reduce((total, policy) => {
        return total + (parseInt(policy.conversation_count) || 0);
      }, 0);
      setConversationCount(totalConversations);
      
      setStats(statsResponse?.data || {});
      
      toast.success('Dashboard refreshed successfully!');
    } catch (error) {
      console.error('❌ Error refreshing dashboard:', error);
      toast.error('Failed to refresh dashboard');
    } finally {
      setRefreshing(false);
    }
  };

  // Real user data - no mock data
  const userStats = [
    {
      title: 'Total Policies',
      value: (policies || []).length || '0',
      change: '+0%',
      trend: 'neutral',
      icon: FileText,
      color: 'from-primary-500 to-primary-600'
    },
    {
      title: 'AI Conversations',
      value: conversationCount.toString(),
      change: '+0%',
      trend: 'neutral',
      icon: MessageSquare,
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      title: 'Files Uploaded',
      value: (policies || []).length || '0',
      change: '+0%',
      trend: 'neutral',
      icon: Upload,
      color: 'from-accent1-500 to-accent1-600'
    },
    {
      title: 'Storage Used',
      value: policies.length > 0 ? `${Math.round(policies.reduce((total, policy) => total + (parseInt(policy.file_size) || 0), 0) / 1024 / 1024 * 100) / 100} MB` : '0 MB',
      change: '+0%',
      trend: 'neutral',
      icon: BarChart3,
      color: 'from-accent2-500 to-accent2-600'
    }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid file (PDF, DOCX, or DOC)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setUploadForm(prev => ({ ...prev, file }));
      toast.success(`File "${file.name}" selected successfully!`);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid file (PDF, DOCX, or DOC)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setUploadForm(prev => ({ ...prev, file }));
      toast.success(`File "${file.name}" dropped successfully!`);
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.name || !uploadForm.provider || !uploadForm.policy_type || !uploadForm.file) {
      toast.error('Please fill in all fields and select a file');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', uploadForm.name);
      formData.append('provider', uploadForm.provider);
      formData.append('policy_type', uploadForm.policy_type);
      formData.append('document', uploadForm.file);
      
      const response = await policyAPI.uploadPolicy(formData);
      
      if (response.data) {
        toast.success('Policy uploaded successfully!');
        setShowUploadModal(false);
        setUploadForm({ name: '', provider: '', policy_type: '', file: null });
        
        // Refresh the policies list
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to upload policy. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadForm({ name: '', provider: '', policy_type: '', file: null });
    setShowUploadModal(false);
  };

  // Add delete policy function
  const handleDeletePolicy = async (policyId, policyName) => {
    if (!policyId) {
      toast.error('Policy ID is required');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${policyName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log('🗑️ Attempting to delete policy:', policyId, policyName);
      const response = await policyAPI.deletePolicy(policyId);
      
      console.log('🗑️ Delete response:', response);
      
      if (response.status === 204 || response.status === 200) {
        toast.success(`Policy "${policyName}" deleted successfully!`);
        
        // Remove the deleted policy from the local state
        setPolicies(prevPolicies => prevPolicies.filter(policy => policy.id !== policyId));
        
        // Refresh dashboard data to update stats
        await fetchDashboardData();
      } else {
        console.error('🗑️ Unexpected response status:', response.status);
        toast.error('Failed to delete policy');
      }
    } catch (error) {
      console.error('🗑️ Delete error:', error);
      console.error('🗑️ Error response:', error.response);
      console.error('🗑️ Error status:', error.response?.status);
      console.error('🗑️ Error data:', error.response?.data);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.status === 404) {
        toast.error('Policy not found or already deleted');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to delete this policy');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later');
      } else {
        toast.error(`Failed to delete policy: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleDownloadPolicy = async (policy) => {
    if (!policy.document) {
      toast.error('No document available for download');
      return;
    }

    try {
      // Create a download link for the document
      const link = document.createElement('a');
      link.href = policy.document;
      link.download = policy.name || 'policy-document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Policy document download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download policy document');
    }
  };

  const handleEditPolicy = (policy) => {
    setEditForm({
      id: policy.id,
      name: policy.name || '',
      provider: policy.provider || '',
      policy_type: policy.policy_type || ''
    });
    setShowEditModal(true);
  };

  const handleUpdatePolicy = async () => {
    if (!editForm.name || !editForm.provider || !editForm.policy_type) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await policyAPI.updatePolicy(editForm.id, {
        name: editForm.name,
        provider: editForm.provider,
        policy_type: editForm.policy_type
      });

      if (response.data) {
        toast.success('Policy updated successfully!');
        setShowEditModal(false);
        setEditForm({ id: null, name: '', provider: '', policy_type: '' });
        
        // Update the policy in local state
        setPolicies(prevPolicies => 
          prevPolicies.map(policy => 
            policy.id === editForm.id 
              ? { ...policy, name: editForm.name, provider: editForm.provider, policy_type: editForm.policy_type }
              : policy
          )
        );
        
        // Refresh conversation count
        await refreshDashboardData();
      }
    } catch (error) {
      console.error('Update error:', error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to update policy. Please try again.');
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-gray-800">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                {(policies || []).length === 0 
                  ? `Welcome, ${user?.first_name || user?.name || 'User'}! Start building your policy library by uploading your first document.`
                  : `Welcome back, ${user?.first_name || user?.name || 'User'}! You have ${(policies || []).length} policy document${(policies || []).length === 1 ? '' : 's'}.`
                }
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUploadModal(true)}
                className="btn-primary flex items-center gap-2 px-6 py-3"
              >
                <Plus size={20} />
                Upload Policy
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefreshDashboard}
                className="btn-outline flex items-center gap-2 px-6 py-3"
                title="Refresh Dashboard"
              >
                <RefreshCw size={20} />
                Refresh
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (policies.length > 0) {
                    navigate(`/chat/${policies[0].id}`);
                  } else {
                    navigate('/chat');
                  }
                }}
                className="btn-outline flex items-center gap-2 px-6 py-3 relative"
                title="Start Policy Chat"
              >
                <MessageSquare size={20} />
                {policies.length > 0 ? 'Start Chat' : 'General Chat'}
                {/* Total Conversation Count Badge */}
                {conversationCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {conversationCount}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card card-hover p-6"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <stat.icon size={28} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {stat.value || '0'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.title || 'Stat'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-8">
          {/* Main Content */}
          <div>
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card p-6 mb-6"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search policies by name, provider, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10 h-12"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="input-field h-12 min-w-[140px]"
                  >
                    <option value="all">All Types</option>
                    <option value="health">Health Insurance</option>
                    <option value="auto">Auto Insurance</option>
                    <option value="home">Home Insurance</option>
                    <option value="life">Life Insurance</option>
                    <option value="business">Business Insurance</option>
                    <option value="other">Other</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input-field h-12 min-w-[140px]"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="name">Name A-Z</option>
                    <option value="size">File Size</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Policies List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card overflow-hidden"
            >
              <div className="p-6 border-b border-primary-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Your Policies ({filteredPolicies.length})
                </h3>
              </div>
              
              {(policies || []).length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent3-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <FileText size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">No policies uploaded yet</h3>
                  <p className="text-gray-500 mb-8 text-lg">Start by uploading your first policy document to get started with Gemini 2.5 Flash AI analysis.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUploadModal(true)}
                    className="btn-primary flex items-center gap-3 mx-auto px-8 py-4 text-lg"
                  >
                    <Plus size={24} />
                    Upload Your First Policy
                  </motion.button>
                </div>
              ) : filteredPolicies.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search size={28} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">No policies found</h3>
                    <p className="text-gray-500 mb-8 text-lg">
                      {searchTerm || selectedFilter !== 'all' 
                        ? 'Try adjusting your search or filters'
                        : 'Start by uploading your first policy document'
                      }
                    </p>
                    {searchTerm || selectedFilter !== 'all' ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedFilter('all');
                        }}
                        className="btn-outline px-8 py-3 text-lg"
                      >
                        Clear Filters
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowUploadModal(true)}
                        className="btn-primary px-8 py-3 text-lg"
                      >
                        Upload Policy
                      </motion.button>
                    )}
                  </div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredPolicies.map((policy, index) => {
                    return (
                    <motion.div
                      key={policy.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden min-h-[280px]"
                    >
                      {/* Policy Header */}
                      <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 text-xl mb-3 leading-tight">
                              {policy.name || 'Unnamed Policy'}
                            </h4>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-primary-500 text-white shadow-md">
                                {policy.policy_type || 'Insurance'}
                              </span>
                              {policy.provider && (
                                <span className="px-4 py-2 bg-secondary-500 text-white rounded-full text-sm font-semibold shadow-md">
                                  {policy.provider}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Policy Details */}
                      <div className="p-8">
                        <div className="space-y-4 mb-8">
                          <div className="flex items-center gap-3 text-base text-gray-700">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                              <FileText size={20} className="text-primary-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">File Size:</span>
                              <span className="ml-2">
                                {policy.file_size ? (() => {
                                  const sizeInBytes = parseInt(policy.file_size) || 0;
                                  if (sizeInBytes === 0) return '0 B';
                                  const k = 1024;
                                  const sizes = ['B', 'KB', 'MB', 'GB'];
                                  const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));
                                  return parseFloat((sizeInBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                                })() : 'Unknown size'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-base text-gray-700">
                            <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                              <CalendarIcon size={20} className="text-secondary-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">Uploaded:</span>
                              <span className="ml-2">
                                {policy.created_at ? new Date(policy.created_at).toLocaleDateString() : 'Unknown date'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-base text-gray-700">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <Shield size={20} className="text-green-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">Status:</span>
                              <span className="ml-2 text-green-600 font-semibold">Active</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleExtractPolicyDetails(policy.id)}
                              className="w-12 h-12 text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors duration-200 flex items-center justify-center border border-primary-200"
                              title="Analyze Policy with Gemini 2.5 Flash AI"
                            >
                              <Eye size={20} />
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => navigate(`/chat/${policy.id}`)}
                              className="w-12 h-12 text-secondary-500 hover:text-secondary-600 hover:bg-secondary-50 rounded-xl transition-colors duration-200 flex items-center justify-center relative border border-secondary-200"
                              title="Start Chat"
                            >
                              <MessageSquare size={20} />
                              {/* Conversation Count Badge */}
                              <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                {policy.conversation_count || 0}
                              </span>
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDownloadPolicy(policy)}
                              className="w-12 h-12 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors duration-200 flex items-center justify-center border border-green-200"
                              title="Download Policy"
                            >
                              <Download size={20} />
                            </motion.button>
                          </div>

                          <div className="flex items-center gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEditPolicy(policy)}
                              className="w-12 h-12 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200 flex items-center justify-center border border-blue-200"
                              title="Edit Policy Details"
                            >
                              <Edit size={20} />
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeletePolicy(policy.id, policy.name)}
                              className="w-12 h-12 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 flex items-center justify-center border border-red-200"
                              title="Delete Policy"
                            >
                              <Trash2 size={20} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )})}
                </div>
              )}
            </motion.div>
          </div>

          {/* Additional Sections Below Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-secondary-600 to-secondary-800 rounded-2xl p-8 text-white shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6">
                Welcome to PolicyBridge AI! 🎉
              </h3>
              <p className="text-lg text-secondary-100 mb-8 leading-relaxed">
                You're all set to start analyzing policies with Gemini 2.5 Flash AI. Upload your first document to get started.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUploadModal(true)}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 border border-white/30 text-lg"
              >
                Get Started
              </motion.button>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-accent1-500 to-accent1-600 rounded-2xl p-8 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">
                  Quick Actions
                </h3>
                {/* Total Conversations Counter */}
                <div className="text-right">
                  <div className="text-sm text-accent1-100 mb-1">Total Conversations</div>
                  <div className="text-3xl font-bold">
                    {conversationCount}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUploadModal(true)}
                  className="w-full text-left p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors duration-200 flex items-center gap-4 border border-white/20"
                >
                  <Upload size={24} />
                  <span className="text-lg font-medium">Upload New Policy</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/chat')}
                  className="w-full text-left p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors duration-200 flex items-center gap-4 border border-white/20"
                >
                  <MessageSquare size={24} />
                  <span className="text-lg font-medium">Start General Chat</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Upload New Policy
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Policy Name
                  </label>
                  <input
                    type="text"
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    placeholder="Enter policy name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Insurance Provider
                  </label>
                  <input
                    type="text"
                    value={uploadForm.provider || ''}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, provider: e.target.value }))}
                    className="input-field"
                    placeholder="Enter insurance provider name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Policy Type
                  </label>
                  <select 
                    value={uploadForm.policy_type || ''}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, policy_type: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Select type</option>
                    <option value="health">Health Insurance</option>
                    <option value="auto">Auto Insurance</option>
                    <option value="home">Home Insurance</option>
                    <option value="life">Life Insurance</option>
                    <option value="business">Business Insurance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Policy Document
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`w-full px-4 py-3 border-2 border-dashed rounded-xl transition-all duration-200 ${
                      dragActive ? 'border-primary-500 bg-primary-50' : 'border-primary-300'
                    }`}
                  >
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.doc"
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600"
                    />
                    <div className="text-center mt-2">
                      <p className="text-sm text-gray-800">Drag and drop your file here, or click to browse</p>
                      <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, DOCX, DOC</p>
                    </div>
                    {uploadForm.file && (
                      <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">✓ {uploadForm.file.name} selected</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button
                  onClick={resetUploadForm}
                  className="flex-1 btn-outline py-3 text-lg"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 btn-primary flex items-center justify-center gap-3 py-3 text-lg"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    'Upload Policy'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Policy Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Edit Policy Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Policy Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    placeholder="Enter policy name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Insurance Provider
                  </label>
                  <input
                    type="text"
                    value={editForm.provider || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, provider: e.target.value }))}
                    className="input-field"
                    placeholder="Enter insurance provider name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Policy Type
                  </label>
                  <select 
                    value={editForm.policy_type || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, policy_type: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Select type</option>
                    <option value="health">Health Insurance</option>
                    <option value="auto">Auto Insurance</option>
                    <option value="home">Home Insurance</option>
                    <option value="life">Life Insurance</option>
                    <option value="business">Business Insurance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditForm({ id: null, name: '', provider: '', policy_type: '' });
                  }}
                  className="flex-1 btn-outline py-3 text-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdatePolicy}
                  className="flex-1 btn-primary flex items-center justify-center gap-3 py-3 text-lg"
                >
                  Update Policy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Policy Details Extraction Modal */}
      <AnimatePresence>
        {showExtractionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-primary-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent3-500 rounded-xl flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                  </div>
                                      <div>
                      <h2 className="text-xl font-bold text-gray-800">AI Policy Analysis</h2>
                      <p className="text-sm text-gray-600">Powered by Gemini 2.5 Flash</p>
                    </div>
                </div>
                <button
                  onClick={() => setShowExtractionModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-800 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Helpful Message */}
                {!extractedDetails || (extractedDetails.extraction_confidence && extractedDetails.extraction_confidence < 0.8) ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">ℹ️</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-blue-800 mb-1">Getting Better Results</h4>
                        <p className="text-sm text-blue-700">
                          For more accurate analysis, ensure your policy document:
                        </p>
                        <ul className="text-sm text-blue-700 mt-2 space-y-1">
                          <li>• Contains clear, readable text (not just images)</li>
                          <li>• Includes policy dates, coverage amounts, and terms</li>
                          <li>• Is in PDF, DOCX, or DOC format</li>
                          <li>• Has been properly uploaded and processed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : null}
                
                {extracting ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                         <p className="text-gray-600">Gemini 2.5 Flash is analyzing your policy document...</p>
                  </div>
                ) : extractedDetails ? (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="bg-gradient-to-br from-primary-50 to-accent1-100 p-6 rounded-xl border border-primary-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FileTextIcon size={20} className="text-primary-500" />
                        Policy Summary
                      </h3>
                      
                      {/* Handle new nested summary structure */}
                      {extractedDetails.summary && typeof extractedDetails.summary === 'object' ? (
                        <div className="space-y-4">
                          {/* Overview */}
                          {extractedDetails.summary.overview && (
                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Overview</h4>
                              <p className="text-gray-600 leading-relaxed">
                                {extractedDetails.summary.overview}
                              </p>
                            </div>
                          )}
                                                  
                          {/* Key Points */}
                          {extractedDetails.summary.points && Array.isArray(extractedDetails.summary.points) && (
                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Key Points</h4>
                              <ul className="space-y-2">
                                {extractedDetails.summary.points.map((point, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span className="text-gray-600">{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Handle old flat summary structure for backward compatibility */
                        <p className="text-gray-600 leading-relaxed">
                          {extractedDetails.summary || 'Policy analysis summary will be generated here. Please ensure your policy document is properly uploaded and contains readable text.'}
                        </p>
                      )}
                    </div>

                    {/* ML Insights */}
                    {extractedDetails.mlInsights && (
                      <div className="bg-white p-6 rounded-xl border border-primary-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Brain size={20} className="text-primary-500" />
                          AI Insights
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Risk Assessment:</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                extractedDetails.mlInsights?.riskAssessment === 'Low' ? 'bg-green-100 text-green-700' :
                                extractedDetails.mlInsights?.riskAssessment === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                extractedDetails.mlInsights?.riskAssessment === 'High' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {extractedDetails.mlInsights?.riskAssessment || 'Analysis pending'}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Coverage Score:</span>
                              <span className="text-gray-800 font-semibold">
                                {extractedDetails.mlInsights?.coverageScore || '--'}/100
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Cost Efficiency:</span>
                              <span className="text-gray-800 font-semibold">
                                {extractedDetails.mlInsights?.costEfficiency || 'Analysis pending'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Market Comparison:</span>
                              <span className="text-gray-800 font-semibold">
                                {extractedDetails.mlInsights?.marketComparison || 'Analysis pending'}
                              </span>
                            </div>
                            
                            <div>
                              <span className="text-sm font-medium text-gray-600 block mb-2">Optimization Tips:</span>
                              <ul className="space-y-1">
                                {extractedDetails.mlInsights?.optimizationTips && extractedDetails.mlInsights.optimizationTips.length > 0 ? (
                                  extractedDetails.mlInsights.optimizationTips.map((tip, index) => (
                                    <li key={index} className="text-sm text-gray-800 flex items-start gap-2">
                                      <span className="w-1.5 h-1.5 bg-accent1-500 rounded-full mt-2 flex-shrink-0"></span>
                                      {tip}
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-sm text-gray-500">AI analysis will generate personalized tips based on your policy content</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {extractedDetails.tags && extractedDetails.tags.length > 0 ? (
                      <div className="bg-white p-6 rounded-xl border border-primary-200">
                        <h3 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                          <Tag size={16} className="text-accent3-500" />
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {extractedDetails.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                              {tag || 'Unknown'}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-6 rounded-xl border border-primary-200">
                        <h3 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                          <Tag size={16} className="text-accent3-500" />
                          Tags
                        </h3>
                        <p className="text-gray-500 text-sm">AI analysis will automatically generate relevant tags based on your policy content</p>
                      </div>
                    )}

                    {/* Download Summary Report */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                          <Download className="w-5 h-5" />
                          Download Summary Report
                        </h4>
                      </div>
                      <p className="text-blue-700 mb-4 text-sm">
                        Generate a comprehensive PDF report of your policy analysis with AI insights and recommendations.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          try {
                            if (!extractedDetails) {
                              toast.error('No analysis data available for download');
                              return;
                            }

                            const summaryContent = `
                              <!DOCTYPE html>
                              <html>
                              <head>
                                <meta charset="utf-8">
                                <title>PolicyBridge AI - Policy Analysis Summary</title>
                                <style>
                                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
                                  .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                                  .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
                                  .logo { font-size: 28px; font-weight: bold; color: #f59e0b; margin-bottom: 8px; }
                                  .subtitle { color: #6b7280; font-size: 16px; }
                                  .section { margin-bottom: 30px; }
                                  .section-title { font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 15px; padding: 12px 16px; background: #f3f4f6; border-radius: 8px; border-left: 4px solid #f59e0b; }
                                  .summary-box { background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; line-height: 1.6; color: #0c4a6e; }
                                  .insights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
                                  .insight-item { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; }
                                  .insight-label { font-weight: 500; color: #92400e; margin-bottom: 8px; }
                                  .insight-value { font-size: 18px; font-weight: 600; color: #78350f; }
                                  .tips-list { background: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 16px; }
                                  .tip-item { margin: 8px 0; padding-left: 20px; position: relative; }
                                  .tip-item:before { content: "•"; color: #22c55e; font-weight: bold; position: absolute; left: 0; }
                                  .tags-container { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }
                                  .tag { background: #f3f4f6; color: #374151; padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: 500; }
                                  .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
                                </style>
                              </head>
                              <body>
                                <div class="container">
                                  <div class="header">
                                    <div class="logo">PolicyBridge AI</div>
                                    <div class="subtitle">Policy Analysis Summary</div>
                                    <div style="color: #6b7280; margin-top: 8px;">Generated on: ${new Date().toLocaleDateString()}</div>
                                  </div>
                                  <div class="section">
                                    <div class="section-title">🤖 AI Analysis Summary</div>
                                    <div class="summary-box">
                                      ${(() => {
                                        if (extractedDetails.summary && typeof extractedDetails.summary === 'object') {
                                          let summaryHtml = '';
                                          if (extractedDetails.summary.overview) {
                                            summaryHtml += `<div style="margin-bottom: 16px;"><strong>Overview:</strong><br>${extractedDetails.summary.overview}</div>`;
                                          }
                                          if (extractedDetails.summary.points && Array.isArray(extractedDetails.summary.points)) {
                                            summaryHtml += `<div><strong>Key Points:</strong><br>`;
                                            extractedDetails.summary.points.forEach((point, index) => {
                                              summaryHtml += `<div style="margin: 8px 0; padding-left: 20px; position: relative;">
                                                <span style="position: absolute; left: 0; color: #0ea5e9;">•</span>${point}
                                              </div>`;
                                            });
                                            summaryHtml += '</div>';
                                          }
                                          return summaryHtml || 'No summary available';
                                        } else {
                                          return extractedDetails.summary || 'No summary available';
                                        }
                                      })()}
                                    </div>
                                  </div>
                                  ${extractedDetails.mlInsights ? `
                                  <div class="section">
                                    <div class="section-title">🧠 AI Insights</div>
                                    <div class="insights-grid">
                                      <div class="insight-item">
                                        <div class="insight-label">Risk Assessment</div>
                                        <div class="insight-value">${extractedDetails.mlInsights?.riskAssessment || 'Analysis pending'}</div>
                                      </div>
                                      <div class="insight-item">
                                        <div class="insight-label">Coverage Score</div>
                                        <div class="insight-value">${extractedDetails.mlInsights?.coverageScore || '--'}/100</div>
                                      </div>
                                      <div class="insight-item">
                                        <div class="insight-label">Cost Efficiency</div>
                                        <div class="insight-value">${extractedDetails.mlInsights?.costEfficiency || 'Analysis pending'}</div>
                                      </div>
                                      <div class="insight-item">
                                        <div class="insight-label">Market Comparison</div>
                                        <div class="insight-value">${extractedDetails.mlInsights?.marketComparison || 'Analysis pending'}</div>
                                      </div>
                                    </div>
                                    <div class="tips-list">
                                      <div style="font-weight: 600; color: #166534; margin-bottom: 12px;">💡 Optimization Tips:</div>
                                      ${extractedDetails.mlInsights?.optimizationTips && extractedDetails.mlInsights.optimizationTips.length > 0 ? 
                                        extractedDetails.mlInsights.optimizationTips.map((tip, index) => `<div class="tip-item">${index + 1}. ${tip}</div>`).join('') : 
                                        '<div class="tip-item">No optimization tips available</div>'
                                      }
                                    </div>
                                  </div>
                                  ` : ''}
                                  ${extractedDetails.tags && extractedDetails.tags.length > 0 ? `
                                  <div class="section">
                                    <div class="section-title">🏷️ Tags</div>
                                    <div class="tags-container">
                                      ${extractedDetails.tags.map((tag, index) => `<span class="tag">${tag || 'Unknown'}</span>`).join('')}
                                    </div>
                                  </div>
                                  ` : ''}
                                  <div class="footer">
                                    <div style="margin-bottom: 8px;">Generated by PolicyBridge AI</div>
                                    <div>Powered by Gemini 2.5 Flash</div>
                                    <div style="margin-top: 8px;">
                                      <a href="https://policybridge.ai" style="color: #f59e0b; text-decoration: none;">policybridge.ai</a>
                                    </div>
                                  </div>
                                </div>
                              </body>
                              </html>
                            `;
                            const blob = new Blob([summaryContent], { type: 'text/html' });
                            const url = URL.createObjectURL(blob);
                            const newWindow = window.open(url, '_blank');
                            if (newWindow) {
                              newWindow.document.title = 'PolicyBridge AI - Policy Analysis Summary';
                              setTimeout(() => {
                                newWindow.print();
                              }, 800);
                            }
                            toast.success('Summary report opened. Use Print to save as PDF.');
                          } catch (error) {
                            console.error('Download error:', error);
                            toast.error('Failed to generate summary PDF');
                          }
                        }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg border border-blue-500 whitespace-nowrap"
                      >
                        <Download size={18} className="mr-2" />
                        Download Summary Report
                      </motion.button>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-primary-200 bg-gray-50">
                <button
                  onClick={() => setShowExtractionModal(false)}
                  className="flex-1 btn-outline"
                >
                  Close
                </button>
                <button
                  onClick={() => navigate(`/policy/${extractedDetails?.id || 'new'}`)}
                  className="flex-1 btn-primary"
                >
                  View Full Policy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardEnhanced;
