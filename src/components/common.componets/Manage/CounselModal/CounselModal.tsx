import axios, { type AxiosResponse } from 'axios';
import { useEffect, useRef, useState, type FC } from 'react';
import { useRecoilState } from 'recoil';
import type { IClassList, ICounselDetail } from '../../../../model/manage/ICounsel';
import { modalState } from '../../../../stores/modalState';
import './styled.css';

interface ICounselProps {
  postSuccess: () => void;
  id: number;
  setId: React.Dispatch<React.SetStateAction<number>>;
  lecture: IClassList[];
}

interface IPostResponse {
  result: 'success' | 'fail';
}


export const CounselModal: FC<ICounselProps> = ({ postSuccess, id, setId, lecture}) => {
  
  const [_, setModal] = useRecoilState(modalState);
  const formRef = useRef<HTMLFormElement>(null);
  const [detail, setDetail] = useState<ICounselDetail>();

  useEffect(() => {
    id && counselDetail();

    return () => {
      setId(0);
    }
  }, []);

    //유효성 검사 
    const validateForm = () => {
    const form = formRef.current;
    if (!form) return false;

    const { counselLecId, counselStudentName, counselTitle, counselContent } = form?.elements as any

    const validations = [
        { value: counselLecId.value, message: '상담 과목을 선택해주세요.' },
        { value: counselStudentName.value, message: '학생을 입력해주세요.' },
        { value: counselTitle.value, message: '상담 제목을 입력해주세요.' },
        { value: counselContent.value, message: '상담 내용을 입력해주세요.' },
    ];

    for (let { value, message } of validations) {
        if (!value.trim()) {
        alert(message);
        return false;
        }
    }

    return true;
    };

  //저장   
  const savaCounsel = () => {

    if (!validateForm()) {
        return;
    }

    axios.post('/api/manage/counselSave.do', formRef.current).then((res:AxiosResponse<IPostResponse>) => {
      if(res.data.result === "success"){
        alert('저장 되었습니다');
        setModal({isOpen:false});
        postSuccess();
      }
    })

  };

  //상세보기 
  const counselDetail = () => {
    const param = new URLSearchParams();

    param.append("counselId", id.toString());

    axios.post('/api/manage/counselDetail.do',param).then((res:AxiosResponse<{detailValue: ICounselDetail}>) => {

      setDetail(res.data.detailValue);

    }
  );
  }

  //수정 
  const updateDetail = () => {


    if (!validateForm()) {
        return;
    }

    const formData = new FormData(formRef.current as HTMLFormElement);
    formData.append("counselId", id.toString());

    axios
      .post('/api/manage/counselUpdate.do', formData)
      .then((res:AxiosResponse<IPostResponse>) => {
        if(res.data.result === "success"){
          alert('수정 되었습니다');
          setModal({isOpen:false});
          postSuccess();
        }
    })

  };

  //삭제 
  const deleteDetail = () => {

    const param = new URLSearchParams({ counselId : id.toString() });

    axios
      .post('/api/manage/counselDelete.do', param)
      .then((res:AxiosResponse<IPostResponse>) => {
        if(res.data.result === "success"){
          alert('삭제 되었습니다');
          setModal({isOpen:false});
          postSuccess();
        }
    })
  }

  return (
    <div className="modal-overlay">
      <form ref={formRef} className="modal-form modal-container">
        <label>
          상담 과목
          <select className='LectureSelect' name='counselLecId' id='counselLecId' value={detail?.lecId}
            onChange={(e) =>
            setDetail((prev) => ({
                ...(prev as ICounselDetail),
                lecId: Number(e.target.value)
            }))
            }
            >
            <option value="">-- 과목을 선택하세요 --</option>
            {
             lecture.map((lec)=>{
                return(
                    <option value={lec.lecId}>{lec.lecName}</option>
                )
             })
            }
          </select>
        </label>
        <label>
          상담 학생 :<input type="text" name="counselStudentName" id='counselStudentName' defaultValue={detail?.counselStudentName} />
        </label>
        <label>
          제목 :<input type="text" name="counselTitle" id='counselTitle' defaultValue={detail?.counselTitle} />
        </label>
        <label>
          내용 :<input type="text" name="counselContent" id='counselContent' defaultValue={detail?.counselContent} />
        </label>
        <div className="button-container">
          <button type="button" onClick={!id ? savaCounsel : updateDetail}>
              {!id ? '저장' : '수정' }
          </button>
          {
            !!id && <button type="button" onClick={deleteDetail}>삭제</button>
          }

          <button type="button" onClick={() => {
            setModal({isOpen : false})
          }}>나가기</button>
        </div>
      </form>
    </div>
  );
};
