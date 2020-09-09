import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import HeaderDesktop from '../../../components/layout/headerDesktop';
import { userInfos } from '../../../store/actions/user';
import { miscInfos } from '../../../store/actions/misc';
import { Form, Select, Modal, Header, Label, List, Card, Grid, Menu, Button, Icon, Loader as UiLoader } from 'semantic-ui-react';

function ProfilePage () {

    document.title = 'Configurações | Mublin'

    let history = useHistory()

    let dispatch = useDispatch()

    let user = JSON.parse(localStorage.getItem('user'))

    const [isLoading, setIsLoading] = useState(false)

    const [modalGenresIsOpen, setModalGenresIsOpen] = useState(false)
    const closeGenresModal = () => {
        setModalGenresIsOpen(false)
        setGenreToAdd('')
    }
    
    const [modalRolesIsOpen, setModalRolesIsOpen] = useState(false)
    const closeRolesModal = () => {
        setModalRolesIsOpen(false)
        setRoleToAdd('')
    }

    useEffect(() => { 
        dispatch(userInfos.getInfo());
        dispatch(userInfos.getUserGenresInfoById(user.id));
        dispatch(userInfos.getUserRolesInfoById(user.id));
        dispatch(miscInfos.getMusicGenres());
        dispatch(miscInfos.getRoles());
    }, [dispatch, user.id]);

    const userInfo = useSelector(state => state.user);
    const musicGenres = useSelector(state => state.musicGenres);
    const roles = useSelector(state => state.roles);

    const userSelectedGenres = userInfo.genres.map(item => item.idGenre)
    const userSelectedRoles = userInfo.roles.map(item => item.idRole)

    const musicGenresList = musicGenres.list.filter(e => !userSelectedGenres.includes(e.id)).map(genre => ({ 
        text: genre.name,
        value: genre.id,
        key: genre.id
    }));

    const rolesList = roles.list.filter(e => !userSelectedRoles.includes(e.id)).map(role => ({ 
        text: role.description,
        value: role.id,
        key: role.id
    }));

    const [genreToAdd, setGenreToAdd] = useState('')
    const [roleToAdd, setRoleToAdd] = useState('')

    const addGenre = (musicGenreId) => {
        setIsLoading(true)
        let setMainGenre
        if (!userInfo.genres[0].idGenre) { setMainGenre = 1 } else { setMainGenre = 0 }
        setTimeout(() => {
            fetch('https://mublin.herokuapp.com/user/add/musicGenre', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify({userId: user.id, musicGenreId: musicGenreId, musicGenreMain: setMainGenre})
            }).then((response) => {
                //console.log(response);
                dispatch(userInfos.getUserGenresInfoById(user.id))
                setIsLoading(false)
                setModalGenresIsOpen(false)
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao adicionar o gênero")
            })
        }, 400);
    }

    const deleteGenre = (userGenreId) => {
        setIsLoading(true)
        fetch('https://mublin.herokuapp.com/user/delete/musicGenre', {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({userId: user.id, userGenreId: userGenreId})
        }).then((response) => {
            dispatch(userInfos.getUserGenresInfoById(user.id))
            setIsLoading(false)
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao remover o gênero")
        })
    }
    
    const submitForm = (values) => {
        fetch('https://mublin.herokuapp.com/user/create/', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: values.name, lastname: values.lastname, email: values.email, username: values.username, password: values.password})
        })
        .then(res => res.json())
        // .then(res => localStorage.setItem('user', JSON.stringify(res)))
        .then(
            history.push("/login?info=firstAccess")
        )
    }

    const addRole = (roleId) => {
        setIsLoading(true)
        let setMainRole
        if (!userInfo.roles[0].idRole) { setMainRole = 1 } else { setMainRole = 0 }
        setTimeout(() => {
            fetch('https://mublin.herokuapp.com/user/add/role', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify({userId: user.id, roleId: roleId, roleMain: setMainRole})
            }).then((response) => {
                dispatch(userInfos.getUserRolesInfoById(user.id))
                setIsLoading(false)
                setModalRolesIsOpen(false)
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao adicionar a atividade")
            })
        }, 400);
    }

    const deleteRole = (userRoleId) => {
        setIsLoading(true)
        fetch('https://mublin.herokuapp.com/user/delete/role', {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({userId: user.id, userRoleId: userRoleId})
        }).then((response) => {
            console.log(response);
            dispatch(userInfos.getUserRolesInfoById(user.id))
            setIsLoading(false)
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao remover o gênero")
        })
    }

    return (
        <>
        <HeaderDesktop />
            <Grid centered verticalAlign='middle' columns={1} className="container mb-2 mt-4 mt-md-5 pt-5">
                <Grid.Row>
                    <Grid.Column mobile={16} computer={10}>
                        <Card style={{ width: "100%" }}>
                            <Card.Content>
                                <Menu fluid pointing secondary widths={3} className='mb-3'>
                                    <Menu.Item as='a' onClick={() => history.push("/settings/profile")}>
                                        Editar perfil
                                    </Menu.Item>
                                    <Menu.Item as='span' active>
                                        Preferências
                                    </Menu.Item>
                                    <Menu.Item as='a' onClick={() => history.push("/settings/")}>
                                        Configurações
                                    </Menu.Item>
                                </Menu>
                                <Header as='h4'>Sua ligação com a música</Header>
                                { userInfo.requesting ? (
                                    <UiLoader active inline='centered' size='large' className='my-5' />
                                ) : (
                                    <>
                                        <section id='genres' className='mt-4 mb-4'>
                                            <Header sub className='mb-2' style={{opacity:'0.5'}}>Principais gêneros musicais relacionados à sua atuação na música</Header>
                                            {userInfo.genres.map((genre, key) =>
                                                <Label color='black' key={key} style={{ fontWeight: 'normal' }} className='mb-1'>
                                                    {genre.name}
                                                    <Icon name='delete' onClick={() => deleteGenre(genre.id)} />
                                                </Label>
                                            )}
                                            <Label as='a' color='blue' style={{ fontWeight: 'normal' }} onClick={() => setModalGenresIsOpen(true)} content='Adicionar novo' icon='plus' />
                                            <Modal
                                                size='mini'
                                                open={modalGenresIsOpen}
                                                onClose={() => setModalGenresIsOpen(false)}
                                            >
                                                <Modal.Header>Adicionar novo gênero musical</Modal.Header>
                                                <Modal.Content>
                                                    <Form.Field
                                                        fluid
                                                        id="genre"
                                                        name="genre"
                                                        control={Select}
                                                        options={musicGenresList}
                                                        placeholder="Selecione ou digite"
                                                        onChange={(e, { value }) => setGenreToAdd(value)}
                                                        search
                                                    />
                                                </Modal.Content>
                                                <Modal.Actions>
                                                    <Button size='small' onClick={() => closeGenresModal()}>
                                                        <Icon name='remove' /> Fechar
                                                    </Button>
                                                    <Button size='small' color='blue' onClick={() => addGenre(genreToAdd)} disabled={!genreToAdd}>
                                                        <Icon name='checkmark' /> Salvar
                                                    </Button>
                                                </Modal.Actions>
                                            </Modal>
                                        </section>
                                        <section id='roles' className='mb-4'>
                                            <Header sub className='mb-2' style={{opacity:'0.5'}}>Principais atividades e atuações na música</Header>
                                            {userInfo.roles.map((role, key) =>
                                                <Label color='black' key={key} style={{ fontWeight: 'normal' }}>
                                                    {role.name}
                                                    <Icon name='delete' onClick={() => deleteRole(role.id)} />
                                                </Label>
                                            )}
                                            <Label as='a' color='blue' style={{ fontWeight: 'normal' }} onClick={() => setModalRolesIsOpen(true)} content='Adicionar nova' icon='plus' />
                                            <Modal
                                                size='mini'
                                                open={modalRolesIsOpen}
                                                onClose={() => setModalRolesIsOpen(false)}
                                            >
                                                <Modal.Header>Adicionar nova atividade</Modal.Header>
                                                <Modal.Content>
                                                    <Form.Field
                                                        fluid
                                                        id="role"
                                                        name="role"
                                                        control={Select}
                                                        options={rolesList}
                                                        placeholder="Selecione ou digite"
                                                        onChange={(e, { value }) => setRoleToAdd(value)}
                                                        search
                                                    />
                                                </Modal.Content>
                                                <Modal.Actions>
                                                    <Button size='small' onClick={() => closeRolesModal()}>
                                                        <Icon name='remove' /> Fechar
                                                    </Button>
                                                    <Button size='small' color='blue' onClick={() => addRole(roleToAdd)} disabled={!roleToAdd}>
                                                        <Icon name='checkmark' /> Salvar
                                                    </Button>
                                                </Modal.Actions>
                                            </Modal>
                                        </section>
                                        <section id='roles' className='mb-2'>
                                            <Header sub className='mb-2' style={{opacity:'0.5'}}>Disponibilidade para projetos</Header>
                                            <Form.Group>
                                                <Form.Radio
                                                    label='Small'
                                                    value='sm'
                                                    checked={'value' === 'sm'}
                                                    // onChange={this.handleChange}
                                                />
                                                <Form.Radio
                                                    label='Medium'
                                                    value='md'
                                                    checked={'value' === 'md'}
                                                    // onChange={this.handleChange}
                                                />
                                                <Form.Radio
                                                    label='Large'
                                                    value='lg'
                                                    checked={'value' === 'lg'}
                                                    // onChange={this.handleChange}
                                                />
                                                </Form.Group>
                                        </section>
                                    </>
                                )}
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};

export default ProfilePage;