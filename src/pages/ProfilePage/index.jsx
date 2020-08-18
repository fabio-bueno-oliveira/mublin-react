import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HeaderDesktop from '../../components/layout/headerDesktop';
import { profileInfos } from '../../store/actions/profile';
import { Header, Tab, Card, Grid, Image, Button, Label, Dimmer, Loader } from 'semantic-ui-react';
import './styles.scss';

function ProfilePage (props) {

    let dispatch = useDispatch();

    const username = props.match.params.username

    useEffect(() => {
        dispatch(profileInfos.getProfileInfo(username));
    }, [dispatch, username]);

    //const user = useSelector(state => state.user)
    const profile = useSelector(state => state.profile);

    // const sliderOptions = {
    //     autoPlay: false,
    //     cellAlign: 'left',
    //     freeScroll: true,
    //     prevNextButtons: false,
    //     pageDots: false,
    //     wrapAround: false,
    //     draggable: '>1',
    //     resize: true,
    //     contain: true
    // }

    return (
        <>
        <HeaderDesktop />
            <Grid id="bio" columns={2} stackable className="container mb-2 mt-4 mt-md-5 pt-5">
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Card style={{ width: "100%" }}>
                            <Card.Content>
                                { profile.requesting ? (
                                    <Dimmer active inverted>
                                        <Loader inverted>Loading</Loader>
                                    </Dimmer>
                                ) : (
                                    <>
                                    <div className="center aligned mb-3 mt-2 mt-md-2">
                                        <Image src={'https://mublin.com/img/users/avatars/'+profile.id+'/'+profile.picture} size="tiny" circular alt={'Foto de '+profile.name} />
                                    </div>
                                    <div className="center aligned">
                                        <Header size="medium" className="mb-1">{profile.name+' '+profile.lastname} <Label basic color="black" size="tiny" className="ml-1 p-1">PRO</Label></Header>
                                        <p className="mb-1" style={{ fontSize: "13px" }}>Role1, Role2, Role3</p>
                                        <p className="mb-1" style={{ fontSize: "11px" }}>{profile.city+', '+profile.region}</p>
                                        <Button.Group fluid color="black" size="tiny" className="mt-3">
                                            <Button>Seguindo</Button>
                                            <Button>Mensagem</Button>
                                        </Button.Group>
                                    </div>
                                    <Card.Description className="center aligned mt-3" style={{ fontSize: "13px" }}>
                                        {profile.bio}
                                    </Card.Description>
                                    </>
                                )}
                            </Card.Content>
                            <div className="content">
                                <div className="center aligned" style={{ fontSize: "13px" }}>
                                    <a class={'ui '+profile.availabilityColor+' empty circular mini label mr-1'} ></a> {profile.availabilityTitle}
                                </div>
                            </div>
                            <div className="content">
                                <span className="right floated" style={{ fontSize: "13px" }}>
                                    X projetos <br/><small style={{ fontSize: "10px" }}>(X comigo)</small>
                                </span>
                                <span id="followers_total" style={{ fontSize: "13px" }}>
                                    X seguidores
                                </span>
                            </div>
                        </Card>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Card id="projects" style={{ width: "100%" }}>
                            <Card.Content>
                                <Header as='h2'>Projetos</Header>
                                <Tab menu={{ secondary: true }} panes={
                                    [
                                        {
                                        menuItem: 'Principais (0)',
                                        render: () => 
                                            <Tab.Pane attached={false} as="div">
                                                
                                            </Tab.Pane>,
                                        },
                                        {
                                        menuItem: 'Portfolio (0)',
                                        render: () => 
                                            <Tab.Pane attached={false} as="div">
                                                
                                            </Tab.Pane>,
                                        }
                                    ]
                                }
                                />
                            </Card.Content>
                        </Card>
                        <Card id="strengths" style={{ width: "100%" }}>
                            <Card.Content>
                                <Header as='h2'>Pontos Fortes</Header>
                            </Card.Content>
                        </Card>
                        <Card id="strengths" style={{ width: "100%" }}>
                            <Card.Content>
                                <Header as='h2'>Depoimentos</Header>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};

export default ProfilePage;