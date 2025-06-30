import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { useContext, useRef } from 'react';
import './styeld.css';
import { ClassEquipContext } from '../../../../provider/system/ClassroomEquipmentProvider';

// ClassroomSearch를 다른 곳에서 사용할 것임.
export const ClassroomSearch = () => {
  const [_, setmodal] = useRecoilState(modalState);
  // title을 HTMLInputElement을 사용해서 Input할것임. null로 선언함.
  const title = useRef<HTMLInputElement>(null);
  // personnel을 HTMLInputElement을 사용해서 Input할것임. null로 선언함.
  const personnel = useRef<HTMLInputElement>(null);

  const { setSearchclassData } = useContext(ClassEquipContext);

  // 용도 : 검색
  const handlerSearch = () => {
    // titleVal : 검색한 강의실 이름, 검색 내용이 없을 경우 빈 문자열
    // personnelRaw : 강의실 정원
    const titleVal = title.current?.value || '';
    const personnelRaw = personnel.current?.value;

    // ClassroomProvider에 있는 searchData를 입력한 검색값으로 변경
    setSearchclassData({
      title: titleVal,
      personnel: personnelRaw,
    });
  };

  const openModal = () => {
    setmodal({ isOpen: true });
  };

  return (
    <div className="classroom-container">
      <div className="input-box">
        강의실 이름: <input ref={title}></input>
        강의실 정원: <input ref={personnel} type="number" step={10}></input>
        <button onClick={handlerSearch}>검색</button>
        <button onClick={openModal}>신규</button>
      </div>
    </div>
  );
};
