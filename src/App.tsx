import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { PersonalizedProvider } from './contexts/PersonalizedContext';

// Import pages
import Index from './pages/Index';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Trending from './pages/Trending';
import TopRatedMovies from './pages/TopRatedMovies';
import TopRatedTVShows from './pages/TopRatedTVShows';
import Search from './pages/Search';
import MovieDetails from './pages/MovieDetails';
import TVDetails from './pages/TVDetails';
import Player from './pages/Player';
import WatchLater from './pages/WatchLater';
import Anime from './pages/Anime';
import AnimeDetails from './pages/AnimeDetails';
import AnimePlayer from './pages/AnimePlayer';
import NotFound from './pages/NotFound';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DMCA from './pages/DMCA';
import TermsOfUse from './pages/TermsOfUse';
import ContactUs from './pages/ContactUs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  useEffect(() => {
    // Check for midnight theme
    const checkMidnightTheme = () => {
      const currentHour = new Date().getHours();
      const isMidnight = currentHour >= 22 || currentHour <= 6; // 10 PM to 6 AM

      if (isMidnight) {
        document.body.classList.add('midnight-theme');
      } else {
        document.body.classList.remove('midnight-theme');
      }
    };

    // Check immediately
    checkMidnightTheme();

    // Check every minute
    const interval = setInterval(checkMidnightTheme, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PersonalizedProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/series" element={<Series />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/top-rated-movies" element={<TopRatedMovies />} />
              <Route path="/top-rated-tv" element={<TopRatedTVShows />} />
              <Route path="/search" element={<Search />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/tv/:id" element={<TVDetails />} />
              <Route path="/player/:type/:id" element={<Player />} />
              <Route path="/watch-later" element={<WatchLater />} />
              <Route path="/anime" element={<Anime />} />
              <Route path="/anime/:id" element={<AnimeDetails />} />
              <Route path="/anime-player/:id" element={<AnimePlayer />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/dmca" element={<DMCA />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <PWAInstallPrompt />
        </Router>
      </PersonalizedProvider>
    </QueryClientProvider>
  );
}

export default App;