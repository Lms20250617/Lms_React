import { ContentBox } from '../../components/common.componets/ContentBox/ContentBox';
import { CompanyMain } from '../../components/System/Company/CompanyMain/CompanyMain';
import { CompanySearch } from '../../components/System/Company/CompanySearch/CompanySearch';
import { CompanyProvider } from '../../provider/System/CompanyProvider';

export const Company = () => {
  return (
    <>
      <CompanyProvider>
        <ContentBox>기업 정보</ContentBox>
        <CompanySearch></CompanySearch>
        <CompanyMain></CompanyMain>
      </CompanyProvider>
    </>
  );
};
