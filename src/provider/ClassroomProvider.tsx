import { createContext, useState, type FC } from 'react';

interface IClassroomContext {
  searchData: {
    title: string;
    person: string;
  };
  setSearchData: (params: Partial<IClassroomContext['searchData']>) => void;
}

const defaultValue: IClassroomContext = {
  searchData: {
    title: '',
    person: '',
  },
  setSearchData: () => {},
};

export const ClassroomContext = createContext(defaultValue);

export const ClassroomProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [searchData, setSearchData] = useState(defaultValue.searchData);

  //추후 확장이 가능하다.
  const updateSearchData = (
    params: Partial<IClassroomContext['searchData']>
  ) => {
    setSearchData((prev) => ({ ...prev, ...params }));
  };

  return (
    <ClassroomContext.Provider
      value={{ searchData, setSearchData: updateSearchData }}
    >
      {children}
    </ClassroomContext.Provider>
  );
};
