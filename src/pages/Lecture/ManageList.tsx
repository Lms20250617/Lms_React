import { ContentBox } from '../../components/common.componets/ContentBox/ContentBox';
import { ManageListMain } from '../../components/Lecture/ManageList/ManageListMain/ManageListMain';
import { ManageListSearch } from '../../components/Lecture/ManageList/ManageListSearch/ManageListSearch';
import { ManageListProvider } from '../../provider/Lecture/ManageListProvider';

export const ManageList = () => {
  return (
    <>
      <ManageListProvider>
        <ContentBox>강의 목록 관리</ContentBox>
        <ManageListSearch></ManageListSearch>
        <ManageListMain></ManageListMain>
      </ManageListProvider>
    </>
  );
};
