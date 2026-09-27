import { Link } from 'react-router-dom';
import { fa } from '../lib/format';
import { quoteSupplierPayment } from '../lib/supplier';

// Worked example shown on the landing page (sample 30% annual discount rate).
const EXAMPLE = quoteSupplierPayment(100_000_000, 60);

const FLOW = [
  { who: 'تأمین‌کننده', text: 'کالا را تحویل می‌دهد و فاکتور ۶۰ روزه صادر می‌کند.' },
  { who: 'فروشگاه شما', text: 'فاکتور را در دیجی‌پی بیزینس تأیید می‌کند.' },
  { who: 'دیجی‌پی', text: `همان روز ${fa(EXAMPLE.supplierReceives)} تومان به تأمین‌کننده می‌پردازد.` },
  { who: 'فروشگاه شما', text: `روز شصتم، مبلغ کامل ${fa(EXAMPLE.merchantPays)} تومان را به دیجی‌پی می‌پردازد.` },
];

export default function ScfSection() {
  return (
    <section id="scf" className="pub-section" aria-labelledby="scf-title">
      <div className="section-kicker">تأمین مالی زنجیره تأمین</div>
      <h2 id="scf-title" className="section-title">
        SCF به زبان ساده: تأمین‌کننده زودتر، شما سر موعد.
      </h2>
      <p className="section-lead">
        در تأمین مالی زنجیره تأمین (Supply Chain Finance)، یک تأمین‌کننده مالی پول فاکتورهای بین خریدار و فروشنده را زودتر از سررسید می‌پردازد و
        مبلغ کامل را در سررسید دریافت می‌کند. تفاوت این دو مبلغ، کارمزد تأمین مالی است. چون ریسک بر اساس اعتبار خریدار سنجیده می‌شود، این روش
        معمولاً از وام کوتاه‌مدت ارزان‌تر است و هیچ‌کدام از طرفین وام جدیدی نمی‌گیرند.
      </p>

      <div className="scf-grid">
        <div className="scf-flow">
          <h3>یک مثال: فاکتور ۱۰۰ میلیونی با مهلت ۶۰ روز</h3>
          <ol>
            {FLOW.map((f, i) => (
              <li key={i}>
                <span className="scf-num">{fa(i + 1)}</span>
                <span>
                  <strong>{f.who}</strong> {f.text}
                </span>
              </li>
            ))}
          </ol>
          <div className="scf-split">
            <div>
              <span>تأمین‌کننده امروز می‌گیرد</span>
              <strong>{fa(EXAMPLE.supplierReceives)}</strong>
            </div>
            <div>
              <span>کارمزد دیجی‌پی</span>
              <strong>{fa(EXAMPLE.discount)}</strong>
            </div>
            <div>
              <span>شما در سررسید می‌پردازید</span>
              <strong>{fa(EXAMPLE.merchantPays)}</strong>
            </div>
          </div>
          <p className="scf-note">ارقام به تومان و با نرخ نمونه ۳۰٪ سالانه [تأیید شود].</p>
        </div>

        <div className="scf-who">
          <div className="scf-card">
            <span className="badge badge-blue">وقتی شما خریدار هستید</span>
            <h3>پرداخت به تأمین‌کننده</h3>
            <p>
              به این شکل «تأمین مالی پرداختنی‌ها» یا فاکتورینگ معکوس می‌گویند. شما مهلت پرداخت می‌گیرید بدون اینکه هزینه اضافه بدهید، و تأمین‌کننده
              به‌جای انتظار چندماهه، پولش را همین امروز می‌گیرد.
            </p>
            <Link to="/suppliers" className="link-arrow">
              نمونه در پنل ←
            </Link>
          </div>
          <div className="scf-card">
            <span className="badge badge-dashed">وقتی شما فروشنده هستید · در حال بررسی</span>
            <h3>تأمین مالی فاکتور</h3>
            <p>
              به این شکل «تنزیل مطالبات» یا فاکتورینگ می‌گویند. اگر به کسب‌وکار دیگری مدت‌دار فروخته‌اید، مطالبه آن فاکتور را واگذار می‌کنید و بخش عمده
              پولتان را همین حالا می‌گیرید.
            </p>
          </div>
        </div>
      </div>

      <div className="scf-faq">
        <div>
          <strong>کارمزد را چه کسی می‌دهد؟</strong>
          <p>در پرداخت به تأمین‌کننده، کارمزد از مبلغ دریافتی تأمین‌کننده کسر می‌شود؛ او در ازای آن پولش را زودتر می‌گیرد. شما همان مبلغ فاکتور را می‌پردازید.</p>
        </div>
        <div>
          <strong>تأمین‌کننده من عضو دیجی‌پی نیست.</strong>
          <p>با ثبت فاکتور، پیامک دعوت برایش ارسال می‌شود. عضویت رایگان است و پس از آن وجه در کیف پول کسب‌وکار خودش واریز می‌شود.</p>
        </div>
        <div>
          <strong>در ایران هم رایج است؟</strong>
          <p>
            بله. بانک مرکزی ابزارهای تأمین مالی زنجیره تأمین مانند «برات الکترونیک»، «گواهی اعتبار مولد (گام)» و دستورالعمل فاکتورینگ مطالبات را به شبکه
            بانکی ابلاغ کرده است.
          </p>
        </div>
      </div>
      <p className="scf-legal">[ساختار حقوقی و شرعی قرارداد (مثلاً خرید دین یا تنزیل مطالبات) و نرخ‌ها باید توسط تیم حقوقی و مالی تأیید شود.]</p>
    </section>
  );
}
