

export interface ICounsel {
  counselId: number;
  lecName: string;
  counselTitle: string;
  counselContent: string;
  counselRegDate: string;
  counselStudentName: string;
}

export interface ICounselDetail extends ICounsel {
    lecId: number;
}

export interface IClassList {
    lecId: number;
    lecName: string;
}

export interface ICounselResponse {
  counselCnt : number;
  counselList : ICounsel[];
  lectures: IClassList[];
}