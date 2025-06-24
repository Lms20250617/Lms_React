import { useContext, useRef, useState } from 'react';
import { StudentContext } from '../../../../provider/manage/StudentProvider';
import './styeld.css';

export const StudentSearch = () => {
  const name = useRef<HTMLInputElement>(null);
  const [startDate, setStarDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [selectedValue, setSelectedValue] = useState<string>('');

  const { setSearchData } = useContext(StudentContext);

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
    <div className="student-container">
      <div className="input-box">
        {'이름: '}
        <input ref={name}></input>
        {'  재학상태 : '}
        <select
          name="searchStatusYn"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value="">선택</option>
          <option value="W">승인대기</option>
          <option value="Y">재학</option>
          <option value="N">탈퇴</option>
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
