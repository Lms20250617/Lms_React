import axios, { type AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { Portal } from '../../../../common/Portal';
import type { IClassList } from '../../../../model/manage/ICounsel';
import type { IMaterial, IMaterialResponse } from '../../../../model/Support/IMaterial';
import { MaterialContext } from '../../../../provider/support/MaterialProvier';
import { modalState } from '../../../../stores/modalState';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import { MaterialModal } from '../MaterialModal/MaterialModal';
import './styled.css';


export const MaterialMain = () => {

  const [modal, setModal] = useRecoilState(modalState);

  const [materailList ,setMaterailList] = useState<IMaterial[]>([]);
  const [materailCnt, setMaterailCnt] = useState<number>(0);

  const { searchData } = useContext(MaterialContext); 
  const [materailId, setMaterailId] = useState<number>(0);

  const [lecture, setLeceture] = useState<IClassList[]>([]);

  useEffect(()=>{
    seearchList();
  }, [searchData])

  const seearchList = (cPage?:number) => {

    const searchParam = new URLSearchParams(searchData);

    cPage = cPage || 1;

    searchParam.append('currentPage',cPage.toString());
    searchParam.append('pageSize', '5');

    axios.post('/api/support/getMtrListBody.do', searchParam).then((res: AxiosResponse<IMaterialResponse>) => {
        setMaterailList(res.data.mtrList);
        setMaterailCnt(res.data.mtrCnt);
        setLeceture(res.data.lectures);

        console.log(res.data);
    });

  }

  const postSuccess = () => {
    setModal({isOpen : false});
    seearchList();
  }

  const MaterialDetail = (id: number) => {
    setModal({isOpen : true});
    setMaterailId(id);
  }


  return (
    <div className="notice-main-container">

      {
        modal.isOpen && <Portal><MaterialModal postSuccess={postSuccess} id={materailId} setId={setMaterailId} lecture={lecture}></MaterialModal></Portal> 
      }
     
      <table className="notice-table">
        <thead className="notice-table-header">
          <tr>
            <th>강의명</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {
            materailList.length > 0 ?   

            materailList.map((materail) => {
              return(
                <tr key={materail.materiId} className='notice-table-row'
                >
                  <td className="notice-cell">{materail.lecName}</td>
                  <td className="notice-cell cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => {
                    MaterialDetail(materail.materiId)
                    }}
                  >
                    {materail.materiTitle}
                  </td>
                  <td className="notice-cell">{materail.loginId}</td>
                  <td className="notice-cell">{materail.materiDate}</td>
                </tr>
              )
            })
            :
            (
            <tr>
            <td colSpan={4} className="notice-empty-row">
              등록된 학습 자료가 없습니다
            </td>
            </tr>
            )
          }
        </tbody>
      </table>
      <PageNavigation 
      totalItems={materailCnt} 
      itemsPerPage={5}
      onPageChange={seearchList}
      />
    </div>
  );
};
