import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import { userInfos } from '../../store/actions/user';
import { searchInfos } from '../../store/actions/search';
import { Container, Header, Grid, Card, Image, Icon, Label, List, Modal, Button, Form, Loader, Placeholder, Checkbox } from 'semantic-ui-react';
import Flickity from 'react-flickity-component';
import './styles.scss';

function HomePage () {

    document.title = 'Mublin';

    let dispatch = useDispatch();

    let history = useHistory();

    const user = JSON.parse(localStorage.getItem('user'));

    let currentDate = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0].replace('T',' ')

    const currentYear = new Date().getFullYear()

    useEffect(() => {
        dispatch(userInfos.getUserProjects(user.id));
        dispatch(userInfos.getUserRolesInfoById(user.id));
        dispatch(userInfos.getUserLastConnectedFriends());
        dispatch(searchInfos.getSuggestedUsersResults());
    }, [user.id, dispatch]);

    const userInfo = useSelector(state => state.user)
    // const suggestedUsers = useSelector(state => state.search.suggestedUsers)

    const [showMain, setShowMain] = useState(true)
    const toggleMain = () => setShowMain(value => !value)

    const [showPortfolio, setShowPortfolio] = useState(true)
    const togglePortfolio = () => setShowPortfolio(value => !value)

    // const projects = useSelector(state => state.user.projects)

    const projectsMain = useSelector(state => state.user.projects).filter((project) => { return project.portfolio === 0 })

    const projectsPortfolio = useSelector(state => state.user.projects).filter((project) => { return project.portfolio === 1 })

    const projectsToShow = useSelector(state => state.user.projects).filter((project) => { return project.confirmed !== 0 && (showPortfolio) && project.portfolio === 1 || (showMain) && project.portfolio === 0 }).sort((a, b) => parseFloat(b.featured) - parseFloat(a.featured))

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
    }

    // START Event RSVP
    const [modalDeclineEvent, setModalDeclineEvent] = useState(false)
    const [modalAcceptEvent, setModalAcceptEvent] = useState(false)
    const [declineComment, setDeclineComment] = useState('Minha agenda estará comprometida nesta data')
    const [isEventLoading, setEventIsLoading] = useState(null)
    const submitInvitationResponse = (key,invitationId,response,response_modified,response_comments) => {
        setEventIsLoading(key)
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
                setEventIsLoading(null)
                setModalAcceptEvent(false)
                setModalDeclineEvent(false)
                setDeclineComment('Minha agenda estará comprometida nesta data')
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao atualizar convite. Tente novamente em instantes")
            })
        }, 400);
    }

    const [confirmPresence, setConfirmPresence] = useState(false)
    const [refuseInvitation, setRefuseInvitation] = useState(false)

    // END Event RSVP

    const undefinedAvatar = 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg';

    const cdnBaseURL = 'https://ik.imagekit.io/mublin';

    var today = new Date();

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
        <Spacer />
        <Container className='px-3 homepage'>
            <Grid centered>
                <Grid.Row columns={1} only='mobile'>
                    <Grid.Column mobile={16} tablet={16} computer={16}>
                        <div className='mt-0 mt-md-2'>
                            {userInfo.requesting ? (
                                <div style={{textAlign: 'center', width: '100%', height: '100px'}} className='py-3'>
                                    <Loader active inline='centered' />
                                </div>
                            ) : (
                                <>
                                {userInfo.lastConnectedFriends[0].username &&
                                    <>
                                        <Header disabled as='h5'>Conectados recentemente</Header>
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
                <Grid.Row columns={2} className='pt-0 pt-md-3'>
                    <Grid.Column mobile={16} tablet={16} computer={4} className="only-computer" >
                        <div style={{position:"-webkit-sticky",position:"sticky",display:"inline-table",width: '100%'}}>
                            { !userInfo.requesting ? ( 
                                <div className="miniProfile pb-2 mt-2">
                                    <a href={"/"+userInfo.username}>
                                        <Header as='h3'>
                                            <Image circular src={(!userInfo.requesting && userInfo.picture) ? 'https://ik.imagekit.io/mublin/tr:h-70,w-70,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture : undefinedAvatar} />
                                            <Header.Content>
                                                Olá, {userInfo.name}!
                                                {/* <Header.Subheader>@{userInfo.username}</Header.Subheader> */}
                                            </Header.Content>
                                        </Header>
                                    </a>
                                    <Header as='h5' textAlign='left' className='mt-3'>
                                        <Header.Subheader className='mt-1'>
                                            {userInfo.bio}
                                        </Header.Subheader>
                                    </Header>
                                    <Header as='h5' textAlign='left' className='mb-3 mt-2'>
                                        Principais atividades
                                        <Header.Subheader className='mt-1'>
                                            {userInfo.roles.map((role, key) =>
                                                <span key={key}>{role.icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+role.icon} width='13' height='13' style={{verticalAlign:'sub'}} />}{role.name}{key < (userInfo.roles.length-1) && ', '}</span>
                                            )}
                                        </Header.Subheader>
                                    </Header>
                                    <Header as='h5' textAlign='left' className='mt-3 mb-3'>
                                        Plano
                                        <Header.Subheader className='mt-1'>
                                            {userInfo.plan ? userInfo.plan.toUpperCase() : null} {userInfo.plan !== 'Pro' && <a href='/upgrade'>Me tornar PRO</a>}
                                        </Header.Subheader>
                                    </Header>
                                    <Header as='h5' textAlign='left' className='mt-3 mb-3'>
                                        {userInfo.projects ? userInfo.projects.length : null} projetos
                                        <Header.Subheader className='mt-1'>
                                            {userInfo.projects && 
                                                userInfo.projects.map((project, key) =>
                                                    <>{project.name}{key !== userInfo.projects.length - 1 && ', '}</>
                                                )
                                            }
                                        </Header.Subheader>
                                    </Header>
                                </div>
                            ) : (
                                <div className="feed-item-wrapper pb-3">
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
                                        </Placeholder.Paragraph>
                                    </Placeholder>
                                </div>
                            )}

                            {userInfo.lastConnectedFriends[0].username &&
                            <div className='feed-item-wrapper mt-0 mt-md-4 pb-2'>
                                {userInfo.requesting ? (
                                    <div style={{textAlign: 'center', width: '100%', height: '100px'}} className='py-3'>
                                        <Loader active inline='centered' />
                                    </div>
                                ) : (
                                    <>
                                    {userInfo.lastConnectedFriends[0].username &&
                                        <>
                                            <Header as='h5'>Conectados recentemente</Header>
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
                    <Grid.Column mobile={16} tablet={16} computer={12}>
                        <Header 
                            as='h2' 
                            className='mt-1 mb-2'
                        >
                            Meus Projetos
                        </Header>
                        <div className='pb-4'>
                            <Checkbox 
                                label={'Principais ('+projectsMain.length+')'}
                                checked={showMain}
                                onClick={toggleMain}
                                style={{fontSize:'12px'}}
                            />
                            <Checkbox 
                                // label={['Portfolio ' , '('+projectsPortfolio.length+') ' , <Icon name='tag' style={{fontSize:'10px'}} />]}
                                label={['Portfolio ' , '('+projectsPortfolio.length+')']}
                                checked={projectsPortfolio.length === 0 ? false : showPortfolio}
                                onClick={togglePortfolio}
                                style={{fontSize:'12px',marginLeft:'10px'}}
                                disabled={projectsPortfolio.length === 0 ? true : false}
                            />
                        </div>
                        { !userInfo.requesting ? (
                            projectsToShow.length ? (
                                <Card.Group>
                                    {projectsToShow.map((project, key) =>
                                    <>
                                        <Card 
                                            key={key}
                                            className='mb-2 defaultShadow'
                                            // color={(!project.yearEnd && project.ptid !== 7) ? 'green' : 'grey'}
                                        >
                                            {/* <Label circular color='red' icon='bell outline' floating as='a' title='Novas notificações' /> */}
                                            <Card.Content>
                                                <Image
                                                    floated='left'
                                                    size='tiny'
                                                    src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-160,w-160,c-maintain_ratio/'+project.picture : 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg'}
                                                    className='mb-0 cpointer'
                                                    onClick={() => history.push('/project/'+project.username)}
                                                    rounded
                                                />
                                                <Card.Header
                                                    className='cpointer'
                                                    onClick={() => history.push('/project/'+project.username)}
                                                    style={{fontSize:'17.4px',display:'table-cell'}}
                                                >
                                                    {project.name} {project.portfolio === 1 && <Icon name='tag' color='black' style={{fontSize:'11px',verticalAlign: 'text-top'}} title='Portfolio' />}
                                                </Card.Header>

                                                <div style={{fontSize:'11.5px'}}>
                                                    {project.ptname} {project.genre1 ? ' · '+project.genre1 : null }
                                                </div>

                                                <Card.Description style={{fontSize:'11.5px',display:'inline',verticalAlign:'middle'}}>
                                                    { project.confirmed === 1 ? ( <>{project.workTitle}</> ) : ( <><Icon className='mr-0' name='clock outline' />Pendente</> )}
                                                    <Label circular color={(project.yearLeftTheProject || project.yearEnd) ? 'red' : 'green'} empty size='mini' className='ml-2 mr-1' />
                                                    {(project.joined_in && (project.joined_in !== project.yearLeftTheProject)) ? ( 
                                                        <>
                                                            { !project.yearEnd ? ( 
                                                                project.joined_in +' ➜ '+(project.yearLeftTheProject ? project.yearLeftTheProject : 'atualmente')
                                                            ) : (
                                                                project.joined_in +' ➜ '+project.yearEnd
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {project.joined_in} {project.yearEnd && ' ➜ '+project.yearEnd}
                                                        </>
                                                    )}
                                                </Card.Description>
                                                <Card.Meta className='projectRoles mt-1 pb-1' style={{fontSize:'11.4px',color:'rgba(0,0,0,.68)'}}>
                                                    <Flickity
                                                        className={'carousel'}
                                                        style={{height: '200px'}}
                                                        elementType={'div'}
                                                        options={sliderOptions}
                                                        disableImagesLoaded={false}
                                                        reloadOnUpdate
                                                    >
                                                        {project.role1icon && <span style={{whiteSpace:'nowrap'}}><img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+project.role1icon} />{project.role1}</span>}{project.role2 && <span style={{whiteSpace:'nowrap'}}>, {project.role2icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+project.role2icon} />}{project.role2}</span>}{project.role3 && <span style={{whiteSpace:'nowrap'}}>, {project.role3icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+project.role3icon} />}{project.role3}</span>}
                                                    </Flickity>
                                                    {/* {project.role1 && <Label size='mini' style={{fontWeight:'500'}}>{project.role1icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+project.role1icon} />} {project.role1.length > 11 ? `${project.role1.substring(0, 11)}...` : project.role1}</Label>} {project.role2 && <Label size='mini' style={{fontWeight:'500'}}>{project.role2.length > 11 ? `${project.role2.substring(0, 11)}...` : project.role2}</Label>} {project.role3 && <Label size='mini' style={{fontWeight:'500'}}>{project.role3.length > 11 ? `${project.role3.substring(0, 11)}...` : project.role3}</Label>} */}
                                                </Card.Meta>
                                            </Card.Content>
                                            {(project.yearEnd && project.yearEnd <= currentYear) ? (
                                                <>
                                                <Card.Content style={{fontSize:'11.8px',color:'rgba(0,0,0,.68)'}}>
                                                    Projeto encerrado
                                                </Card.Content>
                                                <Card.Content style={{fontSize:'11.8px',color:'rgba(0,0,0,.68)'}}>
                                                Fundação: {project.yearFoundation} · Encerramento: {project.yearEnd}
                                                </Card.Content>
                                                </>
                                            ) : (
                                                <>
                                                    <Card.Content style={{fontSize:'11.8px',color:'rgba(0,0,0,.68)',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                                                        <Icon name='calendar alternate outline' title='Próximo evento' />
                                                        <div className='textEllipsis' style={{flexGrow:'2'}} title={project.nextEventTitle ? project.nextEventDateOpening + ' às ' + project.nextEventHourOpening.substr(0,5) + ' · ' + project.nextEventTitle  : null}>
                                                            {project.nextEventDateOpening ? <><strong>{project.nextEventDateOpening} às {project.nextEventHourOpening.substr(0,5)}</strong> · {project.nextEventTitle}</> : 'Nenhum evento programado'}
                                                        </div>
                                                        {(project.nextEventDateOpening && project.nextEventInvitationId) && 
                                                            <div style={{display:'flex',paddingLeft:'10px'}}>
                                                                <Icon name='thumbs up outline' className='cpointer' onClick={() => setModalAcceptEvent(key)} color={project.nextEventInvitationResponse === 1 ? 'green' : null} title='Aceitar convite' />
                                                                <Icon name='thumbs down outline' className='cpointer ml-1' onClick={() => setModalDeclineEvent(key)} color={project.nextEventInvitationResponse === 0 ? 'red' : null} title='Recusar convite' />
                                                            </div>
                                                        }
                                                    </Card.Content>
                                                    <Card.Content style={{fontSize:'11.8px',color:'rgba(0,0,0,.68)'}}>
                                                        <Icon name='bullseye' title='Meta mais recente' />Nenhuma meta cadastrada
                                                    </Card.Content>
                                                </>
                                            )}
                                        </Card>
                                        <Modal
                                            size='mini'
                                            open={modalAcceptEvent === key}
                                            onClose={() => setModalAcceptEvent(false)}
                                        >
                                            <Modal.Content>
                                                <div className='mb-3'>
                                                    Confirma sua presença no evento "<span style={{fontWeight:'500'}}>{project.nextEventTitle}</span>" de {project.name} em <nobr>{project.nextEventDateOpening}?</nobr>
                                                </div>
                                            </Modal.Content>
                                            <Modal.Actions>
                                                <Button size='small' onClick={() => setModalAcceptEvent(false)}>
                                                    Voltar
                                                </Button>
                                                <Button size='small' positive onClick={() => submitInvitationResponse(key, project.nextEventInvitationId, 1, currentDate, '')} loading={isEventLoading === key && true}>
                                                    Confirmar
                                                </Button>
                                            </Modal.Actions>
                                        </Modal>
                                        <Modal
                                            size='mini'
                                            open={modalDeclineEvent === key}
                                            onClose={() => setModalDeclineEvent(false)}
                                        >
                                            <Modal.Content>
                                                <div className='mb-3'>
                                                    Confirme sua ausência no evento "<span style={{fontWeight:'500'}}>{project.nextEventTitle}</span>" de {project.name} em <nobr>{project.nextEventDateOpening}</nobr>
                                                </div>
                                                <Form>
                                                    <Form.TextArea 
                                                        label='Motivo do declínio:' 
                                                        placeholder='Ex: Minha agenda estará comprometida nesta data...'
                                                        value={declineComment}
                                                        onChange={e => setDeclineComment(e.target.value)}
                                                        rows={3}
                                                        maxLength={300}
                                                    />
                                                </Form>
                                            </Modal.Content>
                                            <Modal.Actions>
                                                <Button size='small' onClick={() => setModalDeclineEvent(false)}>
                                                    Voltar
                                                </Button>
                                                <Button size='small' negative onClick={() => submitInvitationResponse(key, project.nextEventInvitationId, 0, currentDate, declineComment)} loading={isEventLoading === key && true}>
                                                    Declinar
                                                </Button>
                                            </Modal.Actions>
                                        </Modal>
                                    </>
                                    )}
                                </Card.Group>
                            ) : (
                                <Header as='h3' className='my-0'>
                                    <Header.Content>
                                        <Header.Subheader as='a'>Nenhum projeto encontrado. <Link to="/new">Criar novo</Link></Header.Subheader>
                                    </Header.Content>
                                </Header>
                            )
                        ) : (
                            <List horizontal>
                                <List.Item as='div'>
                                    <Placeholder style={{ height: 100, width: 100 }}>
                                        <Placeholder.Image />
                                        <Placeholder.Line length='very short' />
                                    </Placeholder>
                                </List.Item>
                                <List.Item as='div'>
                                    <Placeholder style={{ height: 100, width: 100 }}>
                                        <Placeholder.Image />
                                    </Placeholder>
                                </List.Item>
                                <List.Item as='div'>
                                    <Placeholder style={{ height: 100, width: 100 }}>
                                        <Placeholder.Image />
                                    </Placeholder>
                                </List.Item>
                            </List>
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>        
        <Spacer />
        <FooterMenuMobile />
        </>
    );
};

export default HomePage;