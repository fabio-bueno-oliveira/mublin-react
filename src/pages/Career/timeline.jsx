import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer';
import { userInfos } from '../../store/actions/user';
import { Container, Header, Grid, Segment, Checkbox, List, Label, Image, Button, Loader } from 'semantic-ui-react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Flickity from 'react-flickity-component';
import './styles.scss';

function CareerTimelinePage () {

    document.title = 'Minha carreira | Mublin';

    let dispatch = useDispatch();

    let history = useHistory();

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        dispatch(userInfos.getUserProjects(user.id));
        dispatch(userInfos.getUserRolesInfoById(user.id));
    }, [user.id, dispatch]);

    const loading = useSelector(state => state.user.requesting)
    const projects = useSelector(state => state.user.projects.sort((a, b) => b.joined_in - a.joined_in))

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
                <Button circular size='tiny' content='Timeline de Projetos' className='mr-2' secondary />
                <Button circular size='tiny' content='Minhas Metas' className='mr-2' onClick={() => history.push('/career/my-goals')} basic />
                <Button circular size='tiny' content='Meus Equipamentos' basic />
            </Flickity>
            <Grid centered columns={1}>
                <Grid.Column mobile={16} tablet={16} computer={8}>
                    {loading ? (
                        <div style={{textAlign: 'center', width: '100%', height: '100px'}} className='pt-5'>
                            <Loader active inline='centered' />
                        </div>
                    ) : (
                        <>
                        <Header as='h6'>
                            <Header.Subheader>
                                Ordenada por participação mais recente
                            </Header.Subheader>
                        </Header>
                        <VerticalTimeline
                            layout="1-column-left"
                        >
                            {projects.map((project, key) =>
                                <VerticalTimelineElement 
                                    key={key}
                                    className="vertical-timeline-element--work"
                                    // contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                                    // contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                                    // date={"2011 - present"}
                                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                                    // icon={<Icon name='plus' style={{margin:'12px'}} />}
                                    icon={<Image circular src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-160,w-160,c-maintain_ratio/'+project.picture : 'https://ik.imagekit.io/mublin/sample-folder/avatar-undefined_-dv9U6dcv3.jpg'} />}
                                >
                                    <Header as='h4' className='mt-0 mb-1'>
                                        <Header.Content>
                                            {project.name}
                                            <Header.Subheader>{project.ptname}</Header.Subheader>
                                        </Header.Content>
                                    </Header>
                                    <div>
                                        {project.role1 && <Label size='mini' style={{fontWeight:'500'}}>{project.role1.length > 11 ? `${project.role1.substring(0, 11)}...` : project.role1}</Label>} {project.role2 && <Label size='mini' style={{fontWeight:'500'}}>{project.role2.length > 11 ? `${project.role2.substring(0, 11)}...` : project.role2}</Label>} {project.role3 && <Label size='mini' style={{fontWeight:'500'}}>{project.role3.length > 11 ? `${project.role3.substring(0, 11)}...` : project.role3}</Label>}
                                    </div>
                                    {(project.joined_in && (project.joined_in !== project.yearLeftTheProject)) ? ( 
                                        <span class="vertical-timeline-element-date pt-2 pb-0">
                                            { !project.yearEnd ? ( 
                                                project.joined_in +' ➜ '+(project.yearLeftTheProject ? project.yearLeftTheProject : 'atualmente')
                                            ) : (
                                                project.joined_in +' ➜ '+project.yearEnd
                                            )}
                                        </span>
                                    ) : (
                                        <span class="vertical-timeline-element-date pt-2 pb-0">
                                            {project.joined_in} {project.yearEnd && ' ➜ '+project.yearEnd}
                                        </span>
                                    )}
                                </VerticalTimelineElement>
                            )}
                        </VerticalTimeline>
                        </>
                    )}
                </Grid.Column>
            </Grid>
        </Container>
        <Spacer />
        <FooterMenuMobile />
        </>
    );
};

export default CareerTimelinePage;