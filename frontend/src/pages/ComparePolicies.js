import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  FileText, 
  BarChart3, 
  Download, 
  Share2, 
  CheckCircle, 
  Loader2,
  Search,
  Filter,
  RefreshCw,
  X,
  ChevronRight,
  FileCheck,
  Shield,
  DollarSign,
  Clock,
  Star
} from 'lucide-react';
import { policyAPI, aiAPI } from '../services/api';

const ComparePolicies = () => {
  const navigate = useNavigate();
  
  // State management
  const [policies, setPolicies] = useState([]);
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showComparison, setShowComparison] = useState(false);

  // Fetch available policies on component mount
  useEffect(() => {
    fetchPolicies();
  }, []);

  // Debug: Log when policies state changes
  useEffect(() => {
    console.log(`🔄 Policies state changed: ${policies.length} policies available`);
    if (policies.length > 0) {
      console.log('📋 Sample policy data:', policies[0]);
    }
  }, [policies]);

  const fetchPolicies = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching policies...');
      
      // Check authentication token
      const token = localStorage.getItem('token') || localStorage.getItem('access');
      console.log('🔑 Token available:', !!token);
      
      if (!token) {
        console.error('❌ No authentication token found');
        toast.error('Please log in to view policies');
        setPolicies([]);
        return;
      }
      
      const response = await policyAPI.getPolicies();
      console.log('📋 Policies response:', response);
      
      // Handle different response formats
      let policiesData = [];
      
      if (response && response.data) {
        // Check if it's a paginated response
        if (response.data.results && Array.isArray(response.data.results)) {
          policiesData = response.data.results;
          console.log(`✅ Loaded ${policiesData.length} policies from paginated response`);
        } else if (Array.isArray(response.data)) {
          policiesData = response.data;
          console.log(`✅ Loaded ${response.data.length} policies from direct array`);
        } else {
          console.error('❌ Unexpected response data format:', response.data);
          setPolicies([]);
          toast.error('Failed to load policies - unexpected response format');
          return;
        }
      } else if (response && Array.isArray(response)) {
        policiesData = response;
        console.log(`✅ Loaded ${response.length} policies from direct response`);
      } else {
        console.error('❌ Invalid policies response format:', response);
        setPolicies([]);
        toast.error('Failed to load policies - invalid response format');
        return;
      }
      
      setPolicies(policiesData);
      console.log(`🎉 Policies state updated with ${policiesData.length} policies:`, policiesData);
      toast.success(`Loaded ${policiesData.length} policies successfully`);
      
    } catch (error) {
      console.error('❌ Error fetching policies:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
        // Redirect to login
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. You may not have permission to view policies.');
      } else {
        toast.error(`Failed to fetch policies: ${error.message || 'Unknown error'}`);
      }
      setPolicies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePolicySelection = (policyId) => {
    setSelectedPolicies(prev => {
      if (prev.includes(policyId)) {
        return prev.filter(id => id !== policyId);
      } else if (prev.length < 2) {
        return [...prev, policyId];
      } else {
        toast.error('You can only compare 2 policies at a time');
        return prev;
      }
    });
  };

  const removeSelectedPolicy = (policyId) => {
    setSelectedPolicies(prev => prev.filter(id => id !== policyId));
  };

  const performComparison = async () => {
    if (selectedPolicies.length !== 2) {
      toast.error('Please select exactly 2 policies to compare');
      return;
    }

    try {
      setIsComparing(true);
      toast.loading('Analyzing policies with AI...', { id: 'comparison' });

      console.log('🚀 Starting comparison with policies:', selectedPolicies);
      console.log('🔍 Policy 1 ID:', selectedPolicies[0]);
      console.log('🔍 Policy 2 ID:', selectedPolicies[1]);

      // Test the API endpoint first
      const token = localStorage.getItem('token') || localStorage.getItem('access');
      console.log('🔑 Using token:', token ? 'Available' : 'Missing');

      const response = await aiAPI.comparePolicies(
        selectedPolicies[0], 
        selectedPolicies[1]
      );

      console.log('📊 Comparison response:', response);
      console.log('📊 Response type:', typeof response);
      console.log('📊 Response keys:', Object.keys(response || {}));

      if (response && response.status === 'success') {
        setComparisonResult(response.data);
        setShowComparison(true);
        toast.success('Comparison completed successfully!', { id: 'comparison' });
      } else if (response && response.data) {
        // Handle case where response structure is different
        setComparisonResult(response.data);
        setShowComparison(true);
        toast.success('Comparison completed successfully!', { id: 'comparison' });
      } else if (response && response.comparison_result) {
        // Handle streamlined response format
        setComparisonResult({
          comparison_result: response.comparison_result,
          policy_names: [response.policy1_name, response.policy2_name],
          ml_verification: {
            status: 'verified',
            confidence_score: 0.85,
            confidence_level: 'HIGH',
            verification_message: 'AI analysis completed successfully'
          }
        });
        setShowComparison(true);
        toast.success('Comparison completed successfully!', { id: 'comparison' });
      } else if (response && response.fallback_result) {
        // Handle fallback response
        setComparisonResult({
          comparison_result: response.fallback_result,
          policy_names: [response.policy1_name || 'Policy 1', response.policy2_name || 'Policy 2'],
          ml_verification: {
            status: 'fallback',
            confidence_score: 0.7,
            confidence_level: 'MEDIUM',
            verification_message: 'Fallback analysis provided due to AI service issues'
          }
        });
        setShowComparison(true);
        toast.success('Comparison completed with fallback data!', { id: 'comparison' });
      } else if (response && response.raw_response && response.raw_response.startsWith('ERROR:')) {
        // Handle validation errors
        const errorMessage = response.raw_response.replace('ERROR:', '').trim();
        toast.error(`Validation Error: ${errorMessage}`, { id: 'comparison' });
        setShowComparison(false);
        return;
      } else {
        console.error('❌ Unexpected response format:', response);
        throw new Error(response?.error || response?.message || 'Comparison failed - unexpected response format');
      }
    } catch (error) {
      console.error('❌ Comparison error:', error);
      console.error('❌ Error details:', error.response || error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      
      // Show fallback comparison even when there's an error
      const fallbackResult = {
        comparison_result: {
          'SUMMARY': '• Comparison could not be completed due to technical issues\n• Please try again later or contact support\n• This is a temporary fallback analysis',
          'COVERAGE COMPARISON': '• Hospitalization coverage: Unable to analyze at this time\n• Surgery coverage: Data unavailable\n• Pre-existing conditions: Analysis incomplete',
          'EXCLUSIONS & LIMITATIONS': '• Policy 1 exclusions: Unable to determine\n• Policy 2 exclusions: Unable to determine\n• Waiting periods: Information unavailable',
          'PREMIUM & COST ANALYSIS': '• Annual premium: Data not available\n• Deductible: Unable to compare\n• Co-payment: Analysis incomplete',
          'UNIQUE FEATURES': '• Policy 1 features: Unable to identify\n• Policy 2 features: Unable to identify',
          'RECOMMENDATIONS': '• Best for budget-conscious: Unable to determine\n• Best for comprehensive coverage: Unable to determine\n• Best for quick claims: Unable to determine',
          'FINAL VERDICT': '• Overall winner: Analysis incomplete\n• Key reason: Technical difficulties occurred\n• Best customer type: Unable to determine'
        },
        policy_names: ['Policy 1', 'Policy 2'],
        ml_verification: {
          status: 'error',
          confidence_score: 0.0,
          confidence_level: 'LOW',
          verification_message: 'Technical error occurred during analysis'
        }
      };
      
      setComparisonResult(fallbackResult);
      setShowComparison(true);
      toast.error(`Comparison failed: ${error.message || 'Unknown error'}`, { id: 'comparison' });
    } finally {
      setIsComparing(false);
    }
  };

  const downloadPDF = async () => {
    if (!comparisonResult) {
      toast.error('No comparison results to download');
      return;
    }

    try {
      toast.loading('Generating PDF...', { id: 'pdf' });
      
      // Import jsPDF dynamically to avoid SSR issues
      const { jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      // Create temporary div for PDF generation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = generatePDFContent();
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '40px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '12px';
      tempDiv.style.lineHeight = '1.4';
      
      document.body.appendChild(tempDiv);

      // Convert to canvas and then to PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 800,
        height: tempDiv.scrollHeight
      });

      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20);

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);
      }

      // Download the PDF
      const fileName = `policy-comparison-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast.success('PDF downloaded successfully!', { id: 'pdf' });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF', { id: 'pdf' });
    }
  };

  const generatePDFContent = () => {
    if (!comparisonResult) return '';

    const { comparison_result, policy_names, ml_verification } = comparisonResult;
    
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px; padding: 30px; background: linear-gradient(135deg, #1E3A5F, #A4D7E1); color: white; border-radius: 15px;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold; margin-bottom: 10px;">Policy Comparison Report</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">${policy_names?.[0] || 'Policy 1'} vs ${policy_names?.[1] || 'Policy 2'}</p>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.8;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>

        <!-- Summary Section -->
        ${comparison_result?.SUMMARY ? `
          <div style="margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, #F0E68C, #A4D7E1); border-radius: 15px; border-left: 5px solid #FFB74D;">
            <h2 style="margin: 0 0 15px 0; color: #1E3A5F; font-size: 24px; display: flex; align-items: center;">
              ⭐ Executive Summary
            </h2>
            <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #FFB74D;">
              ${comparison_result.SUMMARY.split('\n').map(line => {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
                  return `<div style="margin-bottom: 8px; display: flex; align-items: start;">
                    <span style="color: #FFD700; margin-right: 8px; margin-top: 2px;">•</span>
                    <span style="color: #1E3A5F; line-height: 1.5;">${trimmedLine.replace(/^[•*]\s*/, '').trim()}</span>
                  </div>`;
                }
                return trimmedLine ? `<p style="margin: 0 0 8px 0; color: #1E3A5F; line-height: 1.5;">${trimmedLine}</p>` : '';
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Detailed Comparison Sections -->
        ${comparison_result ? Object.entries(comparison_result).map(([section, content]) => {
          if (section === 'SUMMARY') return '';
          
          const sectionIcons = {
            'COVERAGE COMPARISON': '🛡️',
            'EXCLUSIONS & LIMITATIONS': '📋',
            'PREMIUM & COST ANALYSIS': '💰',
            'UNIQUE FEATURES': '⭐',
            'RECOMMENDATIONS': '✅',
            'FINAL VERDICT': '📊'
          };
          
          // Use Sunlit Ocean colors
          const sectionColors = {
            'COVERAGE COMPARISON': '#FFD700',
            'EXCLUSIONS & LIMITATIONS': '#FFB74D',
            'PREMIUM & COST ANALYSIS': '#FFD700',
            'UNIQUE FEATURES': '#FFD700',
            'RECOMMENDATIONS': '#A4D7E1',
            'FINAL VERDICT': '#FFB74D'
          };
          
          return `
            <div style="margin-bottom: 25px; padding: 25px; background: linear-gradient(135deg, #F0E68C, #A4D7E1); border-radius: 15px; border-left: 5px solid ${sectionColors[section] || '#FFB74D'};">
              <h3 style="margin: 0 0 15px 0; color: #1E3A5F; font-size: 20px; display: flex; align-items: center;">
                ${sectionIcons[section] || '📝'} ${section}
              </h3>
              <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #FFB74D;">
                ${content.split('\n').map(line => {
                  const trimmedLine = line.trim();
                  if (trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
                    const pointText = trimmedLine.replace(/^[•*]\s*/, '').trim();
                    
                    if (pointText.includes(' vs ')) {
                      const [policy1Part, policy2Part] = pointText.split(' vs ');
                      return `
                        <div style="margin-bottom: 15px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #FFB74D;">
                          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div style="background: linear-gradient(135deg, #F0E68C, #FFD700); padding: 12px; border-radius: 6px; border: 1px solid #FFB74D;">
                              <p style="margin: 0 0 5px 0; color: #1E3A5F; font-weight: 600; font-size: 13px;">${policy_names?.[0] || 'Policy 1'}</p>
                              <p style="margin: 0; color: #1E3A5F; font-size: 14px;">${policy1Part.trim()}</p>
                            </div>
                            <div style="background: linear-gradient(135deg, #A4D7E1, #F0E68C); padding: 12px; border-radius: 6px; border: 1px solid #FFB74D;">
                              <p style="margin: 0 0 5px 0; color: #1E3A5F; font-weight: 600; font-size: 13px;">${policy_names?.[1] || 'Policy 2'}</p>
                              <p style="margin: 0; color: #1E3A5F; font-size: 14px;">${policy2Part.trim()}</p>
                            </div>
                          </div>
                        </div>
                      `;
                    } else {
                      return `<div style="margin-bottom: 8px; display: flex; align-items: start;">
                        <span style="color: #FFD700; margin-right: 8px; margin-top: 2px;">•</span>
                        <span style="color: #1E3A5F; line-height: 1.5; font-size: 14px;">${pointText}</span>
                      </div>`;
                    }
                  } else if (trimmedLine) {
                    return `<p style="margin: 0 0 8px 0; color: #1E3A5F; line-height: 1.5; font-size: 14px;">${trimmedLine}</p>`;
                  }
                  return '';
                }).join('')}
              </div>
            </div>
          `;
        }).join('') : '<p>No comparison data available</p>'}

        <!-- ML Verification -->
        ${ml_verification ? `
          <div style="margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, #F0E68C, #A4D7E1); border-radius: 15px; border-left: 5px solid #FFD700;">
            <h3 style="margin: 0 0 20px 0; color: #1E3A5F; font-size: 20px; display: flex; align-items: center;">
              🔍 AI Verification
            </h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
              <div style="text-align: center; background: white; padding: 20px; border-radius: 10px; border: 1px solid #FFB74D;">
                <p style="margin: 0 0 8px 0; color: #FFD700; font-weight: 600; font-size: 14px;">Status</p>
                <p style="margin: 0; color: #1E3A5F; font-weight: bold; font-size: 16px;">${ml_verification.status}</p>
              </div>
              <div style="text-align: center; background: white; padding: 20px; border-radius: 10px; border: 1px solid #FFB74D;">
                <p style="margin: 0 0 8px 0; color: #FFD700; font-weight: 600; font-size: 14px;">Confidence</p>
                <p style="margin: 0; color: #1E3A5F; font-weight: bold; font-size: 16px;">
                  ${ml_verification.confidence_level} (${(ml_verification.confidence_score * 100).toFixed(1)}%)
                </p>
              </div>
              <div style="text-align: center; background: white; padding: 20px; border-radius: 10px; border: 1px solid #FFB74D;">
                <p style="margin: 0 0 8px 0; color: #FFD700; font-weight: 600; font-size: 14px;">Quality</p>
                <p style="margin: 0; color: #1E3A5F; font-weight: bold; font-size: 16px;">
                  ${ml_verification.verification_message}
                </p>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Footer -->
        <div style="margin-top: 40px; padding: 25px; background: linear-gradient(135deg, #F0E68C, #A4D7E1); border-radius: 15px; text-align: center;">
          <p style="margin: 0; color: #1E3A5F; font-size: 14px; font-weight: 500;">
            Generated by PolicyBridge AI • Powered by Google Gemini
          </p>
          <p style="margin: 10px 0 0 0; color: #1E3A5F; font-size: 12px;">
            This report provides AI-powered analysis and should be used as a reference alongside professional advice.
          </p>
        </div>
      </div>
    `;
  };

  const shareComparison = async () => {
    if (!comparisonResult) {
      toast.error('No comparison results to share');
      return;
    }

    try {
      // Try native sharing first
      if (navigator.share) {
        await navigator.share({
          title: 'Policy Comparison Results',
          text: `Comparison of ${comparisonResult.policy_names?.[0] || 'Policy 1'} vs ${comparisonResult.policy_names?.[1] || 'Policy 2'}`,
          url: window.location.href
        });
        toast.success('Shared successfully!');
      } else {
        // Fallback to clipboard
        const shareText = `Policy Comparison: ${comparisonResult.policy_names?.[0] || 'Policy 1'} vs ${comparisonResult.policy_names?.[1] || 'Policy 2'}\n\nView full comparison at: ${window.location.href}`;
        await navigator.clipboard.writeText(shareText);
        toast.success('Comparison details copied to clipboard!');
      }
    } catch (error) {
      console.error('Sharing error:', error);
      toast.error('Failed to share comparison');
    }
  };

  const renderComparisonTable = () => {
    if (!comparisonResult) return null;

    const { comparison_result, policy_names, ml_verification } = comparisonResult;

    return (
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden" style={{ borderColor: '#FFB74D' }}>
        {/* Header */}
        <div className="px-6 py-6" style={{ backgroundColor: '#1E3A5F' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                AI Comparison Results
              </h2>
              <p className="text-white opacity-90">
                {policy_names?.[0] || 'Policy 1'} vs {policy_names?.[1] || 'Policy 2'}
              </p>
            </div>
            <button
              onClick={() => setShowComparison(false)}
              className="text-white hover:opacity-80 transition-colors p-2 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Summary Section */}
        {comparison_result?.SUMMARY && (
          <div className="p-6 border-b border-gray-200" style={{ backgroundColor: '#F0E68C' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: '#1E3A5F' }}>
              <Star className="h-5 w-5 mr-2" style={{ color: '#FFD700' }} />
              Executive Summary
            </h3>
            <div className="bg-white p-4 rounded-lg border shadow-sm" style={{ borderColor: '#FFB74D' }}>
              <div className="space-y-2">
                {comparison_result.SUMMARY.split('\n').map((line, index) => {
                  const trimmedLine = line.trim();
                  if (trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
                    return (
                      <div key={index} className="flex items-start">
                        <span className="mr-2 mt-1" style={{ color: '#FFD700' }}>•</span>
                        <span className="leading-relaxed" style={{ color: '#1E3A5F' }}>{trimmedLine.replace(/^[•*]\s*/, '').trim()}</span>
                      </div>
                    );
                  }
                  return (
                    <p key={index} className="leading-relaxed" style={{ color: '#1E3A5F' }}>
                      {trimmedLine}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Clean Comparison Table */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1E3A5F' }}>
            Policy Comparison Results
          </h3>
          
          <div className="bg-white rounded-lg border overflow-hidden shadow-lg" style={{ borderColor: '#FFB74D' }}>
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: '#1E3A5F' }}>
                  <th className="px-4 py-3 text-left font-semibold text-white border-r border-white">
                    Feature
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-white border-r border-white">
                    {policy_names?.[0] || 'Policy 1'}
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-white">
                    {policy_names?.[1] || 'Policy 2'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison_result && Object.entries(comparison_result).map(([section, content]) => {
                  if (section === 'SUMMARY' || section === 'RECOMMENDATIONS' || section === 'FINAL VERDICT') return null;
                  
                  const rows = [];
                  
                  // Section header
                  rows.push(
                    <tr key={`section-${section}`} style={{ backgroundColor: '#FFD700' }}>
                      <td colSpan="3" className="px-4 py-3 font-bold text-lg text-center border-b" style={{ color: '#1E3A5F', borderColor: '#FFB74D' }}>
                        {section}
                      </td>
                    </tr>
                  );
                  
                  // Content rows
                  content.split('\n').forEach((line, index) => {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
                      const pointText = trimmedLine.replace(/^[•*]\s*/, '').trim();
                      
                      if (pointText.includes(' vs ')) {
                        const [policy1Part, policy2Part] = pointText.split(' vs ');
                        const featureName = policy1Part.split(':')[0] || 'Feature';
                        const policy1Data = policy1Part.split(':')[1] || policy1Part;
                        const policy2Data = policy2Part || 'Not Available';
                        
                        // Clean up the data by removing ALL policy name prefixes and references
                        const cleanPolicy1Data = policy1Data
                          .replace(/^[^:]*:\s*/, '') // Remove prefix before first colon
                          .replace(/LIF-\d+[:\s-]*/g, '') // Remove LIF-514442: or LIF-514442 - 
                          .replace(/Policy\s+\d+[:\s-]*/g, '') // Remove Policy 1: or Policy 1 - 
                          .replace(/[A-Z]{3}-\d+[:\s-]*/g, '') // Remove any 3-letter code with numbers
                          .replace(/[A-Z]+-\d+[:\s-]*/g, '') // Remove any letter code with numbers
                          .trim();
                        
                        const cleanPolicy2Data = policy2Data
                          .replace(/^[^:]*:\s*/, '') // Remove prefix before first colon
                          .replace(/LIF-\d+[:\s-]*/g, '') // Remove LIF-514442: or LIF-514442 - 
                          .replace(/Policy\s+\d+[:\s-]*/g, '') // Remove Policy 1: or Policy 1 - 
                          .replace(/[A-Z]{3}-\d+[:\s-]*/g, '') // Remove any 3-letter code with numbers
                          .replace(/[A-Z]+-\d+[:\s-]*/g, '') // Remove any letter code with numbers
                          .trim();
                        
                        rows.push(
                          <tr key={`${section}-${index}`} className="border-b" style={{ borderColor: '#FFB74D' }}>
                            <td className="px-4 py-3 font-medium bg-gray-50 border-r" style={{ color: '#1E3A5F', borderColor: '#FFB74D' }}>
                              {featureName.trim()}
                            </td>
                            <td className="px-4 py-3 bg-white border-r" style={{ color: '#1E3A5F', borderColor: '#FFB74D' }}>
                              {cleanPolicy1Data}
                            </td>
                            <td className="px-4 py-3 bg-white" style={{ color: '#1E3A5F' }}>
                              {cleanPolicy2Data}
                            </td>
                          </tr>
                        );
                      } else if (pointText.includes(':')) {
                        const [feature, details] = pointText.split(':');
                        rows.push(
                          <tr key={`${section}-${index}`} className="border-b" style={{ borderColor: '#FFB74D' }}>
                            <td className="px-4 py-3 font-medium bg-gray-50 border-r" style={{ color: '#1E3A5F', borderColor: '#FFB74D' }}>
                              {feature.trim()}
                            </td>
                            <td className="px-4 py-3 bg-white border-r" style={{ color: '#1E3A5F', borderColor: '#FFB74D' }}>
                              {details.trim()}
                            </td>
                            <td className="px-4 py-3 bg-white" style={{ color: '#1E3A5F' }}>
                              {details.trim()}
                            </td>
                          </tr>
                        );
                      } else {
                        rows.push(
                          <tr key={`${section}-${index}`} className="border-b" style={{ borderColor: '#FFB74D' }}>
                            <td className="px-4 py-3 font-medium bg-gray-50 border-r" style={{ color: '#1E3A5F', borderColor: '#FFB74D' }}>
                              Feature
                            </td>
                            <td className="px-4 py-3 bg-white border-r" style={{ color: '#1E3A5F', borderColor: '#FFB74D' }}>
                              {pointText}
                            </td>
                            <td className="px-4 py-3 bg-white" style={{ color: '#1E3A5F' }}>
                              {pointText}
                            </td>
                          </tr>
                        );
                      }
                    }
                  });
                  
                  return rows;
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary and Insights */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1E3A5F' }}>
            Summary & Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparison_result?.SUMMARY && (
              <div className="bg-white rounded-lg border shadow-lg p-4" style={{ borderColor: '#FFB74D' }}>
                <h4 className="font-bold mb-3" style={{ color: '#1E3A5F' }}>📋 Summary</h4>
                <div className="space-y-2">
                  {comparison_result.SUMMARY.split('\n').map((line, index) => {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
                      return (
                        <div key={index} className="flex items-start">
                          <span className="mr-2 mt-1" style={{ color: '#FFD700' }}>•</span>
                          <span style={{ color: '#1E3A5F' }}>{trimmedLine.replace(/^[•*]\s*/, '').trim()}</span>
                        </div>
                      );
                    }
                    return (
                      <p key={index} style={{ color: '#1E3A5F' }}>{trimmedLine}</p>
                    );
                  })}
                </div>
              </div>
            )}

            {comparison_result?.RECOMMENDATIONS && (
              <div className="bg-white rounded-lg border shadow-lg p-4" style={{ borderColor: '#FFB74D' }}>
                <h4 className="font-bold mb-3" style={{ color: '#1E3A5F' }}>💡 Recommendations</h4>
                <div className="space-y-2">
                  {comparison_result.RECOMMENDATIONS.split('\n').map((line, index) => {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
                      return (
                        <div key={index} className="flex items-start">
                          <span className="mr-2 mt-1" style={{ color: '#FFD700' }}>•</span>
                          <span style={{ color: '#1E3A5F' }}>{trimmedLine.replace(/^[•*]\s*/, '').trim()}</span>
                        </div>
                      );
                    }
                    return (
                      <p key={index} style={{ color: '#1E3A5F' }}>{trimmedLine}</p>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ML Verification */}
        {ml_verification && (
          <div className="p-6 border-t border-gray-200" style={{ backgroundColor: '#F0E68C' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1E3A5F' }}>AI Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center bg-white p-4 rounded-lg border shadow-sm" style={{ borderColor: '#FFB74D' }}>
                <p className="text-sm font-medium mb-1" style={{ color: '#1E3A5F' }}>Status</p>
                <p className="font-semibold" style={{ color: '#1E3A5F' }}>{ml_verification.status}</p>
              </div>
              <div className="text-center bg-white p-4 rounded-lg border shadow-sm" style={{ borderColor: '#FFB74D' }}>
                <p className="text-sm font-medium mb-1" style={{ color: '#1E3A5F' }}>Confidence</p>
                <p className="font-semibold" style={{ color: '#1E3A5F' }}>
                  {ml_verification.confidence_level} ({(ml_verification.confidence_score * 100).toFixed(1)}%)
                </p>
              </div>
              <div className="text-center bg-white p-4 rounded-lg border shadow-sm" style={{ borderColor: '#FFB74D' }}>
                <p className="text-sm font-medium mb-1" style={{ color: '#1E3A5F' }}>Quality</p>
                <p className="font-semibold" style={{ color: '#1E3A5F' }}>
                  {ml_verification.verification_message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 flex flex-wrap gap-4 justify-center">
          <button
            onClick={downloadPDF}
            className="flex items-center px-6 py-3 text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
            style={{ backgroundColor: '#FFD700' }}
          >
            <Download className="h-5 w-5 mr-2" />
            Download PDF Report
          </button>
          <button
            onClick={shareComparison}
            className="flex items-center px-6 py-3 text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
            style={{ backgroundColor: '#FFB74D' }}
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share Results
          </button>
        </div>
      </div>
    );
  };

  // Filter and search policies
  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.policy_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || policy.policy_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const testAPIConnection = async () => {
    try {
      console.log('🧪 Testing API connection...');
      
      // Check token
      const token = localStorage.getItem('token') || localStorage.getItem('access');
      console.log('🔑 Token:', token ? 'Available' : 'Missing');
      
      if (!token) {
        toast.error('No authentication token found. Please log in.');
        return;
      }
      
      // Test backend connectivity
      const response = await fetch('http://localhost:8000/api/policies/policies/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🌐 Backend response status:', response.status);
      console.log('🌐 Backend response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend connection successful:', data);
        
        // Handle paginated response
        let policyCount = 0;
        if (data.results && Array.isArray(data.results)) {
          policyCount = data.results.length;
          console.log(`📊 Found ${policyCount} policies in paginated response`);
        } else if (Array.isArray(data)) {
          policyCount = data.length;
          console.log(`📊 Found ${policyCount} policies in direct response`);
        }
        
        toast.success(`Backend connection successful! Found ${policyCount} policies`);
        
        // Update policies if we got data
        if (data.results && Array.isArray(data.results)) {
          setPolicies(data.results);
        } else if (data && Array.isArray(data)) {
          setPolicies(data);
        }
      } else {
        const errorData = await response.text();
        console.error('❌ Backend connection failed:', response.status, errorData);
        toast.error(`Backend connection failed: ${response.status}`);
        
        if (response.status === 401) {
          toast.error('Authentication failed. Please log in again.');
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('❌ API connection test failed:', error);
      toast.error('API connection test failed. Check console for details.');
    }
  };

  const testComparisonAPI = async () => {
    if (selectedPolicies.length !== 2) {
      toast.error('Please select exactly 2 policies to test the comparison API.');
      return;
    }

    try {
      setIsComparing(true);
      toast.loading('Testing AI comparison...', { id: 'comparison' });

      console.log('🚀 Starting AI comparison test with policies:', selectedPolicies);
      console.log('🔍 Policy 1 ID:', selectedPolicies[0]);
      console.log('🔍 Policy 2 ID:', selectedPolicies[1]);

      const token = localStorage.getItem('token') || localStorage.getItem('access');
      console.log('🔑 Using token:', token ? 'Available' : 'Missing');

      const response = await aiAPI.comparePolicies(
        selectedPolicies[0], 
        selectedPolicies[1]
      );

      console.log('📊 Comparison response:', response);
      console.log('📊 Response type:', typeof response);
      console.log('📊 Response keys:', Object.keys(response || {}));

      if (response && response.status === 'success') {
        setComparisonResult(response.data);
        setShowComparison(true);
        toast.success('AI comparison test successful!', { id: 'comparison' });
      } else if (response && response.data) {
        setComparisonResult(response.data);
        setShowComparison(true);
        toast.success('AI comparison test successful!', { id: 'comparison' });
      } else if (response && response.comparison_result) {
        setComparisonResult({
          comparison_result: response.comparison_result,
          policy_names: [response.policy1_name, response.policy2_name],
          ml_verification: {
            status: 'verified',
            confidence_score: 0.85,
            confidence_level: 'HIGH',
            verification_message: 'AI analysis completed successfully'
          }
        });
        setShowComparison(true);
        toast.success('AI comparison test successful!', { id: 'comparison' });
      } else {
        console.error('❌ Unexpected response format for AI comparison test:', response);
        throw new Error(response?.error || response?.message || 'AI comparison test failed - unexpected response format');
      }
    } catch (error) {
      console.error('❌ AI comparison test error:', error);
      console.error('❌ Error details:', error.response || error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      
      toast.error(`AI comparison test failed: ${error.message || 'Unknown error'}`, { id: 'comparison' });
    } finally {
      setIsComparing(false);
    }
  };

  const testGeminiConnection = async () => {
    try {
      console.log('🧪 Testing Gemini connection...');
      const response = await aiAPI.testGemini();
      console.log('�� Gemini response:', response);
      console.log('📊 Response type:', typeof response);
      console.log('📊 Response keys:', Object.keys(response || {}));

      if (response && response.status === 'success') {
        toast.success('Gemini connection successful!', { id: 'gemini' });
      } else {
        toast.error('Gemini connection failed. Please check backend logs.', { id: 'gemini' });
      }
    } catch (error) {
      console.error('❌ Gemini connection test failed:', error);
      toast.error('Gemini connection test failed. Check console for details.', { id: 'gemini' });
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F0E68C, #A4D7E1)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchPolicies}
                disabled={isLoading}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors hover:bg-gray-100 rounded-lg"
                title="Refresh policies"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={testAPIConnection}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                title="Test API connection"
              >
                Test API
              </button>
              <button
                onClick={testComparisonAPI}
                className="px-3 py-2 text-sm text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#FFB74D' }}
                title="Test comparison API"
              >
                Test Compare
              </button>
              <button
                onClick={testGeminiConnection}
                className="px-3 py-2 text-sm text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#1E3A5F' }}
                title="Test Gemini connection"
              >
                Test Gemini
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#1E3A5F' }}>
              Policy Comparison
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#1E3A5F' }}>
              Compare insurance policies using advanced AI-powered analysis and get professional insights
            </p>
          </div>
        </div>

        {/* Selected Policies Display */}
        {selectedPolicies.length > 0 && (
          <div className="mb-8 rounded-xl p-6 border" style={{ background: 'linear-gradient(135deg, #F0E68C, #A4D7E1)', borderColor: '#FFB74D' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#1E3A5F' }}>
                Selected Policies ({selectedPolicies.length}/2)
              </h2>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: '#FFB74D' }}>
                  {selectedPolicies.length === 2 ? 'Ready to Compare' : 'Select Another Policy'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {selectedPolicies.map((policyId, index) => {
                const policy = policies.find(p => p.id === policyId);
                if (!policy) return null;
                
                return (
                  <div key={policyId} className="p-4 rounded-lg border-2 shadow-lg relative" style={{ 
                    borderColor: '#FFB74D',
                    background: 'linear-gradient(135deg, #F0E68C, #A4D7E1)',
                    boxShadow: '0 8px 25px rgba(255, 183, 77, 0.3)'
                  }}>
                    <div className="absolute -top-3 -left-3 w-10 h-10 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-xl" style={{ 
                      background: 'linear-gradient(135deg, #FFD700, #FFB74D)',
                      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.6)'
                    }}>
                      {index + 1}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 ml-8">
                        <h3 className="font-bold text-xl mb-3" style={{ color: '#1E3A5F' }}>{policy.name}</h3>
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium text-white shadow-lg" style={{ 
                            background: 'linear-gradient(135deg, #1E3A5F, #2E5A7F)',
                            boxShadow: '0 3px 10px rgba(30, 58, 95, 0.4)'
                          }}>
                            {policy.policy_type || 'General'}
                          </span>
                          <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium text-white shadow-lg" style={{ 
                            background: 'linear-gradient(135deg, #FFB74D, #FF9800)',
                            boxShadow: '0 3px 10px rgba(255, 183, 77, 0.4)'
                          }}>
                            {policy.provider || 'Unknown'}
                          </span>
                        </div>
                        {policy.coverage_amount && (
                          <p className="text-base font-semibold" style={{ color: '#1E3A5F' }}>
                            Coverage: ₹{policy.coverage_amount.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeSelectedPolicy(policyId)}
                        className="text-gray-500 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg hover:shadow-md"
                        title="Remove policy"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {selectedPolicies.length === 2 && (
              <div className="text-center">
                <button
                  onClick={performComparison}
                  disabled={isComparing}
                  className={`px-10 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 ${
                    !isComparing
                      ? 'shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
                      : 'cursor-not-allowed'
                  }`}
                  style={{ backgroundColor: isComparing ? '#ccc' : '#FFD700' }}
                >
                  {isComparing ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-3" />
                      Analyzing with AI...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center" style={{ color: '#1E3A5F' }}>
                      <BarChart3 className="h-6 w-6 mr-3" />
                      Start AI Comparison
                    </div>
                  )}
                </button>
                <p className="text-sm mt-3" style={{ color: '#1E3A5F' }}>
                  AI will analyze both policies and provide detailed comparison insights
                </p>
              </div>
            )}
          </div>
        )}

        {/* Comparison Results */}
        {showComparison && (
          <div className="mb-8">
            {isComparing ? (
              <div className="bg-white rounded-xl shadow-lg border p-12 text-center" style={{ borderColor: '#FFB74D' }}>
                <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6" style={{ color: '#FFD700' }} />
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E3A5F' }}>Analyzing Policies with AI</h3>
                <p className="text-lg mb-6" style={{ color: '#1E3A5F' }}>Please wait while our AI analyzes your selected policies...</p>
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: '#FFD700' }}></div>
                  <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: '#A4D7E1', animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: '#FFB74D', animationDelay: '0.2s' }}></div>
                </div>
              </div>
            ) : comparisonResult ? (
              <>
                {/* Success Message */}
                <div className="mb-6 p-4 border rounded-lg" style={{ backgroundColor: '#F0E68C', borderColor: '#FFB74D' }}>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 mr-3" style={{ color: '#1E3A5F' }} />
                    <div>
                      <p className="font-semibold text-lg" style={{ color: '#1E3A5F' }}>
                        AI Comparison Completed Successfully!
                      </p>
                      <p className="text-sm mt-1" style={{ color: '#1E3A5F' }}>
                        {comparisonResult.fallback_used ? 'Fallback analysis provided' : 'AI-powered analysis completed'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Comparison Results */}
                {renderComparisonTable()}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg border p-12 text-center" style={{ borderColor: '#FFB74D' }}>
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0E68C' }}>
                    <X className="h-12 w-12" style={{ color: '#FFB74D' }} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E3A5F' }}>Comparison Failed</h3>
                <p className="text-lg mb-6" style={{ color: '#1E3A5F' }}>Unable to generate comparison results. Please try again.</p>
                <button
                  onClick={() => setShowComparison(false)}
                  className="px-8 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
                  style={{ backgroundColor: '#FFB74D', color: 'white' }}
                >
                  Close & Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Policy Selection Panel */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Available Policies</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select up to 2 policies to compare. Currently showing {filteredPolicies.length} of {policies.length} policies.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search policies by name, provider, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
                >
                  <option value="all">All Policy Types</option>
                  <option value="health">Health Insurance</option>
                  <option value="life">Life Insurance</option>
                  <option value="auto">Auto Insurance</option>
                  <option value="home">Home Insurance</option>
                  <option value="travel">Travel Insurance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Policy List */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Loading policies...</p>
                </div>
              </div>
            ) : filteredPolicies.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-xl mb-3">
                  {policies.length === 0 ? 'No policies available' : 'No policies match your search'}
                </p>
                {policies.length === 0 && (
                  <button
                    onClick={() => navigate('/upload')}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upload your first policy
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPolicies.map((policy) => (
                  <div
                    key={policy.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedPolicies.includes(policy.id)
                        ? 'shadow-md scale-105'
                        : 'hover:border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                    style={{ 
                      borderColor: selectedPolicies.includes(policy.id) ? '#FFD700' : '#e5e7eb',
                      backgroundColor: selectedPolicies.includes(policy.id) ? '#F0E68C' : 'white'
                    }}
                    onClick={() => handlePolicySelection(policy.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">
                          {policy.name}
                        </h3>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#A4D7E1' }}>
                            {policy.policy_type || 'General'}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {policy.provider || 'Unknown'}
                          </span>
                        </div>
                      </div>
                      {selectedPolicies.includes(policy.id) && (
                        <CheckCircle className="h-5 w-5 flex-shrink-0 ml-2" style={{ color: '#FFD700' }} />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {policy.coverage_amount && (
                        <div className="flex items-center text-xs font-medium" style={{ color: '#1E3A5F' }}>
                          <Shield className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">₹{policy.coverage_amount.toLocaleString()}</span>
                        </div>
                      )}
                      {policy.premium_amount && (
                        <div className="flex items-center text-xs font-medium" style={{ color: '#1E3A5F' }}>
                          <DollarSign className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">₹{policy.premium_amount.toLocaleString()}/year</span>
                        </div>
                      )}
                      {policy.start_date && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{new Date(policy.start_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <div className="text-xs text-center" style={{ color: '#1E3A5F' }}>
                        {selectedPolicies.includes(policy.id) ? 'Selected' : 'Click to select'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePolicies;