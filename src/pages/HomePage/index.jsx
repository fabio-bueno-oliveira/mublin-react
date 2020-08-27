import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import { projectInfos } from '../../store/actions/project';
import { projectsInfos } from '../../store/actions/projects';
import { userInfos } from '../../store/actions/user';
import { eventsInfos } from '../../store/actions/events';
import { notesInfos } from '../../store/actions/notes';
import { Loader, Header, Modal, Tab, Card, Grid, List, Image, Icon, Menu, Button, Label, Popup, Form, Checkbox, Radio, Dropdown, Segment } from 'semantic-ui-react';
import Flickity from 'react-flickity-component'
import moment from 'moment';
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

    const mainProjects2 = userProjects.filter((project) => { return project.portfolio !== 0 })
    // console.log(35, mainProjects2)

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
    const allEvents = events.events
    const publicEvents = allEvents.filter((evento) => { return evento.id_event_type_fk === 2 || evento.id_event_type_fk === 5 || evento.id_event_type_fk === 5 ||  evento.id_event_type_fk === 6 })
    const groupMeetings = allEvents.filter((evento) => { return evento.id_event_type_fk === 1 || evento.id_event_type_fk === 3 || evento.id_event_type_fk === 4 })

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
    const [modalNewNoteOpen, setModalNewNoteOpen] = useState(false)
    const [newNoteTitle, setNewNoteTitle] = useState('')
    const [newNoteDone, setNewNoteDone] = useState('0')
    const [newNoteTargetDate, setNewNoteTargetDate] = useState('')
    const [newNoteProjectAssociated, setNewNoteProjectAssociated] = useState('')
    const handleChangeProjectAssociated = (value) => {
        setNewNoteProjectAssociated(value)
        dispatch(projectInfos.getProjectMembersByProjectId(value));
    }
    // const toggleNewNoteDone = () => setNewNoteDone(value => !value)
    const toggleNewNoteDone = () => {
        if (newNoteDone === '1') {
            setNewNoteDone('0')
        } else if (newNoteDone === '0') {
            setNewNoteDone('1')
        }
    }
    const projectsList = userProjects.filter((project) => { return project.confirmed === 1 }).map(project => ({ 
        text: project.name,
        value: project.projectid,
        key: project.projectid,
        image: { avatar: true, src: 'https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max/projects/'+project.projectid+'/'+project.picture+'' }
    }));
    const members = useSelector(state => state.project.members);
    const projectMembersList = members.filter((member) => { return member.id !== user.id }).map(member => ({ 
        text: member.name+' '+member.lastname,
        value: member.id,
        key: member.id,
        image: { avatar: true, src: 'https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max/users/avatars/'+member.id+'/'+member.picture+'' }
    }));
    //// END NOTES SECTION ////

    return (
        <>
        <HeaderDesktop />
        <main className="home mt-5 pt-5">
            <section id="carousels" className="ui container px-3">
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
                                        <a href="/project/new/" className="circular ui icon massive button">
                                            <i className="fas fa-plus fa-fw"></i>
                                        </a>
                                        <a href="/project/new/">
                                            <h5 className="ui header mt-2 mb-1">
                                                Novo
                                            </h5>
                                            <h6 className="mt-0" style={{fontWeight: '400',fontSize: '11px', color: 'black', opacity: '0.8'}}>Criar projeto do zero</h6>
                                        </a>
                                    </div>
                                    <div className="carousel-cell pt-2" style={{textAlign: 'center'}}>
                                        <a href="/project/new/?type=idea" className="circular ui icon massive button">
                                            <i className="far fa-lightbulb fa-fw"></i>
                                        </a>
                                        <a href="/project/new/?type=idea">
                                            <h5 className="ui header mt-2 mb-1">
                                                Ideia
                                            </h5>
                                            <h6 className="mt-0" style={{fontWeight: '400',fontSize: '11px', color: 'black', opacity: '0.8'}}>Criar uma proposta para atrair outros músicos</h6>
                                        </a>
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

            <Grid id="events" stackable columns={3} className='ui container mt-1 mt-md-2 mb-5 mb-md-0 pb-5 pb-md-0'>
                <Grid.Column>
                    <Card style={{width: '100%'}}>
                        <Card.Content>
                            <Image src='https://ik.imagekit.io/mublin/tr:r-8,w-300,h-80,c-maintain_ratio/misc/music/public-speaking-3926344_640_trR-oN-Fap.jpg' fluid className="mb-3" />
                            <Card.Header className="ui mt-0 mb-1">Apresentações e Eventos</Card.Header>
                            <Card.Meta className="mb-3">
                                <span className='date'>{publicEvents.length} agendados</span>
                            </Card.Meta>
                            <Card.Description>
                                {events.requesting ? (
                                    <Header textAlign='center'>
                                        <Icon loading name='spinner' size='large' />
                                    </Header>
                                ) : (
                                    <>
                                    { !!publicEvents.length &&
                                        <>
                                        <h4 className='ui sub header mt-1 mb-3'>Próximos:</h4>
                                        <List relaxed>
                                        {publicEvents.map((evento, key) =>
                                            <List.Item key={key}>
                                                <Label as="span" size="mini" ribbon className="mb-1">
                                                    Criado por {evento.uname}
                                                </Label>
                                                <div className={'item mb-1 '+evento.eid}>
                                                    <div className="content py-1">
                                                        <a href={'/events/?id='+evento.eid}>
                                                            <Image className="left floated mr-2" src={'https://mublin.com/img/projects/'+evento.pid+'/'+evento.picture} width='35' height='35' rounded  />
                                                            <Header as='h6'>{evento.title_ptbr} com {evento.pname}</Header>
                                                            <div className="meta mb-2 pt-1 pt-md-0" style={{fontSize: '0.875rem', color: 'grey'}}>
                                                                <span className='mr-2'>{moment(evento.date_opening, 'YYYY-MM-DD').format('DD/MM/YYYY')} às {moment(evento.hour_opening, 'HH:mm:ss').format('HH:mm')}</span> 
                                                                {evento.method === 1 ? (
                                                                    <><Icon name='street view' className='mr-0 ml-2' /> <span>Presencial</span></>
                                                                ) : (
                                                                    <><Icon name='computer' /> <span>Online</span></>
                                                                )}
                                                            </div>
                                                            <Popup inverted content={evento.description} trigger={<h5 className="header pt-1">{evento.title}</h5>} />
                                                        </a>
                                                        <div className="description mb-2 mt-1 mt-md-0" style={{fontSize: 'smaller'}}>
                                                            Será em {evento.city} {evento.plname && '('+evento.plname+')'}
                                                        </div>
                                                        {{  
                                                            2:
                                                                <Button.Group size='mini'>
                                                                    <Button positive>Confirmar</Button>
                                                                    <Button.Or text='ou' />
                                                                    <Button negative>Não poderei participar</Button>
                                                                </Button.Group>,
                                                            1:
                                                            <><Label basic color='green' size='tiny'>
                                                                Você confirmou participação
                                                            </Label> <Icon name='history' color='grey' title='desfazer' link /></>,
                                                            0:
                                                                <><Label as='a' basic color='red' size='tiny'>
                                                                    Você informou que não poderá participar
                                                                </Label> <Button basic size='tiny' color='blue' content='Desfazer' /></>
                                                        }[evento.presence_confirmed]}
                                                    </div>
                                                </div>
                                            </List.Item>
                                        )}
                                        </List>
                                    </>
                                    }
                                    </>
                                )}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra style={{fontSize: 'small'}}>
                            { publicEvents.length > 6 &&
                                <Link to={{ pathname: '/tbd' }} className='mr-3'>
                                    <Icon name='bars' /> Ver todos
                                </Link>
                            }
                            <Link to={{ pathname: '/tbd' }}>
                                <Icon name='plus' /> Novo evento
                            </Link>
                        </Card.Content>
                    </Card>
                </Grid.Column>
                <Grid.Column>
                    <Card style={{width: '100%'}}>
                        <Card.Content>
                            <Image src='https://ik.imagekit.io/mublin/tr:r-8,w-300,h-80,c-maintain_ratio/misc/music/microphone-1003559_640_o0CDJQ05zi.jpg' fluid className="mb-3" />
                            <Card.Header className="ui mt-0 mb-1">Ensaios, Reuniões e Gravações</Card.Header>
                            <Card.Meta className="mb-3">
                                <span className='date'>{groupMeetings.length} agendados</span>
                            </Card.Meta>
                            <Card.Description>
                                {events.requesting ? (
                                    <Header textAlign='center'>
                                        <Icon loading name='spinner' size='large' />
                                    </Header>
                                ) : (
                                    <>
                                    { !!groupMeetings.length &&
                                        <>
                                        <h4 className="ui sub header mt-1 mb-3">Próximos:</h4>
                                        <List relaxed>
                                        {groupMeetings.map((evento, key) =>
                                            <List.Item key={key}>
                                                <Label as='span' size='mini' ribbon className="mb-1">
                                                    Criado por {evento.uname}
                                                </Label>
                                                <div className={'item mb-1 '+evento.eid}>
                                                    <div className="content py-1">
                                                        <a href={'/events/?id='+evento.eid}>
                                                            <Image className="left floated mr-2" src={'https://mublin.com/img/projects/'+evento.pid+'/'+evento.picture} width='35' height='35' rounded  />
                                                            <Header as='h6'>{evento.title_ptbr} com {evento.pname}</Header>
                                                            <div className="meta mb-2 pt-1 pt-md-0" style={{fontSize: '0.875rem', color: 'grey'}}>
                                                                <span className='mr-2'>{moment(evento.date_opening, 'YYYY-MM-DD').format('DD/MM/YYYY')} às {moment(evento.hour_opening, 'HH:mm:ss').format('HH:mm')}</span> 
                                                                {evento.method === 1 ? (
                                                                    <><Icon name='street view' /> <span>Presencial</span></>
                                                                ) : (
                                                                    <><Icon name='computer' /> <span>Online</span></>
                                                                )}
                                                            </div>
                                                            <Popup inverted content={evento.description} trigger={<h5 className="header pt-1">{evento.title}</h5>} />
                                                        </a>
                                                        <div className="description mb-2 mt-1 mt-md-0" style={{fontSize: 'smaller'}}>
                                                            Será em {evento.city} {evento.plname && '('+evento.plname+')'}
                                                        </div>
                                                        {{  
                                                            2:
                                                                <Button.Group size='mini'>
                                                                    <Button positive>Confirmar</Button>
                                                                    <Button.Or text='ou' />
                                                                    <Button negative>Não poderei participar</Button>
                                                                </Button.Group>,
                                                            1:
                                                            <><Label as='a' basic color='green' size='tiny'>
                                                                Você confirmou participação
                                                            </Label> <span style={{fontSize: 'smaller'}}>Desfazer</span></>,
                                                            0:
                                                                <><Label as='a' basic color='red' size='tiny'>
                                                                    Você informou que não poderá participar
                                                                </Label> <span style={{fontSize: 'smaller'}}>Desfazer</span></>
                                                        }[evento.presence_confirmed]}
                                                    </div>
                                                </div>
                                            </List.Item>
                                        )}
                                        </List>
                                        </>
                                    }
                                    </>                                           
                                )}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra style={{fontSize: 'small'}}>
                            { groupMeetings.length > 6 &&
                                <Link to={{ pathname: '/tbd' }} className='mr-3'>
                                    <Icon name='bars' /> Ver todos
                                </Link>
                            }
                            <Link to={{ pathname: '/tbd' }}>
                                <Icon name='plus' /> Novo ensaio
                            </Link>
                        </Card.Content>
                    </Card>
                </Grid.Column>
                <Grid.Column>
                    <Card id="notes" style={{width: '100%'}}>
                        <Card.Content>
                            <Image src='https://ik.imagekit.io/mublin/tr:r-8,w-300,h-80,c-maintain_ratio/misc/plan_99Rjsl0kD.jpg' fluid className="mb-3" />
                            <Card.Header className="ui mt-0 mb-1">Notas</Card.Header>
                            <Card.Meta className="mb-3">
                                { notes.length ? (
                                    <span className='date'>Você tem {notes.length} notas salvas</span>
                                ) : (
                                    <span className='date'>Você não tem notas salvas</span>
                                )}
                            </Card.Meta>
                            <Card.Description>
                                {notes.requesting ? (
                                    <Header textAlign='center'>
                                        <Icon loading name='spinner' size='large' />
                                    </Header>
                                ) : (
                                    <List relaxed>
                                    {notes.map((note, key) =>
                                        <>
                                            <Segment key={key} inverted color='yellow' tertiary>
                                                { note.ownerId !== user.id ? (
                                                    <p style={{color:'#272727',fontSize:'11px'}} className="mb-0">
                                                        Criado por <Link to={{pathname: '/'+note.ownerUsername}} style={{opacity: '1'}}>{note.ownerName}</Link> em {note.noteCreated.substr(0, 10)}
                                                    </p>
                                                ) : (
                                                    <p style={{color:'#272727',fontSize:'11px'}} className="mb-0">
                                                        {'Criado por mim em '+note.noteCreated.substr(0, 10)}
                                                    </p>
                                                )}
                                                <Header as='h5' style={{color:'#272727'}} className="mt-1 mb-3">
                                                    {note.noteTitle}  <Icon name='volume up' style={{fontSize:'11px',verticalAlign:'baseline'}} />
                                                </Header>
                                                <Header as='h5' className="my-1">
                                                    <Button size='mini' primary>Arquivar</Button> <Button size='mini' primary>Excluir</Button>
                                                </Header>
                                            </Segment>
                                        </>
                                    )}
                                    </List>
                                )}
                                <Modal
                                    size='mini'
                                    open={modalNewNoteOpen}
                                    onClose={() => setModalNewNoteOpen(false)}
                                >
                                    <Modal.Header>Criar nova nota</Modal.Header>
                                    <Modal.Content>
                                        <Form>
                                            <Form.Field>
                                                <input 
                                                    placeholder='Título'
                                                    value={newNoteTitle}
                                                    onChange={e => setNewNoteTitle(e.target.value)} 
                                                />
                                            </Form.Field>
                                            <Form.TextArea placeholder='Anotação...' />
                                            {/* <Form.Field>
                                                <Checkbox label='I agree to the Terms and Conditions' />
                                            </Form.Field> */}
                                            <Header as='h4'>Informações opcionais</Header>
                                            <Dropdown
                                                placeholder='Projeto relacionado'
                                                fluid
                                                selection
                                                closeOnEscape
                                                options={projectsList}
                                                noResultsMessage='Nenhum projeto disponível'
                                                onChange={(e, { value }) => handleChangeProjectAssociated(value)}
                                                value={newNoteProjectAssociated}
                                                className="mb-3"
                                            />
                                            { members[0].id &&
                                                <Dropdown
                                                    placeholder='Associar nota a outros integrantes'
                                                    fluid
                                                    multiple
                                                    search
                                                    selection
                                                    options={projectMembersList}
                                                    className="mb-3"
                                                />
                                            }
                                            <Form.Field>
                                                <label>Data relacionada</label>
                                                <input 
                                                    type="date"
                                                    placeholder='Data relacionada'
                                                    value={newNoteTargetDate}
                                                    onChange={e => setNewNoteTargetDate(e.target.value)} 
                                                />
                                            </Form.Field>
                                            <Radio 
                                                toggle 
                                                label={newNoteDone === '0' ? 'Atividade não concluída' : 'Atividade concluída'}
                                                checked={newNoteDone === '1'}
                                                onChange={() => toggleNewNoteDone()}
                                            />
                                        </Form>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button onClick={() => setModalNewNoteOpen(false)}>
                                            Cancelar
                                        </Button>
                                        <Button positive>
                                            Salvar
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra style={{fontSize: 'small'}}>
                            <Link onClick={() => setModalNewNoteOpen(true)}>
                                <Icon name='pencil alternate' /> Nova anotação
                            </Link>
                            <Link className="ml-3" to={{ pathname: "/tbd" }}>
                                <Icon name='microphone' /> Novo áudio
                            </Link>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            </Grid>
        </main>
        </>
    );
};

export default HomePage;