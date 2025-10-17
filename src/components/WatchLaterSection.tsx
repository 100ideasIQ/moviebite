
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2 } from 'lucide-react';
import { usePersonalized } from '../contexts/PersonalizedContext';
import { getImageUrl } from '../services/tmdb';

const WatchLaterSection: React.FC = () => {
  const { watchLater, removeFromWatchLater } = usePersonalized();

  if (watchLater.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center space-x-3">
          <Bookmark className="w-6 h-6 text-cinema-red" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Watch Later</h2>
        </div>
        <Link
          to="/watch-later"
          className="text-cinema-red hover:text-cinema-red-light transition-colors duration-300 font-medium"
        >
          View All
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
      >
        {watchLater.slice(0, 6).map((item, index) => {
          const title = item.title || item.name;
          const linkPath = item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative"
            >
              <Link to={linkPath}>
                <div className="relative overflow-hidden rounded-xl hover-scale">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={getImageUrl(item.poster_path)}
                      alt={title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    
                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromWatchLater(item.id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                        {title}
                      </h3>
                      <span className="text-gray-300 text-xs capitalize">
                        {item.media_type}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default WatchLaterSection;
