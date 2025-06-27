import { createContext, useState, type FC } from 'react';

interface RecruitContext {
  searchData: {
    studentName: string;
    searchStDate: string;
    searchEdDate: string;
  };
  setSearchData: (params: Partial<RecruitContext['searchData']>) => void;
}

const defaultValue: RecruitContext = {
  searchData: {
    studentName: '',
    searchStDate: '',
    searchEdDate: '',
  },
  setSearchData: () => {},
};

export const RecruitContext = createContext(defaultValue);

export const RecruitProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [searchData, setSearchData] = useState(defaultValue.searchData);

  //추후 확장이 가능하다.
  const updateSearchData = (params: Partial<RecruitContext['searchData']>) => {
    setSearchData((prev) => ({ ...prev, ...params }));
  };

  return (
    <RecruitContext.Provider
      value={{ searchData, setSearchData: updateSearchData }}
    >
      {children}
    </RecruitContext.Provider>
  );
};
