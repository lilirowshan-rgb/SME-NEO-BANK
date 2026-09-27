import { Route, Routes } from 'react-router-dom';
import PanelLayout from './components/PanelLayout';
import ScrollManager from './components/ScrollManager';
import Accounting from './pages/Accounting';
import Ads from './pages/Ads';
import Cash from './pages/Cash';
import Dashboard from './pages/Dashboard';
import Faq from './pages/Faq';
import Insights from './pages/Insights';
import Landing from './pages/Landing';
import LoanPage from './pages/LoanPage';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import SupplierJoin from './pages/SupplierJoin';
import Suppliers from './pages/Suppliers';
import Tax from './pages/Tax';

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/join/supplier" element={<SupplierJoin />} />
        <Route element={<PanelLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/loan" element={<LoanPage />} />
          <Route path="/cash" element={<Cash />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/accounting" element={<Accounting />} />
          <Route path="/tax" element={<Tax />} />
          <Route path="/ads" element={<Ads />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
