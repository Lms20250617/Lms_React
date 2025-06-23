import { useEffect, useState, type FC } from 'react';
import './styled.css';
import axios, { type AxiosResponse } from 'axios';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';

import type {
  ILectureInfo,
  ITutorDetail,
} from '../../../../model/manage/ITutor';

interface ITutorProps {
  payload?: { id: string };
}

export const TutorModal: FC<ITutorProps> = ({ payload }) => {
  const [detailValue, setDetailValue] = useState<ITutorDetail>();
  const [_, setModal] = useRecoilState(modalState);
  const [lectureList, setLectureList] = useState<ILectureInfo[]>([]);

  useEffect(() => {
    searchDetail();
  }, []);

  const searchDetail = () => {
    axios
      .post(`/api/manage/tutor-detail/${payload?.id}`)
      .then((res: AxiosResponse<ITutorDetail>) => {
        console.log(res.data);
        setDetailValue(res.data);
        setLectureList(res.data.lectureInfo);
        console.log(res.data.lectureInfo);
      });
  };
  const getStatusText = (status: string | undefined) => {
    switch (status) {
      case 'W':
        return '대기';
      case 'Y':
        return '재직';
      case 'N':
        return '퇴직';
      default:
        return '알 수 없음';
    }
  };
  return (
    <div className="tutor-modal-overlay">
      <div className="tutor-modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">강사 상세</h2>
        </div>

        <div className="modal-content">
          {/* 강의 상세 */}
          <div className="plan-section">
            <div className="section-header section-header-detail">
              강사 정보
            </div>

            <div className="detail-grid">
              <div className="detail-column">
                <div className="detail-row">
                  <div className="detail-label">강사 ID</div>
                  <div className="detail-value">
                    {detailValue?.insId || '-'}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">강사 번호</div>
                  <div className="detail-value">
                    {detailValue?.insNumber || '-'}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">이메일</div>
                  <div className="detail-value">
                    {detailValue?.insEmail || '-'}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">은행</div>
                  <div className="detail-value">
                    {detailValue?.insBank || '-'}
                  </div>
                </div>
              </div>

              <div className="detail-column">
                <div className="detail-row">
                  <div className="detail-label">이름</div>
                  <div className="detail-value">
                    {detailValue?.insName || '-'}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">연락처</div>
                  <div className="detail-value">
                    {detailValue?.insHp || '-'}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">재직 상태</div>
                  <div className="detail-value">
                    {getStatusText(detailValue?.insStatusYn)}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">계좌 번호</div>
                  <div className="detail-value">
                    {detailValue?.insAccount || '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 강의 목록 */}
          <div className="plan-section">
            <div className="section-header">강의 목록</div>
            <div>
              <table className="tutor-modal-table">
                <thead className="tutor-modal-table-header">
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
                        <tr key={list.lecId} className="tutor-modal-table-row">
                          <td className="tutor-modal-cell">{list.lecId}</td>
                          <td className="tutor-modal-cell">
                            {list.lecName || '-'}
                          </td>

                          <td className="tutor-modal-cell">
                            {list.lecStartDate || '-'}
                          </td>
                          <td className="tutor-modal-cell">
                            {list.lecEndDate || '-'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="tutor-modal-empty-row">
                        진행하는 강의 목록이 없습니다
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
