import React from 'react';
import { useHistory } from 'react-router-dom';
import {
    Container,
    Button,
    Header,
    Image,
    Menu,
    Icon,
    Divider
} from 'semantic-ui-react'

function AboutPage () {

    let history = useHistory();

    return (
    <div>
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item 
                    as='a' 
                    className='p-4' 
                    style={{fontFamily:'Baloo',fontSize:'26px'}} 
                    onClick={() => history.push("/")}
                >
                    mublin
                </Menu.Item>
                {/* <Menu.Item as='a' className='p-4' onClick={() => history.push("/home/")}>Voltar para a home</Menu.Item> */}
            </Container>
        </Menu>

        <Container text style={{ marginTop: '7em' }}>
            <Header as='h1'>Sobre o Mublin</Header>
            {/* <Image avatar src='https://ik.imagekit.io/mublin/users/avatars/1/avatar_G9yZJeskZZY.jpg' size='small' floated='left' /> */}
            <p className='mb-2'>
                Olá! Meu nome é Fabio Bueno.
            </p>
            <p className='mb-2'>
                Eu comecei a desenvolver o Mublin em 2019. Além de programador, participo de alguns projetos de música, e percebi uma dificuldade em organizar e centraliar as informações relacionadas às bandas. Então tive esta ideia e decidi criar o Mublin como uma ferramenta que facilitasse e tornasse mais dinâmica a rotina de artistas que trabalham com música. 
            </p>
            <p className='mb-2'>
                O Mublin está em versão Beta, onde feedbacks são fundamentais para melhorar e expandir. Esperamos no início de 2021 contar com mais de 10 mil usuários na plataforma, sendo eles músicos, produtores, artistas e ouvintes.
            </p>
            <Header>Missão</Header>
            <p>
                Nossa missão é facilitar a rotina e dar mais visibilidade às pessoas que trabalham com música e estão envolvidos nesta indústria de alguma forma.
            </p>
            <Header as='h3'>Mublin nas redes sociais</Header>
            <div>
                <a href='https://instagram.com/mublin' target='_blank'>
                    <Button color='instagram' size='small'>
                        <Icon name='instagram' /> Instagram
                    </Button>
                </a>
                <a href='https://linkedin.com/company/mublin/' target='_blank'>
                    <Button color='linkedin' size='small'>
                        <Icon name='linkedin' /> LinkedIn
                    </Button>
                </a>
            </div>
            <Divider className='mt-4' />
            <Header as='h4'>
                <Image circular src='https://ik.imagekit.io/mublin/users/avatars/1/avatar_G9yZJeskZZY.jpg' />
                <Header.Content>
                    Fabio Bueno
                    <Header.Subheader>Founder and Developer</Header.Subheader>
                    <Header.Subheader>
                        <a href='https://instagram.com/buenofabio' target='_blank'>Instagram</a> | <a href='https://twitter.com/fabiobueno' target='_blank'>Twitter</a> | <a href='https://github.com/fabio-bueno-oliveira' target='_blank'>Github</a> | <a href='mailto:fabiobueno@outlook.com' target='_blank'>Email</a>
                    </Header.Subheader>
                </Header.Content>
            </Header>
        </Container>
    </div>
    );
};

export default AboutPage