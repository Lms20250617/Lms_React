export type AttendState = 'E' | 'L' | 'F' | 'J' | undefined | null;

export interface IAttendance {
  lecId: number;
  lecName: string;
  lecPersonnel: number;
  lecStartDate: number;
  lecEndDate: number;
  attendStartdate: number | null;
  attendEnddate: number;
  attendState: AttendState;
  loginID: string;
  roomName: string;
}

export interface IAttendanceResponse {
  count: number;
  list: IAttendance[];
}
