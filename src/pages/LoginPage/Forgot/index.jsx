import React, { useState } from 'react';
import { useHistory, Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../../store/actions/authentication';
import { Formik } from 'formik';
import ValidateUtils from '../../../utils/ValidateUtils';
import { Button, Input, Header, Form, Message, Segment } from 'semantic-ui-react';
import logo from '../../../assets/img/logos/logo-mublin-circle-black.png';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import '../styles.scss';

function ForgotPasswordPage (props) {

    let history = useHistory();

    const loggedIn = useSelector(state => state.authentication.loggedIn);

    const [loading, setLoading] = useState(false);
    const error = useSelector(state => state.authentication.error);
    const dispatch = useDispatch();

    const validate = values => {
        const errors = {};
  
        if (!values.email) {
            errors.email = 'Informe seu email ou username!';
        } 
        else if (!ValidateUtils.email(values.email)) {
            errors.email = 'Email inválido!'
        }
  
        return errors;
    };

    const sendEmail = (email) => {
        setLoading(true)
        fetch('https://mublin.herokuapp.com/forgotPassword', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email})
        })
        .then((response) => {
            setLoading(false)
            history.push({
                pathname: '/redefine-password'
            })
        }).catch(err => {
            setLoading(false)
            console.error(err)
            alert("Ocorreu um erro ao enviar o link de redefinição de senha. Tente novamente em instantes")
        })
    }

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
        <main className="loginPage ui middle aligned center aligned grid m-0">
            <div className="column">

                {1===2 && 
                    <Message positive>
                        <Message.Header>Email enviado</Message.Header>
                        <p>Email de refinição de senha enviado com sucesso</p>
                    </Message>
                }
                <Header as='h2'>
                    <div className="content">
                        <Link to={{ pathname: "/", state: { fromLogin: true } }}>
                            <img src={logo} alt="Mublin" className="ui mini image mt-0" />    
                        </Link>
                    </div>
                </Header>
                <Header as='h2' className='mt-0'>Esqueci minha senha</Header>
                <Formik
                    initialValues={{ email: '' }}
                    validate={validate}
                    validateOnMount={true}
                    validateOnBlur={true}
                    onSubmit={(values, { setSubmitting }) => {
                    setLoading(true);
                    setTimeout(() => {
                        setSubmitting(false);
                        sendEmail(values.email)
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
                        >
                            <Form.Field
                                fluid
                                type="email"
                                id='email'
                                name="email" 
                                control={Input}
                                label='Digite seu email de cadastro e enviaremos um link pra você redefinir sua senha'
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
                            <Button 
                                type="submit" 
                                secondary fluid 
                                className="mb-3" 
                                disabled={(!values.email || isSubmitting) ? true : false}
                                onClick={handleSubmit}
                            >
                                Enviar
                            </Button>
                            {/* <Link to={{ pathname: "/soon" }}>
                                Não sei meu email cadastrado
                            </Link> */}
                        </Form>
                    )}
                </Formik>
            </div>
        </main>
        </>
    );
};

export default ForgotPasswordPage