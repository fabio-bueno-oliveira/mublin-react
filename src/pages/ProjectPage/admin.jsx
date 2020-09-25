import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { Grid, Segment, Header, Icon, Button, Message, Image, Label, List } from 'semantic-ui-react';
import { projectInfos } from '../../store/actions/project';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';

function ProjectAdminPage (props) {

    let history = useHistory();

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(projectInfos.getProjectInfo(props.match.params.username));
        dispatch(projectInfos.getProjectMembers(props.match.params.username));
    }, []);

    const project = useSelector(state => state.project);
    const members = project.members;

    document.title = project.name+' | Mublin'

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Grid stackable centered verticalAlign='middle' columns={1} verticalAlign='top' className="container mb-2 mt-4 mt-md-5 pt-5">
                <Grid.Row>
                    <Grid.Column mobile={16} computer={16}>
                        <Message positive>
                            <Message.Header>{project.name} criado com sucesso!</Message.Header>
                        </Message>
                        <Segment>
                            <Label size='small'>Página do Administrador</Label>
                        </Segment>
                        <Segment>
                            <Link>Ver perfil</Link>
                        </Segment>
                        <Segment>
                            <Header as='h2'>
                                {project.picture ? (
                                    <Image src={'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'+project.id+'/'+project.picture} rounded />
                                ) : (
                                    <Image src={'https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_-dv9U6dcv3.jpg'} rounded />
                                )}
                                <Header.Content>
                                    {project.name}<Label size='small'>Página do Administrador</Label><Label size='small' color='black' as='a' href={'/project/'+project.username}>Ver perfil</Label>
                                    <Header.Subheader>{project.typeName}</Header.Subheader>
                                </Header.Content>
                            </Header>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row stretched>
                    <Grid.Column mobile={16} computer={4}>
                        <Segment>
                            <Header as='h4'>
                                Foto
                            </Header>
                            {project.picture ? (
                                    <Image centered bordered src={'https://ik.imagekit.io/mublin/projects/tr:h-400,w-400,c-maintain_ratio/'+project.id+'/'+project.picture} rounded size='small' />
                                ) : (
                                    <Image centered bordered src={'https://ik.imagekit.io/mublin/sample-folder/tr:h-400,w-400,c-maintain_ratio/avatar-undefined_-dv9U6dcv3.jpg'} rounded size='small' />
                            )}
                        </Segment>
                    </Grid.Column>
                    <Grid.Column mobile={16} computer={6}>
                        <Segment attached='top'>
                            {/* <Header as='h4'>
                                <Header.Content>
                                    Membros
                                    <Header.Subheader>Manage your preferences</Header.Subheader>
                                </Header.Content>
                            </Header> */}
                            <div className='cardTitle'>
                                <Header as='h4' className='pt-1'>{members.length} Membros</Header>
                                <Label size='small' content='Convidar novo' icon='user plus' />
                            </div>
                            <List relaxed divided verticalAlign='middle'>
                                {members.map((member, key) =>
                                    <List.Item key={key}>
                                        <List.Content floated='right'>
                                            <Button size='mini' icon='cog' />
                                        </List.Content>
                                        { member.picture ? (
                                            <Image src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-200,w-200,c-maintain_ratio/'+member.id+'/'+member.picture} width="25" height="25" circular alt={'Foto de '+member.name} />
                                        ) : (
                                            <Image src='https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' width="25" height="25" circular alt={'Foto de '+member.name} />
                                        )}
                                        <List.Content>
                                            <List.Header as='a'>{member.name+' '+member.lastname} ({member.statusName})</List.Header>
                                            <span style={{fontSize:'11px'}}><Icon name={member.statusIcon} />{member.role1}{member.role2 && ', '+member.role2}{member.role3 && ', '+member.role3}</span>
                                        </List.Content>
                                    </List.Item>
                                )}
                            </List>
                        </Segment>
                        <Segment secondary attached='bottom'>
                            <p style={{fontSize:'11px'}}>Administradores podem editar toda a página, incluindo foto de perfil do projeto e excluir membros</p>
                            <p style={{fontSize:'11px'}}>Líderes podem adicionar e editar eventos</p>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column mobile={16} computer={6}>
                        <Segment>
                            <Header as='h4'>
                                Membros
                            </Header>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default ProjectAdminPage;