import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Logo from '../components/Logo';
import { isValidSheba } from '../lib/cash';
import { fa } from '../lib/format';
import { STORE } from '../lib/store';
import { quoteSupplierPayment } from '../lib/supplier';
import { isValidMobile, isValidNationalCode } from '../lib/validation';

// Public page a supplier lands on from the SMS invitation sent by a merchant.
export default function SupplierJoin() {
  const [params] = useSearchParams();
  const supplier = params.get('name') || '[نام تأمین‌کننده]';
  const invoice = Number(params.get('amount')) || 38_000_000;
  const days = Number(params.get('days')) || 30;
  const q = quoteSupplierPayment(invoice, days);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!isValidNationalCode(String(d.get('nationalCode')))) next.nationalCode = 'کد ملی معتبر نیست.';
    if (!isValidMobile(String(d.get('mobile')))) next.mobile = 'شماره موبایل معتبر نیست.';
    if (!isValidSheba(String(d.get('sheba')))) next.sheba = 'شماره شبا معتبر نیست.';
    if (!d.get('agree')) next.agree = 'برای ادامه باید شرایط را بپذیرید.';
    setErrors(next);
    if (Object.keys(next).length === 0) setDone(true);
  };

  return (
    <div className="pub">
      <header className="signup-bar">
        <div className="pub-header-inner">
          <Logo />
          <span className="badge badge-gold">صفحه نمونه دعوت تأمین‌کننده</span>
        </div>
      </header>

      <main className="join">
        <section className="join-offer">
          <span className="badge badge-blue">دعوت از طرف {STORE.name}</span>
          <h1>
            {supplier}، پول فاکتورتان را <span className="join-hl">همین امروز</span> بگیرید.
          </h1>
          <p>
            {STORE.name} فاکتور شما را تأیید کرده است. به‌جای {fa(days)} روز انتظار، با عضویت رایگان در شبکه دیجی‌پی مبلغ را همین امروز در کیف پول
            کسب‌وکار خود دریافت کنید.
          </p>
          <div className="join-numbers">
            <div>
              <span>مبلغ فاکتور</span>
              <strong>{fa(q.invoice)} تومان</strong>
            </div>
            <div>
              <span>کارمزد دریافت زودهنگام</span>
              <strong className="ltr">−{fa(q.discount)}</strong>
            </div>
            <div className="join-total">
              <span>دریافتی شما، امروز</span>
              <strong>{fa(q.supplierReceives)} تومان</strong>
            </div>
          </div>
          <ul className="checklist">
            <li>عضویت و کیف پول کسب‌وکار رایگان</li>
            <li>بدون وثیقه، ضامن یا مراجعه حضوری</li>
            <li>پرداخت‌های بعدی خریداران عضو شبکه هم آنی به شما می‌رسد</li>
          </ul>
        </section>

        <section className="card join-form">
          {done ? (
            <div className="grid" style={{ gap: 14 }}>
              <span className="badge badge-green" style={{ alignSelf: 'flex-start' }}>
                عضویت ثبت شد
              </span>
              <h2 className="card-title" style={{ fontSize: 22 }}>
                {fa(q.supplierReceives)} تومان در راه کیف پول شماست
              </h2>
              <p className="muted" style={{ lineHeight: 1.9 }}>
                پس از تأیید اطلاعات (معمولاً چند دقیقه)، مبلغ به کیف پول کسب‌وکار شما واریز می‌شود و پیامک تأیید می‌گیرید.
              </p>
              <Link to="/" className="btn btn-secondary">
                آشنایی با دیجی‌پی بیزینس
              </Link>
            </div>
          ) : (
            <form className="grid" style={{ gap: 16 }} onSubmit={submit} noValidate>
              <h2 className="card-title">عضویت و دریافت وجه</h2>
              {(
                [
                  ['nationalCode', 'کد ملی صاحب کسب‌وکار', '0012345678', 'numeric'],
                  ['mobile', 'موبایل (به نام خودتان)', '0912 345 6789', 'tel'],
                  ['sheba', 'شبا برای برداشت', 'IR00 0000 0000 0000 0000 0000 00', 'text'],
                ] as const
              ).map(([name, label, ph, mode]) => (
                <div key={name} className="field">
                  <label className="field-label" htmlFor={`j-${name}`}>
                    {label}
                  </label>
                  <input id={`j-${name}`} name={name} className="input" dir="ltr" inputMode={mode} placeholder={ph} aria-invalid={Boolean(errors[name])} />
                  {errors[name] && <span className="field-error">{errors[name]}</span>}
                </div>
              ))}
              <label className="option-card">
                <input type="checkbox" name="agree" />
                <span>
                  با دریافت زودهنگام و کسر کارمزد موافقم.
                  <small>مطالبه این فاکتور به دیجی‌پی منتقل می‌شود و {STORE.name} مبلغ کامل آن را در سررسید به دیجی‌پی می‌پردازد.</small>
                </span>
              </label>
              {errors.agree && <span className="field-error">{errors.agree}</span>}
              <button type="submit" className="btn btn-primary btn-lg">
                عضویت و دریافت {fa(q.supplierReceives)} تومان
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
