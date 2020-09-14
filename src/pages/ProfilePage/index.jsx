import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import { profileInfos } from '../../store/actions/profile';
import { followInfos } from '../../store/actions/follow';
import { Header, Tab, Card, Grid, Image, Button, Label, Dimmer, Loader, Icon, Modal, List, Confirm, Placeholder, Popup} from 'semantic-ui-react';
import Flickity from 'react-flickity-component';
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
        dispatch(profileInfos.getProfileGear(username));
        dispatch(profileInfos.getProfileAvailabilityItems(username));
        dispatch(profileInfos.getProfileTestimonials(username));
        dispatch(followInfos.checkProfileFollowing(username));
    }, [dispatch, username]);

    const profile = useSelector(state => state.profile);
    const followedByMe = useSelector(state => state.followedByMe)

    const myTestimonial = profile.testimonials.filter((testimonial) => { return testimonial.friendId === user.id}).map(testimonial => ({ 
        id: testimonial.id
    }))

    document.title = profile.name+' '+profile.lastname+' | Mublin'

    const mainProjects = profile.projects.filter((project) => { return project.portfolio === 0 })
    const portfolioProjects = profile.projects.filter((project) => { return project.portfolio === 1 })

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

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
            <Grid id="info" columns={2} stackable className="container mb-2 mt-4 mt-md-5 pt-5">
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Card id="card" style={{ width: "100%" }}>
                            <Card.Content>
                                <div className="center aligned mb-3 mt-2 mt-md-2">
                                    { profile.picture ? (
                                        <Image src={profile.picture} size="tiny" circular alt={'Foto de '+profile.name} />
                                    ) : (
                                        <Image src='https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' size="tiny" circular alt={'Foto de '+profile.name} />
                                    )}
                                </div>
                                <div className="center aligned">
                                    { !profile.requesting &&
                                    <>
                                        <Header size="medium" className="mb-1">{!profile.requesting && profile.name+' '+profile.lastname} {!!profile.verified && <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' />}</Header>
                                        <Header className='my-0'>{profile.plan === 'Pro' && <Label color="black" size="tiny" className="ml-1 p-1" style={{cursor:"default"}}>Pro</Label>}</Header>
                                        <p className="mb-1" style={{ fontSize: "13px" }}>
                                            {profile.roles.map((role, key) =>
                                                <span key={key}>{role.name}{key < (profile.roles.length-1) && ', '}</span>
                                            )}
                                        </p>
                                        { profile.city &&
                                            <p className="mb-1" style={{ fontSize: "11px" }}>
                                                {profile.city+', '+profile.region}
                                            </p>
                                        }
                                    </>
                                    }
                                    <Button.Group fluid color="black" size="mini" className="mt-3">
                                        { user.id !== profile.id ? (
                                            <Button icon={followedByMe.following === 'true' ? 'checkmark' : 'add user'} content={followedByMe.following === 'true' ? 'Seguindo' : 'Seguir'} loading={loadingFollow} onClick={() => followUnfollow()} />
                                        ) : (
                                            <Button icon='pencil' content='Editar perfil' onClick={() => history.push("/settings/profile")} />
                                        )}
                                        <Button icon='envelope outline' content='Mensagem' />
                                    </Button.Group>
                                </div>
                                <Card.Description className="center aligned mt-3" style={{ fontSize: "13px" }}>
                                    {profile.bio}
                                </Card.Description>
                            </Card.Content>
                            <Card.Content textAlign='center' style={{ fontSize: "13px" }}>
                                <Label circular size='mini' color={profile.availabilityColor} empty key={profile.availabilityColor} /> {profile.availabilityTitle}
                                { (profile.availabilityId === 1 || profile.availabilityId === 2) &&
                                <>
                                <p className='mt-1'>
                                    { profile.availabilityItems[0].id && profile.availabilityItems.map((item, key) =>
                                        <Label size='mini' className='mr-1' style={{cursor:"default"}}>{item.itemName}</Label>
                                    )}  
                                </p>
                                <p style={{ fontSize: "11px" }}>
                                    {profile.availabilityFocus === 1 || profile.availabilityFocus === 3 && <span className='mr-2'><Icon name='checkmark' size='small' />Projetos próprios</span>} {profile.availabilityFocus === 2 || profile.availabilityFocus === 3 && <span className='mr-2'><Icon name='checkmark' size='small' />Outros projetos</span>}
                                </p>
                                </>
                                }
                            </Card.Content>
                            <div className="content">
                                { profile.following.length ? (
                                    <span className="right floated" style={{ fontSize: '13px', cursor: 'pointer' }} onClick={() => setModalFollowingOpen(true)}>
                                        {profile.following.length} seguindo
                                    </span>
                                ) : (
                                    <span className="right floated" style={{fontSize: '13px',opacity:'0.6',cursor:'default'}}>
                                        {profile.following.length} seguindo
                                    </span>
                                )}
                                { profile.followers.length ? (
                                    <span style={{ fontSize: '13px', cursor: 'pointer' }} onClick={() => setModalFollowersOpen(true)}>
                                        {profile.followers.length} seguidores
                                    </span>
                                ) : (
                                    <span style={{fontSize: '13px',opacity:'0.6',cursor:'default'}}>
                                        {profile.followers.length} seguidores
                                    </span>
                                )}
                            </div>
                        </Card>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Card id="projects" style={{ width: "100%" }}>
                            <Card.Content>
                                <Header as='h3'>Projetos</Header>
                                <Tab menu={{ secondary: true }} panes={
                                    [
                                        {
                                        menuItem: 'Principais ('+mainProjects.length+')',
                                        render: () => 
                                            <Tab.Pane loading={profile.requesting} attached={false} as="div">
                                                <Flickity
                                                    className={'carousel'} // default ''
                                                    elementType={'div'} // default 'div'
                                                    options={sliderOptions} // takes flickity options {}
                                                    disableImagesLoaded={false} // default false
                                                    reloadOnUpdate // default false
                                                >
                                                    { !profile.requesting ? (
                                                        profile.projects[0].id ? (
                                                            mainProjects.map((projeto, key) =>
                                                                <div className="carousel-cell" key={projeto.id}>
                                                                    <Link to={{ pathname: '/project/'+projeto.username }}>
                                                                        {projeto.picture ? (
                                                                            <Image src={projeto.picture} rounded />
                                                                        ) : (
                                                                            <Image src={'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg'} height='85' width='85' rounded />
                                                                        )}
                                                                        <h5 className="ui header mt-2 mb-0">
                                                                            {projeto.name}
                                                                            <div className="sub header mt-1">{projeto.type}</div>
                                                                        </h5>
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
                                            menuItem: 'Portfolio ('+portfolioProjects.length+')',
                                            render: () => 
                                                <Tab.Pane attached={false} as="div">
                                                    <Flickity
                                                        className={'carousel'} // default ''
                                                        elementType={'div'} // default 'div'
                                                        options={sliderOptions} // takes flickity options {}
                                                        disableImagesLoaded={false} // default false
                                                        reloadOnUpdate // default false
                                                    >
                                                        { !profile.requesting ? (
                                                            profile.projects[0].id ? (
                                                                portfolioProjects.map((projeto, key) =>
                                                                    <div className="carousel-cell" key={projeto.id}>
                                                                        <Link to={{ pathname: '/project/'+projeto.username }}>
                                                                            {projeto.picture ? (
                                                                                <Image src={projeto.picture} rounded />
                                                                            ) : (
                                                                                <Image src={'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg'} height='85' width='85' rounded />
                                                                            )}
                                                                            <h5 className="ui header mt-2 mb-0">
                                                                                {projeto.name}
                                                                                <div className="sub header mt-1">{projeto.type}</div>
                                                                            </h5>
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
                                        }
                                    ]
                                }
                                />
                            </Card.Content>
                        </Card>
                        <Card id="strengths" style={{ width: "100%" }}>
                            <Card.Content>
                                <Header as='h3'>Pontos Fortes</Header>
                            </Card.Content>
                        </Card>
                        <Card id="gear" style={{ width: "100%" }}>
                            <Card.Content>
                                <Header as='h3'>Equipamento</Header>
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
                                                            <Image src={product.picture} rounded label={{ as: 'div', corner: 'left', icon: 'heart', size: 'mini' }} />
                                                        ) : (
                                                            <Image src={product.picture} rounded />
                                                        )
                                                    ) : (
                                                        <Image src={'https://ik.imagekit.io/mublin/misc/tr:h-200,w-200,c-maintain_ratio/no-picture_pKZ8CRarWks.jpg'} height='85' width='85' rounded label={{ as: 'a', corner: 'left', icon: 'heart' }} />
                                                    )}
                                                    <Popup inverted size='mini' content={product.category+' '+product.brandName+' '+product.productName} trigger={<Header as='h5' className='mt-2 mb-0' style={{cursor:'default'}}><Header.Content>{product.productName}</Header.Content></Header>} />
                                                    <Header.Subheader style={{fontWeight: '500',fontSize: '11px'}}><Link to={{pathname: "/brands", search: "?id="+product.brandId, state: { fromProfile: true } }} style={{color:'gray'}}>{product.brandName}</Link></Header.Subheader>
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
                        <Card id="testimonials" style={{ width: "100%" }} className={profile.testimonials[0].id && 'pb-4'}>
                            <Card.Content>
                                <div className='cardTitle'>
                                    <Header as='h3'>Depoimentos {profile.testimonials[0].id && '('+profile.testimonials.length+')'}</Header>
                                    { profile.id !== user.id &&
                                        <Label size='small' content={myTestimonial.length ? 'Editar' : 'Escrever'} icon={!myTestimonial.length ? 'plus' : 'pencil'} />
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
                                <List.Content>
                                    <List.Header as='a' onClick={() => goToProfile(follower.username)}>{follower.name}</List.Header>
                                    <List.Description>
                                        {'@'+follower.username}
                                    </List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    )}
                </Modal.Content>
                {/* <Modal.Actions>
                    <Button size='medium' onClick={() => setModalFollowersOpen(false)}>
                        Fechar
                    </Button>
                </Modal.Actions> */}
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
                                <List.Content>
                                    <List.Header as='a' onClick={() => goToProfile(following.username)}>{following.name}</List.Header>
                                    <List.Description>
                                        {'@'+following.username}
                                    </List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    )}
                </Modal.Content>
                {/* <Modal.Actions>
                    <Button size='medium' onClick={() => setModalFollowingOpen(false)}>
                        Fechar
                    </Button>
                </Modal.Actions> */}
            </Modal>
        </>
    );
};

export default ProfilePage;