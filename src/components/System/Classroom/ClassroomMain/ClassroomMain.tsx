import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { useContext, useEffect, useState } from 'react';
import axios, { type AxiosResponse } from 'axios';
import { Portal } from '../../../../common/Portal';
import { ClassroomModal } from '../ClassroomModal/ClassroomModal';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import './styled.css';

export const ClassroomMain = () => {
  //   const [modal, setModal] = useRecoilState(modalState);
  //   const [classroomList, setClassroomList] = useState<IClassroom[]>([]);
  //   const [ClassroomCnt, setClassroomCnt] = useState<number>(0);

  //   const {searchData} = useContext(ClassroomContext)
  //   const [classroomId, setClassroomId] = useState<number>(0);

  //   useEffect(() => {
  //     searchList();
  //   }, [searchData])

  //   const searchList = (cPage?: number) => {
  //     const searchParam = new URLSearchParams(searchData);

  //     cPage = cPage || 1;

  //     searchParam.append('currentPage', cPage.toString());
  //     searchParam.append('pageSize', '5');

  //     axios
  //       .post('/api/system/classroomListBody.do', searchParam)
  //       .then((res: AxiosResponse<IClassroomResponse>) => {
  //         setClassroomList(res.data.list);
  //         setClassroomCnt(res.data.count);
  //       });
  //   };
  //   const postSuccess = () => {
  //     setModal({ isOpen: false });
  //     searchList();
  //   };

  //   const ClassroomDetail = (id: number) => {
  //     setModal({ isOpen: true });
  //     setClassroomId(id);
  //   };

  return (
    <div className="class-main-container">
      {/* {modal.isOpen && (
        <Portal>
          <ClassroomModal
            postSuccess={postSuccess}
            id={classroomId}
            setId={setClassroomId}
          ></ClassroomModal>
        </Portal>
      )} */}

      <table className="class-table">
        <thead className="class-table-header">
          <tr>
            <th>번호</th>
            <th>강의실 이름</th>
            <th>강의실 정원</th>
            <th>강의실 사이즈</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      {/* <PageNavigation
        totalItems={ClassroomCnt}
        itemsPerPage={5}
        onPageChange={searchList}
      /> */}
    </div>
  );
};
