import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
// import MublinLogo from '../../../assets/img/logos/mublin-logo-text-white.png';
import { userInfos } from '../../../store/actions/user';
import { Button, Menu, Header, Grid, Container, Segment, Label } from 'semantic-ui-react';

function SubscriptionPage () {

    document.title = 'Meu Plano | Mublin'

    let history = useHistory();

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(userInfos.getInfo());
    }, []);

    const [isLoading, setIsLoading] = useState(false)

    const userInfo = useSelector(state => state.user)

    return (
        <div>
            <Menu fixed='top' inverted>
            <Container>
                {/* <Menu.Item as='a' header>
                    <Image size='mini' src={MublinLogo} style={{height:'30px',width:'auto'}} />
                </Menu.Item> */}
                <Menu.Item header className='p-4' style={{fontFamily:'Baloo',fontSize:'26px'}}>mublin</Menu.Item>
                <Menu.Item as='a' onClick={() => history.push("/home/")}>Voltar para a home</Menu.Item>
            </Container>
            </Menu>

            <Container text>

                <Header as='h1' className='mb-5' style={{paddingTop:'130px'}}>
                    <Header.Content>
                        Seja usuário Mublin Pro
                    <Header.Subheader>Mais recursos para gerenciar sua carreira</Header.Subheader>
                    </Header.Content>
                </Header>

                <Grid columns={2} padded='vertically'>
                    <Grid.Column>
                        <p>O Mublin está em versão Beta, e você pode ajudar nossa plataforma a crescer!</p>
                        <p className='mt-3'>Assinando o plano Pro, você tem acesso a mais recursos</p>
                        <ul className='pl-4 mt-3'>
                            <li>Sem limite de projetos</li>
                            <li>Sem limite de upload de áudios e imagens</li>
                            <li>Seu perfil em destaque nos resultados das buscas</li>
                            <li>Selo <Label color='black' size='mini'>PRO</Label> que agrega ainda mais visibilidade e credibilidade para os usuários da plataforma</li>
                            <li>Acesso a novas funcionalidades com antecedência</li>
                        </ul>
                        <p className='mt-3'>Como um usuário Pro, você estará contribuindo para que a nossa plataforma se mantenha com qualidade e em constante evolução.</p>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment>
                            <Link target="_blank" to={{ pathname: "https://pay.juno.com.br/checkout.html?code=EAD1902DEAF55C8B" }}>
                                <Button color='blue' size='big' fluid>Quero me tornar Pro</Button>
                            </Link>
                            <p className='mt-3'>Um único pagamento de</p>
                            <Header as='h1' className='my-0'>R$ 29,90</Header>
                            <p>por <strong>3 meses</strong> de Mublin Pro</p>
                            <p className='mt-3' style={{fontSize:'11px',opacity:'0.7'}}>* conta Pro é liberada em até 2 horas após <nobr>confirmação de pagamento</nobr></p>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </Container>

            {/* <Segment inverted vertical style={{ margin: '5em 0em 0em', padding: '5em 0em' }}>
                <Container textAlign='center'>
                    <Grid divided inverted stackable>
                    <Grid.Column width={3}>
                        <Header inverted as='h4' content='Group 1' />
                        <List link inverted>
                        <List.Item as='a'>Link One</List.Item>
                        <List.Item as='a'>Link Two</List.Item>
                        <List.Item as='a'>Link Three</List.Item>
                        <List.Item as='a'>Link Four</List.Item>
                        </List>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Header inverted as='h4' content='Group 2' />
                        <List link inverted>
                        <List.Item as='a'>Link One</List.Item>
                        <List.Item as='a'>Link Two</List.Item>
                        <List.Item as='a'>Link Three</List.Item>
                        <List.Item as='a'>Link Four</List.Item>
                        </List>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Header inverted as='h4' content='Group 3' />
                        <List link inverted>
                        <List.Item as='a'>Link One</List.Item>
                        <List.Item as='a'>Link Two</List.Item>
                        <List.Item as='a'>Link Three</List.Item>
                        <List.Item as='a'>Link Four</List.Item>
                        </List>
                    </Grid.Column>
                    <Grid.Column width={7}>
                        <Header inverted as='h4' content='Footer Header' />
                        <p>
                        Extra space for a call to action inside the footer that could help re-engage users.
                        </p>
                    </Grid.Column>
                    </Grid>

                    <Divider inverted section />
                    <Image centered size='mini' src='/logo.png' />
                    <List horizontal inverted divided link size='small'>
                    <List.Item as='a' href='#'>
                        Site Map
                    </List.Item>
                    <List.Item as='a' href='#'>
                        Contact Us
                    </List.Item>
                    <List.Item as='a' href='#'>
                        Terms and Conditions
                    </List.Item>
                    <List.Item as='a' href='#'>
                        Privacy Policy
                    </List.Item>
                    </List>
                </Container>
            </Segment> */}
        </div>
    );
};

export default SubscriptionPage;