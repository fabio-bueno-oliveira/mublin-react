import React, { useState, useEffect } from 'react';
import { Search } from 'semantic-ui-react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/users';
import { searchInfos } from '../../../store/actions/search';
import { userActions } from '../../../store/actions/authentication';
import {IKImage
} from "imagekitio-react";
import MublinLogo from '../../../assets/img/logos/mublin-logo-text-white.png';
import HeaderWrapper from './styles';

const HeaderDesktop = () => {

    let history = useHistory();

    const dispatch = useDispatch();

    // reset login status
    useEffect(() => { 
        dispatch(userInfos.getInfo());
    }, []);

    const userInfo = useSelector(state => state.user);

    const search = useSelector(state => state.search);

    const [query, setQuery] = useState('')
    const [lastQuery, setLastQuery] = useState('')

    const handleSearchChange = (e) => {
        setQuery(e)
        if (e.length > 2 && query !== lastQuery) {
            setTimeout(() => {
                dispatch(searchInfos.getSearchResults(e))
            }, 700)
            setLastQuery(e)
        }
    }

    const handleResultSelect = () => {
        history.push("/profile")
    }

    const logout = () => {
        dispatch(userActions.logout());
    }

    return (
        <>
        <HeaderWrapper>
            <div id="menu-desktop" className="ui fixed inverted menu">
                <div className="ui container">
                    <Link className="header item pl-0" to={{ pathname: "/home" }}>
                        <img className="logo" src={MublinLogo} alt="Mublin Logo" />
                    </Link>
                    <Link className={window.location.pathname === "/home" ? "active item" : 'item'} to={{ pathname: "/home" }}>
                        <i className="fas fa-home mr-2"></i> Início
                    </Link>
                    <Link className="item" to={{ pathname: "/feed" }}>
                        <i className="fas fa-globe-americas mr-2"></i> Feed
                    </Link>
                    <div className="ui simple dropdown item">
                        <i className="fas fa-plus mr-2"></i> Novo <i className="dropdown icon"></i>
                        <div className="menu">
                            <Link className="item" to={{ pathname: "/feed" }}>
                                <i className="fas fa-pencil-alt mr-1"></i> Composição
                            </Link>
                            <Link className="item" to={{ pathname: "/feed" }}>
                                <i className="fas fa-drum mr-1"></i> Ensaio
                            </Link>
                            <Link className="item" to={{ pathname: "/feed" }}>
                                <i className="fas fa-ticket-alt mr-1"></i> Show
                            </Link>
                            <Link className="item" to={{ pathname: "/feed" }}>
                                <i className="fas fa-road mr-1"></i> Turnê
                            </Link>
                            <div className="item">
                                <i className="dropdown icon"></i>
                                <i className="fas fa-music mr-1"></i> Projeto
                                <div className="menu">
                                    <Link className="item" to={{ pathname: "/project/new/" }}>
                                        <i className="fas fa-plus fa-fw"></i> Criar do zero
                                    </Link>
                                    <div className="divider"></div>
                                        <Link className="item" to={{ pathname: "/project/new/?type=idea" }}>
                                            <i className="far fa-lightbulb fa-fw"></i> Nova ideia de projeto
                                        </Link>
                                        <Link className="item" to={{ pathname: "/project/new/?type=join" }}>
                                            <i className="fas fa-user-plus fa-fw"></i> Ingressar em um projeto
                                        </Link>
                                        <Link className="item" to={{ pathname: "/invite" }}>
                                            <i className="fas fa-envelope-open-text fa-fw"></i> Convidar alguém para um projeto
                                        </Link>
                                        <Link className="item" to={{ pathname: "/search?type=projects&status=hiring" }}>
                                            <i className="fas fa-crosshairs fa-fw"></i> Buscar projetos que estão contratando
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="notifications" className="ui simple dropdown item">
                            <div className="alert">
                                <i className="far fa-bell"></i> <span className="ui red circular mini label d-none" id="feedlabel"></span>
                            </div>
                            <div className="menu">
                                <a className="item none">Nenhuma nova notificação</a>
                            </div>
                        </div>
                        <div className="item">
                            <Search
                                size='small'
                                // category
                                // fluid
                                // inverted
                                icon="search"
                                placeholder="Pesquisar..."
                                noResultsMessage="Nenhum resultado"
                                loading={search.requesting}
                                results={search.results}
                                value={query}
                                onSearchChange={e => handleSearchChange(e.target.value)}
                                onResultSelect={handleResultSelect}
                            />
                        </div>
                        <div className="right menu">
                            <Link className="item" to={{ pathname: "/messages" }}>
                                <i className="far fa-envelope"></i> <span className="ui red circular mini label">2</span>
                            </Link>
                            <div className="ui simple dropdown item">
                                {/* <img className="ui avatar image mr-2" src={'/img/'+userInfo.id+'/'+userInfo.picture} /> {userInfo.name} */}
                                <IKImage 
                                    path={'/users/avatars/'+userInfo.id+'/'+userInfo.picture}
                                    transformation={[{ "height": "200", "width": "200"}]} 
                                />
                                {userInfo.payment_plan === 2 && <div className="ui mini blue label">PRO</div> } <i className="dropdown icon"></i>
                                <div className="menu">
                                    <a className="item" href="/<?=$row_user_info['username']?>">Meu perfil</a>
                                    <a className="item settings" href="/settings">Configurações</a>
                                    {/* <!-- Projects Menu goes here (header-global-scripts.php) --> */}
                                    <div className="divider"></div>
                                    <Link className="item" onClick={logout}>
                                        Sair
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </HeaderWrapper>
        </>
    );
};

export default HeaderDesktop