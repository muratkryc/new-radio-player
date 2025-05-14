import { useState, useEffect, useRef } from 'react';
import { AudioPlayerState } from '../types';

const useAudioPlayer = (streamUrl: string) => {
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    isPlaying: false,
    volume: 0.7,
    isLoading: false,
    isError: false,
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element
    const audio = new Audio(streamUrl);
    audio.preload = 'auto';
    audio.volume = playerState.volume;
    
    // Save reference
    audioRef.current = audio;
    
    // Setup event listeners
    const handlePlay = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
    };
    
    const handlePause = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false, isLoading: false }));
    };
    
    const handleWaiting = () => {
      setPlayerState(prev => ({ ...prev, isLoading: true }));
    };
    
    const handleError = () => {
      setPlayerState(prev => ({ ...prev, isError: true, isLoading: false, isPlaying: false }));
    };
    
    // Add event listeners
    audio.addEventListener('playing', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);
    
    // Cleanup function
    return () => {
      // Remove event listeners
      audio.removeEventListener('playing', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
      
      // Cleanup audio
      audio.pause();
      audio.src = '';
    };
  }, [streamUrl]);
  
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (playerState.isPlaying) {
      audioRef.current.pause();
    } else {
      setPlayerState(prev => ({ ...prev, isLoading: true }));
      audioRef.current.play().catch(() => {
        setPlayerState(prev => ({ ...prev, isError: true, isLoading: false }));
      });
    }
  };
  
  const setVolume = (newVolume: number) => {
    if (!audioRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    audioRef.current.volume = clampedVolume;
    setPlayerState(prev => ({ ...prev, volume: clampedVolume }));
  };
  
  return {
    playerState,
    togglePlay,
    setVolume,
  };
};

export default useAudioPlayer;