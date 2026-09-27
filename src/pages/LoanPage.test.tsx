import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoanPage from './LoanPage';

function setup() {
  render(
    <MemoryRouter>
      <LoanPage />
    </MemoryRouter>,
  );
  return userEvent.setup();
}

describe('LoanPage', () => {
  it('walks through offer → review → sign → done', async () => {
    const user = setup();

    await user.click(screen.getByRole('button', { name: /۱۲ ماه/ }));
    expect(screen.getByText('و ۸ قسط دیگر')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'درخواست این وام' }));
    const toContract = screen.getByRole('button', { name: 'ادامه به قرارداد' });
    expect(toContract).toBeDisabled();
    await user.click(screen.getByRole('checkbox'));
    await user.click(toContract);

    const sign = screen.getByRole('button', { name: 'امضا و دریافت وام' });
    expect(sign).toBeDisabled();
    await user.type(screen.getByLabelText('کد امضای ارسال‌شده به موبایل'), '۱۲۳۴۵');
    expect(sign).toBeEnabled();
    await user.click(sign);

    expect(screen.getByRole('heading', { name: /واریز شد/ })).toHaveTextContent('۶۰۰٬۰۰۰٬۰۰۰');
  });
});
