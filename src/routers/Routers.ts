import { Counsel } from './../pages/manage/Counsel';
import { Notice } from './../pages/Support/Notice';
import { Material } from './../pages/Support/Material';
import { Dashboard } from '../pages/Dashboard';
import { NotFound } from '../pages/Error/NotFound/NotFound';
import { Login } from './../pages/Login';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { Classroom } from '../pages/System/Classroom';
import { TestInfo } from '../pages/Lecture/Test/TestInfo';
import { Test } from '../pages/Lecture/Test/Test';
import { List } from '../pages/Lecture/List';
import { Equipment } from '../pages/System/Equipment';
import { Survey } from '../pages/Support/Survey';
import { SurveyManage } from '../pages/Support/SurveyManage';
import { ManageList } from '../pages/Lecture/ManageList';
import { Student } from '../pages/manage/Student';
import { Tutor } from '../pages/manage/Tutor';
import { Company } from '../pages/System/Company';
import { commoncode } from '../pages/System/commoncode';
import { Attendance } from '../pages/Lecture/attendance/Attendance';

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
          {
            path: 'lecture-survey',
            Component: Survey,
          },
          {
            path: 'manage-survey',
            Component: SurveyManage,
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
          {
            path: 'student',
            Component: Student,
          },
          {
            path: 'tutor',
            Component: Tutor,
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
          {
            path: 'lecture-manage-list',
            Component: ManageList,
          },
          {
            path: 'test',
            Component: Test,
          },
          {
            path: 'test-info',
            Component: TestInfo,
          },
          {
            path: 'attendance',
            Component: Attendance,
          },
        ],
      },
      // 여기에 page 추가
      {
        path: 'system',
        children: [
          {
            path: 'classroom',
            Component: Classroom,
          },
          {
            path: 'company',
            Component: Company,
          },
          {
            path: 'commoncode',
            Component: commoncode,
          },
          {
            path: 'equipment',
            Component: Equipment,
          },
        ],
      },
      // 여기에 page 추가
    ],
  },
];

export const Routers = createBrowserRouter(routers);
