import { useContext, useEffect, useState } from "react";
import { SurveyContext } from "../../../../provider/support/SurveyProvider";
import axios from "axios";

export const SurveyMain = () => {

  const { selectData, setSelectData } = useContext(SurveyContext);
  //질문을 담아줄 배열 
  const [question, setQuestion] = useState<string[]>([]);

  //현재 문항이 몇번째 인지 담아줄 변수 
  const [currentIdx, setCurrentIdx] = useState(0);

  const SurveyView = ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음'];

  //체크 박스 값을 담을 리스트를 만들고 값을 저장해서 버튼 이동 시에도 사라지지 않게 구현 

  //Array(question.length).fill(null) 인덱스에 직접 값을 넣어야되는데 인덱스 자체가 없을 수 있기 떄문에
  //인덱스를 미리 만들어준다.
  const [selectedAnswers, setSelectedAnswers] = useState<(number)[]>(
    () => Array(question.length).fill(null)
  );

  //값이 바뀌면 저장 
  const handleOptionChange = (value: number) => {
    const updated = [...selectedAnswers];
    updated[currentIdx] = value;
    setSelectedAnswers(updated);
  };

  //다음 버튼 
  //체크 박스가 클릭 안되 있을 시 에 다음 버튼 못가게 
  const handleNext = () => {
    if (currentIdx < question.length - 1) {

      const checked = document.querySelector(`input[name="rating-${currentIdx}"]:checked`);

      if (!checked) {
        alert("항목을 선택해주세요.");
        return;
      }

      setCurrentIdx(prev => prev + 1);
    }
  };

  //이전 버튼 
  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  //완료 제출 하기 
  const handleSubmit = () => {

      const checked = document.querySelector(`input[name="rating-${currentIdx}"]:checked`);

      if (!checked) {
        alert("항목을 선택해주세요.");
        return;
      }

      // checked value를 직접 추출해서 완료하기 
      // handleOptionChange()바뀌는 것과 완료도 제출하는 둘다 비동기 떄문에 
      // handleOptionChange가 늦을 경우 undefined로 들어가게 되어서 수정 
      const currentValue = Number((checked as HTMLInputElement).value);
      const updated = [...selectedAnswers];
      updated[currentIdx] = currentValue;

      for(let i=1; i<=question.length; i++){
        saveSurvey(i,updated[i-1]);
      }

      setSelectData({success: 1});
      alert('설문이 완료되엇습니다.');

  };

  //설문 저장하기 
  const saveSurvey = (id:number, surveyResult:number) => {

    const param = {
          surveyId : id.toString(),
					surveyResult : surveyResult.toString(),
					lecId : selectData.lecId.toString(),
    }

    const searchParams = new URLSearchParams(param);

    axios.post('/api/support/saveResult.do', searchParams).then((res) => {
      
    })
  }

  //처음에 SELECT 값이 바뀌면 실행 되는 init
  const initSurvey = (id:number) => {

     const lecData =  {
      lecId : id.toString()
    };

    const param = new URLSearchParams(lecData);

    axios.post('/api/support/getSurveyContents.do',param).then((res) => {
      setQuestion(res.data);
    })
  }

  useEffect(()=>{
    //id 값이 있을 경우만 실행 
    // selectData.success !== 1 준 이유는 
    // 완료되었을때 1 -> 0으로 바꿔줄건데 그럼 두번 실행됨 이게 
    if(selectData.lecId && selectData.success !== 1) {

      initSurvey(selectData.lecId);

      //다른 설문조사 갔을때 기존의 설문조사 값 초기화 
      setSelectedAnswers([]);
      //설문 페이지 초기화 0번으로 
      setCurrentIdx(0);
    }
  },[selectData])


  return (
    <>
     {
      selectData.lecId == 0 || question.length == 0
      ?
      (
      <div className="flex items-center justify-start mt-3 px-22">
        <div className="border border-gray-300 rounded-md p-6 w-[750px] bg-white mt-3">
        <h2 className="text-base font-bold mb-6">설문조사</h2>

          {
            question.length !== 0 || selectData.lecId == 0 ?
            (
            <p className="text-sm font-bold mb-10">  
              먼저 강의를 선택해주세요.
            </p>  
            )
            :
            (
            <p className="text-sm font-bold mb-10">  
              완료된 설문 입니다.
            </p> 
            )
          }
        
        <div className="flex gap-2">
          <button
            className='px-3 py-1.5 border rounded transition text-gray-500 bg-gray-100 border-gray-300 cursor-not-allowed'
            disabled={selectData.lecId == 0}
          >
            이전
          </button>
          <button
            className='px-3 py-1.5 border rounded transition text-gray-500 bg-gray-100 border-gray-300 cursor-not-allowed'
            disabled={selectData.lecId == 0}
          >
            다음
          </button>
        </div>
        </div>
      </div>  

        )
        :
        (
          <>
                {question.map((que, idx) => {
                  if (idx !== currentIdx) return null;

                  return (
                    <div className="flex items-center justify-start mt-3 px-20" key={idx}>
                    <div
                      className="border border-gray-300 rounded-md p-6 w-7/8 bg-white  mt-3"
                    >
                      <h2 className="text-base font-bold mb-6">설문조사</h2>
                      <p className="text-sm font-bold mb-10">{`${idx + 1}. ${que}`}</p>
                      <div className="flex space-x-6 mb-6">
                        {SurveyView.map((label, i) => (
                          <label key={i} className="flex items-center space-x-1">
                            <input
                              type="radio"
                              name={`rating-${idx}`}
                              value={i + 1}
                              className="form-radio text-blue-500"
                              checked={selectedAnswers[currentIdx] === i + 1}
                              onChange={() => handleOptionChange(i + 1)}
                            />
                            <span>{label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handlePrev}
                          className={`px-3 py-1.5 border rounded transition 
                            ${currentIdx === 0
                              ? 'text-gray-500 bg-gray-100 border-gray-300 cursor-not-allowed'
                              : 'text-white bg-blue-500 border-blue-500 hover:bg-blue-600 cursor-pointer'}`}
                          disabled={currentIdx === 0}
                        >
                          이전
                        </button>
                        {
                          currentIdx !== question.length - 1 ?
                          (
                            <button
                              onClick={handleNext}
                              className={`px-3 py-1.5 border rounded transition 
                                ${currentIdx === question.length - 1
                                  ? 'text-gray-500 bg-gray-100 border-gray-300 cursor-not-allowed'
                                  : 'text-white bg-blue-500 border-blue-500 hover:bg-blue-600 cursor-pointer'}`}

                            >
                              다음
                            </button>
                          )
                          :
                          (
                          <button
                          className= 'px-3 py-1.5 border rounded transition text-white bg-blue-500 border-blue-500 hover:bg-blue-600 cursor-pointer'
                          onClick={handleSubmit}
                          >
                            완료
                          </button>
                          )
                        }

                      </div>
                    </div>
                    </div>
                  );
                })}
              </>
        )
    }
    </>
  )
}

