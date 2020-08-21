import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Container, Grid, Form, Button, Input, Header } from 'semantic-ui-react';
import './styles.scss';

function LandingPage () {

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
        <main className="landingPage">
            <Container>
                <Grid padded as='header'>
                    <Grid.Row columns={1} only='mobile'>
                        <Grid.Column width={16} textAlign='center'>
                            <h1>mublin</h1>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2} only='computer'>
                        <Grid.Column width={8} textAlign='left'>
                            <Link to={{ pathname: "/" }}>
                                <h1>mublin</h1>
                            </Link>
                        </Grid.Column>
                        <Grid.Column width={8} textAlign='right'>
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
                                Cadastro
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Grid centered columns={1} as='section' id="cta" className="mr-0">
                    <Grid.Column width={6} textAlign='center' only='computer'>
                        <Header as='h2' inverted>Informações das suas bandas,<br/> <nobr>centralizadas em um só lugar.</nobr></Header>
                        <Form>
                            <Input 
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
                                size='medium' 
                                className="mr-2"
                                onClick={() => history.push("/login")}
                            >
                                Entrar
                            </Button>
                            <Button 
                                inverted 
                                color='blue' 
                                size='medium'
                                onClick={() => history.push("/signup")}
                            >
                                Cadastro
                            </Button>
                        </Grid.Column>
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