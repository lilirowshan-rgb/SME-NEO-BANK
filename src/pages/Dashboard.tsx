import { useState } from 'react';
import { Link } from 'react-router-dom';
import BarChart from '../components/BarChart';
import StatCard from '../components/StatCard';
import { useToast } from '../components/useToast';
import { fa, faDec, faSigned } from '../lib/format';
import { PENDING_SETTLEMENT, SETTLEMENT_OPTIONS, quoteEarlySettlement } from '../lib/settlement';
import { STORE } from '../lib/store';

// Million toman, sample data from the design draft.
const CASHFLOW = [
  { month: 'فروردین', inflow: 820, outflow: 610 },
  { month: 'اردیبهشت', inflow: 910, outflow: 700 },
  { month: 'خرداد', inflow: 1060, outflow: 770 },
  { month: 'تیر', inflow: 980, outflow: 820 },
  { month: 'مرداد', inflow: 1150, outflow: 790 },
  { month: 'شهریور', inflow: 1240, outflow: 880 },
];

const MONEY_PATH = [
  { title: 'مشتری پرداخت می‌کند', text: 'در دیجی‌کالا یا با درگاه دیجی‌پی (نقدی، اقساطی، کیف پول)', color: 'var(--blue)' },
  { title: 'در انتظار تسویه', text: 'حتی اگر مشتری اقساطی خریده باشد، کل مبلغ برای شما ثبت می‌شود', color: 'var(--blue)' },
  { title: 'تسویه عادی، زودهنگام یا آنی', text: 'طبق دوره قرارداد، ظرف ۲۴ ساعت، یا آنی در چند ثانیه با کارمزد', color: 'var(--orange)' },
  { title: 'کیف پول کسب‌وکار', text: 'موجودی قابل خرج با کارت یا انتقال به حساب بانکی', color: 'var(--blue)' },
  { title: 'خرج و برنامه‌ریزی', text: 'تأمین‌کننده، حقوق، قبوض، مالیات و اقساط', color: 'var(--navy)' },
];

const TRANSACTIONS = [
  { title: 'واریز فروش دیجی‌کالا', sub: 'تسویه سفارش‌های ۲۰ تا ۲۵ شهریور', date: '۵ مهر', amount: 48_200_000, tint: 'var(--green-tint)' },
  { title: 'خرید با کارت کسب‌وکار', sub: 'تیپاکس · هزینه ارسال', date: '۴ مهر', amount: -3_450_000, tint: 'var(--orange-tint)' },
  { title: 'پرداخت به تأمین‌کننده', sub: '[نام تأمین‌کننده] · خرید کالا', date: '۳ مهر', amount: -62_000_000, tint: 'var(--orange-tint)' },
  { title: 'واریز درگاه دیجی‌پی', sub: 'فروش سایت · ۱۴۲ تراکنش', date: '۲ مهر', amount: 31_750_000, tint: 'var(--green-tint)' },
];

function Bolt() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  );
}

type Settled = { instant: boolean; received: number } | null;

export default function Dashboard() {
  const [showEarly, setShowEarly] = useState(true);
  const [optionId, setOptionId] = useState(SETTLEMENT_OPTIONS[0].id);
  const [settled, setSettled] = useState<Settled>(null);
  const { show, toast } = useToast();

  const option = SETTLEMENT_OPTIONS.find((o) => o.id === optionId)!;
  const quote = quoteEarlySettlement(PENDING_SETTLEMENT, option.feeRate);
  const pending = settled ? 0 : PENDING_SETTLEMENT;
  // Instant settlement lands in the wallet right away; the others arrive within 24 hours.
  const wallet = 412_500_000 + (settled?.instant ? settled.received : 0);

  const openInstant = () => {
    setOptionId('instant');
    setShowEarly(true);
    window.setTimeout(() => document.getElementById('early-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
  };

  const confirm = () => {
    setSettled({ instant: option.instant, received: quote.received });
    setShowEarly(false);
    show(
      option.instant
        ? `${fa(quote.received)} تومان همین حالا به کیف پول کسب‌وکار واریز شد`
        : `${fa(quote.received)} تومان ظرف ۲۴ ساعت به کیف پول کسب‌وکار واریز می‌شود`,
    );
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-text">
          <div className="page-eyebrow">{STORE.today}</div>
          <h1 className="page-title">سلام {STORE.seller}، وضعیت پول فروشگاه‌تان</h1>
        </div>
        <div className="page-actions">
          <span className="badge badge-gold">داده‌های نمونه</span>
          <button type="button" className="btn btn-primary" onClick={openInstant} disabled={Boolean(settled)}>
            <Bolt />
            تسویه آنی
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => show('انتقال وجه در نسخه نمونه فعال نیست')}>
            انتقال وجه
          </button>
        </div>
      </header>

      <div className="grid grid-4 stats">
        <StatCard
          label="موجودی کیف پول کسب‌وکار"
          value={fa(wallet)}
          unit="تومان"
          foot={<span style={{ fontWeight: 500 }}>کارت کسب‌وکار •••• {STORE.cardLast4}</span>}
        />
        <StatCard
          label="در انتظار تسویه"
          value={fa(pending)}
          unit="تومان"
          foot={
            settled ? (
              <span className="tone-green">{settled.instant ? 'تسویه آنی انجام شد' : 'در حال واریز · ظرف ۲۴ ساعت'}</span>
            ) : (
              <span className="stat-foot-split">
                <span className="tone-blue">تسویه عادی: ۱۹ مهر (۱۴ روز دیگر)</span>
                <button type="button" className="chip-action" onClick={openInstant}>
                  <Bolt />
                  تسویه آنی
                </button>
              </span>
            )
          }
        />
        <StatCard label="فروش شهریور" value={faDec(1.24, 2)} unit="میلیارد تومان" foot={<span className="tone-green">۸٪ بیشتر از مرداد</span>} />
        <StatCard
          dark
          label="اعتبار در دسترس"
          value="۸۵۰"
          unit="میلیون تومان"
          foot={<Link to="/loan">امتیاز ۷۴۲ · مشاهده پیشنهاد وام ←</Link>}
        />
      </div>

      {showEarly && !settled && (
        <section className="card early" aria-labelledby="early-title">
          <div className="early-main">
            <h2 id="early-title" className="card-title">
              تسویه زودهنگام
            </h2>
            <p className="muted">
              مبلغ در انتظار تسویه: {fa(PENDING_SETTLEMENT)} تومان. همین حالا بگیرید، یا انتخاب کنید چند روز زودتر دریافت کنید.
            </p>
            <div role="radiogroup" aria-label="زمان دریافت" className="chips chips-sm">
              {SETTLEMENT_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={o.id === optionId}
                  className={`chip${o.instant ? ' chip-instant' : ''}`}
                  onClick={() => setOptionId(o.id)}
                >
                  {o.instant && <Bolt />}
                  {o.label}
                </button>
              ))}
            </div>
            <p className="card-note">نرخ‌ها نمونه است و باید با تعرفه واقعی جایگزین شود.</p>
          </div>
          <div className="early-quote">
            <div className="kv">
              <span>زمان واریز</span>
              <strong className={option.instant ? 'tone-blue' : ''}>{option.arrival}</strong>
            </div>
            <div className="kv">
              <span>کارمزد ({faDec(option.feeRate * 100, 1)}٪)</span>
              <strong>{fa(quote.fee)} تومان</strong>
            </div>
            <div className="kv">
              <span>مبلغ دریافتی</span>
              <strong className="tone-green">{fa(quote.received)} تومان</strong>
            </div>
            <div className="early-actions">
              <button type="button" className="btn btn-primary" onClick={confirm}>
                {option.instant ? (
                  <>
                    <Bolt />
                    تسویه آنی
                  </>
                ) : (
                  'تأیید و دریافت'
                )}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowEarly(false)}>
                بستن
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-main-side">
        <section className="card">
          <div className="card-head">
            <h2 className="card-title">جریان نقدی ۶ ماه اخیر</h2>
            <div className="legend">
              <span>
                <i style={{ background: 'var(--blue)' }} />
                ورودی
              </span>
              <span>
                <i style={{ background: 'var(--orange)' }} />
                خروجی
              </span>
            </div>
          </div>
          <BarChart
            height={260}
            ariaLabel="جریان نقدی ۶ ماه اخیر (میلیون تومان)"
            gap={18}
            groups={CASHFLOW.map((m) => ({
              key: m.month,
              label: m.month,
              axisSub: <span className="ltr">{faSigned(m.inflow - m.outflow)}</span>,
              bars: [
                { value: m.inflow, color: 'var(--blue)' },
                { value: m.outflow, color: 'var(--orange)' },
              ],
              tooltip: (
                <>
                  <strong>{m.month}</strong>
                  <br />
                  ورودی: {fa(m.inflow)} میلیون
                  <br />
                  خروجی: {fa(m.outflow)} میلیون
                  <br />
                  خالص: <span className="ltr">{faSigned(m.inflow - m.outflow)}</span> میلیون
                </>
              ),
            }))}
            table={{
              head: ['ماه', 'ورودی', 'خروجی', 'خالص'],
              rows: CASHFLOW.map((m) => [m.month, fa(m.inflow), fa(m.outflow), faSigned(m.inflow - m.outflow)]),
            }}
          />
          <p className="card-note">ارقام به میلیون تومان. عدد سبز، خالص جریان نقدی هر ماه است.</p>
        </section>

        <section className="card">
          <h2 className="card-title">مسیر پول شما</h2>
          <ol className="timeline">
            {MONEY_PATH.map((s, i) => (
              <li key={s.title}>
                <span className="timeline-dot" style={{ background: s.color }}>
                  {fa(i + 1)}
                </span>
                <div>
                  <div className="timeline-title">{s.title}</div>
                  <div className="timeline-text">{s.text}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="grid grid-main-side">
        <section className="card">
          <div className="card-head">
            <h2 className="card-title">تراکنش‌های اخیر</h2>
            <Link to="/accounting" className="link-arrow">
              همه تراکنش‌ها
            </Link>
          </div>
          <div className="rows">
            {TRANSACTIONS.map((t) => (
              <div key={t.title + t.date} className="row">
                <span className="row-icon" style={{ background: t.tint }} aria-hidden="true" />
                <div className="row-main">
                  <div className="row-title">{t.title}</div>
                  <div className="row-sub">{t.sub}</div>
                </div>
                <div className="row-date row-sub">{t.date}</div>
                <div className="row-end">
                  <div className={`row-amount ltr ${t.amount > 0 ? 'tone-green' : ''}`}>{faSigned(t.amount)}</div>
                  <div className="row-date-inline row-sub">{t.date}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">پرداخت‌های پیش رو</h2>
          <div className="rows">
            <div className="row">
              <div className="row-main">
                <div className="row-title">قسط وام کسب‌وکار</div>
                <div className="row-sub">۱۰ مهر · قسط ۴ از ۶</div>
              </div>
              <div className="row-amount">{fa(28_500_000)}</div>
            </div>
            <div className="row">
              <div className="row-main">
                <div className="row-title">مالیات ارزش افزوده تابستان</div>
                <div className="row-sub">
                  ۱۵ مهر · <Link to="/tax">مشاهده در بخش مالیات</Link>
                </div>
              </div>
              <div className="row-amount">{fa(46_200_000)}</div>
            </div>
            <div className="row">
              <div className="row-main">
                <div className="row-title">حقوق کارکنان</div>
                <div className="row-sub">
                  ۳۰ مهر · از کیف پول «حقوق مهر» · <Link to="/cash">مدیریت نقدینگی</Link>
                </div>
              </div>
              <div className="row-amount">{fa(110_000_000)}</div>
            </div>
          </div>
        </section>
      </div>
      {toast}
    </div>
  );
}
