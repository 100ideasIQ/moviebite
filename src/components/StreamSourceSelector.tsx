
import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface StreamSource {
  id: string;
  name: string;
  url: string;
}

interface StreamSourceSelectorProps {
  sources: StreamSource[];
  activeSource: string;
  onSourceChange: (sourceId: string) => void;
  className?: string;
}

const StreamSourceSelector: React.FC<StreamSourceSelectorProps> = ({
  sources,
  activeSource,
  onSourceChange,
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {sources.map((source, index) => (
        <motion.button
          key={source.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          onClick={() => onSourceChange(source.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
            activeSource === source.id
              ? 'bg-cinema-red text-white shadow-lg shadow-cinema-red/25'
              : 'glass-button text-gray-300 hover:text-white'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>{source.name}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default StreamSourceSelector;
