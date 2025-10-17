
import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Users, Shield, AlertCircle } from 'lucide-react';

const TermsOfUse: React.FC = () => {
  return (
    <div className="min-h-screen pt-8">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-cinema-red rounded-xl flex items-center justify-center">
                <Scale className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient">Terms of Use</h1>
            </div>
            <p className="text-lg text-gray-300">
              Last updated: December 2024
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Users className="w-6 h-6 text-cinema-red mr-3" />
                Acceptance of Terms
              </h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using Moviebite , you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by these terms, 
                please do not use this service.
              </p>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-6 h-6 text-cinema-red mr-3" />
                Use License
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>Permission is granted to temporarily access Moviebite for personal, non-commercial use only. This license does not include:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Modifying or copying the materials</li>
                  <li>Using materials for commercial purposes</li>
                  <li>Attempting to reverse engineer any software</li>
                  <li>Removing copyright or proprietary notations</li>
                </ul>
              </div>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <AlertCircle className="w-6 h-6 text-cinema-red mr-3" />
                User Responsibilities
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>As a user, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use the service only for lawful purposes</li>
                  <li>Not interfere with or disrupt the service</li>
                  <li>Not attempt to gain unauthorized access</li>
                  <li>Respect intellectual property rights</li>
                  <li>Provide accurate account information</li>
                </ul>
              </div>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                Moviebite shall not be liable for any damages arising from the use or inability 
                to use the service, including but not limited to direct, indirect, incidental, 
                punitive, and consequential damages.
              </p>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <p className="text-gray-300">
                If you have any questions about these Terms of Use, please contact us at{' '}
                <a href="mailto:legal@moviebite.cc" className="text-cinema-red hover:text-cinema-red-light">
                  legal@moviebite.cc
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfUse;
