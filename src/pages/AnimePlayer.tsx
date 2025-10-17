import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import { anilistService, Anime } from '../services/anilist';
import ResumeWatching from '../components/ResumeWatching';
import { usePersonalized } from '../contexts/PersonalizedContext';
import { useSEO } from '../hooks/useSEO';

const AnimePlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSource, setActiveSource] = useState<'vidify' | 'vidnest'>('vidnest');
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isDub, setIsDub] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { saveResumeProgress } = usePersonalized();

  const mediaId = `anime-${id}-${selectedEpisode}`;

  useSEO({
    title: anime 
      ? `${anime.title.english || anime.title.romaji} - Episode ${selectedEpisode} | Moviebite`
      : "Anime Player",
    description: anime
      ? `Watch ${anime.title.english || anime.title.romaji} Episode ${selectedEpisode} online in HD quality.`
      : "Watch anime online",
    noindex: true,
  });

  useEffect(() => {
    fetchAnimeDetails();
  }, [id]);

  const fetchAnimeDetails = async () => {
    if (!id) return;
    try {
      const data = await anilistService.getAnimeDetails(parseInt(id));
      setAnime(data);
    } catch (error) {
      console.error('Error fetching anime details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlayerUrl = () => {
    if (activeSource === 'vidify') {
      return `https://player.vidify.top/embed/anime/${id}/${selectedEpisode}?dub=${isDub}`;
    } else {
      return `https://vidnest.fun/anime/${id}/${selectedEpisode}/${isDub ? 'dub' : 'sub'}`;
    }
  };

  const handleResume = (timestamp: number) => {
    if (iframeRef.current) {
      const url = getPlayerUrl();
      iframeRef.current.src = `${url}${url.includes('?') ? '&' : '?'}t=${timestamp}`;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (iframeRef.current && anime) {
        saveResumeProgress(mediaId, 0, 0);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [mediaId, anime]);

  if (loading || !anime) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-cinema-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Player */}
          <div className="flex-1">
            {anime && (
              <ResumeWatching
                mediaId={mediaId}
                title={`${anime.title.english || anime.title.romaji} - Episode ${selectedEpisode}`}
                onResume={handleResume}
              />
            )}

            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <iframe
                ref={iframeRef}
                src={getPlayerUrl()}
                className="w-full aspect-video"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>

          {/* Episode List Sidebar */}
          <div className="w-full lg:w-80">
            <div className="glass-card rounded-xl p-4 max-h-[600px] overflow-y-auto">
              <h3 className="text-lg font-bold text-white mb-4">Episodes</h3>
              <div className="space-y-2">
                {anime.episodes && Array.from({ length: anime.episodes }, (_, i) => i + 1).map((ep) => (
                  <motion.button
                    key={ep}
                    onClick={() => setSelectedEpisode(ep)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedEpisode === ep
                        ? 'bg-cinema-red text-white'
                        : 'bg-black/30 text-gray-300 hover:bg-black/50'
                    }`}
                  >
                    Episode {ep}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Anime Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass-card p-6 rounded-xl"
        >
          <div className="flex gap-4">
            <img
              src={anime.coverImage.large}
              alt={anime.title.english || anime.title.romaji}
              className="w-32 h-48 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                Now Playing: Episode {selectedEpisode}
              </h2>
              <h3 className="text-xl text-cinema-red mb-4">
                {anime.title.english || anime.title.romaji}
              </h3>
              <Link
                to={`/anime/${id}`}
                className="inline-flex items-center space-x-2 glass-button px-6 py-3 rounded-lg font-semibold text-white hover:scale-105 transition-transform"
              >
                <Info className="w-4 h-4" />
                <span>View Full Details</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimePlayer;