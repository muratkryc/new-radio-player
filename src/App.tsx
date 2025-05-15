import { useState, useEffect } from 'react';
import RadioPlayer from './components/RadioPlayer';
import useRadioInfo from './hooks/useRadioInfo';
import useColorTheme from './hooks/useColorTheme';
import { RadioInfo } from './types';

function App() {
  const streamUrl = 'https://radyo.medyahost.com.tr/8046/stream';
  const stationName = 'Radio Energy';

  const { radioInfo: latestRadioInfo, error: radioInfoError } = useRadioInfo();

  const [currentDisplayTitle, setCurrentDisplayTitle] = useState<string | undefined>(undefined);
  const [imageUrlForThemeAndDisplay, setImageUrlForThemeAndDisplay] = useState<string | undefined>(undefined);
  const [radioInfoForPlayer, setRadioInfoForPlayer] = useState<RadioInfo | null>(null);

  useEffect(() => {
    if (latestRadioInfo && latestRadioInfo.title) {
      if (latestRadioInfo.title !== currentDisplayTitle || currentDisplayTitle === undefined) {
        setCurrentDisplayTitle(latestRadioInfo.title);
        const newImageUrl = latestRadioInfo.art?.replace('https://radyo.medyahost.com.tr', '/radio-image');
        setImageUrlForThemeAndDisplay(newImageUrl);
        setRadioInfoForPlayer(latestRadioInfo);
      } else {
        if (radioInfoForPlayer && 
            (latestRadioInfo.listeners !== radioInfoForPlayer.listeners || 
             JSON.stringify(latestRadioInfo.history) !== JSON.stringify(radioInfoForPlayer.history))) {
          setRadioInfoForPlayer(prev => prev ? {...prev, listeners: latestRadioInfo.listeners, history: latestRadioInfo.history} : latestRadioInfo);
        }
      }
    } else if (!latestRadioInfo && (currentDisplayTitle !== undefined || imageUrlForThemeAndDisplay !== undefined)) {
      setCurrentDisplayTitle(undefined);
      setImageUrlForThemeAndDisplay(undefined);
      setRadioInfoForPlayer(null);
    }
  }, [latestRadioInfo, currentDisplayTitle, radioInfoForPlayer, radioInfoError]);

  const themeColors = useColorTheme(imageUrlForThemeAndDisplay);

  const appStyle: Record<string, string> = {
    '--primary-start-color': themeColors.primaryStart,
    '--primary-end-color': themeColors.primaryEnd,
    '--secondary-color-rgb': themeColors.secondaryRgb,
    '--tertiary-color-rgb': themeColors.tertiaryRgb,
    backgroundImage: themeColors.backgroundGradient,
  };
  
  return (
    <div 
      style={appStyle}
      className="h-screen flex flex-col overflow-hidden transition-all duration-1000 ease-in-out"
    >
      <div className="flex-grow flex items-center justify-center w-full p-4">
        <RadioPlayer 
          streamUrl={streamUrl} 
          stationName={stationName} 
          radioData={radioInfoForPlayer}
          currentAlbumArtUrl={imageUrlForThemeAndDisplay} 
          apiError={radioInfoError}
        />
      </div>
      
      <div className="py-4 text-center text-gray-500 text-xs">
        <p>© {new Date().getFullYear()} {stationName} Radio. All rights reserved.</p>
      </div>
    </div>
  );
}

export default App;