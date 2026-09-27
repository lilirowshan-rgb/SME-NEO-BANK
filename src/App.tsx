import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoanPage from './pages/LoanPage';
import PlaceholderPage from './pages/PlaceholderPage';
import { NAV_ITEMS } from './lib/nav';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/loan" replace />} />
          <Route path="/loan" element={<LoanPage />} />
          {NAV_ITEMS.filter((item) => item.path !== '/loan').map((item) => (
            <Route key={item.path} path={item.path} element={<PlaceholderPage title={item.label} />} />
          ))}
          <Route path="*" element={<PlaceholderPage title="صفحه پیدا نشد" />} />
        </Routes>
      </main>
    </div>
  );
}
