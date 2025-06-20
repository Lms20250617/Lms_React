import { useRef, useState, type FC } from 'react';
import './styled.css';
import axios, { type AxiosResponse } from 'axios';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';

interface ISignupProps {
  reSearch: () => void;
}

export const SignupModal: FC<ISignupProps> = ({ reSearch }) => {
  const [modal, setModal] = useRecoilState(modalState);
  const formRef = useRef<HTMLFormElement>();
  const idInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [anotherPassword, setAnotherPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [sex, setSex] = useState('');
  const [birthday, setBirthday] = useState('');
  const [tel, setTel] = useState('');
  const [userType, setUserType] = useState('');
  const [insAccount, setInsAccount] = useState('');
  const [insBank, setInsBank] = useState('');
  const [idAvailable, setIdAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  //---------------------------------------//

  const closeModal = () => {
    setModal({ isOpen: false });
  };

  // 회원가입 유효성 검사
  const validateForm = () => {
    // 패스워드 정규식 (숫자, 영문자, 특수문자 조합으로 8~15자리)
    const passwordRules =
      /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

    // 전화번호 정규식
    const telRules = /^\d{8,11}$/;

    // 이름 정규식
    const nameRules = /^[가-힣a-zA-Z]{2,20}$/;

    if (!idAvailable) {
      alert('아이디 중복확인을 해주세요.');
      return false;
    }

    if (!emailAvailable) {
      alert('이메일 중복확인을 해주세요.');
      return false;
    }

    if (!nameRules.test(name.trim())) {
      alert('이름은 한글 또는 영문 2자 이상이어야 합니다.');
      console.log(name);
      return false;
    }

    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return false;
    }

    if (!passwordRules.test(password)) {
      alert(
        '비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다.'
      );
      return false;
    }

    if (!anotherPassword) {
      alert('비밀번호를 한 번 더 입력해주세요.');
      return false;
    }

    if (!(password === anotherPassword)) {
      alert('비밀번호가 같지 않습니다.');
      return false;
    }

    if (address === '') {
      alert('주소를 선택해주세요.');
      return false;
    }

    if (userType === '') {
      alert('회원유형을 선택해주세요.');
      return false;
    }

    if (userType === 'T') {
      if (insAccount === '') {
        alert('계좌번호를 입력해주세요.');
        return false;
      } else if (insBank === '') {
        alert('은행명을 선택해주세요.');
        return false;
      }
    }

    if (sex === '') {
      alert('성별을 선택해주세요.');
      return false;
    }

    if (tel === '') {
      alert('연락처를 입력해주세요.');
      return false;
    }

    if (!telRules.test(tel)) {
      alert('연락처는 8~11자리 숫자로 나타내 주세요.');
      return false;
    }

    if (birthday === '') {
      alert('생년월일을 입력해주세요.');
      return false;
    }
    return true;
  };

  const completeRegister = async () => {
    if (!validateForm()) {
      return;
    }

    const formData = new FormData(formRef.current);
    formData.append('loginId', loginId);
    formData.append('email', email);
    formData.append('name', name);
    formData.append('password', password);
    formData.append('anotherPassword', anotherPassword);
    formData.append('loc', address);
    formData.append('userType', userType);
    formData.append('sex', sex);
    formData.append('hp', tel);
    formData.append('birthday', birthday);
    if (userType === 'T') {
      formData.append('insAccount', insAccount);
      formData.append('insBank', insBank);
    }
    await axios
      .post('api/user/register', formData)
      .then((res: AxiosResponse<'SUCCESS' | 'FAIL'>) => {
        const result = res.data;

        if (result === 'SUCCESS') {
          alert('회원가입이 완료 되었습니다.');
          setModal({ isOpen: false });
          reSearch();
        } else if (result === 'FAIL') {
          alert('회원가입 중 오류가 발생했습니다.');
        }
      });
  };

  const loginIdCheck = async () => {
    // (?=.*[a-z])	영문자가 하나 이상 포함
    // (?=.*[0-9])	숫자가 하나 이상 포함
    // [a-z0-9]{6,20}	영문자와 숫자로 이루어진 6~20자
    // ^ 문자열의 시작, $	문자열의 끝
    const idRules = /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]{6,20}$/;

    if (!loginId) {
      alert('아이디를 입력하세요.');
      setIdAvailable(null);
      return idInputRef.current?.focus();
    }

    if (!idRules.test(loginId)) {
      alert('아이디는 숫자,영문자 조합으로 6~20자리를 사용해야 합니다.');
      setIdAvailable(false);
      return idInputRef.current?.focus();
    }
    const param = new URLSearchParams();
    param.append('loginId', loginId);

    // db 확인 -> 중복o 사용중인 아이디입니다. 중복x 사용 가능한 아이디입니다.
    try {
      await axios
        .post('api/user/checkBodyId.do', param)
        .then((res: AxiosResponse<string>) => {
          const result = res.data;
          console.log(result);
          if (result === 'TRUE') {
            alert('사용 가능한 아이디입니다.');
            setIdAvailable(true);
          } else if (result === 'FALSE') {
            alert('이미 사용 중인 아이디입니다.');
            setIdAvailable(false);
            idInputRef.current?.focus();
          } else {
            alert('오류가 발생했습니다. 다시 시도해주세요.');
            setIdAvailable(null);
          }
        });
    } catch (error) {
      alert('서버 오류가 발생했습니다.');
    }
  };

  const emailCheck = async () => {
    const emailRules =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    if (!email) {
      alert('이메일을 입력해주세요.');
      setEmailAvailable(null);
      return emailInputRef.current?.focus();
    }

    if (!emailRules.test(email)) {
      alert('이메일 형식을 확인해주세요.');
      setEmailAvailable(false);
      return emailInputRef.current?.focus();
    }
    const param = new URLSearchParams();
    param.append('email', email);

    // checkEmail.do로 맞췄는데, 변경하려면 백엔드도 변경 필요
    try {
      await axios
        .post('api/user/checkEmail', param)
        .then((res: AxiosResponse<string>) => {
          const result = res.data;
          console.log(result);

          if (result === 'FALSE') {
            alert('이미 사용중인 이메일입니다.');
            setEmailAvailable(false);
            return emailInputRef.current?.focus();
          } else if (result === 'TRUE') {
            alert('사용가능한 이메일입니다.');
            setEmailAvailable(true);
          } else {
            alert('오류가 발생했습니다. 다시 시도해주세요');

            setEmailAvailable(null);
          }
        });
    } catch (error) {
      alert('서버 오류가 발생했습니다.');
      setEmailAvailable(null);
    }
  };

  return (
    <div className="signup-modal-overlay">
      <dl>
        <form className="modal-form signup-modal-container">
          <div className="signup-border-line rounded-lg">
            <dt className="signup-border-line mx-10 my-5 rounded-lg bg-blue-300/60 p-8 text-center text-3xl font-bold">
              회원가입
            </dt>

            <dd>
              <table className="signup-border-line mx-10 mb-4">
                <tbody>
                  <tr className="text-center">
                    <th className="signup-border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        아이디
                      </span>
                    </th>
                    <td className="signup-border-line px-5 py-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          id="registerId"
                          name="loginId"
                          value={loginId}
                          onChange={(e) => {
                            setLoginId(e.target.value);
                            setIdAvailable(null);
                          }}
                          ref={idInputRef}
                          placeholder=""
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {idAvailable === true && (
                          <span className="text-lg text-green-500">✔</span>
                        )}
                        {idAvailable === false && (
                          <span className="text-lg text-red-500">❌</span>
                        )}
                      </div>
                    </td>

                    <td className="signup-border-line px-5 py-3">
                      <button
                        type="button"
                        onClick={loginIdCheck}
                        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white shadow-md transition duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none active:bg-blue-700"
                      >
                        중복확인
                      </button>
                    </td>
                    <th className="signup-border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        주소
                      </span>
                    </th>
                    <td className="signup-border-line px-5 py-3">
                      <select
                        id="province_cd"
                        name="loc"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
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
                    <th className="signup-border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        이메일
                      </span>
                    </th>
                    <td className="signup-border-line px-5 py-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="email"
                          id="registerEmail"
                          name="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailAvailable(null);
                          }}
                          ref={emailInputRef}
                          placeholder="HappyJob@example.com"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {emailAvailable === true && (
                          <span className="text-lg text-green-500">✔</span>
                        )}
                        {emailAvailable === false && (
                          <span className="text-lg text-red-500">❌</span>
                        )}
                      </div>
                    </td>
                    <td className="signup-border-line px-5 py-3">
                      <button
                        type="button"
                        onClick={emailCheck}
                        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white shadow-md transition duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none active:bg-blue-700"
                      >
                        중복확인
                      </button>
                    </td>
                    <th className="signup-border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        회원 유형
                      </span>
                    </th>
                    <td className="signup-border-line px-5 py-3">
                      <select
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        name="userType"
                        id="userType"
                        value={userType}
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
                    <td className="signup-border-line px-5 py-3" colSpan={2}>
                      <input
                        type="text"
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9]/g,
                            ''
                          );
                        }}
                        id="account_number"
                        name="insAccount"
                        value={insAccount}
                        onChange={(e) => setInsAccount(e.target.value)}
                        placeholder=""
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <th className="signup-border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        은행명
                      </span>
                    </th>
                    <td className="signup-border-line px-5 py-3">
                      <select
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        name="insBank"
                        id="insBank"
                        value={insBank}
                        onChange={(e) => setInsBank(e.target.value)}
                      >
                        <option value="">선택하세요</option>
                        <option value="신한은행">신한은행</option>
                        <option value="우리은행">우리은행</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th className="signup-border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        이름
                      </span>
                    </th>
                    <td className="signup-border-line px-5 py-3" colSpan={2}>
                      <input
                        type="text"
                        id="registerId"
                        name="loginId"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder=""
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <th className="signup-border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        성별
                      </span>
                    </th>
                    <td className="signup-border-line px-5 py-3">
                      <select
                        name="sex"
                        id="gender_cd"
                        value={sex}
                        onChange={(e) => setSex(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="">선택하세요</option>
                        <option value="남성">남성</option>
                        <option value="여성">여성</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th className="signup-border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        비밀번호
                      </span>
                    </th>
                    <td colSpan={2} className="signup-border-line px-5 py-3">
                      <input
                        type="password"
                        id="registerPwd"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <th className="signup-border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        연락처
                      </span>
                    </th>
                    <td className="signup-border-line px-5 py-3" colSpan={2}>
                      <input
                        type="text"
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9]/g,
                            ''
                          );
                        }}
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                        placeholder="000-0000-0000"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="signup-border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        비밀번호 확인
                      </span>
                    </th>
                    <td colSpan={2} className="border-line px-5 py-3">
                      <input
                        type="password"
                        id="registerPwdOk"
                        name="password1"
                        value={anotherPassword}
                        onChange={(e) => setAnotherPassword(e.target.value)}
                        placeholder="다시 한 번 입력해주세요."
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <th className="signup-border-line bg-blue-300/30 px-5 py-3">
                      <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                        생년월일
                      </span>
                    </th>
                    <td className="signup-border-line px-5 py-3" colSpan={2}>
                      <input
                        type="date"
                        id="registerId"
                        name="loginId"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        placeholder=""
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mb-4 text-center">
                <button
                  type="button"
                  onClick={completeRegister}
                  className="m-2 rounded-md bg-blue-500 px-4 py-2 text-white shadow-md transition duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none active:bg-blue-700"
                >
                  회원가입
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="m-2 rounded-md bg-gray-500 px-4 py-2 text-white shadow-md transition duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none active:bg-blue-700"
                >
                  취소
                </button>
              </div>
            </dd>
          </div>
        </form>
      </dl>
    </div>
  );
};
