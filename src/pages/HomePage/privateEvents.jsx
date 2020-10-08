import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { eventsInfos } from '../../store/actions/events';
import { Header, Card, List, Image, Icon, Button, Label, Segment, Form, Modal, Message } from 'semantic-ui-react';

const PublicEvents = (props) => {

    let history = useHistory();

    let dispatch = useDispatch();

    let currentDate = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0].replace('T',' ')

    const user = JSON.parse(localStorage.getItem('user'));
    
    const [isLoading, setIsLoading] = useState(null)

    const privateEvents = props.privateEvents

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
            <Card id="privateEvents" style={{width:'100%',backgroundColor:'transparent',boxShadow:'none'}}>
                <Card.Content style={{paddingTop:'0px'}}>
                    <Image src='https://ik.imagekit.io/mublin/tr:r-8,w-300,h-80,c-maintain_ratio/misc/music/home-banners/drum-sticks_Xb6XYhVdx.png' fluid className="mb-3" />
                    <Card.Header className="ui mt-0 mb-3">Ensaios, Reuniões e Gravações</Card.Header>
                    <Card.Description className="mb-3">
                        { privateEvents.length ? (
                            <span style={{fontWeight:'500',fontSize:'13px'}}>{privateEvents.length} agendados</span>
                        ) : (
                            <span style={{fontWeight:'500',fontSize:'13px'}}>Nenhum evento privado próximo</span>
                        )}
                        <div className="right floated">
                            <Link to={{ pathname: '/tbd' }}>
                                <Label size='small' style={{fontWeight:'500'}}><Icon name='plus' /> Criar novo</Label>
                            </Link>
                            { privateEvents.length > 6 &&
                                <Link to={{ pathname: '/tbd' }} className='mr-3'>
                                    <Label size='small' style={{fontWeight:'500'}}><Icon name='history' /></Label>
                                </Link>
                            }
                        </div>
                    </Card.Description>
                    <Card.Description>
                        { props.requesting ? (
                            <Header textAlign='center' className='mt-5'>
                                <Icon loading name='spinner' size='large' />
                            </Header>
                        ) : (
                            <>
                            { !!privateEvents.length &&
                                <>
                                <h4 className='ui sub header mt-1 mb-3'>Próximos:</h4>
                                <List relaxed>
                                {privateEvents.map((event, key) =>
                                    <List.Item key={key}>
                                        <Segment.Group>
                                            <Segment style={{fontSize:'11px',color:'#949494'}}  className='py-2'>
                                                {event.eventType} com {event.projectName+' · '+event.projectType}
                                            </Segment>
                                            <Segment className='py-2'>
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
                                                <p style={{fontSize:'12px',fontWeight:'500'}} className='mt-2'>{event.description}</p>
                                                <div style={{fontSize:'11px',color:'grey'}}  className='py-0'>
                                                    { event.authorPicture ? (
                                                        <Image as='a' avatar src={event.authorPicture}  onClick={() => history.push('/'+event.authorUsername)} />
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
                                                        <Button size='small' color='black' onClick={() => submitInvitationResponse(key, event.invitationId, 0, currentDate, declineComment)} loading={isLoading === key && true}>
                                                            Enviar
                                                        </Button>
                                                    </Modal.Actions>
                                                </Modal>
                                            </Segment>
                                            {{  
                                                2:
                                                    <>
                                                        { isLoading !== key ? (
                                                            <Button.Group attached='bottom' size='mini'>
                                                                <Button positive icon onClick={() => submitInvitationResponse(key, event.invitationId, 1, currentDate, '')}>
                                                                    <Icon name='thumbs up outline' /> Confirmar participação
                                                                </Button>
                                                                <Button negative icon onClick={() => setModalDeclineShow(key)}>
                                                                    <Icon name='thumbs down outline' /> Declinar
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
                    </Card.Description>
                </Card.Content>
            </Card>
        </>
    );
};

export default PublicEvents;