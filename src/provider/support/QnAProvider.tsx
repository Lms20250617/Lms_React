import { createContext, useState, type FC } from 'react';

interface QnAContext {
  searchData: {
    title?: string;
    writer?: string;
  };
  setSearchData: (params: Partial<QnAContext['searchData']>) => void;
}

const defaultValue: QnAContext = {
  searchData: {},
  setSearchData: () => {},
};

export const QnAContext = createContext(defaultValue);

export const QnAProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [searchData, setSearchData] = useState(defaultValue.searchData);

  //추후 확장이 가능하다.
  const updateSearchData = (params: Partial<QnAContext['searchData']>) => {
    setSearchData((prev) => ({ ...prev, ...params }));
  };

  return (
    <QnAContext.Provider
      value={{ searchData, setSearchData: updateSearchData }}
    >
      {children}
    </QnAContext.Provider>
  );
};
