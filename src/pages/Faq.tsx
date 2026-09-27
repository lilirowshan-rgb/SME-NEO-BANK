import { useState } from 'react';
import Chips from '../components/Chips';
import PlusIcon from '../components/PlusIcon';
import PublicHeader from '../components/PublicHeader';
import { FAQ_CATEGORIES, FAQS, type FaqCategory } from '../lib/faq';

type Filter = 'all' | FaqCategory;

export default function Faq() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<number | null>(0);

  const q = query.trim();
  const visible = FAQS.map((f, i) => ({ ...f, i })).filter(
    (f) => (filter === 'all' || f.category === filter) && (!q || f.q.includes(q) || f.a.includes(q)),
  );

  return (
    <div className="pub">
      <PublicHeader variant="compact" />
      <main className="faq">
        <div className="faq-hero">
          <h1>سوالات متداول</h1>
          <p className="muted" style={{ fontSize: 17 }}>
            پرتکرارترین سوال‌های فروشندگان، با پاسخ کوتاه.
          </p>
          <label className="field faq-search">
            <span className="field-label" style={{ fontSize: 14 }}>
              جستجو در سوال‌ها
            </span>
            <input type="search" className="input" placeholder="مثلاً: تسویه، مدارک، وام" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <Chips
            label="دسته سوال‌ها"
            value={filter}
            onChange={setFilter}
            options={[{ value: 'all', label: 'همه' }, ...(Object.keys(FAQ_CATEGORIES) as FaqCategory[]).map((k) => ({ value: k, label: FAQ_CATEGORIES[k] }))]}
          />
        </div>

        <div className="acc-list" aria-live="polite">
          {visible.map((f) => {
            const isOpen = open === f.i;
            return (
              <article key={f.i} className={`acc-item${isOpen ? ' open' : ''}`}>
                <button type="button" className="acc-head" aria-expanded={isOpen} aria-controls={`faq-${f.i}`} onClick={() => setOpen(isOpen ? null : f.i)}>
                  <span className="acc-cat">{FAQ_CATEGORIES[f.category]}</span>
                  <span className="acc-main">
                    <span className="acc-title" style={{ fontSize: 18 }}>
                      {f.q}
                    </span>
                  </span>
                  <span className="acc-icon">
                    <PlusIcon open={isOpen} />
                  </span>
                </button>
                {isOpen && (
                  <div id={`faq-${f.i}`} className="acc-body">
                    <p className="faq-answer">{f.a}</p>
                  </div>
                )}
              </article>
            );
          })}
          {visible.length === 0 && (
            <p className="muted" style={{ textAlign: 'center', padding: 24 }}>
              سوالی با این عبارت پیدا نشد.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
