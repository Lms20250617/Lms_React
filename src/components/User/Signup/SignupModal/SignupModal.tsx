import type { FC } from 'react';
import './styled.css';

interface ISignupProps {
  id: number;
  reSearch: () => void;
}

interface IPostResponse {
  result: 'success' | 'fail';
}

export const SignupModal: FC<ISignupProps> = ({ id }) => {
  return (
    <div className="modal-overlay">
      <dl>
        <form className="modal-form modal-container">
          <dt className="mx-10 my-5 bg-blue-300/60 p-8 text-center text-3xl font-bold">
            회원가입
          </dt>

          <dd>
            <table className="mx-10 mb-8">
              <tbody>
                <tr className="text-center">
                  <th className="bg-blue-300/30 px-5 py-3">
                    <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                      아이디
                    </span>
                  </th>
                  <td className="px-5 py-3">
                    <input
                      type="text"
                      id="registerId"
                      name="loginId"
                      placeholder=""
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      className="w-full rounded-md bg-blue-500 px-4 py-2 text-white shadow-md transition duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none active:bg-blue-700"
                    >
                      중복확인
                    </button>
                  </td>
                  <th className="bg-blue-300/30 px-5 py-3">
                    <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                      회원 유형
                    </span>
                  </th>
                  <td className="px-5 py-3">
                    <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option value="">선택하세요</option>
                      <option value="student">학생</option>
                      <option value="teacher">강사</option>
                    </select>
                  </td>
                </tr>
                <tr className="text-center">
                  <th className="bg-blue-300/30 px-5 py-3">
                    <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                      이메일
                    </span>
                  </th>
                  <td className="px-5 py-3">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="HappyJob@example.com"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      className="w-full rounded-md bg-blue-500 px-4 py-2 text-white shadow-md transition duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none active:bg-blue-700"
                    >
                      중복확인
                    </button>
                  </td>
                  <th className="bg-blue-300/30 px-5 py-3">
                    <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                      주소
                    </span>
                  </th>
                  <td className="px-5 py-3">
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
                <tr>
                  <th className="bg-blue-300/30 px-5 py-3">
                    <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                      이름
                    </span>
                  </th>
                  <td className="px-5 py-3">
                    <input
                      type="text"
                      id="registerId"
                      name="loginId"
                      placeholder=""
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>
                  <th className="bg-blue-300/30 px-5 py-3">
                    <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                      성별
                    </span>
                  </th>
                  <td className="px-5 py-3">
                    <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option value="">선택하세요</option>
                      <option value="student">학생</option>
                      <option value="teacher">강사</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th className="bg-blue-300/30 px-5 py-3">
                    <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                      비밀번호
                    </span>
                  </th>
                  <td colSpan={2} className="px-5 py-3">
                    <input
                      type="text"
                      id="registerId"
                      name="loginId"
                      placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>
                </tr>
                <tr>
                  <th className="bg-blue-300/30 px-5 py-3">
                    <span className="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">
                      비밀번호 확인
                    </span>
                  </th>
                  <td colSpan={2} className="px-5 py-3">
                    <input
                      type="text"
                      id="registerId"
                      name="loginId"
                      placeholder="다시 한 번 입력해주세요."
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
        </form>
      </dl>
    </div>
  );
};
