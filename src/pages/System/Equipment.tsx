import { ContentBox } from '../../components/common.componets/ContentBox/ContentBox';
import { EquipmentMain } from '../../components/System/Equipment/EquipmentMain/EquipmentMain';
import { EquipmentRoomSearch } from '../../components/System/Equipment/EquipmentRoomSearch/EquipmentRoomSearch';
import { ClassroomProvider } from '../../provider/system/ClassroomProvider';
export const Equipment = () => {
  return (
    <>
      <ClassroomProvider>
        <ContentBox>장비 정보</ContentBox>
        <EquipmentRoomSearch></EquipmentRoomSearch>
        <EquipmentMain></EquipmentMain>
      </ClassroomProvider>
    </>
  );
};
