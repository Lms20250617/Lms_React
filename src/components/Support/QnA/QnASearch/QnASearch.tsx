import { useContext, useRef, useState } from 'react';
import './styled.css';
import { QnAContext } from '../../../../provider/support/QnAProvider';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';

export const QnASearch = () => {
  const [_, setModal] = useRecoilState(modalState);
  const title = useRef<HTMLInputElement>(null);
  const [currentSelected, setCurrentSelected] = useState('title');
  const { setSearchData } = useContext(QnAContext);

  const handleSelectChange = (e) => {
    setCurrentSelected(e.target.value);
  };

  const handlerSearch = () => {
    if (title.current?.value) {
      setSearchData({
        [currentSelected]: title.current.value,
      });
    }
  };

  const openModal = () => {
    setModal({ isOpen: true });
  };

  return (
    <div className="notice-container">
      <div className="input-box">
        <select onChange={handleSelectChange}>
          <option value="title">제목</option>
          <option value="writer">작성자</option>
        </select>
        <input ref={title}></input>
        <button onClick={handlerSearch}>검색</button>
        <button onClick={openModal}>등록</button>
      </div>
    </div>
  );
};
