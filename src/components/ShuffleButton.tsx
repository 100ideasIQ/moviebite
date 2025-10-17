
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { tmdbService } from '../services/tmdb';

const ShuffleButton: React.FC = () => {
  const navigate = useNavigate();
  const [isShuffling, setIsShuffling] = useState(false);

  const handleShuffle = async () => {
    if (isShuffling) return;
    
    setIsShuffling(true);
    
    try {
      // Randomly choose between movies and TV shows
      const isMovie = Math.random() > 0.5;
      
      // Get random page (1-10 for better content)
      const randomPage = Math.floor(Math.random() * 10) + 1;
      
      let data;
      if (isMovie) {
        const response = await tmdbService.getPopularMovies(randomPage);
        data = response.results;
      } else {
        const response = await tmdbService.getPopularTVShows(randomPage);
        data = response.results;
      }
      
      if (data && data.length > 0) {
        const randomItem = data[Math.floor(Math.random() * data.length)];
        const path = isMovie ? `/movie/${randomItem.id}` : `/tv/${randomItem.id}`;
        navigate(path);
      }
    } catch (error) {
      console.error('Shuffle error:', error);
    } finally {
      setIsShuffling(false);
    }
  };

  return (
    <motion.button
      onClick={handleShuffle}
      disabled={isShuffling}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-cinema-red hover:bg-cinema-red-light rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 disabled:opacity-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={isShuffling ? { rotate: 360 } : {}}
      transition={{ duration: isShuffling ? 1 : 0.3, repeat: isShuffling ? Infinity : 0 }}
    >
      <svg 
        className="w-6 h-6 text-white" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" 
        />
      </svg>
    </motion.button>
  );
};

export default ShuffleButton;
