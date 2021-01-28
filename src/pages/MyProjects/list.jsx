import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { useHistory } from 'react-router-dom';
import { Grid, Header, Segment, Form, Divider, Table, Image, Icon, Label, Button } from 'semantic-ui-react';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import Spacer from '../../components/layout/Spacer'
import FooterMenuMobile from '../../components/layout/footerMenuMobile';

function MyProjectsListPage () {
 
    document.title = 'Meus Projetos | Mublin'
    
    const userToken = JSON.parse(localStorage.getItem('user'));

    let dispatch = useDispatch();

    let history = useHistory();

    const currentYear = new Date().getFullYear()

    useEffect(() => {
        dispatch(userInfos.getUserProjects(userToken.id));
    }, [userToken.id, dispatch]);

    const userInfo = useSelector(state => state.user)

    const userProjects = useSelector(state => state.user.projects)

    const [pesquisa, setPesquisa] = useState("")

    const handlePesquisaChange = e => {
        setPesquisa(e.target.value)
    }

    const myProjects = () => userProjects.filter((project) => { return (project.name.toLowerCase().includes(pesquisa.toLowerCase())) }).sort((a, b) => a.name.localeCompare(b.name)).map((project, key) =>
        <>
        { !userInfo.requesting &&
        <div className='mb-4'>
            <Segment.Group stacked>
            <Segment key={key} secondary={project.confirmed === 2}>
                {(!project.yearEnd && project.ptid !== 7) &&
                    <p className='mb-0' style={{fontSize:'11px'}}>
                        <Icon name='toggle on' color='green' />Projeto em atividade {project.yearFoundation && 'desde '+project.yearFoundation}
                    </p>
                }
                {(project.yearEnd && project.yearEnd <= currentYear) &&
                    <p className='mb-0' style={{fontSize:'11px'}}>
                        <Icon name='toggle off' color='grey' />Projeto encerrado em {project.yearEnd}
                    </p>
                }
                {(project.ptid === 7) &&
                    <p className='mb-0' style={{fontSize:'11px'}}>
                        <Icon name='lightbulb outline' color='blue' />Ideia em desenvolvimento
                    </p>
                }
                <Header as='h3' className='mt-2 mb-0'>
                    {project.picture ? (
                        <Image src={'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'+project.picture} rounded />
                    ) : (
                        <Image src={'https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_-dv9U6dcv3.jpg'} rounded />
                    )}
                    <Header.Content>
                        {project.name}
                        <Header.Subheader style={{fontSize:'12px',width:'240px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{project.ptname} {project.genre1 && '('+project.genre1}{project.genre2 && ', '+project.genre2}{project.genre3 && ', '+project.genre3}{project.genre1 && ')'}</Header.Subheader>
                    </Header.Content>
                </Header>
                <Table size='small' celled collapsing compact='very' basic='very'>
                    <Table.Body>
                        <Table.Row className='p-0'>
                            <Table.Cell collapsing>
                                {userInfo.picture ? (
                                    <Image src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-200,w-200,c-maintain_ratio/'+userInfo.id+'/'+userInfo.picture} avatar className='mr-1' />
                                ) : (
                                    <Image src={'https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'} avatar className='mr-1' />
                                )}
                                {
                                    {
                                        1: <><Icon name={project.workIcon} className='mr-1' />Membro oficial</>,
                                        2: <><Icon name={project.workIcon} className='mr-1' />Sideman</>,
                                        3: <><Icon name={project.workIcon} className='mr-1' />Idealizador</>,
                                        4: <><Icon name={project.workIcon} className='mr-1' />Candidato</>,
                                        5: <><Icon name={project.workIcon} className='mr-1' />Aguardando confirmação</>
                                    }[project.status]
                                }
                            </Table.Cell>
                            <Table.Cell>
                                {project.role1}{project.role2 && ', '+project.role2}{project.role3 && ', '+project.role3}
                            </Table.Cell>
                            <Table.Cell collapsing>
                                <Label circular color={(project.yearLeftTheProject || project.yearEnd) ? 'red' : 'green'} empty size='mini' className='mr-1' />
                                {(project.joined_in && (project.joined_in !== project.yearLeftTheProject)) ? ( 
                                    <>
                                        { !project.yearEnd ? ( 
                                            project.joined_in +' até '+(project.yearLeftTheProject ? project.yearLeftTheProject : 'atualmente')
                                        ) : (
                                            project.joined_in +' até '+project.yearEnd
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {project.joined_in} {project.yearEnd && ' até '+project.yearEnd}
                                    </>
                                )}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <div id='tags'>
                    {project.confirmed === 2 && <Label tag color='black' className='mr-2 mt-0' size='mini' color='grey' style={{fontWeight:'500'}}><Icon name='clock' />Aguardando aprovação</Label>}  
                    { project.admin === 1 && <Label tag color='black' className='mr-2 mt-0' size='mini' style={{fontWeight:'500'}}><Icon name='key' />Administrador</Label>}
                    {!!(project.featured && project.confirmed !== 2) && <Label tag color='black' className='mr-2 mt-0' size='mini' style={{fontWeight:'500'}}><Icon name='star' />Favorito</Label>} 
                    {!!(project.portfolio && project.confirmed !== 2) && <Label tag color='black' className='mr-2 mt-0' size='mini' style={{fontWeight:'500'}}><Icon name='tag' />Portfolio</Label>} 
                    {!!(project.touring && project.confirmed !== 2) && <Label tag color='black' className='mt-0' size='mini' style={{fontWeight:'500'}}><Icon name='road' />Em turnê</Label>}
                </div>
            </Segment>
            <Segment>
                <Button size='tiny' href={`/backstage/${project.username}`}>Gerenciar</Button>
            </Segment>
            </Segment.Group>
        </div>
        }
        </>
    )

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid stackable columns={2} className="container mb-5 pb-4 px-1 px-md-3">
                <Grid.Row>
                    <Grid.Column only='computer' computer={4}>
                        <Form className='mb-3'>
                            <Form.Input 
                                fluid
                                icon='search'
                                id="pesquisa"
                                name="pesquisa"
                                placeholder="Filtrar por nome do projeto" 
                                onChange={handlePesquisaChange}
                                value={pesquisa}
                            />
                        </Form>
                        <Button.Group vertical fluid size='small' basic>
                            <Button><Icon name='plus'/> Criar novo projeto do zero</Button>
                            <Button><Icon name='lightbulb'/> Nova ideia de projeto</Button>
                            <Button><Icon name='add user'/> Ingressar em um projeto</Button>
                            <Button><Icon name='envelope'/> Convidar para um projeto</Button>
                        </Button.Group>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={16} computer={12}>
                        {/* <p style={{opacity:'0.6',fontSize:'11px',textAlign:'right'}}><Icon name='sort alphabet down' />Ordenado por ordem alfabética</p> */}
                        {myProjects().length ? myProjects() : <p>Nenhum projeto principal encontrado com '{pesquisa}'</p>}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default MyProjectsListPage;