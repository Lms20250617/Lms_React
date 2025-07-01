import { useRef, type FC } from 'react';
import type { IQnAModalProps } from '../../../../model/Support/IQnA';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import type { AxiosResponse } from 'axios';
import axios from 'axios';

export const QnATutorModal: FC<IQnAModalProps> = ({ detail, searchList }) => {
  const [_, setModal] = useRecoilState(modalState);
  const formRef = useRef<HTMLFormElement>(null);
  const handleDelete = () => {
    if (!confirm('해당 질문을 삭제하시겠습니까?')) {
      return;
    }
    const param = new URLSearchParams();
    param.append('qnaId', detail.qnaId.toString());
    axios.post('/api/support/qnaDelete', param).then((res: AxiosResponse) => {
      if (res.data.result === 'success') {
        alert('삭제되었습니다');
        setModal({ isOpen: false });
        searchList();
      } else {
        alert('삭제에 실패하였습니다.');
      }
    });
  };

  const handleSave = () => {
    if (!confirm('댓글을 저장하시겠습니까?')) {
      return;
    }

    axios
      .post('/api/support/qnaAnswerUpdate', formRef.current)
      .then((res: AxiosResponse) => {
        if (res.data.result === 'success') {
          alert('저장되었습니다');
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
          <table className="mb-4 w-full border border-gray-300">
            <tbody>
              <tr>
                <th className="w-28 bg-gray-300 px-2 py-2 text-left align-top text-sm font-bold">
                  강의명
                </th>
                <td className="border border-gray-300 px-2 py-2">
                  {detail.lecName}
                </td>
              </tr>
              <tr>
                <th className="w-28 bg-gray-300 px-2 py-2 text-left align-top text-sm font-bold">
                  제목
                </th>
                <td className="border border-gray-300 px-2 py-2">
                  {detail.qnaTitle}
                </td>
              </tr>
              <tr>
                <th className="w-28 bg-gray-300 px-2 py-2 text-left align-top text-sm font-bold">
                  내용
                </th>
                <td className="border border-gray-300 px-2 py-2 whitespace-pre-wrap">
                  {detail.qnaContent}
                </td>
              </tr>
            </tbody>
          </table>

          <h2 className="mb-4 text-xl font-semibold">댓글</h2>
          <table className="mb-4 w-full border border-gray-300">
            <tbody>
              <tr>
                <th className="w-28 bg-gray-300 px-2 py-2 text-left align-top text-sm font-bold">
                  작성자
                </th>
                <td className="border border-gray-300 px-2 py-2">
                  {detail.tutorLoginId}
                </td>
              </tr>
              <tr>
                <th className="w-28 bg-gray-300 px-2 py-2 text-left align-top text-sm font-bold">
                  내용
                </th>
                <td className="border border-gray-300 px-2 py-2">
                  <textarea
                    name="qnaAnswer"
                    className="min-h-[150px] w-full resize-y rounded border px-2 py-1"
                    defaultValue={detail.qnaAnswer}
                  ></textarea>
                  <input
                    type="text"
                    defaultValue={detail.qnaId}
                    name="qnaId"
                    hidden
                  />
                </td>
              </tr>
              <tr>
                <th className="w-28 bg-gray-300 px-2 py-2 text-left align-top text-sm font-bold">
                  답변일
                </th>
                <td className="border border-gray-300 px-2 py-2 whitespace-pre-wrap">
                  {detail.qnaAnswerDate}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="button-container">
            <button type="button" onClick={handleSave}>
              저장
            </button>
            <button type="button" onClick={handleDelete}>
              삭제
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
