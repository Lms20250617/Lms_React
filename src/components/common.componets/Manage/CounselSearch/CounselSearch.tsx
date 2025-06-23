import { useContext, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { ICounselContext } from '../../../../provider/manage/CounselProvier';
import { modalState } from '../../../../stores/modalState';
import './styeld.css';

export const CounselSearch = () => {

  const [_, setModal] = useRecoilState(modalState);
  const searchTitle = useRef<HTMLInputElement>(null);
  const [startDate, setStarDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  const { setSearchData } =useContext(ICounselContext);

  const handlerSearch = () => {


    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    if (start > end) {
      alert("시작일이 종료일보다 이후입니다!");
      return;
    }


    setSearchData({
      searchTitle: searchTitle.current ? searchTitle.current.value : '',
      startDate: startDate || '',
      endDate: endDate || '',
    })

  };

  const handlerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter'){
      handlerSearch();
    }
  }

  const openModal = () => {
    setModal({isOpen: true});
  }

  return (
    <div className="notice-container">
      <div className="input-box">
        제목: <input ref={searchTitle} onKeyDown={handlerKeyDown}></input>
        <input 
        type="date" 
        onChange={(e) => setStarDate(e.target.value)}
        onKeyDown={handlerKeyDown}
        ></input>
        <input 
        type="date" 
        onChange={(e) => setEndDate(e.target.value)}
        onKeyDown={handlerKeyDown}
        ></input>
        <button onClick={handlerSearch}>검색</button>
        <button onClick={openModal}>등록</button>
      </div>
    </div>
  );
};