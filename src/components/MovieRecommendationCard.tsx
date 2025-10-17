
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Calendar, Tag, Heart } from 'lucide-react';
import { getImageUrl } from '../services/tmdb';

interface Recommendation {
  title: string;
  summary: string;
  reason: string;
  genre: string;
  tmdbData?: any;
}

interface MovieRecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

const MovieRecommendationCard: React.FC<MovieRecommendationCardProps> = ({ 
  recommendation, 
  index 
}) => {
  const { title, summary, reason, genre, tmdbData } = recommendation;
  
  // Determine if it's a movie or TV show based on tmdbData
  const mediaType = tmdbData?.media_type || (tmdbData?.title ? 'movie' : 'tv');
  const displayTitle = tmdbData?.title || tmdbData?.name || title;
  const displaySummary = tmdbData?.overview || summary;
  const releaseDate = tmdbData?.release_date || tmdbData?.first_air_date;
  const rating = tmdbData?.vote_average;
  const posterPath = tmdbData?.poster_path;
  
  const linkPath = tmdbData ? 
    (mediaType === 'movie' ? `/movie/${tmdbData.id}` : `/tv/${tmdbData.id}`) : 
    '#';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="group relative"
    >
      <div className="glass-card rounded-xl overflow-hidden h-full border border-white/10 hover:border-cinema-red/30 transition-all duration-300">
        {/* Poster Section */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {posterPath ? (
            <img
              src={getImageUrl(posterPath, 'w500')}
              alt={displayTitle}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cinema-red/20 to-black/40 flex items-center justify-center">
              <span className="text-white/70 text-lg font-semibold text-center px-4">
                {displayTitle}
              </span>
            </div>
          )}
          
          {/* Overlay with rating */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              {rating && (
                <div className="flex items-center space-x-1 text-yellow-400 mb-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Title and Year */}
          <div>
            <h3 className="text-white font-bold text-lg line-clamp-2 group-hover:text-cinema-red transition-colors">
              {displayTitle}
            </h3>
            
            <div className="flex items-center space-x-3 mt-1">
              {releaseDate && (
                <div className="flex items-center space-x-1 text-gray-400 text-sm">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(releaseDate).getFullYear()}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <Tag className="w-3 h-3" />
                <span className="capitalize">{genre}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
            {displaySummary}
          </p>

          {/* Match Reason */}
          <div className="bg-cinema-red/10 border border-cinema-red/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Heart className="w-4 h-4 text-cinema-red flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-cinema-red text-xs font-medium mb-1">Perfect Match</p>
                <p className="text-white/90 text-sm leading-relaxed">{reason}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {tmdbData && (
            <Link to={linkPath} className="block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-cinema-red/80 hover:bg-cinema-red text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                View Details
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieRecommendationCard;
