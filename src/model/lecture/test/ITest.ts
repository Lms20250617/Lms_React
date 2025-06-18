export interface ITest {
  lecId: number;
  lecInstructorId: string;
  lecInstructorName: string;
  lecName: string;
  lecRoomId: number;
  lecRoomName: string;
  testBeginDate: string;
  testEndDate: string;
  testId: number;
  testRegDate: string;
  testType: string;
}

export interface ITestInfo {}

export interface ITestResponse {
  count: number;
  list: ITest[];
}
