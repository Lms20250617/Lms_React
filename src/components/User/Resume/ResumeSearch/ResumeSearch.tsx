import { useContext, useEffect, useRef, useState } from 'react';
import { ResumeContext } from '../../../../provider/User/ResumeProvider';
import './styled.css';
import axios, { type AxiosResponse } from 'axios';

interface ILecture {
  lecId: number;
  lecName: string;
}

export const ResumeSearch = () => {
  const lecName = useRef<HTMLInputElement>(null);
  const [lectureStartRound, setLectureStartRound] = useState<string>();
  const [lectureEndRound, setLectureEndRound] = useState<string>();
  const [isInitialized, setIsInitialized] = useState<Boolean>(false);
  const [lectures, setLectures] = useState<ILecture[]>([]);

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

  const handlerSearch = () => {
    setSearchData({
      lecName: selectedLecName,
      lectureStartRound: lectureStartRound || '',
      lectureEndRound: lectureEndRound || '',
    });
  };

  return (
    <div className="resume-container">
      <div className="input-box">
        <select
          className="w-full rounded-sm border border-gray-300 p-2 md:w-56"
          onChange={(e) => setSelectedLecName(e.target.value)}
          value={selectedLecName}
        >
          <option value="">강의 이름</option>
          {lectures.map((l) => (
            <option key={l.lecId} value={l.lecName}>
              {l.lecName}
            </option>
          ))}
        </select>
        <select
          className="w-full rounded-sm border border-gray-300 p-2 md:w-56"
          onChange={(e) => setLectureStartRound(e.target.value)}
        >
          <option value="">회차</option>
        </select>
        <select
          className="w-full rounded-sm border border-gray-300 p-2 md:w-56"
          onChange={(e) => setLectureEndRound(e.target.value)}
        ></select>
        <button onClick={handlerSearch}>검색</button>
      </div>
    </div>
  );
};
