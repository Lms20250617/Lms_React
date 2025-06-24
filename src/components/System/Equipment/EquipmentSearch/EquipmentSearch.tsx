import { useRecoilState } from 'recoil';
import './styeld.css';
import { useContext, useRef, useState } from 'react';
import { modalState } from '../../../../stores/modalState';
import { EquipmentContext } from '../../../../provider/system/EquipmentProvider';

export const EquipmentSearch = () => {
  //   const [_, setModal] = useRecoilState(modalState);
  const searchequipName = useRef<HTMLInputElement>(null);
  const [searchStDate, setStarDate] = useState<string>();
  const [searchEdDate, setEndDate] = useState<string>();

  const { setSearchData } = useContext(EquipmentContext);

  const handlerSearch = () => {
    setSearchData({
      equipName: searchequipName.current
        ? searchequipName.current.value
        : '',
      searchStDate: searchStDate || '',
      searchEdDate: searchEdDate || '',
    });
  };

  //   const openModal = () => {
  //     setModal({isOpen: true});
  //   }

  return (
    <div className="equipment-container">
      <div className="input-box">
        장비명: <input ref={searchequipName}></input>
        구매일자:{' '}
        <input
          type="date"
          onChange={(e) => setStarDate(e.target.value)}
        ></input>
        <input type="date" onChange={(e) => setEndDate(e.target.value)}></input>
        <button onClick={handlerSearch}>검색</button>
        <button 
        // onClick={openModal}
        >
            신규</button>
      </div>
    </div>
  );
};
