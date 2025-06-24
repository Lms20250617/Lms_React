
export interface INtotice {
  noticeId: number;
  loginId: string;
  noticeTitle: string;
  noticeContent: string;
  regDate: string;
}

export interface INtoticeDetail extends INtotice {
  noticeContent: string;
  fileName: string;
  fileExt: string;
  fileSize: number;
  physicalPath: string;
  logicalPath: string;
}

export interface INoticeResponse {
  count : number;
  list : INtotice[];
  
}