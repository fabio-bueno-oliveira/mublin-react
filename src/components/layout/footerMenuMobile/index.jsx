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
                    <Icon name='home' className='mr-0' />
                    <span>Home</span>
                  </div>
                  <div className={currentPath.includes("/career") && 'active'} onClick={() => history.push("/career")}>
                    <Icon name='rocket' className='mr-0' />
                    <span>Carreira</span>
                  </div>
                  <div className={currentPath === '/search' && 'active'} onClick={() => history.push("/search")}>
                    <Icon name='search' className='mr-0' />
                    <span>Buscar</span>
                  </div>
                  <div className={currentPath === '/new' && 'active'} onClick={() => history.push("/new")}>
                    <Icon name='plus' className='mr-0' />
                    <span>Novo</span>
                  </div>
                  <div className={currentPath === '/notifications' && 'active'} onClick={() => history.push("/notifications")}>
                    <Icon name='bell' className='mr-0' />
                    <span>Notificações</span>
                  </div>
              </div>
            </footer>
        </>
    );
};

export default FooterMenuMobile;