
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import { usePersonalized } from '../contexts/PersonalizedContext';

interface ResumeWatchingProps {
  mediaId: string;
  title: string;
  onResume: (timestamp: number) => void;
}

const ResumeWatching: React.FC<ResumeWatchingProps> = ({ mediaId, title, onResume }) => {
  const { getResumeProgress } = usePersonalized();
  const progress = getResumeProgress(mediaId);

  if (!progress || progress.timestamp < 30) { // Don't show for very short progress
    return null;
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const progressPercentage = (progress.timestamp / progress.duration) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-4 rounded-xl mb-6 border border-cinema-red/20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-cinema-red/20 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-cinema-red" />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">Continue Watching</h3>
            <p className="text-gray-400 text-xs">
              Resume from {formatTime(progress.timestamp)}
            </p>
            {/* Progress Bar */}
            <div className="w-32 h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-cinema-red transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onResume(progress.timestamp)}
          className="flex items-center space-x-2 bg-cinema-red hover:bg-cinema-red-light px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105"
        >
          <Play className="w-4 h-4 fill-current" />
          <span className="text-sm">Resume</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ResumeWatching;
