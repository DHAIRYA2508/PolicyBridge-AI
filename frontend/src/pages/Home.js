import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { TypeAnimation } from 'react-type-animation';
import { 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon, 
  ChartBarIcon, 
  ShieldCheckIcon,
  ArrowRightIcon,
  StarIcon,
  UserGroupIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const springProps = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 300, friction: 30 }
  });

  const features = [
    {
      icon: DocumentTextIcon,
      title: "Smart Policy Analysis",
      description: "AI-powered document processing with intelligent insights and recommendations",
      color: "from-primary-500 to-primary-600"
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Interactive Q&A",
      description: "Ask questions about your policies and get instant, accurate answers",
      color: "from-secondary-500 to-secondary-600"
    },
    {
      icon: ChartBarIcon,
      title: "Policy Comparison",
      description: "Compare multiple policies side-by-side with detailed analysis",
      color: "from-accent1-500 to-accent1-600"
    },
    {
      icon: ShieldCheckIcon,
      title: "Compliance Tracking",
      description: "Monitor policy compliance and get automated alerts",
      color: "from-accent2-500 to-accent2-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Legal Director",
      company: "TechCorp Inc.",
      content: "PolicyBridge AI has revolutionized how we handle policy management. The AI insights are incredibly accurate.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "Compliance Officer",
      company: "Global Finance",
      content: "The policy comparison feature saves us hours of manual work. Highly recommended for any compliance team.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "HR Manager",
      company: "StartupXYZ",
      content: "User-friendly interface with powerful AI capabilities. It's like having a legal expert on our team.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const stats = [
    { number: "10K+", label: "Policies Analyzed", color: "text-primary-500" },
    { number: "95%", label: "Accuracy Rate", color: "text-secondary-500" },
    { number: "500+", label: "Happy Clients", color: "text-accent1-500" },
    { number: "24/7", label: "AI Support", color: "text-accent2-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-accent">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-sunlit opacity-10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-gradient-sunlit">PolicyBridge</span>
              <br />
              <span className="text-gradient-ocean">AI</span>
            </h1>
            <div className="text-xl md:text-2xl lg:text-3xl text-text-secondary mb-8">
              <TypeAnimation
                sequence={[
                  'Transform your policy management with AI',
                  2000,
                  'Get instant insights from complex documents',
                  2000,
                  'Ensure compliance with confidence',
                  2000,
                  'Make informed decisions faster',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-gradient"
              />
            </div>
            <p className="text-lg md:text-xl text-text-muted max-w-3xl mx-auto mb-12">
              Leverage the power of artificial intelligence to analyze, understand, and manage your policy documents with unprecedented accuracy and speed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/signup"
              className="btn-primary text-lg px-8 py-4 hover:shadow-sunlit animate-sunlit-glow"
            >
              Get Started Free
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/login"
              className="btn-outline text-lg px-8 py-4 border-2 border-secondary-500 text-secondary-500 hover:bg-secondary-500 hover:text-white"
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              Why Choose <span className="text-gradient-sunlit">PolicyBridge AI</span>?
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Our cutting-edge AI technology delivers unmatched accuracy and insights for policy analysis and management.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="card card-hover p-8 text-center hover-sunlit">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-4">{feature.title}</h3>
                  <p className="text-text-muted leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-ocean">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`text-4xl md:text-5xl lg:text-6xl font-bold ${stat.color} mb-2`}>
                  {stat.number}
                </div>
                <div className="text-lg text-white/90 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              How It <span className="text-gradient-ocean">Works</span>
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Get started with PolicyBridge AI in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Policy",
                description: "Simply drag and drop your policy documents or use our secure file upload system",
                icon: DocumentTextIcon,
                color: "from-primary-500 to-accent3-500"
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our advanced AI processes your documents and extracts key information automatically",
                icon: RocketLaunchIcon,
                color: "from-secondary-500 to-accent2-500"
              },
              {
                step: "03",
                title: "Get Insights",
                description: "Receive comprehensive analysis, recommendations, and answers to your questions",
                icon: ChatBubbleLeftRightIcon,
                color: "from-accent1-500 to-primary-500"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="card card-hover p-8 text-center hover-sunlit">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white text-2xl font-bold`}>
                    {item.step}
                  </div>
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-4">{item.title}</h3>
                  <p className="text-text-muted leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              What Our <span className="text-gradient-sunlit">Clients Say</span>
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Join thousands of satisfied users who trust PolicyBridge AI for their policy management needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card card-hover p-8 hover-sunlit"
              >
                <div className="flex items-center mb-6">
                  <div className="flex -space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-primary-500 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-text-muted mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-text-primary">{testimonial.name}</div>
                    <div className="text-sm text-text-muted">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-sunlit">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your <span className="text-gradient-cream">Policy Management</span>?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of organizations already using PolicyBridge AI to streamline their policy workflows and ensure compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                className="bg-white text-secondary-500 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sunlit"
              >
                Start Free Trial
                <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white hover:bg-white hover:text-secondary-500 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
