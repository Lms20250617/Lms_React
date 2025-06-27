import { useContext, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';

import { modalState } from '../../../../stores/modalState';
import './styeld.css';
import { NoticeContext } from '../../../../provider/NoticeProvider';

export const NoticeSearch = () => {

  const [_, setModal] = useRecoilState(modalState);
  const title = useRef<HTMLInputElement>(null);
  const [startDate, setStarDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  const { setSearchData } =useContext(NoticeContext);

  const handlerSearch = () => {
    setSearchData({
      title: title.current ? title.current.value : '',
      startDate: startDate || '',
      endDate: endDate || '',
    })
  };

  const openModal = () => {
    setModal({isOpen: true});
  }

  return (
    <div className="notice-container">
      <div className="input-box">
        제목: <input ref={title}></input>
        <input 
        type="date" 
        onChange={(e) => setStarDate(e.target.value)}
        ></input>
        <input 
        type="date" 
        onChange={(e) => setEndDate(e.target.value)}
        ></input>
        <button onClick={handlerSearch}>검색</button>
        <button onClick={openModal}>등록</button>
      </div>
    </div>
  );
};
