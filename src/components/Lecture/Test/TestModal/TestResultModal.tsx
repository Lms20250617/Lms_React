import { useEffect, useState, type FC } from 'react';
import axios, { type AxiosResponse } from 'axios';
import { modalState } from '../../../../stores/modalState';
import { useRecoilState } from 'recoil';
import './styled.css';
import type {
  ITestResultDetail,
  ItestQuestionInfoDetail,
  ItestQuestionOptionInfoDetail,
  ItestQuestionAnswerInfoDetail,
  ITestSubmitOptionDetail,
} from '../../../../model/lecture/test/ITest';

interface ITestResultProps {
  testId: number;
  lecId: number;
  studentId: string;
}

export const TestResultModal: FC<ITestResultProps> = ({
  testId,
  lecId,
  studentId,
}) => {
  const [_, setModal] = useRecoilState(modalState);
  const [resultDetail, setResultDetail] = useState<ITestResultDetail | null>(
    null
  );
  const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('lecId', lecId.toString());
    params.append('testId', testId.toString());
    params.append('studentId', studentId);
    axios
      .post('/api/lecture/testTakeSubmitResultDetail.do', params)
      .then((res: AxiosResponse<ITestResultDetail>) => {
        setResultDetail(res.data);
      });
  }, []);

  const toggleQuestion = (questionId: number) => {
    setOpenQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const closeModal = () => {
    setModal({ isOpen: false });
  };

  return (
    <div className="modal-overlay">
      <div className="relative max-h-[90vh] w-full max-w-[700px] overflow-y-auto rounded-lg bg-white p-5 opacity-100 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">시험 결과</h2>

        {resultDetail ? (
          <>
            <table className="mb-4 w-full border">
              <tbody>
                <tr>
                  <td className="bg-gray-100 p-2 font-semibold">
                    채점 문제수/채점 점수
                  </td>
                  <td className="p-2">
                    {resultDetail.testSubmitOptionDetailValue.length} /{' '}
                    {resultDetail.testQuestionInfoDetail.reduce(
                      (sum, q) => sum + q.questionScore,
                      0
                    )}{' '}
                    ({resultDetail.testResultInfoValue.testScore}점)
                  </td>
                </tr>
                <tr>
                  <td className="bg-gray-100 p-2 font-semibold">
                    전체 문제 수
                  </td>
                  <td className="p-2">
                    {resultDetail.testQuestionInfoDetail.length}문제
                  </td>
                </tr>
                <tr>
                  <td className="bg-gray-100 p-2 font-semibold">시험 제출일</td>
                  <td className="p-2">
                    {resultDetail.testResultInfoValue.testResultRegDate}
                  </td>
                </tr>
              </tbody>
            </table>

            {resultDetail.testQuestionInfoDetail.map((q, index) => {
              const options = resultDetail.testQuestionOptionInfoDetail.filter(
                (opt) => opt.questionId === q.questionId
              );
              const answer = resultDetail.testQuestionAnswerInfoDetail.find(
                (a) => a.questionId === q.questionId
              );
              const submit = resultDetail.testSubmitOptionDetailValue.find(
                (s) => s.questionId === q.questionId
              );

              return (
                <div key={q.questionId} className="mb-4 rounded border">
                  <div
                    className="cursor-pointer bg-gray-200 p-3 font-semibold"
                    onClick={() => toggleQuestion(q.questionId)}
                  >
                    Q{index + 1}. {q.questionContent} ({q.questionScore}점)
                  </div>

                  {options.map((opt) => {
                    const isCorrect = answer?.correctOptionId === opt.optionId;
                    const isSubmitted = submit?.optionId === opt.optionId;
                    const isWrong = isSubmitted && !isCorrect;

                    return (
                      <div
                        key={opt.optionId}
                        className={`mb-2 ${isCorrect && isSubmitted ? 'bg-green-100' : ''} ${isWrong ? 'bg-red-100' : ''}`}
                      >
                        <label className="flex items-center space-x-2">
                          <input type="radio" checked={isSubmitted} disabled />
                          <span>
                            보기{opt.optionId}. {opt.optionContent}
                            {isCorrect ? ' (정답)' : isWrong ? ' (오답)' : ''}
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        ) : (
          <div className="py-20 text-center text-lg font-semibold text-gray-500">
            로딩중...
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={closeModal}
            className="rounded bg-gray-300 px-4 py-2 text-gray-700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
