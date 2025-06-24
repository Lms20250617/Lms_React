import axios, { type AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { CommonCodeContext } from '../../../provider/CommoncodeProvier';
import './styled.css';
import { modalState } from '../../../stores/modalState';
import { PageNavigation } from '../../common.componets/PageNavigation/PageNavigation';
import { Portal } from '../../../common/Portal';
import { CommonModal } from '../commoncodeModal/CommonModal';

interface ICommoncode {
    detailCode:string;
    groupName:string;
    detailName:string;
    note:string;
    useYn:string;
    regId:string;
}

interface ICommoncodeResponse {
  CommonCnt : number;
  list : ICommoncode[];
  
}

export const CommoncodeMain = () => {

  const [modal, setModal] = useRecoilState(modalState);

  const [commonList, setCommonList] = useState<ICommoncode[]>([]);
  const [commonCnt, setCommonCnt] = useState<number>(0);

  const { searchData } = useContext(CommonCodeContext);
  const [detailCode, setDetailCode] = useState<string>('');

  useEffect(() => {
    seearchList();
  }, [searchData]);

  const seearchList = (cPage?: number) => {
    const searchParam = new URLSearchParams(searchData);

    cPage = cPage || 1;

    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios
      .post('/api/system/commonListJson.do', searchParam)
      .then((res: AxiosResponse<ICommoncodeResponse>) => {
        setCommonList(res.data.list);
        setCommonCnt(res.data.CommonCnt);
      });
  };

  const postSuccess = () => {
    setModal({ isOpen: false });
    seearchList();
  };

  const commonDetail = (id: string) => {
    setModal({ isOpen: true });
    setDetailCode(id);
  };


  return (
    <div className="notice-main-container">

      {modal.isOpen && (
        <Portal>
          <CommonModal
            postSuccess={postSuccess}
            id={detailCode}
          ></CommonModal>
        </Portal>
      )}

      <table className="notice-table">
        <thead className="notice-table-header">
          <tr>
            <th>대분류</th>
            <th>그룹코드</th>
            <th>상세코드</th>
            <th>상세명</th>
            <th>번호</th>
          </tr>
        </thead>
        <tbody>
          {commonList.length > 0 ? (
            commonList.map((common) => {
              return (
                <tr key={common.regId} className="notice-table-row">
                  <td className="notice-cell">{common.detailCode}</td>
                  <td
                    className="notice-cell cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      commonDetail(common.detailCode);
                    }}
                  >
                    {common.groupName}
                  </td>
                  <td className="notice-cell">{common.detailName}</td>
                  <td className="notice-cell">{common.note}</td>
                  <td className="notice-cell">{common.useYn}</td>
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
        totalItems={commonCnt}
        itemsPerPage={5}
        onPageChange={seearchList}
      />
    </div>
  );
};
