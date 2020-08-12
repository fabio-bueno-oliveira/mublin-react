import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/user';
import { useHistory, Link } from 'react-router-dom';
import { Progress, Button, Header, Grid, Image, Segment, Form,  Dropdown, Select, Label, Dimmer, Loader } from 'semantic-ui-react';
import '../styles.scss'

function StartStep2Page () {

    let history = useHistory();

    document.title = "Passo 2 de 4";
    
    const countryOptions = [
        { key: 'br', text: 'Brasil', value: '27' },
    ]

    const regionOptions = [
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

    const dispatch = useDispatch();

    useEffect(() => { 
        dispatch(userInfos.getInfo());
    }, []);

    let user = JSON.parse(localStorage.getItem('user'));

    const userInfo = useSelector(state => state.user);

    const [maxLengthReached, setMaxLengthReached] = useState(false)
    const [queryCities, setQueryCities] = useState([]);

    // form fields
    const [gender, setGender] = useState(userInfo.gender)
    const [bio, setBio] = useState(userInfo.bio)
    const [id_country_fk, setId_country_fk] = useState(userInfo.country)
    const [id_region_fk, setId_region_fk] = useState(userInfo.region)
    const [id_city_fk, setId_city_fk] = useState('')
    // const [isValid, setIsValid] = useState(false)

    const countries = countryOptions.map((country, key) =>
        <option key={key} value={country.value} selected={userInfo.country == country.value ? "selected" : ""} onChange={() => setId_country_fk(country.value)}>{country.text}</option>
    );

    const regions = regionOptions.map((region, key) =>
        <option key={key} value={region.value} selected={userInfo.region == region.value ? "selected" : ""}>{region.text}</option>
    );

    const checkLength = (value, maxLength) => {
        if (value.length === maxLength) {
            setMaxLengthReached(true)
        } else {
            setMaxLengthReached(false)
        }
    } 

    // const checkValid = () => {
    //     if (
    //         gender &&
    //         id_country_fk &&
    //         id_region_fk &&
    //         id_city_fk
    //     ) {
    //         setIsValid(true)
    //     } else {
    //         setIsValid(false)
    //     }
    // }

    const submitForm = () => {
        fetch('https://mublin.herokuapp.com/user/step2', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({userId: userInfo.id, gender: gender, bio: bio, id_country_fk: id_country_fk, id_region_fk: id_region_fk, id_city_fk: id_city_fk})
        })
        .then(res => res.json())
        .then(() => history.push("/start/step3"))
    }

    const searchCity = (keyword) => {
        if (keyword.length > 1) {
            fetch('https://mublin.herokuapp.com/search/cities/'+keyword, {
                method: 'GET'
            })
                .then(res => res.json())
                .then(
                (result) => {
                    setQueryCities(result);
                },
                (error) => {
                    //
                })
        }
    };

    return (
        <>
        <main className="startPage">
            <div className="ui container">
                <Grid centered columns={1} verticalAlign='middle'>
                    <Grid.Column mobile={16} computer={8}>
                        { userInfo.requesting ? ( 
                            <Dimmer active inverted>
                                <Loader inverted content='Carregando...' />
                            </Dimmer>
                        ) : (
                            <Form>
                                <Segment basic textAlign='center' attached="top" style={{ border: 'none' }}>
                                    <Image src='https://mublin.com/img/logo-mublin-circle-black.png' size='mini' centered />
                                    <Header as='h1' className="pb-3">
                                        Passo 2 de 4
                                        <Header.Subheader>
                                            Conte um pouco sobre você
                                        </Header.Subheader>
                                    </Header>
                                    <Progress percent={50} color='green' size='small' />
                                    <Form.Group inline>
                                        <label>Sou</label>
                                        <Form.Radio
                                            name="gender"
                                            label='Homem'
                                            value='m'
                                            checked={gender === 'm'}
                                            onChange={(e, { value }) => setGender(value)}
                                        />
                                        <Form.Radio
                                            name="gender"
                                            label='Mulher'
                                            value='f'
                                            checked={gender === 'f'}
                                            onChange={(e, { value }) => setGender(value)}
                                        />
                                        <Form.Radio
                                            name="gender"
                                            label='Não informar'
                                            value='n'
                                            checked={gender === 'n'}
                                            onChange={(e, { value }) => setGender(value)}
                                        />
                                    </Form.Group>
                                    <Form.TextArea 
                                        id='bio'
                                        name='bio'
                                        label='Bio' 
                                        placeholder='Fale resumidamente sobre você (opcional)' 
                                        maxLength='200'
                                        value={bio}
                                        onChange={(e, { value }) => {
                                            setBio(value)
                                            checkLength(value, 200)
                                        }}
                                    />
                                    { maxLengthReached &&
                                        <Label size="mini" className="mb-3">Tamanho máximo atingido</Label>
                                    }
                                    <Form.Group widths='equal'>
                                        {/* <Form.Field
                                            id="id_country_fk"
                                            name="id_country_fk"
                                            control={Select}
                                            label="País"
                                            options={countryOptions}
                                            placeholder="País"
                                            onChange={(e, { value }) => setId_country_fk(value)}
                                            onBlur={checkValid}
                                            value={id_country_fk}
                                            search
                                        /> */}
                                        { !userInfo.requesting && 
                                            <Form.Field
                                                control='select'
                                                id="id_country_fk"
                                                name="id_country_fk"
                                                label='País' 
                                                onChange={e => setId_country_fk(e.target.options[e.target.selectedIndex].value)}
                                            >
                                                {countries}
                                            </Form.Field>
                                        }
                                        {/* <Form.Field
                                            id="id_region_fk"
                                            name="id_region_fk"
                                            control={Select}
                                            label="Estado"
                                            defaultValue={id_region_fk}
                                            options={regionOptions}
                                            placeholder="Estado"
                                            onChange={(e, { value }) => setId_region_fk(value)}
                                            onBlur={checkValid}
                                            value={id_region_fk}
                                            defaultValue={id_region_fk}
                                            search
                                        /> */}
                                        { !userInfo.requesting && 
                                            <Form.Field
                                                control='select'
                                                id="id_region_fk"
                                                name="id_region_fk"
                                                label='Estado' 
                                                onChange={e => setId_region_fk(e.target.options[e.target.selectedIndex].value)}
                                            >
                                                {regions}
                                            </Form.Field>
                                        }
                                    </Form.Group>             
                                    <Dropdown
                                        id='id_city_fk'
                                        name='id_city_fk'
                                        placeholder='Digite e escolha sua cidade'
                                        fluid
                                        search
                                        selection
                                        options={queryCities}
                                        onChange={(e, { value }) => setId_city_fk(value)}
                                        onSearchChange={e => {
                                            searchCity(e.target.value);
                                        }}
                                        noResultsMessage="Nenhum resultado"
                                    />
                                </Segment>
                                <Segment basic textAlign='center' attached="bottom" style={{ border: 'none' }}>
                                    <Link to={{ pathname: "/start/step1" }} className="mr-2">
                                        <Button size="large">Voltar</Button>
                                    </Link>
                                    <Button 
                                        color="black" 
                                        size="large"
                                        type="submit" 
                                        disabled={(gender && id_country_fk && id_region_fk && id_city_fk) ? false : true}
                                        onClick={submitForm}
                                    >
                                        Avançar
                                    </Button>
                                </Segment>
                            </Form>
                        )}
                    </Grid.Column>
                </Grid>
            </div>
        </main>
        </>
    );
};

export default StartStep2Page;