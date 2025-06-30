import { createContext, useState, type FC } from 'react';

//searchData를 IClassroomContext로 관리할것임.
interface IClassEquipContext {
  // classroom의 title, personnel을 string으로 선언
  searchclassData: {
    title: string;
    personnel: string;
  };
  // setSearchData를 선언할건데, params라는 인자(파라미터)를 받고, 이것은 params 타입.
  // Partial은 모든 객체를 optional(?:string)으로 만듬, 그말인 즉슨, title이나 personnel만 값이 있거나
  // 둘다 있어도 searchData에 값을 저장하겠다라는 함수임.
  // <IClassroomContext['searchData']>는 searchData의 속성의 타입을 가져온다.
  // return값은 void(아무것도 변하지 않음) -> interface할 때는 => void 필수.
  setSearchclassData: (
    params: Partial<IClassEquipContext['searchclassData']>
  ) => void;

  // epuipment 병합
  searchequipData: {
    equipName: string;
    searchStDate: string;
    searchEdDate: string;
  };
  setSearchepuipData: (
    params: Partial<IClassEquipContext['searchequipData']>
  ) => void;
}

// 입력창에 검색을 한것(searchData)을 defaultValue에 저장할것임.
const defaultValue: IClassEquipContext = {
  searchclassData: {
    title: '',
    personnel: '',
  },
  // setSearchData에 일단 빈 함수로 넣어둘것임.
  // 왜냐, 실제로는 ClassroomProvider에서 setSearchData를 넘겨주기 때문에
  // 그 전에는 빈 함수여야함.
  setSearchclassData: () => {},

  // epuipment 병합
  searchequipData: {
    equipName: '',
    searchStDate: '',
    searchEdDate: '',
  },
  setSearchepuipData: () => {},
};

// searchclassData: {title:'', personnel:''}이 담긴 defaultValue를 creatcontext를 사용해서 ClassroomContext(공용저장소)를 만들겠다.
export const ClassEquipContext = createContext(defaultValue);

// 용도: <ClassroomProvider></ClassroomProvider>를 컴포넌트로 쓰겠다.
// FC = FunctionComponent
// searchData를 저장하게 하고, children component들이 searchData에 저장된 값을 사용하게 해주는 context provider(공급자) 역할로 사용할것이다.
export const ClassroomEquipmentProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  // useState가 searchData에 defaultValue값을 저장함.
  // 저장된 값은 setSearchData함수로 값을 바꿀것임.
  const [searchclassData, setSearchclassData] = useState(
    defaultValue.searchclassData
  );
  //추후 확장이 가능하다.
  const updateclassSearchData = (
    // partial을 이용해 title or personnel 둘중에 하나만 받을 수 있음.
    params: Partial<IClassEquipContext['searchclassData']>
  ) => {
    // prev -> 현재 값, ...prev -> 기존 값 유지, ...parmas -> 덮어쓰기(params에 있는 값만 바뀜)
    // 기존 searchData를 유지하면서 일부만 바꾸겠다.
    setSearchclassData((prev) => ({ ...prev, ...params }));
  };

  // epuipment 병합
  const [searchequipData, setSearchepuipData] = useState(
    defaultValue.searchequipData
  );
  const updateepuipSearchData = (
    params: Partial<IClassEquipContext['searchequipData']>
  ) => {
    setSearchepuipData((prev) => ({ ...prev, ...params }));
  };

  return (
    <ClassEquipContext.Provider // provider로 묶은 children에게 밑의 value값을 배포할것임.
      value={{
        searchclassData,
        setSearchclassData: updateclassSearchData,
        searchequipData,
        setSearchepuipData: updateepuipSearchData,
      }}
    >
      {children}
    </ClassEquipContext.Provider>
  );
};
