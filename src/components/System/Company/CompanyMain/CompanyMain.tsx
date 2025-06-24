import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { useContext, useEffect, useState } from 'react';
import { CompanyContext } from '../../../../provider/System/CompanyProvider';
import axios, { type AxiosResponse } from 'axios';
import { Portal } from '../../../../common/Portal';
import { CompanyModal } from '../CompanyModal/CompanyModal';
import './styled.css';
import type {
  ICompanyList,
  ICompanyResponse,
} from '../../../../model/System/ICompany';

export const CompanyMain = () => {
  const [modal, setModal] = useRecoilState(modalState);
  const { searchData } = useContext(CompanyContext);
  const [companyList, setCompanyList] = useState<ICompanyList[]>([]);
  const [companyListCnt, setCompanyListCnt] = useState<number>();

  useEffect(() => {
    searchList();
  }, [searchData]);

  const searchList = (cPage?: number) => {
    const searchParam = new URLSearchParams(searchData);

    cPage = cPage || 1;

    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios
      .post('/api/system/companyListBody.do', searchParam)
      .then((res: AxiosResponse<ICompanyResponse>) => {
        console.log(res.data);
        setCompanyList(res.data.list);
        setCompanyListCnt(res.data.count);
      });
  };

  const companyDetail = (id: string) => {
    setModal({ isOpen: true, payload: { id } });
  };

  const convertTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toISOString().slice(0, 10);
  };

  return (
    <div className="company-main-container">
      {modal.isOpen && (
        <Portal>
          <CompanyModal
            payload={modal.payload as { id: number; insId: string }}
            reSearch={searchList}
          />
        </Portal>
      )}

      <table className="company-table">
        <thead className="company-table-header">
          <tr>
            <th>번호</th>
            <th>회사명</th>
            <th>대표명</th>
            <th>휴대전화</th>
            <th>주소</th>
            <th>이메일</th>
            <th>가입일자</th>
          </tr>
        </thead>
        <tbody>
          {companyList.length > 0 ? (
            companyList.map((list) => {
              return (
                <tr key={list.companyId} className="company-table-row">
                  <td className="company-cell">{list.companyId}</td>
                  <td
                    className="company-select-cell"
                    onClick={() => {
                      companyDetail(list.companyId);
                    }}
                  >
                    {list.companyName}
                  </td>

                  <td className="company-cell">{list.companyCeo}</td>
                  <td className="company-cell">{list.companyHp}</td>
                  <td className="company-cell">{list.companyLoc}</td>
                  <td className="company-cell">{list.companyEmail}</td>
                  <td className="company-cell">
                    {convertTimestamp(list.companyRegDate)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="company-empty-row">
                등록된 회사가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* <PageNavigation
        totalItems={studentListCnt}
        itemsPerPage={5}
        onPageChange={searchList}
      /> */}
    </div>
  );
};
