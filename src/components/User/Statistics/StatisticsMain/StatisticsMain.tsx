import type { AxiosResponse } from 'axios';
import './styled.css';
import { useContext, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { ResumeContext } from '../../../../provider/User/ResumeProvider';
import { modalState } from '../../../../stores/modalState';
import axios from 'axios';
import { Portal } from '../../../../common/Portal';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import type {
  IStatistics,
  IStatisticsResponse,
} from '../../../../model/User/IStatistics';
import { StatisticsModal } from '../StatisticsModal/StatisticsModal';
import { StatisticsChartModal } from '../StatisticsModal/StatisticsChartModal';

export const StatisticsMain = () => {
  const [statisticsList, setStatisticsList] = useState<IStatistics[]>([]);
  const [statisticsCnt, setStatisticsCnt] = useState<number>(0);

  const { searchData } = useContext(ResumeContext);

  const [modal, setModal] = useRecoilState(modalState);

  useEffect(() => {
    if (!modal.isOpen) {
      searchList(1);
    }
  }, [modal]);

  useEffect(() => {
    searchList(1);
  }, [searchData]);

  const searchList = async (cPage?: number) => {
    const searchParam = new URLSearchParams(searchData);
    cPage = cPage || 1;

    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    await axios
      .post('/api/user/resumeLectureListBody.do', searchParam)
      .then((res: AxiosResponse<IStatisticsResponse>) => {
        setStatisticsList(res.data.resumeLectureList);
        setStatisticsCnt(res.data.resumeLectureCnt);
      });

    // axios를 통해 받은 데이터를 담아야함
    // 문제 1. axios를 통해 서버로 갔다가 와야하는데, 시간이 오래 걸림
  };

  const statisticsDetail = (id: number) => {
    setModal({ isOpen: true, type: 'statistics', payload: id });
  };

  return (
    <div className="statistics-main-container">
      {modal.isOpen && modal.type === 'statistics' && (
        <Portal>
          <StatisticsModal
            id={modal.payload as number}
            reSearch={() => {
              searchList(1);
            }}
          ></StatisticsModal>
        </Portal>
      )}

      {modal.isOpen && modal.type === 'chart' && (
        <>
          {console.log('✅ StatisticsChartModal 렌더링 중')}
          <Portal>
            <StatisticsChartModal
              id={modal.payload as number}
              reSearch={() => {}}
            ></StatisticsChartModal>
          </Portal>
        </>
      )}

      <table className="statistics-table">
        <thead className="statistics-table-header">
          <tr>
            <th>강의 번호</th>
            <th>강의 이름</th>
            <th>회차</th>
            <th>정원</th>
            <th>개강일</th>
            <th>종강일</th>
          </tr>
        </thead>
        <tbody>
          {statisticsList.length > 0 ? (
            statisticsList.map((statistics) => {
              return (
                <tr key={statistics.lecId} className="statistics-table-row">
                  <td className="statistics-cell">{statistics.lecId}</td>
                  <td
                    className="statistics-cell cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => statisticsDetail(statistics.lecId)}
                  >
                    {statistics.lecName}
                  </td>
                  <td className="statistics-cell">{statistics.lectureRound}</td>
                  <td className="statistics-cell">{statistics.lecPersonnel}</td>
                  <td className="statistics-cell">{statistics.lecStartDate}</td>
                  <td className="statistics-cell">{statistics.lecEndDate}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8} className="statistics-empty-row">
                등록된 이력서가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PageNavigation
        totalItems={statisticsCnt}
        itemsPerPage={5}
        onPageChange={searchList}
      />
    </div>
  );
};
