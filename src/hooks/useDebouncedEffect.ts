import { useEffect, useRef } from 'react';

export const useDebouncedEffect = (
  effect: () => void,
  deps: unknown[],
  delay = 300,
) => {
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(effect, delay);

    return () => {
      window.clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
