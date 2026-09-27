import { Link } from 'react-router-dom';
import blueMark from '../assets/digipay-blue.png';
import whiteMark from '../assets/digipay-white.png';

interface LogoProps {
  /** `light` = blue wordmark for light backgrounds, `dark` = white wordmark for the navy sidebar. */
  on?: 'light' | 'dark';
  to?: string;
}

export default function Logo({ on = 'light', to = '/' }: LogoProps) {
  return (
    <Link to={to} className="logo" aria-label="دیجی‌پی بیزینس — صفحه اصلی">
      <img src={on === 'dark' ? whiteMark : blueMark} alt="" />
      <span className={`logo-badge${on === 'dark' ? ' logo-badge-blue' : ''}`}>بیزینس</span>
    </Link>
  );
}
