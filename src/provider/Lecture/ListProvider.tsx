import { createContext, useState, type FC } from 'react';

interface IListContext {
  searchData: {
    searchTitle: string;
    searchStDate: string;
    searchEdDate: string;
    searchTag: string;
  };
  setSearchData: (params: Partial<IListContext['searchData']>) => void;
}

const defaultValue: IListContext = {
  searchData: {
    searchTitle: '',
    searchStDate: '',
    searchEdDate: '',
    searchTag: 'lecName',
  },
  setSearchData: () => {},
};

export const ListContext = createContext(defaultValue);

export const ListProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [searchData, setSearchData] = useState(defaultValue.searchData);

  //추후 확장이 가능하다.
  const updateSearchData = (params: Partial<IListContext['searchData']>) => {
    setSearchData((prev) => ({ ...prev, ...params }));
  };

  return (
    <ListContext.Provider
      value={{ searchData, setSearchData: updateSearchData }}
    >
      {children}
    </ListContext.Provider>
  );
};
