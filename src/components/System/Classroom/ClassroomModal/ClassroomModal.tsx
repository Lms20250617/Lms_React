import { useEffect, useRef, useState, type FC } from 'react';
import type React from 'react';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import axios, { type AxiosResponse } from 'axios';
import type { IClassroom } from '../../../../model/System/IClassroom';
import './styled.css';

// component에 넘겨줄 props의 정의 밑에 3가지를 props로 받아야함.
interface IClassroomProps {
  postSuccess: () => void;
  // id는 강의실의 고유번호 (바꿀 수 없음.)
  id: number;
  //  number type의 상태값을 업데이트 하기위한 set타입의 함수
  setId: React.Dispatch<React.SetStateAction<number>>;
}
// .api가 성공했는지 실패했는지
interface IPostResponse {
  result: 'success' | 'fail';
}

// FC<IClassroomProps>는 props 타입을 IClassroomProps으로 지정함.
export const ClassroomModal: FC<IClassroomProps> = ({
  // 밑의 것들이 props 타입
  postSuccess,
  id,
  setId,
}) => {
  // useRecoilState으로 modalState를 관리하겠슴.
  // _ -> modal이 열려있을 때는 신경안쓰겠다.
  // setModal -> 모달을 닫거나 열 때 사용하겠다.
  const [_, setModal] = useRecoilState(modalState);
  // 특정 Dom에 접근하기위한 useRef
  // HTMLFormElement -> formRef로 참조할것임.
  const formRef = useRef<HTMLFormElement>(null);
  const [detail, setDetail] = useState<IClassroom>();
  // id가 존재하면 detatilClassroom이 실행되는데, 이 component가 사라지면 setId를 0으로 만들어준다.
  // useEffect(() => {...; retrun...;}, []) -> 이렇게 한 이유는
  // 1. useEffect가 컴포넌트가 처음 mount 될때 실행된다.
  // 2. id가 있을 때, detailClassroom에서 상세를 불러온다.
  // 3. 컴포넌트가 사라질 때, 출력(return)으로 인해 setId가 0이된다.
  // 4. 그리고 [상태값] 이 실행되면서 본문의 undifined인 []가 실행되므로 setId는 0이 된다.
  useEffect(() => {
    id && detailClassroom();
    return () => {
      setId(0);
    };
  }, []);

  const saveClassroom = () => {
    axios
      .post('/api/system/classroomSave.do', formRef.current)
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === 'success') {
          alert('저장 되었습니다');
          setModal({ isOpen: false });
          postSuccess();
        }
      });
  };
  // param 가져와서 IClassroom으로 보여줄것임. 밑에서 활용
  const detailClassroom = () => {
    const param = new URLSearchParams();

    param.append('roomId', id.toString());

    axios
      .post('/api/system/classroomDetail.do', param)
      .then((res: AxiosResponse<{ detailValue: IClassroom }>) => {
        // console.log('백엔드에서 받아온 detail 값', res.data.detailValue);
        setDetail(res.data.detailValue);
      });
  };

  const updateDetail = () => {
    // HTMLFormElement에서 formRef.current로 input 값들을 모아서 FormData를 만든다.
    const formData = new FormData(formRef.current as HTMLFormElement);
    // formData에 roomId를 수동으로 추가
    formData.append('roomId', id.toString());
    // 만들어진 formData를 서버로 post보내고 then으로 응답받음.
    // 성공이면 alert
    axios
      .post('/api/system/classroomUpdate.do', formData)
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === 'success') {
          alert('수정 되었습니다');
          setModal({ isOpen: false });
          postSuccess();
        }
      });
  };

  const deleteDetail = () => {
    const param = new URLSearchParams({ roomId: id.toString() });

    axios
      .post('/api/system/classroomDelete.do', param)
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === 'success') {
          alert('삭제 되었습니다');
          setModal({ isOpen: false });
          postSuccess();
        }
      });
  };

  // 69line을 이용해서 백앤드에서 가져오는 detail값을 확인하여type과 name을 맞춰준다.
  return (
    <div className="modal-overlay">
      <form ref={formRef} className="modal-form modal-container">
        <label>
          강의실 이름 :
          <input type="text" name="roomName" defaultValue={detail?.roomName} />
        </label>
        <label>
          강의실 정원 :
          <input
            type="number"
            step={1}
            name="roomPersonnel"
            defaultValue={detail?.roomPersonnel}
          />
        </label>
        <label>
          강의실 사이즈 :
          <input type="text" name="roomSize" defaultValue={detail?.roomSize} />
        </label>
        <label>
          비고 :
          <input
            type="text"
            name="roomRemark"
            defaultValue={detail?.roomRemark}
          />
        </label>
        <div className="button-container">
          <button type="button" onClick={!id ? saveClassroom : updateDetail}>
            {!id ? '저장' : '수정'}
          </button>
          {!!id && (
            <button type="button" onClick={deleteDetail}>
              삭제
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setModal({ isOpen: false });
            }}
          >
            나가기
          </button>
        </div>
      </form>
    </div>
  );
};
