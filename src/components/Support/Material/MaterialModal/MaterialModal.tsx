import { useRecoilState } from 'recoil';
import './styled.css';
import { modalState } from '../../../../stores/modalState';
import { useEffect, useRef, useState, type ChangeEvent, type FC } from 'react';
import axios, { type AxiosResponse } from 'axios';
import type { INtoticeDetail } from '../../../../model/Support/INotice';
import type { IMaterialDetail } from '../../../../model/Support/IMaterial';
import type { IClassList, ICounselDetail } from '../../../../model/manage/ICounsel';

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

  useEffect(() => {

    id && detailMaterial();

    return () => {
      setId(0);
    }
  }, []);


  const savaMaterial = () => {
    axios.post('/api/support/saveMtr.do', formRef.current).then((res:AxiosResponse<IPostResponse>) => {
      if(res.data.result === "success"){
        alert('저장 되었습니다');
        setModal({isOpen:false});
        postSuccess();
      }
    })

  };

  const detailMaterial = () => {
    const param = new URLSearchParams();

    param.append("materiId", id.toString());

    axios.post('/api/support/getMtrDetail.do',param).then((res:AxiosResponse<{detailValue: IMaterialDetail}>) => {
        

      console.log(res.data.detailValue);

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

    }
  );
  }

  const updateDetail = () => {

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

  const handlerFile = (e : ChangeEvent<HTMLInputElement>) => {
    const fileInfo = e.target.files;

    if(fileInfo?.length){
      const fileInfoSplit = fileInfo[0].name.split('.');
      const fileExt = fileInfoSplit[1].toLowerCase();

      if(fileExt === 'jpg' || 
         fileExt === 'gif' || 
         fileExt === 'png')
        {
          setImageUrl(URL.createObjectURL(fileInfo[0]));

        } else{
          setImageUrl('');
        }
    }


  };


  return (
    <div className="modal-overlay">
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
                lecture.map((lec)=>{
                return(
                    <option value={lec.lecId}>{lec.lecName}</option>
                )
                })
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
          <div>
            {
              imgaeUrl ? (
                <>
                  <label>미리보기</label>
                  <img className="preview-image" src={imgaeUrl} />
                </>
              ) 
              :
              <div></div>
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
    </div>
  );
};
