import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Search, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Download, 
  Trash2, 
  Eye,
  Plus,
  Filter,
  SortAsc,
  Calendar,
  Clock,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Mock data for policies
  const policies = [
    {
      id: '1',
      name: 'Employee Health Insurance Policy',
      type: 'Insurance',
      status: 'active',
      uploadDate: '2024-01-15',
      lastModified: '2024-01-20',
      size: '2.4 MB',
      pages: 24,
      conversations: 8,
      fileType: 'PDF'
    },
    {
      id: '2',
      name: 'Company Data Privacy Policy',
      type: 'Privacy',
      status: 'active',
      uploadDate: '2024-01-10',
      lastModified: '2024-01-18',
      size: '1.8 MB',
      pages: 18,
      conversations: 12,
      fileType: 'DOCX'
    },
    {
      id: '3',
      name: 'Remote Work Guidelines',
      type: 'HR',
      status: 'draft',
      uploadDate: '2024-01-05',
      lastModified: '2024-01-05',
      size: '1.2 MB',
      pages: 12,
      conversations: 3,
      fileType: 'PDF'
    },
    {
      id: '4',
      name: 'Financial Compliance Manual',
      type: 'Finance',
      status: 'active',
      uploadDate: '2023-12-20',
      lastModified: '2024-01-12',
      size: '3.1 MB',
      pages: 32,
      conversations: 15,
      fileType: 'PDF'
    },
    {
      id: '5',
      name: 'IT Security Policy',
      type: 'Security',
      status: 'active',
      uploadDate: '2023-12-15',
      lastModified: '2024-01-08',
      size: '2.7 MB',
      pages: 28,
      conversations: 9,
      fileType: 'PDF'
    }
  ];

  const stats = [
    {
      title: 'Total Policies',
      value: policies.length,
      change: '+2',
      changeType: 'positive',
      icon: FileText,
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      title: 'Active Policies',
      value: policies.filter(p => p.status === 'active').length,
      change: '+1',
      changeType: 'positive',
      icon: MessageSquare,
      color: 'from-accent1-500 to-accent1-600'
    },
    {
      title: 'Total Conversations',
      value: policies.reduce((sum, p) => sum + p.conversations, 0),
      change: '+5',
      changeType: 'positive',
      icon: BarChart3,
      color: 'from-accent2-500 to-accent2-600'
    },
    {
      title: 'Storage Used',
      value: '11.2 GB',
      change: '+0.8 GB',
      changeType: 'neutral',
      icon: Upload,
      color: 'from-secondary-600 to-secondary-700'
    }
  ];

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || policy.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const sortedPolicies = [...filteredPolicies].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.uploadDate) - new Date(a.uploadDate);
      case 'size':
        return parseFloat(b.size) - parseFloat(a.size);
      case 'conversations':
        return b.conversations - a.conversations;
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFileTypeColor = (fileType) => {
    switch (fileType) {
      case 'PDF':
        return 'bg-red-100 text-red-800';
      case 'DOCX':
        return 'bg-blue-100 text-blue-800';
      case 'TXT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className="text-text-secondary mt-2">
                Manage your policies and start AI-powered conversations
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 sm:mt-0"
            >
              <Link to="/upload" className="btn-primary inline-flex items-center">
                <Plus size={20} className="mr-2" />
                Upload Policy
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card hover:shadow-glow transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">{stat.title}</p>
                    <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      <span className={`text-sm ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-text-secondary'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-text-muted ml-1">this month</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-soft p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search policies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-full"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-text-muted" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <SortAsc size={20} className="text-text-muted" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="size">Size</option>
                  <option value="conversations">Conversations</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedPolicies.map((policy, index) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card hover:shadow-glow transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary text-lg mb-2 line-clamp-2">
                    {policy.name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(policy.status)}`}>
                      {policy.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFileTypeColor(policy.fileType)}`}>
                      {policy.fileType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-text-secondary">
                  <Calendar size={16} className="mr-2" />
                  <span>Uploaded {new Date(policy.uploadDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <Clock size={16} className="mr-2" />
                  <span>Modified {new Date(policy.lastModified).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <FileText size={16} className="mr-2" />
                  <span>{policy.pages} pages • {policy.size}</span>
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <MessageSquare size={16} className="mr-2" />
                  <span>{policy.conversations} conversations</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-text-secondary hover:text-secondary-500 hover:bg-secondary-50 rounded-lg transition-colors duration-200"
                    title="View Policy"
                  >
                    <Eye size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-text-secondary hover:text-accent1-500 hover:bg-accent1-50 rounded-lg transition-colors duration-200"
                    title="Start Chat"
                  >
                    <MessageSquare size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-text-secondary hover:text-accent2-500 hover:bg-accent2-50 rounded-lg transition-colors duration-200"
                    title="Download"
                  >
                    <Download size={18} />
                  </motion.button>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {sortedPolicies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={48} className="text-text-muted" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No policies found
            </h3>
            <p className="text-text-secondary mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by uploading your first policy document'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <Link to="/upload" className="btn-primary inline-flex items-center">
                <Upload size={20} className="mr-2" />
                Upload Your First Policy
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
