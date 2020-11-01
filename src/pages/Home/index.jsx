import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import { userInfos } from '../../store/actions/user';
import { eventsInfos } from '../../store/actions/events';
import { notesInfos } from '../../store/actions/notes';
import { Container, Header, Tab, Grid, Image, Icon, Label } from 'semantic-ui-react';
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
        dispatch(userInfos.getInfo());
        dispatch(userInfos.getUserProjects(user.id));
        dispatch(eventsInfos.getUserEvents(user.id));
        dispatch(notesInfos.getUserNotes(user.id));
    }, [user.id, dispatch]);

    const userInfo = useSelector(state => state.user)

    const userProjects = useSelector(state => state.user.projects)
    const projectsMain = userProjects.filter((project) => { return project.portfolio === 0 && project.confirmed !== 0 })
    const projectsPortfolio = userProjects.filter((project) => { return project.portfolio === 1 && project.confirmed !== 0 })

    const events = useSelector(state => state.events)
    const allEvents = events.list
    const publicEvents = allEvents.filter((evento) => { return evento.eventTypeId === 2 || evento.eventTypeId === 5 || evento.eventTypeId === 6 })
    const privateEvents = allEvents.filter((evento) => { return evento.eventTypeId === 1 || evento.eventTypeId === 3 || evento.eventTypeId === 4 })

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
        <main className="home mt-5 pt-4 pt-md-5">
            <section id="carousels" className="ui container px-3 pt-3 pt-md-0">
                <Header as='h2'>Meus projetos</Header>
                <Tab menu={{ secondary: true }} defaultActiveIndex={0} panes={
                    [
                        {
                        menuItem: 'Principais ('+projectsMain.length+')',
                        render: () => 
                            <Tab.Pane loading={userInfo.requesting} attached={false} as="div">
                                <Flickity
                                    className={'carousel'} // default ''
                                    elementType={'div'} // default 'div'
                                    options={sliderOptions} // takes flickity options {}
                                    disableImagesLoaded={false} // default false
                                    reloadOnUpdate // default false
                                >
                                    { !userInfo.requesting ? (
                                        projectsMain.length ? (
                                            projectsMain.map((project, key) =>
                                                <div className="carousel-cell" key={key} style={project.confirmed === 2 ? {opacity:'0.6'} : {}}>
                                                    <Link to={{ pathname: '/project/'+project.username }}>
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
                        menuItem: 'Portfolio ('+projectsPortfolio.length+')',
                        render: () => 
                            <Tab.Pane loading={userInfo.requesting} attached={false} as="div">
                                <Flickity
                                    className={'carousel'} // default ''
                                    elementType={'div'} // default 'div'
                                    options={sliderOptions} // takes flickity options {}
                                    disableImagesLoaded={false} // default false
                                    reloadOnUpdate // default false
                                >
                                    { !userInfo.requesting ? (
                                        projectsPortfolio.length ? (
                                            projectsPortfolio.map((project, key) =>
                                                <div className="carousel-cell" key={key}>
                                                    <Link to={{ pathname: '/project/'+project.username }}>
                                                        { project.yearLeftTheProject && 
                                                            <Label color='black' floating size='mini' style={{top: '0', left: '50%',width:'fit-content'}}>
                                                                {project.joined_in+'-'+project.yearLeftTheProject}
                                                            </Label>
                                                        }
                                                        {project.picture ? (
                                                            <Image src={'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'+project.picture} height='85' width='85' rounded />
                                                        ) : (
                                                            <Image src={'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg'} height='85' width='85' rounded />
                                                        )}
                                                        <h5 className="ui header mt-2 mb-0">
                                                            {project.name}
                                                            <div className="sub header mt-1">{project.ptname}</div>
                                                        </h5>
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
            </section>

            <Container>
            <Grid stackable columns={2} className='mt-1 mt-md-2 mb-5 mb-md-0 pb-5 pb-md-0'>
                <Grid.Column>
                    <PublicEvents publicEvents={publicEvents} requesting={events.requesting} />
                </Grid.Column>
                <Grid.Column>
                    <PrivateEvents privateEvents={privateEvents} requesting={events.requesting} />
                </Grid.Column>
                {/* <Grid.Column>
                    <Notes notes={notes} user={user} projectsList={projectsList} members={members} />
                </Grid.Column> */}
            </Grid>
            </Container>
        </main>
        <FooterMenuMobile />
        </>
    );
};

export default HomePage;