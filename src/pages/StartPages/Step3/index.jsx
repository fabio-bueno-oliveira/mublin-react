import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/users';
import { miscInfos } from '../../../store/actions/misc';
import { useHistory, Link } from 'react-router-dom';
import { Progress, Button, Header, Grid, Image, Segment, Form,  Dropdown, Select, Label, Icon } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';
import '../styles.scss'

function StartStep3Page () {

    let history = useHistory();

    document.title = "Passo 3 de 4";

    const dispatch = useDispatch();

    let user = JSON.parse(localStorage.getItem('user'));

    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { 
        dispatch(userInfos.getInfo());
        dispatch(userInfos.getUserGenreInfoById(user.id));
        dispatch(miscInfos.getMusicGenres());
        dispatch(miscInfos.getRoles());
    }, []);

    const userInfo = useSelector(state => state.user);
    const musicGenres = useSelector(state => state.musicGenres);
    const roles = useSelector(state => state.roles);

    const userGenres = userInfo.genres.map((genre, key) =>
        <Label color="blue" key={genre.idGenre} style={{ fontWeight: 'normal' }}>
            {genre.name}
            <Icon name='delete' onClick={() => deleteGenre(genre.id)} />
        </Label>
    );

    const userSelectedGenres = userInfo.genres.map(item => item.idGenre)

    const musicGenresList = musicGenres.list.filter(e => !userSelectedGenres.includes(e.id)).map(genre => ({ 
        text: genre.name,
        value: genre.id,
        key: genre.id
    }));

    const rolesList = useSelector(state => state.roles.list.map(role => ({ 
        text: role.name,
        value: role.id,
        key: role.id
    })));

    const addGenre = (musicGenreId) => {
        setIsLoading(true)
        let setMainGenre
        if (!userInfo.genres[0].idGenre) { setMainGenre = 1 } else { setMainGenre = 0 }
        setTimeout(() => {
            fetch('https://mublin.herokuapp.com/user/add/musicGenre', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify({userId: user.id, musicGenreId: musicGenreId, musicGenreMain: setMainGenre})
            }).then((response) => {
                //console.log(response);
                dispatch(userInfos.getUserGenreInfoById(user.id))
                setIsLoading(false)
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao adicionar o gênero")
            })
        }, 400);
    }

    const deleteGenre = (userGenreId) => {
        setIsLoading(true)
        fetch('https://mublin.herokuapp.com/user/delete/musicGenre', {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({userId: user.id, userGenreId: userGenreId})
        }).then((response) => {
            //console.log(response);
            dispatch(userInfos.getUserGenreInfoById(user.id))
            setIsLoading(false)
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao remover o gênero")
        })
    }

    const addRole = (idUser, idRole) => {
        
    }

    const deleteRole = (idUser, idRole) => {
        
    }

    const checkValid = () => {
        if (
            userInfo.genres.length > 0
        ) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }

    return (
        <>
        {isLoading && 
            <Loader
                className="appLoadingIcon"
                type="Audio"
                color="#ff0032"
                height={100}
                width={100}
                timeout={30000} //30 secs
            />
        }
        <main className="startPage">
            <div className="ui container">
                <Grid centered columns={1} verticalAlign='middle'>
                    <Grid.Column mobile={16} computer={8}>
                        <Form>
                            <Segment basic textAlign='center' className="pb-0">
                                <Image src='https://mublin.com/img/logo-mublin-circle-black.png' size='mini' centered />
                                <Header as='h1' className="pb-3">
                                    Passo 3 de 4
                                    <Header.Subheader>
                                        Sua ligação com a música
                                    </Header.Subheader>
                                </Header>
                                <Progress percent={50} color='green'/>
                            </Segment>
                            <Segment basic textAlign='center'>
                                <Form.Field
                                    id="genre"
                                    name="genre"
                                    control={Select}
                                    label="Quais os principais estilos musicais relacionados à sua atuação na música?"
                                    options={musicGenresList}
                                    placeholder="Selecione ou digite"
                                    onChange={(e, { value }) => addGenre(value)}
                                    onBlur={checkValid}
                                    search
                                />
                                {userInfo.genres[0].idGenre && userGenres}
                                {/* {(!userInfo.requesting && !musicGenres.requesting) &&
                                <Dropdown
                                    id="genre"
                                    name="genre"
                                    placeholder='Skills' 
                                    fluid 
                                    multiple 
                                    selection 
                                    options={musicGenresList} 
                                    onChange={(e, { value }) => addGenre(value)}
                                    onLabelClick={(e, { LabelProps }) => alert(LabelProps)}
                                    defaultValue={userSelectedGenres}
                                    search
                                />
                                } */}
                            </Segment>
                            <Segment basic textAlign='center' className="mt-3">
                                <Form.Field
                                    id="genre"
                                    name="genre"
                                    control={Select}
                                    label="Quais suas principais atividades na música?"
                                    options={rolesList}
                                    placeholder="Selecione ou digite"
                                    // onChange={(e, { value }) => setGenre(value)}
                                    onBlur={checkValid}
                                    search
                                />
                            </Segment>
                            <Segment basic textAlign='center' >
                                <Link to={{ pathname: "/start/step2" }} className="mr-2">
                                    <Button size="large">Voltar</Button>
                                </Link>
                                <Link to={{ pathname: "/start/step4" }}>
                                    <Button 
                                        color="black" 
                                        size="large"
                                        disabled={isValid ? false : true}
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

export default StartStep3Page;