import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { miscInfos } from '../../../store/actions/misc';
import { Grid, Segment, Header, Icon, Button, Message, Image, Label, Form, Table, Modal, Container, Loader as UiLoader, Select } from 'semantic-ui-react';
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
import './styles.scss'

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
        dispatch(projectInfos.getProjectEvents(props.match.params.username));
        dispatch(miscInfos.getRoles());
    }, []);

    const project = useSelector(state => state.project);
    const members = project.members;
    const membersAdmin = members.filter((member) => { return member.admin === 1 })
    const roles = useSelector(state => state.roles);

    document.title = 'Backstage ' + project.name + ' | Mublin'

    const [isLoading, setIsLoading] = useState(false)

    // current timedate
    var today = new Date();
    var currentTime_year = today.getFullYear();
    var currentTime_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var currentTime_time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var currentTimeDate = currentTime_date+' '+currentTime_time;

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

    const userAvatarPath = "/projects/"
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

    // Modal de gerenciamento de membro do projeto
    const [modalMemberManagement, setModalMemberManagementOpen] = useState(false)
    const [modalMemberManagementUserId, setModalMemberManagementUserId] = useState(null)

    const memberInfo = members.filter((member) => { return member.id === modalMemberManagementUserId })

    const [manageUserId, setManageUserId] = useState('')
    const [manageUserAdmin, setManageUserAdmin] = useState('')
    const [manageUserActive, setManageUserActive] = useState('')
    const [manageUserLeader, setManageUserLeader] = useState('')

    const openModalMemberManagement = (userId, admin, active, leader) => {
        setManageUserId(userId)
        setManageUserAdmin(admin)
        setManageUserActive(active)
        setManageUserLeader(leader)
        setModalMemberManagementUserId(userId)
        setModalMemberManagementOpen(true)
    }

    const updateMemberSettings = (memberId) => {
        setIsLoading(true)
        fetch('https://mublin.herokuapp.com/project/'+project.id+'/updateMemberDetails', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({userId: memberId, projectId: project.id, admin: manageUserAdmin, active: manageUserActive, leader: manageUserLeader})
        }).then((response) => {
            response.json().then((response) => {
                dispatch(projectInfos.getProjectMembers(props.match.params.username))
                setIsLoading(false)
                setModalMemberManagementOpen(false)
            })
        }).catch(err => {
                setIsLoading(false)
                console.error(err)
                alert('Ocorreu um erro ao tentar alterar os detalhes do integrante. Tente novamente em instantes')
                setModalMemberManagementOpen(false)
            })
    }

    const updateMemberRequest = (memberId, responseToRequest) => {
        setIsLoading(true)
        fetch('https://mublin.herokuapp.com/project/'+project.id+'/updateMemberRequest', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({userId: memberId, requestResponse: responseToRequest})
        }).then((response) => {
            response.json().then((response) => {
                dispatch(projectInfos.getProjectMembers(props.match.params.username))
                setIsLoading(false)
            })
        }).catch(err => {
                setIsLoading(false)
                console.error(err)
                alert('Ocorreu um erro ao tentar responder a solicitação do integrante. Tente novamente em instantes')
            })
    }

    const data = [
        {
            Mês: 'Jul', Públicos: 0, Privados: 2,
        },
        {
            Mês: 'Ago', Públicos: 0, Privados: 4,
        },
        {
            Mês: 'Set', Públicos: 4, Privados: 2,
        },
        {
            Mês: 'Out', Públicos: 6, Privados: 14,
        }
    ];

    const projectAge = currentTime_year - project.foundationYear

    // Create New Opportunity
    const [openModalNewOpportunity, setOpenModalNewOpportunity] = useState(false)
    const [newOpportunityExperience ,setNewOpportunityExperience] = useState('2')

    const rolesList = roles.list.filter((role) => { return role.id !== 30 && role.id !== 29 && role.id !== 31 }).map(role => ({ 
        text: role.description,
        value: role.id,
        key: role.id
    }));

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
        { (!project.requesting && project.confirmed !== 1 ) ? (
            <>
            <Spacer />
            <Container>
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
            </>
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
                <Spacer />
                <Grid stackable centered verticalAlign='middle' columns={1} verticalAlign='top' className="container mb-2">
                    <Grid.Row>
                        <Grid.Column mobile={16} computer={16}>
                            { newProject === 'true' &&
                                <Message color='green' size='tiny'>
                                    <Message.Header>{project.name} criado com sucesso!</Message.Header>
                                </Message>
                            }
                            <p><span style={{fontSize:'12px'}}><Icon name='warehouse' /> Backstage / </span> <Link as='a' to={{ pathname: '/project/'+project.username }} style={{fontSize:'12px'}}>Ir para a página do projeto</Link></p>
                            <Header as='h3' style={{marginTop:'5px',marginBottom:'0px'}}>
                                {project.picture ? (
                                    <Image src={'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'+project.picture} rounded />
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
                            <Segment.Group>
                                {/* <Segment>
                                    <Header as='h4'>
                                        <Header.Content>Funções administrativas</Header.Content>
                                    </Header>
                                </Segment> */}
                                <Segment textAlign='left'>
                                    <Header as='h4'>
                                        Foto
                                    </Header>
                                    {project.picture ? (
                                            <Image centered bordered src={'https://ik.imagekit.io/mublin/projects/tr:h-400,w-400,c-maintain_ratio/'+project.picture} rounded size='small' />
                                        ) : (
                                            <Image centered bordered src={'https://ik.imagekit.io/mublin/sample-folder/tr:h-400,w-400,c-maintain_ratio/avatar-undefined_-dv9U6dcv3.jpg'} rounded size='small' />
                                    )}
                                    <Button fluid size='tiny' className='mt-3' onClick={() => setModalNewProjectPictureOpen(true)} disabled={project.adminAccess === 1 ? false : true}>
                                        <Icon name={project.adminAccess === 1 ? 'pencil' : 'lock'}/> Alterar
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
                                                <Image centered rounded src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/projects/'+project.picture} size='small' className="mb-4" />
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
                                        disabled={project.adminAccess === 1 ? false : true}
                                    >
                                        <Icon name={project.adminAccess === 1 ? 'pencil' : 'lock'}/> Alterar
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
                                    <Header as='h4'>Tempo em atividade</Header>
                                    { !project.endDate ? (
                                        <p>{project.foundationYear} - atualmente {projectAge > 0 && '('+projectAge}{projectAge === 1 ? ' ano)' : ' anos)'}</p>
                                    ) : (
                                        <p>{project.foundationYear} - {project.endDate} {projectAge > 0 && '('+projectAge+' anos)'}</p>
                                    )}
                                    <Button 
                                        fluid 
                                        size='tiny' 
                                        className='mt-3' 
                                        onClick={() => setModalBioIsOpen(true)}
                                        disabled={project.adminAccess === 1 ? false : true}
                                    >
                                        <Icon name={project.adminAccess === 1 ? 'pencil' : 'lock'}/> Alterar
                                    </Button>
                                </Segment>
                                <Segment>
                                    <Header as='h4'>Tag</Header>
                                    { project.labelText ? (
                                        <>
                                            <Label tag color={project.labelColor} size='tiny' style={{fontWeight:'500'}} className='mr-2'>
                                                {project.labelText}
                                            </Label>
                                            { project.labelShow ? (
                                                <Icon name='eye' title='Visível' />
                                            ) : (
                                                <Icon name='eye slash' title='Oculta' />
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
                                        disabled={project.adminAccess === 1 ? false : true}
                                    >
                                        <Icon name={project.adminAccess === 1 ? 'pencil' : 'lock'}/> Alterar
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
                                    <Header as='h4'>Encerrar projeto no Mublin</Header>
                                    <Button 
                                        fluid 
                                        negative
                                        size='tiny' 
                                        className='mt-3' 
                                        onClick={() => setModalAlertDeleteProjectOpen(true)}
                                        disabled={project.adminAccess === 1 ? false : true}
                                    >
                                        <Icon name={project.adminAccess === 1 ? 'trash alternate outline' : 'lock'} /> Deletar página
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
                            </Segment.Group>
                            <Spacer compact />
                        </Grid.Column>
                        <Grid.Column mobile={16} computer={8}>
                            <Segment>
                                <div className='cardTitle'>
                                    <Header as='h4'>
                                        <Header.Content>
                                            Integrantes
                                            <Header.Subheader>{members.length} relacionados</Header.Subheader>
                                        </Header.Content>
                                    </Header>
                                    <Button.Group size='mini'>
                                        <Button><Icon name='user plus' />Convidar</Button>
                                        <Button onClick={() => setOpenModalNewOpportunity(true)}><Icon name='bullhorn' />Abrir vaga</Button>
                                    </Button.Group>
                                </div>
                                <Table columns={3} unstackable compact='very' basic='very'>
                                    {/* <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell width={14}>Nome</Table.HeaderCell>
                                            <Table.HeaderCell width={2}></Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header> */}
                                    <Table.Body>
                                        {members.map((member, key) =>
                                            <Table.Row key={key}>
                                                <Table.Cell width={14}>
                                                    { member.picture ? (
                                                        <Image src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-200,w-200,c-maintain_ratio/'+member.id+'/'+member.picture} avatar onClick={() => history.push('/'+member.username)} style={{cursor:'pointer'}} />
                                                    ) : (
                                                        <Image src='https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' avatar onClick={() => history.push('/'+member.username)} style={{cursor:'pointer'}} />
                                                    )}
                                                    {member.confirmed === 1 ? ( 
                                                        <>
                                                            <span style={{fontWeight:'500'}} className='mr-1'>{member.name} {member.lastname} {!!member.admin && '(Administrador)'}</span>
                                                            <div style={{fontSize:'12px'}}>{member.role1}{member.role2 && ', '+member.role2}{member.role3 && ', '+member.role3}</div>
                                                            <span style={{fontSize:'11px'}}>
                                                                {member.statusId === 1 ? 'Membro oficial · ' : 'Convidado/Sideman · '}
                                                                {(member.joinedIn && (member.joinedIn !== member.leftIn)) ? ( 
                                                                    <>
                                                                        {member.joinedIn +' até '}{member.leftIn ? member.leftIn : 'atualmente'}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {member.joinedIn}
                                                                    </>
                                                                )}
                                                            </span>
                                                            {member.active ? (
                                                                <div style={{fontSize:'11px'}}>
                                                                    <Icon color='green' name='power' />Ativo no projeto atualmente
                                                                </div>
                                                            ) : (
                                                                <div style={{fontSize:'12px'}}>
                                                                    <Icon color='grey' name='power' />Inativo no projeto atualmente
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span style={{fontWeight:'500'}}>{member.name+' '+member.lastname}</span>
                                                            <div className='mt-1'>
                                                                <span style={{fontSize:'11px', fontWeight:'500'}}>solicitou participação como {member.role1}{member.role2 && ', '+member.role2}{member.role3 && ', '+member.role3}<br/>({member.statusName}{member.statusId === 2 && '/sideman'}{member.joinedIn && ', de '+member.joinedIn+' até '}{member.leftIn ? member.leftIn : 'atualmente'})</span>
                                                                <div>
                                                                    <Button.Group size='mini' className='mt-1'>
                                                                        <Button positive disabled={!project.adminAccess ? true : false} onClick={() => updateMemberRequest(member.id, 1)} loading={isLoading}>Aceitar</Button>
                                                                        <Button negative disabled={!project.adminAccess ? true : false} onClick={() => updateMemberRequest(member.id, 0)} loading={isLoading}>Recusar</Button>
                                                                    </Button.Group>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell width={2} textAlign='right'>
                                                    {member.confirmed === 1 && 
                                                        <Button size='mini' icon='cog' onClick={() => openModalMemberManagement(member.id, member.admin, member.active, member.leader)} />
                                                    }
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table>
                                <Modal
                                    size='mini'
                                    open={modalMemberManagement}
                                    onClose={() => setModalMemberManagementOpen()}
                                >
                                    <Modal.Header>Gerenciar membro do projeto</Modal.Header>
                                    <Modal.Content>
                                        { memberInfo.map((memberToManage, key) => 
                                        <>
                                            <p style={{fontSize:'11px'}} className='mb-4'>Apenas administradores podem editar estas opções</p>
                                            <div className='mb-4'>
                                                { memberToManage.picture ? (
                                                    <Image src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-200,w-200,c-maintain_ratio/'+memberToManage.id+'/'+memberToManage.picture} avatar />
                                                ) : (
                                                    <Image src='https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' avatar />
                                                )}
                                                <span>{memberToManage.name+' '+memberToManage.lastname} {!!memberToManage.admin && '(Administrador)'}</span>
                                            </div>
                                            <Form>
                                                <Form.Field 
                                                    label='Administrador' 
                                                    control='select' 
                                                    disabled={(!project.adminAccess ? true : false || (membersAdmin.length < 2 && memberToManage.id === user.id))}
                                                    onChange={(e) => setManageUserAdmin(e.target.options[e.target.selectedIndex].value)}
                                                    value={manageUserAdmin}
                                                >
                                                    <option value='1' selected={memberToManage.admin ? true : false}>Sim</option>
                                                    <option value='0' selected={!memberToManage.admin ? true : false}>Não</option>
                                                </Form.Field>
                                                { !!(membersAdmin.length === 1 && project.adminAccess && user.id === memberToManage.id) && 
                                                    <p style={{fontSize:'11px'}}>É necessário ao menos um administrador por projeto</p>
                                                }
                                                <Form.Field 
                                                    label='Ativo no projeto atualmente' 
                                                    control='select' 
                                                    disabled={!project.adminAccess ? true : false}
                                                    onChange={(e) => setManageUserActive(e.target.options[e.target.selectedIndex].value)}
                                                    value={manageUserActive}
                                                >
                                                    <option value='1' selected={memberToManage.active ? true : false}>Sim</option>
                                                    <option value='0' selected={!memberToManage.active ? true : false}>Ñão</option>
                                                </Form.Field>
                                                <Form.Field 
                                                    label='Líder' 
                                                    control='select' 
                                                    disabled={!project.adminAccess ? true : false}
                                                    onChange={(e) => setManageUserLeader(e.target.options[e.target.selectedIndex].value)}
                                                    value={manageUserLeader}
                                                >
                                                    <option value='1'>Sim</option>
                                                    <option value='0'>Ñão</option>
                                                </Form.Field>
                                            </Form>
                                            <Button secondary fluid size='small' className='mt-4' onClick={() => updateMemberSettings(memberToManage.id)} disabled={project.adminAccess ? false : true} loading={isLoading}>
                                                Salvar
                                            </Button>
                                            <Button fluid className='mt-2' size='small' onClick={() => setModalMemberManagementOpen(false)}>
                                                Voltar
                                            </Button>
                                            { (memberToManage.id === user.id) && 
                                                <Button fluid basic size='small' color='red' className='mt-2' disabled={(membersAdmin.length === 1 && project.adminAccess) ? true : false}>
                                                    Sair deste projeto (me desassociar)
                                                </Button>
                                            }
                                            { !!(membersAdmin.length === 1 && project.adminAccess && memberToManage.id === user.id) && 
                                                <p style={{fontSize:'11px'}} className='mt-2'>É necessário que outro usuário seja administrador para que você possa se desassociar deste projeto</p>
                                            }
                                            { memberToManage.id !== user.id && 
                                                <Button fluid basic size='small' color='red' className='mt-2' disabled={project.adminAccess ? false : true}>
                                                    Desassociar este integrante
                                                </Button>
                                            }
                                        </>
                                        )}
                                    </Modal.Content>
                                </Modal>
                            </Segment>
                            <Segment>
                                <Header as='h4'>
                                    Eventos
                                </Header>
                                { project.events[0].id ? (
                                    project.active === 1 ? ( 
                                        <Table singleLine size unstackable compact='very' basic='very'>
                                            <Table.Body>
                                                {project.events.map((event, key) =>
                                                    <Table.Row key={key}>
                                                        <Table.Cell collapsing>
                                                            {event.dateOpening}<br/>
                                                            <span style={{fontSize:'12px'}}>{event.eventHourStart}</span><br/>
                                                            <span style={{fontSize:'11px',opacity:'0.8'}}>{event.method}</span>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <div className='eventTitle'>{event.title}</div>
                                                            <div className='eventDescription'>
                                                                {event.type+' · '+event.city+'/'+event.region} {(event.placeName && event.method === 'Presencial') && <><Icon name='map pin' />{event.placeName}</>}
                                                            </div>
                                                            <div>
                                                                <Image src={event.authorPicture} avatar style={{width:'16px',height:'16px',cursor:'pointer'}} onClick={() => history.push('/'+event.authorUsername)} />
                                                                <span style={{fontSize:'11px',opacity:'0.8'}}>criado por {event.authorName}</span>
                                                            </div>
                                                        </Table.Cell>
                                                        <Table.Cell collapsing>
                                                            <Button size='mini' basic>Detalhes</Button>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                )}
                                            </Table.Body>
                                        </Table>
                                    ) : (
                                        <p>Apenas usuários ativos no projeto podem visualizar eventos detalhados</p>
                                    )
                                ) : (
                                    <p>Nenhum evento cadastrado para este projeto</p>
                                )}
                            </Segment>
                        </Grid.Column>
                        <Grid.Column mobile={16} computer={4}>
                            <Segment textAlign='left'>
                                <Header as='h4'>
                                    Turnê atual
                                </Header>
                                <p>Nenhuma</p>
                            </Segment>
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
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Modal
                    size='mini'
                    onClose={() => setOpenModalNewOpportunity(false)}
                    onOpen={() => setOpenModalNewOpportunity(true)}
                    open={openModalNewOpportunity}
                >
                    <Modal.Header>Abrir vaga</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field
                                id="role"
                                name="role"
                                control={Select}
                                label="Função"
                                options={rolesList}
                                placeholder="Selecione ou digite"
                                // onChange={(e, { value }) => addRole(value)}
                                search
                            />
                            <div className='mb-3'>
                                {
                                    {
                                        1: <div>Nível de experiência: Iniciante</div>,
                                        2: <div>Nível de experiência: Intermediário</div>,
                                        3: <div>Nível de experiência: Avançado (experiente)</div>
                                    }[newOpportunityExperience]
                                }
                                <input
                                    type='range'
                                    min={1}
                                    max={3}
                                    value={newOpportunityExperience}
                                    onChange={(e) => setNewOpportunityExperience(e.target.value)}
                                />
                            </div>
                            <Form.TextArea 
                                label='Informações' 
                                maxLength='200' 
                            />
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button  
                            onClick={() => setOpenModalNewOpportunity(false)}
                            loading={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button secondary 
                            onClick={() => setOpenModalNewOpportunity(false)}
                            loading={isLoading}
                        >
                            Enviar
                        </Button>
                    </Modal.Actions>
                </Modal>
                </>
            )
        )}
        <FooterMenuMobile />
        </>
    )
}

export default ProjectBackstagePage;