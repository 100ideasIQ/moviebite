
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Play } from 'lucide-react';
import { getImageUrl, MediaItem } from '../services/tmdb';
import WatchLaterButton from './WatchLaterButton';

interface MediaCardProps {
  item: MediaItem;
  index?: number;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, index = 0 }) => {
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  
  const linkPath = mediaType === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative"
    >
      <Link to={linkPath}>
        <div className="relative overflow-hidden rounded-xl hover-scale">
          {/* Poster Image */}
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={getImageUrl(item.poster_path)}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            
            {/* Play Button Overlay - Center */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                className="w-16 h-16 bg-cinema-red/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(220, 38, 38, 0.5)",
                    "0 0 30px rgba(220, 38, 38, 0.8)",
                    "0 0 20px rgba(220, 38, 38, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Play className="w-8 h-8 text-white fill-current ml-1" />
              </motion.div>
            </motion.div>
            
            {/* Watch Later Button */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <WatchLaterButton 
                item={item} 
                mediaType={mediaType} 
                size="sm"
              />
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                {title}
              </h3>
              
              <div className="flex items-center justify-between">
                {item.vote_average !== undefined && item.vote_average > 0 && (
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">
                      {item.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}
                
                {releaseDate && (
                  <span className="text-gray-300 text-sm">
                    {new Date(releaseDate).getFullYear()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MediaCard;
