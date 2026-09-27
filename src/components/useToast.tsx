import { useCallback, useEffect, useState } from 'react';

/** Minimal transient confirmation message for prototype actions. */
export function useToast(duration = 2600) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => setMessage(null), duration);
    return () => window.clearTimeout(t);
  }, [message, duration]);

  const toast = message ? (
    <div className="toast" role="status">
      {message}
    </div>
  ) : null;

  return { show: useCallback((m: string) => setMessage(m), []), toast };
}
