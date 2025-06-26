import { useEffect, useState, type FC } from 'react';
import './styled.css';
import axios, { type AxiosResponse } from 'axios';
import type { ILecDetailResponse } from '../../../../model/User/IStatistics';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';

interface IStatisticsProps {
  id: number;
  reSearch: () => void;
}

export const StatisticsModal: FC<IStatisticsProps> = ({ id, reSearch }) => {
  const [datail, setDetail] = useState<ILecDetailResponse>();
  const [modal, setModal] = useRecoilState(modalState);

  useEffect(() => {
    id && detailStatistics();
  }, []);

  const detailStatistics = async () => {
    await axios
      .post(`/api/user/lec-detail/${id}`)
      .then((res: AxiosResponse<ILecDetailResponse>) => {
        var result = res.data;
        setDetail(result);
      });
  };

  const closeModal = () => {
    setModal({ isOpen: false });
  };

  return (
    <div className="statistics-modal-overlay">
      <div id="webcrumbs">
        <div className="relative w-[600px] border border-gray-300 bg-white shadow-lg">
          <div className="flex items-center justify-between bg-[#3a4466] p-3 text-white">
            <h2 className="font-medium">강의 상세</h2>
            <button
              className="cursor-pointer text-2xl font-bold"
              onClick={closeModal}
            >
              ×
            </button>
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
                    value={datail?.lecName}
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
                    value={datail?.lectureRound}
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
                    value={datail?.tutorName}
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
                    value={datail?.lecPersonnel}
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
                    value={datail?.lecStartDate.substring(0, 10) ?? ''}
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
                    value={datail?.lecEndDate.substring(0, 10) ?? ''}
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
                    value={datail?.avgScore ? datail?.avgScore : '미시험'}
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
                    value={
                      datail?.failedStudents ? datail?.failedStudents : '미시험'
                    }
                    className="h-full w-full border border-gray-300 px-2 py-1"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                className="cursor-pointer rounded bg-[#7d91b5] px-8 py-2 text-white transition-colors hover:bg-[#6a7ea0]"
                onClick={closeModal}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
