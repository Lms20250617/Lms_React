import { ContentBox } from '../../components/common.componets/ContentBox/ContentBox';
import { TutorMain } from '../../components/Manage/Tutor/TutorMain/TutorMain';
import { TutorSearch } from '../../components/Manage/Tutor/TutorSearch/TutorSearch';
import { TutorProvider } from '../../provider/manage/TutorProvider';

export const Tutor = () => {
  return (
    <>
      <TutorProvider>
        <ContentBox>강사 관리</ContentBox>
        <TutorSearch></TutorSearch>
        <TutorMain></TutorMain>
      </TutorProvider>
    </>
  );
};
