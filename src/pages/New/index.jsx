import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Header, Menu, Button, Icon } from 'semantic-ui-react';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer'

// import firebase from '../../firebase'
import { storage } from "../../firebase"

function CreateNewItemPage () {
 
    document.title = 'Novo | Mublin'

    // const userInfo = JSON.parse(localStorage.getItem('user'));

    let history = useHistory();

    // const [image, setImage] = useState(null);
    // const [url, setUrl] = useState("");
    // const [progress, setProgress] = useState(0);
  
    // const handleChange = e => {
    //   if (e.target.files[0]) {
    //     setImage(e.target.files[0]);
    //   }
    // };
  
    // const handleUpload = () => {
    //   const uploadTask = storage.ref(`images/${image.name}`).put(image);
    //   uploadTask.on(
    //     "state_changed",
    //     snapshot => {
    //       const progress = Math.round(
    //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //       );
    //       setProgress(progress);
    //     },
    //     error => {
    //       console.log(error);
    //     },
    //     () => {
    //       storage
    //         .ref("images")
    //         .child(image.name)
    //         .getDownloadURL()
    //         .then(url => {
    //           setUrl(url);
    //         });
    //     }
    //   );
    // };

    // console.log("image: ", image);

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid 
                as='main' 
                columns={1} 
                verticalAlign='middle' 
                centered 
                className='container'
                style={{height:'84%'}}
            >
                <Grid.Row>
                    <Grid.Column width={16}>
                        {/* <div>
                            <progress value={progress} max="100" />
                            <br />
                            <br />
                            <input type="file" onChange={handleChange} />
                            <button onClick={handleUpload}>Upload</button>
                            <br />
                            {url}
                            <br />
                            <img src={url || "http://via.placeholder.com/300"} alt="firebase-image" />
                        </div> */}
                        <Button
                            color='blue'
                            content='Nova postagem'
                            icon='pencil'
                            fluid
                            className='mb-3'
                        />
                        <Button
                            color='blue'
                            content='Novo projeto'
                            icon='rocket'
                            fluid
                            className='mb-3'
                            onClick={() => history.push('/new/project')}
                        />
                        <Button
                            color='blue'
                            content='Nova ideia de projeto'
                            icon='lightbulb outline'
                            fluid
                            className='mb-3'
                            onClick={() => history.push('/new/idea')}
                        />
                        <Button
                            color='blue'
                            content='Ingressar em projeto já cadastrado'
                            icon='user plus'
                            fluid
                            className='mb-3'
                            onClick={() => history.push('/new/join')}
                        />
                        <Button
                            color='blue'
                            content='Convidar alguém para um projeto'
                            icon='envelope open outline'
                            fluid
                            className='mb-3'
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default CreateNewItemPage;