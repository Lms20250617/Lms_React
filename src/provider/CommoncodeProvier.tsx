import { createContext, useState, type FC } from "react";

interface CommonCodeContext {
    searchData: {
            commonGroup:string;
            groupCode:string;
            detailCode:string;

    };
    SetSearchData: (params: Partial<CommonCodeContext['searchData']>) => void;
}

const defaultValue: CommonCodeContext = {
    searchData: {
            commonGroup:'',
            groupCode:'',
            detailCode:'',
    },
    SetSearchData: () => {},
}

export const CommonCodeContext = createContext(defaultValue);

export const CommonCodeContextProvider: FC<{
    children: React.ReactNode | React.ReactNode[]}
    > = ({ children }) => {

    const [searchData, setSelectData] = useState(defaultValue.searchData);

    //추후 확장이 가능하다.
    const updateSearchData = (params:Partial<CommonCodeContext['searchData']>) => {

        setSelectData((prev) => ({...prev, ...params}));
    }

    return (
        <CommonCodeContext.Provider 
            value={{ searchData, SetSearchData: updateSearchData }}
        >
            {children}
        </CommonCodeContext.Provider>
    );
}

