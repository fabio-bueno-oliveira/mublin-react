import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/users';
import { useHistory, Link } from 'react-router-dom';
import { Progress, Button, Header, Grid, Image, Segment, Form,  Dropdown, Select, Label } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';
import '../styles.scss'

function StartStep2Page () {

    let history = useHistory();

    document.title = "Passo 2 de 4";

    const genderOptions = [
        { key: 'm', text: 'Homem', value: 'm' },
        { key: 'f', text: 'Mulher', value: 'f' },
        { key: 'o', text: 'Não informar', value: 'n' }
    ]
    
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
        { key: 'PA', text: 'Pará', value: 'Pará' },
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

    const [isLoading, setIsLoading] = useState(false)

    const [items, setItems] = useState([]);

    // form fields
    const [gender, setGender] = useState('')
    const [bio, setBio] = useState('')
    const [id_country_fk, setId_country_fk] = useState('')
    const [id_region_fk, setId_region_fk] = useState('')
    const [id_city_fk, setId_city_fk] = useState('')

    const [isValid, setIsValid] = useState(false)

    const checkValid = () => {
        if (
            gender &&
            id_country_fk &&
            id_region_fk &&
            id_city_fk
        ) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }

    const submitForm = (values) => {
        setIsLoading(true)
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
        .then(() => history.push("/start/step1"))
    }

    const searchCity = (keyword) => {
        fetch('https://mublin.herokuapp.com/search/cities/'+keyword, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(
            (result) => {
                console.log(97, result);
                setItems(result);
            },
            (error) => {
                //
            })
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
                //timeout={10000} //10 secs
            />
        }
        <main className="startPage">
            <div className="ui container">
                <Grid centered columns={1} verticalAlign='middle'>
                    <Grid.Column mobile={16} computer={8}>
                        <Form>
                            <Segment basic textAlign='center' attached="top" style={{ border: 'none' }}>
                                <Image src='https://mublin.com/img/logo-mublin-circle-black.png' size='mini' centered />
                                <Header as='h1' className="pb-3">
                                    Passo 2 de 4
                                    <Header.Subheader>
                                        Conte um pouco sobre você
                                    </Header.Subheader>
                                </Header>
                                <Progress percent={50} color='green'/>
                                <Form.Field
                                    id="gender"
                                    name="gender"
                                    control={Select}
                                    label="Eu sou..."
                                    options={genderOptions}
                                    placeholder="Eu sou..."
                                    onChange={(e, { value }) => setGender(value)}
                                    onBlur={checkValid}
                                    value={gender}
                                />
                                <Form.TextArea 
                                    label='Bio' 
                                    placeholder='Fale resumidamente sobre você (opcional)' 
                                    maxLength='200'
                                    id='bio'
                                    name='bio'
                                    value={bio}
                                    onChange={(e, { value }) => setBio(value)}
                                    // onChange={e => {setBio(e)}}
                                    onBlur={checkValid}
                                />
                                { bio.length === 200 &&
                                    <Label size="mini" className="mb-3">Tamanho máximo atingido</Label>
                                }
                                <Form.Group widths='equal'>
                                    <Form.Field
                                        id="id_country_fk"
                                        name="id_country_fk"
                                        control={Select}
                                        label="País"
                                        options={countryOptions}
                                        placeholder="País"
                                        onChange={(e, { value }) => setId_country_fk(value)}
                                        onBlur={checkValid}
                                        value={id_country_fk}
                                    />
                                    <Form.Field
                                        id="id_region_fk"
                                        name="id_region_fk"
                                        control={Select}
                                        label="Estado"
                                        options={regionOptions}
                                        placeholder="Estado"
                                        onChange={(e, { value }) => setId_region_fk(value)}
                                        onBlur={checkValid}
                                        value={id_region_fk}
                                    />
                                </Form.Group>                     
                                <Dropdown
                                    id='id_city_fk'
                                    name='id_city_fk'
                                    placeholder='Digite e escolha sua cidade'
                                    fluid
                                    search
                                    selection
                                    options={items}
                                    onChange={(e, { value }) => setId_city_fk(value)}
                                    onSearchChange={e => {
                                        searchCity(e.target.value);
                                    }}
                                    onBlur={checkValid}
                                    noResultsMessage="Nenhum resultado"
                                />
                            </Segment>
                            <Segment basic textAlign='center' attached="bottom" style={{ border: 'none' }}>
                                <Link to={{ pathname: "/start/step1" }} className="mr-2">
                                    <Button size="large">Voltar</Button>
                                </Link>
                                <Link to={{ pathname: "/start/step2" }}>
                                    <Button 
                                        color="black" 
                                        size="large"
                                        type="submit" 
                                        disabled={isValid ? false : true}
                                        onClick={submitForm}
                                    >
                                        Avançar
                                    </Button>
                                </Link>
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        </main>
        </>
    );
};

export default StartStep2Page;