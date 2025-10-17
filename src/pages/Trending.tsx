
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar } from 'lucide-react';
import MediaCard from '../components/MediaCard';
import { tmdbService, MediaItem } from '../services/tmdb';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useSEO } from '../hooks/useSEO';

const Trending: React.FC = () => {
  useSEO({
    title: 'Trending Movies & TV Shows | Watch What\'s Popular Now',
    description: 'Discover trending movies, TV shows and anime this week. Watch the most popular and viral content online. Updated daily with what\'s hot and trending in 2025.',
    keywords: 'trending movies, popular movies, trending tv shows, what to watch, viral movies, popular shows 2025, trending now, hot movies, trending content, most watched',
    canonical: `${window.location.origin}/trending`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Trending Content",
      "description": "Discover trending movies, TV shows and anime",
      "url": `${window.location.origin}/trending`
    }
  });

  const [trendingContent, setTrendingContent] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('week');
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTrendingData();
  }, [timeWindow, mediaType, currentPage]);

  const fetchTrendingData = async () => {
    setLoading(true);
    try {
      const data = await tmdbService.getTrending(mediaType, timeWindow);
      setTrendingContent(data.results);
      setTotalPages(Math.min(data.total_pages, 500)); // TMDb limits to 500 pages
    } catch (error) {
      console.error('Error fetching trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-cinema-red" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Trending Now</h1>
          </div>
          <p className="text-gray-400 text-lg">Discover what's popular right now</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6 rounded-2xl mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Time Window Filter */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-cinema-red" />
              <span className="text-white font-medium mr-4">Time Period:</span>
              <div className="flex space-x-2">
                {[
                  { key: 'day', label: 'Today' },
                  { key: 'week', label: 'This Week' }
                ].map((period) => (
                  <button
                    key={period.key}
                    onClick={() => {
                      setTimeWindow(period.key as 'day' | 'week');
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      timeWindow === period.key
                        ? 'bg-cinema-red text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Type Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium mr-4">Type:</span>
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'movie', label: 'Movies' },
                  { key: 'tv', label: 'TV Shows' }
                ].map((type) => (
                  <button
                    key={type.key}
                    onClick={() => {
                      setMediaType(type.key as 'all' | 'movie' | 'tv');
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      mediaType === type.key
                        ? 'bg-cinema-red text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cinema-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading trending content...</p>
            </div>
          </div>
        )}

        {/* Content Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-12"
          >
            {trendingContent.map((item, index) => (
              <MediaCard key={item.id} item={item} index={index} />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <Pagination>
              <PaginationContent className="glass-card p-2 rounded-xl">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={`${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cinema-red hover:text-white'} text-white`}
                  />
                </PaginationItem>

                {getVisiblePages().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === '...' ? (
                      <span className="px-3 py-2 text-gray-400">...</span>
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page as number);
                        }}
                        isActive={currentPage === page}
                        className={`${
                          currentPage === page
                            ? 'bg-cinema-red text-white'
                            : 'text-white hover:bg-cinema-red hover:text-white'
                        }`}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    className={`${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cinema-red hover:text-white'} text-white`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Trending;
