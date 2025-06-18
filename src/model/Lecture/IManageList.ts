import type { IManagePlan } from './IManagePlan';

export interface IManageList {
  lecEndDate: string;
  lecId: number;
  lecInstructorName: string;
  lecName: string;
  lecPersonnel: number;
  lecInstructorId: string;
  lecRoomName: string;
  lecStartDate: string;
}

export interface IManageListDetail extends IManageList {
  insEmail: string;
  insHp: string;
  lecContent: string | null;
  lecDaysCnt: number | null;
  lecGoal: string | null;
  lecRoomId: number | null;
  lecSectionCnt: number | null;
  lecSpecifics: string | null;
  lecWeekPlanList: IManagePlan[];
  lecRound: number | null;
}

export interface IManageListResponse {
  lectureManageList: IManageList[];
  lectureManageCnt: number;
}
