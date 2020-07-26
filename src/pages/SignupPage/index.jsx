import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usernameCheckInfos } from '../../store/actions/usernameCheck';
import { emailCheckInfos } from '../../store/actions/emailCheck';
import { Form, Button, Header, Grid, Image, Segment, Label } from 'semantic-ui-react';
import { Formik } from 'formik';
import ValidateUtils from '../../utils/ValidateUtils';
import Loader from 'react-loader-spinner';
import './styles.scss'

function LandingPage () {

    const dispatch = useDispatch();

    const checkUsername = (string) => {
        dispatch(usernameCheckInfos.checkUsernameByString(string));
    }

    const checkEmail = (string) => {
        dispatch(emailCheckInfos.checkEmailByString(string));
    }

    const usernameAvailability = useSelector(state => state.usernameCheck);
    const emailAvailability = useSelector(state => state.emailCheck);

    const [isLoading, setIsLoading] = useState(false);

    // const checkUsername = (username) => {
    //     fetch("https://mublin.herokuapp.com/check/username/"+username)
    //     .then(res => res.json())
    //     .then(
    //         (result) => {
    //             if (result.message === "Username "+username+" is available.") {
    //                 setUsernameIsAvailable(true)
    //             } else {
    //                 setUsernameIsAvailable(false)
    //             }
    //         },
    //         (error) => {
    //             console.log("error checking username")
    //         }
    //     )
    // }

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
                        <Segment>
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
                                    password: '',
                                    rePassword: ''
                                }}
                                validate={validate}
                                validateOnMount={true}
                                validateOnBlur={true}
                                onSubmit={(values, { setSubmitting }) => {
                                setIsLoading(true);
                                setTimeout(() => {
                                    setSubmitting(false);
                                    //dispatch(userActions.login(values.email, values.password));
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
                                            required
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
                                            required
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
                                        required
                                        id="email"
                                        name="email"
                                        fluid 
                                        label="Email" 
                                        placeholder="Email"
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
                                        <Label size="mini" color="red" pointing className="mt-0 mb-2">Email já registrado</Label>
                                    }
                                    <Form.Input 
                                        className={usernameAvailability.available === false && "error"}
                                        required
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
                                        }}
                                        onBlur={e => {
                                            handleBlur(e);
                                        }}
                                        value={values.username}
                                        error={touched.username && errors.username ? ( {
                                            content: touched.username ? errors.username : null,
                                            size: "tiny",
                                        }) : null } 
                                        loading={usernameAvailability.requesting}
                                        icon={usernameAvailability.available ? "check" : ""} 
                                        iconPosition={usernameAvailability.requesting || usernameAvailability.available ? "left" : ""} 
                                    />
                                    {usernameAvailability.available === false &&
                                        <Label size="mini" color="red" pointing className="mt-0 mb-2">Username não disponível</Label>
                                    }
                                    <Form.Group widths='equal'>
                                        <Form.Input 
                                            type="password"
                                            required
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
                                            required
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
                    </Grid.Column>
                </Grid>
            </div>
        </main>
        </>
    );
};

export default LandingPage;