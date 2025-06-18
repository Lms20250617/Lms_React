import { Counsel } from './../pages/manage/Counsel';
import { Notice } from './../pages/Support/Notice';
import { Material } from './../pages/Support/Material';
import { Dashboard } from '../pages/Dashboard';
import { NotFound } from '../pages/Error/NotFound/NotFound';
import { Login } from './../pages/Login';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { TestInfo } from '../pages/Lecture/Test/TestInfo';
import { Test } from '../pages/Lecture/Test/Test';
import { List } from '../pages/Lecture/List';

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
          {
            path: 'learning-materials',
            Component: Material,
          },
        ],
      },
      {
        path: 'manage',
        children: [
          {
            path: 'counsel',
            Component: Counsel,
          },
        ],
      },
      {
        path: 'lecture',
        children: [
          {
            path: 'list',
            Component: List,
          },
        ],
      },
      {
        path: 'lecture',
        children: [
          {
            path: 'test-info',
            Component: TestInfo,
          },
          {
            path: 'test',
            Component: Test,
          },
        ],
      },
    ],
  },
];

export const Routers = createBrowserRouter(routers);
