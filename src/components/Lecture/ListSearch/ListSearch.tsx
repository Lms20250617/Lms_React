import { useContext, useRef, useState } from 'react';
import './styeld.css';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../stores/modalState';
import { ListContext } from '../../../provider/Lecture/ListProvider';

export const ListSearch = () => {
  const [_, setModal] = useRecoilState(modalState);
  const title = useRef<HTMLInputElement>(null);
  const [startDate, setStarDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [selectedValue, setSelectedValue] = useState<string>('lecName');

  const { setSearchData } = useContext(ListContext);

  const handlerSearch = () => {
    setSearchData({
      searchTitle: title.current ? title.current.value : '',
      searchStDate: startDate || '',
      searchEdDate: endDate || '',
      searchTag: selectedValue,
    });
  };

  return (
    <div className="list-container">
      <div className="input-box">
        <select
          name="searchTag"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value="lecName">강의명</option>
          <option value="lecInstructorName">강사명</option>
          <option value="lecRoomName">강의실</option>
        </select>

        <input ref={title}></input>
        <input
          type="date"
          onChange={(e) => setStarDate(e.target.value)}
        ></input>
        <input type="date" onChange={(e) => setEndDate(e.target.value)}></input>
        <button onClick={handlerSearch}>검색</button>
        <button onClick={() => setModal({ isOpen: true })}>등록</button>
      </div>
    </div>
  );
};
