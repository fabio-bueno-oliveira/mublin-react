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
import { Container, Header, Grid, Feed, Image, Icon, Label, List, Popup, Loader, Placeholder, Segment, Form, Button, Modal, Checkbox, Confirm } from 'semantic-ui-react';
import Flickity from 'react-flickity-component';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import LogoMublin from '../../assets/img/logos/logo-mublin-circle-black.png';
import {IKUpload} from "imagekitio-react";
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
    const feed = useSelector(state => state.feed)

    const [showPortfolio, setShowPortfolio] = useState(true)
    const toggle = () => setShowPortfolio(value => !value)

    const projectsToShow = useSelector(state => state.user.projects).filter((project) => { return showPortfolio ? (project.portfolio === 1 || project.portfolio === 0) && project.confirmed !== 0 : project.portfolio === 0 && project.confirmed !== 0 }).sort((a, b) => parseFloat(b.featured) - parseFloat(a.featured))

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

    const undefinedAvatar = 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
        <Spacer />
        <Container className='px-3'>
            <Grid centered>
                <Grid.Row columns={2}>
                    <Grid.Column mobile={16} tablet={16} computer={12}>
                        <div className='mt-0 mt-md-0'>
                            {userInfo.requesting ? (
                                <div style={{textAlign: 'center', width: '100%'}}>
                                    <Loader active inline='centered' className='mb-4' />
                                </div>
                            ) : (
                                <>
                                {userInfo.lastConnectedFriends[0].username &&
                                    <>
                                        <Header as='h3'>Conectados recentemente</Header>
                                        <Flickity
                                            className={'carousel'}
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
                                                                {/* {friend.username} */}
                                                                {(friend.username.length > 7) ? friend.username.substr(0,6) + '...' : friend.username}
                                                            </Header.Content>
                                                        </Header>
                                                    </Link>
                                                </div>
                                            )}
                                        </Flickity>
                                    </>
                                }
                                </>
                            )}    
                        </div>
                        <div className='mb-3'>
                            <Header as='h3' className='mb-1'>Meus Projetos ({projectsToShow.length})</Header>
                            <Checkbox 
                                label={['Exibir projetos tipo Portfolio ' , <Icon name='tag' style={{fontSize:'10px'}} />]}
                                checked={showPortfolio}
                                onClick={toggle}
                                style={{fontSize:'12px'}}
                            />
                        </div>
                        <Flickity
                            className={'carousel mt-2'}
                            elementType={'div'}
                            options={sliderOptions}
                            disableImagesLoaded={false}
                            reloadOnUpdate
                        >
                            { !userInfo.requesting ? (
                                projectsToShow.length ? (
                                    projectsToShow.map((project, key) =>
                                        <div className="carousel-cell compact" key={key} style={project.confirmed === 2 ? {opacity:'0.6'} : {}}>
                                            <Link to={{ pathname: '/project/'+project.username }}>
                                                {project.yearLeftTheProject && 
                                                    <Label color='black' floating size='mini' style={{top: '0', left: '21%',width:'fit-content'}}>
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
                                                        {project.portfolio === 1 && <Icon name='tag' style={{fontSize:'10px'}} className='mr-1' title='Portfolio' />}{project.name}
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
                                    <div className="carousel-cell compact">
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

                        <div className='userSuggestionsCarouselMobile'>
                            <Header size='tiny' className='mt-3 ml-0 ml-md-2' style={{opacity:"0.7"}}>
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
                                        <Image as='a' href={'/'+user.username} src={user.picture ? user.picture : undefinedAvatar} avatar />
                                        <div style={{display:'flex',flexDirection:'column'}}>
                                            <span style={{fontSize:'11.8px',fontWeight:'500'}}>{user.username}</span>
                                            <span style={{fontSize:'9px'}}>{user.city}</span>
                                        </div>
                                    </div>
                                )}
                            </Flickity>
                        </div>

                        <Feed className='pt-3'>
                            <Header as='h3' className='mb-3 ml-0 ml-md-2'>Feed</Header>
                            <div className='mt-2 ml-2 mb-4' style={{display:'flex'}}>
                                <Image avatar src={userInfo.picture ? 'https://ik.imagekit.io/mublin/users/avatars/'+userInfo.id+'/'+userInfo.picture : undefinedAvatar} className='mr-2' /> <Button fluid circular size='tiny' onClick={() => setModalNewPost(true)}><Icon name='pencil' /> Publicar no Mublin</Button>
                            </div>
                            <Modal
                                size='tiny'
                                open={modalNewPost}
                                onClose={() => setModalNewPost(false)}
                            >
                                <Modal.Content scrolling>
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
                                    <div className='mt-4'>
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
                                        <Feed.Event key={key} className='mb-2 ml-0 ml-md-2 feed-item-wrapper'>
                                            <Feed.Label>
                                                <img src={item.relatedUserPicture ? item.relatedUserPicture : undefinedAvatar} alt={'Foto de '+item.relatedUserName} style={{cursor:'pointer'}} onClick={() => history.push('/'+item.relatedUserUsername)} />
                                                {item.relatedUserPlan === 'Pro' && <Label size="mini" className="ml-2 p-1">Pro</Label>}
                                                {item.relatedUserUsername === userInfo.username &&
                                                    <Icon name='trash alternate outline' style={{fontSize:'0.8em',marginTop:'14px'}} className='cpointer' onClick={() => showModalPost(item.id)} />
                                                }
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
                                    <Feed.Event className='mb-1 ml-0 ml-md-2 feed-item-wrapper'>
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
                        <Confirm
                            open={modalDeletePost}
                            size='tiny'
                            content='Deletar este post?'
                            onCancel={() => setModalDeletePost(false)}
                            onConfirm={() => deletePost(postIdToDelete)}
                            cancelButton='Voltar'
                            confirmButton={{content:'Deletar', negative: true, loading: loadingDeletePost ? true : false}}
                        />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={16} computer={4} className="only-computer"
                        style={{position:"-webkit-sticky",position:"sticky",top:"90px",display:"inline-table"}}
                    >
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
                                                src={undefinedAvatar}
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
                                                trigger={<Image src={user.picture ? user.picture : undefinedAvatar} avatar className='cpointer' onClick={() => history.push('/'+user.username)} />}
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