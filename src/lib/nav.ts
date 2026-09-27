export interface NavItem {
  path: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'داشبورد و پرداخت‌ها' },
  { path: '/loan', label: 'وام و اعتبار' },
  { path: '/cash', label: 'مدیریت نقدینگی' },
  { path: '/tax', label: 'مالیات و سامانه مودیان' },
  { path: '/insights', label: 'بینش کسب‌وکار' },
  { path: '/profile', label: 'پروفایل و اشخاص' },
  { path: '/faq', label: 'سوالات متداول' },
];
