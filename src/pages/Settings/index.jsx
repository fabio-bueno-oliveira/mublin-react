import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import { userInfos } from '../../store/actions/user';
import { Form, Segment, Header, List, Card, Grid, Image, Menu, Button, Icon, Loader as UiLoader } from 'semantic-ui-react';
import { Formik } from 'formik';

function ProfilePage () {

    document.title = 'Configurações | Mublin'

    let history = useHistory();

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(userInfos.getInfo());
    }, []);

    const userInfo = useSelector(state => state.user)

    const countryOptions = [
        { key: 'br', text: 'Brasil', value: '27' },
    ]

    const regionOptions = [
        { key: '', text: 'Selecione...', value: '' },
        { key: 'AC', text: 'Acre', value: '415' },
        { key: 'AL', text: 'Alagoas', value: '422' },
        { key: 'AP', text: 'Amapá', value: '406' },
        { key: 'AM', text: 'Amazonas', value: '407' },
        { key: 'BA', text: 'Bahia', value: '402' },
        { key: 'CE', text: 'Ceará', value: '409' },
        { key: 'DF', text: 'Distrito Federal', value: '424' },
        { key: 'ES', text: 'Espírito Santo', value: '401' },
        { key: 'GO', text: 'Goiás', value: '411' },
        { key: 'MA', text: 'Maranhão', value: '419' },
        { key: 'MT', text: 'Mato Grosso', value: '418' },
        { key: 'MS', text: 'Mato Grosso do Sul', value: '399' },
        { key: 'MG', text: 'Minas Gerais', value: '404' },
        { key: 'PA', text: 'Pará', value: '408' },
        { key: 'PB', text: 'Paraíba', value: '405' },
        { key: 'PR', text: 'Paraná', value: '413' },
        { key: 'PE', text: 'Pernambuco', value: '417' },
        { key: 'PI', text: 'Piauí', value: '416' },
        { key: 'RJ', text: 'Rio de Janeiro', value: '410' },
        { key: 'RN', text: 'Rio Grande do Norte', value: '414' },
        { key: 'RS', text: 'Rio Grande do Sul', value: '400' },
        { key: 'RO', text: 'Rondônia', value: '403' },
        { key: 'RR', text: 'Roraima', value: '421' },
        { key: 'SC', text: 'Santa Catarina', value: '398' },
        { key: 'SP', text: 'São Paulo', value: '412' },
        { key: 'SE', text: 'Sergipe', value: '423' },
        { key: 'TO', text: 'Tocantins', value: '420' },
    ]
    
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

    const [usernameChoosen, setUsernameChoosen] = useState(userInfo.username)
    const usernameAvailability = useSelector(state => state.usernameCheck);
    const emailAvailability = useSelector(state => state.emailCheck);

    let color
    if (usernameChoosen === userInfo.username || usernameAvailability.requesting) {
        color=null
    } else if (usernameChoosen && usernameAvailability.available === false) {
        color="red"
    } else if (usernameChoosen && usernameAvailability.available === true) {
        color="green"
    }

    const validate = values => {
        const errors = {};
  
        if (!values.name) {
            errors.name = 'Campo obrigatório';
        }

        if (!values.lastname) {
            errors.lastname = 'Campo obrigatório';
        }

        if (!values.id_country_fk) {
            errors.id_country_fk = 'Escolha um País';
        }

        if (!values.id_region_fk) {
            errors.id_region_fk = 'Escolha um Estado';
        }
  
        return errors;
    };

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
            <Grid centered verticalAlign='middle' columns={1} className="container mb-2 mt-4 mt-md-5 pt-5">
                <Grid.Row>
                    <Grid.Column mobile={16} computer={10}>
                        <Card style={{ width: "100%" }}>
                            <Card.Content>
                                <Menu fluid pointing secondary widths={3} className='mb-5'>
                                    <Menu.Item as='a' onClick={() => history.push("/settings/profile")}>
                                        Editar perfil
                                    </Menu.Item>
                                    <Menu.Item as='a' onClick={() => history.push("/settings/preferences")}>
                                        Preferências
                                    </Menu.Item>
                                    <Menu.Item as='span' active>
                                        Configurações
                                    </Menu.Item>
                                </Menu>
                                { userInfo.requesting ? (
                                    <UiLoader active inline='centered' size='large' className='my-5' />
                                ) : (
                                    <Formik
                                        initialValues={{ 
                                            name: userInfo.name,
                                            lastname: userInfo.lastname,
                                            gender: userInfo.gender,
                                            id_country_fk: userInfo.country,
                                            id_region_fk: userInfo.region,
                                            website: userInfo.website,
                                            phone_mobile: userInfo.phone,
                                            public: userInfo.public.toString()
                                        }}
                                        validate={validate}
                                        validateOnMount={true}
                                        validateOnBlur={true}
                                        onSubmit={(values, { setSubmitting }) => {
                                        setTimeout(() => {
                                            setSubmitting(false);
                                            // dispatch(userActions.login(values.email, values.password));
                                            // submitForm(values)
                                            alert(JSON.stringify(values, null, 2))
                                        }, 400);
                                        }}
                                    >
                                        {({
                                            values, errors, touched, handleChange, handleSubmit, handleBlur, isValid, isSubmitting
                                        }) => (
                                            <Form loading={isSubmitting}>
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
                                                <Form.Field
                                                    disabled={userInfo.requesting}
                                                    control='select'
                                                    id="gender"
                                                    name="gender"
                                                    label='Gênero'
                                                    value={values.gender}
                                                    onChange={e => {
                                                        handleChange(e);
                                                    }}
                                                >
                                                    <option value='m' selected={values.gender == 'm' ? "selected" : ""} onChange={handleChange}>Masculino</option>
                                                    <option value='f' selected={values.gender == 'f' ? "selected" : ""} onChange={handleChange}>Feminino</option>
                                                    <option value='n' selected={values.gender == 'n' ? "selected" : ""} onChange={handleChange}>Não informar</option>
                                                </Form.Field>
                                                <Form.Input 
                                                    id="phone_mobile"
                                                    name="phone_mobile"
                                                    fluid 
                                                    label="Telefone" 
                                                    placeholder="Telefone"
                                                    onChange={e => {
                                                        handleChange(e);
                                                    }}
                                                    onBlur={handleBlur}
                                                    value={values.phone_mobile}
                                                    error={touched.phone_mobile && errors.phone_mobile ? ( {
                                                        content: touched.phone_mobile ? errors.phone_mobile : null,
                                                        size: "tiny",
                                                    }) : null } 
                                                />
                                                <Form.Input 
                                                    id="website"
                                                    name="website"
                                                    fluid 
                                                    label="Website" 
                                                    placeholder="Website"
                                                    onChange={e => {
                                                        handleChange(e);
                                                    }}
                                                    onBlur={handleBlur}
                                                    value={values.website}
                                                    error={touched.website && errors.website ? ( {
                                                        content: touched.website ? errors.website : null,
                                                        size: "tiny",
                                                    }) : null } 
                                                />
                                                <Form.Group inline className='mb-0'>
                                                    <Form.Radio
                                                        id="public1"
                                                        name="public"
                                                        label='Perfil público'
                                                        value='1'
                                                        checked={values.public === '1' ? true : false}
                                                        onChange={e => {
                                                            handleChange(e);
                                                        }}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Radio
                                                        id="public2"
                                                        name="public"
                                                        label='Perfil privado'
                                                        value='0'
                                                        checked={values.public === '0' ? true : false}
                                                        onChange={e => {
                                                            handleChange(e);
                                                        }}
                                                        onBlur={handleBlur}
                                                    />
                                                </Form.Group>
                                                <span style={{fontSize:'12px'}}>{values.public === '1' ? 'Seu perfil estará visível nas buscas' : 'Seu perfil será privado e visível apenas para suas conexões'}</span>
                                                <Segment>
                                                    <Form.Field>
                                                        <label className='mb-0'>Plano: <span style={{fontWeight:'400'}}>{userInfo.plan}</span> <Button basic size='mini' className='ml-1'>Alterar</Button></label>
                                                    </Form.Field>
                                                </Segment>
                                                <Button 
                                                    className="mt-2"
                                                    type="submit" 
                                                    secondary 
                                                    disabled={isValid ? false : true}
                                                    onClick={handleSubmit}
                                                >
                                                    Salvar
                                                </Button>
                                        </Form>
                                    )}
                                    </Formik>
                                )}
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};

export default ProfilePage;