import { useEffect, useRef, useState, type ChangeEvent, type FC } from 'react';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import type { IEquipmentDetail } from '../../../../model/System/IEquipment';
import axios, { type AxiosResponse } from 'axios';
import './Equipmentstyled.css';

// component에 넘겨줄 props의 정의 밑에 3가지를 props로 받아야함.
interface IEquipmentProps {
  // 등록/수정 후 목록 새로고침
  postSuccess: () => void;
  // 수정 시 대상 ID가 0이면 등록 모드
  id: number;
  // 모달 닫을 때 초기화용
  setId: React.Dispatch<React.SetStateAction<number>>;
  // Main에서 onClick하면서 roomId를 classRoomId에 담아서 가져왔다. readonly이다.
  classRoomId: number;
}
// .api가 성공했는지 실패했는지
interface IPostResponse {
  result: 'success' | 'fail';
}
// FC<IClassroomProps>는 props 타입을 IClassroomProps으로 지정함.
export const EquipmentModal: FC<IEquipmentProps> = ({
  // 밑의 것들이 props 타입
  postSuccess,
  id,
  setId,
  // props로 받아온것은 readonly여서 밑에서 useState를 통해 값을 변경해줄수 있게 할것임.
  classRoomId,
}) => {
  // useRecoilState으로 modalState를 관리하겠슴.
  // _ -> modal이 열려있을 때는 신경안쓰겠다.
  // setModal -> 모달을 닫거나 열 때 사용하겠다.
  const [_, setModal] = useRecoilState(modalState);
  // 특정 Dom에 접근하기위한 useRef
  // HTMLFormElement -> formRef로 참조할것임.
  // null -> 초기화된 DOM이 아직 없을 때의 값을 가지고 있어야함.
  const formRef = useRef<HTMLFormElement>(null);
  // equipment detail을 상태에 저장하겠다. 초기값은 없으니깐 ()
  const [detail, setDetail] = useState<IEquipmentDetail>();
  const [imageUrl, setImageUrl] = useState<string>('');
  // 강의실 목록을 상태로 저장
  const [roomList, setRoomList] = useState<
    { roomId: number; roomName: string }[]
  >([]);

  // 장비를 클릭했을 때, equipGroup이 db에 저장되어있는 것이 보이도록.
  const [equipGroup, setEquipGroup] = useState('');
  // main에서 classRoomId를 받아온 것을 classRoomValue에 담아서 강의실에 디폴트로 넘겨줄거임.
  const [classRoomValue, setClassRoomValue] = useState(classRoomId);

  // 강의실 select box 정보를 가져옴
  const getRoomList = () => {
    axios.post('/api/system/classroomJsonList.do').then((res) => {
      console.log(res.data.detailValue);
      setRoomList(res.data.detailValue);
    });
  };

  // 날짜를 ISOstring으로 바꿔줌.
  const toDateStr = (value: string | number | null | undefined): string => {
    if (!value) return '';
    return new Date(value).toISOString().slice(0, 10);
  };

  // detail이 바뀔 때, useEffect로 서버에서 받은 detail이 로딩된 이후에 equipGroup 값을 반영
  useEffect(() => {
    if (!detail) return; // detail이 undefined면 돌아가라.
    // detail.equipGroup이 존재하면 setEquipGroup을 실행해라.
    if (detail.equipGroup) setEquipGroup(detail.equipGroup);
  }, [detail]);

  useEffect(() => {
    // page가 열리자마자 getRoomList 실행
    getRoomList();
    // if 축약문
    // 조건 && 함수 --> 조건이 ture일 경우에만 함수를 실행시킨다.
    id && detailEquipment(); //  => if (id) {detailEquipment()} 와 같음!
    // 컴포넌트가 끝날 때(unmount), id를 0으로 리셋해라.
    return () => {
      setId(0);
    };
  }, []);

  const detailEquipment = () => {
    // 서버로 보낼 파라미터 객체 만들기
    const param = new URLSearchParams();
    // equip id = id 값 string으로 세팅
    param.append('equipId', id.toString());
    axios
      .post('/api/system/equipmentDetail.do', param) // post 요청
      .then((res: AxiosResponse<{ detailValue: IEquipmentDetail }>) => {
        // 성공!
        const raw = res.data.detailValue; // 서버가 준 원본 데이터를 raw에 담고
        const { fileExt, logicalPath } = raw; // raw.fileExt, raw.logicalPath를 fileExt, logicalPath로 지정

        if (fileExt === 'jpg' || fileExt === 'png' || fileExt === 'gif') {
          setImageUrl('/api' + logicalPath); // image면 url세팅
        } else {
          setImageUrl('');
        }
        const fixedDetail: IEquipmentDetail = {
          // fixedDetail는 IEquipmentDetail 타입을 따르겠다!
          ...raw, // raw(서버응답 받은 data)의 속성을 모두 복사한다.
          equipPurchaseDate: toDateStr(raw.equipPurchaseDate),
          equipPerioduseDate: toDateStr(raw.equipPerioduseDate),
        };
        setDetail(fixedDetail);
      });
  };

  const saveEquipment = () => {
    // alert
    // validateEquipForm 실패하면 중단.
    if (!validateEquipForm()) return;

    const form = formRef.current as HTMLFormElement;
    const formData = new FormData(form);
    //  roomId를 수동으로 숫자로 변환해서 다시 넣어줌
    const rawRoomId = formData.get('roomId')?.toString();
    if (rawRoomId) {
      formData.set('Fileclassroom', rawRoomId); // 이 key만 있으면 됨(백앤드에 저래되어있음)
    }
    axios
      .post('/api/system/equipFileSave.do', formData)
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === 'success') {
          postSuccess();
          alert('저장 되었습니다');
          setModal({ isOpen: false });
        }
      });
  };

  const updateDetail = () => {
    // alert
    if (!validateEquipForm()) return;

    const formData = new FormData(formRef.current as HTMLFormElement);
    // roomId가 비어있으면 detail에서 가져와서 다시 채워넣기
    // formData에 입력한 roomId값을 가져옴
    const rawRoomId = formData.get('roomId')?.toString();
    const fixedRoomId =
      // rawRoomId가 있을 때, trim --> 문자열의 앞뒤 공백을 제거하겠다
      // !=='' --> 공백을 제거한 값이 빈 문자열이 아닌지 확인
      rawRoomId && rawRoomId.trim() !== ''
        ? // 조건이 참이면 rawRoomId 사용
          rawRoomId
        : // 조건이 거짓일 때, detail 객체가 존재하면, roomId가 존재하면 number인 roomId를 string으로 변환
          // ?? '' --> 앞의 값이 null이나 undifined일 경우 ''(빈문자열)로 대체
          (detail?.roomId?.toString() ?? '');
    formData.set('roomId', fixedRoomId);
    // 혹시 백엔드에서 room_id 이름으로도 쓰면 대비
    formData.set('room_id', fixedRoomId);
    formData.append('equipId', id.toString());
    axios.post('/api/system/equipmentUpdate.do', formData).then((res) => {
      if (res.data.result === 'success') {
        alert('수정되었습니다!');
        setModal({ isOpen: false });
        postSuccess();
      }
    });
  };

  const deleteDetail = () => {
    const param = new URLSearchParams({ equipId: id.toString() });
    axios
      // equipmentDelete.do에서 equipId 받아서 삭제 진행
      .post('/api/system/equipmentDelete.do', param)
      .then((res: AxiosResponse<IPostResponse>) => {
        // 서버가 success 반환하면 alert창 알림
        if (res.data.result === 'success') {
          alert('삭제 되었습니다');
          setModal({ isOpen: false });
          postSuccess();
        }
      });
  };

  // e는 <input>의 이벤트 객체이며 타입은 ChangeEvent<HTMLInputElement>이다.
  const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
    // 사용자가 고른 파일을 fileInfo에 저장하겠다.
    const fileInfo = e.target.files;

    // 파일이 한개 선택되었는지 확인, ? --> fileInfo가 null일 때를 대비
    if (fileInfo?.length) {
      // 첫번째 파일의 이름을 . 기준으로 분리하겠다. ex) file.jpg --> ['file' , 'jpg' ]
      const fileInfoSplit = fileInfo[0].name.split('.');
      // fileInfoSplit에 저장된 2번째 객체인 파일 확장자를 소문자로 교체시킨다.
      const fileExt = fileInfoSplit[1].toLowerCase();

      // 확장자가 jpg, gif, png 일때,
      if (fileExt === 'jpg' || fileExt === 'gif' || fileExt === 'png') {
        // 브라우저 내 임시 URL(fileInfo[0]) 생성해서 setImageUrl 상태에 저장
        setImageUrl(URL.createObjectURL(fileInfo[0]));
      } else {
        // 이미지가 아닌경우 빈값 처리
        setImageUrl('');
      }
    }
  };

  // 정보 미입력시 alert
  const validateEquipForm = () => {
    // formRef로 연결된 <form> Dom을 가져오고 이건 form이다 명시
    const form = formRef.current as HTMLFormElement;
    // HTML <form>의 모든 input/select값들을 수집해서 FormData 객체로 만듬
    const formData = new FormData(form);

    // 필수 입력값 정의
    const requiredFields = [
      { key: 'equipSerial', label: '시리얼넘버' },
      { key: 'roomId', label: '강의실' },
      { key: 'equipName', label: '장비명' },
      { key: 'equipQuantity', label: '수량' },
      { key: 'equipPurchaseDate', label: '구매일자' },
      { key: 'equipGroup', label: '장비분류' },
    ];

    // 위 배열을 반복 검사
    // for (const 변수 of 반복가능한 객체)
    for (const field of requiredFields) {
      // 해당 key로 formData 값을 꺼냄
      // null일 수 있으니 ?.toString으로 처리
      // .trim() --> 공백만 입력된 경우를 막기위함.
      const value = formData.get(field.key)?.toString().trim();
      if (!value) {
        // null, undifined, ''일 때
        // alert창 띄우고 중단.
        alert(`${field.label}을 입력해주세요.`);
        return false;
      }
    }
    return true;
  };

  return (
    <div className="equip-modal-overlay">
      <form ref={formRef} className="equip-modal-form equip-modal-container">
        <h2 className="mb-4 text-center text-xl font-bold">장비 관리</h2>

        <label>
          <span>
            시리얼넘버<span className="required">*</span>
          </span>
          <input
            type="text"
            name="equipSerial"
            value={detail?.equipSerial}
            required
          />
        </label>

        <label>
          <span>
            강의실<span className="required">*</span>
          </span>
          {/* classRoomValue만 넘겨주면 됨 */}
          <select
            name="roomId"
            required
            value={classRoomValue}
            onChange={(e) => {
              // value를 string으로 다시 바꿔서 가져오길래 Number로 형변환 시켜줬다.
              setClassRoomValue(Number(e.target.value));
            }}
          >
            <option value="">선택하세요</option>
            {roomList.map((room) => (
              <option key={room.roomId} value={room.roomId}>
                {room.roomName}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>
            장비명<span className="required">*</span>
          </span>
          <input
            type="text"
            name="equipName"
            defaultValue={detail?.equipName}
            required
          />
        </label>

        <label>
          <span>
            수량<span className="required">*</span>
          </span>
          <input
            type="number"
            name="equipQuantity"
            // 최소가 0이 되도록
            min={0}
            defaultValue={detail?.equipQuantity}
            required
          />
        </label>

        <label>
          <span>
            구매일자<span className="required">*</span>
          </span>
          <input
            type="date"
            name="equipPurchaseDate"
            defaultValue={detail?.equipPurchaseDate}
            required
          />
        </label>

        <label>
          <span>
            장비분류<span className="required">*</span>
          </span>
          <select
            name="equipGroup"
            value={equipGroup}
            onChange={(e) => setEquipGroup(e.target.value)}
            required
          >
            <option value="">장비를 선택하세요</option>
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
        </label>

        <label>
          <span>사용기한</span>
          <input
            type="date"
            name="equipPerioduseDate"
            defaultValue={detail?.equipPerioduseDate}
          />
        </label>

        <label>
          <span>파일</span>
          <div>
            <input
              type="file"
              name="file"
              id="fileInput"
              onChange={handlerFile}
            />
            <label htmlFor="fileInput" className="img-label">
              파일 선택
            </label>
          </div>
        </label>

        <div>
          <label className="mb-2 block font-semibold text-gray-800">
            미리보기
          </label>
          {imageUrl ? (
            <img className="preview-image" src={imageUrl} alt="미리보기" />
          ) : (
            <div>미리보기 없음</div>
          )}
        </div>

        <div className="button-container">
          <button type="button" onClick={id ? updateDetail : saveEquipment}>
            {id ? '수정' : '저장'}
          </button>
          {id !== 0 && (
            <button type="button" onClick={deleteDetail}>
              삭제
            </button>
          )}
          <button type="button" onClick={() => setModal({ isOpen: false })}>
            닫기
          </button>
        </div>
      </form>
    </div>
  );
};
