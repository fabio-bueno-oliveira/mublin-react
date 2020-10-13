import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import Spacer from '../../components/layout/Spacer'
import { Segment, Header, Grid, Icon } from 'semantic-ui-react';
import './styles.scss'

function SubmitNewProduct () {

    document.title = 'Submeter novo produto | Mublin'

    let history = useHistory()

    let dispatch = useDispatch()

    let user = JSON.parse(localStorage.getItem('user'))

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid as='main' centered columns={1} className="container">
                <Grid.Row className='pb-0'>
                    <Grid.Column width={16}>
                        <Header as='h2' className='mb-4'>
                            Submeter novo produto
                            <Header.Subheader>
                                Envie um produto à base do Mublin
                            </Header.Subheader>
                        </Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column mobile={16} computer={10}>
                        <Segment color='green'>
                            <Header as='h5'>
                                <Icon name='cloud upload' />
                                <Header.Content className='gear itemTitle'>
                                    
                                    <Header.Subheader>Colabore enviando produtos à nossa base de dados</Header.Subheader>
                                </Header.Content>
                            </Header>
                        </Segment>
                        
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};

export default SubmitNewProduct;