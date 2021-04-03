import React, { useState, useEffect } from 'react';
import { Menu, Container, Image, Icon, Modal } from 'semantic-ui-react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/user';
import { userActions } from '../../../store/actions/authentication';
import MublinLogo from '../../../assets/img/logos/mublin-logo-text-white.png';

const HeaderMobile = (props) => {

    // Gets URL string after domain (will be used if it is a Profile or Project Page)
    const usernameUrl = window.location.pathname + window.location.search + window.location.hash;

    let history = useHistory();

    const dispatch = useDispatch();

    useEffect(() => { 
        dispatch(userInfos.getInfo());
    }, [dispatch]);

    const userInfo = useSelector(state => state.user);

    const [mobilMenuOpen, setMobileMenuOpen] = useState(false)

    const goToProfile = () => {
        setMobileMenuOpen(false)
        history.push('/'+userInfo.username)
    }

    const goToGear = () => {
        setMobileMenuOpen(false)
        history.push('/gear')
    }

    const goToSettings = () => {
        setMobileMenuOpen(false)
        history.push('/settings')
    }

    // const goToFeed = () => {
    //     setMobileMenuOpen(false)
    //     history.push('/feed')
    // }

    const goToSearch = () => {
        setMobileMenuOpen(false)
        history.push('/search')
    }

    const goToMessages = () => {
        setMobileMenuOpen(false)
        history.push('/messages')
    }

    const logout = () => {
        dispatch(userActions.logout());
    }

    const [scrollTop, setScrollTop] = useState(0);

    useEffect(() => {
        function onScroll() {
        let currentPosition = window.pageYOffset; // or use document.documentElement.scrollTop;
        setScrollTop(currentPosition <= 0 ? 0 : currentPosition);
        }

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [scrollTop]);

    const AvatarUndefined = 'https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_Kblh5CBKPp.jpg'

    return (
        <>
            <Menu id='headerMobile' fixed='top' inverted size='mini' borderless>
                <Container>
                    <Menu.Item header>
                        { !props.pageType &&
                            <Image onClick={() => history.push("/home")} size='tiny' src={MublinLogo} style={{ marginRight: '1.5em' }} alt="Logo do Mublin" />      
                        }
                        { (props.pageType === 'profile' || props.pageType === 'project') &&
                            <div style={{fontFamily:"'Poppins'",fontSize:'16px',fontWeight:'400',color:'white',width:'170px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',paddingBottom:'2px'}}>
                                <Icon name='arrow left' className='mr-3' onClick={() => history.goBack()} /> {scrollTop > 100 ? <Image src={props.profilePicture ? props.profilePicture : AvatarUndefined} avatar /> : null} {usernameUrl.replace(/^\//,'').replace("project/", "")}
                            </div>      
                        }
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        {/* <Menu.Item
                            name='feed'
                            onClick={() => goToFeed(true)}
                            className='pr-2'
                            active={window.location.pathname === "/feed"}
                        >
                            <Icon name='globe' size='large' />
                        </Menu.Item> */}
                        {/* <Menu.Item
                            name='search'
                            onClick={() => goToSearch(true)}
                            className='pr-2'
                            active={window.location.pathname === "/search"}
                        >
                            <Icon name='search' size='large' />
                        </Menu.Item> */}
                        <Menu.Item
                            name='message'
                            onClick={() => goToMessages(true)}
                            className='pr-2'
                            active={window.location.pathname === "/messages"}
                        >
                            <Icon name='mail outline' size='large' />
                        </Menu.Item>
                        <Menu.Item
                            name='menu'
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            { userInfo.picture ? (
                                <Image size='mini' circular src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture} alt="Foto de perfil" />
                            ) : (
                                <Image size='mini' circular src='https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' alt="Foto de perfil" />
                            )}
                        </Menu.Item>
                    </Menu.Menu>
                </Container>
            </Menu>
            <Modal
                basic
                size='fullscreen'
                open={mobilMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            >
                <Modal.Content>
                    <Menu vertical fluid size='large'>
                        <Menu.Item
                            key='profile'
                            onClick={goToProfile}
                        >
                            <Icon name='user circle' /> Ver meu perfil
                        </Menu.Item>
                        <Menu.Item
                            key='gear'
                            onClick={goToGear}
                        >
                            <Icon name='box' /> Meu equipamento
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

export default HeaderMobile;