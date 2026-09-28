import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import Faq from './Faq';
import Signup from './Signup';

const renderAt = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

it('filters FAQs by search text', async () => {
  const user = userEvent.setup();
  renderAt(<Faq />);
  await user.type(screen.getByRole('searchbox'), 'شبا');
  expect(screen.getByText('سوالی با این عبارت پیدا نشد.')).toBeInTheDocument();
  await user.clear(screen.getByRole('searchbox'));
  await user.type(screen.getByRole('searchbox'), 'صورتحساب');
  expect(screen.getByText('اگر صورتحسابی رد شود چه کنم؟')).toBeInTheDocument();
  expect(screen.queryByText('چه مدارکی برای عضویت لازم است؟')).not.toBeInTheDocument();
});

it('blocks signup step 1 until the fields are valid', async () => {
  const user = userEvent.setup();
  renderAt(<Signup />);
  await user.click(screen.getByRole('button', { name: 'ادامه' }));
  expect(screen.getByText('کد ملی معتبر نیست.')).toBeInTheDocument();

  await user.type(screen.getByLabelText('کد ملی'), '0012345679');
  await user.type(screen.getByLabelText('شماره موبایل (به نام خودتان)'), '09123456789');
  await user.type(screen.getByLabelText('تاریخ تولد'), '1365/04/12');
  await user.type(screen.getByLabelText('رمز عبور'), 'secret123');
  await user.click(screen.getByRole('button', { name: 'ادامه' }));
  expect(screen.getByRole('heading', { name: 'اطلاعات کسب‌وکار' })).toBeInTheDocument();
});

it('settles instantly into the wallet by default', async () => {
  const user = userEvent.setup();
  renderAt(<Dashboard />);
  expect(screen.getByRole('radio', { name: /آنی/ })).toBeChecked();
  expect(screen.getByText('۳٬۵۷۶٬۰۰۰ تومان')).toBeInTheDocument();
  const settleButtons = screen.getAllByRole('button', { name: /تسویه آنی/ });
  await user.click(settleButtons[settleButtons.length - 1]);
  expect(screen.getByText(fmt(412_500_000 + 238_400_000 - 3_576_000))).toBeInTheDocument();
  expect(screen.getByText('تسویه آنی انجام شد')).toBeInTheDocument();
});

it('schedules a 5-day early settlement without changing the wallet yet', async () => {
  const user = userEvent.setup();
  renderAt(<Dashboard />);
  await user.click(screen.getByRole('radio', { name: '۵ روز زودتر' }));
  expect(screen.getByText('۹۵۳٬۶۰۰ تومان')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'تأیید و دریافت' }));
  expect(screen.getByText(fmt(412_500_000))).toBeInTheDocument();
  expect(screen.getByText('در حال واریز · ظرف ۲۴ ساعت')).toBeInTheDocument();
});

function fmt(n: number) {
  return n.toLocaleString('fa-IR');
}


it('raises the credit limit after connecting a bank account', async () => {
  const { default: Sales } = await import('./Sales');
  const user = userEvent.setup();
  renderAt(<Sales />);
  expect(screen.getByText('۸۵۰ میلیون')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'اتصال حساب بانکی' }));
  await user.click(screen.getByRole('radio', { name: 'ملت' }));
  await user.click(screen.getByRole('checkbox'));
  await user.click(screen.getByRole('button', { name: 'ادامه در صفحه بانک' }));
  expect(screen.getByText('۱٫۶ میلیارد')).toBeInTheDocument();
});
