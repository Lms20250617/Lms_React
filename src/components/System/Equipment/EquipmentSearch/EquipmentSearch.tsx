import { useRecoilState } from 'recoil';
import './styeld.css';
import { useContext, useRef, useState } from 'react';
import { modalState } from '../../../../stores/modalState';
import { ClassEquipContext } from '../../../../provider/system/ClassroomEquipmentProvider';

export const EquipmentSearch = () => {
  const [_, setModal] = useRecoilState(modalState);
  const equipName = useRef<HTMLInputElement>(null);
  const [searchStDate, setStarDate] = useState('');
  const [searchEdDate, setEndDate] = useState('');

  const { setSearchepuipData } = useContext(ClassEquipContext);

  const handlerSearch = () => {
    setSearchepuipData({
      equipName: equipName.current?.value || '',
      searchStDate: searchStDate || '',
      searchEdDate: searchEdDate || '',
    });
  };

  const openModal = () => {
    setModal({ isOpen: true });
  };

  return (
    <div className="equipment-container">
      <div className="input-box">
        장비명: <input ref={equipName} />
        구매일자:{' '}
        <input
          type="date"
          value={searchStDate}
          onChange={(e) => setStarDate(e.target.value)}
        />
        <input
          type="date"
          value={searchEdDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={handlerSearch}>검색</button>
        <button onClick={openModal}>신규</button>
      </div>
    </div>
  );
};
