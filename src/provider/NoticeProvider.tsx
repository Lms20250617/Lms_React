import { createContext, useState, type FC } from "react";

interface INoticeContext {
    searchData: {
        title: string;
        startDate: string;
        endDate: string;
    };
    setSearchData: (params: Partial<INoticeContext['searchData']>) => void;
}

const defaultValue: INoticeContext = {
    searchData: {
        title: '',
        startDate: '',
        endDate: '',
    },
    setSearchData: () => {},
}

export const NoticeContext = createContext(defaultValue);

export const NoticeProvider: FC<{
    children: React.ReactNode | React.ReactNode[]}
    > = ({ children }) => {

    const [searchData, setSearchData] = useState(defaultValue.searchData);

    //추후 확장이 가능하다.
    const updateSearchData = (params:Partial<INoticeContext['searchData']>) => {

        setSearchData((prev) => ({...prev, ...params}));
    }

    return (
        <NoticeContext.Provider 
            value={{ searchData, setSearchData: updateSearchData }}
        >
            {children}
        </NoticeContext.Provider>
    );
}

