
import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { usePersonalized } from '../contexts/PersonalizedContext';
import { MediaItem } from '../services/tmdb';

interface WatchLaterButtonProps {
  item: MediaItem;
  mediaType: 'movie' | 'tv';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const WatchLaterButton: React.FC<WatchLaterButtonProps> = ({ 
  item, 
  mediaType, 
  size = 'md', 
  className = '' 
}) => {
  const { addToWatchLater, removeFromWatchLater, isInWatchLater } = usePersonalized();
  const isBookmarked = isInWatchLater(item.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isBookmarked) {
      removeFromWatchLater(item.id);
    } else {
      addToWatchLater(item, mediaType);
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <motion.button
      onClick={handleToggle}
      className={`
        ${sizeClasses[size]} 
        ${isBookmarked 
          ? 'bg-cinema-red text-white' 
          : 'bg-black/50 text-gray-300 hover:bg-black/70'
        } 
        backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110 
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={isBookmarked ? 'Remove from Watch Later' : 'Add to Watch Later'}
    >
      {isBookmarked ? (
        <BookmarkCheck className={`${iconSizes[size]} fill-current`} />
      ) : (
        <Bookmark className={iconSizes[size]} />
      )}
    </motion.button>
  );
};

export default WatchLaterButton;
