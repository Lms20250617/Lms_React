import { useRef, useState, type FC } from 'react';
import { modalState } from '../../../../stores/modalState';
import { useRecoilState } from 'recoil';
import axios, { type AxiosResponse } from 'axios';

interface IRecruitModalProp {
  studentId: string;
  searchList: () => void;
}

export const RecruitModal: FC<IRecruitModalProp> = ({
  studentId,
  searchList,
}) => {
  const empName = useRef(null);
  const [empJoinDate, setEmpJoinDate] = useState<string>('');
  const [modal, setModal] = useRecoilState(modalState);

  const handleSave = () => {
    if (!empName.current.value) {
      alert('회사명을 입력해주세요.');
      return;
    }
    if (!empJoinDate) {
      alert('입사일을 선택해주세요.');
      return;
    }
    const param = new URLSearchParams();
    param.append('loginID', studentId);
    param.append('empName', empName.current.value);
    param.append('empJoinDate', empJoinDate);
    axios
      .post('/api/manage/RecruitSave.do', param)
      .then((res: AxiosResponse) => {
        if (res.data.result === 'success') {
          alert('저장되었습니다.');
          searchList();
          setModal({ isOpen: false });
        } else {
          alert('재직 여부를 확인해주세요.');
        }
      });
  };
  return (
    <div className="modal-overlay">
      <div className="relative max-h-[90vh] w-full max-w-[700px] overflow-y-auto rounded-lg bg-white p-5 opacity-100 shadow-lg">
        {/* 상단 정보 */}
        <div className="mb-4 grid grid-cols-2 gap-4"></div>

        <label>
          회사명:
          <input type="text" ref={empName}></input>
        </label>
        <label>
          입사일
          <input
            type="date"
            onChange={(e) => {
              setEmpJoinDate(e.target.value);
            }}
          ></input>
        </label>
        <div className="button-container">
          <button type="button" onClick={handleSave}>
            저장
          </button>
          <button
            type="button"
            onClick={() => {
              setModal({ isOpen: false });
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
