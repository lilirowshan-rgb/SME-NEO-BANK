import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fa, toLatinDigits } from '../lib/format';
import {
  AMOUNT_STEP_MILLION,
  ANNUAL_RATE_PERCENT,
  INSTALLMENT_DATES,
  MAX_AMOUNT_MILLION,
  MIN_AMOUNT_MILLION,
  REPAYMENT_METHODS,
  TERM_OPTIONS,
  quoteLoan,
  type RepaymentMethod,
} from '../lib/loan';

type Step = 1 | 2 | 3 | 4;

const STEP_NAMES = ['پیشنهاد', 'تأیید اطلاعات', 'امضای قرارداد', 'واریز'];
const SCHEDULE_PREVIEW = 4;
const OTP_LENGTH = 5;

export default function LoanPage() {
  const [step, setStep] = useState<Step>(1);
  const [amount, setAmount] = useState(600);
  const [term, setTerm] = useState(6);
  const [method, setMethod] = useState<RepaymentMethod>('auto');
  const [consent, setConsent] = useState(false);
  const [otp, setOtp] = useState('');

  const quote = quoteLoan(amount * 1e6, term);
  const methodTitle = REPAYMENT_METHODS.find((m) => m.id === method)!.title;
  const termFa = `${fa(term)} ماه`;
  const amountFull = fa(quote.principal);

  const next = () => setStep((s) => Math.min(4, s + 1) as Step);
  const back = () => setStep((s) => Math.max(1, s - 1) as Step);
  const restart = () => {
    setStep(1);
    setConsent(false);
    setOtp('');
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">وام و اعتبار</h1>
          <div className="page-subtitle">پیشنهادها بر اساس سابقه فروش شما در دیجی‌کالا و دیجی‌پی محاسبه شده‌اند.</div>
        </div>
        <span className="badge badge-gold">نرخ‌ها و اعداد نمونه</span>
      </header>

      <ol aria-label="مراحل دریافت وام" className="stepper">
        {STEP_NAMES.map((label, i) => {
          const n = i + 1;
          const state = n === step ? 'current' : n < step ? 'done' : 'todo';
          return (
            <li key={label} className={`stepper-item stepper-${state}`} aria-current={n === step ? 'step' : undefined}>
              <div className="stepper-bar" />
              <div className="stepper-label">
                {fa(n)}. {label}
              </div>
            </li>
          );
        })}
      </ol>

      {step === 1 && (
        <>
          <div className="offer-grid">
            <section className="card offer-config">
              <div className="preapproved">
                <div className="preapproved-text">
                  <div className="preapproved-for">پیش‌تأییدشده برای [نام فروشگاه]</div>
                  <div className="preapproved-amount">تا ۸۵۰ میلیون تومان</div>
                  <div className="preapproved-basis">بر اساس ۳۰ ماه سابقه فروش · امتیاز اعتباری ۷۴۲</div>
                </div>
                <Link to="/sales" className="preapproved-upsell">
                  با اتصال حساب بانکی و سامانه مودیان، سقف تا <strong>۱٫۸۵ میلیارد</strong> افزایش می‌یابد ←
                </Link>
              </div>

              <div className="loan-field">
                <div className="amount-row">
                  <label htmlFor="amt" className="field-title">
                    مبلغ وام
                  </label>
                  <div className="amount-value">
                    {fa(amount)} <span>میلیون تومان</span>
                  </div>
                </div>
                <input
                  id="amt"
                  type="range"
                  className="amount-slider"
                  min={MIN_AMOUNT_MILLION}
                  max={MAX_AMOUNT_MILLION}
                  step={AMOUNT_STEP_MILLION}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
                <div className="amount-range">
                  <span>{fa(MIN_AMOUNT_MILLION)} میلیون</span>
                  <span>{fa(MAX_AMOUNT_MILLION)} میلیون</span>
                </div>
              </div>

              <div className="loan-field">
                <div className="field-title">مدت بازپرداخت</div>
                <div className="choice-grid choice-grid-3">
                  {TERM_OPTIONS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="term-pill"
                      aria-pressed={t === term}
                      onClick={() => setTerm(t)}
                    >
                      {fa(t)} ماه
                    </button>
                  ))}
                </div>
              </div>

              <div className="loan-field">
                <div className="field-title">روش بازپرداخت</div>
                <div className="choice-grid choice-grid-2">
                  {REPAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className="method-card"
                      aria-pressed={m.id === method}
                      onClick={() => setMethod(m.id)}
                    >
                      <span className="method-title">{m.title}</span>
                      <span className="method-sub">{m.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <div className="offer-side">
              <section className="card summary">
                <h2 className="card-title">خلاصه وام</h2>
                <div className="summary-row">
                  <span>مبلغ دریافتی</span>
                  <strong>{amountFull} تومان</strong>
                </div>
                <div className="summary-row">
                  <span>قسط ماهانه ({fa(term)} قسط)</span>
                  <strong>{fa(quote.installment)} تومان</strong>
                </div>
                <div className="summary-row">
                  <span>نرخ سود سالانه</span>
                  <strong>{fa(ANNUAL_RATE_PERCENT)}٪ [تأیید شود]</strong>
                </div>
                <div className="summary-row">
                  <span>کارمزد اعطا (۱٪)</span>
                  <strong>{fa(quote.fee)} تومان</strong>
                </div>
                <div className="summary-row summary-total">
                  <span>جمع بازپرداخت</span>
                  <strong>{fa(quote.totalRepayment)} تومان</strong>
                </div>
                <button type="button" className="btn btn-primary btn-apply" onClick={() => setStep(2)}>
                  درخواست این وام
                </button>
                <div className="summary-note">بدون وثیقه و ضامن · واریز به کیف پول کسب‌وکار</div>
              </section>

              <section className="card schedule">
                <h2 className="card-title">جدول اقساط</h2>
                {INSTALLMENT_DATES.slice(0, Math.min(term, SCHEDULE_PREVIEW)).map((date) => (
                  <div key={date} className="schedule-row">
                    <span>{date}</span>
                    <span>{fa(quote.installment)} تومان</span>
                  </div>
                ))}
                {term > SCHEDULE_PREVIEW && (
                  <div className="schedule-more">و {fa(term - SCHEDULE_PREVIEW)} قسط دیگر</div>
                )}
              </section>
            </div>
          </div>

          <section className="card">
            <h2 className="card-title">سایر راه‌های تأمین مالی</h2>
            <div className="alt-grid">
              <div className="alt-card">
                <div className="alt-head">
                  <div className="alt-title">کارت اعتباری کسب‌وکار</div>
                  <span className="alt-active">فعال</span>
                </div>
                <div className="alt-body">سقف ۳۰۰ میلیون · ۱۱۲ میلیون استفاده‌شده · سررسید ۱ آبان</div>
              </div>
              <div className="alt-card">
                <div className="alt-title">خرید اقساطی کالا</div>
                <div className="alt-body">تا ۴۰۰ میلیون · بازپرداخت از محل تسویه‌ها</div>
                <Link to="/#services" className="alt-link">
                  جزئیات ←
                </Link>
              </div>
              <div className="alt-card">
                <div className="alt-title">تسویه زودهنگام</div>
                <div className="alt-body">۲۳۸ میلیون فروش در انتظار تسویه، بدون نیاز به وام</div>
                <Link to="/dashboard" className="alt-link">
                  دریافت همین امروز ←
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {step === 2 && (
        <section className="card flow-card">
          <h2 className="flow-title">تأیید اطلاعات</h2>
          <div className="flow-text">
            این اطلاعات از پروفایل و شبکه شما خوانده شده است. اگر چیزی تغییر کرده، پیش از ادامه آن را در{' '}
            <Link to="/profile">پروفایل</Link> به‌روز کنید.
          </div>
          <div className="facts-grid">
            <div className="fact">
              <div className="fact-label">وام درخواستی</div>
              <div className="fact-value">
                {amountFull} تومان · {termFa}
              </div>
            </div>
            <div className="fact">
              <div className="fact-label">روش بازپرداخت</div>
              <div className="fact-value">{methodTitle}</div>
            </div>
            <div className="fact">
              <div className="fact-label">میانگین فروش ماهانه (۶ ماه)</div>
              <div className="fact-value">۱٫۰۲ میلیارد تومان</div>
            </div>
            <div className="fact">
              <div className="fact-label">حساب واریز</div>
              <div className="fact-value">کیف پول کسب‌وکار</div>
            </div>
          </div>
          <label className="consent">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>اطلاعات بالا را تأیید می‌کنم و با استعلام اعتباری موافقم.</span>
          </label>
          <div className="flow-actions">
            <button type="button" className="btn btn-secondary" onClick={back}>
              مرحله قبل
            </button>
            <button type="button" className="btn btn-primary" onClick={next} disabled={!consent}>
              ادامه به قرارداد
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="card flow-card">
          <h2 className="flow-title">امضای دیجیتال قرارداد</h2>
          <div className="contract" tabIndex={0}>
            [متن قرارداد تسهیلات: طرفین، مبلغ {amountFull} تومان، مدت {termFa}، نرخ سود، کارمزد، جدول اقساط، شرایط
            دیرکرد و تسویه پیش از موعد. متن نهایی باید توسط تیم حقوقی تهیه شود.]
          </div>
          <label className="otp-field">
            <span>کد امضای ارسال‌شده به موبایل</span>
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              dir="ltr"
              placeholder="• • • • •"
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={(e) => setOtp(toLatinDigits(e.target.value).replace(/\D/g, ''))}
            />
          </label>
          <div className="flow-actions">
            <button type="button" className="btn btn-secondary" onClick={back}>
              مرحله قبل
            </button>
            <button type="button" className="btn btn-primary" onClick={next} disabled={otp.length !== OTP_LENGTH}>
              امضا و دریافت وام
            </button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="card done-card">
          <div className="done-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </div>
          <h2 className="done-title">{amountFull} تومان واریز شد</h2>
          <p className="done-text">
            مبلغ وام در کیف پول کسب‌وکار شما قرار گرفت. اولین قسط {INSTALLMENT_DATES[0]} است و{' '}
            {method === 'auto' ? 'به‌صورت خودکار از تسویه‌های شما کسر می‌شود.' : 'یادآوری آن را پیامک می‌کنیم.'}
          </p>
          <div className="done-actions">
            <Link to="/dashboard" className="btn btn-primary">
              رفتن به داشبورد
            </Link>
            <Link to="/cash" className="btn btn-secondary">
              برنامه‌ریزی نقدینگی
            </Link>
          </div>
          <button type="button" className="btn-link" onClick={restart}>
            شروع دوباره نمونه
          </button>
        </section>
      )}
    </div>
  );
}
