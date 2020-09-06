import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { projectInfos } from '../../store/actions/project';
import HeaderDesktop from '../../components/layout/headerDesktop';
import { Header, Placeholder, Grid, Card, Image, Icon, Button, Label } from 'semantic-ui-react';
import Flickity from 'react-flickity-component';
import './styles.scss';

function ProjectPage (props) {

    let history = useHistory();

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(projectInfos.getProjectInfo(props.match.params.username));
        dispatch(projectInfos.getProjectMembers(props.match.params.username));
        dispatch(projectInfos.getProjectOpportunities(props.match.params.username));
    }, []);

    const project = useSelector(state => state.project);
    const members = project.members;
    const opportunities = project.opportunities;

    document.title = project.name+' | Mublin'

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

    return (
        <>
        <HeaderDesktop />
            <Grid columns={2} stackable className="container mb-2 mt-4 mt-md-5 pt-5">
                <Grid.Row>
                    <Grid.Column>
                        { project.requesting ? (
                            <div className="d-flex pt-3 pt-md-0">
                                <Placeholder style={{ height: 110, width: 110 }} className="mr-3">
                                    <Placeholder.Image />
                                </Placeholder>
                                <div className="content pt-1" style={{ width: '70%' }} >
                                    <Placeholder>
                                        <Placeholder.Header>
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
                            </div>
                        ) : (
                            <section id="title">
                                <h1 className="ui large header d-flex pt-3 pt-md-0">
                                    <Image src={'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'+project.id+'/'+project.picture} className="ui rounded image" style={{ width: '110px', height: '110px' }} />
                                    <div className="content pt-1" style={{ alignItems: 'flex-start', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        {project.name}
                                        <div className="sub header mt-1" style={{ fontSize: '14px' }}><strong>{project.typeName}</strong> {project.genre1 && ' de '+project.genre1} {project.genre2 && ' · '+project.genre2} {project.genre3 && ' · '+project.genre3}</div>
                                        { project.city && 
                                            <div className="sub header mt-2" style={{ fontSize: '12px' }}>
                                                <Icon name='map marker alternate' className="mr-0" /> {project.city+', '+project.region}
                                            </div>
                                        }
                                        { project.labelShow === 1 && 
                                            <div id="featuredLabel" className="mt-1">
                                                <Label color="blue" size="mini" className="ml-0" style={{ fontWeight: 'normal' }}>{project.labelText}</Label>
                                            </div>
                                        }
                                    </div>
                                </h1>
                            </section>
                        )}
                    </Grid.Column>
                    <Grid.Column>
                        <section id="options" style={{ textAlign: 'right' }}>
                            <Button primary onClick={() => history.push(props.match.params.username+'/admin/')}><Icon name='cog' /> Gerenciar</Button>
                        </section>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <Grid id="events" className="container mt-0">
                <Grid.Column width={16}>
                    <Header as='h3'>Sobre</Header>
                    { project.requesting ? (
                        <Placeholder>
                            <Placeholder.Line />
                        </Placeholder>
                    ) : (
                        <p>{project.bio}</p>
                    )}
                </Grid.Column>
            </Grid>

            <Grid id="members" className="container mt-3">
                <Grid.Column width={16}>
                    <Header as="h3" className="mb-2">Integrantes</Header>
                    <Flickity
                        className={'carousel px-1 py-3'} // default ''
                        elementType={'div'} // default 'div'
                        options={sliderOptions} // takes flickity options {}
                        disableImagesLoaded={false} // default false
                        reloadOnUpdate // default false
                    >
                        {(opportunities[0].rolename && !project.requesting) && 
                            <Card className="my-0 ml-1 mr-3 member-card candidate" href='/' style={{ justifyContent: 'center' }}>
                                <Card.Content extra className="center aligned" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div class="center aligned ui small header mb-1">
                                        Temos vagas :D
                                    </div>
                                    <div class="center aligned description mt-2 mb-2" style={{ fontSize: '12px' }}>
                                        {project.name} está buscando {opportunities.map((job, key) => <><span>{job.rolename}</span>{key < (opportunities.length - 1) ? ', ' : null}</> )}
                                    </div>
                                    <div class="center aligned description mt-1" style={{ fontSize: '11px' }}>
                                        <Button color='green' size='tiny' content='Quero me candidatar' />
                                    </div>
                                </Card.Content>
                            </Card>
                        }
                        { !project.requesting ? (
                            members.map((member, key) =>
                            <Card className="my-0 ml-1 mr-3 member-card" href={'/'+member.username}>
                                <Card.Content extra className="center aligned">
                                    { member.picture ? (
                                        <>
                                        <Image src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-200,w-200,c-maintain_ratio/'+member.id+'/'+member.picture} width="25" height="25" circular alt={'Foto de '+member.name} /> <span>@ {member.username}</span>
                                        </>
                                    ) : (
                                        <>
                                        <Image src='https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' width="25" height="25" circular alt={'Foto de '+member.name} /> <span>@ {member.username}</span>
                                        </>
                                    )}
                                </Card.Content>
                                <Card.Content>
                                    <div class="center aligned ui small header mb-1">
                                        {member.name+' '+member.lastname}
                                    </div>
                                    <div class="center aligned mt-0 mb-2" style={{ fontSize: '12px' }}>
                                        {member.role1}{member.role2 && ', '+member.role2}{member.role3 && ', '+member.role3}
                                    </div>
                                    <div class="center aligned description mt-1" style={{ fontSize: '11px' }}>
                                        <Icon name={member.statusIcon} />{member.statusName}
                                    </div>
                                    <div class="center aligned description" style={{ fontSize: '11px' }}>
                                        {member.joinedIn} {member.leftIn ? 'a '+member.leftIn : '- presente'}
                                    </div>
                                </Card.Content>
                            </Card>
                            )
                        ) : (
                            <div style={{textAlign: 'center', width: '100%'}}>
                                <Icon loading name='spinner' size='big' />
                            </div>
                        )}
                    </Flickity>
                </Grid.Column>
            </Grid>

        </>
    );
};

export default ProjectPage;