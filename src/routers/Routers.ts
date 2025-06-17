import { Notice } from './../pages/Support/Notice';
import { Dashboard } from '../pages/Dashboard';
import { NotFound } from '../pages/Error/NotFound/NotFound';
import { Login } from './../pages/Login';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';

const routers: RouteObject[] = [
  { path: '/', Component: Login },
  {
    path: '*', // 모든 매칭되지 않는 경로에 대해
    Component: NotFound,
  },
  {
    path: '/react',
    Component: Dashboard,
    children: [
      {
        path: 'support',
        children: [
          {
            path: 'notice',
            Component: Notice,
          },
        ],
      },
    ],
  },
];

export const Routers = createBrowserRouter(routers);
