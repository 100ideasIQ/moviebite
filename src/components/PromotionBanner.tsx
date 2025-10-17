
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Trophy } from 'lucide-react';

const PromotionBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkBannerDisplay = () => {
      const today = new Date().toDateString();
      const bannerData = localStorage.getItem('promotionBanner');
      
      if (bannerData) {
        const { date, count } = JSON.parse(bannerData);
        
        if (date !== today) {
          // New day, reset count
          localStorage.setItem('promotionBanner', JSON.stringify({ date: today, count: 1 }));
          setIsVisible(true);
        } else if (count < 3) {
          // Show banner if count is less than 3
          localStorage.setItem('promotionBanner', JSON.stringify({ date: today, count: count + 1 }));
          setIsVisible(true);
        }
      } else {
        // First time, show banner
        localStorage.setItem('promotionBanner', JSON.stringify({ date: today, count: 1 }));
        setIsVisible(true);
      }
    };

    // Delay to show after page loads
    const timer = setTimeout(checkBannerDisplay, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pointer-events-none"
        >
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-2xl w-full glass-card border border-cinema-red/30 rounded-xl shadow-2xl shadow-cinema-red/20 pointer-events-auto overflow-hidden"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cinema-red/10 via-transparent to-cinema-red/10" />
            
            {/* Content */}
            <div className="relative p-4 sm:p-5">
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 hover:bg-white/10 rounded-lg transition-colors duration-200 group"
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white" />
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-4 pr-8">
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    Join Our Community! 🎬
                  </h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Stay updated with latest releases and sports streams
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <a
                      href="https://t.me/yourtelegram"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-lg transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <Send className="w-4 h-4" />
                      <span>Telegram</span>
                    </a>
                    
                    <a
                      href="https://discord.gg/yourdiscord"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-400 rounded-lg transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Discord</span>
                    </a>
                    
                    <a
                      href="https://sportsbite.cc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-3 py-1.5 bg-cinema-red/20 hover:bg-cinema-red/30 border border-cinema-red/30 text-cinema-red rounded-lg transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <Trophy className="w-4 h-4" />
                      <span>Sports Stream</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromotionBanner;
