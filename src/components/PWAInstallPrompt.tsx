
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

const PWAInstallPrompt: React.FC = () => {
  const { showInstallPrompt, installApp, dismissInstallPrompt } = usePWAInstall();

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      console.log('PWA installed successfully');
    }
  };

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 lg:left-auto lg:right-8 lg:bottom-8 lg:max-w-sm z-50"
        >
          <div className="glass-card p-4 rounded-xl border border-white/20 backdrop-blur-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-cinema-red rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm lg:text-base">
                  Add Moviebite to Home Screen
                </h3>
                <p className="text-gray-300 text-xs lg:text-sm mt-1">
                  Install our app for quick access and better experience
                </p>
                
                <div className="flex items-center space-x-2 mt-3">
                  <button
                    onClick={handleInstall}
                    className="flex items-center space-x-1 bg-cinema-red hover:bg-cinema-red-light px-3 py-1.5 rounded-lg text-white text-xs lg:text-sm font-medium transition-colors duration-300"
                  >
                    <Download className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>Install</span>
                  </button>
                  
                  <button
                    onClick={dismissInstallPrompt}
                    className="text-gray-400 hover:text-white px-2 py-1 text-xs lg:text-sm transition-colors duration-300"
                  >
                    Not now
                  </button>
                </div>
              </div>
              
              <button
                onClick={dismissInstallPrompt}
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
