
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Film, Filter } from 'lucide-react';
import MediaCard from '../components/MediaCard';
import { tmdbService, MediaItem } from '../services/tmdb';
import { useSEO } from '../hooks/useSEO';

const Movies: React.FC = () => {
  useSEO({
    title: "Watch Free Movies Online HD | Latest Movies Streaming",
    description: "Stream thousands of free HD movies online. Watch latest releases, popular blockbusters, classic films & trending movies 2025. No signup required. Updated daily.",
    keywords: "watch movies online free, free movies, hd movies, latest movies 2025, new movies, popular movies, blockbuster movies, streaming movies, cinema online, watch movies free, movie streaming site, free movie website",
    canonical: `${window.location.origin}/movies`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Movies Collection",
      "description": "Stream thousands of free HD movies online",
      "url": `${window.location.origin}/movies`
    }
  });

  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'popularity.desc' | 'primary_release_date.desc' | 'vote_average.desc'>('popularity.desc');
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: 'popularity.desc', label: 'Popular' },
    { value: 'primary_release_date.desc', label: 'Latest' },
    { value: 'vote_average.desc', label: 'Top Rated' }
  ];

  useEffect(() => {
    fetchMovies(1, sortBy);
  }, [sortBy]);

  const fetchMovies = async (page: number, sort: string) => {
    setLoading(true);
    try {
      const data = await tmdbService.discoverMovies({ page, sort_by: sort });
      if (page === 1) {
        setMovies(data.results.map((movie: any) => ({ ...movie, media_type: 'movie' })));
      } else {
        setMovies(prev => [...prev, ...data.results.map((movie: any) => ({ ...movie, media_type: 'movie' }))]);
      }
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      fetchMovies(currentPage + 1, sortBy);
    }
  };

  const handleSortChange = (newSort: 'popularity.desc' | 'primary_release_date.desc' | 'vote_average.desc') => {
    setSortBy(newSort);
    setCurrentPage(1);
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
          <Film className="w-6 h-6 lg:w-8 lg:h-8 text-cinema-red" />
          <h1 className="text-2xl lg:text-4xl font-bold text-white">Movies</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 lg:space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center space-x-2 glass-button px-3 py-2 rounded-lg text-white transition-all duration-300 text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Sort</span>
            </button>

            <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex flex-wrap items-center gap-2`}>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value as any)}
                  className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm lg:text-base ${
                    sortBy === option.value
                      ? 'bg-cinema-red text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-gray-400 text-xs lg:text-sm">
            Showing {movies.length} movies
          </p>
        </div>
      </motion.div>

      {/* Movies Grid */}
      {loading && movies.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 lg:w-12 lg:h-12 border-4 border-cinema-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm lg:text-base">Loading movies...</p>
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

export default Movies;
