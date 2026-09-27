import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function PanelLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
