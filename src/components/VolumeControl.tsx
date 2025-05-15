import React, { useRef } from 'react';
import { Volume1, Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onChange: (value: number) => void;
  // colors prop artık doğrudan kullanılmayacak, CSS değişkenleri üzerinden stil alacak
  // colors?: {
  //   primary: string;
  //   secondary: string;
  //   background: string;
  // };
}

// colors prop'u artık destrucuring assignment'dan çıkarıldı.
const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onChange }) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      let newVolume = clickX / rect.width;
      newVolume = Math.max(0, Math.min(1, newVolume));
      onChange(newVolume);
    }
  };

  const renderVolumeIcon = () => {
    // İkon boyutları responsive yapıldı
    if (volume === 0) return <VolumeX size={20} className="lg:size-6" />;
    if (volume < 0.5) return <Volume1 size={20} className="lg:size-6" />;
    return <Volume2 size={20} className="lg:size-6" />;
  };

  const thumbPosition = `${volume * 100}%`;

  return (
    <div className="flex items-center gap-3 lg:gap-4">
      <button 
        className="text-white hover:text-opacity-80 transition-colors p-1 lg:p-1.5 rounded-full hover:bg-white/10"
        onClick={() => onChange(volume === 0 ? 0.7 : 0)}
        aria-label={volume === 0 ? "Unmute" : "Mute"}
      >
        {renderVolumeIcon()}
      </button>
      <div 
        ref={trackRef}
        className="relative w-16 sm:w-24 lg:w-32 h-2 bg-gray-500/70 rounded-full cursor-pointer group"
        onClick={handleTrackClick}
      >
        <div 
          className={`absolute left-0 top-0 h-full bg-gradient-to-r from-[var(--primary-start-color)] to-[var(--primary-end-color)] rounded-full`}
          style={{ width: thumbPosition }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 bg-white rounded-full shadow-md transition-transform duration-150 ease-in-out group-hover:scale-110"
          style={{ left: thumbPosition, transform: `translateX(-50%) translateY(-50%)` }}
        >
          <div className="absolute inset-0.5 bg-gradient-to-br from-[var(--primary-start-color)] to-[var(--primary-end-color)] rounded-full"></div>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Volume"
          style={{ zIndex: -1 }}
        />
      </div>
    </div>
  );
};

export default VolumeControl;