import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls to the top on page change, or to the `#hash` target when one is given. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 0);
    return () => window.clearTimeout(t);
  }, [pathname, hash]);

  return null;
}
