import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  FileText, 
  CheckCircle, 
  X, 
  ArrowLeft,
  Download,
  Share2,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComparePolicies = () => {
  const navigate = useNavigate();
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [comparisonType, setComparisonType] = useState('coverage');

  // Mock policies for comparison
  const availablePolicies = [
    {
      id: '1',
      name: 'Employee Health Insurance Policy',
      type: 'Insurance',
      status: 'active',
      uploadDate: '2024-01-15',
      size: '2.4 MB',
      pages: 24,
      conversations: 8,
      fileType: 'PDF',
      coverage: {
        medical: 90,
        dental: 80,
        vision: 75,
        prescription: 85,
        mentalHealth: 90,
        emergency: 100
      },
      costs: {
        deductible: 500,
        maxOutOfPocket: 3000,
        monthlyPremium: 150,
        copay: 25
      },
      features: ['Preventive Care', 'Specialist Coverage', 'Out-of-Network', 'Prescription Drug Coverage', 'Mental Health Services', 'Emergency Services']
    },
    {
      id: '2',
      name: 'Company Data Privacy Policy',
      type: 'Privacy',
      status: 'active',
      uploadDate: '2024-01-10',
      size: '1.8 MB',
      pages: 18,
      conversations: 12,
      fileType: 'DOCX',
      coverage: {
        dataProtection: 95,
        userRights: 90,
        breachNotification: 100,
        dataRetention: 85,
        thirdPartySharing: 80,
        compliance: 95
      },
      costs: {
        implementationCost: 5000,
        annualMaintenance: 2000,
        trainingCost: 1000,
        auditCost: 3000
      },
      features: ['GDPR Compliance', 'Data Encryption', 'User Consent Management', 'Breach Response Plan', 'Regular Audits', 'Employee Training']
    },
    {
      id: '3',
      name: 'Remote Work Guidelines',
      type: 'HR',
      status: 'draft',
      uploadDate: '2024-01-05',
      size: '1.2 MB',
      pages: 12,
      conversations: 3,
      fileType: 'PDF',
      coverage: {
        workFromHome: 85,
        equipmentSupport: 70,
        communication: 90,
        security: 80,
        productivity: 85,
        workLifeBalance: 90
      },
      costs: {
        equipmentBudget: 1000,
        softwareLicenses: 500,
        internetReimbursement: 100,
        trainingCost: 300
      },
      features: ['Flexible Hours', 'Equipment Provision', 'Communication Tools', 'Security Protocols', 'Performance Metrics', 'Wellness Support']
    }
  ];

  const addPolicyToComparison = (policy) => {
    if (selectedPolicies.length < 3 && !selectedPolicies.find(p => p.id === policy.id)) {
      setSelectedPolicies([...selectedPolicies, policy]);
    }
  };

  const removePolicyFromComparison = (policyId) => {
    setSelectedPolicies(selectedPolicies.filter(p => p.id !== policyId));
  };



  const getComparisonMetrics = () => {
    if (comparisonType === 'coverage') {
      return Object.keys(availablePolicies[0]?.coverage || {});
    } else {
      return Object.keys(availablePolicies[0]?.costs || {});
    }
  };

  const getTrendIcon = (value1, value2) => {
    if (value1 > value2) return <TrendingUp size={16} className="text-green-500" />;
    if (value1 < value2) return <TrendingDown size={16} className="text-red-500" />;
    return <Minus size={16} className="text-gray-400" />;
  };

  const getComparisonScore = (policy1, policy2) => {
    if (comparisonType === 'coverage') {
      const metrics = Object.keys(policy1.coverage);
      let score = 0;
      metrics.forEach(metric => {
        if (policy1.coverage[metric] > policy2.coverage[metric]) score++;
        else if (policy1.coverage[metric] < policy2.coverage[metric]) score--;
      });
      return score;
    } else {
      const metrics = Object.keys(policy1.costs);
      let score = 0;
      metrics.forEach(metric => {
        if (policy1.costs[metric] < policy2.costs[metric]) score++;
        else if (policy1.costs[metric] > policy2.costs[metric]) score--;
      });
      return score;
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
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-text-secondary hover:text-secondary-500 mb-6 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Compare Policies
          </h1>
          <p className="text-text-secondary">
            Analyze and compare multiple policies side-by-side to make informed decisions
          </p>
        </motion.div>

        {/* Policy Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-soft p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Select Policies to Compare (Max 3)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePolicies.map((policy) => {
              const isSelected = selectedPolicies.find(p => p.id === policy.id);
              return (
                <motion.div
                  key={policy.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => isSelected ? removePolicyFromComparison(policy.id) : addPolicyToComparison(policy)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-secondary-500 bg-secondary-50'
                      : 'border-gray-200 hover:border-secondary-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-accent1-500 rounded-lg flex items-center justify-center">
                      <FileText size={20} className="text-white" />
                    </div>
                    {isSelected && (
                      <CheckCircle size={20} className="text-secondary-500" />
                    )}
                  </div>
                  
                  <h4 className="font-medium text-text-primary mb-2 line-clamp-2">
                    {policy.name}
                  </h4>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {policy.type}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {policy.pages} pages
                    </span>
                  </div>
                  
                  <p className="text-xs text-text-secondary">
                    {policy.fileType} • {policy.size}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Comparison Controls */}
        {selectedPolicies.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-soft p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Comparison Settings
                </h3>
                <p className="text-text-secondary">
                  Comparing {selectedPolicies.length} policies
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-text-secondary">Compare by:</span>
                  <select
                    value={comparisonType}
                    onChange={(e) => setComparisonType(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  >
                    <option value="coverage">Coverage</option>
                    <option value="costs">Costs</option>
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-outline"
                  >
                    <Download size={18} className="mr-2" />
                    Export
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    <Share2 size={18} className="mr-2" />
                    Share
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Comparison Results */}
        {selectedPolicies.length >= 2 && (
          <div className="space-y-8">
            {/* Chart Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-6">
                {comparisonType === 'coverage' ? 'Coverage Comparison' : 'Cost Comparison'}
              </h3>
              
              <div className="space-y-6">
                {getComparisonMetrics().map((metric, index) => (
                  <div key={metric} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <h4 className="text-sm font-medium text-text-primary mb-3 capitalize">
                      {metric.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedPolicies.map((policy, policyIndex) => {
                        const value = comparisonType === 'coverage' 
                          ? policy.coverage[metric] 
                          : policy.costs[metric];
                        const unit = comparisonType === 'coverage' ? '%' : '$';
                        
                        return (
                          <div key={policy.id} className="text-center">
                            <div className="text-2xl font-bold text-text-primary mb-1">
                              {comparisonType === 'coverage' ? value : unit + value.toLocaleString()}
                            </div>
                            <div className="text-sm text-text-secondary">
                              {policy.name}
                            </div>
                            
                            {/* Trend indicator for first policy */}
                            {policyIndex === 0 && selectedPolicies.length > 1 && (
                              <div className="flex items-center justify-center mt-2">
                                {getTrendIcon(
                                  value,
                                  comparisonType === 'coverage' 
                                    ? selectedPolicies[1].coverage[metric]
                                    : selectedPolicies[1].costs[metric]
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Features Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-6">
                Features Comparison
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-text-primary">Feature</th>
                      {selectedPolicies.map(policy => (
                        <th key={policy.id} className="text-center py-3 px-4 font-medium text-text-primary">
                          {policy.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['Preventive Care', 'Specialist Coverage', 'Out-of-Network', 'Prescription Drug Coverage', 'Mental Health Services', 'Emergency Services'].map(feature => (
                      <tr key={feature} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-text-secondary">{feature}</td>
                        {selectedPolicies.map(policy => (
                          <td key={policy.id} className="py-3 px-4 text-center">
                            {policy.features.includes(feature) ? (
                              <CheckCircle size={20} className="text-green-500 mx-auto" />
                            ) : (
                              <X size={20} className="text-red-500 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* AI Recommendation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-gradient-to-r from-accent2-50 to-accent1-50 rounded-xl p-6 border border-accent2-200"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                🤖 AI Recommendation
              </h3>
              
              {selectedPolicies.length === 2 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-accent1-500 rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary">
                          {selectedPolicies[0].name}
                        </h4>
                        <p className="text-sm text-text-secondary">
                          {getComparisonScore(selectedPolicies[0], selectedPolicies[1]) > 0 ? 'Recommended' : 'Alternative'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-text-primary">
                        {Math.abs(getComparisonScore(selectedPolicies[0], selectedPolicies[1]))}
                      </div>
                      <div className="text-sm text-text-secondary">points</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent1-500 to-accent2-500 rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary">
                          {selectedPolicies[1].name}
                        </h4>
                        <p className="text-sm text-text-secondary">
                          {getComparisonScore(selectedPolicies[1], selectedPolicies[0]) > 0 ? 'Recommended' : 'Alternative'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-text-primary">
                        {Math.abs(getComparisonScore(selectedPolicies[1], selectedPolicies[0]))}
                      </div>
                      <div className="text-sm text-text-secondary">points</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 size={48} className="text-accent2-500 mx-auto mb-4" />
                  <p className="text-text-secondary">
                    Select exactly 2 policies to get AI-powered recommendations
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Empty State */}
        {selectedPolicies.length < 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <BarChart3 size={64} className="text-text-muted mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Select Policies to Compare
            </h3>
            <p className="text-text-secondary mb-6">
              Choose at least 2 policies from the list above to start comparing them
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ComparePolicies;
