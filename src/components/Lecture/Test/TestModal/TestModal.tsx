import axios, { type AxiosResponse } from 'axios';
import { useEffect, useState, type FC } from 'react';
import { modalState } from '../../../../stores/modalState';
import { useRecoilState } from 'recoil';
import './styled.css';
import type {
  ITestDetailforStudent,
  ITestStudentResponse,
} from '../../../../model/lecture/test/ITest';

interface ITestProps {
  testId: number;
  lecId: number;
  studentId: string;
  reSearch: () => void;
}

interface ITestAnswer {
  lecId: number;
  optionId: number;
  questionId: number;
  studentId: string;
  submitDate: string;
  testId: number;
}

interface ITestSubmit {
  answers: ITestAnswer[];
  lecId: number;
  studentId: string;
  submitDate: string;
  testId: number;
}

export const TestModal: FC<ITestProps> = ({
  testId,
  lecId,
  studentId,
  reSearch,
}) => {
  const [_, setModal] = useRecoilState(modalState);
  const [testDetail, setTestDetail] = useState<ITestDetailforStudent | null>(
    null
  );
  const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set());
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('lecId', lecId.toString());
    params.append('testId', testId.toString());
    params.append('studentId', studentId);
    axios
      .post('/api/lecture/testQuestionNOptionInfoDetail.do', params)
      .then((res: AxiosResponse<ITestDetailforStudent>) => {
        setTestDetail(res.data);
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

  const handleAnswerChange = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const getCurrentDateTimeString = (): string => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
  };

  const handleSubmit = () => {
    if (!testDetail) return;

    const submitDate = getCurrentDateTimeString();

    const answerList = testDetail.testQuestionInfoDetail.map((q) => {
      const optionId = answers[q.questionId];
      if (!optionId) {
        alert(`Q${q.questionNumber}번에 답안을 선택해주세요.`);
        throw new Error('답안 미선택'); // early exit
      }
      return {
        questionId: q.questionId,
        testId: testId,
        lecId: lecId,
        optionId: optionId,
        studentId: studentId,
        submitDate: submitDate,
      } as ITestAnswer;
    });

    const payload: ITestSubmit = {
      answers: answerList,
      lecId: lecId,
      testId: testId,
      studentId: studentId,
      submitDate: submitDate,
    };

    axios
      .post('/api/lecture/testTakeSubmit.do', payload)
      .then(() => {
        alert('시험이 제출되었습니다.');
        setModal({ isOpen: false });
        reSearch();
      })
      .catch(() => {
        alert('제출 실패');
      });
  };

  const closeModal = () => {
    setModal({ isOpen: false });
  };

  return (
    <div className="modal-overlay">
      <div className="relative max-h-[90vh] w-full max-w-[700px] overflow-y-auto rounded-lg bg-white p-5 opacity-100 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">시험 응시</h2>

        {testDetail ? (
          testDetail.testQuestionInfoDetail.length === 0 ? (
            <div className="py-20 text-center text-lg font-semibold text-gray-500">
              아직 출제된 문제가 없습니다.
            </div>
          ) : (
            testDetail.testQuestionInfoDetail.map((q, index) => {
              const options = testDetail.testQuestionOptionInfoDetail.filter(
                (opt) => opt.questionId === q.questionId
              );

              // 이미 제출한 경우 제출한 보기 정보 가져오기
              const submittedOption = testDetail.testSubmitOptionDetail?.find(
                (sub) => sub.questionId === q.questionId
              );

              return (
                <div key={q.questionId} className="mb-4 rounded border">
                  <div
                    className="cursor-pointer bg-gray-200 p-3 font-semibold"
                    onClick={() => toggleQuestion(q.questionId)}
                  >
                    Q{index + 1}. {q.questionContent}
                  </div>

                  {openQuestions.has(q.questionId) && (
                    <div className="border-t bg-white p-3">
                      {options.map((opt) => (
                        <div key={opt.optionId} className="mb-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`question_${q.questionId}`}
                              value={opt.optionId}
                              checked={
                                submittedOption
                                  ? submittedOption.optionId === opt.optionId
                                  : answers[q.questionId] === opt.optionId
                              }
                              onChange={() =>
                                !submittedOption &&
                                handleAnswerChange(q.questionId, opt.optionId)
                              }
                              disabled={!!submittedOption}
                            />
                            <span>
                              보기{opt.optionId}. {opt.optionContent}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )
        ) : (
          <div className="py-20 text-center text-lg font-semibold text-gray-500">
            로딩중...
          </div>
        )}

        <div className="mt-6 flex justify-center space-x-4">
          {testDetail &&
          testDetail.testQuestionInfoDetail.length > 0 &&
          !testDetail.testSubmitOptionDetail ? (
            <>
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded bg-blue-500 px-4 py-2 text-white"
              >
                제출
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="rounded bg-gray-300 px-4 py-2 text-gray-700"
              >
                나가기
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={closeModal}
              className="rounded bg-gray-300 px-4 py-2 text-gray-700"
            >
              나가기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
