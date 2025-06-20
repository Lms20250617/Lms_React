import { createContext, useState, type FC } from 'react';

interface IManageListContext {
  searchData: {
    searchTitle: string;
    searchStDate: string;
    searchEdDate: string;
    searchTag: string;
  };
  setSearchData: (params: Partial<IManageListContext['searchData']>) => void;
}

const defaultValue: IManageListContext = {
  searchData: {
    searchTitle: '',
    searchStDate: '',
    searchEdDate: '',
    searchTag: 'lecName',
  },
  setSearchData: () => {},
};

export const ManageListContext = createContext(defaultValue);

export const ManageListProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [searchData, setSearchData] = useState(defaultValue.searchData);

  //추후 확장이 가능하다.
  const updateSearchData = (
    params: Partial<IManageListContext['searchData']>
  ) => {
    setSearchData((prev) => ({ ...prev, ...params }));
  };

  return (
    <ManageListContext.Provider
      value={{ searchData, setSearchData: updateSearchData }}
    >
      {children}
    </ManageListContext.Provider>
  );
};
