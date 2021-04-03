import React, { useEffect, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Header, Image, Segment, Button, Icon, Label, Placeholder, Dimmer } from 'semantic-ui-react';
import { profileInfos } from '../../store/actions/profile';
import './styles.scss'

function PublicProfilePage (props) {

    const username = props.match.params.username;

    const loggedIn = useSelector(state => state.authentication.loggedIn);

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(profileInfos.getProfileInfo(username));
        dispatch(profileInfos.getProfileProjects(username));
        dispatch(profileInfos.getProfileRoles(username));
        dispatch(profileInfos.getProfileFollowers(username));
        dispatch(profileInfos.getProfileFollowing(username));
    }, [dispatch, username]);

    const profile = useSelector(state => state.profile);

    document.title = profile.id ? profile.name+' '+profile.lastname+' | Mublin' : 'Mublin';

    let history = useHistory();

    const [copiedToBlipboard, setCopiedToClipboard] = useState(false)

    return (
        <>
            { (loggedIn && profile.id) &&
                <Redirect to={{ pathname: '/'+username }} />
            }
            {(!profile.requesting && profile.id) ? ( 
                <Grid as='main' textAlign='center' columns={1} className="container mb-2 px-1 px-md-3">
                    <Grid.Row>
                        <Grid.Column mobile={16} tabled={16} computer={8}>
                            <Segment className='mt-4 mb-2'>
                                <Header as='h4'>{profile.name+' está no Mublin!'}</Header>
                                <p>
                                    <Button 
                                        color='black' 
                                        size='small' 
                                        onClick={() => history.push("/login")}
                                        className='mr-2'
                                    >
                                        Entre
                                    </Button>
                                    ou
                                    <Button 
                                        primary 
                                        size='small'
                                        onClick={() => history.push("/signup")}
                                        className='ml-2'
                                    >
                                        Cadastre-se!
                                    </Button>
                                </p>
                            </Segment>
                            <Image as='a' href='/' centered src='https://ik.imagekit.io/mublin/logos/mublin-logo-text-black_xyGjcfis_.png' className='mt-2 mb-2' />
                            <div>
                                { profile.picture ? (
                                    <Image centered src={profile.picture} size="tiny" circular />
                                ) : (
                                    <Image centered src='https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_Kblh5CBKPp.jpg' size="tiny" circular />
                                )}
                            </div>
                            <Header as='h1' className='mb-0 mt-2'>
                                <Header.Content>
                                    <Header.Subheader>
                                        {!profile.requesting && 'mublin.com/'+username}
                                        <CopyToClipboard text={'https://mublin.com/'+username}
                                            onCopy={() => setCopiedToClipboard(true)}>
                                            <Icon link name='copy outline' className='ml-1' color={copiedToBlipboard ? 'black' : 'grey'} />
                                        </CopyToClipboard>
                                    </Header.Subheader>
                                    {profile.name} <nobr>{profile.lastname} {!!profile.verified && <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' />}</nobr>
                                </Header.Content>
                            </Header>
                            <Header as='h5' className="mt-2 mb-3">
                                {profile.roles.map((role, key) =>
                                    <nobr key={key}>{role.name}{key < (profile.roles.length-1) && ', '}</nobr>
                                )}
                            </Header>
                            { profile.public ? (
                                <p className='pb-3' style={{fontSize:'12px'}}>{profile.bio}</p>
                            ) : (
                                <>
                                <Segment basic>
                                    <Dimmer active inverted style={{backgroundColor:'transparent'}}>
                                        <Icon name='lock' size='large' color='black' />
                                    </Dimmer>
                                    <Placeholder fluid>
                                        <Placeholder.Line style={{backgroundColor:'#f7f7f7'}} />
                                        <Placeholder.Line style={{backgroundColor:'#f7f7f7'}} />
                                        <Placeholder.Line style={{backgroundColor:'#f7f7f7'}} />
                                        <Placeholder.Line style={{backgroundColor:'#f7f7f7'}} />
                                        <Placeholder.Line style={{backgroundColor:'#f7f7f7'}} />
                                        <Placeholder.Line style={{backgroundColor:'#f7f7f7'}} />
                                        <Placeholder.Line style={{backgroundColor:'#f7f7f7'}} />
                                        <Placeholder.Line style={{backgroundColor:'#f7f7f7'}} />
                                    </Placeholder>
                                </Segment>
                                </>
                            )}
                            { (!!profile.public && profile.availabilityId) && 
                                <>
                                    <div className='mb-3' style={{ fontSize: "13px" }}>
                                        <Label circular size='mini' color={profile.availabilityColor} empty key={profile.availabilityColor} /> {profile.availabilityTitle}
                                        { (profile.availabilityId === 1 || profile.availabilityId === 2) &&
                                        <>
                                            <p style={{ fontSize: "11px" }}>
                                                {profile.availabilityFocus === 1 || profile.availabilityFocus === 3 && <span className='ml-2 mr-2'><Icon name='checkmark' size='small' />Projetos próprios</span>} {profile.availabilityFocus === 2 || profile.availabilityFocus === 3 && <span className='mr-2'><Icon name='checkmark' size='small' />Outros projetos</span>}
                                            </p>
                                            <p className='mt-1'>
                                                { profile.availabilityItems[0].id && profile.availabilityItems.map((item, key) =>
                                                    <Label basic size='mini' className='mr-1' style={{cursor:'default',fontWeight:'500'}}>{item.itemName}</Label>
                                                )}  
                                            </p>
                                        </>
                                        }
                                    </div>
                                    <div className='horizontalImageList mt-4 mb-3'>
                                    { profile.projects.filter((project) => { return project.confirmed === 1 }).slice(0,3).map((project, key) =>
                                        <div key={key}>
                                            <Image src={project.picture} circular size='mini' />
                                            <h5>{project.name}</h5>
                                        </div>
                                    )}
                                    { profile.projects.length > 3 &&
                                        <div>
                                            <Icon circular inverted color='grey' name='plus' />
                                            <h5 className='pt-2'>e outros</h5>
                                        </div>
                                    }
                                    </div>
                                </>
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            ) : (
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
                                { loggedIn ? (
                                    <Button 
                                        color='black' 
                                        size='small' 
                                        onClick={() => history.push("/home")}
                                        className='mt-5 mr-0'
                                    >
                                        Ir para a Home
                                    </Button>
                                ) : (
                                    <p className='mt-5'>
                                        <Button 
                                            color='black' 
                                            size='small' 
                                            onClick={() => history.push("/login")}
                                            className='mr-2'
                                        >
                                            Entre
                                        </Button>
                                        ou
                                        <Button 
                                            primary 
                                            size='small'
                                            onClick={() => history.push("/signup")}
                                            className='ml-2'
                                        >
                                            Cadastre-se!
                                        </Button>
                                    </p>
                                )}
                            </Segment>
                        </Grid.Column>
                    </Grid>
                </div>
                </main>
            )}
        </>
    )
}

export default PublicProfilePage;