import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import BarChart from '../components/BarChart';
import StatCard from '../components/StatCard';
import Toggle from '../components/Toggle';
import { useToast } from '../components/useToast';
import { FORECAST, LOW_BALANCE, firstLowDay, forecastDate, isValidSheba } from '../lib/cash';
import { fa, faDec, faDigits } from '../lib/format';

interface Wallet {
  name: string;
  note: string;
  balance: number; // million toman
  target?: number;
  color: string;
}

const INITIAL_WALLETS: Wallet[] = [
  { name: 'کیف پول اصلی', note: 'قابل خرج', balance: 218, color: 'var(--blue)' },
  { name: 'ذخیره مالیات', note: '۱۰٪ هر واریز', balance: 65, target: 90, color: 'var(--navy)' },
  { name: 'خرید کالا', note: 'فصل پاییز', balance: 95, target: 150, color: 'var(--orange)' },
  { name: 'حقوق مهر', note: 'تا ۳۰ مهر', balance: 34.5, target: 110, color: 'var(--green)' },
];

const INITIAL_RULES = [
  { title: 'ذخیره مالیات', text: '۱۰٪ هر واریز فروش به کیف پول «ذخیره مالیات»', on: true },
  { title: 'پرداخت خودکار قسط وام', text: 'کسر از موجودی در روز سررسید', on: true },
  { title: 'اجاره انبار', text: 'اول هر ماه ۳۵ میلیون تومان به [نام موجر]', on: true },
  { title: 'انتقال مازاد', text: 'موجودی بالای ۳۰۰ میلیون به حساب بانکی اصلی', on: false },
  { title: 'کسر اقساط خرید کالا از تسویه', text: 'بازپرداخت BNPL از محل واریز فروش', on: false },
];

const INITIAL_BILLS = [
  { title: 'برق فروشگاه', due: 'سررسید ۱۲ مهر', amount: 2_840_000, paid: false },
  { title: 'گاز', due: 'سررسید ۱۸ مهر', amount: 960_000, paid: false },
  { title: 'تلفن ثابت و اینترنت', due: 'سررسید ۲۰ مهر', amount: 1_250_000, paid: false },
  { title: 'بیمه تأمین اجتماعی کارکنان', due: 'سررسید ۳۰ مهر', amount: 38_500_000, paid: false },
];

const INITIAL_ACCOUNTS = [
  { title: '[بانک] · حساب اصلی', sheba: 'IR•• •••• •••• •••• •••• ۴۵۱۲' },
  { title: '[بانک] · حساب حقوق', sheba: 'IR•• •••• •••• •••• •••• ۰۸۷۷' },
];

