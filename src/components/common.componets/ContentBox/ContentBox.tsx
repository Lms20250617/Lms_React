import type { FC } from 'react';
import './styled.css';

export const ContentBox: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="content-box-container">{children}</div>;
};
