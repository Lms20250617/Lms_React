import { createContext, useState, type FC } from 'react';

interface IResumeContext {
  searchData: {
    lecName: string;
    lectureStartRound: string;
    lectureEndRound: string;
  };
  setSearchData: (params: Partial<IResumeContext['searchData']>) => void;
}

const defaultValue: IResumeContext = {
  searchData: {
    lecName: '',
    lectureStartRound: '',
    lectureEndRound: '',
  },
  setSearchData: () => {},
};

export const ResumeContext = createContext(defaultValue);

export const ResumeProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [searchData, setSearchData] = useState(defaultValue.searchData);
  //추후 확장이 가능하다.
  const updateSearchData = (params: Partial<IResumeContext['searchData']>) => {
    setSearchData((prev) => ({ ...prev, ...params }));
  };

  return (
    <ResumeContext.Provider
      value={{ searchData, setSearchData: updateSearchData }}
    >
      {children}
    </ResumeContext.Provider>
  );
};
