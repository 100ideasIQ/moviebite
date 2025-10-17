import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useMoodFilters } from '../hooks/useMoodFilters';
interface MoodFiltersProps {
  onMoodChange?: (genres: number[] | null) => void;
}
const MoodFilters: React.FC<MoodFiltersProps> = ({
  onMoodChange
}) => {
  const {
    moodFilters,
    activeMood,
    setActiveMood,
    filterByMood,
    clearMoodFilter
  } = useMoodFilters();
  const handleMoodClick = (moodId: string) => {
    const newActiveMood = activeMood === moodId ? null : moodId;
    setActiveMood(newActiveMood);
    if (onMoodChange) {
      const genres = newActiveMood ? moodFilters.find(m => m.id === newActiveMood)?.genres || null : null;
      onMoodChange(genres);
    }
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg text-white font-extrabold">Choose Your Mood</h3>
        {activeMood && <motion.button onClick={() => {
        clearMoodFilter();
        if (onMoodChange) onMoodChange(null);
      }} className="p-1 bg-cinema-red/20 hover:bg-cinema-red/40 rounded-full transition-colors duration-300" whileHover={{
        scale: 1.1
      }} whileTap={{
        scale: 0.95
      }}>
            <X className="w-4 h-4 text-cinema-red" />
          </motion.button>}
      </div>
      
      {/* Mobile: 2 columns, Tablet: 3 columns, Desktop: All in one row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-2 lg:gap-3">
        {moodFilters.map((mood, index) => <motion.button key={mood.id} onClick={() => handleMoodClick(mood.id)} className={`
              px-3 py-2 lg:px-4 lg:py-2 rounded-full font-medium transition-all duration-300 
              flex items-center justify-center lg:justify-start space-x-1 lg:space-x-2
              text-xs sm:text-sm lg:text-sm
              ${activeMood === mood.id ? 'bg-cinema-red text-white shadow-lg' : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'}
            `} whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: index * 0.1
      }}>
            <span className="text-base lg:text-lg">{mood.emoji}</span>
            <span className="truncate">{mood.label}</span>
          </motion.button>)}
      </div>
    </motion.div>;
};
export default MoodFilters;