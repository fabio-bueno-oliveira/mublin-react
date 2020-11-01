import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { useHistory } from 'react-router-dom';
import { Grid, Header, Segment, Form, Image, Icon, Loader, Label } from 'semantic-ui-react';
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

    const myProjects = (category) => userProjects.filter((project) => { return project.portfolio === category && (project.name.toLowerCase().includes(pesquisa.toLowerCase())) }).map((project, key) =>
        <>
        <Segment key={key} attached='top' className='mb-4'>
            <Header as='h4' onClick={() => history.push('/backstage/'+project.username)} style={{cursor:'pointer'}}>
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
            <div>
                {userInfo.picture ? (
                    <Image src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-200,w-200,c-maintain_ratio/'+userInfo.id+'/'+userInfo.picture} avatar />
                ) : (
                    <Image src={'https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'} avatar />
                )}
                <span><Icon name={project.workIcon} className='ml-1' />{project.workTitle} {!!project.admin && <><Label size='tiny' basic style={{fontWeight:'600'}}>Administrador</Label></>}</span>
            </div>
            <span style={{fontSize:'11px'}}>
                {project.role1}{project.role2 && ', '+project.role2}{project.role3 && ', '+project.role3}
            </span>
            <p className='mt-2'><Label as='a' size='tiny'><Icon name='exchange' />Alterar para categoria {project.portfolio ? 'Principal' : 'Portfolio'}</Label> {project.featured ? <Label as='a' size='tiny'><Icon name='star' color='yellow' title='Em destaque' />Em destaque</Label> : <Label as='a' size='tiny'><Icon name='star' color='grey' title='Definir como destaque' style={{opacity:'0.3'}}/>Definir como destaque</Label>}</p>
            {(!project.yearEnd && project.ptid !== 7) &&
                <Label attached='bottom' size='tiny' color='green' style={{fontWeight:'500'}}>
                    Projeto em atividade {project.yearFoundation && 'desde '+project.yearFoundation}
                </Label>
            }
            {(project.yearEnd && project.yearEnd <= currentYear) &&
                <Label attached='bottom' size='tiny' color='red' style={{fontWeight:'500'}}>
                    Projeto encerrado em {project.yearEnd}
                </Label>
            }
            {(project.ptid === 7) &&
                <Label attached='bottom' size='tiny' color='blue' style={{fontWeight:'500'}}>
                    Ideia em desenvolvimento
                </Label>
            }
        </Segment>
        </>
    )

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid as='main' stackable columns={1} className="container mb-5 pb-4">
                <Grid.Row>
                    <Grid.Column width={16}>
                        {/* <Message
                            info 
                            size='tiny'
                            // icon='lightbulb outline'
                            header='Bem vindo ao seu Backstage!'
                            content='Aqui você tem uma visão geral dos status dos seus projetos'
                        /> */}
                        <Header as='h2' className='mb-4'>
                            <Header.Content>
                                Meu Backstage
                                {/* <Header.Subheader>{userProjects.length+' projetos encontrados'}</Header.Subheader> */}
                                <Header.Subheader>Gerencie e veja informações dos seus projetos</Header.Subheader>
                            </Header.Content>
                        </Header>
                        <Form style={{width:'260px'}}>
                            <Form.Input 
                                icon='search'
                                id="pesquisa"
                                name="pesquisa"
                                placeholder="Filtrar por nome do projeto" 
                                onChange={handlePesquisaChange}
                                value={pesquisa}
                            />
                        </Form>
                        { userInfo.requesting &&
                            <Loader active inline='centered' />
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Header as='h3' className='mb-1'>Principais ({userProjects.filter((project) => { return project.portfolio === 0 }).length})</Header>
                        {!!myProjects(0).length && <p>Selecione para gerenciar</p>}
                    {myProjects(0).length ? myProjects(0) : <p>Nenhum projeto principal encontrado com '{pesquisa}'</p>}
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Header as='h3' className='mb-1'>Portfolio ({userProjects.filter((project) => { return project.portfolio === 1 }).length})</Header>
                        {!!myProjects(1).length && <p>Selecione para gerenciar</p>}
                        {myProjects(1).length ? myProjects(1) : <p>Nenhum projeto portfolio encontrado com '{pesquisa}'</p>}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default BackstageMainPage;