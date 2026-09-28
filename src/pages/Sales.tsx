import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { useToast } from '../components/useToast';
import { fa } from '../lib/format';
import { SOURCES, confidenceOf, summarize, type Confidence, type Connections, type SourceId } from '../lib/sales';

const COLORS: Record<SourceId, string> = {
  digikala: 'var(--blue)',
  gateway: '#5b8cff',
  pos: 'var(--navy)',
  transfers: '#8a96b3',
  cash: 'var(--orange)',
};

const CONF: Record<Confidence, { label: string; cls: string }> = {
  verified: { label: 'تأییدشده توسط دیجی‌پی', cls: 'badge-green' },
  connected: { label: 'متصل با رضایت شما', cls: 'badge-blue' },
  declared: { label: 'اظهارشده', cls: 'badge-orange' },
  unknown: { label: 'متصل نشده', cls: 'badge-gray' },
};

const BANKS = ['ملت', 'ملی', 'سامان', 'پاسارگاد', 'تجارت', 'صادرات', 'اقتصاد نوین', 'شهر'];

type Modal = 'bank' | 'moadian' | 'cash' | null;

/** Formats million toman as «۱٬۲۴۰ میلیون» or «۲٫۹۲ میلیارد». */
function money(m: number) {
  return m >= 1000 ? `${(m / 1000).toLocaleString('fa-IR', { maximumFractionDigits: 2 })} میلیارد` : `${fa(m)} میلیون`;
}

