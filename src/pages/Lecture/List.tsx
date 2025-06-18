import { ContentBox } from '../../components/common.componets/ContentBox/ContentBox';
import { ListMain } from '../../components/Lecture/ListMain/ListMain';
import { ListSearch } from '../../components/Lecture/ListSearch/ListSearch';
import { ListProvider } from '../../provider/Lecture/ListProvider';

export const List = () => {
  return (
    <>
      <ListProvider>
        <ContentBox>강의목록</ContentBox>
        <ListSearch />
        <ListMain />
      </ListProvider>
    </>
  );
};
