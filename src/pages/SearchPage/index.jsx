import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchInfos } from '../../store/actions/search';
import { Grid, Form, Header, Input, Tab, Image, List, Label, Icon, Segment, Loader as UiLoader } from 'semantic-ui-react'
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';

function SearchPage (props) {

    let searchedKeywords = (new URLSearchParams(window.location.search)).get("keywords")
 
    document.title = '"'+searchedKeywords+'" | Pesquisa | Mublin'

    const userInfo = JSON.parse(localStorage.getItem('user'));

    let dispatch = useDispatch();

    let history = useHistory();

    useEffect(() => {
        window.scrollTo(0, 0)
        dispatch(searchInfos.getSearchUsersResults(searchedKeywords))
        dispatch(searchInfos.getSearchProjectsResults(searchedKeywords))
    }, [dispatch, searchedKeywords]);

    const searchResults = useSelector(state => state.search);

    console.log(28, searchResults)

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

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Grid as='main' columns={1} className="container mb-2 mt-4 mt-md-5 pt-5">
                <Grid.Row columns={1} only='mobile'>
                    <Grid.Column width={16}>

                            <Form
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setSearchQuery(searchQuery);
                                    }
                                }}
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
                <Grid.Row>
                    <Grid.Column width={16}>
                        { searchedKeywords && 
                            <Tab panes={
                                [
                                    {
                                        menuItem: searchResults.users[0].id ? 'Pessoas ('+searchResults.users.length+')' : 'Pessoas (0)',
                                        render: () => 
                                            <Tab.Pane loading={searchResults.requesting}>
                                                <List relaxed className='mb-5 mb-md-0'>
                                                {searchResults.users.map((user, key) =>
                                                    <List.Item key={key} className='p-2' style={{alignItems:'center',display:'flex'}}>
                                                        { user.picture ? (
                                                            <Image circular size='mini' src={user.picture} onClick={() => history.push('/'+user.username)} style={{cursor:'pointer', width:'50px'}} />
                                                        ) : (
                                                            <Image circular size='mini' src='https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_Kblh5CBKPp.jpg' onClick={() => history.push('/'+user.username)} style={{cursor:'pointer',width:'50px'}} /> 
                                                        )}
                                                        <List.Content>
                                                            <List.Header as='a' href={'/'+user.username}>
                                                                {user.name+' '+user.lastname} {!!user.verified && <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' />}{/*!!user.legend && <Icon name='star' color='yellow' />*/} {user.plan === 'Pro' && <Label size="tiny" className="ml-1 p-1">Pro</Label>}{userInfo.id === user.id && <span style={{color:'black',opacity:'0.8',fontWeight:'400'}}>・Você</span>}
                                                            </List.Header>
                                                            <List.Description style={{fontSize:'13px'}}>
                                                                {user.mainRole} {(user.city && user.mainRole) && '・'} {user.city && user.city+', '+user.region}
                                                            </List.Description>
                                                            { !!(user.projectRelated && user.projectPublic && searchResults.projects[0].id) &&
                                                                <List.Description style={{fontSize:'10px'}}>
                                                                    Projeto relacionado: {user.projectRelated} {'('+user.projectType+')'} 
                                                                </List.Description>
                                                            }
                                                        </List.Content>
                                                    </List.Item>
                                                )}
                                                </List>
                                            </Tab.Pane>,
                                    }, 
                                    {
                                        menuItem: searchResults.projects[0].id ? 'Projetos ('+searchResults.projects.length+')' : 'Projetos (0)',
                                        render: () => 
                                            <Tab.Pane loading={searchResults.requesting}>
                                                <List relaxed>
                                                    {searchResults.projects.map((project, key) =>
                                                        <List.Item key={key} className='p-2' style={{alignItems:'center',display:'flex'}}>
                                                            { project.picture ? (
                                                                <Image rounded size='mini' src={project.picture} onClick={() => history.push('/project/'+project.username)} style={{cursor:'pointer', width:'50px'}} />
                                                            ) : (
                                                                <Image rounded size='mini' src='https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_Kblh5CBKPp.jpg' onClick={() => history.push('/project/'+project.username)} style={{cursor:'pointer',width:'50px'}} /> 
                                                            )}
                                                            <List.Content>
                                                                <List.Header as='a' href={'/project/'+project.username}>
                                                                    {project.name}
                                                                </List.Header>
                                                                <List.Description style={{fontSize:'13px'}}>
                                                                    {project.type+' ・ '+project.mainGenre}
                                                                </List.Description>
                                                                <List.Description style={{fontSize:'10px'}}>
                                                                    {project.city && project.city+', '+project.region}
                                                                </List.Description>
                                                            </List.Content>
                                                        </List.Item>
                                                    )}
                                                </List>
                                            </Tab.Pane>,
                                    },
                                    {
                                        menuItem: 'Eventos',
                                        render: () => 
                                            <Tab.Pane loading={searchResults.requesting}>
                                                asd
                                            </Tab.Pane>,
                                    },
                                ]
                            }/>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default SearchPage;