import { useRef, useState, type FormEvent } from 'react';
import Chips from '../components/Chips';
import { useToast } from '../components/useToast';
import { fa } from '../lib/format';
import { STORE } from '../lib/store';

type Tab = 'overview' | 'documents' | 'people';

const CHECKS = [
  { label: 'احراز هویت', ok: true },
  { label: 'ای‌نماد', ok: true },
  { label: 'پرونده مالیاتی', ok: true },
  { label: 'شبا تأییدشده', ok: true },
  { label: 'اظهارنامه ۱۴۰۴ برای وام', ok: false },
];

const FACTORS = [
  { label: 'سابقه و ثبات فروش', value: 88 },
  { label: 'بازپرداخت به‌موقع', value: 95 },
  { label: 'نرخ مرجوعی', value: 81 },
  { label: 'مدارک مالی', value: 45 },
];

const INITIAL_DOCS = [
  { title: 'کارت ملی صاحب امضا', status: 'تأییدشده' },
  { title: 'روزنامه رسمی و آگهی تأسیس', status: 'تأییدشده' },
  { title: 'آخرین تغییرات روزنامه رسمی', status: 'تأییدشده' },
  { title: 'کد رهگیری پرونده مالیاتی و کد اقتصادی', status: 'تأییدشده' },
  { title: 'مجوز فعالیت', status: 'تأییدشده' },
  { title: 'اظهارنامه مالیاتی ۱۴۰۴', status: 'بارگذاری نشده' },
  { title: 'صورت‌های مالی ۱۴۰۴', status: 'بارگذاری نشده' },
];

const INITIAL_PEOPLE = [
  { name: '[نام و نام خانوادگی]', role: 'صاحب امضا · مدیرعامل', access: 'دسترسی کامل' },
  { name: '[نام و نام خانوادگی]', role: 'عضو هیئت‌مدیره', access: 'مشاهده' },
  { name: '[نام حسابدار]', role: 'حسابدار', access: 'فقط‌خواندنی' },
];

