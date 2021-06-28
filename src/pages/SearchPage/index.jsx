import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchInfos } from '../../store/actions/search';
import { miscInfos } from '../../store/actions/misc';
import { Grid, Form, List, Loader, Segment, Header, Placeholder, Modal, Input, Feed, Tab, Image, Label, Icon, Card, Confirm } from 'semantic-ui-react'
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import {IKUpload} from "imagekitio-react";
import LogoMublinCircular from '../../assets/img/logos/logo-mublin-circle-black.png';

function SearchPage () {

    let searchedKeywords = (new URLSearchParams(window.location.search)).get("keywords")
 
    document.title = searchedKeywords ? 'Pesquisar por "' + searchedKeywords+ '" | Mublin' : 'Explorar | Mublin'

    const userSession = JSON.parse(localStorage.getItem('user'));

    let dispatch = useDispatch();

    let history = useHistory();

    useEffect(() => {
        window.scrollTo(0, 0)
        dispatch(searchInfos.getSearchUsersResults(searchedKeywords))
        dispatch(searchInfos.getSearchProjectsResults(searchedKeywords))
        dispatch(searchInfos.getSuggestedUsersResults())
        dispatch(miscInfos.getFeed());
    }, [dispatch, searchedKeywords]);

    const userInfo = useSelector(state => state.user)
    const searchResults = useSelector(state => state.search);
    const suggestedUsers = useSelector(state => state.search.suggestedUsers);
    const feed = useSelector(state => state.feed);

    const handleSearch = (query) => {
        history.push({
            pathname: '/search',
            search: '?keywords='+query
        })
    }

    const [searchQuery, setSearchQuery] = useState(searchedKeywords)

    // detecta tamanho da tela para definir a quantidade de cards no grid de sugestões
    const [screenSize, setScreenSize] = useState({ matches: window.matchMedia("(min-width: 768px)").matches })
    const handler = e => setScreenSize({matches: e.matches});
    window.matchMedia("(min-width: 768px)").addEventListener('change',handler);

    const [showMobileMenu, setShowMobileMenu] = useState(true)

    const undefinedAvatar = 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'

    const [likeFeedPostLoading, setLikeFeedPostLoading] = useState(null)
    const likeFeedPost = (feedId) => {
        setLikeFeedPostLoading(feedId)
        fetch('https://mublin.herokuapp.com/feed/'+feedId+'/like', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userSession.token
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
                'Authorization': 'Bearer ' + userSession.token
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
                'Authorization': 'Bearer ' + userSession.token
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

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid stackable as='main' columns={1} className="container">
                <Grid.Row columns={1} only='mobile'>
                    <Grid.Column width={16}>
                        <Form
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setSearchQuery(searchQuery);
                                }
                            }}
                            onFocus={() => setShowMobileMenu(false)}
                            onBlur={() => setShowMobileMenu(true)}
                        >
                            <Input 
                                fluid
                                size='large'
                                action={{ icon: 'search', onClick: () => handleSearch(searchQuery) }} 
                                placeholder='Pesquisar...'
                                value={searchQuery} 
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                {searchedKeywords ? ( 
                    <Grid.Row>
                        <Grid.Column width={16}>
                            {searchedKeywords && 
                                <Tab menu={{ secondary: true, pointing: true, size:'large' }} panes={
                                    [
                                        {
                                            menuItem: searchResults.users[0].id ? 'Pessoas ('+searchResults.users.length+')' : 'Pessoas (0)',
                                            render: () => 
                                                <Tab.Pane basic attached={false} loading={searchResults.requesting}>
                                                    { searchResults.users[0].id ? (
                                                    <Card.Group itemsPerRow={screenSize.matches ? 6 : 2} className='px-0 px-md-0 pb-5'>
                                                        { searchResults.users.map((user, key) =>
                                                            <Card key={key} onClick={() => history.push('/'+user.username)}>
                                                                { user.picture ? (
                                                                    <Image src={user.picture} wrapped ui={false} />
                                                                ) : (
                                                                    <Image src='https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' wrapped ui={false} />
                                                                )}
                                                                <Card.Content>
                                                                    <Card.Header style={{fontSize:'14.4px',width:'100%',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} title={user.name+' '+user.lastname}>
                                                                        {user.name} {user.id !== userSession.id ? user.lastname : '(Você)'} {!!user.verified && <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' />}
                                                                    </Card.Header>
                                                                    { user.instrumentalist && 
                                                                        <Card.Meta style={{fontSize:'12.4px'}}>
                                                                            <span style={{color:'darkgray '}}>{user.mainRole}</span>{user.plan === 'Pro' && <Label size="tiny" className="ml-1 p-1" style={{cursor:"default"}}>Pro</Label>}
                                                                        </Card.Meta>
                                                                    }
                                                                    {user.city &&
                                                                        <Card.Meta style={{fontSize:'11px',width:'100%',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                                                                            {user.city+' - '+user.region}
                                                                        </Card.Meta>
                                                                    }
                                                                    <Card.Description style={{fontSize:'11px'}}>
                                                                        {user.totalProjects} projetos
                                                                    </Card.Description>
                                                                    { user.availabilityStatus && 
                                                                        <Card.Description style={{fontSize:'11px',width:'100%',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} className='mt-1'>
                                                                            <Label circular color={user.availability_color} empty size='mini' /> {user.availabilityStatus}
                                                                        </Card.Description>
                                                                    }
                                                                    {/* { !!(user.projectRelated && user.projectPublic && searchResults.projects[0].id) &&
                                                                        <Card.Description style={{fontSize:'10px'}}>
                                                                            Projeto relacionado: {user.projectRelated} {'('+user.projectType+')'} 
                                                                        </Card.Description>
                                                                    } */}
                                                                </Card.Content>
                                                            </Card>
                                                        )}
                                                    </Card.Group>
                                                    ) : (
                                                    <p>Nenhum usuário encontrado</p>
                                                    )}
                                                </Tab.Pane>,
                                        }, 
                                        {
                                            menuItem: searchResults.projects[0].id ? 'Projetos ('+searchResults.projects.length+')' : 'Projetos (0)',
                                            render: () => 
                                                <Tab.Pane basic attached={false} loading={searchResults.requesting}>
                                                    {searchResults.projects[0].id ? (
                                                    <Card.Group itemsPerRow={screenSize.matches ? 6 : 2} className='px-0 px-md-0 pb-5' style={{maxWidth:'100%'}}>
                                                        { searchResults.projects.map((project, key) =>
                                                            <Card key={key} onClick={() => history.push('/project/'+project.username)}>
                                                                { project.picture ? (
                                                                    <Image rounded src={project.picture} onClick={() => history.push('/project/'+project.username)} wrapped ui={false} />
                                                                ) : (
                                                                    <Image rounded src='https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_Kblh5CBKPp.jpg' onClick={() => history.push('/project/'+project.username)} wrapped ui={false} /> 
                                                                )}
                                                                <Card.Content>
                                                                    <Card.Header style={{fontSize:'14.4px',width:'100%',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                                                                        {project.name}
                                                                    </Card.Header>
                                                                    <Card.Meta style={{fontSize:'12.4px'}}>
                                                                        <span style={{color:'darkgray '}}>{project.type} {project.mainGenre && '・ '+project.mainGenre}</span>
                                                                    </Card.Meta>
                                                                    {project.city &&
                                                                        <Card.Meta style={{fontSize:'11px',width:'100%',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                                                                            {project.city && project.city+', '+project.region}
                                                                        </Card.Meta>
                                                                    }
                                                                </Card.Content>
                                                            </Card>
                                                        )}
                                                    </Card.Group>
                                                    ) : (
                                                    <p>Nenhum projeto encontrado</p>
                                                    )}
                                                </Tab.Pane>,
                                        },
                                        {
                                            menuItem: 'Equipamentos (0)',
                                            render: () => 
                                                <Tab.Pane basic attached={false} loading={searchResults.requesting}>
                                                    {searchResults.projects[0].id ? (
                                                    <Card.Group itemsPerRow={screenSize.matches ? 6 : 2} className='px-0 px-md-0 pb-5' style={{maxWidth:'100%'}}>
                                                        { searchResults.projects.map((project, key) =>
                                                            <Card key={key} onClick={() => history.push('/project/'+project.username)}>
                                                                { project.picture ? (
                                                                    <Image rounded src={project.picture} onClick={() => history.push('/project/'+project.username)} wrapped ui={false} />
                                                                ) : (
                                                                    <Image rounded src='https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_Kblh5CBKPp.jpg' onClick={() => history.push('/project/'+project.username)} wrapped ui={false} /> 
                                                                )}
                                                                <Card.Content>
                                                                    <Card.Header style={{fontSize:'14.4px',width:'100%',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                                                                        {project.name}
                                                                    </Card.Header>
                                                                    <Card.Meta style={{fontSize:'12.4px'}}>
                                                                        <span style={{color:'darkgray '}}>{project.type} {project.mainGenre && '・ '+project.mainGenre}</span>
                                                                    </Card.Meta>
                                                                    {project.city &&
                                                                        <Card.Meta style={{fontSize:'11px',width:'100%',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                                                                            {project.city && project.city+', '+project.region}
                                                                        </Card.Meta>
                                                                    }
                                                                </Card.Content>
                                                            </Card>
                                                        )}
                                                    </Card.Group>
                                                    ) : (
                                                    <p>Nenhum projeto encontrado</p>
                                                    )}
                                                </Tab.Pane>,
                                        },
                                    ]
                                }/>
                            }
                        </Grid.Column>
                    </Grid.Row>
                ) : (
                    <Grid.Row sta style={{justifyContent:'center'}} className='pb-5 pt-0'>
                        <Grid.Column width={10}>
                            { searchResults.requesting ? (
                                <Loader active inline='centered' />
                            ) : (
                                <Card fluid className=' p-3 mt-0 mt-md-3' style={{maxWidth:'100%'}}>
                                    <Header as='h4' className='mb-1'>Pessoas para seguir</Header>
                                    <List relaxed='very' divided size='large'>
                                        { suggestedUsers.map((user, key) =>
                                            <List.Item key={key}>
                                                <Image avatar style={{width:'3em',height:'3em'}} src={user.picture ? user.picture : 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'} />
                                                <List.Content>
                                                    <List.Header as='a' style={{fontSize:'14px'}}>
                                                        {user.name+' '+user.lastname} {!!user.verified && <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' />}
                                                    </List.Header>
                                                    <List.Description style={{fontSize:'12.5px'}}>
                                                        {user.mainRole}
                                                    </List.Description>
                                                    <List.Description style={{color:'grey',fontSize:'12px'}}>
                                                        {user.city && user.city+' - '+user.region}
                                                    </List.Description>
                                                    <List.Description style={{color:'grey',fontSize:'11px'}}>
                                                        {user.totalProjects} projetos { user.availabilityTitle && <><Label circular color={user.availabilityColor} empty size='mini' className='ml-2' /> {user.availabilityTitle}</>}
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                        )}
                                    </List>
                                </Card>
                            )}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Card fluid className='p-3 mt-0 mt-md-3 mb-4 mb-md-0'>
                                <Header as='h4'>Postagens recentes</Header>
                                <Feed className='pt-1 mt-0'>
                                    {/* <Feed.Event className='mb-3 feed-item-wrapper newPost' style={{height:'59px'}}>
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
                                    </Feed.Event> */}
                                    {/* <Modal
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
                                    </Modal> */}
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
                                                <Feed.Event key={key} className='mb-3'>
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
                                            <Feed.Event>
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
                            </Card>
                        </Grid.Column>
                    </Grid.Row>
                )}
            </Grid>
            <Confirm
                open={modalDeletePost}
                size='tiny'
                content='Deletar este post?'
                onCancel={() => setModalDeletePost(false)}
                onConfirm={() => deletePost(postIdToDelete)}
                cancelButton='Cancelar'
                confirmButton={{content:'Deletar', negative: true, loading: loadingDeletePost ? true : false}}
            />
            { showMobileMenu && 
                <FooterMenuMobile />
            }
        </>
    )
}

export default SearchPage;