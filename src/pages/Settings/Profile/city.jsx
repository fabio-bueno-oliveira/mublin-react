import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import HeaderDesktop from '../../../components/layout/headerDesktop';
import { userInfos } from '../../../store/actions/user';
import { usernameCheckInfos } from '../../../store/actions/usernameCheck';
import { emailCheckInfos } from '../../../store/actions/emailCheck';
import { Form, Header, Segment, Select, Dropdown, List, Card, Grid, Image, Icon, Menu, Button, Label, Dimmer, Loader as UiLoader } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';
import { Formik } from 'formik';
import ValidateUtils from '../../../utils/ValidateUtils';
import { useDebouncedCallback } from 'use-debounce';
import './styles.scss';

function ProfilePage (props) {

    document.title = 'Editar perfil | Mublin'

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

    const [regionSelected, setRegionSelected] = useState('teste:'+String(userInfo.region))

    const [maxLengthReached, setMaxLengthReached] = useState(false)
    const [queryCities, setQueryCities] = useState([]);
    const [citySearchIsLoading, setCitySearchIsLoading] = useState(false)

    const [searchCity] = useDebouncedCallback((keyword,id_region_fk) => {
        if (keyword.length > 1) {
            setCitySearchIsLoading(true)
            fetch('https://mublin.herokuapp.com/search/cities/'+keyword+'/'+id_region_fk, {
                method: 'GET'
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.length) {
                            setQueryCities(result);
                        }
                        setCitySearchIsLoading(false)
                    },
                    (error) => {
                        setCitySearchIsLoading(false)
                        alert("Ocorreu um erro ao tentar pesquisar a cidade")
                })
        }
    },800);  

    const [isLoading, setIsLoading] = useState(false)
    
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

    const usernameAvailability = useSelector(state => state.usernameCheck);
    const [usernameChoosen, setUsernameChoosen] = useState(userInfo.username)
    const emailAvailability = useSelector(state => state.emailCheck);

    let color
    if (usernameChoosen === userInfo.username || usernameAvailability.requesting) {
        color=null
    } else if (usernameChoosen && usernameAvailability.available === false) {
        color="red"
    } else if (usernameChoosen && usernameAvailability.available === true) {
        color="green"
    }

    const [checkUsername] = useDebouncedCallback((string) => {
        if (string.length && string !== userInfo.username) {
            dispatch(usernameCheckInfos.checkUsernameByString(string));
        }
    },900)

    const [checkEmail] = useDebouncedCallback((string) => {
        if (string !== userInfo.email) {
            dispatch(emailCheckInfos.checkEmailByString(string));
        }
    },900)

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
        {isLoading && 
            <Loader
                className="appLoadingIcon"
                type="Audio"
                color="#ff0032"
                height={100}
                width={100}
                timeout={10000} //10 secs
            />
        }
        <HeaderDesktop />
            <Grid centered columns={1} className="container mb-2 mt-4 mt-md-5 pt-5">
                <Grid.Row>
                    <Grid.Column width={12}>
                        <Card style={{ width: "100%" }}>
                            <Card.Content>
                                <Menu fluid pointing secondary widths={3} className='mb-3'>
                                    <Menu.Item as='a' active>
                                        Editar perfil
                                    </Menu.Item>
                                    <Menu.Item as='a'>
                                        Preferências artísticas
                                    </Menu.Item>
                                    <Menu.Item as='a'>
                                        Configurações
                                    </Menu.Item>
                                </Menu>
                                <List bulleted horizontal link className='mb-4'>
                                    <List.Item as='a' active>Informações básicas</List.Item>
                                    <List.Item as='a'>Foto</List.Item>
                                    <List.Item as='a'>Senha</List.Item>
                                </List>
                                
                                <section id='pictureUpdate' className='mb-4'>
                                    <Header as='h2'>
                                        { !userInfo.picture ? (
                                            <Image centered src='https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' />
                                        ) : (
                                            <Image circular centered src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture} />
                                        )}
                                        <Header.Content>
                                            {userInfo.username}
                                            <Header.Subheader as='a' onClick={() => history.push("/settings/profile/picture")}>Alterar foto</Header.Subheader>
                                        </Header.Content>
                                    </Header>
                                </section>

                                { userInfo.requesting ? (
                                    <UiLoader active inline='centered' size='large' className='my-5' />
                                ) : (
                                    <Formik
                                        initialValues={{ 
                                            name: userInfo.name,
                                            lastname: userInfo.lastname,
                                            gender: userInfo.gender,
                                            email: userInfo.email, 
                                            username: userInfo.username,
                                            id_country_fk: userInfo.country,
                                            id_region_fk: userInfo.region
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
                                                onChange={e => {
                                                    checkEmail(values.email)
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
                                                <Form.Group inline>
                                                    <label>Sexo</label>
                                                    <Form.Radio
                                                        id="gender1"
                                                        name="gender"
                                                        label='Masculino'
                                                        value='m'
                                                        checked={values.gender === 'm'}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Radio
                                                        id="gender2"
                                                        name="gender"
                                                        label='Feminino'
                                                        value='f'
                                                        checked={values.gender === 'f'}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Radio
                                                        id="gender3"
                                                        name="gender"
                                                        label='Não informar'
                                                        value='n'
                                                        checked={values.gender === 'n'}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                </Form.Group>
                                                <Form.Input 
                                                    className={(emailAvailability.available === false && values.email !== userInfo.email) && "error"}
                                                    disabled={emailAvailability.requesting}
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
                                                {(emailAvailability.available === false && values.email !== userInfo.email) &&
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
                                                    disabled={usernameAvailability.requesting}
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
                                                    mublin.com/{values.username}
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
                                                    <Form.Field
                                                        disabled={userInfo.requesting}
                                                        control='select'
                                                        id="id_country_fk"
                                                        name="id_country_fk"
                                                        label={'País'+values.id_country_fk}
                                                        value={values.id_country_fk}
                                                        onChange={e => {
                                                            handleChange(e);
                                                        }}
                                                    >
                                                        {countryOptions.map((country, key) =>
                                                            <option key={key} value={country.value} selected={values.id_country_fk == country.value ? "selected" : ""} onChange={() => handleChange(country.value)}>{country.text}</option>
                                                        )}
                                                    </Form.Field>
                                                    <Form.Field
                                                        control='select'
                                                        id="id_region_fk"
                                                        name="id_region_fk"
                                                        label={'Estado'+values.id_region_fk}
                                                        value={values.id_region_fk}
                                                        onChange={e => {
                                                            handleChange(e);
                                                            setRegionSelected(e.target.value)
                                                        }}
                                                    >
                                                        {regionOptions.map((region, key) =>
                                                            <option key={key} value={region.value} selected={values.id_region_fk == region.value ? "selected" : ""} >{region.text}</option>
                                                        )}
                                                    </Form.Field>
                                                </Form.Group>
                                                <label>{'City: '+values.id_city_fk}</label>
                                                {/* <Dropdown
                                                    item
                                                    id='id_city_fk'
                                                    name='id_city_fk'
                                                    placeholder='Digite e escolha sua cidade'
                                                    fluid
                                                    search
                                                    selection
                                                    options={queryCities}
                                                    // onChange={handleChange}
                                                    // onBlur={handleBlur}
                                                    // onChange={(e, { value }) => handleChange(value)}
                                                    // onChange={e => {
                                                    //     // handleChange(e.target.value);
                                                    //     alert(e);
                                                    // }}
                                                    //onChange={(e, { value }) => handleChange(e)}
                                                    // onChange={e => {
                                                    //     handleChange(e.target.value);
                                                    // }}
                                                    onSearchChange={e => {
                                                        searchCity(e.target.value,values.id_region_fk);
                                                    }}
                                                    onChange={(e, { value }) => {
                                                        handleChange(e);
                                                    }}
                                                    //onChange={(e, { value }) => setId_city_fk(value)}
                                                    noResultsMessage="Digite e selecione na lista"
                                                    loading={citySearchIsLoading}
                                                    disabled={!values.id_region_fk ? true : false}
                                                    // defaultValue={values.id_city_fk}
                                                    defaultSearchQuery={userInfo.cityName}
                                                /> */}
                                                <h1>Region selected: {regionSelected}</h1>
                                                <Form.Field 
                                                    label='An HTML <select>' 
                                                    control='select'
                                                    id='id_city_fk'
                                                    name='id_city_fk'
                                                    onChange={e => {
                                                        handleChange(e);
                                                    }}
                                                >
                                                    <option value='male'>Male</option>
                                                    <option value='female'>Female</option>
                                                </Form.Field>
                                                <Button 
                                                    className="my-4"
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