import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="bg-secondary-500 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-1 md:col-span-2"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-secondary-500 font-bold text-lg">PB</span>
              </div>
              <span className="text-2xl font-bold">PolicyBridge AI</span>
            </div>
            <p className="text-secondary-100 text-lg leading-relaxed max-w-md">
              Empowering users to understand complex policy documents through AI-powered analysis and intelligent Q&A.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-1"
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><button className="text-secondary-100 hover:text-white transition-colors duration-200 text-left">About</button></li>
              <li><button className="text-secondary-100 hover:text-white transition-colors duration-200 text-left">Features</button></li>
              <li><button className="text-secondary-100 hover:text-white transition-colors duration-200 text-left">Pricing</button></li>
              <li><button className="text-secondary-100 hover:text-white transition-colors duration-200 text-left">Support</button></li>
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-1"
          >
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-secondary-400 rounded-lg flex items-center justify-center text-white hover:bg-secondary-300 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-secondary-400 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-secondary-100 text-sm">
            © {currentYear} PolicyBridge AI. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button className="text-secondary-100 hover:text-white text-sm transition-colors duration-200">
              Privacy Policy
            </button>
            <button className="text-secondary-100 hover:text-white text-sm transition-colors duration-200">
              Terms of Service
            </button>
          </div>
        </motion.div>

        {/* Made with Love */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8 pt-4"
        >
          <p className="text-secondary-100 text-sm flex items-center justify-center space-x-2">
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <Heart size={16} className="text-accent1-400 fill-current" />
            </motion.div>
            <span>for better policy understanding</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
