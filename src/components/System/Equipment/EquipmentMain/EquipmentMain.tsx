import { useContext, useEffect, useState } from 'react';
import './styled.css';
import type {
  IClassroom,
  IClassroomResponse,
} from '../../../../model/System/IClassroom';
import { ClassEquipContext } from '../../../../provider/system/ClassroomEquipmentProvider';
import axios, { type AxiosResponse } from 'axios';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import type {
  IEquipmentDetail,
  IEquipmentResponse,
} from '../../../../model/System/IEquipment';
import { ContentBox } from '../../../common.componets/ContentBox/ContentBox';
import { EquipmentSearch } from '../EquipmentSearch/EquipmentSearch';
import { Portal } from '../../../../common/Portal';
import { EquipmentModal } from '../EquipmentModal/EquipmentModal';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';

export const EquipmentMain = () => {
  const [classroomList, setClassroomList] = useState<IClassroom[]>([]);
  const [ClassroomCnt, setClassroomCnt] = useState<number>(0);
  // class, equipment 검색창
  const { searchclassData, searchequipData } = useContext(ClassEquipContext);
  // 모달에 classroomId를
  const [classRoomId, setClassRoomId] = useState(0);
  // 장비 리스트
  const [equipmentList, setEquipmentList] = useState<IEquipmentDetail[]>([]);
  // 장비 총 개수
  const [equipmentCnt, setEquipmentCnt] = useState(0);
  // 선택된 강의실 ID, 클릭하면 equipment list 나오도록.
  const [selectedRoomId, setSelectedRoomId] = useState<number>(0);
  // 현재 상태값 : equipId, 상태를 업데이트하는 함수: setEquipmentId
  // 초기값이 0이고 타입은 number로 하겠다. roomId가 number임.
  const [equipId, setEquipmentId] = useState<number>(0);
  // 모달 불러오도록
  const [modal, setModal] = useRecoilState(modalState);

  // 검색한 classroom list 불러오기
  // useEffect(() => {
  // 컴포넌트가 랜더링된 후, 특정함수 실행
  // },[의존성 배열이 바뀔 때마다 특정함수 재실행.]);
  useEffect(() => {
    searchList();
  }, [searchclassData]);

  // selectedRoomId, searchequipData 값이 변하면 selectedRoomId값이 들어간 searchEquipmentList 실행
  useEffect(() => {
    selectedRoomId && searchEquipmentList(selectedRoomId);
  }, [selectedRoomId, searchequipData]);

  // 검색한 값을 통해 조건에 맞는 데이터를 불러옴
  //
  const searchList = (cPage?: number) => {
    // searchParam: 검색조건을 서버에 보내기위해 담는 객체
    const searchParam = new URLSearchParams();
    //searchParam의 append를 사용할것임. // 'title' -> 서버로 보낼 파라미터 // searchclassData.title -> props로부터 받은 데이터
    // => "searchclassData.title"이 존재하면 그 값을 'title'이라는 이름으로 서버에 보내고, 없으면 빈 문자열을 보낸다.
    searchParam.append('title', searchclassData.title || '');
    searchParam.append('personnel', String(searchclassData.personnel || ''));

    cPage = cPage || 1; // cPage가 undifined면 기본값 1
    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios
      // '/api/system/classroomListBody.do'주소에서 받아온것을 searchParam에 저장
      .post('/api/system/classroomListBody.do', searchParam)
      // post가 성공했을 때, 서버응답 객체(res)의 IClassroomResponse의 형식인 AxiosResponse 타입으로 명시하겠다.
      .then((res: AxiosResponse<IClassroomResponse>) => {
        // 그리고 이것을 밑의 함수로 실행한다.
        setClassroomList(res.data.list);
        setClassroomCnt(res.data.count);
      });
  };

  const searchEquipmentList = (roomId: number, cPage: number = 1) => {
    const params = new URLSearchParams();
    params.append('roomId', roomId.toString());
    params.append('equipName', searchequipData.equipName || '');
    params.append('searchStDate', searchequipData.searchStDate || '');
    params.append('searchEdDate', searchequipData.searchEdDate || '');
    params.append('currentPage', cPage.toString());
    params.append('pageSize', '5');

    axios
      .post('/api/system/equipmentListBody.do', params)
      .then((res: AxiosResponse<IEquipmentResponse>) => {
        setEquipmentList(res.data.list);
        setEquipmentCnt(res.data.count);
      });
  };

  // number형 timestamp를 받겠다. 얘를 string으로 반환하겠다.
  const formatDate = (timestamp: number): string => {
    // 넘겨받은 number형 timestamp를 Date객체 생성
    const date = new Date(timestamp);
    // date객체를 ISO 8601형식 문자열로 반환하겠다.
    return date.toISOString().split('T')[0];
  };

  // 사용기한이 초과되면 삭제할 수 있도록
  const handleDeleteExpiredEquipment = (equipId: number) => {
    if (!window.confirm('해당 장비를 삭제하시겠습니까?')) return;

    const params = new URLSearchParams();
    params.append('equipId', equipId.toString());

    axios.post('/api/system/equipmentDelete.do', params).then(() => {
      alert('삭제되었습니다.');
      searchEquipmentList(selectedRoomId!); // 목록 새로고침
    });
  };

  const postSuccess = () => {
    setModal({ isOpen: false });
    searchList();
    // roomId있으면 장비 리스트도 불러와라.
    if (selectedRoomId) {
      searchEquipmentList(selectedRoomId);
    }
  };

  const eqpuipmentDetail = (id: number) => {
    setModal({ isOpen: true });
    setEquipmentId(id);
  };

  return (
    <div className="equipment-main-container">
      {modal.isOpen && (
        <Portal>
          <EquipmentModal
            postSuccess={postSuccess}
            id={equipId}
            setId={setEquipmentId}
            // classRoomId를 바꾸고 그럴게 아니라 그대로 가져온다.
            classRoomId={classRoomId}
          ></EquipmentModal>
        </Portal>
      )}
      <table className="equipment-table">
        <thead className="equipment-table-header">
          <tr>
            <th>번호</th>
            <th>강의실 이름</th>
            <th>강의실 정원</th>
            <th>강의실 사이즈</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {classroomList.length > 0 ? (
            classroomList.map((classroom) => {
              return (
                <tr key={classroom.roomId} className="classroom-table-row">
                  <td className="classroom-cell">{classroom.roomId}</td>
                  <td
                    className="classroom-cell cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setSelectedRoomId(classroom.roomId);
                      // 받아온 id값을 setClassRoomId에 넣어라
                      setClassRoomId(classroom.roomId);
                    }}
                  >
                    {classroom.roomName}
                  </td>
                  <td className="classroom-cell">{classroom.roomPersonnel}</td>
                  <td className="classroom-cell">{classroom.roomSize}</td>
                  <td className="classroom-cell">{classroom.roomRemark}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="classroom-empty-row">
                등록된 강의실이 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PageNavigation
        totalItems={ClassroomCnt}
        itemsPerPage={5}
        onPageChange={searchList}
      />

      {selectedRoomId && (
        <>
          <ContentBox> 장비 상세 목록 </ContentBox>
          <EquipmentSearch></EquipmentSearch>

          <table className="equipment-table">
            <thead className="equipment-table-header">
              <tr>
                <th>정보</th>
                <th>시리얼넘버</th>
                <th>분류</th>
                <th>장비명</th>
                <th>수량</th>
                <th>구매일자</th>
                <th>잔여 사용기한</th>
              </tr>
            </thead>
            <tbody>
              {equipmentList.length > 0 ? (
                equipmentList.map((equipment) => {
                  const isImage =
                    equipment.fileExt === 'jpg' ||
                    equipment.fileExt === 'png' ||
                    equipment.fileExt === 'gif';
                  return (
                    <tr key={equipment.equipId} className="equipment-table-row">
                      <td className="equipment-cell">
                        {isImage ? (
                          <img
                            className="preview-image"
                            src={`/api${equipment.logicalPath}`}
                            alt="장비 이미지"
                          />
                        ) : (
                          <span>이미지 없음</span>
                        )}
                      </td>
                      <td className="equipment-cell">
                        {equipment.equipSerial}
                      </td>
                      <td className="equipment-cell">{equipment.equipGroup}</td>
                      <td
                        className="equipment-cell cursor-pointer text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          eqpuipmentDetail(equipment.equipId);
                        }}
                      >
                        {equipment.equipName}
                      </td>
                      <td className="equipment-cell">
                        {equipment.equipQuantity}
                      </td>
                      <td className="equipment-cell">
                        {formatDate(Number(equipment.equipPurchaseDate))}
                      </td>
                      <td className="equipment-cell">
                        {equipment.remainPeroid >= 0 ? (
                          `${equipment.remainPeroid}일`
                        ) : (
                          <span
                            className="cursor-pointer text-red-600 hover:underline"
                            onClick={() =>
                              handleDeleteExpiredEquipment(equipment.equipId)
                            }
                          >
                            장비삭제
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="classroom-empty-row">
                    등록된 장비가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <PageNavigation
            totalItems={equipmentCnt}
            itemsPerPage={5}
            onPageChange={searchList}
          />
        </>
      )}
    </div>
  );
};
