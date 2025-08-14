import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: FileText,
      title: 'Smart Document Analysis',
      description: 'Upload PDFs, DOCX, and TXT files. Our AI extracts and understands complex policy content.',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: MessageSquare,
      title: 'AI-Powered Q&A',
      description: 'Ask questions in plain English and get precise answers with exact clause references.',
      color: 'from-accent1-500 to-accent1-600'
    },
    {
      icon: BarChart3,
      title: 'Policy Comparison',
      description: 'Compare multiple policies side-by-side with AI insights and recommendations.',
      color: 'from-accent2-500 to-accent2-600'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with encrypted storage and private document handling.',
      color: 'from-secondary-600 to-secondary-700'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Legal Counsel',
      company: 'TechCorp Inc.',
      content: 'PolicyBridge AI saved me hours of research. The AI found relevant clauses instantly!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Compliance Officer',
      company: 'GlobalBank',
      content: 'Finally, a tool that makes policy analysis accessible to non-legal professionals.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'HR Director',
      company: 'StartupXYZ',
      content: 'The comparison feature helped us choose the best insurance policy for our team.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 to-accent2-100/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6"
            >
              Understand Policies with{' '}
              <span className="text-gradient">AI Intelligence</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Upload your policy documents and ask questions in plain English. 
              Get instant answers with exact clause references and AI-powered insights.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup" className="btn-primary text-lg px-8 py-4">
                  Get Started Free
                  <ArrowRight size={20} className="ml-2" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="btn-outline text-lg px-8 py-4">
                  Sign In
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 flex flex-wrap justify-center items-center gap-8 text-text-secondary"
            >
              <div className="flex items-center space-x-2">
                <Shield size={20} className="text-secondary-500" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap size={20} className="text-accent2-500" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={20} className="text-accent1-500" />
                <span>Trusted by 1000+</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 w-20 h-20 bg-accent2-200 rounded-full opacity-20"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute top-40 right-20 w-16 h-16 bg-accent1-200 rounded-full opacity-20"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Powerful Features for Policy Analysis
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Everything you need to understand, analyze, and compare policy documents
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="text-center group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              How It Works
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Three simple steps to unlock the power of AI-driven policy analysis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Upload Your Policy',
                description: 'Drag and drop your PDF, DOCX, or TXT files. Our system processes them securely.',
                icon: FileText
              },
              {
                step: '2',
                title: 'Ask Questions',
                description: 'Type your questions in plain English. No legal jargon required.',
                icon: MessageSquare
              },
              {
                step: '3',
                title: 'Get AI Answers',
                description: 'Receive precise answers with exact clause references and insights.',
                icon: CheckCircle
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center relative"
                >
                  <div className="w-20 h-20 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-accent1-500 to-accent2-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Join thousands of professionals who trust PolicyBridge AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card hover:shadow-glow transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-accent2-500 fill-current" />
                  ))}
                </div>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-text-primary">{testimonial.name}</p>
                  <p className="text-sm text-text-secondary">{testimonial.role} at {testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary-500 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Policy Analysis?
            </h2>
            <p className="text-xl text-secondary-100 mb-8">
              Join thousands of professionals who are already saving time and gaining insights
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signup" className="bg-white text-secondary-600 hover:bg-primary-50 font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 inline-flex items-center">
                Start Your Free Trial
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
