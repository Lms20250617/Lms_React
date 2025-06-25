export interface IResume {
  lecId: number;
  lecName: string;
  lectureRound: number;
  tutorId: string;
  tutorName: string;
  lecStartDate: string;
  lecEndDate: string;
  lecPersonnel: number;
}

export interface IResumeResponse {
  resumeLectureCnt: number;
  resumeLectureList: IResume[];
}

export interface ICompanyInfo {
  companyId: string;
  companyName: string;
  companyCeo: string;
  companyHp: string;
  companyLoc: string;
  companyEmail: string;
  companyRegDate: string;
}
