import { useContext, useRef, useState } from 'react';
import './styeld.css';
import { TutorContext } from '../../../../provider/manage/TutorProvider';

export const TutorSearch = () => {
  const name = useRef<HTMLInputElement>(null);
  const [startDate, setStarDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string>('');

  const { setSearchData } = useContext(TutorContext);

  const handlerSearch = () => {
    if (!!startDate && !!endDate) {
      if (startDate >= endDate) {
        alert(
          '강의 날짜 입력을 잘못했습니다. 시작일이 종료일보다 늦을 수 없습니다.'
        );
        return false;
      }
    }
    setSearchData({
      searchName: name.current ? name.current.value : '',
      regStDate: startDate || '',
      regEdDate: endDate || '',
      searchStatusYn: selectedValue,
    });
  };

  return (
    <div className="tutor-container">
      <div className="input-box">
        {'이름: '}
        <input ref={name}></input>
        {'  재직상태 : '}
        <select
          name="searchStatusYn"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value="">선택</option>
          <option value="W">승인대기</option>
          <option value="Y">재직</option>
          <option value="N">퇴직</option>
        </select>
        <input
          type="date"
          onChange={(e) => setStarDate(e.target.value)}
        ></input>
        <input type="date" onChange={(e) => setEndDate(e.target.value)}></input>
        <button onClick={handlerSearch}>검색</button>
      </div>
    </div>
  );
};
