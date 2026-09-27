import { useEffect, useState } from 'react';
import blueMark from '../assets/digipay-blue.png';

// Decorative, animated storefront for the landing hero (inspired by the Digipay "sell in instalments" banner).

const STRIPES = 12;
const W = 600;
const SW = W / STRIPES;

function Awning() {
  return (
    <svg className="hs-awning" viewBox={`0 0 ${W} 74`} preserveAspectRatio="none">
      {Array.from({ length: STRIPES }, (_, i) => {
        const x = i * SW;
        const blue = i % 2 === 0;
        return (
          <g key={i}>
            <path d={`M${x + (blue ? 4 : 0)} 0 H${x + SW - (blue ? 0 : 4)} L${x + SW} 34 H${x} Z`} fill={blue ? '#1557ff' : '#ffffff'} />
            <path d={`M${x} 34 H${x + SW} V46 A${SW / 2} ${SW / 2.2} 0 0 1 ${x} 46 Z`} fill={blue ? '#1446d6' : '#ece6ee'} />
          </g>
        );
      })}
    </svg>
  );
}

const ICONS = [
  'M6 8h12l-1 12H7L6 8zM9 8a3 3 0 0 1 6 0M9.5 13c1.4 1.4 3.6 1.4 5 0', // shopping bag
  'M3 5h2l2.2 10h10.3L20 8H6.2M9 19.5h.01M17 19.5h.01', // cart
  'M3 7h18v11H3zM3 11h18', // card
  'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8v8M9.5 10h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4', // coin
  'M7 3h10v18l-2.5-1.5L12 21l-2.5-1.5L7 21zM10 8h4M10 12h4', // receipt
  'M3 7h11v9H3zM14 10h4l3 3v3h-7M7 18.5h.01M17 18.5h.01', // truck
  'M4 10h16l-1-5H5zM5 10v9h14v-9M10 19v-5h4v5', // store
  'M6 18 18 6M8 8h.01M16 16h.01', // percent
  'M13 2 4 14h7l-1 8 9-12h-7z', // bolt
];

// [x%, y%, size, rotation, delay]
const SCATTER: [number, number, number, number, number][] = [
  [6, 24, 40, -12, 0], [84, 22, 36, 10, 1.4], [14, 60, 34, 8, 2.6], [88, 58, 40, -8, 0.8],
  [50, 86, 30, 0, 3.2], [6, 88, 32, 12, 1.9], [90, 90, 30, -14, 2.2], [28, 30, 26, 16, 3.8], [70, 34, 26, -10, 4.4],
];

const NOTES = [
  { icon: 'bolt', label: 'تسویه آنی', amount: 234_824_000, text: 'همین حالا به کیف پول کسب‌وکار واریز شد', tone: 'blue' },
  { icon: 'check', label: 'وام کسب‌وکار تأیید شد', amount: 600_000_000, text: 'بدون وثیقه و ضامن · امضای دیجیتال', tone: 'green' },
  { icon: 'cart', label: 'فروش اقساطی جدید', amount: 48_200_000, text: 'کل مبلغ برای شما، ریسک اقساط با دیجی‌پی', tone: 'gold' },
] as const;

const NOTE_ICONS = {
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  cart: 'M3 5h2l2.2 10h10.3L20 8H6.2M9 19.5h.01M17 19.5h.01',
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return reduced;
}

/** Counts from 0 up to `to` whenever `to` changes. */
function useCountUp(to: number, run: boolean, ms = 900) {
  const [v, setV] = useState(run ? 0 : to);
  useEffect(() => {
    if (!run) {
      setV(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, run, ms]);
  return v;
}

export default function HeroStore() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % NOTES.length), 3600);
    return () => window.clearInterval(t);
  }, [reduced]);

  const note = NOTES[i];
  const amount = useCountUp(note.amount, !reduced);

  return (
    <div className={`hs${reduced ? ' hs-still' : ''}`} aria-hidden="true">
      <div className="hs-panel">
        {SCATTER.map(([x, y, size, rot, delay], k) => (
          <svg
            key={k}
            className="hs-icon"
            style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, rotate: `${rot}deg`, animationDelay: `${delay}s` }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={ICONS[k % ICONS.length]} />
          </svg>
        ))}

        <div className="hs-copy">
          <div className="hs-kicker">فروش امروز، پول امروز</div>
          <div className="hs-glow">همین حالا تسویه کن</div>
        </div>

        <div className="hs-card">
          <div className="hs-card-top">
            <span className="hs-card-chip" />
            <span className="hs-card-brand">
              <img src={blueMark} alt="" />
              <span>بیزینس</span>
            </span>
          </div>
          <div className="hs-card-number">۶۰۳۷ •••• •••• ۲۰۴۱</div>
          <div className="hs-card-foot">
            <span>کارت نقدی کیف پول کسب‌وکار</span>
            <span>[نام فروشگاه]</span>
          </div>
        </div>

        <div key={i} className={`hs-note hs-note-${note.tone}`}>
          <span className="hs-note-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill={note.icon === 'bolt' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d={NOTE_ICONS[note.icon]} />
            </svg>
          </span>
          <span className="hs-note-body">
            <span className="hs-note-label">{note.label}</span>
            <span className="hs-note-amount">{amount.toLocaleString('fa-IR')} تومان</span>
            <span className="hs-note-text">{note.text}</span>
          </span>
        </div>

        <div className="hs-dots">
          {NOTES.map((_, k) => (
            <span key={k} className={k === i ? 'on' : ''} />
          ))}
        </div>
      </div>
      <Awning />
    </div>
  );
}
