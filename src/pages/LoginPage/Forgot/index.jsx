import React, { useState } from 'react';
import { useHistory, Link, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import ValidateUtils from '../../../utils/ValidateUtils';
import { Button, Input, Header, Form, Message, Segment } from 'semantic-ui-react';
import logo from '../../../assets/img/logos/logo-mublin-circle-black.png';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import '../styles.scss';

function ForgotPasswordPage () {

    document.title = 'Esqueci minha senha | Mublin';

    let history = useHistory();

    const loggedIn = useSelector(state => state.authentication.loggedIn);

    const [loading, setLoading] = useState(false);
    const [showMsgSuccess, setShowMsgSuccess] = useState(false);
    const [showMsgError, setShowMsgError] = useState(false);

    const validate = values => {
        const errors = {};
  
        if (!values.email) {
            errors.email = 'Informe seu email';
        } 
        else if (!ValidateUtils.email(values.email)) {
            errors.email = 'Email inválido'
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
        .then(res => res.json())
        .then((result) => {
            setLoading(false)
            if (result.message.includes('No user found with email')) {
                setShowMsgError(true)
                setShowMsgSuccess(false)
            } else {
                setShowMsgSuccess(true)
                setShowMsgError(false)
            }
        }).catch(err => {
            console.error(err)
            setLoading(false)
            setShowMsgError(false)
            setShowMsgSuccess(false)
            alert('Ocorreu um erro inesperado. Tente novamente em instantes.')
        })
    }

    return (
        <>
        { loggedIn &&
            <Redirect to={{ pathname: '/home' }} />
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
                                    size: 'tiny',
                                }) : null }
                            />
                            <Button 
                                type="submit" 
                                secondary fluid 
                                className="mb-3" 
                                disabled={(!values.email || isSubmitting || errors.email) ? true : false}
                                onClick={handleSubmit}
                                loading={loading}
                            >
                                Enviar
                            </Button>
                            {/* <Link to={{ pathname: "/soon" }}>
                                Não sei meu email cadastrado
                            </Link> */}
                        </Form>
                    )}
                </Formik>
                { showMsgSuccess && 
                    <Message positive size='small'>
                        Sucesso! Enviamos em seu email as informações para a redefinição de sua senha
                    </Message>
                }
                { showMsgError &&
                    <Message negative size='small'>
                        Ocorreu um erro. Parece que este email não está cadastrado em nossa base.
                    </Message>
                }
            </div>
        </main>
        </>
    );
};

export default ForgotPasswordPage