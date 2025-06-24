import { useContext, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { CompanyContext } from '../../../../provider/System/CompanyProvider';
import './styeld.css';

export const CompanySearch = () => {
  const title = useRef<HTMLInputElement>(null);
  const [startDate, setStarDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [_, setModal] = useRecoilState(modalState);

  const { setSearchData } = useContext(CompanyContext);

  const handlerSearch = () => {
    if (!!startDate && !!endDate) {
      if (startDate >= endDate) {
        alert(
          '날짜 입력을 잘못했습니다. 시작일이 종료일보다 늦을 수 없습니다.'
        );
        return false;
      }
    }
    setSearchData({
      companyName: title.current ? title.current.value : '',
      searchStDate: startDate || '',
      searchEdDate: endDate || '',
    });
  };

  return (
    <div className="company-container">
      <div className="input-box">
        {'기업 이름: '}
        <input ref={title}></input>
        <input
          type="date"
          onChange={(e) => setStarDate(e.target.value)}
        ></input>
        <input type="date" onChange={(e) => setEndDate(e.target.value)}></input>
        <button onClick={handlerSearch}>검색</button>
        <button
          onClick={() => {
            setModal({ isOpen: true });
          }}
        >
          신규
        </button>
      </div>
    </div>
  );
};
