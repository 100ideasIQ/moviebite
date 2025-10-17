
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Skull } from 'lucide-react';
import { tmdbService, MediaItem } from '../services/tmdb';
import MediaCard from './MediaCard';

const MidnightZone: React.FC = () => {
  const [isNightTime, setIsNightTime] = useState(false);
  const [darkContent, setDarkContent] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      // Show between 10 PM (22) and 6 AM (6)
      const isNight = hour >= 22 || hour < 6;
      setIsNightTime(isNight);

      // Apply midnight theme to body
      if (isNight) {
        document.body.classList.add('midnight-theme');
      } else {
        document.body.classList.remove('midnight-theme');
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute

    return () => {
      clearInterval(interval);
      document.body.classList.remove('midnight-theme');
    };
  }, []);

  useEffect(() => {
    if (!isNightTime) return;

    const fetchDarkContent = async () => {
      setLoading(true);
      try {
        // Fetch horror, thriller, and mystery content
        const [horrorMovies, thrillerMovies, mysteryTVShows] = await Promise.all([
          tmdbService.discoverMovies({
            with_genres: '27', // Horror
            sort_by: 'popularity.desc',
            page: 1,
          }),
          tmdbService.discoverMovies({
            with_genres: '53', // Thriller
            sort_by: 'vote_average.desc',
            page: 1,
          }),
          tmdbService.discoverTVShows({
            with_genres: '9648', // Mystery
            sort_by: 'popularity.desc',
            page: 1,
          }),
        ]);

        const combinedContent = [
          ...horrorMovies.results.slice(0, 4).map(item => ({ ...item, media_type: 'movie' as const })),
          ...thrillerMovies.results.slice(0, 4).map(item => ({ ...item, media_type: 'movie' as const })),
          ...mysteryTVShows.results.slice(0, 4).map(item => ({ ...item, media_type: 'tv' as const })),
        ];

        // Shuffle and limit to 12 items
        const shuffled = combinedContent.sort(() => Math.random() - 0.5).slice(0, 12);
        setDarkContent(shuffled);
      } catch (error) {
        console.error('Error fetching dark content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDarkContent();
  }, [isNightTime]);

  if (!isNightTime || darkContent.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 lg:px-8 py-8 midnight-zone relative">
      {/* Background gradient effect */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Moon className="w-6 h-6 text-purple-400" />
          </motion.div>
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-white midnight-glow"
            animate={{ 
              textShadow: [
                "0 0 5px #8b5cf6, 0 0 10px #8b5cf6, 0 0 15px #8b5cf6",
                "0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6",
                "0 0 5px #8b5cf6, 0 0 10px #8b5cf6, 0 0 15px #8b5cf6"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span
              animate={{ 
                x: [0, 1, -1, 0],
                opacity: [1, 0.8, 1]
              }}
              transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 3 }}
            >
              Midnight Zone
            </motion.span>
          </motion.h2>
          <motion.div
            animate={{ 
              opacity: [0.5, 1, 0.5],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Skull className="w-5 h-5 text-red-400" />
          </motion.div>
        </div>
        <motion.p 
          className="text-purple-300 text-sm"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🌙 Dark thrills for the night owls... Enter if you dare
        </motion.p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <motion.div 
              key={index} 
              className="aspect-[2/3] bg-gray-900 rounded-xl animate-pulse border border-purple-500/20"
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                borderColor: ["rgba(168, 85, 247, 0.2)", "rgba(168, 85, 247, 0.5)", "rgba(168, 85, 247, 0.2)"]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
        >
          {darkContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative midnight-card hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-red-900/20 rounded-xl pointer-events-none" />
              <motion.div
                className="absolute inset-0 border border-purple-500/20 rounded-xl pointer-events-none"
                animate={{ 
                  borderColor: [
                    "rgba(168, 85, 247, 0.2)", 
                    "rgba(168, 85, 247, 0.4)", 
                    "rgba(168, 85, 247, 0.2)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              />
              <MediaCard item={item} index={index} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default MidnightZone;
