import React, { Component } from 'react';
import {DISPATCH_ID, SERVICE_RESPONSE, config, ROLES,VIEW_NAME} from '../libs/utils/Const';
import {connect} from 'react-redux';
import {ApiClient} from "../libs/apiClient/ApiClient";
import $ from 'jquery';
import moment from 'moment';
import './Suscription.css';

let apiClient = ApiClient.getInstance();

class Suscription extends Component {

    constructor(props){
        super(props);
        this.state = {
            emailSubscription : '',
            subscriptionStatus : ''
        };
    }

    async componentDidMount() {
        const {sessionReducer} = this.props;
        if(Object.keys(sessionReducer.user).length !== 0){
            setTimeout(async () => {
                await this.verifySubscription();
            }, 250);
        }
    }

    subscribeUnsubscribe = async (option) => {
        const {sessionReducer, enableSpinner, notificationReducer:{showAlert}} = this.props;
        const { emailSubscription } = this.state;

        if(emailSubscription && emailSubscription !== '' && emailSubscription.includes("@")){
            if(option === 'S'){
                let responseVerify = await this.verifySubscription();
                if(responseVerify === 'NO'){
                    return;
                }
            }           

            let user = {
                Email_SAP : emailSubscription
            }

            // enableSpinner(true);
            let response = await apiClient.subscribeUnsubscribe(user, option);
            // enableSpinner(false);

            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                if(option === 'S'){
                    showAlert({type: 'success', message: ' Suscripción existosa ', timeOut: 8000});
                    if(Object.keys(sessionReducer.user).length !== 0){
                        this.setState({
                            subscriptionStatus : 'S'
                        });
                    } else {
                        this.setState({
                            subscriptionStatus : 'S',
                            emailSubscription : ''
                        });
                    }
                    
                } else {
                    showAlert({type: 'success', message: ' Has sido eliminado de nuestro boletín de noticias :( ', timeOut: 8000});
                    if(Object.keys(sessionReducer.user).length !== 0){
                        this.setState({
                            subscriptionStatus : 'U'
                        });
                    } else {
                        this.setState({
                            subscriptionStatus : 'U',
                            emailSubscription : ''
                        });
                    }
                }
            } else {
                showAlert({type: 'error', message: response.message || ' Ocurrió un error con su suscripción', timeOut: 8000});
            }

        } else {
            showAlert({type: 'warning', message: ' Teclee un correo electrónico válido ', timeOut: 8000});
        }
    }

    verifySubscription = async () => {
        const {sessionReducer, enableSpinner, notificationReducer:{showAlert}} = this.props;
        const { emailSubscription } = this.state;
        let response = null;

        // Verificar para usuarios CON SESIÓN
        if(Object.keys(sessionReducer.user).length !== 0){
            // enableSpinner(true);
            response = await apiClient.verifySubscription(sessionReducer.user.U_FMB_Handel_Email);
            // enableSpinner(false);
        } else {
            if(emailSubscription && emailSubscription !== '' && emailSubscription.includes("@")){
                // enableSpinner(true);
                response = await apiClient.verifySubscription(emailSubscription);
                // enableSpinner(false);
            } else {
                showAlert({type: 'warning', message: ' Teclee un correo electrónico válido ', timeOut: 8000});
                return;
            }
        }

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            if(response.data.status === 'S'){
                this.setState({
                    subscriptionStatus : 'S',
                    emailSubscription : sessionReducer.user.U_FMB_Handel_Email
                });
                // showAlert({type: 'success', message: ' Su correo se encuentra suscrito al boletín de noticias ', timeOut: 3000});
                return 'NO';
            } else {
                this.setState({
                    subscriptionStatus : 'U',
                    emailSubscription : sessionReducer.user.U_FMB_Handel_Email
                });
            }
        } 
    }

    changeSubscriptionEmail = (event) => {
        let newEmail =  event.nativeEvent.target.value;
        this.setState({
            emailSubscription : newEmail
        });
    }

    render() {
        const { emailSubscription, subscriptionStatus } = this.state;
        const { sessionReducer } = this.props;

        let nameButtonSubscription = Object.keys(sessionReducer.user).length !== 0 ? subscriptionStatus === 'S' ? 'Cancelar suscripción' : 'Suscribirse' : 'Suscribirse';
        let parameterSubscribeUnsuscribe = nameButtonSubscription === 'Suscribirse' ? 'S' : 'U';

        return (
            <div className="p-4" style={{background: "#e7e7e7"}}>
                <div className='row'>
                    <div className='col-md-1'></div>
                    <div className=' ml-md-0 mr-md-0 col-12 col-lg-4 mt-md-2 pl-md-5 pr-md-5'>
                        <strong className='p-3' style={{fontSize: "16px", color: "#0060ea"}}>Suscríbete a nuestro newsletter</strong>
                        <p className='pl-3' style={{ fontSize: "12px" }}>
                            <span>Sé de los primeros en enterarte de todas nuestras novedades</span>
                            <br></br>
                            <span>¡Blogs, lanzamientos y promociones!</span>
                        </p>
                    </div>
                    <div className='col-lg-0'></div>

                    <div className='col-lg-0'></div>
                    <div className=' ml-md-0 mr-md-0 col-12 col-lg-6 pl-md-5 pr-md-5'>
                        {/* <strong className='p-3' style={{fontSize: "16px", color: "#0060ea"}}>Suscríbete a nuestro newsletter</strong>
                        <p className='pl-3' style={{fontSize: "12px"}}>
                            Texto pendiente
                        </p> */}
                        <div className="input-group p-3" style={{borderRadius: "20px"}}>
                            <input
                                id='search'
                                style={{fontSize: "14px", height: "42px", background: "white", borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px", borderRight: "none", outline: "none"}}
                                type="text"
                                className="form-control form-control-lg text-left font-weight-normal no-outline"
                                name="handel_password"
                                maxLength = '70' 
                                size = '70'
                                placeholder="Ejemplo: correo@dominio.com"
                            />
                            <div className="input-group-prepend">
                                <span className="input-group-text input-group-text-search" style={{background: "#0060ea", borderTopRightRadius: "20px", borderBottomRightRadius: "20px", borderLeft: "none" }}>
                                    <div style={{ display: "flex", justifyContent: "center", borderRadius: "20px", height: "32px", background: "#0060ea"}} onClick={() => this.subscribeUnsubscribe(parameterSubscribeUnsuscribe)}>
                                        <span class="ml-1 p-2" style={{fontSize: "12px", color: "white"}} aria-hidden="true">{nameButtonSubscription} &nbsp;</span>
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-1'></div>
                </div>

               
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        sessionReducer: store.SessionReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Suscription);