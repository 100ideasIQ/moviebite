import React, { useState, useEffect } from "react";
import TrendingCarousel from "../components/TrendingCarousel";
import SocialShare from "../components/SocialShare";
import MediaCard from "../components/MediaCard";
import WatchLaterSection from "../components/WatchLaterSection";
import SmartSuggestions from "../components/SmartSuggestions";
import MoodFilters from "../components/MoodFilters";
import MidnightZone from "../components/MidnightZone";
import ShuffleButton from "../components/ShuffleButton";
import TrendingAlert from "../components/TrendingAlert";
import { tmdbService, MediaItem } from "../services/tmdb";
import { anilistService, Anime } from "../services/anilist";
import { useSEO } from "../hooks/useSEO";
import { motion } from "framer-motion";
import { Film, Tv, TrendingUp, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  // SEO Configuration
  useSEO({
    title:
      "Moviebite - Watch Free Movies, TV Shows & Anime Online in HD",
    description:
      "Watch unlimited movies, TV shows and anime free in HD quality. Stream latest releases, trending content, classics & more. No sign up required. Best free streaming platform 2025.",
    keywords:
      "watch movies online free, stream tv shows, free movie streaming, watch anime online, hd movies 2025, latest movies, tv series streaming, anime streaming, cinema online, free streaming site, watch movies free, online movies, best streaming platform, new movies 2025, trending shows",
    ogType: "website",
    canonical: window.location.origin,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "moviebite",
      "url": window.location.origin,
      "description": "Watch unlimited movies, TV shows and anime free in HD quality",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  });

  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<MediaItem[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<MediaItem[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<MediaItem[]>([]);
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [moodGenres, setMoodGenres] = useState<number[] | null>(null);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async (genres?: number[] | null) => {
    try {
      setLoading(true);
      let popularMoviesData, popularTVData, topRatedMoviesData, topRatedTVData;
      if (genres && genres.length > 0) {
        // Fetch mood-filtered content
        const genreString = genres.join(",");
        popularMoviesData = await tmdbService.discoverMovies({
          with_genres: genreString,
          sort_by: "popularity.desc",
          page: 1,
        });
        popularTVData = await tmdbService.discoverTVShows({
          with_genres: genreString,
          sort_by: "popularity.desc",
          page: 1,
        });
        topRatedMoviesData = await tmdbService.discoverMovies({
          with_genres: genreString,
          sort_by: "vote_average.desc",
          page: 1,
        });
        topRatedTVData = await tmdbService.discoverTVShows({
          with_genres: genreString,
          sort_by: "vote_average.desc",
          page: 1,
        });
      } else {
        // Fetch regular content
        [popularMoviesData, popularTVData, topRatedMoviesData, topRatedTVData] =
          await Promise.all([
            tmdbService.getPopularMovies(),
            tmdbService.getPopularTVShows(),
            tmdbService.getTopRatedMovies(),
            tmdbService.getTopRatedTVShows(),
          ]);
      }
      setPopularMovies(popularMoviesData.results.slice(0, 12));
      setPopularTVShows(popularTVData.results.slice(0, 12));
      setTopRatedMovies(topRatedMoviesData.results.slice(0, 12));
      setTopRatedTVShows(topRatedTVData.results.slice(0, 12));

      // Fetch anime separately (not affected by mood filters)
      const animeData = await anilistService.getPopularAnime(1);
      setPopularAnime(animeData.media.slice(0, 12));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleMoodChange = (genres: number[] | null) => {
    setMoodGenres(genres);
    fetchData(genres);
  };
  const SectionHeader = ({
    icon: Icon,
    title,
    link,
  }: {
    icon: any;
    title: string;
    link: string;
  }) => (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
      }}
      className="flex items-center justify-between mb-6"
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-6 h-6 text-cinema-red" />
        <h2 className="md:text-3xl text-white text-base font-extrabold">
          {title}
        </h2>
        {moodGenres && (
          <span className="text-sm text-cinema-red bg-cinema-red/20 px-2 py-1 rounded-full">
            Filtered
          </span>
        )}
      </div>
      <Link
        to={link}
        className="text-cinema-red hover:text-cinema-red-light transition-colors duration-300 font-medium"
      >
        View All
      </Link>
    </motion.div>
  );
  return (
    <div className="min-h-screen">
      {/* Hero Section with Trending Carousel */}
      <section className="container mx-auto px-4 lg:px-8 py-8">
        <TrendingCarousel />
      </section>

      {/* Social Share Section */}
      <SocialShare />

      {/* Smart Suggestions - Only show if user has watch history */}
      <SmartSuggestions />

      {/* Watch Later Section - Only show if user has items */}
      <WatchLaterSection />

      {/* Midnight Zone - Only show during night hours */}
      <MidnightZone />

      {/* Mood Filters */}
      <section className="container mx-auto px-4 lg:px-8 py-4">
        <MoodFilters onMoodChange={handleMoodChange} />
      </section>

      {/* Popular Movies */}
      <section className="container mx-auto px-4 lg:px-8 py-8">
        <SectionHeader icon={Film} title="Popular Movies" link="/movies" />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({
              length: 12,
            }).map((_, index) => (
              <div
                key={index}
                className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {popularMovies.map((movie, index) => (
              <MediaCard
                key={movie.id}
                item={{
                  ...movie,
                  media_type: "movie",
                }}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </section>

      {/* Popular TV Shows */}
      <section className="container mx-auto px-4 lg:px-8 py-8">
        <SectionHeader icon={Tv} title="Popular TV Shows" link="/series" />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({
              length: 12,
            }).map((_, index) => (
              <div
                key={index}
                className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {popularTVShows.map((show, index) => (
              <MediaCard
                key={show.id}
                item={{
                  ...show,
                  media_type: "tv",
                }}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </section>

      {/* Top Rated Movies */}
      <section className="container mx-auto px-4 lg:px-8 py-8">
        <SectionHeader
          icon={Star}
          title="Top Rated Movies"
          link="/top-rated-movies"
        />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({
              length: 12,
            }).map((_, index) => (
              <div
                key={index}
                className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {topRatedMovies.map((movie, index) => (
              <MediaCard
                key={movie.id}
                item={{
                  ...movie,
                  media_type: "movie",
                }}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </section>

      {/* Popular Anime */}
      <section className="container mx-auto px-4 lg:px-8 py-8">
        <SectionHeader
          icon={Sparkles}
          title="Popular Anime"
          link="/anime"
        />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({
              length: 12,
            }).map((_, index) => (
              <div
                key={index}
                className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
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
          </motion.div>
        )}
      </section>

      {/* Top Rated TV Shows */}
      <section className="container mx-auto px-4 lg:px-8 py-8">
        <SectionHeader
          icon={Star}
          title="Top Rated TV Shows"
          link="/top-rated-tv"
        />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({
              length: 12,
            }).map((_, index) => (
              <div
                key={index}
                className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {topRatedTVShows.map((show, index) => (
              <MediaCard
                key={show.id}
                item={{
                  ...show,
                  media_type: "tv",
                }}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </section>

      {/* Floating Elements */}
      <ShuffleButton />
      <TrendingAlert />
    </div>
  );
};

export default Home;
