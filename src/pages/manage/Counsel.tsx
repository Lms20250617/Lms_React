import { ContentBox } from "../../components/common.componets/ContentBox/ContentBox"
import { CounselMain } from "../../components/common.componets/Manage/CounselMain/CounselMain"
import { CounselSearch } from "../../components/common.componets/Manage/CounselSearch/CounselSearch"
import { CounselProvider } from "../../provider/manage/CounselProvier"

export const Counsel = () => {
  return (
    <>
        <CounselProvider>
            <ContentBox>상담관리</ContentBox>
            <CounselSearch />
            <CounselMain />
        </CounselProvider>
    </>
  )
}
