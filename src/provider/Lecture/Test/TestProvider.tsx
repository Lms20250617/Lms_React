import { createContext, useState, type FC } from 'react';

interface ITestContext {
  searchData: {
    studentId: string;
    searchTag: 'lecName' | 'lecInstructorName' | 'lecRoomName';
    searchTitle: string;
    startDate: string;
    endDate: string;
  };
  setSearchData: (params: Partial<ITestContext['searchData']>) => void;
}

const defaultValue: ITestContext = {
  searchData: {
    studentId: '',
    searchTag: 'lecName',
    searchTitle: '',
    startDate: '',
    endDate: '',
  },
  setSearchData: () => {},
};

export const TestContext = createContext(defaultValue);

export const TestProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [searchData, setSearchData] = useState(defaultValue.searchData);

  //추후 확장이 가능하다.
  const updateSearchData = (params: Partial<ITestContext['searchData']>) => {
    setSearchData((prev) => ({ ...prev, ...params }));
  };

  return (
    <TestContext.Provider
      value={{ searchData, setSearchData: updateSearchData }}
    >
      {children}
    </TestContext.Provider>
  );
};
