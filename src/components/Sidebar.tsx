import { Link, NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../lib/nav';
import { STORE } from '../lib/store';
import Icon from './Icon';
import Logo from './Logo';

interface SidebarProps {
  id?: string;
  /** Drawer state on small screens; ignored on desktop where the sidebar is always shown. */
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ id, open = false, onClose }: SidebarProps) {
  return (
    <aside id={id} className={`sidebar${open ? ' open' : ''}`}>
      <div className="sidebar-top">
        <Logo on="dark" />
        <button type="button" className="sidebar-close" aria-label="بستن منو" onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>

      <div className="sidebar-store">
        <div className="sidebar-store-label">فروشگاه</div>
        <div className="sidebar-store-name">{STORE.name}</div>
        <div className="sidebar-store-status">
          <span className="status-dot" />
          متصل به دیجی‌پی و دیجی‌کالا
        </div>
      </div>

      <nav aria-label="منوی اصلی" className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.path} to={item.path} className="sidebar-link">
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-credit">
        <div className="sidebar-credit-label">اعتبار در دسترس</div>
        <div className="sidebar-credit-amount">{STORE.creditLimitLabel}</div>
        <Link to="/loan" className="sidebar-credit-cta">
          مشاهده پیشنهاد وام
        </Link>
      </div>

      <Link to="/" className="sidebar-logout">
        خروج از حساب
      </Link>
    </aside>
  );
}
