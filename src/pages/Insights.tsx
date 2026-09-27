import { useState } from 'react';
import { Link } from 'react-router-dom';
import BarChart from '../components/BarChart';
import Chips from '../components/Chips';
import StatCard from '../components/StatCard';
import { useToast } from '../components/useToast';
import { fa, faDec } from '../lib/format';

const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
const PEAK = 110;

type Category = 'home' | 'fashion' | 'beauty' | 'digital' | 'grocery';

interface CategoryData {
  label: string;
  sectorGrowth: number;
  yourGrowth: number;
  basket: number;
  yourBasket: number;
  bnplShare: number;
  /** Monthly sales index, 100 = yearly average. */
  season: number[];
  note: string;
}

// Sample, aggregated and anonymised; not real network data.
const DATA: Record<Category, CategoryData> = {
  home: {
    label: 'لوازم خانگی کوچک',
    sectorGrowth: 31, yourGrowth: 42, basket: 3.8, yourBasket: 4.2, bnplShare: 38,
    season: [118, 92, 85, 80, 84, 96, 104, 110, 122, 131, 88, 90],
    note: 'اوج فروش در آذر و دی (یلدا و فصل سرما) و فروردین است. موجودی را از اواسط آبان بالا ببرید.',
  },
  fashion: {
    label: 'مد و پوشاک',
    sectorGrowth: 24, yourGrowth: 42, basket: 2.1, yourBasket: 4.2, bnplShare: 29,
    season: [96, 88, 92, 84, 82, 112, 104, 98, 102, 96, 108, 138],
    note: 'اوج فروش در اسفند (عید) و شهریور (بازگشایی مدارس) است.',
  },
  beauty: {
    label: 'آرایشی و بهداشتی',
    sectorGrowth: 27, yourGrowth: 42, basket: 1.4, yourBasket: 4.2, bnplShare: 18,
    season: [104, 96, 94, 92, 90, 94, 98, 102, 112, 106, 100, 112],
    note: 'فروش این صنف یکنواخت‌تر است؛ آذر و اسفند کمی بالاتر از میانگین‌اند.',
  },
  digital: {
    label: 'کالای دیجیتال',
    sectorGrowth: 35, yourGrowth: 42, basket: 12.6, yourBasket: 4.2, bnplShare: 51,
    season: [102, 94, 90, 88, 92, 114, 100, 118, 106, 98, 92, 106],
    note: 'اوج فروش در شهریور و آبان (تخفیف‌های پاییزی) است.',
  },
  grocery: {
    label: 'خوراکی و سوپرمارکت',
    sectorGrowth: 19, yourGrowth: 42, basket: 0.9, yourBasket: 4.2, bnplShare: 9,
    season: [112, 98, 96, 94, 96, 98, 100, 98, 102, 110, 100, 116],
    note: 'اسفند و فروردین (عید) و دی (یلدا) پرفروش‌ترین ماه‌ها هستند.',
  },
};

const PERCENTILES = [
  { label: 'رشد فروش', value: 78 },
  { label: 'امتیاز رضایت مشتری', value: 71 },
  { label: 'سرعت ارسال', value: 64 },
  { label: 'نرخ مرجوعی پایین', value: 82 },
];

