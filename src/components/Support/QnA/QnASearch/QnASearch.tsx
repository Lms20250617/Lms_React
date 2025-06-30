import { useContext, useRef, useState } from 'react';
import './styled.css';
import { QnAContext } from '../../../../provider/support/QnAProvider';
import { useRecoilState, useRecoilValue } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { loginInfoState } from '../../../../stores/userInfo';

export const QnASearch = () => {
  const [_, setModal] = useRecoilState(modalState);
  const title = useRef<HTMLInputElement>(null);
  const [currentSelected, setCurrentSelected] = useState('title');
  const { setSearchData } = useContext(QnAContext);
  const { userType, loginId } = useRecoilValue(loginInfoState);
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
    setModal({ isOpen: true, type: 'register' });
  };

  return (
    <div className="notice-container">
      <div className="input-box">
        <select onChange={handleSelectChange}>
          <option value="title">강의명</option>
          <option value="writer">작성자</option>
        </select>
        <input ref={title}></input>
        <button onClick={handlerSearch}>검색</button>
        {userType === 'S' && <button onClick={openModal}>등록</button>}
      </div>
    </div>
  );
};
