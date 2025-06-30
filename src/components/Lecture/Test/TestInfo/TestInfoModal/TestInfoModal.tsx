import { useEffect, useRef, useState, type FC } from 'react';
import type { INtoticeDetail } from '../../../../../model/Support/INotice';
import { modalState } from '../../../../../stores/modalState';
import { useRecoilState, useRecoilValue } from 'recoil';
import axios, { type AxiosResponse } from 'axios';
import './styled.css';
import type {
  ITestInfo,
  ITestInfoResponse,
} from '../../../../../model/lecture/test/ITest';
import { loginInfoState } from '../../../../../stores/userInfo';
interface ITestInfoProps {
  id: {
    testId: number;
    lecId: number;
  };
}

export const TestInfoModal: FC<ITestInfoProps> = ({ id }) => {
  const [_, setModal] = useRecoilState(modalState);
  const formRef = useRef<HTMLFormElement>(null);
  const [detail, setDetail] = useState<ITestInfoDetail>();
  const [questionList, setQuestionList] = useState<ITestInfo>({
    testQuestionInfoDetail: [],
    testQuestionOptionInfoDetail: [],
    testQuestionAnswerInfoDetail: [],
  });
  const [maxQuestionCount, setMaxQuestionCount] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [newScore, setNewScore] = useState<number>(5);
  const [newCorrectOption, setNewCorrectOption] = useState<number>(1);
  const [newOptions, setNewOptions] = useState<string[]>(['', '', '', '', '']);
  const [openRows, setOpenRows] = useState<Set<number>>(new Set());
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const { userType, loginId } = useRecoilValue(loginInfoState);

  useEffect(() => {
    const param = new FormData();
    param.set('lecId', id.lecId.toString());
    param.set('testId', id.testId.toString());
    axios
      .post('/api/lecture/testQuestionInfoDetail.do', param, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res: AxiosResponse<ITestInfoResponse>) => {
        const {
          testQuestionInfoDetail,
          testQuestionOptionInfoDetail,
          testQuestionAnswerInfoDetail,
        } = res.data;

        setQuestionList({
          testQuestionInfoDetail,
          testQuestionOptionInfoDetail,
          testQuestionAnswerInfoDetail,
        });
        if (testQuestionOptionInfoDetail.length > 0) {
          setIsUpdate(true);
        } else {
          setIsUpdate(false);
        }
        let score = 0;
        testQuestionInfoDetail.forEach((v) => {
          score += v.questionScore;
        });
        setTotalScore(score);
        setMaxQuestionCount(testQuestionInfoDetail.length);
      });
  }, []);

  const handleAddQuestion = () => {
    const newQuestionNumber = questionList.testQuestionInfoDetail.length + 1;
    const newQuestionId = parseInt(
      `${id.lecId}${id.testId}${newQuestionNumber}`
    );

    const questionInfo: ItestQuestionInfoDetail = {
      lecId: id.lecId,
      testId: id.testId,
      questionId: newQuestionId,
      questionScore: newScore,
      questionContent: newQuestionContent,
      questionNumber: newQuestionNumber,
      questionRegDate: new Date().getFullYear(),
    };

    const optionInfo: ItestQuestionOptionInfoDetail[] = newOptions.map(
      (content, index) => ({
        lecId: id.lecId,
        testId: id.testId,
        questionId: newQuestionId,
        optionId: index + 1,
        optionContent: content,
        questionRegDate: new Date().getFullYear(),
      })
    );

    const answerInfo: ItestQuestionAnswerInfoDetail = {
      lecId: id.lecId,
      testId: id.testId,
      questionId: newQuestionId,
      correctOptionId: newCorrectOption,
    };

    setQuestionList((prev) => ({
      testQuestionInfoDetail: [...prev.testQuestionInfoDetail, questionInfo],
      testQuestionOptionInfoDetail: [
        ...prev.testQuestionOptionInfoDetail,
        ...optionInfo,
      ],
      testQuestionAnswerInfoDetail: [
        ...prev.testQuestionAnswerInfoDetail,
        answerInfo,
      ],
    }));

    setMaxQuestionCount((prev) => prev + 1);
    setTotalScore((prev) => prev + newScore);

    // 초기화
    setNewQuestionContent('');
    setNewScore(5);
    setNewCorrectOption(1);
    setNewOptions(['', '', '', '', '']);
  };
  const handleDeleteQuestion = (questionId: number) => {
    setQuestionList((prev) => {
      const deleted = prev.testQuestionInfoDetail.find(
        (q) => q.questionId === questionId
      );
      if (!deleted) return prev;

      const updatedQuestionInfoDetail = prev.testQuestionInfoDetail
        .filter((q) => q.questionId !== questionId)
        .map((q) => {
          if (q.questionNumber > deleted.questionNumber) {
            return { ...q, questionNumber: q.questionNumber - 1 };
          }
          return q;
        });

      return {
        testQuestionInfoDetail: updatedQuestionInfoDetail,
        testQuestionOptionInfoDetail: prev.testQuestionOptionInfoDetail.filter(
          (opt) => opt.questionId !== questionId
        ),
        testQuestionAnswerInfoDetail: prev.testQuestionAnswerInfoDetail.filter(
          (ans) => ans.questionId !== questionId
        ),
      };
    });

    setMaxQuestionCount((prev) => prev - 1);
    setTotalScore(
      (prev) =>
        prev -
        (questionList.testQuestionInfoDetail.find(
          (q) => q.questionId === questionId
        )?.questionScore || 0)
    );
  };

  const toggleRow = (questionId: number) => {
    setOpenRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    if (questionList.testQuestionInfoDetail.length < 1) {
      alert('문제를 등록해 주세요.');
      return;
    }
    axios
      .post('/api/lecture/testQuestionsInfoSave.do', makeParam(questionList), {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(() => {
        alert('저장되었습니다');
        setModal({ isOpen: false });
      })
      .catch(() => {
        alert('저장 실패');
      });
  };
  const handleUpdate = () => {
    axios
      .post(
        '/api/lecture/testQuestionsInfoUpdate.do',
        makeParam(questionList),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .then(() => {
        alert('저장되었습니다');
        setModal({ isOpen: false });
      })
      .catch(() => {
        alert('저장 실패');
      });
  };

  const makeParam = (arg: ITestInfo) => {
    return {
      questionList: arg.testQuestionInfoDetail,
      optionList: arg.testQuestionOptionInfoDetail,
      answerList: arg.testQuestionAnswerInfoDetail,
    };
  };

  const handleUpdateInline = (questionId: number) => {
    setQuestionList((prev) => {
      return { ...prev };
    });
  };

  if (userType === 'T') {
    return (
      <div className="modal-overlay">
        <div className="relative max-h-[90vh] w-full max-w-[700px] overflow-y-auto rounded-lg bg-white p-5 opacity-100 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">시험 상세</h2>
          <table className="w-full border text-center text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border py-2">번호</th>
                <th className="border py-2">내용</th>
                <th className="border py-2">배점</th>
                <th className="border py-2">정답</th>
              </tr>
            </thead>
            <tbody>
              {questionList.testQuestionInfoDetail.map((q) => {
                const answer = questionList.testQuestionAnswerInfoDetail.find(
                  (a) => a.questionId === q.questionId
                );
                const options =
                  questionList.testQuestionOptionInfoDetail.filter(
                    (opt) => opt.questionId === q.questionId
                  );

                return (
                  <>
                    <tr key={q.questionId} className="border">
                      <td
                        className="cursor-pointer border py-2"
                        onClick={() => toggleRow(q.questionId)}
                      >
                        {q.questionNumber}
                      </td>
                      <td
                        className="cursor-pointer border py-2"
                        onClick={() => toggleRow(q.questionId)}
                      >
                        {q.questionContent}
                      </td>
                      <td className="border py-2">{q.questionScore}</td>
                      <td className="border py-2">
                        {answer?.correctOptionId}번
                      </td>
                    </tr>

                    {openRows.has(q.questionId) && (
                      <tr>
                        <td colSpan={5} className="bg-gray-50 p-4">
                          <div className="mb-2 grid grid-cols-2 gap-4">
                            <div>
                              <label className="font-semibold">
                                문제내용:{q.questionContent}
                              </label>
                            </div>
                            <div>
                              <label className="font-semibold">
                                배점:{q.questionScore}
                              </label>
                            </div>
                          </div>

                          {options.map((opt, idx) => (
                            <div className="mb-2" key={idx}>
                              <label className="mr-2 font-semibold">
                                보기 {opt.optionId}:{opt.optionContent}
                              </label>
                            </div>
                          ))}

                          <div className="mb-4">
                            <label className="mr-2 font-semibold">
                              정답:{answer?.correctOptionId}번
                            </label>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
          <button
            type="button"
            onClick={() => setModal({ isOpen: false })}
            className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="relative max-h-[90vh] w-full max-w-[700px] overflow-y-auto rounded-lg bg-white p-5 opacity-100 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">시험 문제 관리</h2>
        {/* 상단 정보 */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label>
              최대 문제 수
              <input
                type="number"
                value={maxQuestionCount}
                readOnly
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              />
            </label>
          </div>
          <div>
            <label>
              총 만점
              <input
                type="number"
                value={totalScore}
                readOnly
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              />
            </label>
          </div>
        </div>

        {/* 새 문제 추가 */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label>
              배점
              <input
                type="number"
                value={newScore}
                onChange={(e) => setNewScore(parseInt(e.target.value))}
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              />
            </label>
          </div>
          <div>
            <label>
              정답 보기
              <select
                value={newCorrectOption}
                onChange={(e) => setNewCorrectOption(parseInt(e.target.value))}
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              >
                {[1, 2, 3, 4, 5].map((val) => (
                  <option key={val} value={val}>
                    {val}번
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label>
            문제 내용
            <input
              type="text"
              value={newQuestionContent}
              onChange={(e) => setNewQuestionContent(e.target.value)}
              className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
            />
          </label>
        </div>

        <div className="mb-4">
          {newOptions.map((opt, idx) => (
            <div key={idx} className="mb-2">
              <label>
                보기 {idx + 1}
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const updated = [...newOptions];
                    updated[idx] = e.target.value;
                    setNewOptions(updated);
                  }}
                  className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
                />
              </label>
            </div>
          ))}
        </div>

        <div className="mb-6 flex justify-end">
          <button
            type="button"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={handleAddQuestion}
          >
            문제추가
          </button>
        </div>

        <table className="w-full border text-center text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border py-2">번호</th>
              <th className="border py-2">내용</th>
              <th className="border py-2">배점</th>
              <th className="border py-2">정답</th>
              <th className="border py-2">삭제</th>
            </tr>
          </thead>
          <tbody>
            {questionList.testQuestionInfoDetail.map((q) => {
              const answer = questionList.testQuestionAnswerInfoDetail.find(
                (a) => a.questionId === q.questionId
              );
              const options = questionList.testQuestionOptionInfoDetail.filter(
                (opt) => opt.questionId === q.questionId
              );

              return (
                <>
                  <tr key={q.questionId} className="border">
                    <td
                      className="cursor-pointer border py-2"
                      onClick={() => toggleRow(q.questionId)}
                    >
                      {q.questionNumber}
                    </td>
                    <td
                      className="cursor-pointer border py-2"
                      onClick={() => toggleRow(q.questionId)}
                    >
                      {q.questionContent}
                    </td>
                    <td className="border py-2">{q.questionScore}</td>
                    <td className="border py-2">{answer?.correctOptionId}번</td>
                    <td className="border py-2">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDeleteQuestion(q.questionId)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>

                  {openRows.has(q.questionId) && (
                    <tr>
                      <td colSpan={5} className="bg-gray-50 p-4">
                        <div className="mb-2 grid grid-cols-2 gap-4">
                          <div>
                            <label className="font-semibold">문제내용:</label>
                            <input
                              type="text"
                              className="w-full rounded border px-2 py-1"
                              defaultValue={q.questionContent}
                              onChange={(e) =>
                                (q.questionContent = e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="font-semibold">배점:</label>
                            <input
                              type="number"
                              className="w-full rounded border px-2 py-1"
                              defaultValue={q.questionScore}
                              onChange={(e) =>
                                (q.questionScore = parseInt(e.target.value))
                              }
                            />
                          </div>
                        </div>

                        {options.map((opt, idx) => (
                          <div className="mb-2" key={idx}>
                            <label className="mr-2 font-semibold">
                              보기 {opt.optionId}:
                            </label>
                            <input
                              type="text"
                              className="w-80 rounded border px-2 py-1"
                              defaultValue={opt.optionContent}
                              onChange={(e) =>
                                (opt.optionContent = e.target.value)
                              }
                            />
                          </div>
                        ))}

                        <div className="mb-4">
                          <label className="mr-2 font-semibold">정답:</label>
                          <select
                            className="w-24 rounded border px-2 py-1"
                            defaultValue={answer?.correctOptionId}
                            onChange={(e) =>
                              (answer!.correctOptionId = parseInt(
                                e.target.value
                              ))
                            }
                          >
                            {[1, 2, 3, 4, 5].map((val) => (
                              <option key={val} value={val}>
                                {val}번
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          className="rounded bg-blue-500 px-3 py-1 text-white"
                          onClick={() => handleUpdateInline(q.questionId)}
                        >
                          저장
                        </button>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end space-x-4">
          {isUpdate ? (
            <button
              type="button"
              onClick={handleUpdate}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              수정
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              저장
            </button>
          )}
          <button
            type="button"
            onClick={() => setModal({ isOpen: false })}
            className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
