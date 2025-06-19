import { ContentBox } from '../../components/common.componets/ContentBox/ContentBox';
import { ClassroomMain } from '../../components/System/Classroom/ClassroomMain/ClassroomMain';
import { ClassroomSearch } from '../../components/System/Classroom/ClassroomSearch/ClassroomSearch';
import { ClassroomProvider } from '../../provider/ClassroomProvider';

export const Classroom = () => {
  return (
    <>
      <ClassroomProvider>
        <ContentBox>강의실 정보</ContentBox>
        <ClassroomSearch />
        <ClassroomMain></ClassroomMain>
      </ClassroomProvider>
    </>
  );
};
