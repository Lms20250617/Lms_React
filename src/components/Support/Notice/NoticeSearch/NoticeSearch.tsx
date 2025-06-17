import { useContext, useEffect, useRef, useState } from 'react';
import './styeld.css';
import { useNavigate } from 'react-router-dom';
import { NoticeContext } from '../../../../provider/NoticeProvider';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';

export const NoticeSearch = () => {

  const [_, setModal] = useRecoilState(modalState);
  const title = useRef<HTMLInputElement>(null);
  const [startDate, setStarDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  const { setSearchData } =useContext(NoticeContext);


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
