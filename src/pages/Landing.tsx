import { useState } from 'react';
import { Link } from 'react-router-dom';
import Chips from '../components/Chips';
import HeroStore from '../components/HeroStore';
import PlusIcon from '../components/PlusIcon';
import PublicHeader from '../components/PublicHeader';
import blueMark from '../assets/digipay-blue.png';
import aboutApp from '../assets/about-app.jpg';
import digikala from '../assets/digikala.png';
import { MERCHANTS, PANEL_CARDS, SERVICE_CATEGORIES, SERVICES, STATS, TESTIMONIALS, type ServiceCategory } from '../lib/landing';
import { merchantLogo } from '../lib/merchants';

type ServiceFilter = 'all' | ServiceCategory;

const PER_PAGE = 3;

export default function Landing() {
  const [filter, setFilter] = useState<ServiceFilter>('all');
  const [open, setOpen] = useState<string | null>('early-settlement');
  const [page, setPage] = useState(0);

  const services = SERVICES.filter((s) => filter === 'all' || s.category === filter);
  const pages = Math.ceil(TESTIMONIALS.length / PER_PAGE);
  const shown = TESTIMONIALS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div className="pub">
      <PublicHeader />

      <main>
        {/* Hero */}
        <section className="pub-section hero">
          <div className="hero-text">
            <span className="badge badge-blue hero-eyebrow">ویژه فروشندگان دیجی‌کالا و دیجی‌پی</span>
            <h1 className="hero-title">بانکداری کسب‌وکار، بر پایه فروشی که همین حالا دارید.</h1>
            <p className="hero-lead">
              یک حساب برای فروشگاه شما: کارت کسب‌وکار از روز اول، اعتباری متناسب با سابقه واقعی تراکنش‌هایتان، و تسویه پول‌تان هر وقت
              که لازمش دارید، نه هر وقت که دوره تسویه می‌گوید.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary btn-lg">
                در دیجی‌کالا فروشنده هستم
              </Link>
              <Link to="/signup" className="btn btn-secondary btn-lg">
                فروشنده جدید هستم
              </Link>
            </div>
          </div>
          <HeroStore />
        </section>

        {/* Stats */}
        <section className="pub-section">
          <div className="stats-card">
            <div className="stats-card-head">
              <img src={blueMark} alt="دیجی‌پی" />
              <span>در یک نگاه</span>
            </div>
            <div className="stats-grid">
              {STATS.map((s) => (
                <div key={s.label} className="stats-item">
                  <div className="stats-value">{s.value}</div>
                  <div className="stats-unit">{s.unit}</div>
                  <div className="stats-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Merchants */}
        <section className="pub-section" aria-labelledby="merchants-title">
          <div className="merchants-head">
            <div>
              <div className="section-kicker" style={{ color: 'var(--text-2)' }}>در شبکه دیجی‌پی می‌فروشند</div>
              <h2 id="merchants-title" className="section-title-sm">
                از سالن زیبایی تا هایپرمارکت، کسب‌وکارهایی مثل شما
              </h2>
            </div>
            <div className="family-pill">
              <span>عضو خانواده</span>
              <img src={blueMark} alt="دیجی‌پی" style={{ height: 20 }} />
              <span>و</span>
              <img src={digikala} alt="دیجی‌کالا" style={{ height: 18 }} />
            </div>
          </div>
          <ul className="merchants">
            {MERCHANTS.map((m) => (
              <li key={m.file}>
                <img src={merchantLogo(m.file)} alt="" className="merchant-logo" />
                <span>{m.name}</span>
              </li>
            ))}
            <li>
              <Link to="/signup" className="merchant-you">
                <span className="merchant-logo merchant-logo-you" aria-hidden="true">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h16l1.5 5a3 3 0 0 1-5.5 1.5A3 3 0 0 1 12 12a3 3 0 0 1-4-1.5A3 3 0 0 1 2.5 9L4 4zm1 9.5V20h5v-4h4v4h5v-6.5a4.5 4.5 0 0 1-3-.9 4.4 4.4 0 0 1-4 .9 4.4 4.4 0 0 1-4-.9 4.5 4.5 0 0 1-3 .9z" />
                  </svg>
                </span>
                <span>فروشگاه شما؟</span>
              </Link>
            </li>
          </ul>
        </section>

        {/* About */}
        <section id="about" className="pub-section">
          <div className="about">
            <div className="about-text">
              <div className="section-kicker" style={{ color: 'var(--blue-soft)' }}>
                ما که هستیم
              </div>
              <h2 className="section-title" style={{ color: '#fff' }}>
                توان کسب‌وکارهای کوچک را چند برابر می‌کنیم.
              </h2>
              <p>
                کسب‌وکارهای کوچک و متوسط ستون اقتصاد آنلاین ایران‌اند، اما بانک‌های سنتی آن‌ها را با وثیقه و کاغذبازی می‌سنجند، نه با نحوه
                واقعی فروش‌شان. دیجی‌پی بیزینس خانه مالی فروشندگان شبکه دیجی‌کالا و دیجی‌پی است: سابقه فروشی را که از قبل نزد ما دارید
                می‌خوانیم و آن را به کارت، اعتبار و نقدینگی سریع‌تر تبدیل می‌کنیم.
              </p>
            </div>
            <img src={aboutApp} alt="اپ دیجی‌پی بیزینس روی گوشی: موجودی کیف پول کسب‌وکار، تسویه زودهنگام و تراکنش‌های اخیر" className="about-photo" />
          </div>
        </section>

        {/* Who */}
        <section id="who" className="pub-section">
          <div className="section-kicker">برای چه کسانی</div>
          <h2 className="section-title">دو مسیر ورود. یک حساب.</h2>
          <p className="section-lead">سابقه شما در شبکه تعیین می‌کند که از روز اول به چه خدماتی دسترسی دارید.</p>
          <div className="who-grid">
            <article className="who-card">
              <span className="badge badge-blue">فروشندگان فعلی دیجی‌کالا و دیجی‌پی</span>
              <h3>سابقه فروش شما، رتبه اعتباری شماست.</h3>
              <p className="muted">با دست‌کم ۶ ماه تراکنش در شبکه، به‌صورت خودکار اعتبارسنجی می‌شوید. بدون دنبال وثیقه گشتن، بدون مراجعه حضوری.</p>
              <ol className="who-steps">
                <li>
                  <span>
<strong>حساب فروشندگی خود را متصل کنید.</strong> با رضایت شما، سابقه تراکنش‌هایتان را دریافت می‌کنیم.
</span>
                </li>
                <li>
                  <span>
<strong>پیشنهاد خود را بگیرید.</strong> سقف کارت اعتباری و مبلغ وام، متناسب با فروش شما.
</span>
                </li>
                <li>
                  <span>
<strong>از همه خدمات استفاده کنید.</strong> کارت، اعتبار، وام، تسویه زودهنگام و ابزارها، همه با هم.
</span>
                </li>
              </ol>
              <Link to="/login" className="btn btn-primary btn-lg" style={{ alignSelf: 'flex-start' }}>
                مشاهده پیشنهاد من
              </Link>
            </article>
            <article className="who-card">
              <span className="badge badge-gold">فروشندگان جدید</span>
              <h3>همین امروز فروش را شروع کنید. با رشدتان، اعتبار بگیرید.</h3>
              <p className="muted">برای عضویت در شبکه درخواست دهید؛ حساب کسب‌وکار شما همراه با آن باز می‌شود.</p>
              <ol className="who-timeline">
                <li>
                  <span className="kicker">روز اول</span>
                  کارت کسب‌وکار + کیف پول کسب‌وکار (B-Wallet)؛ کارت نقدی متصل به کیف پول فروش شما.
                </li>
                <li>
                  <span className="kicker">هر زمان، با ارائه مدارک</span>
                  وام کسب‌وکار، با ارائه اظهارنامه مالیاتی و صورت‌حساب درآمد.
                </li>
                <li className="done">
                  <span className="kicker">ماه ششم</span>
                  کارت اعتباری کسب‌وکار، بر اساس ۶ ماه اول فروش شما.
                </li>
              </ol>
              <Link to="/signup" className="btn btn-dark btn-lg" style={{ alignSelf: 'flex-start' }}>
                درخواست عضویت به‌عنوان فروشنده
              </Link>
            </article>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="pub-section">
          <div className="services-head">
            <div>
              <div className="section-kicker">خدمات</div>
              <h2 className="section-title">هر آنچه پول فروشگاه‌تان نیاز دارد.</h2>
              <p className="section-lead">روی + هر خدمت بزنید تا ببینید چطور کار می‌کند، چه کسانی می‌توانند از آن استفاده کنند و هزینه‌اش چقدر است.</p>
            </div>
            <Chips
              label="دسته خدمات"
              value={filter}
              onChange={setFilter}
              options={[{ value: 'all', label: 'همه خدمات' }, ...(Object.keys(SERVICE_CATEGORIES) as ServiceCategory[]).map((k) => ({ value: k, label: SERVICE_CATEGORIES[k] }))]}
            />
          </div>
          <div className="acc-list">
            {services.map((s) => {
              const isOpen = open === s.id;
              return (
                <article key={s.id} className={`acc-item${isOpen ? ' open' : ''}`}>
                  <button type="button" className="acc-head" aria-expanded={isOpen} aria-controls={`svc-${s.id}`} onClick={() => setOpen(isOpen ? null : s.id)}>
                    <span className="acc-cat">{SERVICE_CATEGORIES[s.category]}</span>
                    <span className="acc-main">
                      <span className="acc-title">
                        {s.title}
                        {s.badge && <span className={`badge badge-sm badge-${s.badge.tone}`}>{s.badge.label}</span>}
                      </span>
                      <span className="acc-sub">{s.summary}</span>
                    </span>
                    <span className="acc-icon">
                      <PlusIcon open={isOpen} />
                    </span>
                  </button>
                  {isOpen && (
                    <div id={`svc-${s.id}`} className="acc-body svc-body">
                      <div className="svc-desc">
                        <p>{s.body}</p>
                        <div className="svc-who">
                          <div className="muted" style={{ fontSize: 13 }}>
                            چه کسانی می‌توانند استفاده کنند
                          </div>
                          <div>{s.who}</div>
                        </div>
                        {s.cta && (
                          <Link to={s.cta.to} className="btn btn-dark" style={{ alignSelf: 'flex-start' }}>
                            {s.cta.label}
                          </Link>
                        )}
                      </div>
                      <table className="svc-terms">
                        <caption>نرخ‌ها و شرایط</caption>
                        <tbody>
                          {s.terms.map(([k, v]) => (
                            <tr key={k}>
                              <th scope="row">{k}</th>
                              <td>{v}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Panel preview */}
        <section id="panel" className="pub-section">
          <div className="section-kicker">نگاهی به پنل</div>
          <h2 className="section-title">همه پول فروشگاه، در یک پنل.</h2>
          <p className="section-lead">روی هر بخش بزنید تا نمونه آن را ببینید.</p>
          <div className="panel-grid">
            {PANEL_CARDS.map((c) => (
              <Link key={c.to} to={c.to} className="panel-card">
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <span className="link-arrow">مشاهده نمونه ←</span>
              </Link>
            ))}
            <Link to="/faq" className="panel-card panel-card-dark">
              <h3>سوالات متداول</h3>
              <p>هزینه ثبت‌نام، مدارک، تسویه، وام و مالیات.</p>
              <span className="link-arrow">مشاهده سوال‌ها ←</span>
            </Link>
          </div>
        </section>

        {/* Testimonials */}
        <section className="pub-section" aria-labelledby="reviews-title">
          <div className="section-kicker">نظر فروشندگان</div>
          <div className="reviews-head">
            <div>
              <h2 id="reviews-title" className="section-title">
                از زبان کسانی که استفاده کرده‌اند.
              </h2>
              <div className="rating">
                <span className="stars" aria-hidden="true">
                  ★★★★★
                </span>
                <strong>[میانگین] از ۵</strong>
                <span className="muted">· بر اساس [تعداد] نظر فروشندگان</span>
              </div>
            </div>
            <div className="reviews-nav">
              <span className="badge badge-gold">نمونه: با نظرهای واقعی جایگزین شود</span>
              <button type="button" className="round-btn" aria-label="قبلی" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
              <button type="button" className="round-btn round-btn-dark" aria-label="بعدی" disabled={page === pages - 1} onClick={() => setPage((p) => p + 1)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
            </div>
          </div>
          <div className="reviews" aria-live="polite">
            {shown.map((t) => (
              <article key={t.name} className="review">
                <div className="review-who">
                  <img src={merchantLogo(t.merchant)} alt="" className="merchant-logo" style={{ width: 64, height: 64 }} />
                  <div>
                    <div className="review-name">{t.name}</div>
                    <div className="muted" style={{ fontSize: 13 }}>
                      فروشنده شبکه از [سال]
                    </div>
                  </div>
                </div>
                <div className="review-meta">
                  <span className="stars" aria-label={`${t.stars} از ۵ ستاره`}>
                    {'★'.repeat(t.stars)}
                    <span style={{ color: '#d5dbe8' }}>{'★'.repeat(5 - t.stars)}</span>
                  </span>
                  <span className="badge badge-sm badge-blue">{t.service}</span>
                </div>
                <p className="review-text">[نظر واقعی فروشنده درباره {t.service}]</p>
                <div className="review-date muted">[تاریخ ثبت نظر]</div>
              </article>
            ))}
          </div>
          <div className="dots" role="tablist" aria-label="صفحه نظرها">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === page}
                aria-label={`صفحه ${i + 1}`}
                className={`dot${i === page ? ' active' : ''}`}
                onClick={() => setPage(i)}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <img src={blueMark} alt="دیجی‌پی" style={{ height: 24 }} />
          <nav aria-label="پیوندهای پایانی">
            <Link to="/faq">سوالات متداول</Link>
            <Link to="/signup">افتتاح حساب</Link>
            <Link to="/login">ورود</Link>
          </nav>
          <span className="muted">نسخه پیش‌نمایش؛ اعداد و نرخ‌ها نمونه هستند.</span>
        </div>
      </footer>
    </div>
  );
}
