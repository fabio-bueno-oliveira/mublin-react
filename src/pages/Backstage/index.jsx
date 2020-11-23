import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { useHistory } from 'react-router-dom';
import { Grid, Header, Segment, Form, Image, Icon, Label, Button } from 'semantic-ui-react';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import Spacer from '../../components/layout/Spacer'
import FooterMenuMobile from '../../components/layout/footerMenuMobile';

function BackstageMainPage () {
 
    document.title = 'Backstage | Mublin'
    
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

    const myProjects = (category) => userProjects.filter((project) => { return (project.name.toLowerCase().includes(pesquisa.toLowerCase())) }).sort((a, b) => a.name.localeCompare(b.name)).map((project, key) =>
        <>
        { !userInfo.requesting &&
        <div className='mb-4 mt-3'>
            <Segment key={key} attached='top' color={(project.yearLeftTheProject || project.yearEnd) ? null : 'green'} secondary={project.confirmed === 2}>
                <Header as='h3' className='mt-0 mb-3'>
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
                <div className='mb-2'>
                    {userInfo.picture ? (
                        <Image src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-200,w-200,c-maintain_ratio/'+userInfo.id+'/'+userInfo.picture} avatar />
                    ) : (
                        <Image src={'https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'} avatar />
                    )}
                    <span style={{fontSize:'12px'}}>
                        {project.role1}{project.role2 && ', '+project.role2}{project.role3 && ', '+project.role3}
                    </span>
                </div>
                <div className='mb-2' style={{fontWeight:'500', fontSize:'11px'}}>
                    {project.status === 1 ? <><Icon name={project.workIcon} className='mr-1' />Membro oficial</> : <><Icon name={project.workIcon} className='mr-1' />Sideman</>}
                    <Label circular color={(project.yearLeftTheProject || project.yearEnd) ? 'grey' : 'green'} empty size='mini' className='ml-2 mr-1' />
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
                </div>
                {(!project.yearEnd && project.ptid !== 7) &&
                    <p className='mb-0' style={{fontSize:'11px'}}>
                        Projeto em atividade {project.yearFoundation && 'desde '+project.yearFoundation}
                    </p>
                }
                {(project.yearEnd && project.yearEnd <= currentYear) &&
                    <p className='mb-0' style={{fontSize:'11px'}}>
                        Projeto encerrado em {project.yearEnd}
                    </p>
                }
                {(project.ptid === 7) &&
                    <p className='mb-0' style={{fontSize:'11px'}}>
                        Ideia em desenvolvimento
                    </p>
                }
                {/* <p className='mt-2 mb-0' style={{fontSize:'12px'}}> */}
                    {project.confirmed === 2 && <Label className='mr-2 mt-3' size='mini' tag color='grey' style={{fontWeight:'500'}}><Icon name='clock' />Aguardando aprovação</Label>}  
                    { project.admin === 1 && <Label className='mr-2 mt-3' size='mini' tag style={{fontWeight:'500'}}><Icon name='key' />Administrador</Label>}
                    {!!(project.featured && project.confirmed !== 2) && <Label className='mr-2 mt-3' size='mini' tag style={{fontWeight:'500'}}><Icon name='star' />Favorito</Label>} 
                    {!!(project.portfolio && project.confirmed !== 2) && <Label className='mr-2 mt-3' size='mini' tag style={{fontWeight:'500'}}><Icon name='tag' />Portfolio</Label>} 
                    {!!(project.touring && project.confirmed !== 2) && <Label className='mt-3' size='mini' tag style={{fontWeight:'500'}}><Icon name='road' />Em turnê</Label>}
                {/* </p> */}
            </Segment>
            <Button.Group attached='bottom' size='mini'>
                <Button onClick={() => history.push('/backstage/'+project.username)}>
                    <Icon name='warehouse' />Ver Backstage
                </Button>
                <Button onClick={() => history.push('/backstage/preferences/'+project.username)}>
                    <Icon name='setting' />Gerenciar Participação
                </Button>
            </Button.Group>
        </div>
        }
        </>
    )

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid as='main' centered columns={1} className="container mb-5 pb-4 px-1 px-md-3">
                <Grid.Row>
                    <Grid.Column computer={10} mobile={16}>
                        <Header as='h2' className='mb-4'>
                            <Header.Content>
                                Meus Backstages
                                <Header.Subheader>Gerencie seus projetos</Header.Subheader>
                            </Header.Content>
                        </Header>
                        <Form>
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
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column computer={10} mobile={16}>
                        <Header as='h4' className='mb-1'>Meus projetos ({userInfo.requesting ? 'Carregando...' : userProjects.length})</Header>
                        {/* {!!myProjects().length && <p>{userInfo.requesting ? 'Carregando...' : 'Selecione para gerenciar'}</p>} */}
                        <p className='mt-2' style={{opacity:'0.6',fontSize:'11px'}}><Icon name='sort alphabet down' />Ordenado por ordem alfabética</p>
                        {myProjects().length ? myProjects() : <p>Nenhum projeto principal encontrado com '{pesquisa}'</p>}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default BackstageMainPage;