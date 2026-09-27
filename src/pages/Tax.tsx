import { useState } from 'react';
import Chips from '../components/Chips';
import StatCard from '../components/StatCard';
import { useToast } from '../components/useToast';
import { fa, faDigits } from '../lib/format';

type Status = 'approved' | 'pending' | 'rejected';
type Filter = 'all' | Status;

interface Invoice {
  id: string;
  buyer: string;
  type: 'نوع اول' | 'نوع دوم';
  amount: number;
  status: Status;
  error?: string;
}

const INITIAL_INVOICES: Invoice[] = [
  { id: '1405-2018', buyer: 'مصرف‌کننده نهایی', type: 'نوع دوم', amount: 4_850_000, status: 'approved' },
  { id: '1405-2017', buyer: 'شرکت آروین تجارت', type: 'نوع اول', amount: 86_400_000, status: 'rejected', error: 'شناسه ملی خریدار نامعتبر است' },
  { id: '1405-2016', buyer: 'مصرف‌کننده نهایی', type: 'نوع دوم', amount: 12_200_000, status: 'pending' },
  { id: '1405-2015', buyer: 'فروشگاه نیک‌کالا', type: 'نوع اول', amount: 34_900_000, status: 'approved' },
  { id: '1405-2014', buyer: 'مصرف‌کننده نهایی', type: 'نوع دوم', amount: 2_180_000, status: 'rejected', error: 'کد کالا با شناسه عمومی مطابقت ندارد' },
  { id: '1405-2013', buyer: 'مصرف‌کننده نهایی', type: 'نوع دوم', amount: 6_750_000, status: 'approved' },
];

const STATUS_LABEL: Record<Status, { label: string; className: string }> = {
  approved: { label: 'تأییدشده', className: 'badge-green' },
  pending: { label: 'در انتظار', className: 'badge-blue' },
  rejected: { label: 'رد شده', className: 'badge-red' },
};

const VAT = { taxableSales: 3_420_000_000, salesTax: 342_000_000, purchaseCredit: 295_800_000 };

const CALENDAR = [
  { date: '۱۵ مهر', title: 'اظهارنامه و پرداخت ارزش افزوده تابستان', urgent: true },
  { date: '۳۰ مهر', title: 'مالیات حقوق شهریور کارکنان' },
  { date: '۱۵ دی', title: 'اظهارنامه ارزش افزوده پاییز' },
];

const SERVICES = [
  { title: 'ثبت‌نام در سامانه مودیان', text: 'دریافت شناسه یکتای حافظه مالیاتی و معرفی شرکت معتمد، بدون مراجعه حضوری.' },
  { title: 'صدور و ارسال خودکار', text: 'هر سفارش دیجی‌کالا و هر پرداخت دیجی‌پی، خودکار به صورتحساب الکترونیکی تبدیل می‌شود.' },
  { title: 'اصلاح، ابطال و برگشت از فروش', text: 'صورتحساب‌های ردشده با دلیل رد نمایش داده می‌شوند و با یک کلیک اصلاح می‌شوند.' },
  { title: 'گزارش فصلی و مشاوره', text: 'پیش‌نویس اظهارنامه ارزش افزوده و دسترسی به مشاور مالیاتی [هزینه: X].' },
];

