import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { projectInfos } from '../../store/actions/project';
import { miscInfos } from '../../store/actions/misc';
import { Grid, Header, Form, Divider, Checkbox, Icon, Label, Button, Image } from 'semantic-ui-react';
import HeaderDesktop from '../../components/layout/headerDesktop';
import HeaderMobile from '../../components/layout/headerMobile';
import Spacer from '../../components/layout/Spacer'
import FooterMenuMobile from '../../components/layout/footerMenuMobile';

function BackstageProjectPreferencesPage (props) {

    document.title = 'Gerenciar participação | '+props.match.params.projectUsername+' | Mublin'
    
    const userToken = JSON.parse(localStorage.getItem('user'));

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(projectInfos.getProjectInfo(props.match.params.projectUsername));
        dispatch(projectInfos.getProjectMembers(props.match.params.projectUsername));
        dispatch(miscInfos.getRoles());
    }, []);

    const project = useSelector(state => state.project);
    const members = project.members;
    const membersAdmin = members.filter((member) => { return member.admin === 1 })
    const roles = useSelector(state => state.roles);

    let history = useHistory();

    const currentYear = new Date().getFullYear()

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [info, setInfo] = useState(
        {
            name: '',
            username: '',
            foundation_year: '',
            end_year: '',
            admin: '',
            status: '',
            statusName: '',
            featured: '',
            portfolio: '',
            joined_in: '',
            left_in: '',
            touring: '',
            show_on_profile: '',
            main_role_fk: '',
            role1: '',
            second_role_fk: '',
            role2: '',
            third_role_fk: '',
            role3: ''
        }
    );

    // const [active, setActive] = useState(null)
    const [activeCheckbox, setActiveCheckbox] = useState(null)

    const [formInfo, setFormInfo] = useState(
        {
            status: '',
            featured: '',
            portfolio: '',
            joined_in: '',
            left_in: '',
            touring: '',
            show_on_profile: '',
            main_role_fk: '',
            second_role_fk: '',
            third_role_fk: ''
        }
    )

    useEffect(() => {
      fetch("https://mublin.herokuapp.com/user/"+props.match.params.projectUsername+"/preferences", {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken.token
        }
      })
        .then(res => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setInfo(result);
            console.log(result);
            setFormInfo(
                {
                    status: result.status,
                    featured: result.featured,
                    portfolio: result.portfolio,
                    joined_in: result.joined_in,
                    left_in: result.left_in,
                    touring: result.touring,
                    show_on_profile: result.show_on_profile,
                    main_role_fk: result.main_role_fk,
                    second_role_fk: result.second_role_fk,
                    third_role_fk: result.third_role_fk
                }
            )
            if (!result.left_in || (!result.left_in & result.end_year)) {
                setActiveCheckbox(true)
            } else {
                setActiveCheckbox(false)
            }
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }, [])

    const handleCheckbox = (x) => {
        setActiveCheckbox(value => !value)
        if (x) {
            setFormInfo({...formInfo,left_in: info.left_in})
        } else {
            setFormInfo({...formInfo,left_in: null})
        }
    }

    return (
        <>
            <HeaderDesktop />
            <HeaderMobile />
            <Spacer />
            <Grid as='main' centered columns={1} className="container mb-5 pb-4 px-1 px-md-3">
                <Grid.Row>
                    <Grid.Column computer={10} mobile={16}>
                        { isLoaded &&
                        <> 
                        <Header as='h2' className='mb-0'>
                            <Header.Content>
                                {info.name}
                                <p><Label tag size='mini' color='violet'>{info.typeName}</Label> <Label tag size='mini' color='green'>Fundado em {info.foundation_year}</Label> {info.end_year && <Label tag size='mini' color='red'>Encerrado em {info.end_year}</Label>}</p>
                                <Image.Group size='mini' className='mt-2'>
                                    { members.filter((member) => { return member.id !== userToken.id }).map((member,key) =>
                                        <Image src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-200,w-200,c-maintain_ratio/'+member.id+'/'+member.picture} avatar title={member.name+' '+member.lastname+' ('+member.role1+')'} />
                                    )}
                                </Image.Group>
                            </Header.Content>
                        </Header>
                        <Divider />
                        <div className='mb-4'>
                            { members.filter((member) => { return member.id === userToken.id }).map((member,key) =>
                                <Image src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-200,w-200,c-maintain_ratio/'+member.id+'/'+member.picture} avatar title={member.name+' '+member.lastname} />
                            )}
                            <span>Gerenciar minha participação neste projeto</span>
                        </div>
                        </>
                        }
                        { !isLoaded ? (
                            <p>Carregando...</p>
                        ) : (
                            <>
                            <Form>
                                <Form.Field className='mb-4'>
                                    <Checkbox  
                                        label={{ children: <><Icon name='key' />Administrador</> }}
                                        disabled 
                                        checked={info.admin}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Checkbox 
                                        label={{ children: <><Icon name='star' />Favorito</> }}
                                        checked={formInfo.featured ? true : false}
                                        onChange={formInfo.featured ? () => setFormInfo({...formInfo,featured:0}) : () => setFormInfo({...formInfo,featured:1})}
                                    />
                                    <p style={{fontSize:'11px'}}>Projetos favoritos são exibidos em destaque em seu perfil</p>
                                </Form.Field>
                                <Form.Group widths='equal'>
                                    <Form.Input name="joined_in" type="number" fluid label='Entrei em' defaultValue={info.joined_in} onChange={e => setFormInfo({...formInfo,joined_in: e.target.value})} error={(formInfo.joined_in > 0 && formInfo.joined_in < info.foundation_year) && { content: 'Ano inferior ao início do projeto' }} min={info.foundation_year} max={info.end_year} />
                                    { info.left_in ? (
                                        <Form.Input name="left_in" type="number" fluid label={'Deixei o projeto em'} defaultValue={info.left_in} onChange={e => setFormInfo({...formInfo,left_in: e.target.value})} error={(formInfo.left_in > 0 && formInfo.left_in > info.end_year) && {content: 'Ano superior ao encerramento do projeto'}} min={info.foundation_year} max={info.end_year} disabled={activeCheckbox ? true : false} />
                                    ) : (
                                        <Form.Input name="left_in" type="number" fluid label='Deixei o projeto em' onChange={e => setFormInfo({...formInfo,left_in: e.target.value})} error={(formInfo.left_in > currentYear) && {content: 'Ano superior ao ano atual'}} min={info.foundation_year} max={currentYear} disabled={activeCheckbox ? true : false} />
                                    )}
                                </Form.Group>
                                <Form.Checkbox name="active" checked={activeCheckbox} label={info.end_year ? 'Estive ativo até o final do projeto' : 'Estou ativo atualmente neste projeto'} onChange={() => handleCheckbox(activeCheckbox)} />
                                <Divider />
                                <Form.Group grouped>
                                    <label><Icon name='id badge' />Meu status no projeto</label>
                                    { info.type !== 7 && 
                                    <>
                                    <Form.Field
                                        disabled={(info.admin && info.confirmed !== 2) ? false : true }
                                        label='Membro'
                                        control='input'
                                        type='radio'
                                        name='status'
                                        checked={formInfo.status === 1 ? true : false}
                                        onClick={() => setFormInfo({...formInfo,status:1})}
                                    />
                                    <Form.Field
                                        disabled={(info.admin && info.confirmed !== 2) ? false : true }
                                        label='Convidado'
                                        control='input'
                                        type='radio'
                                        name='status'
                                        checked={formInfo.status === 2 ? true : false}
                                        onClick={() => setFormInfo({...formInfo,status:2})}
                                    />
                                    </>
                                    }
                                    { info.type === 7 && 
                                    <>
                                    <Form.Field
                                        disabled={(info.status && 3) ? false : true }
                                        label='Idealizador'
                                        control='input'
                                        type='radio'
                                        name='status'
                                        checked={formInfo.status === 3 ? true : false}
                                    />
                                    <Form.Field
                                        disabled={(info.status && 4) ? false : true }
                                        label='Candidato'
                                        control='input'
                                        type='radio'
                                        name='status'
                                        checked={formInfo.status === 4 ? true : false}
                                    />
                                    </>
                                    }
                                    { info.confirmed === 2 && 
                                        <Form.Field
                                            label='Aguardando aprovação'
                                            control='input'
                                            type='radio'
                                            name='status'
                                            checked
                                        />
                                    }
                                    { info.confirmed === 0 && 
                                        <Form.Field
                                            label='Participação recusada pelo administrador'
                                            control='input'
                                            type='radio'
                                            name='status'
                                            checked
                                        />
                                    }
                                </Form.Group>



                                <Form.Field>
                                    <label><Icon name='id badge' />Meu status no projeto</label>
                                </Form.Field>
                                <Form.Field>
                                    <Checkbox
                                        radio
                                        label='Membro'
                                        name='statusRadioGroup'
                                        value={1}
                                        checked={formInfo.status === 1 ? true : false}
                                        onClick={() => setFormInfo({...formInfo,status:1})}
                                        disabled={(info.admin && info.confirmed !== 2) ? false : true }
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Checkbox
                                        radio
                                        label='Convidado'
                                        name='statusRadioGroup'
                                        value={2}
                                        checked={formInfo.status === 2 ? true : false}
                                        onClick={() => setFormInfo({...formInfo,status:2})}
                                        disabled={(info.admin && info.confirmed !== 2) ? false : true }
                                    />
                                </Form.Field>



                                <Divider />
                                <Form.Field>
                                    <label><Icon name='folder open outline' />Categorizar este projeto em</label>
                                </Form.Field>
                                <Form.Field>
                                    <Checkbox
                                        radio
                                        label='Meus projetos principais'
                                        name='portfolioRadioGroup'
                                        value={0}
                                        checked={formInfo.portfolio === 0}
                                        onClick={() => setFormInfo({...formInfo,portfolio:0})}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Checkbox
                                        radio
                                        label='Meu portfolio'
                                        name='portfolioRadioGroup'
                                        value={1}
                                        checked={formInfo.portfolio === 1}
                                        onClick={() => setFormInfo({...formInfo,portfolio:1})}
                                    />
                                </Form.Field>
                                <Divider />
                                <Form.Field>
                                    <Checkbox 
                                        label={{ children: <><Icon name='road' />Estou turnê com este projeto atualmente</> }}
                                        checked={formInfo.touring ? true : false}
                                        onChange={formInfo.touring ? () => setFormInfo({...formInfo,touring:0}) : () => setFormInfo({...formInfo,touring:1})}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Checkbox 
                                        label={{ children: <><Icon name='eye' />Exibir este projeto no meu perfil</> }}
                                        checked={formInfo.show_on_profile ? true : false}
                                        onChange={formInfo.show_on_profile ? () => setFormInfo({...formInfo,show_on_profile:0}) : () => setFormInfo({...formInfo,show_on_profile:1})}
                                    />
                                </Form.Field>
                                <Button primary>Salvar alterações</Button>
                            </Form>
                            <Button className='mt-3' basic negative size='tiny'>Sair deste projeto (me desassociar)</Button>
                            </>
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <FooterMenuMobile />
        </>
    )
}

export default BackstageProjectPreferencesPage;