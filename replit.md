# CinemaStream - Movie & TV Streaming Platform

## Overview

CinemaStream is a React-based streaming platform that allows users to discover and watch movies, TV shows, and anime content. The application provides a Netflix-style interface with features like trending content carousels, personalized recommendations, mood-based filtering, and multiple streaming sources. It integrates with TMDB (The Movie Database) API for movie/TV data and AniList for anime content.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: React Router v6 for client-side navigation
- **Styling**: Tailwind CSS with custom cinema-themed color palette (red accent: #dc2626)
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Animations**: Framer Motion for smooth transitions and interactions
- **State Management**: React Context API for personalization features (watch history, watch later, resume progress)

**Key Design Patterns:**
- Component-based architecture with reusable UI elements (MediaCard, CastCard, ReviewCard)
- Custom hooks for shared logic (useSEO, useMoodFilters, usePWAInstall, usePersonalized)
- Context providers for global state (PersonalizedContext)
- Glass morphism design system with backdrop blur effects
- Responsive design with mobile-first approach

**Core Features:**
- **Content Discovery**: Browse movies, TV shows, and anime with multiple filtering and sorting options
- **Personalization**: Watch history tracking, watch later bookmarks, resume watching functionality
- **Smart Recommendations**: AI-powered suggestions based on viewing history and mood filters
- **Search**: Multi-source search supporting movies, TV shows, anime, and cast members
- **Theming**: Dynamic midnight theme (10 PM - 6 AM) with purple accents
- **PWA Support**: Progressive Web App with offline caching and install prompts

### Data Layer

**External APIs:**
- **TMDB API**: Primary data source for movies and TV shows
  - Movie/TV details, cast, reviews, recommendations
  - Image assets (posters, backdrops, profiles)
  - Trending content and discovery endpoints
  
- **AniList GraphQL API**: Anime content provider
  - Anime details, episodes, popularity rankings
  - Character information and relations

- **Groq AI API**: AI-powered movie recommendations
  - Natural language processing for personalized suggestions
  - Context-aware content recommendations

**Streaming Sources:**
- VidNest: Primary video player embed
- Vidify: Alternative streaming source
- Dynamic source switching for content availability

**Local Storage Strategy:**
- Watch history persistence
- Watch later bookmarks
- Resume progress timestamps
- User preferences (theme, dismissed prompts)
- PWA installation state

### Content Delivery

**Video Player Integration:**
- Embedded iframe players from third-party streaming services
- Multiple source fallbacks for reliability
- Episode/season navigation for TV shows
- Resume watching from last position
- Separate anime player with sub/dub toggle

**Image Optimization:**
- TMDB image CDN with multiple size variants (w185, w500, w780, original)
- Lazy loading for improved performance
- Fallback placeholders for missing images
- Backdrop images for hero sections

### SEO & Discoverability

**Search Engine Optimization:**
- Dynamic meta tags per page (title, description, keywords)
- Open Graph and Twitter Card integration
- Structured data (JSON-LD) for rich search results
- Canonical URLs and noindex flags for player pages
- Sitemap and robots.txt configuration

**Performance Optimizations:**
- React Query for data caching and deduplication (5min stale time, 10min garbage collection)
- Code splitting via dynamic imports
- Image lazy loading and responsive sizes
- Service Worker for offline functionality

### User Experience Features

**Personalization Engine:**
- Watch history tracking with genre analysis
- Smart suggestions based on viewing patterns
- Mood-based content filtering (7 mood categories mapping to genre combinations)
- Resume watching from last timestamp
- Watch later bookmarks with media type tracking

**Interactive Elements:**
- Shuffle button for random content discovery
- Trending alerts with periodic notifications
- Social sharing to multiple platforms (Twitter, Facebook, Telegram, WhatsApp)
- Promotional banner with view limits (3 times per day)
- Install prompts for PWA after 2 visits

**Accessibility & UX:**
- Keyboard navigation support
- Mobile-responsive layouts
- Touch-optimized interactions
- Loading states and error handling
- Toast notifications for user feedback

## External Dependencies

### Third-Party Services

**Content APIs:**
- TMDB API (d9fa6f599339d23ed1f9c0070105b8dc) - Movie/TV metadata and images
- AniList GraphQL API - Anime content and metadata
- Groq AI API (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) - AI recommendations

**Streaming Providers:**
- VidNest player embeds
- Vidify player embeds
- YouTube embeds for trailers

**CDN & Assets:**
- Google Fonts (Inter font family)
- TMDB Image CDN (image.tmdb.org)

### NPM Packages

**Core Dependencies:**
- react, react-dom: UI framework
- react-router-dom: Client-side routing
- @tanstack/react-query: Server state management
- axios: HTTP client
- framer-motion: Animation library
- next-themes: Theme management

**UI Components:**
- @radix-ui/*: Headless UI primitives (15+ components)
- shadcn/ui: Pre-built accessible components
- lucide-react: Icon library
- cmdk: Command menu
- embla-carousel-react: Carousel component

**Utilities:**
- tailwindcss: Utility-first CSS
- class-variance-authority, clsx: Class management
- date-fns: Date formatting
- react-hook-form, zod: Form handling and validation

**Development:**
- vite: Build tool
- typescript: Type safety
- eslint: Code linting
- lovable-tagger: Development component tracking

### Configuration

**Environment Variables:**
- VITE_TMDB_API_KEY: TMDB authentication
- VITE_GROQ_API_KEY: Groq AI authentication

**Build Modes:**
- Development: Component tagging enabled, source maps
- Production: Optimized bundles, minification