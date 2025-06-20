import { ContentBox } from "../../components/common.componets/ContentBox/ContentBox"
import { SurveyManageMain } from "../../components/Support/SurveyManage/SurveyManageMain/SurveyManageMain"
import { SurveyMangeSearch } from "../../components/Support/SurveyManage/SurveyManageSearch/SurveyMangeSearch"
import { SurveyManageProvider } from "../../provider/support/SurveyManageProvider"


export const SurveyManage = () => {
  return (
    <>
      <SurveyManageProvider>
        <ContentBox>설문조사관리</ContentBox>
        <SurveyMangeSearch />
        <SurveyManageMain />
      </SurveyManageProvider>

    </>

  )
}

