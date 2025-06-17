import { useNavigate } from 'react-router-dom';
import notFoundImage from '../../../asset/404.jpg';
import './styled.css';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <img
        onClick={() => navigate(-1)}
        src={notFoundImage}
        alt="404 Not Found"
        className="not-found-image"
      />
    </div>
  );
};
