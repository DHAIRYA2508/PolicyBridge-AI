#!/usr/bin/env python
"""
ML-Based Policy Comparison Service
Uses traditional ML algorithms for policy analysis without external AI APIs
"""
import re
import math
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
from collections import Counter
import logging

logger = logging.getLogger(__name__)

class MLPolicyComparison:
    """Machine Learning based policy comparison without external AI"""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        
    def extract_text_features(self, policy_text):
        """Extract text features from policy content"""
        if not policy_text:
            return {}
            
        # Clean text
        cleaned_text = re.sub(r'[^\w\s]', ' ', policy_text.lower())
        
        # Extract key metrics
        features = {
            'word_count': len(cleaned_text.split()),
            'unique_words': len(set(cleaned_text.split())),
            'avg_word_length': np.mean([len(word) for word in cleaned_text.split()]) if cleaned_text.split() else 0,
            'sentence_count': len(re.split(r'[.!?]+', policy_text)),
            'paragraph_count': len(policy_text.split('\n\n')),
            'has_numbers': bool(re.search(r'\d', policy_text)),
            'has_dates': bool(re.search(r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}', policy_text)),
            'has_currency': bool(re.search(r'\$[\d,]+', policy_text)),
            'has_percentages': bool(re.search(r'\d+%', policy_text))
        }
        
        return features
    
    def calculate_similarity_score(self, text1, text2):
        """Calculate similarity between two policy texts using TF-IDF and cosine similarity"""
        try:
            if not text1 or not text2:
                return 0.0
                
            # Vectorize texts
            vectors = self.vectorizer.fit_transform([text1, text2])
            
            # Calculate cosine similarity
            similarity_matrix = cosine_similarity(vectors)
            similarity_score = similarity_matrix[0][1]
            
            return float(similarity_score)
            
        except Exception as e:
            logger.error(f"Error calculating similarity: {e}")
            return 0.0
    
    def extract_coverage_keywords(self, text):
        """Extract coverage-related keywords and their frequencies"""
        coverage_keywords = [
            'coverage', 'covered', 'benefits', 'deductible', 'premium', 'policy',
            'insurance', 'claim', 'damage', 'loss', 'medical', 'hospital', 'doctor',
            'prescription', 'medication', 'surgery', 'emergency', 'accident',
            'liability', 'property', 'vehicle', 'home', 'life', 'health'
        ]
        
        text_lower = text.lower()
        keyword_counts = {}
        
        for keyword in coverage_keywords:
            count = text_lower.count(keyword)
            if count > 0:
                keyword_counts[keyword] = count
        
        return keyword_counts
    
    def calculate_risk_score(self, text, keyword_counts):
        """Calculate risk score based on policy content analysis"""
        risk_score = 50  # Base score
        
        # Risk indicators
        high_risk_words = ['exclude', 'exclusion', 'limitation', 'restriction', 'not covered', 'void']
        low_risk_words = ['comprehensive', 'full coverage', 'guaranteed', 'unlimited', 'all inclusive']
        
        text_lower = text.lower()
        
        # High risk indicators
        for word in high_risk_words:
            if word in text_lower:
                risk_score += 10
        
        # Low risk indicators
        for word in low_risk_words:
            if word in text_lower:
                risk_score -= 10
        
        # Coverage breadth analysis
        coverage_breadth = len(keyword_counts)
        if coverage_breadth > 15:
            risk_score -= 15  # More coverage = lower risk
        elif coverage_breadth < 5:
            risk_score += 15  # Less coverage = higher risk
        
        # Normalize to 0-100 range
        risk_score = max(0, min(100, risk_score))
        
        return risk_score
    
    def calculate_cost_efficiency(self, text):
        """Calculate cost efficiency score based on policy content"""
        efficiency_score = 50  # Base score
        
        # Cost-related keywords
        cost_keywords = ['deductible', 'premium', 'cost', 'price', 'fee', 'charge']
        value_keywords = ['benefit', 'coverage', 'protection', 'security', 'guarantee']
        
        text_lower = text.lower()
        
        # Count cost vs value keywords
        cost_count = sum(text_lower.count(keyword) for keyword in cost_keywords)
        value_count = sum(text_lower.count(keyword) for keyword in value_keywords)
        
        if value_count > 0:
            ratio = cost_count / value_count
            if ratio < 0.5:
                efficiency_score += 20  # Good value
            elif ratio > 2:
                efficiency_score -= 20  # Poor value
        
        # Normalize to 0-100 range
        efficiency_score = max(0, min(100, efficiency_score))
        
        return efficiency_score
    
    def compare_policies_ml(self, policy1_text, policy2_text, comparison_criteria):
        """Main ML-based policy comparison function"""
        try:
            # Extract features
            features1 = self.extract_text_features(policy1_text)
            features2 = self.extract_text_features(policy2_text)
            
            # Calculate similarity
            similarity_score = self.calculate_similarity_score(policy1_text, policy2_text)
            
            # Extract coverage keywords
            keywords1 = self.extract_coverage_keywords(policy1_text)
            keywords2 = self.extract_coverage_keywords(policy2_text)
            
            # Calculate risk scores
            risk_score1 = self.calculate_risk_score(policy1_text, keywords1)
            risk_score2 = self.calculate_risk_score(policy2_text, keywords2)
            
            # Calculate cost efficiency
            efficiency1 = self.calculate_cost_efficiency(policy1_text)
            efficiency2 = self.calculate_cost_efficiency(policy2_text)
            
            # Overall comparison score
            comparison_score = int((similarity_score * 0.3 + 
                                  (100 - abs(risk_score1 - risk_score2)) * 0.3 + 
                                  (100 - abs(efficiency1 - efficiency2)) * 0.4))
            
            # Generate ML insights
            ml_insights = self._generate_ml_insights(
                similarity_score, risk_score1, risk_score2, 
                efficiency1, efficiency2, keywords1, keywords2
            )
            
            # Generate detailed analysis
            detailed_analysis = self._generate_detailed_analysis(
                features1, features2, keywords1, keywords2,
                risk_score1, risk_score2, efficiency1, efficiency2
            )
            
            return {
                'comparison_score': comparison_score,
                'similarity_score': similarity_score,
                'risk_analysis': {
                    'policy1_risk': risk_score1,
                    'policy2_risk': risk_score2,
                    'risk_difference': abs(risk_score1 - risk_score2)
                },
                'efficiency_analysis': {
                    'policy1_efficiency': efficiency1,
                    'policy2_efficiency': efficiency2,
                    'efficiency_difference': abs(efficiency1 - efficiency2)
                },
                'coverage_analysis': {
                    'policy1_keywords': len(keywords1),
                    'policy2_keywords': len(keywords2),
                    'common_keywords': len(set(keywords1.keys()) & set(keywords2.keys())),
                    'unique_keywords_policy1': len(set(keywords1.keys()) - set(keywords2.keys())),
                    'unique_keywords_policy2': len(set(keywords2.keys()) - set(keywords1.keys()))
                },
                'ml_insights': ml_insights,
                'detailed_analysis': detailed_analysis
            }
            
        except Exception as e:
            logger.error(f"Error in ML comparison: {e}")
            return {
                'comparison_score': 50,
                'error': str(e),
                'ml_insights': {
                    'similarity_score': 0.5,
                    'risk_assessment': 'Unable to assess',
                    'confidence_level': 'Low'
                }
            }
    
    def _generate_ml_insights(self, similarity, risk1, risk2, eff1, eff2, keywords1, keywords2):
        """Generate ML insights from comparison data"""
        insights = {
            'similarity_score': similarity,
            'risk_assessment': 'Medium',
            'confidence_level': 'High',
            'optimization_tips': []
        }
        
        # Risk assessment
        risk_diff = abs(risk1 - risk2)
        if risk_diff < 10:
            insights['risk_assessment'] = 'Similar Risk Level'
        elif risk1 < risk2:
            insights['risk_assessment'] = 'Policy 1 Lower Risk'
        else:
            insights['risk_assessment'] = 'Policy 2 Lower Risk'
        
        # Optimization tips
        if similarity < 0.3:
            insights['optimization_tips'].append('Policies are very different - consider if both are needed')
        
        if risk_diff > 20:
            insights['optimization_tips'].append('Significant risk difference - evaluate risk tolerance')
        
        if abs(eff1 - eff2) > 20:
            insights['optimization_tips'].append('Cost efficiency varies significantly - analyze value proposition')
        
        if len(keywords1) < 5 or len(keywords2) < 5:
            insights['optimization_tips'].append('Limited coverage detected - review policy comprehensiveness')
        
        if not insights['optimization_tips']:
            insights['optimization_tips'] = ['Policies are well-balanced - current setup appears optimal']
        
        return insights
    
    def _generate_detailed_analysis(self, features1, features2, keywords1, keywords2, 
                                  risk1, risk2, eff1, eff2):
        """Generate detailed analysis report"""
        analysis = {
            'text_analysis': {
                'policy1_complexity': 'High' if features1.get('word_count', 0) > 1000 else 'Medium' if features1.get('word_count', 0) > 500 else 'Low',
                'policy2_complexity': 'High' if features2.get('word_count', 0) > 1000 else 'Medium' if features2.get('word_count', 0) > 500 else 'Low',
                'readability_comparison': 'Similar' if abs(features1.get('avg_word_length', 0) - features2.get('avg_word_length', 0)) < 1 else 'Different'
            },
            'coverage_comparison': {
                'policy1_coverage_breadth': len(keywords1),
                'policy2_coverage_breadth': len(keywords2),
                'coverage_overlap': len(set(keywords1.keys()) & set(keywords2.keys())),
                'coverage_gaps': len(set(keywords1.keys()) ^ set(keywords2.keys()))
            },
            'risk_comparison': {
                'policy1_risk_level': 'High' if risk1 > 70 else 'Medium' if risk1 > 40 else 'Low',
                'policy2_risk_level': 'High' if risk2 > 70 else 'Medium' if risk2 > 40 else 'Low',
                'risk_alignment': 'Aligned' if abs(risk1 - risk2) < 15 else 'Misaligned'
            },
            'efficiency_comparison': {
                'policy1_efficiency': 'High' if eff1 > 70 else 'Medium' if eff1 > 40 else 'Low',
                'policy2_efficiency': 'High' if eff2 > 70 else 'Medium' if eff2 > 40 else 'Low',
                'efficiency_alignment': 'Aligned' if abs(eff1 - eff2) < 15 else 'Misaligned'
            }
        }
        
        return analysis
