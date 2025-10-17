import React from 'react';
import { motion } from 'framer-motion';
import { Film, Users, Heart, Star } from 'lucide-react';
const AboutUs: React.FC = () => {
  return <div className="min-h-screen pt-8">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-cinema-red rounded-xl flex items-center justify-center">
                <Film className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient text-left">About Moviebite</h1>
            </div>
            <p className="text-xl text-gray-300 leading-relaxed text-left">
              Your ultimate destination for streaming entertainment
            </p>
          </div>

          {/* Mission Section */}
          <div className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Heart className="w-6 h-6 text-cinema-red mr-3" />
              Our Mission
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              At moviebite, we believe that great entertainment should be accessible to everyone. 
              We're passionate about bringing you the latest movies and TV series with crystal clear 
              quality and an intuitive, beautiful interface that makes discovering your next favorite 
              show effortless.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card p-6">
              <Users className="w-8 h-8 text-cinema-red mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">For Everyone</h3>
              <p className="text-gray-300">
                From action-packed blockbusters to intimate indie films, we curate content 
                for every taste and mood.
              </p>
            </div>
            
            <div className="glass-card p-6">
              <Star className="w-8 h-8 text-cinema-red mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Quality First</h3>
              <p className="text-gray-300">
                We prioritize high-quality streaming with beautiful visuals and smooth 
                performance across all devices.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
            <p className="text-gray-300 leading-relaxed text-lg mb-4">
              Founded by a team of movie enthusiasts and tech innovators, moviebite was born 
              from a simple idea: entertainment should be beautiful, accessible, and enjoyable.
            </p>
            <p className="text-gray-300 leading-relaxed text-lg">
              We continue to evolve and improve our platform, always keeping our users at the 
              center of everything we do. Thank you for being part of our journey.
            </p>
          </div>
        </motion.div>
      </div>
    </div>;
};
export default AboutUs;