import React, { useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Grid, Form, Button, Input, Header, Icon } from 'semantic-ui-react';
import './styles.scss';

function LandingPage () {

    const loggedIn = useSelector(state => state.authentication.loggedIn);

    let history = useHistory();

    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        setEmail(e.target.value);
        history.push({
            pathname: '/signup',
            state: { email: email }
        });
    }

    return (
        <>
        { loggedIn &&
            <Redirect to={{ pathname: '/home' }} />
        }
        <main className='landingPage'>
            {/* <Container> */}
                <Grid padded as='header'>
                    <Grid.Row columns={1} only='mobile'>
                        <Grid.Column width={17} textAlign='center'>
                            <h1>mublin</h1>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2} only='tablet computer'>
                        <Grid.Column width={3} textAlign='left'>
                            <Link to={{ pathname: "/" }}>
                                <h1 className='pl-4'>mublin</h1>
                            </Link>
                        </Grid.Column>
                        <Grid.Column width={12} textAlign='right'>
                            <Button 
                                inverted 
                                color='white' 
                                size='large' 
                                className="mr-2 mt-2"
                                onClick={() => history.push("/login")}
                            >
                                Entrar
                            </Button>
                            <Button 
                                inverted 
                                color='blue' 
                                size='large'
                                className="mt-2"
                                onClick={() => history.push("/signup")}
                            >
                                Cadastre-se
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Grid centered columns={1} as='section' id="cta" className="mr-0">
                    <Grid.Column width={8} textAlign='center' only='computer'>
                        <Header as='h1' inverted>Seus projetos de música, <br/>centralizados em um só lugar</Header>
                        <Header as='h3' inverted>Não possui uma conta?<br />Cadastre-se gratuitamente</Header>
                        <Form style={{ display: "flex", justifyContent: "center" }}>
                            <Input 
                                style={{ width: "70%" }}
                                type='email'
                                fluid
                                action={{
                                    color: 'blue',
                                    icon: 'right arrow',
                                    onClick: handleSubmit
                                }}
                                placeholder='cadastre-se com seu email'
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                            />
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={16} textAlign='center' only='mobile tablet'>
                        <Header as='h2' inverted>Seus projetos de música, <br/><nobr>centralizados em um só lugar</nobr></Header>
                    </Grid.Column>
                </Grid>
                <Grid padded as='footer'>
                    <Grid.Row columns={1} only='mobile tablet' style={{marginBottom:'110px'}}>
                        <Grid.Column width={16} textAlign='center'>
                            <Button 
                                inverted 
                                color='white' 
                                size='large' 
                                className="mr-2"
                                onClick={() => history.push("/login")}
                            >
                                Entrar
                            </Button>
                            <Button 
                                inverted 
                                color='blue' 
                                size='large'
                                onClick={() => history.push("/signup")}
                            >
                                Cadastro
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            {/* </Container> */}
        </main>
        <div class="landingPageFooter">
            <Link inverted to={{ pathname: "/about" }}>
                Sobre o Mublin
            </Link>
            <div>
                <a href='https://instagram.com/mublin' target='_blank'>
                    <Icon name='instagram' size='big' />
                </a>
                <span>
                    © 2020 Mublin Brasil
                </span>
            </div>
        </div>
        </>
    );
};

export default LandingPage;