import { ContentBox } from '../../components/common.componets/ContentBox/ContentBox';
import { EquipmentMain } from '../../components/System/Equipment/EquipmentMain/EquipmentMain';
import { EquipmentRoomSearch } from '../../components/System/Equipment/EquipmentRoomSearch/EquipmentRoomSearch';
import { ClassroomEquipmentProvider } from '../../provider/system/ClassroomEquipmentProvider';
export const Equipment = () => {
  return (
    <>
      <ClassroomEquipmentProvider>
        <ContentBox>장비 정보</ContentBox>
        <EquipmentRoomSearch></EquipmentRoomSearch>
        <EquipmentMain></EquipmentMain>
      </ClassroomEquipmentProvider>
    </>
  );
};
