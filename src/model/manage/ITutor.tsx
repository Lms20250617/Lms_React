export interface ITutorList {
  insHp: string;
  insName: string;
  insNumber: string;
  insRegDate: string;
  insStatusYn: string;
  insId: string;
}

export interface ITutorListResponse {
  count: number;
  list: ITutorList[];
}

export interface ILectureInfo {
  lecId: string;
  tutorId: string;
  lecName: string;
  lecStartDate: string;
  lecEndDate: string;
}

export interface ITutorDetail extends ITutorList {
  lectureInfo: ILectureInfo[];
  insAccount: string;
  insBank: string;
  insEmail: string;
}
