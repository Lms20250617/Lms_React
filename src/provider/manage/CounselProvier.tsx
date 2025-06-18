import { createContext, useState, type FC } from "react";

interface ICounselContext {
    searchData: {
        searchTitle: string;
        startDate: string;
        endDate: string;
    };
    setSearchData: (params: Partial<ICounselContext['searchData']>) => void;
}

const defaultValue: ICounselContext = {
    searchData: {
        searchTitle: '',
        startDate: '',
        endDate: '',
    },
    setSearchData: () => {},
}

export const ICounselContext = createContext(defaultValue);

export const CounselProvider: FC<{
    children: React.ReactNode | React.ReactNode[]}
    > = ({ children }) => {

    const [searchData, setSearchData] = useState(defaultValue.searchData);

    //추후 확장이 가능하다.
    const updateSearchData = (params:Partial<ICounselContext['searchData']>) => {

        setSearchData((prev) => ({...prev, ...params}));
    }

    return (
        <ICounselContext.Provider 
            value={{ searchData, setSearchData: updateSearchData }}
        >
            {children}
        </ICounselContext.Provider>
    );
}

