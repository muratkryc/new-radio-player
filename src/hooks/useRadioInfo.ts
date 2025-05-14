import { useState, useEffect } from 'react';
import { RadioInfo } from '../types';

const useRadioInfo = () => {
  const [radioInfo, setRadioInfo] = useState<RadioInfo | null>(null);
  const [error, setError] = useState<boolean>(false);

  const fetchRadioInfo = async () => {
    try {
      const response = await fetch('https://radyo.medyahost.com.tr/cp/get_info.php?p=8046');
      const data = await response.json();
      setRadioInfo({
        title: data.title,
        // art değeri güncelleniyor: orijinal URL + zaman damgası
        art: `${data.art}?t=${new Date().getTime()}`,
        listeners: data.listeners,
        history: data.history.map((track: string) => track.replace(/<br>$/, '').replace(/^\d+\.\)\s/, '')),
      });
      setError(false);
    } catch (err) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchRadioInfo();
    const interval = setInterval(fetchRadioInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return { radioInfo, error };
};

export default useRadioInfo;