
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MediaItem } from '../services/tmdb';

interface WatchLaterItem extends MediaItem {
  addedAt: string;
  media_type: 'movie' | 'tv';
}

interface WatchHistoryItem {
  id: number;
  title: string;
  media_type: 'movie' | 'tv';
  poster_path: string;
  watchedAt: string;
  genres: number[];
}

interface ResumeProgress {
  [key: string]: {
    timestamp: number;
    duration: number;
    lastWatched: string;
  };
}

interface PersonalizedContextType {
  watchLater: WatchLaterItem[];
  watchHistory: WatchHistoryItem[];
  resumeProgress: ResumeProgress;
  addToWatchLater: (item: MediaItem, mediaType: 'movie' | 'tv') => void;
  removeFromWatchLater: (id: number) => void;
  isInWatchLater: (id: number) => boolean;
  addToWatchHistory: (item: WatchHistoryItem) => void;
  saveResumeProgress: (mediaId: string, timestamp: number, duration: number) => void;
  getResumeProgress: (mediaId: string) => { timestamp: number; duration: number } | null;
}

const PersonalizedContext = createContext<PersonalizedContextType | undefined>(undefined);

export const usePersonalized = () => {
  const context = useContext(PersonalizedContext);
  if (!context) {
    throw new Error('usePersonalized must be used within PersonalizedProvider');
  }
  return context;
};

interface PersonalizedProviderProps {
  children: ReactNode;
}

export const PersonalizedProvider: React.FC<PersonalizedProviderProps> = ({ children }) => {
  const [watchLater, setWatchLater] = useState<WatchLaterItem[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [resumeProgress, setResumeProgress] = useState<ResumeProgress>({});

  // Load data from localStorage on mount
  useEffect(() => {
    const savedWatchLater = localStorage.getItem('watchLater');
    const savedWatchHistory = localStorage.getItem('watchHistory');
    const savedResumeProgress = localStorage.getItem('resumeProgress');

    if (savedWatchLater) {
      setWatchLater(JSON.parse(savedWatchLater));
    }
    if (savedWatchHistory) {
      setWatchHistory(JSON.parse(savedWatchHistory));
    }
    if (savedResumeProgress) {
      setResumeProgress(JSON.parse(savedResumeProgress));
    }
  }, []);

  const addToWatchLater = (item: MediaItem, mediaType: 'movie' | 'tv') => {
    const watchLaterItem: WatchLaterItem = {
      ...item,
      media_type: mediaType,
      addedAt: new Date().toISOString(),
    };

    const updatedWatchLater = [...watchLater, watchLaterItem];
    setWatchLater(updatedWatchLater);
    localStorage.setItem('watchLater', JSON.stringify(updatedWatchLater));
  };

  const removeFromWatchLater = (id: number) => {
    const updatedWatchLater = watchLater.filter(item => item.id !== id);
    setWatchLater(updatedWatchLater);
    localStorage.setItem('watchLater', JSON.stringify(updatedWatchLater));
  };

  const isInWatchLater = (id: number) => {
    return watchLater.some(item => item.id === id);
  };

  const addToWatchHistory = (item: WatchHistoryItem) => {
    // Remove existing entry if it exists
    const filteredHistory = watchHistory.filter(historyItem => 
      !(historyItem.id === item.id && historyItem.media_type === item.media_type)
    );
    
    // Add new entry at the beginning
    const updatedHistory = [item, ...filteredHistory].slice(0, 50); // Keep only last 50 items
    setWatchHistory(updatedHistory);
    localStorage.setItem('watchHistory', JSON.stringify(updatedHistory));
  };

  const saveResumeProgress = (mediaId: string, timestamp: number, duration: number) => {
    const updatedProgress = {
      ...resumeProgress,
      [mediaId]: {
        timestamp,
        duration,
        lastWatched: new Date().toISOString(),
      },
    };
    setResumeProgress(updatedProgress);
    localStorage.setItem('resumeProgress', JSON.stringify(updatedProgress));
  };

  const getResumeProgress = (mediaId: string) => {
    const progress = resumeProgress[mediaId];
    if (!progress) return null;
    return { timestamp: progress.timestamp, duration: progress.duration };
  };

  return (
    <PersonalizedContext.Provider
      value={{
        watchLater,
        watchHistory,
        resumeProgress,
        addToWatchLater,
        removeFromWatchLater,
        isInWatchLater,
        addToWatchHistory,
        saveResumeProgress,
        getResumeProgress,
      }}
    >
      {children}
    </PersonalizedContext.Provider>
  );
};
