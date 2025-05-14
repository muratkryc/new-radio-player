import { useState, useEffect } from 'react';
import ColorThief from 'colorthief';

// Renklerin yapısını tanımlayalım
interface ThemeColors {
  primaryStart: string;
  primaryEnd: string;
  secondaryRgb: string; // Düz renkler için rgb(r,g,b) formatında
  tertiaryRgb: string;  // Düz renkler için rgb(r,g,b) formatında
  backgroundGradient: string;
}

// Varsayılan renkleri bu yapıya uygun hale getirelim
const defaultColors: ThemeColors = {
  primaryStart: 'rgb(168, 85, 247)', // purple-600
  primaryEnd: 'rgb(236, 72, 153)',   // pink-600
  secondaryRgb: 'rgb(17, 24, 39)',    // gray-900 (Tailwind'de bg-[var(--secondary-color)] olarak kullanılacak)
  tertiaryRgb: 'rgb(75, 0, 130)',     // Bir ara renk (örneğin indigo-800 gibi)
  backgroundGradient: 'linear-gradient(to bottom right, rgb(17, 24, 39), rgb(88, 28, 135), rgb(17, 24, 39))' // from-gray-900 via-purple-900 to-gray-900
};

const useColorTheme = (imageUrl: string | undefined) => {
  const [colors, setColors] = useState<ThemeColors>(defaultColors);

  useEffect(() => {
    // console.log('[useColorTheme] useEffect çalıştı. Image URL:', imageUrl);
    if (!imageUrl) {
      // console.log('[useColorTheme] Image URL mevcut değil, varsayılan renklere dönülüyor.');
      if (JSON.stringify(colors) !== JSON.stringify(defaultColors)) {
        setColors(defaultColors);
      }
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;
    // console.log('[useColorTheme] Yeni resim yükleniyor:', imageUrl);

    img.onload = () => {
      // console.log('[useColorTheme] Resim başarıyla yüklendi:', imageUrl);
      const colorThief = new ColorThief();
      try {
        const palette = colorThief.getPalette(img, 3); // 3 renk alıyoruz
        // console.log('[useColorTheme] Çıkarılan renk paleti (RGB array):', palette);

        if (!palette || palette.length < 3) {
            // console.warn('[useColorTheme] Palet yetersiz, varsayılan renklere dönülüyor.');
            if (JSON.stringify(colors) !== JSON.stringify(defaultColors)) {
              setColors(defaultColors);
            }
            return;
        }

        const primaryRgb = palette[0];
        const secondaryRgbPalette = palette[1]; 
        const tertiaryRgbPalette = palette[2];

        const newColors: ThemeColors = {
          primaryStart: `rgb(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]})`,
          primaryEnd: `rgb(${secondaryRgbPalette[0]}, ${secondaryRgbPalette[1]}, ${secondaryRgbPalette[2]})`,
          secondaryRgb: `rgb(${secondaryRgbPalette[0]}, ${secondaryRgbPalette[1]}, ${secondaryRgbPalette[2]})`,
          tertiaryRgb: `rgb(${tertiaryRgbPalette[0]}, ${tertiaryRgbPalette[1]}, ${tertiaryRgbPalette[2]})`,
          backgroundGradient: `linear-gradient(to bottom right, rgb(${secondaryRgbPalette[0]}, ${secondaryRgbPalette[1]}, ${secondaryRgbPalette[2]}), rgb(${tertiaryRgbPalette[0]}, ${tertiaryRgbPalette[1]}, ${tertiaryRgbPalette[2]}), rgb(${secondaryRgbPalette[0]}, ${secondaryRgbPalette[1]}, ${secondaryRgbPalette[2]}))`
        };
        
        // console.log('[useColorTheme] Yeni renkler hesaplandı (RGB strings):', newColors);
        if (JSON.stringify(colors) !== JSON.stringify(newColors)) {
          setColors(newColors);
        }

      } catch (e) {
          // console.error('[useColorTheme] Renk çıkarma sırasında hata oluştu:', e, 'URL:', imageUrl);
          if (JSON.stringify(colors) !== JSON.stringify(defaultColors)) {
            setColors(defaultColors);
          }
      }
    };

    img.onerror = () => {
        // console.error('[useColorTheme] Resim yüklenirken hata oluştu. URL:', imageUrl);
        if (JSON.stringify(colors) !== JSON.stringify(defaultColors)) {
          setColors(defaultColors);
        }
    };

  }, [imageUrl, colors]); // colors'ı dependency array'e ekleyerek gereksiz setColors çağrılarını engelliyoruz

  return colors;
};

export default useColorTheme;