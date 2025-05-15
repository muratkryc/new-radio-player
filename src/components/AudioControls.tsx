import { FC } from 'react';
import { Play, Pause, Loader2 } from 'lucide-react';

interface AudioControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  onTogglePlay: () => void;
  // colors prop artık doğrudan kullanılmayacak, CSS değişkenleri üzerinden stil alacak
  // colors?: { // İsteğe bağlı bırakılabilir veya tamamen kaldırılabilir
  //   primary: string;
  //   secondary: string;
  //   background: string;
  // };
}

// colors prop'u artık destrucuring assignment'dan çıkarıldı.
const AudioControls: FC<AudioControlsProps> = ({ isPlaying, isLoading, onTogglePlay }) => {
  return (
    <button
      onClick={onTogglePlay}
      disabled={isLoading}
      className={`
        w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center
        // CSS değişkenlerini kullanarak gradient tanımla
        bg-gradient-to-r from-[var(--primary-start-color)] to-[var(--primary-end-color)]
        shadow-lg 
        // Hover ve active durumları için iyileştirmeler
        hover:brightness-110 hover:shadow-xl 
        active:brightness-90 active:shadow-md
        transition-all duration-200 ease-in-out // duration biraz kısaltıldı
        disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:brightness-100 disabled:hover:shadow-lg
      `}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {isLoading ? (
        <Loader2 className="w-7 h-7 lg:w-8 lg:h-8 text-white animate-spin" /> // İkon boyutu responsive yapıldı
      ) : isPlaying ? (
        <Pause className="w-7 h-7 lg:w-8 lg:h-8 text-white" /> // İkon boyutu responsive yapıldı
      ) : (
        <Play className="w-7 h-7 lg:w-8 lg:h-8 text-white ml-1 lg:ml-[0.3rem]" /> // İkon boyutu ve ml responsive yapıldı
      )}
    </button>
  );
};

export default AudioControls;