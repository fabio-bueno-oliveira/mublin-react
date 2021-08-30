import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { miscInfos } from '../../store/actions/misc';
import { Header, Image, Icon, Label, Modal, Feed, Card, Loader } from 'semantic-ui-react';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import LogoMublinCircular from '../../assets/img/logos/logo-mublin-circle-black.png';
import Masonry from 'react-masonry-css';
// import './styles.scss';

const MyFeed = (props) => {

    const undefinedAvatar = 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_Kblh5CBKPp.jpg'

    let dispatch = useDispatch();

    const history = useHistory();

    const userSession = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        dispatch(miscInfos.getFeed());
    }, [dispatch]);

    const userInfo = useSelector(state => state.user);

    const [likeFeedPostLoading, setLikeFeedPostLoading] = useState(null)
    const likeFeedPost = (feedId) => {
        setLikeFeedPostLoading(feedId)
        fetch('https://mublin.herokuapp.com/feed/'+feedId+'/like', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userSession.token
            }
        })
        .then(() => {
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
                'Authorization': 'Bearer ' + userSession.token
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

    const [modalImage, setModalImage] = useState(false);
    const [imageToShow, setImageToShow] = useState(null);

    const showImage = (imageUrl) => {
        setImageToShow(imageUrl)
        setModalImage(true)
    };

    const [modalDeletePost, setModalDeletePost] = useState(false)
    const [postIdToDelete, setPostIdToDelete] = useState(null)
    const [loadingDeletePost, setLoadingDeletePost] = useState(false)

    const showModalPost = (idPost) => {
        setModalDeletePost(true)
        setPostIdToDelete(idPost)
    };

    return (
        <>
            <Header size='medium' className='mt-4'>Postagens Recentes</Header>
            <div className='pt-1 mt-0'>
                {props.feedData.requesting ? (
                    <div style={{textAlign:'center',width:'100%',height:'100px'}} className='py-3'>
                        <Loader active inline='centered' />
                    </div>
                ) : (
                    <>
                        <Masonry
                            breakpointCols={props.masonryBreakPoints}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column"
                        >
                            {!props.feedData.error && props.feedData.list.map((item, key) =>
                                <Card key={key}>
                                    <Card.Content>
                                        <Image
                                            floated='left'
                                            size='mini'
                                            src={item.relatedUserPicture ? item.relatedUserPicture : undefinedAvatar} alt={'Foto de '+item.relatedUserName}
                                            onClick={() => history.push('/'+item.relatedUserUsername)}
                                        />
                                        <Card.Header>
                                            {item.relatedUserName+' '+item.relatedUserLastname} {!!item.relatedUserVerified && <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' />} <span style={{fontWeight:'500'}}>{item.action}</span>
                                        </Card.Header>
                                        {props.feedData.requesting ? (
                                            <Card.Meta>
                                                Carregando...
                                            </Card.Meta>
                                        ) : (
                                            <Card.Meta title={Date(item.created)}>
                                                há {formatDistance(new Date(item.created * 1000), new Date(), {locale:pt})}
                                            </Card.Meta>
                                        )}
                                    </Card.Content>
                                    <Card.Content>
                                        {(item.categoryId === 8) && 
                                            <p>{item.extraText}</p>
                                        }
                                        {item.image && 
                                            <Image
                                                onClick={() => {
                                                    showImage('https://ik.imagekit.io/mublin/posts/'+item.image)
                                                }}
                                                src={'https://ik.imagekit.io/mublin/posts/'+item.image}
                                            />
                                        }
                                    </Card.Content>
                                    <Card.Content>
                                        {!props.feedData.requesting &&
                                            <Feed.Meta>
                                                <Feed.Like onClick={!item.likedByMe ? () => likeFeedPost(item.id) : () => unlikeFeedPost(item.id)}>
                                                    <Icon loading={likeFeedPostLoading === item.id || unlikeFeedPostLoading === item.id} name={(likeFeedPostLoading === item.id || unlikeFeedPostLoading === item.id) ? 'spinner' : 'like'} color={item.likedByMe ? 'red' : ''}/>
                                                </Feed.Like> {item.likes}
                                            </Feed.Meta>
                                        }
                                    </Card.Content>
                                </Card>
                            )}
                                <Card>
                                    <Card.Content>
                                        <Image
                                            floated='left'
                                            size='mini'
                                            src={LogoMublinCircular} alt='Mublin'
                                        />
                                        <Card.Header>
                                            Mublin <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' /> <span style={{fontWeight:'500'}}>escreveu</span>
                                        </Card.Header>
                                        <Card.Meta>
                                            há {formatDistance(new Date('2021-03-04'), new Date(), {locale:pt})}
                                        </Card.Meta>
                                    </Card.Content>
                                    <Card.Content>
                                        <p>Bem-vindo à versão Beta do Mublin! Você faz parte de um seleto grupo de pessoas que estão fazendo parte dos primeiros testes neste pré-lançamento. Este é um espaço feito para trazer mais facilidade à rotina de pessoas que amam música e que estão de alguma forma envolvidos com projetos de música. Esperamos que goste!</p>
                                    </Card.Content>
                                </Card>
                        </Masonry>
                        <Modal
                            size='tiny'
                            basic
                            closeIcon
                            open={modalImage}
                            onClose={() => setModalImage(false)}
                        >
                            <Modal.Content>
                                <Image src={imageToShow} />
                            </Modal.Content>
                        </Modal>
                    </>
                )}
            </div>
        </>
    );
};

export default MyFeed