import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../store/actions/user';
import { useHistory } from 'react-router-dom';
import { Grid, Header, Segment, Form, Image, Icon, Placeholder, Label, Button, Checkbox } from 'semantic-ui-react';
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

    const [isLoading, setIsLoading] = useState(false)
    const [action1IsLoading, setAction1IsLoading] = useState(null)
    const [action2IsLoading, setAction2IsLoading] = useState(null)

    const [pesquisa, setPesquisa] = useState("")

    const handlePesquisaChange = e => {
        setPesquisa(e.target.value)
    }

    const updateProjectCategory = (userProjectId, projectId, portfolio, key) => {
        setAction1IsLoading(key)
        fetch('https://mublin.herokuapp.com/project/'+projectId+'/updateCategory', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userToken.token
            },
            body: JSON.stringify({userProjectId: userProjectId, portfolio: portfolio})
        }).then((response) => {
            response.json().then((response) => {
                dispatch(userInfos.getUserProjects(userToken.id));
                setAction1IsLoading(null)
            })
        }).catch(err => {
                setAction1IsLoading(null)
                console.error(err)
                alert('Ocorreu um erro ao tentar atualizar a categoria do projeto. Tente novamente em instantes')
            })
    }

    const updateProjectFeatured = (userProjectId, projectId, featured, key) => {
        setAction2IsLoading(key)
        fetch('https://mublin.herokuapp.com/project/'+projectId+'/updateFeatured', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userToken.token
            },
            body: JSON.stringify({userProjectId: userProjectId, featured: featured})
        }).then((response) => {
            response.json().then((response) => {
                dispatch(userInfos.getUserProjects(userToken.id));
                setAction2IsLoading(null)
            })
        }).catch(err => {
                setAction2IsLoading(null)
                console.error(err)
                alert('Ocorreu um erro ao tentar atualizar a opção de favorito neste projeto. Tente novamente em instantes')
            })
    }

    const myProjects = (category) => userProjects.filter((project) => { return (project.name.toLowerCase().includes(pesquisa.toLowerCase())) }).sort((a, b) => a.name.localeCompare(b.name)).map((project, key) =>
        <>
        { !userInfo.requesting ? (
        <Segment key={key} attached='top' className='mb-4' secondary={project.confirmed === 2}>
            <Label attached='top' size='tiny' style={{fontWeight:'500'}}>
                {project.status === 1 ? <><Icon name={project.workIcon} className='mr-1' />Membro oficial</> : <><Icon name={project.workIcon} className='mr-1' />Convidado/Sideman</>}
                <Label circular color={(project.yearLeftTheProject || project.yearEnd) ? 'red' : 'green'} empty size='mini' style={{verticalAlign:'top'}} className='mx-1' />
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
            </Label>
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
                <span style={{fontSize:'12px'}}>
                    {project.role1}{project.role2 && ', '+project.role2}{project.role3 && ', '+project.role3}
                </span>
            </div>
            <p className='mt-2 mb-3'><Checkbox disabled={action1IsLoading === key && true} toggle label='Portfolio' checked={project.portfolio} onChange={project.portfolio ? ( () => updateProjectCategory(project.id, project.projectid, 0, key) ) : ( () => updateProjectCategory(project.id, project.projectid, 1, key) )} /> <Checkbox disabled={action2IsLoading === key && true} toggle label='Favorito' checked={project.featured} onClick={project.featured ? ( () => updateProjectFeatured(project.id, project.projectid, 0, key) ) : ( () => updateProjectFeatured(project.id, project.projectid, 1, key) )} className='ml-3' /></p>
            {(!project.yearEnd && project.ptid !== 7) &&
                <p style={{fontSize:'11px'}}>
                    Projeto em atividade {project.yearFoundation && 'desde '+project.yearFoundation}
                </p>
            }
            {(project.yearEnd && project.yearEnd <= currentYear) &&
                <p style={{fontSize:'11px'}}>
                    Projeto encerrado em {project.yearEnd}
                </p>
            }
            {(project.ptid === 7) &&
                <p style={{fontSize:'11px'}}>
                    Ideia em desenvolvimento
                </p>
            }
        </Segment>
        ) : (
        <Placeholder className='mt-4'>
            <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Paragraph>
        </Placeholder>
        )}
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
                                Meu Backstage
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