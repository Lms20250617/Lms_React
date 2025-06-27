import { ContentBox } from '../../components/common.componets/ContentBox/ContentBox';
import { RecruitMain } from '../../components/Manage/Recruit/RecruitMain/RecruitMain';
import { RecruitSearch } from '../../components/Manage/Recruit/RecruitSearch/RecruitSearch';
import { RecruitProvider } from '../../provider/manage/RecruitProvider';

export const Recruit = () => {
  return (
    <RecruitProvider>
      <ContentBox>취업관리</ContentBox>
      <RecruitSearch />
      <RecruitMain />
    </RecruitProvider>
  );
};
