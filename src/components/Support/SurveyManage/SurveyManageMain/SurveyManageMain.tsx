import { PageNavigation } from "../../../common.componets/PageNavigation/PageNavigation";

export const SurveyManageMain = () => {

  return (
   <div className="notice-main-container">
   
         {/* {
           modal.isOpen && <Portal><NoticeModal postSuccess={postSuccess} id={noticeId} setId={setNoticeId}></NoticeModal></Portal> 
         } */}
        
         <table className="notice-table">
           <thead className="notice-table-header">
             <tr>
               <th>No</th>
               <th>과목명</th>
               <th>학생ID</th>
               <th>학생명</th>
               <th>상세보기</th>
             </tr>
           </thead>
           <tbody>
             {/* {
               noticeList.length > 0 ?   
   
               noticeList.map((notice) => {
                 return(
                   <tr key={notice.noticeId} className='notice-table-row'>
                     <td className="notice-cell">{notice.noticeId}</td>
                     <td className="notice-cell cursor-pointer text-blue-600 hover:text-blue-800"
                     onClick={() => {
                       noticeDetail(notice.noticeId)
                     }}
                     >
                       {notice.noticeTitle}
                     </td>
                     <td className="notice-cell">{notice.regDate.split('.')[0].slice(0, 16)}</td>
                     <td className="notice-cell">{notice.loginId}</td>
                   </tr>
                 )
               })
               :
               (
               <tr>
               <td colSpan={4} className="notice-empty-row">
                 등록된 공지사항이 없습니다
               </td>
               </tr>
               )
             } */}
           </tbody>
         </table>
         {/* <PageNavigation 
         totalItems={} 
         itemsPerPage={5}
         onPageChange={}
         /> */}
       </div>
    );
}

