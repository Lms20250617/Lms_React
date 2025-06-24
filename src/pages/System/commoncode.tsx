import { ContentBox } from "../../components/common.componets/ContentBox/ContentBox";
import { CommoncodeMain } from "../../components/System/commoncodeMain/CommoncodeMain";
import { CommoncodeSearch } from "../../components/System/commoncodeSearch/CommoncodeSearch";
import { CommonCodeContextProvider } from "../../provider/CommoncodeProvier";


export const commoncode = () => {


  return (
    <>
        <CommonCodeContextProvider>
            <ContentBox>공통코드</ContentBox>
            <CommoncodeSearch />
            <CommoncodeMain />
        </CommonCodeContextProvider>
    </>
  )

}

