import { ContentBox } from '../../components/common.componets/ContentBox/ContentBox';
import { QnAMain } from '../../components/Support/QnA/QnAMain/QnAMain';
import { QnASearch } from '../../components/Support/QnA/QnASearch/QnASearch';
import { QnAProvider } from '../../provider/support/QnAProvider';

export const QnA = () => {
  return (
    <>
      <QnAProvider>
        <ContentBox>QnA</ContentBox>
        <QnASearch />
        <QnAMain />
      </QnAProvider>
    </>
  );
};
