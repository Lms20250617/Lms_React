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

export interface ITestStudent extends ITest {
  testAvailable: boolean;
  submitYn: 'Y' | 'N';
  scoreYn: 'Y' | 'N';
}

export interface ILectureSelectBox {
  lecDaysCnt: number;
  lecEndDate: string;
  lecId: number;
  lecInstructorId: string;
  lecInstructorName: string;
  lecName: string;
  lecPersonnel: number;
  lecRoomId: number;
  lecRoomName: string;
  lecSectionCnt: number;
  lecStartDate: string;
  lectureRound: number;
}

export interface ITestInfo {
  testQuestionAnswerInfoDetail: ItestQuestionAnswerInfoDetail[];
  testQuestionInfoDetail: ItestQuestionInfoDetail[];
  testQuestionOptionInfoDetail: ItestQuestionOptionInfoDetail[];
}

export interface ItestQuestionAnswerInfoDetail {
  correctOptionId: number;
  lecId: number;
  questionId: number;
  testId: number;
}
export interface ItestQuestionInfoDetail {
  lecId: number;
  questionContent: string;
  questionId: number;
  questionNumber: number;
  questionRegDate: number;
  questionScore: number;
  testId: number;
}

export interface ItestQuestionOptionInfoDetail {
  lecId: number;
  optionContent: string;
  optionId: number;
  questionId: number;
  questionRegDate: number;
  testId: number;
}

export interface ITestInfoResponse extends ITestInfo {
  lecInstructorId: string;
}

export interface ITestResponse {
  count: number;
  list: ITest[];
}

export interface ITestStudentResponse {
  count: number;
  list: ITestStudent[];
}

export interface ILectureSelectBoxResponse {
  lecSelectBoxList: ILectureSelectBox[];
}

export interface ITestDetailforStudent {
  result: 'isNotExit' | 'isExist';
  testQuestionInfoDetail: ItestQuestionInfoDetail[];
  testQuestionOptionInfoDetail: ItestQuestionOptionInfoDetail[];
  testSubmitOptionDetail?: ITestSubmitOptionDetail[];
}

export interface ITestSubmitOptionDetail {
  optionId: number;
  questionId: number;
  studentId: string;
  submitDate: string;
  testId: number;
}

export interface ITestResultDetail {
  testQuestionInfoDetail: ItestQuestionInfoDetail[];
  testQuestionOptionInfoDetail: ItestQuestionOptionInfoDetail[];
  testQuestionAnswerInfoDetail: ItestQuestionAnswerInfoDetail[];
  testSubmitOptionDetailValue: ITestSubmitOptionDetail[];
  testResultInfoValue: ITestResultInfoValue;
}

export interface ITestResultInfoValue {
  testId: number;
  lecId: number;
  studentId: string;
  testScore: number;
  testResultRegDate: string; // "2025-06-24 12:47:00.0"
}
