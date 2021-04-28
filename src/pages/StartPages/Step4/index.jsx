import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import {IKUpload} from "imagekitio-react";
import { usernameCheckInfos } from '../../../store/actions/usernameCheck';
import { userInfos } from '../../../store/actions/user';
import { miscInfos } from '../../../store/actions/misc';
import { searchInfos } from '../../../store/actions/search';
import { useHistory, Link } from 'react-router-dom';
import { Dimmer, Loader as UiLoader, Search, Modal, Progress, Button, Header, Grid, Image, Segment, Form, Message, Radio, Select, Label, Icon, Input } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';
import '../styles.scss';

function StartStep3Page () {

    let history = useHistory();

    document.title = "Passo 4 de 4";

    const dispatch = useDispatch();

    let user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => { 
        dispatch(userInfos.getUserProjects(user.id));
        dispatch(miscInfos.getRoles());
    }, [user.id, dispatch]);

    const [checkUsername] = useDebouncedCallback((string) => {
            if (string.length) {
                dispatch(usernameCheckInfos.checkProjectUsernameByString(string))
            }
        },1000
    );

    const projectUsernameAvailability = useSelector(state => state.projectUsernameCheck);

    const currentYear = new Date().getFullYear()
    const userInfo = useSelector(state => state.user);
    const searchProject = useSelector(state => state.searchProject);
    const roles = useSelector(state => state.roles);

    const rolesList = roles.list.filter((role) => { return role.id !== 29 && role.id !== 30 && role.id !== 31 }).map(role => ({ 
        text: role.description,
        value: role.id,
        key: role.id
    }));

    const userProjects = userInfo.projects.map((project, key) =>
        <Label color='blue' size='large' key={key} className="mb-2 mr-2" style={{ fontWeight: 'normal' }} image>
            {project.picture ? (
                <img src={'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'+project.picture} />
            ) : (
                <img src={'https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_-dv9U6dcv3.jpg'} />
            )}
            {project.role1+" em "+project.name}
            <Icon name='delete' onClick={() => deleteProject(project.id)} />
        </Label>
    );

    const [isLoading, setIsLoading] = useState(false);

    const [query, setQuery] = useState('')
    const [lastQuery, setLastQuery] = useState('')

    // modal participação
    const [modalOpen, setModalOpen] = useState(false)
    const [modalProjectInfo, setModalProjectInfo] = useState('')
    const [modalProjectTitle, setModalProjectTitle] = useState('')
    const [modalProjectImage, setModalProjectImage] = useState('')
    const [modalProjectFoundationYear, setModalFoundationYear] = useState('')
    const [modalProjectEndYear, setModalEndYear] = useState('')

    // campos do form para relacionar usuário a um projeto
    const [projectId, setProjectId] = useState('')
    const [active, setActive] = useState('1')
    const [checkbox, setCheckbox] = useState(true)
    const [status, setStatus] = useState('1')
    const [main_role_fk, setMain_role_fk] = useState('')
    const [joined_in, setJoined_in] = useState('')
    const [left_in, setLeft_in] = useState(null)
    const [portfolio, setPortfolio] = useState('0')

    const handleCheckbox = (x) => {
        setCheckbox(value => !value)
        setLeft_in('')
        if (x) {
            setActive('0')
        } else {
            setActive('1')
        }
    }

    // modal de novo projeto
    const [modalNewProjectOpen, setModalNewProjectOpen] = useState(false)

    // campos do form de cadastro de projeto
    const [projectName, setProjectName] = useState('')
    const [projectUserName, setProjectUserName] = useState('')
    const [foundation_year, setFoundationYear] = useState(currentYear)
    const [checkboxProjectActive, setCheckboxProjectActive] = useState(true)
    const [end_year, setEndYear] = useState(null)
    const [bio, setBio] = useState('')
    const [type, setType] = useState('2')
    const [kind, setKind] = useState('1')
    const [npMain_role_fk, setNpMain_role_fk] = useState('')
    const [publicProject, setPublicProject] = useState('1')
    const [portfolioNewProject, setPortfolioNewProject] = useState('0')
    const [userStatus, setUserStatus] = useState('1')
    const [idNewProject, setIdNewProject] = useState('')

    const handleChangeProjectUserName = (value) => {
        setProjectUserName(value.replace(/[^A-Z0-9]/ig, "").toLowerCase())
    }

    const handleTypeChange = (value) => {
        setType(value)
        if (value === 7) {
            setUserStatus('3')
        } else {
            setUserStatus('1')
        }
    }

    const handleCheckboxProjectActive = (x) => {
        setCheckboxProjectActive(value => !value)
        if (x) {
            setEndYear(foundation_year)
        } else {
            setEndYear('')
        }
    }

    // Modal para cadastro de imagem do projeto cadastrado
    const [modalNewProjectPictureOpen, setModalNewProjectPictureOpen] = useState(false)
    const [pictureIsLoading, SetPictureIsLoading] = useState(false)
    const [newProjectPicture, setNewProjectPicture] = useState('')
 
    const handleSearchChange = (e) => {
        setQuery(e)
        if (e.length > 1 && query !== lastQuery) {
            setTimeout(() => {
                dispatch(searchInfos.getSearchProjectResults(e))
            }, 700)
            setLastQuery(e)
        }
    }

    const handleResultSelect = (e, { result }) => {
        setProjectId(result.price)
        setModalProjectInfo(result.description)
        setModalProjectTitle(result.title)
        setModalFoundationYear(result.foundation_year)
        setJoined_in(result.foundation_year)
        setModalEndYear(result.end_year)
        setModalProjectImage(result.image)
        setModalOpen(true)
    }

    const deleteProject = (userProjectParticipationId) => {
        setIsLoading(true)
        fetch('https://mublin.herokuapp.com/user/delete/project', {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({userId: user.id, userProjectParticipationId: userProjectParticipationId})
        }).then((response) => {
            //console.log(response);
            dispatch(userInfos.getUserProjects(user.id))
            setIsLoading(false)
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao remover o seu projeto. Tente novamente em alguns minutos.")
        })
    }

    const handleSubmitParticipation = () => {
        setIsLoading(true)
        fetch('https://mublin.herokuapp.com/user/add/project', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({ userId: user.id, projectId: projectId, active: active, status: status, main_role_fk: main_role_fk, joined_in: joined_in, left_in: left_in, leader: '0', confirmed: '2', admin: '0', portfolio: portfolio })
        }).then((response) => {
            //console.log(153, response)
            dispatch(userInfos.getUserProjects(user.id))
            setIsLoading(false)
            setModalOpen(false)
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao criar o projeto. Tente novamente em alguns minutos.")
            setModalOpen(false)
        })
    }

    const handleSubmitNewProject = () => {
        // setIsLoading(true)
        fetch('https://mublin.herokuapp.com/project/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({ id_user_creator_fk: user.id, projectName: projectName, projectUserName: projectUserName, foundation_year: foundation_year, end_year: end_year, bio: bio, type: type, kind: kind, public: publicProject })
        })
        .then(response => {
            return response.json();
        }).then(jsonResponse => {
            // console.log(191, jsonResponse)
            setIdNewProject(jsonResponse.id)
            handleSubmitParticipationToNewProject(user.id, jsonResponse.id, userStatus, npMain_role_fk)
        }).catch (error => {
            console.error(error)
            alert("Ocorreu um erro ao ingressar no projeto. Tente novamente em alguns minutos.")
            setModalNewProjectOpen(false)
        })
    }

    const handleSubmitParticipationToNewProject = (newProjectUserId, newProjectProjectId, newProjectUserStatus, newProjectMain_role_fk) => {
        setIsLoading(true)
        fetch('https://mublin.herokuapp.com/user/add/project', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({ userId: newProjectUserId, projectId: newProjectProjectId, active: '1', status: newProjectUserStatus, main_role_fk: newProjectMain_role_fk, joined_in: currentYear, left_in: null, leader: '1', confirmed: '1', admin: '1', portfolio: portfolioNewProject })
        }).then((response) => {
            // console.log(214, response)
            dispatch(userInfos.getUserProjects(user.id))
            setIsLoading(false)
            setModalNewProjectOpen(false)
            setModalNewProjectPictureOpen(true)
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao te relacionar ao projeto criado. Use a busca para ingressar no projeto criado.")
            setModalNewProjectOpen(false)
        })
    }

    // Update project avatar picture filename in bd
    const updatePicture = (projectId, userId, value) => {
        SetPictureIsLoading(true)
        let user = JSON.parse(localStorage.getItem('user'));
        fetch('https://mublin.herokuapp.com/project/'+projectId+'/picture', {
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
            })
          }).catch(err => {
            SetPictureIsLoading(false)
            console.error(err)
        })
    };

    let color
    if (projectUserName && projectUsernameAvailability.available === false) {
        color="red"
    } else if (projectUserName && projectUsernameAvailability.available === true) {
        color="green"
    }

    // Image Upload to ImageKit.io
    const userAvatarPath = "/projects/"
    const [pictureFilename, setPictureFilename] = useState('')

    const onUploadError = err => {
        alert("Ocorreu um erro ao enviar a imagem. Tente novamente em alguns minutos.");
    };

    const onUploadSuccess = res => {
        let n = res.filePath.lastIndexOf('/');
        let fileName = res.filePath.substring(n + 1);
        updatePicture(idNewProject,user.id,fileName)
        setPictureFilename(fileName)
    };

    const handleFormSubmit = () => {
        setIsLoading(true)
        let user = JSON.parse(localStorage.getItem('user'));
        fetch('https://mublin.herokuapp.com/user/'+user.id+'/firstAccess', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({step: 0})
        }).then((response) => {
            response.json().then((response) => {
              setIsLoading(false)
              history.push("/home")
            })
          }).catch(err => {
            setIsLoading(false)
            console.error(err)
        })
    }

    return (
        <>
        {(searchProject.requesting || isLoading) && 
            <Loader
                className="appLoadingIcon"
                type="Audio"
                color="#ff0032"
                height={100}
                width={100}
                timeout={30000} //30 secs
            />
        }
        <main className="startPage">
            <div className="ui container">
                <Grid centered columns={1} verticalAlign='middle'>
                    <Grid.Column mobile={16} computer={8}>
                        <Form>
                            <Segment basic textAlign='center' className="pb-0">
                                <Image src='https://ik.imagekit.io/mublin/logos/logo-mublin-circle-black_hQJn5eU5ChR.png' size='mini' centered />
                                <Header as='h1' className="pb-3">
                                    Passo 4 de 4
                                    <Header.Subheader>
                                        Seus projetos musicais
                                    </Header.Subheader>
                                </Header>
                                <Progress percent={100} color='green' size='small' />
                            </Segment>
                            <Segment basic textAlign='center'>
                                <label style={{fontWeight: '500'}}>De quais projetos ou bandas você participa ou já participou?</label>
                                { userInfo.requesting ? ( 
                                    <Dimmer active inverted>
                                        <UiLoader inverted content='Carregando...' />
                                    </Dimmer>
                                ) : (
                                    <Segment basic textAlign='center'>
                                        {userInfo.projects[0].id && userProjects}
                                    </Segment>
                                )}
                                <p style={{fontWeight: '400'}} className="my-3">Pesquise abaixo ou  <Button basic size="tiny" onClick={() => setModalNewProjectOpen(true)} className="ml-1">cadastre um novo projeto</Button></p>
                                <Search
                                    fluid
                                    size='large'
                                    icon='search'
                                    placeholder='Digite o nome do projeto ou banda...'
                                    noResultsMessage="Nenhum resultado"
                                    loading={searchProject.requesting}
                                    results={searchProject.results}
                                    value={query}
                                    onSearchChange={e => handleSearchChange(e.target.value)}
                                    onResultSelect={handleResultSelect}
                                    className='mt-4'
                                />
                                <Modal
                                    id='participation'
                                    size='mini'
                                    onClose={() => setModalOpen(false)}
                                    onOpen={() => setModalOpen(true)}
                                    open={modalOpen}
                                >
                                    <Modal.Header>Ingressar em {modalProjectTitle}?</Modal.Header>
                                    <Modal.Content>
                                        <Image centered rounded src={modalProjectImage} size='tiny' className="mb-2" />
                                        <p style={{fontSize: '11px', textAlign: 'center'}}>{modalProjectInfo}</p>
                                        <p style={{fontSize: '11px', textAlign: 'center'}}>{'Formada em '+modalProjectFoundationYear}{modalProjectEndYear && ' ・ Encerrada em '+modalProjectEndYear}</p>
                                        <Form className="mt-4">
                                            <label style={{fontWeight: '600', fontSize: '.92857143em'}}>Qual é (ou foi) sua ligação com este projeto?</label>
                                            <Form.Field>
                                                <Radio
                                                    className="mt-3"
                                                    label='Integrante oficial'
                                                    name='radioGroup'
                                                    value='1'
                                                    checked={status === '1'}
                                                    onChange={() => setStatus('1')}
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <Radio
                                                    className="mt-0"
                                                    label='Sideman'
                                                    name='radioGroup'
                                                    value='2'
                                                    checked={status === '2'}
                                                    onChange={() => setStatus('2')}
                                                />
                                            </Form.Field>
                                            <label style={{fontWeight: '600', fontSize: '.92857143em'}}>Sua principal função neste projeto</label>
                                            <Form.Field
                                                className="mt-2"
                                                id="main_role_fk"
                                                name="main_role_fk"
                                                control={Select}
                                                options={rolesList}
                                                placeholder="Selecione ou digite"
                                                onChange={(e, { value }) => setMain_role_fk(value)}
                                                search
                                            />
                                            <Form.Group widths='equal'>
                                                <Form.Input name="joined_in" type="number" fluid label='Entrei em' defaultValue={modalProjectFoundationYear} onChange={e => setJoined_in(e.target.value)} error={(joined_in > 0 && joined_in < modalProjectFoundationYear) &&{ content: 'Ano inferior ao início do projeto' }} min={modalProjectFoundationYear} max={modalProjectEndYear} />
                                                { modalProjectEndYear ? (
                                                    <Form.Input name="left_in" type="number" fluid label='Deixei o projeto em' onChange={e => setLeft_in(e.target.value)} error={(left_in > 0 && left_in > modalProjectEndYear) && {content: 'Ano superior ao encerramento do projeto'}} min={modalProjectFoundationYear} max={modalProjectEndYear} disabled={checkbox ? true : false} />
                                                ) : (
                                                    <Form.Input name="left_in" type="number" fluid label='Deixei o projeto em' onChange={e => setLeft_in(e.target.value)} error={(left_in > 0 && left_in > currentYear) && {content: 'Ano superior ao atual'}} min={modalProjectFoundationYear} max={currentYear} disabled={checkbox ? true : false} />
                                                )}
                                            </Form.Group>
                                            <Form.Checkbox name="active" checked={checkbox} label={modalProjectEndYear ? 'Estive ativo até o final do projeto' : 'Estou ativo atualmente neste projeto'} onChange={() => handleCheckbox(checkbox)} />
                                            <label style={{fontWeight: '600', fontSize: '.92857143em'}}>Categorizar projeto em:</label>
                                            <Form.Field>
                                                <Radio
                                                    className="mt-3"
                                                    label='Projetos principais'
                                                    name='radioGroup2'
                                                    value='0'
                                                    checked={portfolio === '0'}
                                                    onChange={() => setPortfolio('0')}
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <Radio
                                                    className="mt-0"
                                                    label='Portfolio'
                                                    name='radioGroup2'
                                                    value='1'
                                                    checked={portfolio === '1'}
                                                    onChange={() => setPortfolio('1')}
                                                />
                                            </Form.Field>
                                        </Form>
                                        <Message size='tiny' warning>
                                            <p>*sua participação ficará pendente até que o(s) líder(es) deste projeto aprovem sua solicitação</p>
                                        </Message>
                                    </Modal.Content>
                                    <Modal.Actions>
                                    <Button onClick={() => setModalOpen(false)}>
                                        Fechar
                                    </Button>
                                    <Button 
                                        color="black" 
                                        onClick={handleSubmitParticipation}
                                        disabled={main_role_fk ? false : true }
                                    >
                                        Confirmar
                                    </Button>
                                    </Modal.Actions>
                                </Modal>
                                <Modal
                                    id="newProject"
                                    size='mini'
                                    onClose={() => setModalNewProjectOpen(false)}
                                    onOpen={() => setModalNewProjectOpen(true)}
                                    open={modalNewProjectOpen}
                                >
                                    <Modal.Header>Cadastrar projeto ou banda</Modal.Header>
                                    <Modal.Content>
                                        <Form>
                                            <Form.Field>
                                                <Form.Input size='small' name="projectName" fluid placeholder="Nome do projeto ou banda" onChange={(e, { value }) => setProjectName(value)} />
                                            </Form.Field>
                                            <Form.Field>
                                                <Input 
                                                    size='small' 
                                                    placeholder='Username' 
                                                    label='@' 
                                                    onChange={(e, { value }) => handleChangeProjectUserName(value)} 
                                                    onKeyUp={e => {
                                                        checkUsername(e.target.value)
                                                    }}
                                                    value={projectUserName} 
                                                    loading={projectUsernameAvailability.requesting} 
                                                />
                                                <Label 
                                                    size="tiny" 
                                                    pointing 
                                                    color={color}
                                                    style={{fontWeight: 'normal', textAlign: 'center'}} 
                                                >
                                                    { (projectUserName && projectUsernameAvailability.available) &&
                                                        <Icon name="check" /> 
                                                    }
                                                    mublin.com/project/{projectUserName}
                                                </Label>
                                            </Form.Field>
                                            <Form.Group widths='equal'>
                                                <Form.Input size='small' name="foundation_year" type="number" fluid label="Ano de formação" error={foundation_year > currentYear && {content: 'O ano deve ser inferior ao atual' }} min="1900" max={currentYear} onChange={(e, { value }) => setFoundationYear(value)} value={foundation_year} />
                                                <Form.Input size='small' name="end_year" type="number" fluid label="Ano encerramento" error={end_year > currentYear && {content: 'O ano deve ser inferior ao atual' }} min={foundation_year} max={currentYear} onChange={(e, { value }) => setEndYear(value)} value={end_year} disabled={checkboxProjectActive} />
                                            </Form.Group>
                                            <Form.Checkbox checked={checkboxProjectActive} label="Em atividade" onChange={() => handleCheckboxProjectActive(checkboxProjectActive)} />
                                            <div className='mb-2'>
                                                <Form.TextArea 
                                                    size='small' 
                                                    label='Bio' 
                                                    placeholder='Conte um pouco sobre o projeto (opcional)' 
                                                    onChange={(e, { value }) => setBio(value)}
                                                    value={bio}
                                                    maxLength="200"
                                                    rows="2"
                                                    error={bio.length === "200" && {content: 'A bio atingiu o limite de 200 caracteres' }}
                                                />
                                                <Label size='tiny' content={bio.length+'/200'} />
                                            </div>
                                            <label style={{fontWeight: '600', fontSize: '.92857143em'}}>Sua principal função no projeto</label>
                                            <Form.Field
                                                className="mt-2"
                                                control={Select}
                                                options={rolesList}
                                                placeholder="Selecione ou digite"
                                                onChange={(e, { value }) => setNpMain_role_fk(value)}
                                                search
                                            />
                                            <Form.Group widths='equal'>
                                                <Form.Field 
                                                    label='Tipo de projeto' 
                                                    control='select'
                                                    onChange={(e) => handleTypeChange(e.target.options[e.target.selectedIndex].value)}
                                                    value={type}
                                                >
                                                    <option value='2'>Banda</option>
                                                    <option value='3'>Projeto</option>
                                                    <option value='1'>Artista Solo</option>
                                                    <option value='8'>DJ</option>
                                                    <option value='4'>Duo</option>
                                                    <option value='5'>Trio</option>
                                                    <option value='7'>Ideia no papel</option>
                                                </Form.Field>
                                                <Form.Field 
                                                    label='Conteúdo principal' 
                                                    control='select'
                                                    onChange={(e) => setKind(e.target.options[e.target.selectedIndex].value)}
                                                    value={kind}
                                                >
                                                    <option value='1'>Autoral</option>
                                                    <option value='2'>Cover</option>
                                                    <option value='3'>Autoral + Cover</option>
                                                </Form.Field>
                                            </Form.Group>
                                            <Form.Group inline className="mb-3">
                                                <label>Visibilidade</label>
                                                <Form.Field
                                                    control={Radio}
                                                    label='Público'
                                                    value='1'
                                                    checked={publicProject === '1'}
                                                    onChange={() => setPublicProject('1')}
                                                />
                                                <Form.Field
                                                    control={Radio}
                                                    label='Privado'
                                                    value='0'
                                                    checked={publicProject === '0'}
                                                    onChange={() => setPublicProject('0')}
                                                />
                                            </Form.Group>
                                            <label style={{fontWeight: '600', fontSize: '.92857143em'}}>Categorizar projeto em:</label>
                                            <Form.Field>
                                                <Radio
                                                    className="mt-3"
                                                    label='Projetos principais'
                                                    name='radioGroup3'
                                                    value='0'
                                                    checked={portfolioNewProject === '0'}
                                                    onChange={() => setPortfolioNewProject('0')}
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <Radio
                                                    className="mt-0"
                                                    label='Portfolio'
                                                    name='radioGroup3'
                                                    value='1'
                                                    checked={portfolioNewProject === '1'}
                                                    onChange={() => setPortfolioNewProject('1')}
                                                />
                                            </Form.Field>
                                        </Form>
                                    </Modal.Content>
                                    <Modal.Actions>
                                    <Button onClick={() => setModalNewProjectOpen(false)}>
                                        Fechar
                                    </Button>
                                    <Button 
                                        color="black" 
                                        onClick={handleSubmitNewProject}
                                        disabled={(projectName && projectUserName && foundation_year && type && kind && publicProject && npMain_role_fk && projectUsernameAvailability.available) ? false : true }
                                    >
                                        Cadastrar
                                    </Button>
                                    </Modal.Actions>
                                </Modal>
                                <Modal
                                    id="newProjectPicture"
                                    size='mini'
                                    onClose={() => setModalNewProjectPictureOpen(false)}
                                    onOpen={() => setModalNewProjectPictureOpen(true)}
                                    open={modalNewProjectPictureOpen}
                                >
                                    <Modal.Header>Definir foto para {projectName}</Modal.Header>
                                    <Modal.Content>
                                        { !newProjectPicture ? (
                                            <>
                                                {/* <Image centered rounded src='https://ik.imagekit.io/mublin/tr:h-200,w-200/sample-folder/avatar-undefined_-dv9U6dcv3.jpg' size='small' className="mb-3" /> */}
                                            </>
                                        ) : (
                                            <Image centered rounded src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/projects/'+newProjectPicture} size='small' className="mb-4" />
                                        )}
                                        <div className="customFileUpload">
                                            <IKUpload 
                                                fileName={projectUserName+'_avatar.jpg'}
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
                                    <Modal.Actions>
                                    { !pictureFilename && 
                                        <Button 
                                            onClick={() => setModalNewProjectPictureOpen(false)}
                                        >
                                            Enviar depois
                                        </Button>
                                    }
                                    <Button 
                                        color="black" 
                                        disabled={!pictureFilename}
                                        onClick={() => { 
                                            dispatch(userInfos.getUserProjects(user.id));
                                            setModalNewProjectPictureOpen(false);
                                        }}
                                    >
                                        Concluir
                                    </Button>
                                    </Modal.Actions>
                                </Modal>
                            </Segment>
                            <Segment basic textAlign='center' >
                                <Link to={{ pathname: "/start/step3" }} className="mr-2">
                                    <Button size="large">Voltar</Button>
                                </Link>
                                <Button 
                                    color="black" 
                                    size="large"
                                    onClick={handleFormSubmit}
                                >
                                    Concluir
                                </Button>
                                <p style={{fontWeight: '400'}} className="mt-3">Fica tranquilo! Você poderá ingressar ou criar projetos mais tarde se preferir <Icon name='smile outline' /></p>
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        </main>
        </>
    );
};

export default StartStep3Page;