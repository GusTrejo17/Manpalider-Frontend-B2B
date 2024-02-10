import React, {Component} from 'react';
import {DISPATCH_ID, SERVICE_RESPONSE, config, ROLES} from '../libs/utils/Const';
import {connect} from 'react-redux';
import {ApiClient} from "../libs/apiClient/ApiClient";
import {Modal} from './index';
import $ from 'jquery';

let modal = new Modal();
let apiClient = ApiClient.getInstance();

class OpenPayModal extends Component {
    componentDidMount() {
        this.closeAction();
    }

    submit = async () => {
        const {
            loginReducer, 
            configReducer, 
            enableSpinner, 
            notificationReducer: {showAlert}, 
            setToken, 
            setUserSession, 
            setRememberUser, 
            setRole, 
            shoppingCartReducer: {getShoppingCart}
        } = this.props;


        let user = {
            email: loginReducer.user,
            password: loginReducer.password,
        };

        enableSpinner(true);
        //let checkOrder = await apiClient.getNotifyOrder();
        //console.log("Valores del order",checkOrder);
        //console.log("Dato del group",checkOrder.groupCodeDefault );
        
        let response = await apiClient.login(user);

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            let user = response.data.user;
            //console.log('dataUser',user);
            let token = response.data.token;
            let remember = true;
            showAlert({type: 'success', message: ' Bienvenido de nuevo ' + user.CardName, timeOut: 8000});
            localStorage.setItem(config.general.localStorageNamed + 'Token', JSON.stringify(token));
            localStorage.setItem(config.general.localStorageNamed + 'Role', ROLES.CLIENT);
            localStorage.setItem(config.general.localStorageNamed + 'CurrentUser', JSON.stringify(user));
            localStorage.setItem(config.general.localStorageNamed + 'RememberUser', remember );

            setRole(ROLES.CLIENT);
            setToken(token);
            setUserSession(user);
            setRememberUser(remember);

            let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');
            
            let responsesd = await apiClient.updateShoppingCartLocal(JSON.parse(localShoppingCart));
            //console.log('RespuestaCart',responsesd.data.value);
            enableSpinner(false);
            /*localStorage.removeItem(config.general.localStorageNamed + 'shoppingCart');

            if (response.status === SERVICE_RESPONSE.ERROR) {
                showAlert({type: 'error', message: response.message, timeOut: 0});
                return;
            }*/

            // consultar el localstorage para ingresarlo a la base de datos 
            //y poder cargar todos los articulos ya sea de la base de datos como los que tiene en la session
            //console.log('EntroModalLoguinCart',response);
            setTimeout(()=> {
                getShoppingCart();
                configReducer.history.goHome();
                /*if(responsesd.data.value > 0){
                    configReducer.history.goShoppingCart();
                }else{
                    configReducer.history.goHome();
                }*/
            },50);

            modal.loginModal('hide');
            modal.itemDetails('hide');

            return;
        }else{
            showAlert({type: 'error', message: response.message});
            enableSpinner(false);
        }
    };

    closeAction = () => {
        const {cleanLoginReducer} = this.props;
        $('#openPayModal').on('show.bs.modal', function () {
            //console.log("cerrar registro");
            cleanLoginReducer();
        });
    };

    render() {
        const {setUser, setPassword, loginReducer} = this.props;
        return (
            <div className="modal fade" id="openPayModal" role="dialog"
                 aria-labelledby="exampleModalLabel" aria-hidden="true" style={{border: "none", textAlign: 'center'}}>

                <div className="modal-dialog" role="document" style={{maxWidth: 400, margin: '1.75rem auto'}}>
                    <div className="modal-content">
                        <div className="modal-header" style={{background: config.navBar.backgroundColor}}>
                            <h5 className="modal-title" style={{color:  config.navBar.textColor}}>Iniciar Sesión</h5>
                            <button type="button" style={{color: config.navBar.textColor}} className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body bg3">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="input-group">
                                        <div className="input-group-prepend" onClick={() => {}}>
                                            <span className="input-group-text" style={{background: config.navBar.iconBackground}}><i className={config.icons.user} style={{color: config.navBar.iconModal}}/></span>
                                        </div>
                                        <input
                                            id={'handel_user'}
                                            type="text"
                                            className="form-control text-left"
                                            name="new_email_regiser"
                                            placeholder="Correo"
                                            autoComplete={'new-user'}
                                            style={{textAlign: 'center', height: 30}}
                                            value={loginReducer.user}
                                            onChange={(event) => setUser(event.target.value)}
                                        />
                                    </div>
                                    <div className="input-group" style={{marginTop:10}}>
                                        <div className="input-group-prepend" onClick={() => {}}>
                                            <span className="input-group-text" style={{background: config.navBar.iconBackground}}><i className={config.icons.password} style={{color: config.navBar.iconModal}}/></span>
                                        </div>
                                        <input
                                            id={'handel_password'}
                                            type="password"
                                            className="form-control text-left"
                                            name="handel_password"
                                            placeholder="Contraseña"
                                            autoComplete={'new-password'}
                                            style={{textAlign: 'center', height: 30}}
                                            onKeyDown={event => event.keyCode === 13 && this.submit()}
                                            value={loginReducer.password}
                                            onChange={(event) => setPassword(event.target.value)}
                                        />
                                    </div>
                                    <div className="input-group col-xs-12" style={{marginLeft: 10, marginTop:10}}>
                                        <input type="checkbox" name="remember" id="remember" style={{textAlign: 'center', fontSize: 13, marginTop: 10, cursor: 'pointer'}}/>
                                        <label htmlFor='remember' style={{fontSize: 13, marginTop: 5, marginLeft: 5, cursor: 'pointer'}}>
                                            Recordar mi sesión
                                        </label>
                                    </div>
                                    <div style={{textAlign: "center"}}>
                                        <button
                                            onClick={this.submit}
                                            className="btn btn-block"
                                            style={{
                                                backgroundColor: config.navBar.iconBackground,
                                                color: config.navBar.iconModal,
                                            }}>
                                            Iniciar sesión
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div style={{textAlign: "center"}}>
                                <label style={{textAlign: "center"}}>¿Aún no tienes cuenta?<br></br>
                                    <span style={{color: 'rgb(13, 98, 168)', cursor: 'pointer'}} onClick={() =>  {modal.loginModal('hide'); modal.loginRegisterModal('show') }}>Registrarse</span></label>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        loginReducer: store.LoginReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
        shoppingCartReducer: store.ShoppingCartReducer
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setUser: value => dispatch({type: DISPATCH_ID.LOGIN_SET_USER, value}),
        setPassword: value => dispatch({type: DISPATCH_ID.LOGIN_SET_PASSWORD, value}),
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        setRole: value => dispatch({type: DISPATCH_ID.SESSION_SET_ROLE, value}),
        setToken: value => dispatch({type: DISPATCH_ID.SESSION_SET_TOKEN, value}),
        setRememberUser: value =>  dispatch({type: DISPATCH_ID.SESSION_SET_REMEMBER_USER, value}),
        setUserSession: value => dispatch({type: DISPATCH_ID.SESSION_SET_USER, value}),
        cleanLoginReducer: value => dispatch({type: DISPATCH_ID.LOGIN_CLEAN_REDUCER, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(OpenPayModal);
