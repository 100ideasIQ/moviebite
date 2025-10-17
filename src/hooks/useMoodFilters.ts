
import { useState, useMemo } from 'react';

export interface MoodFilter {
  id: string;
  label: string;
  emoji: string;
  genres: number[];
}

export const moodFilters: MoodFilter[] = [
  { id: 'intense', label: 'Intense', emoji: '🔥', genres: [28, 53, 80] }, // Action, Thriller, Crime
  { id: 'fun', label: 'Fun', emoji: '😂', genres: [35, 10751, 16] }, // Comedy, Family, Animation
  { id: 'romantic', label: 'Romantic', emoji: '💖', genres: [10749, 18] }, // Romance, Drama
  { id: 'dramatic', label: 'Dramatic', emoji: '🎭', genres: [18, 36] }, // Drama, History
  { id: 'scary', label: 'Scary', emoji: '😱', genres: [27, 9648] }, // Horror, Mystery
  { id: 'adventure', label: 'Adventure', emoji: '🗺️', genres: [12, 14] }, // Adventure, Fantasy
  { id: 'scifi', label: 'Sci-Fi', emoji: '🚀', genres: [878] }, // Science Fiction
];

export const useMoodFilters = () => {
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const filterByMood = useMemo(() => {
    if (!activeMood) return null;
    
    const mood = moodFilters.find(m => m.id === activeMood);
    return mood ? mood.genres : null;
  }, [activeMood]);

  const clearMoodFilter = () => setActiveMood(null);

  return {
    moodFilters,
    activeMood,
    setActiveMood,
    filterByMood,
    clearMoodFilter,
  };
};
