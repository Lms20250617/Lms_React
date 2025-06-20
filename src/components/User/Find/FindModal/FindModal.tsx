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

  //------------------------------------------------//

  const sendEmail = async () => {
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
          } else if (result === 'FAIL') {
            alert(`ID를 찾는데 실패했습니다.`);
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
                    onClick={() => setFindType('id')}
                  >
                    아이디 찾기
                  </button>
                </div>
                <div className="col-span-6 flex justify-center">
                  <button
                    type="button"
                    className="find-modal-button"
                    onClick={() => setFindType('pwd')}
                  >
                    비밀번호 찾기
                  </button>
                </div>
              </div>

              <div className={findType === 'id' ? '' : 'hidden'}>
                <div className="mt-8 mb-4 grid grid-cols-13 gap-4">
                  <div className="col-span-4 flex items-center justify-center rounded-lg bg-blue-300/30">
                    아이디 찾기
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
                      onClick={sendEmail}
                    >
                      이메일 전송
                    </button>
                  </div>
                </div>
              </div>

              <div className={findType === 'pwd' ? '' : 'hidden'}>
                <div className="mt-8 mb-4 grid grid-cols-13 gap-4">
                  <div className="col-span-4 flex items-center justify-center rounded-lg bg-blue-300/30">
                    비밀번호 찾기
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
                    <button className="find-modal-button" type="button">
                      이메일 전송
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
