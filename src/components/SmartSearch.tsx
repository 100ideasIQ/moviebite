import React, { useState, useEffect, useRef } from 'react';
import { Search, Film, Tv, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { tmdbService } from '../services/tmdb';

interface SearchSuggestion {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv' | 'person';
  poster_path?: string;
  profile_path?: string;
  release_date?: string;
  first_air_date?: string;
}

interface SmartSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ 
  onSearch, 
  placeholder = "Search movies, TV shows, actors...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search for suggestions
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length > 1) {
      debounceRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const data = await tmdbService.searchMulti(query.trim());
          setSuggestions(data.results.slice(0, 8)); // Limit to 8 suggestions
          setShowSuggestions(true);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false);
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    if (suggestion.media_type === 'person') {
      // For now, just search for the person's name
      const personName = suggestion.name || '';
      setQuery(personName);
      navigate(`/search?q=${encodeURIComponent(personName)}`);
    } else {
      const route = suggestion.media_type === 'movie' ? '/movie' : '/tv';
      navigate(`${route}/${suggestion.id}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getDisplayTitle = (item: SearchSuggestion) => {
    return item.title || item.name || 'Unknown';
  };

  const getDisplayDate = (item: SearchSuggestion) => {
    const date = item.release_date || item.first_air_date;
    return date ? new Date(date).getFullYear() : '';
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'movie':
        return <Film className="w-4 h-4 text-cinema-red" />;
      case 'tv':
        return <Tv className="w-4 h-4 text-blue-400" />;
      case 'person':
        return <User className="w-4 h-4 text-green-400" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          style={{ fontSize: '16px' }} // Prevent zoom on iOS
          className="w-full pl-12 pr-12 py-3 lg:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cinema-red focus:bg-white/20 transition-all duration-300 text-sm lg:text-lg"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-cinema-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={`${suggestion.media_type}-${suggestion.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`flex items-center space-x-3 p-3 cursor-pointer transition-all duration-200 ${
                  index === selectedIndex 
                    ? 'bg-cinema-red/20 border-l-4 border-cinema-red' 
                    : 'hover:bg-white/10'
                } ${index === 0 ? 'rounded-t-xl' : ''} ${
                  index === suggestions.length - 1 ? 'rounded-b-xl' : 'border-b border-white/10'
                }`}
              >
                <div className="flex-shrink-0">
                  {getIconForType(suggestion.media_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium truncate">
                      {getDisplayTitle(suggestion)}
                    </span>
                    {getDisplayDate(suggestion) && (
                      <span className="text-gray-400 text-sm">
                        ({getDisplayDate(suggestion)})
                      </span>
                    )}
                  </div>
                  <div className="text-gray-400 text-sm capitalize">
                    {suggestion.media_type === 'tv' ? 'TV Show' : suggestion.media_type}
                  </div>
                </div>

                {(suggestion.poster_path || suggestion.profile_path) && (
                  <div className="flex-shrink-0 w-8 h-12 bg-gray-800 rounded overflow-hidden">
                    <img
                      src={`https://image.tmdb.org/t/p/w92${suggestion.poster_path || suggestion.profile_path}`}
                      alt={getDisplayTitle(suggestion)}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSearch;
