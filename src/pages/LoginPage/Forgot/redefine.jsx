import React, { useState } from 'react';
import { useHistory, Link, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Button, Header, Form, Message } from 'semantic-ui-react';
import logo from '../../../assets/img/logos/logo-mublin-circle-black.png';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import '../styles.scss';

function RedefinePasswordPage () {

    document.title = 'Esqueci minha senha | Mublin';

    let hash = (new URLSearchParams(window.location.search)).get("hash")
    let email = (new URLSearchParams(window.location.search)).get("email")

    let history = useHistory();

    const [loading, setLoading] = useState(false);
    const [hidePassword1, setHidePassword1] = useState(true)
    const [hidePassword2, setHidePassword2] = useState(true)
    const error = useSelector(state => state.authentication.error);
    const [success, setSuccess] = useState(false)

    const validate = values => {
        const errors = {};
  
        if (!values.password) {
            errors.password = 'Informe sua senha';
        } else if (values.password.length < 4) {
            errors.password = 'Senha muito curta';
        }

        if (!values.repassword) {
            errors.repassword = 'Confirme sua senha';
        } else if (values.password !== values.repassword) {
            errors.repassword = 'As senhas não conferem'
        }
  
        return errors;
    };

    const submitNewPassword = (password) => {
        setLoading(true)
        fetch('https://mublin.herokuapp.com/userInfo/changePasswordbyHash', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email, hash: hash, newPassword: password})
        })
        .then((response) => {
            setLoading(false)
            setSuccess(true)
        }).catch(err => {
            setLoading(false)
            console.error(err)
            alert("Ocorreu um erro ao redefinir sua senha. Tente novamente em instantes")
        })
    }

    return (
        <>
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
                <Header as='h2' className='mt-0'>Redefinir minha senha</Header>
                { !success ? (
                    (hash && email) ? (
                    <Formik
                        initialValues={{ password: '' }}
                        validate={validate}
                        validateOnMount={true}
                        validateOnBlur={true}
                        onSubmit={(values, { setSubmitting }) => {
                            setLoading(true);
                            setTimeout(() => {
                                setSubmitting(false);
                                submitNewPassword(values.password)
                            }, 400);
                        }}
                    >
                        {({
                            values, errors, touched, handleChange, handleSubmit, handleBlur, isValid, isSubmitting
                        }) => (
                            <Form
                                onSubmit={handleSubmit}
                            >
                                <Form.Input 
                                    type={hidePassword1 ? 'password' : 'text'}
                                    id="password"
                                    name="password"
                                    fluid 
                                    label="Senha" 
                                    placeholder="Senha"
                                    onChange={e => {
                                        handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    error={touched.password && errors.password ? ( {
                                        content: touched.password ? errors.password : null,
                                        size: "tiny",
                                    }) : null } 
                                    icon={{ name: hidePassword1?'eye':'eye slash', link: true, onClick:() => setHidePassword1(value => !value) }}
                                />
                                <Form.Input 
                                    type={hidePassword2 ? 'password' : 'text'}
                                    id="repassword"
                                    name="repassword"
                                    fluid 
                                    label="Confirme a senha" 
                                    placeholder="Confirme a senha"
                                    onChange={e => {
                                        handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    value={values.repassword}
                                    error={touched.repassword && errors.repassword ? ( {
                                        content: touched.repassword ? errors.repassword : null,
                                        size: "tiny",
                                    }) : null }
                                    icon={{ name: hidePassword2?'eye':'eye slash', link: true, onClick:() => setHidePassword2(value => !value) }}
                                />
                                <Button 
                                    type="submit" 
                                    secondary fluid 
                                    className="mb-3" 
                                    disabled={(!values.password || !values.repassword || (values.password !== values.repassword)) ? true : false}
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
                    ) : (
                        <Message error>Houve algum erro, ou talvez a solicitação tenha expirado.</Message>
                    )
                ) : (
                    <div className='textCenter'> 
                        <Message positive>Senha atualizada com sucesso!</Message>
                        <Button positive onClick={() => history.push("/login")}>Ir para login</Button>
                    </div>
                )}                
            </div>
        </main>
        </>
    );
};

export default RedefinePasswordPage;