export default function Sales() {
  const [c, setC] = useState<Connections>({ bank: false, moadian: false, cashLogged: false });
  const [modal, setModal] = useState<Modal>(null);
  const [bank, setBank] = useState('');
  const [consent, setConsent] = useState(false);
  const { show, toast } = useToast();

  const sum = summarize(c);
  const potential = summarize({ bank: true, moadian: true, cashLogged: true });
  const close = () => {
    setModal(null);
    setConsent(false);
  };

  const connectBank = (e: FormEvent) => {
    e.preventDefault();
    if (!bank || !consent) return;
    setC((x) => ({ ...x, bank: true }));
    close();
    show(`گردش حساب بانک ${bank} متصل شد؛ فروش کارتخوان و واریزها اضافه شد`);
  };

  const connectMoadian = (e: FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setC((x) => ({ ...x, moadian: true }));
    close();
    show('صورتحساب‌های سامانه مودیان متصل شد و ارقام تطبیق داده شد');
  };

  const logCash = (e: FormEvent) => {
    e.preventDefault();
    setC((x) => ({ ...x, cashLogged: true }));
    close();
    show('فروش نقدی ثبت شد');
  };

  const action = (id: SourceId) => {
    if (id === 'pos' || id === 'transfers') return c.bank ? null : () => setModal('bank');
    if (id === 'cash') return () => setModal('cash');
    return null;
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">همه فروش شما، از هر کانالی</h1>
          <p className="page-subtitle">
            فروش کارتخوان‌های دیگر، واریزهای بانکی و فروش نقدی را هم وصل کنید تا تصویر کامل کسب‌وکارتان را ببینید و سقف اعتبار واقعی بگیرید.
          </p>
        </div>
        <div className="page-actions">
          <span className="badge badge-gold">داده‌های نمونه</span>
          <button type="button" className="btn btn-primary" onClick={() => setModal('bank')} disabled={c.bank}>
            {c.bank ? 'حساب بانکی متصل است' : 'اتصال حساب بانکی'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setModal('moadian')} disabled={c.moadian}>
            {c.moadian ? 'مودیان متصل است' : 'اتصال سامانه مودیان'}
          </button>
        </div>
      </header>

      <div className="grid grid-4">
        <StatCard label="فروش شناخته‌شده شهریور" value={money(sum.known)} unit="تومان" foot={<span style={{ fontWeight: 500 }}>از {fa(SOURCES.filter((s) => confidenceOf(s.id, c) !== 'unknown').length)} کانال فروش</span>} />
        <StatCard label="دیده‌شده در شبکه دیجی‌پی" value={`${fa(Math.round(sum.coverage * 100))}٪`} unit="از فروش شناخته‌شده" foot={<span style={{ fontWeight: 500 }}>{money(sum.verified)} تومان</span>} />
        <StatCard label="فروش مبنای اعتبار" value={money(Math.round(sum.weighted))} unit="تومان" foot={<span style={{ fontWeight: 500 }}>با وزن اطمینان هر منبع</span>} />
        <StatCard
          dark
          label="سقف اعتبار شما"
          value={money(sum.limit)}
          unit="تومان"
          foot={sum.limit < potential.limit ? `با اتصال همه منابع تا ${money(potential.limit)}` : <Link to="/loan">مشاهده پیشنهاد وام ←</Link>}
        />
      </div>

      <section className="card">
        <div className="card-head">
          <h2 className="card-title">ترکیب فروش شهریور</h2>
          <span className="card-note">میلیون تومان</span>
        </div>
        <div className="mixbar" role="img" aria-label="سهم هر کانال از فروش شناخته‌شده">
          {SOURCES.filter((s) => confidenceOf(s.id, c) !== 'unknown').map((s) => (
            <div key={s.id} style={{ flexGrow: s.monthly, background: COLORS[s.id] }} title={`${s.name}: ${fa(s.monthly)}`} />
          ))}
          {SOURCES.some((s) => confidenceOf(s.id, c) === 'unknown') && <div className="mixbar-unknown">فروش ناشناخته</div>}
        </div>
        <div className="legend" style={{ flexWrap: 'wrap' }}>
          {SOURCES.map((s) => (
            <span key={s.id} style={{ opacity: confidenceOf(s.id, c) === 'unknown' ? 0.45 : 1 }}>
              <i style={{ background: COLORS[s.id] }} />
              {s.name}
            </span>
          ))}
        </div>
      </section>

      <div className="grid grid-main-side">
        <section className="card">
          <h2 className="card-title">کانال‌های فروش</h2>
          <div className="rows">
            {SOURCES.map((s) => {
              const conf = confidenceOf(s.id, c);
              const act = action(s.id);
              return (
                <div key={s.id} className="row">
                  <span className="row-icon" style={{ background: COLORS[s.id], width: 12, height: 44, borderRadius: 6 }} aria-hidden="true" />
                  <div className="row-main">
                    <div className="row-title">{s.name}</div>
                    <div className="row-sub">{s.how}</div>
                  </div>
                  <div className="row-actions">
                    <span className={`badge badge-sm ${CONF[conf].cls}`}>{CONF[conf].label}</span>
                    <div className="row-amount" style={{ minWidth: 90, textAlign: 'left' }}>
                      {conf === 'unknown' ? '—' : fa(s.monthly)}
                    </div>
                    {act && (
                      <button type="button" className="btn btn-secondary btn-sm" onClick={act}>
                        {s.id === 'cash' ? (c.cashLogged ? 'ثبت فروش امروز' : 'ثبت فروش نقدی') : 'اتصال'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {c.moadian && <div className="info-box">صورتحساب‌های سامانه مودیان با گردش بانکی و فروش نقدی تطبیق داده شد؛ اطمینان این ارقام بالا رفت.</div>}
        </section>

        <section className="card">
          <h2 className="card-title">هر منبع چقدر در اعتبار حساب می‌شود؟</h2>
          <div className="rows">
            {[
              ['تأییدشده', 'فروش در دیجی‌کالا و دیجی‌پی', '٪۱۰۰'],
              ['متصل', 'گردش حساب بانکی با رضایت شما', '٪۸۰'],
              ['متصل + مودیان', 'گردش بانکی که با صورتحساب مودیان تطبیق دارد', '٪۹۵'],
              ['اظهارشده', 'فروش نقدی ثبت‌شده در اپ', '٪۲۵'],
            ].map(([t, d, w]) => (
              <div key={t} className="row">
                <div className="row-main">
                  <div className="row-title">{t}</div>
                  <div className="row-sub">{d}</div>
                </div>
                <div className="row-amount tone-blue">{w}</div>
              </div>
            ))}
          </div>
          <p className="card-note">
            فقط دسترسی خواندنی می‌گیریم و هر زمان می‌توانید اتصال را قطع کنید. هیچ پولی از این حساب‌ها جابه‌جا نمی‌شود.
          </p>
        </section>
      </div>

      {modal && (
        <div className="modal-scrim" role="presentation" onClick={close}>
          <div className="modal card" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
            {modal === 'bank' && (
              <form className="grid" style={{ gap: 14 }} onSubmit={connectBank}>
                <h2 id="modal-title" className="card-title">اتصال گردش حساب بانکی</h2>
                <p className="muted" style={{ fontSize: 14, lineHeight: 1.9 }}>
                  تسویه کارتخوان‌های همه شرکت‌ها و واریزهای مشتریان در حساب بانکی شما می‌نشیند. با اتصال، این فروش را هم می‌بینیم.
                </p>
                <div className="chips chips-sm" role="radiogroup" aria-label="بانک">
                  {BANKS.map((b) => (
                    <button key={b} type="button" role="radio" aria-checked={bank === b} className="chip" onClick={() => setBank(b)}>
                      {b}
                    </button>
                  ))}
                </div>
                <label className="option-card">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>
                    اجازه می‌دهم دیجی‌پی گردش ۱۲ ماه اخیر این حساب را فقط بخواند.
                    <small>ورود و تأیید در صفحه خود بانک یا سرویس بانکداری باز مجاز انجام می‌شود.</small>
                  </span>
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-primary" disabled={!bank || !consent}>
                    ادامه در صفحه بانک
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={close}>
                    انصراف
                  </button>
                </div>
              </form>
            )}
            {modal === 'moadian' && (
              <form className="grid" style={{ gap: 14 }} onSubmit={connectMoadian}>
                <h2 id="modal-title" className="card-title">اتصال سامانه مودیان</h2>
                <p className="muted" style={{ fontSize: 14, lineHeight: 1.9 }}>
                  همه کارتخوان‌ها به پرونده مالیاتی شما وصل‌اند و صورتحساب هر فروش در سامانه مودیان ثبت می‌شود؛ مطمئن‌ترین تصویر از فروش کل شما.
                </p>
                <div className="field">
                  <label className="field-label" htmlFor="eco">
                    کد اقتصادی
                  </label>
                  <input id="eco" className="input" dir="ltr" defaultValue="411456789123" />
                </div>
                <label className="option-card">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>
                    اجازه می‌دهم خلاصه صورتحساب‌های فروش من خوانده شود.
                    <small>دسترسی از طریق شرکت معتمد مالیاتی و فقط برای خواندن است.</small>
                  </span>
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-primary" disabled={!consent}>
                    اتصال
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={close}>
                    انصراف
                  </button>
                </div>
              </form>
            )}
            {modal === 'cash' && (
              <form className="grid" style={{ gap: 14 }} onSubmit={logCash}>
                <h2 id="modal-title" className="card-title">ثبت فروش نقدی</h2>
                <p className="muted" style={{ fontSize: 14, lineHeight: 1.9 }}>
                  فروش نقدی را روزانه ثبت کنید. وقتی پول نقد را به حساب بانکی متصل واریز کنید، این رقم تأیید می‌شود و وزن بیشتری می‌گیرد.
                </p>
                <div className="field">
                  <label className="field-label" htmlFor="cash-amt">
                    مبلغ فروش نقدی امروز (تومان)
                  </label>
                  <input id="cash-amt" className="input" dir="ltr" inputMode="numeric" defaultValue="11,500,000" />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-primary">
                    ثبت
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={close}>
                    انصراف
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {toast}
    </div>
  );
}
