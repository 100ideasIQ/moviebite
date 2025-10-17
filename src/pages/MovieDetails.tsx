import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Star,
  Calendar,
  Clock,
  Heart,
  Share2,
  Plus,
  Check,
  ChevronLeft,
  Info,
  Trophy,
  Users,
} from "lucide-react";
import {
  tmdbService,
  getImageUrl,
  getBackdropUrl,
  Movie,
  Cast,
  Video as TMDBVideo,
} from "../services/tmdb";
import { useSEO } from "../hooks/useSEO";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import MediaCard from "../components/MediaCard";
import CastCard from "../components/CastCard";
import ReviewCard from "../components/ReviewCard";
import TrailerModal from "../components/TrailerModal";
import ShareModal from "../components/ShareModal";
import { usePersonalized } from "../contexts/PersonalizedContext";

interface Review {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [cast, setCast] = useState<Cast[]>([]);
  const [videos, setVideos] = useState<TMDBVideo[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { addToWatchHistory } = usePersonalized();

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;

      try {
        setError(null);
        const [movieData, similarData, creditsData, videosData, reviewsData] =
          await Promise.all([
            tmdbService.getMovieDetails(parseInt(id)),
            tmdbService.getSimilarMovies(parseInt(id)),
            tmdbService.getMovieCredits(parseInt(id)),
            tmdbService.getMovieVideos(parseInt(id)),
            tmdbService.getMovieReviews(parseInt(id)),
          ]);

        setMovie(movieData);
        setSimilarMovies(similarData.results.slice(0, 18));
        setCast(creditsData.cast.slice(0, 12));
        setVideos(
          videosData.results.filter(
            (video: TMDBVideo) => video.type === "Trailer",
          ),
        );
        setReviews(reviewsData.results.slice(0, 8));

        const likes = JSON.parse(localStorage.getItem("likes") || "[]");
        setIsLiked(likes.includes(parseInt(id)));

        const watchLater = JSON.parse(
          localStorage.getItem("watchLater") || "[]",
        );
        setIsWatchLater(
          watchLater.some((item: any) => item.id === parseInt(id)),
        );

        addToWatchHistory({
          id: movieData.id,
          title: movieData.title,
          media_type: "movie",
          poster_path: movieData.poster_path,
          watchedAt: new Date().toISOString(),
          genres: movieData.genres?.map((g) => g.id) || [],
        });
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, addToWatchHistory]);

  const toggleLike = () => {
    if (!movie) return;
    const likes = JSON.parse(localStorage.getItem("likes") || "[]");
    let updatedLikes;

    if (isLiked) {
      updatedLikes = likes.filter((likeId: number) => likeId !== movie.id);
    } else {
      updatedLikes = [...likes, movie.id];
    }

    localStorage.setItem("likes", JSON.stringify(updatedLikes));
    setIsLiked(!isLiked);
  };

  const toggleWatchLater = () => {
    if (!movie) return;
    const watchLater = JSON.parse(localStorage.getItem("watchLater") || "[]");
    let updatedWatchLater;

    if (isWatchLater) {
      updatedWatchLater = watchLater.filter(
        (item: any) => item.id !== movie.id,
      );
    } else {
      updatedWatchLater = [
        ...watchLater,
        { id: movie.id, media_type: "movie", ...movie },
      ];
    }

    localStorage.setItem("watchLater", JSON.stringify(updatedWatchLater));
    setIsWatchLater(!isWatchLater);
  };

  const trailer = videos.find((video) => video.type === "Trailer");

