import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Header, Image, Modal, Button, Segment, Placeholder, Label, List } from 'semantic-ui-react';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer'

function ProductPage (props) {
 
    document.title = 'Novo | Mublin'

    const userInfo = JSON.parse(localStorage.getItem('user'));

    let history = useHistory();

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [product, setProduct] = useState([]);
    const [owners, setOwners] = useState([
        { city: '',
        country: '',
        created: '',
        currentlyUsing: '',
        featured: '',
        forSale: '',
        id: '',
        lastname: '',
        name: '',
        photo: '',
        picture: '',
        price: '',
        productId: '',
        region: '',
        username: '' }
    ]);

    useEffect(() => {
        fetch("https://mublin.herokuapp.com/gear/product/"+props.match.params.productId+"/productInfo")
          .then(res => res.json())
          .then(
            (result) => {
              setIsLoaded(true);
              setProduct(result[0]);
            },
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
          
        fetch("https://mublin.herokuapp.com/gear/product/"+props.match.params.productId+"/productOwners")
            .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true);
                setOwners(result);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }, [])

    const [modalZoomOpen, setModalZoomOpen] = useState(false)

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid stackable columns={2} className="container">
                <Grid.Column mobile={16} tablet={5} computer={5}>
                    <Segment>
                        <Header as='h2'>
                            <Header.Content>
                                <Header.Subheader>{product.brandName}</Header.Subheader>
                                {!isLoaded ? 'Carregando...' : product.name}
                            </Header.Content>
                        </Header>
                        { !isLoaded ? ( 
                            <Placeholder>
                                <Placeholder.Image square />
                            </Placeholder>
                        ) : (
                            <Image src={product.picture} rounded fluid onClick={() => setModalZoomOpen(true)} style={{cursor:'pointer'}} />
                        )}
                    </Segment>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={11} computer={11}>
                    <Segment>
                        { !isLoaded ? ( 
                            <Header as='h4'>Quem possui (Carregando...)</Header>
                        ) : (
                            <Header as='h4'>Quem possui {owners.length && '('+owners.length+')'}</Header>  
                        )}
                        {!isLoaded ? ( 
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                            </Placeholder>
                        ) : (
                            <List relaxed='very' size='large' divided>
                                { owners.length ? (
                                        owners.map((owner,key) =>
                                            <List.Item key={key} size='large'>
                                                <Image style={{cursor:'pointer'}} avatar src={owner.picture} onClick={() => history.push('/'+owner.username)} />
                                                <List.Content>
                                                    <List.Header as='a' onClick={() => history.push('/'+owner.username)}>{owner.name+' '+owner.lastname}</List.Header>
                                                    <List.Description style={{fontSize:'12px'}} className='py-1'>
                                                        {owner.city && <span>{owner.city}/{owner.region}</span>}
                                                    </List.Description>
                                                    <List.Description>
                                                        {!!owner.currentlyUsing && <Label content='Em uso' icon='checkmark' size='mini' style={{fontWeight:'500'}} />} {!!owner.forSale && <Label content='À venda' color='blue' size='mini' style={{fontWeight:'500'}} />} {!!owner.price && <span>{owner.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span>}
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                        )
                                ) : (
                                    <p>Nenhum usuário do Mublin possui este equipamento</p>
                                )}
                            </List>
                        )}
                    </Segment>
                </Grid.Column>
            </Grid>
            <Spacer className='d-lg-none' />
            <FooterMenuMobile />
            <Modal
                basic
                onClose={() => setModalZoomOpen(false)}
                onOpen={() => setModalZoomOpen(true)}
                open={modalZoomOpen}
                size='small'
                closeIcon
            >
                <Header inverted>
                    <Header.Content>
                        <Header.Subheader>{product.brandName}</Header.Subheader>
                        {product.name}
                    </Header.Content>
                </Header>
                <Modal.Content>
                    <Image src={product.largePicture} fluid onClick={() => setModalZoomOpen(false)} />
                </Modal.Content>
                {/* <Modal.Actions>
                    <Button basic inverted onClick={() => setModalZoomOpen(false)}>
                        Fechar
                    </Button>
                </Modal.Actions> */}
            </Modal>
        </>
    )
}

export default ProductPage;