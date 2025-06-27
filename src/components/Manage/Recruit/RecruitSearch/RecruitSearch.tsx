import { useContext, useRef, useState } from 'react';
import { RecruitContext } from '../../../../provider/manage/RecruitProvider';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';

export const RecruitSearch = () => {
  const [_, setModal] = useRecoilState(modalState);
  const title = useRef<HTMLInputElement>(null);
  const [startDate, setStarDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  const { setSearchData } = useContext(RecruitContext);

  const handlerSearch = () => {
    setSearchData({
      studentName: title.current ? title.current.value : '',
      searchStDate: startDate || '',
      searchEdDate: endDate || '',
    });
  };

  const openModal = () => {
    setModal({ isOpen: true });
  };

  return (
    <div className="notice-container">
      <div className="input-box">
        학생명 <input ref={title}></input>
        <input
          type="date"
          onChange={(e) => setStarDate(e.target.value)}
        ></input>
        입사일자:
        <input type="date" onChange={(e) => setEndDate(e.target.value)}></input>
        <button onClick={handlerSearch}>검색</button>
      </div>
    </div>
  );
};
