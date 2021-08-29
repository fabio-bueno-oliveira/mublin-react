import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import { userInfos } from '../../store/actions/user';
import { searchInfos } from '../../store/actions/search';
import { Header, Grid, Image, Icon, Label, List, Button, Input, Card, Loader, Placeholder, Dropdown } from 'semantic-ui-react';
import Flickity from 'react-flickity-component';
import Masonry from 'react-masonry-css';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import './styles.scss';

function HomePage () {

    document.title = 'Mublin';

    let dispatch = useDispatch();

    // let history = useHistory();

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

    const projects = useSelector(state => state.user.projects)

    const [filteredByName, setFilteredByName] = useState('')

    const filteredProjects = filteredByName ? projects.filter((project) => { return project.name.toLowerCase().includes(filteredByName.toLowerCase()) || project.username.toLowerCase().includes(filteredByName.toLowerCase()) }) : projects

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

    const undefinedAvatar = 'https://ik.imagekit.io/mublin/tr:h-70,w-70,c-maintain_ratio/sample-folder/avatar-undefined_Kblh5CBKPp.jpg';

    const cdnBaseURL = 'https://ik.imagekit.io/mublin';

    var today = new Date();

    const breakpointColumnsObj = {
        default: 3,
        1300: 3,
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
                </Placeholder.Paragraph>
            </Placeholder>
        </Card.Content>
    </Card>

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
        <Grid centered className='px-3 homepage'>
            <Grid.Row columns={1} only='mobile'>
                <Grid.Column mobile={16} tablet={16} computer={16} className='pr-0'>
                    <div className='mt-4 mt-md-2 pt-5 mt-md-0'>
                        {userInfo.requesting ? (
                            <div style={{textAlign: 'center', width: '100%', height: '100px'}} className='py-3'>
                                <Loader active inline='centered' />
                            </div>
                        ) : (
                            <>
                            {userInfo.lastConnectedFriends[0].username &&
                                <>
                                    <Header as='h4' className='mt-2'>Contatos conectados recentemente</Header>
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
                        { !userInfo.requesting ? ( 
                            <div className="pb-2 mt-3">
                                <Image centered circular src={(!userInfo.requesting && userInfo.picture) ? 'https://ik.imagekit.io/mublin/tr:h-70,w-70,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture : undefinedAvatar} />

                                <Header as='h3' textAlign='center' className='mt-3'>
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
                        <Header 
                            as='h2'
                            className='mt-0 mt-md-3 mb-3'
                            style={{display:'flex',alignItems:'flex-end'}}
                        >
                            Meus Projetos {!userInfo.requesting ? <Label content={projects.length} /> : null}
                        </Header>
                        <div className='pb-4'>
                            <Input 
                                icon='search'
                                iconPosition='left'
                                placeholder='Filtrar por nome...'
                                transparent
                                value={filteredByName}
                                onChange={e => setFilteredByName(e.target.value)}
                                size='big'
                            />
                        </div>
                    </div>
                    {!userInfo.requesting ? (
                        filteredProjects.length ? (
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
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
                                                        <Header.Subheader className='categoryLabel'>
                                                            <Icon name='folder open outline' />{project.portfolio ? 'Portfolio' : 'Projetos principais'}{project.cityName ? <><span>·</span><Icon name='map marker alternate' />{project.cityName}, {project.regionUf}</> : null }
                                                        </Header.Subheader>
                                                    </Header.Content>
                                                </Header>
                                                <div>
                                                    <Dropdown icon='ellipsis horizontal' direction='left'>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item icon='setting' text='Acessar Painel' />
                                                            <Dropdown.Item icon='eye' text='Acessar Perfil' />
                                                            <Dropdown.Item icon='user outline' text='Gerenciar participação' />
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
                                                {project.role1}{project.role2 && ', '+project.role2}{project.role3 && ', '+project.role3} {(project.id && !project.yearLeftTheProject && !project.yearEnd) ? '· desde ' + project.joined_in : null} {(project.id && project.yearLeftTheProject) ? '· até ' + project.yearLeftTheProject : null}
                                            </div>
                                            <div className='mt-1 badges'>
                                                <Label circular size="tiny"><Icon name={project.workIcon}  className='mr-0' color='black' /> {project.workTitle}</Label> {!!(project.active && !project.yearLeftTheProject && !project.yearEnd) && <Label circular size="tiny"><Icon color='green' name='check circle' className='mr-0' /> Ativo atualmente no projeto</Label>} {!!project.yearLeftTheProject && <Label color='red' circular size="tiny"><Icon name='sign out' className='mr-0' /> Deixei o projeto em {project.yearLeftTheProject}</Label>} {!!(project.touring && !project.yearLeftTheProject && !project.yearEnd) && <Label circular size="tiny"><Icon name='road' color='blue' className='mr-0' /> Em turnê com este projeto</Label>} {!!project.admin && <Label circular size="tiny"><Icon name='wrench' color='black' className='mr-0' /> Administrador</Label>} {!!(!project.yearLeftTheProject && !project.yearEnd && (currentYear - project.joined_in) >= 10) && <Label circular size="tiny"><Icon name='star' color='yellow' className='mr-0' /> há + de 10 anos ativo no projeto!</Label>} 
                                            </div>
                                        </Card.Content>
                                        <Card.Content>
                                            <Card.Description>
                                                <List divided relaxed='very'>
                                                    {!project.yearEnd ? ( 
                                                        <>
                                                            <List.Item>
                                                                <List.Icon name='bullhorn' size='large' verticalAlign='middle' className='pr-1' />
                                                                <List.Content style={{paddingLeft:'5px'}}>
                                                                    <List.Header className='itemTitle'>Recado do Líder</List.Header>
                                                                    <List.Description>
                                                                        Nenhum recado disponível
                                                                    </List.Description>
                                                                </List.Content>
                                                            </List.Item>
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
                            <Header as='h3' className='my-0'>
                                <Header.Content>
                                    <Header.Subheader as='a'>Nenhum projeto para exibir por aqui. <Link to="/new">Criar novo?</Link></Header.Subheader>
                                </Header.Content>
                            </Header>
                        )
                    ) : (
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column"
                        >
                            {cardPlaceholder}
                            {cardPlaceholder}
                            {cardPlaceholder}
                        </Masonry>
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