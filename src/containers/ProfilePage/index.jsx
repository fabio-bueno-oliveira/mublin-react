import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HeaderDesktop from '../../components/layout/headerDesktop';
import { projectsInfos } from '../../store/actions/projects';
import { eventsInfos } from '../../store/actions/events';
import { Header, Tab, Card, Grid, List, Image, Icon, Menu, Button, Label } from 'semantic-ui-react';
import Slider from '../../components/slider';
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
        <main className="home mt-5 pt-5">
            
        </main>
        </>
    );
};

export default ProfilePage;