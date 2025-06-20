import { useContext } from "react"
import { SurveyMangeContext } from "../../../../provider/support/SurveyManageProvider"

export const SurveyMangeSearch = () => {

  const {selectData ,setSelectData} = useContext(SurveyMangeContext);

  const handlerChange = (e: any) => {
    setSelectData(e.target.value);
  }


  return (
    <div>
        <div className="w-4/8 mx-auto mt-7 border border-gray-300 rounded-md">
        <div className="flex items-center justify-between px-3 py-1 bg-blue-200">
            <label className="text-base font-semibold text-gray-600">관리 항목</label>
            <select
            className="w-65 px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-300"
            onChange={(e) => {handlerChange(e)}}
            >
            <option value="">클릭해서 항목 선택</option>
            <option value="">설문 완료 목록 조회</option>
            <option value="">설문 결과 조회</option>
            </select>
        </div>
        </div>
    </div>
  )
}

