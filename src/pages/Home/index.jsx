import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import { userInfos } from '../../store/actions/user';
import { searchInfos } from '../../store/actions/search';
import { miscInfos } from '../../store/actions/misc';
import { Container, Header, Tab, Grid, Feed, Image, Icon, Label, List, Menu, Popup, Loader } from 'semantic-ui-react';
import Flickity from 'react-flickity-component';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import LogoMublin from '../../assets/img/logos/logo-mublin-circle-black.png'
import './styles.scss';

function HomePage () {

    document.title = 'Mublin'

    let dispatch = useDispatch();

    let history = useHistory();

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        dispatch(userInfos.getUserProjects(user.id));
        dispatch(userInfos.getUserLastConnectedFriends());
        dispatch(searchInfos.getSuggestedUsersResults());
        dispatch(miscInfos.getFeed());
    }, [user.id, dispatch]);

    const userInfo = useSelector(state => state.user)
    const suggestedUsers = useSelector(state => state.search.suggestedUsers)
    const userProjects = useSelector(state => state.user.projects)
    const projectsMain = userProjects.filter((project) => { return project.portfolio === 0 && project.confirmed !== 0 }).sort((a, b) => parseFloat(b.featured) - parseFloat(a.featured))
    const projectsPortfolio = userProjects.filter((project) => { return project.portfolio === 1 && project.confirmed !== 0 }).sort((a, b) => parseFloat(b.featured) - parseFloat(a.featured))
    const feed = useSelector(state => state.feed)

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

    const [likeFeedPostLoading, setLikeFeedPostLoading] = useState(null)
    const likeFeedPost = (feedId) => {
        setLikeFeedPostLoading(feedId)
        fetch('https://mublin.herokuapp.com/feed/'+feedId+'/like', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            }
        })
        .then(() => {
            dispatch(miscInfos.getFeed());
            setLikeFeedPostLoading(null)
        }).catch(err => {
            setLikeFeedPostLoading(null)
            console.error(err)
            alert("Ocorreu um erro ao curtir a postagem")
        })
    }

    const [unlikeFeedPostLoading, setUnlikeFeedPostLoading] = useState(null)
    const unlikeFeedPost = (feedId) => {
        setUnlikeFeedPostLoading(feedId)
        fetch('https://mublin.herokuapp.com/feed/'+feedId+'/unlike', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            }
        })
        .then((response) => {
            dispatch(miscInfos.getFeed());
            setUnlikeFeedPostLoading(null)
        }).catch(err => {
            setUnlikeFeedPostLoading(null)
            console.error(err)
            alert("Ocorreu um erro ao curtir a postagem")
        })
    }

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
        <Spacer />
        <Container className='px-3'>
            <Grid centered>
                <Grid.Row columns={2}>
                    <Grid.Column mobile={16} tablet={16} computer={12}>
                        
                        {/* <Header size='medium' className='mt-1'>
                            <Header.Content className='mb-1' style={{opacity:"0.7"}}>
                                Meus Projetos ({userProjects.length})
                            </Header.Content>
                        </Header> */}
                        <Tab defaultActiveIndex={0} panes={
                            [
                                {
                                menuItem: (
                                    <Menu.Item key='main'>
                                        {/* <Icon name='bullseye' color='green' className="mr-2" /> Principais ({projectsMain.length}) */}
                                        Meus Projetos Principais ({projectsMain.length})
                                    </Menu.Item>
                                ),
                                render: () => 
                                    <Tab.Pane 
                                        loading={userInfo.requesting} 
                                        attached={true} 
                                        // as="div" 
                                        // className='carousel-wrapper'
                                    >
                                        <Flickity
                                            className={'carousel'}
                                            elementType={'div'}
                                            options={sliderOptions}
                                            disableImagesLoaded={false}
                                            reloadOnUpdate
                                        >
                                            { !userInfo.requesting ? (
                                                projectsMain.length ? (
                                                    projectsMain.map((project, key) =>
                                                        <div className="carousel-cell" key={key} style={project.confirmed === 2 ? {opacity:'0.6'} : {}}>
                                                            <Link to={{ pathname: '/project/'+project.username }}>
                                                                { !!project.featured && 
                                                                    <Label color='black' floating size='mini' style={{top: '0', left: '20%',width:'fit-content'}}>
                                                                        <Icon name='star' color='yellow' className='mr-0' />
                                                                    </Label>
                                                                }
                                                                {project.picture ? (
                                                                    <Image src={'https://ik.imagekit.io/mublin/projects/tr:h-85,w-95,c-maintain_ratio/'+project.picture} rounded />
                                                                ) : (
                                                                    <Image src={'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg'} height='85' width='85' rounded />
                                                                )}
                                                                <Header as='h5' className='mt-2 mb-0'>
                                                                    <Header.Content>
                                                                        {project.name}
                                                                        <Header.Subheader style={{fontSize:'11.5px'}}>
                                                                            {project.ptname}
                                                                        </Header.Subheader>
                                                                    </Header.Content>
                                                                </Header>
                                                                { project.confirmed === 1 ? (
                                                                    <div className="mt-2" style={{fontWeight: '400',fontSize: '11px', color: 'black', opacity: '0.8'}}>
                                                                        <Icon name={project.workIcon} />{project.workTitle}
                                                                    </div>
                                                                ) : (
                                                                    <div className="mt-2" style={{fontWeight: '400',fontSize: '11px', color: 'black', opacity: '0.8'}}>
                                                                        <Icon name='clock outline' />Aguardando
                                                                    </div>
                                                                )}
                                                            </Link>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="carousel-cell">
                                                        <Image src={'https://ik.imagekit.io/mublin/misc/square-sad-music_SeGz8vs_2A.jpg'} height='85' width='85' rounded />
                                                        <h5 className="ui header mt-2 mb-0">
                                                            <div className="sub header mt-1">Sem principais</div>
                                                        </h5>
                                                    </div> 
                                                )
                                            ) : (
                                                <div style={{textAlign: 'center', width: '100%'}}>
                                                    <Icon loading name='spinner' size='big' />
                                                </div>
                                            )}
                                        </Flickity>
                                    </Tab.Pane>,
                                }, 
                                {
                                menuItem: (
                                    <Menu.Item key='portfolio'>
                                        {/* <Icon name='tags' className="mr-2" /> Portfolio ({projectsPortfolio.length}) */}
                                        Portfolio ({projectsPortfolio.length})
                                    </Menu.Item>
                                    ),
                                render: () => 
                                    <Tab.Pane 
                                        loading={userInfo.requesting} 
                                        attached={true} 
                                        // as='div' 
                                        // className='carousel-wrapper'
                                    >
                                        <Flickity
                                            className={'carousel'}
                                            elementType={'div'}
                                            options={sliderOptions}
                                            disableImagesLoaded={false}
                                            reloadOnUpdate
                                        >
                                            { !userInfo.requesting ? (
                                                projectsPortfolio.length ? (
                                                    projectsPortfolio.map((project, key) =>
                                                        <div className="carousel-cell" key={key}>
                                                            <Link to={{ pathname: '/project/'+project.username }}>
                                                                { project.yearLeftTheProject && 
                                                                    <Label color='black' floating size='mini' style={{top: '0', left: '20%',width:'fit-content'}}>
                                                                        {project.joined_in+' a '+project.yearLeftTheProject}
                                                                    </Label>
                                                                }
                                                                {project.picture ? (
                                                                    <Image src={'https://ik.imagekit.io/mublin/projects/tr:h-85,w-95,c-maintain_ratio/'+project.picture} rounded />
                                                                ) : (
                                                                    <Image src={'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg'} height='85' width='85' rounded />
                                                                )}
                                                                <Header as='h5' className='mt-2 mb-0'>
                                                                    <Header.Content>
                                                                        {project.name}
                                                                        <Header.Subheader style={{fontSize:'11.5px'}}>
                                                                            {project.ptname}
                                                                        </Header.Subheader>
                                                                    </Header.Content>
                                                                </Header>
                                                                { project.confirmed === 1 ? (
                                                                    <div className="mt-2" style={{fontWeight: '400',fontSize: '11px', color: 'black', opacity: '0.8'}}>
                                                                        <Icon name={project.workIcon} />{project.workTitle}
                                                                    </div>
                                                                ) : (
                                                                    <div className="mt-2" style={{fontWeight: '400',fontSize: '11px', color: 'black', opacity: '0.8'}}>
                                                                        <Icon name='clock outline' />Aguardando
                                                                    </div>
                                                                )}
                                                            </Link>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="carousel-cell">
                                                        <Image src={'https://ik.imagekit.io/mublin/misc/square-sad-music_SeGz8vs_2A.jpg'} height='85' width='85' rounded />
                                                        <h5 className="ui header mt-2 mb-0">
                                                            <div className="sub header mt-1">Nada aqui</div>
                                                        </h5>
                                                    </div> 
                                                )
                                            ) : (
                                                <div style={{textAlign: 'center', width: '100%'}}>
                                                    <Icon loading name='spinner' size='big' />
                                                </div>
                                            )}
                                        </Flickity>
                                    </Tab.Pane>,
                                }
                            ]
                        }
                        />
                        
                        <div className='carousel-wrapper mt-4 mt-md-4'>
                            <Header size='small' className="mb-3 ml-0 ml-md-2">
                                <Header.Content style={{opacity:"0.7"}}>
                                    Conectados recentemente
                                </Header.Content>
                            </Header>
                            <Flickity
                                className={'carousel'}
                                elementType={'div'}
                                options={sliderOptions}
                                disableImagesLoaded={false}
                                reloadOnUpdate
                            >
                                { !userInfo.requesting ? (
                                    userInfo.lastConnectedFriends.map((friend, key) =>
                                        <div className="friends-carousel-cell" key={key}>
                                            <Link to={{ pathname: '/'+friend.username }}>
                                                {friend.picture ? (
                                                    <Image src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max,c-maintain_ratio/users/avatars/'+friend.id+'/'+friend.picture} rounded size='tiny' />
                                                ) : (
                                                    <Image src={'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'} rounded size='tiny' />
                                                )}
                                                <Header as='h5' textAlign='center' className='mt-2 mb-0'>
                                                    <Header.Content title={friend.username}>
                                                        {/* {friend.username} */}
                                                        {(friend.username.length > 9) ? friend.username.substr(0,8) + '...' : friend.username}
                                                    </Header.Content>
                                                </Header>
                                            </Link>
                                        </div>
                                    )
                                ) : (
                                    <div style={{textAlign: 'center', width: '100%'}}>
                                        <Loader active inline='centered' className='mb-4' />
                                    </div>
                                )}
                            </Flickity>

                            <div className='userSuggestionsCarouselMobile'>
                                <Header size='tiny' className="mt-3 mb-0 ml-0 ml-md-2">
                                    <Header.Content style={{opacity:"0.7"}}>
                                        Sugestões para seguir
                                    </Header.Content>
                                </Header>
                                <Flickity
                                    className={'mt-2 pb-0 pb-md-2'}
                                    elementType={'div'}
                                    options={sliderOptions}
                                    disableImagesLoaded={false}
                                    reloadOnUpdate
                                >
                                    {suggestedUsers.filter((user) => { return user.picture }).map((user, key) =>
                                        <div className='pr-3' key={key} style={{display:'flex', alignItems:'center'}}>
                                            <Image as='a' href={'/'+user.username} src={user.picture ? user.picture : 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'} avatar />
                                            <span style={{fontSize:'11.8px'}}>{user.username}</span>
                                        </div>
                                    )}
                                </Flickity>
                            </div>

                        </div>

                        {!feed.error ? (
                            <Feed className='pt-3 carousel-wrapper'>
                                <Header size='small' className="mb-3 ml-0 ml-md-2">
                                    <Header.Content style={{opacity:"0.7"}}>
                                        Feed
                                    </Header.Content>
                                </Header>
                                {feed.requesting ? (
                                    <div>
                                        <Loader active inline='centered' className='mb-4' />
                                    </div>
                                ) : (
                                    <>
                                    {feed.list.map((item, key) =>
                                        <Feed.Event key={key} className='mb-3 ml-0 ml-md-2'>
                                            <Feed.Label style={{cursor:'pointer'}} onClick={() => history.push('/'+item.relatedUserUsername)}>
                                                { item.relatedUserPicture ? (
                                                    <img src={item.relatedUserPicture} alt={'Foto de '+item.relatedUserName} />
                                                ) : (
                                                    <img src='https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_Kblh5CBKPp.jpg' />
                                                )}
                                                {item.relatedUserPlan === 'Pro' && <Label size="mini" className="ml-2 p-1">Pro</Label>}
                                            </Feed.Label>
                                            <Feed.Content className='mt-1'>
                                                {feed.requesting ? (
                                                    <Feed.Date style={{fontSize:'12px',fontWeight:'500'}}>
                                                        Carregando...
                                                    </Feed.Date>
                                                ) : (
                                                    <Feed.Date style={{fontSize:'12px',fontWeight:'500'}} title={Date(item.created)}>
                                                        há {formatDistance(new Date(item.created * 1000), new Date(), {locale:pt})}
                                                    </Feed.Date>
                                                )}
                                                <Feed.Summary>
                                                    <Feed.User style={{fontWeight:'600'}} onClick={() => history.push('/'+item.relatedUserUsername)}>{item.relatedUserName+' '+item.relatedUserLastname}</Feed.User> <span style={{fontWeight:'500'}}>{item.action}</span>
                                                </Feed.Summary>
                                                { (item.categoryId === 8) && 
                                                    <Feed.Extra text content={item.extraText} />
                                                }
                                                {!feed.requesting &&
                                                    <Feed.Meta>
                                                        <Feed.Like onClick={!item.likedByMe ? () => likeFeedPost(item.id) : () => unlikeFeedPost(item.id)}>
                                                            <Icon loading={likeFeedPostLoading === item.id || unlikeFeedPostLoading === item.id} name={(likeFeedPostLoading === item.id || unlikeFeedPostLoading === item.id) ? 'spinner' : 'like'} color={item.likedByMe ? 'red' : ''}/>
                                                        </Feed.Like> {item.likes}
                                                    </Feed.Meta>
                                                }
                                            </Feed.Content>
                                        </Feed.Event>
                                    )}
                                    <Feed.Event className='mb-3'>
                                        <Feed.Label>
                                            <img src={LogoMublin} alt='Mublin' />
                                        </Feed.Label>
                                        <Feed.Content className='mt-1'>
                                            <Feed.Date style={{fontSize:'12px',fontWeight:'500'}}>
                                                há {formatDistance(new Date('2021-03-04'), new Date(), {locale:pt})}
                                            </Feed.Date>
                                            <Feed.Summary>
                                                <Feed.User style={{fontWeight:'600',cursor:'default'}}>Mublin</Feed.User> <span style={{fontWeight:'500'}}>escreveu</span>
                                            </Feed.Summary>
                                            <Feed.Extra text content="Bem-vindo à versão Beta do Mublin! Você faz parte de um seleto grupo de pessoas que estão fazendo parte dos primeiros testes neste pré-lançamento. Este é um espaço feito para trazer mais facilidade à rotina de pessoas que amam música e que estão de alguma forma envolvidos com projetos de música. Esperamos que goste!" />
                                        </Feed.Content>
                                    </Feed.Event>
                                    </>
                                )}
                            </Feed>
                        ) : (
                            <Header as='h5'>
                                <Icon name='meh outline' />
                                Nada por aqui! Comece a seguir pessoas para visualizar as interações no Feed
                            </Header>
                        )}
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={16} computer={4} className="only-computer">
                        { !userInfo.requesting && 
                            <>
                                <a href={"/"+userInfo.username}>
                                    <Header as='h3'>
                                        { (!userInfo.requesting && userInfo.picture) ? (
                                            <Image circular
                                                src={'https://ik.imagekit.io/mublin/users/avatars/'+userInfo.id+'/'+userInfo.picture}
                                            />
                                        ) : (
                                            <Image circular
                                                src={'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'}
                                            />
                                        )}
                                        <Header.Content>
                                            Olá, {userInfo.name}!
                                            <Header.Subheader>@{userInfo.username}</Header.Subheader>
                                        </Header.Content>
                                    </Header>
                                </a>
                                <Header as='h5'>Sugestões para seguir</Header>
                                <List relaxed className='mt-3'>
                                    {suggestedUsers.map((user, key) =>
                                        <List.Item key={key}>
                                            <Popup
                                                content={user.totalProjects + (user.totalProjects === 1 ? ' projeto' : ' projetos') + (user.availabilityTitle ? ' · ' + user.availabilityTitle : '')}
                                                header={user.username}
                                                size='tiny'
                                                trigger={<Image src={user.picture ? user.picture : 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'} avatar className='cpointer' onClick={() => history.push('/'+user.username)} />}
                                            />
                                            <List.Content>
                                                <Popup
                                                    content={user.totalProjects + (user.totalProjects === 1 ? ' projeto' : ' projetos') + (user.availabilityTitle ? ' · ' + user.availabilityTitle : '')}
                                                    header={user.username}
                                                    size='tiny'
                                                    trigger={<List.Header as='a' href={'/'+user.username}>{user.name+' '+user.lastname} {!!user.verified && <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' />}</List.Header>}
                                                />
                                                {/* <List.Header as='a' href={'/'+user.username}>{user.name+' '+user.lastname} {!!user.verified && <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' />}</List.Header> */}
                                                <List.Description style={{fontSize:"11px"}}>
                                                    {user.instrumentalist && user.mainRole+' · '} {user.city+', '+user.region}
                                                </List.Description>
                                            </List.Content>
                                        </List.Item>
                                    )}
                                </List>
                            </>
                        }
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