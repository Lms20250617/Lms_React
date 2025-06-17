import { useState } from 'react';
import './styled.css';

interface IPageNavigationProps {
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const PageNavigation = ({
  totalItems,
  itemsPerPage,
  onPageChange,
}: IPageNavigationProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pageRange = 5; // 한 번에 보여줄 페이지 번호 개수

  // 현재 페이지를 중심으로 페이지 범위 계산
  const calculatePageRange = () => {
    let start = Math.max(1, currentPage - Math.floor(pageRange / 2));
    const end = Math.min(start + pageRange - 1, totalPages);

    // end가 totalPages에 도달했을 때 start를 조정
    if (end === totalPages) {
      start = Math.max(1, end - pageRange + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pages = calculatePageRange();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  return (
    <div className="pagination-container">
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        처음
      </button>

      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        이전
      </button>

      <div className="pagination-numbers-container">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination-number-button ${
              currentPage === page ? 'active' : ''
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        다음
      </button>

      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        마지막
      </button>
    </div>
  );
};
