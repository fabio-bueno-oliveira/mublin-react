import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Comment, Form, Button, Icon, Header, Image } from 'semantic-ui-react';
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

    useEffect(() => { 
        dispatch(userInfos.getInfo());
        window.scrollTo(0,document.body.scrollHeight);
    }, []);

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
  
    useEffect(() => {
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
                setMessages(result);
            },
            (error) => {
                setMessagesLoaded(true);
                setError(error);
            }
        )
    }, [])

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid centered verticalAlign='middle' columns={1} as='main' columns={1} className="container mb-2 px-1 px-md-3">
                <Grid.Row>
                    <Grid.Column mobile={16} computer={10}>
                        <div>
                            <Icon name='arrow left' className='mr-3' onClick={() => history.push("/messages")} /> 
                            <Image src={profileInfo.picture} avatar onClick={() => history.push("/"+profileInfo.username)} />
                            <span>{profileInfo.username}</span>
                        </div>
                        { !messagesLoaded ? (
                            <Header as='h5' className='my-4'>Carregando...</Header>
                        ) : (
                            <Comment.Group>
                                { messages.map((message, key) =>
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
                                )}
                                <Form reply>
                                    <Form.TextArea />
                                    <Button content='Enviar' labelPosition='left' icon='edit' primary size='small' />
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