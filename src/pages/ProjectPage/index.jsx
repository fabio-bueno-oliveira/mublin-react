import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { projectInfos } from '../../store/actions/project';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import { Header, Popup, Segment, Grid, Card, Image, Icon, Button, Label } from 'semantic-ui-react';
import Flickity from 'react-flickity-component';
import Loader from 'react-loader-spinner';
import Spacer from '../../components/layout/Spacer'
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
    const members = project.members.filter((member) => { return member.confirmed === 1 });
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

    const artistHeroImage = 'https://ik.imagekit.io/mublin/projects/tr:h-300,w-1000,bl-12/'+project.picture

    const defaultHeroImage = 'https://ik.imagekit.io/mublin/sample-folder/tr:h-300,w-1000,bl-12/avatar-undefined_-dv9U6dcv3.jpg'

    const artistHeroStyles = {
        backgroundImage: `url(${project.picture ? artistHeroImage : defaultHeroImage})`, 
        backgroundRepeat:'no-repeat', 
        backgroundSize:'cover', 
        backgroundPosition:'center', 
        backgroundBlendMode:'soft-light',
        position: 'relative',
        marginBottom: '12px'
    }

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
        { project.requesting ? (
            <Loader
                className="appLoadingIcon"
                type="Audio"
                color="#ffffff"
                height={100}
                width={100}
                timeout={30000} //30 secs
            />
        ) : (
            <>
            <Spacer compact />
            <Grid columns={2} stackable className="container">
                <Grid.Row>
                    <Grid.Column width={16} style={{paddingLeft:'0px!important'}} id='artistHero'>
                        <Segment 
                            inverted
                            style={artistHeroStyles}
                        >
                            {project.picture ? (
                                <Image src={'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'+project.picture} circular centered size='tiny' />
                            ) : (
                                <Image src='https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_-dv9U6dcv3.jpg' circular centered size='tiny' />
                            )}
                            <Header as='h2' textAlign='center' inverted className='mt-2 mb-2'>
                                <Header.Content>
                                    {project.name}
                                    <Header.Subheader className="mt-2">
                                        {project.typeName} {project.genre1 && ' · '+project.genre1} {project.genre2 && ' · '+project.genre2} {project.genre3 && ' · '+project.genre3}
                                    </Header.Subheader>
                                    { project.city && 
                                        <Header.Subheader className="mt-2">
                                            <Icon name='map marker alternate' className="mr-0" /> {project.city+', '+project.region}
                                        </Header.Subheader>
                                    }
                                </Header.Content>
                            </Header>
                            { project.labelShow === 1 && 
                                <div id="featuredTag" className="pl-1 textCenter">
                                    <Label tag color={project.labelColor} size="tiny" className="ml-0" style={{ fontWeight: 'normal' }}>{project.labelText}</Label>
                                </div>
                            }
                        </Segment>
                        <section className="desktopAction d-none d-lg-block">
                            <Button size='tiny' onClick={() => history.push('/backstage/'+props.match.params.username)}><Icon name='warehouse' /> Ir para o Backstage deste projeto</Button>
                        </section>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <div className='container'>
                <Button fluid className='mb-3 d-block d-sm-none' size='mini' onClick={() => history.push('/backstage/'+props.match.params.username)}>
                    <Icon name='warehouse' /> Ir para o Backstage deste projeto
                </Button>
            </div>
            {project.bio && 
                <>
                    <Grid stackable columns={2} className="container mt-0">
                        <Grid.Column computer={8} mobile={16}>
                            <p>{project.bio}</p>
                        </Grid.Column>
                        <Grid.Column width={8} only='computer' textAlign='right'>
                            <p className='mb-2'>Projetos relacionados:</p>
                            <Image.Group size='tiny'>
                                <Popup
                                    content='Nome do Projeto'
                                    position='bottom center'
                                    size='tiny'
                                    trigger={<Image src='https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/giancarllo_4eNxddfnH.png' circular size='tiny' />}
                                />
                                <Popup
                                    content='Nome do Projeto'
                                    position='bottom center'
                                    size='tiny'
                                    trigger={<Image src='https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/fabio-bueno_Cyjy882zm.jpg' circular size='tiny' />}
                                />
                                <Popup
                                    content='Nome do Projeto'
                                    position='bottom center'
                                    size='tiny'
                                    trigger={<Image src='https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/oeste-suez_uxpc9DEAu.jpg' circular size='tiny' />}
                                />
                            </Image.Group>
                        </Grid.Column>
                    </Grid>
                </>
            }
            <Grid className="container mt-0 mb-5">
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
            )}
        <FooterMenuMobile />
        </>
    );
};

export default ProjectPage;