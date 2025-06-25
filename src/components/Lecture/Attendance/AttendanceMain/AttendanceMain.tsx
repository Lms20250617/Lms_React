import axios, { type AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import type {
  IAttendance,
  IAttendanceResponse,
} from '../../../../model/Lecture/Attendance/IAttendance';
import { AttendanceContext } from '../../../../provider/Lecture/AttendanceProvider';
import './styled.css';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
export const AttendanceMain = () => {
  const [modal, setModal] = useRecoilState(modalState);
  const [lecList, setlecList] = useState<IAttendance[]>([]);
  const [lecCnt, setlecCnt] = useState<number>(0);

  const { searchData } = useContext(AttendanceContext);
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
      .post('/api/lecture/AttendanceLectureListBody.do', searchParam)
      .then((res: AxiosResponse<IAttendanceResponse>) => {
        setlecList(res.data.list);
        setlecCnt(res.data.count);
      });
  };

  const handleAttendCheck = (lecId: number) => {
    if (!confirm('출석하시겠습니까?')) {
      return;
    }
    const param = new URLSearchParams();
    param.append('lecId', lecId.toString());
    axios.post('/api/lecture/attendanceEnter.do', param).then((res) => {
      if (res.data.result === 'success') {
        alert('출석처리되었습니다.');
        searchList();
      } else {
        alert('출석처리에 실패하였습니다. 날자를 확인해주세요.');
      }
    });
    console.log('출석 처리: ', lecId);
    // 실제 출석 API 호출
  };

  const handleAttendOut = (lecId: number) => {
    if (!confirm('퇴실하시겠습니까?')) {
      return;
    }
    const param = new URLSearchParams();
    param.append('lecId', lecId.toString());
    axios.post('/api/lecture/attendanceOut.do', param).then((res) => {
      if (res.data.result === 'success') {
        alert('퇴실처리되었습니다.');
        searchList();
      } else {
        alert('퇴실처리에 실패하였습니다.');
      }
    });
    console.log('퇴실 처리: ', lecId);
    // 실제 퇴실 API 호출
  };

  return (
    <div className="notice-main-container">
      <table className="notice-table">
        <thead className="notice-table-header">
          <tr>
            <th>번호</th>
            <th>강의이름</th>
            <th>개강일자</th>
            <th>종강일자</th>
            <th>강의실</th>
            <th>-</th>
          </tr>
        </thead>
        <tbody>
          {lecList.length > 0 ? (
            lecList.map((lec) => {
              return (
                <tr key={lec.lecId} className="notice-table-row">
                  <td>{lec.lecId}</td>
                  <td>{lec.lecName}</td>
                  <td>
                    {new Date(lec.lecStartDate).toISOString().slice(0, 10)}
                  </td>
                  <td>{new Date(lec.lecEndDate).toISOString().slice(0, 10)}</td>
                  <td>{lec.roomName}</td>
                  <td>
                    {/* 출석 상태 표시 */}
                    {!lec.attendState || lec.attendState === null ? (
                      <button
                        style={{
                          width: '80%',
                          height: '80%',
                          color: 'white',
                          backgroundColor: '#5367d9',
                          border: 0,
                          margin: 0,
                          padding: 0,
                        }}
                        onClick={() => handleAttendCheck(lec.lecId)}
                      >
                        출석
                      </button>
                    ) : lec.attendEnddate === null ? (
                      <button
                        style={{
                          width: '80%',
                          height: '80%',
                          color: 'white',
                          backgroundColor: '#d95e53',
                          border: 0,
                          margin: 0,
                          padding: 0,
                        }}
                        onClick={() => handleAttendOut(lec.lecId)}
                      >
                        퇴실
                      </button>
                    ) : (
                      <>
                        {lec.attendState === 'L' && '지각'}
                        {lec.attendState === 'E' && '출석'}
                        {lec.attendState === 'F' && '결석'}
                        {lec.attendState === 'J' && '조퇴'}
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="notice-empty-row">
                등록된 강의가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <PageNavigation
        totalItems={lecCnt}
        itemsPerPage={5}
        onPageChange={searchList}
      />
    </div>
  );
};
