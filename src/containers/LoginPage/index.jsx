import React from 'react';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import { Button, Input, Header, Form, Checkbox } from 'semantic-ui-react';
import './styles.scss';
import logo from '../../assets/img/logos/logo-mublin-circle-black.png';

function LoginPage () {
    return (
        <>
        <main className="loginPage ui middle aligned center aligned grid m-0">
            <div className="column">
                <Header as='h2'>
                    <div class="content">
                        <Link to={{ pathname: "/", state: { fromLogin: true } }}>
                            <img src={logo} alt="Mublin" className="ui mini image mt-0" />    
                        </Link>
                    </div>
                </Header>
                <Header as='h2' className='mt-0'>Iniciar Sessão</Header>
                <div class="ui segment">
                    <Form>
                        <div class="ui two column very relaxed stackable grid">
                            <div class="column">
                                <div class="ui form">
                                    <Form.Field>
                                        <label for="email">Email</label>
                                        <Input size='small' icon='user' iconPosition='left' id="email" />
                                    </Form.Field>
                                    <Form.Field>
                                        <label for="password">Senha</label>
                                        <Input type="password" size='small' icon='lock' iconPosition='left' id="password" />
                                    </Form.Field>
                                    <Form.Field>
                                        <Checkbox label='Lembrar meus dados' />
                                    </Form.Field>
                                    <Button secondary fluid className="mb-3">Entrar</Button>
                                    <Link to={{ pathname: "/soon", state: { fromLogin: true } }}>
                                        Esqueci minha senha
                                    </Link>
                                </div>
                            </div>
                            <div class="middle aligned column">
                                <Link to={{ pathname: "/soon", state: { fromLogin: true } }}>
                                    <Button size="big">Inscrever-se grátis</Button>
                                </Link>
                            </div>
                        </div>
                    </Form>
                    <div class="ui vertical divider d-none d-lg-block">
                        ou
                    </div>
                </div>
            </div>
        </main>
        </>
    );
};

export default LoginPage;