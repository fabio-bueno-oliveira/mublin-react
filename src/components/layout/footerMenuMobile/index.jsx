import React, { useState, useEffect } from 'react';
import { Icon, Image, Menu, Modal } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/user';
import { userActions } from '../../../store/actions/authentication';
import './styles.scss';

const FooterMenuMobile = () => {

    let history = useHistory();

    let currentPath = window.location.pathname

    const dispatch = useDispatch();

    useEffect(() => { 
        dispatch(userInfos.getInfo());
    }, [dispatch]);

    const userInfo = useSelector(state => state.user)

    const [mobilMenuOpen, setMobileMenuOpen] = useState(false)

    const goToProfile = () => {
        setMobileMenuOpen(false)
        history.push('/'+userInfo.username)
    }

    const goToSettings = () => {
        setMobileMenuOpen(false)
        history.push('/settings')
    }

    const logout = () => {
        dispatch(userActions.logout());
    }

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
                {/* <div className={currentPath === '/new' && 'active'} onClick={() => history.push("/new")}>
                    <Icon name='plus' className='mr-0' />
                    <span>Novo</span>
                </div> */}
                <div className={currentPath === '/notifications' && 'active'} onClick={() => history.push("/notifications")}>
                    <Icon name='bell' className='mr-0' />
                    <span>Notificações</span>
                </div>
                <div 
                    className='userPicture'
                    onClick={() => setMobileMenuOpen(true)}
                >
                    {userInfo.picture ? (
                        <Image size='mini' circular src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture} alt="Foto de perfil" />
                    ) : (
                        <Image size='mini' circular src='https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' alt="Foto de perfil" />
                    )}
                </div>
            </div>
        </footer>
        <Modal
            basic
            size='fullscreen'
            open={mobilMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
        >
            <Modal.Content>
                <Menu vertical fluid size='massive'>
                    <Menu.Item
                        key='profile'
                        onClick={goToProfile}
                    >
                        <Icon name='user circle' /> Ver meu perfil
                    </Menu.Item>
                    <Menu.Item
                        key='settings'
                        onClick={goToSettings}
                    >
                        <Icon name='setting' /> Configurações
                    </Menu.Item>
                    <Menu.Item
                        key='logout'
                        onClick={() => logout()}
                    >
                        <Icon name='sign-out' /> Sair
                    </Menu.Item>
                </Menu>
            </Modal.Content>
        </Modal>
        </>
    );
};

export default FooterMenuMobile;