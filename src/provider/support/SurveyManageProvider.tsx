import { createContext, useState, type FC } from "react";

interface SurveyMangeContext {
    selectData: {
        result: number;
    };
    setSelectData: (params: Partial<SurveyMangeContext['selectData']>) => void;
}

const defaultValue: SurveyMangeContext = {
    selectData: {
        result: 0
    },
    setSelectData: () => {},
}

export const SurveyMangeContext = createContext(defaultValue);

export const SurveyManageProvider: FC<{
    children: React.ReactNode | React.ReactNode[]}
    > = ({ children }) => {

    const [selectData, setSelectData] = useState(defaultValue.selectData);

    //추후 확장이 가능하다.
    const updateSearchData = (params:Partial<SurveyMangeContext['selectData']>) => {

        setSelectData((prev) => ({...prev, ...params}));
    }

    return (
        <SurveyMangeContext.Provider 
            value={{ selectData, setSelectData: updateSearchData }}
        >
            {children}
        </SurveyMangeContext.Provider>
    );
}

