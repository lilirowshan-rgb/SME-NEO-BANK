import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { STORE } from '../lib/store';

const SHARED = [
  'اطلاعات هویتی و کسب‌وکار ثبت‌شده',
  'سابقه تراکنش‌ها و تسویه‌ها',
  'نرخ مرجوعی و امتیاز عملکرد فروشنده',
  'مدارک بارگذاری‌شده قبلی (بدون نیاز به ارسال دوباره)',
];

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="login">
      <div className="login-side">
        <Logo />
        <div className="login-form">
          <h1>حساب شما پیدا شد</h1>
          <p className="muted" style={{ fontSize: 15, lineHeight: 1.9 }}>
            برای ساخت پیشنهاد اعتباری، اجازه دهید این اطلاعات از شبکه خوانده شود:
          </p>
          <div className="login-store">
            <span className="logo-slot">[لوگو]</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{STORE.name}</div>
              <div className="muted" style={{ fontSize: 13, lineHeight: 1.8 }}>
                فروشنده دیجی‌کالا · ۳۰ ماه سابقه · پذیرنده دیجی‌پی
              </div>
            </div>
          </div>
          <ul className="checklist">
            {SHARED.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => navigate('/dashboard')}>
            اجازه می‌دهم و وارد پنل می‌شوم
          </button>
          <p className="card-note">این دسترسی را هر زمان از بخش پروفایل می‌توانید قطع کنید.</p>
        </div>
        <p className="card-note">
          با ورود، <Link to="/faq">قوانین و مقررات</Link> و <Link to="/faq">حریم خصوصی</Link> را می‌پذیرید.
        </p>
      </div>

      <section className="login-hero">
        <div className="section-kicker" style={{ color: 'var(--blue-soft)', margin: 0 }}>
          یک حساب، برای کل شبکه
        </div>
        <h2>سابقه فروش شما در دیجی‌کالا، همین حالا به اعتبار تبدیل می‌شود.</h2>
        <div className="feature-grid">
          <div className="feature">
            <strong>ورود یکپارچه</strong>
            <span>همان حساب دیجی‌پی و پنل فروشندگی دیجی‌کالا</span>
          </div>
          <div className="feature">
            <strong>پیشنهاد فوری</strong>
            <span>با ۶ ماه سابقه، سقف اعتبار بلافاصله محاسبه می‌شود</span>
          </div>
          <div className="feature">
            <strong>بدون مدارک تکراری</strong>
            <span>مدارکی که قبلاً داده‌اید دوباره خواسته نمی‌شود</span>
          </div>
          <div className="feature">
            <strong>پشتیبانی فروشندگان</strong>
            <span>
              <Link to="/faq">سوالات متداول</Link> و پشتیبانی تلفنی
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
