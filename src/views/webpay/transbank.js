import React, {Component} from 'react';
import {Footer, NavBar, Session} from "../../components";
import {config, DISPATCH_ID, SERVICE_API, VIEW_NAME, ROLES, SERVICE_RESPONSE} from "../../libs/utils/Const";
import {connect} from "react-redux";
import $ from 'jquery';
import {ApiClient} from "../../libs/apiClient/ApiClient";
import CurrencyFormat from 'react-currency-format';
import { animateScroll as scroll, scroller } from 'react-scroll';

const apiClient = ApiClient.getInstance();
// Definicion de un arreglo para el producto Flete
let responseFlete = {ItemCode:'',ItemName:'',Price:'0',PriceList:'0',PurchaseLimit:''};


class TransBank extends Component {
    constructor(props) {
        super(props);
        let { match: { params } } = this.props;
        //console.log('Transback',this.props);
        this.state = {
            action:params.action,
            nameparam:params.name,
            token:params.token,
            value:'',
            name:''
        }; 
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }
    componentDidMount (){
        const {action,token} = this.state;
        if(action==='response'){
           document.getElementById("webpay-form").submit(); 
        }
        if(action==='finish'){
            if(token==='AUTHORIZED'){
                this.sendOrder();
            }
        }
        this.scrollToBottom();
    }

    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
    }

    sendOrder = async response => {
        const {enableSpinner, sessionReducer: {role}, notificationReducer: {showAlert}, history} = this.props;
        let shoppingCart = [];

        //Recibir datos pára el envio desde el Validadte Order
        let localStorageOrden = JSON.parse(localStorage.getItem(config.general.localStorageNamed + "Envio"));
        const { address, bill} = localStorageOrden;
        enableSpinner(true);

        //Recibir id del usuario desde el localstorage
        let idUsuario=JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'CurrentUser'));
        const{CardCode} = idUsuario;

        let idRemove = {
            CardCode: CardCode
        };

        //DEfinimos el tipo de documento y valires a enviar al front
        let data = {
            shoppingCart,
            address,
            bill,
            objType: '23',
            responseFlete,
        };

        //Creamos el docuemnto
        let apiResponse = await apiClient.createDocument(data);

        //Validamos la creacion del documento
        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            enableSpinner(false);
            //Eliminar el carrito desde el back, mandamando el id del usario
            let removeCart = await apiClient.reomoveShopping(idRemove);

            localStorage.setItem(config.general.localStorageNamed + 'createOrder', apiResponse.data.docNum);
            //Vaciar los valores del localstorage de envio
            history.push('/createOrder')
            return;
        }

        showAlert({type: 'error', message: apiResponse.message});
        enableSpinner(false)

    };

    render() {
        const {history} = this.props;
        const {action,nameparam,token} = this.state;
        return (
            <div style={{marginTop: 69}}>
                {(() =>{
                    if(action==='response'){
                        return (
                            <div>
                                <form id="webpay-form" action="https://webpay3gint.transbank.cl/webpayserver/voucher.cgi" method="post">
                                    <input type="hidden" name={nameparam} value={token}></input>
                                    <button type="submit">Send</button>
                                </form>
                            </div>
                        )
                    }else{
                        return(
                            <div className="content-fluid" style={{marginTop: 69,backgroundColor:config.Back.backgroundColor }}>
                                <Session history={history} view={VIEW_NAME.CREATE_ORDER_VIEW}/>
                                <NavBar/>
                                <div>
                                {(() =>{ 
                                    if(token==='AUTHORIZED'){
                                        return(<div>
                                            <h4 className="text-2xl font-bold text-green-500">
                                            Transacción exitosa
                                            </h4>
                                        </div>)
                                    }
                                    else if(token==='REJECTED'){
                                        return(<div style={{ marginTop: '8rem'}}>
                                            <div className="col-md-12 text-center">
                                                <p style={{fontSize:50}}>
                                                    <i className="far fa-window-close" style={{marginRight:10, color :'red'}}></i>
                                                    <span>Lo sentimos, algo salío mal</span>
                                                </p>
                                            </div>
                                            <div className="col-md-12 text-center">
                                                <button className="btn btn-lg btn-block" onClick={() => history.push('/shoppingCart')}style={{ backgroundColor: config.navBar.backgroundColor,color: config.navBar.textColor,fontWeight: "bold",}}>
                                                    Volver a intentar
                                                </button>
                                            </div>
                                        </div>)
                                    }
                                    else{
                                        return(<div>
                                            <h4 className="text-2xl font-bold text-green-500">
                                                {nameparam}
                                            </h4>
                                        </div>)
                                    } 
                                })()}
                                </div>
                            </div>
                        )
                    }
                })()}
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
        sessionReducer: store.SessionReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
        shoppingCartReducer: store.ShoppingCartReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransBank);