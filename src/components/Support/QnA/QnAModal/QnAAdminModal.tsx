import type { FC } from 'react';
import type { IQnAModalProps } from '../../../../model/Support/IQnA';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import axios, { type AxiosResponse } from 'axios';

export const QnaAdminModal: FC<IQnAModalProps> = ({ detail, searchList }) => {
  const [_, setModal] = useRecoilState(modalState);

  const handleDelete = () => {
    if (!confirm('정말 삭제하시겠습니까?')) {
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

  return (
    <>
      <div className="modal-overlay">
        <div className="relative max-h-[90vh] w-full max-w-[700px] overflow-y-auto rounded-lg bg-white p-5 opacity-100 shadow-lg">
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
          {detail.qnaAnswer && (
            <>
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
                      {detail.qnaAnswer}
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
            </>
          )}
          <div className="button-container">
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
        </div>
      </div>
    </>
  );
};
