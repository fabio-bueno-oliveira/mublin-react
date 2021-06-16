import React, { useState } from 'react';
import { useHistory, Redirect, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Grid, Form, Button, Input, Header, Icon, Message } from 'semantic-ui-react';
import { Formik } from 'formik';
import { userActions } from '../../store/actions/authentication';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import './styles.scss';

function LandingPage (props) {

    document.title = 'Mublin — Otimize sua rotina na música';

    const loggedIn = useSelector(state => state.authentication.loggedIn);

    const error = useSelector(state => state.authentication.error);

    let history = useHistory();

    const dispatch = useDispatch();

    const query = new URLSearchParams(props.location.search);

    const urlInfo = query.get('info')

    const [loading, setLoading] = useState(false);

    const [hidePassword, setHidePassword] = useState(true);

    // const validate = values => {
    //     const errors = {};
  
    //     // if (!values.email) {
    //     //     errors.email = 'Informe seu email ou username!';
    //     // } 
    //     // else if (!ValidateUtils.email(values.email)) {
    //     //     errors.email = 'Email inválido!'
    //     // }
  
    //     // if (!values.password) {
    //     //   errors.password = 'Informe sua senha!';
    //     // }
  
    //     return errors;
    // };

    return (
        <>
        { loggedIn &&
            <Redirect to={{ pathname: '/home' }} />
        }
        { (loading && !error) && 
            <Loader
                className="appLoadingIcon"
                type="Audio"
                color="#ffffff"
                height={100}
                width={100}
                timeout={30000} //30 secs
            />
        }
        <main className='landingPage'>
            <Container style={{ height: '100%' }}>
                <Grid padded verticalAlign='middle' columns={2} stackable>
                    <Grid.Row className='p-4'>
                        <Grid.Column mobile={16} tablet={10} computer={10}>
                            <Header as='h1'>
                                <Icon name='heartbeat' />
                                <Header.Content>mublin</Header.Content>
                            </Header>
                            <Header as='h2' className='mt-0 mb-3 mb-md-0' inverted>Seus projetos de música, <br/>centralizados em um só lugar</Header>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={6} computer={6} className='formWrapper px-0 px-md-5'>
                            <Formik
                                initialValues={{ email: '', password: '' }}
                                // validate={validate}
                                validateOnMount={true}
                                validateOnBlur={true}
                                onSubmit={(values, { setSubmitting }) => {
                                setLoading(true);
                                setTimeout(() => {
                                    setSubmitting(false);
                                    dispatch(userActions.login(values.email, values.password));
                                }, 400);
                                }}
                            >
                                {({
                                    values, errors, touched, handleChange, handleSubmit, handleBlur, isValid, isSubmitting
                                }) => (
                                    <Form
                                        onSubmit={handleSubmit}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                            handleSubmit();
                                            }
                                        }}
                                        className='px-4 px-md-0'
                                    >
                                        <Header as='h2' inverted color='grey'>Entrar</Header>
                                        { urlInfo === "firstAccess" &&
                                            <Message
                                                color='green'
                                                header='Cadastro efetuado com sucesso!'
                                                content='Para acessar, digite abaixo os dados de login'
                                            />
                                        }
                                        {error && 
                                            <Message
                                                color='red'
                                                header={error}
                                                content='Verifique os dados e tente novamente'
                                            />
                                        }
                                        <Form.Field
                                            inverted
                                            size='medium'
                                            id='email'
                                            name="email" 
                                            control={Input}
                                            placeholder='Nome de usuário ou email'
                                            onChange={e => {
                                                handleChange(e);
                                            }}
                                            onBlur={handleBlur}
                                            value={values.email}
                                            error={touched.email && errors.email ? ( {
                                                content: touched.email ? errors.email : null,
                                                pointing: 'below',
                                                size: 'tiny',
                                            }) : null }
                                        />
                                        <Form.Field
                                            inverted
                                            size='medium'
                                            type={hidePassword ? 'password' : 'text'}
                                            id='password'
                                            name="password" 
                                            control={Input}
                                            placeholder='Senha'
                                            onChange={e => {
                                                handleChange(e);
                                            }}
                                            onBlur={handleBlur}
                                            value={values.password}
                                            error={touched.password && errors.password ? ( {
                                                content: touched.password ? errors.password : null,
                                                pointing: 'below',
                                                size: 'tiny',
                                            }) : null }
                                            icon={{ name: hidePassword?'eye':'eye slash', link: true, onClick:() => setHidePassword(value => !value) }}
                                        />
                                        {/* <Form.Field>
                                            <Checkbox label='Lembrar meus dados' />
                                        </Form.Field> */}
                                        <Link to={{ pathname: "/forgot-password" }}>
                                            Esqueci minha senha
                                        </Link>
                                        <Button 
                                            type="submit" 
                                            fluid 
                                            primary 
                                            className="my-4" 
                                            disabled={(!values.email || !values.password || isSubmitting) ? true : false}
                                            size="medium"
                                        >
                                            Entrar
                                        </Button>
                                        <Link to="/signup">Cadastre-se gratuitamente</Link>
                                    </Form>
                                )}
                            </Formik>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
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