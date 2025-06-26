import { useContext, useRef, useState } from 'react';
import { AttendanceContext } from '../../../../provider/Lecture/AttendanceProvider';

export const AttendanceSearch = () => {
  const lecName = useRef<HTMLInputElement>(null);
  const [startDate, setStarDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const { setSearchData } = useContext(AttendanceContext);

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
      lecName: lecName.current ? lecName.current.value : '',
      startDate: startDate || '',
      endDate: endDate || '',
    });
  };

  return (
    <div className="notice-container">
      <div className="input-box">
        <input ref={lecName}></input>
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
