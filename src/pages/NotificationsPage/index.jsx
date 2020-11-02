import React, { useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { miscInfos } from '../../store/actions/misc';
import { Grid, Feed, Button, Label, Header } from 'semantic-ui-react';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import Loader from 'react-loader-spinner';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

function NotificationsPage () {
 
    document.title = 'Notificações | Mublin'

    const user = JSON.parse(localStorage.getItem('user'));

    let dispatch = useDispatch();

    let history = useHistory();

    useEffect(() => {
        dispatch(miscInfos.getNotifications());
    }, [dispatch]);

    const notifications = useSelector(state => state.notifications)

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            { notifications.requesting ? (
                <Loader
                    className="appLoadingIcon"
                    type="Audio"
                    color="#ffffff"
                    height={100}
                    width={100}
                    timeout={30000} //30 secs
                />
            ) : (
                <>
                <Spacer />
                <Grid as='main' columns={1} className="container mb-2 px-1 px-md-3">
                    <Grid.Row>
                        <Grid.Column width={16}>
                            {/* <Menu secondary size='large'>
                                <Menu.Item
                                    name='Notificações'
                                    active
                                />
                                <Menu.Item
                                    name='Feed'
                                    onClick={() => history.push('/feed')}
                                />
                            </Menu> */}
                            <Header as='h2' className='mb-4'>Notificações</Header>
                            { notifications.list[0].id ? ( 
                                <Feed>
                                    { notifications.list.map((item, key) =>
                                        <Feed.Event key={key} className='mb-3'>
                                            <Feed.Label style={{cursor:'pointer'}} onClick={() => history.push('/'+item.relatedUserUsername)}>
                                                { item.relatedUserPicture ? (
                                                    <img src={item.relatedUserPicture} alt={'Foto de '+item.relatedUserName} />
                                                ) : (
                                                    <img src='https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_Kblh5CBKPp.jpg' />
                                                )}
                                            </Feed.Label>
                                            <Feed.Content className='mt-1'>
                                                <Feed.Date style={{fontSize:'12px',fontWeight:'500'}}>
                                                    {item.relatedUserPlan === 'Pro' && <Label size="mini" className="mr-1 p-1">Pro</Label>} há {formatDistance(new Date(item.createdAlternativeFormat * 1000), new Date(), {locale:pt})}
                                                </Feed.Date>
                                                <Feed.Summary>
                                                    <Feed.User style={{fontWeight:'600'}} onClick={() => history.push('/'+item.relatedUserUsername)}>{item.relatedUserName+' '+item.relatedUserLastname}</Feed.User> <span style={{fontWeight:'500'}}>{item.action} {item.category === 'project' ? item.relatedProjectName+' ('+item.relatedProjectType+')' : (<a>{item.relatedEventTitle}</a>)}</span>
                                                </Feed.Summary>
                                                <Feed.Extra images>
                                                    <Link as='a' to={{ pathname: '/project/'+item.relatedProjectUsername }}>
                                                        { item.relatedProjectPicture ? (
                                                            <img src={item.relatedProjectPicture} />
                                                        ) : (
                                                            <img src='https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg' alt={'Foto de '+item.relatedUserName} />
                                                        )}
                                                    </Link>
                                                </Feed.Extra>
                                                { item.id_feed_type_fk === 9 &&
                                                    <Feed.Extra>
                                                        <Button size='mini'>
                                                            Responder a esta solicitação
                                                        </Button>
                                                    </Feed.Extra>
                                                }
                                            </Feed.Content>
                                        </Feed.Event>
                                    )}
                                </Feed>
                            ) : (
                                <p>Ops! Nenhuma notificação pra você no momento.</p>
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                </>
            )}
            <FooterMenuMobile />
        </>
    )
}

export default NotificationsPage;