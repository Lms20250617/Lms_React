import axios, { type AxiosResponse } from 'axios';
import { useEffect, useRef, useState, type ChangeEvent, type FC } from 'react';
import { useRecoilState } from 'recoil';
import type { IMaterialDetail } from '../../../../model/Support/IMaterial';
import type { IClassList } from '../../../../model/manage/ICounsel';
import { modalState } from '../../../../stores/modalState';
import './styled.css';

interface INoticeProps {
  postSuccess: () => void;
  id: number;
  setId: React.Dispatch<React.SetStateAction<number>>;
  lecture: IClassList[];
}

interface IPostResponse {
  result: 'success' | 'fail';
}

export const MaterialModal: FC<INoticeProps> = ({ postSuccess, id, setId, lecture }) => {
  
  const [_, setModal] = useRecoilState(modalState);
  const formRef = useRef<HTMLFormElement>(null);
  const [detail, setDetail] = useState<IMaterialDetail>();
  const [imgaeUrl, setImageUrl] = useState<string>('');

  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {

    id && detailMaterial();

    return () => {
      setId(0);
    }
  }, []);

  //유효성 검사 

    const validateForm = () => {
    const form = formRef.current;
    if (!form) return false;

    const { lecId, mtrTitle, mtrContent, file } = form?.elements as any

    const validations = [
        { value: lecId.value, message: '과목을 선택해주세요.' },
        { value: mtrTitle.value, message: '제목을 입력해주세요.' },
        { value: mtrContent.value, message: '내용을 입력해주세요.' },
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
  const savaMaterial = () => {

    if (!validateForm()) {
        return;
    }

    axios.post('/api/support/saveMtr.do', formRef.current).then((res:AxiosResponse<IPostResponse>) => {
      if(res.data.result === "success"){
        alert('저장 되었습니다');
        setModal({isOpen:false});
        postSuccess();
      }
    })

  };


  //상세보기 
  const detailMaterial = () => {

    const param = new URLSearchParams();

    param.append("materiId", id.toString());

    axios.post('/api/support/getMtrDetail.do',param).then((res:AxiosResponse<{detailValue: IMaterialDetail}>) => {
      
      console.log(res.data.detailValue)

      const { fileExt, logicalPath } = res.data.detailValue;

      if(fileExt === 'jpg' ||
         fileExt === 'png' ||
         fileExt === 'gif'
      ){
        setImageUrl('/api'+ logicalPath);
      } else {
        setImageUrl('');
      }

      setDetail(res.data.detailValue);
      setFileName(res.data.detailValue.fileName);

    }
  );
  }

  //수정
  const updateDetail = () => {

    if (!validateForm()) {
        return;
    }

    const formData = new FormData(formRef.current as HTMLFormElement);
    formData.append("materiId", id.toString());

    axios
      .post('/api/support/updateMtr.do', formData)
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

    const param = new URLSearchParams({ materiId : id.toString() });

    axios
      .post('/api/support/deleteMtr.do', param)
      .then((res:AxiosResponse<IPostResponse>) => {
        if(res.data.result === "success"){
          alert('삭제 되었습니다');
          setModal({isOpen:false});
          postSuccess();
        }
    })
  }

  //파일 이름 미리보기 
  const handlerFile = (e : ChangeEvent<HTMLInputElement>) => {
    const fileInfo = e.target.files;

    if(fileInfo?.length){
      const fileInfoSplit = fileInfo[0].name;
      setFileName(fileInfoSplit);
    }

  };


  const downloadFile = () =>{

    const param = new URLSearchParams();
    param.append('materiId', id.toString());

    axios.post('/api/support/materiDownload.do', param, {
      responseType : 'blob' ,
    }).then((res: AxiosResponse<Blob>) => {

      const url = window.URL.createObjectURL(res.data);

      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', detail?.fileName as string);

      document.body.appendChild(link);

      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
  };

  return (
    <div className="modal-overlay">
      {
        lecture.length != 0 ?

        // 강사의 경우
        (
          <form ref={formRef} className="modal-form modal-container">
        <label>
            강의명 
            <select className='LectureSelect' name='lecId' id='counselLecId' value={detail?.lecId}
            onChange={(e) =>
            setDetail((prev) => ({
                ...(prev as IMaterialDetail),
                lecId: Number(e.target.value)
            }))
            }
            >
            <option value="">-- 과목을 선택하세요 --</option>
            {

                (lecture.map((lec)=>{
                return(
                    <option value={lec.lecId}>{lec.lecName}</option>
                )
                }))
            }
            </select>
        </label>
        <label>
          제목 :<input type="text" name="mtrTitle" defaultValue={detail?.materiTitle} />
        </label>
        <label>
          내용 :<input type="text" name="mtrContent" defaultValue={detail?.materiContent} />
        </label>
        파일 :
        <input type="file" id="fileInput" name='file' onChange={handlerFile}/>
        <label className="img-label" htmlFor="fileInput">
          파일 첨부하기
        </label>
        <div>
          <div onClick={downloadFile} className='cursor-pointer'>
          {
            fileName 
          }
          </div>
        </div>
        <div className="button-container">
          <button type="button" onClick={!id ? savaMaterial : updateDetail}>
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
        )
        :
        (

      // 관리자의 경우     
      <form ref={formRef} className="modal-form modal-container">
        <label>
            강의명 
            <select className='LectureSelect' name='lecId' id='counselLecId'
            onChange={(e) =>
            setDetail((prev) => ({
                ...(prev as IMaterialDetail),
                lecId: Number(e.target.value)
            }))
            }
            aria-readonly
            >
            <option value="">{detail?.lecName}
            </option>
            {
                (lecture.map((lec)=>{
                return(
                    <option value={lec.lecId}>{lec.lecName}</option>
                )
                }))
            }
            </select>
        </label>
        <label>
          제목 :<input type="text" name="mtrTitle" defaultValue={detail?.materiTitle} readOnly/>
        </label>
        <label>
          내용 :<input type="text" name="mtrContent" defaultValue={detail?.materiContent} readOnly/>
        </label>
        파일 :
        <input type="file" id="fileInput" name='file' onChange={handlerFile} readOnly/>
        <label className="img-label" htmlFor="fileInput">
          파일 첨부하기
        </label>
        <div>
          <div onClick={downloadFile} className='cursor-pointer'>
          {
            fileName 
          }
          </div>
        </div>
        <div className="button-container">
          {
            lecture.length > 0 &&
            <button type="button" onClick={!id ? savaMaterial : updateDetail}>
                {!id ? '저장' : '수정' }
            </button>
          }
          {
            lecture.length > 0 &&
            (!!id && <button type="button" onClick={deleteDetail}>삭제</button>)
          }

          <button type="button" onClick={() => {
            setModal({isOpen : false})
          }}>나가기</button>
        </div>
      </form>
        )
      }
    </div>
  );
};
