import React, { useState, useEffect } from 'react';
import { Menu, Container, Image, Icon, Modal } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/user';
import { userActions } from '../../../store/actions/authentication';
import MublinLogo from '../../../assets/img/logos/mublin-logo-text-white.png';

const HeaderMobile = () => {

    let history = useHistory();

    const dispatch = useDispatch();

    useEffect(() => { 
        dispatch(userInfos.getInfo());
    }, [dispatch]);

    const userInfo = useSelector(state => state.user);

    const [mobilMenuOpen, setMobileMenuOpen] = useState(false)

    const logout = () => {
        dispatch(userActions.logout());
    }

    return (
        <>
            <Menu id='headerMobile' fixed='top' inverted size='mini' borderless>
                <Container>
                    <Menu.Item header onClick={() => history.push("/home")}>
                        <Image size='tiny' src={MublinLogo} style={{ marginRight: '1.5em' }} alt="Logo do Mublin" />
                        {/* <Link to={{ pathname: "/usuario" }} style={{fontFamily:'Baloo',fontSize:'19px',fontWeight:'400',color:'white'}}><Icon name='arrow left' size='small' /> fabio</Link> */}
                    </Menu.Item>
                    <Menu.Menu position='right'>
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
                    <Menu vertical fluid>
                        <Menu.Item
                            key='profile'
                            onClick={() => history.push('/'+userInfo.username)}
                        >
                            <Icon name='user circle' /> Ver meu perfil
                        </Menu.Item>
                        <Menu.Item
                            key='settings'
                            onClick={() => history.push("/settings")}
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