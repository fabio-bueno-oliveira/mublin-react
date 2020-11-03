import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { userInfos } from '../../store/actions/user';
import { miscInfos } from '../../store/actions/misc';
import { searchInfos } from '../../store/actions/search';
import { Search, Modal, Button, Header, Grid, Image, Segment, Form, Message, Radio, Select, Label, Icon, Input } from 'semantic-ui-react';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer'

function JoinPage () {
 
    document.title = 'Ingressar em um projeto | Mublin'

    let history = useHistory();

    const dispatch = useDispatch();

    let userSession = JSON.parse(localStorage.getItem('user'));

    const [keyword, setKeyword] = useState('')
    const [lastSearchedKeywords, setLastSearchedKeyword] = useState('')

    useEffect(() => { 
        dispatch(userInfos.getUserProjects(userSession.id));
        dispatch(miscInfos.getRoles());
    }, [userSession.id, dispatch]);

    const searchProjectByKeyword = (keyword) => {
        setKeyword(keyword)
        setLastSearchedKeyword(keyword)
        submitSearch(keyword)
    }

    const [submitSearch] = useDebouncedCallback((keyword) => {
        if (keyword.length) {
            dispatch(searchInfos.getSearchProjectsResults(keyword))
        }
    },1000);

    const results = useSelector(state => state.search);
    const projects = results.projects;

    const handleResultSelect = (id, type, name, foundationYear, endYear, picture) => {
        setProjectId(id)
        setModalProjectInfo(type)
        setModalProjectTitle(name)
        setModalFoundationYear(foundationYear)
        setJoined_in(foundationYear)
        setModalEndYear(endYear)
        setModalProjectImage(picture)
        setModalOpen(true)
    }

    const userProjects = useSelector(state => state.user.projects)
    console.log(61, userProjects)
    const roles = useSelector(state => state.roles);
    const [isLoading, setIsLoading] = useState(false);
    const currentYear = new Date().getFullYear()
    const searchProject = useSelector(state => state.searchProject);

    const rolesList = roles.list.filter((role) => { return role.id !== 29 && role.id !== 30 && role.id !== 31 }).map(role => ({ 
        text: role.description,
        value: role.id,
        key: role.id
    }));

    const handleCheckbox = (x) => {
        setCheckbox(value => !value)
        setLeft_in('')
        if (x) {
            setActive('0')
        } else {
            setActive('1')
        }
    }
    
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

    const handleSubmitParticipation = () => {
        setIsLoading(true)
        fetch('https://mublin.herokuapp.com/user/add/project', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userSession.token
            },
            body: JSON.stringify({ userId: userSession.id, projectId: projectId, active: active, status: status, main_role_fk: main_role_fk, joined_in: joined_in, left_in: left_in, leader: '0', confirmed: '2', admin: '0', portfolio: portfolio })
        }).then((response) => {
            dispatch(searchInfos.getSearchProjectsResults(keyword))
            setIsLoading(false)
            setModalOpen(false)
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao criar o projeto. Tente novamente em alguns minutos.")
            setModalOpen(false)
        })
    }

    const handleCancelParticipationRequest = (userProjectParticipationId) => {
        setIsLoading(true)
        fetch('https://mublin.herokuapp.com/user/delete/project', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userSession.token
            },
            body: JSON.stringify({userId: userSession.id, userProjectParticipationId: userProjectParticipationId})
        }).then((response) => {
            dispatch(searchInfos.getSearchProjectsResults(keyword))
            setIsLoading(false)
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao cancelar a participação no projeto. Tente novamente em alguns instantes.")
        })
    }

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid as='main' centered columns={1} className="container">
                <Grid.Row>
                    <Grid.Column mobile={16} computer={10}>
                        <Header as='h2' className='mb-4'>Ingressar em um projeto</Header>
                        <Segment basic textAlign='center'>
                            <label style={{fontWeight: '500'}}>Digite abaixo o nome do projeto que deseja ingressar</label>
                            <p style={{fontWeight: '300'}} className="my-3">Sua solicitação ficará pendente até a aprovação de um dos líderes do projeto</p>
                            <Input 
                                fluid
                                size='large'
                                icon='search' 
                                placeholder='Comece a digitar o nome do projeto...' 
                                value={keyword}
                                onChange={e => searchProjectByKeyword(e.target.value)}
                                loading={results.requesting}
                            />
                            { results.requesting ? ( 
                                <Header>Buscando...</Header>
                            ) : (
                                projects.length > 1 && <Header>{projects.length} encontrados</Header>
                            )}
                            { (projects[0].id && !results.requesting) &&
                                projects.map((project, key) =>
                                    <Segment textAlign='left'>
                                        <Header as='h3'>
                                            {project.picture ? (
                                                <Image rounded src={project.picture} />
                                            ) : (
                                                <Image rounded src={'https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_-dv9U6dcv3.jpg'} />
                                            )}
                                            <Header.Content>
                                                {project.name}
                                                <Header.Subheader>
                                                    {project.type} {project.mainGenre && ' ・ '+project.mainGenre} {project.city && ' ・ '+project.city+', '+project.region}
                                                </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                        <Button 
                                            color='black'
                                            size='mini'
                                            onClick={() => history.push('/project/'+project.username)}
                                        >
                                            Ver página
                                        </Button>
                                        {
                                            {
                                                null:
                                                    // No participation yet
                                                    <Button 
                                                        icon
                                                        color='blue'
                                                        size='mini'
                                                        onClick={() => handleResultSelect(project.id, project.type, project.name, project.foundationYear, project.endYear, project.picture)}
                                                    >
                                                        <Icon name='plus' /> Solicitar participação
                                                    </Button>,
                                                1: 
                                                    // Confirmed
                                                    <Button 
                                                        disabled
                                                        icon
                                                        color='green'
                                                        size='mini'
                                                    >
                                                        <Icon name='checkmark' /> Participação confirmada
                                                    </Button>,
                                                2: 
                                                    // Requested, pending 
                                                    <Button 
                                                        icon
                                                        color='orange'
                                                        size='mini'
                                                        onClick={() => handleCancelParticipationRequest(project.participationId)}
                                                    >
                                                        <Icon name='clock outline' /> Participação solicitada
                                                    </Button>,
                                            }[project.participationStatus]
                                        }
                                    </Segment>
                                )
                            }
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
                                    <p style={{fontSize: '12px', textAlign: 'center'}}>{modalProjectInfo}</p>
                                    <p style={{fontSize: '11px', textAlign: 'center'}}>{'Formada em '+modalProjectFoundationYear}{modalProjectEndYear && ' ・ Encerrada em '+modalProjectEndYear}</p>
                                    <Form className="mt-4">
                                        <label style={{fontWeight: '600', fontSize: '.92857143em'}}>Qual { modalProjectEndYear ? 'foi' : 'é (ou foi)' } sua ligação com este projeto?</label>
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
                                                label='Convidado (sideman)'
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
                                        <label style={{fontWeight: '600', fontSize: '.92857143em'}}>Categorizar projeto como:</label>
                                        <Form.Field>
                                            <Radio
                                                className="mt-3"
                                                label='Principal'
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
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default JoinPage;