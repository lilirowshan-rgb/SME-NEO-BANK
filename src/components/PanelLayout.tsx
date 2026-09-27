import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Icon, { type IconName } from './Icon';
import Logo from './Logo';
import Sidebar from './Sidebar';

const TABS: { to: string; label: string; icon: IconName }[] = [
  { to: '/dashboard', label: 'خانه', icon: 'home' },
  { to: '/loan', label: 'اعتبار', icon: 'credit' },
  { to: '/cash', label: 'نقدینگی', icon: 'wallet' },
  { to: '/accounting', label: 'گزارش‌ها', icon: 'report' },
];

export default function PanelLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <div className="app-shell">
      {/* Phone/tablet only: compact top bar replaces the sidebar. */}
      <header className="mobile-bar">
        <Logo on="dark" />
        <button type="button" className="mobile-bar-btn" aria-label="منو" aria-expanded={menuOpen} aria-controls="panel-menu" onClick={() => setMenuOpen(true)}>
          <Icon name="menu" />
        </button>
      </header>

      <Sidebar id="panel-menu" open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

      <main className="app-main">
        <Outlet />
      </main>

      <nav className="tabbar" aria-label="دسترسی سریع">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} className="tabbar-item">
            <Icon name={t.icon} />
            <span>{t.label}</span>
          </NavLink>
        ))}
        <button type="button" className="tabbar-item" aria-expanded={menuOpen} aria-controls="panel-menu" onClick={() => setMenuOpen(true)}>
          <Icon name="menu" />
          <span>بیشتر</span>
        </button>
      </nav>
    </div>
  );
}
