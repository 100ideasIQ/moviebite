
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { anilistService, Anime as AnimeType } from '../services/anilist';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

const Anime: React.FC = () => {
  useSEO({
    title: 'Watch Free Anime Online HD | Anime Series & Movies',
    description: 'Stream thousands of anime series and movies free in HD. Watch latest anime episodes, popular series, trending anime 2025. Sub & dub available. Updated daily.',
    keywords: 'watch anime online free, free anime streaming, anime series, latest anime 2025, popular anime, trending anime, anime episodes, anime movies, sub anime, dub anime, stream anime free',
    canonical: `${window.location.origin}/anime`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Anime Collection",
      "description": "Stream thousands of anime series and movies free in HD",
      "url": `${window.location.origin}/anime`
    }
  });

  const [popularAnime, setPopularAnime] = useState<AnimeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAnime();
  }, [page]);

  const fetchAnime = async () => {
    try {
      setLoading(true);
      const data = await anilistService.getPopularAnime(page);
      setPopularAnime(data.media);
    } catch (error) {
      console.error('Error fetching anime:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen container mx-auto px-4 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="w-8 h-8 text-cinema-red" />
          <h1 className="text-4xl font-bold text-white">Popular Anime</h1>
        </div>
        <p className="text-gray-400">Discover the most popular anime series</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          {popularAnime.map((anime, index) => (
            <motion.div
              key={anime.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <Link to={`/anime/${anime.id}`} className="block group">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-900">
                  <img
                    src={anime.coverImage.large}
                    alt={anime.title.english || anime.title.romaji}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                      {anime.title.english || anime.title.romaji}
                    </h3>
                    {anime.averageScore && (
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{(anime.averageScore / 10).toFixed(1)}/10</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-12 gap-4">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="glass-button px-6 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-white flex items-center px-4">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="glass-button px-6 py-2 rounded-lg text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Anime;
