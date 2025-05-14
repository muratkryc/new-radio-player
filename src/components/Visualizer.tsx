import React from 'react';

interface VisualizerProps {
  isPlaying: boolean;
  primaryColorVar?: string;
}

const Visualizer: React.FC<VisualizerProps> = ({ isPlaying, primaryColorVar }) => {
  const bars = Array.from({ length: 7 });
  
  return (
    <div className="flex items-end justify-center gap-1 h-12">
      {bars.map((_, index) => (
        <div
          key={index}
          className={`w-1 bg-[var(--primary-start-color)] rounded-full transition-all duration-300 ease-in-out ${
            isPlaying ? 'animate-equalizer' : 'h-1'
          }`}
          style={{
            animationDelay: `${index * 0.15}s`,
            height: isPlaying ? undefined : '4px'
          }}
        />
      ))}
    </div>
  );
};

export default Visualizer;