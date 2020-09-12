import React, { useState, useSelector } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Header, Modal, Card, List, Image, Icon, Button, Form, Radio, Dropdown, Segment } from 'semantic-ui-react';
import { projectInfos } from '../../store/actions/project';

const Notes = (props) => {

    let dispatch = useDispatch();

    const notes = props.notes
    const user = props.user
    const projectsList = props.projectsList

    const [modalNewNoteOpen, setModalNewNoteOpen] = useState(false)
    const [newNoteTitle, setNewNoteTitle] = useState('')
    const [newNoteDone, setNewNoteDone] = useState('0')
    const [newNoteTargetDate, setNewNoteTargetDate] = useState('')
    const [newNoteProjectAssociated, setNewNoteProjectAssociated] = useState('')
    const handleChangeProjectAssociated = (value) => {
        setNewNoteProjectAssociated(value)
        dispatch(projectInfos.getProjectMembersByProjectId(value));
    }

    const members = props.members

    const projectMembersList = members.filter((member) => { return member.id !== user.id }).map(member => ({ 
        text: member.name+' '+member.lastname,
        value: member.id,
        key: member.id,
        image: { avatar: true, src: 'https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max/users/avatars/'+member.id+'/'+member.picture+'' }
    }));

    const toggleNewNoteDone = () => {
        if (newNoteDone === '1') {
            setNewNoteDone('0')
        } else if (newNoteDone === '0') {
            setNewNoteDone('1')
        }
    }

    const [modalViewNoteOpen, setModalViewNoteOpen] = useState(false)

    return (
        <>
            <Card id="notes" style={{width: '100%'}}>
                <Card.Content>
                    <Image src='https://ik.imagekit.io/mublin/tr:r-8,w-300,h-80,c-maintain_ratio/misc/music/home-banners/music-notes_fbRjZcNpeR.jpg' fluid className="mb-3" />
                    <Card.Header className="ui mt-0 mb-1">Notas</Card.Header>
                    <Card.Meta className="mb-3">
                        { notes.length ? (
                            <span className='date'>Você tem {notes.length} notas salvas</span>
                        ) : (
                            <span className='date'>Você não tem notas salvas</span>
                        )}
                    </Card.Meta>
                    <Card.Description>
                        {notes.requesting ? (
                            <Header textAlign='center'>
                                <Icon loading name='spinner' size='large' />
                            </Header>
                        ) : (
                            <List relaxed>
                            {notes.map((note, key) =>
                                <>
                                    <Segment key={key} secondary style={{borderWidth:'0px', cursor:'pointer'}} onClick={() => alert("teste")}>
                                        { note.ownerId !== user.id ? (
                                            <>
                                                <div style={{display:'flow-root'}}>
                                                    <span style={{color:'#272727',fontSize:'11px'}} className="mb-0">
                                                        Criado por <Link to={{pathname: '/'+note.ownerUsername}} style={{opacity: '1'}}>{note.ownerName}</Link> em {note.noteCreated.substr(0, 10)}
                                                    </span>
                                                    <div className="right floated">
                                                        <Icon  name='volume up' style={{fontSize:'11px',opacity:'0.5'}} />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                            <div style={{display:'flow-root'}}>
                                                <span style={{color:'#272727',fontSize:'11px'}} className="mb-0 left floated">
                                                    {'Criado por mim em '+note.noteCreated.substr(0, 10)}
                                                </span>
                                                <div className="right floated">
                                                <Icon name='attach' style={{fontSize:'11px',opacity:'0.5'}} /> <Icon name='volume up' style={{fontSize:'11px',opacity:'0.5'}} />
                                                </div>
                                            </div>
                                            </>
                                        )}
                                        <Header as='h5' style={{color:'#272727'}} className="mt-1 mb-0">
                                            {note.noteTitle}
                                        </Header>
                                    </Segment>
                                </>
                            )}
                            </List>
                        )}
                        <Modal
                            size='mini'
                            open={modalViewNoteOpen}
                            onClose={() => setModalNewNoteOpen(false)}
                        >
                            <Modal.Header>Criar nova nota</Modal.Header>
                            <Modal.Content>
                                <Form>
                                    <Form.Field>
                                        <input 
                                            placeholder='Título'
                                            value={newNoteTitle}
                                            onChange={e => setNewNoteTitle(e.target.value)} 
                                        />
                                    </Form.Field>
                                    <Form.TextArea placeholder='Anotação...' />
                                    {/* <Form.Field>
                                        <Checkbox label='I agree to the Terms and Conditions' />
                                    </Form.Field> */}
                                    <Header as='h4'>Informações opcionais</Header>
                                    <Dropdown
                                        placeholder='Projeto relacionado'
                                        fluid
                                        selection
                                        closeOnEscape
                                        options={projectsList}
                                        noResultsMessage='Nenhum projeto disponível'
                                        onChange={(e, { value }) => handleChangeProjectAssociated(value)}
                                        value={newNoteProjectAssociated}
                                        className="mb-3"
                                    />
                                    { members[0].id &&
                                        <Dropdown
                                            placeholder='Associar nota a outros integrantes'
                                            fluid
                                            multiple
                                            search
                                            selection
                                            options={projectMembersList}
                                            className="mb-3"
                                        />
                                    }
                                    <Form.Field>
                                        <label>Data relacionada</label>
                                        <input 
                                            type="date"
                                            placeholder='Data relacionada'
                                            value={newNoteTargetDate}
                                            onChange={e => setNewNoteTargetDate(e.target.value)} 
                                        />
                                    </Form.Field>
                                    <Radio 
                                        toggle 
                                        label={newNoteDone === '0' ? 'Atividade não concluída' : 'Atividade concluída'}
                                        checked={newNoteDone === '1'}
                                        onChange={() => toggleNewNoteDone()}
                                    />
                                </Form>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button onClick={() => setModalNewNoteOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button positive>
                                    Salvar
                                </Button>
                            </Modal.Actions>
                        </Modal>
                        <Modal
                            size='mini'
                            open={modalNewNoteOpen}
                            onClose={() => setModalNewNoteOpen(false)}
                        >
                            <Modal.Header>Criar nova nota</Modal.Header>
                            <Modal.Content>
                                <Form>
                                    <Form.Field>
                                        <input 
                                            placeholder='Título'
                                            value={newNoteTitle}
                                            onChange={e => setNewNoteTitle(e.target.value)} 
                                        />
                                    </Form.Field>
                                    <Form.TextArea placeholder='Anotação...' />
                                    {/* <Form.Field>
                                        <Checkbox label='I agree to the Terms and Conditions' />
                                    </Form.Field> */}
                                    <Header as='h4'>Informações opcionais</Header>
                                    <Dropdown
                                        placeholder='Projeto relacionado'
                                        fluid
                                        selection
                                        closeOnEscape
                                        options={projectsList}
                                        noResultsMessage='Nenhum projeto disponível'
                                        onChange={(e, { value }) => handleChangeProjectAssociated(value)}
                                        value={newNoteProjectAssociated}
                                        className="mb-3"
                                    />
                                    { members[0].id &&
                                        <Dropdown
                                            placeholder='Associar nota a outros integrantes'
                                            fluid
                                            multiple
                                            search
                                            selection
                                            options={projectMembersList}
                                            className="mb-3"
                                        />
                                    }
                                    <Form.Field>
                                        <label>Data relacionada</label>
                                        <input 
                                            type="date"
                                            placeholder='Data relacionada'
                                            value={newNoteTargetDate}
                                            onChange={e => setNewNoteTargetDate(e.target.value)} 
                                        />
                                    </Form.Field>
                                    <Radio 
                                        toggle 
                                        label={newNoteDone === '0' ? 'Atividade não concluída' : 'Atividade concluída'}
                                        checked={newNoteDone === '1'}
                                        onChange={() => toggleNewNoteDone()}
                                    />
                                </Form>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button onClick={() => setModalNewNoteOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button positive>
                                    Salvar
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra style={{fontSize: 'small'}}>
                    <Link onClick={() => setModalNewNoteOpen(true)}>
                        <Icon name='pencil alternate' /> Nova anotação
                    </Link>
                </Card.Content>
            </Card>
        </>
    );
};

export default Notes