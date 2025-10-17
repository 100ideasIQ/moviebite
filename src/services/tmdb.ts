import axios from 'axios';
import { config } from '../config/env';

const tmdbApi = axios.create({
  baseURL: config.tmdb.baseUrl,
  params: {
    api_key: config.tmdb.apiKey,
  },
});

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: Genre[];
  runtime?: number;
  status?: string;
  tagline?: string;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: Genre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface Review {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string;
    rating: number;
  };
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string;
  air_date: string;
  vote_average: number;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count: number;
  poster_path: string;
  air_date: string;
}

export interface MediaItem {
  id: number;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  genre_ids: number[];
  genres?: Genre[];
  media_type?: 'movie' | 'tv';
  
  // Movie properties (optional for TV shows)
  title?: string;
  release_date?: string;
  runtime?: number;
  
  // TV Show properties (optional for movies)
  name?: string;
  first_air_date?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  
  // Common optional properties
  status?: string;
  tagline?: string;
}

export const tmdbService = {
  // Get trending content
  getTrending: async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week') => {
    const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`);
    return response.data;
  },

  // Get popular movies
  getPopularMovies: async (page: number = 1) => {
    const response = await tmdbApi.get('/movie/popular', { params: { page } });
    return response.data;
  },

  // Get popular TV shows
  getPopularTVShows: async (page: number = 1) => {
    const response = await tmdbApi.get('/tv/popular', { params: { page } });
    return response.data;
  },

  // Get top rated movies
  getTopRatedMovies: async (page: number = 1) => {
    const response = await tmdbApi.get('/movie/top_rated', { params: { page } });
    return response.data;
  },

  // Get top rated TV shows
  getTopRatedTVShows: async (page: number = 1) => {
    const response = await tmdbApi.get('/tv/top_rated', { params: { page } });
    return response.data;
  },

  // Get upcoming movies
  getUpcomingMovies: async (page: number = 1) => {
    const response = await tmdbApi.get('/movie/upcoming', { params: { page } });
    return response.data;
  },

  // Get now playing movies
  getNowPlayingMovies: async (page: number = 1) => {
    const response = await tmdbApi.get('/movie/now_playing', { params: { page } });
    return response.data;
  },

  // Get latest movies
  getLatestMovies: async (page: number = 1) => {
    const response = await tmdbApi.get('/discover/movie', { 
      params: { 
        page,
        sort_by: 'release_date.desc'
      } 
    });
    return response.data;
  },

  // Get latest TV shows
  getLatestTVShows: async (page: number = 1) => {
    const response = await tmdbApi.get('/discover/tv', { 
      params: { 
        page,
        sort_by: 'first_air_date.desc'
      } 
    });
    return response.data;
  },

  // Get movie details
  getMovieDetails: async (id: number) => {
    const response = await tmdbApi.get(`/movie/${id}`);
    return response.data;
  },

  // Get TV show details
  getTVShowDetails: async (id: number) => {
    const response = await tmdbApi.get(`/tv/${id}`);
    return response.data;
  },

  // Get movie credits (cast and crew)
  getMovieCredits: async (id: number) => {
    const response = await tmdbApi.get(`/movie/${id}/credits`);
    return response.data;
  },

  // Get TV show credits
  getTVShowCredits: async (id: number) => {
    const response = await tmdbApi.get(`/tv/${id}/credits`);
    return response.data;
  },

  // Get movie videos (trailers, etc.)
  getMovieVideos: async (id: number) => {
    const response = await tmdbApi.get(`/movie/${id}/videos`);
    return response.data;
  },

  // Get TV show videos
  getTVShowVideos: async (id: number) => {
    const response = await tmdbApi.get(`/tv/${id}/videos`);
    return response.data;
  },

  // Get movie reviews
  getMovieReviews: async (id: number) => {
    const response = await tmdbApi.get(`/movie/${id}/reviews`);
    return response.data;
  },

  // Get TV show reviews
  getTVShowReviews: async (id: number) => {
    const response = await tmdbApi.get(`/tv/${id}/reviews`);
    return response.data;
  },

  // Get TV show seasons
  getTVShowSeasons: async (id: number, seasonNumber: number) => {
    const response = await tmdbApi.get(`/tv/${id}/season/${seasonNumber}`);
    return response.data;
  },

  // Search multi (movies and TV shows)
  searchMulti: async (query: string, page: number = 1) => {
    const response = await tmdbApi.get('/search/multi', { 
      params: { query, page } 
    });
    return response.data;
  },

  // Get similar movies
  getSimilarMovies: async (id: number) => {
    const response = await tmdbApi.get(`/movie/${id}/similar`);
    return response.data;
  },

  // Get similar TV shows
  getSimilarTVShows: async (id: number) => {
    const response = await tmdbApi.get(`/tv/${id}/similar`);
    return response.data;
  },

  // Get genres
  getMovieGenres: async () => {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data;
  },

  getTVGenres: async () => {
    const response = await tmdbApi.get('/genre/tv/list');
    return response.data;
  },

  // Discover movies with filters
  discoverMovies: async (params: any = {}) => {
    const response = await tmdbApi.get('/discover/movie', { params });
    return response.data;
  },

  // Discover TV shows with filters
  discoverTVShows: async (params: any = {}) => {
    const response = await tmdbApi.get('/discover/tv', { params });
    return response.data;
  },
};

export const getImageUrl = (path: string, size: string = 'w500') => {
  if (!path) return '/placeholder.svg';
  return `${config.tmdb.imageBaseUrl}/${size}${path}`;
};

export const getBackdropUrl = (path: string, size: string = 'w1280') => {
  if (!path) return '/placeholder.svg';
  return `${config.tmdb.imageBaseUrl}/${size}${path}`;
};
