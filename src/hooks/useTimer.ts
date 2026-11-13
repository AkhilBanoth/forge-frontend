import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  durationSeconds: number;
  storageKey?: string;
  onExpire?: () => void;
  autoStart?: boolean;
}

export function useTimer({
  durationSeconds,
  storageKey,
  onExpire,
  autoStart = true,
}: UseTimerOptions) {
  const getInitialRemaining = useCallback((): number => {
    if (storageKey) {
      const stored = localStorage.getItem(`timer_${storageKey}`);
      if (stored) {
        const { expiryTimestamp } = JSON.parse(stored);
        const remaining = Math.max(0, Math.floor((expiryTimestamp - Date.now()) / 1000));
        return remaining;
      }
      const expiryTimestamp = Date.now() + durationSeconds * 1000;
      localStorage.setItem(`timer_${storageKey}`, JSON.stringify({ expiryTimestamp }));
    }
    return durationSeconds;
  }, [durationSeconds, storageKey]);

  const [secondsRemaining, setSecondsRemaining] = useState<number>(getInitialRemaining);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!isRunning || secondsRemaining <= 0) {
      if (secondsRemaining <= 0 && onExpireRef.current) {
        onExpireRef.current();
      }
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (storageKey) localStorage.removeItem(`timer_${storageKey}`);
          if (onExpireRef.current) onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining, storageKey]);

  const resetTimer = useCallback(() => {
    if (storageKey) localStorage.removeItem(`timer_${storageKey}`);
    const initial = getInitialRemaining();
    setSecondsRemaining(initial);
    setIsRunning(true);
  }, [getInitialRemaining, storageKey]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isLowTime = secondsRemaining <= 120; // 2 minutes remaining
  const timeTakenSeconds = durationSeconds - secondsRemaining;

  return {
    secondsRemaining,
    timeTakenSeconds,
    formattedTime,
    isLowTime,
    isRunning,
    setIsRunning,
    resetTimer,
  };
}
