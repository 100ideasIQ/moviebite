import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Calendar, Clock, Info, ChevronRight, Play } from 'lucide-react';
import { tmdbService, Movie, TVShow, getImageUrl, Season, Episode } from '../services/tmdb';
import { usePersonalized } from '../contexts/PersonalizedContext';
import ResumeWatching from '../components/ResumeWatching';
import MediaCard from '../components/MediaCard';
import { useSEO } from '../hooks/useSEO';

const Player: React.FC = () => {
  const {
    type,
    id
  } = useParams<{
    type: 'movie' | 'tv';
    id: string;
  }>();
  const [mediaItem, setMediaItem] = useState<Movie | TVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [seasonData, setSeasonData] = useState<Season & { episodes: Episode[] } | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [activeSource, setActiveSource] = useState<'vidify' | 'vidnest'>('vidnest');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { addToWatchHistory, saveResumeProgress } = usePersonalized();

  const mediaId = `${type}-${id}-${type === 'tv' ? `${selectedSeason}-${selectedEpisode}` : ''}`;

  useSEO({
    title: mediaItem 
      ? `Watch ${'title' in mediaItem ? mediaItem.title : mediaItem.name}${type === 'tv' ? ` - S${selectedSeason}E${selectedEpisode}` : ''} `
      : "Player",
    description: mediaItem
      ? `Watch ${'title' in mediaItem ? mediaItem.title : mediaItem.name} online in HD quality.`
      : "Watch movies and TV shows online",
    noindex: true,
  });

  useEffect(() => {
    const fetchMediaData = async () => {
      if (!id || !type) return;
      try {
        let data;
        if (type === 'movie') {
          data = await tmdbService.getMovieDetails(parseInt(id));
          // Fetch similar movies for sidebar
          const similarData = await tmdbService.getSimilarMovies(parseInt(id));
          setSimilarMovies(similarData.results.slice(0, 6));
        } else {
          data = await tmdbService.getTVShowDetails(parseInt(id));
        }
        setMediaItem(data);
        if (data) {
          const title = 'title' in data ? data.title : data.name;
          addToWatchHistory({
            id: data.id,
            title,
            media_type: type,
            poster_path: data.poster_path,
            watchedAt: new Date().toISOString(),
            genres: data.genres?.map(g => g.id) || [],
          });
        }
      } catch (error) {
        console.error('Error fetching media data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMediaData();
  }, [id, type, addToWatchHistory]);

  useEffect(() => {
    const fetchSeasonData = async () => {
      if (type === 'tv' && id) {
        try {
          const data = await tmdbService.getTVShowSeasons(parseInt(id), selectedSeason);
          setSeasonData(data);
        } catch (error) {
          console.error('Error fetching season data:', error);
        }
      }
    };
    fetchSeasonData();
  }, [type, id, selectedSeason]);

  const getPlayerUrl = () => {
    if (activeSource === 'vidify') {
      if (type === 'movie') {
        return `https://player.vidify.top/embed/movie/${id}?autoplay=true&poster=true&chromecast=true&servericon=true&setting=true&pip=true&download=true&font=Roboto&fontcolor=6f63ff&fontsize=20&opacity=0.5&primarycolor=3b82f6&secondarycolor=1f2937&iconcolor=ffffff`;
      } else {
        return `https://player.vidify.top/embed/tv/${id}/${selectedSeason}/${selectedEpisode}?autoplay=true&poster=true&chromecast=true&servericon=true&setting=true&pip=true&download=true&font=Roboto&fontcolor=6f63ff&fontsize=20&opacity=0.5&primarycolor=3b82f6&secondarycolor=1f2937&iconcolor=ffffff`;
      }
    } else {
      // VidNest
      if (type === 'movie') {
        return `https://vidnest.fun/movie/${id}`;
      } else {
        return `https://vidnest.fun/tv/${id}/${selectedSeason}/${selectedEpisode}`;
      }
    }
  };

  const handleResume = (timestamp: number) => {
    // Reload iframe to resume from timestamp
    if (iframeRef.current) {
      const url = getPlayerUrl();
      iframeRef.current.src = `${url}${url.includes('?') ? '&' : '?'}t=${timestamp}`;
    }
  };

  // Save progress periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (iframeRef.current && mediaItem) {
        saveResumeProgress(mediaId, 0, 0); // You can implement actual time tracking if needed
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [mediaId, mediaItem, saveResumeProgress]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-12 h-12 lg:w-16 lg:h-16 border-4 border-cinema-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm lg:text-base">Loading player...</p>
        </div>
      </div>
    );
  }

  if (!mediaItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-xl lg:text-2xl font-bold text-white mb-4">Content not found</h1>
          <Link to="/" className="text-cinema-red hover:text-cinema-red-light transition-colors duration-300 text-sm lg:text-base">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const title = 'title' in mediaItem ? mediaItem.title : mediaItem.name;


  return (
    <div className="min-h-screen bg-black">
      <div className="w-full px-4 lg:px-8 py-4 lg:py-8">
        {/* Resume Watching Component */}
        <div className="w-full max-w-none mb-4">
          <ResumeWatching
            mediaId={mediaId}
            title={title}
            onResume={handleResume}
          />
        </div>

        {/* Player and Sidebar Container */}
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-none">
          {/* Player Container */}
          <div className="flex-1">
            <div
              id="video-player"
              className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10"
            >
              <iframe
                key={`${type}-${id}-${selectedSeason}-${selectedEpisode}-${activeSource}`}
                ref={iframeRef}
                src={getPlayerUrl()}
                className="w-full h-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                title={`${title} - Player`}
              />
            </div>

            {/* Source Selector Below Player */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 glass-card rounded-xl p-4"
            >
              <h3 className="text-sm font-semibold text-gray-400 mb-3">PLAYER SOURCES</h3>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSource('vidnest')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeSource === 'vidnest'
                      ? 'bg-gradient-to-r from-cinema-red to-red-600 text-white shadow-lg shadow-cinema-red/30'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>VidNest</span>
                  {activeSource === 'vidnest' && (
                    <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">Primary</span>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSource('vidify')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeSource === 'vidify'
                      ? 'bg-gradient-to-r from-cinema-red to-red-600 text-white shadow-lg shadow-cinema-red/30'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>Vidify</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Modern Sidebar */}
          <div className="w-full lg:w-80 xl:w-96">
            <div className="glass-card rounded-2xl p-5 max-h-[700px] overflow-y-auto border border-white/10">
              {type === 'tv' && mediaItem && 'number_of_seasons' in mediaItem ? (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-bold text-white">Episodes</h3>
                    <div className="px-3 py-1 bg-cinema-red/20 text-cinema-red rounded-full text-xs font-semibold">
                      {seasonData?.episodes?.length || 0} Episodes
                    </div>
                  </div>

                  {/* Season Selector */}
                  <div className="mb-5">
                    <label className="text-xs font-semibold text-gray-400 mb-2 block uppercase tracking-wider">Select Season</label>
                    <select
                      value={selectedSeason}
                      onChange={(e) => {
                        setSelectedSeason(Number(e.target.value));
                        setSelectedEpisode(1);
                      }}
                      className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-cinema-red focus:ring-2 focus:ring-cinema-red/20 transition-all"
                    >
                      {Array.from({ length: mediaItem.number_of_seasons || 1 }, (_, i) => i + 1).map((season) => (
                        <option key={season} value={season}>
                          Season {season}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Episode Cards */}
                  <div className="space-y-3">
                    {seasonData?.episodes?.map((episode, idx) => (
                      <motion.button
                        key={episode.id}
                        onClick={() => setSelectedEpisode(episode.episode_number)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left rounded-xl overflow-hidden transition-all duration-300 ${
                          selectedEpisode === episode.episode_number
                            ? 'bg-gradient-to-r from-cinema-red to-red-600 shadow-lg shadow-cinema-red/30'
                            : 'bg-black/40 hover:bg-black/60'
                        }`}
                      >
                        <div className="flex gap-4 p-3">
                          {episode.still_path && (
                            <div className="relative w-28 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                              <img
                                src={getImageUrl(episode.still_path, 'w185')}
                                alt={episode.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.svg';
                                }}
                              />
                              {selectedEpisode === episode.episode_number && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <Play className="w-6 h-6 text-white" />
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs font-bold px-2 py-0.5 bg-white/20 rounded">E{episode.episode_number}</span>
                              {episode.vote_average > 0 && (
                                <div className="flex items-center gap-1 text-yellow-400 text-xs">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span className="font-semibold">{episode.vote_average.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm font-semibold line-clamp-1 mb-1">{episode.name}</p>
                            {episode.overview && (
                              <p className="text-xs text-gray-300 line-clamp-2 opacity-80">{episode.overview}</p>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-bold text-white">Similar Movies</h3>
                    <div className="px-3 py-1 bg-cinema-red/20 text-cinema-red rounded-full text-xs font-semibold">
                      {similarMovies.length} Titles
                    </div>
                  </div>
                  <div className="space-y-3">
                    {similarMovies.map((movie, idx) => (
                      <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        className="block"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="flex gap-4 p-3 rounded-xl bg-black/40 hover:bg-black/60 transition-all duration-300 border border-white/5 hover:border-cinema-red/30"
                        >
                          <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                            <img
                              src={getImageUrl(movie.poster_path, 'w185')}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white line-clamp-2 mb-2">
                              {movie.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs">
                              {movie.release_date && (
                                <span className="text-gray-400 font-medium">
                                  {new Date(movie.release_date).getFullYear()}
                                </span>
                              )}
                              {movie.vote_average > 0 && (
                                <div className="flex items-center gap-1 text-yellow-400">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                            {movie.overview && (
                              <p className="text-xs text-gray-400 line-clamp-2 mt-2">{movie.overview}</p>
                            )}
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Media Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 md:mt-6 glass-card p-3 md:p-4 lg:p-6 rounded-xl max-w-6xl mx-auto"
        >
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 lg:space-x-6">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <img
                src={getImageUrl(mediaItem.poster_path, 'w300')}
                alt={title}
                className="w-20 h-30 md:w-24 md:h-36 lg:w-32 lg:h-48 object-cover rounded-lg shadow-lg"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>

            {/* Details */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2">Now Playing</h2>
              <h3 className="text-base md:text-lg lg:text-xl text-cinema-red mb-2 md:mb-4">
                {title}
                {type === 'tv' && ` - S${selectedSeason}:E${selectedEpisode}`}
              </h3>

              {mediaItem.overview && (
                <p className="text-gray-300 leading-relaxed mb-3 md:mb-4 text-xs md:text-sm lg:text-base line-clamp-2 md:line-clamp-3 lg:line-clamp-none">
                  {mediaItem.overview}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 lg:gap-4 text-xs md:text-sm text-gray-400 mb-3 md:mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                  <span>{mediaItem.vote_average.toFixed(1)}/10</span>
                </div>
                {'release_date' in mediaItem && mediaItem.release_date && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{new Date(mediaItem.release_date).getFullYear()}</span>
                  </div>
                )}
                {'first_air_date' in mediaItem && mediaItem.first_air_date && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{new Date(mediaItem.first_air_date).getFullYear()}</span>
                  </div>
                )}
                {'runtime' in mediaItem && mediaItem.runtime && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{mediaItem.runtime} min</span>
                  </div>
                )}
              </div>

              <Link
                to={type === 'movie' ? `/movie/${id}` : `/tv/${id}`}
                className="inline-flex items-center space-x-1 md:space-x-2 glass-button px-3 md:px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 text-xs md:text-sm lg:text-base"
              >
                <Info className="w-3 h-3 md:w-4 md:h-4" />
                <span>View Full Details</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Player;