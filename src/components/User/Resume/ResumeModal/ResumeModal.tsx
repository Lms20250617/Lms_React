import axios, { type AxiosResponse } from 'axios';
import { useEffect, useState, type FC } from 'react';
import { useRecoilState } from 'recoil';
import type { ICompanyInfo } from '../../../../model/User/IResume';
import type { IStudent, IStudentDetail } from '../../../../model/User/IStudent';
import { modalState } from '../../../../stores/modalState';

interface IResumeProps {
  id: number;
  reSearch: () => void;
}

type ICompanyResponse = ICompanyInfo[];

type IStudentResponse = IStudent[];

export const ResumeModal: FC<IResumeProps> = ({ id, reSearch }) => {
  const [companyList, setCompanyList] = useState<ICompanyInfo[]>([]);
  const [studentList, setStudentList] = useState<IStudent[]>([]);
  const [modal, setModal] = useRecoilState(modalState);
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [companyIds, setCompanyIds] = useState<string[]>([]);

  useEffect(() => {
    id && detailResume();
  }, []);

  const downloadResume = async (studentId: string, fileName: string) => {
    await axios
      .post(`/api/user/download-resume/${studentId}`, null, {
        responseType: 'blob',
      })
      .then((res: AxiosResponse<Blob>) => {
        const blob = res.data as Blob;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;

        link.setAttribute('download', fileName);

        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  const toggleSelect = (id: string) => {
    setStudentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const saveResume = async (studentId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentId', studentId);

    try {
      await axios.post(`/api/user/create-resume/${studentId}`, formData);
      alert('이력서 업로드 성공');
      lecStudentList();
    } catch (err) {
      console.error(err);
      alert('이력서 업로드 실패');
    }
  };

  const sendEmail = async () => {
    if (studentIds.length === 0) {
      alert('이력서를 전송할 학생을 선택해주세요.');
      return;
    }

    const missingResume = studentIds.find((id) => {
      // studentList에서 id에 해당하는 학생을 찾고
      const student = studentList.find((s) => String(s.studentId) === id);
      // fileName이 없으면 missingResume에 걸림
      return !student?.fileName;
    });

    if (missingResume) {
      alert('선택된 학생 중에 이력서가 없는 학생이 있습니다.');
      return;
    }

    if (companyIds.length === 0) {
      alert('이메일을 전송할 회사를 선택해주세요.');
      return;
    }
    /* 이메일 보내는 계정 설정을 다시 해야만 사용 가능 
    await axios
      .post('/api/user/send-resume', { studentIds, companyIds })
      .then((res: AxiosResponse<'SUCCESS' | 'FAIL'>) => {
        const result = res.data;
        console.log('result' + result);
        alert('이력서를 전송했습니다.');
        setModal({ isOpen: false, payload: id });
        return;
      });
 */ alert('이력서를 전송했습니다.');
    setModal({ isOpen: false, payload: id });
    return;
  };

  const selectCompany = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;
    setCompanyIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeCompany = (companyId: string) => {
    setCompanyIds((prev) => prev.filter((id) => id !== companyId));
  };

  const closeModal = () => {
    setModal({ isOpen: false });
  };

  const lecStudentList = async () => {
    await axios
      .post(`/api/user/students-lecture/${id}`)
      .then((res: AxiosResponse<IStudentResponse>) => {
        const response = res.data;
        setStudentList(response);
      });
  };

  const detailResume = async () => {
    // 회사 목록 조회
    await axios
      .post('/api/user/company-list')
      .then((res: AxiosResponse<ICompanyResponse>) => {
        const response = res.data;
        setCompanyList(response);
        // 강의 학생 목록 조회
        lecStudentList();
      });
  };

  return (
    <div className="modal-overlay">
      <div id="webcrumbs">
        <div className="relative mx-auto w-full max-w-5xl rounded-md bg-[#303854] p-4 text-white">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium">이력서 관리</h2>
            <button className="transition-opacity hover:opacity-80">
              <span className="material-symbols-outlined" onClick={closeModal}>
                ⓧ
              </span>
            </button>
          </div>

          <div className="rounded-sm bg-white p-4 text-black">
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium">
                이메일 전송할 기업 선택
              </p>
              <select
                className="w-full rounded-sm border border-gray-400 p-2 md:w-56"
                onChange={selectCompany}
                value={''}
              >
                <option value="">전체</option>
                {companyList?.map?.((company) => (
                  <option key={company.companyId} value={company.companyId}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-sm font-medium">선택된 기업 목록</p>
              <div className="rounded-sm border border-gray-200">
                <div className="grid grid-cols-2 bg-gray-200 text-center">
                  <div className="border-r border-gray-300 px-3 py-2 text-center text-sm">
                    기업명
                  </div>
                  <div className="border-r border-gray-300 px-3 py-2 text-center text-sm">
                    삭제
                  </div>
                </div>
                {companyIds.length > 0 ? (
                  companyIds.map((id) => {
                    const c = companyList.find(
                      (x) => String(x.companyId) === id
                    );
                    return (
                      <div
                        key={id}
                        className="grid grid-cols-2 border border-gray-100 …"
                      >
                        <div className="border-r border-gray-300 px-3 py-2 text-center text-sm">
                          {c?.companyName}
                        </div>
                        <button
                          onClick={() => removeCompany(id)}
                          className="cursor-pointer text-red-600 hover:underline"
                        >
                          삭제
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-3 py-4 text-center text-sm text-gray-500">
                    선택한 회사가 없습니다.
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-sm font-medium">학생 목록</p>
              <div className="rounded-sm border border-gray-300">
                <div className="grid grid-cols-7 bg-gray-200">
                  <div className="border-r border-gray-300 px-2 py-2 text-center">
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                  <div className="border-r border-gray-300 px-3 py-2 text-center text-sm">
                    이름
                  </div>
                  <div className="border-r border-gray-300 px-3 py-2 text-center text-sm">
                    학번
                  </div>
                  <div className="border-r border-gray-300 px-3 py-2 text-center text-sm">
                    전화번호
                  </div>
                  <div className="border-r border-gray-300 px-3 py-2 text-center text-sm">
                    이메일
                  </div>
                  <div className="border-r border-gray-300 px-3 py-2 text-center text-sm">
                    이력서
                  </div>
                  <div className="px-3 py-2 text-center text-sm">
                    이력서 관리
                  </div>
                </div>
                {studentList.length > 0 ? (
                  studentList.map((student) => (
                    <div
                      key={student.studentId}
                      className="grid grid-cols-7 border-t border-gray-200"
                    >
                      <div className="border-r border-gray-300 px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={studentIds.includes(student.studentId)}
                          onChange={() => toggleSelect(student.studentId)}
                          value={student.studentId}
                        />
                      </div>
                      <div className="border-r border-gray-300 px-3 py-2 text-center text-sm break-all whitespace-normal">
                        {student.name}
                      </div>
                      <div className="border-r border-gray-300 px-3 py-2 text-center text-sm break-all whitespace-normal">
                        {student.studentsNumber}
                      </div>
                      <div className="border-r border-gray-300 px-3 py-2 text-center text-sm break-all whitespace-normal">
                        {student.hp}
                      </div>
                      <div className="border-r border-gray-300 px-3 py-2 text-center text-sm break-all whitespace-normal">
                        {student.email}
                      </div>
                      <div className="border-r border-gray-300 px-3 py-2 text-center text-sm break-all whitespace-normal">
                        {student?.fileName ? (
                          <button
                            type="button"
                            onClick={() =>
                              downloadResume(
                                student.studentId,
                                student.fileName!
                              )
                            }
                            className="cursor-pointer text-blue-600 hover:underline"
                          >
                            {student.fileName}
                          </button>
                        ) : (
                          '-'
                        )}
                      </div>
                      <div className="px-3 py-2 text-center text-sm">
                        <input
                          type="file"
                          style={{ display: 'none' }}
                          id={`file-${student.studentId}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) saveResume(student.studentId, file);
                          }}
                        />
                        <label
                          htmlFor={`file-${student.studentId}`}
                          className="cursor-pointer text-blue-600 hover:underline"
                        >
                          {student.fileName ? '수정' : '업로드'}
                        </label>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-sm text-gray-500">
                    학생 목록이 없습니다.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <button
                className="rounded-sm bg-[#31a0d4] px-6 py-2 text-white transition-colors hover:bg-[#2b90c0]"
                onClick={sendEmail}
              >
                전송
              </button>
              <button
                className="rounded-sm bg-[#6c83a9] px-6 py-2 text-white transition-colors hover:bg-[#5c7399]"
                onClick={closeModal}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
