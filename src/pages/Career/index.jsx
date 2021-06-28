import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import { userInfos } from '../../store/actions/user';
import { Container, Header, Grid, Item, Label, Button, Icon, Image, Menu } from 'semantic-ui-react';

function CareerPage () {

    document.title = 'Minha carreira | Mublin';

    let dispatch = useDispatch();

    // let history = useHistory();

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        dispatch(userInfos.getUserProjects(user.id));
        dispatch(userInfos.getUserRolesInfoById(user.id));
    }, [user.id, dispatch]);

    const paragraph = <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />

    const [activeItem, setActiveItem] = useState('enterprise')

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
        <Spacer />
        <Container className='px-3'>
            <Grid centered stackable>
                <Grid.Row columns={2}>
                    <Grid.Column mobile={16} tablet={16} computer={4}>
                        <Menu vertical>
                            <Menu.Item>
                                <Menu.Header>Products</Menu.Header>

                                <Menu.Menu>
                                    <Menu.Item
                                        name='enterprise'
                                        active={activeItem === 'enterprise'}
                                        onClick={() => setActiveItem('enterprise')}
                                    />
                                    <Menu.Item
                                        name='consumer'
                                        active={activeItem === 'consumer'}
                                        onClick={() => setActiveItem('consumer')}
                                    />
                                </Menu.Menu>
                            </Menu.Item>

                            <Menu.Item>
                                <Menu.Header>CMS Solutions</Menu.Header>

                                <Menu.Menu>
                                    <Menu.Item
                                        name='rails'
                                        active={activeItem === 'rails'}
                                        onClick={() => setActiveItem('rails')}
                                    />
                                    <Menu.Item
                                        name='python'
                                        active={activeItem === 'python'}
                                        onClick={() => setActiveItem('python')}
                                    />
                                    <Menu.Item
                                        name='php'
                                        active={activeItem === 'php'}
                                        onClick={() => setActiveItem('php')}
                                    />
                                </Menu.Menu>
                            </Menu.Item>

                            <Menu.Item>
                                <Menu.Header>Hosting</Menu.Header>

                                <Menu.Menu>
                                    <Menu.Item
                                        name='shared'
                                        active={activeItem === 'shared'}
                                        onClick={() => setActiveItem('shared')}
                                    />
                                    <Menu.Item
                                        name='dedicated'
                                        active={activeItem === 'dedicated'}
                                        onClick={() => setActiveItem('dedicated')}
                                    />
                                </Menu.Menu>
                            </Menu.Item>

                            <Menu.Item>
                                <Menu.Header>Support</Menu.Header>

                                <Menu.Menu>
                                    <Menu.Item
                                        name='email'
                                        active={activeItem === 'email'}
                                        onClick={() => setActiveItem('email')}
                                    >
                                    E-mail Support
                                    </Menu.Item>

                                    <Menu.Item
                                        name='faq'
                                        active={activeItem === 'faq'}
                                        onClick={() => setActiveItem('faq')}
                                    >
                                    FAQs
                                    </Menu.Item>
                                </Menu.Menu>
                            </Menu.Item>
                        </Menu>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={16} computer={12}>
                        <Header>Carreira</Header>
                        <Item.Group divided>
                            <Item>
                                <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' />

                                <Item.Content>
                                    <Item.Header as='a'>12 Years a Slave</Item.Header>
                                    <Item.Meta>
                                    <span className='cinema'>Union Square 14</span>
                                    </Item.Meta>
                                    <Item.Description>{paragraph}</Item.Description>
                                    <Item.Extra>
                                    <Label>IMAX</Label>
                                    <Label icon='globe' content='Additional Languages' />
                                    </Item.Extra>
                                </Item.Content>
                            </Item>

                            <Item>
                                <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' />

                                <Item.Content>
                                    <Item.Header as='a'>My Neighbor Totoro</Item.Header>
                                    <Item.Meta>
                                    <span className='cinema'>IFC Cinema</span>
                                    </Item.Meta>
                                    <Item.Description>{paragraph}</Item.Description>
                                    <Item.Extra>
                                    <Button primary floated='right'>
                                        Buy tickets
                                        <Icon name='right chevron' />
                                    </Button>
                                    <Label>Limited</Label>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>

                            <Item>
                                <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' />

                                <Item.Content>
                                    <Item.Header as='a'>Watchmen</Item.Header>
                                    <Item.Meta>
                                    <span className='cinema'>IFC</span>
                                    </Item.Meta>
                                    <Item.Description>{paragraph}</Item.Description>
                                    <Item.Extra>
                                    <Button primary floated='right'>
                                        Buy tickets
                                        <Icon name='right chevron' />
                                    </Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
        <Spacer />
        <FooterMenuMobile />
        </>
    );
};

export default CareerPage;