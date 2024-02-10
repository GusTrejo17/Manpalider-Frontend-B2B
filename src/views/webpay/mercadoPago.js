import React, { Component } from 'react';
import { NavBar } from "../../components";
import { config, DISPATCH_ID, SERVICE_API, VIEW_NAME, ROLES, SERVICE_RESPONSE } from "../../libs/utils/Const";
import { connect } from "react-redux";
import $ from 'jquery';
import { ApiClient } from "../../libs/apiClient/ApiClient";
import CurrencyFormat from 'react-currency-format';
import { animateScroll as scroll, scroller } from 'react-scroll';

const apiClient = ApiClient.getInstance();
// Definicion de un arreglo para el producto Flete
let responseFlete = { ItemCode: '', ItemName: '', Price: '0', PriceList: '0', PurchaseLimit: '' };


class MercadoPago extends Component {
    constructor(props) {
        super(props);
        let { match: { params } } = this.props;
        //console.log('Transback',this.props);
        this.state = {

            payment_id: '',
            status: '',
            collection_id: '',
            collection_status: '',
        };
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }
    componentDidMount() {
        const { payment_id, status, collection_id, collection_status } = this.state;


        const query = new URLSearchParams(this.props.location.search);
        const payment_id2 = query.get('payment_id');
        const status2 = query.get('status');
        const col_id = query.get("collection_id");
        const col_status = query.get("collection_status");
        // console.log("PAYMENT ID > ", payment_id2);
        // console.log("PAYMENT status > ", status2);
        // console.log("Collection ID > ", col_id);
        // console.log("Collection status > ", col_status);
        this.setState({
            payment_id: payment_id2,
            status: status2,
            collection_id: col_id,
            collection_status: col_status
        })
        if (status === collection_status) {
            this.sendOrder();
        }

        //  console.log("PAYMENT ID > ", collection_status);
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
        const { enableSpinner, sessionReducer: { role }, notificationReducer: { showAlert }, history } = this.props;
        let shoppingCart = [];

        //Recibir datos pára el envio desde el Validadte Order
        let localStorageOrden = JSON.parse(localStorage.getItem(config.general.localStorageNamed + "Envio"));
        const { address, bill } = localStorageOrden;
        // console.log("LOCAL STORAGE ORDEN => ", localStorageOrden)
        // console.log("Address=> ", address);
        // console.log("Bill=> ", bill);
        enableSpinner(true);

        //Recibir id del usuario desde el localstorage
        let idUsuario = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'CurrentUser'));
        const { CardCode } = idUsuario;

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

        showAlert({ type: 'error', message: apiResponse.message });
        enableSpinner(false)

    };

    render() {
        const { payment_id, status, collection_id, collection_status } = this.state;


        const { history } = this.props;
        return (
            <div>
                <NavBar />
                <div style={{ marginTop: 150 }}>
                    <h1> PROCESANDO PAGO... </h1>
                    <h5> Payment_ID: {payment_id}</h5>
                    <br></br>
                    <h5>Status: {status}</h5>
                    <br></br>

                </div>
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
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MercadoPago);