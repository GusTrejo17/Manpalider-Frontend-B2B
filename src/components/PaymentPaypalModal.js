import React, {Component} from 'react';
import {config, SERVICE_API,DISPATCH_ID} from "../libs/utils/Const";
import {ApiClient} from "../libs/apiClient/ApiClient";
import { ProgressBar } from "./index";
import $ from 'jquery';
import {connect} from 'react-redux';
import CurrencyFormat from 'react-currency-format';
import { PayPalButton } from "react-paypal-button";

let apiClient = ApiClient.getInstance();

let paypalOptions = {
    clientId: config.paymentMethod.paypal.clienId,
    intent: 'capture',
    commit: true
};

const buttonStyles = {
    layout: 'vertical',
    shape: 'rect',
    color: 'blue'
};

class PaymentPaypalModal extends Component {

    state = {
        paymentMethod: '',
        seleccion: '',
    }

    renderPaymentMethod = () => {
        const {order, enableSpinner } = this.props;
        let total = order.header.DocTotal;
        let currency = 'MXN'
        paypalOptions.currency = currency;

        if (total && currency) return <div>
            <PayPalButton
                paypalOptions={paypalOptions}
                buttonStyles={buttonStyles}
                onPaymentStart={() => {
                    //console.log("start payment paypal");
                    enableSpinner(true)
                }}
                onPaymentCancel={() => {
                    //console.log("cancel payment paypal");
                    enableSpinner(false)
                }}
                onPaymentError={(msg) => {
                    //console.log("error payment paypal", msg);
                    enableSpinner(false)
                }}
                onPaymentSuccess={(result) => {

                    this.sendOrder()
                }}
                amount={total}

            />
        </div>
    };

    // Creación del pago
    sendOrder = async () => {
        // Obtenermos datos para el pago y la navegación
        const {order,enableSpinner, notificationReducer: {showAlert},configReducer} = this.props;

        // Cargamos el usuario
        let CurrentUser = localStorage.getItem(config.general.localStorageNamed + 'CurrentUser');
        CurrentUser = JSON.parse(CurrentUser);

        // Preparemos los datos del pagp
        let data = {
            CardCode: CurrentUser.CardCode,
            DocEntry: order.header.DocEntry,
            DocTotal: order.header.DocTotal,
            objType: '24',
        }

        // Hacemos la petición del pago y esperar la respuesta 
        await apiClient.createPayment(data).then( (response) => {
            enableSpinner(false);
            if(response.status === 1){
                showAlert({type: 'success', message: response.message , timeOut: 8000});
            }else{
                showAlert({type: 'error', message: response.message , timeOut: 8000});
            }
            $('#paymentModal').modal('hide');
            configReducer.history.goHome();
        });
    }

    selectAddress = event => {
        this.setState({
            seleccion: event.nativeEvent.target.value || '',
        })
    };

    render() {
        const { seleccion } = this.state;
        return (
            <div className="modal fade" id="paymentModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{border: "none", textAlign: 'center'}}>
                <div className="modal-dialog modal-xl" role="document" style={{margin: '1.75rem auto'}}>
                    <div className="modal-content">
                        <div className="modal-header" style={{background: config.navBar.iconColor}}>
                            <h5 className="modal-title" style={{color: config.navBar.textColor2}}>Pago en Paypal</h5>
                            <button type="button" style={{color: config.navBar.textColor2}} className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body bg3">
                            <div className="row">
                                <div className="col-md-6">
                                    <h5 className="card-title">
                                        <input type="radio" value='04' onClick={this.selectAddress} style={{marginRight: 5}}/>
                                        Tarjeta de crédito
                                    </h5>
                                </div>
                                <div className="col-md-6">
                                <h5 className="card-title">
                                        <input type="radio" value='28' onClick={this.selectAddress} style={{marginRight: 5}}/>
                                        Tarjeta de débito
                                    </h5>
                                </div>
                            </div>
                            { seleccion !== '' &&
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="buttonPaymentMethod">
                                            {this.renderPaymentMethod()}                                    
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
        notificationReducer: store.NotificationReducer,
        configReducer: store.ConfigReducer,
        shoppingCartReducer: store.ShoppingCartReducer
    };
}

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        setItemDetailsSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SET_ITEM_DETAILS, value}),
        setItemsSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SET_ITEMS, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PaymentPaypalModal);
