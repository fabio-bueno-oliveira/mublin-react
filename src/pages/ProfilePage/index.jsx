import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HeaderDesktop from '../../components/layout/headerDesktop';
import { profileInfos } from '../../store/actions/profile';
import { followInfos } from '../../store/actions/follow';
import { Header, Tab, Card, Grid, Image, Button, Label, Dimmer, Loader, Icon, Modal, List, Confirm, Placeholder} from 'semantic-ui-react';
import './styles.scss';

function ProfilePage (props) {

    let dispatch = useDispatch();

    let history = useHistory();

    const user = JSON.parse(localStorage.getItem('user'));

    const username = props.match.params.username;

    useEffect(() => {
        dispatch(profileInfos.getProfileInfo(username));
        dispatch(profileInfos.getProfileRoles(username));
        dispatch(profileInfos.getProfileFollowers(username));
        dispatch(profileInfos.getProfileFollowing(username));
        dispatch(followInfos.checkProfileFollowing(username));
    }, [dispatch, username]);

    const profile = useSelector(state => state.profile);
    const followedByMe = useSelector(state => state.followedByMe)

    document.title = profile.name+' '+profile.lastname+' | Mublin'

    // const sliderOptions = {
    //     autoPlay: false,
    //     cellAlign: 'left',
    //     freeScroll: true,
    //     prevNextButtons: false,
    //     pageDots: false,
    //     wrapAround: false,
    //     draggable: '>1',
    //     resize: true,
    //     contain: true
    // }

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
                                        <Header size="medium" className="mb-1">{!profile.requesting && profile.name+' '+profile.lastname} <Label basic color="black" size="tiny" className="ml-1 p-1">{profile.plan === 'Pro' && profile.plan}</Label></Header>
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
                            <div className="content">
                                <div className="center aligned" style={{ fontSize: "13px" }}>
                                    <a class={'ui '+profile.availabilityColor+' empty circular mini label mr-1'} ></a> {profile.availabilityTitle}
                                </div>
                            </div>
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
                                <Header as='h2'>Projetos</Header>
                                <Tab menu={{ secondary: true }} panes={
                                    [
                                        {
                                            menuItem: 'Principais (0)',
                                            render: () => 
                                                <Tab.Pane attached={false} as="div">
                                                    
                                                </Tab.Pane>,
                                        },
                                        {
                                            menuItem: 'Portfolio (0)',
                                            render: () => 
                                                <Tab.Pane attached={false} as="div">
                                                    
                                                </Tab.Pane>,
                                        }
                                    ]
                                }
                                />
                            </Card.Content>
                        </Card>
                        <Card id="strengths" style={{ width: "100%" }}>
                            <Card.Content>
                                <Header as='h2'>Pontos Fortes</Header>
                            </Card.Content>
                        </Card>
                        <Card id="strengths" style={{ width: "100%" }}>
                            <Card.Content>
                                <Header as='h2'>Depoimentos</Header>
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
                                    <Button size='tiny'>Seguir</Button>
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
                <Modal.Actions>
                    <Button size='medium' onClick={() => setModalFollowersOpen(false)}>
                        Fechar
                    </Button>
                </Modal.Actions>
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
                                    <Button size='tiny'>Seguir</Button>
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
                <Modal.Actions>
                    <Button size='medium' onClick={() => setModalFollowingOpen(false)}>
                        Fechar
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    );
};

export default ProfilePage;