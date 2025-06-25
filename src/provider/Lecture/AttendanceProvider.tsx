import { createContext, useState, type FC } from 'react';

interface IAttendanceContext {
  searchData: {
    lecName: string;
    startDate: string;
    endDate: string;
  };
  setSearchData: (params: Partial<IAttendanceContext['searchData']>) => void;
}

const defaultValue: IAttendanceContext = {
  searchData: {
    lecName: '',
    startDate: '',
    endDate: '',
  },
  setSearchData: () => {},
};

export const AttendanceContext = createContext(defaultValue);

export const AttendanceProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [searchData, setSearchData] = useState(defaultValue.searchData);

  //추후 확장이 가능하다.
  const updateSearchData = (
    params: Partial<IAttendanceContext['searchData']>
  ) => {
    setSearchData((prev) => ({ ...prev, ...params }));
  };

  return (
    <AttendanceContext.Provider
      value={{ searchData, setSearchData: updateSearchData }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};
