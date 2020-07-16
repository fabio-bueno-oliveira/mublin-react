import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import { projectsInfos } from '../../store/actions/projects';
import { eventsInfos } from '../../store/actions/events';
import { Header, Tab, Card, Grid, List, Image, Icon, Menu, Button, Label } from 'semantic-ui-react';
import moment from 'moment';
import './styles.scss';

function ProfilePage () {

    let dispatch = useDispatch();

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        dispatch(projectsInfos.getUserMainProjects(user.id));
        dispatch(projectsInfos.getUserPortfolioProjects(user.id))
        dispatch(eventsInfos.getUserEvents(user.id))
    }, []);

    const projects = useSelector(state => state.projects);
    const mainProjects = projects.mainProjects;
    const portfolioProjects = projects.portfolioProjects;

    const events = useSelector(state => state.events)
    const allEvents = events.events
    const showsEvents = allEvents.filter((evento) => { return evento.id_event_type_fk === 2 || evento.id_event_type_fk === 3 || evento.id_event_type_fk === 5 ||  evento.id_event_type_fk === 6 })
    const rehearsalEvents = allEvents.filter((evento) => { return evento.id_event_type_fk === 1 })
    const recordingEvents = allEvents.filter((evento) => { return evento.id_event_type_fk === 4 })

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

            <Grid columns={3} className="container mb-3 mt-0 mt-md-4 pt-5">
                <Grid.Row>
                <Grid.Column>
                    <Link className="item" to={{ pathname: "/profile" }}>
                        <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
                    </Link>
                </Grid.Column>
                <Grid.Column>
                    <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
                </Grid.Column>
                <Grid.Column>
                    <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
                </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                <Grid.Column>
                    <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
                </Grid.Column>
                <Grid.Column>
                    <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
                </Grid.Column>
                <Grid.Column>
                    <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
                </Grid.Column>
                </Grid.Row>
            </Grid>

        </>
    );
};

export default ProfilePage;