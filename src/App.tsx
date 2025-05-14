import RadioPlayer from './components/RadioPlayer';
import useRadioInfo from './hooks/useRadioInfo';
import useColorTheme from './hooks/useColorTheme';

function App() {
  const streamUrl = 'https://radyo.medyahost.com.tr/8046/stream';
  const stationName = 'Radio Energy';

  const { radioInfo } = useRadioInfo();
  // RadioPlayer'daki gibi proxy için URL'i düzenle
  const imageUrlForTheme = radioInfo?.art?.replace('https://radyo.medyahost.com.tr', '/radio-image');
  const themeColors = useColorTheme(imageUrlForTheme);

  // CSS Değişkenlerini ve ana arkaplanı oluştur
  const appStyle: React.CSSProperties = {
    '--primary-start-color': themeColors.primaryStart,
    '--primary-end-color': themeColors.primaryEnd,
    '--secondary-color-rgb': themeColors.secondaryRgb,
    '--tertiary-color-rgb': themeColors.tertiaryRgb,
    backgroundImage: themeColors.backgroundGradient,
  };
  
  return (
    // Ana div'e style prop'unu ve dinamik arkaplan için classları uygula
    // Not: className'deki gradient sınıfları artık appStyle'daki backgroundImage tarafından yönetilecek.
    // Sadece temel layout ve geçiş sınıfları kalmalı.
    <div 
      style={appStyle}
      className="min-h-screen flex items-center justify-center p-4 transition-all duration-1000 ease-in-out"
    >
      <div className="w-full max-w-md">
        {/* RadioPlayer artık themeColors'ı prop olarak almayacak, CSS değişkenlerini kullanacak */}
        <RadioPlayer streamUrl={streamUrl} stationName={stationName} />
        
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>© 2025 {stationName} Radio. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default App;