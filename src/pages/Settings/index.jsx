import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import { userInfos } from '../../store/actions/user';
import { emailCheckInfos } from '../../store/actions/emailCheck';
import { userActions } from '../../store/actions/authentication';
import { useDebouncedCallback } from 'use-debounce';
import { Modal, Form, Label, List, Card, Grid, Menu, Button, Icon, Segment, Message, Loader as UiLoader } from 'semantic-ui-react';
import ValidateUtils from '../../utils/ValidateUtils';

function SettingsPage () {

    document.title = 'Configurações | Mublin'

    let history = useHistory();

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(userInfos.getInfo());
    }, []);

    const logout = () => {
        dispatch(userActions.logout());
    }

    const [isLoading, setIsLoading] = useState(false)

    const userInfo = useSelector(state => state.user)

    const [usernameChoosen, setUsernameChoosen] = useState(userInfo.username)
    const usernameAvailability = useSelector(state => state.usernameCheck);

    let color
    if (usernameChoosen === userInfo.username || usernameAvailability.requesting) {
        color=null
    } else if (usernameChoosen && usernameAvailability.available === false) {
        color="red"
    } else if (usernameChoosen && usernameAvailability.available === true) {
        color="green"
    }

    // START Password Change
    const [modalChangePasswordOpen, setModalChangePasswordOpen] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [hideNewPassword, setHideNewPassword] = useState(true)
    const [reNewPassword, setReNewPassword] = useState('')
    const [hideReNewPassword, setHideReNewPassword] = useState(true)
    const [passwordChangedSuccess, setPasswordChangedSuccess] = useState(false)

    const handleSubmitPasswordChange = () => {
        setIsLoading(true)
        let user = JSON.parse(localStorage.getItem('user'));
        fetch('https://mublin.herokuapp.com/user/changePassword', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({userId: user.id, newPassword: newPassword})
        }).then((response) => {
            response.json().then((response) => {
                setIsLoading(false)
                setPasswordChangedSuccess(true)
                setModalChangePasswordOpen(false)
                setNewPassword('')
                setReNewPassword('')
            })
        }).catch(err => {
                setIsLoading(false)
                setModalChangePasswordOpen(false)
                console.error(err)
                alert('Ocorreu um erro ao tentar alterar sua senha. Tente novamente em instantes')
                setNewPassword('')
                setReNewPassword('')
            })
    }

    // START Email change
    const [modalChangeEmailOpen, setModalChangeEmailOpen] = useState(false)
    const [newEmail, setNewEmail] = useState('')
    const [errorEmail, setErrorEmail] = useState('')
    const [errorEmailIsTheSame, setErrorEmailIsTheSame] = useState(false)
    const [emailChangedSuccess, setEmailChangedSuccess] = useState(false)
    const handleChangeEmail = (value) => {
        setNewEmail(value)
        if (!value.length) {
            setErrorEmail('Informe seu email')
        } else if (!ValidateUtils.email(value)) {
            setErrorEmail('Email inválido')
        } else {
            setErrorEmail('')
        }
    }
    const [checkEmail] = useDebouncedCallback((string) => {
        if (string !== userInfo.email) {
            dispatch(emailCheckInfos.checkEmailByString(string));
            setErrorEmailIsTheSame(false)
        } else {
            setErrorEmailIsTheSame(true)
        }
    },900)
    const emailAvailability = useSelector(state => state.emailCheck);

    const handleSubmitEmailChange = () => {
        setIsLoading(true)
        let user = JSON.parse(localStorage.getItem('user'));
        fetch('https://mublin.herokuapp.com/user/changeEmail', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({userId: user.id, newEmail: newEmail})
        }).then((response) => {
            response.json().then((response) => {
                dispatch(userInfos.getInfo())
                setIsLoading(false)
                setEmailChangedSuccess(true)
                setModalChangeEmailOpen(false)
                setNewEmail('')
                logout()
            })
        }).catch(err => {
                setIsLoading(false)
                setModalChangeEmailOpen(false)
                console.error(err)
                alert('Ocorreu um erro ao tentar alterar seu email. Tente novamente em instantes')
                setNewEmail('')
            })
    }

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
            <Grid centered verticalAlign='middle' columns={1} className="container mb-2 mt-4 mt-md-5 pt-5">
                <Grid.Row>
                    <Grid.Column mobile={16} computer={10}>
                        <Card style={{ width: "100%" }}>
                            <Card.Content>
                                <Menu fluid pointing secondary widths={3} className='mb-4'>
                                    <Menu.Item as='a' onClick={() => history.push("/settings/profile")}>
                                        Editar perfil
                                    </Menu.Item>
                                    <Menu.Item as='a' onClick={() => history.push("/settings/preferences")}>
                                        Preferências
                                    </Menu.Item>
                                    <Menu.Item as='span' active>
                                        Configurações
                                    </Menu.Item>
                                </Menu>
                                <List divided relaxed>
                                    <List.Item onClick={() => setModalChangePasswordOpen(true)}>
                                        <List.Icon name='key' size='large' verticalAlign='middle' />
                                        <List.Content>
                                            <List.Header as='a'>Senha {passwordChangedSuccess && <Label content='Senha alterada com sucesso!' color='green' size='mini' />}</List.Header>
                                            <List.Description as='a'>Alterar minha senha</List.Description>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item onClick={() => setModalChangeEmailOpen(true)}>
                                        <List.Icon name='mail' size='large' verticalAlign='middle' />
                                        <List.Content>
                                            <List.Header as='a'>Alterar meu endereço de email {emailChangedSuccess && <Label content='Email alterado com sucesso!' color='green' size='mini' />}</List.Header>
                                            <List.Description as='a'>{userInfo.email}</List.Description>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Icon name='cart' size='large' verticalAlign='middle' />
                                        <List.Content>
                                            <List.Header as='a'>Alterar meu Plano</List.Header>
                                            <List.Description as='a'>Atualmente você é um usuário {userInfo.plan}</List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Modal
                size='mini'
                open={modalChangePasswordOpen}
                onClose={e => {
                    setModalChangePasswordOpen(false)
                    setNewPassword('')
                    setReNewPassword('')
                }}
            >
                <Modal.Header>Alterar minha senha</Modal.Header>
                <Modal.Content>
                    <Form>
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
                        <Form.Field>
                            <label>Confirme a nova senha</label>
                            <Form.Input 
                                type={hideReNewPassword ? 'password' : 'text'}
                                fluid
                                name='reNewPassword'
                                value={reNewPassword}
                                onChange={e => setReNewPassword(e.target.value)}
                                error={(newPassword !== reNewPassword && newPassword.length && reNewPassword.length) ? ( {
                                    content: 'As senhas não conferem',
                                    size: "tiny",
                                }) : null }
                                icon={{ name: hideReNewPassword?'eye slash':'eye', link: true, onClick:() => setHideReNewPassword(value => !value) }}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={e => {
                            setModalChangePasswordOpen(false)
                            setNewPassword('')
                            setReNewPassword('')
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        positive 
                        onClick={() => setModalChangePasswordOpen(false)}
                        disabled={(newPassword !== reNewPassword || !newPassword.length) ? true : false}
                        onClick={handleSubmitPasswordChange}
                    >
                        Alterar
                    </Button>
                </Modal.Actions>
            </Modal>
            <Modal
                size='mini'
                open={modalChangeEmailOpen}
                onClose={e => {
                    setModalChangeEmailOpen(false)
                    setNewEmail('')
                }}
            >
                <Modal.Header>Alterar meu email</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Email atual</label>
                            <Form.Input 
                                fluid
                                name='oldEmail'
                                value={userInfo.email}
                                disabled
                                icon='mail' 
                                iconPosition='left'
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Novo email</label>
                            <Form.Input 
                                type='email'
                                className={emailAvailability.available === false && "error"}
                                loading={emailAvailability.requesting}
                                fluid
                                name='newEmail'
                                value={newEmail}
                                onChange={e => {
                                    handleChangeEmail(e.target.value)
                                }}
                                onKeyUp={e => {
                                    checkEmail(e.target.value)
                                }}
                                icon='mail' 
                                iconPosition='left'
                                error={(errorEmail) ? ( {
                                    content: errorEmail,
                                    size: "tiny",
                                }) : null }
                            />
                            {emailAvailability.available === false && 
                                <Label 
                                    className="mt-0 mb-2"
                                    size="mini" 
                                    pointing 
                                    color="red"
                                    style={{fontWeight: 'normal', textAlign: 'center'}} 
                                >
                                    <Icon name="times" /> Email já registrado
                                </Label>
                            }
                            {errorEmailIsTheSame && 
                                <Label 
                                    className="mt-0 mb-2"
                                    size="mini" 
                                    pointing 
                                    color="orange"
                                    style={{fontWeight: 'normal', textAlign: 'center'}} 
                                >
                                    <Icon name="exclamation" /> Este é seu email atual!
                                </Label>
                            }
                        </Form.Field>
                    </Form>
                    <Message warning size='tiny'>
                        Ao alterar seu email, você será direcionado para a tela de login novamente
                    </Message>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={e => {
                            setModalChangeEmailOpen(false)
                            setNewEmail('')
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        positive 
                        disabled={(emailAvailability.available) ? false : true}
                        onClick={() => {
                            setModalChangeEmailOpen(false)
                            handleSubmitEmailChange()
                        }}
                    >
                        Alterar
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    );
};

export default SettingsPage;