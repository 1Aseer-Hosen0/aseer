import { useState, useEffect } from 'react';

const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Dhaka',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});

export function useClock() {
  const [time, setTime] = useState(() => {
    try {
      return fmt.format(new Date());
    } catch {
      return '00:00:00';
    }
  });

  useEffect(() => {
    const tick = () => {
      try {
        setTime(fmt.format(new Date()));
      } catch {
        // fallback
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
