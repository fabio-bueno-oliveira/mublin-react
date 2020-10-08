import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Grid, Segment, Header, Icon, Button, Message, Image, Label, List, Form, Table, Modal, Container, Statistic, Loader as UiLoader, Popup } from 'semantic-ui-react';
import { projectInfos } from '../../../store/actions/project';
import HeaderDesktop from '../../../components/layout/headerDesktop';
import HeaderMobile from '../../../components/layout/headerMobile';
import FooterMenuMobile from '../../../components/layout/footerMenuMobile';
import Spacer from '../../../components/layout/Spacer';
import Loader from 'react-loader-spinner';
import { Formik } from 'formik';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import {IKUpload} from "imagekitio-react";

function ProjectBackstagePage (props) {

    let newProject = (new URLSearchParams(window.location.search)).get("new")

    const user = JSON.parse(localStorage.getItem('user'));

    let history = useHistory();

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(projectInfos.getProjectAdminAccessInfo(props.match.params.username));
        dispatch(projectInfos.getProjectInfo(props.match.params.username));
        dispatch(projectInfos.getProjectMembers(props.match.params.username));
        dispatch(projectInfos.getProjectNotes(props.match.params.username));
    }, []);

    const project = useSelector(state => state.project);
    const members = project.members;

    document.title = 'Backstage ' + project.name + ' | Mublin'

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
        { key: 'violet', text: 'Violeta', value: 'violet', label:{color: 'violet', empty: true, circular: true} },
        { key: 'purple', text: 'Roxo', value: 'purple', label:{color: 'purple', empty: true, circular: true} },
        { key: 'pink', text: 'Pink', value: 'pink', label:{color: 'pink', empty: true, circular: true} },
        { key: 'brown', text: 'Marrom', value: 'brown', label:{color: 'brown', empty: true, circular: true} },
        { key: 'black', text: 'Preto', value: 'black', label:{color: 'black', empty: true, circular: true} }
    ]

    const handleSubmitTag = (label_show, label_text) => {
        setTimeout(() => {
            fetch('https://mublin.herokuapp.com/project/'+project.username+'/updateTag', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify({projectId: project.id, label_show: label_show, label_text: label_text, label_color: 'violet'})
            }).then((response) => {
                dispatch(projectInfos.getProjectInfo(props.match.params.username));
                setModalTagIsOpen(false)
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao atualizar a bio. Tente novamente em instantes")
            })
        }, 400);
    }

    // Modal para cadastro de imagem do projeto
    const [modalNewProjectPictureOpen, setModalNewProjectPictureOpen] = useState(false)
    const [pictureIsLoading, SetPictureIsLoading] = useState(false)
    const [newProjectPicture, setNewProjectPicture] = useState('')

    const userAvatarPath = "/projects/"+project.id+"/"
    const [pictureFilename, setPictureFilename] = useState('')

    const onUploadError = err => {
        alert("Ocorreu um erro ao enviar a imagem. Tente novamente em alguns minutos.");
    };

    const onUploadSuccess = res => {
        let n = res.filePath.lastIndexOf('/');
        let fileName = res.filePath.substring(n + 1);
        updatePicture(user.id,fileName)
        setPictureFilename(fileName)
    };

    // Update project avatar picture filename in bd
    const updatePicture = (userId, value) => {
        SetPictureIsLoading(true)
        let user = JSON.parse(localStorage.getItem('user'));
        fetch('https://mublin.herokuapp.com/project/'+project.id+'/picture', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({userId: userId, picture: value})
        }).then((response) => {
            response.json().then((response) => {
                // console.log(response)
                SetPictureIsLoading(false)
                setNewProjectPicture(response.picture)
                dispatch(projectInfos.getProjectInfo(props.match.params.username));
                setModalNewProjectPictureOpen(false)
            })
          }).catch(err => {
            SetPictureIsLoading(false)
            console.error(err)
        })
    };

    // Modal de confirmação de exclusão de projeto
    const [modalAlertDeleteProjectOpen, setModalAlertDeleteProjectOpen] = useState(false)

    const handleDeleteProject = () => {
        setIsLoading(true)
        fetch('https://mublin.herokuapp.com/projects/'+project.id+'/delete', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            }
        }).then((response) => {
            setIsLoading(false)
            setModalAlertDeleteProjectOpen(false)
            history.push('/backstage')
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao deletar o projeto, ou talvez você não tenha permissão.")
        })
    }

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
        { (!project.requesting && project.confirmed !== 1 ) ? (
            <Container className='mt-5 pt-5'>
                { project.confirmed === 2 ? (
                    <Message
                        warning
                        icon='clock outline'
                        header='Aguardando'
                        content='Aguardando aprovação'
                    />
                ) : (
                    <Message
                        error
                        icon='frown outline'
                        header='Solicitação recusada'
                        content='Sua solicitação foi recusada'
                    />
                )}
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
                            <span style={{fontSize:'12px'}}><Icon name='warehouse' /> Backstage</span>
                            <Header as='h3' style={{marginTop:'5px',marginBottom:'0px'}}>
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
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row stretched>
                        <Grid.Column mobile={16} computer={4}>
                            <Button fluid size='small' onClick={() => history.push('/project/'+project.username)}>Ir para a página do projeto</Button>
                            <Segment textAlign='left'>
                                <Header as='h4'>
                                    Quadro de avisos
                                </Header>
                                {project.notes[0].id ? (
                                    project.notes.map((note, key) =>
                                        <Segment inverted basic style={{fontSize:'12px'}} key={key}>
                                            {note.note}
                                            <div className='mt-2'>
                                                { note.authorPicture ? (
                                                    <Image as='a' href={'/'+note.authorUsername} src={note.authorPicture} avatar />
                                                ) : (
                                                    <Image src='https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_Kblh5CBKPp.jpg' avatar />
                                                )}
                                                <span style={{opacity:'0.7'}}>{note.authorName+' '+note.authorLastname} há {formatDistance(new Date(note.created * 1000), new Date(), {locale:pt})}</span>
                                            </div>
                                        </Segment>
                                    )
                                ) : (
                                    <p>Nenhum aviso cadastrado no momento</p>
                                )}
                            </Segment>
                            <Segment>
                                <Header as='h4'>
                                    Estatísticas
                                </Header>
                                <Statistic.Group horizontal size='mini'>
                                    <Statistic>
                                        <Statistic.Value>2,204</Statistic.Value>
                                        <Statistic.Label>eventos</Statistic.Label>
                                    </Statistic>
                                    <Statistic>
                                        <Statistic.Value>R$ 1.950,00</Statistic.Value>
                                        <Statistic.Label>faturado</Statistic.Label>
                                    </Statistic>
                                </Statistic.Group>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column mobile={16} computer={8}>
                            <Segment>
                                <div className='cardTitle'>
                                    <Header as='h4'>
                                        <Header.Content>
                                            Membros
                                            <Header.Subheader>{members.length} relacionados</Header.Subheader>
                                        </Header.Content>
                                    </Header>
                                    <Label size='small' content='Convidar novo' icon='user plus' className='cpointer' />
                                </div>
                                <Table columns={3} unstackable size='small' compact='very'>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell width={14}>Nome</Table.HeaderCell>
                                            <Table.HeaderCell width={2}></Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {members.map((member, key) =>
                                            <Table.Row key={key}>
                                                <Table.Cell>
                                                    { member.picture ? (
                                                        <Image src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-200,w-200,c-maintain_ratio/'+member.id+'/'+member.picture} avatar />
                                                    ) : (
                                                        <Image src='https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' avatar />
                                                    )}
                                                    {member.confirmed === 1 ? ( 
                                                        <>
                                                            <span style={{fontWeight:'500'}} className='mr-2'>{member.name} {member.lastname}</span>
                                                            {!!member.admin && 
                                                                <Popup 
                                                                    trigger={<Icon name='key' />}
                                                                    content='Administrador'
                                                                    inverted
                                                                    size='mini'
                                                                />
                                                            }<br/>
                                                            <span style={{fontSize:'11px'}}>{member.role1}{member.role2 && ', '+member.role2}{member.role3 && ', '+member.role3}</span><br/>
                                                            <span style={{fontSize:'10px'}}>
                                                                <Icon name={member.statusIcon} /> {member.statusName}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                        <span style={{fontSize:'11px', fontWeight:'500'}}>{member.name+' '+member.lastname}</span>
                                                        <div className='mt-1'>
                                                            <span style={{fontSize:'11px', fontWeight:'500'}}>solicitou participação como {member.role1}{member.role2 && ', '+member.role2}{member.role3 && ', '+member.role3}<br/>({member.statusName}{member.joinedIn && ', de '+member.joinedIn+' a '}{member.leftIn ? member.leftIn : 'atualmente'})</span>
                                                        </div>
                                                        </>
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell textAlign='right'>
                                                    {member.confirmed === 1 ? ( 
                                                        <Button size='mini' icon='cog' />
                                                    ) :(
                                                        <Button.Group size='mini'>
                                                            <Button positive className='pr-2'><Icon name='thumbs up outline' /></Button>
                                                            <Button negative className='pr-2'><Icon name='thumbs down outline' /></Button>
                                                        </Button.Group>
                                                    )}
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table>
                            </Segment>
                            <Segment>
                                <Header as='h4'>
                                    Eventos
                                </Header>
                                <List divided relaxed>
                                    <List.Item>
                                        <List.Icon name='calendar outline' size='large' verticalAlign='middle' />
                                        <List.Content>
                                            <List.Header as='a'>Nome do Evento</List.Header>
                                            <List.Description as='a'>06/10/2020</List.Description>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Icon name='calendar outline' size='large' verticalAlign='middle' />
                                        <List.Content>
                                            <List.Header as='a'>Nome do Evento</List.Header>
                                            <List.Description as='a'>06/10/2020</List.Description>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Icon name='calendar outline' size='large' verticalAlign='middle' />
                                        <List.Content>
                                            <List.Header as='a'>Nome do Evento</List.Header>
                                            <List.Description as='a'>06/10/2020</List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column mobile={16} computer={4}>
                            <Segment.Group>
                                <Segment>
                                    <Header as='h4'>
                                        <Header.Content>Funções administrativas</Header.Content>
                                    </Header>
                                </Segment>
                                { project.adminAccess === 1 ? (
                                    <>
                                    <Segment textAlign='left'>
                                        <Header as='h4'>
                                            Foto
                                        </Header>
                                        {project.picture ? (
                                                <Image centered bordered src={'https://ik.imagekit.io/mublin/projects/tr:h-400,w-400,c-maintain_ratio/'+project.id+'/'+project.picture} rounded size='small' />
                                            ) : (
                                                <Image centered bordered src={'https://ik.imagekit.io/mublin/sample-folder/tr:h-400,w-400,c-maintain_ratio/avatar-undefined_-dv9U6dcv3.jpg'} rounded size='small' />
                                        )}
                                        <Button fluid size='tiny' className='mt-3' onClick={() => setModalNewProjectPictureOpen(true)}>
                                            <Icon name='pencil' /> Alterar
                                        </Button>
                                        <Modal
                                            id="newProjectPicture"
                                            size='mini'
                                            onClose={() => setModalNewProjectPictureOpen(false)}
                                            onOpen={() => setModalNewProjectPictureOpen(true)}
                                            open={modalNewProjectPictureOpen}
                                            closeIcon
                                        >
                                            <Modal.Header>Alterar foto de {project.name}</Modal.Header>
                                            <Modal.Content>
                                                { !project.picture ? (
                                                    <>
                                                        {/* <Image centered rounded src='https://ik.imagekit.io/mublin/tr:h-200,w-200/sample-folder/avatar-undefined_-dv9U6dcv3.jpg' size='small' className="mb-3" /> */}
                                                    </>
                                                ) : (
                                                    <Image centered rounded src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/projects/'+project.id+'/'+project.picture} size='small' className="mb-4" />
                                                )}
                                                <div className="customFileUpload">
                                                    <IKUpload 
                                                        fileName="avatar.jpg"
                                                        folder={userAvatarPath}
                                                        tags={["avatar"]}
                                                        useUniqueFileName={true}
                                                        isPrivateFile= {false}
                                                        onError={onUploadError}
                                                        onSuccess={onUploadSuccess}
                                                    />
                                                </div>
                                                { pictureIsLoading &&
                                                    <UiLoader active inline='centered' />
                                                }
                                            </Modal.Content>
                                        </Modal>
                                    </Segment>
                                    <Segment>
                                        <Header as='h4'>Bio</Header>
                                        <p>{project.bio ? project.bio : 'Este projeto não possui descrição'}</p>
                                        <Button 
                                            fluid 
                                            size='tiny' 
                                            className='mt-3' 
                                            onClick={() => setModalBioIsOpen(true)}
                                        >
                                            <Icon name='pencil' /> Alterar
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
                                                        { values.bio && 
                                                            <Label size='tiny' content={values.bio.length+'/200'} color={values.bio.length  > 199 ? 'red' : ''} />
                                                        }
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
                                    <Segment>
                                        <Header as='h4'>Tag</Header>
                                        { project.labelText ? (
                                            <>
                                                <Label tag color={project.labelColor} size='tiny' style={{fontWeight:'500'}} className='mr-2'>
                                                    {project.labelText}
                                                </Label>
                                                { project.labelShow ? (
                                                    <><Icon name='eye' /><span>Visível</span></>
                                                ) : (
                                                    <><Icon name='eye slash' /><span>Oculta</span></>
                                                )}
                                            </>
                                        ) : (
                                            <p>Nenhuma tag definida</p>
                                        )}
                                        <Button 
                                            fluid 
                                            size='tiny' 
                                            className='mt-3' 
                                            onClick={() => setModalTagIsOpen(true)}
                                        >
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
                                                    label_text: project.labelText
                                                }}
                                                validate={false}
                                                validateOnMount={true}
                                                validateOnBlur={true}
                                                onSubmit={(values, { setSubmitting }) => {
                                                    // alert(JSON.stringify(values, null, 2))
                                                    setTimeout(() => {
                                                        setSubmitting(false);
                                                        handleSubmitTag(values.label_show, values.label_text)
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
                                                        { values.label_text && 
                                                            <Label size='tiny' content={values.label_text.length+'/30'} color={values.label_text.length  > 29 ? 'red' : ''} />
                                                        }
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
                                    <Segment>
                                        <Header as='h4'>Encerrar projeto</Header>
                                        <Button 
                                            fluid 
                                            negative
                                            size='tiny' 
                                            className='mt-3' 
                                            onClick={() => setModalAlertDeleteProjectOpen(true)}
                                        >
                                            <Icon name='pencil' /> Deletar página
                                        </Button>
                                        <Modal
                                            basic
                                            onClose={() => setModalAlertDeleteProjectOpen(false)}
                                            onOpen={() => setModalAlertDeleteProjectOpen(true)}
                                            open={modalAlertDeleteProjectOpen}
                                            size='mini'
                                        >
                                            <Header icon>
                                                <Icon name='exclamation triangle' />
                                                Deletar este projeto?
                                            </Header>
                                            <Modal.Content>
                                                <p>Esta ação não poderá ser desfeita. Você perderá todos os dados do projeto, além de imagens e eventos relacionados. O projeto irá desaparecer pra você e para os demais membros.</p>
                                            </Modal.Content>
                                            <Modal.Actions>
                                                <Button basic color='red' inverted 
                                                    onClick={() => setModalAlertDeleteProjectOpen(false)}
                                                    loading={isLoading}
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button color='red' inverted 
                                                    onClick={() => handleDeleteProject()}
                                                    loading={isLoading}
                                                >
                                                    Deletar
                                                </Button>
                                            </Modal.Actions>
                                        </Modal>
                                    </Segment>
                                    </>
                                ) : (
                                    <Segment>
                                        Você não tem acesso às funções administrativas
                                    </Segment>
                                )}
                            </Segment.Group>
                            <Spacer compact />
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