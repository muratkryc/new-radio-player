import { useState, FC } from 'react';
import { Radio, History, ChevronDown, ChevronUp } from 'lucide-react';
import useAudioPlayer from '../hooks/useAudioPlayer';
import useRadioInfo from '../hooks/useRadioInfo';
import AudioControls from './AudioControls';
import VolumeControl from './VolumeControl';
import Visualizer from './Visualizer';

interface RadioPlayerProps {
  streamUrl: string;
  stationName: string;
}

const RadioPlayer: FC<RadioPlayerProps> = ({ streamUrl, stationName }) => {
  const [showHistory, setShowHistory] = useState(false);
  const { playerState, togglePlay, setVolume } = useAudioPlayer(streamUrl);
  const { radioInfo, error: apiError } = useRadioInfo();
  const imageUrlForTheme = radioInfo?.art?.replace('https://radyo.medyahost.com.tr', '/radio-image');
  const { isPlaying, isLoading, volume, isError } = playerState;

  return (
    <div 
      className={`min-h-screen flex items-center justify-center`}
    >
      <div className="w-full max-w-md">
        <div className={`bg-black bg-opacity-30 backdrop-blur-xl p-6 rounded-2xl shadow-2xl`}>
          <div className="flex flex-col items-center">
            {/* Album Art */}
            {radioInfo?.art ? (
              <div className="mb-6 w-full aspect-square max-w-[240px]">
                <img 
                  src={imageUrlForTheme}
                  alt={radioInfo.title} 
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            ) : (
              <div 
                className={`p-12 rounded-lg mb-6 bg-gradient-to-r from-[var(--primary-start-color)] to-[var(--primary-end-color)]`}
              >
                <Radio className="w-12 h-12 text-white" />
              </div>
            )}

            {/* Station Info */}
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold text-white">{stationName}</h1>
              <p className="text-sm text-gray-300">
                {radioInfo?.listeners && `${radioInfo.listeners} Dinleyici`}
              </p>
            </div>

            {/* Audio visualizer */}
            <div className="mb-6 w-full">
              <Visualizer isPlaying={isPlaying} />
            </div>

            {/* Now playing */}
            <div className="mb-6 w-full text-center">
              <p className="text-white font-medium truncate">
                {radioInfo?.title || 'Yükleniyor...'}
              </p>
            </div>

            {/* Error message */}
            {(isError || apiError) && (
              <div className="mb-4 text-red-500 text-sm text-center">
                Error loading stream. Please try again.
              </div>
            )}

            {/* Kontroller - Daha kompakt ve ortalanmış görünüm */}
            <div className="flex items-center justify-center w-full gap-4 px-4 mb-6">
              <AudioControls 
                isPlaying={isPlaying}
                isLoading={isLoading}
                onTogglePlay={togglePlay}
              />
              <VolumeControl
                volume={volume}
                onChange={setVolume}
              />
            </div>

            {/* Recent tracks toggle */}
            {radioInfo?.history && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full mt-4 flex items-center justify-between px-4 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <History size={16} />
                  <span className="text-sm font-medium">Son Çalınanlar</span>
                </div>
                {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}

            {/* Recent tracks list */}
            {showHistory && radioInfo?.history && (
              <div className="w-full mt-2 space-y-2 max-h-32 overflow-y-auto custom-scrollbar px-4">
                {radioInfo.history.map((track, index) => (
                  <p key={index} className="text-sm text-gray-400 truncate">
                    {track}
                  </p>
                ))}
              </div>
            )}

            {/* Player status */}
            <div className="w-full mt-4">
              <div className="flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${isPlaying ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <p className="text-gray-300 text-sm">
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