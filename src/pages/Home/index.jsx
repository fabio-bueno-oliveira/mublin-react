import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import MyFeed from '../../components/myFeed';
import { userInfos } from '../../store/actions/user';
import { userProjectsInfos } from '../../store/actions/userProjects';
import { searchInfos } from '../../store/actions/search';
import { eventsInfos } from '../../store/actions/events';
import { Header, Grid, Image, Icon, Label, Message, List, Button, Input, Card, Loader, Placeholder, Dropdown } from 'semantic-ui-react';
import Flickity from 'react-flickity-component';
import Masonry from 'react-masonry-css';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import './styles.scss';

function HomePage () {

    document.title = 'Mublin';

    let dispatch = useDispatch();

    const user = JSON.parse(localStorage.getItem('user'));

    let currentDate = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0].replace('T',' ');

    const currentYear = new Date().getFullYear();

    useEffect(() => {
        dispatch(userProjectsInfos.getUserProjects(user.id,'all'));
        dispatch(userInfos.getUserRolesInfoById(user.id));
        dispatch(userInfos.getUserLastConnectedFriends());
        dispatch(searchInfos.getSuggestedUsersResults());
        dispatch(eventsInfos.getUserEvents(user.id));
    }, [user.id, dispatch]);

    const userInfo = useSelector(state => state.user);

    const feed = useSelector(state => state.feed);

    const eventsIsRequesting = useSelector(state => state.events.requesting);

    const events = useSelector(state => state.events.list);

    const projects = useSelector(state => state.userProjects);

    const totalProjects = useSelector(state => state.userProjects.summary).length;

    const totalMainProjects = useSelector(state => state.userProjects.summary).filter((project) => { return project.portfolio === 0 }).length;

    const totalPortfolioProjects = useSelector(state => state.userProjects.summary).filter((project) => { return project.portfolio === 1 }).length;

    const [filteredByName, setFilteredByName] = useState('');

    const filteredProjects = filteredByName ? projects.list.filter((project) => { return project.name.toLowerCase().includes(filteredByName.toLowerCase()) || project.username.toLowerCase().includes(filteredByName.toLowerCase()) }) : projects.list;

    const sliderOptions = {
        autoPlay: false,
        cellAlign: 'left',
        freeScroll: true,
        prevNextButtons: false,
        pageDots: false,
        wrapAround: false,
        draggable: '>1',
        resize: true,
        contain: true
    };

    const sliderOptionsHomeScreen = {
        autoPlay: false,
        cellAlign: 'center',
        freeScroll: false,
        prevNextButtons: false,
        pageDots: true,
        wrapAround: false,
        draggable: '>1',
        resize: true,
        contain: true,
        groupCells: 1
    };

    // START Event RSVP
    const [modalDeclineEvent, setModalDeclineEvent] = useState(false);
    const [modalAcceptEvent, setModalAcceptEvent] = useState(false);
    const [declineComment, setDeclineComment] = useState('Minha agenda estará comprometida nesta data');
    const [isEventLoading, setEventIsLoading] = useState({key: null, response: null});
    const submitInvitationResponse = (key,invitationId,response,response_modified,response_comments) => {
        setEventIsLoading({key: key, response: response})
        setTimeout(() => {
            fetch('https://mublin.herokuapp.com/user/'+user.id+'/eventInvitationResponse', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify({invitationId: invitationId, response: response, response_modified:response_modified, response_comments: response_comments})
            }).then((response) => {
                dispatch(userInfos.getUserProjects(user.id));
                setEventIsLoading({key: null, response: null})
                setModalAcceptEvent(false)
                setModalDeclineEvent(false)
                setDeclineComment('Minha agenda estará comprometida nesta data')
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao atualizar convite. Tente novamente em instantes")
            })
        }, 400);
    };
    const [confirmPresence, setConfirmPresence] = useState(false);
    const [refuseInvitation, setRefuseInvitation] = useState(false);
    // END Event RSVP

    const undefinedAvatar = 'https://ik.imagekit.io/mublin/tr:h-70,w-70,c-maintain_ratio/sample-folder/avatar-undefined_Kblh5CBKPp.jpg';

    const cdnBaseURL = 'https://ik.imagekit.io/mublin';

    var today = new Date();

    const breakpointColumnsProjects = {
        default: 3,
        1300: 3,
        900: 2,
        700: 1,
        500: 1
    };

    const breakpointColumnsFeed = {
        default: 2,
        1300: 2,
        900: 2,
        700: 1,
        500: 1
    };

    const cardPlaceholder = <Card>
        <Card.Content>
            <Placeholder>
                <Placeholder.Header image>
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder.Paragraph>
            </Placeholder>
        </Card.Content>
    </Card>

    const cardNewProject = <Card color='green'>
        <Card.Content>
            <Header as='h2'>
                <Header.Content>
                    Criar Novo Projeto
                </Header.Content>
            </Header>
        </Card.Content>
        <Card.Content>
            <List divided relaxed>
                <List.Item>
                    <List.Content>
                        <List.Header as='a'>Cadastrar novo projeto</List.Header>
                        <List.Description as='a'>Cadastre um novo projeto no Mublin</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header as='a'>Nova ideia de projeto</List.Header>
                        <List.Description as='a'>Cadastre uma ideia de projeto e atraia artistas interessados em participar</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header as='a'>Ingressar em um projeto</List.Header>
                        <List.Description as='a'>Entre em algum projeto já cadastrado no Mublin</List.Description>
                    </List.Content>
                </List.Item>
            </List>
        </Card.Content>
    </Card>

    const [homeFeedSelectedOption, setHomeFeedSelectedOption] = useState('Meus Projetos')

    const handleChangeFeedFilter = (option) => {
        setHomeFeedSelectedOption(option)
        switch(option) {
            case "Meus Projetos":       return dispatch(userProjectsInfos.getUserProjects(user.id,'all'));
            case "Principais":          return dispatch(userProjectsInfos.getUserProjects(user.id,'main'));
            case "Portfolio":           return dispatch(userProjectsInfos.getUserProjects(user.id,'portfolio'));
            case "Projetos que sigo":   return dispatch(userProjectsInfos.getUserProjects(user.id,'portfolio'));
            case "Feed":                return dispatch(userProjectsInfos.getUserProjects(user.id,'portfolio'));
            default:                    return dispatch(userProjectsInfos.getUserProjects(user.id,'all'));
        }
    }

    const homeFeedOptions = [
        {
            key: 'Meus Projetos',
            text: 'Meus Projetos',
            value: 'Meus Projetos',
            icon: 'folder open outline',
            description: totalProjects
        },
        {
            key: 'Principais',
            text: 'Apenas projetos principais',
            value: 'Principais',
            disabled: totalMainProjects === 0 ? true : false,
            description: totalMainProjects
        },
        {
            key: 'Portfolio',
            text: 'Apenas projetos do portfolio',
            value: 'Portfolio',
            disabled: totalPortfolioProjects === 0 ? true : false,
            description: totalPortfolioProjects
        },
        // {
        //     key: 'Projetos que sigo',
        //     text: 'Projetos que sigo',
        //     value: 'Projetos que sigo',
        //     icon: 'folder open outline'
        // },
        {
            key: 'Feed',
            text: 'Feed',
            value: 'Feed',
            icon: 'feed'
        }
    ]

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
        <Grid centered className='px-3 homepage'>
            <Grid.Row columns={1} only='mobile'>
                <Grid.Column mobile={16} tablet={16} computer={16} className='pl-0 pr-0'>
                    <div className='mt-4 mt-md-2 pt-3 mt-md-0'>
                        <div className='homeScreen'>
                            <div>
                                <Image src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture} alt='Foto de perfil' avatar />
                                <span>Hello, {userInfo.name}</span>
                                <div>
                                    <Flickity
                                        className={'carousel'}
                                        style={{height: '200px'}}
                                        elementType={'div'}
                                        options={sliderOptionsHomeScreen}
                                        disableImagesLoaded={false}
                                        reloadOnUpdate
                                    >
                                        <div className='sliderItem'>
                                            {events.length ? (
                                                <>
                                                <Icon name='ticket' size='large' disabled />
                                                <h4>Próximo evento</h4>
                                                <h6>{events.length} agendados</h6>
                                                <div className='slideContent'>
                                                    {eventsIsRequesting ? (
                                                        <p>Carregando...</p>
                                                    ) : (
                                                        <div className='extraInfo'>
                                                            <p className='title'>{events[0].title}</p>
                                                            {/* <p>{events[0].description}</p> */}
                                                        </div>
                                                    )}
                                                    <div className='extraInfo secondary'>
                                                        <p>{events[0].eventDateStart+' às '+events[0].eventHourStart} {events[0].city && ' em '+events[0].city+'/'+events[0].region}</p>
                                                    </div>
                                                    <div className='extraInfo secondary'>
                                                        {events[0].eventType} com {events[0].projectName+' ('+events[0].projectType+')'}
                                                    </div>
                                                    {events[0].response === 1 ? <Label size='mini p-1' color='green'>Presença confirmada</Label> : null}
                                                    {events[0].response === 2 ? <Label size='mini p-1' color='purple'>Aguardando sua confirmação</Label> : null}
                                                    {events[0].response === 0 ? <Label size='mini p-1' color='red'>Convite recusado</Label> : null}
                                                </div>
                                                </>
                                            ) : (
                                                <>
                                                    <Icon name='ticket' size='large' disabled />
                                                    <h4>Próximo evento</h4>
                                                    <h6>Nenhum evento público próximo</h6>
                                                </>
                                            )}
                                        </div>
                                        <div className='sliderItem'>
                                            <Icon name='ticket' size='large' disabled />
                                            <h4>Próxima Meta:</h4>
                                            <p>asd asdasdasdas </p>
                                        </div>
                                        <div className='sliderItem'>
                                            <Icon name='ticket' size='large' disabled />
                                            <h4>Próximo Show:</h4>
                                            <p>asd asdasdasdas </p>
                                        </div>
                                        <div className='sliderItem'>
                                            <Icon name='ticket' size='large' disabled />
                                            <h4>Próximo Show:</h4>
                                            <p>asd asdasdasdas </p>
                                        </div>
                                    </Flickity>
                                </div>
                            </div>
                        </div>
                        {userInfo.requesting ? (
                            <div style={{textAlign: 'center', width: '100%', height: '100px'}} className='py-3'>
                                <Loader active inline='centered' />
                            </div>
                        ) : (
                            <>
                            {userInfo.lastConnectedFriends[0].username &&
                                <>
                                    <Header as='h4' className='mt-2 mx-3'>Contatos conectados recentemente</Header>
                                    <Flickity
                                        className={'carousel'}
                                        style={{height: '200px'}}
                                        elementType={'div'}
                                        options={sliderOptions}
                                        disableImagesLoaded={false}
                                        reloadOnUpdate
                                    >
                                        {userInfo.lastConnectedFriends.map((friend, key) =>
                                            <div className="friends-carousel-cell" key={key}>
                                                <Link to={{ pathname: '/'+friend.username }}>
                                                    {friend.picture ? (
                                                        <Image src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max,c-maintain_ratio/users/avatars/'+friend.id+'/'+friend.picture} rounded width='50' height='auto' title={friend.username} />
                                                    ) : (
                                                        <Image src={undefinedAvatar} rounded size='tiny' title={friend.username} />
                                                    )}
                                                    <Header as='h5' textAlign='center' className='mt-2 mb-0'>
                                                        <Header.Content title={friend.username}>
                                                            {(friend.username.length > 7) ? friend.username.substr(0,6) + '...' : friend.username}
                                                        </Header.Content>
                                                    </Header>
                                                </Link>
                                                <Label 
                                                    circular
                                                    color={new Date(friend.lastLogin) > new Date(today - (5*86400000)) ? 'green' : 'blue'}
                                                    color='green'
                                                    empty
                                                    size='mini'
                                                    style={{position:'absolute',top:'48%',right:'23%'}}
                                                />
                                            </div>
                                        )}
                                    </Flickity>
                                </>
                            }
                            </>
                        )}    
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2} className='pt-0 pt-md-0'>
                <Grid.Column as='aside' mobile={16} tablet={16} computer={4} className="only-computer" style={{backgroundColor:'white'}}>
                    <div className='px-3 pb-4' style={{position:'sticky',top:'0',paddingTop:'82px'}}>
                        {!userInfo.requesting ? ( 
                            <div className="pb-2 mt-3">
                                <Image centered circular src={(!userInfo.requesting && userInfo.picture) ? 'https://ik.imagekit.io/mublin/tr:h-70,w-70,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture : undefinedAvatar} />

                                <Header as='h2' textAlign='center' className='mt-3 mb-1'>
                                    Olá, {userInfo.name}!
                                </Header>

                                <Header as='h6' textAlign='center' className='my-0'>
                                    <span style={{fontWeight:'lighter'}}>@{userInfo.username}</span> {!!userInfo.verified && <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' />} {userInfo.plan === 'Pro' && <Label size='mini' className="ml-0" style={{cursor:'default'}}>PRO</Label>}
                                </Header>

                                <Header as='h3' textAlign='center' className='mt-3'>
                                    <Header.Subheader>
                                        {userInfo.roles.map((role, key) =>
                                            <span key={key}>{role.icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+role.icon} width='13' height='13' style={{verticalAlign:'middle'}} />} {role.name}{key < (userInfo.roles.length-1) && ', '}</span>
                                        )}
                                    </Header.Subheader>
                                </Header>

                                <p className='mt-4 textCenter' style={{fontSize:'13px'}}>
                                    {userInfo.bio}
                                </p>
                                {/* {!!userInfo.projects && 
                                    <p className='mt-4 textCenter' style={{fontSize:'13px'}}>
                                        <b style={{fontWeight:'500'}}>{userInfo.projects ? userInfo.projects.length : null} projetos: </b>
                                        {userInfo.projects && 
                                            userInfo.projects.map((project, key) =>
                                                <>{project.name}{key !== userInfo.projects.length - 1 && ', '}</>
                                            )
                                        }
                                    </p>
                                } */}
                            </div>
                        ) : (
                            <div className="pb-2 mt-2">
                                <Image centered circular src={undefinedAvatar} />
                                <Header as='h3' textAlign='center' className='mt-2'>
                                    <Header.Content>
                                        Carregando...
                                        <Header.Subheader className='mt-2'>
                                            <span>Carregando...</span>
                                        </Header.Subheader>
                                    </Header.Content>
                                </Header>
                                <Header as='h5' textAlign='center' className='mt-3'>
                                    <Header.Subheader className='mt-1'>
                                        Carregando...
                                    </Header.Subheader>
                                </Header>
                            </div>
                        )}

                        {userInfo.lastConnectedFriends[0].username &&
                        <div className='mt-0 mt-md-4 pb-2'>
                            {userInfo.requesting ? (
                                <div style={{textAlign: 'center', width: '100%', height: '100px'}} className='py-3'>
                                    <Loader active inline='centered' />
                                </div>
                            ) : (
                                <>
                                {userInfo.lastConnectedFriends[0].username &&
                                    <>
                                        <Header as='h5' textAlign='center'>Contatos conectados recentemente</Header>
                                        <Flickity
                                            className={'carousel'}
                                            style={{height: '200px'}}
                                            elementType={'div'}
                                            options={sliderOptions}
                                            disableImagesLoaded={false}
                                            reloadOnUpdate
                                        >
                                            {userInfo.lastConnectedFriends.map((friend, key) =>
                                                <div className="friends-carousel-cell" key={key}>
                                                    <Link to={{ pathname: '/'+friend.username }}>
                                                        {friend.picture ? (
                                                            <Image src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max,c-maintain_ratio/users/avatars/'+friend.id+'/'+friend.picture} rounded width='50' height='auto' title={friend.username} />
                                                        ) : (
                                                            <Image src={undefinedAvatar} rounded size='tiny' title={friend.username} />
                                                        )}
                                                        <Header as='h5' textAlign='center' className='mt-2 mb-0'>
                                                            <Header.Content title={friend.username}>
                                                                {(friend.username.length > 7) ? friend.username.substr(0,6) + '...' : friend.username}
                                                            </Header.Content>
                                                        </Header>
                                                    </Link>
                                                    <Label 
                                                        circular 
                                                        color={new Date(friend.lastLogin) > new Date(today - (5*86400000)) ? 'green' : 'blue'} 
                                                        color='green'
                                                        empty 
                                                        size='mini' 
                                                        style={{position:'absolute',top:'48%',right:'23%'}} 
                                                    />
                                                </div>
                                            )}
                                        </Flickity>
                                    </>
                                }
                                </>
                            )}
                        </div>
                        }
                        <Header disabled className='logoFont textCenter mt-3' style={{fontSize:'12px'}} as='h5'>
                            mublin ©2021
                        </Header>
                    </div>
                </Grid.Column>

                <Grid.Column as='main' mobile={16} tablet={16} computer={12}>
                    <div className='py-0 py-md-4 mt-0 mt-md-5'></div>
                    <div className='px-3 px-md-0'>
                        <Dropdown
                            className='feedSelector mt-0 mt-md-3 mb-3'
                            inline
                            options={homeFeedOptions}
                            defaultValue={homeFeedOptions[0].value}
                            onChange={(e, { value }) => handleChangeFeedFilter(value)}
                        />
                        {homeFeedSelectedOption !== "Feed" &&
                            <div className='pb-4'>
                                <Input 
                                    icon='search'
                                    iconPosition='left'
                                    placeholder='Filtrar por nome do projeto...'
                                    transparent
                                    value={filteredByName}
                                    onChange={e => setFilteredByName(e.target.value)}
                                    size='big'
                                    style={{width:'100%'}}
                                />
                            </div>
                        }
                    </div>

                    {(homeFeedSelectedOption === "Meus Projetos" || homeFeedSelectedOption === "Principais" || homeFeedSelectedOption === "Portfolio") ? (
                        !projects.requesting ? (
                            filteredProjects.length ? (
                                <Masonry
                                    breakpointCols={breakpointColumnsProjects}
                                    className="my-masonry-grid"
                                    columnClassName="my-masonry-grid_column"
                                >
                                    {filteredProjects.map((project, key) =>
                                        <Card key={key}>
                                            <Card.Content>
                                                <div className='headerMenu'>
                                                    <Header as='h3' className='mb-0'>
                                                        <Image rounded src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-160,w-160,c-maintain_ratio/'+project.picture : 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg'} />
                                                        <Header.Content>
                                                            {project.name}
                                                            <Header.Subheader>
                                                                {project.ptname} {project.genre1 ? ' · '+project.genre1 : null }
                                                            </Header.Subheader>
                                                            <Header.Subheader className='projectExtraInfo'>
                                                            {project.cityName ? <><Icon name='map marker alternate' />{project.cityName}, {project.regionUf}<span>·</span></> : null}<Icon name='folder open outline' />{project.portfolio ? 'Portfolio' : 'Projetos Principais'}
                                                            </Header.Subheader>
                                                        </Header.Content>
                                                    </Header>
                                                    <div>
                                                        <Dropdown icon='ellipsis horizontal' direction='left'>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item text='Acessar Painel' />
                                                                <Dropdown.Item text='Ver Perfil' />
                                                                <Dropdown.Item text='Gerenciar participação' />
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                                {project.labelShow === 1 && 
                                                    <Label className='mt-3' tag color={project.labelColor} size="tiny" style={{ fontWeight: 'normal' }}>{project.labelText}</Label>
                                                }
                                            </Card.Content>
                                            <Card.Content>
                                                <div className='d-flex' style={{alignItems:'center', fontSize:'11.5px'}}>
                                                    <Image src={'https://ik.imagekit.io/mublin/tr:h-36,w-36,r-max,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture} rounded className='mr-1' width='18' height='18' />
                                                    Sou {project.role1}{project.role2 && ', '+project.role2}{project.role3 && ', '+project.role3} {(project.id && !project.yearLeftTheProject && !project.yearEnd) ? '· desde ' + project.joined_in : null} {(project.id && project.yearLeftTheProject) ? '· até ' + project.yearLeftTheProject : null}
                                                </div>
                                                {!!project.id && 
                                                    <div className='mt-1 badges'>
                                                        <Label circular size="tiny"><Icon name={project.workIcon}  className='mr-0' color='black' /> {project.workTitle}</Label> {!!(project.active && !project.yearLeftTheProject && !project.yearEnd) && <Label circular size="tiny"><Icon color='green' name='check circle' className='mr-0' /> Ativo atualmente no projeto</Label>} {!!project.yearLeftTheProject && <Label color='red' circular size="tiny"><Icon name='sign out' className='mr-0' /> Deixei o projeto em {project.yearLeftTheProject}</Label>} {!!(project.touring && !project.yearLeftTheProject && !project.yearEnd) && <Label circular size="tiny"><Icon name='road' color='blue' className='mr-0' /> Em turnê com este projeto</Label>} {!!project.admin && <Label circular size="tiny"><Icon name='wrench' color='black' className='mr-0' /> Administrador</Label>} {!!(!project.yearLeftTheProject && !project.yearEnd && (currentYear - project.joined_in) >= 10) && <Label circular size="tiny"><Icon name='star' color='yellow' className='mr-0' /> há + de 10 anos ativo no projeto!</Label>} 
                                                    </div>
                                                }
                                            </Card.Content>
                                            <Card.Content>
                                                <Card.Description>
                                                    {project.leaderLastNote && 
                                                        <Message
                                                            size='tiny'
                                                            color='blue'
                                                            header='Recado do Líder'
                                                            content={project.leaderLastNote ? project.leaderLastNote : 'Nenhum recado no momento'}
                                                        />
                                                    }
                                                    <List divided relaxed='very'>
                                                        {!project.yearEnd ? ( 
                                                            <>
                                                                <List.Item>
                                                                    <List.Icon name='calendar alternate outline' size='large' verticalAlign='middle' />
                                                                    <List.Content>
                                                                        <List.Header className='itemTitle'>Próximo evento{project.nextEventDateOpening ? ': ' + project.nextEventDateOpening + ' às ' + project.nextEventHourOpening.substr(0,5) : null}</List.Header>
                                                                        <List.Description style={{maxWidth:'90%'}}>
                                                                            <div>
                                                                                {project.nextEventDateOpening ? 
                                                                                    <>{project.nextEventTitle}</> 
                                                                                : 
                                                                                    'Nenhum evento programado'
                                                                                }
                                                                            </div>
                                                                            {(project.nextEventDateOpening && project.nextEventInvitationId) && 
                                                                                <>
                                                                                <div className='mt-2 d-flex' style={{alignItems:'center', fontSize:'11.5px'}}>
                                                                                    <Image src={'https://ik.imagekit.io/mublin/tr:h-12,w-12,r-max,c-maintain_ratio/users/avatars/'+project.nextEventInvitationUserIdWhoInvited+'/'+project.nextEventInvitationPictureWhoInvited} rounded title={project.nextEventInvitationUsernameWhoInvited} className='mr-1' />
                                                                                    {(userInfo.id !== project.nextEventInvitationUserIdWhoInvited) ? 
                                                                                        <>
                                                                                            {project.nextEventInvitationNameWhoInvited} te convidou em {project.nextEventInvitationDate.substr(0,11)}
                                                                                        </>
                                                                                    :
                                                                                        <>
                                                                                            Você criou este evento em {project.nextEventInvitationDate.substr(0,11)}
                                                                                        </>
                                                                                    }
                                                                                </div>
                                                                                <div style={{display:'flex',marginTop:'5px'}}>
                                                                                    <Button size='mini' icon onClick={project.nextEventInvitationResponse === 1 ? () => submitInvitationResponse(key,project.nextEventInvitationId,2,currentDate,'') : () => setModalAcceptEvent(key)} basic={project.nextEventInvitationResponse === 1 ? false : true} color={project.nextEventInvitationResponse === 1 ? 'green' : null} className='mr-1' loading={isEventLoading.key === key && isEventLoading.response === 2 ? true : false}><Icon name='thumbs up outline' />Irei</Button>
                                                                                    <Button size='mini' icon basic={project.nextEventInvitationResponse === 0 ? false : true} color={project.nextEventInvitationResponse === 0 ? 'red' : null} onClick={project.nextEventInvitationResponse === 0 ? () => submitInvitationResponse(key,project.nextEventInvitationId,2,currentDate,'') : () => setModalDeclineEvent(key)} loading={isEventLoading.key === key && isEventLoading.response === 2 ? true : false}><Icon name='thumbs down outline' />Não irei</Button>
                                                                                    <Button size='mini' basic icon><Icon name='plus' /> detalhes</Button>
                                                                                </div>
                                                                                </>
                                                                            }
                                                                        </List.Description>
                                                                    </List.Content>
                                                                </List.Item>
                                                                <List.Item>
                                                                    <List.Icon name='flag checkered' size='large' verticalAlign='middle' className='pr-1' />
                                                                    <List.Content style={{paddingLeft:'5px'}}>
                                                                        <List.Header className='itemTitle'>Próxima meta do projeto</List.Header>
                                                                        <List.Description>
                                                                            {(project.nextGoalDescription && project.nextGoalCompleted) ? <Icon name='check' color='green' className='mr-0' /> : <Icon name='clock outline' className='mr-0' />} {project.nextGoalDescription ? project.nextGoalDescription : 'Nenhuma meta cadastrada'}
                                                                        </List.Description>
                                                                        <List.Description style={{fontSize:'11.5px'}}>
                                                                            Prevista para {project.nextGoalDescription ? project.nextGoalDate +  ' (restam ' + formatDistance(new Date(project.nextGoalDate.split('/').reverse().join('-')), new Date(), {locale:pt}) + ')' : 'Nenhuma atividade pendente pra mim'}
                                                                        </List.Description>
                                                                    </List.Content>
                                                                </List.Item>
                                                                <List.Item>
                                                                    <List.Icon name='bookmark outline' size='large' verticalAlign='middle' />
                                                                    <List.Content style={{paddingLeft:'7px'}}>
                                                                        <List.Header className='itemTitle'>Minha lição de casa</List.Header>
                                                                        <List.Description>
                                                                            {(project.nextUserGoalDescription && project.nextUserGoalCompleted) ? <Icon name='check' color='green' className='mr-0' /> : <Icon name='clock outline' className='mr-0' />} {project.nextUserGoalDescription ? project.nextUserGoalDescription : 'Nenhuma meta cadastrada'}
                                                                        </List.Description>
                                                                        <List.Description style={{fontSize:'11.5px'}}>
                                                                            Prevista para {project.nextUserGoalDescription ? project.nextUserGoalDate +  ' (restam ' + formatDistance(new Date(project.nextUserGoalDate.split('/').reverse().join('-')), new Date(), {locale:pt}) + ')' : 'Nenhuma atividade pendente pra mim'}
                                                                        </List.Description>
                                                                    </List.Content>
                                                                </List.Item>
                                                            </>
                                                        ) : (
                                                            <List.Item>
                                                                <List.Content>
                                                                    <List.Description>Projeto encerrado em {project.yearEnd}</List.Description>
                                                                </List.Content>
                                                            </List.Item>
                                                        )}
                                                    </List>
                                                </Card.Description>
                                            </Card.Content>
                                            {/* <Card.Content extra textAlign='center'>
                                                <a>
                                                    Acessar Painel de {project.name}
                                                    <Icon name='chevron right' />
                                                </a>
                                            </Card.Content> */}
                                        </Card>
                                    )}
                                </Masonry>
                            ) : (
                                cardNewProject
                            )
                        ) : (
                            <Masonry
                                breakpointCols={breakpointColumnsProjects}
                                className="my-masonry-grid"
                                columnClassName="my-masonry-grid_column"
                            >
                                {cardPlaceholder}
                                {cardPlaceholder}
                                {cardPlaceholder}
                            </Masonry>
                        )
                    ) : (
                        null
                    )}

                    {homeFeedSelectedOption === "Feed" ? (
                        <MyFeed feedData={feed} masonryBreakPoints={breakpointColumnsFeed} />
                    ) : (
                        null
                    )}

                </Grid.Column>
            </Grid.Row>
        </Grid>
        <Spacer />
        <FooterMenuMobile />
        </>
    );
};

export default HomePage;
