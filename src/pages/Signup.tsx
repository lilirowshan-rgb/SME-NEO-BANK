import { useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { isValidSheba } from '../lib/cash';
import { fa } from '../lib/format';
import { isValidJalaliDate, isValidMobile, isValidNationalCode } from '../lib/validation';

const STEPS = ['احراز هویت', 'کسب‌وکار', 'کانال فروش', 'حساب بانکی', 'مدارک', 'طرح و قرارداد'];

type Errors = Record<string, string>;

function Field({ name, label, error, children }: { name: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      {children}
      {error && (
        <span id={`${name}-error`} className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}

function inputProps(name: string, errors: Errors) {
  return {
    id: name,
    name,
    className: 'input',
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  };
}

/** Validates the current step's form data; returns field errors (empty when valid). */
function validate(step: number, data: FormData): Errors {
  const v = (k: string) => String(data.get(k) ?? '').trim();
  const e: Errors = {};
  if (step === 0) {
    if (!isValidNationalCode(v('nationalCode'))) e.nationalCode = 'کد ملی معتبر نیست.';
    if (!isValidMobile(v('mobile'))) e.mobile = 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.';
    if (!isValidJalaliDate(v('birthDate'))) e.birthDate = 'تاریخ را به شکل ۱۳۶۵/۰۴/۱۲ وارد کنید.';
    if (v('password').length < 8) e.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد.';
  } else if (step === 1) {
    if (!v('businessName')) e.businessName = 'نام کسب‌وکار را وارد کنید.';
    if (!v('category')) e.category = 'دسته‌بندی را انتخاب کنید.';
  } else if (step === 2) {
    if (data.getAll('channels').length === 0) e.channels = 'حداقل یک کانال فروش را انتخاب کنید.';
  } else if (step === 3) {
    if (!isValidSheba(v('sheba'))) e.sheba = 'شماره شبا معتبر نیست (IR و ۲۴ رقم).';
  } else if (step === 5) {
    if (!data.get('agree')) e.agree = 'برای ادامه باید قرارداد را بپذیرید.';
  }
  return e;
}

export default function Signup() {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  const [entity, setEntity] = useState<'legal' | 'natural'>('legal');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(step, new FormData(e.currentTarget));
    setErrors(found);
    if (Object.keys(found).length > 0) {
      e.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    if (step === STEPS.length - 1) setDone(true);
    else setStep(step + 1);
  };

  return (
    <div className="pub">
      <header className="signup-bar">
        <div className="pub-header-inner">
          <Logo />
          <div className="pub-actions" style={{ gap: 16 }}>
            <span className="muted signup-hint" style={{ fontSize: 14 }}>
              قبلاً فروشنده دیجی‌کالا بوده‌اید؟
            </span>
            <Link to="/login" className="btn btn-secondary btn-sm">
              ورود با حساب موجود
            </Link>
          </div>
        </div>
      </header>

      <div className="signup">
        <div className="signup-main">
          <div>
            <h1>افتتاح حساب کسب‌وکار</h1>
            <p className="muted" style={{ marginTop: 8, fontSize: 15 }}>
              حدود ۱۰ دقیقه. ثبت‌نام رایگان است و فقط توسط خود صاحب کسب‌وکار انجام می‌شود.
            </p>
          </div>

          <p className="step-count" aria-hidden="true">
            مرحله {fa(Math.min(step + 1, STEPS.length))} از {fa(STEPS.length)} · {done ? 'ثبت شد' : STEPS[step]}
          </p>
          <ol aria-label="مراحل ثبت‌نام" className="stepper">
            {STEPS.map((label, i) => {
              const state = done || i < step ? 'done' : i === step ? 'current' : 'todo';
              return (
                <li key={label} className={`stepper-item stepper-${state}`} aria-current={i === step && !done ? 'step' : undefined}>
                  <div className="stepper-bar" />
                  <div className="stepper-label">
                    {fa(i + 1)}. {label}
                  </div>
                </li>
              );
            })}
          </ol>

          {done ? (
            <section className="card" style={{ padding: 36, alignItems: 'flex-start', gap: 16 }}>
              <span className="badge badge-green">درخواست ثبت شد</span>
              <h2 className="card-title" style={{ fontSize: 24 }}>
                حساب کسب‌وکار شما در حال بررسی است
              </h2>
              <p className="muted" style={{ lineHeight: 1.9 }}>
                نتیجه بررسی مدارک حداکثر ظرف ۲ روز کاری پیامک می‌شود. کیف پول کسب‌وکار و کارت نقدی شما پس از تأیید فعال می‌شود.
              </p>
              <Link to="/dashboard" className="btn btn-primary">
                مشاهده نمونه پنل
              </Link>
            </section>
          ) : (
            <form className="card" style={{ padding: 36, gap: 22 }} onSubmit={submit} noValidate key={step}>
              {step === 0 && (
                <>
                  <h2 className="card-title">احراز هویت صاحب کسب‌وکار</h2>
                  <div className="form-grid">
                    <Field name="nationalCode" label="کد ملی" error={errors.nationalCode}>
                      <input {...inputProps('nationalCode', errors)} inputMode="numeric" dir="ltr" placeholder="0012345678" maxLength={10} />
                    </Field>
                    <Field name="mobile" label="شماره موبایل (به نام خودتان)" error={errors.mobile}>
                      <input {...inputProps('mobile', errors)} inputMode="tel" dir="ltr" placeholder="0912 345 6789" autoComplete="tel" />
                    </Field>
                    <Field name="birthDate" label="تاریخ تولد" error={errors.birthDate}>
                      <input {...inputProps('birthDate', errors)} dir="ltr" placeholder="۱۳۶۵/۰۴/۱۲" />
                    </Field>
                    <Field name="password" label="رمز عبور" error={errors.password}>
                      <input {...inputProps('password', errors)} type="password" placeholder="حداقل ۸ کاراکتر" autoComplete="new-password" />
                    </Field>
                  </div>
                  <p className="card-note">کد تأیید به شماره موبایل ارسال می‌شود. شماره باید با کد ملی مطابقت داشته باشد.</p>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="card-title">اطلاعات کسب‌وکار</h2>
                  <div className="form-grid">
                    <label className="option-card">
                      <input type="radio" name="entity" value="legal" checked={entity === 'legal'} onChange={() => setEntity('legal')} />
                      <span>
                        شخص حقوقی
                        <small>شرکت ثبت‌شده با شناسه ملی</small>
                      </span>
                    </label>
                    <label className="option-card">
                      <input type="radio" name="entity" value="natural" checked={entity === 'natural'} onChange={() => setEntity('natural')} />
                      <span>
                        شخص حقیقی
                        <small>کسب‌وکار با مجوز یا پروانه به نام خودتان</small>
                      </span>
                    </label>
                    <Field name="businessName" label={entity === 'legal' ? 'نام ثبتی شرکت' : 'نام کسب‌وکار'} error={errors.businessName}>
                      <input {...inputProps('businessName', errors)} placeholder="[نام فروشگاه]" />
                    </Field>
                    <Field name="category" label="دسته‌بندی" error={errors.category}>
                      <select {...inputProps('category', errors)} defaultValue="">
                        <option value="" disabled>
                          انتخاب کنید
                        </option>
                        <option>لوازم خانگی کوچک</option>
                        <option>مد و پوشاک</option>
                        <option>آرایشی و بهداشتی</option>
                        <option>کالای دیجیتال</option>
                        <option>خوراکی و سوپرمارکت</option>
                        <option>سایر</option>
                      </select>
                    </Field>
                    {entity === 'legal' && (
                      <Field name="companyId" label="شناسه ملی شرکت">
                        <input {...inputProps('companyId', errors)} inputMode="numeric" dir="ltr" placeholder="14009876543" />
                      </Field>
                    )}
                    <Field name="postalCode" label="کد پستی">
                      <input {...inputProps('postalCode', errors)} inputMode="numeric" dir="ltr" placeholder="1433876541" />
                    </Field>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="card-title">کانال‌های فروش</h2>
                  <p className="muted">کجا می‌فروشید؟ همه موارد را انتخاب کنید.</p>
                  <div className="form-grid">
                    {[
                      ['digikala', 'دیجی‌کالا', 'فروشنده یا متقاضی فروش در مارکت‌پلیس'],
                      ['website', 'سایت فروشگاهی', 'با درگاه دیجی‌پی یا درگاه دیگر'],
                      ['social', 'اینستاگرام و شبکه‌های اجتماعی', 'فروش با لینک پرداخت'],
                      ['store', 'فروشگاه حضوری', 'با کارتخوان یا QR دیجی‌پی'],
                    ].map(([value, title, sub]) => (
                      <label key={value} className="option-card">
                        <input type="checkbox" name="channels" value={value} defaultChecked={value === 'digikala'} />
                        <span>
                          {title}
                          <small>{sub}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.channels && <span className="field-error">{errors.channels}</span>}
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="card-title">حساب بانکی</h2>
                  <Field name="sheba" label="شماره شبا (به نام صاحب کسب‌وکار)" error={errors.sheba}>
                    <input {...inputProps('sheba', errors)} dir="ltr" placeholder="IR00 0000 0000 0000 0000 0000 00" />
                  </Field>
                  <p className="card-note">برداشت از کیف پول کسب‌وکار فقط به همین حساب و حساب‌های تأییدشده بعدی ممکن است.</p>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="card-title">بارگذاری مدارک</h2>
                  <p className="muted">فایل تصویر یا PDF. مدارکی که قبلاً به دیجی‌کالا داده‌اید لازم نیست دوباره بارگذاری شوند.</p>
                  <div className="form-grid">
                    {(entity === 'legal'
                      ? ['کارت ملی صاحب امضا', 'روزنامه رسمی و آخرین تغییرات', 'کد رهگیری پرونده مالیاتی', 'مجوز فعالیت']
                      : ['کارت ملی', 'مجوز یا پروانه کسب', 'کد رهگیری پرونده مالیاتی', 'ای‌نماد (برای فروش آنلاین)']
                    ).map((d, i) => (
                      <Field key={d} name={`doc${i}`} label={d}>
                        <input id={`doc${i}`} name={`doc${i}`} type="file" accept="image/*,application/pdf" className="input" style={{ paddingTop: 14 }} />
                      </Field>
                    ))}
                  </div>
                </>
              )}

              {step === 5 && (
                <>
                  <h2 className="card-title">طرح و قرارداد</h2>
                  <div className="form-grid">
                    <label className="option-card">
                      <input type="radio" name="plan" value="start" defaultChecked />
                      <span>
                        طرح شروع
                        <small>کیف پول و کارت کسب‌وکار، تسویه زودهنگام، پرداخت قبوض. اشتراک: [X] تومان</small>
                      </span>
                    </label>
                    <label className="option-card">
                      <input type="radio" name="plan" value="growth" />
                      <span>
                        طرح رشد
                        <small>همه امکانات طرح شروع + حسابداری، مالیات و بینش کسب‌وکار. اشتراک: [X] تومان</small>
                      </span>
                    </label>
                  </div>
                  <div className="contract" style={{ height: 160, overflowY: 'auto', padding: 18, borderRadius: 14, border: '1.5px solid var(--border)', background: '#f9fafc', fontSize: 14, lineHeight: 2, color: 'var(--text-2)' }} tabIndex={0}>
                    [متن قرارداد افتتاح حساب کسب‌وکار: طرفین، خدمات، کارمزدها، تعهدات و حریم خصوصی. متن نهایی باید توسط تیم حقوقی تهیه شود.]
                  </div>
                  <label className="option-card" style={{ borderStyle: errors.agree ? 'solid' : undefined, borderColor: errors.agree ? 'var(--red)' : undefined }}>
                    <input type="checkbox" name="agree" aria-invalid={Boolean(errors.agree)} />
                    <span>قرارداد و قوانین را خواندم و می‌پذیرم.</span>
                  </label>
                  {errors.agree && <span className="field-error">{errors.agree}</span>}
                </>
              )}

              <div className="form-actions">
                {step > 0 ? (
                  <button type="button" className="btn btn-secondary" onClick={() => { setErrors({}); setStep(step - 1); }}>
                    مرحله قبل
                  </button>
                ) : (
                  <span />
                )}
                <button type="submit" className="btn btn-primary" style={{ minWidth: 110 }}>
                  {step === STEPS.length - 1 ? 'ثبت درخواست' : 'ادامه'}
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="grid" style={{ gap: 18 }}>
          <section className="card">
            <h2 className="card-title">مدارک لازم ({entity === 'legal' ? 'حقوقی' : 'حقیقی'})</h2>
            <ul className="doc-list">
              {entity === 'legal' ? (
                <>
                  <li>کارت ملی صاحب امضا</li>
                  <li>روزنامه رسمی و آگهی تأسیس / آخرین تغییرات</li>
                  <li>کد رهگیری پرونده مالیاتی و کد اقتصادی</li>
                  <li>مجوز فعالیت</li>
                </>
              ) : (
                <>
                  <li>کارت ملی</li>
                  <li>مجوز یا پروانه کسب</li>
                  <li>کد رهگیری پرونده مالیاتی</li>
                </>
              )}
              <li>ای‌نماد (برای فروش آنلاین)</li>
              <li>برای وام: اظهارنامه مالیاتی و صورت‌های مالی</li>
            </ul>
            <p className="card-note" style={{ borderTop: '1px solid var(--divider)', paddingTop: 12 }}>
              کد پستی و دسته‌بندی کسب‌وکار باید در همه مدارک یکسان باشد.
            </p>
          </section>
          <section className="card card-dark">
            <h2 className="card-title">بعد از ثبت‌نام چه می‌گیرید؟</h2>
            <div style={{ fontSize: 15, lineHeight: 2 }}>
              <div>
                <strong>روز اول:</strong> کیف پول کسب‌وکار + کارت نقدی
              </div>
              <div>
                <strong>با مدارک مالی:</strong> امکان درخواست وام
              </div>
              <div>
                <strong>ماه ششم:</strong> کارت اعتباری کسب‌وکار
              </div>
            </div>
            <Link to="/faq" style={{ color: 'var(--blue-soft)', fontWeight: 700 }}>
              سوالی دارید؟ سوالات متداول
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
