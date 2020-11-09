import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import './styles.scss'

const FooterMenuMobile = () => {

    let history = useHistory();

    let currentPath = window.location.pathname

    return (
        <>
            <footer className="menuMobile d-lg-none">
              <div>
                  <div className={currentPath === '/home' && 'active'} onClick={() => history.push("/home")}>
                    {/* <i className="fas fa-home"></i> */}
                    <Icon name='home' className='mr-0' />
                    <span>Home</span>
                  </div>
                  <div className={currentPath.includes('/backstage') && 'active'} onClick={() => history.push("/backstage")}>
                    {/* <i className="fas fa-guitar"></i> */}
                    <Icon name='warehouse' className='mr-0' />
                    <span>Backstage</span>
                  </div>
                  {/* <div className={currentPath === '/search' && 'active'} onClick={() => history.push("/search")}>
                    <Icon name='search' className='mr-0' />
                    <span>Buscar</span>
                  </div> */}
                  <div className={currentPath === '/feed' && 'active'} onClick={() => history.push("/feed")}>
                    {/* <i className="fas fa-search"></i> */}
                    <Icon name='globe' className='mr-0' />
                    <span>Feed</span>
                  </div>
                  <div className={currentPath === '/notifications' && 'active'} onClick={() => history.push("/notifications")}>
                    {/* <i className="fas fa-bell"></i> */}
                    <Icon name='bell' className='mr-0' />
                    <span>Notificações</span>
                  </div>
                  <div className={currentPath === '/new' && 'active'} onClick={() => history.push("/new")}>
                    {/* <i className="fas fa-plus"></i> */}
                    <Icon name='plus' className='mr-0' />
                    <span>Novo</span>
                  </div>
              </div>
            </footer>
        </>
    );
};

export default FooterMenuMobile;