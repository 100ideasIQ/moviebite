import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Play,
  ChevronLeft,
  Heart,
  Plus,
  Check,
  Share2,
  Info,
} from "lucide-react";
import { anilistService, Anime } from "../services/anilist";
import { useSEO } from "../hooks/useSEO";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import ShareModal from "../components/ShareModal";

const AnimeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useSEO({
    title: anime
      ? `${anime.title.english || anime.title.romaji} - Watch Anime | Moviebite`
      : "Loading...",
    description:
      anime?.description?.replace(/<[^>]*>/g, "").slice(0, 160) || "",
  });

  useEffect(() => {
    fetchAnimeDetails();
  }, [id]);

  const fetchAnimeDetails = async () => {
    if (!id) return;
    try {
      const data = await anilistService.getAnimeDetails(parseInt(id));
      setAnime(data);

      const likes = JSON.parse(localStorage.getItem("anime-likes") || "[]");
      setIsLiked(likes.includes(parseInt(id)));

      const watchLater = JSON.parse(localStorage.getItem("watchLater") || "[]");
      setIsWatchLater(
        watchLater.some(
          (item: any) =>
            item.id === parseInt(id) && item.media_type === "anime",
        ),
      );
    } catch (error) {
      console.error("Error fetching anime details:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = () => {
    if (!anime) return;

    const likes = JSON.parse(localStorage.getItem("anime-likes") || "[]");
    let updatedLikes;

    if (isLiked) {
      updatedLikes = likes.filter((likeId: number) => likeId !== anime.id);
    } else {
      updatedLikes = [...likes, anime.id];
    }

    localStorage.setItem("anime-likes", JSON.stringify(updatedLikes));
    setIsLiked(!isLiked);
  };

  const toggleWatchLater = () => {
    if (!anime) return;
    const watchLater = JSON.parse(localStorage.getItem("watchLater") || "[]");
    let updatedWatchLater;

    if (isWatchLater) {
      updatedWatchLater = watchLater.filter(
        (item: any) => !(item.id === anime.id && item.media_type === "anime"),
      );
    } else {
      updatedWatchLater = [
        ...watchLater,
        { id: anime.id, media_type: "anime", ...anime },
      ];
    }

    localStorage.setItem("watchLater", JSON.stringify(updatedWatchLater));
    setIsWatchLater(!isWatchLater);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-cinema-red border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg" data-testid="text-loading">
            Loading anime details...
          </p>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Anime not found
          </h1>
          <Link
            to="/anime"
            className="text-cinema-red hover:text-cinema-red-light"
          >
            Browse Anime
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - Netflix Style */}
      <div className="relative h-[70vh] md:h-[85vh] lg:h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={anime.bannerImage || anime.coverImage.large}
            alt={anime.title.english || anime.title.romaji}
            className="w-full h-full object-cover"
            data-testid="img-backdrop"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-20 md:top-24 left-4 md:left-8 z-20"
        >
          <Link to="/anime">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 backdrop-blur-sm"
              data-testid="button-back"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </Button>
          </Link>
        </motion.div>

        {/* Poster - Mobile Only */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-24 right-4 md:hidden z-10 w-32 h-48"
        >
          <img
            src={anime.coverImage.large}
            alt={anime.title.english || anime.title.romaji}
            className="w-full h-full object-cover rounded-lg shadow-2xl border-2 border-white/20"
            data-testid="img-poster-mobile"
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-end md:items-center pb-16 md:pb-0">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid md:grid-cols-[300px,1fr] lg:grid-cols-[350px,1fr] gap-8 items-end md:items-center">
              {/* Poster - Desktop */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden md:block"
              >
                <img
                  src={anime.coverImage.large}
                  alt={anime.title.english || anime.title.romaji}
                  className="w-full rounded-xl shadow-2xl border-4 border-white/20"
                  data-testid="img-poster-desktop"
                />
              </motion.div>

              {/* Info */}
              <div className="max-w-3xl">
                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-2 md:mb-4"
                  data-testid="text-title"
                >
                  {anime.title.english || anime.title.romaji}
                </motion.h1>

                {/* Native Title */}
                {anime.title.native && (
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-400 text-base md:text-lg mb-4 md:mb-6"
                    data-testid="text-native-title"
                  >
                    {anime.title.native}
                  </motion.p>
                )}

                {/* Metadata */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap items-center gap-3 md:gap-6 text-sm md:text-lg mb-4 md:mb-6"
                >
                  {anime.averageScore && (
                    <div className="flex items-center space-x-2 text-yellow-400">
                      <Star className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                      <span className="font-semibold" data-testid="text-rating">
                        {(anime.averageScore / 10).toFixed(1)}/10
                      </span>
                    </div>
                  )}
                  {anime.episodes && (
                    <span className="text-gray-300" data-testid="text-episodes">
                      {anime.episodes} Episodes
                    </span>
                  )}
                  {anime.format && (
                    <span className="text-gray-300">{anime.format}</span>
                  )}
                  {anime.seasonYear && (
                    <span className="text-gray-300" data-testid="text-year">
                      {anime.seasonYear}
                    </span>
                  )}
                </motion.div>

                {/* Genres */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-2 mb-4 md:mb-6"
                >
                  {anime.genres?.slice(0, 5).map((genre) => (
                    <Badge
                      key={genre}
                      variant="secondary"
                      className="bg-white/10 text-white border-white/20 text-xs md:text-sm px-3 py-1 backdrop-blur-sm"
                      data-testid={`badge-genre-${genre}`}
                    >
                      {genre}
                    </Badge>
                  ))}
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed mb-6 md:mb-8 line-clamp-3 md:line-clamp-4"
                  dangerouslySetInnerHTML={{ __html: anime.description || "" }}
                  data-testid="text-description"
                />

                {/* Action Buttons */}
              <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.8 }}
  className="flex items-center gap-2 md:gap-4"
>
  <Link to={`/anime-player/${id}`}>
    <Button
      size="lg"
      className="bg-white text-black hover:bg-gray-200 text-sm md:text-lg px-4 md:px-10 py-3 md:py-6 h-auto font-bold"
      data-testid="button-play"
    >
      <Play className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2 fill-current" />
      Watch Now
    </Button>
  </Link>
  <Button
    variant="outline"
    size="lg"
    className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm text-sm md:text-lg px-4 md:px-10 py-3 md:py-6 h-auto"
    data-testid="button-info"
  >
    <Info className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2" />
    More Info
  </Button>
  <Button
    variant="outline"
    size="icon"
    className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm w-10 h-10 md:w-14 md:h-14 rounded-full flex-shrink-0"
    onClick={toggleWatchLater}
    data-testid="button-watchlater"
  >
    {isWatchLater ? (
      <Check className="w-4 h-4 md:w-6 md:h-6" />
    ) : (
      <Plus className="w-4 h-4 md:w-6 md:h-6" />
    )}
  </Button>
  <Button
    variant="outline"
    size="icon"
    className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm w-10 h-10 md:w-14 md:h-14 rounded-full flex-shrink-0"
    onClick={toggleLike}
    data-testid="button-like"
  >
    <Heart className={`w-4 h-4 md:w-6 md:h-6 ${isLiked ? 'fill-current text-red-500' : ''}`} />
  </Button>
  <Button
    variant="outline"
    size="icon"
    className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm w-10 h-10 md:w-14 md:h-14 rounded-full flex-shrink-0"
    onClick={() => setShowShareModal(true)}
    data-testid="button-share"
  >
    <Share2 className="w-4 h-4 md:w-6 md:h-6" />
  </Button>
</motion.div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      {anime.status && (
        <section className="bg-black">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {anime.format && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-gray-400 text-sm mb-2">Format</h3>
                    <p
                      className="text-white text-xl md:text-2xl font-bold"
                      data-testid="text-format"
                    >
                      {anime.format.replace(/_/g, " ")}
                    </p>
                  </div>
                )}
                {anime.status && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-gray-400 text-sm mb-2">Status</h3>
                    <p
                      className="text-white text-xl md:text-2xl font-bold"
                      data-testid="text-status"
                    >
                      {anime.status.replace(/_/g, " ")}
                    </p>
                  </div>
                )}
                {anime.seasonYear && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-gray-400 text-sm mb-2">Year</h3>
                    <p
                      className="text-white text-xl md:text-2xl font-bold"
                      data-testid="text-info-year"
                    >
                      {anime.seasonYear}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={anime.title.english || anime.title.romaji}
        url={window.location.href}
      />
    </div>
  );
};

export default AnimeDetails;
