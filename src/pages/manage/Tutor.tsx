import { ContentBox } from '../../components/common.componets/ContentBox/ContentBox';
import { TutorSearch } from '../../components/Manage/Tutor/TutorSearch/TutorSearch';
import { TutorProvider } from '../../provider/manage/TutorProvider';

export const Tutor = () => {
  return (
    <>
      <TutorProvider>
        <ContentBox>강사 관리</ContentBox>
        <TutorSearch></TutorSearch>
      </TutorProvider>
    </>
  );
};
