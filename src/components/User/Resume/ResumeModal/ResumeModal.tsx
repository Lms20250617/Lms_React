import { useEffect, type FC } from 'react';

interface IResumeProps {
  id: number;
  reSearch: () => void;
}

export const ResumeModal: FC<IResumeProps> = ({ id, reSearch }) => {
  useEffect(() => {
    id && detailResume();
  }, []);

  const detailResume = () => {
    const param = new URLSearchParams();

    param.append('noticeId', id.toString());
  };

  return (
    <div className="modal-overlay">
      <div id="webcrumbs">
        <div className="relative mx-auto w-full max-w-5xl rounded-md bg-[#303854] p-4 text-white">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium">이력서 관리</h2>
            <button className="transition-opacity hover:opacity-80">
              <span className="material-symbols-outlined">ⓧ</span>
            </button>
          </div>

          <div className="rounded-sm bg-white p-4 text-black">
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium">
                이메일 전송할 기업 선택
              </p>
              <select className="w-full rounded-sm border border-gray-400 p-2 md:w-56">
                <option>전체</option>
              </select>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-sm font-medium">선택된 기업 목록</p>
              <div className="rounded-sm border border-gray-300">
                <div className="grid grid-cols-2 bg-gray-200 text-center">
                  <div className="border-r border-gray-300 px-3 py-2 text-sm">
                    기업명
                  </div>
                  <div className="px-3 py-2 text-sm">상세</div>
                </div>
                <div className="px-3 py-4 text-center text-sm text-gray-500">
                  선택한 회사가 없습니다.
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-sm font-medium">학생 목록</p>
              <div className="rounded-sm border border-gray-300">
                <div className="grid grid-cols-7 bg-gray-200">
                  <div className="border-r border-gray-300 px-2 py-2 text-center">
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                  <div className="border-r border-gray-300 px-3 py-2 text-center text-sm">
                    이름
                  </div>
                  <div className="border-r border-gray-300 px-3 py-2 text-center text-sm">
                    학번
                  </div>
                  <div className="border-r border-gray-300 px-3 py-2 text-center text-sm">
                    전화번호
                  </div>
                  <div className="border-r border-gray-300 px-3 py-2 text-center text-sm">
                    이메일
                  </div>
                  <div className="border-r border-gray-300 px-3 py-2 text-center text-sm">
                    이력서
                  </div>
                  <div className="px-3 py-2 text-center text-sm">
                    이력서 관리
                  </div>
                </div>
                <div className="px-3 py-4 text-center text-sm text-gray-500">
                  학생 목록이 없습니다.
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <button className="rounded-sm bg-[#31a0d4] px-6 py-2 text-white transition-colors hover:bg-[#2b90c0]">
                전송
              </button>
              <button className="rounded-sm bg-[#6c83a9] px-6 py-2 text-white transition-colors hover:bg-[#5c7399]">
                취소
              </button>
            </div>
          </div>
          {/* Next: "Add pagination controls below the student list table" */}
        </div>
      </div>
    </div>
  );
};
