import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/user';
import { miscInfos } from '../../../store/actions/misc';
import { searchInfos } from '../../../store/actions/search';
import { useHistory, Link } from 'react-router-dom';
import { Dimmer, Loader as UiLoader, Search, Modal, Progress, Button, Header, Grid, Image, Segment, Form, Message, Radio, Dropdown, Select, Label, Icon, Input } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';
import '../styles.scss'

function StartStep3Page () {

    let history = useHistory();

    document.title = "Passo 4 de 4";

    const dispatch = useDispatch();

    let user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => { 
        dispatch(userInfos.getUserProjects(user.id));
        dispatch(miscInfos.getRoles());
    }, []);

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
        <Label color="blue" key={key} className="mb-2" style={{ fontWeight: 'normal' }}>
            {project.role1+" em "+project.name}
            <Icon name='delete' onClick={() => deleteProject(project.id)} />
        </Label>
    );

    const [isLoading, setIsLoading] = useState(false);

    const [query, setQuery] = useState('')
    const [lastQuery, setLastQuery] = useState('')

    const [modalOpen, setModalOpen] = useState(false)
    const [modalProjectTitle, setModalProjectTitle] = useState('')
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

    const handleCheckbox = (x) => {
        setCheckbox(value => !value);
        setLeft_in('')
        if (x) {
            setActive('0')
        } else {
            setActive('1')
        }
    }

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
        setModalProjectTitle(result.title)
        setModalFoundationYear(result.foundation_year)
        setJoined_in(result.foundation_year)
        setModalEndYear(result.end_year)
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
            body: JSON.stringify({ userId: user.id, projectId: projectId, active: active, status: status, main_role_fk: main_role_fk, joined_in: joined_in, left_in: left_in, leader: '0', confirmed: '2' })
        }).then((response) => {
            console.log(124, response)
            dispatch(userInfos.getUserProjects(user.id))
            setIsLoading(false)
            setModalOpen(false)
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao ingressar no projeto. Tente novamente em alguns minutos.")
            setModalOpen(false)
        })
    }

    const handleSubmitNewProject = () => {
        
    }

    return (
        <>
        {searchProject.requesting && 
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
                                <Image src='https://mublin.com/img/logo-mublin-circle-black.png' size='mini' centered />
                                <Header as='h1' className="pb-3">
                                    Passo 4 de 4
                                    <Header.Subheader>
                                        Seus projetos musicais
                                    </Header.Subheader>
                                </Header>
                                <Progress percent={50} color='green'/>
                            </Segment>
                            <Segment basic textAlign='center'>
                                <label style={{fontWeight: '500'}} className="mb-3">De quais projetos ou bandas você participa ou já participou?</label>
                                <p style={{fontWeight: '300'}} className="mb-3">Pesquise abaixo ou <a>cadastre um novo</a></p>
                                <Search
                                    fluid
                                    size='large'
                                    icon="search"
                                    placeholder="Digite o nome do projeto ou banda..."
                                    noResultsMessage="Nenhum resultado"
                                    loading={searchProject.requesting}
                                    results={searchProject.results}
                                    value={query}
                                    onSearchChange={e => handleSearchChange(e.target.value)}
                                    onResultSelect={handleResultSelect}
                                    loading={searchProject.requesting}
                                    className="mt-4"
                                />
                                <Modal
                                    size='mini'
                                    onClose={() => setModalOpen(false)}
                                    onOpen={() => setModalOpen(true)}
                                    open={modalOpen}
                                >
                                    <Modal.Header>Ingressar em {modalProjectTitle}?</Modal.Header>
                                    <Modal.Content>
                                        <Form className="mt-2">
                                            <label style={{fontWeight: '600', fontSize: '.92857143em'}}>Qual é/foi sua ligação com este projeto?</label>
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
                                        positive 
                                        onClick={handleSubmitParticipation}
                                        disabled={main_role_fk ? false : true }
                                    >
                                        Confirmar
                                    </Button>
                                    </Modal.Actions>
                                </Modal>
                            </Segment>
                            { userInfo.requesting ? ( 
                                <Dimmer active inverted>
                                    <UiLoader inverted content='Carregando...' />
                                </Dimmer>
                            ) : (
                                <Segment basic textAlign='center'>
                                    {userInfo.projects[0].id && userProjects}
                                </Segment>
                            )}
                            <Segment basic textAlign='center' >
                                <Link to={{ pathname: "/start/step3" }} className="mr-2">
                                    <Button size="large">Voltar</Button>
                                </Link>
                                <Link to={{ pathname: "/start/step3" }} className="mr-2">
                                    <Button color="black" size="large">Concluir</Button>
                                </Link>
                                <p style={{fontWeight: '300'}} className="mt-3">Você poderá ingressar ou criar projetos mais tarde se preferir</p>
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