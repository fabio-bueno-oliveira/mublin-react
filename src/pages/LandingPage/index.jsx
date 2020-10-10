import React, { useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Grid, Form, Button, Input, Header } from 'semantic-ui-react';
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
        <main className="landingPage">
            <Container>
                <Grid padded as='header'>
                    <Grid.Row columns={1} only='mobile'>
                        <Grid.Column width={17} textAlign='center'>
                            <h1>mublin</h1>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2} only='computer'>
                        <Grid.Column width={3} textAlign='left'>
                            <Link to={{ pathname: "/" }}>
                                <h1>mublin</h1>
                            </Link>
                        </Grid.Column>
                        <Grid.Column width={12} textAlign='right'>
                            <Button 
                                inverted 
                                color='white' 
                                size='medium' 
                                className="mr-2 mt-2"
                                onClick={() => history.push("/login")}
                            > 
                                Entrar
                            </Button>
                            <Button 
                                inverted 
                                color='blue' 
                                size='medium'
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
                        <Header as='h1' inverted>Seus projetos de música, centralizados em um só lugar</Header>
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
                        <div style={{marginTop:'40px'}}>
                            <Link inverted to={{ pathname: "/about" }}>
                                <span style={{fontSize:'12px',fontWeight:'400',color:'#759b9c'}}>
                                    Sobre o Mublin
                                </span>
                            </Link>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={16} textAlign='center' only='mobile'>
                        <Header as='h2' inverted>Informações das suas bandas,<br/> <nobr>centralizadas em um só lugar.</nobr></Header>
                    </Grid.Column>
                </Grid>
                <Grid padded as='footer'>
                    <Grid.Row columns={1} only='mobile' className="mb-4">
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
                        <div style={{marginTop:'26px',textAlign:'center',width:'100%'}}>
                            <Link inverted to={{ pathname: "/about" }}>
                                <span style={{fontSize:'12px',fontWeight:'400',color:'#759b9c'}}>
                                    Sobre o Mublin
                                </span>
                            </Link>
                        </div>
                    </Grid.Row>
                    {/* <Grid.Row columns={1}>
                        <Grid.Column width={16} textAlign='center'>
                            <Link inverted to={{ pathname: "/about" }}>
                                <p>Sobre o Mublin</p>
                            </Link>
                        </Grid.Column>
                    </Grid.Row> */}
                </Grid>
            </Container>
        </main>
        </>
    );
};

export default LandingPage;