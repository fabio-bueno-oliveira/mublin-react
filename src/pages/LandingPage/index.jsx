import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from 'semantic-ui-react';
import './styles.scss'

function LandingPage () {
    return (
        <>
        <main className="landingPage">
            <div className="ui container">
                <header>
                    <h1>mublin</h1>
                    <div className="action">
                        <Link to={{ pathname: "/login", state: { fromLandingPage: true } }}>
                            <Button inverted color='white' size='medium' className="mr-2">Entrar</Button>
                        </Link>
                        <Link to={{ pathname: "/signup", state: { fromLandingPage: true } }}>
                            <Button inverted color='blue' size='medium'>Cadastre-se grátis</Button>
                        </Link>
                    </div>
                </header>
                <section id="cta">
                    <h2>Informações das suas bandas,<br/> <nobr>centralizadas em um só lugar.</nobr></h2>
                    <Input 
                        action={{
                            color: 'teal',
                            icon: 'right arrow',
                        }}
                        placeholder='digite seu email'
                    />
                </section>
            </div>
        </main>
        </>
    );
};

export default LandingPage;