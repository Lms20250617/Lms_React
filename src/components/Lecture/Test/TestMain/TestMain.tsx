import './styled.css';
import { useContext, useEffect, useState } from 'react';
import axios, { type AxiosResponse } from 'axios';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import { useRecoilState, useRecoilValue } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { Portal } from '../../../../common/Portal';
import type {
  ITest,
  ITestResponse,
  ITestStudent,
  ITestStudentResponse,
} from '../../../../model/lecture/test/ITest';
import './styled.css';
import { TestModal } from '../TestModal/TestModal';
import { TestContext } from '../../../../provider/Lecture/Test/TestProvider';
import { loginInfoState } from '../../../../stores/userInfo';
import { TestResultModal } from '../TestModal/TestResultModal';

export const TestMain = () => {
  //const { search } = useLocation();

  const [modal, setModal] = useRecoilState(modalState);
  const { userType, loginId } = useRecoilValue(loginInfoState);
  const [testList, setTestList] = useState<ITestStudent[]>([]);
  const [testCnt, setTestCnt] = useState<number>(0);

  const { searchData } = useContext(TestContext);
  const [selectedTestId, setSelectedTestId] = useState({});

  useEffect(() => {
    searchList();
  }, [searchData]);

  const searchList = (cPage?: number) => {
    const searchParam = new URLSearchParams(searchData);

    cPage = cPage || 1;

    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios
      .post('/api/lecture/testListBody.do', searchParam)
      .then((res: AxiosResponse<ITestStudentResponse>) => {
        setTestList(res.data.list);
        setTestCnt(res.data.count);
      });
  };

  return (
    <div className="notice-main-container">
      {modal.isOpen &&
        (modal.payload === 'result' ? (
          <Portal>
            <TestResultModal
              lecId={selectedTestId.lecId}
              testId={selectedTestId.testId}
              studentId={loginId}
            ></TestResultModal>
          </Portal>
        ) : (
          <Portal>
            <TestModal
              lecId={selectedTestId.lecId}
              testId={selectedTestId.testId}
              studentId={loginId}
              reSearch={searchList}
            />
          </Portal>
        ))}

      <table className="notice-table">
        <thead className="notice-table-header">
          <tr>
            <th>강의</th>
            <th>강사</th>
            <th>강의실</th>
            <th>시험 시작일</th>
            <th>시험 종료일</th>
            <th>시험응시</th>
            <th>시험응시결과</th>
          </tr>
        </thead>
        <tbody>
          {testList.length > 0 ? (
            testList.map((test) => {
              return (
                <tr key={test.testId} className="notice-table-row">
                  <td className="notice-cell">{test.lecName}</td>
                  <td className="notice-cell">{test.lecInstructorName}</td>
                  <td className="notice-cell">{test.lecRoomName}</td>
                  <td className="notice-cell">
                    {test.testBeginDate.split('.')[0].slice(0, 16)}
                  </td>
                  <td className="notice-cell">
                    {test.testEndDate.split('.')[0].slice(0, 16)}
                  </td>
                  {test.testAvailable ? (
                    <td
                      className="notice-cell cursor-pointer text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        setSelectedTestId({
                          testId: test.testId,
                          lecId: test.lecId,
                        });
                        setModal({ isOpen: true });
                      }}
                    >
                      {test.submitYn === 'N' ? '시험응시' : '시험응시완료'}
                    </td>
                  ) : (
                    <td className="notice-cell">시험미응시</td>
                  )}
                  {test.testAvailable ? (
                    test.scoreYn === 'Y' ? (
                      <td
                        className="notice-cell cursor-pointer text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setSelectedTestId({
                            testId: test.testId,
                            lecId: test.lecId,
                          });
                          setModal({ isOpen: true, payload: 'result' });
                        }}
                      >
                        시험응시결과
                      </td>
                    ) : (
                      <td className="notice-cell">시험응시예정</td>
                    )
                  ) : test.scoreYn === 'Y' ? (
                    <td
                      className="notice-cell cursor-pointer text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        setSelectedTestId({
                          testId: test.testId,
                          lecId: test.lecId,
                        });
                        setModal({ isOpen: true, payload: 'result' });
                      }}
                    >
                      시험종료
                    </td>
                  ) : (
                    <td className="notice-cell">시험미응시</td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="notice-empty-row">
                등록된 시험이 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PageNavigation
        totalItems={testCnt}
        itemsPerPage={5}
        onPageChange={searchList}
      />
    </div>
  );
};
