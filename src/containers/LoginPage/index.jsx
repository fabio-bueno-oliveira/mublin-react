import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/actions/user';
import ValidateUtils from '../../utils/ValidateUtils'
import { Button, Input, Header, Form, Checkbox } from 'semantic-ui-react';
import logo from '../../assets/img/logos/logo-mublin-circle-black.png';
import Alert from '../../components/alert'
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

import './styles.scss';

function LoginPage (props) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [submitted, setSubmitted] = useState(false);
    const loggingIn = useSelector(state => state.authentication.loggingIn);
    const error = useSelector(state => state.authentication.error);
    const dispatch = useDispatch();

    // // reset login status
    // useEffect(() => { 
    //     dispatch(userActions.logout()); 
    // }, []);

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
        if (email && password) {
            dispatch(userActions.login(email, password));
        }
    }

    return (
        <>
        { loggingIn && 
            <Loader
                className="appLoadingIcon"
                type="Audio"
                color="#ff0032"
                height={100}
                width={100}
                // timeout={999999} //3 secs
            />
        }
        <main className="loginPage ui middle aligned center aligned grid m-0">
            <div className="column">
                {props.cantLogin && 
                    <Alert 
                        className="alertWrapper"
                        type="error"
                        title="Ops, email ou senha incorretos"
                        text="Verifique os dados e tente novamente."
                    />
                }
                <p>{error}</p>
                <Header as='h2'>
                    <div class="content">
                        <Link to={{ pathname: "/", state: { fromLogin: true } }}>
                            <img src={logo} alt="Mublin" className="ui mini image mt-0" />    
                        </Link>
                    </div>
                </Header>
                <Header as='h2' className='mt-0'>Iniciar Sessão</Header>
                <div class="ui segment">

                    <Form onSubmit={handleSubmit}>
                        <div class="ui two column very relaxed stackable grid">
                            <div class="column">
                                <div class="ui form">
                                    <Form.Field>
                                        <label for="email">Email</label>
                                        <Input type="email" size='small' icon='user' iconPosition='left' id="email" onChange={e => setEmail(e.target.value)} value={email} required pattern="[^ @]*@[^ @]*" />
                                        {submitted && !email &&
                                            <div>Email is required</div>
                                        }
                                    </Form.Field>
                                    <Form.Field>
                                        <label for="password">Senha</label>
                                        <Input type="password" size='small' icon='lock' iconPosition='left' id="password" onChange={e => setPassword(e.target.value)} value={password} />
                                        {submitted && !password &&
                                            <div>Password is required</div>
                                        }
                                    </Form.Field>
                                    <Form.Field>
                                        <Checkbox label='Lembrar meus dados' />
                                    </Form.Field>
                                    <Button type="submit" secondary fluid className="mb-3" onClick={handleSubmit}>Entrar</Button>
                                    <Link to={{ pathname: "/soon", state: { fromLogin: true } }}>
                                        Esqueci minha senha
                                    </Link>
                                </div>
                            </div>
                            <div class="middle aligned column">
                                <Link to={{ pathname: "/soon", state: { fromLogin: true } }}>
                                    <Button size="big">Inscrever-se grátis</Button>
                                </Link>
                            </div>
                        </div>
                    </Form>



                    {/* <form name="form" onSubmit={handleSubmit}>
                        <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" name="email" value={email} onChange={e => setEmail(e.target.value)} />
                            {submitted && !email &&
                                <div className="help-block">Email is required</div>
                            }
                        </div>
                        <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                            {submitted && !password &&
                                <div className="help-block">Password is required</div>
                            }
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary">Login</button>
                            {props.loggingIn &&
                                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                            }
                            <Link to="/register" className="btn btn-link">Register</Link>
                        </div>
                    </form> */}

                    <div class="ui vertical divider d-none d-lg-block">
                        ou
                    </div>
                </div>
            </div>
        </main>
        </>
    );
};

// const mapState = store => ({
//     loggingIn: store.authentication
// })

// function mapState(state) {
//   const { loggingIn } = state.authentication;
//   return { loggingIn };
// }

// const actionCreators = {
//   login: userActions.login(),
//   logout: userActions.logout
// };

// const login = userActions.login()

// const mapDispatchToProps = dispatch =>
//     bindActionCreators({ login }, dispatch);

// export default connect(mapState, actionCreators)(LoginPage)

export default LoginPage