import { useRecoilState } from 'recoil';
import { Portal } from '../../../../common/Portal';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import { StudentModal } from '../StudentModal/StudentModal';
import { modalState } from '../../../../stores/modalState';
import './styled.css';
import { useContext, useEffect, useState } from 'react';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import type {
  IStudentList,
  IStudentListResponse,
} from '../../../../model/manage/IStudent';
import { StudentContext } from '../../../../provider/manage/StudentProvider';

export const StudentMain = () => {
  const [modal, setModal] = useRecoilState(modalState);
  const { searchData } = useContext(StudentContext);
  const [studentList, setStudentList] = useState<IStudentList[]>([]);
  const [studentListCnt, setStudentListCnt] = useState<number>(0);

  useEffect(() => {
    searchList();
  }, [searchData]);

  const searchList = (cPage?: number) => {
    const searchParam = new URLSearchParams(searchData);

    cPage = cPage || 1;

    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios
      .post('/api/manage/studentListBody.do', searchParam)
      .then((res: AxiosResponse<IStudentListResponse>) => {
        setStudentList(res.data.list);
        setStudentListCnt(res.data.count);
      });
  };

  const studentDetail = (id: string) => {
    setModal({ isOpen: true, payload: { id } });
  };

  const updateStatusYn = (id: string, status: string) => {
    const confirm: boolean = window.confirm('재학 상태를 변경하시겠습니까?');
    if (!confirm) return;

    const param = {
      studentId: id,
      studentStatus: status,
    };

    axios
      .post('/api/manage/student-status', param)
      .then((res: AxiosResponse<string>) => {
        console.log(res);
        if (res.data === 'SUCCESS') {
          alert('변경되었습니다.');
          searchList();
        }
      });
  };

  return (
    <div className="student-main-container">
      {modal.isOpen && (
        <Portal>
          <StudentModal payload={modal.payload as { id: string }} />
        </Portal>
      )}

      <table className="student-table">
        <thead className="student-table-header">
          <tr>
            <th>학번</th>
            <th>이름</th>
            <th>연락처</th>
            <th>가입일자</th>
            <th>취업여부</th>
            <th>재학상태</th>
          </tr>
        </thead>
        <tbody>
          {studentList.length > 0 ? (
            studentList.map((list) => {
              return (
                <tr key={list.studentId} className="student-table-row">
                  <td className="student-cell">{list.studentNumber}</td>
                  <td
                    className="student-select-cell"
                    onClick={() => {
                      studentDetail(list.studentId);
                    }}
                  >
                    {list.studentName}
                  </td>

                  <td className="student-cell">{list.studentHp}</td>
                  <td className="student-cell">{list.studentRegDate}</td>
                  <td className="student-cell">
                    {list.studentEmpStatus === 'Y' ? '취업' : '미취업'}
                  </td>
                  <td className="student-cell">
                    <select
                      defaultValue={list.statusYN}
                      onChange={(e) => {
                        updateStatusYn(list.studentId, e.target.value);
                      }}
                    >
                      <option value="W">승인대기</option>
                      <option value="Y">재학</option>
                      <option value="N">탈퇴</option>
                    </select>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="student-empty-row">
                등록된 학생이 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PageNavigation
        totalItems={studentListCnt}
        itemsPerPage={5}
        onPageChange={searchList}
      />
    </div>
  );
};
