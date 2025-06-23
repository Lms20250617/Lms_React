export interface IResume {
  lecId: number;
  lecName: string;
  lectureRound: number;
  tutorId: number;
  tutorName: string;
  lecStartDate: string;
  lecEndDate: string;
  lecPersonnel: number;
}

export interface IResumeResponse {
  resumeLectureCnt: number;
  resumeLectureList: IResume[];
}
