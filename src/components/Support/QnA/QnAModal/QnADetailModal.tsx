import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { QnAContext } from '../../../../provider/support/QnAProvider';
import type { IQnADetail } from '../../../../model/Support/IQnA';

export const QnADetailModal = () => {
  const [modal, setModal] = useRecoilState(modalState);
  const isCreateMode = modal.type === 'qnaCreate';
  const [qnaData, setQnaData] = useState<IQnADetail | null>(null);
  const [qnaTitle, setQnaTitle] = useState('');
  const [qnaContent, setQnaContent] = useState('');
  const [qnaAnswer, setQnaAnswer] = useState('');

  const { searchData } = useContext(QnAContext);

  useEffect(() => {
    if (!isCreateMode && modal.payload) {
      const { qnaId } = modal.payload as { qnaId: number };
      axios
        .post('/api/support/getQnaDetail.do', new URLSearchParams({ qnaId }))
        .then((res) => {
          setQnaData(res.data);
          setQnaTitle(res.data.qnaTitle);
          setQnaContent(res.data.qnaContent);
          setQnaAnswer(res.data.qnaAnswer || '');
        });
    }
  }, [modal]);

  const handleSubmit = async () => {
    if (!qnaTitle.trim() || !qnaContent.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    if (isCreateMode) {
      await axios.post('/api/support/insertQna.do', {
        qnaTitle,
        qnaContent,
        lecId: 1,
      });
      alert('질문이 등록되었습니다.');
    } else if (qnaData) {
      await axios.post('/api/support/updateQna.do', {
        qnaId: qnaData.qnaId,
        qnaTitle,
        qnaContent,
      });
      alert('질문이 수정되었습니다.');
    }

    setModal({ isOpen: false });
  };

  const handleAnswerSubmit = async () => {
    if (!qnaAnswer.trim()) {
      alert('답변을 입력해주세요.');
      return;
    }
    if (!qnaData) return;

    await axios.post('/api/support/updateQnaAnswer.do', {
      qnaId: qnaData.qnaId,
      qnaAnswer,
    });
    alert('답변이 등록되었습니다.');
    setModal({ isOpen: false });
  };

  return (
    <div className="modal-box">
      <h2>{isCreateMode ? '질문 등록' : '질문 상세'}</h2>

      <label>제목</label>
      <input value={qnaTitle} onChange={(e) => setQnaTitle(e.target.value)} />

      <label>내용</label>
      <textarea
        value={qnaContent}
        onChange={(e) => setQnaContent(e.target.value)}
      />

      {!isCreateMode && (
        <>
          <label>답변</label>
          <textarea
            value={qnaAnswer}
            onChange={(e) => setQnaAnswer(e.target.value)}
            disabled={!!qnaData?.qnaAnswer}
          />
          {!qnaData?.qnaAnswer && (
            <button onClick={handleAnswerSubmit}>답변 등록</button>
          )}
        </>
      )}

      <div className="modal-footer">
        <button onClick={handleSubmit}>{isCreateMode ? '등록' : '수정'}</button>
        <button onClick={() => setModal({ isOpen: false })}>닫기</button>
      </div>
    </div>
  );
};
