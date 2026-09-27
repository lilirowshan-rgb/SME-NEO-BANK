import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Chips from '../components/Chips';
import StatCard from '../components/StatCard';
import { useToast } from '../components/useToast';
import { PERIODS, profitAndLoss, type Period } from '../lib/accounting';
import { fa, faDec, faDigits, faSigned } from '../lib/format';

/** One decimal only when needed: 3844 → «۳٬۸۴۴», 3775.8 → «۳٬۷۷۵٫۸». */
const num = (n: number) => (Number.isInteger(n) ? fa(n) : faDec(n));
const signed = (n: number) => faSigned(n, Number.isInteger(n) ? 0 : 1);

interface Review {
  id: number;
  title: string;
  date: string;
  category: string;
  amount: number;
  receipt?: string;
}

const INITIAL_REVIEWS: Review[] = [
  { id: 1, title: 'کارت کسب‌وکار · دیجی‌استایل', date: '۴ مهر', category: 'تبلیغات', amount: -12_000_000 },
  { id: 2, title: 'انتقال به کارت ۶۰۳۷••••۱۱۹۰', date: '۳ مهر', category: 'حقوق (پاداش)', amount: -8_500_000 },
  { id: 3, title: 'کارت کسب‌وکار · لوازم‌التحریر پارسا', date: '۲ مهر', category: 'ملزومات اداری', amount: -1_840_000 },
  { id: 4, title: 'برداشت از کیف پول · [نام تأمین‌کننده]', date: '۱ مهر', category: 'بهای کالا', amount: -45_000_000 },
  { id: 5, title: 'کارت کسب‌وکار · اسنپ', date: '۱ مهر', category: 'ارسال', amount: -680_000 },
];

interface SaleInvoice {
  buyer: string;
  number: string;
  due: string;
  amount: number;
  paid: boolean;
}

const INITIAL_INVOICES: SaleInvoice[] = [
  { buyer: 'شرکت آروین تجارت', number: '2017', due: '۱۵ مهر', amount: 86_400_000, paid: false },
  { buyer: 'فروشگاه نیک‌کالا', number: '2015', due: '۱ مهر', amount: 34_900_000, paid: true },
];

