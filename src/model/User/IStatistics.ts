export interface IStatistics {
  lecId: number;
  lecName: string;
  lectureRound: number;
  tutorId: string;
  lecStartDate: string;
  lecEndDate: string;
  lecPersonnel: number;
}

export interface IStatisticsResponse {
  resumeLectureCnt: number;
  resumeLectureList: IStatistics[];
}

export interface ILecDetailResponse extends IStatistics {
  avgScore: number;
  minScore: number;
  maxScore: number;
  failedStudents: number;
  tutorName: string;
}
