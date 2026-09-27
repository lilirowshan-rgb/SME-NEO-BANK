import { Link } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';

export default function NotFound() {
  return (
    <div className="pub">
      <PublicHeader variant="compact" />
      <main className="faq" style={{ textAlign: 'center', alignItems: 'center' }}>
        <h1 className="section-title">صفحه پیدا نشد</h1>
        <Link to="/" className="btn btn-primary">
          بازگشت به صفحه اصلی
        </Link>
      </main>
    </div>
  );
}
