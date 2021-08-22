import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchInfos } from '../../store/actions/search';
import { miscInfos } from '../../store/actions/misc';
import { Grid, Form, Loader, Segment, Header, Modal, Input, Feed, Tab, Button, Image, Label, Icon, Card, Confirm } from 'semantic-ui-react'
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Flickity from 'react-flickity-component';
import {IKUpload} from "imagekitio-react";
import LogoMublinCircular from '../../assets/img/logos/logo-mublin-circle-black.png';
import './styles.scss'

function SearchPage () {

    let searchedKeywords = (new URLSearchParams(window.location.search)).get("keywords")
    let currentTab = (new URLSearchParams(window.location.search)).get("tab")
 
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
    }, [dispatch, searchedKeywords, currentTab]);

    const userInfo = useSelector(state => state.user)
    const searchResults = useSelector(state => state.search);
    const suggestedUsers = useSelector(state => state.search.suggestedUsers);
    const feed = useSelector(state => state.feed);

    const handleSearch = (query,tab) => {
        history.push({
            pathname: '/search',
            search: tab ? '?keywords='+query+'&tab='+tab : '?keywords='+query
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

    const [filterOpen, setFilterOpen] = useState(false)

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid as='main' columns={1} className="container searchPage">
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
                                action={{ icon: 'search', onClick: () => handleSearch(searchQuery,null) }} 
                                placeholder='Pesquisar...'
                                value={searchQuery} 
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1} className='pt-1 pt-md-4 pb-md-4'>
                    <Grid.Column width={16}>
                        <Header size='tiny'>Pesquisas rápidas</Header>
                        <Flickity
                            className={'quickSearches mt-3'}
                            elementType={'div'}
                            options={sliderOptions}
                            disableImagesLoaded={false}
                            reloadOnUpdate
                        >
                            <Button 
                                size='tiny'
                                circular
                                content='Artistas minha cidade'
                                secondary
                                onClick={() => {
                                        handleSearch(userInfo.cityName,'people')
                                        setSearchQuery(userInfo.cityName)
                                }}
                            />
                            <Button 
                                size='tiny'
                                circular
                                content='Projetos minha cidade'
                                secondary
                                onClick={() => {
                                        handleSearch(userInfo.cityName,'projects')
                                        setSearchQuery(userInfo.cityName)
                                }}
                            />
                        </Flickity>
                    </Grid.Column>
                </Grid.Row>
                {searchedKeywords ? ( 
                    <Grid.Row className='pt-0'>
                        <Grid.Column width={16}>
                            {searchedKeywords && 
                                <Tab 
                                    defaultActiveIndex={
                                        {
                                          'people': 0,
                                          'projects': 1,
                                          'gear': 2,
                                          null: 0
                                        }[currentTab]
                                    }
                                    menu={{ secondary: true, pointing: true, size:'large' }} 
                                    panes={
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
                    <Grid.Row className='pb-5 pt-0'>
                        <Grid.Column mobile={16} tablet={16} computer={12}>
                            {searchResults.requesting ? (
                                <div style={{textAlign:'center',width:'100%',height:'100px'}} className='py-3'>
                                    <Loader active inline='centered' />
                                </div>
                            ) : (
                                <>
                                    <Header size='medium' className='mt-1 mt-md-4'>Sugestões para seguir</Header>
                                    <Flickity
                                        className={'carousel'}
                                        elementType={'div'}
                                        options={sliderOptions}
                                        disableImagesLoaded={false}
                                        reloadOnUpdate
                                    >
                                        {suggestedUsers.map((user, key) =>
                                            <Card className='default'>
                                                <Card.Content>
                                                    <Image
                                                        floated='left'
                                                        size='mini'
                                                        src={user.picture ? user.picture : 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'}
                                                    />
                                                    <Card.Header style={{fontSize:"16px"}} className='textEllipsis'>
                                                        {user.name+' '+user.lastname} {!!user.verified && <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' />}
                                                    </Card.Header>
                                                    <Card.Meta style={{fontSize:"12px"}} className='textEllipsis'>
                                                        {user.city && user.city+' - '+user.region}
                                                    </Card.Meta>
                                                    <Card.Description style={{fontSize:"12.5px"}} className='textEllipsis'>
                                                        {user.mainRole ? user.mainRole : user.bio}
                                                    </Card.Description>
                                                </Card.Content>
                                                {/* <Card.Content extra style={{fontSize:"11px"}}>
                                                    { user.availabilityTitle && <><Label circular color={user.availabilityColor} empty size='mini' className='ml-2' /> {user.availabilityTitle}</>}
                                                </Card.Content> */}
                                            </Card>
                                        )}
                                    </Flickity>
                                </>
                            )}
                            <Header size='medium' className='mt-4'>Postagens Recentes</Header>
                            <Feed className='pt-1 mt-0'>
                                {feed.requesting ? (
                                    <div style={{textAlign:'center',width:'100%',height:'100px'}} className='py-3'>
                                        <Loader active inline='centered' />
                                    </div>
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
                                                <Feed.Content className='mt-1'>
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
                        </Grid.Column>
                        <Grid.Column only='computer' width={4}>
                            <Segment fluid className='p-3 mt-0 mt-md-3 mb-4 mb-md-0'>
                                <Header className='mt-4'>Filtrar pesquisa</Header>
                                <Form>
                                    <Form.Group widths='equal'>
                                        <Form.Field label='An HTML <input>' control='input' />
                                        <Form.Field label='An HTML <select>' control='select'>
                                            <option value='male'>Male</option>
                                            <option value='female'>Female</option>
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group grouped>
                                        <label>HTML radios</label>
                                        <Form.Field
                                            label='This one'
                                            control='input'
                                            type='radio'
                                            name='htmlRadios'
                                        />
                                        <Form.Field
                                            label='That one'
                                            control='input'
                                            type='radio'
                                            name='htmlRadios'
                                        />
                                    </Form.Group>
                                    <Form.Group grouped>
                                        <label>HTML checkboxes</label>
                                        <Form.Field label='This one' control='input' type='checkbox' />
                                        <Form.Field label='That one' control='input' type='checkbox' />
                                    </Form.Group>
                                    <Form.Field label='An HTML <textarea>' control='textarea' rows='3' />
                                    <Form.Field label='An HTML <button>' control='button'>
                                        HTML Button
                                    </Form.Field>
                                </Form>
                            </Segment>
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