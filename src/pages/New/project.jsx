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
import Spacer from '../../components/layout/Spacer'
import {IKUpload} from "imagekitio-react";

function NewProjectPage () {
    
    document.title = 'Criar novo projeto | Mublin'
    
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
    const [foundation_year, setFoundationYear] = useState(currentYear)
    const [checkboxProjectActive, setCheckboxProjectActive] = useState(true)
    const [end_year, setEndYear] = useState(null)
    const [bio, setBio] = useState('')
    const [type, setType] = useState('2')
    const [kind, setKind] = useState('1')
    const [npMain_role_fk, setNpMain_role_fk] = useState('')
    const [publicProject, setPublicProject] = useState('1')
    const [projectCategory, setProjectCategory] = useState('0')
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

    const [checkUsername] = useDebouncedCallback((string) => {
        if (string.length) {
            dispatch(usernameCheckInfos.checkProjectUsernameByString(string))
        }
    },1000);

    const handleCheckboxProjectActive = (x) => {
        setCheckboxProjectActive(value => !value)
        if (x) {
            setEndYear(foundation_year)
        } else {
            setEndYear('')
        }
    }

    let color
    if (projectUserName && projectUsernameAvailability.available === false) {
        color="red"
    } else if (projectUserName && projectUsernameAvailability.available === true) {
        color="green"
    }

    const rolesList = roles.list.filter((role) => { return role.id !== 29 && role.id !== 30 && role.id !== 31 }).map(role => ({ 
        text: role.description,
        value: role.id,
        key: role.id
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
            body: JSON.stringify({ id_user_creator_fk: user.id, projectName: projectName, projectUserName: projectUserName, projectImage: projectImage, foundation_year: foundation_year, end_year: end_year, bio: bio, type: type, kind: kind, public: publicProject })
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
            body: JSON.stringify({ userId: newProjectUserId, projectId: newProjectProjectId, active: '1', status: newProjectUserStatus, main_role_fk: newProjectMain_role_fk, joined_in: currentYear, left_in: null, leader: '1', confirmed: '1', admin: '1', portfolio: projectCategory })
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
    const userAvatarPath = "/projects/"
    const onUploadError = err => {
        alert("Ocorreu um erro. Tente novamente em alguns minutos.");
    };
    const onUploadSuccess = res => {
        let n = res.filePath.lastIndexOf('/');
        let fileName = res.filePath.substring(n + 1);
        setProjectImage(fileName)
    };

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid as='main' centered columns={1} className="container">
                <Grid.Row>
                    <Grid.Column mobile={16} computer={10}>
                        <Header as='h1' className='mb-4 mt-3 mb-4 textCenter'>
                            Criar novo projeto
                            {/* <Header.Subheader></Header.Subheader> */}
                        </Header>
                        <Form>
                            <Form.Field>
                                <Form.Input name="projectName" fluid placeholder="Nome do projeto ou banda" onChange={(e, { value }) => setProjectName(value)} />
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
                            <Form.Group inline className="mb-2">
                                <label>Salvar em</label>
                                <Form.Field
                                    control={Radio}
                                    label='Projetos principais'
                                    value='0'
                                    checked={projectCategory === '0'}
                                    onChange={() => setProjectCategory('0')}
                                />
                                <Form.Field
                                    control={Radio}
                                    label='Portfolio'
                                    value='1'
                                    checked={projectCategory === '1'}
                                    onChange={() => setProjectCategory('1')}
                                />
                            </Form.Group>
                            <Form.Field className='mb-0'>
                                <label for='projectImage'>Foto</label>
                            </Form.Field>
                            <div className={projectImage ? 'd-none' : ''}>
                                <IKUpload 
                                    id='projectImage'
                                    fileName="projectPicture.jpg"
                                    folder={userAvatarPath}
                                    tags={["tag1"]}
                                    useUniqueFileName={true}
                                    isPrivateFile= {false}
                                    onError={onUploadError}
                                    onSuccess={onUploadSuccess}
                                    accept="image/x-png,image/gif,image/jpeg" 
                                />
                            </div>
                            { projectImage && 
                                <Image src={'https://ik.imagekit.io/mublin/tr:h-200,w-200/projects/'+projectImage} size='tiny' rounded className="mt-2 mb-2" />
                            }
                            <Form.Group widths='equal' className='mt-3'>
                                <Form.Input name="foundation_year" type="number" fluid label="Ano de formação" error={foundation_year > currentYear && {content: 'O ano deve ser inferior ao atual' }} min="1900" max={currentYear} onChange={(e, { value }) => setFoundationYear(value)} value={foundation_year} />
                                <Form.Input name="end_year" type="number" fluid label="Ano de encerramento" error={end_year > currentYear && {content: 'O ano deve ser inferior ao atual' }} min={foundation_year} max={currentYear} onChange={(e, { value }) => setEndYear(value)} value={end_year} disabled={checkboxProjectActive} />
                            </Form.Group>
                            <Form.Checkbox checked={checkboxProjectActive} label="Em atividade" onChange={() => handleCheckboxProjectActive(checkboxProjectActive)} />
                            <div className='mb-3'>
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
                                    <option value='2'>Banda</option>
                                    <option value='3'>Projeto</option>
                                    <option value='1'>Artista Solo</option>
                                    <option value='8'>DJ</option>
                                    <option value='4'>Duo</option>
                                    <option value='5'>Trio</option>
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
                                disabled={(projectName && projectUserName && foundation_year && type && kind && publicProject && npMain_role_fk && projectUsernameAvailability.available) ? false : true }
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

export default NewProjectPage;