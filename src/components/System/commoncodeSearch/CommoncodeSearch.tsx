import { useContext, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { CommonCodeContext } from '../../../provider/CommoncodeProvier';
import { modalState } from '../../../stores/modalState';
import './styeld.css';

export const CommoncodeSearch = () => {
  const [_, setModal] = useRecoilState(modalState);

  const commonGroup = useRef<HTMLSelectElement>(null);
  const groupCode = useRef<HTMLSelectElement>(null);
  const detailCode = useRef<HTMLInputElement>(null);

  const { SetSearchData } = useContext(CommonCodeContext);

  const handlerSearch = () => {

    SetSearchData({
      commonGroup: commonGroup.current ? commonGroup.current.value : '',
      groupCode: groupCode.current ? groupCode.current.value : '',
      detailCode: detailCode.current ? detailCode.current.value : '',
    });
  };

  return (
    <div className="notice-container-commoncode">
      <div className="input-box">
        분류 :
        <select ref={commonGroup} className='w-3/16 ml-2'>
          <option value=''>-분류-</option>
          <option value="equip">장비</option>
          <option value="loc">지역</option>
        </select>
        그룹코드 :
        <select ref={groupCode} className='w-3/16  ml-2'>
          <option value="">-그룹코드-</option>
          <option value="com">컴퓨터</option>
          <option value="ms">마우스</option>
          <option value="msp">마우스패드</option>
          <option value="kb">키보드</option>
          <option value="mt">모니터</option>
          <option value="dk">책상</option>
          <option value="chr">의자</option>
          <option value="wb">화이트보드</option>
          <option value="etc">기타</option>
        </select>
        상세코드: <input ref={detailCode} className='w-3/16'></input>
        <button onClick={handlerSearch}>검색</button>
      </div>
    </div>
  );
};
