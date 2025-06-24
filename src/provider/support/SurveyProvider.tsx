import { createContext, useState, type FC } from "react";

interface SurveyContext {
    selectData: {
        lecId: number;
        success: number;
    };
    setSelectData: (params: Partial<SurveyContext['selectData']>) => void;
}

const defaultValue: SurveyContext = {
    selectData: {
        lecId: 0,
        success: 0
    },
    setSelectData: () => {},
}

export const SurveyContext = createContext(defaultValue);

export const SurveyProvider: FC<{
    children: React.ReactNode | React.ReactNode[]}
    > = ({ children }) => {

    const [selectData, setSelectData] = useState(defaultValue.selectData);

    //추후 확장이 가능하다.
    const updateSearchData = (params:Partial<SurveyContext['selectData']>) => {

        setSelectData((prev) => ({...prev, ...params}));
    }

    return (
        <SurveyContext.Provider 
            value={{ selectData, setSelectData: updateSearchData }}
        >
            {children}
        </SurveyContext.Provider>
    );
}

