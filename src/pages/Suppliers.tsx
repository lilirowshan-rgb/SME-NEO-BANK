import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { useToast } from '../components/useToast';
import { fa, faDec, faDigits, toLatinDigits } from '../lib/format';
import { isValidSheba } from '../lib/cash';
import { ANNUAL_DISCOUNT_RATE, TERM_OPTIONS, quoteSupplierPayment } from '../lib/supplier';
import { isValidMobile } from '../lib/validation';

type SupplierStatus = 'member' | 'invited' | 'none';

interface Supplier {
  id: number;
  name: string;
  mobile: string;
  status: SupplierStatus;
}

type RequestStatus = 'awaiting' | 'paid' | 'settled';

interface PaymentRequest {
  id: number;
  supplierId: number;
  invoiceNo: string;
  invoice: number;
  days: number;
  due: string;
  status: RequestStatus;
}

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 1, name: 'پخش کالای آریا', mobile: '09121234567', status: 'member' },
  { id: 2, name: 'تولیدی لوازم خانگی پارس‌تاب', mobile: '09351234567', status: 'member' },
  { id: 3, name: 'بازرگانی نوین‌کالا', mobile: '09191234567', status: 'invited' },
  { id: 4, name: 'کارگاه بسته‌بندی سپید', mobile: '09011234567', status: 'none' },
];

const INITIAL_REQUESTS: PaymentRequest[] = [
  { id: 1, supplierId: 1, invoiceNo: '8841', invoice: 120_000_000, days: 60, due: '۵ آذر', status: 'paid' },
  { id: 2, supplierId: 2, invoiceNo: '3120', invoice: 64_500_000, days: 45, due: '۲۰ آبان', status: 'paid' },
  { id: 3, supplierId: 3, invoiceNo: '1107', invoice: 38_000_000, days: 30, due: '۵ آبان', status: 'awaiting' },
  { id: 4, supplierId: 1, invoiceNo: '8790', invoice: 92_000_000, days: 60, due: '۵ مهر', status: 'settled' },
];

// Due date label for a term starting today (5 Mehr 1405); Mehr, Aban, Azar have 30 days here for simplicity.
function dueLabel(days: number) {
  const months = ['مهر', 'آبان', 'آذر', 'دی'];
  const d = 5 + days;
  return `${fa(((d - 1) % 30) + 1)} ${months[Math.floor((d - 1) / 30)]}`;
}

const SUPPLIER_STATUS: Record<SupplierStatus, { label: string; cls: string }> = {
  member: { label: 'عضو شبکه دیجی‌پی', cls: 'badge-green' },
  invited: { label: 'دعوت‌شده', cls: 'badge-blue' },
  none: { label: 'عضو نیست', cls: 'badge-gray' },
};

const REQUEST_STATUS: Record<RequestStatus, { label: string; cls: string }> = {
  awaiting: { label: 'در انتظار پذیرش تأمین‌کننده', cls: 'badge-orange' },
  paid: { label: 'به تأمین‌کننده پرداخت شد', cls: 'badge-green' },
  settled: { label: 'تسویه‌شده توسط شما', cls: 'badge-gray' },
};

