
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Film } from 'lucide-react';
import MediaCard from '../components/MediaCard';
import { tmdbService, MediaItem } from '../services/tmdb';

const TopRatedMovies: React.FC = () => {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTopRatedMovies(1);
  }, []);

  const fetchTopRatedMovies = async (page: number) => {
    setLoading(true);
    try {
      const data = await tmdbService.getTopRatedMovies(page);
      if (page === 1) {
        setMovies(data.results.map((movie: any) => ({ ...movie, media_type: 'movie' })));
      } else {
        setMovies(prev => [...prev, ...data.results.map((movie: any) => ({ ...movie, media_type: 'movie' }))]);
      }
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      fetchTopRatedMovies(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen container mx-auto px-4 lg:px-8 py-4 lg:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 lg:mb-8"
      >
        <div className="flex items-center space-x-3 mb-4 lg:mb-6">
          <Star className="w-6 h-6 lg:w-8 lg:h-8 text-cinema-red fill-current" />
          <h1 className="text-2xl lg:text-4xl font-bold text-white">Top Rated Movies</h1>
        </div>
        <p className="text-gray-400 text-sm lg:text-base">
          Discover the highest-rated movies of all time
        </p>
      </motion.div>

      {/* Movies Grid */}
      {loading && movies.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 lg:w-12 lg:h-12 border-4 border-cinema-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm lg:text-base">Loading top rated movies...</p>
          </div>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-6"
          >
            {movies.map((movie, index) => (
              <MediaCard key={movie.id} item={movie} index={index} />
            ))}
          </motion.div>

          {/* Load More Button */}
          {currentPage < totalPages && (
            <div className="text-center mt-8 lg:mt-12">
              <button
                onClick={loadMore}
                disabled={loading}
                className="glass-button px-6 lg:px-8 py-2 lg:py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Load More Movies'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TopRatedMovies;
