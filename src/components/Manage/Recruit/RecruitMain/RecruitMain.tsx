import axios, { type AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { RecruitContext } from '../../../../provider/manage/RecruitProvider';
import type {
  IRecruitListResponse,
  IRecruitStudent,
} from '../../../../model/manage/IRecruit';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import './styeld.css';
import { RecruitDetail } from './RecruitDetail';
export const RecruitMain = () => {
  const { searchData } = useContext(RecruitContext);
  const [recruitList, setRecruitList] = useState<IRecruitStudent[]>([]);
  const [recruitCnt, setRecruitCnt] = useState<number>(0);
  const [isDetailOpen, setIsDetailOpen] = useState<{
    isOpen: boolean;
    studentLoginId: string;
  }>({ isOpen: false, studentLoginId: '' });
  useEffect(() => {
    searchList();
  }, []);

  const searchList = (cPage?: number) => {
    const searchParam = new URLSearchParams(searchData);

    cPage = cPage || 1;

    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios
      .post('/api/manage/recruitListBody.do', searchParam)
      .then((res: AxiosResponse<IRecruitListResponse>) => {
        setRecruitList(res.data.list);
        setRecruitCnt(res.data.count);
      });
  };

  const handleShowDetail = (studentId: string) => {
    setIsDetailOpen(() => {
      return { isOpen: true, studentLoginId: studentId };
    });
  };
  return (
    <div className="notice-main-container">
      <table className="notice-table">
        <thead className="notice-table-header">
          <tr>
            <th>로그인Id</th>
            <th>학생명</th>
            <th>입사일</th>
            <th>퇴사일</th>
            <th>업체명</th>
            <th>재직여부</th>
          </tr>
        </thead>
        <tbody>
          {recruitList.map((student) => {
            return (
              <tr
                key={student.empId + student.loginID}
                className="notice-table-row"
              >
                <td className="notice-cell">{student.loginID}</td>
                <td
                  className="notice-cell cursor-pointer underline"
                  onClick={() => {
                    handleShowDetail(student.loginID);
                  }}
                >
                  {student.studentName}
                </td>
                <td className="notice-cell">
                  {student.empJoinDate
                    ? new Date(student.empJoinDate).toISOString().split('T')[0]
                    : ''}
                </td>
                <td className="notice-cell">
                  {student.empRetireDate
                    ? new Date(student.empRetireDate)
                        .toISOString()
                        .split('T')[0]
                    : ''}
                </td>
                <td className="notice-cell">{student.empName}</td>
                <td className="notice-cell">
                  {!student.empRetireDate && student.studentsEmpStatus === 'Y'
                    ? '취업'
                    : '실업'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <PageNavigation
        totalItems={recruitCnt}
        itemsPerPage={5}
        onPageChange={searchList}
      />
      {isDetailOpen.isOpen && (
        <RecruitDetail
          studentId={isDetailOpen.studentLoginId}
          key={isDetailOpen.studentLoginId}
        />
      )}
    </div>
  );
};
