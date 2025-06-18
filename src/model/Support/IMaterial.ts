import type { IClassList } from "../manage/ICounsel";


export interface IMaterial {
  materiId: number;
  lecName: string;
  loginId: string;
  materiTitle: string;
  writer: string;
  materiDate: string;
}

export interface IMaterialDetail extends IMaterial {
  materiContent: string;
  lecId: number;
  fileName: string;
  fileExt: string;
  fileSize: number;
  physicalPath: string;
  logicalPath: string;
}

export interface IMaterialResponse {
  mtrCnt : number;
  mtrList : IMaterial[];
  lectures: IClassList[];
  
}