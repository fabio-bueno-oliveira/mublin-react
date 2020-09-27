import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { Grid, Segment, Header, Icon, Button, Message, Image, Label, List, Form, Checkbox, Select, Dropdown, Modal, Container, Statistic } from 'semantic-ui-react';
import { projectInfos } from '../../../store/actions/project';
import HeaderDesktop from '../../../components/layout/headerDesktop';
import HeaderMobile from '../../../components/layout/headerMobile';
import FooterMenuMobile from '../../../components/layout/footerMenuMobile';
import Loader from 'react-loader-spinner';
import { Formik } from 'formik';

function ProjectBackstagePage (props) {

    let newProject = (new URLSearchParams(window.location.search)).get("new")

    const user = JSON.parse(localStorage.getItem('user'));

    let history = useHistory();

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(projectInfos.getProjectAdminAccessInfo(props.match.params.username));
        dispatch(projectInfos.getProjectInfo(props.match.params.username));
        dispatch(projectInfos.getProjectMembers(props.match.params.username));
    }, []);

    const project = useSelector(state => state.project);
    const members = project.members;

    document.title = project.name+' | Administrador | Mublin'

    const [isLoading, setIsLoading] = useState(false)

    // modal bio
    const [modalBioIsOpen, setModalBioIsOpen] = useState(false)

    const handleSubmitBio = (bio) => {
        setTimeout(() => {
            fetch('https://mublin.herokuapp.com/project/'+project.username+'/updateBio', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify({projectId: project.id, bio: bio})
            }).then((response) => {
                dispatch(projectInfos.getProjectInfo(props.match.params.username));
                setModalBioIsOpen(false)
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao atualizar a bio. Tente novamente em instantes")
            })
        }, 400);
    }

    // modal tag
    const [modalTagIsOpen, setModalTagIsOpen] = useState(false)

    const colors = [
        { key: 'red', text: 'Vermelho', value: 'red', label:{color: 'red', empty: true, circular: true} },
        { key: 'orange', text: 'Laranja', value: 'orange', label:{color: 'orange', empty: true, circular: true} },
        { key: 'yellow', text: 'Amarelo', value: 'yellow', label:{color: 'yellow', empty: true, circular: true} },
        { key: 'olive', text: 'Oliva', value: 'olive', label:{color: 'olive', empty: true, circular: true} },
        { key: 'green', text: 'Verde', value: 'green', label:{color: 'green', empty: true, circular: true} },
        { key: 'teal', text: 'Azul petróleo', value: 'teal', label:{color: 'teal', empty: true, circular: true} },
        { key: 'blue', text: 'Azul', value: 'blue', label:{color: 'blue', empty: true, circular: true} },
        { key: 'violet', text: 'Violeta', value: 'violet', label:{color: 'violet', empty: true, circular: true} },
        { key: 'purple', text: 'Roxo', value: 'purple', label:{color: 'purple', empty: true, circular: true} },
        { key: 'pink', text: 'Pink', value: 'pink', label:{color: 'pink', empty: true, circular: true} },
        { key: 'brown', text: 'Marrom', value: 'brown', label:{color: 'brown', empty: true, circular: true} },
        { key: 'grey', text: 'Cinza', value: 'grey', label:{color: 'grey', empty: true, circular: true} },
        { key: 'black', text: 'Preto', value: 'black', label:{color: 'black', empty: true, circular: true} }
    ]

    const handleSubmitTag = (label_show, label_text, label_color) => {
        setTimeout(() => {
            fetch('https://mublin.herokuapp.com/project/'+project.username+'/updateTag', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify({projectId: project.id, label_show: label_show, label_text: label_text, label_color: label_color})
            }).then((response) => {
                dispatch(projectInfos.getProjectInfo(props.match.params.username));
                setModalTagIsOpen(false)
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao atualizar a bio. Tente novamente em instantes")
            })
        }, 400);
    }

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
        { (!project.requesting && project.adminAccess === 0) ? (
            <Container className='mt-5 pt-5'>
                {!project.requesting && 
                    <Message negative>
                        <Message.Header>Ocorreu um erro</Message.Header>
                        <p>Você não tem acesso a esta página</p>
                    </Message>
                }
            </Container>
        ) : (
            project.requesting ? (
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
                <Grid stackable centered verticalAlign='middle' columns={1} verticalAlign='top' className="container mb-2 mt-4 mt-md-5 pt-5">
                    <Grid.Row>
                        <Grid.Column mobile={16} computer={16}>
                            { newProject === 'true' &&
                                <Message positive>
                                    <Message.Header>{project.name} criado com sucesso!</Message.Header>
                                </Message>
                            }
                            <div>
                                <Label size='small'><Icon name='warehouse' />Backstage</Label> <Label size='small' as='a' color='black' href={'/project/'+project.username}>Ver perfil</Label>
                            </div>
                            <Segment>
                                <Header as='h2'>
                                    {project.picture ? (
                                        <Image src={'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'+project.id+'/'+project.picture} rounded />
                                    ) : (
                                        <Image src={'https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_-dv9U6dcv3.jpg'} rounded />
                                    )}
                                    <Header.Content>
                                        {project.name}
                                        <Header.Subheader>{project.typeName}</Header.Subheader>
                                    </Header.Content>
                                </Header>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row stretched>
                        <Grid.Column mobile={16} computer={4}>
                            <Segment textAlign='left'>
                                <Header as='h4'>
                                    Bio
                                </Header>
                                <p>{project.bio ? project.bio : 'Este projeto não possui descrição'}</p>
                                <Button fluid size='tiny' className='mt-3' onClick={() => setModalBioIsOpen(true)}>
                                    <Icon name='pencil' /> Editar
                                </Button>
                                <Modal
                                    size='mini'
                                    onClose={() => setModalBioIsOpen(false)}
                                    onOpen={() => setModalBioIsOpen(true)}
                                    open={modalBioIsOpen}
                                >
                                    <Formik
                                        initialValues={{ 
                                            bio: project.bio
                                        }}
                                        validate={false}
                                        validateOnMount={true}
                                        validateOnBlur={true}
                                        onSubmit={(values, { setSubmitting }) => {
                                        setTimeout(() => {
                                            setSubmitting(false);
                                            handleSubmitBio(values.bio)
                                        }, 400);
                                        }}
                                    >
                                    {({
                                        values, handleChange, handleSubmit, handleBlur, isSubmitting
                                    }) => (
                                        <>
                                        <Modal.Content>
                                            <Form loading={isSubmitting}>
                                                <Form.TextArea 
                                                    name='bio'
                                                    label='Bio' 
                                                    value={values.bio}
                                                    onChange={e => {
                                                        handleChange(e);
                                                    }}
                                                    onBlur={handleBlur}
                                                    maxLength="200"
                                                />
                                                <Label size='tiny' content={values.bio.length+'/200'} color={values.bio.length  > 199 ? 'red' : ''} />
                                            </Form>
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button
                                                size='small'
                                                onClick={() => setModalBioIsOpen(false)} 
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                size='small' 
                                                color='black'
                                                type="submit" 
                                                onClick={handleSubmit}
                                                disabled={values.bio === project.bio ? true : false}
                                            >
                                                Salvar
                                            </Button>
                                        </Modal.Actions>
                                        </>
                                        )}
                                    </Formik>
                                </Modal>
                            </Segment>
                            <Segment textAlign='left'>
                                <Header as='h4'>
                                    Tag
                                </Header>
                                { project.labelText ? (
                                    <>
                                        { project.labelShow ? (
                                            <Icon name='eye' />
                                        ) : (
                                            <Icon name='eye slash' />
                                        )}
                                        <Label color={project.labelColor} size='tiny' style={{fontWeight:'500'}}>
                                            {project.labelText}
                                        </Label>
                                    </>
                                ) : (
                                    <p>Nenhuma tag definida</p>
                                )}
                                <Button fluid size='tiny' className='mt-3' onClick={() => setModalTagIsOpen(true)}>
                                    <Icon name='pencil' /> Alterar
                                </Button>
                                <Modal
                                    size='mini'
                                    onClose={() => setModalTagIsOpen(false)}
                                    onOpen={() => setModalTagIsOpen(true)}
                                    open={modalTagIsOpen}
                                >
                                    <Formik
                                        initialValues={{ 
                                            label_show: String(project.labelShow),
                                            label_text: project.labelText,
                                            label_color: project.labelColor
                                        }}
                                        validate={false}
                                        validateOnMount={true}
                                        validateOnBlur={true}
                                        onSubmit={(values, { setSubmitting }) => {
                                            // alert(JSON.stringify(values, null, 2))
                                            setTimeout(() => {
                                                setSubmitting(false);
                                                handleSubmitTag(values.label_show, values.label_text, values.label_color)
                                            }, 400);
                                        }}
                                    >
                                    {({
                                        values, handleChange, handleSubmit, handleBlur, isSubmitting
                                    }) => (
                                        <>
                                        <Modal.Content>
                                            <Form loading={isSubmitting}>
                                                <Form.Field
                                                    label='Texto da tag'
                                                    id='label_text'
                                                    name='label_text'
                                                    control='input'
                                                    value={values.label_text}
                                                    onChange={e => {
                                                        handleChange(e);
                                                    }}
                                                    onBlur={handleBlur}
                                                    maxLength="30"
                                                />
                                                <Label size='tiny' content={values.label_text.length+'/30'} color={values.label_text.length  > 29 ? 'red' : ''} />
                                                <Form.Field 
                                                    label='Cor da tag' 
                                                    control='select' 
                                                    id='label_color'
                                                    name='label_color'
                                                    onChange={e => {
                                                        handleChange(e);
                                                    }}
                                                    value={values.label_color}
                                                >
                                                    <option value='red'>Vermelho</option>
                                                    <option value='orange'>Laranja</option>
                                                    <option value='yellow'>Amarelo</option>
                                                    <option value='olive'>Oliva</option>
                                                    <option value='green'>Verde</option>
                                                    <option value='teal'>Azul Petróleo</option>
                                                    <option value='blue'>Azul</option>
                                                    <option value='violet'>Violeta</option>
                                                    <option value='purple'>Roxo</option>
                                                    <option value='pink'>Pink</option>
                                                    <option value='brown'>Marrom</option>
                                                    <option value='grey'>Cinza</option>
                                                    <option value='black'>Preto</option>
                                                </Form.Field>
                                                {/* <Form.Select
                                                    id='label_color'
                                                    name='label_color'
                                                    fluid
                                                    label='Cor da tag'
                                                    options={colors}
                                                    placeholder='Cor da tag'
                                                    onChange={(e, { value }) => {
                                                        handleChange(value);
                                                    }}
                                                    onBlur={handleBlur}
                                                /> */}
                                                <Form.Group inline>
                                                    <Form.Radio
                                                        id="label_show1"
                                                        name="label_show"
                                                        label='Exibir tag'
                                                        value={1}
                                                        checked={values.label_show === '1' ? true : false}
                                                        onChange={e => {
                                                            handleChange(e);
                                                        }}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Radio
                                                        id="label_show2"
                                                        name="label_show"
                                                        label='Ocultar tag'
                                                        value={0}
                                                        checked={values.label_show === '0' ? true : false}
                                                        onChange={e => {
                                                            handleChange(e);
                                                        }}
                                                        onBlur={handleBlur}
                                                    />
                                                </Form.Group>
                                            </Form>
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button
                                                size='small'
                                                onClick={() => setModalTagIsOpen(false)} 
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                size='small' 
                                                color='black'
                                                type="submit" 
                                                onClick={handleSubmit}
                                                disabled={values.bio === project.bio ? true : false}
                                            >
                                                Salvar
                                            </Button>
                                        </Modal.Actions>
                                        </>
                                        )}
                                    </Formik>
                                </Modal>
                            </Segment>
                            <Segment textAlign='left'>
                                <Header as='h4'>
                                    Foto
                                </Header>
                                {project.picture ? (
                                        <Image centered bordered src={'https://ik.imagekit.io/mublin/projects/tr:h-400,w-400,c-maintain_ratio/'+project.id+'/'+project.picture} rounded size='small' />
                                    ) : (
                                        <Image centered bordered src={'https://ik.imagekit.io/mublin/sample-folder/tr:h-400,w-400,c-maintain_ratio/avatar-undefined_-dv9U6dcv3.jpg'} rounded size='small' />
                                )}
                                <Button fluid size='tiny' className='mt-3'>
                                    <Icon name='pencil' /> Alterar
                                </Button>
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
                            <Segment>
                                <Header as='h4'>
                                    Eventos
                                </Header>
                                <List divided relaxed>
                                    <List.Item>
                                        <List.Icon name='calendar outline' size='large' verticalAlign='middle' />
                                        <List.Content>
                                            <List.Header as='a'>Semantic-Org/Semantic-UI</List.Header>
                                            <List.Description as='a'>Updated 10 mins ago</List.Description>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Icon name='calendar outline' size='large' verticalAlign='middle' />
                                        <List.Content>
                                            <List.Header as='a'>Semantic-Org/Semantic-UI-Docs</List.Header>
                                            <List.Description as='a'>Updated 22 mins ago</List.Description>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Icon name='calendar outline' size='large' verticalAlign='middle' />
                                        <List.Content>
                                            <List.Header as='a'>Semantic-Org/Semantic-UI-Meteor</List.Header>
                                            <List.Description as='a'>Updated 34 mins ago</List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column mobile={16} computer={6}>
                            <Segment className='mb-5'>
                                <Header as='h4'>
                                    Estatísticas
                                </Header>
                                <Statistic.Group horizontal size='small'>
                                    <Statistic>
                                        <Statistic.Value>2,204</Statistic.Value>
                                        <Statistic.Label>Views</Statistic.Label>
                                    </Statistic>
                                    <Statistic>
                                        <Statistic.Value>3,322</Statistic.Value>
                                        <Statistic.Label>Downloads</Statistic.Label>
                                    </Statistic>
                                    <Statistic>
                                        <Statistic.Value>22</Statistic.Value>
                                        <Statistic.Label>Tasks</Statistic.Label>
                                    </Statistic>
                                </Statistic.Group>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                </>
            )
        )}
        <FooterMenuMobile />
        </>
    )
}

export default ProjectBackstagePage;