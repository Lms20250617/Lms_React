import { useRecoilState } from 'recoil';
import { Portal } from '../../../../common/Portal';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import { TutorModal } from '../TutorModal/TutorModal';
import { modalState } from '../../../../stores/modalState';
import './styled.css';
import { useContext, useEffect, useState } from 'react';
import type { AxiosResponse } from 'axios';
import axios from 'axios';

import { TutorContext } from '../../../../provider/manage/TutorProvider';
import type {
  ITutorList,
  ITutorListResponse,
} from '../../../../model/manage/ITutor';

export const TutorMain = () => {
  const [modal, setModal] = useRecoilState(modalState);
  const { searchData } = useContext(TutorContext);
  const [tutorList, setTutorList] = useState<ITutorList[]>([]);
  const [tutorListCnt, setTutorListCnt] = useState<number>(0);

  useEffect(() => {
    searchList();
  }, [searchData]);

  const searchList = (cPage?: number) => {
    const searchParam = new URLSearchParams(searchData);

    cPage = cPage || 1;

    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios
      .post('/api/manage/tutorListBody.do', searchParam)
      .then((res: AxiosResponse<ITutorListResponse>) => {
        setTutorList(res.data.list);
        setTutorListCnt(res.data.count);
      });
  };

  const tutorDetail = (id: string) => {
    setModal({ isOpen: true, payload: { id } });
  };

  const updateStatusYn = (id: string, status: string) => {
    const confirm: boolean = window.confirm('재직 상태를 변경하시겠습니까?');
    if (!confirm) return;

    const param = {
      tutorId: id,
      tutorStatus: status,
    };

    axios
      .post('/api/manage/update-ins-status', param)
      .then((res: AxiosResponse<string>) => {
        if (res.data === 'SUCCESS') {
          alert('변경되었습니다.');
          searchList();
        }
      });
  };

  return (
    <div className="tutor-main-container">
      {modal.isOpen && (
        <Portal>
          <TutorModal payload={modal.payload as { id: string }} />
        </Portal>
      )}

      <table className="tutor-table">
        <thead className="tutor-table-header">
          <tr>
            <th>강사번호</th>
            <th>이름</th>
            <th>연락처</th>
            <th>가입일자</th>
            <th>재학상태</th>
          </tr>
        </thead>
        <tbody>
          {tutorList.length > 0 ? (
            tutorList.map((list) => {
              return (
                <tr key={list.insId} className="tutor-table-row">
                  <td className="tutor-cell">{list.insNumber}</td>

                  <td
                    className="tutor-select-cell"
                    onClick={() => {
                      tutorDetail(list.insId);
                    }}
                  >
                    {list.insName}
                  </td>
                  <td className="tutor-cell">{list.insHp}</td>

                  <td className="tutor-cell">{list.insRegDate}</td>
                  <td className="tutor-cell">
                    <select
                      defaultValue={list.insStatusYn}
                      onChange={(e) => {
                        updateStatusYn(list.insId, e.target.value);
                      }}
                    >
                      <option value="W">승인대기</option>
                      <option value="Y">재직</option>
                      <option value="N">퇴직</option>
                    </select>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="tutor-empty-row">
                등록된 강사가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PageNavigation
        totalItems={tutorListCnt}
        itemsPerPage={5}
        onPageChange={searchList}
      />
    </div>
  );
};
