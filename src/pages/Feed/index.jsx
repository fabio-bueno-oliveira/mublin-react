import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { miscInfos } from '../../store/actions/misc';
import { Grid, Feed, Icon, Label, Header } from 'semantic-ui-react';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Loader from 'react-loader-spinner';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import './styles.css'

function FeedPage () {
 
    document.title = 'Feed | Mublin'

    const user = JSON.parse(localStorage.getItem('user'));

    let dispatch = useDispatch();

    let history = useHistory();

    useEffect(() => {
        dispatch(miscInfos.getFeed());
    }, [dispatch]);

    const feed = useSelector(state => state.feed)

    const [likeFeedPostLoading, setLikeFeedPostLoading] = useState(null)
    const likeFeedPost = (feedId) => {
        setLikeFeedPostLoading(feedId)
        fetch('https://mublin.herokuapp.com/feed/'+feedId+'/like', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            }
        })
        .then((response) => {
            dispatch(miscInfos.getFeed());
            setLikeFeedPostLoading(null)
        }).catch(err => {
            setLikeFeedPostLoading(null)
            console.error(err)
            alert("Ocorreu um erro ao curtir a postagem")
        })
    }

    const [unlikeFeedPostLoading, setUnlikeFeedPostLoading] = useState(null)
    const unlikeFeedPost = (feedId) => {
        setUnlikeFeedPostLoading(feedId)
        fetch('https://mublin.herokuapp.com/feed/'+feedId+'/unlike', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            }
        })
        .then((response) => {
            dispatch(miscInfos.getFeed());
            setUnlikeFeedPostLoading(null)
        }).catch(err => {
            setUnlikeFeedPostLoading(null)
            console.error(err)
            alert("Ocorreu um erro ao curtir a postagem")
        })
    }
    
    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            { feed.requesting ? (
                <Loader
                    className="appLoadingIcon"
                    type="Audio"
                    color="#ffffff"
                    height={100}
                    width={100}
                    timeout={30000} //30 secs
                />
            ) : (
                <Grid as='main' columns={1} className="container mb-2 mt-4 mt-md-5 pt-5">
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Header className='mb-4'>Acontecendo em sua rede</Header>
                            <Feed>
                                { feed.list.map((item, key) =>
                                    <Feed.Event key={key} className='mb-3'>
                                        <Feed.Label>
                                            { item.relatedUserPicture ? (
                                                <img src={item.relatedUserPicture} alt={'Foto de '+item.relatedUserName} />
                                            ) : (
                                                <img src='https://ik.imagekit.io/mublin/sample-folder/tr:h-200,w-200,c-maintain_ratio/avatar-undefined_Kblh5CBKPp.jpg' />
                                            )}
                                        </Feed.Label>
                                        <Feed.Content className='mt-1'>
                                            <Feed.Date style={{fontSize:'12px',fontWeight:'500'}}>
                                                {item.relatedUserPlan === 'Pro' && <Label size="mini" className="mr-1 p-1">Pro</Label>} há {formatDistance(new Date(item.created * 1000), new Date(), {locale:pt})}
                                            </Feed.Date>
                                            <Feed.Summary>
                                                <Feed.User>{item.relatedUserName+' '+item.relatedUserLastname}</Feed.User> <span style={{fontWeight:'500'}}>{item.action} {item.category === 'project' ? item.relatedProjectName+' ('+item.relatedProjectType+')' : (<a>{item.relatedEventTitle}</a>)}</span>
                                            </Feed.Summary>
                                            { (item.categoryId === 8) && 
                                                <Feed.Extra text content={item.extraText} />
                                            }
                                            { item.category === 'project' &&
                                                <Feed.Extra images>
                                                    <Link as='a' to={{ pathname: '/project/'+item.relatedProjectUsername }}>
                                                        { item.relatedProjectPicture ? (
                                                            <img src={item.relatedProjectPicture} />
                                                        ) : (
                                                            <img src='https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg' alt={'Foto de '+item.relatedUserName} />
                                                        )}
                                                    </Link>
                                                </Feed.Extra>
                                            }
                                            { (item.categoryId !== 6 && item.categoryId !== 7) && 
                                                <Feed.Meta>
                                                    <Feed.Like onClick={!item.likedByMe ? () => likeFeedPost(item.id) : () => unlikeFeedPost(item.id)}>
                                                        <Icon loading={likeFeedPostLoading === item.id || unlikeFeedPostLoading === item.id} name={(likeFeedPostLoading === item.id || unlikeFeedPostLoading === item.id) ? 'spinner' : 'like'} color={item.likedByMe ? 'red' : ''}/>
                                                    </Feed.Like> {item.likes}
                                                </Feed.Meta>
                                            }
                                        </Feed.Content>
                                    </Feed.Event>
                                )}
                            </Feed>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )}
            <FooterMenuMobile />
        </>
    )
}

export default FeedPage;