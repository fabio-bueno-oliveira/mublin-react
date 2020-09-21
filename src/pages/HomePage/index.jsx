import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import { projectsInfos } from '../../store/actions/projects';
import { userInfos } from '../../store/actions/user';
import { eventsInfos } from '../../store/actions/events';
import { notesInfos } from '../../store/actions/notes';
import { Container, Header, Tab, Grid, Image, Icon, Menu, Button } from 'semantic-ui-react';
import Notes from './notes';
import PublicEvents from './publicEvents';
import PrivateEvents from './privateEvents';
import Flickity from 'react-flickity-component';
import './styles.scss';

function HomePage () {

    document.title = 'Mublin'

    let dispatch = useDispatch();

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        dispatch(projectsInfos.getUserMainProjects(user.id));
        dispatch(projectsInfos.getUserPortfolioProjects(user.id));
        dispatch(userInfos.getUserProjects(user.id));
        dispatch(eventsInfos.getUserEvents(user.id));
        dispatch(notesInfos.getUserNotes(user.id));
    }, [user.id, dispatch]);

    const userProjects = useSelector(state => state.user.projects)

    const projects = useSelector(state => state.projects);
    const mainProjects = projects.mainProjects;
    const portfolioProjects = projects.portfolioProjects;

    // const mainProjects2 = userProjects.filter((project) => { return project.portfolio !== 0 })

    let mainProjectsTotal
    if (!mainProjects[0].id) {
        mainProjectsTotal = 0
    } else {
        mainProjectsTotal = mainProjects.length
    }

    let portfolioProjectsTotal
    if (!portfolioProjects[0].id) {
        portfolioProjectsTotal = 0
    } else {
        portfolioProjectsTotal = portfolioProjects.length
    }

    const events = useSelector(state => state.events)
    const allEvents = events.list
    const publicEvents = allEvents.filter((evento) => { return evento.eventType === 'Show' || evento.eventType === 'Entrevista' || evento.eventType === 'Workshop' })
    const privateEvents = allEvents.filter((evento) => { return evento.eventType === 'Ensaio' || evento.eventType === 'Reunião' || evento.eventType === 'Gravação' })

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
    const notes = useSelector(state => state.notes.list)
    const projectsList = userProjects.filter((project) => { return project.confirmed === 1 }).map(project => ({ 
        text: project.name,
        value: project.projectid,
        key: project.projectid,
        image: { avatar: true, src: 'https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max/projects/'+project.projectid+'/'+project.picture+'' }
    }));
    const members = useSelector(state => state.project.members);
    //// END NOTES SECTION ////

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
        <main className="home mt-5 pt-4 pt-md-5">
            <section id="carousels" className="ui container px-3 pt-3 pt-md-0">
                <Header as='h2'>Meus projetos</Header>
                <Tab menu={{ secondary: true }} panes={
                    [
                        {
                        menuItem: 'Principais ('+mainProjectsTotal+')',
                        render: () => 
                            <Tab.Pane loading={projects.requesting} attached={false} as="div">
                                <Flickity
                                    className={'carousel'} // default ''
                                    elementType={'div'} // default 'div'
                                    options={sliderOptions} // takes flickity options {}
                                    disableImagesLoaded={false} // default false
                                    reloadOnUpdate // default false
                                >
                                    { !projects.requesting ? (
                                        mainProjects[0].id ? (
                                            mainProjects.map((projeto, key) =>
                                                <div className="carousel-cell" key={projeto.id}>
                                                    <Link to={{ pathname: '/project/'+projeto.username }}>
                                                        {projeto.picture ? (
                                                            <Image src={'https://ik.imagekit.io/mublin/projects/tr:h-85,w-95,c-maintain_ratio/'+projeto.projectid+'/'+projeto.picture} rounded />
                                                        ) : (
                                                            <Image src={'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg'} height='85' width='85' rounded />
                                                        )}
                                                        <h5 className="ui header mt-2 mb-0">
                                                            {projeto.name}
                                                            <div className="sub header mt-1">{projeto.ptname}</div>
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
                        menuItem: 'Portfolio ('+portfolioProjectsTotal+')',
                        render: () => 
                            <Tab.Pane loading={projects.requesting} attached={false} as="div">
                                <Flickity
                                    className={'carousel'} // default ''
                                    elementType={'div'} // default 'div'
                                    options={sliderOptions} // takes flickity options {}
                                    disableImagesLoaded={false} // default false
                                    reloadOnUpdate // default false
                                >
                                    { mainProjects[0].id ? (
                                    portfolioProjects.map((projeto, key) =>
                                        <div className="carousel-cell" key={projeto.id}>
                                            <a href="/music/projectusername">
                                                <div className="floating ui mini black label" style={{top: '0', left: '76%'}}>{projeto.joined_in}</div>
                                                {projeto.picture ? (
                                                    <Image src={'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'+projeto.projectid+'/'+projeto.picture} height='85' width='85' rounded />
                                                ) : (
                                                    <Image src={'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg'} height='85' width='85' rounded />
                                                )}
                                                <h5 className="ui header mt-2 mb-0">
                                                    {projeto.name}
                                                    <div className="sub header mt-1">{projeto.ptname}</div>
                                                </h5>
                                                <div className="mt-2" style={{fontWeight: '400',fontSize: '11px', color: 'black', opacity: '0.8'}}>
                                                    <Icon name={projeto.workIcon} /> {projeto.workTitle}
                                                </div>
                                            </a>
                                        </div>
                                    )
                                    ) : (
                                        <div className="carousel-cell">
                                            <Image src={'https://ik.imagekit.io/mublin/misc/square-sad-music_SeGz8vs_2A.jpg'} height='85' width='85' rounded />
                                            <h5 className="ui header mt-2 mb-0">
                                                <div className="sub header mt-1">Sem portfolio</div>
                                            </h5>
                                        </div>
                                    )}
                                </Flickity>
                            </Tab.Pane>,
                        },
                        {
                        menuItem: (
                            <Menu.Item key='new'>
                                <Icon name='plus' className="mr-2" /> Novo
                            </Menu.Item>
                            ),
                        render: () => 
                            <Tab.Pane attached={false} as="div">
                                <Flickity
                                    className={'carousel'} // default ''
                                    elementType={'div'} // default 'div'
                                    options={sliderOptions} // takes flickity options {}
                                    disableImagesLoaded={false} // default false
                                    reloadOnUpdate // default false
                                >
                                    <div className="carousel-cell pt-2" style={{textAlign: 'center'}}>
                                        <Link to={{pathname:"/project/new/", search:"?type=new", state:{type:'new'}}} style={{color:'gray'}}>
                                            <Button circular icon='plus' size='massive' />
                                        </Link>
                                        <Link to={{pathname:"/project/new/", search:"?type=new", state:{type:'new'}}} style={{color:'gray'}}>
                                            <Header as='h5' className='mt-2 mb-1'>Novo</Header>
                                            <h6 className="mt-0" style={{fontWeight: '400',fontSize: '11px', color: 'black', opacity: '0.8'}}>
                                                Criar projeto <nobr>do zero</nobr>
                                            </h6>
                                        </Link>
                                    </div>
                                    <div className="carousel-cell pt-2" style={{textAlign: 'center'}}>
                                        <Link to={{pathname:"/project/new/", search:"?type=idea", state:{type:'idea'}}} style={{color:'gray'}}>
                                            <Button circular icon='lightbulb outline' size='massive' />
                                        </Link>
                                        <Link to={{pathname:"/project/new/", search:"?type=idea", state:{type:'idea'}}} style={{color:'gray'}}>
                                            <Header as='h5' className='mt-2 mb-1'>Ideia</Header>
                                            <h6 className="mt-0" style={{fontWeight: '400',fontSize: '11px', color: 'black', opacity: '0.8'}}>
                                                Criar uma proposta para atrair outros músicos
                                            </h6>
                                        </Link>
                                    </div>
                                    <div className="carousel-cell pt-2" style={{textAlign: 'center'}}>
                                        <a href="/project/new/?type=join" className="circular ui icon massive button">
                                            <i className="fas fa-user-plus fa-fw"></i>
                                        </a>
                                        <a href="/project/new/?type=join">
                                            <h5 className="ui header mt-2 mb-1">
                                                Ingressar
                                            </h5>
                                            <h6 className="mt-0" style={{fontWeight: '400',fontSize: '11px', color: 'black', opacity: '0.8'}}>Entrar em um projeto já cadastrado</h6>
                                        </a>
                                    </div>
                                    <div className="carousel-cell pt-2" style={{textAlign: 'center'}}>
                                        <a href="/invite" className="circular ui icon massive button">
                                            <i className="fas fa-envelope-open-text fa-fw"></i>
                                        </a>
                                        <a href="/invite">
                                            <h5 className="ui header mt-2 mb-1">
                                                Convidar
                                            </h5>
                                            <h6 className="mt-0" style={{fontWeight: '400',fontSize: '11px', color: 'black', opacity: '0.8'}}>Convidar alguém para um projeto que você faz parte</h6>
                                        </a>
                                    </div>
                                    <div className="carousel-cell pt-2" style={{textAlign: 'center'}}>
                                        <a href="/search?type=projects&status=hiring" className="circular ui icon massive button">
                                            <i className="fas fa-crosshairs fa-fw"></i>
                                        </a>
                                        <a href="/search?type=projects&status=hiring">
                                            <h5 className="ui header mt-2 mb-1">
                                                Buscar
                                            </h5>
                                            <h6 className="mt-0" style={{fontWeight: '400',fontSize: '11px', color: 'black', opacity: '0.8'}}>Encontrar projetos à procura de músicos</h6>
                                        </a>
                                    </div>
                                </Flickity>
                            </Tab.Pane>,
                        },
                    ]
                }
                />
            </section>

            <Container>
            <Grid stackable columns={3} className='mt-1 mt-md-2 mb-5 mb-md-0 pb-5 pb-md-0'>
                <Grid.Column>
                    <PublicEvents publicEvents={publicEvents} />
                </Grid.Column>
                <Grid.Column>
                    <PrivateEvents publicEvents={privateEvents} />
                </Grid.Column>
                <Grid.Column>
                    <Notes notes={notes} user={user} projectsList={projectsList} members={members} />
                </Grid.Column>
            </Grid>
            </Container>
        </main>
        <FooterMenuMobile />
        </>
    );
};

export default HomePage;