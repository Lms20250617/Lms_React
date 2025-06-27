import { useState, type FC } from 'react';
import './styled.css';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import axios, { type AxiosResponse } from 'axios';

interface IFindProps {}

interface IPostResponse {
  email: string;
  loginId: string;
  result: 'SUCCESS' | 'FAIL';
}

export const FindModal: FC<IFindProps> = () => {
  const [modal, setModal] = useRecoilState(modalState);

  const [findType, setFindType] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const [anotherPassword, setAnotherPassword] = useState('');

  //------------------------------------------------//

  const formatTel = (value: string) => {
    const onlyNums = value.replace(/\D/g, '');

    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 8)
      return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    if (onlyNums.length === 8)
      return `${onlyNums.slice(0, 4)}-${onlyNums.slice(4, 8)}`;
    if (onlyNums.length === 9)
      return `${onlyNums.slice(0, 2)}-${onlyNums.slice(2, 5)}-${onlyNums.slice(5, 9)}`;
    if (onlyNums.length === 10)
      return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(6, 10)}`;
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
  };

  const changePassword = async () => {
    const passwordRules =
      /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (!passwordRules.test(password)) {
      alert(
        '비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다.'
      );
      return;
    }

    if (!anotherPassword) {
      alert('비밀번호를 한 번 더 입력해주세요.');
      return;
    }

    if (!(password === anotherPassword)) {
      alert('비밀번호가 같지 않습니다.');
      return;
    }

    const param = new URLSearchParams();
    param.append('chPassword', password);
    param.append('email', email);

    try {
      await axios
        .post('api/changePwd.do', param)
        .then((res: AxiosResponse<Partial<'SUCCESS' | 'FAIL'>>) => {
          const result = res.data;

          if (result === 'SUCCESS') {
            alert('비밀번호가 변경되었습니다.');
            setModal({ isOpen: false, type: 'find' });
          } else if (result === 'FAIL') {
            alert('비밀번호 변경에 실패했습니다.');
          }
        });
    } catch (error) {
      alert('서버 에러가 발생했습니다.');
    }
  };

  const findIdByEmail = async () => {
    const param = new URLSearchParams();
    param.append('email', email);
    try {
      await axios
        .post('api/selectFindInfoId.do', param)
        .then((res: AxiosResponse<IPostResponse>) => {
          const result = res.data.result;
          var loginId = res.data.loginId;
          console.log(res);

          if (result === 'SUCCESS') {
            alert(`찾으신 ID는 ${loginId} 입니다.`);
          }
        });
    } catch (error) {
      alert(`ID를 찾는데 실패했습니다.`);
    }
  };

  const findPwdByEmailAndHp = async () => {
    const param = new URLSearchParams();
    param.append('email', email);
    param.append('hp', tel);

    try {
      await axios
        .post('api/findPwdByEmailAndHp.do', param)
        .then((res: AxiosResponse<Partial<IPostResponse>>) => {
          var result = res.data.result;
          console.log(res);

          if (result === 'SUCCESS') {
            alert('해당 계정의 비밀번호를 변경해주세요.');
            setFindType('change');
            setPassword('');
            setAnotherPassword('');
          } else if (result === 'FAIL') {
            alert('입력하신 정보의 계정이 없습니다.');
          }
        });
    } catch (error) {
      alert('서버 에러가 발생했습니다.');
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false });
  };

  return (
    <div className="find-modal-overlay">
      <dl>
        <form className="modal-form find-modal-container">
          <div>
            <div className="relative mx-auto w-full rounded-lg border border-gray-300 p-6">
              <button
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-100"
                onClick={closeModal}
              >
                <span className="material-symbols-outlined text-gray-500">
                  Ｘ
                </span>
              </button>
              <div className="mb-8 border-b border-gray-300 pb-3">
                <p className="text-lg">아이디 / 비밀번호 찾기</p>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6 flex justify-center">
                  <button
                    type="button"
                    className="find-modal-button"
                    onClick={() => {
                      setFindType('id');
                      setEmail('');
                    }}
                  >
                    아이디 찾기
                  </button>
                </div>
                <div className="col-span-6 flex justify-center">
                  <button
                    type="button"
                    className="find-modal-button"
                    onClick={() => {
                      setFindType('pwd');
                      setEmail('');
                      setTel('');
                    }}
                  >
                    비밀번호 찾기
                  </button>
                </div>
              </div>

              <div className={findType === 'id' ? '' : 'hidden'}>
                <div className="mt-8 mb-4 grid grid-cols-13 gap-4">
                  <div className="col-span-4 flex items-center justify-center rounded-lg bg-blue-300/30">
                    이메일
                  </div>
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      className="focus:ring-primary-500 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <button
                      className="find-modal-button"
                      type="button"
                      onClick={findIdByEmail}
                    >
                      찾기
                    </button>
                  </div>
                </div>
              </div>

              <div className={findType === 'pwd' ? '' : 'hidden'}>
                <div className="mt-8 mb-4 grid grid-cols-13 gap-4">
                  <div className="col-span-4 flex items-center justify-center rounded-lg bg-blue-300/30">
                    연락처
                  </div>
                  <div className="col-span-6">
                    <input
                      type="text"
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9]/g,
                          ''
                        );
                      }}
                      value={tel}
                      onChange={(e) => {
                        setTel(formatTel(e.target.value));
                      }}
                      className="focus:ring-primary-500 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-4 flex items-center justify-center rounded-lg bg-blue-300/30">
                    이메일
                  </div>
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      className="focus:ring-primary-500 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <button
                      className="find-modal-button"
                      type="button"
                      onClick={findPwdByEmailAndHp}
                    >
                      찾기
                    </button>
                  </div>
                </div>
              </div>

              <div className={findType === 'change' ? '' : 'hidden'}>
                <div className="mt-8 mb-4 grid grid-cols-18 gap-4">
                  <div className="col-span-6 flex items-center justify-center rounded-lg bg-blue-300/30">
                    새 비밀번호
                  </div>
                  <div className="col-span-12">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                      className="focus:ring-primary-500 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-6 flex items-center justify-center rounded-lg bg-blue-300/30">
                    비밀번호 확인
                  </div>
                  <div className="col-span-8">
                    <input
                      type="password"
                      value={anotherPassword}
                      onChange={(e) => {
                        setAnotherPassword(e.target.value);
                      }}
                      placeholder="다시 한 번 입력해주세요."
                      className="focus:ring-primary-500 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-4">
                    <button
                      className="find-modal-button"
                      type="button"
                      onClick={changePassword}
                    >
                      변경
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </dl>
    </div>
  );
};
