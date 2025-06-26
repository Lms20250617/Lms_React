import axios, { type AxiosResponse } from 'axios';
import './styled.css';
import { useRecoilState } from 'recoil';
import { useContext, useEffect, useState } from 'react';
import { QnAContext } from '../../../../provider/support/QnAProvider';
import { modalState } from '../../../../stores/modalState';
import type {
  IQnADetail,
  IQnAListResponse,
} from '../../../../model/Support/IQnA';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import { Portal } from '../../../../common/Portal';
import { QnADetailModal } from '../QnAModal/QnADetailModal';

export const QnAMain = () => {
  const [modal, setModal] = useRecoilState(modalState);
  const [qnaList, setQnAList] = useState<IQnADetail[]>([]);
  const [qnaCnt, setQnACnt] = useState<number>(0);
  const { searchData } = useContext(QnAContext);

  useEffect(() => {
    searchList();
  }, [searchData]);

  const searchList = (cPage?: number) => {
    const searchParam = new URLSearchParams(searchData);
    cPage = cPage || 1;
    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios
      .post('/api/support/getQnaListBody.do', searchParam)
      .then((res: AxiosResponse<IQnAListResponse>) => {
        setQnAList(res.data.list);
        setQnACnt(res.data.count);
      });
  };

  const openDetailModal = (qnaId: number) => {
    setModal({
      isOpen: true,
      type: 'qnaDetail',
      payload: { qnaId },
    });
  };

  return (
    <div className="notice-main-container">
      {modal.isOpen && modal.type === 'qnaDetail' && (
        <Portal>
          <QnADetailModal payload={modal.payload as { qnaId: number }} />
        </Portal>
      )}
      <table className="notice-table">
        <thead className="notice-table-header">
          <tr>
            <th>No.</th>
            <th>강의명</th>
            <th>제목</th>
            <th>작성일</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          {qnaList.length > 0 ? (
            qnaList.map((qna) => (
              <tr key={qna.qnaId} className="notice-table-row">
                <td>{qna.qnaId}</td>
                <td>{qna.lecName}</td>
                <td
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                  onClick={() => openDetailModal(qna.qnaId)}
                >
                  {qna.qnaTitle}
                </td>
                <td>{qna.qnaRegDate?.split('.')[0]}</td>
                <td>{qna.loginId}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="notice-empty-row">
                등록된 질문이 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <PageNavigation
        totalItems={qnaCnt}
        itemsPerPage={5}
        onPageChange={searchList}
      />
    </div>
  );
};
