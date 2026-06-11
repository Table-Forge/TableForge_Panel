import { useCallback, useEffect, useRef, useState } from "react";

export function useCountdown() {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    (seconds: number) => {
      clear();
      setSecondsLeft(seconds);
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clear();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clear],
  );

  const reset = useCallback(() => {
    clear();
    setSecondsLeft(0);
  }, [clear]);

  useEffect(() => clear, [clear]);

  return { secondsLeft, isActive: secondsLeft > 0, start, reset };
}
