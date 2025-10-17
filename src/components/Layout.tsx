import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  Home,
  TrendingUp,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Footer from "./Footer";

// Custom SVG Symbol Icons
const MovieIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.82 2H4.18C2.97 2 2 2.97 2 4.18V19.82C2 21.03 2.97 22 4.18 22H19.82C21.03 22 22 21.03 22 19.82V4.18C22 2.97 21.03 2 19.82 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 2V22M17 2V22M2 12H22M2 7H7M2 17H7M17 17H22M17 7H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TVSeriesIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="7" width="20" height="15" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M17 2L12 7L7 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="14" r="1" fill="currentColor"/>
  </svg>
);

const AnimeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L2 8L12 13L22 8L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 13L12 18L22 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 18L12 23L22 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TopRatedIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DiscordIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill="currentColor"/>
  </svg>
);

const TrophyIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9H4.5C3.12 9 2 7.88 2 6.5S3.12 4 4.5 4H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 9H19.5C20.88 9 22 7.88 22 6.5S20.88 4 19.5 4H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 22H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 14.66V17C10 17.55 9.53 17.98 9.03 18.21C7.85 18.75 7 20.24 7 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 14.66V17C14 17.55 14.47 17.98 14.97 18.21C16.15 18.75 17 20.24 17 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 2H6V9C6 12.31 8.69 15 12 15C15.31 15 18 12.31 18 9V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEngageDropdownOpen, setIsEngageDropdownOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/trending", label: "Trending", icon: TrendingUp },
    { path: "/movies", label: "Movies", icon: MovieIcon },
    { path: "/series", label: "TV Series", icon: TVSeriesIcon },
    { path: "/anime", label: "Anime", icon: AnimeIcon },
    // { path: "/top-rated-movies", label: "Top Movies", icon: TopRatedIcon },
    // { path: "/top-rated-tv", label: "Top TV", icon: TopRatedIcon },
  ];

  const socialLinks = [
    { url: "https://t.me/yourtelegram", icon: TelegramIcon, label: "Telegram" },
    {
      url: "https://discord.gg/yourdiscord",
      icon: DiscordIcon,
      label: "Discord",
    },
  ];

  const engageItems = [
    { path: "/about", label: "About Us" },
    { path: "/privacy", label: "Privacy Policy" },
    { path: "/dmca", label: "DMCA" },
    { path: "/terms", label: "Terms of Use" },
    { path: "/contact", label: "Contact Us" },
  ];

  const isActivePath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center transition-transform hover:scale-105 duration-300">
              <img
                src="/moviebite.png"
                alt="moviebite"
                className="h-7 lg:h-8 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <TooltipProvider>
                {navItems.map((item) => (
                  <Tooltip key={item.path}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={`relative p-3 rounded-xl font-medium transition-all duration-300 group ${
                          isActivePath(item.path)
                            ? "text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <div className={`relative z-10 ${isActivePath(item.path) ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                          <item.icon />
                        </div>
                        {isActivePath(item.path) && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-br from-cinema-red/20 to-cinema-red/5 rounded-xl"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActivePath(item.path) ? 'opacity-0' : ''}`} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 border border-white/10">
                      <p className="text-xs font-medium">{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}

                {/* Divider */}
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-2" />

                {/* Engage Dropdown */}
                <div className="relative">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() =>
                          setIsEngageDropdownOpen(!isEngageDropdownOpen)
                        }
                        className={`relative p-3 rounded-xl font-medium transition-all duration-300 group ${
                          isEngageDropdownOpen ? "text-white" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <div className={`relative z-10 ${isEngageDropdownOpen ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                          <Info className="w-5 h-5" />
                        </div>
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isEngageDropdownOpen ? 'opacity-100' : ''}`} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 border border-white/10">
                      <p className="text-xs font-medium">Engage</p>
                    </TooltipContent>
                  </Tooltip>

                  <AnimatePresence>
                    {isEngageDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 right-0 w-56 backdrop-blur-xl bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                      >
                        <div className="p-2">
                          {engageItems.map((item, index) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setIsEngageDropdownOpen(false)}
                              className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group"
                            >
                              <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-2" />

                {/* Social Icons - Desktop */}
                {socialLinks.map((social) => (
                  <Tooltip key={social.label}>
                    <TooltipTrigger asChild>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative p-3 rounded-xl text-gray-400 hover:text-white transition-all duration-300 group"
                      >
                        <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                          <social.icon />
                        </div>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 border border-white/10">
                      <p className="text-xs font-medium">{social.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}

                {/* Sports Stream Button - Desktop */}
                <a
                  href="https://sportsbite.cc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative px-4 py-2.5 ml-3 rounded-xl font-medium transition-all duration-300 group flex items-center space-x-2"
                  data-testid="button-sports-stream-desktop"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cinema-red/15 to-cinema-red/5" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cinema-red/25 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 flex items-center space-x-2 text-cinema-red group-hover:text-white transition-colors duration-300">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      <TrophyIcon />
                    </div>
                    <span className="text-sm font-semibold">Sports Stream</span>
                  </div>
                </a>
              </TooltipProvider>
            </div>

            {/* Search & Mobile Menu */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              {/* Social Icons - Mobile */}
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lg:hidden p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                >
                  <social.icon />
                </a>
              ))}

              {/* Sports Stream Icon - Mobile */}
              <a
                href="https://sportsbite.cc"
                target="_blank"
                rel="noopener noreferrer"
                className="lg:hidden p-2.5 rounded-xl text-cinema-red hover:text-white bg-cinema-red/10 hover:bg-cinema-red/20 transition-all duration-300"
                data-testid="icon-sports-stream-mobile"
              >
                <TrophyIcon />
              </a>

              <Link
                to="/search"
                className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/5 backdrop-blur-xl bg-black/90"
            >
              <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm ${
                        isActivePath(item.path)
                          ? "bg-gradient-to-br from-cinema-red/20 to-cinema-red/5 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Mobile Engage Section */}
                <div className="border-t border-white/5 pt-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                    Engage
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {engageItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="pt-16 lg:pt-20">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;