export interface IStudentList {
  statusYN: string;
  studentEmpStatus: string;
  studentHp: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  studentRegDate: string;
}

export interface IStudentDetail extends IStudentList {
  lectureInfo: ILectureInfo[];
  studentBirthday: string;
  studentEmail: string;
  statusYn: string;
}

export interface ILectureInfo {
  lecId: number;
  lectureEndDate: number;
  lectureName: string;
  lectureStartDate: number;
}

export interface IStudentListResponse {
  list: IStudentList[];
  count: number;
}
