import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Portal } from "../../../../common/Portal";
import { SurveyMangeContext } from "../../../../provider/support/SurveyManageProvider";
import { modalState } from "../../../../stores/modalState";
import { SurveyManageModal } from "../SurveyManageModal/SurveyManageModal";
import { PageNavigation } from "../../../common.componets/PageNavigation/PageNavigation";

interface SurveyManageType {
      surveyResult: number;
      lecId: number;
      lecName: string;
      loginId: number;
      stName: string;
}

interface SurveyManageResult {

      lecId: number
      lecName: string
      lecInstructorName: string
      avgScore: number
      respondentCount: number
      coursesStudentCount: number
      completionRate: number
}

export const SurveyManageMain = () => {

  const {selectData, setSelectData} = useContext(SurveyMangeContext);

  //select된 값에 맞는 화면을 출력하기 위해 값을 담아줄 변수
  const [completeList, setCompleteList] = useState<SurveyManageType[]>([]);
  const [completeCnt, setCompleteCnt] = useState<number>(0);

  const [resultList, setResultList] = useState<SurveyManageResult[]>([]);
  const [resultCnt, setResultCnt] = useState<number>(0);

  //모달 상태값 
  const [modal, setModal] = useRecoilState(modalState);

  const [loginId, setLoginId] = useState<number>(0);
  const [lecId, setLecId] =useState<number>(0);

  //id값 저장해서 모달 넘기기 용 


  //기본 complete 일경우 실행되는 함수 
  const completeSearch = (cPage?: number) => {

    cPage = cPage || 1;

    const params = new URLSearchParams();

    params.append('currentPage', cPage.toString());
    params.append('pageSize', '5');

    axios.post('/api/support/getCompletedPageList.do',params).then((res)=>{
        setCompleteList(res.data.resultList);
        setCompleteCnt(res.data.resultCnt);
      }
    )
  }

  //기본값이 result일떄 실행되는 함수 
  const resultSearch = (cPage?: number) =>{


    cPage = cPage || 1;

    const params = new URLSearchParams();

    params.append('currentPage', cPage.toString());
    params.append('pageSize', '5');

    axios.post('/api/support/getResultListReact.do',params).then((res)=>{
        setResultList(res.data.fixedRes);
        setResultCnt(res.data.resultCnt);
      }
    )


  }

  const completeDetail = (lecId:number, loginId:number) => {
      setLecId(lecId);
      setLoginId(loginId);

      setModal({isOpen : true});
  }

  useEffect(()=>{
    if(selectData.result === 'complete'){
      completeSearch();
    }else if(selectData.result === 'result'){
      resultSearch();
    }
  },[selectData])


  return (
   <div className="notice-main-container">
   
         {
           modal.isOpen && (<Portal><SurveyManageModal loginId={loginId} lecId={lecId} setLecId={setLecId} setLoginId={setLoginId}></SurveyManageModal></Portal>) 
         }

            <table className="notice-table">
            <thead className="notice-table-header">
              {
              selectData.result === 'complete' ?   
              (<tr>
                <th>No</th>
                <th>과목명</th>
                <th>학생ID</th>
                <th>학생명</th>
                <th>상세보기</th>
              </tr>)
              : selectData.result === 'result' ?
              (<tr>
                <th>No</th>
                <th>과목명</th>
                <th>강사이름</th>
                <th>평균</th>
                <th>응답인원</th>
                <th>
                  <div className="text-center">
                    완료율
                  </div>
                </th>
              </tr>)
              :
              null
              }

            </thead>
            <tbody>
            {
              <>
                {selectData.result === 'complete' && 
                <>
                  {
                    completeList.length > 0 ?   

                    completeList.map((complete) => {
                      return(
                        <tr key={complete.lecId} className='notice-table-row-SuerveyManage'>
                          <td className="notice-cell">{complete.lecId}</td>
                          <td className="notice-cell text-blue-600 hover:text-blue-800"
                          >
                            {complete.lecName}
                          </td>
                          <td className="notice-cell">{complete.loginId}</td>
                          <td className="notice-cell">{complete.stName}</td>
                          <td className="notice-cell">
                            <button 
                            className="border solid 1px px-2 py-2 hover:bg-blue-200 cursor-pointer" 
                            onClick={() => completeDetail(complete.lecId, complete.loginId)}>
                            상세보기
                            </button>
                          </td>
                        </tr>
                        
                      )
                    })
                    :
                    (
                    <tr>
                    <td colSpan={5} className="notice-empty-row">
                      등록된 설문 완료 목록이이 없습니다
                    </td>
                    </tr>
                    )
                  }
                </>}
                {selectData.result === 'result' && 
                <>
                                  {
                    resultList.length > 0 ?   

                    resultList.map((result) => {
                      return(
                        <tr key={result.lecId} className='notice-table-row-SuerveyManage'>
                          <td className="notice-cell">{result.lecId}</td>
                          <td className="notice-cell text-blue-600 hover:text-blue-800"
                          >
                            {result.lecName}
                          </td>
                          <td className="notice-cell">{result.lecInstructorName}</td>
                          <td className="notice-cell">{result.avgScore}</td>
                          <td className="notice-cell">
                            {result.respondentCount <= 0 ?
                            '평균 없음'
                            :
                            result.respondentCount
                            }
                          </td>
                          <td className="notice-cell">
                            <div className="w-full bg-gray-200 rounded-full h-4 relative">
                              <div
                                className="bg-green-500 h-4 rounded-full"
                                style={{ width: `${result.completionRate}%` }}
                              ></div>
                              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-white">
                                {result.completionRate}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                    :
                    (
                    <tr>
                    <td colSpan={5} className="notice-empty-row">
                      등록된 설문 완료 목록이이 없습니다
                    </td>
                    </tr>
                    )
                  }
                </>}
              </>
            }
           </tbody>
         </table>
         {
          selectData.result === 'complete'? 

          <PageNavigation 
          totalItems={completeCnt} 
          itemsPerPage={5}
          onPageChange={completeSearch}
          />
          : selectData.result === 'result' ?
          <PageNavigation 
          totalItems={resultCnt} 
          itemsPerPage={5}
          onPageChange={resultSearch}
          />
          :
          null
         }
       </div>
    );
}

