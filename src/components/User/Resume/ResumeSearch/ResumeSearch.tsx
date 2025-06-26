import { useContext, useEffect, useRef, useState } from 'react';
import { ResumeContext } from '../../../../provider/User/ResumeProvider';
import './styled.css';
import axios, { type AxiosResponse } from 'axios';

interface ILecture {
  lecId: number;
  lecName: string;
}

interface IRound {
  lectureRound: number;
}

export const ResumeSearch = () => {
  const [lectureStartAround, setLectureStartAround] = useState<string>();
  const [lectureEndAround, setLectureEndAround] = useState<string>();
  const [lectures, setLectures] = useState<ILecture[]>([]);
  const [rounds, setRounds] = useState<IRound[]>([]);

  const { setSearchData } = useContext(ResumeContext);
  const [selectedLecName, setSelectedLecName] = useState<string>('');

  useEffect(() => {
    const fetchLectures = async () => {
      await axios
        .post('/api/user/lecture-selectbox')
        .then((res: AxiosResponse<ILecture[]>) => {
          const result = res.data;
          setLectures(result);
        });
    };

    fetchLectures();
  }, []);

  useEffect(() => {
    if (!selectedLecName) {
      setRounds([]);
      return;
    }

    const fetchRoundByLecName = async () => {
      await axios
        .post(`/api/user/lecture-round-selectbox/${selectedLecName}`)
        .then((res: AxiosResponse<IRound[]>) => {
          const result = res.data;
          setRounds(result);
        });
    };
    fetchRoundByLecName();
  }, [selectedLecName]);

  const handlerSearch = () => {
    if (
      lectureStartAround &&
      lectureEndAround &&
      Number(lectureEndAround) < Number(lectureStartAround)
    ) {
      alert('종료회차는 시작회차보다 빠를 수 없습니다.');
      return;
    }
    setSearchData({
      lectureName: selectedLecName,
      lectureStartAround: lectureStartAround || '',
      lectureEndAround: lectureEndAround || '',
    });
  };

  return (
    <div className="resume-container">
      <div className="input-box">
        <span>
          강의 이름
          <select
            className="w-full rounded-sm border border-gray-300 p-2 md:w-56"
            onChange={(e) => setSelectedLecName(e.target.value)}
            value={selectedLecName}
          >
            <option value="">전체</option>
            {lectures.map((l) => (
              <option key={l.lecId} value={l.lecName}>
                {l.lecName}
              </option>
            ))}
          </select>
        </span>
        <span>
          시작 회차
          <select
            className="w-full rounded-sm border border-gray-300 p-2 md:w-56"
            onChange={(e) => setLectureStartAround(e.target.value)}
          >
            <option value="">전체</option>
            {rounds.map((r) => (
              <option key={r.lectureRound} value={r.lectureRound}>
                {r.lectureRound}
              </option>
            ))}
          </select>
        </span>
        <span>
          종료 회차
          <select
            className="w-full rounded-sm border border-gray-300 p-2 md:w-56"
            onChange={(e) => setLectureEndAround(e.target.value)}
          >
            <option value="">전체</option>
            {rounds.map((r) => (
              <option key={r.lectureRound} value={r.lectureRound}>
                {r.lectureRound}
              </option>
            ))}
          </select>
        </span>

        <button onClick={handlerSearch}>검색</button>
      </div>
    </div>
  );
};
