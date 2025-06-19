import { useEffect, useState, type FC } from 'react';
import './styled.css';
import axios, { type AxiosResponse } from 'axios';
import type {
  IListDetail,
  IListDetailResponse,
} from '../../../model/Lecture/IList';
import { useRecoilState, useRecoilValue } from 'recoil';
import { modalState } from '../../../stores/modalState';
import { loginInfoState } from '../../../stores/userInfo';

interface IListProps {
  id?: number;
  reSearch: () => void;
}

interface IPostResponse {
  result:
    | 'success'
    | 'fail'
    | 'loginIdNotExist'
    | 'lecIdAlreadyExist'
    | 'lecExceedsCapacity';
}

export const ListModal: FC<IListProps> = ({ id, reSearch }) => {
  const [_, setModal] = useRecoilState(modalState);
  const [detailValue, setDetailValue] = useState<IListDetail>();
  const [canRegister, setCanRegister] = useState<boolean>(false);
  const { userType, loginId } = useRecoilValue(loginInfoState);

  useEffect(() => {
    id && detailList();
  }, []);

  const detailList = () => {
    const param = new URLSearchParams();

    param.append('lecId', `${id}`);

    axios
      .post('/api/lecture/lectureDetail.do', param)
      .then((res: AxiosResponse<IListDetailResponse>) => {
        console.log(res.data.lectureDetailValue);
        setDetailValue(res.data.lectureDetailValue);
        setCanRegister(res.data.isLectureRegistrationAvailable);
        console.log(userType);
      });
  };

  const handlerlectureRegister = () => {
    const param = new URLSearchParams();

    param.append('lecId', `${id}`);
    param.append('studentId', `${loginId}`);

    axios
      .post('/api/lecture/lectureStdRegister.do', param)
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === 'success') {
          alert('신청되었습니다.');
          setModal({ isOpen: false });
          reSearch();
        } else if (res.data.result === 'loginIdNotExist') {
          alert(
            '학생정보가 등록되어 있지 않아 수강 신청할 수 없습니다.\n관리자에게 문의하시오.'
          );
        } else if (res.data.result === 'lecIdAlreadyExist') {
          alert('이미 수강 신청한 강의입니다.');
        } else if (res.data.result === 'lecExceedsCapacity') {
          alert(
            '현재 수강 인원이 모두 마감되었습니다. 다른 강의를 확인해 주세요.'
          );
        }
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
                <div className="plan-placeholder">
                  {detailValue?.lecGoal || '아직 입력된 정보가 없습니다.'}
                </div>
              </div>

              <div className="plan-item">
                <div className="plan-label">강의내용</div>
                <div className="plan-placeholder">
                  {detailValue?.lecContent || '아직 입력된 정보가 없습니다.'}
                </div>
              </div>

              <div className="plan-item">
                <div className="plan-label">강의기타사항</div>
                <div className="plan-placeholder">
                  {detailValue?.lecSpecifics || '아직 입력된 정보가 없습니다.'}
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
            {detailValue?.lecWeekPlanList &&
            detailValue.lecWeekPlanList.length > 0 ? (
              detailValue.lecWeekPlanList.map((list) => (
                <div key={list.lecWeekPlanId} className="weekly-row">
                  <div className="weekly-week">{list.lecWeekRound}</div>
                  <div className="weekly-week">{list.lecWeekGoal}</div>
                  <div className="weekly-week">{list.lecWeekContent}</div>
                </div>
              ))
            ) : (
              <div className="plan-placeholder">
                아직 입력된 정보가 없습니다.
              </div>
            )}

            <div className="button-container">
              {userType === 'S' && canRegister && (
                <button onClick={handlerlectureRegister}>신청</button>
              )}

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
