import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useEffect, useRef, useState, type FC } from 'react';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
interface lecture {
  lecId: number;
  lecName: string;
}

interface IRegisterModalProps {
  searchList: () => void;
}

export const QnARegisterModal: FC<IRegisterModalProps> = ({ searchList }) => {
  const [_, setModal] = useRecoilState(modalState);
  const [lectureList, setLectureList] = useState<lecture[]>();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    axios
      .post('/api/support/getQnaLectureListBody.do')
      .then((res: AxiosResponse<{ lectureList: lecture[] }>) => {
        setLectureList(res.data.lectureList);
      });
  }, []);

  const handleSubmit = () => {
    if (!confirm('등록하시겠습니까?')) {
      return;
    }
    axios
      .post('/api/support/qnaSave', formRef.current)
      .then((res: AxiosResponse) => {
        if (res.data.result === 'success') {
          alert('저장 되었습니다');
          setModal({ isOpen: false });
          searchList();
        } else {
          alert('저장에 실패하였습니다.');
        }
      });
  };

  return (
    <>
      <div className="modal-overlay">
        <form ref={formRef} className="modal-form modal-container">
          <h2 className="mb-4 text-xl font-semibold">Q&A</h2>
          <table className="mx-auto mb-4 w-full max-w-[1100px] border border-gray-300">
            <tbody>
              <tr>
                <th className="w-28 bg-gray-300 px-2 py-2 text-left align-top text-sm font-bold">
                  강의명
                </th>
                <td className="border border-gray-300 px-2 py-2 whitespace-pre-wrap">
                  <select name="lecId">
                    {lectureList?.map((lec) => {
                      return (
                        <option value={lec.lecId} key={lec.lecId}>
                          {lec.lecName}
                        </option>
                      );
                    })}
                  </select>
                </td>
              </tr>
              <tr>
                <th className="w-28 bg-gray-300 px-2 py-2 text-left align-top text-sm font-bold">
                  제목
                </th>
                <td className="border border-gray-300 px-2 py-2 whitespace-pre-wrap">
                  <input type="text" name="qnaTitle" />
                </td>
              </tr>
              <tr>
                <th className="w-28 bg-gray-300 px-2 py-2 text-left align-top text-sm font-bold">
                  내용
                </th>
                <td className="border border-gray-300 px-2 py-2 whitespace-pre-wrap">
                  <textarea
                    name="qnaContent"
                    className="min-h-[150px] w-full resize-y rounded border px-2 py-1"
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="button-container">
            <button type="button" onClick={handleSubmit}>
              등록
            </button>
            <button
              type="button"
              onClick={() => {
                setModal({ isOpen: false });
              }}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
