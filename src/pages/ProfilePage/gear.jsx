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
import { Header, Segment, Card, Grid, Image, Button, Label, Icon, Modal, List, Popup, Form} from 'semantic-ui-react';
import Loader from 'react-loader-spinner';
import Flickity from 'react-flickity-component';
import './styles.scss';
import './flickity.scss';

function ProfilePage (props) {

    let dispatch = useDispatch()

    let history = useHistory()

    const cdnBaseURL = 'https://ik.imagekit.io/mublin'
    const backendBaseURL = 'https://mublin.herokuapp.com'

    const user = JSON.parse(localStorage.getItem('user'))

    const username = props.match.params.username

    useEffect(() => {
        dispatch(profileInfos.getProfileInfo(username));
        dispatch(profileInfos.getProfileRoles(username));
        dispatch(profileInfos.getProfileFollowers(username));
        dispatch(profileInfos.getProfileFollowing(username));
        dispatch(profileInfos.getProfilePosts(username));
        dispatch(profileInfos.getProfileGear(username));
        dispatch(profileInfos.getProfileGearSetups(username));
        dispatch(profileInfos.getProfileAvailabilityItems(username));
        dispatch(followInfos.checkProfileFollowing(username));
    }, [dispatch, username]);

    const profile = useSelector(state => state.profile)

    const [gearSetupProducts, setGearSetupProducts] = useState('')

    const [gearCategorySelected, setGearCategorySelected] = useState('')

    const gearTotal = useSelector(state => state.profile.gear).filter((product) => { return (gearSetupProducts) ? gearSetupProducts.find(x => x.productId === product.productId) : product.productId > 0 })

    const gear = gearTotal.filter((product) => { return (gearCategorySelected) ? product.category === gearCategorySelected : product.productId > 0 })

    const getSetupProducts = (setupId) => {
        if (setupId === 'all') {
            setGearSetupProducts('')
        } else {
            fetch(backendBaseURL+'/profile/'+username+'/'+setupId+'/gearSetupProducts', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                }
            })
            .then(res => res.json())
            .then((result) => {
                setGearSetupProducts(result)
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao buscar os produtos do Setup selecionado. Tente novamente em instantes.")
            })
        }
    }

    const followedByMe = useSelector(state => state.followedByMe)

    document.title = profile.requesting ? 'Carregando...' : profile.name+' '+profile.lastname+' | Mublin'

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
    };

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
    // const [unfollowAlert, setUnfollowAlert] = useState(false)

    // Modals

    // Modal Profile Picture
    const [modalPictureOpen, setModalPictureOpen] = useState(false)
    
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
        <HeaderMobile profile={true} pageType='profile' profilePicture={profile.picture} />
        {profile.requesting ? (
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
            <Grid id="profileGearPage" columns={2} stackable className="container pb-5 pb-md-0 mb-5 mb-md-0">
                <Grid.Row>
                    <Grid.Column width={16}  className='noPaddingForMobile'>
                        <Header as='h3'>
                            <Image circular src={profile.picture ? profile.picture : cdnBaseURL+'/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_Kblh5CBKPp.jpg'} /> 
                            <Header.Content>
                                {profile.name} {profile.lastname}
                                <Header.Subheader>Voltar ao perfil</Header.Subheader>
                            </Header.Content>
                        </Header>
                        { profile.plan === "Pro" && 
                        <Card id="gear" style={{ width: "100%" }}>
                            <Card.Content>
                                <div className='cardTitle'>
                                    <Header as='h3' className='pt-1 mb-1 mb-md-3'>Equipamento</Header>
                                    <div style={{display:'flex'}} className='mb-3 mb-md-0'>
                                        {!profile.requesting && 
                                            <Form.Field 
                                                control='select'
                                                className='mt-1 mt-md-0 mr-2'
                                                onChange={(e) => getSetupProducts(e.target.options[e.target.selectedIndex].value)}
                                            >
                                                <option value='all'>
                                                    Setup completo
                                                </option>
                                                {profile.gearSetups[0].id && profile.gearSetups.map((setup, key) =>
                                                    <option key={key} value={setup.id}>
                                                        {setup.name}
                                                    </option>
                                                )}
                                            </Form.Field>
                                        }
                                        <Form.Field 
                                            // label='Exibir '
                                            control='select'
                                            onChange={(e) => setGearCategorySelected(e.target.options[e.target.selectedIndex].value)}
                                            className='mt-1 mt-md-0'
                                        >
                                            <option value=''>
                                                {'Tudo ('+gear.length+')'}
                                            </option>
                                            {profile.gearCategories.map((gearCategory, key) =>
                                                <option key={key} value={gearCategory.category}>
                                                    {gearCategory.category + '(' + gearCategory.total + ')'}
                                                </option>
                                            )}
                                        </Form.Field>
                                    </div>
                                </div>
                                { profile.requesting ? (
                                    <Icon loading name='spinner' size='large' />
                                ) : ( 
                                    profile.gear[0].brandId ? (
                                        <>
                                        <div className='gearGallery'>
                                            {gear.map((product, key) =>
                                                <div>
                                                    <Image src={product.picture} wrapped ui={false} />
                                                    <div>
                                                        <Header>{product.productName}</Header>
                                                        <div>
                                                            <span className='date'>{product.brandName}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <Flickity
                                            className={'carousel'}
                                            elementType={'div'}
                                            options={sliderOptions}
                                            disableImagesLoaded={false}
                                            reloadOnUpdate
                                        >
                                            {gear.map((product, key) =>
                                                <div className='carousel-cell' key={key}>
                                                    {product.picture ? (
                                                        product.featured ? (
                                                            <Image 
                                                                src={product.picture} 
                                                                rounded 
                                                                // label={{ as: 'div', corner: 'left', icon: 'heart', size: 'mini' }} 
                                                                onClick={() => history.push('/gear/product/'+product.   productId)}
                                                                className='cpointer' 
                                                            />
                                                        ) : (
                                                            <Image src={product.picture} rounded as='a' href={'/gear/product/'+product.productId} />
                                                        )
                                                    ) : (
                                                        <Image 
                                                            as='a' 
                                                            src={cdnBaseURL+'/misc/tr:h-200,w-200,c-maintain_ratio/no-picture_pKZ8CRarWks.jpg'} 
                                                            height='85' width='85' 
                                                            rounded 
                                                            label={{ as: 'a', corner: 'left', icon: 'heart' }} 
                                                            onClick={() => history.push('/gear/product/'+product.   productId)}
                                                        />
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
                                        </>
                                    ) : (
                                        <Card.Description className="mt-3" style={{ fontSize: "13px" }}>
                                            Nenhum equipamento cadastrado
                                        </Card.Description>
                                    )
                                )}
                            </Card.Content>
                        </Card>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
            }
            </>
        )}
        <Modal
            basic
            onClose={() => setModalPictureOpen(false)}
            open={modalPictureOpen}
            size='large'
        >
            <Modal.Content>
                { profile.picture ? (
                    <Image src={profile.pictureLarge} size="large" circular centered />
                ) : (
                    <Image src={cdnBaseURL+'/sample-folder/tr:h-580,w-580,c-maintain_ratio/avatar-undefined_Kblh5CBKPp.jpg'} size="large" circular centered />
                )}
            </Modal.Content>
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
                            <Image avatar src={follower.picture ? follower.picture : cdnBaseURL+'/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'} onClick={() => goToProfile(follower.username)} style={{cursor:'pointer'}} />
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
                            <Image avatar src={following.picture ? following.picture : cdnBaseURL+'/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'} onClick={() => goToProfile(following.username)} style={{cursor:'pointer'}} />
                            <List.Content onClick={() => goToProfile(following.username)}>
                                <List.Header style={{cursor:'pointer'}}>{following.name}<br/><span style={{fontWeight:'400'}}>{'@'+following.username}</span></List.Header>
                            </List.Content>
                        </List.Item>
                    </List>
                )}
            </Modal.Content>
        </Modal>
        { (!profile.requesting && profile.requested && !profile.success && !profile.id) && 
            <main className='_404'>
            <div className="ui container" style={{ height: '100%' }}>
                <Grid centered columns={1} verticalAlign='middle'>
                    <Grid.Column mobile={16} computer={10} className="pb-0">
                        <Segment basic textAlign='center'>
                            <Image as='a' href='/' centered src={cdnBaseURL+'/logos/mublin-logo-text-black_xyGjcfis_.png'} className='mb-1' /> Erro 404
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