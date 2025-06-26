import { useEffect, useRef, useState, type FC } from 'react';
import './styled.css';
import axios, { type AxiosResponse } from 'axios';
import { useRecoilState } from 'recoil';
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
  const formRef = useRef<HTMLFormElement>(null);
  const startRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    payload?.id && detailList();
    if (startRef.current) {
      startRef.current.focus();
    }
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

  const saveManageList = () => {
    if (formRef.current) {
      const formElements = formRef.current
        .elements as HTMLFormControlsCollection;
      const lecManageWeekPlanList = [];
      const weekCount = detailValue?.lecSectionCnt || 0;

      for (let i = 0; i < weekCount; i++) {
        lecManageWeekPlanList.push({
          lecWeekPlanId:
            (
              formElements.namedItem(
                `lecWeekPlanId_${i}`
              ) as HTMLInputElement | null
            )?.value || '',
          lecWeekRound:
            (
              formElements.namedItem(
                `lecWeekRound_${i}`
              ) as HTMLInputElement | null
            )?.value || '',
          lecId:
            (formElements.namedItem(`lecId_${i}`) as HTMLInputElement | null)
              ?.value || '',
          lecWeekGoal:
            (
              formElements.namedItem(
                `lecWeekGoal_${i}`
              ) as HTMLInputElement | null
            )?.value || '',
          lecWeekContent:
            (
              formElements.namedItem(
                `lecWeekContent_${i}`
              ) as HTMLInputElement | null
            )?.value || '',
        });
      }

      const lecSpecifics =
        (formElements.namedItem('lecSpecifics') as HTMLInputElement | null)
          ?.value || '';
      const lecContent =
        (formElements.namedItem('lecContent') as HTMLInputElement | null)
          ?.value || '';
      const lecGoal =
        (formElements.namedItem('lecGoal') as HTMLInputElement | null)?.value ||
        '';
      const param = {
        lecId: `${payload?.id}`,
        lecSpecifics: lecSpecifics,
        lecContent: lecContent,
        lecGoal: lecGoal,
        lecManageWeekPlanList: lecManageWeekPlanList,
      };
      axios
        .post('/api/lecture/lectureManagePlanUpdate.do', param)
        .then((res: AxiosResponse<IPostResponse>) => {
          if (res.data.result === 'success') {
            alert('저장되었습니다.');
            setModal({ isOpen: false });
            reSearch();
          }
        });
    }
  };

  return (
    <div className="manage-list-modal-overlay">
      <form ref={formRef} className="manage-list-modal-container">
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
                  <div className="detail-value">
                    {detailValue?.lecName || '-'}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">강사</div>
                  <div className="detail-value">
                    {detailValue?.lecInstructorName || '-'}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">이메일</div>
                  <div className="detail-value">
                    {detailValue?.insEmail || '-'}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">강의 시작일</div>
                  <div className="detail-value">
                    {detailValue?.lecStartDate.slice(0, 10) || '-'}
                  </div>
                </div>
              </div>

              <div className="detail-column">
                <div className="detail-row">
                  <div className="detail-label">강의실</div>
                  <div className="detail-value">
                    {detailValue?.lecRoomName || '-'}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">연락처</div>
                  <div className="detail-value">
                    {detailValue?.insHp || '-'}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">정원</div>
                  <div className="detail-value">
                    {detailValue?.lecPersonnel || '-'}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">강의 종료일</div>
                  <div className="detail-value">
                    {detailValue?.lecEndDate.slice(0, 10) || '-'}
                  </div>
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
                  <textarea
                    defaultValue={detailValue?.lecGoal || ''}
                    className="plan-input"
                    name="lecGoal"
                    ref={startRef}
                  />
                </div>
              </div>

              <div className="plan-item">
                <div className="plan-label">강의내용</div>
                <div className="plan-input-cell">
                  <textarea
                    defaultValue={detailValue?.lecContent || ''}
                    className="plan-input"
                    name="lecContent"
                  />
                </div>
              </div>

              <div className="plan-item">
                <div className="plan-label">강의기타사항</div>
                <div className="plan-input-cell">
                  <textarea
                    defaultValue={detailValue?.lecSpecifics || ''}
                    className="plan-input"
                    name="lecSpecifics"
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
            {Array.from({ length: detailValue?.lecSectionCnt || 0 }, (_, i) => (
              <div key={i} className="weekly-row">
                <input
                  defaultValue={
                    detailValue?.lecWeekPlanList[i]?.lecWeekPlanId || ''
                  }
                  name={`lecWeekPlanId_${i}`}
                  hidden
                />
                <input
                  defaultValue={detailValue?.lecWeekPlanList[i]?.lecId || ''}
                  name={`lecId_${i}`}
                  hidden
                />
                <input
                  defaultValue={`${i + 1}`}
                  name={`lecWeekRound_${i}`}
                  hidden
                />
                <div className="weekly-week">{i + 1}주차</div>
                <div className="plan-input-cell">
                  <input
                    type="text"
                    defaultValue={
                      detailValue?.lecWeekPlanList[i]?.lecWeekGoal || ''
                    }
                    className="plan-input"
                    name={`lecWeekGoal_${i}`}
                  />
                </div>
                <div className="plan-input-cell">
                  <input
                    type="text"
                    defaultValue={
                      detailValue?.lecWeekPlanList[i]?.lecWeekContent || ''
                    }
                    className="plan-input"
                    name={`lecWeekContent_${i}`}
                  />
                </div>
              </div>
            ))}

            <div className="button-container">
              <button type="button" onClick={saveManageList}>
                저장
              </button>

              <button
                onClick={() => {
                  setModal({ isOpen: false, type: 'manageList' });
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
