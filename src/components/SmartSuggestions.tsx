
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { usePersonalized } from '../contexts/PersonalizedContext';
import { tmdbService, MediaItem } from '../services/tmdb';
import MediaCard from './MediaCard';

const SmartSuggestions: React.FC = () => {
  const { watchHistory } = usePersonalized();
  const [suggestions, setSuggestions] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastWatched, setLastWatched] = useState<string>('');

  useEffect(() => {
    if (watchHistory.length === 0) return;

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        // Get the most recent watched item
        const recentItem = watchHistory[0];
        setLastWatched(recentItem.title);

        // Get similar content based on the recent watch
        let similarData;
        if (recentItem.media_type === 'movie') {
          similarData = await tmdbService.getSimilarMovies(recentItem.id);
        } else {
          similarData = await tmdbService.getSimilarTVShows(recentItem.id);
        }

        // Also get recommendations based on genres
        const topGenres = getTopGenres(watchHistory);
        let genreBasedData;
        
        if (topGenres.length > 0) {
          genreBasedData = await tmdbService.discoverMovies({
            with_genres: topGenres.slice(0, 2).join(','),
            sort_by: 'popularity.desc',
            page: 1,
          });
        }

        // Combine and deduplicate suggestions
        const combinedSuggestions = [
          ...similarData.results.slice(0, 6),
          ...(genreBasedData?.results?.slice(0, 6) || []),
        ];

        const uniqueSuggestions = combinedSuggestions
          .filter((item, index, self) => 
            index === self.findIndex(t => t.id === item.id)
          )
          .slice(0, 12);

        setSuggestions(uniqueSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [watchHistory]);

  const getTopGenres = (history: any[]) => {
    const genreCount: { [key: number]: number } = {};
    
    history.forEach(item => {
      item.genres?.forEach((genreId: number) => {
        genreCount[genreId] = (genreCount[genreId] || 0) + 1;
      });
    });

    return Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genreId]) => parseInt(genreId));
  };

  if (watchHistory.length === 0 || suggestions.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="flex items-center space-x-3 mb-2">
          <Brain className="w-6 h-6 text-cinema-red" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Because you watched</h2>
        </div>
        <p className="text-cinema-red font-medium">"{lastWatched}"</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
        >
          {suggestions.map((item, index) => (
            <MediaCard 
              key={item.id} 
              item={item} 
              index={index} 
            />
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default SmartSuggestions;
