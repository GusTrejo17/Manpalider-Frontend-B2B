import React, {Component} from 'react';
import {config, SERVICE_API,DISPATCH_ID} from "../libs/utils/Const";
import {ApiClient} from "../libs/apiClient/ApiClient";
import { ProgressBar } from "./index";
import $ from 'jquery';
import {connect} from 'react-redux';
import CurrencyFormat from 'react-currency-format';
// import { PayPalButton } from "react-paypal-button";
import { PayPalButton } from "react-paypal-button-v2";

let apiClient = ApiClient.getInstance();

let paypalOptions = {
    clientId: config.paymentMethod.paypal.clienId,
    intent: 'capture',
    commit: true,
    currency : 'MXN',
};

let  buttonStyles = {
    layout: 'horizontal',
    shape: 'rect',
    color: 'blue'
};

class BillDetailModal extends Component {

    state = {
        paymentMethod: '',
        seleccion: '',
    }

    async addToShopingCart(){
        //Los PROPS los consigues de abajo
        const {order,notificationReducer: {showAlert},configReducer,enableSpinner} = this.props;
        //Lista de los productos del documento

        const bill = []; 

        for(var indice = 0; indice < order.body.length; indice++) {
            const arreglo = order.body[indice];
            let esDuplicado = false;
            for(var i = 0; i < bill.length; i++) {

                if (bill[i].ItemCode === arreglo.ItemCode) {
                    bill[i].Quantity += parseInt(arreglo.Quantity);
                    esDuplicado = true;
                    break;
                }
            }
            if (!esDuplicado) {
                bill.push(arreglo);
            }
        }

        let items = [];
        //Evadir el Articulo de envio
        bill.map((item) => {
            if(item.ItemCode !== "MANIOBRAS" && item.ItemCode !== "MANIOBRAS II"){
                items.push({ItemCode: item.ItemCode, quantity: parseInt(item.Quantity)});
            }
        });
        //Lista sin el Envio o Traslado
        //Comineza a pasarse al carro
        enableSpinner(true);
        //agregar al carro directo con sql
        let responsesd = await apiClient.updateShoppingCartLocal(items);
        if(responsesd.status === 1){
            $('#billModal').modal('hide');
            showAlert(
                            {
                                type: 'success', 
                                message: ' Agregado a carrito correctamente ', 
                                timeOut: 8000
                            }
                );
            configReducer.history.goShoppingCart();
        }
        enableSpinner(false);
    }

