import { Link } from 'react-router-dom';
import Logo from './Logo';

interface PublicHeaderProps {
  variant?: 'landing' | 'compact';
}

export default function PublicHeader({ variant = 'landing' }: PublicHeaderProps) {
  return (
    <header className="pub-header">
      <div className="pub-header-inner">
        <Logo />
        {variant === 'landing' ? (
          <>
            <nav aria-label="منوی سایت" className="pub-nav">
              <Link to="/#services">خدمات</Link>
              <Link to="/#who">برای چه کسانی</Link>
              <Link to="/#services">تعرفه‌ها</Link>
              <Link to="/#about">درباره ما</Link>
              <Link to="/faq">سوالات متداول</Link>
            </nav>
            <div className="pub-actions">
              <Link to="/login" className="pub-login">
                ورود
              </Link>
              <Link to="/signup" className="btn btn-primary">
                افتتاح حساب کسب‌وکار
              </Link>
            </div>
          </>
        ) : (
          <div className="pub-actions">
            <Link to="/" className="pub-login">
              صفحه اصلی
            </Link>
            <Link to="/login" className="pub-login">
              ورود
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm">
              افتتاح حساب
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
