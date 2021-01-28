import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { eventsInfos } from '../../store/actions/events';
import { Header, List, Image, Icon, Button, Segment, Form, Modal, Message } from 'semantic-ui-react';

const Events = (props) => {

    let history = useHistory();

    let dispatch = useDispatch();

    let currentDate = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0].replace('T',' ')

    const user = JSON.parse(localStorage.getItem('user'));

    const [isLoading, setIsLoading] = useState(null)

    const events = props.events

    const [modalDeclineShow, setModalDeclineShow] = useState(false)

    const [declineComment, setDeclineComment] = useState('Minha agenda estará comprometida nesta data')

    const submitInvitationResponse = (key,invitationId,response,response_modified,response_comments) => {
        setIsLoading(key)
        setTimeout(() => {
            fetch('https://mublin.herokuapp.com/user/'+user.id+'/eventInvitationResponse', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify({invitationId: invitationId, response: response, response_modified:response_modified, response_comments: response_comments})
            }).then((response) => {
                dispatch(eventsInfos.getUserEvents(user.id))
                setIsLoading(null)
                setModalDeclineShow(false)
                setDeclineComment('Minha agenda estará comprometida nesta data')
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao atualizar convite. Tente novamente em instantes")
            })
        }, 400);
    }

    return (
        <>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                { events.list.length ? (
                    <div className="left floated">
                        <Header size='medium'>
                            <Icon name='calendar outline' />
                            <Header.Content>
                                Eventos
                                <Header.Subheader style={{fontSize:'13px'}}>
                                    {events.list.length} {events.list.length === 1 ? 'agendado' : 'agendados'}
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </div>
                ) : (
                    <span style={{fontWeight:'500',fontSize:'13px'}}>Nenhum evento próximo</span>
                )}
                <div className="right floated">
                    <Link to={{ pathname: '/new/event/' }}>
                        <Button size='small' style={{fontWeight:'500'}} primary className='mr-0'><Icon name='plus' /> Novo</Button>
                    </Link>
                    { events.length > 6 &&
                        <Link to={{ pathname: '/tbd' }} className='mr-3'>
                            <Button size='small' style={{fontWeight:'500'}}><Icon name='history' /></Button>
                        </Link>
                    }
                </div>
            </div>
            { events.requesting ? (
                <Header textAlign='center' className='mt-5'>
                    <Icon loading name='spinner' size='large' />
                </Header>
            ) : (
                <>
                { !!events.list.length &&
                    <>
                    <List relaxed>
                    {events.list.map((event, key) =>
                        <List.Item key={key}>
                            <Segment.Group>
                                <Segment style={{fontSize:'11px',color:'#949494'}}  className='py-2'>
                                    {event.eventType} com {event.projectName+' · '+event.projectType}
                                </Segment>
                                <Segment className='py-2' size='big'>
                                    <Header as='h5'>
                                        { event.projectPicture ? (
                                            <Image rounded src={event.projectPicture} />
                                        ) : (
                                            <Image rounded src='https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' />
                                        )}
                                        <Header.Content>
                                            {event.title}
                                            <Header.Subheader style={{fontSize:'0.875rem',color: 'grey'}}>
                                                {event.eventDateStart+' às '+event.eventHourStart} {event.city && ' · '+event.city+'/'+event.region}
                                            </Header.Subheader>
                                        </Header.Content>
                                    </Header>
                                    <p style={{fontSize:'12px',fontWeight:'500'}} className='mt-2'>{event.description} <Link to={{ pathname: '/event/?id='+event.eventId }}><nobr>(+ detalhes)</nobr></Link></p>
                                    <div style={{fontSize:'11px',color:'grey'}}  className='py-0'>
                                        { event.authorPicture ? (
                                            <Image as='a' avatar src={event.authorPicture} onClick={() => history.push('/'+event.authorUsername)} />
                                        ) : (
                                            <Image as='a' avatar src='https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' onClick={() => history.push('/'+event.authorUsername)} />
                                        )}
                                        <span>Criado por {event.authorName}</span> <span className="right floated" style={{whiteSpace:'nowrap',width:'135px',overflow:'hidden',textOverflow:'ellipsis',textAlign:'right',paddingTop:'2px'}}>{event.method === 'Presencial' ? <><Icon name='map pin' />{event.placeName ? event.placeName : event.method}</> : <><Icon name='mobile alternate' />{event.method}</>}</span>
                                    </div>
                                    <Modal
                                        size='mini'
                                        open={modalDeclineShow === key}
                                        onClose={() => setModalDeclineShow(false)}
                                    >
                                        <Modal.Content>
                                            <Message warning size='tiny' className='mb-3 p-3'>
                                                Confirme sua ausência no evento "<span style={{fontWeight:'500'}}>{event.title}</span>" de {event.projectName+' ('+event.projectType+')'} em <nobr>{event.eventDateStart}</nobr>
                                            </Message>
                                            <Form>
                                                <Form.TextArea 
                                                    label='Motivo do declínio:' 
                                                    placeholder='Ex: Minha agenda estará comprometida nesta data...'
                                                    value={declineComment}
                                                    onChange={e => setDeclineComment(e.target.value)}
                                                    rows={3}
                                                    maxLength={300}
                                                />
                                            </Form>
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button size='small' onClick={() => setModalDeclineShow(false)}>
                                                Cancelar
                                            </Button>
                                            <Button size='small' negative onClick={() => submitInvitationResponse(key, event.invitationId, 0, currentDate, declineComment)} loading={isLoading === key && true}>
                                                Declinar
                                            </Button>
                                        </Modal.Actions>
                                    </Modal>
                                </Segment>
                                {{  
                                    2:
                                        <>
                                            { isLoading !== key ? (
                                                <Button.Group attached='bottom' size='mini'>
                                                    <Button icon onClick={() => submitInvitationResponse(key, event.invitationId, 1, currentDate, '')}>
                                                        <Icon name='thumbs up outline' color='green' /> Confirmar participação
                                                    </Button>
                                                    <Button icon onClick={() => setModalDeclineShow(key)}>
                                                        <Icon name='thumbs down outline' color='red' /> Declinar
                                                    </Button>
                                                </Button.Group>
                                            ) : (
                                                <Button attached='bottom' size='large' loading />
                                            )}
                                        </>,
                                    1:
                                        <>
                                            { isLoading !== key ? (
                                                <Button.Group attached='bottom' basic size='mini'>
                                                    <Button icon disabled><Icon name='thumbs up outline' color='green' /> Participação confirmada</Button>
                                                    <Button icon onClick={() => submitInvitationResponse(key, event.invitationId, 2, currentDate, '')} loading={isLoading === key && true}><Icon name='undo' />Desfazer</Button>
                                                </Button.Group>
                                            ) : (
                                                <Button attached='bottom' size='large' loading />
                                            )}
                                        </>,
                                    0:
                                        <>
                                            <Button.Group attached='bottom' basic size='mini'>
                                                <Button icon disabled><Icon name='thumbs down outline' color='red' /> Participação recusada</Button>
                                                <Button icon onClick={() => submitInvitationResponse(key, event.invitationId, 2, currentDate, '')} loading={isLoading === key && true}><Icon name='undo' /> Desfazer</Button>
                                            </Button.Group>
                                        </>
                                }[event.response]}
                            </Segment.Group>
                        </List.Item>
                    )}
                    </List>
                </>
                }
                </>
            )}
        </>
    );
};

export default Events;