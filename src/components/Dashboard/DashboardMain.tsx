import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { LeftMenuBar } from './LeftMenubar/LeftMenubar';
import './styled.css';

export const DashboardMain = () => {
  return (
    <div className="dashboard-container">
      <ul className="dashboard-ul">
        <li className="menu-bar">{<LeftMenuBar />}</li>
        <li className="content bg-gray-50">
          <Suspense fallback={<h2>Loading.....</h2>}>{<Outlet />}</Suspense>
        </li>
      </ul>
    </div>
  );
};
