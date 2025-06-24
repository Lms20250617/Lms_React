import { createContext, useState, type FC } from 'react';

interface ICompanyContext {
  searchData: {
    companyName: string;
    searchStDate: string;
    searchEdDate: string;
  };
  setSearchData: (params: Partial<ICompanyContext['searchData']>) => void;
}

const defaultValue: ICompanyContext = {
  searchData: {
    companyName: '',
    searchStDate: '',
    searchEdDate: '',
  },
  setSearchData: () => {},
};

export const CompanyContext = createContext(defaultValue);

export const CompanyProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [searchData, setSearchData] = useState(defaultValue.searchData);

  //추후 확장이 가능하다.
  const updateSearchData = (params: Partial<ICompanyContext['searchData']>) => {
    setSearchData((prev) => ({ ...prev, ...params }));
  };

  return (
    <CompanyContext.Provider
      value={{ searchData, setSearchData: updateSearchData }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
