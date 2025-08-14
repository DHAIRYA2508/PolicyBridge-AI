import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  MessageSquare, 
  Eye, 
  Trash2, 
  MoreHorizontal,
  TrendingUp,
  FileText,
  Users,
  Clock,
  Star,
  Calendar,
  BarChart3,
  Upload,
  Settings
} from 'lucide-react';

const DashboardEnhanced = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Enhanced mock data
  const stats = [
    {
      title: 'Total Policies',
      value: '247',
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'AI Conversations',
      value: '892',
      change: '+23%',
      trend: 'up',
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Compliance Score',
      value: '98.5%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const policies = [
    {
      id: 1,
      name: 'Employee Health Insurance Policy',
      type: 'Insurance',
      status: 'active',
      uploadDate: '2024-01-15',
      lastModified: '2 hours ago',
      size: '2.4 MB',
      pages: 24,
      conversations: 8,
      fileType: 'PDF',
      priority: 'high',
      tags: ['Health', 'Insurance', 'Employee Benefits']
    },
    {
      id: 2,
      name: 'Data Privacy & Security Policy',
      type: 'Compliance',
      status: 'active',
      uploadDate: '2024-01-10',
      lastModified: '1 day ago',
      size: '1.8 MB',
      pages: 18,
      conversations: 12,
      fileType: 'PDF',
      priority: 'critical',
      tags: ['Privacy', 'Security', 'GDPR']
    },
    {
      id: 3,
      name: 'Remote Work Guidelines',
      type: 'HR',
      status: 'draft',
      uploadDate: '2024-01-08',
      lastModified: '3 days ago',
      size: '1.2 MB',
      pages: 12,
      conversations: 3,
      fileType: 'DOCX',
      priority: 'medium',
      tags: ['Remote Work', 'HR', 'Guidelines']
    },
    {
      id: 4,
      name: 'Financial Risk Management',
      type: 'Finance',
      status: 'active',
      uploadDate: '2024-01-05',
      lastModified: '1 week ago',
      size: '3.1 MB',
      pages: 32,
      conversations: 15,
      fileType: 'PDF',
      priority: 'high',
      tags: ['Finance', 'Risk', 'Compliance']
    },
    {
      id: 5,
      name: 'Environmental Sustainability Policy',
      type: 'ESG',
      status: 'review',
      uploadDate: '2024-01-03',
      lastModified: '2 weeks ago',
      size: '2.7 MB',
      pages: 28,
      conversations: 6,
      fileType: 'PDF',
      priority: 'medium',
      tags: ['ESG', 'Sustainability', 'Environment']
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'upload',
      description: 'New policy uploaded: Employee Health Insurance',
      timestamp: '2 hours ago',
      user: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 2,
      type: 'chat',
      description: 'AI conversation started on Data Privacy Policy',
      timestamp: '4 hours ago',
      user: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 3,
      type: 'update',
      description: 'Policy updated: Remote Work Guidelines',
      timestamp: '1 day ago',
      user: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileTypeColor = (fileType) => {
    switch (fileType) {
      case 'PDF':
        return 'bg-red-100 text-red-800';
      case 'DOCX':
        return 'bg-blue-100 text-blue-600';
      case 'TXT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent1-50">
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
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Dashboard
              </h1>
              <p className="text-text-secondary">
                Welcome back! Here's what's happening with your policies today.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUploadModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} />
                Upload Policy
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline"
              >
                <Settings size={20} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-text-secondary">
                {stat.title}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-soft mb-6"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search policies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Types</option>
                  <option value="insurance">Insurance</option>
                  <option value="compliance">Compliance</option>
                  <option value="hr">HR</option>
                  <option value="finance">Finance</option>
                  <option value="esg">ESG</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="recent">Most Recent</option>
                  <option value="name">Name A-Z</option>
                  <option value="size">Size</option>
                  <option value="conversations">Most Active</option>
                </select>
              </div>
            </motion.div>

            {/* Policies List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-soft overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-text-primary">
                  Recent Policies ({policies.length})
                </h3>
              </div>
              
              <div className="divide-y divide-gray-100">
                {policies.map((policy, index) => (
                  <motion.div
                    key={policy.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ backgroundColor: '#f8fafc' }}
                    className="p-6 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-text-primary text-lg">
                            {policy.name}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(policy.priority)}`}>
                            {policy.priority}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                          <span className="flex items-center gap-1">
                            <FileText size={16} />
                            {policy.fileType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={16} />
                            {policy.lastModified}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={16} />
                            {policy.conversations} conversations
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {policy.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`px-3 py-1 rounded-full border ${getStatusColor(policy.status)}`}>
                            {policy.status}
                          </span>
                          <span className="text-text-secondary">
                            {policy.pages} pages • {policy.size}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-text-secondary hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors duration-200"
                          title="View Policy"
                        >
                          <Eye size={18} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-text-secondary hover:text-accent1-600 hover:bg-accent1-50 rounded-lg transition-colors duration-200"
                          title="Start Chat"
                        >
                          <MessageSquare size={18} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-text-secondary hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors duration-200"
                          title="Download"
                        >
                          <Download size={18} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-soft p-6"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <img
                      src={activity.avatar}
                      alt={activity.user}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-text-primary font-medium">
                        {activity.user}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {activity.description}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-secondary-500 to-accent1-600 rounded-2xl p-6 text-white"
            >
              <h3 className="text-lg font-semibold mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors duration-200 flex items-center gap-3"
                >
                  <Upload size={20} />
                  <span>Upload New Policy</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors duration-200 flex items-center gap-3"
                >
                  <BarChart3 size={20} />
                  <span>Generate Report</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors duration-200 flex items-center gap-3"
                >
                  <MessageSquare size={20} />
                  <span>Start AI Chat</span>
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
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-xl font-semibold text-text-primary mb-6">
                Upload New Policy
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Policy Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    placeholder="Enter policy name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Policy Type
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-transparent">
                    <option>Select type</option>
                    <option>Insurance</option>
                    <option>Compliance</option>
                    <option>HR</option>
                    <option>Finance</option>
                    <option>ESG</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Priority
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-transparent">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 btn-outline"
                >
                  Cancel
                </button>
                <button className="flex-1 btn-primary">
                  Upload
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
