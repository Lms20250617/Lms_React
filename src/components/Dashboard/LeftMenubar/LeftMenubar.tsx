import { useEffect, useState } from 'react';
import type { ILoginInfo, IMenuState } from '../../../model/ILogin';
import logoImage from '../../../asset/logo.png';
import logo_img from '../../../asset/logo_img.png';
import menu from '../../../asset/menu.png';
import { useRecoilState } from 'recoil';
import { loginInfoState } from '../../../stores/userInfo';
import { Link, useNavigate } from 'react-router-dom';
import './styled.css';

export const LeftMenuBar = () => {
  const [userInfo, setUserInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState<string>('');
  const [activeParent, setActiveParent] = useState<string>('');

  // 애플리케이션 로드 시 sessionStorage에서 userInfo 불러오기
  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));

      console.log(userInfo)
    }
  }, [setUserInfo]);

  const handlerLogout = () => {
    sessionStorage.removeItem('userInfo'); // sessionStorage에서 userInfo 제거
    setUserInfo({ loginId: '', usrMnuAtrt: [] }); // Recoil 상태 초기화
    navigate('/');
  };

  const handleLinkClick = (menuId: string, parentId: string) => {
    setActiveLink(menuId);
    setActiveParent(parentId);
  };

  return (
    <div className="left-menu-bar mt-5">
      <a href="/react">
        <img src={logo_img} alt="happyjob" />
      </a>
      <div className="logo-box">
        <img src={logoImage} alt="logoImage" className="logo" />
        <div className="user-info">
          <div>{userInfo?.loginId}</div>
          <button onClick={handlerLogout}>로그아웃</button>
        </div>
      </div>
      <ul>
        {userInfo?.usrMnuAtrt?.map((menuAttrt: IMenuState) => (
          <li key={menuAttrt.mnu_id} className="parent-menu group">
            <img src={menu} alt="menu" />
            <div className="child-menu-name">{menuAttrt.mnu_nm}</div>
            <div
              className={`child-menu-link ${activeParent === menuAttrt.mnu_id ? 'active' : ''}`}
            >
              {menuAttrt.nodeList.map((node) => (
                <Link
                  className={`styled-link ${activeLink === node.mnu_id ? 'active' : ''}`}
                  to={'/react' + node.mnu_url}
                  key={node.mnu_id}
                  onClick={() => handleLinkClick(node.mnu_id, menuAttrt.mnu_id)}
                >
                  <div id={node.mnu_id}>{node.mnu_nm}</div>
                </Link>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
