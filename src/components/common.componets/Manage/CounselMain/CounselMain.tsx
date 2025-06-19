import axios, { type AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { Portal } from '../../../../common/Portal';
import type { IClassList, ICounsel, ICounselResponse,} from '../../../../model/manage/ICounsel';
import { ICounselContext } from '../../../../provider/manage/CounselProvier';
import { modalState } from '../../../../stores/modalState';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import { CounselModal } from '../CounselModal/CounselModal';
import './styled.css';

export const CounselMain = () => {
  //const { search } = useLocation();

  const [modal, setModal] = useRecoilState(modalState);

  const [counselList, setCounselList] = useState<ICounsel[]>([]);
  const [counselCnt, setCounselCnt] = useState<number>(0);

  const { searchData } = useContext(ICounselContext);
  const [counselId, setCounselId] = useState<number>(0);

const [lecture, setLeceture] = useState<IClassList[]>([]);

  useEffect(() => {
    seearchList();
  }, [searchData]);

  const seearchList = (cPage?: number) => {
    const searchParam = new URLSearchParams(searchData);

    cPage = cPage || 1;

    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    axios
      .post('/api/manage/getCounselListBody.do', searchParam)
      .then((res: AxiosResponse<ICounselResponse>) => {
        setCounselList(res.data.counselList);
        setCounselCnt(res.data.counselCnt);
        setLeceture(res.data.lectures);

        console.log(res.data);
      });
  };

    const postSuccess = () => {
      setModal({isOpen : false});
      seearchList();
    }

    const CounselDetail = (id: number) => {
      setModal({isOpen : true});
      setCounselId(id);
    }

  return (
    <div className="notice-main-container">
      {
        modal.isOpen && <Portal><CounselModal postSuccess={postSuccess} id={counselId} setId={setCounselId} lecture={lecture}></CounselModal></Portal> 
      }

      <table className="notice-table">
        <thead className="notice-table-header">
          <tr>
            <th>No.</th>
            <th>상담 과목</th>
            <th>상담 제목</th>
            <th>상담 학생</th>
            <th>상담 일</th>
          </tr>
        </thead>
        <tbody>
          {counselList.length > 0 ? (
            counselList.map((counsel) => {
              return (
                <tr key={counsel.counselId} className="notice-table-row">
                  <td className="notice-cell">{counsel.counselId}</td>
                  <td className="notice-cell">{counsel.lecName}</td>
                  <td
                    className="notice-cell cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => {
                       CounselDetail(counsel.counselId);
                    }}
                  >
                    {counsel.counselTitle}
                  </td>
                  <td className="notice-cell">{counsel.counselStudentName}</td>
                  <td className="notice-cell">
                    {counsel.counselRegDate.split('.')[0].slice(0, 16)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="notice-empty-row">
                등록된 상담목록이 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PageNavigation
        totalItems={counselCnt}
        itemsPerPage={5}
        onPageChange={seearchList}
      />
    </div>
  );
};
