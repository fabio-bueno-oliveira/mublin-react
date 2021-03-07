import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import { userInfos } from '../../store/actions/user';
// import { eventsInfos } from '../../store/actions/events';
// import { notesInfos } from '../../store/actions/notes';
import { Container, Header, Tab, Grid, Image, Icon, Label, Menu } from 'semantic-ui-react';
// import Events from './events';
import Flickity from 'react-flickity-component';
import './styles.scss';

function HomePage () {

    document.title = 'Mublin'

    let dispatch = useDispatch();

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // dispatch(userInfos.getInfo());
        dispatch(userInfos.getUserProjects(user.id));
        // dispatch(eventsInfos.getUserEvents(user.id));
        // dispatch(notesInfos.getUserNotes(user.id));
        dispatch(userInfos.getUserLastConnectedFriends())
    }, [user.id, dispatch]);

    const userInfo = useSelector(state => state.user)

    const userProjects = useSelector(state => state.user.projects)
    const projectsMain = userProjects.filter((project) => { return project.portfolio === 0 && project.confirmed !== 0 }).sort((a, b) => parseFloat(b.featured) - parseFloat(a.featured))
    const projectsPortfolio = userProjects.filter((project) => { return project.portfolio === 1 && project.confirmed !== 0 }).sort((a, b) => parseFloat(b.featured) - parseFloat(a.featured))

    const events = useSelector(state => state.events)

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

    //// START NOTES SECTION ////
    const notes = useSelector(state => state.notes)
    const projectsList = userProjects.filter((project) => { return project.confirmed === 1 }).map(project => ({ 
        text: project.name,
        value: project.projectid,
        key: project.projectid,
        image: { avatar: true, src: 'https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max/projects/'+project.picture+'' }
    }));
    const members = useSelector(state => state.project.members);
    //// END NOTES SECTION ////

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
        <Spacer />
        <Container className='px-3'>
            <Grid centered>
                <Grid.Row columns={2}>
                    <Grid.Column mobile={16} tablet={16} computer={8}>
                        <Header size='medium' className='mt-1'>
                            {/* <Icon name='rocket' /> */}
                            <Header.Content className='mb-2'>
                                Meus Projetos ({userProjects.length})
                            </Header.Content>
                        </Header>
                        <Tab menu={{ secondary: true }} defaultActiveIndex={0} panes={
                            [
                                {
                                menuItem: (
                                    <Menu.Item key='main'>
                                        {/* <Icon name='bullseye' color='green' className="mr-2" /> Principais ({projectsMain.length}) */}
                                        Principais ({projectsMain.length})
                                    </Menu.Item>
                                ),
                                render: () => 
                                    <Tab.Pane loading={userInfo.requesting} attached={false} as="div" className='carousel-wrapper'>
                                        <Flickity
                                            className={'carousel'}
                                            elementType={'div'}
                                            options={sliderOptions}
                                            disableImagesLoaded={false}
                                            reloadOnUpdate
                                        >
                                            { !userInfo.requesting ? (
                                                projectsMain.length ? (
                                                    projectsMain.map((project, key) =>
                                                        <div className="carousel-cell" key={key} style={project.confirmed === 2 ? {opacity:'0.6'} : {}}>
                                                            <Link to={{ pathname: '/project/'+project.username }}>
                                                                { !!project.featured && 
                                                                    <Label color='black' floating size='mini' style={{top: '0', left: '20%',width:'fit-content'}}>
                                                                        <Icon name='star' color='yellow' className='mr-0' />
                                                                    </Label>
                                                                }
                                                                {project.picture ? (
                                                                    <Image src={'https://ik.imagekit.io/mublin/projects/tr:h-85,w-95,c-maintain_ratio/'+project.picture} rounded />
                                                                ) : (
                                                                    <Image src={'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg'} height='85' width='85' rounded />
                                                                )}
                                                                <Header as='h5' className='mt-2 mb-0'>
                                                                    <Header.Content>
                                                                        {project.name}
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
                                                    <div className="carousel-cell">
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
                                    </Tab.Pane>,
                                }, 
                                {
                                menuItem: (
                                    <Menu.Item key='portfolio'>
                                        {/* <Icon name='tags' className="mr-2" /> Portfolio ({projectsPortfolio.length}) */}
                                        Portfolio ({projectsPortfolio.length})
                                    </Menu.Item>
                                    ),
                                render: () => 
                                    <Tab.Pane loading={userInfo.requesting} attached={false} as='div' className='carousel-wrapper'>
                                        <Flickity
                                            className={'carousel'}
                                            elementType={'div'}
                                            options={sliderOptions}
                                            disableImagesLoaded={false}
                                            reloadOnUpdate
                                        >
                                            { !userInfo.requesting ? (
                                                projectsPortfolio.length ? (
                                                    projectsPortfolio.map((project, key) =>
                                                        <div className="carousel-cell" key={key}>
                                                            <Link to={{ pathname: '/project/'+project.username }}>
                                                                { project.yearLeftTheProject && 
                                                                    <Label color='black' floating size='mini' style={{top: '0', left: '20%',width:'fit-content'}}>
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
                                                                        {project.name}
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
                        <Header size='small' className="mt-3 mt-md-4 mb-4 mb-md-3">
                            <Header.Content>
                                Pessoas conectadas recentemente
                            </Header.Content>
                        </Header>
                        <div className='carousel-wrapper'>
                            <Flickity
                                className={'carousel'}
                                elementType={'div'}
                                options={sliderOptions}
                                disableImagesLoaded={false}
                                reloadOnUpdate
                            >
                                { !userInfo.requesting ? (
                                    userInfo.lastConnectedFriends.map((friend, key) =>
                                        <div className="friends-carousel-cell" key={key}>
                                            <Link to={{ pathname: '/'+friend.username }}>
                                                {friend.picture ? (
                                                    <Image src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max,c-maintain_ratio/users/avatars/'+friend.id+'/'+friend.picture} rounded size='tiny' />
                                                ) : (
                                                    <Image src={'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'} height='85' width='85' rounded />
                                                )}
                                                <Header as='h5' textAlign='center' className='mt-2 mb-0'>
                                                    <Header.Content>
                                                        {friend.username}
                                                    </Header.Content>
                                                </Header>
                                            </Link>
                                        </div>
                                    )
                                ) : (
                                    <div style={{textAlign: 'center', width: '100%'}}>
                                        <Icon loading name='spinner' size='big' />
                                    </div>
                                )}
                            </Flickity>
                        </div>
                        {/* 
                            <Header size='medium'>
                                <Header.Content>
                                    Eventos próximos
                                </Header.Content>
                            </Header>
                            <Events events={events} />
                         */}
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={16} computer={4} className="only-computer">
                        { !userInfo.requesting && 
                            <>
                                {/* <Header as='h2'>
                                    <Header.Content className='mb-2'>
                                        Bem-vindo!
                                        <Header.Subheader>O Mublin está em versão Beta e evoluindo a cada dia!</Header.Subheader>
                                    </Header.Content>
                                </Header> */}
                                <a href={"/"+userInfo.username}>
                                    <Header as='h4'>
                                        { (!userInfo.requesting && userInfo.picture) ? (
                                            <Image circular
                                                src={'https://ik.imagekit.io/mublin/users/avatars/'+userInfo.id+'/'+userInfo.picture}
                                            />
                                        ) : (
                                            <Image circular
                                                src={'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'}
                                            />
                                        )}
                                        <Header.Content>
                                            Olá, {userInfo.name}!
                                            <Header.Subheader>@{userInfo.username}</Header.Subheader>
                                        </Header.Content>
                                    </Header>
                                </a>
                                <div className='news'>
                                    <p>O Mublin está em versão Beta e evoluindo a cada dia! Confira algumas das features que estão por vir nos próximos releases:</p>
                                    <ul>
                                        <li><code>Feed de atividade de amigos</code></li>
                                        <li><code>Gerenciamento de eventos</code></li>
                                    </ul>
                                </div>
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