import './styled.css';
import { useContext, useEffect, useState } from 'react';
import axios, { type AxiosResponse } from 'axios';
import { PageNavigation } from '../../../../common.componets/PageNavigation/PageNavigation';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../../stores/modalState';
import { Portal } from '../../../../../common/Portal';
import { TestInfoContext } from '../../../../../provider/TestInfoProvider';
import { TestInfoModal } from '../TestInfoModal/TestInfoModal';
import type {
  ITest,
  ITestResponse,
} from '../../../../../model/lecture/test/ITest';
import { TestRegisterModal } from '../TestInfoModal/TestRegisterModal';

export const TestInfoMain = () => {
  //const { search } = useLocation();

  const [modal, setModal] = useRecoilState(modalState);

  const [testList, setTestList] = useState<ITest[]>([]);
  const [testCnt, setTestCnt] = useState<number>(0);

  const { searchData } = useContext(TestInfoContext);
  const [noticeId, setNoticeId] = useState<number>(0);

  useEffect(() => {
    seearchList();
  }, [searchData]);

  const seearchList = (cPage?: number) => {
    const searchParam = new URLSearchParams(searchData);

    cPage = cPage || 1;

    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios
      .post('/api/lecture/testInfoListBody.do', searchParam)
      .then((res: AxiosResponse<ITestResponse>) => {
        setTestList(res.data.list);
        setTestCnt(res.data.count);
      });
  };

  const postSuccess = () => {
    setModal({ isOpen: false });
    seearchList();
  };

  const noticeDetail = (id: number) => {
    setModal({ isOpen: true });
    setNoticeId(id);
  };

  return (
    <div className="notice-main-container">
      {modal.isOpen &&
        (modal.payload === 'register' ? (
          <Portal>
            <TestRegisterModal />
          </Portal>
        ) : (
          <Portal>
            <TestInfoModal />
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
            <th>시험 등록일</th>
            <th>시험문제보기</th>
          </tr>
        </thead>
        <tbody>
          {testList.length > 0 ? (
            testList.map((test) => {
              return (
                <tr key={test.lecId} className="notice-table-row">
                  <td className="notice-cell cursor-pointer text-blue-600 hover:text-blue-800">
                    {test.lecName}
                  </td>
                  <td className="notice-cell">{test.lecInstructorName}</td>
                  <td className="notice-cell">{test.lecRoomName}</td>
                  <td className="notice-cell">
                    {test.testBeginDate.split('.')[0].slice(0, 16)}
                  </td>
                  <td className="notice-cell">
                    {test.testEndDate.split('.')[0].slice(0, 16)}
                  </td>
                  <td className="notice-cell">
                    {test.testRegDate.split('.')[0].slice(0, 16)}
                  </td>
                  <td className="notice-cell cursor-pointer text-blue-600 hover:text-blue-800">
                    시험문제보기
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="notice-empty-row">
                등록된 공지사항이 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PageNavigation
        totalItems={testCnt}
        itemsPerPage={5}
        onPageChange={seearchList}
      />
    </div>
  );
};
