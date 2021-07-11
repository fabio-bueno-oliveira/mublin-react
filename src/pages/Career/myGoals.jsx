import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import { userInfos } from '../../store/actions/user';
import { Container, Header, Grid, Segment, Checkbox, List, Icon, Label, Image, Button, Loader } from 'semantic-ui-react';
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
        cellAlign: 'left',
        freeScroll: true,
        prevNextButtons: false,
        pageDots: false,
        wrapAround: false,
        draggable: '>1',
        resize: true,
        contain: true
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
                <Button circular size='tiny' content='Timeline de Projetos' className='mr-2' onClick={() => history.push('/career')} basic />
                <Button circular size='tiny' content='Minhas Metas' className='mr-2' secondary />
                <Button circular size='tiny' content='Meus Equipamentos' basic />
            </Flickity>
            <Grid centered columns={1}>
                <Grid.Column width={16}>
                    <Segment basic textAlign='center'>
                        <Button centered primary icon className='mb-2'>
                            <Icon name='plus' className='mr-1' /> Criar nova meta
                        </Button>
                    </Segment>
                    <List id="myGoals">
                        <List.Item>
                            <Checkbox label='Make my profile visible' />
                        </List.Item>
                        <List.Item>
                            <Checkbox label='Make my profile visible' />
                        </List.Item>
                    </List>
                </Grid.Column>
            </Grid>
        </Container>
        <Spacer />
        <FooterMenuMobile />
        </>
    );
};

export default CareerGoalsPage;