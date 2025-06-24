import { createContext, useState, type FC } from 'react';

interface ITutorContext {
  searchData: {
    searchName: string;
    searchStatusYn: string;
    regStDate: string;
    regEdDate: string;
  };
  setSearchData: (params: Partial<ITutorContext['searchData']>) => void;
}

const defaultValue: ITutorContext = {
  searchData: {
    searchName: '',
    searchStatusYn: '',
    regStDate: '',
    regEdDate: '',
  },
  setSearchData: () => {},
};

export const TutorContext = createContext(defaultValue);

export const TutorProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [searchData, setSearchData] = useState(defaultValue.searchData);

  //추후 확장이 가능하다.
  const updateSearchData = (params: Partial<ITutorContext['searchData']>) => {
    setSearchData((prev) => ({ ...prev, ...params }));
  };

  return (
    <TutorContext.Provider
      value={{ searchData, setSearchData: updateSearchData }}
    >
      {children}
    </TutorContext.Provider>
  );
};
