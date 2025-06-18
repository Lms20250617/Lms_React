import { ContentBox } from '../../../components/common.componets/ContentBox/ContentBox';
import { TestInfoMain } from '../../../components/Lecture/Test/TestInfo/TestInfoMain/TestInfoMain';
import { TestInfoSearch } from '../../../components/Lecture/Test/TestInfo/TestInfoSearch/TestInfoSearch';
import { TestInfoProvider } from '../../../provider/TestInfoProvider';

export const TestInfo = () => {
  return (
    <>
      <TestInfoProvider>
        <ContentBox>시험정보</ContentBox>
        <TestInfoSearch />
        <TestInfoMain />
      </TestInfoProvider>
    </>
  );
};
