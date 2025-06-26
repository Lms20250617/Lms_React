import type { FC } from 'react';
import './styled.css';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';

interface IStatisticsChartProps {
  id: number;
  reSearch: () => void;
}

export const StatisticsChartModal: FC<IStatisticsChartProps> = ({
  id,
  reSearch,
}) => {
  const [modal, setModal] = useRecoilState(modalState);

  const closeModal = () => {
    setModal({ isOpen: false });
    reSearch();
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
          <div className="p-6">
            {/* Table */}
            <div className="mb-8 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-600">
                      강의 번호
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-600">
                      강의 이름
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-600">
                      강사 이름
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600">
                      회차
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600">
                      개강일
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600">
                      종강일
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600">
                      정원
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600">
                      평균 점수
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600">
                      최고 점수
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600">
                      최저 점수
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600">
                      과락 인원
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="transition-colors duration-150 hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-800">
                      9
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-800">
                      프로그래밍 기초 과정
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-800">
                      김지수
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-800">
                      1
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-800">
                      2025-05-24
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-800">
                      2025-07-04
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-800">
                      12
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-800">
                      0
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-800">
                      0
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-800">
                      0
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-800">
                      0
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Scrollbar visualization */}
            <div className="absolute top-10 right-0 bottom-0 w-2 rounded-full bg-gray-200">
              <div className="h-20 w-full cursor-pointer rounded-full bg-gray-500 transition-colors hover:bg-gray-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
