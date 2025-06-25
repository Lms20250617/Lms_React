import { useRecoilState } from 'recoil';
import './styled.css';
import { Portal } from '../../../../common/Portal';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import { modalState } from '../../../../stores/modalState';
import { useContext, useEffect, useState } from 'react';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { ManageListContext } from '../../../../provider/Lecture/ManageListProvider';
import type {
  IManageList,
  IManageListResponse,
} from '../../../../model/Lecture/IManageList';
import { ManageListModal } from '../ManageListModal/ManageListModal';
import { LectureModal } from '../LectureModal/LectureModal';

export const ManageListMain = () => {
  const [modal, setModal] = useRecoilState(modalState);

  const [manageList, setManageList] = useState<IManageList[]>([]);
  const [manageListCnt, setManageListCnt] = useState<number>(0);

  const { searchData } = useContext(ManageListContext);

  useEffect(() => {
    searchList();
  }, [searchData]);

  const searchList = (cPage?: number) => {
    const searchParam = new URLSearchParams(searchData);

    cPage = cPage || 1;

    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios
      .post('/api/lecture/lectureManageListBody.do', searchParam)
      .then((res: AxiosResponse<IManageListResponse>) => {
        setManageList(res.data.lectureManageList);
        setManageListCnt(res.data.lectureManageCnt);
      });
  };

  const manageListDetail = (id: number, insId: string) => {
    setModal({ isOpen: true, type: 'manageList', payload: { id, insId } });
  };

  const lectureDetail = (id: number) => {
    setModal({ isOpen: true, type: 'lecture', payload: { id } });
  };

  return (
    <div className="manage-list-main-container">
      {modal.isOpen && modal.type === 'manageList' && (
        <Portal>
          <ManageListModal
            payload={modal.payload as { id: number; insId: string }}
            reSearch={searchList}
          />
        </Portal>
      )}
      {modal.isOpen && modal.type === 'lecture' && (
        <Portal>
          <LectureModal
            payload={modal.payload as { id: number }}
            reSearch={searchList}
          />
        </Portal>
      )}

      <table className="manage-list-table">
        <thead className="manage-list-table-header">
          <tr>
            <th>강의명</th>
            <th>강사</th>
            <th>강의 시작일</th>
            <th>강의 종료일</th>
            <th>정원</th>
            <th>강의실</th>
            <th>강의계획서</th>
          </tr>
        </thead>
        <tbody>
          {manageList.length > 0 ? (
            manageList.map((list) => {
              return (
                <tr key={list.lecId} className="manage-list-table-row">
                  <td
                    className="manage-list-select-cell"
                    onClick={() => {
                      lectureDetail(list.lecId);
                    }}
                  >
                    {list.lecName}
                  </td>
                  <td className="manage-list-cell">
                    {list.lecInstructorName || '-'}
                  </td>
                  <td className="manage-list-cell">
                    {list.lecStartDate?.slice(0, 10) || '-'}
                  </td>
                  <td className="manage-list-cell">
                    {list.lecEndDate?.slice(0, 10) || '-'}
                  </td>
                  <td className="manage-list-cell">
                    {list.lecPersonnel || '-'}
                  </td>
                  <td className="manage-list-cell">
                    {list.lecRoomName || '-'}
                  </td>
                  <td className="manage-list-cell">
                    <button
                      onClick={() => {
                        manageListDetail(list.lecId, list.lecInstructorId);
                      }}
                    >
                      강의계획서 보기
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="manage-list-empty-row">
                등록된 강의가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PageNavigation
        totalItems={manageListCnt}
        itemsPerPage={5}
        onPageChange={searchList}
      />
    </div>
  );
};
