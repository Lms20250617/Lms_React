import { useEffect, useRef, useState, type FC } from 'react';
import './styled.css';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import axios, { type AxiosResponse } from 'axios';
import type {
  ILectrueSelectBoxList,
  IManageListDetail,
  ISelectBoxClassRoom,
  ISelectBoxInstructorInfo,
  ISelectBoxLecName,
} from '../../../../model/Lecture/IManageList';
interface ILectureProps {
  payload?: { id: number };
  reSearch: () => void;
}

interface IPostResponse {
  result: 'success' | 'fail';
}

export const LectureModal: FC<ILectureProps> = ({ payload, reSearch }) => {
  const [_, setModal] = useRecoilState(modalState);
  const [selectBoxClassRoom, setSelectBoxClassRoom] = useState<
    ISelectBoxClassRoom[]
  >([]);
  const [selectBoxInstructorInfo, setSelectBoxInstructorInfo] = useState<
    ISelectBoxInstructorInfo[]
  >([]);
  const [selectBoxLecName, setSelectBoxLecName] = useState<ISelectBoxLecName[]>(
    []
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedLecName, setSelectedLecName] = useState<string>('');
  const [showDirectInput, setShowDirectInput] = useState<boolean>(false);
  const [detailValue, setDetailValue] = useState<IManageListDetail>();
  const [isEditModal, setIsEditModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      await selectBoxList();
      if (payload?.id) {
        detailLecture();
      }
    };
    fetchData();
  }, []);

  const selectBoxList = async () => {
    await axios
      .post('/api/lecture/lectureManageSelectBox.do')
      .then((res: AxiosResponse<ILectrueSelectBoxList>) => {
        setSelectBoxClassRoom(res.data.lecSelectBoxClassRoomList);
        setSelectBoxInstructorInfo(res.data.lecSelectBoxInstructorInfoList);
        setSelectBoxLecName(res.data.lecSelectBoxLecNameList);
      });
  };

  const validateLecture = (): boolean => {
    if (!formRef.current) return false;

    const formData = new FormData(formRef.current);

    // 폼 데이터 추출
    const lecName = showDirectInput
      ? selectedLecName
      : (formData.get('lecName') as string);
    const lecInstructorId = formData.get('lecInstructorId') as string;
    const lecPersonnel = formData.get('lecPersonnel') as string;
    const lecRoomId = formData.get('lecRoomId') as string;
    const lecStartDate = formData.get('lecStartDate') as string;
    const lecEndDate = formData.get('lecEndDate') as string;
    const lecDaysCnt = formData.get('lecDaysCnt') as string;

    if (!lecName || lecName.trim() === '' || lecName === 'default') {
      alert('강의명을 입력해 주세요.');
      return false;
    }

    if (!lecInstructorId || lecInstructorId === 'default') {
      alert('강사를 선택해 주세요.');
      return false;
    }

    if (!lecPersonnel || lecPersonnel.trim() === '') {
      alert('정원을 입력해 주세요.');
      return false;
    }

    if (!lecRoomId || lecRoomId === 'default') {
      alert('강의실을 선택해 주세요.');
      return false;
    }

    if (!lecStartDate || lecStartDate.trim() === '') {
      alert('강의 시작일을 입력해 주세요.');
      return false;
    }

    if (!lecEndDate || lecEndDate.trim() === '') {
      alert('강의 종료일을 입력해 주세요.');
      return false;
    }

    if (!lecDaysCnt || lecDaysCnt.trim() === '') {
      alert('강의 일수를 입력해 주세요.');
      return false;
    }

    const startDate = new Date(lecStartDate);
    const endDate = new Date(lecEndDate);

    if (startDate >= endDate) {
      alert(
        '강의 날짜 입력을 잘못했습니다. 시작일이 종료일보다 늦을 수 없습니다.'
      );
      return false;
    }

    const daysDiff =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    const inputDays = parseInt(lecDaysCnt);

    if (inputDays > daysDiff) {
      alert('강의 기간보다 강의 일수를 초과 입력했습니다.');
      return false;
    }

    const personnel = parseInt(lecPersonnel);
    if (isNaN(personnel) || personnel <= 0) {
      alert('정원은 1 이상의 숫자를 입력해 주세요.');
      return false;
    }

    if (isNaN(inputDays) || inputDays <= 0) {
      alert('강의 일수는 1 이상의 숫자를 입력해 주세요.');
      return false;
    }

    return true;
  };

  const saveLecture = () => {
    if (!validateLecture()) {
      return;
    }
    const formData = new FormData(formRef.current as HTMLFormElement);
    formData.delete('lecName');
    formData.append('lecName', `${selectedLecName}`);
    axios
      .post('/api/lecture/lectureManageSave.do', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === 'success') {
          alert('저장되었습니다.');
          setModal({ isOpen: false });
          reSearch();
        }
      });
  };
  const detailLecture = () => {
    const param = new URLSearchParams();
    param.append('lecId', `${payload?.id}`);
    axios.post('/api/lecture/lectureDetail.do', param).then(
      (
        res: AxiosResponse<{
          lectureDetailValue: IManageListDetail;
          isLectureRegistrationAvailable: boolean;
        }>
      ) => {
        setDetailValue(res.data.lectureDetailValue);
        setIsEditModal(res.data.isLectureRegistrationAvailable);
      }
    );
  };

  const updateLecture = () => {
    if (!validateLecture()) {
      return;
    }
    const formData = new FormData(formRef.current as HTMLFormElement);
    formData.append('lecId', `${payload?.id}`);
    formData.delete('lecName');
    formData.append('lecName', `${detailValue?.lecName}`);
    axios
      .post('/api/lecture/lectureManageUpdate.do', formData)
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === 'success') {
          alert('수정되었습니다.');
          setModal({ isOpen: false });
          reSearch();
        }
      });
  };
  return (
    <div className="lecture-modal-overlay">
      <div className="lecture-modal-content">
        <div className="lecture-modal-header">
          <h2 className="lecture-modal-title">강의 등록</h2>
        </div>

        <form ref={formRef} className="lecture-modal-form">
          <div className="lecture-form-row">
            <div className="lecture-form-group">
              <label className="lecture-form-label">
                강의명<span className="lecture-required">*</span>
              </label>

              {!payload?.id ? (
                <>
                  <select
                    name="lecName"
                    className="lecture-form-select"
                    required
                    defaultValue={'default'}
                    onChange={(e) => {
                      if (e.target.value === 'direct') {
                        setShowDirectInput(true);
                        setSelectedLecName('');
                      } else {
                        setShowDirectInput(false);
                        setSelectedLecName(e.target.value);
                      }
                    }}
                  >
                    <option value={'default'} disabled>
                      강의 선택
                    </option>
                    {selectBoxLecName.map((lec) => (
                      <option key={lec.lecName} value={lec.lecName}>
                        {lec.lecName}
                      </option>
                    ))}
                    <option value="direct">직접입력</option>
                  </select>
                  {showDirectInput && (
                    <input
                      type="text"
                      name="lecNameDirect"
                      className="lecture-form-input"
                      value={selectedLecName}
                      onChange={(e) => setSelectedLecName(e.target.value)}
                      required
                    />
                  )}
                </>
              ) : (
                <>
                  <input
                    type="text"
                    name="lecName"
                    className="lecture-form-input"
                    defaultValue={detailValue?.lecName}
                    readOnly
                  />
                </>
              )}
            </div>
          </div>

          <div className="lecture-form-row">
            <div className="lecture-form-group">
              <label className="lecture-form-label">
                강사<span className="lecture-required">*</span>
              </label>
              <select
                key={detailValue?.lecInstructorId}
                defaultValue={
                  !!payload?.id ? detailValue?.lecInstructorId : 'default'
                }
                name="lecInstructorId"
                className="lecture-form-select"
                required
              >
                <option value={'default'} disabled>
                  강사 선택
                </option>
                {selectBoxInstructorInfo.map((instructor) => (
                  <option
                    key={instructor.lecInstructorId}
                    value={instructor.lecInstructorId}
                  >
                    {instructor.insName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="lecture-form-row">
            <div className="lecture-form-group">
              <label className="lecture-form-label">
                정원<span className="lecture-required">*</span>
              </label>
              <input
                type="number"
                name="lecPersonnel"
                className="lecture-form-input"
                defaultValue={detailValue?.lecPersonnel}
                min={0}
                required
              />
            </div>
            <div className="lecture-form-group">
              <label className="lecture-form-label">
                강의실<span className="lecture-required">*</span>
              </label>
              <select
                name="lecRoomId"
                className="lecture-form-select"
                key={detailValue?.lecRoomId}
                defaultValue={
                  !!payload?.id ? detailValue?.lecRoomId?.toString() : 'default'
                }
                required
              >
                <option value={'default'} disabled>
                  강의실 선택
                </option>
                {selectBoxClassRoom.map((classRoom) => (
                  <option key={classRoom.roomId} value={classRoom.roomId}>
                    {classRoom.roomName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="lecture-form-row">
            <div className="lecture-form-group">
              <label className="lecture-form-label">
                강의 시작일<span className="lecture-required">*</span>
              </label>
              <input
                type="date"
                name="lecStartDate"
                className="lecture-form-input"
                defaultValue={detailValue?.lecStartDate?.slice(0, 10)}
                required
              />
            </div>
            <div className="lecture-form-group">
              <label className="lecture-form-label">
                강의 종료일<span className="lecture-required">*</span>
              </label>
              <input
                type="date"
                name="lecEndDate"
                className="lecture-form-input"
                defaultValue={detailValue?.lecEndDate?.slice(0, 10)}
                required
              />
            </div>
          </div>

          <div className="lecture-form-row">
            <div className="lecture-form-group">
              <label className="lecture-form-label">
                강의 일수<span className="lecture-required">*</span>
              </label>
              <input
                type="number"
                name="lecDaysCnt"
                className="lecture-form-input"
                defaultValue={detailValue?.lecDaysCnt?.toString()}
                required
                min={0}
              />
            </div>
          </div>

          <div className="lecture-modal-footer">
            <button
              type="button"
              className="lecture-save-button"
              onClick={isEditModal ? updateLecture : saveLecture}
            >
              {isEditModal ? '수정' : '저장'}
            </button>
            <button
              type="button"
              className="lecture-cancel-button"
              onClick={() => {
                setModal({ isOpen: false, type: 'lecture' });
              }}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
