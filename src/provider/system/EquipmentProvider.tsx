import { createContext, useState, type FC } from 'react';

//searchData를 IClassroomContext로 관리할것임.
interface IEquipmentContext {
  // title, personnel을 string으로 선언
  searchData: {
    equipName: string;
    searchStDate: string;
    searchEdDate: string;
  };
  // setSearchData를 선언할건데, params라는 인자(파라미터)를 받고, 이것은 params 타입.
  // Partial은 모든 객체를 optional(?:string)으로 만듬, 그말인 즉슨, title이나 personnel만 값이 있거나
  // 둘다 있어도 searchData에 값을 저장하겠다라는 함수임.
  // <IClassroomContext['searchData']>는 searchData의 속성의 타입을 가져온다.
  // return값은 void(아무것도 변하지 않음) -> interface할 때는 => void 필수.
  setSearchData: (params: Partial<IEquipmentContext['searchData']>) => void;
}
// 입력창에 검색을 한것(searchData)을 defaultValue에 저장할것임.
const defaultValue: IEquipmentContext = {
  searchData: {
    equipName: '',
    searchStDate: '',
    searchEdDate: '',
  },
  // setSearchData에 일단 빈 함수로 넣어둘것임.
  // 왜냐, 실제로는 ClassroomProvider에서 setSearchData를 넘겨주기 때문에
  // 그 전에는 빈 함수여야함.
  setSearchData: () => {},
};
// searchData: {title:'', personnel:''}이 담긴 defaultValue를 creatcontext를 사용해서 ClassroomContext(공용저장소)를 만들겠다.
export const EquipmentContext = createContext(defaultValue);

// 용도: <ClassroomProvider></ClassroomProvider>를 컴포넌트로 쓰겠다.
// FC = FunctionComponent
// searchData를 저장하게 하고, children component들이 searchData에 저장된 값을 사용하게 해주는 context provider(공급자) 역할로 사용할것이다.
export const EquipmentProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  // useState가 searchData에 defaultValue값을 저장함.
  // 저장된 값은 setSearchData함수로 값을 바꿀것임.
  const [searchData, setSearchData] = useState(defaultValue.searchData);

  //추후 확장이 가능하다.
  const updateSearchData = (
    // partial을 이용해 title or personnel 둘중에 하나만 받을 수 있음.
    params: Partial<IEquipmentContext['searchData']>
  ) => {
    // prev -> 현재 값, ...prev -> 기존 값 유지, ...parmas -> 덮어쓰기(params에 있는 값만 바뀜)
    // 기존 searchData를 유지하면서 일부만 바꾸겠다.
    setSearchData((prev) => ({ ...prev, ...params }));
  };

  return (
    <EquipmentContext.Provider // provider로 묶은 children에게 밑의 value값을 배포할것임.
      value={{ searchData, setSearchData: updateSearchData }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};
