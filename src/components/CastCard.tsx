
import React from 'react';
import { motion } from 'framer-motion';
import { getImageUrl, Cast } from '../services/tmdb';

interface CastCardProps {
  cast: Cast;
  index: number;
}

const CastCard: React.FC<CastCardProps> = ({ cast, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="glass-card p-4 rounded-xl text-center hover-scale"
    >
      <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden">
        <img
          src={getImageUrl(cast.profile_path, 'w185')}
          alt={cast.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
      <h4 className="text-white font-medium text-sm mb-1">{cast.name}</h4>
      <p className="text-gray-400 text-xs">{cast.character}</p>
    </motion.div>
  );
};

export default CastCard;
