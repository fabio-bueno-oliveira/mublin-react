import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userInfos } from '../../../store/actions/users';
import { userActions } from '../../../store/actions/authentication';
import MublinLogo from '../../../assets/img/logos/mublin-logo-text-white.png';
import HeaderWrapper from './styles';

const HeaderMobile = () => {

    const user = useSelector(state => state.authentication.user);

    const dispatch = useDispatch();

    let history = useHistory();

    // reset login status
    useEffect(() => { 
        dispatch(userInfos.getInfo());
    }, []);

    const userInfo = useSelector(state => state.user);

    const logout = () => {
        dispatch(userActions.logout());
    }

    return (
        <>
        <HeaderWrapper>
          <div id="menu-mobile" class="ui fixed menu py-2">

            <div class="ui container">
                <a href="/<?php echo mb_strimwidth($usernameURL, 0, 11, "…"); ?>" class="logo mt-2 pt-1 ml-3" style="font-family:'Baloo'; font-size:19px;color:black;">
                    <?php echo mb_strimwidth($usernameURL, 0, 11, "…"); ?>
                </a>

      <a href="/home/">
        <img class="logo mt-2 ml-2" height="30" src="/img/logos/mublin-logo-text-black.png">
      </a>

      <div class="right menu pt-1 pr-3">
        <a href="/<?=$_SESSION["kt_login_user"]?>">
          <img class="ui avatar image" style="width: 2.5em; height: 2.5em;" src="/thumb.php?src=img/users/avatars/<?=$_SESSION['kt_login_id']?>/<?=$row_user_info['picture']?>&size=250x250&crop=1&align=t" alt="<?=$_SESSION['kt_login_user']?>">
        </a>
        <a href="#" class="menu-btn">
          <i class="fas fa-bars grey"></i>
        </a>
      </div>
    </div>










            <div class="ui container">
              <a href="/home" class="header item pl-0">
                <img class="logo" src={MublinLogo} />
              </a>
              <a class="active item" href="/home"><i class="fas fa-home mr-2"></i> Início</a>
              <a class="item" href="/feed"><i class="fas fa-globe-americas mr-2"></i> Feed</a>
              <div class="ui simple dropdown item">
              <i class="fas fa-plus mr-2"></i> Novo <i class="dropdown icon"></i>
                <div class="menu">
                <a class="item" href="#"><i class="fas fa-pencil-alt mr-1"></i> Composição</a>
                  <a class="item" href="#"><i class="fas fa-drum mr-1"></i> Ensaio</a>
                  <a class="item" href="#"><i class="fas fa-ticket-alt mr-1"></i> Show</a>
                  <a class="item" href="#"><i class="fas fa-road mr-1"></i> Turnê</a>
                  <div class="item">
                    <i class="dropdown icon"></i>
                    <i class="fas fa-music mr-1"></i> Projeto
                    <div class="menu">
                      <a class="item" href="/project/new/"><i class="fas fa-plus fa-fw"></i> Criar do zero</a>
                      <div class="divider"></div>
                      <a class="item" href="/project/new/?type=idea"><i class="far fa-lightbulb fa-fw"></i> Nova ideia de projeto</a>
                      <a class="item" href="/project/new/?type=join"><i class="fas fa-user-plus fa-fw"></i> Ingressar em um projeto</a>
                      <a class="item" href="/invite"><i class="fas fa-envelope-open-text fa-fw"></i> Convidar alguém para um projeto</a>
                      <a class="item" href="/search?type=projects&status=hiring"><i class="fas fa-crosshairs fa-fw"></i> Buscar projetos à procura de músicos</a>
                    </div>
                  </div>
                </div>
              </div>
              <div id="notifications" class="ui simple dropdown item">
                <div class="alert">
                  <i class="far fa-bell"></i> <span class="ui red circular mini label d-none" id="feedlabel"></span>
                </div>
                <div class="menu">
                  <a class="item none">Nenhuma nova notificação</a>
                </div>
              </div>
              <div class="item">
                <form action="/search/" method="get">
                  <div class="ui search">
                    <div class="ui icon input transparent inverted visible">
                      <input class="prompt" type="text" value="" placeholder="Pesquisar" name="q" minlength="2" />
                      <i class="search icon"></i>
                    </div>
                    <div class="results"></div>
                  </div>
                </form>
              </div>
              <div class="right menu">
                <a class="item"><i class="far fa-envelope"></i> <span class="ui red circular mini label">2</span></a>
                <div class="ui simple dropdown item">
                  <img class="ui avatar image mr-2" src={'img/'+userInfo.id+'/'+userInfo.picture} /> {userInfo.name}
                  {userInfo.payment_plan == 2 && <div class="ui mini blue label">PRO</div> } <i class="dropdown icon"></i>
                  <div class="menu">
                    <a class="item" href="/<?=$row_user_info['username']?>">Meu perfil</a>
                    <a class="item settings" href="/settings">Configurações</a>
                    {/* <!-- Projects Menu goes here (header-global-scripts.php) --> */}
                    <div class="divider"></div>
                    <a class="item" onClick={logout}>Sair</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </HeaderWrapper>
        </>
    );
};

export default HeaderMobile