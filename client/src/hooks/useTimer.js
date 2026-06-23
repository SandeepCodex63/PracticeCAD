import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (autoStart = true) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(autoStart);
  const timerIdRef = useRef(null);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setElapsedTime(0);
  }, []);

  useEffect(() => {
    if (isActive) {
      timerIdRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    }

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, [isActive]);

  return {
    elapsedTime,
    isActive,
    start,
    stop,
    reset,
    setElapsedTime
  };
};
