import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchInfos } from '../../store/actions/search';
import { Grid, Form, Loader, Header, Input, Tab, Image, List, Label, Icon, Card } from 'semantic-ui-react'
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';

function SearchPage (props) {

    let searchedKeywords = (new URLSearchParams(window.location.search)).get("keywords")
 
    document.title = searchedKeywords ? searchedKeywords+'" | Pesquisa | Mublin' : 'Pesquisa | Mublin'

    const userSession = JSON.parse(localStorage.getItem('user'));

    let dispatch = useDispatch();

    let history = useHistory();

    useEffect(() => {
        window.scrollTo(0, 0)
        dispatch(searchInfos.getSearchUsersResults(searchedKeywords))
        dispatch(searchInfos.getSearchProjectsResults(searchedKeywords))
        dispatch(searchInfos.getSuggestedUsersResults())
    }, [dispatch, searchedKeywords]);

    const searchResults = useSelector(state => state.search);
    const suggestedUsers = useSelector(state => state.search.suggestedUsers)

    let totalProjects
    if (searchResults.projects[0].id) {
        totalProjects = searchResults.projects.length
    }

    const handleSearch = (query) => {
        history.push({
            pathname: '/search',
            search: '?keywords='+query
        })
    }

    const [searchQuery, setSearchQuery] = useState(searchedKeywords)

    // detecta tamanho da tela para definir a quantidade de cards no grid de sugestões
    const [screenSize, setScreenSize] = useState({ matches: window.matchMedia("(min-width: 768px)").matches })
    const handler = e => setScreenSize({matches: e.matches});
    window.matchMedia("(min-width: 768px)").addEventListener('change',handler);

    const [showMobileMenu, setShowMobileMenu] = useState(true)

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid as='main' columns={1} className="container">
                <Grid.Row columns={1} only='mobile'>
                    <Grid.Column width={16}>
                        <Form
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setSearchQuery(searchQuery);
                                }
                            }}
                            onFocus={() => setShowMobileMenu(false)}
                            onBlur={() => setShowMobileMenu(true)}
                        >
                            <Input 
                                fluid
                                size='large'
                                action={{ icon: 'search', onClick: () => handleSearch(searchQuery) }} 
                                placeholder='Pesquisar...'
                                value={searchQuery} 
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                { searchedKeywords ? ( 
                    <Grid.Row>
                        <Grid.Column width={16}>
                            { searchedKeywords && 
                                <Tab menu={{ secondary: true, pointing: true }} panes={
                                    [
                                        {
                                            menuItem: searchResults.users[0].id ? 'Pessoas ('+searchResults.users.length+')' : 'Pessoas (0)',
                                            render: () => 
                                                <Tab.Pane basic attached={false} loading={searchResults.requesting}>
                                                    { searchResults.users[0].id ? (
                                                    <Card.Group itemsPerRow={screenSize.matches ? 6 : 2} className='px-0 px-md-0 pb-5'>
                                                        { searchResults.users.map((user, key) =>
                                                            <Card key={key} onClick={() => history.push('/'+user.username)}>
                                                                { user.picture ? (
                                                                    <Image src={user.picture} wrapped ui={false} />
                                                                ) : (
                                                                    <Image src='https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' wrapped ui={false} />
                                                                )}
                                                                <Card.Content>
                                                                    <Card.Header style={{fontSize:'14.4px',width:'100%',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} title={user.name+' '+user.lastname}>
                                                                        {!!user.verified && <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' />} {user.name} {user.id !== userSession.id ? user.lastname : '(Você)'}
                                                                    </Card.Header>
                                                                    { user.instrumentalist && 
                                                                        <Card.Meta style={{fontSize:'12.4px'}}>
                                                                            <span style={{color:'darkgray '}}>{user.mainRole}</span>{user.plan === 'Pro' && <Label size="tiny" className="ml-1 p-1" style={{cursor:"default"}}>Pro</Label>}
                                                                        </Card.Meta>
                                                                    }
                                                                    {user.city &&
                                                                        <Card.Meta style={{fontSize:'11px',width:'100%',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                                                                            {user.city+' - '+user.region}
                                                                        </Card.Meta>
                                                                    }
                                                                    <Card.Description style={{fontSize:'11px'}}>
                                                                        {user.totalProjects} projetos
                                                                    </Card.Description>
                                                                    { user.availabilityStatus && 
                                                                        <Card.Description style={{fontSize:'11px',width:'100%',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} className='mt-1'>
                                                                            <Label circular color={user.availability_color} empty size='mini' /> {user.availabilityStatus}
                                                                        </Card.Description>
                                                                    }
                                                                    {/* { !!(user.projectRelated && user.projectPublic && searchResults.projects[0].id) &&
                                                                        <Card.Description style={{fontSize:'10px'}}>
                                                                            Projeto relacionado: {user.projectRelated} {'('+user.projectType+')'} 
                                                                        </Card.Description>
                                                                    } */}
                                                                </Card.Content>
                                                            </Card>
                                                        )}
                                                    </Card.Group>
                                                    ) : (
                                                    <p>Nenhum usuário encontrado</p>
                                                    )}
                                                </Tab.Pane>,
                                        }, 
                                        {
                                            menuItem: searchResults.projects[0].id ? 'Projetos ('+searchResults.projects.length+')' : 'Projetos (0)',
                                            render: () => 
                                                <Tab.Pane basic attached={false} loading={searchResults.requesting}>
                                                    {searchResults.projects[0].id ? (
                                                    <Card.Group itemsPerRow={screenSize.matches ? 6 : 2} className='px-0 px-md-0 pb-5' style={{maxWidth:'100%'}}>
                                                        { searchResults.projects.map((project, key) =>
                                                            <Card key={key} onClick={() => history.push('/project/'+project.username)}>
                                                                { project.picture ? (
                                                                    <Image rounded src={project.picture} onClick={() => history.push('/project/'+project.username)} wrapped ui={false} />
                                                                ) : (
                                                                    <Image rounded src='https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_Kblh5CBKPp.jpg' onClick={() => history.push('/project/'+project.username)} wrapped ui={false} /> 
                                                                )}
                                                                <Card.Content>
                                                                    <Card.Header style={{fontSize:'14.4px',width:'100%',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                                                                        {project.name}
                                                                    </Card.Header>
                                                                    <Card.Meta style={{fontSize:'12.4px'}}>
                                                                        <span style={{color:'darkgray '}}>{project.type} {project.mainGenre && '・ '+project.mainGenre}</span>
                                                                    </Card.Meta>
                                                                    {project.city &&
                                                                        <Card.Meta style={{fontSize:'11px',width:'100%',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                                                                            {project.city && project.city+', '+project.region}
                                                                        </Card.Meta>
                                                                    }
                                                                </Card.Content>
                                                            </Card>
                                                        )}
                                                    </Card.Group>
                                                    ) : (
                                                    <p>Nenhum projeto encontrado</p>
                                                    )}
                                                </Tab.Pane>,
                                        }
                                        // {
                                        //     menuItem: 'Eventos',
                                        //     render: () => 
                                        //         <Tab.Pane loading={searchResults.requesting}>
                                        //             asd
                                        //         </Tab.Pane>,
                                        // },
                                    ]
                                }/>
                            }
                        </Grid.Column>
                    </Grid.Row>
                ) : (
                    <Grid.Row style={{justifyContent:'center'}} className='pb-5'>
                        { searchResults.requesting ? (
                        <Loader active inline='centered' />
                        ) : (
                        <>
                        <Header>Sugestões para você seguir</Header>
                        <Card.Group itemsPerRow={screenSize.matches ? 6 : 2} className='px-0 px-md-0 pb-5 mt-1' style={{maxWidth:'100%'}}>
                            { suggestedUsers.map((user, key) =>
                                <Card key={key} onClick={() => history.push('/'+user.username)}>
                                    { user.picture ? (
                                        <Image src={user.picture} wrapped ui={false} />
                                    ) : (
                                        <Image src='https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' wrapped ui={false} />
                                    )}
                                    <Card.Content>
                                        <Card.Header style={{fontSize:'14.4px',width:'100%',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} title={user.name+' '+user.lastname}>
                                            {user.name+' '+user.lastname}
                                        </Card.Header>
                                        { user.instrumentalist && 
                                            <Card.Meta style={{fontSize:'12.4px'}}>
                                                {user.mainRole}
                                            </Card.Meta>
                                        }
                                        {user.city &&
                                            <Card.Meta style={{fontSize:'11px',width:'100%',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                                                {user.city+' - '+user.region}
                                            </Card.Meta>
                                        }
                                        <Card.Description style={{fontSize:'11px'}}>
                                            {user.totalProjects} projetos
                                        </Card.Description>
                                        { user.availabilityTitle && 
                                            <Card.Description style={{fontSize:'11px',width:'100%',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} className='mt-1'>
                                                 <Label circular color={user.availabilityColor} empty size='mini' /> {user.availabilityTitle}
                                            </Card.Description>
                                        }
                                    </Card.Content>
                                </Card>
                            )}
                        </Card.Group>
                        </>
                        )}
                    </Grid.Row>
                )}
            </Grid>
            { showMobileMenu && 
                <FooterMenuMobile />
            }
        </>
    )
}

export default SearchPage;