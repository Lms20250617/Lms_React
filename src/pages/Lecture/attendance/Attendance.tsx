import { ContentBox } from '../../../components/common.componets/ContentBox/ContentBox';
import { AttendanceMain } from '../../../components/Lecture/Attendance/AttendanceMain/AttendanceMain';
import { AttendanceSearch } from '../../../components/Lecture/Attendance/AttendanceSearch/AttendanceSearch';
import { AttendanceProvider } from '../../../provider/Lecture/AttendanceProvider';

export const Attendance = () => {
  return (
    <>
      <AttendanceProvider>
        <ContentBox>출결 관리</ContentBox>
        <AttendanceMain />
        <AttendanceSearch />
      </AttendanceProvider>
    </>
  );
};
