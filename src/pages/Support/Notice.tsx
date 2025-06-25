import { ContentBox } from '../../components/common.componets/ContentBox/ContentBox';
import { NoticeMain } from '../../components/Support/Notice/NoticeMain/NoticeMain';
import { NoticeSearch } from '../../components/Support/Notice/NoticeSearch/NoticeSearch';
import { NoticeProvider } from '../../provider/NoticeProvider';

export const Notice = () => {
  return (
    <>
      <NoticeProvider>
        <ContentBox>공지사항</ContentBox>
        <NoticeSearch />
        <NoticeMain />
      </NoticeProvider>
    </>
  );
};