    renderPaymentMethod = (total = 999999 ) => {
        // const { paymentMethod } = this.state;
        const { notificationReducer: {showAlert}} = this.props;
        // let total = order.header.DocTotal;
        // let currency = 'MXN'
        // paypalOptions.currency = currency;

        if (total) return <div>
            {/* <PayPalButton
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
                forceReRender={total}
                // amount={total}
            /> */}

            <PayPalButton
                options={paypalOptions}
                style={buttonStyles}
                amount={total}
                // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                onSuccess={(details, data) => {
                    // console.log("Transaction completed by " + details);
                    this.sendOrder();
                    showAlert({type: 'success', message: 'Se esta procesando tu pago'})

                }}
                onError={(details, data) => {
                    // console.log("ha ocurrido un error");}
                    showAlert({type: 'error', message: 'Ha ocurrido un inconveniente con su pago contante a su asesor de ventas'})
                }}
                onCancel={(details, data) => {
                    // console.log("ha cancelado o cerrrado la pagina");
                    showAlert({type: 'warning', message: 'Se ha cerrado la página o bien has cancelado el pago'})

                }}
            />
        </div>
    };

    // Creación del pago
    sendOrder = async () => {
        const { seleccion } = this.state
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
            seleccion: seleccion,
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
            $('#billModal').modal('hide');
            configReducer.history.goHome();
        });
    }

    openPayment = () => {
        $('#paymentModal').modal('show');
    };

    CloseModalTicket = () =>{
        $('#paymentModal').modal('hide');
    }

    selectOption = event => {
        this.setState({
            seleccion: event.nativeEvent.target.value || '',
        })
    };

    render() {
        const {order, guia} = this.props;
        const { seleccion } = this.state;
        return (
            <div>
                {/* Detalle de la factura */}
                <div className="modal fade" id="billModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{border: "none", textAlign: 'center'}}>
                    <div className="modal-dialog modal-xl" role="document" style={{margin: '1.75rem auto'}}>
                        <div className="modal-content">
                            <div className="modal-header" style={{background:'#0060EA'}}>
                                <h5 className="modal-title" style={{color: config.navBar.textColor2}}>Productos de la factura</h5>
                                <button type="button" style={{color: config.navBar.textColor2}} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body bg3" style={{maxHeight: '70vh', overflow: 'auto', padding:'1.5rem'}}>

                                <ProgressBar guiaStatus = {guia} currentDocInfo = {Array.isArray(order.header) ? order.header[0] : order.header} type = {'OINV'}/>

                                <h3 className="text-center font-weight-bold" style={{fontSize:'1.4rem'}}>Detalle del documento</h3> 
                                <div style={{height:"35vh", overflowY:"auto"}}> 
                                    {order.body.map(item => {
                                        // Arreglo de imagenes del campo extra 

                                        let imagesArray = item.U_Handel_ImagesArray || '';
                                        imagesArray = imagesArray.split('|');
                                        let imagenShow = imagesArray[0] ? (config.BASE_URL + SERVICE_API.getImage + '/' + imagesArray[0]) : require('../images/noImage.png');
                                        return (
                                            <div key={item.ItemCode} className=' text-left card ' style={{ border: 'none'}}>
                                                <div className='row' style={{ padding: 10, textAlign: 'center' }}>
                                                    <div className='col-sm-2' style={{ margin: 0 }}>
                                                        <img className="img-fluid"
                                                            style={{backgroundColor: 'white', maxHeight: 130}}
                                                            src={imagenShow}
                                                            alt="Imagen del producto"
                                                        />
                                                    </div>
                                                    <div className='col-sm-10'>
                                                        <div className="container p-0">
                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <div className='text-left' style={{color: "#808080", fontSize:14}}>
                                                                        {item.Dscription}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row font-weight-bold">
                                                                <div className="col-md-12 table-responsive ">
                                                                    <table className="table">
                                                                        <thead style={{textAlign: "-webkit-center"}}>
                                                                            <tr style={{backgroundColor: '#0060EA', color: "white", fontSize:'1rem'}}>
                                                                                <th scope="col">Clave</th>
                                                                                <th scope="col">Cantidad</th>
                                                                                <th scope="col">Precio</th>
                                                                                <th scope="col">Precio Total</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody style={{fontSize:"1rem"}}>
                                                                            <tr>
                                                                                <td> {item.ItemCode} </td>
                                                                                <td> {parseInt(item.Quantity)} </td> 
                                                                                <td>
                                                                                    <CurrencyFormat 
                                                                                        value={item.Price} 
                                                                                        displayType={'text'} 
                                                                                        thousandSeparator={true} 
                                                                                        fixedDecimalScale={true} 
                                                                                        decimalScale={2} 
                                                                                        prefix={'$ '}
                                                                                        suffix={config.general.currency}
                                                                                        >
                                                                                    </CurrencyFormat>   
                                                                                </td>
                                                                                <td>
                                                                                    <CurrencyFormat 
                                                                                        value={item.LineTotal} 
                                                                                        displayType={'text'} 
                                                                                        thousandSeparator={true} 
                                                                                        fixedDecimalScale={true} 
                                                                                        decimalScale={2} 
                                                                                        prefix={'$ '}
                                                                                        suffix={config.general.currency}
                                                                                        >
                                                                                    </CurrencyFormat>
                                                                                </td>                                                       
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="modal-footer">
                                {/* { order.header.DocStatus === "O" &&
                                    // <div className="buttonPaymentMethod">
                                    //     {this.renderPaymentMethod(order.header.DocTotal)}                                    
                                    // </div>
                                    <button type="button" className="btn text-white"  style={{background: "#FFC300"}} onClick={()=> this.openPayment()}>
                                        Pagar ahora
                                    </button>
                                } */}
                                <button type="button" className="btn text-white"  style={{background: "#86C03F"}} onClick={()=> this.addToShopingCart()}>
                                    <i className="fas fa-cart-plus"/>
                                    &nbsp; Agregar al carrito
                                </button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal de pago */}
                <div className="modal fade" id="paymentModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{border: "none", textAlign: 'center'}}>
                    <div className="modal-dialog modal-xl" role="document" style={{margin: '1.75rem auto'}}>
                        <div className="modal-content">
                            <div className="modal-header" style={{background: config.navBar.iconColor}}>
                                <h5 className="modal-title" style={{color: config.navBar.textColor2}}>Pago en Paypal</h5>
                                <button type="button" style={{color: config.navBar.textColor2}} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{backgroundColor: '#E1F0FF'}}>
                                <div className="row justify-content-md-center my-3">
                                    <div className="col-md-6">
                                        <h2 className="card-title"  onClick={this.selectOption}>
                                            <input type="radio" value='04' name="paymentmethod" style={{marginRight: 5}}/>
                                            Tarjeta de crédito
                                        </h2>
                                    </div>
                                    <div className="col-md-6">
                                        <h2 className="card-title"  onClick={this.selectOption}>
                                            <input type="radio" value='28' name="paymentmethod" style={{marginRight: 5}}/>
                                            Tarjeta de débito
                                        </h2>
                                    </div>
                                </div>
                                { seleccion !== '' &&
                                    <div className="row justify-content-md-center my-4" >
                                        <div className="col-md-6">
                                            <div className="buttonPaymentMethod">
                                                {this.renderPaymentMethod(order.header.DocTotal)}                                    
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="modal-footer" style={{backgroundColor: '#E1F0FF'}}>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
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
)(BillDetailModal);