  useSEO({
    title: movie
      ? `${movie.title} (${new Date(movie.release_date).getFullYear()}) - Watch Movie`
      : "Movie Details",
    description: movie
      ? `Watch ${movie.title} (${new Date(movie.release_date).getFullYear()}) - ${movie.overview.substring(0, 150)}...`
      : "Discover and watch amazing movies on moviebite",
    keywords: movie
      ? `${movie.title}, ${movie.genres?.map((g) => g.name).join(", ")}, movie, watch online, cinema`
      : "movies, cinema, watch online",
    ogType: "video.movie",
    ogImage: movie ? getBackdropUrl(movie.backdrop_path, "w1280") : undefined,
    canonical: `${window.location.origin}/movie/${id}`,
  });

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
            Loading movie details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Movie Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            The movie you're looking for doesn't exist.
          </p>
          <Link to="/movies">
            <Button data-testid="button-browse-movies">Browse Movies</Button>
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
            src={getBackdropUrl(movie.backdrop_path, "original")}
            alt={movie.title}
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
          <Link to="/movies">
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
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight mb-4 md:mb-6"
                data-testid="text-title"
              >
                {movie.title}
              </motion.h1>

              {/* Metadata */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-3 md:gap-6 text-sm md:text-lg mb-4 md:mb-6"
              >
                <div className="flex items-center space-x-2 text-yellow-400">
                  <Star className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                  <span className="font-semibold" data-testid="text-rating">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                  <span data-testid="text-year">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                </div>
                {movie.runtime && (
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Clock className="w-5 h-5 md:w-6 md:h-6" />
                    <span data-testid="text-runtime">
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Genres */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-2 mb-4 md:mb-6"
              >
                {movie.genres?.slice(0, 4).map((genre) => (
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed mb-6 md:mb-8 line-clamp-3 md:line-clamp-4"
                data-testid="text-overview"
              >
                {movie.overview}
              </motion.p>

              {/* Action Buttons */}
             <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6 }}
  className="flex items-center gap-2 md:gap-4"
>
  <Link to={`/player/movie/${movie.id}`}>
    <Button
      size="lg"
      className="bg-white text-black hover:bg-gray-200 text-sm md:text-lg px-4 md:px-10 py-3 md:py-6 h-auto font-bold"
      data-testid="button-play"
    >
      <Play className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2 fill-current" />
      Play
    </Button>
  </Link>
  {trailer && (
    <Button
      variant="outline"
      size="lg"
      className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm text-sm md:text-lg px-4 md:px-10 py-3 md:py-6 h-auto"
      onClick={() => setShowTrailer(true)}
      data-testid="button-trailer"
    >
      <Info className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2" />
      More Info
    </Button>
  )}
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

      {/* Content Section */}
      <div className="bg-black">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-16">
          {/* Tabs Section */}
          <Tabs defaultValue="cast" className="space-y-8">
            <TabsList className="bg-white/5 backdrop-blur-sm border border-white/10 p-1 grid w-full grid-cols-3 md:w-auto md:inline-grid md:grid-cols-3">
              <TabsTrigger
                value="cast"
                className="data-[state=active]:bg-cinema-red data-[state=active]:text-white"
                data-testid="tab-cast"
              >
                <Users className="w-4 h-4 mr-2 hidden md:inline" />
                Cast
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-cinema-red data-[state=active]:text-white"
                data-testid="tab-reviews"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="similar"
                className="data-[state=active]:bg-cinema-red data-[state=active]:text-white"
                data-testid="tab-similar"
              >
                Similar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cast">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">
                  Cast & Crew
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                  {cast.map((actor, index) => (
                    <CastCard key={actor.id} cast={actor} index={index} />
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="reviews">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">
                  User Reviews
                </h2>
                {reviews.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {reviews.map((review, index) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <p className="text-gray-400 text-lg">
                      No reviews available yet.
                    </p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="similar">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">
                  More Like This
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                  {similarMovies.map((similarMovie, index) => (
                    <MediaCard
                      key={similarMovie.id}
                      item={{ ...similarMovie, media_type: "movie" }}
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      <TrailerModal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        videoKey={trailer?.key || null}
        title={movie.title}
      />
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={movie.title}
        url={window.location.href}
      />
    </div>
  );
};

export default MovieDetails;
