import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import HeaderDesktop from '../../../components/layout/headerDesktop';
import HeaderMobile from '../../../components/layout/headerMobile';
import { userInfos } from '../../../store/actions/user';
import { Card, Grid, List, Image, Message, Menu, Loader as UiLoader } from 'semantic-ui-react';
import {IKUpload} from "imagekitio-react";

function ProfilePage (props) {

    document.title = 'Editar perfil | Mublin'

    let history = useHistory();

    let dispatch = useDispatch();

    useEffect(() => { 
        dispatch(userInfos.getInfo());
    }, [dispatch]);

    const userInfo = useSelector(state => state.user);
    
    // Update avatar filename in bd
    const updatePicture = (userId, value) => {
        //console.log(24, "começando a atualizar imagem via api...")
        setIsLoading(true)
        let user = JSON.parse(localStorage.getItem('user'));
        fetch('https://mublin.herokuapp.com/user/'+userId+'/picture', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({picture: value})
        }).then((response) => {
            response.json().then((response) => {
              //console.log(response);
              setIsLoading(false)
              setIsUpdated(true)
              dispatch(userInfos.getInfo());
            })
          }).catch(err => {
            setIsLoading(false)
            setIsUpdated(false)
            console.error(err)
        })
    };

    // Image Upload to ImageKit.io
    const userAvatarPath = "/users/avatars/"+userInfo.id+"/"
    const [isLoading, setIsLoading] = useState(false)
    const [isUpdated, setIsUpdated] = useState(null)

    const onUploadError = err => {
        alert("Ocorreu um erro. Tente novamente em alguns minutos.");
    };

    const onUploadSuccess = res => {
        let n = res.filePath.lastIndexOf('/');
        let fileName = res.filePath.substring(n + 1);
        updatePicture(userInfo.id,fileName)
    };

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
            <Grid centered columns={1} className="container mb-2 mt-4 mt-md-5 pt-5">
                <Grid.Row>
                    <Grid.Column mobile={16} computer={10}>
                        <Card style={{ width: "100%" }}>
                            <Card.Content>
                                <Menu fluid pointing secondary widths={3} className='mb-3'>
                                    <Menu.Item as='span' active>
                                        Editar perfil
                                    </Menu.Item>
                                    <Menu.Item as='a'>
                                        Preferências
                                    </Menu.Item>
                                    <Menu.Item as='a' onClick={() => history.push("/settings")}>
                                        Configurações
                                    </Menu.Item>
                                </Menu>
                                <List bulleted horizontal link className='mb-4'>
                                    <List.Item as='a' onClick={() => history.push("/settings/profile")}>Informações</List.Item>
                                    <List.Item as='a' active>Foto</List.Item>
                                </List>
                                { userInfo.requesting || isLoading ? (
                                    <UiLoader active inline='centered' />
                                ) : (
                                    <>
                                        <section style={{width:'100%',display:'flex',width:'100%',flexDirection:'column',justifyContent:'center',alignItems:'center'}} className='py-5'>
                                            { isUpdated === false &&
                                                <Message color='red'>Ocorreu um erro ao tentar atualizar a foto do perfil. Tente novamente em instantes</Message>
                                            }
                                            { isUpdated === true &&
                                                <Message color='green'>A foto de perfil foi atualizada com sucesso</Message>
                                            }
                                            { !userInfo.picture ? (
                                                <Image centered src='https://ik.imagekit.io/mublin/tr:h-200,w-200,r-max/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' size='small' className="mb-4" />
                                            ) : (
                                                <Image circular centered src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture} size='small' className="mb-4" />
                                            )}
                                            <div className="customFileUpload">
                                                <IKUpload 
                                                    fileName="avatar.jpg"
                                                    folder={userAvatarPath}
                                                    tags={["tag1"]}
                                                    useUniqueFileName={true}
                                                    isPrivateFile= {false}
                                                    onError={onUploadError}
                                                    onSuccess={onUploadSuccess}
                                                />
                                            </div>
                                        </section>
                                    </>
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