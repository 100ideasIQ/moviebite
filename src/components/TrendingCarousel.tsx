
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Play, Info } from 'lucide-react';
import { getBackdropUrl, MediaItem, tmdbService } from '../services/tmdb';

const TrendingCarousel: React.FC = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const trendingData = await tmdbService.getTrending();
        setItems(trendingData.results.slice(0, 10));
      } catch (error) {
        console.error('Error fetching trending data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingData();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || items.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => prevIndex === 0 ? items.length - 1 : prevIndex - 1);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % items.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (loading || items.length === 0) {
    return (
      <div className="relative h-[40vh] md:h-[50vh] lg:h-[70vh] bg-gray-900 rounded-2xl animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400 text-sm lg:text-base">Loading trending content...</div>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];
  const title = currentItem.title || currentItem.name;
  const mediaType = currentItem.media_type || (currentItem.title ? 'movie' : 'tv');
  const linkPath = mediaType === 'movie' ? `/movie/${currentItem.id}` : `/tv/${currentItem.id}`;

  return (
    <div
      className="relative h-[40vh] md:h-[50vh] lg:h-[70vh] rounded-2xl overflow-hidden group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={getBackdropUrl(currentItem.backdrop_path, 'w1280')}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-lg lg:max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-2 lg:mb-4">
                  <span className="inline-flex items-center px-2 lg:px-3 py-1 bg-cinema-red rounded-full text-xs lg:text-sm font-medium text-white">
                    <Star className="w-3 h-3 lg:w-4 lg:h-4 mr-1 fill-current" />
                    Trending #{currentIndex + 1}
                  </span>
                </div>

                <h1 className="text-xl md:text-3xl lg:text-6xl font-bold text-white mb-2 lg:mb-4 leading-tight">
                  {title}
                </h1>

                {/* Overview - Hidden on mobile and tablet */}
                {currentItem.overview && (
                  <p className="hidden lg:block text-lg text-gray-300 mb-6 leading-relaxed max-w-xl">
                    {currentItem.overview.length > 150 
                      ? `${currentItem.overview.substring(0, 150)}...` 
                      : currentItem.overview}
                  </p>
                )}

                <div className="flex items-center space-x-2 lg:space-x-4 mb-4 lg:mb-8 text-xs lg:text-sm">
                  {currentItem.vote_average !== undefined && (
                    <>
                      <div className="flex items-center space-x-1 lg:space-x-2 text-yellow-400">
                        <Star className="w-3 h-3 lg:w-5 lg:h-5 fill-current" />
                        <span className="font-semibold">
                          {currentItem.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-gray-400">•</span>
                    </>
                  )}
                  <span className="text-gray-300 capitalize">
                    {mediaType === 'movie' ? 'Movie' : 'TV Show'}
                  </span>
                  {(currentItem.release_date || currentItem.first_air_date) && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-300">
                        {new Date(currentItem.release_date || currentItem.first_air_date).getFullYear()}
                      </span>
                    </>
                  )}
                </div>

                {/* Buttons - Horizontal arrangement for mobile/tablet */}
                <div className="flex flex-row items-center space-x-3 md:space-x-4">
                  <Link
                    to={`/player/${mediaType}/${currentItem.id}`}
                    className="flex items-center space-x-2 bg-cinema-red hover:bg-cinema-red-light px-3 md:px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cinema-red/25 text-xs md:text-sm lg:text-base"
                  >
                    <Play className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 fill-current" />
                    <span>Watch Now</span>
                  </Link>
                  
                  <Link
                    to={linkPath}
                    className="flex items-center space-x-2 glass-button px-3 md:px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 text-xs md:text-sm lg:text-base"
                  >
                    <Info className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                    <span>More Info</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => {
          setCurrentIndex(prevIndex => prevIndex === 0 ? items.length - 1 : prevIndex - 1);
          setIsAutoPlaying(false);
        }}
        className="absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 lg:w-12 lg:h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-20"
      >
        <ChevronLeft className="w-4 h-4 lg:w-6 lg:h-6" />
      </button>

      <button
        onClick={() => {
          setCurrentIndex(prevIndex => (prevIndex + 1) % items.length);
          setIsAutoPlaying(false);
        }}
        className="absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 lg:w-12 lg:h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-20"
      >
        <ChevronRight className="w-4 h-4 lg:w-6 lg:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 lg:space-x-3">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
            }}
            className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-cinema-red scale-125' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      {isAutoPlaying && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className="h-full bg-cinema-red"
            key={currentIndex}
          />
        </div>
      )}
    </div>
  );
};

export default TrendingCarousel;
