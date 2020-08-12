import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/user';
import { Link } from 'react-router-dom';
import { Progress, Button, Header, Grid, Image, Segment } from 'semantic-ui-react';
import {IKImage,IKUpload} from "imagekitio-react";
import Loader from 'react-loader-spinner';
import '../styles.scss'

function StartStep1Page () {

    document.title = "Passo 1 de 4";

    const dispatch = useDispatch();

    useEffect(() => { 
        dispatch(userInfos.getInfo());
    }, []);

    const userInfo = useSelector(state => state.user);

    // Update avatar filename in bd
    const updatePicture = (userId, value) => {
        //console.log(24, "começando a atualizar imagem via api...")
        SetIsLoading(true)
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
              SetIsLoading(false)
              dispatch(userInfos.getInfo());
            })
          }).catch(err => {
            SetIsLoading(false)
            console.error(err)
        })
    };

    // Image Upload to ImageKit.io
    const userAvatarPath = "/users/avatars/"+userInfo.id+"/"
    const [isLoading, SetIsLoading] = useState(false)

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
            <div className="ui container" style={{ height: '100%' }}>
                <Grid centered columns={1} verticalAlign='middle'>
                    <Grid.Column mobile={16} computer={8}>
                        <Segment basic textAlign='center' attached="top" style={{ border: 'none' }}>
                            <Image src='https://mublin.com/img/logo-mublin-circle-black.png' size='mini' centered />
                            <Header as='h1' className="pb-3">
                                Passo 1 de 4
                                <Header.Subheader>
                                    Defina sua foto de perfil
                                </Header.Subheader>
                            </Header>
                            <Progress percent={25} color='green' size='small' />
                            { !userInfo.picture ? (
                                <Image centered src='https://ik.imagekit.io/mublin/tr:h-200,w-200,fo-face-true,r-max/sample-folder/avatar-undefined_Kblh5CBKPp.jpg' size='small' className="mb-4" />
                            ) : (
                                <Image circular centered src={'https://ik.imagekit.io/mublin/tr:h-200,w-200,c-maintain_ratio/users/avatars/'+userInfo.id+'/'+userInfo.picture} size='small' className="mb-4" />
                            )}
                            {/* <IKImage path={uploadedImage} transformation={[{
                                "height": "200",
                                "width": "200",
                                "fo-face": true,
                                "r": "max"
                            }]} /> */}
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
                        </Segment>
                        <Segment basic textAlign='center' attached="bottom" style={{ border: 'none' }}>
                            <Link to={{ pathname: "/start/step2" }}>
                                <Button color="black" size="large">Avançar</Button>
                            </Link>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        </main>
        </>
    );
};

export default StartStep1Page;