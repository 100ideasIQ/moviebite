
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, FileText, Mail, Clock } from 'lucide-react';

const DMCA: React.FC = () => {
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
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient">DMCA Policy</h1>
            </div>
            <p className="text-lg text-gray-300">
              Digital Millennium Copyright Act Notice
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FileText className="w-6 h-6 text-cinema-red mr-3" />
                Copyright Respect
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Moviebite respects the intellectual property rights of others and expects our users 
                to do the same. We respond to notices of alleged copyright infringement that comply 
                with the Digital Millennium Copyright Act (DMCA).
              </p>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Mail className="w-6 h-6 text-cinema-red mr-3" />
                Filing a DMCA Notice
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>If you believe your copyrighted work has been infringed, please provide:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your physical or electronic signature</li>
                  <li>Description of the copyrighted work claimed to be infringed</li>
                  <li>Description of where the infringing material is located</li>
                  <li>Your contact information (address, phone, email)</li>
                  <li>A statement of good faith belief that use is not authorized</li>
                  <li>A statement of accuracy under penalty of perjury</li>
                </ul>
                <div className="mt-6 p-4 bg-cinema-red/10 border border-cinema-red/20 rounded-lg">
                  <p className="font-semibold">Send DMCA notices to:</p>
                  <p>Email: dmca@moviebite.cc</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Clock className="w-6 h-6 text-cinema-red mr-3" />
                Response Time
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We will process valid DMCA notices promptly, typically within 24-48 hours. 
                We may remove or disable access to allegedly infringing material and notify 
                the user who posted the content.
              </p>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Counter-Notification</h2>
              <p className="text-gray-300 leading-relaxed">
                If you believe your content was removed in error, you may file a counter-notification. 
                Please contact our DMCA agent for counter-notification procedures.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DMCA;