const HOW = [
  { title: 'تأمین‌کننده را اضافه کنید', text: 'اگر عضو شبکه دیجی‌پی نیست، با یک پیامک دعوت می‌شود و در چند دقیقه عضو می‌شود.' },
  { title: 'فاکتور را ثبت و تأیید کنید', text: 'مبلغ فاکتور و مهلت پرداخت خودتان (۳۰ تا ۹۰ روز) را انتخاب کنید.' },
  { title: 'تأمین‌کننده همین امروز پول می‌گیرد', text: 'دیجی‌پی مبلغ فاکتور را با کسر کارمزد پرداخت زودهنگام، همین امروز به تأمین‌کننده می‌پردازد.' },
  { title: 'شما در سررسید کامل می‌پردازید', text: 'در روز سررسید، مبلغ کامل فاکتور را از کیف پول یا تسویه‌هایتان پرداخت می‌کنید؛ بدون سود اضافه برای شما.' },
];

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [addOpen, setAddOpen] = useState(false);
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});
  const [supplierId, setSupplierId] = useState(INITIAL_SUPPLIERS[0].id);
  const [amount, setAmount] = useState(100_000_000);
  const [days, setDays] = useState<number>(60);
  const [invoiceNo, setInvoiceNo] = useState('');
  const { show, toast } = useToast();

  const quote = quoteSupplierPayment(amount > 0 ? amount : 0, days);
  const selected = suppliers.find((s) => s.id === supplierId);
  const byId = (id: number) => suppliers.find((s) => s.id === id)!;
  const joinLink = (s: Supplier) => {
    const r = requests.find((x) => x.supplierId === s.id && x.status === 'awaiting');
    const q = new URLSearchParams({ name: s.name, ...(r ? { amount: String(r.invoice), days: String(r.days) } : {}) });
    return `/join/supplier?${q}`;
  };

  const open = requests.filter((r) => r.status !== 'settled');
  const dueTotal = open.filter((r) => r.status === 'paid').reduce((s, r) => s + r.invoice, 0);
  const paidEarly = requests.filter((r) => r.status !== 'awaiting').reduce((s, r) => s + quoteSupplierPayment(r.invoice, r.days).supplierReceives, 0);
  const members = suppliers.filter((s) => s.status === 'member').length;

  const addSupplier = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name')).trim();
    const mobile = toLatinDigits(String(data.get('mobile'))).replace(/\s/g, '');
    const sheba = String(data.get('sheba') ?? '');
    const invite = data.get('invite') === 'on';
    const errors: Record<string, string> = {};
    if (!name) errors.name = 'نام تأمین‌کننده را وارد کنید.';
    if (!isValidMobile(mobile)) errors.mobile = 'شماره موبایل معتبر نیست.';
    if (sheba.trim() && !isValidSheba(sheba)) errors.sheba = 'شماره شبا معتبر نیست.';
    setAddErrors(errors);
    if (Object.keys(errors).length) return;
    const id = Date.now();
    setSuppliers((list) => [...list, { id, name, mobile, status: invite ? 'invited' : 'none' }]);
    setSupplierId(id);
    setAddOpen(false);
    show(invite ? `پیامک دعوت به شبکه دیجی‌پی برای «${name}» ارسال شد` : `«${name}» اضافه شد`);
  };

  const invite = (s: Supplier) => {
    setSuppliers((list) => list.map((x) => (x.id === s.id ? { ...x, status: 'invited' } : x)));
    show(`پیامک دعوت برای «${s.name}» ارسال شد`);
  };

  // Prototype only: simulates the supplier accepting the invitation / offer.
  const simulateJoin = (s: Supplier) => {
    setSuppliers((list) => list.map((x) => (x.id === s.id ? { ...x, status: 'member' } : x)));
    setRequests((list) => list.map((r) => (r.supplierId === s.id && r.status === 'awaiting' ? { ...r, status: 'paid' } : r)));
    show(`«${s.name}» عضو شبکه شد و پرداخت‌های در انتظارش انجام شد`);
  };

  const submitRequest = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected || !(amount > 0)) return;
    const isMember = selected.status === 'member';
    const req: PaymentRequest = {
      id: Date.now(),
      supplierId: selected.id,
      invoiceNo: invoiceNo.trim() || String(9000 + requests.length),
      invoice: amount,
      days,
      due: dueLabel(days),
      status: isMember ? 'paid' : 'awaiting',
    };
    setRequests((list) => [req, ...list]);
    if (!isMember && selected.status === 'none') setSuppliers((list) => list.map((x) => (x.id === selected.id ? { ...x, status: 'invited' } : x)));
    setInvoiceNo('');
    show(
      isMember
        ? `${fa(quote.supplierReceives)} تومان همین حالا به «${selected.name}» پرداخت شد`
        : `لینک عضویت و دریافت وجه برای «${selected.name}» پیامک شد`,
    );
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">پرداخت به تأمین‌کننده</h1>
          <p className="page-subtitle">تأمین‌کننده‌تان همین امروز پول می‌گیرد؛ شما در سررسید، مبلغ کامل فاکتور را می‌پردازید.</p>
        </div>
        <div className="page-actions">
          <span className="badge badge-gold">داده‌های نمونه</span>
          <button type="button" className="btn btn-primary" onClick={() => setAddOpen((v) => !v)} aria-expanded={addOpen}>
            + افزودن تأمین‌کننده
          </button>
        </div>
      </header>

      {addOpen && (
        <form className="card supplier-form" onSubmit={addSupplier} noValidate aria-label="افزودن تأمین‌کننده">
          <h2 className="card-title">تأمین‌کننده جدید</h2>
          <div className="form-grid-3">
            <div className="field">
              <label className="field-label" htmlFor="sup-name">
                نام شرکت یا شخص
              </label>
              <input id="sup-name" name="name" className="input" aria-invalid={Boolean(addErrors.name)} />
              {addErrors.name && <span className="field-error">{addErrors.name}</span>}
            </div>
            <div className="field">
              <label className="field-label" htmlFor="sup-mobile">
                موبایل
              </label>
              <input id="sup-mobile" name="mobile" className="input" dir="ltr" inputMode="tel" placeholder="0912 345 6789" aria-invalid={Boolean(addErrors.mobile)} />
              {addErrors.mobile && <span className="field-error">{addErrors.mobile}</span>}
            </div>
            <div className="field">
              <label className="field-label" htmlFor="sup-sheba">
                شبا (اختیاری)
              </label>
              <input id="sup-sheba" name="sheba" className="input" dir="ltr" placeholder="IR00 0000 …" aria-invalid={Boolean(addErrors.sheba)} />
              {addErrors.sheba && <span className="field-error">{addErrors.sheba}</span>}
            </div>
          </div>
          <label className="option-card">
            <input type="checkbox" name="invite" defaultChecked />
            <span>
              دعوت به شبکه دیجی‌پی با پیامک
              <small>تأمین‌کننده با عضویت، پرداخت‌ها را آنی در کیف پول کسب‌وکار خودش می‌گیرد و خودش هم می‌تواند از خدمات دیجی‌پی بیزینس استفاده کند.</small>
            </span>
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-primary">
              افزودن
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setAddOpen(false)}>
              انصراف
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-4">
        <StatCard label="بدهی شما در سررسیدها" value={fa(dueTotal)} unit="تومان" foot={<span style={{ fontWeight: 500 }}>نزدیک‌ترین سررسید: ۲۰ آبان</span>} />
        <StatCard label="پرداخت‌شده به تأمین‌کنندگان" value={faDec(paidEarly / 1e6)} unit="میلیون تومان" foot={<span className="tone-green">همه همان روز ثبت فاکتور</span>} />
        <StatCard label="تأمین‌کنندگان عضو شبکه" value={`${fa(members)} از ${fa(suppliers.length)}`} foot={<span style={{ fontWeight: 500 }}>بقیه با پیامک دعوت می‌شوند</span>} />
        <StatCard dark label="سقف پرداخت به تأمین‌کننده" value="۴۰۰" unit="میلیون تومان" foot={`${fa(Math.max(0, 400 - dueTotal / 1e6))} میلیون در دسترس`} />
      </div>

      <div className="grid grid-main-side">
        <section className="card">
          <h2 className="card-title">پرداخت جدید</h2>
          <form className="grid" style={{ gap: 16 }} onSubmit={submitRequest}>
            <div className="form-grid-2">
              <div className="field">
                <label className="field-label" htmlFor="pay-supplier">
                  تأمین‌کننده
                </label>
                <select id="pay-supplier" className="input" value={supplierId} onChange={(e) => setSupplierId(Number(e.target.value))}>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.status === 'member' ? '' : '(عضو نیست)'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field-label" htmlFor="pay-invoice">
                  شماره فاکتور
                </label>
                <input id="pay-invoice" className="input" dir="ltr" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} placeholder="مثلاً 8842" />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="pay-amount">
                  مبلغ فاکتور (تومان)
                </label>
                <input
                  id="pay-amount"
                  className="input"
                  dir="ltr"
                  inputMode="numeric"
                  value={amount ? amount.toLocaleString('en-US') : ''}
                  onChange={(e) => setAmount(Number(toLatinDigits(e.target.value).replace(/\D/g, '')) || 0)}
                />
              </div>
              <div className="field">
                <span className="field-label" id="pay-term-label">
                  مهلت پرداخت شما
                </span>
                <div role="radiogroup" aria-labelledby="pay-term-label" className="chips chips-sm">
                  {TERM_OPTIONS.map((d) => (
                    <button key={d} type="button" role="radio" aria-checked={d === days} className="chip" onClick={() => setDays(d)}>
                      {fa(d)} روز
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flow">
              <div className="flow-step">
                <span className="flow-when">امروز</span>
                <span className="flow-who">«{selected?.name}» دریافت می‌کند</span>
                <strong className="flow-amount tone-green">{fa(quote.supplierReceives)} تومان</strong>
              </div>
              <div className="flow-arrow" aria-hidden="true">
                ←
              </div>
              <div className="flow-step">
                <span className="flow-when">{dueLabel(days)} ({fa(days)} روز دیگر)</span>
                <span className="flow-who">شما می‌پردازید</span>
                <strong className="flow-amount">{fa(quote.merchantPays)} تومان</strong>
              </div>
            </div>
            <div>
              <div className="kv">
                <span>مبلغ فاکتور</span>
                <strong>{fa(quote.invoice)} تومان</strong>
              </div>
              <div className="kv">
                <span>
                  کارمزد پرداخت زودهنگام ({faDec(quote.discountPct)}٪، از سهم تأمین‌کننده)
                </span>
                <strong className="ltr">−{fa(quote.discount)}</strong>
              </div>
              <div className="kv kv-total">
                <span>هزینه اضافه برای شما</span>
                <strong className="tone-green">۰ تومان</strong>
              </div>
            </div>
            {selected && selected.status !== 'member' && (
              <div className="info-box">
                «{selected.name}» هنوز عضو شبکه دیجی‌پی نیست. پس از ثبت، لینک عضویت و دریافت وجه برایش پیامک می‌شود و پرداخت پس از عضویت او انجام می‌شود.
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-lg" disabled={!(amount > 0)}>
              {selected?.status === 'member' ? 'تأیید فاکتور و پرداخت به تأمین‌کننده' : 'ثبت فاکتور و ارسال دعوت'}
            </button>
            <p className="card-note">
              نرخ نمونه: {fa(ANNUAL_DISCOUNT_RATE * 100)}٪ سالانه به نسبت روزهای باقی‌مانده تا سررسید [تأیید شود]. کارمزد از مبلغ پرداختی به تأمین‌کننده کسر می‌شود و شما همان مبلغ فاکتور را می‌پردازید.
            </p>
          </form>
        </section>

        <section className="card">
          <h2 className="card-title">چطور کار می‌کند</h2>
          <ol className="timeline">
            {HOW.map((s, i) => (
              <li key={s.title}>
                <span className="timeline-dot" style={{ background: i === 2 ? 'var(--green)' : 'var(--blue)' }}>
                  {fa(i + 1)}
                </span>
                <div>
                  <div className="timeline-title">{s.title}</div>
                  <div className="timeline-text">{s.text}</div>
                </div>
              </li>
            ))}
          </ol>
          <Link to="/#scf" className="link-arrow">
            تأمین مالی زنجیره تأمین (SCF) چیست؟ ←
          </Link>
        </section>
      </div>

      <div className="grid grid-main-side">
        <section className="card">
          <h2 className="card-title">فاکتورها و پرداخت‌ها</h2>
          <div className="table-wrap">
            <table className="table table-cards">
              <thead>
                <tr>
                  <th>تأمین‌کننده</th>
                  <th>مبلغ فاکتور</th>
                  <th>پرداختی به تأمین‌کننده</th>
                  <th>سررسید شما</th>
                  <th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => {
                  const q = quoteSupplierPayment(r.invoice, r.days);
                  return (
                    <tr key={r.id}>
                      <td className="cell-main">
                        <strong>{byId(r.supplierId).name}</strong>
                        <div className="row-sub">فاکتور {faDigits(r.invoiceNo)} · {fa(r.days)} روزه</div>
                      </td>
                      <td className="num" data-label="مبلغ فاکتور">
                        {fa(r.invoice)}
                      </td>
                      <td className="num tone-green" data-label="پرداختی به تأمین‌کننده">
                        {fa(q.supplierReceives)}
                      </td>
                      <td data-label="سررسید شما">{r.due}</td>
                      <td data-label="وضعیت">
                        <span className={`badge badge-sm ${REQUEST_STATUS[r.status].cls}`}>{REQUEST_STATUS[r.status].label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">تأمین‌کنندگان</h2>
          <div className="rows">
            {suppliers.map((s) => (
              <div key={s.id} className="row">
                <div className="row-main">
                  <div className="row-title">{s.name}</div>
                  <div className="row-sub ltr" style={{ textAlign: 'right' }}>
                    {faDigits(s.mobile)}
                  </div>
                </div>
                <span className={`badge badge-sm ${SUPPLIER_STATUS[s.status].cls}`}>{SUPPLIER_STATUS[s.status].label}</span>
                {s.status === 'none' && (
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => invite(s)}>
                    دعوت
                  </button>
                )}
                {s.status === 'invited' && (
                  <Link to={joinLink(s)} className="btn btn-secondary btn-sm" title="پیش‌نمایش صفحه‌ای که تأمین‌کننده می‌بیند">
                    صفحه دعوت
                  </Link>
                )}
                {s.status === 'invited' && (
                  <button type="button" className="btn-link" onClick={() => simulateJoin(s)} title="فقط در نسخه نمونه">
                    شبیه‌سازی عضویت
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      {toast}
    </div>
  );
}
