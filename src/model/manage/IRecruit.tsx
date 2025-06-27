export interface IRecruitStudent {
  empJoinDate: number | null;
  empName: string;
  empRetireDate: number | null;
  loginID: string;
  recruitId: number | null;
  studentName: string;
  studentsEmpStatus: 'Y' | 'N';
  empId: number;
}

export interface IRecruitListResponse {
  count: number;
  pageSize: number;
  currentPage: string;
  list: IRecruitStudent[];
}
