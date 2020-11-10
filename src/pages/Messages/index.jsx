import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Header, Comment, Form, Input, Divider, Icon, Label } from 'semantic-ui-react';
import { userInfos } from '../../store/actions/user';
import { messagesInfos } from '../../store/actions/messages';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

function MessagesPage () {
 
    document.title = 'Mensagens | Mublin'

    let user = JSON.parse(localStorage.getItem('user'))

    let dispatch = useDispatch()

    let history = useHistory();

    useEffect(() => { 
        dispatch(userInfos.getInfo());
        dispatch(messagesInfos.getUserMessages());
    }, []);

    const userInfo = useSelector(state => state.user);
    const conversations = useSelector(state => state.messages);

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid centered verticalAlign='middle' columns={1} as='main' columns={1} className="container mb-2 px-1 px-md-3">
                <Grid.Row>
                    <Grid.Column mobile={16} computer={10}>
                        <Header as='h2' dividing className='pb-3'>Mensagens</Header>
                        { conversations.requesting ? (
                            <Header as='h5' className='my-4'>Carregando...</Header>
                        ) : (
                            <Comment.Group>
                                { conversations.recentConversations.map((conversation, key) =>
                                    <>
                                        <Comment key={key} onClick={() => history.push("/messages/conversation/"+conversation.senderId)}>
                                            <Comment.Avatar src={conversation.senderPicture} />
                                            <Comment.Content>
                                                <Comment.Author as='a' onClick={() => history.push("/messages/conversation/"+conversation.senderId)}>{conversation.senderName+' '+conversation.senderLastname}</Comment.Author>
                                                <Comment.Text className='pt-1' style={ !conversation.lastMessageSeen ? { fontWeight:'500'} : {}}>
                                                    {conversation.lastMessage.substring(0, 150) + '...'}
                                                </Comment.Text>
                                                <Comment.Text style={{fontSize:'11px',opacity:'0.7'}}>
                                                    há {formatDistance(new Date(conversation.lastMessageCreatedFormatted * 1000), new Date(), {locale:pt})}
                                                </Comment.Text>
                                                {/* <Comment.Text>
                                                    {conversation.lastMessageSeen ? <nobr><Label size='mini'><Icon name='checkmark' color={conversation.lastMessageSeen ? 'green' : 'grey'} />Lida</Label></nobr> : <Label size='mini'>Não lida</Label>}
                                                </Comment.Text> */}
                                                {/* <Comment.Actions>
                                                    <Comment.Action onClick={() => history.push("/messages/conversation/"+conversation.senderId)}>Ver conversa</Comment.Action>
                                                    <Comment.Action>Apagar conversa</Comment.Action>
                                                </Comment.Actions> */}
                                            </Comment.Content>
                                        </Comment>
                                        <Divider />
                                    </>
                                )}
                            </Comment.Group>
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default MessagesPage;