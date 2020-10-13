import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Header, Image, Item, Segment, Label } from 'semantic-ui-react';
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
    const [owners, setOwners] = useState([]);

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

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid as='main' columns={1} className="container">
                <Grid.Row centered>
                  <Grid.Column mobile={14} computer={6}>
                        <Segment>
                            <Header as='h2'>
                                <Header.Content>
                                    {!isLoaded ? 'Carregando...' : product.name}
                                    <Header.Subheader>{product.brandName}</Header.Subheader>
                                </Header.Content>
                            </Header>
                            <Image src={product.picture} rounded fluid />
                        </Segment>

                        <Segment>
                            <Header as='h3'>
                                Quem utiliza {owners.length && '('+owners.length+')'}
                            </Header>
                            <Item.Group link>
                                {owners.map((owner,key) =>
                                    <Item onClick={() => history.push('/'+owner.username)}>
                                        <Item.Image size='tiny' src={owner.picture} />
                                        <Item.Content>
                                            <Item.Header>{owner.name+' '+owner.lastname}</Item.Header>
                                            <Item.Description>
                                                {!!owner.currentlyUsing && <Label content='Em uso' icon='checkmark' size='mini' style={{fontWeight:'500'}} />} {!!owner.forSale && <Label content='À venda' color='blue' size='mini' style={{fontWeight:'500'}} />} {!!owner.price && <span>{owner.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span>}
                                            </Item.Description>
                                            <Item.Description>
                                                {owner.city && <span>{owner.city}/{owner.region}</span>}
                                            </Item.Description>
                                        </Item.Content>
                                    </Item>
                                )}
                            </Item.Group>
                        </Segment>

                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default ProductPage;