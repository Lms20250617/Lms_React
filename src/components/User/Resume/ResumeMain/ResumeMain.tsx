import type { AxiosResponse } from 'axios';
import './styled.css';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { ResumeContext } from '../../../../provider/User/ResumeProvider';
import { Portal } from '../../../../common/Portal';
import { ResumeModal } from '../ResumeModal/ResumeModal';
import { PageNavigation } from '../../../common.componets/PageNavigation/PageNavigation';
import type { IResume, IResumeResponse } from '../../../../model/User/IResume';

export const ResumeMain = () => {
  const [resumeList, setResumeList] = useState<IResume[]>([]);
  const [resumeCnt, setResumeCnt] = useState<number>(0);

  const { searchData } = useContext(ResumeContext);

  const [modal, setModal] = useRecoilState(modalState);

  useEffect(() => {
    if (!modal.isOpen) {
      searchList();
    }
  }, [modal]);

  const searchList = async (cPage?: number) => {
    const searchParam = new URLSearchParams(searchData);
    cPage = cPage || 1;

    searchParam.append('currentPage', cPage.toString());
    searchParam.append('pageSize', '5');

    await axios
      .post('/api/user/resumeLectureListBody.do', searchParam)
      .then((res: AxiosResponse<IResumeResponse>) => {
        setResumeList(res.data.resumeLectureList);
        setResumeCnt(res.data.resumeLectureCnt);
      });

    // axios를 통해 받은 데이터를 담아야함
    // 문제 1. axios를 통해 서버로 갔다가 와야하는데, 시간이 오래 걸림
  };

  const resumeDetail = (id: number) => {
    setModal({ isOpen: true, payload: id });
  };

  return (
    <div className="resume-main-container">
      {modal.isOpen && (
        <Portal>
          <ResumeModal
            id={modal.payload as number}
            reSearch={() => {}}
          ></ResumeModal>
        </Portal>
      )}
      <table className="resume-table">
        <thead className="resume-table-header">
          <tr>
            <th>강의 번호</th>
            <th>강의 이름</th>
            <th>회차</th>
            <th>담당 강사</th>
            <th>정원</th>
            <th>개강일</th>
            <th>종강일</th>
          </tr>
        </thead>
        <tbody>
          {resumeList.length > 0 ? (
            resumeList.map((resume) => {
              return (
                <tr key={resume.lecId} className="resume-table-row">
                  <td className="resume-cell">{resume.lecId}</td>
                  <td
                    className="resume-cell cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => resumeDetail(resume.lecId)}
                  >
                    {resume.lecName}
                  </td>
                  <td className="resume-cell">{resume.lectureRound}</td>
                  <td className="resume-cell">{resume.tutorName}</td>
                  <td className="resume-cell">{resume.lecPersonnel}</td>
                  <td className="resume-cell">
                    {resume.lecStartDate.split('.')[0].slice(0, 10)}
                  </td>
                  <td className="resume-cell">
                    {resume.lecEndDate.split('.')[0].slice(0, 10)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8} className="resume-empty-row">
                등록된 이력서가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PageNavigation
        totalItems={resumeCnt}
        itemsPerPage={5}
        onPageChange={searchList}
      />
    </div>
  );
};