export default function Tax() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [filter, setFilter] = useState<Filter>('all');
  const [paid, setPaid] = useState(false);
  const { show, toast } = useToast();

  const payable = VAT.salesTax - VAT.purchaseCredit;
  const visible = invoices.filter((i) => filter === 'all' || i.status === filter);

  const resubmit = (id: string) => {
    setInvoices((list) => list.map((i) => (i.id === id ? { ...i, status: 'pending', error: undefined } : i)));
    show(`صورتحساب ${faDigits(id)} اصلاح و دوباره ارسال شد`);
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">مالیات و سامانه مودیان</h1>
          <p className="page-subtitle">
            صورتحساب هر فروش به‌صورت خودکار صادر و از طریق [شرکت معتمد مالیاتی همکار] به سامانه مودیان ارسال می‌شود.
          </p>
        </div>
        <span className="badge badge-gold">داده‌های نمونه</span>
      </header>

      <div className="grid grid-4">
        <StatCard
          label="شناسه یکتای حافظه مالیاتی"
          value={<span className="ltr">A1B2C3</span>}
          foot={
            <span className="tone-green" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              <span className="status-dot" /> فعال و متصل
            </span>
          }
        />
        <StatCard label="صورتحساب‌های تابستان" value={fa(1842)} foot={<span style={{ fontWeight: 500 }}>۱٬۸۱۲ تأیید · ۲۲ در انتظار · ۸ رد</span>} />
        <StatCard label="سقف معاملات فصل" value="۶۲٪" unit="استفاده‌شده">
          <div className="progress" role="progressbar" aria-valuenow={62} aria-valuemin={0} aria-valuemax={100} aria-label="سقف معاملات فصل">
            <div style={{ width: '62%' }} />
          </div>
        </StatCard>
        <StatCard
          dark
          label="ارزش افزوده قابل پرداخت"
          value={paid ? '۰' : fa(payable)}
          unit="تومان"
          foot={paid ? <span className="tone-green">پرداخت شد</span> : 'مهلت: ۱۵ مهر (۱۰ روز دیگر)'}
        />
      </div>

      <div className="grid grid-main-side">
        <section className="card">
          <div className="card-head">
            <h2 className="card-title">صورتحساب‌های الکترونیکی</h2>
            <Chips
              size="sm"
              label="فیلتر وضعیت"
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: 'همه' },
                { value: 'approved', label: 'تأییدشده' },
                { value: 'pending', label: 'در انتظار' },
                { value: 'rejected', label: 'رد شده' },
              ]}
            />
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>شماره</th>
                  <th>خریدار</th>
                  <th>نوع صورتحساب</th>
                  <th>مبلغ (تومان)</th>
                  <th>وضعیت</th>
                  <th>
                    <span className="sr-only">اقدام</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((inv) => (
                  <tr key={inv.id}>
                    <td className="muted">{faDigits(inv.id)}</td>
                    <td>
                      <strong>{inv.buyer}</strong>
                      {inv.error && <div className="tone-red" style={{ fontSize: 12, marginTop: 4 }}>{inv.error}</div>}
                    </td>
                    <td className="muted">{inv.type}</td>
                    <td className="num">{fa(inv.amount)}</td>
                    <td>
                      <span className={`badge badge-sm ${STATUS_LABEL[inv.status].className}`}>{STATUS_LABEL[inv.status].label}</span>
                    </td>
                    <td>
                      {inv.status === 'rejected' && (
                        <button type="button" className="btn btn-dark btn-sm" onClick={() => resubmit(inv.id)}>
                          اصلاح و ارسال
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={6} className="muted" style={{ textAlign: 'center' }}>
                      صورتحسابی با این وضعیت نیست.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="card-note">نوع اول: با مشخصات خریدار (فروش به کسب‌وکار). نوع دوم: بدون مشخصات خریدار (فروش به مصرف‌کننده نهایی).</p>
        </section>

        <div className="grid">
          <section className="card">
            <h2 className="card-title">خلاصه ارزش افزوده تابستان ۱۴۰۵</h2>
            <div>
              <div className="kv">
                <span>فروش مشمول</span>
                <strong>{fa(VAT.taxableSales)}</strong>
              </div>
              <div className="kv">
                <span>مالیات فروش (۱۰٪)</span>
                <strong>{fa(VAT.salesTax)}</strong>
              </div>
              <div className="kv">
                <span>اعتبار مالیاتی خرید</span>
                <strong className="ltr">−{fa(VAT.purchaseCredit)}</strong>
              </div>
              <div className="kv kv-total">
                <span>خالص قابل پرداخت</span>
                <strong>{fa(payable)}</strong>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-lg btn-block"
              disabled={paid}
              onClick={() => {
                setPaid(true);
                show('ارزش افزوده تابستان از کیف پول «ذخیره مالیات» پرداخت شد');
              }}
            >
              {paid ? 'پرداخت شد' : 'پرداخت از کیف پول'}
            </button>
            <p className="card-note">از کیف پول «ذخیره مالیات» (موجودی ۶۵ میلیون)</p>
          </section>

          <section className="card">
            <h2 className="card-title">تقویم مالیاتی</h2>
            <div className="rows">
              {CALENDAR.map((c) => (
                <div key={c.date} className="row" style={{ justifyContent: 'space-between' }}>
                  <strong className={c.urgent ? 'tone-red' : ''} style={{ minWidth: 56 }}>
                    {c.date}
                  </strong>
                  <span className="row-main" style={{ fontSize: 15 }}>
                    {c.title}
                  </span>
                </div>
              ))}
            </div>
            <p className="card-note">[تاریخ‌ها باید با تقویم رسمی سازمان امور مالیاتی تطبیق داده شود]</p>
          </section>
        </div>
      </div>

      <section className="card">
        <h2 className="card-title">خدمات مالیاتی</h2>
        <div className="grid grid-4">
          {SERVICES.map((s) => (
            <div key={s.title} className="tile">
              <div className="tile-title">{s.title}</div>
              <div className="tile-text">{s.text}</div>
            </div>
          ))}
        </div>
      </section>
      {toast}
    </div>
  );
}
