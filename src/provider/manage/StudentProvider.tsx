import { createContext, useState, type FC } from 'react';

interface IStudentContext {
  searchData: {
    searchName: string;
    searchStatusYn: string;
    regStDate: string;
    regEdDate: string;
  };
  setSearchData: (params: Partial<IStudentContext['searchData']>) => void;
}

const defaultValue: IStudentContext = {
  searchData: {
    searchName: '',
    searchStatusYn: '',
    regStDate: '',
    regEdDate: '',
  },
  setSearchData: () => {},
};

export const StudentContext = createContext(defaultValue);

export const StudentProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [searchData, setSearchData] = useState(defaultValue.searchData);

  //추후 확장이 가능하다.
  const updateSearchData = (params: Partial<IStudentContext['searchData']>) => {
    setSearchData((prev) => ({ ...prev, ...params }));
  };

  return (
    <StudentContext.Provider
      value={{ searchData, setSearchData: updateSearchData }}
    >
      {children}
    </StudentContext.Provider>
  );
};
