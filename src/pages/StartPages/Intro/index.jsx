import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/user';
import { Link } from 'react-router-dom';
import { Button, Header, Grid, Image, Segment } from 'semantic-ui-react';
import '../styles.scss'

function StartIntroPage () {

    const dispatch = useDispatch();

    useEffect(() => { 
        dispatch(userInfos.getInfo());
    }, []);

    const userInfo = useSelector(state => state.user);

    return (
        <>
        <main className="startPage">
            <div className="ui container" style={{ height: '100%' }}>
                <Grid centered columns={1} verticalAlign='middle'>
                    <Grid.Column mobile={16} computer={8}>
                        <Segment basic textAlign='center'>
                            <Image src='https://mublin.com/img/logo-mublin-circle-black.png' size='mini' centered />
                            <Header as='h1' className="pb-3">
                                Bem-vindo, {userInfo.name}!
                                <Header.Subheader>
                                    Você está a alguns passos de tornar sua vida de artista mais produtiva. Aproveite!
                                </Header.Subheader>
                            </Header>
                            <Link to={{ pathname: "/start/step1" }}>
                                <Button color="black" size="large">Começar</Button>
                            </Link>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        </main>
        </>
    );
};

export default StartIntroPage;