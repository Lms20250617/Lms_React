import { createContext, useState, type FC } from "react";

interface MaterialContext {
    searchData: {
        title: string;
        writer: string;
        startDate: string;
        endDate: string;
    };
    setSearchData: (params: Partial<MaterialContext['searchData']>) => void;
}

const defaultValue: MaterialContext = {
    searchData: {
        title: '',
        writer:'',
        startDate: '',
        endDate: '',
    },
    setSearchData: () => {},
}

export const MaterialContext = createContext(defaultValue);

export const MaterialProvider: FC<{
    children: React.ReactNode | React.ReactNode[]}
    > = ({ children }) => {

    const [searchData, setSearchData] = useState(defaultValue.searchData);

    //추후 확장이 가능하다.
    const updateSearchData = (params:Partial<MaterialContext['searchData']>) => {

        setSearchData((prev) => ({...prev, ...params}));
    }

    return (
        <MaterialContext.Provider 
            value={{ searchData, setSearchData: updateSearchData }}
        >
            {children}
        </MaterialContext.Provider>
    );
}

