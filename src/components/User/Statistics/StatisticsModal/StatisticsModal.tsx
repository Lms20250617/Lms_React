import { useEffect, type FC } from 'react';

interface IStatisticsProps {
  id: number;
  reSearch: () => void;
}

export const StatisticsModal: FC<IStatisticsProps> = ({ id, reSearch }) => {
  useEffect(() => {
    id && detailStatistics();
  }, []);

  const detailStatistics = async () => {};

  return (
    <div id="webcrumbs">
      <div className="relative w-[600px] border border-gray-300 bg-white shadow-lg">
        <div className="flex items-center justify-between bg-[#3a4466] p-3 text-white">
          <h2 className="font-medium">강의 상세</h2>
          <button className="text-2xl font-bold">×</button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex">
              <div className="flex w-1/3 items-center justify-center bg-[#d9dde3] p-2 font-medium">
                강의 이름
              </div>
              <div className="w-2/3">
                <input
                  type="text"
                  value="vue"
                  className="h-full w-full border border-gray-300 px-2 py-1"
                />
              </div>
            </div>

            <div className="flex">
              <div className="flex w-1/3 items-center justify-center bg-[#d9dde3] p-2 font-medium">
                회차
              </div>
              <div className="w-2/3">
                <input
                  type="text"
                  value="2"
                  className="h-full w-full border border-gray-300 px-2 py-1"
                />
              </div>
            </div>

            <div className="flex">
              <div className="flex w-1/3 items-center justify-center bg-[#d9dde3] p-2 font-medium">
                담당 강사
              </div>
              <div className="w-2/3">
                <input
                  type="text"
                  value="강사"
                  className="h-full w-full border border-gray-300 px-2 py-1"
                />
              </div>
            </div>

            <div className="flex">
              <div className="flex w-1/3 items-center justify-center bg-[#d9dde3] p-2 font-medium">
                정원
              </div>
              <div className="w-2/3">
                <input
                  type="text"
                  value="23"
                  className="h-full w-full border border-gray-300 px-2 py-1"
                />
              </div>
            </div>

            <div className="flex">
              <div className="flex w-1/3 items-center justify-center bg-[#d9dde3] p-2 font-medium">
                개강 일자
              </div>
              <div className="w-2/3">
                <input
                  type="text"
                  value="2025-05-01 00:00:00.0"
                  className="h-full w-full border border-gray-300 px-2 py-1"
                />
              </div>
            </div>

            <div className="flex">
              <div className="flex w-1/3 items-center justify-center bg-[#d9dde3] p-2 font-medium">
                종강 일자
              </div>
              <div className="w-2/3">
                <input
                  type="text"
                  value="2025-06-24 00:00:00.0"
                  className="h-full w-full border border-gray-300 px-2 py-1"
                />
              </div>
            </div>

            <div className="flex">
              <div className="flex w-1/3 items-center justify-center bg-[#d9dde3] p-2 font-medium">
                평균 점수
              </div>
              <div className="w-2/3">
                <input
                  type="text"
                  value="미시험"
                  className="h-full w-full border border-gray-300 px-2 py-1"
                />
              </div>
            </div>

            <div className="flex">
              <div className="flex w-1/3 items-center justify-center bg-[#d9dde3] p-2 font-medium">
                과락 인원
              </div>
              <div className="w-2/3">
                <input
                  type="text"
                  value="미시험"
                  className="h-full w-full border border-gray-300 px-2 py-1"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button className="rounded bg-[#7d91b5] px-8 py-2 text-white transition-colors hover:bg-[#6a7ea0]">
              취소
            </button>
          </div>
        </div>
        {/* Next: "Add form validation messages" */}
      </div>
    </div>
  );
};
