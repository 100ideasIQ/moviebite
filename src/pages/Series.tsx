
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tv2, Filter } from 'lucide-react';
import MediaCard from '../components/MediaCard';
import { tmdbService, MediaItem } from '../services/tmdb';
import { useSEO } from '../hooks/useSEO';

const Series: React.FC = () => {
  useSEO({
    title: "Watch Free TV Shows & Series Online | Stream TV Series",
    description: "Stream thousands of free TV shows and series in HD. Watch latest episodes, popular series, trending shows 2025. Binge-watch complete seasons online. No subscription needed.",
    keywords: "watch tv shows online free, free tv series, stream tv shows, latest tv series 2025, popular tv shows, trending series, watch series online, tv streaming, binge watch shows, free tv streaming site",
    canonical: `${window.location.origin}/series`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "TV Series Collection",
      "description": "Stream thousands of free TV shows and series in HD",
      "url": `${window.location.origin}/series`
    }
  });

  const [series, setSeries] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'popularity.desc' | 'first_air_date.desc' | 'vote_average.desc'>('popularity.desc');
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: 'popularity.desc', label: 'Popular' },
    { value: 'first_air_date.desc', label: 'Latest' },
    { value: 'vote_average.desc', label: 'Top Rated' }
  ];

  useEffect(() => {
    fetchSeries(1, sortBy);
  }, [sortBy]);

  const fetchSeries = async (page: number, sort: string) => {
    setLoading(true);
    try {
      const data = await tmdbService.discoverTVShows({ page, sort_by: sort });
      if (page === 1) {
        setSeries(data.results.map((show: any) => ({ ...show, media_type: 'tv' })));
      } else {
        setSeries(prev => [...prev, ...data.results.map((show: any) => ({ ...show, media_type: 'tv' }))]);
      }
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      fetchSeries(currentPage + 1, sortBy);
    }
  };

  const handleSortChange = (newSort: 'popularity.desc' | 'first_air_date.desc' | 'vote_average.desc') => {
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
          <Tv2 className="w-6 h-6 lg:w-8 lg:h-8 text-cinema-red" />
          <h1 className="text-2xl lg:text-4xl font-bold text-white">TV Series</h1>
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
            Showing {series.length} series
          </p>
        </div>
      </motion.div>

      {/* Series Grid */}
      {loading && series.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 lg:w-12 lg:h-12 border-4 border-cinema-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm lg:text-base">Loading TV series...</p>
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
            {series.map((show, index) => (
              <MediaCard key={show.id} item={show} index={index} />
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
                  'Load More Series'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Series;
