import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { SurveyContext } from "../../../../provider/support/SurveyProvider";

interface lectureType {
    lecId: number;
    lecName: string;
}


export const SurveySelect = () => {

  const [lecture, setLecture] = useState<lectureType[]>([]);

  const { selectData, setSelectData } = useContext(SurveyContext);
  const [selectValue, setselectValue] = useState('');

  useEffect(() => {
    if(selectData.success === 1){
      setSelectData({success:0});
    }else if(selectData.success === 0) {
      !selectData.lecId && initClassList();
    }

  },[selectData])
  
  const initClassList = () => {
    axios.post('/api/support/lecture-surveyJson').then((res) => {
        setLecture(res.data.lectures);
    })
  }

  const handlerChange = (e: any) => {
    const lecId = Number(e.target.value);
    setselectValue(e.target.value);
    setSelectData({lecId});
  }
  
  return (
    <div className="flex items-center justify-end mt-6 px-24">
        <label className="text-lg font-semibold text-gray-800">과목명 :</label>
        <select 
         className="w-64 border-2 border-gray-300 rounded-lg px-4 py-2 ml-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
         onChange={handlerChange}
         value={selectValue}
        >
          <option value="">과목</option>
        {
            lecture.map((lec) => {
                return(
                        <option key={lec.lecId} value={lec.lecId}>{lec.lecName}</option>
                )
            })
        }
         </select>

    </div>
  )
}
