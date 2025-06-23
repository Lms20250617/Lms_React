import { ContentBox } from '../../components/common.componets/ContentBox/ContentBox';
import { StudentMain } from '../../components/Manage/Student/StudentMain/StudentMain';
import { StudentSearch } from '../../components/Manage/Student/StudentSearch/StudentSearch';
import { StudentProvider } from '../../provider/manage/StudentProvider';

export const Student = () => {
  return (
    <>
      <StudentProvider>
        <ContentBox>학생 관리</ContentBox>
        <StudentSearch></StudentSearch>
        <StudentMain></StudentMain>
      </StudentProvider>
    </>
  );
};