export default function Cash() {
  const [wallets, setWallets] = useState(INITIAL_WALLETS);
  const [rules, setRules] = useState(INITIAL_RULES);
  const [bills, setBills] = useState(INITIAL_BILLS);
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [walletForm, setWalletForm] = useState(false);
  const [shebaForm, setShebaForm] = useState(false);
  const { show, toast } = useToast();

  const low = firstLowDay(FORECAST);

  const addWallet = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name')).trim();
    const target = Number(data.get('target'));
    if (!name) return;
    setWallets((w) => [...w, { name, note: 'جدید', balance: 0, target: target > 0 ? target : undefined, color: 'var(--blue)' }]);
    setWalletForm(false);
    show(`کیف پول «${name}» ساخته شد`);
  };

  const [shebaError, setShebaError] = useState('');
  const addSheba = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const sheba = String(data.get('sheba'));
    if (!isValidSheba(sheba)) {
      setShebaError('شماره شبا معتبر نیست (IR و ۲۴ رقم).');
      return;
    }
    const digits = sheba.replace(/\D/g, '');
    setAccounts((a) => [...a, { title: String(data.get('title')).trim() || '[بانک] · حساب جدید', sheba: `IR•• •••• •••• •••• •••• ${faDigits(digits.slice(-4))}` }]);
    setShebaError('');
    setShebaForm(false);
    show('حساب جدید ثبت شد و پس از استعلام تأیید می‌شود');
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">مدیریت نقدینگی</h1>
          <p className="page-subtitle">پولتان را تقسیم کنید، آینده را پیش‌بینی کنید و پرداخت‌های تکراری را خودکار کنید.</p>
        </div>
        <div className="page-actions">
          <span className="badge badge-gold">داده‌های نمونه</span>
          <button type="button" className="btn btn-primary" onClick={() => setWalletForm((v) => !v)} aria-expanded={walletForm}>
            + کیف پول فرعی جدید
          </button>
        </div>
      </header>

      {walletForm && (
        <form className="inline-form" onSubmit={addWallet} aria-label="کیف پول فرعی جدید">
          <input className="input" name="name" placeholder="نام کیف پول، مثلاً «عیدی کارکنان»" required />
          <input className="input" name="target" type="number" min={0} placeholder="هدف (میلیون تومان، اختیاری)" />
          <button type="submit" className="btn btn-primary btn-sm" style={{ minHeight: 44 }}>
            ساخت
          </button>
          <button type="button" className="btn btn-secondary btn-sm" style={{ minHeight: 44 }} onClick={() => setWalletForm(false)}>
            انصراف
          </button>
        </form>
      )}

      <div className="grid grid-4">
        {wallets.map((w) => {
          const pct = w.target ? Math.min(100, Math.round((w.balance / w.target) * 100)) : 100;
          return (
            <StatCard
              key={w.name}
              label={w.name}
              aside={w.note}
              value={Number.isInteger(w.balance) ? fa(w.balance) : faDec(w.balance)}
              unit="میلیون تومان"
              foot={<span style={{ fontWeight: 500 }}>{w.target ? `هدف: ${fa(w.target)} میلیون · ${fa(pct)}٪` : 'بدون هدف'}</span>}
            >
              <div className="progress" aria-hidden="true">
                <div style={{ width: `${pct}%`, background: w.color }} />
              </div>
            </StatCard>
          );
        })}
      </div>

      <div className="grid grid-main-side">
        <section className="card">
          <div className="card-head">
            <h2 className="card-title">پیش‌بینی موجودی ۳۰ روز آینده</h2>
            <span className="card-note">بر اساس تسویه‌ها، اقساط و پرداخت‌های زمان‌بندی‌شده</span>
          </div>
          <BarChart
            height={220}
            gap={3}
            ariaLabel="پیش‌بینی موجودی ۳۰ روز آینده (میلیون تومان)"
            groups={FORECAST.map((v, i) => ({
              key: String(i),
              label: i === 0 ? `امروز · ${forecastDate(0)}` : i === 15 || i === 29 ? forecastDate(i) : '',
              bars: [{ value: v, color: v < LOW_BALANCE ? 'var(--orange)' : 'var(--blue-soft)' }],
              tooltip: (
                <>
                  <strong>{forecastDate(i)}</strong>
                  <br />
                  موجودی پیش‌بینی: {fa(v)} میلیون تومان
                  {v < LOW_BALANCE && (
                    <>
                      <br />
                      زیر حد امن ({fa(LOW_BALANCE)} میلیون)
                    </>
                  )}
                </>
              ),
            }))}
            table={{ head: ['روز', 'موجودی (میلیون تومان)'], rows: FORECAST.map((v, i) => [forecastDate(i), fa(v)]) }}
          />
          <div className="legend">
            <span>
              <i style={{ background: 'var(--blue-soft)' }} />
              موجودی پیش‌بینی‌شده
            </span>
            <span>
              <i style={{ background: 'var(--orange)' }} />
              زیر حد امن ({fa(LOW_BALANCE)} میلیون)
            </span>
          </div>
          {low >= 0 && (
            <div className="alert">
              <span className="alert-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 2 20h20L12 3z" />
                  <path d="M12 10v4M12 17.5v.01" />
                </svg>
              </span>
              <p>
                <strong>
                  {forecastDate(low)} موجودی به حدود {fa(FORECAST[low])} میلیون تومان می‌رسد
                </strong>{' '}
                (پس از پرداخت حقوق). برای اطمینان، تسویه آنی فروش در انتظار یا استفاده از کارت اعتباری را در نظر بگیرید.
              </p>
              <Link to="/dashboard" className="btn btn-dark btn-sm">
                تسویه آنی
              </Link>
            </div>
          )}
        </section>

        <section className="card">
          <h2 className="card-title">قوانین خودکار</h2>
          <div className="rows">
            {rules.map((r, i) => (
              <div key={r.title} className="row">
                <div className="row-main">
                  <div className="row-title">{r.title}</div>
                  <div className="row-sub">{r.text}</div>
                </div>
                <Toggle
                  label={r.title}
                  checked={r.on}
                  onChange={(on) => setRules((list) => list.map((x, j) => (j === i ? { ...x, on } : x)))}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-2">
        <section className="card">
          <h2 className="card-title">پرداخت قبوض</h2>
          <div className="rows">
            {bills.map((b, i) => (
              <div key={b.title} className="row">
                <div className="row-main">
                  <div className="row-title">{b.title}</div>
                  <div className="row-sub">{b.due}</div>
                </div>
                <div className="row-amount">{fa(b.amount)}</div>
                {b.paid ? (
                  <span className="badge badge-green" style={{ minWidth: 88, justifyContent: 'center' }}>
                    پرداخت شد
                  </span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ minWidth: 88 }}
                    onClick={() => {
                      setBills((list) => list.map((x, j) => (j === i ? { ...x, paid: true } : x)));
                      show(`${b.title} پرداخت شد`);
                    }}
                  >
                    پرداخت
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <h2 className="card-title">حساب‌های بانکی متصل</h2>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShebaForm((v) => !v)} aria-expanded={shebaForm}>
              + افزودن شبا
            </button>
          </div>
          {shebaForm && (
            <form className="inline-form" onSubmit={addSheba} aria-label="افزودن شبا" noValidate>
              <input className="input" name="title" placeholder="نام بانک و حساب" />
              <input
                className="input"
                name="sheba"
                dir="ltr"
                placeholder="IR00 0000 0000 0000 0000 0000 00"
                aria-invalid={Boolean(shebaError)}
                aria-describedby="sheba-error"
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ minHeight: 44 }}>
                ثبت
              </button>
              {shebaError && (
                <div id="sheba-error" className="field-error" style={{ flexBasis: '100%' }}>
                  {shebaError}
                </div>
              )}
            </form>
          )}
          <div className="rows">
            {accounts.map((a, i) => (
              <div key={a.title + i} className="row">
                <span className="logo-slot">[لوگو]</span>
                <div className="row-main">
                  <div className="row-title">{a.title}</div>
                  <div className="row-sub ltr" style={{ textAlign: 'right' }}>
                    {a.sheba}
                  </div>
                </div>
                <span className={`badge badge-sm ${i < INITIAL_ACCOUNTS.length ? 'badge-green' : 'badge-blue'}`}>
                  {i < INITIAL_ACCOUNTS.length ? 'تأییدشده' : 'در حال استعلام'}
                </span>
              </div>
            ))}
          </div>
          <p className="card-note">برداشت از کیف پول کسب‌وکار فقط به حساب‌هایی ممکن است که به نام صاحب کسب‌وکار ثبت شده باشند.</p>
        </section>
      </div>
      {toast}
    </div>
  );
}
