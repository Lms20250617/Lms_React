import { useEffect, useState, type FC } from 'react';
import './styled.css';
import axios, { type AxiosResponse } from 'axios';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import type {
  ILectureInfo,
  IStudentDetail,
} from '../../../../model/manage/IStudent';

interface IStudentProps {
  payload?: { id: string };
}

export const StudentModal: FC<IStudentProps> = ({ payload }) => {
  const [detailValue, setDetailValue] = useState<IStudentDetail>();
  const [_, setModal] = useRecoilState(modalState);
  const [lectureList, setLectureList] = useState<ILectureInfo[]>([]);

  useEffect(() => {
    searchDetail();
  }, []);

  const searchDetail = () => {
    axios
      .post(`/api/manage/student-detail/${payload?.id}`)
      .then((res: AxiosResponse<IStudentDetail>) => {
        console.log(res.data);
        setDetailValue(res.data);
        setLectureList(res.data.lectureInfo);
      });
  };
  const getStatusText = (status: string | undefined) => {
    switch (status) {
      case 'W':
        return '대기';
      case 'Y':
        return '재학';
      case 'N':
        return '탈퇴';
      default:
        return '알 수 없음';
    }
  };
  const convertTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toISOString().slice(0, 10);
  };
  return (
    <div className="student-modal-overlay">
      <div className="student-modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">학생 상세</h2>
        </div>

        <div className="modal-content">
          {/* 강의 상세 */}
          <div className="plan-section">
            <div className="section-header section-header-detail">
              학생 정보
            </div>

            <div className="detail-grid">
              <div className="detail-column">
                <div className="detail-row">
                  <div className="detail-label">학생 ID</div>
                  <div className="detail-value">
                    {detailValue?.studentId || '-'}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">학번</div>
                  <div className="detail-value">
                    {detailValue?.studentNumber || '-'}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">이메일</div>
                  <div className="detail-value">
                    {detailValue?.studentEmail || '-'}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">재학상태</div>
                  <div className="detail-value">
                    {getStatusText(detailValue?.statusYn)}
                  </div>
                </div>
              </div>

              <div className="detail-column">
                <div className="detail-row">
                  <div className="detail-label">이름</div>
                  <div className="detail-value">
                    {detailValue?.studentName || '-'}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">연락처</div>
                  <div className="detail-value">
                    {detailValue?.studentHp || '-'}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">생일</div>
                  <div className="detail-value">
                    {detailValue?.studentBirthday || '-'}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">취업상태</div>
                  <div className="detail-value">
                    {detailValue?.studentEmpStatus === 'Y' ? '취업' : '미취업'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 강의 목록 */}
          <div className="plan-section">
            <div className="section-header">강의 목록</div>
            <div>
              <table className="student-modal-table">
                <thead className="student-modal-table-header">
                  <tr>
                    <th>강의번호</th>
                    <th>강의명</th>
                    <th>개강 일자</th>
                    <th>종강 일자</th>
                  </tr>
                </thead>
                <tbody>
                  {lectureList.length > 0 ? (
                    lectureList.map((list) => {
                      return (
                        <tr
                          key={list.lecId}
                          className="student-modal-table-row"
                        >
                          <td className="student-modal-cell">
                            {list.lecId || '-'}
                          </td>
                          <td className="student-modal-cell">
                            {list.lectureName || '-'}
                          </td>

                          <td className="student-modal-cell">
                            {convertTimestamp(list.lectureStartDate) || '-'}
                          </td>
                          <td className="student-modal-cell">
                            {convertTimestamp(list.lectureEndDate) || '-'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="student-modal-empty-row">
                        등록된 강의가 없습니다
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="button-container">
            <button
              onClick={() => {
                setModal({ isOpen: false });
              }}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
