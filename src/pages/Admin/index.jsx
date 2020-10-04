import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import { Grid, Header, Menu, Segment, Modal, Form, Button, Message } from 'semantic-ui-react';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import { userInfos } from '../../store/actions/user';
import Spacer from '../../components/layout/Spacer'

function AdminPage () {
 
    document.title = 'Admin | Mublin'

    const userSession = JSON.parse(localStorage.getItem('user'));

    // let history = useHistory();

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(userInfos.getInfo());
    }, [userSession.id, dispatch]);

    const userInfo = useSelector(state => state.user)

    const [isLoading, setIsLoading] = useState(false)

    // START Password Change
    const [modalChangePasswordOpen, setModalChangePasswordOpen] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [hideNewPassword, setHideNewPassword] = useState(true)
    const [passwordChangedSuccess, setPasswordChangedSuccess] = useState(false)
    const [userId, setUserId] = useState('')

    const handleSubmitPasswordChange = () => {
        setIsLoading(true)
        let user = JSON.parse(localStorage.getItem('user'));
        fetch('https://mublin.herokuapp.com/profile/changePassword', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({userId: userId, newPassword: newPassword})
        }).then((response) => {
            response.json().then((response) => {
                setIsLoading(false)
                setPasswordChangedSuccess(true)
                setModalChangePasswordOpen(false)
                setNewPassword('')
            })
        }).catch(err => {
                setIsLoading(false)
                setModalChangePasswordOpen(false)
                console.error(err)
                alert('Ocorreu um erro ao tentar alterar a senha do usuário. Tente novamente em instantes')
                setNewPassword('')
            })
    }

    return (
        <>
            { userInfo.level === 1 ? ( 
                <>
                    <HeaderDesktop />
                    <HeaderMobile />
                    <Spacer />
                    <Grid as='main' columns={1} className="container">
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Header as='h2'>Admin</Header>
                                { passwordChangedSuccess &&
                                    <Message positive size='small'>
                                        <p>Senha atualizada com sucesso</p>
                                    </Message>
                                }
                                <Menu pointing vertical>
                                    <Menu.Item
                                        name='Alterar senha de usuário'
                                        onClick={() => setModalChangePasswordOpen(true)}
                                    />
                                    <Menu.Item
                                        name='Alterar foto de usuário'
                                    />
                                </Menu>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <FooterMenuMobile />
                    <Modal
                        size='mini'
                        open={modalChangePasswordOpen}
                        onClose={e => {
                            setModalChangePasswordOpen(false)
                            setNewPassword('')
                        }}
                    >
                        <Modal.Header>Alterar senha de usuário</Modal.Header>
                        <Modal.Content>
                            <Form>
                                <Form.Field>
                                    <label>ID do usuário</label>
                                    <Form.Input 
                                        type='number'
                                        fluid
                                        name='userID'
                                        value={userId}
                                        onChange={e => setUserId(e.target.value)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Nova senha</label>
                                    <Form.Input 
                                        type={hideNewPassword ? 'password' : 'text'}
                                        fluid
                                        name='newPassword'
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        error={(newPassword.length && newPassword.length < 4) ? ( {
                                            content: 'A nova senha deve ter no mínimo 4 caracteres',
                                            size: "tiny",
                                        }) : null }
                                        icon={{ name: hideNewPassword?'eye slash':'eye', link: true, onClick:() => setHideNewPassword(value => !value) }}
                                    />
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button
                                onClick={e => {
                                    setModalChangePasswordOpen(false)
                                    setNewPassword('')
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                positive 
                                onClick={() => setModalChangePasswordOpen(false)}
                                disabled={!newPassword.length ? true : false}
                                onClick={handleSubmitPasswordChange}
                            >
                                Alterar
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </>
            ) :( 
                <>
                    <Grid verticalAlign='middle' columns={4} centered style={{height:'100%'}}>
                        <Grid.Column mobile={16} computer={10} className="pb-0">
                            <Segment textAlign='center'>Acesso negado</Segment>
                        </Grid.Column>
                    </Grid>
                </>
            )}
        </>
    )
}

export default AdminPage;