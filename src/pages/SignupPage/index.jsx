import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { usernameCheckInfos } from '../../store/actions/usernameCheck';
import { emailCheckInfos } from '../../store/actions/emailCheck';
import { Form, Button, Header, Grid, Image, Segment, Label, Icon } from 'semantic-ui-react';
import { Formik } from 'formik';
import ValidateUtils from '../../utils/ValidateUtils';
import Loader from 'react-loader-spinner';
import './styles.scss'

function LandingPage () {

    let history = useHistory();

    const dispatch = useDispatch();

    const [checkUsername] = useDebouncedCallback((string) => {
            if (string.length) {
                dispatch(usernameCheckInfos.checkUsernameByString(string));
            }
    },900)

    const [checkEmail] = useDebouncedCallback((string) => {
        dispatch(emailCheckInfos.checkEmailByString(string));
        },900
    )

    const usernameAvailability = useSelector(state => state.usernameCheck);
    const [usernameChoosen, setUsernameChoosen] = useState('')
    const emailAvailability = useSelector(state => state.emailCheck);

    let color
    if (usernameChoosen && usernameAvailability.available === false) {
        color="red"
    } else if (usernameChoosen && usernameAvailability.available === true) {
        color="green"
    }

    const [isLoading, setIsLoading] = useState(false);

    const submitForm = (values) => {
        fetch('https://mublin.herokuapp.com/user/create/', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: values.name, lastname: values.lastname, email: values.email, username: values.username, password: values.password})
        })
        .then(res => res.json())
        // .then(res => localStorage.setItem('user', JSON.stringify(res)))
        .then(
            history.push("/login?info=firstAccess")
        )
    }

    const validate = values => {
        const errors = {};
  
        if (!values.name) {
            errors.name = 'Campo obrigatório';
        }

        if (!values.lastname) {
            errors.lastname = 'Campo obrigatório';
        }

        if (!values.email) {
            errors.email = 'Informe seu email';
        } else if (!ValidateUtils.email(values.email)) {
            errors.email = 'Email inválido'
        }

        if (!values.username) {
            errors.username = 'Escolha um nome de usuário';
        }
  
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

    return (
        <>
        { (isLoading) && 
            <Loader
                className="appLoadingIcon"
                type="Audio"
                color="#ff0032"
                height={100}
                width={100}
                timeout={10000} // 10 secs
            />
        }
        <main className="signupPage">
            <div className="ui container" style={{ height: '100%' }}>
                <Grid centered columns={2} verticalAlign='middle'>
                    <Grid.Column>
                        <Segment attached='top'>
                            <Header as='h2' className="mb-4">
                                <Image
                                    src='https://mublin.com/img/logo-mublin-circle-black.png'
                                    as='a'
                                    size='small'
                                    href='/'
                                />
                                <Header.Content>
                                    Crie sua conta
                                    <Header.Subheader>Preencha os dados abaixo</Header.Subheader>
                                </Header.Content>
                            </Header>
                            <Formik
                                initialValues={{ 
                                    name: '',
                                    lastname: '',
                                    email: '', 
                                    username: '',
                                    password: ''
                                    //rePassword: ''
                                }}
                                validate={validate}
                                validateOnMount={true}
                                validateOnBlur={true}
                                onSubmit={(values, { setSubmitting }) => {
                                setIsLoading(true);
                                setTimeout(() => {
                                    setSubmitting(false);
                                    //dispatch(userActions.login(values.email, values.password));
                                    submitForm(values)
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
                                    <Form.Group widths='equal'>
                                        <Form.Input 
                                            id="name"
                                            name="name"
                                            fluid 
                                            label="Nome" 
                                            placeholder="Nome"
                                            onChange={e => {
                                                handleChange(e);
                                            }}
                                            onBlur={handleBlur}
                                            value={values.name}
                                            error={touched.name && errors.name ? ( {
                                                content: touched.name ? errors.name : null,
                                                size: "tiny",
                                            }) : null } 
                                        />
                                        <Form.Input 
                                            id="lastname"
                                            name="lastname"
                                            fluid 
                                            label="Sobrenome" 
                                            placeholder="Sobrenome"
                                            onChange={e => {
                                                handleChange(e);
                                            }}
                                            onBlur={handleBlur}
                                            value={values.lastname}
                                            error={touched.lastname && errors.lastname ? ( {
                                                content: touched.lastname ? errors.lastname : null,
                                                size: "tiny",
                                            }) : null } 
                                        />
                                    </Form.Group>
                                    <Form.Input 
                                        className={emailAvailability.available === false && "error"}
                                        id="email"
                                        name="email"
                                        fluid 
                                        label="Email" 
                                        placeholder="Email"
                                        loading={emailAvailability.requesting}
                                        onChange={e => {
                                            handleChange(e);
                                        }}
                                        onKeyUp={e => {
                                            checkEmail(e.target.value)
                                        }}
                                        onBlur={e => {
                                            handleBlur(e);
                                        }}
                                        value={values.email}
                                        error={touched.email && errors.email ? ( {
                                            content: touched.email ? errors.email : null,
                                            size: "tiny",
                                        }) : null } 
                                    />
                                    {emailAvailability.available === false &&
                                        <Label 
                                            className="mt-0 mb-2"
                                            size="mini" 
                                            pointing 
                                            color="red"
                                            style={{fontWeight: 'normal', textAlign: 'center'}} 
                                        >
                                            <Icon name="times" /> Email já registrado
                                        </Label>
                                    }
                                    <Form.Input 
                                        className={usernameAvailability.available === false && "error"}
                                        id="username"
                                        name="username"
                                        fluid 
                                        label="Username" 
                                        placeholder="Username"
                                        onChange={e => {
                                            handleChange(e);
                                        }}
                                        onKeyUp={e => {
                                            checkUsername(e.target.value)
                                            setUsernameChoosen(e.target.value)
                                        }}
                                        onBlur={e => {
                                            handleBlur(e);
                                        }}
                                        value={values.username.replace(/[^A-Z0-9]/ig, "").toLowerCase()}
                                        loading={usernameAvailability.requesting}
                                        icon='at'
                                        iconPosition='left'
                                        // error={touched.username && errors.username ? ( {
                                        //     content: touched.username ? errors.username : null,
                                        //     size: "tiny",
                                        // }) : null } 
                                        // icon={usernameAvailability.available ? "check" : ""} 
                                        // iconPosition={usernameAvailability.requesting || usernameAvailability.available ? "left" : ""} 
                                    />
                                    <Label 
                                        className="mt-0 mb-2 mr-2"
                                        size="tiny" 
                                        pointing 
                                        color={color}
                                        style={{fontWeight: 'normal', textAlign: 'center'}} 
                                    >
                                        { (usernameChoosen && usernameAvailability.available) &&
                                            <Icon name="check" /> 
                                        }
                                        mublin.com/{usernameChoosen}
                                    </Label>
                                    {(usernameChoosen && usernameAvailability.available === false) &&
                                        <Label 
                                            className="mt-0 mb-2"
                                            size="mini" 
                                            pointing 
                                            color="red"
                                            style={{fontWeight: 'normal', textAlign: 'center'}} 
                                        >
                                            <Icon name="times" /> 
                                            Username não disponível
                                        </Label>
                                    }
                                    <Form.Group widths='equal'>
                                        <Form.Input 
                                            type="password"
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
                                        />
                                        <Form.Input 
                                            type="password"
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
                                        />
                                    </Form.Group>
                                    <Button 
                                        className="mt-4"
                                        type="submit" 
                                        secondary fluid 
                                        disabled={(isValid && usernameAvailability.available && emailAvailability.available) ? false : true}
                                        onClick={handleSubmit}
                                    >
                                        Continuar
                                    </Button>
                                </Form>
                            )}
                            </Formik>
                        </Segment>
                        <Segment attached='bottom' textAlign='center'>
                            <Link to={{ pathname: "/login" }}>
                                Já tem uma conta? Clique aqui para entrar
                            </Link>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        </main>
        </>
    );
};

export default LandingPage;