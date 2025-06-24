import { ContentBox } from "../../components/common.componets/ContentBox/ContentBox"
import { SurveyMain } from "../../components/Support/Survey/SurveyMain/SurveyMain"
import { SurveySelect } from "../../components/Support/Survey/SurveySelect/SurveySelect"
import { SurveyProvider } from "../../provider/support/SurveyProvider"


export const Survey = () => {
  return (
    <div>
        <SurveyProvider>
            <ContentBox>설문조사</ContentBox>
            <SurveySelect />
            <SurveyMain />
        </SurveyProvider>
    </div>
  )
}
