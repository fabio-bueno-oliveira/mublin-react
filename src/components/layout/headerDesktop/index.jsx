import React, { useState, useEffect } from 'react';
import { Menu, Container, Dropdown, Input, Image, Icon, Label, Form } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/user';
import { miscInfos } from '../../../store/actions/misc';
import { userActions } from '../../../store/actions/authentication';
import {IKImage} from "imagekitio-react";
import MublinLogo from '../../../assets/img/logos/mublin-logo-text-white.png';

const HeaderDesktop = () => {

    let searchedKeywords = (new URLSearchParams(window.location.search)).get("keywords")

    const user = JSON.parse(localStorage.getItem('user'));

    let history = useHistory();

    const dispatch = useDispatch();

    useEffect(() => { 
        dispatch(userInfos.getInfo());
        dispatch(miscInfos.getNotifications());
    }, [dispatch]);

    const userInfo = useSelector(state => state.user);

    const unreadNotifications = useSelector(state => state.notifications.list.filter((item) => { return item.seen === 0 }).map(item => ({ 
        id: item.id,
        seen: item.seen
    })))

    // const search = useSelector(state => state.search);

    // const [query, setQuery] = useState('');
    // const [lastQuery, setLastQuery] = useState('');

    // const handleSearchChange = (e) => {
    //     setQuery(e)
    //     if (e.length > 2 && query !== lastQuery) {
    //         setTimeout(() => {
    //              dispatch(searchInfos.getSearchResults(e))
    //         }, 700)
    //         setLastQuery(e)
    //     }
    // }

    // const handleResultSelect = (data) => {
    //     if (data.result.category === "Usuário") {
    //         history.push('/'+data.result.extra2)
    //     } else if (data.result.category === "Projeto") {
    //         history.push('/project/'+data.result.extra1)
    //     } else if (data.result.category === "Evento") {
    //         history.push('/event/'+data.result.extra1)
    //     }
    // }

    const goToNotifications = () => {
        fetch('https://mublin.herokuapp.com/notifications/'+user.id+'/read', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            }
        }).then((response) => {
            history.push("/notifications")
        }).catch(err => {
            console.error(err)
            history.push("/notifications")
        })
    }

    const logout = () => {
        dispatch(userActions.logout());
    }

    const handleSearch = (query) => {
        if (query) {
            history.push({
                pathname: '/search',
                search: '?keywords='+query
            })
        } else {
            history.push({
                pathname: '/search',
                search: '?keywords='
            })
        }
    }

    const [searchQuery, setSearchQuery] = useState(searchedKeywords)

    return (
        <>
            <Menu id='headerDesktop' fixed='top' inverted borderless>
                <Container>
                    <Menu.Item header onClick={() => history.push("/home")}>
                        <Image src={MublinLogo} alt="Logo do Mublin" />
                    </Menu.Item>
                    <Menu.Item onClick={() => history.push("/home")} active={window.location.pathname === "/home"}>
                        <Icon name='home'/> Início
                    </Menu.Item>
                    <Menu.Item onClick={() => history.push("/feed")} active={window.location.pathname === "/feed"}>
                        <i className="fas fa-globe-americas mr-2"></i> Feed
                    </Menu.Item>
                    <Menu.Item onClick={() => history.push("/backstages")} active={window.location.pathname.includes("/backstage")}>
                        <i className="fas fa-warehouse mr-2"></i> Backstages
                    </Menu.Item>
                    <Dropdown item simple text='Novo' icon='caret down' key='new'>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <i className='dropdown icon' />
                                <i className="text fas fa-bolt mr-1"></i> Projeto
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => history.push("/new/project")}>
                                        <i className="fas fa-plus fa-fw"></i> Criar do zero
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => history.push("/new/idea")}>
                                        <i className="far fa-lightbulb fa-fw"></i> Nova ideia de projeto
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => history.push("/new/join")}>
                                        <i className="fas fa-user-plus fa-fw"></i> Ingressar em um projeto
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => history.push("/home")}>
                                        <i className="fas fa-envelope-open-text fa-fw"></i> Convidar alguém para um projeto
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => history.push("/home")}>
                                        <i className="fas fa-crosshairs fa-fw"></i> Buscar projetos que estão contratando
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <i className='dropdown icon' />
                                <i className="text far fa-calendar-plus mr-1"></i> Evento
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => history.push("/new/event/?type=private")}>
                                        <i className="fas fa-drum mr-1"></i> Ensaio
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => history.push("/new/event/?type=public")}>
                                        <i className="fas fa-ticket-alt mr-1"></i> Show
                                    </Dropdown.Item>
                                    {/* <Dropdown.Item onClick={() => history.push("/home")}>
                                        <i className="fas fa-road mr-1"></i> Turnê
                                    </Dropdown.Item> */}
                                </Dropdown.Menu>
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => history.push("/home")}>
                                <i className="fas fa-music mr-1"></i> <span className='mr-4'>Música</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown >
                    <Menu.Item onClick={() => goToNotifications()}>
                        <Icon name='bell outline' className='mr-0'/>
                        {!!unreadNotifications.length && <span className="ui red circular mini label">{unreadNotifications.length}</span>}
                    </Menu.Item>
                    <Menu.Item key='search'>
                        <Form
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setSearchQuery(searchQuery);
                                }
                            }}
                        >
                            <Input 
                                size='small'
                                action={{ icon: 'search', onClick: () => handleSearch(searchQuery) }} 
                                placeholder='Pesquisar...'
                                value={searchQuery} 
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </Form>
                        {/* <Search
                            size='small'
                            // category
                            // fluid
                            // inverted
                            icon="search"
                            placeholder="Pesquisar..."
                            noResultsMessage="Nenhum resultado"
                            loading={search.requesting}
                            results={search.results}
                            value={query}
                            onSearchChange={e => handleSearchChange(e.target.value)}
                            onResultSelect={(e, data) =>
                                handleResultSelect(data)
                            }
                        /> */}
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item key='messages' onClick={() => history.push("/messages")} active={window.location.pathname === "/messages"}>
                            <Icon name='envelope outline' className='mr-0'/><span className="ui red circular mini label">2</span>
                        </Menu.Item>
                        <div className="ui simple dropdown item" key='userMenu'>
                            { (!userInfo.requesting && userInfo.picture) ? (
                                <IKImage 
                                    path={'/users/avatars/'+userInfo.id+'/'+userInfo.picture}
                                    transformation={[{ "height": "200", "width": "200", "r": "max" }]} 
                                />
                            ) : (
                                <IKImage 
                                    path={'/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'}
                                    transformation={[{ "height": "200", "width": "200", "r": "max" }]} 
                                />
                            )}
                            {userInfo.plan === 'Pro' && <Label size='mini' content='PRO' />}<i className='dropdown icon' />
                            <Dropdown.Menu>
                                <Dropdown.Header>{userInfo.username}</Dropdown.Header>
                                <Dropdown.Item icon='user circle' text='Meu perfil' onClick={() => history.push('/'+userInfo.username)} />
                                {userInfo.plan === 'Pro' && 
                                    <Dropdown.Item icon='box' text='Meu equipamento' onClick={() => history.push('/gear')} />
                                }
                                <Dropdown.Item icon='setting' text='Configurações' onClick={() => history.push('/settings')} />
                                <Dropdown.Divider />
                                { userInfo.level === 1 &&
                                    <Dropdown.Item icon='lock' text='Admin' onClick={() => history.push('/admin')} />
                                }
                                <Dropdown.Item icon='sign-out' text='Sair' onClick={logout} />
                            </Dropdown.Menu>
                        </div>
                    </Menu.Menu>
                </Container>
            </Menu>
        </>
    );
};

export default HeaderDesktop