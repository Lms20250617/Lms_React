import { useRef, useState, type FC } from 'react';
import './styled.css';
import axios, { type AxiosResponse } from 'axios';

interface ISignupProps {
  id: number;
  reSearch: () => void;
}

interface IPostResponse {
  result: 'success' | 'fail';
}

export const SignupModal: FC<ISignupProps> = ({ id }) => {
  const [userType, setUserType] = useState('');
  const [loginId, setLoginId] = useState('');
  const [emailId, setEmailId] = useState('');
  const idInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  //---------------------------------------//

  const loginIdCheck = async () => {
    // (?=.*[a-z])	영문자가 하나 이상 포함
    // (?=.*[0-9])	숫자가 하나 이상 포함
    // [a-z0-9]{6,20}	영문자와 숫자로 이루어진 6~20자
    // ^ 문자열의 시작, $	문자열의 끝
    const idRules = /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]{6,20}$/;

    if (!loginId) {
      alert('아이디를 입력하세요.');
      return idInputRef.current?.focus();
    }

    if (!idRules.test(loginId)) {
      alert('아이디는 숫자,영문자 조합으로 6~20자리를 사용해야 합니다.');
      return idInputRef.current?.focus();
    }

    // db 확인 -> 중복o 사용중인 아이디입니다. 중복x 사용 가능한 아이디입니다.
    try {
      await axios
        .post('api/user/checkId', { loginId })
        .then((res: AxiosResponse<string>) => {
          console.log(res);
          const result = res.data;

          if (result === 'TRUE') {
            alert('사용 가능한 아이디입니다.');
          } else if (result === 'FALSE') {
            alert('이미 사용 중인 아이디입니다.');
            idInputRef.current?.focus();
          } else {
            alert('오류가 발생했습니다. 다시 시도해주세요.');
          }
        });
    } catch (error) {
      alert('서버 오류가 발생했습니다.');
    }
  };

  const emailCheck = async () => {
    const emailRules =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    if (!emailId) {
      alert('이메일을 입력해주세요.');
      return emailInputRef.current?.focus();
    }

    if (!emailRules.test(emailId)) {
      alert('이메일 형식을 확인해주세요.');
      return emailInputRef.current?.focus();
    }

    try {
      await axios
        .post('/user/checkEmail', { emailId })
        .then((res: AxiosResponse<string>) => {});
    } catch {}
  };

  return (
    <div className="modal-overlay">
      <dl>
        <form className="modal-form modal-container">
          <div className="border-line">
            <dt className="border-line mx-10 my-5 bg-blue-300/60 p-8 text-center text-3xl font-bold">
              회원가입
            </dt>

            <dd>
              <table className="border-line mx-10 mb-8">
                <tbody>
                  <tr className="text-center">
                    <th className="border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        아이디
                      </span>
                    </th>
                    <td className="border-line px-5 py-3">
                      <input
                        type="text"
                        id="registerId"
                        name="loginId"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        ref={idInputRef}
                        placeholder=""
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="border-line px-5 py-3">
                      <button
                        type="button"
                        onClick={loginIdCheck}
                        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white shadow-md transition duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none active:bg-blue-700"
                      >
                        중복확인
                      </button>
                    </td>
                    <th className="border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        주소
                      </span>
                    </th>
                    <td className="border-line px-5 py-3">
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option value="">도/광역시 선택</option>
                        <option value="서울특별시">서울특별시</option>
                        <option value="전라남도">전라남도</option>
                        <option value="경기도">경기도</option>
                        <option value="부산광역시">부산광역시</option>
                        <option value="대구광역시">대구광역시</option>
                        <option value="인천광역시">인천광역시</option>
                      </select>
                    </td>
                  </tr>
                  <tr className="text-center">
                    <th className="border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        이메일
                      </span>
                    </th>
                    <td className="border-line px-5 py-3">
                      <input
                        type="email"
                        id="registerEmail"
                        name="email"
                        value={emailId}
                        onChange={(e) => setEmailId(e.target.value)}
                        ref={emailInputRef}
                        placeholder="HappyJob@example.com"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="border-line px-5 py-3">
                      <button
                        type="button"
                        onClick={emailCheck}
                        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white shadow-md transition duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none active:bg-blue-700"
                      >
                        중복확인
                      </button>
                    </td>
                    <th className="border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        회원 유형
                      </span>
                    </th>
                    <td className="border-line px-5 py-3">
                      <select
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        name="userType"
                        id="userType"
                        onChange={(e) => setUserType(e.target.value)}
                      >
                        <option value="">선택하세요</option>
                        <option value="S">학생</option>
                        <option value="T">강사</option>
                      </select>
                    </td>
                  </tr>
                  <tr className={userType === 'T' ? '' : 'hidden'}>
                    <th className="border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        계좌번호
                      </span>
                    </th>
                    <td className="border-line px-5 py-3" colSpan={2}>
                      <input
                        type="text"
                        id="registerId"
                        name="loginId"
                        placeholder=""
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <th className="border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        은행명
                      </span>
                    </th>
                    <td className="border-line px-5 py-3">
                      <select
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        name="userType"
                        id="userType"
                        onChange={(e) => setUserType(e.target.value)}
                      >
                        <option value="">선택하세요</option>
                        <option value="신한은행">신한은행</option>
                        <option value="우리은행">우리은행</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th className="border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        이름
                      </span>
                    </th>
                    <td className="border-line px-5 py-3" colSpan={2}>
                      <input
                        type="text"
                        id="registerId"
                        name="loginId"
                        placeholder=""
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <th className="border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        성별
                      </span>
                    </th>
                    <td className="border-line px-5 py-3">
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option value="">선택하세요</option>
                        <option value="남성">남성</option>
                        <option value="여성">여성</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th className="border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        비밀번호
                      </span>
                    </th>
                    <td colSpan={2} className="border-line px-5 py-3">
                      <input
                        type="password"
                        id="registerId"
                        name="loginId"
                        placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <th className="border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        전화번호
                      </span>
                    </th>
                    <td className="border-line px-5 py-3" colSpan={2}>
                      <input
                        type="text"
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9]/g,
                            ''
                          );
                        }}
                        id="registerId"
                        name="loginId"
                        placeholder="000-0000-0000"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        비밀번호 확인
                      </span>
                    </th>
                    <td colSpan={2} className="border-line px-5 py-3">
                      <input
                        type="password"
                        id="registerId"
                        name="loginId"
                        placeholder="다시 한 번 입력해주세요."
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <th className="border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        생년월일
                      </span>
                    </th>
                    <td className="border-line px-5 py-3" colSpan={2}>
                      <input
                        type="date"
                        id="registerId"
                        name="loginId"
                        placeholder=""
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                  </tr>
                </tbody>
                {/* <label>
          <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*'] ...">
            Email
          </span>
          <input
            type="email"
            name="email"
            className="..."
            placeholder="you@example.com"
          />
        </label> */}
              </table>
            </dd>
          </div>
        </form>
      </dl>
    </div>
  );
};
