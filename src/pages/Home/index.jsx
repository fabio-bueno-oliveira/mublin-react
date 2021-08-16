import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import { userInfos } from '../../store/actions/user';
import { searchInfos } from '../../store/actions/search';
import { Container, Segment, Header, Grid, Card, Image, Icon, Label, List, Modal, Button, Form, Loader, Placeholder, Checkbox } from 'semantic-ui-react';
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
    const [isEventLoading, setEventIsLoading] = useState({key: null, response: null})
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
                                        <Header as='h4'>Conectados recentemente</Header>
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
                                <div className="pb-2 mt-2">
                                    <Image centered circular src={(!userInfo.requesting && userInfo.picture) ? 'https://ik.imagekit.io/mublin/tr:h-70,w-70,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture : undefinedAvatar} />
                                    <Header as='h3' textAlign='center' className='mt-2'>
                                        <Header.Content>
                                            Olá, {userInfo.name}!
                                            <Header.Subheader className='mt-2'>
                                                {userInfo.roles.map((role, key) =>
                                                    <span key={key}>{role.icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+role.icon} width='13' height='13' style={{verticalAlign:'sub'}} />}{role.name}{key < (userInfo.roles.length-1) && ', '}</span>
                                                )}
                                            </Header.Subheader>
                                        </Header.Content>
                                    </Header>
                                    <Header as='h5' textAlign='center' className='mt-3'>
                                        <Header.Subheader className='mt-1'>
                                            {userInfo.bio}
                                        </Header.Subheader>
                                    </Header>
                                    <Header as='h5' textAlign='center' className='mt-3 mb-3'>
                                        Plano
                                        <Header.Subheader className='mt-1'>
                                            {userInfo.plan ? userInfo.plan.toUpperCase() : null} {userInfo.plan !== 'Pro' && <a href='/upgrade'>Me tornar PRO</a>}
                                        </Header.Subheader>
                                    </Header>
                                    <Header as='h5' textAlign='center' className='mt-3'>
                                        {userInfo.projects ? userInfo.projects.length : null} projetos
                                        {!!userInfo.projects && 
                                        <Header.Subheader className='mt-1'>
                                            {userInfo.projects && 
                                                userInfo.projects.map((project, key) =>
                                                    <>{project.name}{key !== userInfo.projects.length - 1 && ', '}</>
                                                )
                                            }
                                        </Header.Subheader>
                                        }
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
                                label={['Portfolio ' , '('+projectsPortfolio.length+')']}
                                checked={projectsPortfolio.length === 0 ? false : showPortfolio}
                                onClick={togglePortfolio}
                                style={{fontSize:'12px',marginLeft:'10px'}}
                                disabled={projectsPortfolio.length === 0 ? true : false}
                            />
                        </div>
                        { !userInfo.requesting ? (
                            projectsToShow.length ? (
                                <div>
                                    {projectsToShow.map((project, key) =>
                                    <>
                                        <Segment.Group key={key}>
                                            {project.confirmed === 1 ? ( null ) : ( <Label attached='top' color='black' style={{fontWeight:'300'}}><Icon className='mr-0' name='clock outline' /> Pendente de aprovação</Label> )}
                                            <Segment>
                                                <Header as='h3' className='mb-2'>
                                                    <Image rounded src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-160,w-160,c-maintain_ratio/'+project.picture : 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg'} />
                                                    <Header.Content>
                                                        {project.name}
                                                        <Header.Subheader>{project.ptname} {project.genre1 ? ' · '+project.genre1 : null }</Header.Subheader>
                                                    </Header.Content>
                                                </Header>
                                                {project.labelShow === 1 && 
                                                    <Label tag color={project.labelColor} size="tiny" style={{ fontWeight: 'normal' }}>{project.labelText}</Label>
                                                }
                                                <List divided relaxed size='tiny'>
                                                    {!project.yearEnd ? ( 
                                                        <>
                                                            <List.Item>
                                                                <List.Icon name='calendar alternate outline' size='large' verticalAlign='middle' />
                                                                <List.Content>
                                                                    <List.Header className='itemTitle'>Próximo evento</List.Header>
                                                                    <List.Description style={{maxWidth:'90%'}}>
                                                                        <div className='textEventEllipsis'>
                                                                            {project.nextEventDateOpening ? <><strong>{project.nextEventDateOpening} às {project.nextEventHourOpening.substr(0,5)}</strong> · {project.nextEventTitle}</> : 'Nenhum evento programado'}
                                                                        </div>
                                                                        {(project.nextEventDateOpening && project.nextEventInvitationId) && 
                                                                            <div style={{display:'flex',marginTop:'5px'}}>
                                                                                <Button size='mini' icon onClick={project.nextEventInvitationResponse === 1 ? () => submitInvitationResponse(key,project.nextEventInvitationId,2,currentDate,'') : () => setModalAcceptEvent(key)} basic={project.nextEventInvitationResponse === 1 ? false : true} color={project.nextEventInvitationResponse === 1 ? 'green' : null} className='mr-1' loading={isEventLoading.key === key && isEventLoading.response === 2 ? true : false}><Icon name='thumbs up outline' />Irei</Button>
                                                                                <Button size='mini' icon basic={project.nextEventInvitationResponse === 0 ? false : true} color={project.nextEventInvitationResponse === 0 ? 'red' : null} onClick={project.nextEventInvitationResponse === 0 ? () => submitInvitationResponse(key,project.nextEventInvitationId,2,currentDate,'') : () => setModalDeclineEvent(key)} loading={isEventLoading.key === key && isEventLoading.response === 2 ? true : false}><Icon name='thumbs down outline' />Não irei</Button>
                                                                                <Button size='mini' basic icon><Icon name='plus' /> Infos</Button>
                                                                            </div>
                                                                        }
                                                                    </List.Description>
                                                                </List.Content>
                                                            </List.Item>
                                                            <List.Item>
                                                                <List.Icon name='flag checkered' size='large' verticalAlign='middle' className='pr-1' />
                                                                <List.Content style={{paddingLeft:'5px'}}>
                                                                    <List.Header className='itemTitle'>Próxima meta geral</List.Header>
                                                                    <List.Description>Nenhuma meta cadastrada</List.Description>
                                                                </List.Content>
                                                            </List.Item>
                                                            <List.Item>
                                                                <List.Icon name='bookmark outline' size='large' verticalAlign='middle' />
                                                                <List.Content>
                                                                    <List.Header className='itemTitle'>Minha lição de casa</List.Header>
                                                                    <List.Description>Nenhuma atividade pendente pra mim</List.Description>
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
                                            </Segment>
                                            <Segment secondary>
                                                <Header as='h5' className='mt-0'>
                                                    <Image circular src={(!userInfo.requesting && userInfo.picture) ? 'https://ik.imagekit.io/mublin/tr:h-70,w-70,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture : undefinedAvatar} />
                                                    <Header.Content className='projectRoles'>
                                                        <Header.Subheader className='mb-1'>
                                                            <span className='mr-1'>{project.workTitle}</span>
                                                            <Label circular color={(project.yearLeftTheProject || project.yearEnd) ? 'red' : 'green'} empty size='mini' className='ml-0 mr-1' />
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
                                                        </Header.Subheader>
                                                        {project.role1icon && <Label size='mini' image style={{whiteSpace:'nowrap'}}><img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+project.role1icon} width='13px' />{project.role1}</Label>}{project.role2 && <Label size='mini' image style={{whiteSpace:'nowrap'}}>{project.role2icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+project.role2icon} />}{project.role2}</Label>}{project.role3 && <Label size='mini' image style={{whiteSpace:'nowrap'}}>{project.role3icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+project.role3icon} />}{project.role3}</Label>}
                                                    </Header.Content>
                                                </Header>
                                            </Segment>
                                        </Segment.Group>
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
                                                <Button size='small' positive onClick={() => submitInvitationResponse(key, project.nextEventInvitationId, 1, currentDate, '')} loading={isEventLoading.key === key && true}>
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
                                                <Button size='small' negative onClick={() => submitInvitationResponse(key, project.nextEventInvitationId, 0, currentDate, declineComment)} loading={isEventLoading.key === key ? true : false}>
                                                    Declinar
                                                </Button>
                                            </Modal.Actions>
                                        </Modal>
                                    </>
                                    )}
                                </div>
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