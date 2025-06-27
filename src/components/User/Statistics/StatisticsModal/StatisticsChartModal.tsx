import { useEffect, useState, type FC } from 'react';
import './styled.css';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import type { ILecDetailResponse } from '../../../../model/User/IStatistics';
import { ScoreChart } from '../ScoreChart/ScoreChart';

interface IStatisticsChartProps {
  id: number;
  reSearch: () => void;
}

export const StatisticsChartModal: FC<IStatisticsChartProps> = () => {
  const [modal, setModal] = useRecoilState(modalState);
  const [chartRes, setChartRes] = useState(modal.payload?.chartRes);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = () => {
    setModal({ isOpen: false });
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="statistics-modal-overlay">
      <div id="webcrumbs">
        <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-lg bg-gray-50 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between bg-indigo-800 px-6 py-4 text-white">
            <h2 className="text-xl font-semibold">강의 통계</h2>
            <button className="rounded-full p-2 transition duration-200 hover:bg-indigo-700">
              <span className="material-symbols-outlined" onClick={closeModal}>
                ⓧ
              </span>
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[75vh] overflow-y-auto p-6">
            {/* Table */}
            <div className="mb-8 overflow-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="min-w-[100px] border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-600">
                      강의 번호
                    </th>
                    <th className="min-w-[100px] border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-600">
                      강의 이름
                    </th>
                    <th className="min-w-[100px] border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-600">
                      강사 이름
                    </th>
                    <th className="min-w-[100px] border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600">
                      회차
                    </th>
                    <th className="min-w-[100px] border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600">
                      개강일
                    </th>
                    <th className="min-w-[100px] border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600">
                      종강일
                    </th>
                    <th className="min-w-[100px] border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600">
                      정원
                    </th>
                    <th className="min-w-[100px] border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600">
                      평균 점수
                    </th>
                    <th className="min-w-[100px] border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600">
                      최고 점수
                    </th>
                    <th className="min-w-[100px] border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600">
                      최저 점수
                    </th>
                    <th className="min-w-[100px] border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600">
                      과락 인원
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chartRes.map((chart: ILecDetailResponse) => (
                    <tr
                      className="transition-colors duration-150 hover:bg-gray-50"
                      key={chart.lecId}
                    >
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-800">
                        {chart.lecId ?? '-'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-800">
                        {chart?.lecName ?? '-'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-800">
                        {chart?.tutorName ?? '-'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-800">
                        {chart?.lectureRound ?? '-'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-800">
                        {chart?.lecStartDate.substring(0, 10) ?? '-'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-800">
                        {chart?.lecEndDate.substring(0, 10) ?? '-'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-800">
                        {chart?.lecPersonnel ?? '-'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-800">
                        {chart?.avgScore ?? '-'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-800">
                        {chart?.maxScore ?? '-'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-800">
                        {chart?.minScore ?? '-'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-800">
                        {chart?.failedStudents ?? '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ScoreChart
                data={Array.isArray(chartRes) ? chartRes : [chartRes]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
