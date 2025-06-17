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

export interface IListResponse {
  count: number;
  list: IList[];
}
