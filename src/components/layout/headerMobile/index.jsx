import React, { useState, useEffect } from 'react';
import { Menu, Container, Image, Icon, Modal } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/user';
import { userActions } from '../../../store/actions/authentication';

const HeaderMobile = (props) => {

    // Gets URL string after domain (will be used if it is a Profile or Project Page)
    const usernameUrl = window.location.pathname + window.location.search + window.location.hash;

    let history = useHistory();

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

    const goToNew = () => {
        setMobileMenuOpen(false)
        history.push('/new')
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

    const MublinLogoURL = 'https://ik.imagekit.io/mublin/logos/tr:h-60,w-160,c-maintain_ratio/mublin-logo-text-white.png?updatedAt=1624813840231'
    const AvatarUndefined = 'https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_Kblh5CBKPp.jpg'

    function truncate(input) {
        if (input.length > 15) {
           return input.replace(/^\//,'').replace("project/", "").substring(0, 15) + '...';
        }
        return input.replace(/^\//,'').replace("project/", "");
     };

    return (
        <>
            <Menu id='headerMobile' fixed='top' inverted size='mini' borderless>
                <Container className='py-2 py-md-0'>
                    <Menu.Item header className='p-0'>
                        {!props.pageType &&
                            <Image onClick={() => history.push("/home")} size='tiny' src={MublinLogoURL} style={{ marginRight: '1.5em' }} alt="Logo do Mublin" className='ml-2' />
                        }
                        {(props.pageType === 'profile' || props.pageType === 'project') &&
                            <div style={{fontFamily:"'Poppins'",fontSize:'16px',fontWeight:'400',color:'white',width:'236px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',paddingBottom:'2px',paddingLeft:'12px',display:'flex',alignItems:'center'}}>
                                <Icon name='arrow left' className='mr-3' onClick={() => history.goBack()} /> {scrollTop > 100 ? <Image className='mr-2' src={props.profilePicture ? props.profilePicture : AvatarUndefined} avatar /> : null} {truncate(usernameUrl)}
                            </div>      
                        }
                    </Menu.Item>
                    <Menu.Menu position='right' className='mr-2'>
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
                            name='new'
                            onClick={() => goToNew(true)}
                            className='pr-2'
                            active={window.location.pathname === "/new"}
                        >
                            <Icon name='plus square outline' size='large' />
                        </Menu.Item>
                        <Menu.Item
                            name='message'
                            onClick={() => goToMessages(true)}
                            className='pr-2'
                            active={window.location.pathname === "/messages"}
                        >
                            <Icon name='mail outline' size='large' />
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

export default HeaderMobile;