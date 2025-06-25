import { createContext, useState, type FC } from 'react';

interface ITestInfoContext {
  searchData: {
    searchTag: 'lecName' | 'lecInstructorName' | 'lecRoomName';
    searchTitle: string;
    startDate: string;
    endDate: string;
  };
  setSearchData: (params: Partial<ITestInfoContext['searchData']>) => void;
}

const defaultValue: ITestInfoContext = {
  searchData: {
    searchTag: 'lecName',
    searchTitle: '',
    startDate: '',
    endDate: '',
  },
  setSearchData: () => {},
};

export const TestInfoContext = createContext(defaultValue);

export const TestInfoProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [searchData, setSearchData] = useState(defaultValue.searchData);

  //추후 확장이 가능하다.
  const updateSearchData = (
    params: Partial<ITestInfoContext['searchData']>
  ) => {
    setSearchData((prev) => ({ ...prev, ...params }));
  };

  return (
    <TestInfoContext.Provider
      value={{ searchData, setSearchData: updateSearchData }}
    >
      {children}
    </TestInfoContext.Provider>
  );
};
