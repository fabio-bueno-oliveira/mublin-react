import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { miscInfos } from '../../store/actions/misc';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import Spacer from '../../components/layout/Spacer'
import { Segment, Header, Grid, Icon, Form, Checkbox, Button, Image, Message, Modal } from 'semantic-ui-react';
import {IKUpload} from "imagekitio-react";
import './styles.scss'

function SubmitNewProduct () {

    document.title = 'Submeter novo produto | Mublin'

    let history = useHistory()

    let dispatch = useDispatch()

    let user = JSON.parse(localStorage.getItem('user'))

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null);
    const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isMacroCategoriesLoaded, setIsMacroCategoriesLoaded] = useState(false);
    const [macroCategories, setMacroCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [isColorsLoaded, setIsColorsLoaded] = useState(false);

    // Form Fields
    const [name, setName] = useState(null)
    const [brandId, setBrandId] = useState(null)
    const [categoryId, setCategoryId] = useState(null)
    const [colorId, setColorId] = useState(null)
    const [picture, setPicture] = useState(null)
    const [addNewProductToMyGear, setAddNewProductToMyGear] = useState(true)

    useEffect(() => { 
        dispatch(miscInfos.getGearBrands());
    }, [dispatch]);

    const gearList = useSelector(state => state.gear);

    useEffect(() => {
        fetch("https://mublin.herokuapp.com/gear/macroCategories")
          .then(res => res.json())
          .then(
            (result) => {
              setIsMacroCategoriesLoaded(true);
              setMacroCategories(result);
            },
            (error) => {
              setIsMacroCategoriesLoaded(true);
              setError(error);
            }
          )
        
        fetch("https://mublin.herokuapp.com/gear/categories")
          .then(res => res.json())
          .then(
            (result) => {
              setIsCategoriesLoaded(true);
              setCategories(result);
            },
            (error) => {
              setIsCategoriesLoaded(true);
              setError(error);
            }
        )

        fetch("https://mublin.herokuapp.com/gear/product/colors")
            .then(res => res.json())
            .then(
            (result) => {
                setIsColorsLoaded(true);
                setColors(result);
            },
            (error) => {
                setIsColorsLoaded(true);
                setError(error);
            }
        )
    }, [])

    // Upload product image to ImageKit.io
    const imageUploadPath = "/products/"
    const onUploadError = err => {
        alert("Ocorreu um erro. Tente novamente em alguns minutos.");
    };
    const onUploadSuccess = res => {
        let n = res.filePath.lastIndexOf('/');
        let fileName = res.filePath.substring(n + 1);
        setPicture(fileName)
    };

    // Submit new Brand
    const [modalNewBrandOpen, setModalNewBrandOpen] = useState(false)
    const [newBrandName, setNewBrandName] = useState(null)
    const [newBrandLogo, setNewBrandLogo] = useState(null)

    // Upload product image to ImageKit.io
    const logoUploadPath = "/products/brands/"
    const onLogoUploadError = err => {
        alert("Ocorreu um erro. Tente novamente em alguns minutos.");
    };
    const onLogoUploadSuccess = res => {
        let n = res.filePath.lastIndexOf('/');
        let fileName = res.filePath.substring(n + 1);
        setNewBrandLogo(fileName)
    };

    const submitNewBrand = () => {
        setIsLoading(true)
        setTimeout(() => {
            fetch('https://mublin.herokuapp.com/gear/submitNewGearBrand', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify({name: newBrandName, logo: newBrandLogo, id_user_creator: user.id})
            }).then(res => res.json()).then((result) => {
                dispatch(miscInfos.getGearBrands());
                setIsLoading(false)
                setNewBrandName('')
                setNewBrandLogo('')
                setBrandId(result.id)
                setModalNewBrandOpen(false)
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao adicionar a atividade")
                setIsLoading(false)
            })
        }, 300);
    }

    const submitNewProduct = () => {
        setIsLoading(true)
        setTimeout(() => {
            fetch('https://mublin.herokuapp.com/gear/submitNewGearProduct', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify({name: name, id_brand: brandId, id_category: categoryId, year: null, color: colorId, picture: picture, id_user_creator: user.id})
            }).then(res => res.json()).then((result) => {
                setIsLoading(false)
                setName(null)
                setBrandId(null)
                setCategoryId(null)
                setPicture(null)
                if (addNewProductToMyGear) {
                    addProductToMyGear(result.id)
                } else {
                    history.push("/career/my-gear")
                }
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao adicionar o produto. Talvez o mesmo produto já esteja cadastrado.")
                setIsLoading(false)
            })
        }, 300);
    }

    const addProductToMyGear = (newProductId) => {
        setIsLoading(true)
        setTimeout(() => {
            fetch('https://mublin.herokuapp.com/user/addGearItem', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify({productId: newProductId, featured: 0, for_sale: 0, price: null, currently_using: 1})
            }).then((response) => {
                setIsLoading(false)
                history.push("/career/my-gear")
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao adicionar o produto à sua lista de equipamentos")
                setIsLoading(false)
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
                        <Header as='h2' className='mb-3'>
                            Submeter novo produto/equipamento
                            {/* <Header.Subheader>
                                Envie um produto à base do Mublin
                            </Header.Subheader> */}
                        </Header>
                        <Segment color='blue'>
                            <Header as='h5'>
                                <Icon name='cloud upload' />
                                <Header.Content className='gear itemTitle'>
                                    <Header.Subheader>Colabore enviando produtos<br/>à nossa base de dados</Header.Subheader>
                                </Header.Content>
                            </Header>
                        </Segment>
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Field 
                                    label='Marca' 
                                    control='select'
                                    onChange={(e) => setBrandId(e.target.options[e.target.selectedIndex].value)}
                                    value={brandId}
                                    defaultValue={brandId}
                                >
                                    {(gearList.requesting) && 
                                        <option>Carregando...</option>
                                    }
                                    { !brandId &&
                                        <option>Selecione</option>
                                    } 
                                    { gearList.brands.map((brand,key) =>
                                        <option key={key} value={brand.id}>{brand.name}</option>
                                    )}
                                </Form.Field>
                                <Form.Field>
                                    <label>ou</label>
                                    <Button 
                                        fluid
                                        onClick={() => setModalNewBrandOpen(true)}
                                    >
                                        <Icon name='plus' />Adicionar nova marca
                                    </Button>
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Field 
                                    className='mt-3 mt-md-0'
                                    label='Categoria'
                                    control='select'
                                    onChange={(e) => setCategoryId(e.target.options[e.target.selectedIndex].value)}
                                    value={categoryId}
                                    defaultValue={categoryId}
                                >
                                    {(!isCategoriesLoaded) && 
                                        <option>Carregando...</option>
                                    }
                                    { !categoryId && 
                                        <option>Selecione</option>
                                    }
                                    { macroCategories.map((macroCategory,key) =>
                                        <>
                                            <optgroup label={macroCategory.name}>
                                                { categories.filter((x) => { return x.macro_category === macroCategory.name }).map((category,key) =>
                                                    <option key={key} value={category.id}>{category.name}</option>
                                                )}
                                            </optgroup>
                                        </>
                                    )}
                                </Form.Field>
                                <Form.Input 
                                    label='Modelo (sem a marca)'
                                    placeholder='Ex: BD-2 Blues Driver'
                                    name="name" 
                                    fluid 
                                    value={name}
                                    onChange={(e, { value }) => setName(value)} 
                                />
                                <Form.Field 
                                    className='mt-3 mt-md-0'
                                    label='Cor do produto'
                                    control='select'
                                    onChange={(e) => setColorId(e.target.options[e.target.selectedIndex].value)}
                                    value={colorId}
                                    defaultValue={colorId}
                                >
                                    {(!isColorsLoaded) && 
                                        <option>Carregando...</option>
                                    }
                                    { !colorId && 
                                        <option>Selecione</option>
                                    }
                                    { colors.map((color,key) =>
                                        <option key={key} value={color.id}>{color.name} {color.name_ptbr && '('+color.name_ptbr+')'}</option>
                                    )}
                                </Form.Field>
                            </Form.Group>
                            <Checkbox 
                                label='Adicionar este produto ao Meu Equipamento'
                                onChange={() => setAddNewProductToMyGear(value => !value)}
                                checked={addNewProductToMyGear ? true : false}
                                className='mb-3'
                            />
                            <Form.Field className='mb-0'>
                                <label for='picture'>Foto genérica do produto</label>
                            </Form.Field>
                            <Message size='small'>Envie um arquivo de até 2mb. A foto do produto deve ser genérica e com qualidade, de preferência em estado de novo. A foto deve ter aproximadamente 22 pixels de margem em cada extremidade (independente da largura ou altura), e fundo branco ou transparente. De prefência, de frente sem inclinação.<strong>Uma vez cadastrado, o produto não poderá ter a foto substituída!</strong></Message>
                            <Image.Group centered>
                                <Image centered src='https://ik.imagekit.io/mublin/misc/product-image-upload-guide_SRC738Rba.png' height='215' />
                                { picture && 
                                    <Image centered bordered spaced src={'https://ik.imagekit.io/mublin/tr:h-300,cm-pad_resize,bg-FFFFFF/products/'+picture} height='205' />
                                }
                            </Image.Group>
                            <div className={picture ? 'd-none' : ''}>
                                <IKUpload 
                                    id='picture'
                                    fileName="avatar.jpg"
                                    folder={imageUploadPath}
                                    tags={["gear"]}
                                    useUniqueFileName={true}
                                    isPrivateFile= {false}
                                    onError={onUploadError}
                                    onSuccess={onUploadSuccess}
                                    accept="image/x-png,image/gif,image/jpeg" 
                                />
                            </div>
                            <Button 
                                className='mt-3'
                                primary 
                                type='submit' 
                                floated='right'
                                disabled={(!name || !picture || !brandId || !categoryId) ? true : false}
                                onClick={() => submitNewProduct()}
                            >
                                Enviar
                            </Button>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Modal
                size='mini'
                open={modalNewBrandOpen}
                onClose={() => setModalNewBrandOpen(false)}
            >
                <Modal.Header>Cadastrar nova marca de equipamento</Modal.Header>
                <Modal.Content>
                    <Message icon size='tiny'>
                        <Icon name='exclamation triangle' />
                        <Message.Content>
                            Evite duplicidade! Certifique-se que a marca já não esteja cadastrada
                        </Message.Content>
                    </Message>
                    <Form>
                        <Form.Input
                            label='Nome'
                            name="newBrandName" 
                            fluid 
                            value={newBrandName}
                            onChange={(e, { value }) => setNewBrandName(value)} 
                        />
                        <Form.Field className='mb-0'>
                            <label for='newBrandLogo'>Logotipo</label>
                        </Form.Field>
                        <div className={picture ? 'd-none' : ''}>
                            <IKUpload 
                                id='newBrandLogo'
                                fileName={newBrandName+'_avatar.jpg'}
                                folder={logoUploadPath}
                                tags={["logo"]}
                                useUniqueFileName={true}
                                isPrivateFile= {false}
                                onError={onLogoUploadError}
                                onSuccess={onLogoUploadSuccess}
                                accept="image/x-png,image/gif,image/jpeg" 
                            />
                        </div>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => setModalNewBrandOpen(false)}>
                        Cancelar
                    </Button>
                    <Button
                        type='submit' 
                        disabled={(!newBrandName || !newBrandLogo) ? true : false} 
                        primary 
                        onClick={() => submitNewBrand()} 
                        loading={isLoading}
                    >
                        Enviar
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    );
};

export default SubmitNewProduct;