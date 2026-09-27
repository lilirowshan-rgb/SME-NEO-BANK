import { useState, type FormEvent } from 'react';
import StatCard from '../components/StatCard';
import Toggle from '../components/Toggle';
import { useToast } from '../components/useToast';
import { estimateCampaign } from '../lib/ads';
import { fa, faDec } from '../lib/format';

type Channel = 'featured' | 'banner' | 'cashback' | 'installments';

const CHANNELS: Record<Channel, { title: string; text: string; price: string }> = {
  featured: {
    title: 'کالای ویژه در دیجی‌کالا',
    text: 'کالای شما در بالای نتایج جستجو و صفحه دسته‌بندی دیجی‌کالا نمایش داده می‌شود.',
    price: 'پرداخت به ازای هر کلیک، از [X] تومان',
  },
  banner: {
    title: 'بنر در اپ دیجی‌پی',
    text: 'بنر فروشگاه شما به کاربران دارای اعتبار دیجی‌پی در صفحه اصلی اپ نمایش داده می‌شود.',
    price: '[X] تومان به ازای هر هزار نمایش',
  },
  cashback: {
    title: 'کش‌بک برای مشتری',
    text: 'درصدی از مبلغ خرید به کیف پول مشتری برمی‌گردد؛ هزینه از تسویه همان فروش کسر می‌شود.',
    price: 'درصد را خودتان تعیین می‌کنید',
  },
  installments: {
    title: 'اقساط بدون کارمزد',
    text: 'کارمزد اقساط دیجی‌پی را شما می‌پردازید تا مشتری کالای شما را بدون کارمزد قسطی بخرد.',
    price: 'حدود [X]٪ از مبلغ فروش [تأیید شود]',
  },
};

interface Campaign {
  id: number;
  name: string;
  channel: Channel;
  budget: number; // daily, toman
  spent: number;
  clicks: number;
  sales: number;
  active: boolean;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: 1, name: 'جاروبرقی‌های پاییزه', channel: 'featured', budget: 600_000, spent: 3_450_000, clicks: 2_310, sales: 41_600_000, active: true },
  { id: 2, name: 'یلدای دیجی‌پی', channel: 'banner', budget: 400_000, spent: 1_980_000, clicks: 1_120, sales: 22_900_000, active: true },
  { id: 3, name: 'کش‌بک ۵٪ اتو بخار', channel: 'cashback', budget: 250_000, spent: 1_430_000, clicks: 870, sales: 18_300_000, active: false },
  { id: 4, name: 'اقساط بدون کارمزد سرخ‌کن', channel: 'installments', budget: 300_000, spent: 750_000, clicks: 540, sales: 13_200_000, active: true },
];

const MONTH_BUDGET = 18_000_000;

