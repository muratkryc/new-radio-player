import { useState, useEffect, useCallback } from 'react';
import { RadioInfo } from '../types';

const useRadioInfo = () => {
  const [radioInfo, setRadioInfo] = useState<RadioInfo | null>(null);
  const [error, setError] = useState<boolean>(false);

  const fetchRadioInfo = useCallback(async () => {
    try {
      const response = await fetch('https://radyo.medyahost.com.tr/cp/get_info.php?p=8046');
      if (!response.ok) {
        console.warn('Radio info fetch failed with status:', response.status);
        setError(true);
        return;
      }
      const data = await response.json();
      
      let djName = data.djusername;
      if (djName && djName.toLowerCase() === 'no dj') {
        djName = 'OtoDJ';
      } else if (!djName && data.autodj) {
        djName = data.autodj;
      }

      setRadioInfo({
        title: data.title,
        art: `${data.art}?t=${new Date().getTime()}`,
        listeners: data.listeners,
        history: data.history.map((track: string) => track.replace(/<br>$/, '').replace(/^\d+\.\)\s/, '')),
        bitrate: data.bitrate,
        dj: djName,
      });
      setError(false);
    } catch (err) {
      console.error('Error fetching radio info:', err);
      setError(true);
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
      } else {
        fetchRadioInfo();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    fetchRadioInfo();

    const interval = setInterval(fetchRadioInfo, 7000);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchRadioInfo]);

  return { radioInfo, error };
};

export default useRadioInfo;