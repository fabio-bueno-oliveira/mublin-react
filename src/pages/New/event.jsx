import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { userInfos } from '../../store/actions/user';
import { projectInfos } from '../../store/actions/project';
import { Grid, Header, Form, Button, Image, Segment, Label, Tab, Icon, Dropdown, Popup } from 'semantic-ui-react';
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

    let defaultEventType
    if (newEventType === 'public') {
        defaultEventType = 1
    } else {
        defaultEventType = 0
    }
 
    document.title = newEventType === 'public' ? 'Criar novo evento público | Mublin' : 'Criar novo evento privado | Mublin'

    const userSession = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        dispatch(userInfos.getUserProjects(userSession.id));
    }, [userSession.id, dispatch]);

    const userInfo = useSelector(state => state.user)
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
    const [eventProjectId, setEventProjectId] = useState('')
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
    } 
    const [eventCityId, setEventCityId] = useState('')
    const [selectedCityName, setSelectedCityName] = useState('')
    const selectCity = (cityId, cityName) => {
        setEventCityId(cityId)
        setSelectedCityName(cityName)
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

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid as='main' centered columns={2} className="container">
                <Grid.Row>
                    <Grid.Column computer={8} mobile={16}>
                        <Header as='h2' className='mb-4'>
                            Criar novo evento
                        </Header>
                        <Tab menu={{ secondary: true, pointing: true }} panes={
                            [
                                {
                                menuItem: 'Informações gerais',
                                render: () => 
                                    <Tab.Pane attached={false} as="div">
                                        <Form className='pt-2'>
                                            <Form.Group inline>
                                                <label>Privacidade</label>
                                                <Form.Radio
                                                    id='label_privacity_1'
                                                    name='label_privacity'
                                                    label='Público'
                                                    value={1}
                                                    checked={eventPrivacity === 1 ? true : false}
                                                    onChange={() => changePrivacity(1)}
                                                />
                                                <Form.Radio
                                                    id='label_privacity_2'
                                                    name='label_privacity'
                                                    label='Privado'
                                                    value={0}
                                                    checked={eventPrivacity === 0 ? true : false}
                                                    onChange={() => changePrivacity(0)}
                                                />
                                            </Form.Group>
                                            <Form.Group widths='equal' className='pt-2'>
                                                <Form.Field 
                                                    required
                                                    label='Projeto relacionado' 
                                                    control='select'
                                                    name='eventProjectId'
                                                    value={eventProjectId}
                                                    onChange={(e) => selectProject(e.target.options[e.target.selectedIndex].value,e.target.options[e.target.selectedIndex].dataset.username)}
                                                >
                                                    { userInfo.requesting ? (
                                                        <option>Carregando...</option>
                                                    ) : (
                                                        <>
                                                            <option value=''>Selecione...</option>
                                                            {userInfo.projects.filter((project) => { return project.confirmed === 1 && project.admin === 1 }).map((project, key) =>
                                                                <option key={key} value={project.id} data-username={project.username}>{project.name}</option>
                                                            )}
                                                        </>
                                                    )}
                                                </Form.Field>
                                                <Form.Field 
                                                    required
                                                    label='Tipo de evento' 
                                                    control='select'
                                                    name='eventType'
                                                    value={eventType}
                                                    onChange={(e) => setEventType(e.target.options[e.target.selectedIndex].value)}
                                                >
                                                    <option value=''>Selecione...</option>
                                                    { eventPrivacity === 0 ? (
                                                        <>
                                                            <option value='1'>Ensaio</option>
                                                            <option value='3'>Reunião</option>
                                                            <option value='4'>Gravação</option>
                                                        </>
                                                    ) : ( 
                                                        <>
                                                            <option value='2'>Show</option>
                                                            <option value='5'>Entrevista</option>
                                                            <option value='6'>Workshop</option>
                                                        </>
                                                    )}
                                                </Form.Field>
                                            </Form.Group>
                                            <Form.Field>
                                                <Form.Input 
                                                    required
                                                    label='Nome do evento'
                                                    placeholder='Nome do evento'
                                                    name='eventName' 
                                                    id='eventName' 
                                                    fluid 
                                                    value={eventName}
                                                    onChange={e => setEventName(e.target.value)}
                                                />
                                            </Form.Field>
                                            <Form.Group inline>
                                                {/* <label>Formato</label> */}
                                                <Form.Radio 
                                                    id='label_method_1'
                                                    name='label_method'
                                                    label='Presencial'
                                                    value={1}
                                                    checked={eventMethod === 1 ? true : false}
                                                    onChange={() => setEventMethod(1)}
                                                />
                                                <Form.Radio 
                                                    id='label_method_2'
                                                    name='label_method'
                                                    label='Online'
                                                    value={2}
                                                    checked={eventMethod === 2 ? true : false}
                                                    onChange={() => setEventMethod(2)}
                                                />
                                            </Form.Group>
                                            <Form.Field 
                                                placeholder='Descrição' 
                                                name='eventDescription'
                                                id='eventDescription'
                                                control='textarea' 
                                                rows='3' 
                                                value={eventDescription}
                                                onChange={e => setEventDescription(e.target.value)}
                                                maxLength='320'
                                            />
                                            <Form.Group widths='equal'>
                                                <Form.Field 
                                                    type='date'
                                                    id='eventOpeningDate'
                                                    label='Data de início do evento' 
                                                    control='input' 
                                                    value={eventOpeningDate}
                                                    onChange={e => setEventOpeningDate(e.target.value)} 
                                                    style={{textAlign:'center'}}
                                                />
                                                <Form.Field 
                                                    type='date'
                                                    id='eventEndingDate'
                                                    label='Data de encerramento do evento' 
                                                    control='input' 
                                                    value={eventEndingDate}
                                                    onChange={e => setEventEndingDate(e.target.value)} 
                                                    style={{textAlign:'center'}}
                                                />
                                            </Form.Group>
                                            <Form.Group widths='equal'>
                                                <Form.Field 
                                                    id='eventOpeningHour'
                                                    label='Hora de abertura do evento' 
                                                    control='input' 
                                                    value={eventOpeningHour}
                                                    onChange={e => setEventOpeningHour(e.target.value)} 
                                                    maxLength='5'
                                                    style={{textAlign:'center'}}
                                                />
                                                <Form.Field 
                                                    id='eventEndingHour'
                                                    label='Hora de encerramento do evento' 
                                                    control='input' 
                                                    value={eventEndingHour}
                                                    onChange={e => setEventEndingHour(e.target.value)} 
                                                    maxLength='5'
                                                    style={{textAlign:'center'}}
                                                />
                                            </Form.Group>
                                            <Form.Group widths='equal'>
                                                <Form.Field
                                                    control='select'
                                                    id='eventRegionId'
                                                    name='eventRegionId'
                                                    label={'Localidade'}
                                                    value={eventRegionId}
                                                    // onChange={e => {
                                                    //     handleChange(e);
                                                    //     setRegionSelected(e.target.value)
                                                    // }}
                                                    // onChange={(e) => setEventRegionId(e.target.options[e.target.selectedIndex].value)}
                                                    onChange={(e) => selectRegion(e.target.options[e.target.selectedIndex].value,e.target.options[e.target.selectedIndex].dataset.name)}
                                                >
                                                    {regionOptions.map((region, key) =>
                                                        <option key={key} value={region.value} data-name={region.text}>{region.text}</option>
                                                    )}
                                                </Form.Field>
                                                <Form.Field>
                                                    <label>Cidade</label>
                                                    <Dropdown 
                                                        id='eventCityId'
                                                        name='eventCityId'
                                                        placeholder='Digite e escolha a cidade'
                                                        fluid
                                                        search
                                                        selection
                                                        options={queryCities}
                                                        onChange={(e, { value }) => selectCity(value, e.target.textContent)}
                                                        onSearchChange={e => {
                                                            searchCity(e.target.value);
                                                        }}
                                                        noResultsMessage="Nenhum resultado"
                                                        loading={citySearchIsLoading}
                                                        disabled={!eventRegionId ? true : false}
                                                    />
                                                </Form.Field>
                                            </Form.Group>
                                            <Form.Field className='mb-0'>
                                                <label for='eventPicture'>Arte do evento</label>
                                            </Form.Field>
                                            <div className={eventImage ? 'd-none' : ''}>
                                                <IKUpload 
                                                    id='eventPicture'
                                                    fileName="avatar.jpg"
                                                    folder={userAvatarPath}
                                                    tags={["tag1"]}
                                                    useUniqueFileName={true}
                                                    isPrivateFile= {false}
                                                    onError={onUploadError}
                                                    onSuccess={onUploadSuccess}
                                                />
                                            </div>
                                            { eventImage && 
                                                <Image centered src={'https://ik.imagekit.io/mublin/tr:h-200,w-200/events/'+eventImage} size='small' className="mt-4 mb-1" />
                                            }
                                            <Form.Group widths='equal'>
                                                <Form.Field className='mb-0 mt-3'>
                                                    <label for='eventTicketPrice'>Preço do ingresso/entrada</label>
                                                    <IntlCurrencyInput 
                                                    currency='BRL' 
                                                    config={currencyConfig}
                                                    id='eventTicketPrice'
                                                    name='eventTicketPrice'
                                                    value={eventTicketPrice}
                                                    onChange={handleChangeEventTicketPrice} 
                                                    className='mb-3'
                                                />
                                                </Form.Field>
                                                <Form.Field className='mb-0 mt-3'>
                                                    <Form.Input 
                                                        label='URL para mais informações'
                                                        id='urlMoreInfo' 
                                                        name='urlMoreInfo' 
                                                        fluid 
                                                        value={eventUrlMoreInfo}
                                                        onChange={(e, { value }) => setEventUrlMoreInfo(value)} 
                                                    />
                                                </Form.Field>
                                                </Form.Group>
                                        </Form>
                                    </Tab.Pane>
                                }, 
                                {
                                menuItem: 'Informações internas',
                                render: () => 
                                        <Tab.Pane attached={false} as="div">
                                            <Form>
                                                <Form.Field 
                                                    className='mt-3'
                                                    label='Propósito do evento' 
                                                    control='select'
                                                    name='eventPurpose'
                                                    defaultValue={newEventType === 'private' ? '2' : '1'}
                                                    onChange={(e) => setEventPurpose(e.target.options[e.target.selectedIndex].value)}
                                                >
                                                    <option value='1'>Divulgar e promover</option>
                                                    <option value='2'>Planejar</option>
                                                    <option value='3'>Registro/Gravação</option>
                                                    <option value='4'>Evoluir/Aperfeiçoar</option>
                                                </Form.Field>
                                                <Form.Field className='mb-0'>
                                                    <label for='eventFeeTotal'>Cachê da apresentação</label>
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
                                                    <label for='eventFeePerMember'>Cachê por membro</label>
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
                                                    <label for='eventCostPerMember'>Custo do evento por integrante</label>
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
                                            </Form>
                                        </Tab.Pane>
                                }
                            ]
                        }
                        />
                        <Button primary floated='right' className='mt-3' loading={isLoading}>
                            Enviar
                        </Button>
                    </Grid.Column>
                    <Grid.Column computer={6} mobile={16}>
                        <p className='textCenter'>Amostra da comunicação do evento</p>
                        { !eventProjectId ? (
                            <Segment secondary textAlign='center' style={{height:'300px',alignItems:'center',display:'flex',justifyContent:'center',color:'#CECECE'}}>
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
                                    <Image centered rounded src={'https://ik.imagekit.io/mublin/projects/tr:h-200,w-200,c-maintain_ratio/'+project.id+'/'+project.picture} size='small' />
                                }
                                <Header as='h1' className='mt-3 mb-0' inverted color={sampleColor}>{project.name}</Header>
                                {
                                    {
                                        1: <p>Ensaio</p>,
                                        3: <p>Reunião</p>,
                                        4: <p>Gravação</p>,
                                        2: <p>Show</p>,
                                        5: <p>Entrevista</p>,
                                        6: <p>Workshop</p>
                                    }[eventType]
                                }
                                { eventName && 
                                    <Header as='h3' className='mt-3 mb-1' inverted color={sampleColor}>{eventName}</Header>
                                }
                                { eventDescription && 
                                    <p className='mb-3'>{eventDescription}</p>
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
                            <p className='textCenter'>
                                <Button size='tiny' onClick={() => takeScreenshot()}><Icon name='cloud download' /> Baixar</Button>
                            </p>
                            </>
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default CreateNewEventPage;