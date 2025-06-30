import axios, { type AxiosResponse } from 'axios';
import './styled.css';
import { useRecoilState, useRecoilValue } from 'recoil';
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
import { loginInfoState } from '../../../../stores/userInfo';
import { QnaAdminModal } from '../QnAModal/QnAAdminModal';
import { QnATutorModal } from '../QnAModal/QnATutorModal';
import { QnAStudentModal } from '../QnAModal/QnAStudentModal';
import { QnARegisterModal } from '../QnAModal/QnARegisterModal';

export const QnAMain = () => {
  const [modal, setModal] = useRecoilState(modalState);
  const [qnaList, setQnAList] = useState<IQnADetail[]>([]);
  const [qnaCnt, setQnACnt] = useState<number>(0);
  const { searchData } = useContext(QnAContext);
  const { userType, loginId } = useRecoilValue(loginInfoState);

  useEffect(() => {
    searchList();
  }, [searchData]);
  const ModalComponentMap: Record<string, React.FC<any>> = {
    M: QnaAdminModal,
    T: QnATutorModal,
    S: QnAStudentModal,
  };

  const ModalComponent = ModalComponentMap[userType];

  const searchList = (cPage?: number) => {
    const searchParam = new URLSearchParams(searchData);
    cPage = cPage || 1;
    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios
      .get(`/api/support/qnaList?${searchParam.toString()}`)
      .then((res: AxiosResponse<IQnAListResponse>) => {
        console.log(res.data);
        setQnAList(res.data.list);
        setQnACnt(res.data.count);
      });
  };

  const openDetailModal = (qnaId: number) => {
    axios
      .get(`/api/support/qnaDetail?qnaId=${qnaId}`)
      .then((res: AxiosResponse<IQnADetail>) => {
        setModal({
          isOpen: true,
          payload: res.data,
          type: 'detail',
        });
      });
  };

  return (
    <>
      <div className="notice-main-container">
        {modal.isOpen && modal.type === 'detail' && ModalComponent && (
          <Portal>
            <ModalComponent detail={modal.payload} searchList={searchList} />
          </Portal>
        )}
        {modal.isOpen && modal.type === 'register' && (
          <Portal>
            <QnARegisterModal searchList={searchList} />
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
              qnaList.map((qna) => {
                return (
                  <tr key={qna.qnaId} className="notice-table-row">
                    <td className="notice-cell">{qna.qnaId}</td>
                    <td className="notice-cell">{qna.lecName}</td>
                    <td
                      className="notice-cell cursor-pointer text-blue-600 underline hover:text-blue-800"
                      onClick={() => {
                        openDetailModal(qna.qnaId);
                      }}
                    >
                      {qna.qnaTitle}
                    </td>
                    <td className="notice-cell">{qna.qnaRegDate}</td>
                    <td className="notice-cell">{qna.loginId}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="notice-empty-row">
                  등록된 QnA가 없습니다
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
    </>
  );
};
