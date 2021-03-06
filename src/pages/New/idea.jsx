import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { useHistory } from 'react-router-dom';
import { Grid, Header, Form, Input, Radio, Select, Button, Label, Icon, Image } from 'semantic-ui-react';
import { userInfos } from '../../store/actions/user';
import { miscInfos } from '../../store/actions/misc';
import { usernameCheckInfos } from '../../store/actions/usernameCheck';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import {IKUpload} from "imagekitio-react";

function NewProjectIdeaPage () {
    
    document.title = 'Nova ideia de projeto | Mublin'
    
    let user = JSON.parse(localStorage.getItem('user'));

    const dispatch = useDispatch();

    useEffect(() => { 
        dispatch(userInfos.getUserProjects(user.id));
        dispatch(miscInfos.getRoles());
    }, [user.id, dispatch]);

    const currentYear = new Date().getFullYear()
    const roles = useSelector(state => state.roles);

    let history = useHistory();

    const [isLoading, setIsLoading] = useState(false);
    const projectUsernameAvailability = useSelector(state => state.projectUsernameCheck);
    const [projectName, setProjectName] = useState('')
    const [projectUserName, setProjectUserName] = useState('')
    const [projectImage, setProjectImage] = useState('')
    const [bio, setBio] = useState('')
    const [type, setType] = useState('7')
    const [kind, setKind] = useState('1')
    const [npMain_role_fk, setNpMain_role_fk] = useState('')
    const [publicProject, setPublicProject] = useState('1')
    const [userStatus, setUserStatus] = useState('1')
    const [idNewProject, setIdNewProject] = useState('')

    const handleChangeProjectUserName = (value) => {
        setProjectUserName(value.replace(/[^A-Z0-9]/ig, "").toLowerCase())
    }

    const handleSetProjectName = (value) => {
        setProjectName(value);
        handleChangeProjectUserName(value);
    }

    const handleTypeChange = (value) => {
        setType(value)
        if (value === 7) {
            setUserStatus('3')
        } else {
            setUserStatus('1')
        }
    }

    const [checkUsername] = useDebouncedCallback((string) => {
        if (string.length) {
            dispatch(usernameCheckInfos.checkProjectUsernameByString(string))
        }
    },1000);

    let color
    if (projectUserName && projectUsernameAvailability.available === false) {
        color="red"
    } else if (projectUserName && projectUsernameAvailability.available === true) {
        color="green"
    }

    const cdnPath = 'https://ik.imagekit.io/mublin/icons/music/tr:h-26,w-26,c-maintain_ratio/'

    const rolesList = roles.list.filter((role) => { return role.id !== 29 && role.id !== 30 && role.id !== 31 }).map(role => ({ 
        text: role.description,
        value: role.id,
        key: role.id,
        image: role.icon ? cdnPath+role.icon : null
    }));

    const handleSubmitNewProject = () => {
        // setIsLoading(true)
        fetch('https://mublin.herokuapp.com/project/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({ id_user_creator_fk: user.id, projectName: projectName, projectUserName: projectUserName, projectImage: projectImage, foundation_year: currentYear, end_year: null, bio: bio, type: type, kind: kind, public: publicProject })
        })
        .then(response => {
            return response.json();
        }).then(jsonResponse => {
            setIdNewProject(jsonResponse.id)
            handleSubmitParticipationToNewProject(user.id, jsonResponse.id, userStatus, npMain_role_fk)
        }).catch (error => {
            console.error(error)
            alert("Ocorreu um erro ao ingressar no projeto. Tente novamente em alguns minutos.")
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
            body: JSON.stringify({ userId: newProjectUserId, projectId: newProjectProjectId, active: '1', status: newProjectUserStatus, main_role_fk: newProjectMain_role_fk, joined_in: currentYear, left_in: null, leader: '1', confirmed: '1', admin: '1' })
        }).then((response) => {
            dispatch(userInfos.getUserProjects(user.id))
            setIsLoading(false)
            history.push({
                pathname: '/backstage/'+projectUserName,
                search: '?new=true'
            })
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao criar o projeto. Tente novamente em instantes.")
        })
    }

    // Image Upload to ImageKit.io
    const projectImagePath = "/projects/"
    const onUploadError = err => {
        alert("Ocorreu um erro. Tente novamente em alguns minutos.");
    };
    const onUploadSuccess = res => {
        let n = res.filePath.lastIndexOf('/');
        let fileName = res.filePath.substring(n + 1);
        setProjectImage(fileName)
    };

    const removeImage = () => {
        setProjectImage('')
        document.querySelector('#projectImage').value = null
    }

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid as='main' centered columns={1} className="container">
                <Grid.Row>
                    <Grid.Column mobile={16} computer={10}>
                        <Header as='h1' textAlign='center' className='mb-4 mt-3 mb-4'>
                            Criar nova ideia de projeto
                            <Header.Subheader>Cadastre uma ideia de banda autoral, cover ou algum outro tipo de projeto e atraia outros artistas interessados em participar</Header.Subheader>
                        </Header>
                        <Form>
                            <Form.Field>
                                <Form.Input name="projectName" fluid placeholder="Nome da ideia do projeto ou banda" onChange={(e, { value }) => handleSetProjectName(value)} />
                            </Form.Field>
                            <Form.Field>
                                <Input 
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
                            <Form.Field className='mb-0'>
                                <label for='projectImage'>Foto</label>
                            </Form.Field>
                            <div className={projectImage ? 'd-none' : ''}>
                                <IKUpload 
                                    id='projectImage'
                                    fileName="projectPicture.jpg"
                                    folder={projectImagePath}
                                    tags={["tag1"]}
                                    useUniqueFileName={true}
                                    isPrivateFile= {false}
                                    onError={onUploadError}
                                    onSuccess={onUploadSuccess}
                                    accept="image/x-png,image/gif,image/jpeg" 
                                />
                            </div>
                            {projectImage && 
                                <>
                                    <Image src={'https://ik.imagekit.io/mublin/tr:h-200,w-200/projects/'+projectImage} size='tiny' rounded className="mt-2 mb-2" /> <Button size='tiny' icon='trash' negative onClick={() => removeImage()}>Remover</Button>
                                </>
                            }
                            <div className='my-3'>
                                <Form.TextArea 
                                    className='mb-1'
                                    label='Bio' 
                                    placeholder='Conte um pouco sobre o projeto (opcional)' 
                                    onChange={(e, { value }) => setBio(value)}
                                    value={bio}
                                    maxLength="200"
                                    rows="2"
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
                                    <option value='7'>Ideia</option>
                                </Form.Field>
                                <Form.Field 
                                    label='Conteúdo' 
                                    control='select'
                                    onChange={(e) => setKind(e.target.options[e.target.selectedIndex].value)}
                                    value={kind}
                                >
                                    <option value='1'>Autoral</option>
                                    <option value='2'>Cover</option>
                                    <option value='3'>Autoral + Cover</option>
                                </Form.Field>
                            </Form.Group>
                            <Form.Group inline className="mb-0">
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
                            <Button 
                                floated='right'
                                loading={isLoading}
                                className='mt-4'
                                color="black" 
                                onClick={handleSubmitNewProject}
                                disabled={(projectName && projectUserName && type && kind && publicProject && npMain_role_fk && projectUsernameAvailability.available) ? false : true }
                            >
                                Cadastrar
                            </Button>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default NewProjectIdeaPage;