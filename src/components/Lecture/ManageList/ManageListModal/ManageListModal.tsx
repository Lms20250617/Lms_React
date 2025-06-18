import { useEffect, useState, type FC } from 'react';
import './styled.css';
import axios, { type AxiosResponse } from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import type { IManageListDetail } from '../../../../model/Lecture/IManageList';

interface IManageListProps {
  payload?: { id: number; insId: string };
  reSearch: () => void;
}

interface IPostResponse {
  result: 'success' | 'fail';
}

export const ManageListModal: FC<IManageListProps> = ({
  payload,
  reSearch,
}) => {
  const [_, setModal] = useRecoilState(modalState);
  const [detailValue, setDetailValue] = useState<IManageListDetail>();

  useEffect(() => {
    payload?.id && detailList();
  }, []);

  const detailList = () => {
    const param = new URLSearchParams();

    param.append('lecId', `${payload?.id}`);
    param.append('lecInstructorId', `${payload?.insId}`);

    axios.post('/api/lecture/lectureManagePlanDetail.do', param).then(
      (
        res: AxiosResponse<{
          lectureManagePlanDetailValue: IManageListDetail;
        }>
      ) => {
        setDetailValue(res.data.lectureManagePlanDetailValue);
      }
    );
  };

  const handlerManageListSave = () => {};

  return (
    <div className="manage-list-modal-overlay">
      <div className="manage-list-modal-container">
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
                  <div className="detail-value">{detailValue?.lecName}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">강사</div>
                  <div className="detail-value">
                    {detailValue?.lecInstructorName}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">이메일</div>
                  <div className="detail-value">{detailValue?.insEmail}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">강의 시작일</div>
                  <div className="detail-value">
                    {detailValue?.lecStartDate}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">정원</div>
                  <div className="detail-value">
                    {detailValue?.lecPersonnel}
                  </div>
                </div>
              </div>

              <div className="detail-column">
                <div className="detail-row">
                  <div className="detail-label">강의실*</div>
                  <div className="detail-value">{detailValue?.lecRoomName}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">연락처</div>
                  <div className="detail-value">{detailValue?.insHp}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">강의 종료일</div>
                  <div className="detail-value">{detailValue?.lecEndDate}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">강의 일수(주차)</div>
                  <div className="detail-value">{`${detailValue?.lecDaysCnt} (${detailValue?.lecSectionCnt}주차)`}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 강의 계획 */}
          <div className="plan-section">
            <div className="section-header">강의 계획</div>

            <div className="plan-content">
              <div className="plan-item">
                <div className="plan-label">강의목표</div>
                <div className="plan-input-cell">
                  <input
                    type="text"
                    defaultValue={detailValue?.lecGoal || ''}
                    className="plan-input"
                  />
                </div>
                {/* <div className="plan-placeholder">
                  {detailValue?.lecGoal || '아직 입력된 정보가 없습니다.'}
                </div> */}
              </div>

              <div className="plan-item">
                <div className="plan-label">강의내용</div>
                <div className="plan-input-cell">
                  <input
                    type="text"
                    defaultValue={detailValue?.lecContent || ''}
                    className="plan-input"
                  />
                </div>
              </div>

              <div className="plan-item">
                <div className="plan-label">강의기타사항</div>
                <div className="plan-input-cell">
                  <input
                    type="text"
                    defaultValue={detailValue?.lecSpecifics || ''}
                    className="plan-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 주차별 계획 */}
          <div>
            <div className="weekly-header">
              <div className="weekly-header-cell">주차</div>
              <div className="weekly-header-cell">학습목표</div>
              <div className="weekly-header-cell">학습내용</div>
            </div>
            {detailValue?.lecWeekPlanList.map((list) => (
              <div key={list.lecWeekPlanId} className="weekly-row">
                <div className="weekly-week">{list.lecWeekRound}</div>
                <div className="plan-input-cell">
                  <input
                    type="text"
                    defaultValue={list.lecWeekGoal || ''}
                    className="plan-input"
                  />
                </div>
                <div className="plan-input-cell">
                  <input
                    type="text"
                    defaultValue={list.lecWeekContent || ''}
                    className="plan-input"
                  />
                </div>
              </div>
            ))}

            <div className="button-container">
              <button onClick={handlerManageListSave}>저장</button>

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
    </div>
  );
};