export default function Profile() {
  const [tab, setTab] = useState<Tab>('overview');
  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState({ englishName: '[Store name]', channels: 'دیجی‌کالا · سایت · اینستاگرام' });
  const [docs, setDocs] = useState(INITIAL_DOCS);
  const [people, setPeople] = useState(INITIAL_PEOPLE);
  const [personForm, setPersonForm] = useState(false);
  const upload = useRef<HTMLInputElement>(null);
  const uploadFor = useRef<string | null>(null);
  const { show, toast } = useToast();

  const saveInfo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setInfo({ englishName: String(data.get('englishName')), channels: String(data.get('channels')) });
    setEditing(false);
    show('اطلاعات کسب‌وکار ذخیره شد');
  };

  const onUpload = (file: File | undefined) => {
    const title = uploadFor.current;
    if (!file || !title) return;
    setDocs((list) => list.map((d) => (d.title === title ? { ...d, status: 'در حال بررسی' } : d)));
    show(`«${file.name}» بارگذاری شد و در حال بررسی است`);
    if (upload.current) upload.current.value = '';
  };

  const addPerson = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name')).trim();
    if (!name) return;
    setPeople((list) => [...list, { name, role: String(data.get('role')) || 'کارمند', access: 'مشاهده' }]);
    setPersonForm(false);
    show('دعوت‌نامه ارسال شد');
  };

  const businessRows: [string, string][] = [
    ['نوع شخصیت', 'حقوقی'],
    ['نام انگلیسی', info.englishName],
    ['دسته‌بندی', 'لوازم خانگی کوچک'],
    ['شناسه ملی', '۱۴۰۰۹۸۷۶۵۴۳'],
    ['کد اقتصادی', '۴۱۱۴۵۶۷۸۹۱۲۳'],
    ['کد پستی', '۱۴۳۳۸۷۶۵۴۱'],
    ['صاحب امضا', '[نام و نام خانوادگی]'],
    ['کانال فروش', info.channels],
  ];

  return (
    <div className="page">
      <section className="card profile-head">
        <span className="logo-slot" style={{ width: 110, height: 110, borderRadius: 20, fontSize: 13 }}>
          [لوگو]
        </span>
        <div className="profile-id">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 className="page-title">{STORE.name}</h1>
            <span className="badge badge-blue">طرح رشد</span>
            <span className="badge badge-gold">داده‌های نمونه</span>
          </div>
          <p className="page-subtitle">لوازم خانگی کوچک · شخص حقوقی · فروشنده دیجی‌کالا از فروردین ۱۴۰۳</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CHECKS.map((c) =>
              c.ok ? (
                <span key={c.label} className="badge badge-green">
                  ✓ {c.label}
                </span>
              ) : (
                <button key={c.label} type="button" className="badge badge-orange" style={{ border: 0, cursor: 'pointer' }} onClick={() => setTab('documents')}>
                  ! {c.label}
                </button>
              ),
            )}
          </div>
        </div>
        <div className="score-card">
          <div className="stat-label">امتیاز اعتباری</div>
          <div className="stat-value" style={{ fontSize: 40 }}>
            {fa(STORE.creditScore)} <span className="stat-unit">/ ۹۰۰</span>
          </div>
          <div className="stat-foot tone-green">خوب · ۱۸ امتیاز رشد در ۳ ماه</div>
        </div>
      </section>

      <Chips
        label="بخش‌های پروفایل"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'overview', label: 'نمای کلی' },
          { value: 'documents', label: 'مدارک' },
          { value: 'people', label: 'اشخاص' },
        ]}
      />

      {tab === 'overview' && (
        <div className="grid grid-3">
          <section className="card">
            <div className="card-head">
              <h2 className="card-title">اطلاعات کسب‌وکار</h2>
              {!editing && (
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
                  ویرایش
                </button>
              )}
            </div>
            {editing ? (
              <form className="grid" style={{ gap: 12 }} onSubmit={saveInfo}>
                <label className="field">
                  <span className="field-label">نام انگلیسی</span>
                  <input className="input" name="englishName" dir="ltr" defaultValue={info.englishName} />
                </label>
                <label className="field">
                  <span className="field-label">کانال فروش</span>
                  <input className="input" name="channels" defaultValue={info.channels} />
                </label>
                <p className="card-note">تغییر شناسه ملی، کد اقتصادی و صاحب امضا نیاز به مدرک رسمی دارد.</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-primary btn-sm">
                    ذخیره
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>
                    انصراف
                  </button>
                </div>
              </form>
            ) : (
              <div>
                {businessRows.map(([k, v]) => (
                  <div key={k} className="kv">
                    <span>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card">
            <h2 className="card-title">اتصال به شبکه</h2>
            <div className="net-card">
              <div className="card-head">
                <strong>دیجی‌کالا</strong>
                <span className="tone-green" style={{ fontSize: 13, fontWeight: 700 }}>
                  • متصل
                </span>
              </div>
              <p>شناسه فروشنده: ۴۸۲۹۱۷</p>
              <p>سابقه فروش: ۳۰ ماه · ۱۲٬۴۰۰ سفارش</p>
              <p>نرخ مرجوعی: ۱٫۸٪ · امتیاز عملکرد: ۴٫۶</p>
            </div>
            <div className="net-card">
              <div className="card-head">
                <strong>دیجی‌پی</strong>
                <span className="tone-green" style={{ fontSize: 13, fontWeight: 700 }}>
                  • متصل
                </span>
              </div>
              <p>شماره پذیرنده: ۷۷۰۱۲۴۵</p>
              <p>روش‌های فعال: کیف پول، اقساط ۴ قسط، وام بانکی</p>
              <p>دوره تسویه قرارداد: ۱۴ روزه</p>
            </div>
            <p className="card-note">اطلاعات با رضایت شما از دیجی‌کالا و دیجی‌پی خوانده می‌شود و هر زمان قابل قطع است.</p>
          </section>

          <section className="card">
            <h2 className="card-title">عوامل امتیاز اعتباری</h2>
            <div className="grid" style={{ gap: 18 }}>
              {FACTORS.map((f) => (
                <div key={f.label} className="field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                    <span>{f.label}</span>
                    <strong>{fa(f.value)}٪</strong>
                  </div>
                  <div className="progress" role="progressbar" aria-label={f.label} aria-valuenow={f.value} aria-valuemin={0} aria-valuemax={100}>
                    <div style={{ width: `${f.value}%`, background: f.value < 60 ? 'var(--orange)' : undefined }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="info-box">
              با بارگذاری اظهارنامه مالیاتی ۱۴۰۴، سقف وام شما تا <strong>۱٫۵ میلیارد تومان</strong> افزایش می‌یابد.
            </div>
          </section>
        </div>
      )}

      {tab === 'documents' && (
        <section className="card">
          <h2 className="card-title">مدارک</h2>
          <input ref={upload} type="file" accept="image/*,application/pdf" hidden onChange={(e) => onUpload(e.target.files?.[0])} />
          <div className="rows">
            {docs.map((d) => (
              <div key={d.title} className="row">
                <div className="row-main">
                  <div className="row-title">{d.title}</div>
                </div>
                <span className={`badge badge-sm ${d.status === 'تأییدشده' ? 'badge-green' : d.status === 'در حال بررسی' ? 'badge-blue' : 'badge-orange'}`}>
                  {d.status}
                </span>
                {d.status === 'بارگذاری نشده' && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      uploadFor.current = d.title;
                      upload.current?.click();
                    }}
                  >
                    بارگذاری
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="card-note">کد پستی و دسته‌بندی کسب‌وکار باید در همه مدارک یکسان باشد.</p>
        </section>
      )}

      {tab === 'people' && (
        <section className="card">
          <div className="card-head">
            <h2 className="card-title">اشخاص و دسترسی‌ها</h2>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPersonForm((v) => !v)} aria-expanded={personForm}>
              + افزودن شخص
            </button>
          </div>
          {personForm && (
            <form className="inline-form" onSubmit={addPerson} aria-label="افزودن شخص">
              <input className="input" name="name" placeholder="نام و نام خانوادگی" required />
              <input className="input" name="role" placeholder="نقش، مثلاً انباردار" />
              <button type="submit" className="btn btn-primary btn-sm" style={{ minHeight: 44 }}>
                ارسال دعوت
              </button>
            </form>
          )}
          <div className="rows">
            {people.map((p, i) => (
              <div key={p.name + i} className="row">
                <div className="row-main">
                  <div className="row-title">{p.name}</div>
                  <div className="row-sub">{p.role}</div>
                </div>
                <span className="badge badge-sm badge-gray">{p.access}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      {toast}
    </div>
  );
}