export default function Accounting() {
  const [period, setPeriod] = useState<Period>('quarter');
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [invoiceForm, setInvoiceForm] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const attachFor = useRef<number | null>(null);
  const { show, toast } = useToast();

  const p = profitAndLoss(PERIODS[period].scale);
  const cogs = p.expenses[0].amount;
  const breakdown = p.expenses.filter((e) => e.key !== 'other').sort((a, b) => b.amount - a.amount);
  const maxExpense = breakdown[0].amount;

  const exportCsv = () => {
    const rows = [
      ['شرح', 'مبلغ (میلیون تومان)'],
      ['فروش ناخالص', p.gross],
      ['مرجوعی‌ها', -p.returns],
      ['فروش خالص', p.net],
      ...p.expenses.map((e) => [e.pnlLabel, -e.amount]),
      ['سود خالص پیش از مالیات', p.profit],
    ];
    const csv = '﻿' + rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `profit-and-loss-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const attach = (id: number) => {
    attachFor.current = id;
    fileInput.current?.click();
  };

  const onFile = (file: File | undefined) => {
    const id = attachFor.current;
    if (!file || id === null) return;
    setReviews((list) => list.map((r) => (r.id === id ? { ...r, receipt: file.name } : r)));
    show(`رسید «${file.name}» پیوست شد`);
    if (fileInput.current) fileInput.current.value = '';
  };

  const addInvoice = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const buyer = String(data.get('buyer')).trim();
    const amount = Number(data.get('amount'));
    if (!buyer || !(amount > 0)) return;
    const number = String(Math.max(...invoices.map((i) => Number(i.number))) + 1);
    setInvoices((list) => [{ buyer, number, due: '۳۰ مهر', amount, paid: false }, ...list]);
    setInvoiceForm(false);
    show(`فاکتور ${faDigits(number)} صادر و به سامانه مودیان ارسال شد`);
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">حسابداری</h1>
          <p className="page-subtitle">هر فروش، کارمزد و پرداخت به‌صورت خودکار ثبت و دسته‌بندی می‌شود.</p>
        </div>
        <div className="page-actions">
          <span className="badge badge-gold">داده‌های نمونه</span>
          <button type="button" className="btn btn-secondary" onClick={exportCsv}>
            خروجی برای حسابدار
          </button>
          <button type="button" className="btn btn-primary" onClick={() => setInvoiceForm(true)}>
            + صدور فاکتور فروش
          </button>
        </div>
      </header>

      <Chips
        label="دوره"
        value={period}
        onChange={setPeriod}
        options={(Object.keys(PERIODS) as Period[]).map((k) => ({ value: k, label: PERIODS[k].label }))}
      />

      <div className="grid grid-4">
        <StatCard label="فروش خالص" value={faDec(p.net)} unit="میلیون تومان" foot={<span style={{ fontWeight: 500 }}>{fa(PERIODS[period].prevGrowth)}٪ بیشتر از دوره قبل</span>} />
        <StatCard label="کل هزینه‌ها" value={faDec(p.totalExpenses)} unit="میلیون تومان" foot={<span style={{ fontWeight: 500 }}>{fa(Math.floor((cogs / p.totalExpenses) * 100))}٪ آن بهای کالا</span>} />
        <StatCard dark label="سود خالص" value={faDec(p.profit)} unit="میلیون تومان" foot={<span className="tone-green">پیش از مالیات</span>} />
        <StatCard label="حاشیه سود" value={`${faDec(p.margin)}٪`} foot={<span style={{ fontWeight: 500 }}>میانگین صنف: ۱۲٪</span>} />
      </div>

      <div className="grid grid-main-side">
        <section className="card">
          <div className="card-head">
            <h2 className="card-title">صورت سود و زیان</h2>
            <span className="card-note">میلیون تومان · {PERIODS[period].caption}</span>
          </div>
          <div>
            <div className="kv">
              <span>فروش ناخالص</span>
              <strong>{num(p.gross)}</strong>
            </div>
            <div className="kv">
              <span>مرجوعی‌ها</span>
              <strong className="ltr">{signed(-p.returns)}</strong>
            </div>
            <div className="kv kv-total" style={{ borderTopWidth: 1 }}>
              <span>فروش خالص</span>
              <strong>{faDec(p.net)}</strong>
            </div>
            {p.expenses.map((e) => (
              <div key={e.key} className="kv">
                <span>{e.pnlLabel}</span>
                <strong className="ltr">{signed(-e.amount)}</strong>
              </div>
            ))}
            <div className="kv kv-total">
              <span>سود خالص پیش از مالیات</span>
              <strong className="tone-green">{faDec(p.profit)}</strong>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">هزینه‌ها به تفکیک دسته</h2>
          <div className="grid" style={{ gap: 16 }}>
            {breakdown.map((e) => (
              <div key={e.key} className="field">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span>{e.label}</span>
                  <span>
                    <strong>{num(e.amount)}</strong>{' '}
                    <span className="muted">({faDec((e.amount / p.totalExpenses) * 100)}٪)</span>
                  </span>
                </div>
                <div className="progress" aria-hidden="true">
                  <div style={{ width: `${(e.amount / maxExpense) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="info-box">
            کارمزدهای تسویه زودهنگام و سود وام به‌طور خودکار به‌عنوان هزینه مالی ثبت می‌شوند و در اظهارنامه قابل استفاده‌اند.
          </div>
        </section>
      </div>

      <div className="grid grid-main-side">
        <section className="card">
          <div className="card-head">
            <h2 className="card-title">نیاز به بررسی</h2>
            <span className="card-note">{fa(reviews.length)} تراکنش منتظر تأیید</span>
          </div>
          <input ref={fileInput} type="file" accept="image/*,application/pdf" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          <div className="rows">
            {reviews.map((r) => (
              <div key={r.id} className="row">
                <div className="row-main" style={{ minWidth: 220 }}>
                  <div className="row-title">{r.title}</div>
                  <div className="row-sub">
                    {r.date} · پیشنهاد دسته: <strong style={{ color: 'var(--text)' }}>{r.category}</strong>
                    {r.receipt && <> · رسید: {r.receipt}</>}
                  </div>
                </div>
                <div className="row-actions">
                <div className="row-amount ltr">{faSigned(r.amount)}</div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => attach(r.id)}>
                  {r.receipt ? 'تغییر رسید' : 'پیوست رسید'}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setReviews((list) => list.filter((x) => x.id !== r.id));
                    show(`در دسته «${r.category}» ثبت شد`);
                  }}
                >
                  تأیید
                </button>
                </div>
              </div>
            ))}
            {reviews.length === 0 && <p className="muted" style={{ padding: '14px 0' }}>همه تراکنش‌ها بررسی شده‌اند.</p>}
          </div>
        </section>

        <div className="grid">
          <section className="card">
            <h2 className="card-title">فاکتورهای فروش عمده</h2>
            {invoiceForm && (
              <form className="inline-form" onSubmit={addInvoice} aria-label="صدور فاکتور فروش">
                <input className="input" name="buyer" placeholder="نام خریدار" required />
                <input className="input" name="amount" type="number" min={1} placeholder="مبلغ (تومان)" required />
                <button type="submit" className="btn btn-primary btn-sm" style={{ minHeight: 44 }}>
                  صدور
                </button>
                <button type="button" className="btn btn-secondary btn-sm" style={{ minHeight: 44 }} onClick={() => setInvoiceForm(false)}>
                  انصراف
                </button>
              </form>
            )}
            <div className="rows">
              {invoices.map((inv) => (
                <div key={inv.number} className="row">
                  <div className="row-main">
                    <div className="row-title">{inv.buyer}</div>
                    <div className="row-sub">
                      فاکتور {faDigits(inv.number)} · سررسید {inv.due}
                    </div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div className="row-amount">{fa(inv.amount)}</div>
                    <div className={`row-sub ${inv.paid ? 'tone-green' : 'tone-orange'}`} style={{ fontWeight: 700 }}>
                      {inv.paid ? 'پرداخت‌شده' : 'پرداخت‌نشده'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-dark btn-sm" onClick={() => show('لینک پرداخت برای خریداران پرداخت‌نشده ارسال شد')}>
                ارسال لینک پرداخت
              </button>
              <Link to="/tax" className="btn btn-secondary btn-sm">
                وضعیت در سامانه مودیان
              </Link>
            </div>
          </section>

          <section className="card card-dark">
            <h2 className="card-title">دسترسی حسابدار</h2>
            <p style={{ fontSize: 14, lineHeight: 1.9, color: 'var(--muted-on-navy)' }}>
              حسابدارتان با دسترسی فقط‌خواندنی، دفاتر، رسیدها و گزارش‌ها را می‌بیند؛ بدون امکان برداشت یا انتقال وجه.
            </p>
            <button type="button" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => show('دعوت‌نامه برای حسابدار ارسال شد')}>
              دعوت از حسابدار
            </button>
          </section>
        </div>
      </div>
      {toast}
    </div>
  );
}
