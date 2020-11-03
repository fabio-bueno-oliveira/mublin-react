import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import Spacer from '../../components/layout/Spacer'
import { userInfos } from '../../store/actions/user';
import { Form, Segment, Image, Modal, Header, Label, Grid, Button, Icon, Loader } from 'semantic-ui-react';
import './styles.scss'

function MyGearPage () {

    document.title = 'Meu equipamento | Mublin'

    let history = useHistory()

    let dispatch = useDispatch()

    let user = JSON.parse(localStorage.getItem('user'))

    // const [isLoading, setIsLoading] = useState(false)

    useEffect(() => { 
        dispatch(userInfos.getInfo());
        dispatch(userInfos.getUserGearInfoById(user.id));
    }, [dispatch, user.id]);

    const userInfo = useSelector(state => state.user);

    // Modal Add New Gear
    const [modalAddNewProductOpen, setModalAddNewProductOpen] = useState(false)
    const [brandSelected, setBrandSelected] = useState('')
    const [categorySelected, setCategorySelected] = useState('')
    const [productSelected, setProductSelected] = useState('')
    const selectBrand = (brandId) => {
        setBrandSelected(brandId)
        setCategories([])
        setCategorySelected('')
        setProducts([])
        setProductSelected('')
        getCategories(brandId)
    }
    const selectCategory = (categoryId) => {
        setProductSelected('')
        setCategorySelected(categoryId)
        getProducts(brandSelected,categoryId)
    }

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        fetch("https://mublin.herokuapp.com/gear/brands")
          .then(res => res.json())
          .then(
            (result) => {
              setIsLoaded(true);
              setBrands(result);
            },
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
    }, [])

    const getCategories = (brandId) => {
        setIsLoaded(false);
        fetch("https://mublin.herokuapp.com/gear/brand/"+brandId+"/categories")
            .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true);
                setCategories(result);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    const getProducts = (brandId, categoryId) => {
        setIsLoaded(false);
        fetch("https://mublin.herokuapp.com/gear/brand/"+brandId+"/"+categoryId+"/products")
            .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true);
                setProducts(result);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    const productInfo = products.filter((product) => { return product.id === Number(productSelected)}) 

    const deleteGear = (userGearId) => {
        setIsLoaded(false)
        fetch('https://mublin.herokuapp.com/user/'+userGearId+'/deleteGearItem', {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            }
        }).then((response) => {
            dispatch(userInfos.getUserGearInfoById(user.id));
            setIsLoaded(true)
        }).catch(err => {
            console.error(err)
            alert("Ocorreu um erro ao remover o item")
            setIsLoaded(true)
        })
    }

    // Add product to my gear
    const [modalEditProductOpen, setModalEditProductOpen] = useState(false)

    const addProductToGear = (productId, featured, for_sale, price, currently_using) => {
        setIsLoaded(false)
        setTimeout(() => {
            fetch('https://mublin.herokuapp.com/user/addGearItem', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify({productId: productId, featured: featured, for_sale: for_sale, price: price, currently_using: currently_using})
            }).then((response) => {
                dispatch(userInfos.getUserGearInfoById(user.id));
                setIsLoaded(true)
                setModalAddNewProductOpen(false)
                setBrandSelected('')
                setCategorySelected('')
                setProductSelected('')
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao adicionar a atividade")
                setIsLoaded(true)
            })
        }, 300);
    }

    // Edit item
    const [modalEditItemOpen, setModalEditItemOpen] = useState(false)
    const [modalItemManagementProductId, setModalItemManagementProductId] = useState(null)
    
    const [featured, setFeatured] = useState('')
    const [for_sale, setForSale] = useState('')
    const [price, setPrice] = useState('')
    const [currently_using, setCurrentlyUsing] = useState('')

    const [itemIdToEdit, setItemIdToEdit] = useState('')
    const openModalItemManagement = (itemId, productId, featured, for_sale, price, currently_using) => {
        setModalItemManagementProductId(productId)
        setItemIdToEdit(itemId)
        setModalEditItemOpen(true)
        setFeatured(featured)
        setForSale(for_sale)
        setPrice(price)
        setCurrentlyUsing(currently_using)
    }
    console.log(itemIdToEdit)
    const itemInfo = userInfo.gear.filter((item) => { return item.productId === modalItemManagementProductId })

    const editGearItem = (itemId, productId, featured, for_sale, price, currently_using) => {
        console.log(itemId)
        setIsLoaded(false)
        setTimeout(() => {
            fetch('https://mublin.herokuapp.com/user/updateGearItem', {
                method: 'put',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify({id: itemId, productId: productId, featured: featured, for_sale: for_sale, price: price, currently_using: currently_using})
            }).then((response) => {
                dispatch(userInfos.getUserGearInfoById(user.id));
                setIsLoaded(true)
                setModalEditItemOpen(false)
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao adicionar a atividade")
                setIsLoaded(true)
            })
        }, 300);
    }

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid as='main' centered columns={1} className="container">
                <Grid.Row>
                    <Grid.Column mobile={16} computer={10}>
                        <Header as='h2' className='mb-4'>Meu equipamento</Header>
                        <Segment color='green' className='cpointer' onClick={() => setModalAddNewProductOpen(true)}>
                            <Header as='h5'>
                                <Icon name='plus' />
                                <Header.Content className='gear itemTitle'>
                                    Novo
                                    <Header.Subheader>Adicione um novo item à sua lista</Header.Subheader>
                                </Header.Content>
                            </Header>
                        </Segment>
                        { !userInfo.requesting ? (
                            userInfo.gear.map((item, key) => (
                                <>
                                    { item.id && 
                                    <Segment.Group horizontal key={key}>
                                        <Segment className='gear itemDescriptionColumn'>
                                            <Header as='h5'>
                                                <Image src={item.picture} />
                                                <Header.Content className='gear itemTitle'>
                                                    <Header.Subheader className='mb-1'>{item.brandName}</Header.Subheader>
                                                    {item.productName}
                                                    <Header.Subheader>
                                                        <Icon name={item.featured ? 'toggle on' : 'toggle off'} color={item.featured ? 'green' : null} className='mr-1' />Em destaque
                                                    </Header.Subheader>
                                                    <Header.Subheader>
                                                        <Icon name={item.currentlyUsing ? 'toggle on' : 'toggle off'} color={item.currentlyUsing ? 'green' : null} className='mr-1' />Em uso
                                                    </Header.Subheader>
                                                    <Header.Subheader>
                                                        <Icon name={item.forSale ? 'toggle on' : 'toggle off'} color={item.forSale ? 'green' : null} className='mr-1' />À venda<br/>
                                                        {!!item.forSale && '('+item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})+')'}
                                                    </Header.Subheader>
                                                </Header.Content>
                                            </Header>
                                        </Segment>
                                        <Segment className='gear itemActionColumn'>
                                            <Button icon size='mini' className='mr-1' title='Editar' onClick={() => openModalItemManagement(item.id, item.productId, item.featured, item.forSale, item.price, item.currentlyUsing)}>
                                                <Icon name='pencil' />
                                            </Button>
                                            <Button icon size='mini' color='red' className='mr-0' onClick={() => deleteGear(item.id)} title='Remover'>
                                                <Icon name='times' />
                                            </Button>
                                        </Segment>
                                    </Segment.Group>
                                    }
                                </>
                            ))
                        ) : (
                            <p>Carregando...</p>
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Modal
                size='mini'
                open={modalAddNewProductOpen}
                onClose={() => setModalAddNewProductOpen(false)}
            >
                <Modal.Header>Adicionar novo item</Modal.Header>
                <Modal.Content>
                    <Form className='mb-1'>
                        <Form.Field 
                            label='Marca' 
                            control='select'
                            onChange={(e) => selectBrand(e.target.options[e.target.selectedIndex].value)}
                            value={brandSelected}
                            defaultValue={brandSelected}
                        >
                            { !brandSelected &&
                                <option>Selecione</option>
                            } 
                            { brands.map((brand,key) =>
                                <option key={key} value={brand.id}>{brand.name}</option>
                            )}
                        </Form.Field>
                        <Form.Field 
                            label='Categoria' 
                            control='select'
                            onChange={(e) => selectCategory(e.target.options[e.target.selectedIndex].value)}
                            value={categorySelected}
                            defaultValue={categorySelected}
                        >
                            {!isLoaded && 
                                <option>Carregando...</option>
                            }
                            { !categorySelected && 
                                <option>{!brandSelected ? 'Selecione primeiro a marca' : 'Selecione a categoria'}</option>
                            } 
                            { categories.map((category,key) =>
                                <option key={key} value={category.id}>{category.name}</option>
                            )}
                        </Form.Field>
                        <Form.Field 
                            className='mb-3'
                            label='Produto' 
                            control='select'
                            onChange={(e) => setProductSelected(e.target.options[e.target.selectedIndex].value)}
                            value={productSelected}
                        >
                            {!isLoaded && 
                                <option>Carregando...</option>
                            }
                            { !productSelected && 
                                <option value=''>{!categorySelected ? 'Selecione primeiro a categoria' : 'Selecione o produto'}</option>
                            }
                            { products.map((product,key) =>
                                <option key={key} value={product.id} disabled={!!userInfo.gear.filter((x) => { return x.productId === Number(product.id)}).length}>{product.name} {!!userInfo.gear.filter((x) => { return x.productId === Number(product.id)}).length && '(já adicionado)'}</option>
                            )}
                        </Form.Field>
                        { (productSelected && productInfo) &&
                            <Image src={productInfo[0].picture} size='small' centered className='mb-1' />
                        }
                    </Form>
                    <div style={{fontSize:'12px',width:'100%',textAlign:"right"}}>
                        <Link as='a' to={{ pathname: '/gear/submit/product' }}>
                            Não encontrei meu produto na lista
                        </Link>
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button size='tiny' onClick={() => setModalAddNewProductOpen(false)}>
                        Cancelar
                    </Button>
                    <Button size='tiny' secondary onClick={() => addProductToGear(productSelected, 0, 0, null, 1)} disabled={!productSelected ? true : false} loading={!isLoaded}>
                        Adicionar
                    </Button>
                </Modal.Actions>
            </Modal>
            <Modal
                size='mini'
                open={modalEditItemOpen}
                onClose={() => setModalEditItemOpen(false)}
            >
                <Modal.Header>Editar detalhes do item</Modal.Header>
                <Modal.Content>
                    <Form className='mb-1'>
                        { modalItemManagementProductId && itemInfo.map((item, key) =>
                            <>
                                <Header as='h5'>
                                    <Image src={item.picture} />
                                    <Header.Content>
                                        {item.productName}
                                        <Header.Subheader className='mb-1'>{item.brandName}</Header.Subheader>
                                    </Header.Content>
                                </Header>
                                <Form.Group widths='equal'>
                                    <Form.Field 
                                        label='Manter em destaque' 
                                        control='select'
                                        onChange={(e) => 
                                            setFeatured(e.target.options[e.target.selectedIndex].value)
                                        }
                                        value={featured}
                                    >
                                        <option value='1'>Sim</option>
                                        <option value='0'>Não</option>
                                    </Form.Field>
                                    <Form.Field 
                                        label='Em uso atualmente' 
                                        control='select'
                                        onChange={(e) => 
                                            setCurrentlyUsing(e.target.options[e.target.selectedIndex].value)
                                        }
                                        value={currently_using}
                                    >
                                        <option value='1'>Sim</option>
                                        <option value='0'>Não</option>
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Field 
                                        label='À venda' 
                                        control='select'
                                        onChange={(e) => 
                                            setForSale(e.target.options[e.target.selectedIndex].value)
                                        }
                                        value={for_sale}
                                    >
                                        <option value='1'>Sim</option>
                                        <option value='0'>Não</option>
                                    </Form.Field>
                                    <Form.Field
                                        disabled={(for_sale === '1' || for_sale === 1) ? false : true}
                                        label='Preço de venda'
                                        id='price'
                                        name='price'
                                        control='input'
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                    />
                                </Form.Group>
                            </>
                        )}
                        { (productSelected && productInfo) &&
                            <Image src={productInfo[0].picture} size='small' centered className='mb-1' />
                        }
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button size='tiny' onClick={() => setModalEditItemOpen(false)}>
                        Cancelar
                    </Button>
                    <Button size='tiny' secondary onClick={() => editGearItem(itemIdToEdit, modalItemManagementProductId, featured, for_sale, price, currently_using)} loading={!isLoaded}>
                        Salvar
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    );
};

export default MyGearPage;