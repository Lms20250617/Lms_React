import { useContext, useEffect, useState, type ChangeEvent } from 'react';
import './styled.css';
import type {
  IClassroom,
  IClassroomResponse,
} from '../../../../model/System/IClassroom';
import { ClassroomContext } from '../../../../provider/system/ClassroomProvider';
import axios, { type AxiosResponse } from 'axios';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import type {
  IEquipmentDetail,
  IEquipmentResponse,
} from '../../../../model/System/IEquipment';
import { ContentBox } from '../../../common.componets/ContentBox/ContentBox';
import { EquipmentRoomSearch } from '../EquipmentRoomSearch/EquipmentRoomSearch';
import { EquipmentSearch } from '../EquipmentSearch/EquipmentSearch';
import { EquipmentProvider } from '../../../../provider/system/EquipmentProvider';

export const EquipmentMain = () => {
  const [classroomList, setClassroomList] = useState<IClassroom[]>([]);
  const [ClassroomCnt, setClassroomCnt] = useState<number>(0);

  const { searchData } = useContext(ClassroomContext);

  // 장비 리스트
  const [equipmentList, setEquipmentList] = useState<IEquipmentDetail[]>([]);
  // 장비 총 개수
  const [equipmentCnt, setEquipmentCnt] = useState(0);
  // 선택된 강의실 ID, 클릭하면 equipment list 나오도록.
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  // equipment 검색창
  const [equipmentSearch, setEquipmentSearch] = useState({
    equipName: '',
    searchStDate: '',
    searchEdDate: '',
  });

  // // 신규 장비 등록 모달 상태
  // const [modalOpen, setModalOpen] = useState(false);

  // classroom list 불러오기
  useEffect(() => {
    searchList();
  }, [searchData]);
  // 검색한 값을 통해 조건에 맞는 데이터를 불러옴
  const searchList = (cPage?: number) => {
    // searchParam: 검색조건을 서버에 보내기위해 담는 객체
    const searchParam = new URLSearchParams();
    searchParam.append('title', searchData.title || '');
    searchParam.append('personnel', String(searchData.personnel || ''));

    cPage = cPage || 1;
    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios
      .post('/api/system/classroomListBody.do', searchParam)
      .then((res: AxiosResponse<IClassroomResponse>) => {
        console.log(res.data.list);
        setClassroomList(res.data.list);
        setClassroomCnt(res.data.count);
      });
  };

  const searchEquipmentList = (roomId: number, cPage: number = 1) => {
    const params = new URLSearchParams();
    params.append('roomId', roomId.toString());
    params.append('equipName', equipmentSearch.equipName);
    params.append('searchStDate', equipmentSearch.searchStDate);
    params.append('searchEdDate', equipmentSearch.searchEdDate);
    params.append('currentPage', cPage.toString());
    params.append('pageSize', '5');

    axios
      .post('/api/system/equipmentListBody.do', params)
      .then((res: AxiosResponse<IEquipmentResponse>) => {
        console.log('[장비 응답 데이터]', res.data);
        setEquipmentList(res.data.list);
        setEquipmentCnt(res.data.count);
      });
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  };

  const formatRemainPeriod = (days: number): string =>
    days >= 0 ? `${days}일` : '사용기한 초과';

  return (
    <div className="equipment-main-container">
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
                      searchEquipmentList(classroom.roomId);
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
          <EquipmentProvider>
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
                      <tr
                        key={equipment.equipId}
                        className="equipment-table-row"
                      >
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
                        <td className="equipment-cell">
                          {equipment.equipGroup}
                        </td>
                        <td
                          className="equipment-cell cursor-pointer text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            // 여기에 장비 모달 뜨게할것임.
                            // setSelectedEquipment(equipment);
                            // setModalOpen(true);
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
                          {formatRemainPeriod(equipment.remainPeroid)}
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
          </EquipmentProvider>
        </>
      )}
    </div>
  );
};
