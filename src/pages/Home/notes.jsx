import React, { useState, useSelector } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Header, Modal, Card, List, Image, Label, Icon, Button, Form, Radio, Dropdown, Segment, Loader } from 'semantic-ui-react';
import { projectInfos } from '../../store/actions/project';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

const Notes = (props) => {

    let history = useHistory();

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

    const boxTitle = {
        backgroundImage:'url(https://ik.imagekit.io/mublin/tr:w-400,h-95,fo-top,c-maintain_ratio/misc/music/home-banners/note-and-coffee_7eYOoAm8f.jpg)',
        backgroundPosition:'top',
    }

    return (
        <>
            <Card id="notes" style={{width:'100%',backgroundColor:'transparent',boxShadow:'none'}}>
                <Card.Content style={{paddingTop:'0px'}}>
                    <Segment inverted style={boxTitle} className='py-4'>
                        <Header as='h3' inverted className='py-2'>
                            <Header.Content>
                                Notas
                                <Header.Subheader>Anotações úteis</Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Segment>
                    <Card.Description className="mb-3">
                        { notes.list[0].noteId ? (
                            <div className="left floated">
                                <span style={{fontWeight:'500',fontSize:'13px'}}>{notes.list.length === 1 ? notes.list.length+' nota salva' : notes.list.length+' notas salvas'}</span>
                                <h4 className='ui sub header mt-1 mb-3' style={{color:'#f7f7f7'}}>Minhas notas:</h4>
                            </div>
                        ) : (
                            <span style={{fontWeight:'500',fontSize:'13px'}}>Nenhuma nota salva</span>
                        )}
                        <div className="right floated">
                            <Link to={{ pathname: '/tbd' }}>
                                <Button size='mini' style={{fontWeight:'500'}}><Icon name='plus' /> Criar novo</Button>
                            </Link>
                            { notes.list.length > 6 &&
                                <Link to={{ pathname: '/tbd' }} className='mr-3'>
                                    <Button size='mini' style={{fontWeight:'500'}}><Icon name='history' /></Button>
                                </Link>
                            }
                        </div>
                    </Card.Description>
                    <Card.Description>
                        {notes.requesting ? (
                            <Header textAlign='center'>
                                <Icon loading name='spinner' size='large' />
                            </Header>
                        ) : (
                            <List relaxed>
                            { notes.list[0].noteId &&
                                notes.list.map((note, key) =>
                                    <List.Item key={key}>
                                        <Segment.Group>
                                            <Segment className='py-2'>
                                                <Header as='h5'>
                                                    <Header.Content>
                                                        {note.noteTitle}
                                                    </Header.Content>
                                                </Header>
                                                <p style={{fontSize:'12px',fontWeight:'500'}} className='mt-2'>{note.noteDescription}</p>
                                            </Segment>
                                            <Segment style={{fontSize:'11px',color:'#949494'}}  className='py-2'>
                                                criada há {formatDistance(new Date(note.created * 1000), new Date(), {locale:pt})}
                                                <div className="right floated">
                                                    <Icon name='trash alternate outline' style={{fontSize:'12px',color:'#949494',cursor:'pointer'}} />
                                                </div>
                                            </Segment>
                                        </Segment.Group>
                                    </List.Item>
                                )
                            }
                            </List>
                        )}
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
            </Card>
        </>
    );
};

export default Notes