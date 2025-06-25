import { ContentBox } from '../../components/common.componets/ContentBox/ContentBox';
import { ResumeMain } from '../../components/User/Resume/ResumeMain/ResumeMain';
import { ResumeSearch } from '../../components/User/Resume/ResumeSearch/ResumeSearch';
import { ResumeProvider } from '../../provider/User/ResumeProvider';

export const Resume = () => {
  return (
    <ResumeProvider>
      <ContentBox>이력서 관리</ContentBox>
      <ResumeSearch />
      <ResumeMain />
    </ResumeProvider>
  );
};
