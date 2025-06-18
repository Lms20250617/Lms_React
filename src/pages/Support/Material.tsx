import { ContentBox } from '../../components/common.componets/ContentBox/ContentBox'
import { MaterialMain } from '../../components/Support/Material/MaterialMain/MaterialMain'
import { MaterialSearch } from '../../components/Support/Material/MaterialSearch/MaterialSearch'
import { MaterialProvider } from '../../provider/support/MaterialProvier'

export const Material = () => {
  return (
    <>
        <MaterialProvider>
            <ContentBox>학습자료</ContentBox>
            <MaterialSearch />
            <MaterialMain />
        </MaterialProvider>
    </>
  )
}
