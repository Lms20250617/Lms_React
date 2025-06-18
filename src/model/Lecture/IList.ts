import type { IManagePlan } from './IManagePlan';

export interface IList {
  courseCntPersonnel: number;
  lecEndDate: string;
  lecId: number;
  lecInstructorName: string;
  lecName: string;
  lecPersonnel: number;
  lecRoomName: string;
  lecStartDate: string;
}

export interface IListDetail extends IList {
  insEmail: string;
  insHp: string;
  lecContent: string | null;
  lecDaysCnt: number | null;
  lecGoal: string | null;
  lecInstructorId: string;
  lecRoomId: number | null;
  lecSectionCnt: number | null;
  lecSpecifics: string | null;
  lecWeekPlanList: IManagePlan[];
  lectureRound: number | null;
}

export interface IListDetailResponse {
  isLectureRegistrationAvailable: boolean;
  lectureDetailValue: IListDetail;
}

export interface IListResponse {
  count: number;
  list: IList[];
}
