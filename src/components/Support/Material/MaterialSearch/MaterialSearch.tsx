import { useContext, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { MaterialContext } from '../../../../provider/support/MaterialProvier';
import { modalState } from '../../../../stores/modalState';
import './styeld.css';

export const MaterialSearch = () => {

  const [_, setModal] = useRecoilState(modalState);
  const title = useRef<HTMLInputElement>(null);
  const writer = useRef<HTMLInputElement>(null);

  const { setSearchData } =useContext(MaterialContext);

  const [selectedValue, setSelectValue] = useState('title');
  const [inputName, setInputName] = useState('');


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

    console.log(title.current?.value);

    setSearchData({
      title: title.current ? title.current.value : '',
      writer: writer.current ? writer.current.value : '',
    })

  };

  const openModal = () => {
    setModal({isOpen: true});
  }

  return (
    <div className="notice-container">
      <div className="input-box">
        제목: 
        <select 
        className='selectedValue'
        name={selectedValue}
        value={selectedValue}
        onChange={(e) => {
            setSelectValue(e.target.value);
        }}
        >
            <option value='title'>제목</option>
            <option value='writer'>작성자</option>
        </select>
        <input 
        type="text" 
        ref={selectedValue === 'title' ? title : writer}
        ></input>
        <button onClick={handlerSearch}>검색</button>
        <button onClick={openModal}>등록</button>
      </div>
    </div>
  );
};
