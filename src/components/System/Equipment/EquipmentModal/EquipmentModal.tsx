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

  // detail이 로딩된 이후에 equipGroup 값을 반영
  useEffect(() => {
    if (!detail) return; // detail이 undefined면 바로

    if (detail.equipGroup) setEquipGroup(detail.equipGroup);
  }, [detail]);

  useEffect(() => {
    getRoomList();
    id && detailEquipment();
    return () => {
      setId(0);
    };
  }, []);

  // 강의실 select box 정보를 가져옴
  const getRoomList = () => {
    axios.post('/api/system/classroomJsonList.do').then((res) => {
      console.log(res.data.detailValue);
      setRoomList(res.data.detailValue);
    });
  };

  const detailEquipment = () => {
    const param = new URLSearchParams();
    param.append('equipId', id.toString());
    axios
      .post('/api/system/equipmentDetail.do', param)
      .then((res: AxiosResponse<{ detailValue: IEquipmentDetail }>) => {
        const raw = res.data.detailValue;
        const { fileExt, logicalPath } = raw;

        if (fileExt === 'jpg' || fileExt === 'png' || fileExt === 'gif') {
          setImageUrl('/api' + logicalPath);
        } else {
          setImageUrl('');
        }
        const fixedDetail: IEquipmentDetail = {
          ...raw,
          equipPurchaseDate: toDateStr(raw.equipPurchaseDate),
          equipPerioduseDate: toDateStr(raw.equipPerioduseDate),
        };
        setDetail(fixedDetail);
      });
  };

  const saveEquipment = () => {
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
    const formData = new FormData(formRef.current as HTMLFormElement);
    // roomId가 비어있으면 detail에서 가져와서 다시 채워넣기
    const rawRoomId = formData.get('roomId')?.toString();
    const fixedRoomId =
      rawRoomId && rawRoomId.trim() !== ''
        ? rawRoomId
        : (detail?.roomId?.toString() ?? '');
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
      .post('/api/system/equipmentDelete.do', param)
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === 'success') {
          alert('삭제 되었습니다');
          setModal({ isOpen: false });
          postSuccess();
        }
      });
  };

  const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInfo = e.target.files;

    if (fileInfo?.length) {
      const fileInfoSplit = fileInfo[0].name.split('.');
      const fileExt = fileInfoSplit[1].toLowerCase();

      if (fileExt === 'jpg' || fileExt === 'gif' || fileExt === 'png') {
        setImageUrl(URL.createObjectURL(fileInfo[0]));
      } else {
        setImageUrl('');
      }
    }
  };

  // 날짜를 ISOstring으로 바꿔줌.
  const toDateStr = (value: string | number | null | undefined): string => {
    if (!value) return '';
    return new Date(value).toISOString().slice(0, 10);
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
