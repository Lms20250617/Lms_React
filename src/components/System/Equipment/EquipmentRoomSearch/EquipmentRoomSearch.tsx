import { useContext, useRef } from 'react';
import './styeld.css';
import { ClassEquipContext } from '../../../../provider/system/ClassroomEquipmentProvider';

export const EquipmentRoomSearch = () => {
  // title을 HTMLInputElement을 사용해서 Input할것임. null로 선언함.
  const title = useRef<HTMLInputElement>(null);
  // personnel을 HTMLInputElement을 사용해서 Input할것임. null로 선언함.
  const personnel = useRef<HTMLInputElement>(null);

  const { setSearchclassData } = useContext(ClassEquipContext);

  const handlerSearch = () => {
    const titleVal = title.current?.value || '';
    const personnelRaw = personnel.current?.value;

    setSearchclassData({
      title: titleVal,
      personnel: personnelRaw,
    });
  };

  return (
    <div className="equipment-container">
      <div className="input-box">
        강의실 이름: <input ref={title}></input>
        강의실 정원: <input ref={personnel} type="number" step={10}></input>
        <button onClick={handlerSearch}>검색</button>
      </div>
    </div>
  );
};
