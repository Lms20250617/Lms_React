import { useRecoilState } from 'recoil';
import './styled.css';
import { useEffect, useRef, useState, type ChangeEvent, type FC } from 'react';
import axios, { type AxiosResponse } from 'axios';
import { modalState } from '../../../stores/modalState';

interface INoticeProps {
  postSuccess: () => void;
  id: string;

}

interface IPostResponse {
  result: 'success' | 'fail';
}

interface ICommonDetail {
      detailCode: string;
      groupName: string;
      groupCode: string;
      detailName: string;
      note: string;
      useYn: string;
      regId: string;
}

export const CommonModal: FC<INoticeProps> = ({ postSuccess, id}) => {
  
  const [_, setModal] = useRecoilState(modalState);
  const formRef = useRef<HTMLFormElement>(null);
  const [detail, setDetail] = useState<ICommonDetail>();

  useEffect(() => {
    id && detailNotice();

  }, []);

  const detailNotice = () => {
    const param = new URLSearchParams();

    param.append("detailCode", id.toString());

    axios.post('/api/system/commonDetail.do',param).then((res:AxiosResponse<{detailValue: ICommonDetail}>) => {

      setDetail(res.data.detailValue);

    }
  );
  }

  const updateDetail = () => {

    const formData = new FormData(formRef.current as HTMLFormElement);
    const detailCode = formData.get('newDetailCode');
    
    if(typeof detailCode == 'string'){
      formData.append("detailCode", detailCode);
    }
    
    axios
      .post('/api/system/commonUpdate.do', formData)
      .then((res:AxiosResponse<IPostResponse>) => {
        if(res.data.result === "success"){
          alert('수정 되었습니다');
          setModal({isOpen:false});
          postSuccess();
        }else {
          alert("중복되는 시리얼코드가 있습니다.");
        }
    })

  };

  return (
    <div className="modal-overlay">
      <form ref={formRef} className="modal-form modal-container">
        <label>
          대분류 :<input type="text" name="useYn" defaultValue={detail?.useYn} />
        </label>
        <label>
          그룹코드 :<input type="text" name="groupName" defaultValue={detail?.groupName} />
        </label>
        <label>
          시리얼코드 :<input type="text" name="newDetailCode" defaultValue={detail?.detailCode} />
        </label>
        <label>
          상세명 :<input type="text" name="detailName" defaultValue={detail?.detailName} />
        </label>
        <label>
          번호 :<input type="text" name="regId" defaultValue={detail?.regId} />
        </label>
        <input type="hidden" name="oldDetailCode" defaultValue={detail?.detailCode} />
        <div className="button-container">
          <button type="button" onClick={updateDetail}>
              수정
          </button>
          <button type="button" onClick={() => {
            setModal({isOpen : false})
          }}>나가기</button>
        </div>
      </form>
    </div>
  );
};