export default function Ads() {
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [formOpen, setFormOpen] = useState(false);
  const [daily, setDaily] = useState(600_000);
  const { show, toast } = useToast();

  const spent = campaigns.reduce((s, c) => s + c.spent, 0);
  const sales = campaigns.reduce((s, c) => s + c.sales, 0);
  const clicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const estimate = estimateCampaign(daily);
  const spentPct = Math.round((spent / MONTH_BUDGET) * 100);

  const addCampaign = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name')).trim();
    const budget = Number(data.get('budget'));
    if (!name || !(budget > 0)) return;
    setCampaigns((list) => [
      { id: Date.now(), name, channel: data.get('channel') as Channel, budget, spent: 0, clicks: 0, sales: 0, active: true },
      ...list,
    ]);
    setFormOpen(false);
    show(`کمپین «${name}» ساخته شد و پس از بررسی فعال می‌شود`);
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">تبلیغات و رشد فروش</h1>
          <p className="page-subtitle">کالاهایتان را به خریداران دیجی‌کالا و ۱۰ میلیون کاربر دارای اعتبار دیجی‌پی نشان دهید.</p>
        </div>
        <div className="page-actions">
          <span className="badge badge-gold">داده‌های نمونه</span>
          <button type="button" className="btn btn-primary" onClick={() => setFormOpen((v) => !v)} aria-expanded={formOpen}>
            + کمپین جدید
          </button>
        </div>
      </header>

      {formOpen && (
        <form className="inline-form" onSubmit={addCampaign} aria-label="کمپین جدید">
          <input className="input" name="name" placeholder="نام کمپین" required />
          <select className="input" name="channel" defaultValue="featured" aria-label="نوع تبلیغ">
            {(Object.keys(CHANNELS) as Channel[]).map((k) => (
              <option key={k} value={k}>
                {CHANNELS[k].title}
              </option>
            ))}
          </select>
          <input className="input" name="budget" type="number" min={1} step={50_000} defaultValue={daily} aria-label="بودجه روزانه (تومان)" />
          <button type="submit" className="btn btn-primary btn-sm" style={{ minHeight: 44 }}>
            ساخت کمپین
          </button>
          <button type="button" className="btn btn-secondary btn-sm" style={{ minHeight: 44 }} onClick={() => setFormOpen(false)}>
            انصراف
          </button>
        </form>
      )}

      <div className="grid grid-4">
        <StatCard label="بودجه تبلیغات مهر" value={fa(MONTH_BUDGET / 1e6)} unit="میلیون تومان" foot={<span style={{ fontWeight: 500 }}>{fa(spentPct)}٪ خرج‌شده · از کیف پول کسب‌وکار</span>}>
          <div className="progress" aria-hidden="true">
            <div style={{ width: `${Math.min(100, spentPct)}%` }} />
          </div>
        </StatCard>
        <StatCard label="کلیک روی تبلیغات" value={fa(clicks)} foot={<span className="tone-green">۱۸٪ بیشتر از هفته قبل</span>} />
        <StatCard label="فروش از تبلیغات" value={faDec(sales / 1e6)} unit="میلیون تومان" foot={<span style={{ fontWeight: 500 }}>این ماه، همه کمپین‌ها</span>} />
        <StatCard dark label="بازگشت هزینه تبلیغات" value={`${faDec(spent ? sales / spent : 0)} برابر`} foot={<span className="tone-green">هر ۱ تومان تبلیغ، {faDec(spent ? sales / spent : 0)} تومان فروش</span>} />
      </div>

      <div className="grid grid-main-side">
        <section className="card">
          <h2 className="card-title">کمپین‌های شما</h2>
          <div className="table-wrap">
            <table className="table table-cards">
              <thead>
                <tr>
                  <th>کمپین</th>
                  <th>بودجه روزانه</th>
                  <th>هزینه‌شده</th>
                  <th>کلیک</th>
                  <th>فروش</th>
                  <th>فعال</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id}>
                    <td className="cell-main">
                      <strong>{c.name}</strong>
                      <div className="row-sub">{CHANNELS[c.channel].title}</div>
                    </td>
                    <td className="num" data-label="بودجه روزانه">{fa(c.budget)}</td>
                    <td className="num" data-label="هزینه‌شده">{fa(c.spent)}</td>
                    <td className="num" data-label="کلیک">{fa(c.clicks)}</td>
                    <td className="num tone-green" data-label="فروش">{fa(c.sales)}</td>
                    <td data-label="فعال">
                      <Toggle
                        label={`کمپین ${c.name}`}
                        checked={c.active}
                        onChange={(active) => {
                          setCampaigns((list) => list.map((x) => (x.id === c.id ? { ...x, active } : x)));
                          show(active ? `کمپین «${c.name}» فعال شد` : `کمپین «${c.name}» متوقف شد`);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="card-note">مبالغ به تومان. فروش، مجموع سفارش‌هایی است که ظرف ۷ روز پس از کلیک روی تبلیغ ثبت شده‌اند.</p>
        </section>

        <section className="card">
          <h2 className="card-title">تخمین نتیجه کالای ویژه</h2>
          <div className="field">
            <label htmlFor="daily" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
              <span>بودجه روزانه</span>
              <strong className="tone-blue">{fa(daily)} تومان</strong>
            </label>
            <input
              id="daily"
              type="range"
              min={200_000}
              max={5_000_000}
              step={100_000}
              value={daily}
              onChange={(e) => setDaily(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--blue)' }}
            />
          </div>
          <div>
            <div className="kv">
              <span>کلیک روزانه (تخمینی)</span>
              <strong>{fa(estimate.clicks)}</strong>
            </div>
            <div className="kv">
              <span>سفارش روزانه (تخمینی)</span>
              <strong>{faDec(estimate.orders)}</strong>
            </div>
            <div className="kv kv-total">
              <span>فروش روزانه (تخمینی)</span>
              <strong className="tone-green">{fa(estimate.sales)} تومان</strong>
            </div>
          </div>
          <p className="card-note">بر اساس هزینه نمونه ۱٬۵۰۰ تومان به ازای هر کلیک، نرخ تبدیل ۲٫۵٪ و سبد خرید ۴٫۲ میلیون تومان صنف شما.</p>
        </section>
      </div>

      <section className="card">
        <h2 className="card-title">ابزارهای رشد</h2>
        <div className="grid grid-4">
          {(Object.keys(CHANNELS) as Channel[]).map((k) => (
            <div key={k} className="tile">
              <div className="tile-title">{CHANNELS[k].title}</div>
              <div className="tile-text">{CHANNELS[k].text}</div>
              <div className="card-note" style={{ fontWeight: 700 }}>
                {CHANNELS[k].price}
              </div>
            </div>
          ))}
        </div>
      </section>
      {toast}
    </div>
  );
}
