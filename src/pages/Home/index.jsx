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
import { Container, Header, Grid, Card, Feed, Image, Icon, Label, List, Popup, Loader, Placeholder, Segment, Form, Button, Modal, Checkbox, Confirm } from 'semantic-ui-react';
import Flickity from 'react-flickity-component';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import LogoMublinCircular from '../../assets/img/logos/logo-mublin-circle-black.png';
import {IKUpload} from "imagekitio-react";
import './styles.scss';

function HomePage () {

    document.title = 'Mublin'

    let dispatch = useDispatch();

    let history = useHistory();

    const user = JSON.parse(localStorage.getItem('user'));

    const currentYear = new Date().getFullYear()

    useEffect(() => {
        dispatch(userInfos.getUserProjects(user.id));
        dispatch(userInfos.getUserLastConnectedFriends());
        dispatch(searchInfos.getSuggestedUsersResults());
        dispatch(miscInfos.getFeed());
    }, [user.id, dispatch]);

    const userInfo = useSelector(state => state.user)
    const suggestedUsers = useSelector(state => state.search.suggestedUsers)
    const feed = useSelector(state => state.feed)

    const [showMain, setShowMain] = useState(true)
    const toggleMain = () => setShowMain(value => !value)

    const [showPortfolio, setShowPortfolio] = useState(true)
    const togglePortfolio = () => setShowPortfolio(value => !value)

    const projects = useSelector(state => state.user.projects)

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

    // New Post
    const [modalNewPost, setModalNewPost] = useState(false)
    const [postText, setPostText] = useState(null)
    const [imagePostUrl, setImagePostUrl] = useState(null)
    const [isLoading, setIsLoading] = useState(null)

    // Image Upload to ImageKit.io
    const uploadPath = "/posts/"
    const onUploadError = err => {
        alert("Ocorreu um erro. Tente novamente em alguns minutos.");
    };
    const onUploadSuccess = res => {
        let n = res.filePath.lastIndexOf('/');
        setImagePostUrl(res.name);
    };

    const submitPost = () => {
        setIsLoading(true)
        let user = JSON.parse(localStorage.getItem('user'));
        fetch('https://mublin.herokuapp.com/user/newPost/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({text: postText, image: imagePostUrl})
        }).then((response) => {
            response.json().then((response) => {
              setIsLoading(false)
              setModalNewPost(false)
              dispatch(miscInfos.getFeed());
            })
          }).catch(err => {
            setIsLoading(false)
            alert("Ocorreu um erro! Tente novamente em instantes.")
            console.error(err)
        })
    };

    const [modalImage, setModalImage] = useState(false)
    const [imageToShow, setImageToShow] = useState(null)
    const showImage = (imageUrl) => {
        setImageToShow(imageUrl)
        setModalImage(true)
    }

    const [modalDeletePost, setModalDeletePost] = useState(false)
    const [postIdToDelete, setPostIdToDelete] = useState(null)
    const [loadingDeletePost, setLoadingDeletePost] = useState(false)

    const showModalPost = (idPost) => {
        setModalDeletePost(true)
        setPostIdToDelete(idPost)
    }

    const deletePost = (postId) => {
        setLoadingDeletePost(true)
        fetch('https://mublin.herokuapp.com/user/deletePost/', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({ postId: postId })
        })
        .then((response) => {
            dispatch(miscInfos.getFeed());
            setLoadingDeletePost(false)
            setModalDeletePost(false)
        }).catch(err => {
            setLoadingDeletePost(false)
            console.error(err)
            alert("Ocorreu um erro ao deletar o post.")
        })
    }

    var today = new Date();

    const undefinedAvatar = 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'

    const [tab, setTab] = useState(1)

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
        <Spacer />
        <Container className='px-3'>
            <Grid centered>
                <Grid.Row columns={2}>
                    <Grid.Column mobile={16} tablet={16} computer={4} className="only-computer"
                        style={{position:"-webkit-sticky",position:"sticky",top:"90px",display:"inline-table"}}
                    >
                        { !userInfo.requesting && 
                            <>
                                <div className='feed-item-wrapper pb-3 mb-3'>
                                    <a href={"/"+userInfo.username}>
                                        <Header as='h2'>
                                            { (!userInfo.requesting && userInfo.picture) ? (
                                                <Image circular
                                                    src={'https://ik.imagekit.io/mublin/users/avatars/'+userInfo.id+'/'+userInfo.picture}
                                                />
                                            ) : (
                                                <Image circular
                                                    src={undefinedAvatar}
                                                />
                                            )}
                                            <Header.Content>
                                                {userInfo.name}
                                                <Header.Subheader>@{userInfo.username}</Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </a>
                                    <Label className='mt-3 mx-0'>
                                        Plano:
                                        <Label.Detail>{userInfo.plan ? userInfo.plan.toUpperCase() : null}</Label.Detail>
                                    </Label>
                                </div>
                                <div className='feed-item-wrapper pb-3 mb-4'>
                                    <Header as='h5' disabled>Sugestões para seguir</Header>
                                    <div>
                                        <List size='large' relaxed>
                                            {suggestedUsers.map((user, key) =>
                                                <List.Item key={key}>
                                                    <Popup
                                                        content={user.totalProjects + (user.totalProjects === 1 ? ' projeto' : ' projetos') + (user.availabilityTitle ? ' · ' + user.availabilityTitle : '')}
                                                        header={user.username}
                                                        size='tiny'
                                                        trigger={<Image src={user.picture ? user.picture : undefinedAvatar} avatar className='cpointer' onClick={() => history.push('/'+user.username)} />}
                                                    />
                                                    <List.Content>
                                                        <Popup
                                                            content={user.totalProjects + (user.totalProjects === 1 ? ' projeto' : ' projetos') + (user.availabilityTitle ? ' · ' + user.availabilityTitle : '')}
                                                            header={user.username}
                                                            size='tiny'
                                                            trigger={<List.Header as='a' href={'/'+user.username} style={{width:'150px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:'13px'}}>{user.name+' '+user.lastname} {!!user.verified && <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' />}</List.Header>}
                                                        />
                                                        {/* <List.Header as='a' href={'/'+user.username}>{user.name+' '+user.lastname} {!!user.verified && <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' />}</List.Header> */}
                                                        <List.Description style={{fontSize:'11px',width:'160px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                                                            {user.instrumentalist && user.mainRole+' · '} {user.city+', '+user.region}
                                                        </List.Description>
                                                    </List.Content>
                                                </List.Item>
                                            )}
                                        </List>
                                    </div>
                                </div>
                            </>
                        }
                        <p className='logoFont textCenter' style={{opacity:'0.3'}}>mublin ©2021</p>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={16} computer={12}>
                        <div className='mt-0 mt-md-0'>
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
                                                            <Image src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max,c-maintain_ratio/users/avatars/'+friend.id+'/'+friend.picture} rounded width='50' height='auto' />
                                                        ) : (
                                                            <Image src={undefinedAvatar} rounded size='tiny' />
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
                                                        style={{position:'absolute',top:'42%',right:'23%'}} 
                                                    />
                                                </div>
                                            )}
                                        </Flickity>
                                    </>
                                }
                                </>
                            )}    
                        </div>

                        <div className='mt- mb-4' style={{display:'flex'}}>
                            <Header 
                                as='h2' 
                                floated='left' 
                                className='cpointer mb-0'
                                disabled={tab === 1 ? false : true}
                                onClick={() => setTab(1)} 
                            >
                                Meus Projetos
                            </Header>
                            <Header 
                                as='h2' 
                                floated='left' 
                                className='cpointer ml-2 mb-0'
                                disabled={tab === 2 ? false : true}
                                onClick={() => setTab(2)} 
                            >
                                Explorar
                            </Header>
                        </div>

                        <section id='tab1' style={tab === 1 ? null : {display:'none'}}>
                            <div className='pb-2'>
                                <Checkbox 
                                    label={'Principais ('+projectsMain.length+')'}
                                    checked={showMain}
                                    onClick={toggleMain}
                                    style={{fontSize:'12px'}}
                                />
                                <Checkbox 
                                    label={['Portfolio ' , '('+projectsPortfolio.length+') ' , <Icon name='tag' style={{fontSize:'10px'}} />]}
                                    checked={showPortfolio}
                                    onClick={togglePortfolio}
                                    style={{fontSize:'12px',marginLeft:'10px'}}
                                />
                            </div>
                            { !userInfo.requesting ? (
                                projectsToShow.length ? (
                                    projectsToShow.map((project, key) =>
                                    <Card key={key} fluid color={(!project.yearEnd && project.ptid !== 7) ? 'green' : 'grey'}>
                                        <Label basic attached='top' style={{fontWeight:'400',display:'flex',justifyContent:'space-between',border:'none',paddingBottom:'0',    backgroundColor:'transparent'}}>
                                            <div>
                                                {project.ptname}
                                            </div>
                                            <div className='ml-2'>
                                                {(!project.yearEnd && project.ptid !== 7) &&
                                                    <p className='mb-0'>
                                                        <Icon name='toggle on' color='green' />Em atividade {project.yearFoundation && 'desde '+project.yearFoundation}
                                                    </p>
                                                }
                                                {(project.yearEnd && project.yearEnd <= currentYear) &&
                                                    <p className='mb-0'>
                                                        <Icon name='toggle off' color='grey' />Encerrado em {project.yearEnd}
                                                    </p>
                                                }
                                                {(project.ptid === 7) &&
                                                    <p className='mb-0'>
                                                        <Icon name='lightbulb outline' className='mr-0' />Ideia em desenvolvimento
                                                    </p>
                                                }
                                            </div>
                                        </Label>
                                        <Card.Content>
                                            <Image
                                                floated='left'
                                                size='tiny'
                                                src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-160,w-160,c-maintain_ratio/'+project.picture : 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg'}
                                                className='mb-0 cpointer'
                                                onClick={() => history.push('/project/'+project.username)}
                                            />
                                            <Card.Header
                                                className='cpointer'
                                                onClick={() => history.push('/project/'+project.username)}
                                                style={{fontSize:'17.2px'}}
                                            >
                                                {project.name} {project.portfolio === 1 && <Icon name='tag' color='black' style={{fontSize:'11px',verticalAlign: 'text-top'}} title='Portfolio' />}
                                            </Card.Header>
                                            <Card.Description className='pt-1 pb-3' style={{fontSize:'11px',display:'inline',verticalAlign:'middle'}}>
                                                { project.confirmed === 1 ? ( <><Icon className='mr-0' name={project.workIcon} />{project.workTitle}</> ) : ( <><Icon className='mr-0' name='clock outline' />Pendente</> )}
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
                                            <Card.Meta style={{fontSize:'11px',color:'rgba(0,0,0,.68)'}}>
                                                {/* {project.role1}{project.role2 && ', '+project.role2}{project.role3 && ', '+project.role3} */}
                                                {project.role1 && <Label size='mini' style={{fontWeight:'500'}}>{project.role1.length > 11 ? `${project.role1.substring(0, 11)}...` : project.role1}</Label>} {project.role2 && <Label size='mini' style={{fontWeight:'500'}}>{project.role2.length > 11 ? `${project.role2.substring(0, 11)}...` : project.role2}</Label>} {project.role3 && <Label size='mini' style={{fontWeight:'500'}}>{project.role3.length > 11 ? `${project.role3.substring(0, 11)}...` : project.role3}</Label>}
                                            </Card.Meta>
                                            <Card.Description className='pt-2' style={{display:'table-cell',fontSize:'11.6px'}}>
                                                <Link to={{ pathname: '/project/'+project.username }} className='mr-2' style={{color:'rgba(0,0,0,.85)'}}><Icon name='dashboard' />Dashboard</Link> <Link to={{ pathname: '/project/'+project.username }} style={{color:'rgba(0,0,0,.85)'}}><Icon name='eye' />Ver página</Link>
                                            </Card.Description>
                                        </Card.Content>
                                    </Card>
                                    )
                                ) : (
                                    <Segment>
                                        <Label size='massive' style={{width:'94px',height:'94px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                                            <Icon name='broken chain' className='m-0' style={{opacity:'0.3'}} />
                                        </Label>
                                        {/* <h5 className="ui header mt-2 mb-0">
                                            <div className="sub header mt-1">Nenhum projeto</div>
                                        </h5> */}
                                    </Segment> 
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
                        </section>

                        <section id='tab2' style={tab === 2 ? null : {display:'none'}}>
                            <div className='userSuggestionsCarouselMobile mb-3'>
                                <Header size='tiny' className='mt-2 ml-0 ml-md-2'>
                                    Sugestões de pessoas para seguir
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
                                            <Image className='cpointer' onClick={() => history.push('/'+user.username)} src={user.picture ? user.picture : undefinedAvatar} avatar />
                                            <div style={{display:'flex',flexDirection:'column'}}>
                                                <span style={{fontSize:'11.8px',fontWeight:'500'}}>{user.username}</span>
                                                <span style={{fontSize:'9px'}}>{user.city}</span>
                                            </div>
                                        </div>
                                    )}
                                </Flickity>
                            </div>

                            <Feed className='pt-1 mt-0'>
                                <Feed.Event className='mb-3 feed-item-wrapper newPost' style={{height:'59px'}}>
                                    <Feed.Label image={userInfo.picture ? 'https://ik.imagekit.io/mublin/users/avatars/'+userInfo.id+'/'+userInfo.picture : undefinedAvatar} onClick={() => history.push('/'+userInfo.username)} className='cpointer' />
                                    <Feed.Content className='mb-0 mt-0'>
                                        <Feed.Summary className='mb-0'>
                                            <div>
                                                <Header 
                                                    as='h4'
                                                    className='mb-0' 
                                                    style={{cursor:'pointer',opacity:'0.5',marginTop:'7px'}}
                                                    onClick={() => setModalNewPost(true)}
                                                >
                                                    Publicar algo...
                                                </Header>
                                                <Button primary circular icon='pencil' size='tiny'
                                                    onClick={() => setModalNewPost(true)}
                                                    style={{
                                                        height:'fit-content',
                                                        position:'absolute',
                                                        top:'13px',
                                                        right:'10px',
                                                    }} 
                                                />
                                            </div>
                                        </Feed.Summary>
                                    </Feed.Content>
                                </Feed.Event>
                                <Modal
                                    size='tiny'
                                    open={modalNewPost}
                                    onClose={() => setModalNewPost(false)}
                                >
                                    <Modal.Content>
                                        <div className='mb-3'>
                                            <Image avatar src={userInfo.picture ? 'https://ik.imagekit.io/mublin/users/avatars/'+userInfo.id+'/'+userInfo.picture : undefinedAvatar} />
                                            <span>Publicar como {userInfo.name}</span>
                                        </div>
                                        <Form>
                                            <Form.TextArea
                                                value={postText}
                                                onChange={(e) => setPostText(e.target.value)}
                                            />
                                        </Form>
                                        <div>
                                            <Header as='h6' className='mt-3 mb-1'>
                                                <Icon name='image outline' />
                                                <Header.Content>Enviar imagem</Header.Content>
                                            </Header>
                                            <div className="customFileUpload">
                                                {!imagePostUrl ? ( 
                                                    <>
                                                        <IKUpload 
                                                            fileName="img"
                                                            folder={uploadPath}
                                                            tags={["post","feed"]}
                                                            useUniqueFileName={true}
                                                            isPrivateFile= {false}
                                                            onError={onUploadError}
                                                            onSuccess={onUploadSuccess}
                                                        />
                                                    </>
                                                ) : (
                                                    <><Image src={'https://ik.imagekit.io/mublin/posts/'+imagePostUrl} size='small' /> <Icon className='cpointer mt-1' color='red' name='trash alternate outline' onClick={() => setImagePostUrl(null)} /></>
                                                )}
                                            </div>
                                        </div>
                                        <div className='mt-4 mb-3 pb-3'>
                                            <Button
                                                floated='right'
                                                content={isLoading ? 'Publicando...' : 'Publicar'} 
                                                size='small' 
                                                primary 
                                                disabled={(!postText || isLoading) ? true : false}
                                                onClick={submitPost}
                                            />
                                            <Button floated='right' size='small' onClick={() => setModalNewPost(false)}>
                                                Fechar
                                            </Button>
                                        </div>
                                    </Modal.Content>
                                </Modal>
                                {feed.requesting ? (
                                    <Segment>
                                        <Placeholder>
                                        <Placeholder.Header image>
                                            <Placeholder.Line />
                                            <Placeholder.Line />
                                        </Placeholder.Header>
                                        <Placeholder.Paragraph>
                                            <Placeholder.Line length='medium' />
                                            <Placeholder.Line length='short' />
                                        </Placeholder.Paragraph>
                                        </Placeholder>
                                    </Segment>
                                ) : (
                                    <>
                                        {!feed.error && feed.list.map((item, key) =>
                                            <Feed.Event key={key} className='mb-3 feed-item-wrapper'>
                                                <Feed.Label>
                                                    <img src={item.relatedUserPicture ? item.relatedUserPicture : undefinedAvatar} alt={'Foto de '+item.relatedUserName} style={{cursor:'pointer'}} onClick={() => history.push('/'+item.relatedUserUsername)} />
                                                    {item.relatedUserPlan === 'Pro' && <Label size="mini" className="ml-2 p-1">Pro</Label>}
                                                    {item.relatedUserUsername === userInfo.username &&
                                                        <Icon name='trash alternate outline' style={{fontSize:'0.8em',marginTop:'14px'}} className='cpointer' onClick={() => showModalPost(item.id)} />
                                                    }
                                                </Feed.Label>
                                                <Feed.Content className='mt-1' style={{fontSize:'12.3px'}}>
                                                    {feed.requesting ? (
                                                        <Feed.Date style={{fontWeight:'500'}}>
                                                            Carregando...
                                                        </Feed.Date>
                                                    ) : (
                                                        <Feed.Date style={{fontWeight:'500'}} title={Date(item.created)}>
                                                            há {formatDistance(new Date(item.created * 1000), new Date(), {locale:pt})}
                                                        </Feed.Date>
                                                    )}
                                                    <Feed.Summary>
                                                        <Feed.User style={{fontWeight:'600'}} onClick={() => history.push('/'+item.relatedUserUsername)}>{item.relatedUserName+' '+item.relatedUserLastname} {!!item.relatedUserVerified && <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' />}</Feed.User> <span style={{fontWeight:'500'}}>{item.action}</span>
                                                    </Feed.Summary>
                                                    { (item.categoryId === 8) && 
                                                        <Feed.Extra text content={item.extraText} />
                                                    }
                                                    {item.image && 
                                                        <Feed.Extra images>
                                                            <a onClick={() => {
                                                                showImage('https://ik.imagekit.io/mublin/posts/'+item.image)
                                                            }}>
                                                                <img src={'https://ik.imagekit.io/mublin/posts/'+item.image} />
                                                            </a>
                                                        </Feed.Extra>
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
                                        <Modal
                                            size='tiny'
                                            basic
                                            closeIcon
                                            open={modalImage}
                                            onClose={() => setModalImage(false)}
                                        >
                                            <Modal.Content>
                                                <Image src={imageToShow} />
                                            </Modal.Content>
                                        </Modal>
                                        <Feed.Event className='mb-1 feed-item-wrapper'>
                                            <Feed.Label>
                                                <img src={LogoMublinCircular} alt='Mublin' />
                                            </Feed.Label>
                                            <Feed.Content className='mt-1' style={{fontSize:'12.3px'}}>
                                                <Feed.Date style={{fontWeight:'500'}}>
                                                    há {formatDistance(new Date('2021-03-04'), new Date(), {locale:pt})}
                                                </Feed.Date>
                                                <Feed.Summary>
                                                    <Feed.User style={{fontWeight:'600',cursor:'default'}}>Mublin <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' /></Feed.User> <span style={{fontWeight:'500'}}>escreveu</span>
                                                </Feed.Summary>
                                                <Feed.Extra text content="Bem-vindo à versão Beta do Mublin! Você faz parte de um seleto grupo de pessoas que estão fazendo parte dos primeiros testes neste pré-lançamento. Este é um espaço feito para trazer mais facilidade à rotina de pessoas que amam música e que estão de alguma forma envolvidos com projetos de música. Esperamos que goste!" />
                                            </Feed.Content>
                                        </Feed.Event>
                                    </>
                                )}
                            </Feed>
                        </section>

                        <Confirm
                            open={modalDeletePost}
                            size='tiny'
                            content='Deletar este post?'
                            onCancel={() => setModalDeletePost(false)}
                            onConfirm={() => deletePost(postIdToDelete)}
                            cancelButton='Cancelar'
                            confirmButton={{content:'Deletar', negative: true, loading: loadingDeletePost ? true : false}}
                        />
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