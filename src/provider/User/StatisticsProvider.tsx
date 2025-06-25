import { createContext, useState, type FC } from 'react';

interface IStatisticsContext {
  searchData: {
    lectureName: string;
    lectureStartAround: string;
    lectureEndAround: string;
  };
  setSearchData: (params: Partial<IStatisticsContext['searchData']>) => void;
}

const defaultValue: IStatisticsContext = {
  searchData: {
    lectureName: '',
    lectureStartAround: '',
    lectureEndAround: '',
  },
  setSearchData: () => {},
};

export const StatisticsContext = createContext(defaultValue);

export const StatisticsProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [searchData, setSearchData] = useState(defaultValue.searchData);
  //추후 확장이 가능하다.
  const updateSearchData = (
    params: Partial<IStatisticsContext['searchData']>
  ) => {
    setSearchData((prev) => ({ ...prev, ...params }));
  };

  return (
    <StatisticsContext.Provider
      value={{ searchData, setSearchData: updateSearchData }}
    >
      {children}
    </StatisticsContext.Provider>
  );
};
