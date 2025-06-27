import axios, { type AxiosResponse } from 'axios';
import { useEffect, useState, type FC } from 'react';
import {
  type IRecruitListResponse,
  type IRecruitStudent,
} from '../../../../model/manage/IRecruit';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import './styeld.css';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { Portal } from '../../../../common/Portal';
import { RecruitModal } from '../RecruitModal/RecruitModal';
interface IRecruitDetailProps {
  studentId: string;
}

export const RecruitDetail: FC<IRecruitDetailProps> = ({ studentId }) => {
  const [studentRecruitList, setStudentRecruitList] = useState<
    IRecruitStudent[]
  >([]);
  const [studentRecruitCnt, setStudentReCruitCnt] = useState<number>(0);
  const [modal, setModal] = useRecoilState(modalState);

  useEffect(() => {
    searchList();
  }, []);

  const searchList = (cPage?: number) => {
    const param = new URLSearchParams();
    cPage = cPage || 1;

    param.append('currentPage', cPage.toString());
    param.append('pageSize', '5');
    param.append('loginID', studentId);

    axios
      .post('/api//manage/RecruitDetailBody.do', param)
      .then((res: AxiosResponse<IRecruitListResponse>) => {
        console.log(res.data.list);
        setStudentReCruitCnt(res.data.count);
        setStudentRecruitList(res.data.list);
      });
  };

  const handleRetire = (studentId: string) => {
    const param = new URLSearchParams();

    axios
      .post('/api/manage/RetireStudent.do', param)
      .then((res: AxiosResponse) => {
        console.log(res);
      });
  };

  const handleNewRecruit = () => {
    setModal({ isOpen: true });
  };

  return (
    <div className="notice-main-container">
      {modal.isOpen && (
        <Portal>
          <RecruitModal studentId={studentId} searchList={searchList} />
        </Portal>
      )}
      <div className="button-container">
        <button type="button" onClick={handleNewRecruit}>
          신규
        </button>
      </div>
      <table className="notice-table">
        <thead className="notice-table-header">
          <tr>
            <th>번호</th>
            <th>학생명</th>
            <th>입사일</th>
            <th>퇴사일</th>
            <th>업체명</th>
            <th>재직여부</th>
            <th>-</th>
          </tr>
        </thead>
        <tbody>
          {studentRecruitList.map((recruit) => {
            return (
              <tr key={recruit.empId} className="notice-table-row">
                <td className="notice-cell">{recruit.empId}</td>
                <td className="notice-cell">{recruit.studentName}</td>
                <td className="notice-cell">
                  {recruit.empJoinDate
                    ? new Date(recruit.empJoinDate).toISOString().split('T')[0]
                    : ''}
                </td>
                <td className="notice-cell">
                  {recruit.empRetireDate
                    ? new Date(recruit.empRetireDate)
                        .toISOString()
                        .split('T')[0]
                    : ''}
                </td>
                <td className="notice-cell">{recruit.empName}</td>
                <td className="notice-cell">
                  {!recruit.empRetireDate && recruit.studentsEmpStatus === 'Y'
                    ? '취업'
                    : '퇴직'}
                </td>
                <td className="notice-cell">
                  <div className="button-container">
                    {!recruit.empRetireDate &&
                    recruit.studentsEmpStatus === 'Y' ? (
                      <button type="button">퇴직</button>
                    ) : (
                      ''
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <PageNavigation
        totalItems={studentRecruitCnt}
        itemsPerPage={5}
        onPageChange={searchList}
      />
    </div>
  );
};
