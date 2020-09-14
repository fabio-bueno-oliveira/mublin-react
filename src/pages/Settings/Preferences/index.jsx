import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import HeaderDesktop from '../../../components/layout/headerDesktop';
import HeaderMobile from '../../../components/layout/headerMobile';
import { userInfos } from '../../../store/actions/user';
import { miscInfos } from '../../../store/actions/misc';
import { Form, Segment, Select, Modal, Header, Label, Dropdown, List, Card, Grid, Menu, Button, Icon, Loader as UiLoader } from 'semantic-ui-react';
import './styles.scss'

function PreferencesPage () {

    document.title = 'Preferências | Mublin'

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
        dispatch(userInfos.getUserGearInfoById(user.id));
        dispatch(userInfos.getUserAvailabilityItemsById(user.id));
        dispatch(miscInfos.getMusicGenres());
        dispatch(miscInfos.getRoles());
        dispatch(miscInfos.getAvailabilityStatuses());
        dispatch(miscInfos.getAvailabilityItems());
        dispatch(miscInfos.getAvailabilityFocuses());
    }, [dispatch, user.id]);

    const userInfo = useSelector(state => state.user);
    const musicGenres = useSelector(state => state.musicGenres);
    const roles = useSelector(state => state.roles);
    const availabilityOptions = useSelector(state => state.availabilityOptions)

    const userSelectedGenres = userInfo.genres.map(item => item.idGenre)
    const userSelectedRoles = userInfo.roles.map(item => item.idRole)
    const userSelectedAvailabilityItems = userInfo.availabilityItems.map(item => ({ 
        id: item.idItem
    })).map(function (obj) {
        return obj.id;
    });

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
            // console.log(response);
            dispatch(userInfos.getUserRolesInfoById(user.id))
            setIsLoading(false)
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao remover o gênero")
        })
    }

    const updateAvailabilityStatus = (availabilityStatusId) => {
        setIsLoading(true)
        setTimeout(() => {
            fetch('https://mublin.herokuapp.com/user/updateAvailabilityStatus', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify({userId: user.id, availabilityStatusId: availabilityStatusId})
            }).then((response) => {
                dispatch(userInfos.getInfo())
                setIsLoading(false)
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao atualizar o status de disponibilidade")
            })
        }, 400);
    }

    const [availabilityStatus, setAvailabilityStatus] = useState('')

    const availabilityStatuses = availabilityOptions.statuses.map(status => ({ 
        label: {color: status.color, empty: true, circular: true},
        text: status.title,
        value: status.id,
        key: status.id
    }));

    const availabilityItems = availabilityOptions.items.map(status => ({ 
        text: status.name,
        value: status.id,
        key: status.id
    }));

    const renderLabel = (label) => ({
        color: '',
        content: label.text,
        icon: 'times'
    })

    const addAvailabilityItem = (availabilityItemId) => {
        fetch('https://mublin.herokuapp.com/user/userAvailabilityItem', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({userId: user.id, availabilityItemId: availabilityItemId})
        }).then((response) => {
            dispatch(userInfos.getUserAvailabilityItemsById(user.id));
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao adicionar o item")
        })
    }

    const deleteAvailabilityItem = (userItemId) => {
        fetch('https://mublin.herokuapp.com/user/userAvailabilityItem', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({userId: user.id, userItemId: userItemId})
        }).then((response) => {
            dispatch(userInfos.getUserAvailabilityItemsById(user.id));
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao remover o item")
        })
    }

    const updateAvailabilityFocus = (focusId) => {
        setIsLoading(true)
        setTimeout(() => {
            fetch('https://mublin.herokuapp.com/user/updateAvailabilityFocus', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify({userId: user.id, availabilityFocus: focusId})
            }).then((response) => {
                dispatch(userInfos.getInfo())
                setIsLoading(false)
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao atualizar a disponibilidade de foco de carreira")
            })
        }, 400);
    }

    const myGearList = userInfo.gear.map(product => ({ 
        text: product.brandName+' '+product.productName,
        value: product.id,
        key: product.id,
        image: { avatar: true, src: product.picture }
    }));

    console.log(268, myGearList)

    const friendOptions = [
        {
          key: 'Jenny Hess',
          text: 'Jenny Hess',
          value: 'Jenny Hess',
          image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },
        },
        {
          key: 'Elliot Fu',
          text: 'Elliot Fu',
          value: 'Elliot Fu',
          image: { avatar: true, src: '/images/avatar/small/elliot.jpg' },
        },
        {
          key: 'Stevie Feliciano',
          text: 'Stevie Feliciano',
          value: 'Stevie Feliciano',
          image: { avatar: true, src: '/images/avatar/small/stevie.jpg' },
        },
      ]

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
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
                                {/* <Header as='h4'>Minha ligação com a música</Header> */}
                                { userInfo.requesting ? (
                                    <UiLoader active inline='centered' size='large' className='my-5' />
                                ) : (
                                    <>
                                        <Segment as='section' id='genres' className='mt-4 mb-4'>
                                            <Header sub className='mb-2' style={{opacity:'0.5'}}>Principais gêneros musicais relacionados à minha atuação na música</Header>
                                            {userInfo.genres.map((genre, key) =>
                                                <Label color='black' key={key} style={{ fontWeight: 'normal' }} className='mb-1'>
                                                    {genre.name}
                                                    <Icon name='delete' onClick={() => deleteGenre(genre.id)} />
                                                </Label>
                                            )}
                                            <Label as='a' color='blue' style={{ fontWeight: 'normal' }} onClick={() => setModalGenresIsOpen(true)} content='Adicionar' icon='plus' />
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
                                        </Segment>
                                        <Segment as='section' id='roles' className='mb-4'>
                                            <Header sub className='mb-2' style={{opacity:'0.5'}}>Minhas principais atividades e atuações na música</Header>
                                            {userInfo.roles.map((role, key) =>
                                                <Label color='black' key={key} style={{ fontWeight: 'normal' }}>
                                                    {role.name}
                                                    <Icon name='delete' onClick={() => deleteRole(role.id)} />
                                                </Label>
                                            )}
                                            <Label as='a' color='blue' style={{ fontWeight: 'normal' }} onClick={() => setModalRolesIsOpen(true)} content='Adicionar' icon='plus' />
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
                                        </Segment>
                                        <Segment as='section' id='roles' className='mb-2'>
                                            <Header sub className='mb-2' style={{opacity:'0.5'}}>Minha disponibilidade atual:</Header>
                                            { !userInfo.requesting &&
                                                <Dropdown
                                                    placeholder='Selecione'
                                                    selection
                                                    fluid
                                                    options={availabilityStatuses}
                                                    defaultValue={userInfo.availabilityStatus}
                                                    onChange={(e, { value }) => updateAvailabilityStatus(value)}
                                                />
                                            }
                                            <div className={(userInfo.availabilityStatus === 1 || userInfo.availabilityStatus === 2) ? '' : 'disabledDivItems'}>
                                                <Header sub className='mb-2 mt-3' style={{opacity:'0.5'}}>Para as seguintes atividades:</Header>
                                                {/* {alert(JSON.stringify(availabilityItemsSelected, null, 2))} */}
                                                { userInfo.availabilityItemsLoaded &&
                                                    <Dropdown 
                                                        placeholder='Selecione...' 
                                                        fluid 
                                                        multiple selection 
                                                        options={availabilityItems} 
                                                        className='mb-2'
                                                        defaultValue={userSelectedAvailabilityItems}
                                                        onLabelClick={(e, { value }) => deleteAvailabilityItem(value)}
                                                        onChange={(e, { value }) => addAvailabilityItem(value.slice(value.length - 1))}
                                                        renderLabel={renderLabel}
                                                    />
                                                }
                                                <Header sub className='mb-2 mt-3' style={{opacity:'0.5'}}>Disponível para:</Header>
                                                <Form.Group grouped>
                                                    <Form.Field
                                                        disabled={userInfo.requesting}
                                                        label='Projetos próprios'
                                                        control='input'
                                                        type='radio'
                                                        name='availabilityFocus'
                                                        value={1}
                                                        checked={userInfo.availabilityFocus === 1 && true}
                                                        onClick={() => updateAvailabilityFocus(1)}
                                                    />
                                                    <Form.Field
                                                        disabled={userInfo.requesting}
                                                        label='Outros projetos (convidado)'
                                                        control='input'
                                                        type='radio'
                                                        name='availabilityFocus'
                                                        value={2}
                                                        checked={userInfo.availabilityFocus === 2 && true}
                                                        onClick={() => updateAvailabilityFocus(2)}
                                                    />
                                                    <Form.Field
                                                        disabled={userInfo.requesting}
                                                        label='Todos os projetos (próprios e convidado)'
                                                        control='input'
                                                        type='radio'
                                                        name='availabilityFocus'
                                                        value={3}
                                                        checked={userInfo.availabilityFocus === 3 && true}
                                                        onClick={() => updateAvailabilityFocus(3)}
                                                    />
                                                </Form.Group>
                                            </div>
                                        </Segment>
                                        <Segment as='section' className='mb-2'>
                                            <Header sub className='mb-2' style={{opacity:'0.5'}}>Meu equipamento:</Header>
                                            { !userInfo.requesting &&
                                                <Dropdown
                                                    selection
                                                    fluid
                                                    text='Selecione'
                                                >
                                                    <Dropdown.Menu>
                                                        <Dropdown.Header content='Meus equipamentos' />
                                                        {myGearList.map((option) => (
                                                            <Dropdown.Item key={option.value} {...option} />
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            }
                                        </Segment>
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

export default PreferencesPage;