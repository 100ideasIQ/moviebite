
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ArrowLeft } from 'lucide-react';
import { usePersonalized } from '../contexts/PersonalizedContext';
import { getImageUrl } from '../services/tmdb';

const WatchLater: React.FC = () => {
  const { watchLater, removeFromWatchLater } = usePersonalized();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-4 mb-8"
        >
          <Link
            to="/"
            className="flex items-center space-x-2 glass-button px-4 py-2 rounded-lg text-white transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <Bookmark className="w-8 h-8 text-cinema-red" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">Watch Later</h1>
          </div>
        </motion.div>

        {/* Content */}
        {watchLater.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-16"
          >
            <Bookmark className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No items in your watch later list</h2>
            <p className="text-gray-400 mb-8">Start adding movies and TV shows you want to watch later!</p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-cinema-red hover:bg-cinema-red-light px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105"
            >
              <span>Explore Content</span>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <p className="text-gray-400">
                {watchLater.length} item{watchLater.length !== 1 ? 's' : ''} saved
              </p>
            </motion.div>

            {/* Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
            >
              {watchLater.map((item, index) => {
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
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-300 capitalize">
                                {item.media_type}
                              </span>
                              <span className="text-gray-400">
                                {new Date(item.addedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default WatchLater;
