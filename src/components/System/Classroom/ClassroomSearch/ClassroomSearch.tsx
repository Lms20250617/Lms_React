import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { useContext, useRef } from 'react';
import './styeld.css';
import { ClassroomContext } from '../../../../provider/ClassroomProvider';

export const ClassroomSearch = () => {
  const [_, setmodal] = useRecoilState(modalState);
  const title = useRef<HTMLInputElement>(null);
  const person = useRef<HTMLInputElement>(null);

  const { setSearchData } = useContext(ClassroomContext);

  const openModal = () => {
    setmodal({ isOpen: true });
  };

  const handlerSearch = () => {
    setSearchData({
      title: title.current ? title.current.value : '',
      person: person.current ? person.current.value : '',
    });
    console.log(handlerSearch);
  };

  return (
    <div className="classroom-container">
      <div className="input-box">
        강의실 이름: <input ref={title}></input>
        강의실 정원: <input ref={person}></input>
        <button onClick={handlerSearch}>검색</button>
        <button onClick={openModal}>신규</button>
      </div>
    </div>
  );
};
