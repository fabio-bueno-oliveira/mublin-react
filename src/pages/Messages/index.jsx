import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Header, Comment, Form, Input, Icon } from 'semantic-ui-react';
import { userInfos } from '../../store/actions/user';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';

function MessagesPage () {
 
    document.title = 'Mensagens | Mublin'

    let user = JSON.parse(localStorage.getItem('user'))

    let dispatch = useDispatch()

    let history = useHistory();

    useEffect(() => { 
        dispatch(userInfos.getInfo());
    }, []);

    const userInfo = useSelector(state => state.user);

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />

            <Grid centered verticalAlign='middle' columns={1} as='main' columns={1} className="container mb-2 mt-4 mt-md-5 pt-5">
                <Grid.Row>
                    <Grid.Column mobile={16} computer={10}>
                        <Header as='h2' dividing className='pb-3'>Mensagens</Header>

                        <Comment.Group>
                            <Comment>
                                <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                                <Comment.Content>
                                    <Comment.Author as='a'>Matt</Comment.Author>
                                    <Comment.Metadata>
                                        <div>Today at 5:42PM</div>
                                    </Comment.Metadata>
                                    <Comment.Text>How artistic!</Comment.Text>
                                    <Comment.Actions>
                                        <Comment.Action>Remover</Comment.Action>
                                    </Comment.Actions>
                                </Comment.Content>
                            </Comment>

                            <Comment>
                                <Comment.Avatar src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture} />
                                <Comment.Content>
                                    <Comment.Author as='a'>{userInfo.name+' '+userInfo.lastname}</Comment.Author>
                                    <Comment.Metadata>
                                        <div>Yesterday at 12:30AM</div>
                                    </Comment.Metadata>
                                    <Comment.Text>
                                        <p>This has been very useful for my research. Thanks as well!</p>
                                    </Comment.Text>
                                    <Comment.Actions>
                                        {/* <Comment.Action><Icon name='trash alternate outline' /></Comment.Action> */}
                                        <Comment.Action>Remover</Comment.Action>
                                    </Comment.Actions>
                                </Comment.Content>
                            </Comment>

                            <Comment>
                                <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                                <Comment.Content>
                                    <Comment.Author as='a'>Joe Henderson</Comment.Author>
                                    <Comment.Metadata>
                                        <div>5 days ago</div>
                                    </Comment.Metadata>
                                    <Comment.Text>Dude, this is awesome. Thanks so much</Comment.Text>
                                    <Comment.Actions>
                                        <Comment.Action>Remover</Comment.Action>
                                    </Comment.Actions>
                                </Comment.Content>
                            </Comment>

                            <Form reply>
                                <Input fluid action={{icon:'send',primary:true}} placeholder='Mensagem...' />
                            </Form>
                        </Comment.Group>

                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default MessagesPage;