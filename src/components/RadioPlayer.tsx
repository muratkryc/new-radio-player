import { useState, FC, useEffect, useRef } from 'react';
import { Radio, History, ChevronDown, ChevronUp, Share2, Copy } from 'lucide-react';
import useAudioPlayer from '../hooks/useAudioPlayer';
import AudioControls from './AudioControls';
import VolumeControl from './VolumeControl';
import Visualizer from './Visualizer';
import { RadioInfo } from '../types';

interface RadioPlayerProps {
  streamUrl: string;
  stationName: string;
  radioData: RadioInfo | null;
  currentAlbumArtUrl?: string;
  apiError: boolean;
}

const RadioPlayer: FC<RadioPlayerProps> = ({ 
  streamUrl, 
  stationName, 
  radioData, 
  currentAlbumArtUrl,
  apiError 
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const { playerState, togglePlay, setVolume } = useAudioPlayer(streamUrl);
  const { isPlaying, isLoading, volume, isError: playerAudioError } = playerState;
  const songTitleRef = useRef<HTMLParagraphElement>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (songTitleRef.current && radioData?.title) {
      const titleText = radioData.title;
      const textLength = titleText.length;
      const duration = Math.max(5, textLength * 0.15);
      songTitleRef.current.style.animationDuration = `${duration}s`;

      const containerWidth = songTitleRef.current.parentElement?.offsetWidth || 0;
      const textWidth = songTitleRef.current.offsetWidth;
    }
  }, [radioData?.title]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: `${stationName} - Dinle: ${radioData?.title || 'Şu an çalan harika bir parça!'}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Paylaşım hatası:', error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }).catch(err => {
      console.error('URL kopyalanamadı:', err);
    });
  };

  return (
    <div className="w-full h-full sm:max-w-md md:max-w-xl lg:max-w-4xl xl:max-w-6xl max-h-full overflow-y-auto custom-scrollbar p-0 sm:p-1 flex flex-col justify-start sm:justify-center">
      <div className={`bg-black bg-opacity-30 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl relative w-full flex flex-col flex-grow sm:flex-grow-0`}>
        
        {linkCopied && (
          <div className="absolute top-4 right-4 bg-[var(--primary-start-color)] text-white text-xs px-3 py-1.5 rounded-md shadow-lg z-20">
            URL Kopyalandı!
          </div>
        )}

        <div className="flex flex-col items-center lg:flex-row lg:items-start lg:gap-8">
          
          <div className="w-full lg:w-1/2 xl:w-1/2 flex flex-col items-center lg:items-stretch mb-6 lg:mb-0">
            {currentAlbumArtUrl && radioData?.art ? (
              <div className="mt-6 lg:mt-0 mb-4 w-full aspect-square max-w-xs sm:max-w-[240px] lg:max-w-none">
                <img 
                  src={currentAlbumArtUrl}
                  alt={radioData.title || 'Albüm Kapağı'} 
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            ) : (
              <div 
                className={`mt-6 lg:mt-0 mb-4 p-12 lg:p-16 rounded-lg bg-gradient-to-r from-[var(--primary-start-color)] to-[var(--primary-end-color)] flex items-center justify-center aspect-square w-full max-w-xs sm:max-w-[240px] lg:max-w-none`}
              >
                <Radio className="w-12 h-12 lg:w-20 lg:h-20 text-white" />
              </div>
            )}

            <div className="w-3/4 lg:w-full h-px bg-[var(--secondary-color-rgb)] opacity-40 my-4 mx-auto lg:mx-0 lg:hidden"></div>
          </div>

          <div className="w-full lg:w-1/2 xl:w-1/2 flex flex-col items-center lg:items-start">
            <div className="text-center lg:text-left mb-4 w-full">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{stationName}</h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300">
                {radioData?.listeners && `${radioData.listeners} Dinleyici`}
              </p>
              {radioData?.bitrate && (
                <p className="text-xs sm:text-sm lg:text-base text-gray-400">
                  Bitrate: {radioData.bitrate} kbps
                </p>
              )}
              {radioData?.dj && (
                <p className="text-xs sm:text-sm lg:text-base text-gray-400">
                  DJ: {radioData.dj}
                </p>
              )}
            </div>

            <div className="mb-6 w-full">
              <Visualizer isPlaying={isPlaying} />
            </div>

            <div className="mb-6 w-full overflow-hidden">
              <p 
                ref={songTitleRef} 
                className="text-white font-medium song-title-marquee sm:text-lg lg:text-xl"
              >
                {radioData?.title || 'Yükleniyor...'}
              </p>
            </div>

            {(playerAudioError || apiError) && (
              <div className="mb-4 text-red-500 text-sm sm:text-base text-center lg:text-left w-full">
                Error loading stream. Please try again.
              </div>
            )}

            <div className="flex items-center justify-center w-full gap-3 sm:gap-4 px-4 mb-6">
              <AudioControls 
                isPlaying={isPlaying}
                isLoading={isLoading}
                onTogglePlay={togglePlay}
              />
              <VolumeControl
                volume={volume}
                onChange={setVolume}
              />
              <button
                onClick={handleShare}
                title="Sayfayı Paylaş"
                className="p-2.5 sm:p-2 lg:p-2.5 rounded-full text-white hover:bg-white/10 transition-colors"
                aria-label="Sayfayı paylaş"
              >
                {typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? 
                  <Share2 size={20} className="lg:size-5" /> : 
                  <Copy size={20} className="lg:size-5" />
                }
              </button>
            </div>

            {/* Recent tracks toggle */}
            {radioData?.history && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full mt-4 lg:mt-3 flex items-center justify-between px-4 lg:px-3 py-2 lg:py-1.5 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <History size={16} className="sm:size-18 lg:size-5"/>
                  <span className="text-sm font-medium sm:text-base lg:text-base">Son Çalınanlar</span>
                </div>
                {showHistory ? <ChevronUp size={16} className="sm:size-18 lg:size-5"/> : <ChevronDown size={16} className="sm:size-18 lg:size-5"/>}
              </button>
            )}

            {/* Recent tracks list */}
            {showHistory && radioData?.history && (
              <div className="w-full mt-2 lg:mt-1.5 space-y-2 max-h-32 sm:max-h-36 lg:max-h-32 overflow-y-auto custom-scrollbar px-4 lg:px-3">
                {radioData.history.map((track, index) => (
                  <p key={index} className="text-sm sm:text-base lg:text-sm text-gray-400 truncate">
                    {track}
                  </p>
                ))}
              </div>
            )}

            <div className="w-full mt-4">
              <div className="flex items-center justify-center lg:justify-start">
                <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full mr-2 ${isPlaying ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
                  {isPlaying ? 'Çalıyor' : 'Duraksadı'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;