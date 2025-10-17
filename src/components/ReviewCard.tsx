
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, User } from 'lucide-react';
import { Review, getImageUrl } from '../services/tmdb';

interface ReviewCardProps {
  review: Review;
  index: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300;
  const isLong = review.content.length > maxLength;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="glass-card p-6 rounded-xl"
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
          {review.author_details.avatar_path ? (
            <img
              src={getImageUrl(review.author_details.avatar_path, 'w185')}
              alt={review.author}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-gray-400" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium">{review.author}</h4>
            {review.author_details.rating && (
              <div className="flex items-center space-x-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm">{review.author_details.rating}/10</span>
              </div>
            )}
          </div>
          <p className="text-gray-400 text-sm">
            {new Date(review.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="text-gray-300 leading-relaxed">
        {isExpanded || !isLong 
          ? review.content 
          : `${review.content.slice(0, maxLength)}...`
        }
        
        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-cinema-red hover:text-cinema-red-light ml-2 font-medium"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ReviewCard;
