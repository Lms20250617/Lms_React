import { useRecoilState } from 'recoil';
import './styled.css';
import { Portal } from '../../../common/Portal';
import { PageNavigation } from '../../common.componets/PageNavigation/PageNavigation';
import { ListModal } from '../ListModal/ListModal';
import { modalState } from '../../../stores/modalState';
import { useContext, useEffect, useState } from 'react';
import { ListContext } from '../../../provider/Lecture/ListProvider';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import type { IList, IListResponse } from '../../../model/Lecture/IList';

export const ListMain = () => {
  const [modal, setModal] = useRecoilState(modalState);

  const [listList, setListList] = useState<IList[]>([]);
  const [listCnt, setListCnt] = useState<number>(0);

  const { searchData } = useContext(ListContext);

  useEffect(() => {
    searchList();
    console.log(searchData);
  }, [searchData]);

  const searchList = (cPage?: number) => {
    const searchParam = new URLSearchParams(searchData);

    cPage = cPage || 1;

    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios
      .post('/api/lecture/lectureListBody.do', searchParam)
      .then((res: AxiosResponse<IListResponse>) => {
        setListList(res.data.list);
        setListCnt(res.data.count);
      });
  };

  const listDetail = (id: number) => {
    setModal({ isOpen: true, payload: id });
  };

  return (
    <div className="list-main-container">
      {modal.isOpen && (
        <Portal>
          <ListModal id={modal.payload as number} reSearch={searchList} />
        </Portal>
      )}

      <table className="list-table">
        <thead className="list-table-header">
          <tr>
            <th>강의명</th>
            <th>강사</th>
            <th>강의 시작일</th>
            <th>강의 종료일</th>
            <th>정원</th>
            <th>신청인원</th>
            <th>강의실</th>
          </tr>
        </thead>
        <tbody>
          {listList.length > 0 ? (
            listList.map((list) => {
              return (
                <tr key={list.lecId} className="list-table-row">
                  <td
                    className="list-select-cell"
                    onClick={() => {
                      listDetail(list.lecId);
                    }}
                  >
                    {list.lecName}
                  </td>
                  <td className="list-cell">{list.lecInstructorName}</td>
                  <td className="list-cell">{list.lecStartDate}</td>
                  <td className="list-cell">{list.lecEndDate}</td>
                  <td className="list-cell">{list.lecPersonnel}</td>
                  <td className="list-cell">{list.courseCntPersonnel}</td>
                  <td className="list-cell">{list.lecRoomName}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="list-empty-row">
                등록된 강의가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PageNavigation
        totalItems={listCnt}
        itemsPerPage={5}
        onPageChange={searchList}
      />
    </div>
  );
};
