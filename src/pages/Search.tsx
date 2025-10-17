import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Search as SearchIcon } from 'lucide-react';
import MediaCard from '../components/MediaCard';
import SmartSearch from '../components/SmartSearch';
import { tmdbService } from '../services/tmdb';
import { anilistService, Anime } from '../services/anilist';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<any[]>([]);
  const [animeResults, setAnimeResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'movie' | 'tv'>('all');

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query, 1);
    }
  }, [searchParams]);

  const performSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const [tmdbData, animeData] = await Promise.all([
        tmdbService.searchMulti(query),
        anilistService.searchAnime(query)
      ]);
      setResults(tmdbData.results.filter((item: any) =>
        item.media_type === 'movie' || item.media_type === 'tv'
      ));
      setAnimeResults(animeData.media || []);
      setTotalResults(tmdbData.total_results); // Assuming total results are from TMDB for now
      setCurrentPage(page);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchParams({ q: query });
    setCurrentPage(1);
    performSearch(query, 1);
  };

  const loadMore = () => {
    if (!loading) {
      // This implementation currently only loads more TMDB results.
      // Enhancements needed for loading more anime if pagination is supported by anilistService.
      performSearch(searchQuery, currentPage + 1);
    }
  };

  const handleFilterChange = (newFilter: 'all' | 'movie' | 'tv') => {
    setMediaTypeFilter(newFilter);
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim(), 1);
    }
  };

  const filteredResults = results.filter(item => {
    if (mediaTypeFilter === 'all') return true;
    const itemType = item.media_type || (item.title ? 'movie' : 'tv');
    return itemType === mediaTypeFilter;
  });

  return (
    <div className="min-h-screen container mx-auto px-4 lg:px-8 py-4 lg:py-8">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 lg:mb-8"
      >
        <h1 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Search</h1>

        {/* Smart Search Form */}
        <div className="mb-4 lg:mb-6">
          <SmartSearch
            onSearch={handleSearch}
            placeholder="Search for movies, TV shows, actors, and anime..."
            className="max-w-full lg:max-w-2xl"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 lg:space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 glass-button px-3 lg:px-4 py-2 rounded-lg text-white transition-all duration-300 text-sm lg:text-base"
            >
              <Filter className="w-3 h-3 lg:w-4 lg:h-4" />
              <span>Filters</span>
            </button>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-wrap items-center gap-2"
              >
                {(['all', 'movie', 'tv'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterChange(type)}
                    className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg font-medium transition-all duration-300 text-sm lg:text-base ${
                      mediaTypeFilter === type
                        ? 'bg-cinema-red text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {type === 'all' ? 'All' : type === 'movie' ? 'Movies' : 'TV Shows'}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {totalResults > 0 && (
            <p className="text-gray-400 text-sm lg:text-base">
              {totalResults.toLocaleString()} results found
            </p>
          )}
        </div>
      </motion.div>

      {/* Results */}
      {loading && results.length === 0 && animeResults.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 lg:w-12 lg:h-12 border-4 border-cinema-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm lg:text-base">Searching...</p>
          </div>
        </div>
      ) : (filteredResults.length > 0 || animeResults.length > 0) ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Movie/TV Results */}
          {filteredResults.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Movies & TV Shows</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-6">
                {filteredResults.map((item, index) => (
                  <MediaCard key={`${item.id}-${item.media_type}`} item={item} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Anime Results */}
          {animeResults.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-white mt-8 mb-6">Anime</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {animeResults.map((anime, index) => (
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-white font-semibold text-sm line-clamp-2">
                            {anime.title.english || anime.title.romaji}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}


          {/* Load More Button */}
          {(results.length < totalResults) && ( // This condition only considers TMDB results for loading more
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
                  'Load More'
                )}
              </button>
            </div>
          )}
        </motion.div>
      ) : searchQuery ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="glass-card p-6 lg:p-8 max-w-md mx-auto">
            <SearchIcon className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg lg:text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-400 mb-4 text-sm lg:text-base">
              We couldn't find anything for "{searchQuery}"
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setResults([]);
                setAnimeResults([]);
                setSearchParams({});
              }}
              className="text-cinema-red hover:text-cinema-red-light transition-colors duration-300 text-sm lg:text-base"
            >
              Clear search
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="glass-card p-6 lg:p-8 max-w-md mx-auto">
            <SearchIcon className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg lg:text-xl font-semibold text-white mb-2">Start your search</h3>
            <p className="text-gray-400 text-sm lg:text-base">
              Search for movies, TV shows, actors, and anime
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Search;