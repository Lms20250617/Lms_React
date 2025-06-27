import { useEffect, useRef, useState, type FC } from 'react';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../../stores/modalState';
import axios, { type AxiosResponse } from 'axios';
import {
  type ITest,
  type ILectureSelectBox,
  type ILectureSelectBoxResponse,
} from '../../../../../model/lecture/test/ITest';
import './styled.css';

interface ITestRegisterProps {
  id?: {
    testId: number;
    lecId: number;
  };
  reSearch: () => void;
  setSelectedTest: () => void;
}

interface IPostResponse {
  result: 'success' | 'fail';
}
interface ITestInfoDetail {
  testInfoDetail: ITest;
}

export const TestRegisterModal: FC<ITestRegisterProps> = ({
  id,
  reSearch,
  setSelectedTest,
}) => {
  const [_, setModal] = useRecoilState(modalState);
  const formRef = useRef<HTMLFormElement>(null);
  const [lectureList, setLectureList] = useState<ILectureSelectBox[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<ILectureSelectBox>();
  const [testStartDate, setTestStartDate] = useState<string>('');
  const [testEndDate, setTestEndDate] = useState<string>('');
  const [testDetail, setTestDetail] = useState<ITest>({} as ITest);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  useEffect(() => {
    axios
      .post('/api/lecture/lectureSelectBoxList.do')
      .then((res: AxiosResponse<ILectureSelectBoxResponse>) => {
        setLectureList(res.data.lecSelectBoxList);
      });
  }, []);

  useEffect(() => {
    if (id) {
      const params = new URLSearchParams();
      params.append('lecId', id.lecId.toString());
      params.append('testId', id.testId.toString());
      axios
        .post('/api/lecture/testInfoDetail.do', params)
        .then((res: AxiosResponse<ITestInfoDetail>) => {
          const testInfo: ITest = res.data.testInfoDetail;
          setTestDetail(testInfo);
          const lecture = lectureList.find((l) => l.lecId === testInfo.lecId);
          setSelectedLecture(lecture);
          setTestStartDate(testInfo.testBeginDate);
          setTestEndDate(testInfo.testEndDate);
          setIsUpdate(true);
        });
    }
  }, [id, lectureList]);

  const handleLectureSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLecture(
      lectureList.find(
        (lecture) => lecture.lecId.toString() === e.target.value.toString()
      ) as ILectureSelectBox
    );
    setTestStartDate('');
    setTestEndDate('');
  };

  const handleSave = () => {
    axios
      .post('/api/lecture/testInfoSave.do', formRef.current, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === 'success') {
          alert('등록되었습니다.');
          reSearch();
          closeModal();
        } else {
          alert('등록에 실패하였습니다.');
        }
      });
  };

  const handleUpdate = () => {
    axios
      .post(
        '/api/lecture/testInfoUpdate.do',
        formRef.current
        //    {
        //   headers: { 'Content-Type': 'application/json' },
        // }
      )
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === 'success') {
          alert('등록되었습니다.');
          reSearch();
          closeModal();
        } else {
          alert('등록에 실패하였습니다.');
        }
      });
  };

  const closeModal = () => {
    setModal({ isOpen: false });
    setSelectedTest();
  };

  return (
    <div className="modal-overlay">
      <form ref={formRef} className="modal-form modal-container">
        {id && (
          <>
            <input type="text" hidden defaultValue={id?.lecId} name="lecId" />
            <input type="text" hidden defaultValue={id?.testId} name="testId" />
          </>
        )}

        <label>
          강의 :
          <select
            className="selectbox"
            name="lecId"
            onChange={handleLectureSelectChange}
            value={selectedLecture?.lecId ?? ''}
            disabled={!!id}
          >
            <option value="">강의 선택</option>
            {lectureList.map((lecture) => {
              return (
                <option key={lecture.lecId} value={lecture.lecId}>
                  {lecture.lecName}
                </option>
              );
            })}
          </select>
        </label>
        <label>
          강사 :
          <input
            type="text"
            value={
              selectedLecture?.lecInstructorName ??
              testDetail?.lecInstructorName ??
              ''
            }
            readOnly={true}
          />
        </label>
        <label>
          강의실 :
          <input
            type="text"
            value={
              selectedLecture?.lecRoomName ?? testDetail?.lecRoomName ?? ''
            }
            readOnly={true}
          />
        </label>
        <label>
          시험시작일
          <input
            type="datetime-local"
            name="testBeginDate"
            min={selectedLecture?.lecStartDate}
            value={testStartDate}
            onChange={(e) => {
              setTestStartDate(e.target.value);
            }}
          ></input>
        </label>
        <label>
          시험종료일
          <input
            type="datetime-local"
            name="testEndDate"
            max={selectedLecture?.lecEndDate}
            value={testEndDate}
            onChange={(e) => {
              setTestEndDate(e.target.value);
            }}
          ></input>
        </label>
        <input type="text" name="testType" defaultValue="0" hidden={true} />
        <div className="button-container">
          {isUpdate ? (
            <button type="button" onClick={handleUpdate}>
              수정
            </button>
          ) : (
            <button type="button" onClick={handleSave}>
              저장
            </button>
          )}

          <button type="button" onClick={closeModal}>
            나가기
          </button>
        </div>
      </form>
    </div>
  );
};
