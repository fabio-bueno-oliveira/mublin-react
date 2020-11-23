import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { userInfos } from '../../store/actions/user';
import { projectInfos } from '../../store/actions/project';
import { Grid, Header, Form, Button, Image, Segment, Label, Tab, Icon, Dropdown, Step } from 'semantic-ui-react';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import FooterMenuMobile from '../../components/layout/footerMenuMobile';
import Spacer from '../../components/layout/Spacer'
import {IKUpload} from "imagekitio-react";
import IntlCurrencyInput from "react-intl-currency-input";
import html2canvas from 'html2canvas';

function CreateNewEventPage () {

    let dispatch = useDispatch();

    let newEventType = (new URLSearchParams(window.location.search)).get("type")
    let newEventProjectId = (new URLSearchParams(window.location.search)).get("project")

    let defaultEventType
    if (newEventType === 'public') {
        defaultEventType = 1
    } else {
        defaultEventType = 0
    }
 
    document.title = newEventType === 'public' ? 'Criar novo evento público | Mublin' : 'Criar novo evento privado | Mublin'

    const userSession = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        window.scrollTo(0, 0)
        dispatch(userInfos.getUserProjects(userSession.id));
    }, [userSession.id, dispatch]);

    const userInfo = useSelector(state => state.user);
    const project = useSelector(state => state.project);

    // let history = useHistory();

    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    const [isLoading, SetIsLoading] = useState(false)

    const currencyConfig = {
        locale: "pt-BR",
        formats: {
          number: {
            BRL: {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            },
          },
        },
    };

    // Form fields
    const [eventProjectId, setEventProjectId] = useState(newEventProjectId)
    const selectProject = (id, username) => {
        setEventProjectId(id)
        dispatch(projectInfos.getProjectInfo(username));
    }
    const [eventPrivacity, setEventPrivacity] = useState(defaultEventType)
    const changePrivacity = (value) => {
        setEventPrivacity(value)
        setEventType('')
    }
    const [eventName, setEventName] = useState('')
    const [eventDescription, setEventDescription] = useState('')
    const [eventOpeningDate, setEventOpeningDate] = useState(date)
    const [eventOpeningHour, setEventOpeningHour] = useState('21:00')
    const [eventEndingDate, setEventEndingDate] = useState(date)
    const [eventEndingHour, setEventEndingHour] = useState('23:00')
    const [eventType, setEventType] = useState('')
    const [eventImage, setEventImage] = useState('')
    const [eventMethod, setEventMethod] = useState(1)
    const [eventUrlMoreInfo, setEventUrlMoreInfo] = useState('')
    const [eventTicketPrice, setEventTicketPrice] = useState(null)
    const handleChangeEventTicketPrice = (event, value, maskedValue) => {
        setEventTicketPrice(value)
    }
    const [eventRegionId, setEventRegionId] = useState('')
    const [selectedRegionName, setSelectedRegionName] = useState('')
    const selectRegion = (regionId, regionName) => {
        setEventRegionId(regionId)
        setSelectedRegionName(regionName)
        searchCities(regionId)
    } 
    const [eventCityId, setEventCityId] = useState('')
    const [selectedCityName, setSelectedCityName] = useState('')
    const selectCity = (cityId, cityName) => {
        setEventCityId(cityId)
        setSelectedCityName(cityName)
    }
    const [eventPlaceId, setEventPlaceId] = useState('')
    const [selectedPlaceName, setSelectedPlaceName] = useState('')
    const selectPlace = (placeId, placeName) => {
        setEventPlaceId(placeId)
        setSelectedPlaceName(placeName.split('(')[0])
    }
    const [eventPurpose, setEventPurpose] = useState('')
    const [eventFeeTotal, setEventFeeTotal] = useState(null)
    const handleChangeEventFeeTotal = (event, value, maskedValue) => {
        setEventFeeTotal(value)
    }
    const [eventFeePerMember, setEventFeePerMember] = useState(null)
    const handleChangeEventFeePerMember = (event, value, maskedValue) => {
        setEventFeePerMember(value)
    }
    const [eventCostPerMember, setEventCostPerMember] = useState(null)
    const handleChangeEventCostPerMember = (event, value, maskedValue) => {
        setEventCostPerMember(value)
    }

    // Image Upload to ImageKit.io
    const userAvatarPath = "/events/"
    const onUploadError = err => {
        alert("Ocorreu um erro. Tente novamente em alguns minutos.");
    };
    const onUploadSuccess = res => {
        let n = res.filePath.lastIndexOf('/');
        let fileName = res.filePath.substring(n + 1);
        setEventImage(fileName)
        // updatePicture(userInfo.id,fileName)
    };

    // Art sample
    const [sampleColor, setSampleColor] = useState('olive')

    const colors = [
        'red',
        'orange',
        'yellow',
        'olive',
        'green',
        'teal',
        'blue',
        'violet',
        'purple',
        'pink',
        'brown',
        'grey'
    ]

    const takeScreenshot = () => {
        let flyer = document.querySelector('.flyer');
        html2canvas(flyer, {logging: true, letterRendering: 1,allowTaint: false, useCORS: true, scale: 2}).then(function(canvas) {
            let imgData = canvas.toDataURL('image/png');
            saveAs(canvas.toDataURL(), 'art.png');
        });
    }

    function saveAs(uri, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
          link.href = uri;
          link.download = filename;

          //Firefox requires the link to be in the body
          document.body.appendChild(link);

          //simulate click
          link.click();

          //remove the link when done
          document.body.removeChild(link);
        } else {
          window.open(uri);
        }
    }

    const regionOptions = [
        { key: '', text: 'Selecione...', value: '' },
        { key: 'AC', text: 'Acre', value: '415' },
        { key: 'AL', text: 'Alagoas', value: '422' },
        { key: 'AP', text: 'Amapá', value: '406' },
        { key: 'AM', text: 'Amazonas', value: '407' },
        { key: 'BA', text: 'Bahia', value: '402' },
        { key: 'CE', text: 'Ceará', value: '409' },
        { key: 'DF', text: 'Distrito Federal', value: '424' },
        { key: 'ES', text: 'Espírito Santo', value: '401' },
        { key: 'GO', text: 'Goiás', value: '411' },
        { key: 'MA', text: 'Maranhão', value: '419' },
        { key: 'MT', text: 'Mato Grosso', value: '418' },
        { key: 'MS', text: 'Mato Grosso do Sul', value: '399' },
        { key: 'MG', text: 'Minas Gerais', value: '404' },
        { key: 'PA', text: 'Pará', value: '408' },
        { key: 'PB', text: 'Paraíba', value: '405' },
        { key: 'PR', text: 'Paraná', value: '413' },
        { key: 'PE', text: 'Pernambuco', value: '417' },
        { key: 'PI', text: 'Piauí', value: '416' },
        { key: 'RJ', text: 'Rio de Janeiro', value: '410' },
        { key: 'RN', text: 'Rio Grande do Norte', value: '414' },
        { key: 'RS', text: 'Rio Grande do Sul', value: '400' },
        { key: 'RO', text: 'Rondônia', value: '403' },
        { key: 'RR', text: 'Roraima', value: '421' },
        { key: 'SC', text: 'Santa Catarina', value: '398' },
        { key: 'SP', text: 'São Paulo', value: '412' },
        { key: 'SE', text: 'Sergipe', value: '423' },
        { key: 'TO', text: 'Tocantins', value: '420' },
    ]

    const [queryCities, setQueryCities] = useState([]);
    const [citySearchIsLoading, setCitySearchIsLoading] = useState(false)

    const [searchCity] = useDebouncedCallback((keyword) => {
        if (keyword.length > 1) {
            setCitySearchIsLoading(true)
            fetch('https://mublin.herokuapp.com/search/cities/'+keyword+'/'+eventRegionId, {
                method: 'GET'
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.length) {
                            setQueryCities(result);
                        }
                        setCitySearchIsLoading(false)
                    },
                    (error) => {
                        setCitySearchIsLoading(false)
                        alert("Ocorreu um erro ao pesquisar a cidade")
                })
            }
        },800
    );

    const [cities, setCities] = useState([
        {
            value: '',
            text: ''
        }
    ])

    // const searchCities = (regionId) => {
    //     setCitySearchIsLoading(true)
    //     fetch('https://mublin.herokuapp.com/search/getCitiesByRegion/'+regionId)
    //         .then(res => res.json())
    //         .then(
    //             (result) => {
    //                 setCities(result.map(x => ({ 
    //                     centroDeCusto: x.value,
    //                     text: x.text
    //                 })))
    //                 setCitySearchIsLoading(false)
    //             },
    //             (error) => {
    //                 setCitySearchIsLoading(false)
    //                 alert("Ocorreu um erro ao pesquisar as cidades")
    //             }
    // }

    const searchCities = (regionId) => {
        setCitySearchIsLoading(true)
            fetch('https://mublin.herokuapp.com/search/getCitiesByRegion/'+regionId, {
                method: 'GET'
            }).then(res => res.json()).then((result) => {
                setCities(result.map(x => ({ 
                    value: x.value,
                    text: x.text
                })))
                setCitySearchIsLoading(false)
            }).catch(err => {
                console.error(err)
                alert("Ocorreu um erro ao pesquisar as cidades")
                setCitySearchIsLoading(false)
                setCities([
                    {
                        value: '',
                        text: ''
                    }
                ])
            })
    }

    console.log(281, cities)

    const [queryPlaces, setQueryPlaces] = useState([]);
    const [placeSearchIsLoading, setPlaceSearchIsLoading] = useState(false)

    const [searchPlace] = useDebouncedCallback((keyword) => {
        if (keyword.length > 1) {
            setPlaceSearchIsLoading(true)
            fetch('https://mublin.herokuapp.com/search/places/minimalResult/'+keyword, {
                method: 'GET'
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.length) {
                            setQueryPlaces(result);
                        }
                        setPlaceSearchIsLoading(false)
                    },
                    (error) => {
                        setPlaceSearchIsLoading(false)
                        alert("Ocorreu um erro ao pesquisar o local")
                })
            }
        },800
    );

    const [showMobileMenu, setShowMobileMenu] = useState(true)

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid as='main' centered columns={2} className="container">
                <Grid.Row>
                    <Grid.Column computer={9} mobile={16}>
                        <Header as='h2' className='mb-4'>
                            Criar novo evento
                        </Header>
                        <Step.Group unstackable widths={4} size='mini'>
                            <Step active>
                                <Step.Content>
                                    <Step.Title>Resumo</Step.Title>
                                </Step.Content>
                            </Step>
                            <Step disabled>
                                <Step.Content>
                                    <Step.Title>Detalhes</Step.Title>
                                </Step.Content>
                            </Step>
                            <Step disabled>
                                <Step.Content>
                                    <Step.Title>Playlist</Step.Title>
                                </Step.Content>
                            </Step>
                            <Step disabled>
                                <Step.Content>
                                    <Step.Title>Presenças</Step.Title>
                                </Step.Content>
                            </Step>
                        </Step.Group>
                        <Form
                            onFocus={() => setShowMobileMenu(false)}
                            onBlur={() => setShowMobileMenu(true)}
                        >
                            <Form.Field 
                                className='mt-4'
                                label='Propósito do evento' 
                                control='select'
                                name='eventPurpose'
                                defaultValue={newEventType === 'private' ? '2' : '1'}
                                onChange={(e) => setEventPurpose(e.target.options[e.target.selectedIndex].value)}
                            >
                                <option value='1'>Divulgar e promover</option>
                                <option value='2'>Planejamento</option>
                                <option value='3'>Registro/Gravação</option>
                                <option value='4'>Evoluir/Aperfeiçoar</option>
                                <option value='5'>Outros</option>
                            </Form.Field>
                            <Form.Field className='mb-0'>
                                <label for='eventFeeTotal'>Cachê (total)</label>
                            </Form.Field>
                            <IntlCurrencyInput 
                                currency='BRL' 
                                config={currencyConfig}
                                id='eventFeeTotal'
                                name='eventFeeTotal'
                                value={eventFeeTotal}
                                onChange={handleChangeEventFeeTotal} 
                                className='mb-3'
                            />
                            <Form.Field className='mb-0'>
                                <label for='eventFeePerMember'>Cachê (por integrante)</label>
                            </Form.Field>
                            <IntlCurrencyInput 
                                currency='BRL'
                                config={currencyConfig}
                                id='eventFeePerMember'
                                name='eventFeePerMember'
                                value={eventFeePerMember}
                                onChange={handleChangeEventFeePerMember} 
                                className='mb-3'
                            />
                            <Form.Field className='mb-0'>
                                <label for='eventCostPerMember'>Custos do evento (por integrante)</label>
                                <span>Ex.: Custos com viagem, etc</span>
                            </Form.Field>
                            <IntlCurrencyInput 
                                currency='BRL' 
                                config={currencyConfig}
                                id='eventCostPerMember'
                                name='eventCostPerMember'
                                value={eventCostPerMember}
                                onChange={handleChangeEventCostPerMember} 
                                className='mb-3'
                            />
                            <Form.TextArea 
                                name='leaderCommentsBefore'
                                label='Comentários anteriores ao evento' 
                                placeholder='Ex.: Esta apresentação será focada em divulgar as novas músicas' 
                            />
                        </Form>
                        <Button primary floated='right' className='mt-3' loading={isLoading}>
                            Enviar
                        </Button>
                    </Grid.Column>
                    <Grid.Column computer={5} mobile={16}>
                        <p className='textCenter mt-4 mt-md-0'>Amostra da comunicação do evento</p>
                        { !eventProjectId ? (
                            <Segment secondary textAlign='center' className='mb-5 mb-md-0' style={{height:'300px',alignItems:'center',display:'flex',justifyContent:'center',color:'#CECECE'}}>
                                <span>Selecione o projeto para visualizar</span>
                            </Segment>
                        ) : (
                            <>
                            <div style={{textAlign:'center',width:'100%'}}>
                                {colors.map((color) => (
                                    <Label circular color={color} empty key={color} className='cpointer mt-3' onClick={() => setSampleColor(color)} style={ color === sampleColor ? { border:'2px solid black' } : {}} title={color} />
                                ))}
                            </div>
                            <Segment textAlign='center' inverted color='black' className='flyer'>
                                <p className='mb-0'>{eventOpeningDate.split('-').reverse().join('/') + ' às ' + eventOpeningHour}</p>
                                {/* <p className='mb-3' style={{fontSize:'11px'}}>Evento {eventMethod === 1 ? 'Presencial' : 'Online'}</p> */}
                                <Header as='h5' className='mt-0 mb-3' inverted color={sampleColor}>Evento {eventMethod === 1 ? 'Presencial' : 'Online'}</Header>
                                { (!project.requesting && eventProjectId && project.picture) &&
                                    <Image centered rounded src={'https://ik.imagekit.io/mublin/projects/tr:h-500,w-500,c-maintain_ratio/'+project.picture} size='small' />
                                }
                                {
                                    {
                                        1: <p className='mt-3 mb-0'>Ensaio</p>,
                                        3: <p className='mt-3 mb-0'>Reunião</p>,
                                        4: <p className='mt-3 mb-0'>Gravação</p>,
                                        2: <p className='mt-3 mb-0'>Apresentação</p>,
                                        5: <p className='mt-3 mb-0'>Entrevista</p>,
                                        6: <p className='mt-3 mb-0'>Workshop</p>
                                    }[eventType]
                                }
                                <Header as='h1' className='mt-0 mb-0' inverted color={sampleColor}>{project.name}</Header>
                                { eventName && 
                                    <Header as='h3' className='mt-3 mb-1' inverted color={sampleColor}>{eventName}</Header>
                                }
                                { eventDescription && 
                                    <p className='mb-3'>{eventDescription}</p>
                                }
                                { selectedPlaceName && 
                                    <p style={{fontSize:'11.5px'}}>{selectedPlaceName}</p>
                                }
                                { selectedCityName && 
                                    <p style={{fontSize:'11px'}}>{selectedCityName}, {selectedRegionName}</p>
                                }
                                { eventTicketPrice > 0 && 
                                    <p style={{fontSize:'11px'}}>{'ENTRADA: R$ '+eventTicketPrice.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</p>
                                }
                                { eventUrlMoreInfo && 
                                    <Header color={sampleColor} style={{fontSize:'10px'}} className='mt-1'>
                                        {eventUrlMoreInfo}
                                    </Header>
                                }
                            </Segment>
                            <p className='textCenter mb-5 mb-md-0'>
                                <Button size='tiny' onClick={() => takeScreenshot()}><Icon name='cloud download' /> Baixar</Button>
                            </p>
                            </>
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            { showMobileMenu && 
                <FooterMenuMobile />
            }
        </>
    )
}

export default CreateNewEventPage;