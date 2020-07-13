import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/actions/authentication';
import { Formik } from 'formik';
import ValidateUtils from '../../utils/ValidateUtils';
import { Button, Input, Header, Form, Checkbox } from 'semantic-ui-react';
import logo from '../../assets/img/logos/logo-mublin-circle-black.png';
import Alert from '../../components/alert';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import './styles.scss';

function LoginPage (props) {

    const [loading, setLoading] = useState(false);
    const error = useSelector(state => state.authentication.error);
    const dispatch = useDispatch();

    // // reset login status
    // useEffect(() => { 
    //     dispatch(userActions.logout()); 
    // }, []);

    const validate = values => {
        const errors = {};
  
        if (!values.email) {
            errors.email = 'Informe seu email!';
        } else if (!ValidateUtils.email(values.email)) {
            errors.email = 'Email inválido!'
        }
  
        if (!values.password) {
          errors.password = 'Informe sua senha!';
        }
  
        return errors;
    };

    return (
        <>
        { loading && 
            <Loader
                className="appLoadingIcon"
                type="Audio"
                color="#ff0032"
                height={100}
                width={100}
                // timeout={300} //3 secs
            />
        }
        <main className="loginPage ui middle aligned center aligned grid m-0">
            <div className="column">
                {props.cantLogin && 
                    <Alert 
                        className="alertWrapper"
                        type="error"
                        title="Ops, email ou senha incorretos"
                        text="Verifique os dados e tente novamente."
                    />
                }
                <p>{error}</p>
                <Header as='h2'>
                    <div class="content">
                        <Link to={{ pathname: "/", state: { fromLogin: true } }}>
                            <img src={logo} alt="Mublin" className="ui mini image mt-0" />    
                        </Link>
                    </div>
                </Header>
                <Header as='h2' className='mt-0'>Iniciar Sessão</Header>
                <div class="ui segment">
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        isInitialValid={true}
                        validate={validate}
                        validateOnBlur={true}
                        onSubmit={(values, { setSubmitting }) => {
                        setLoading(true);
                        setTimeout(() => {
                            setSubmitting(false);
                            setLoading(true);
                            dispatch(userActions.login(values.email, values.password));
                        }, 400);
                        }}
                    >
                    {({
                    values, errors, touched, handleChange, handleSubmit, handleBlur, isValid, isSubmitting
                    }) => (

                        <form 
                            onSubmit={handleSubmit}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                handleSubmit();
                                }
                            }}
                        >
                            <div class="ui two column very relaxed stackable grid">
                                <div class="column">
                                    <div class="ui form">
                                        <Form.Field
                                            icon='user' 
                                            iconPosition='left'
                                            type="email"
                                            id='email'
                                            name="email" 
                                            control={Input}
                                            label='Email'
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
                                            icon='lock' 
                                            iconPosition='left'
                                            type="password"
                                            id='password'
                                            name="password" 
                                            control={Input}
                                            label='Senha'
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
                                        />
                                        {/* <Form.Field>
                                            <Checkbox label='Lembrar meus dados' />
                                        </Form.Field> */}
                                        <Button 
                                            type="submit" 
                                            secondary fluid 
                                            className="mb-3" 
                                            disabled={isValid || isSubmitting ? false : true}
                                            onClick={handleSubmit}
                                        >
                                            Entrar
                                        </Button>
                                        <Link to={{ pathname: "/soon", state: { fromLogin: true } }}>
                                            Esqueci minha senha
                                        </Link>
                                    </div>
                                </div>
                                <div class="middle aligned column">
                                    <Link to={{ pathname: "/soon", state: { fromLogin: true } }}>
                                        <Button size="big" primary>Inscrever-se grátis</Button>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    )}
                    </Formik>
                    <div class="ui vertical divider d-none d-lg-block">
                        ou
                    </div>
                </div>
            </div>
        </main>
        </>
    );
};

export default LoginPage