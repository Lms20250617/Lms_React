import type { FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface PortallProps {
  children: ReactNode;
}

export const Portal: FC<PortallProps> = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};
