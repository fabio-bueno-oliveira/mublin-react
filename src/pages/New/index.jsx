import React from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Header } from 'semantic-ui-react';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';

function CreateNewItemPage () {
 
    document.title = 'Novo | Mublin'

    const userInfo = JSON.parse(localStorage.getItem('user'));

    let history = useHistory();

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Grid as='main' columns={1} className="container mb-2 mt-4 mt-md-5 pt-5">
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Header as='h2'>Novo</Header>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default CreateNewItemPage;