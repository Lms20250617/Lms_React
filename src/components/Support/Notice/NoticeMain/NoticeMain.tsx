import axios, { type AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { Portal } from '../../../../common/Portal';
import type { INoticeResponse, INtotice } from '../../../../model/Support/INotice';
import { NoticeContext } from '../../../../provider/NoticeProvider';
import { modalState } from '../../../../stores/modalState';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import { NoticeModal } from '../NoticeModal/NoticeModal';
import './styled.css';


export const NoticeMain = () => {
  //const { search } = useLocation();

  const [modal, setModal] = useRecoilState(modalState);

  const [noticeList, setNoticeList] = useState<INtotice[]>([]);
  const [noticeCnt, setNoticeCnt] = useState<number>(0);

  const { searchData } = useContext(NoticeContext);
  const [noticeId, setNoticeId] = useState<number>(0);

  useEffect(() => {
    seearchList();
  }, [searchData]);

  const seearchList = (cPage?: number) => {
    const searchParam = new URLSearchParams(searchData);

    cPage = cPage || 1;

    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios
      .post('/api/support/noticeListBody.do', searchParam)
      .then((res: AxiosResponse<INoticeResponse>) => {
        setNoticeList(res.data.list);
        setNoticeCnt(res.data.count);
      });
  };

  const postSuccess = () => {
    setModal({ isOpen: false });
    seearchList();
  };

  const noticeDetail = (id: number) => {
    setModal({ isOpen: true });
    setNoticeId(id);
  };


  return (
    <div className="notice-main-container">
      {modal.isOpen && (
        <Portal>
          <NoticeModal
            postSuccess={postSuccess}
            id={noticeId}
            setId={setNoticeId}
          ></NoticeModal>
        </Portal>
      )}

      <table className="notice-table">
        <thead className="notice-table-header">
          <tr>
            <th>공지번호</th>
            <th>공지 제목</th>
            <th>공지 날짜</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          {noticeList.length > 0 ? (
            noticeList.map((notice) => {
              return (
                <tr key={notice.noticeId} className="notice-table-row">
                  <td className="notice-cell">{notice.noticeId}</td>
                  <td
                    className="notice-cell cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      noticeDetail(notice.noticeId);
                    }}
                  >
                    {notice.noticeTitle}
                  </td>
                  <td className="notice-cell">
                    {notice.regDate.split('.')[0].slice(0, 16)}
                  </td>
                  <td className="notice-cell">{notice.loginId}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="notice-empty-row">
                등록된 공지사항이 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PageNavigation
        totalItems={noticeCnt}
        itemsPerPage={5}
        onPageChange={seearchList}
      />
    </div>
  );
};
