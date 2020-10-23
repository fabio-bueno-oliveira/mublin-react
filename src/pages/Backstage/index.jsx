import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { useHistory } from 'react-router-dom';
import { Grid, Header, Segment, Form, Image, Icon, Message, Label } from 'semantic-ui-react';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
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
        <Segment key={key} color={(project.yearEnd && project.yearEnd <= currentYear) ? 'red' : 'green'} attached='top' className='mb-4'>
            <Header as='h4' onClick={() => history.push('/backstage/'+project.username)} style={{cursor:'pointer'}}>
                {project.picture ? (
                    <Image src={'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'+project.picture} rounded />
                ) : (
                    <Image src={'https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_-dv9U6dcv3.jpg'} rounded />
                )}
                <Header.Content>
                    {project.name} {!!project.featured && <Icon name='star' color='grey' title='Definido como destaque' />}
                    <Header.Subheader style={{fontSize:'12px',width:'240px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{project.ptname} {project.genre1 && '('+project.genre1}{project.genre2 && ', '+project.genre2}{project.genre3 && ', '+project.genre3}{project.genre1 && ')'}</Header.Subheader>
                </Header.Content>
            </Header>
            {(project.yearEnd && project.yearEnd <= currentYear) &&
                <Label attached='top right' size='tiny' color='red' style={{fontWeight:'500'}}>
                    Encerrado em {project.yearEnd}
                </Label>
            }
            <div>
                {userInfo.picture ? (
                    <Image src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-200,w-200,c-maintain_ratio/'+userInfo.id+'/'+userInfo.picture} avatar />
                ) : (
                    <Image src={'https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'} avatar />
                )}
                <span><Icon name={project.workIcon} className='ml-1' />{project.workTitle} {!!project.admin && <> · <Icon name='wrench' className='ml-1' />Administrador</>}</span>
            </div>
            <span style={{fontSize:'11px'}}>
                {project.role1}{project.role2 && ', '+project.role2}{project.role3 && ', '+project.role3}
            </span>
        </Segment>
        {/* <Button.Group attached='bottom' size='tiny'>
            <Button onClick={() => history.push('/backstage/'+project.username)}><Icon name='warehouse' />Ver Backstage</Button>
            <Button onClick={() => history.push('/project/'+project.username)}><Icon name='globe' />Ver Perfil</Button>
        </Button.Group> */}
        </>
    )

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Grid as='main' stackable columns={1} className="container mb-5 pb-4 mt-4 mt-md-5 pt-5">
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Message
                            info 
                            size='tiny'
                            // icon='lightbulb outline'
                            header='Bem vindo ao seu Backstage!'
                            content='Aqui você tem uma visão geral dos status dos seus projetos'
                        />
                        <Header as='h2'>
                            <Header.Content>
                                Meu Backstage
                                <Header.Subheader>{userProjects.length+' projetos encontrados'}</Header.Subheader>
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
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Header as='h3'>Principais</Header>
                        {!!myProjects(0).length && <p>Selecione para gerenciar</p>}
                        {myProjects(0).length ? myProjects(0) : <p>Nenhum projeto principal encontrado</p>}
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Header as='h3'>Portfolio</Header>
                        {!!myProjects(1).length && <p>Selecione para gerenciar</p>}
                        {myProjects(1).length ? myProjects(1) : <p>Nenhum projeto portfolio encontrado</p>}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default BackstageMainPage;