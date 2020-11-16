import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import { profileInfos } from '../../store/actions/profile';
import { followInfos } from '../../store/actions/follow';
import { Header, Segment, Tab, Card, Grid, Image, Button, Label, Menu, Icon, Modal, List, Popup, Feed, Form, Radio} from 'semantic-ui-react';
import Loader from 'react-loader-spinner';
import Flickity from 'react-flickity-component';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import './styles.scss';
import './flickity.scss';

function ProfilePage (props) {

    let dispatch = useDispatch();

    let history = useHistory();

    const user = JSON.parse(localStorage.getItem('user'));

    const username = props.match.params.username;

    useEffect(() => {
        dispatch(profileInfos.getProfileInfo(username));
        dispatch(profileInfos.getProfileProjects(username));
        dispatch(profileInfos.getProfileRoles(username));
        dispatch(profileInfos.getProfileFollowers(username));
        dispatch(profileInfos.getProfileFollowing(username));
        dispatch(profileInfos.getProfilePosts(username));
        dispatch(profileInfos.getProfileGear(username));
        dispatch(profileInfos.getProfileAvailabilityItems(username));
        dispatch(profileInfos.getProfileStrengths(username));
        dispatch(profileInfos.getProfileStrengthsRaw(username));
        dispatch(profileInfos.getProfileTestimonials(username));
        dispatch(followInfos.checkProfileFollowing(username));
    }, [dispatch, username]);

    const profile = useSelector(state => state.profile);
    const followedByMe = useSelector(state => state.followedByMe)

    const myTestimonial = profile.testimonials.filter((testimonial) => { return testimonial.friendId === user.id}).map(testimonial => ({ 
        id: testimonial.id
    }))

    document.title = profile.requesting ? 'Carregando...' : profile.name+' '+profile.lastname+' | Mublin'

    const mainProjects = profile.projects.filter((project) => { return project.portfolio === 0 && project.confirmed === 1 })
    const portfolioProjects = profile.projects.filter((project) => { return project.portfolio === 1 && project.confirmed === 1 })

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

    const sliderTestimonialsOptions = {
        autoPlay: false,
        freeScroll: false,
        prevNextButtons: false,
        pageDots: true,
    }

    const [loadingFollow, setLoadingFollow] = useState(false)

    const followUnfollow = () => {
        if (!followedByMe.following || followedByMe.following === 'false') {
            setLoadingFollow(true)
            fetch('https://mublin.herokuapp.com/profile/'+profile.id+'/follow', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                }
            })
            .then((response) => {
                dispatch(followInfos.checkProfileFollowing(username));
                dispatch(profileInfos.getProfileFollowers(username));
                setLoadingFollow(false)
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao tentar seguir o usuário")
            })
        } else if (followedByMe.following === 'true') {
            setLoadingFollow(true)
            fetch('https://mublin.herokuapp.com/profile/'+profile.id+'/follow', {
                method: 'delete',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                }
            })
            .then((response) => {
                dispatch(followInfos.checkProfileFollowing(username));
                dispatch(profileInfos.getProfileFollowers(username));
                setLoadingFollow(false)
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao deixar de seguir o usuário")
            })
        }
    }

    // Unfollow Confirmation
    const [unfollowAlert, setUnfollowAlert] = useState(false)

    // Modals
    const goToProfile = (username) => {
        setModalFollowersOpen(false)
        setModalFollowingOpen(false)
        history.push({pathname: '/'+username})
    }
    // Modal Followers
    const [modalFollowersOpen, setModalFollowersOpen] = useState(false)
    // Modal Following
    const [modalFollowingOpen, setModalFollowingOpen] = useState(false)

    // Strengths (Pontos Fortes)
    const [modalStrengthsOpen, setModalStrengthsOpen] = useState(false);
    const [strengthsLoaded, setStrengthsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [strengths, setStrengths] = useState([]);
    const [strengthVoted, setStrengthVoted] = useState(null);
    const [strengthVotedName, setStrengthVotedName] = useState('');

    const myVotes = profile.strengthsRaw.filter((x) => { return x.idUserFrom === user.id}).map(x => ({ 
        id: x.id,
        idUserTo: x.idUserTo,
        idUserFrom: x.idUserFrom,
        strengthId: x.strengthId,
        icon: x.icon,
        strengthTitle: x.strengthTitle
    }))

    useEffect(() => {
        fetch('https://mublin.herokuapp.com/strengths/getAllStrengths', {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer '+user.token
            }),
        })
          .then(res => res.json())
          .then(
            (result) => {
                setStrengthsLoaded(true);
                setStrengths(result);
            },
            (error) => {
                setStrengthsLoaded(true);
                setError(error);
            }
          )
    }, [])

    const voteProfileStrength = (strengthId, strengthTitle) => {
        setStrengthsLoaded(false)
        fetch('https://mublin.herokuapp.com/profile/voteStrength', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({strengthId: strengthId, profileId: profile.id, nameTo: profile.name, emailTo: profile.email, strengthTitle: strengthTitle})
        })
        .then((response) => {
            dispatch(profileInfos.getProfileStrengths(username));
            dispatch(profileInfos.getProfileStrengthsRaw(username));
            setStrengthsLoaded(true)
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro. Tente novamente em instantes")
        })
    }

    const unVoteProfileStrength = (voteId) => {
        setStrengthsLoaded(false)
        fetch('https://mublin.herokuapp.com/profile/'+voteId+'/unvoteStrength', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            }
        })
        .then((response) => {
            dispatch(profileInfos.getProfileStrengths(username));
            dispatch(profileInfos.getProfileStrengthsRaw(username));
            setStrengthsLoaded(true)
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao remover o voto. Tente novamente em instantes")
        })
    }

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile profile={true} pageType='profile' />
        { profile.requesting ? (
            <Loader
                className="appLoadingIcon"
                type="Audio"
                color="#ffffff"
                height={100}
                width={100}
                timeout={30000} //30 secs
            />
        ) : (
            profile.id && 
            <>
            <Spacer compact />
            <Grid id="info" columns={2} stackable className="container pb-5 pb-md-0 mb-5 mb-md-0">
                <Grid.Row>
                    <Grid.Column width={4} className='noPaddingForMobile main'>
                        <Card id="card" style={{width:"100%"}}>
                            <Card.Content>
                                <div className="center aligned mb-3 mt-2 mt-md-2">
                                    { profile.picture ? (
                                        <Image src={profile.picture} size="small" circular />
                                    ) : (
                                        <Image src='https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_Kblh5CBKPp.jpg' size="small" circular />
                                    )}
                                </div>
                                <div className="center aligned">
                                    { !profile.requesting &&
                                    <>
                                        <Header size="large" className="mb-1" style={{fontSize:'1.60428571em'}}>
                                            {profile.name} <nobr>{profile.lastname} {!!profile.verified && <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' />}</nobr>
                                        </Header>
                                        <Header className='my-0'>{profile.plan === 'Pro' && <Label size="medium" className="ml-1 p-2" style={{cursor:"default"}}>PRO</Label>}</Header>
                                        <p className="mt-2 mb-0" style={{ fontSize: "13.5px" }}>
                                            {profile.roles.map((role, key) =>
                                                <span key={key}>{role.name}{key < (profile.roles.length-1) && ', '}</span>
                                            )}
                                        </p>
                                        { profile.city &&
                                            <p className="mb-0" style={{ fontSize: "12px" }}>
                                                {profile.city} {profile.city !== profile.region && ', '+profile.region}
                                            </p>
                                        }
                                    </>
                                    }
                                    <Button.Group fluid color="black" size="small" className="mt-3">
                                        { user.id !== profile.id ? (
                                            <Button content={followedByMe.following === 'true' ? 'Seguindo' : 'Seguir'} loading={loadingFollow} onClick={() => followUnfollow()} />
                                        ) : (
                                            <Button content='Editar' onClick={() => history.push("/settings/profile")} />
                                        )}
                                        <Button content='Mensagem' />
                                    </Button.Group>
                                </div>
                                { (profile.bio && profile.bio !== 'null') && 
                                    <Card.Description className="center aligned mt-3" style={{ fontSize: "13px" }}>
                                        {profile.bio}
                                    </Card.Description>
                                }
                            </Card.Content>
                            { profile.availabilityId && 
                                <Card.Content textAlign='center' style={{ fontSize: "13px" }}>
                                    <Label circular size='mini' color={profile.availabilityColor} empty key={profile.availabilityColor} /> {profile.availabilityTitle}
                                    { (profile.availabilityId === 1 || profile.availabilityId === 2) &&
                                    <>
                                        <p style={{ fontSize: "11px" }}>
                                            {profile.availabilityFocus === 1 || profile.availabilityFocus === 3 && <span className='ml-2 mr-2'><Icon name='checkmark' size='small' />Projetos próprios</span>} {profile.availabilityFocus === 2 || profile.availabilityFocus === 3 && <span className='mr-2'><Icon name='checkmark' size='small' />Sideman</span>}
                                        </p>
                                        <p className='mt-1'>
                                            { profile.availabilityItems[0].id && profile.availabilityItems.map((item, key) =>
                                                <Label basic size='mini' className='mr-1' style={{cursor:'default',fontWeight:'500'}}>{item.itemName}</Label>
                                            )}  
                                        </p>
                                    </>
                                    }
                                </Card.Content>
                            }
                            <div className="content">
                                { profile.following.length ? (
                                    <span className="right floated" style={{fontSize:'13px',cursor:'pointer',fontWeight:'500',}} onClick={() => setModalFollowingOpen(true)}>
                                        {profile.following.length} seguindo
                                    </span>
                                ) : (
                                    <span className="right floated" style={{fontSize:'13px',fontWeight:'500',opacity:'0.6',cursor:'default'}}>
                                        {profile.following.length} seguindo
                                    </span>
                                )}
                                { profile.followers.length ? (
                                    <span style={{fontSize: '13px',fontWeight:'500',cursor:'pointer'}} onClick={() => setModalFollowersOpen(true)}>
                                        {profile.followers.length} seguidores
                                    </span>
                                ) : (
                                    <span style={{fontSize: '13px',fontWeight:'500',cursor:'default'}}>
                                        {profile.followers.length} seguidores
                                    </span>
                                )}
                            </div>
                        </Card>
                    </Grid.Column>
                    <Grid.Column width={12}  className='noPaddingForMobile'>
                        <Card id="projects" style={{ width: "100%" }}>
                            <Card.Content>
                                <Header as='h3'>Projetos</Header>
                                <Tab defaultActiveIndex={(mainProjects.length > portfolioProjects.length || mainProjects.length === portfolioProjects.length) ? 0 : 1} menu={{ secondary: true }} panes={
                                    [
                                        {
                                        menuItem: 'Principais ('+mainProjects.length+')',
                                        render: () => 
                                            <Tab.Pane loading={profile.requesting} attached={false} as="div">
                                                <Flickity
                                                    className={'carousel'}
                                                    elementType={'div'}
                                                    options={sliderOptions}
                                                    disableImagesLoaded={false}
                                                    reloadOnUpdate
                                                >
                                                    { !profile.requesting ? (
                                                        profile.projects[0].id ? (
                                                            mainProjects.map((projeto, key) =>
                                                                <div className="carousel-cell" key={projeto.id}>
                                                                    <Link to={{ pathname: '/project/'+projeto.username }}>
                                                                        {projeto.picture ? (
                                                                            <Image src={projeto.picture} rounded />
                                                                        ) : (
                                                                            <Image src={'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg'} height='85' width='95' rounded />
                                                                        )}
                                                                        <Header as='h5' className='mt-2 mb-0'>
                                                                            <Header.Content>
                                                                                {projeto.name}
                                                                                <Header.Subheader style={{fontSize:'11.5px'}}>
                                                                                    {projeto.type}
                                                                                </Header.Subheader>
                                                                            </Header.Content>
                                                                        </Header>
                                                                        <div className="mt-2" style={{fontWeight: '400',fontSize: '11px', color: 'black', opacity: '0.8'}}>
                                                                            <Icon name={projeto.workIcon} /> {projeto.workTitle}
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            )
                                                        ) : (
                                                            <div className="carousel-cell">
                                                                <Image src={'https://ik.imagekit.io/mublin/misc/square-sad-music_SeGz8vs_2A.jpg'} height='85' width='85' rounded />
                                                                <h5 className="ui header mt-2 mb-0">
                                                                    <div className="sub header mt-1">Sem projetos</div>
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
                                                    <Icon name='tags' className="mr-2" /> Portfolio ({portfolioProjects.length})
                                                </Menu.Item>
                                                ),
                                            render: () => 
                                                <Tab.Pane attached={false} as="div">
                                                    <Flickity
                                                        className={'carousel'}
                                                        elementType={'div'}
                                                        options={sliderOptions}
                                                        disableImagesLoaded={false}
                                                        reloadOnUpdate
                                                    >
                                                        { !profile.requesting ? (
                                                            portfolioProjects.length ? (
                                                                portfolioProjects.map((projeto, key) =>
                                                                    <div className="carousel-cell" key={projeto.id}>
                                                                        <Link to={{ pathname: '/project/'+projeto.username }}>
                                                                            {projeto.picture ? (
                                                                                <Image src={projeto.picture} rounded />
                                                                            ) : (
                                                                                <Image src={'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg'} height='85' width='95' rounded />
                                                                            )}
                                                                            <Header as='h5' className='mt-2 mb-0'>
                                                                                <Header.Content>
                                                                                    {projeto.name}
                                                                                    <Header.Subheader style={{fontSize:'11.5px'}}>
                                                                                        {projeto.type}2
                                                                                    </Header.Subheader>
                                                                                </Header.Content>
                                                                            </Header>
                                                                            <div className="mt-2" style={{fontWeight: '400',fontSize: '11px', color: 'black', opacity: '0.8'}}>
                                                                                <Icon name={projeto.workIcon} /> {projeto.workTitle}
                                                                            </div>
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
                            </Card.Content>
                        </Card>
                        { profile.recentActivity[0].id && 
                        <Card id="posts" style={{ width: "100%" }}>
                            <Card.Content>
                                <Header as='h3' className='mb-3'>Atividades recentes</Header>
                                { profile.requesting ? (
                                    <Icon loading name='spinner' size='large' />
                                ) : ( 
                                    <Feed>
                                        {profile.recentActivity.map((activity, key) =>
                                            <Feed.Event key={key} className={key < (profile.recentActivity.length - 1) ? 'mb-2' : ''}>
                                                <Feed.Label image={profile.picture} />
                                                <Feed.Content className='mt-1'>
                                                    <Feed.Date style={{fontSize:'11px',fontWeight:'500'}}>
                                                        há {formatDistance(new Date(activity.created * 1000), new Date(), {locale:pt})}
                                                    </Feed.Date>
                                                    {activity.category === 'user' && 
                                                        <Feed.Summary style={{fontWeight:'500'}}>
                                                            {activity.extraText}
                                                        </Feed.Summary>
                                                    }
                                                    {activity.category === 'project' && 
                                                        <Feed.Summary>
                                                            <span style={{fontWeight:'500'}}>
                                                                {activity.action} {activity.category === 'project' ? activity.relatedProjectName+' ('+activity.relatedProjectType+')' : (<a>{activity.relatedEventTitle}</a>)}
                                                            </span>
                                                        </Feed.Summary>
                                                    }
                                                    {activity.category === 'event' && 
                                                        <Feed.Summary>
                                                            <span style={{fontWeight:'500'}}>
                                                                {activity.action} <a>{activity.relatedEventTitle}</a>
                                                            </span>
                                                        </Feed.Summary>
                                                    }
                                                </Feed.Content>
                                            </Feed.Event>
                                        )}
                                    </Feed>
                                )}
                            </Card.Content>
                        </Card>
                        }
                        <Card id="strengths" style={{ width: "100%" }}>
                            <Card.Content>
                                <div className='cardTitle'>
                                    <Header as='h3' className='pt-1'>Pontos Fortes {profile.strengths[0].idUserTo && <Label className='ml-1 p-2' style={{opacity:'0.4'}}>{profile.strengths.length}</Label>}</Header>
                                    { profile.id !== user.id &&
                                        <Label as='a' size='small' content='Votar' style={{height:'fit-content'}} onClick={() => setModalStrengthsOpen(true)} />
                                    }
                                </div>
                                { profile.requesting ? (
                                    <Icon loading name='spinner' size='large' />
                                ) : ( 
                                    (profile.strengths[0].strengthId && profile.strengths[0].idUserTo === profile.id) ? (
                                        <Flickity
                                            className={'carousel'}
                                            elementType={'div'}
                                            options={sliderOptions}
                                            disableImagesLoaded={false}
                                            reloadOnUpdate
                                            className='mt-2'
                                        >
                                            {profile.strengths.map((strength, key) =>
                                                <div key={key} class="center aligned mr-4" style={{height:'63px', listStyle:'none'}}>
                                                    <Header as='h3' className='my-0'><i className={strength.icon}></i></Header>
                                                    <Header as='h5' className='my-0'><nobr>{strength.strengthTitle}</nobr></Header>
                                                    <Label size='mini'>{strength.percent}</Label>
                                                </div>
                                            )}
                                        </Flickity>
                                    ) : (
                                        <Card.Description className={profile.id !== user.id ? 'mt-0' : 'mt-3'} style={{ fontSize: "13px" }}>
                                            Nenhum ponto forte votado para {profile.name} até o momento
                                        </Card.Description>
                                    )
                                )}
                                { profile.strengthsRaw[0].id && 
                                    <p className='mt-3 mb-0' style={{fontSize:'11px'}}>
                                        {profile.strengthsRaw[0].id && <span style={{opacity:'0.5'}}>{profile.strengthsRaw.length+' votos no total'}</span>}
                                    </p>
                                }
                            </Card.Content>
                        </Card>
                        { profile.plan === "Pro" && 
                        <Card id="gear" style={{ width: "100%" }}>
                            <Card.Content>
                                <Header as='h3'>Equipamento {profile.gear[0].productId && <Label className='ml-1 p-2' style={{opacity:'0.4'}}>{profile.gear.length}</Label>}</Header>
                                { profile.requesting ? (
                                    <Icon loading name='spinner' size='large' />
                                ) : ( 
                                    profile.gear[0].brandId ? (
                                        <Flickity
                                            className={'carousel'}
                                            elementType={'div'}
                                            options={sliderOptions}
                                            disableImagesLoaded={false}
                                            reloadOnUpdate
                                        >
                                            {profile.gear.map((product, key) =>
                                                <div className='carousel-cell' key={key}>
                                                    {product.picture ? (
                                                        product.featured ? (
                                                            <Image 
                                                                src={product.picture} 
                                                                rounded 
                                                                // label={{ as: 'div', corner: 'left', icon: 'heart', size: 'mini' }} 
                                                                as='a' 
                                                                href={'/gear/product/'+product.productId}
                                                                className='cpointer' 
                                                            />
                                                        ) : (
                                                            <Image src={product.picture} rounded as='a' href={'/gear/product/'+product.productId} />
                                                        )
                                                    ) : (
                                                        <Image src={'https://ik.imagekit.io/mublin/misc/tr:h-200,w-200,c-maintain_ratio/no-picture_pKZ8CRarWks.jpg'} height='85' width='85' rounded label={{ as: 'a', corner: 'left', icon: 'heart' }} as='a' href={'/gear/product/'+product.productId} />
                                                    )}
                                                    <Popup inverted size='mini' content={product.category+' '+product.brandName+' '+product.productName} trigger={<Header as='h5' className='mt-2 mb-0' style={{cursor:'default'}}><Header.Content><Link to={{pathname: '/gear/product/'+product.productId}} style={{color:'black'}}>{product.productName}</Link></Header.Content></Header>} />
                                                    <Header.Subheader style={{fontWeight: '500',fontSize: '11px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',width:'99%'}}><Link to={{pathname: '/gear/product/'+product.productId}} style={{color:'gray'}}>{product.brandName}</Link></Header.Subheader>
                                                    { product.forSale ? (
                                                        <Popup inverted size='mini' content='À venda' trigger={<Label tag content={product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} size='mini' style={{fontWeight: '500',fontSize: '9px',cursor:'default'}} className='mt-1' color='green' />} />
                                                    ) : (
                                                        !!product.currentlyUsing && 
                                                        <Label content='Em uso' icon='checkmark' size='mini' style={{fontWeight: '400',fontSize: '9px',cursor:'default'}} className='mt-1' />
                                                    )}
                                                </div>
                                            )}
                                        </Flickity>
                                    ) : (
                                        <Card.Description className="mt-3" style={{ fontSize: "13px" }}>
                                            Nenhum equipamento cadastrado
                                        </Card.Description>
                                    )
                                )}
                            </Card.Content>
                        </Card>
                        }
                        <Card id="testimonials" style={{ width: "100%" }} className={profile.testimonials[0].id && 'pb-4'}>
                            <Card.Content>
                                <div className='cardTitle'>
                                    <Header as='h3' className='pt-1'>Depoimentos {profile.testimonials[0].id && <Label className='ml-1 p-2' style={{opacity:'0.4'}}>{profile.testimonials.length}</Label>}</Header>
                                    { profile.id !== user.id &&
                                        <Label as='a' size='small' style={{height:'fit-content'}} content={myTestimonial.length ? 'Editar' : 'Escrever'} />
                                    }
                                </div>
                                { profile.testimonials[0].id ? (
                                    <Flickity 
                                        className="pt-2"
                                        options={sliderTestimonialsOptions}
                                    > 
                                        {profile.testimonials.map((testimonial, key) =>
                                            <div key={key} className='testimonial-cell'>
                                                <Header as='h4'>
                                                    <Image circular src={testimonial.friendPicture} size='small' href={'/'+testimonial.friendUsername} />
                                                    <Header.Content>
                                                        {testimonial.title}
                                                        <Header.Subheader>
                                                            {testimonial.friendName} {testimonial.friendPlan === 'Pro' && <Label size="tiny" className="ml-1 p-1">Pro</Label>}
                                                        </Header.Subheader>
                                                    </Header.Content>
                                                </Header>
                                                <Header.Subheader style={{cursor:'default'}} className='mt-2'>
                                                    {testimonial.testimonial}
                                                </Header.Subheader>
                                            </div>
                                        )}
                                    </Flickity>
                                ) : (
                                    <Card.Description className={profile.id !== user.id ? 'mt-0' : 'mt-3'} style={{ fontSize: "13px" }}>
                                        Nenhum depoimento para {profile.name} até o momento
                                    </Card.Description>
                                )}
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
            }
            </>
        )}
        <Modal
            size='mini'
            open={modalStrengthsOpen}
            onClose={() => setModalStrengthsOpen(false)}
        >
            <Modal.Header>Votar pontos fortes de {profile.name+' '+profile.lastname}</Modal.Header>
            <Modal.Content>
                <Form>
                    { strengths.map((strength,key) =>
                        <Form.Field key={key}>
                            <div className={myVotes.filter((x) => { return x.strengthId === strength.id}).length ? 'ui radio checkbox voted' : 'ui radio checkbox' }>
                                <input 
                                    disabled={myVotes.filter((x) => { return x.strengthId === strength.id}).length}
                                    id={'strengthsGroup_'+strength.id}
                                    name={!myVotes.filter((x) => { return x.strengthId === strength.id}).length ? 'strengthsGroup' : ''} 
                                    type="radio" 
                                    className="hidden" 
                                    value={strength.id}
                                    checked={(strength.id === strengthVoted || myVotes.filter((x) => { return x.strengthId === strength.id}).length) ? true : false}
                                    onChange={() => {
                                        setStrengthVoted(strength.id);
                                        setStrengthVotedName(strength.title);
                                    }}
                                />
                                <label for={'strengthsGroup_'+strength.id} className={myVotes.filter((x) => { return x.strengthId === strength.id}).length && 'voted'}>
                                    <span><i className={strength.icon+' fa-fw ml-1'}></i> {strength.title}</span> {!!myVotes.filter((x) => { return x.strengthId === strength.id}).length && <Icon name='times' onClick={() => unVoteProfileStrength(myVotes.filter((x) => { return x.strengthId === strength.id})[0].id)} title='Remover meu voto' />}
                                </label>
                            </div>
                        </Form.Field>
                    )}
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button size='small' onClick={() => setModalStrengthsOpen(false)}>
                    Fechar
                </Button>
                <Button size='small' color='black' loading={!strengthsLoaded} onClick={() => voteProfileStrength(strengthVoted,strengthVotedName)}>
                    Votar
                </Button>
            </Modal.Actions>
        </Modal>
        <Modal
            size='mini'
            open={modalFollowersOpen}
            onClose={() => setModalFollowersOpen(false)}
            closeIcon
        >
            <Modal.Header>{profile.followers.length+' seguidores'}</Modal.Header>
            <Modal.Content>
                {profile.followers.map((follower, key) =>
                    <List verticalAlign='middle'>
                        <List.Item key={key}>
                            <List.Content floated='right'>
                                <Button size='tiny' onClick={() => goToProfile(follower.username)}>Ver perfil</Button>
                            </List.Content>
                            <Image avatar src={follower.picture ? follower.picture : 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'} onClick={() => goToProfile(follower.username)} style={{cursor:'pointer'}} />
                            <List.Content onClick={() => goToProfile(follower.username)}>
                                <List.Header style={{cursor:'pointer'}}>{follower.name}<br/><span style={{fontWeight:'400'}}>{'@'+follower.username}</span></List.Header>
                            </List.Content>
                        </List.Item>
                    </List>
                )}
            </Modal.Content>
        </Modal>
        <Modal
            size='mini'
            open={modalFollowingOpen}
            onClose={() => setModalFollowingOpen(false)}
            closeIcon
        >
            <Modal.Header>{'Seguindo '+profile.following.length}</Modal.Header>
            <Modal.Content>
                {profile.following.map((following, key) =>
                    <List verticalAlign='middle'>
                        <List.Item key={key}>
                            <List.Content floated='right'>
                                <Button size='tiny' onClick={() => goToProfile(following.username)}>Ver perfil</Button>
                            </List.Content>
                            <Image avatar src={following.picture ? following.picture : 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'} onClick={() => goToProfile(following.username)} style={{cursor:'pointer'}} />
                            <List.Content onClick={() => goToProfile(following.username)}>
                                <List.Header style={{cursor:'pointer'}}>{following.name}<br/><span style={{fontWeight:'400'}}>{'@'+following.username}</span></List.Header>
                            </List.Content>
                        </List.Item>
                    </List>
                )}
            </Modal.Content>
        </Modal>
        { (!profile.requesting && !profile.id) && 
            <main className='_404'>
            <div className="ui container" style={{ height: '100%' }}>
                <Grid centered columns={1} verticalAlign='middle'>
                    <Grid.Column mobile={16} computer={10} className="pb-0">
                        <Segment basic textAlign='center'>
                            <Image as='a' href='/' centered src='https://ik.imagekit.io/mublin/logos/mublin-logo-text-black_xyGjcfis_.png' className='mb-1' /> Erro 404
                        </Segment>
                        <Segment basic textAlign='center'>
                            <Header as='h1' className='mb-0'>Ops!</Header>
                            <Header as='h3' className='mt-0'>Página não encontrada!</Header>
                            <p>Não encontramos a página solicitada.</p>
                            {/* <Button 
                                color='black' 
                                size='small' 
                                onClick={() => history.push("/home")}
                                className='mt-5 mr-0'
                            >
                                Ir para a Home
                            </Button> */}
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
            </main>
        }
        </>
    );
};

export default ProfilePage;