export default function Insights() {
  const [cat, setCat] = useState<Category>('home');
  const { show, toast } = useToast();
  const d = DATA[cat];
  const diff = d.yourGrowth - d.sectorGrowth;

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">بینش کسب‌وکار</h1>
          <p className="page-subtitle">عملکرد شما در مقایسه با صنف‌تان، بر پایه داده‌های تجمیعی و ناشناس فروشندگان شبکه دیجی‌کالا و دیجی‌پی.</p>
        </div>
        <span className="badge badge-gold">اعداد نمونه، نه واقعی</span>
      </header>

      <Chips
        label="صنف"
        value={cat}
        onChange={setCat}
        options={(Object.keys(DATA) as Category[]).map((k) => ({ value: k, label: DATA[k].label }))}
      />

      <div className="grid grid-4">
        <StatCard label="رشد صنف (سالانه)" value={`+${fa(d.sectorGrowth)}٪`} foot={<span style={{ fontWeight: 500 }}>ارزش فروش شبکه، ۱۲ ماه اخیر</span>} />
        <StatCard
          label="رشد شما"
          value={<span className="tone-blue">+{fa(d.yourGrowth)}٪</span>}
          foot={<span className={diff >= 0 ? 'tone-green' : 'tone-red'}>{fa(Math.abs(diff))} واحد {diff >= 0 ? 'بالاتر' : 'پایین‌تر'} از صنف</span>}
        />
        <StatCard label="میانگین سبد خرید صنف" value={`${faDec(d.basket)} میلیون`} foot={<span style={{ fontWeight: 500 }}>سبد شما: {faDec(d.yourBasket)} میلیون تومان</span>} />
        <StatCard label="سهم خرید اقساطی مشتریان" value={`${fa(d.bnplShare)}٪`} foot={<span style={{ fontWeight: 500 }}>از کل پرداخت‌های صنف</span>} />
      </div>

      <div className="grid grid-main-side">
        <section className="card">
          <div className="card-head">
            <h2 className="card-title">فصلی بودن فروش در صنف</h2>
            <div className="legend">
              <span>
                <i style={{ background: 'var(--orange)' }} />
                ماه‌های اوج (بالای {fa(PEAK)})
              </span>
              <span>
                <i style={{ background: 'var(--blue-soft)' }} />
                سایر ماه‌ها
              </span>
            </div>
          </div>
          <p className="card-note" style={{ marginTop: -6 }}>شاخص فروش ماهانه (میانگین = ۱۰۰)</p>
          <BarChart
            height={240}
            className="chart-dense"
            ariaLabel={`شاخص فروش ماهانه صنف ${d.label}`}
            max={Math.max(140, ...d.season)}
            groups={d.season.map((v, i) => ({
              key: MONTHS[i],
              label: MONTHS[i],
              top: fa(v),
              bars: [{ value: v, color: v >= PEAK ? 'var(--orange)' : 'var(--blue-soft)' }],
              tooltip: (
                <>
                  <strong>{MONTHS[i]}</strong>
                  <br />
                  شاخص فروش: {fa(v)}
                </>
              ),
            }))}
            table={{ head: ['ماه', 'شاخص'], rows: d.season.map((v, i) => [MONTHS[i], fa(v)]) }}
          />
          <p className="muted" style={{ fontSize: 14 }}>
            {d.note}
          </p>
        </section>

        <section className="card">
          <h2 className="card-title">جایگاه شما در صنف</h2>
          <div className="grid" style={{ gap: 20 }}>
            {PERCENTILES.map((p) => (
              <div key={p.label} className="field">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                  <span>{p.label}</span>
                  <strong>صدک {fa(p.value)}</strong>
                </div>
                <div className="progress" role="progressbar" aria-label={p.label} aria-valuenow={p.value} aria-valuemin={0} aria-valuemax={100}>
                  <div style={{ width: `${p.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="card-note">صدک: از هر ۱۰۰ فروشنده صنف، چند نفر پایین‌تر از شما هستند.</p>
        </section>
      </div>

      <section className="card">
        <h2 className="card-title">پیشنهادهای ما برای شما</h2>
        <div className="grid grid-3">
          <div className="tile">
            <div className="tile-title">موجودی قبل از یلدا</div>
            <div className="tile-text">
              فروش صنف شما در آذر معمولاً بالاتر از میانگین سال است. با خرید اقساطی کالا، موجودی را بدون فشار نقدینگی افزایش دهید.
            </div>
            <Link to="/loan" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
              خرید اقساطی کالا
            </Link>
          </div>
          <div className="tile">
            <div className="tile-title">اقساطی کردن فروش</div>
            <div className="tile-text">
              {fa(d.bnplShare)}٪ مشتریان صنف شما با اقساط خرید می‌کنند. درگاه اقساطی دیجی‌پی را روی سایت خود فعال کنید.
            </div>
            <button type="button" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => show('درخواست فعال‌سازی درگاه اقساطی ثبت شد')}>
              فعال‌سازی درگاه
            </button>
          </div>
          <div className="tile">
            <div className="tile-title">نقدینگی پایان ماه</div>
            <div className="tile-text">موجودی شما ۳۰ مهر به کمترین مقدار می‌رسد. یک قانون تسویه زودهنگام خودکار بسازید.</div>
            <Link to="/cash" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
              مدیریت نقدینگی
            </Link>
          </div>
        </div>
      </section>
      {toast}
    </div>
  );
}
