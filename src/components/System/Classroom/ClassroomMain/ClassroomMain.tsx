import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { useContext, useEffect, useState } from 'react';
import axios, { type AxiosResponse } from 'axios';
import { Portal } from '../../../../common/Portal';
import { ClassroomModal } from '../ClassroomModal/ClassroomModal';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import './styled.css';
import type {
  IClassroom,
  IClassroomResponse,
} from '../../../../model/System/IClassroom';
import { ClassEquipContext } from '../../../../provider/system/ClassroomEquipmentProvider';

export const ClassroomMain = () => {
  const [classroomList, setClassroomList] = useState<IClassroom[]>([]);
  const [ClassroomCnt, setClassroomCnt] = useState<number>(0);

  const { searchclassData } = useContext(ClassEquipContext);
  const [classroomId, setClassroomId] = useState<number>(0);

  const [modal, setModal] = useRecoilState(modalState);

  useEffect(() => {
    searchList();
  }, [searchclassData]);

  // 용도 : 검색한 값을 통해서 조건에 맞는 데이터를 불러옵니다.
  const searchList = (cPage?: number) => {
    // searchParam : 검색 조건을 서버에 보내기 위해서 담는 객체
    const searchParam = new URLSearchParams();
    // searchData.title, searchData.personnel을 searchParam에 담음
    // searchData.title은 서버에서 'title'라는 이름으로 사용을 할거임
    // String(searchData.personnel)는 서버에서 'personnel'로 사용
    searchParam.append('title', searchclassData.title || '');
    searchParam.append('personnel', String(searchclassData.personnel || ''));

    // cPage가 존재하면 cPage 값 그래로 사용하고 undefinded면 1로
    cPage = cPage || 1;
    // searchParam에 cPage.toString()와 'pageSize'를 담음
    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    // 서버와 통신을 합니다.(spring)
    // searchParam에는 검색 조건 및 페이징처리를 도와주는 값이 담겨 있어요
    axios
      .post('/api/system/classroomListBody.do', searchParam)
      .then((res: AxiosResponse<IClassroomResponse>) => {
        // then: axios.post로 서버와 통신하고 응답을 완료 한 후 실행을 시키는 함수
        console.log(res.data.list);

        // classroomList에 res.data.list를 넣어줘
        setClassroomList(res.data.list);
        // classroomCnt에 res.data.count 넣어줘
        setClassroomCnt(res.data.count);
      });
  };

  const postSuccess = () => {
    setModal({ isOpen: false });
    searchList();
  };

  const ClassroomDetail = (id: number) => {
    setModal({ isOpen: true });
    setClassroomId(id);
  };

  return (
    <div className="classroom-main-container">
      {modal.isOpen && (
        <Portal>
          <ClassroomModal
            postSuccess={postSuccess}
            id={classroomId}
            setId={setClassroomId}
          ></ClassroomModal>
        </Portal>
      )}

      <table className="classroom-table">
        <thead className="classroom-table-header">
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
                      ClassroomDetail(classroom.roomId);
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
    </div>
  );
};
