import {
  useContext,
  useEffect,
  useRef,
  useState,
  type BaseSyntheticEvent,
  type ChangeEvent,
  type ReactEventHandler,
} from 'react';
import './styeld.css';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../../stores/modalState';
import { TestInfoContext } from '../../../../../provider/TestInfoProvider';

export const TestInfoSearch = () => {
  const [_, setModal] = useRecoilState(modalState);
  const searchTitle = useRef<HTMLInputElement>(null);
  const [startDate, setStarDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [searchTag, setSearchTag] = useState<
    'lecName' | 'lecInstructorName' | 'lecRoomName'
  >('lecName');
  const { setSearchData } = useContext(TestInfoContext);

  // const navigate = useNavigate();

  // useEffect(()=>{
  //   window.location.search && navigate(window.location.pathname)
  // },[navigate])

  const handlerSearch = () => {
    // //console.log(startDate, endDate, title.current?.value);
    // const query:string[] = [];

    // !title.current?.value || query.push(`title=${title.current.value}`);
    // !startDate || query.push(`startDate=${startDate}`);
    // !endDate || query.push(`endDate=${endDate}`);

    // const querySring = query.length > 0 ? `?${query.join("&")}` : '';

    // navigate(querySring);

    setSearchData({
      searchTag: searchTag,
      searchTitle: searchTitle.current ? searchTitle.current.value : '',
      startDate: startDate || '',
      endDate: endDate || '',
    });
  };

  const openModal = () => {
    setModal({ isOpen: true, payload: 'register' });
  };

  const handleSearchTagSelect = (e: BaseSyntheticEvent) => {
    setSearchTag(e.target.value);
  };

  return (
    <div className="notice-container">
      <div className="input-box">
        <select name="searchTag" onChange={handleSearchTagSelect}>
          <option value="lecName">강의명</option>
          <option value="lecInstructorName">강사명</option>
          <option value="lecRoomName">강의실</option>
        </select>
        <input ref={searchTitle}></input>
        <input
          type="date"
          onChange={(e) => setStarDate(e.target.value)}
        ></input>
        <input type="date" onChange={(e) => setEndDate(e.target.value)}></input>
        <button onClick={handlerSearch}>검색</button>
        <button onClick={openModal}>등록</button>
      </div>
    </div>
  );
};
