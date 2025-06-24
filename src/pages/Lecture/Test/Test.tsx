import { ContentBox } from '../../../components/common.componets/ContentBox/ContentBox';
import { TestMain } from '../../../components/Lecture/Test/TestMain/TestMain';
import { TestSearch } from '../../../components/Lecture/Test/TestSearch/TestSearch';
import { TestProvider } from '../../../provider/Lecture/Test/TestProvider';

export const Test = () => {
  return (
    <>
      <TestProvider>
        <ContentBox>시험정보</ContentBox>
        <TestSearch></TestSearch>
        <TestMain></TestMain>
      </TestProvider>
    </>
  );
};
