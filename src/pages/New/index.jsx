import React from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Header, Menu, Icon } from 'semantic-ui-react';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer'

function CreateNewItemPage () {
 
    document.title = 'Novo | Mublin'

    const userInfo = JSON.parse(localStorage.getItem('user'));

    let history = useHistory();

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid as='main' columns={1} className="container">
                <Grid.Row>
                    <Grid.Column width={16}>
                        {/* <Header as='h2'>Criar</Header> */}
                        <Menu vertical fluid>
                            <Menu.Item
                                name='new'
                                onClick={() => history.push('/new')}
                            >
                                <Header as='h4'>
                                    <Icon name='plus' />
                                    <Header.Content>Novo</Header.Content>
                                </Header>
                                <p>Criar projeto do zero</p>
                            </Menu.Item>
                            <Menu.Item
                                name='idea'
                                onClick={() => history.push('/new/idea')}
                            >
                                <Header as='h4'>
                                    <Icon name='lightbulb outline' />
                                    <Header.Content>Ideia</Header.Content>
                                </Header>
                                <p>Criar uma proposta para atrair outros integrantes</p>
                            </Menu.Item>
                            <Menu.Item
                                name='join'
                                onClick={() => history.push('/new/join')}
                            >
                                <Header as='h4'>
                                    <Icon name='user plus' />
                                    <Header.Content>Ingressar</Header.Content>
                                </Header>
                                <p>Entrar em um projeto já cadastrado</p>
                            </Menu.Item>
                            <Menu.Item
                                name='invite'
                                onClick={() => history.push('/new')}
                            >
                                <Header as='h4'>
                                    <Icon name='envelope open outline' />
                                    <Header.Content>Convidar</Header.Content>
                                </Header>
                                <p>Convidar alguém para um projeto que você faz parte</p>
                            </Menu.Item>
                            <Menu.Item
                                name='search'
                                onClick={() => history.push('/new')}
                            >
                                <Header as='h4'>
                                    <Icon name='crosshairs' />
                                    <Header.Content>Buscar</Header.Content>
                                </Header>
                                <p>Encontrar projetos à procura de integrantes</p>
                            </Menu.Item>
                        </Menu>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default CreateNewItemPage;