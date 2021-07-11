import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import { userInfos } from '../../store/actions/user';
import { searchInfos } from '../../store/actions/search';
import { Container, Header, Grid, Card, Image, Icon, Label, List, Table, Loader, Placeholder, Menu, Segment, Checkbox } from 'semantic-ui-react';
import Flickity from 'react-flickity-component';
import './styles.scss';

function HomePage () {

    document.title = 'Mublin';

    let dispatch = useDispatch();

    let history = useHistory();

    const user = JSON.parse(localStorage.getItem('user'));

    // const currentYear = new Date().getFullYear()

    useEffect(() => {
        dispatch(userInfos.getUserProjects(user.id));
        dispatch(userInfos.getUserRolesInfoById(user.id));
        dispatch(userInfos.getUserLastConnectedFriends());
        dispatch(searchInfos.getSuggestedUsersResults());
    }, [user.id, dispatch]);

    const userInfo = useSelector(state => state.user)
    const suggestedUsers = useSelector(state => state.search.suggestedUsers)

    const [showMain, setShowMain] = useState(true)
    const toggleMain = () => setShowMain(value => !value)

    const [showPortfolio, setShowPortfolio] = useState(true)
    const togglePortfolio = () => setShowPortfolio(value => !value)

    // const projects = useSelector(state => state.user.projects)

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

    const undefinedAvatar = 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg';

    const cdnBaseURL = 'https://ik.imagekit.io/mublin';

    var today = new Date();

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
        <Spacer />
        <Container className='px-3 homepage'>
            <Grid centered>
                <Grid.Row columns={2}>
                    <Grid.Column mobile={16} tablet={16} computer={4} className="only-computer" >
                        <div style={{position:"-webkit-sticky",position:"sticky",top:"90px",display:"inline-table",width: '100%'}}>
                            { !userInfo.requesting ? ( 
                                <div className="feed-item-wrapper pb-3">
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
                                    <div className='mt-3 mb-2' style={{fontSize:'12px'}}>
                                        {userInfo.bio}
                                    </div>
                                    <Table compact size='small' basic='very' className='mt-0' style={{fontSize:'11.5px'}}>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell>Principais atividades:</Table.Cell>
                                                <Table.Cell textAlign='right' className='pr-2' style={{display:'grid'}}>
                                                    {userInfo.roles.map((role, key) =>
                                                        <span key={key}><nobr>{role.icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+role.icon} width='13' height='13' style={{verticalAlign:'sub'}} />}{role.name}{key < (userInfo.roles.length-1) && ', '}</nobr></span>
                                                    )}
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>Plano:</Table.Cell>
                                                <Table.Cell textAlign='right' className='pr-2'>{userInfo.plan ? userInfo.plan.toUpperCase() : null} {userInfo.plan !== 'Pro' && <a href='/upgrade'>Me tornar PRO</a>}</Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>Projetos:</Table.Cell>
                                                <Table.Cell textAlign='right' className='pr-2'>{userInfo.projects ? userInfo.projects.length : null}</Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table>
                                </div>
                            ) : (
                                <div className="feed-item-wrapper pb-3">
                                    <Placeholder>
                                        <Placeholder.Header image>
                                            <Placeholder.Line />
                                            <Placeholder.Line />
                                        </Placeholder.Header>
                                        <Placeholder.Paragraph>
                                            <Placeholder.Line />
                                            <Placeholder.Line />
                                            <Placeholder.Line />
                                            <Placeholder.Line />
                                        </Placeholder.Paragraph>
                                    </Placeholder>
                                </div>
                            )}
                            <Header disabled className='logoFont textCenter mt-3' style={{fontSize:'12px'}} as='h5'>
                                mublin ©2021
                            </Header>
                        </div>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={16} computer={12}>
                        <div className='mt-0 mt-md-2'>
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
                                                            <Image src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max,c-maintain_ratio/users/avatars/'+friend.id+'/'+friend.picture} rounded width='50' height='auto' title={friend.username} />
                                                        ) : (
                                                            <Image src={undefinedAvatar} rounded size='tiny' title={friend.username} />
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
                                                        style={{position:'absolute',top:'48%',right:'23%'}} 
                                                    />
                                                </div>
                                            )}
                                        </Flickity>
                                    </>
                                }
                                </>
                            )}    
                        </div>
                        <Header 
                            as='h2' 
                            className='mt-3 mb-2'
                        >
                            Meus Projetos
                        </Header>
                        <div className='pb-2'>
                            <Checkbox 
                                label={'Principais ('+projectsMain.length+')'}
                                checked={showMain}
                                onClick={toggleMain}
                                style={{fontSize:'12px'}}
                            />
                            <Checkbox 
                                // label={['Portfolio ' , '('+projectsPortfolio.length+') ' , <Icon name='tag' style={{fontSize:'10px'}} />]}
                                label={['Portfolio ' , '('+projectsPortfolio.length+')']}
                                checked={showPortfolio}
                                onClick={togglePortfolio}
                                style={{fontSize:'12px',marginLeft:'10px'}}
                            />
                        </div>
                        { !userInfo.requesting ? (
                            projectsToShow.length ? (
                                projectsToShow.map((project, key) =>
                                <Card 
                                    key={key} 
                                    fluid 
                                    className='mb-4'
                                    // color={(!project.yearEnd && project.ptid !== 7) ? 'green' : 'grey'} 
                                >
                                    <Label basic attached='top' style={{fontWeight:'400',display:'flex',justifyContent:'space-between',border:'none',paddingBottom:'0',    backgroundColor:'transparent'}}>
                                        <div>
                                            {project.ptname}
                                        </div>
                                        {/* <div className='ml-2'>
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
                                        </div> */}
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
                                            className='cpointer pb-1'
                                            onClick={() => history.push('/project/'+project.username)}
                                            style={{fontSize:'17.2px',display:'table-cell'}}
                                        >
                                            {project.name} {project.portfolio === 1 && <Icon name='tag' color='black' style={{fontSize:'11px',verticalAlign: 'text-top'}} title='Portfolio' />}
                                        </Card.Header>
                                        <Card.Description style={{fontSize:'11.5px',display:'inline',verticalAlign:'middle'}}>
                                            { project.confirmed === 1 ? ( <>{project.workTitle}</> ) : ( <><Icon className='mr-0' name='clock outline' />Pendente</> )}
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
                                        <Card.Meta className='projectRoles mt-1 pb-1' style={{fontSize:'11.4px',color:'rgba(0,0,0,.68)',overflowX:'auto'}}>
                                            {project.role1icon && <span style={{whiteSpace:'nowrap'}}><img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+project.role1icon} />{project.role1}</span>}{project.role2 && <span style={{whiteSpace:'nowrap'}}>, {project.role2icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+project.role2icon} />}{project.role2}</span>}{project.role3 && <span style={{whiteSpace:'nowrap'}}>, {project.role3icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+project.role3icon} />}{project.role3}</span>}
                                            {/* {project.role1 && <Label size='mini' style={{fontWeight:'500'}}>{project.role1icon && <img src={cdnBaseURL+'/icons/music/tr:h-26,w-26,c-maintain_ratio/'+project.role1icon} />} {project.role1.length > 11 ? `${project.role1.substring(0, 11)}...` : project.role1}</Label>} {project.role2 && <Label size='mini' style={{fontWeight:'500'}}>{project.role2.length > 11 ? `${project.role2.substring(0, 11)}...` : project.role2}</Label>} {project.role3 && <Label size='mini' style={{fontWeight:'500'}}>{project.role3.length > 11 ? `${project.role3.substring(0, 11)}...` : project.role3}</Label>} */}
                                        </Card.Meta>
                                    </Card.Content>
                                    <Menu fluid widths={1} attached='bottom' borderless style={{border:'none'}} size='small'>
                                        <Menu.Item
                                            name='Acessar Projeto'
                                            icon='arrow right'
                                            onClick={() => history.push('/project/'+project.username)}
                                        />
                                    </Menu>
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