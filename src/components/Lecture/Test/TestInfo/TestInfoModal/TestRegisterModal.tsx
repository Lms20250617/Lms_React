import { useRef } from 'react';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../../stores/modalState';

export const TestRegisterModal = () => {
  const [_, setModal] = useRecoilState(modalState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="modal-overlay">
      <form ref={formRef} className="modal-form modal-container">
        <label>
          강의 :
          <input type="text" name="fileTitle" />
        </label>
        <label>
          강사 :
          <input type="text" defaultValue={''} readOnly={true} />
        </label>
        <label>
          강의실 :
          <input type="text" defaultValue={''} readOnly={true} />
        </label>
        <label>시험시작일</label>
        <label>시험종료일</label>
        <div className="button-container">
          <button type="button">저장</button>

          <button
            type="button"
            onClick={() => {
              setModal({ isOpen: false });
            }}
          >
            나가기
          </button>
        </div>
      </form>
    </div>
  );
};
