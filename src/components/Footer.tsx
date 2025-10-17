import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Info,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

// Custom SVG Icons matching Layout
const MovieIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.82 2H4.18C2.97 2 2 2.97 2 4.18V19.82C2 21.03 2.97 22 4.18 22H19.82C21.03 22 22 21.03 22 19.82V4.18C22 2.97 21.03 2 19.82 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 2V22M17 2V22M2 12H22M2 7H7M2 17H7M17 17H22M17 7H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TVSeriesIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="7" width="20" height="15" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M17 2L12 7L7 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="14" r="1" fill="currentColor"/>
  </svg>
);

const AnimeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L2 8L12 13L22 8L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 13L12 18L22 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 18L12 23L22 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

const Footer: React.FC = () => {
  const [isEngageDropdownOpen, setIsEngageDropdownOpen] = useState(false);

  const footerLinks = {
    explore: [
      { label: "Movies", path: "/movies", icon: MovieIcon },
      { label: "TV Series", path: "/series", icon: TVSeriesIcon },
      { label: "Anime", path: "/anime", icon: AnimeIcon },
      { label: "Trending", path: "/trending" },
      { label: "Search", path: "/search" },
    ],
    genres: [
      { label: "Action", path: "/movies" },
      { label: "Comedy", path: "/movies" },
      { label: "Drama", path: "/series" },
      { label: "Horror", path: "/movies" },
      { label: "Sci-Fi", path: "/movies" },
      { label: "Romance", path: "/series" },
    ],
    engage: [
      { label: "About Us", path: "/about" },
      { label: "Contact Us", path: "/contact" },
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
      { label: "DMCA", path: "/dmca" },
    ],
  };

  const socialLinks = [
    {
      icon: TelegramIcon,
      href: "https://t.me/yourtelegram",
      label: "Telegram",
    },
    {
      icon: DiscordIcon,
      href: "https://discord.gg/yourdiscord",
      label: "Discord",
    },
  ];

  const contactInfo = [
    { icon: Mail, text: "support@moviebite.cc" },
    { icon: Phone, text: "+1 (555) 123-4567" },
    { icon: MapPin, text: "Earth, GA" },
  ];

  return (
    <footer className="relative mt-20 border-t border-white/5">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent pointer-events-none" />

 {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cinema-red to-transparent" />

      <div className="relative container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 md:gap-16 mb-16">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 space-y-6"
          >
            <Link to="/" className="inline-block group">
              <img
                src="/moviebite.png"
                alt="Moviebite"
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <p className="text-gray-400 leading-relaxed text-sm max-w-sm">
              Your ultimate destination for streaming the latest movies, TV series, and anime. 
              Discover endless entertainment at your fingertips.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 text-gray-400 text-sm group hover:text-gray-300 transition-colors duration-300"
                >
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                    <contact.icon className="w-4 h-4 text-cinema-red" />
                  </div>
                  <span>{contact.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative p-3 rounded-xl text-gray-400 hover:text-white transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <social.icon />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm border border-white/10 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {social.label}
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Explore Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h4 className="text-white font-semibold text-base mb-6 flex items-center space-x-2">
              <span>Explore</span>
              <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-cinema-red/50 to-transparent" />
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="group flex items-center space-x-2.5 text-gray-400 hover:text-white transition-all duration-300"
                  >
                    {link.icon && (
                      <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-cinema-red/10 transition-colors duration-300">
                        <link.icon />
                      </div>
                    )}
                    {!link.icon && (
                      <div className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-cinema-red transition-colors duration-300" />
                    )}
                    <span className="text-sm">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Genres Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <h4 className="text-white font-semibold text-base mb-6 flex items-center space-x-2">
              <span>Genres</span>
              <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-cinema-red/50 to-transparent" />
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {footerLinks.genres.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-cinema-red transition-colors duration-300" />
                  <span className="text-sm">{link.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>

    
          {/* Engage Dropdown - Mobile/Tablet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:hidden"
          >
            {/* <button
              onClick={() => setIsEngageDropdownOpen(!isEngageDropdownOpen)}
              className="group flex items-center space-x-2 text-white font-semibold text-base mb-4 hover:text-cinema-red transition-colors"
            >
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-cinema-red/10 transition-colors duration-300">
                <Info className="w-4 h-4" />
              </div>
              <span>Engage</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${isEngageDropdownOpen ? "rotate-180" : ""}`}
              />
            </button> */}

            <AnimatePresence>
              {isEngageDropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  {footerLinks.engage.map((link, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300"
                      >
                        <div className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-cinema-red transition-colors duration-300" />
                        <span className="text-sm">{link.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 gap-6"
        >
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} moviebite. All rights reserved.
          </p>

          <div className="flex items-center flex-wrap justify-center gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              Privacy
            </Link>
            <div className="w-1 h-1 rounded-full bg-gray-700" />
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              Terms
            </Link>
            <div className="w-1 h-1 rounded-full bg-gray-700" />
            <Link
              to="/dmca"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              DMCA
            </Link>
            <div className="w-px h-4 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block" />
            
            {/* Sports Stream Button */}
            <a
              href="https://sportsbite.cc"
              target="_blank"
              rel="noopener noreferrer"
              className="relative px-4 py-2.5 rounded-xl font-medium transition-all duration-300 group flex items-center space-x-2"
              data-testid="button-sports-stream-footer"
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
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;