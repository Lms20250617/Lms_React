import { useEffect, type FC } from 'react';
import './styled.css';
import axios from 'axios';

interface IListProps {
  id?: number;
  reSearch: () => void;
}

interface IPostResponse {
  result: 'success' | 'fail';
}

export const ListModal: FC<IListProps> = ({ id, reSearch }) => {
  useEffect(() => {
    id && detailList();
  }, []);

  const detailList = () => {
    const param = new URLSearchParams();

    param.append('lecId', `${id}`);

    axios.post('/api/lecture/lectureDetail.do').then((res) => {
      console.log(res.data);
    });
  };
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">강의 상세 및 계획서</h2>
        </div>

        <div className="modal-content">
          {/* 강의 상세 */}
          <div className="plan-section">
            <div className="section-header section-header-detail">
              강의 상세
            </div>

            <div className="detail-grid">
              <div className="detail-column">
                <div className="detail-row">
                  <div className="detail-label">강의</div>
                  <div className="detail-value"></div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">강사</div>
                  <div className="detail-value"></div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">이메일</div>
                  <div className="detail-value"></div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">강의 시작일</div>
                  <div className="detail-value"></div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">정원</div>
                  <div className="detail-value"></div>
                </div>
              </div>

              <div className="detail-column">
                <div className="detail-row">
                  <div className="detail-label">강의실*</div>
                  <div className="detail-value">ss</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">연락처</div>
                  <div className="detail-value"></div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">강의 종료일</div>
                  <div className="detail-value"></div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">강의 일수(주차)</div>
                  <div className="detail-value"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 강의 계획 */}
          <div className="plan-section">
            <div className="section-header">강의 계획</div>

            <div className="plan-content">
              <div className="plan-item">
                <div className="plan-label">강의목표*</div>
                <div className="plan-placeholder">
                  아직 입력된 정보가 없습니다.
                </div>
              </div>

              <div className="plan-item">
                <div className="plan-label">강의내용*</div>
                <div className="plan-placeholder">
                  아직 입력된 정보가 없습니다.
                </div>
              </div>

              <div className="plan-item">
                <div className="plan-label">강의기타사항*</div>
                <div className="plan-placeholder">
                  아직 입력된 정보가 없습니다.
                </div>
              </div>
            </div>
          </div>

          {/* 주차별 계획 */}
          <div>
            <div className="weekly-header">
              <div className="weekly-header-cell">주차*</div>
              <div className="weekly-header-cell">학습목표*</div>
              <div className="weekly-header-cell">학습내용*</div>
            </div>

            <div className="add-week-container">
              <button className="add-week-btn">주차 추가</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
