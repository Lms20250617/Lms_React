export interface IStudent {
  studentId: string;
  name: string;
  studentsNumber: string;
  hp: string;
  email: string;
  fileName?: string;
}

export interface IStudentDetail extends IStudent {
  fileExt?: string;
  fileSize?: string;
  physicalPath?: string;
  logicalPath?: string;
}
