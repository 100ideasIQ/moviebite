import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play,
  Star,
  Calendar,
  ChevronLeft,
  Share2,
  Heart,
  Tv2,
  Plus,
  Check,
  Info,
} from "lucide-react";
import MediaCard from "../components/MediaCard";
import ShareModal from "../components/ShareModal";
import { usePersonalized } from "../contexts/PersonalizedContext";
import {
  tmdbService,
  TVShow,
  getBackdropUrl,
  getImageUrl,
} from "../services/tmdb";
import { useSEO } from "../hooks/useSEO";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const TVDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tvShow, setTVShow] = useState<TVShow | null>(null);
  const [similarTVShows, setSimilarTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const { addToWatchHistory } = usePersonalized();

  useSEO({
    title: tvShow
      ? `${tvShow.name} (${new Date(tvShow.first_air_date).getFullYear()}) - Watch TV Shows Online`
      : "TV Show Details",
    description: tvShow
      ? `Watch ${tvShow.name} (${new Date(tvShow.first_air_date).getFullYear()}) - ${tvShow.overview.substring(0, 150)}...`
      : "Discover and watch amazing TV shows on moviebite",
    keywords: tvShow
      ? `${tvShow.name}, ${tvShow.genres?.map((g) => g.name).join(", ")}, tv show, watch online, series`
      : "tv shows, series, watch online",
    ogType: "video.tv_show",
    ogImage: tvShow ? getBackdropUrl(tvShow.backdrop_path, "w1280") : undefined,
    canonical: `${window.location.origin}/tv/${id}`,
  });

  useEffect(() => {
    const fetchTVData = async () => {
      if (!id) return;

      try {
        const [tvData, similarData] = await Promise.all([
          tmdbService.getTVShowDetails(parseInt(id)),
          tmdbService.getSimilarTVShows(parseInt(id)),
        ]);

        setTVShow(tvData);
        setSimilarTVShows(similarData.results.slice(0, 18));

        const likes = JSON.parse(localStorage.getItem("tv-likes") || "[]");
        setIsLiked(likes.includes(parseInt(id)));

        const watchLater = JSON.parse(
          localStorage.getItem("watchLater") || "[]",
        );
        setIsWatchLater(
          watchLater.some(
            (item: any) => item.id === parseInt(id) && item.media_type === "tv",
          ),
        );

        addToWatchHistory({
          id: tvData.id,
          title: tvData.name,
          media_type: "tv",
          poster_path: tvData.poster_path,
          watchedAt: new Date().toISOString(),
          genres: tvData.genres?.map((g) => g.id) || [],
        });
      } catch (error) {
        console.error("Error fetching TV show details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTVData();
  }, [id, addToWatchHistory]);

  const toggleLike = () => {
    if (!tvShow) return;

    const likes = JSON.parse(localStorage.getItem("tv-likes") || "[]");
    let updatedLikes;

    if (isLiked) {
      updatedLikes = likes.filter((likeId: number) => likeId !== tvShow.id);
    } else {
      updatedLikes = [...likes, tvShow.id];
    }

    localStorage.setItem("tv-likes", JSON.stringify(updatedLikes));
    setIsLiked(!isLiked);
  };

  const toggleWatchLater = () => {
    if (!tvShow) return;
    const watchLater = JSON.parse(localStorage.getItem("watchLater") || "[]");
    let updatedWatchLater;

    if (isWatchLater) {
      updatedWatchLater = watchLater.filter(
        (item: any) => !(item.id === tvShow.id && item.media_type === "tv"),
      );
    } else {
      updatedWatchLater = [
        ...watchLater,
        { id: tvShow.id, media_type: "tv", ...tvShow },
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
            Loading TV show details...
          </p>
        </div>
      </div>
    );
  }

  if (!tvShow) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            TV show not found
          </h1>
          <Link
            to="/series"
            className="text-cinema-red hover:text-cinema-red-light transition-colors duration-300"
          >
            Go back to TV Series
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
            src={getBackdropUrl(tvShow.backdrop_path, "original")}
            alt={tvShow.name}
            className="w-full h-full object-cover"
            data-testid="img-backdrop"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
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
          <Link to="/series">
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

        {/* Content */}
        <div className="relative z-10 h-full flex items-end md:items-center pb-16 md:pb-0">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="max-w-3xl">
              {/* Title */}
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight mb-4 md:mb-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                data-testid="text-title"
              >
                {tvShow.name}
              </motion.h1>

              {/* Tagline */}
              {tvShow.tagline && (
                <motion.p
                  className="text-lg md:text-2xl text-gray-300 italic mb-4 md:mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  data-testid="text-tagline"
                >
                  {tvShow.tagline}
                </motion.p>
              )}

              {/* Metadata */}
              <motion.div
                className="flex flex-wrap items-center gap-3 md:gap-6 text-sm md:text-lg mb-4 md:mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center space-x-2 text-yellow-400">
                  <Star className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                  <span className="font-semibold" data-testid="text-rating">
                    {tvShow.vote_average.toFixed(1)}
                  </span>
                </div>

                {tvShow.first_air_date && (
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                    <span data-testid="text-year">
                      {new Date(tvShow.first_air_date).getFullYear()}
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-gray-300">
                  <Tv2 className="w-5 h-5 md:w-6 md:h-6" />
                  <span>TV Series</span>
                </div>

                {tvShow.number_of_seasons && (
                  <div className="text-gray-300">
                    <span className="font-medium" data-testid="text-seasons">
                      {tvShow.number_of_seasons}
                    </span>{" "}
                    Season{tvShow.number_of_seasons !== 1 ? "s" : ""}
                  </div>
                )}
              </motion.div>

              {/* Genres */}
              <motion.div
                className="flex flex-wrap gap-2 mb-4 md:mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {tvShow.genres?.slice(0, 4).map((genre) => (
                  <Badge
                    key={genre.id}
                    variant="secondary"
                    className="bg-white/10 text-white border-white/20 text-xs md:text-sm px-3 py-1 backdrop-blur-sm"
                    data-testid={`badge-genre-${genre.id}`}
                  >
                    {genre.name}
                  </Badge>
                ))}
              </motion.div>

              {/* Overview */}
              <motion.p
                className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed mb-6 md:mb-8 line-clamp-3 md:line-clamp-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                data-testid="text-overview"
              >
                {tvShow.overview}
              </motion.p>

              {/* Action Buttons */}
            
            <motion.div
  className="flex items-center gap-2 md:gap-4"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.7 }}
>
  <Link to={`/player/tv/${tvShow.id}`}>
    <Button
      size="lg"
      className="bg-white text-black hover:bg-gray-200 text-sm md:text-lg px-4 md:px-10 py-3 md:py-6 h-auto font-bold"
      data-testid="button-play"
    >
      <Play className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2 fill-current" />
      Play
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

      {/* Similar TV Shows Section */}
      {similarTVShows.length > 0 && (
        <section className="bg-black">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">
                More Like This
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {similarTVShows.map((similarShow, index) => (
                  <MediaCard
                    key={similarShow.id}
                    item={{ ...similarShow, media_type: "tv" }}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={tvShow.name}
        url={window.location.href}
      />
    </div>
  );
};

export default TVDetails;
