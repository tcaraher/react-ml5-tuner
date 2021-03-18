import { useRef, useEffect } from 'react';

export default function useAudioContext() {
  const audio = useRef();
  useEffect(() => {
    audio.current = new (window.AudioContext || window.webkitAudioContext)();
  }, []);
  return audio;
}
