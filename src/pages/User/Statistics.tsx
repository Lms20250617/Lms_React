import { ContentBox } from '../../components/common.componets/ContentBox/ContentBox';
import { StatisticsMain } from '../../components/User/Statistics/StatisticsMain/StatisticsMain';
import { StatisticsSearch } from '../../components/User/Statistics/StatisticsSearch/StatisticsSearch';
import { StatisticsProvider } from '../../provider/User/StatisticsProvider';

export const Statistics = () => {
  return (
    <StatisticsProvider>
      <ContentBox>통계</ContentBox>
      <StatisticsSearch />
      <StatisticsMain />
    </StatisticsProvider>
  );
};
