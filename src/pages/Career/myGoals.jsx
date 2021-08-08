import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import { userInfos } from '../../store/actions/user';
import { Container, Header, Grid, Segment, Checkbox, List, Icon, Button } from 'semantic-ui-react';
import Flickity from 'react-flickity-component';
import './styles.scss';

function CareerGoalsPage () {

    document.title = 'Minhas metas | Mublin';

    let dispatch = useDispatch();

    let history = useHistory();

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        dispatch(userInfos.getUserProjects(user.id));
        dispatch(userInfos.getUserRolesInfoById(user.id));
    }, [user.id, dispatch]);

    const sliderOptions = {
        autoPlay: false,
        cellAlign: 'center',
        freeScroll: true,
        prevNextButtons: false,
        pageDots: false,
        wrapAround: false,
        draggable: '>1',
        resize: true,
        contain: true,
        initialIndex: 1
    }

    return (
        <>
        <HeaderDesktop />
        <HeaderMobile />
        <Spacer />
        <Container className='px-3'>
            <Flickity
                className={'carousel mb-4 mb-md-5'}
                elementType={'div'}
                options={sliderOptions}
                disableImagesLoaded={false}
                reloadOnUpdate
            >
                <Button circular size='tiny' content='Timeline de Projetos' className='mr-2' basic onClick={() => history.push('/career')} />
                <Button circular size='tiny' content='Minhas Metas' className='mr-2' secondary />
                <Button circular size='tiny' content='Meu Equipamento' basic onClick={() => history.push('/career/my-gear')} style={{width:'fit-content'}} />
            </Flickity>
        </Container>
        <Grid as='main' centered columns={1} className="container">
            <Grid.Row>
                <Grid.Column mobile={16} computer={10} className='mb-5 mb-md-0 pb-2 pb-md-0'>
                    <Button centered primary icon className='mb-2'>
                        <Icon name='plus' className='mr-1' /> Criar nova meta
                    </Button>
                    <List id="myGoals">
                        <List.Item>
                            <Checkbox label='Make my profile visible' />
                        </List.Item>
                        <List.Item>
                            <Checkbox label='Make my profile visible' />
                        </List.Item>
                    </List>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        <Spacer />
        <FooterMenuMobile />
        </>
    );
};

export default CareerGoalsPage;