import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Comment, Form, Button, Icon, Header, Image, Segment, Divider } from 'semantic-ui-react';
import { userInfos } from '../../store/actions/user';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

function ConversationPage (props) {
 
    document.title = 'Conversa | Mublin'

    const profileId = props.match.params.profileId;

    let user = JSON.parse(localStorage.getItem('user'))

    let dispatch = useDispatch()

    let history = useHistory();

    const [messageSubmitted, setMessageSubmitted] = useState(false)

    useEffect(() => {
        dispatch(userInfos.getInfo());
        window.scrollTo(0,document.body.scrollHeight);

        fetch(BASE_URL+"/messages/"+profileId+"/basicInfo", {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            }
        })
        .then(res => res.json())
        .then(
            (result) => {
                setProfileInfoLoaded(true);
                setProfileInfo(result);
            },
            (error) => {
                setProfileInfoLoaded(true);
                setError(error);
            }
        )

        fetch(BASE_URL+"/messages/"+profileId+"/conversation", {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            }
        })
        .then(res => res.json())
        .then(
            (result) => {
                setMessagesLoaded(true);
                if (result.message && result.message.includes('No conversations found')) {
                    // do nothing
                } else {
                    setMessages(result);
                }
            },
            (error) => {
                setMessagesLoaded(true);
                setError(error);
            }
        )
    }, [messageSubmitted]);

    const userInfo = useSelector(state => state.user);

    const BASE_URL = "https://mublin.herokuapp.com";

    const [error, setError] = useState(null);
    const [profileInfoLoaded, setProfileInfoLoaded] = useState(false);
    const [profileInfo, setProfileInfo] = useState([]);
    const [messagesLoaded, setMessagesLoaded] = useState(false);
    const [messages, setMessages] = useState([
        { 
            created: '',
            createdFormatted: '',
            id: '',
            message: '',
            receiverId: '',
            receiverLastname: '',
            receiverName: '',
            receiverUsername: '',
            reveiverPicture: '',
            seen: '',
            senderId: '',
            senderLastname: '',
            senderName: '',
            senderPicture: '',
            senderUsername: '',
            status: ''
        }
    ]);

    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')

    const submitMessage = () => {
        setMessageSubmitted(false)
        setIsLoading(true)
        fetch('https://mublin.herokuapp.com/messages/submitNewMessage/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({receiverId: profileId, message: message})
        })
        .then((response) => {
            setIsLoading(false)
            setMessageSubmitted(true)
            setMessage('')
        }).catch(err => {
            setIsLoading(false)
            console.error(err)
            alert("Ocorreu um erro ao enviar a mensagem. Tente novamente em instantes")
        })
    }

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid centered verticalAlign='middle' columns={1} as='main' columns={1} className="container mb-2 px-1 px-md-3">
                <Grid.Row>
                    <Grid.Column mobile={16} computer={10}>
                        <div>
                            <Icon name='arrow left' onClick={() => history.goBack()} className='cpointer' /> 
                            <Image src={profileInfo.picture} avatar onClick={() => history.push("/"+profileInfo.username)} className='cpointer ml-2'/>
                            <span className='cpointer' onClick={() => history.push("/"+profileInfo.username)}>{profileInfo.username}</span>
                        </div>
                        <Divider />
                        { !messagesLoaded ? (
                            <Header as='h5' className='my-4'>Carregando...</Header>
                        ) : (
                            <Comment.Group>
                                {messages[0].id ? ( messages.map((message, key) =>
                                    <Comment key={key}>
                                        <Comment.Avatar onClick={() => history.push("/"+message.senderUsername)} src={message.senderPicture} style={{cursor:'pointer'}} />
                                        <Comment.Content>
                                            <Comment.Author as='a' onClick={() => history.push("/"+message.senderUsername)}>{message.senderName+' '+message.senderLastname}</Comment.Author>
                                            <Comment.Text style={{fontSize:'11px',opacity:'0.7'}}>
                                                há {formatDistance(new Date(message.createdFormatted * 1000), new Date(), {locale:pt})}
                                            </Comment.Text>
                                            <Comment.Text>{message.message}</Comment.Text>
                                            { !!(user.id === message.senderId && message.seen) &&
                                                <Comment.Text style={{fontSize:'11px',opacity:'0.7'}}><Icon name='check' size='small' color='blue' />Lido</Comment.Text>
                                            }
                                        </Comment.Content>
                                    </Comment>
                                )) : (
                                    <Segment placeholder>
                                        <Header textAlign='center' as='h5' color='grey'>
                                            Nenhuma mensagem por aqui ainda
                                        </Header>
                                    </Segment>
                                )}
                                <Form reply className='pt-3'>
                                    <Form.Input
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        maxLength='600'
                                    />
                                    <Button 
                                        content='Enviar' 
                                        labelPosition='left' 
                                        icon='send' 
                                        primary 
                                        size='small' 
                                        loading={isLoading} 
                                        onClick={() => submitMessage()}
                                    />
                                </Form>
                            </Comment.Group>
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default ConversationPage;