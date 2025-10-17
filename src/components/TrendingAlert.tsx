
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { tmdbService, MediaItem } from '../services/tmdb';

const TrendingAlert: React.FC = () => {
  const [currentTrending, setCurrentTrending] = useState<MediaItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [trendingItems, setTrendingItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await tmdbService.getTrending('all', 'week');
        setTrendingItems(data.results.slice(0, 10));
      } catch (error) {
        console.error('Error fetching trending:', error);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    if (trendingItems.length === 0) return;

    const showAlert = () => {
      const randomItem = trendingItems[Math.floor(Math.random() * trendingItems.length)];
      setCurrentTrending(randomItem);
      setIsVisible(true);

      // Auto hide after 8 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 8000);
    };

    // Show first alert after 10 seconds
    const initialTimer = setTimeout(showAlert, 10000);

    // Show subsequent alerts every 30 seconds
    const interval = setInterval(showAlert, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [trendingItems]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!currentTrending) return null;

  const title = currentTrending.title || currentTrending.name;
  const mediaType = currentTrending.media_type || (currentTrending.title ? 'movie' : 'tv');
  const linkPath = mediaType === 'movie' ? `/movie/${currentTrending.id}` : `/tv/${currentTrending.id}`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-20 right-4 z-50 max-w-sm"
        >
          <div className="glass-card p-4 rounded-xl shadow-2xl border border-cinema-red/20">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-cinema-red animate-pulse" />
                <span className="text-cinema-red font-semibold text-sm">Trending Now</span>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cinema-red/20 to-cinema-red/10 rounded-lg flex items-center justify-center">
                <span className="text-xl">🔥</span>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm line-clamp-1 mb-1">
                  {title}
                </h4>
                <Link
                  to={linkPath}
                  onClick={handleClose}
                  className="text-cinema-red hover:text-cinema-red-light text-xs font-medium transition-colors duration-300"
                >
                  Watch it here →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TrendingAlert;
