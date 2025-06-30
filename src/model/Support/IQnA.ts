export interface IQnADetail {
  qnaId: number;
  qnaTitle: string;
  qnaContent: string;
  lecId: number;
  lecName: string;
  qnaAnswer?: string;
  qnaAnswerDate?: string;
  error: string;
  qnaRegDate?: string;
  loginId?: string;
  tutorLoginId?: string;
}

export interface IQnAAnswerResponse {
  questionId: number;
  answerContent: string;
}

export interface IQnAListResponse {
  count: number;
  list: IQnADetail[];
}

export interface IQnAModalProps {
  searchList: () => void;
  detail: IQnADetail;
}
