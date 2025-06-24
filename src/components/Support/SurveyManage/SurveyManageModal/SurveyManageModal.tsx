import { useRecoilState } from 'recoil';
import './styled.css';
import { modalState } from '../../../../stores/modalState';
import { useEffect, useRef, useState, type ChangeEvent, type FC } from 'react';
import axios, { type AxiosResponse } from 'axios';
import type { INtoticeDetail } from '../../../../model/Support/INotice';

interface IServeyManageProps {
  lecId: number;
  loginId: number;
  setLoginId: React.Dispatch<React.SetStateAction<number>>;
  setLecId: React.Dispatch<React.SetStateAction<number>>;
}

interface ISurveyManageDetail {
    surveyId: number;
    surveyContent: string;
    surveyResult:number;
}

export const SurveyManageModal: FC<IServeyManageProps> = ({ lecId, loginId, setLoginId,setLecId  }) => {
  
  const [_, setModal] = useRecoilState(modalState);
  const formRef = useRef<HTMLFormElement>(null);
  const [detail, setDetail] = useState<ISurveyManageDetail[]>([]);

  const answer = ['', '매우나쁨', '나쁨', '보통', '좋음', '매우좋음'];

  useEffect(() => {
    if(lecId && loginId) {detailSurveyManage();}

    return () => {
      setLoginId(0);
      setLecId(0);
    }
  }, []);

  const detailSurveyManage = () => {
    const param = new URLSearchParams();

    param.append("lecId", lecId.toString());
    param.append("loginId", loginId.toString());

    axios.post('/api/support/getSurveyDetail.do',param).then((res:AxiosResponse<{detail: ISurveyManageDetail[]}>) => {

    setDetail(res.data.detail);

    }
  );
  }


  return (
    <div className="modal-overlay">
    <div className="bg-white w-[550px] rounded-md shadow-lg">
        <div className="bg-[#323c5a] text-white text-lg font-semibold px-6 py-3 rounded-t-md flex justify-between items-center">
        <span>상세 내역</span>
        <button 
        className="text-white text-xl font-bold hover:text-gray-300"
        onClick={() => {
            setModal({isOpen : false})
        }}
        >
        &times;
        </button>
        </div>
        <table className="w-full text-sm text-center border-t border-gray-300">
        <thead>
            <tr className="bg-gray-100 text-gray-700">
            <th className="py-2 px-3 border-r border-gray-300">문항</th>
            <th className="py-2 px-3">답변</th>
            </tr>
        </thead>
        <tbody>
            {
                detail.map((detail)=>{
                    return(
                        <>
                            <tr className="bg-gray-200">
                            <td className="py-2 px-3 text-left border-r border-gray-100">{detail.surveyContent}</td>
                            <td className="py-2 px-3">
                                <input
                                type="text"
                                value={answer[detail.surveyResult]}
                                className="w-full text-center border border-gray-300 rounded"
                                readOnly
                                />
                            </td>
                            </tr>
                        </>
                    )
                })
            }

        </tbody>
        </table>

        {/* 닫기 버튼 */}
        <div className="flex justify-center py-4">
        <button 
        className="bg-gradient-to-t from-[#6f859c] to-[#c1d0e2] text-white font-semibold py-2 px-6 rounded hover:opacity-90"
        onClick={() => {
            setModal({isOpen : false})
        }}
        >
            닫기
        </button>
        </div>
    </div>
</div>
  );
};
