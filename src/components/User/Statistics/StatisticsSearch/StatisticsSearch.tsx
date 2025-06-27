import { useContext, useEffect, useRef, useState } from 'react';
import './styled.css';
import axios, { type AxiosResponse } from 'axios';
import { StatisticsContext } from '../../../../provider/User/StatisticsProvider';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { StatisticsChartModal } from '../StatisticsModal/StatisticsChartModal';
import type { ILecDetailResponse } from '../../../../model/User/IStatistics';
import { Portal } from '../../../../common/Portal';

interface ILecture {
  lecId: number;
  lecName: string;
}

interface IRound {
  lectureRound: number;
}

export const StatisticsSearch = () => {
  const [lectureStartAround, setLectureStartAround] = useState<string>();
  const [lectureEndAround, setLectureEndAround] = useState<string>();
  const [lectures, setLectures] = useState<ILecture[]>([]);
  const [rounds, setRounds] = useState<IRound[]>([]);
  const [modal, setModal] = useRecoilState(modalState);

  const { searchData, setSearchData } = useContext(StatisticsContext);

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

  const statisticsChart = async () => {
    const statisticsParams = new URLSearchParams();
    if (selectedLecName)
      statisticsParams.append('lectureName', selectedLecName);
    if (lectureStartAround)
      statisticsParams.append('lectureStartAround', lectureStartAround);
    if (lectureEndAround)
      statisticsParams.append('lectureEndAround', lectureEndAround);

    try {
      await axios
        .post('/api/user/lacture-statistics', statisticsParams)
        .then((res: AxiosResponse<ILecDetailResponse[]>) => {
          const chartResponse = res.data;
          setModal({
            isOpen: true,
            type: 'chart',
            payload: { chartRes: chartResponse },
          });
        });
    } catch (err) {
      alert('통계 조회 중 오류가 발생했습니다.');
    }
  };

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
    <div className="statistics-container">
      {modal.isOpen && modal.type === 'chart' && (
        <Portal>
          <StatisticsChartModal
            id={modal.payload as number}
            reSearch={() => {}}
          ></StatisticsChartModal>
        </Portal>
      )}

      <div className="input-box">
        <span>
          강의 이름
          <select
            className="w-full rounded-sm border border-gray-300 p-2 md:w-56"
            onChange={(e) => setSelectedLecName(e.target.value)}
            value={selectedLecName}
          >
            <option key="all" value="">
              전체
            </option>
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
            <option key="all" value="">
              전체
            </option>
            {rounds.map((r, index) => (
              <option key={index} value={r.lectureRound}>
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
            <option key="all" value="">
              전체
            </option>
            {rounds.map((r, index) => (
              <option key={index} value={r.lectureRound}>
                {r.lectureRound}
              </option>
            ))}
          </select>
        </span>

        <button onClick={handlerSearch}>검색</button>
        <button onClick={statisticsChart}>통계</button>
      </div>
    </div>
  );
};
