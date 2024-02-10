import React, {Component} from 'react';
import {config, SERVICE_API,DISPATCH_ID} from "../libs/utils/Const";
import CurrencyFormat from 'react-currency-format';
import {ApiClient} from "../libs/apiClient/ApiClient";
import { ProgressBar } from "./index";
import $ from 'jquery';
import {connect} from 'react-redux';
let apiClient = ApiClient.getInstance();
class OrderDetailsModal extends Component {
    async addToShopingCart(){
        //Los PROPS los consigues de abajo
        const {order,notificationReducer: {showAlert},configReducer,enableSpinner} = this.props;
        //Lista de los productos del documento
        //console.log("List of products",order);
        const orders = []; 

        for(var indice = 0; indice < order.body.length; indice++) {
            const arreglo = order.body[indice];
            let esDuplicado = false;
            for(var i = 0; i < orders.length; i++) {

                if (orders[i].ItemCode === arreglo.ItemCode) {
                    orders[i].Quantity += parseInt(arreglo.Quantity);
                    esDuplicado = true;
                    break;
                }
            }
            if (!esDuplicado) {
                orders.push(arreglo);
            }
        }

        let items = [];
        //Evadir el Articulo de envio
        orders.map(item => {
            if(item.ItemCode !== "MANIOBRAS" && item.ItemCode !== "MANIOBRAS II"){
                items.push({ItemCode: item.ItemCode, quantity: parseInt(item.Quantity)});
            }
        });
        //Lista sin el Envio o Traslado
        //console.log("Lista para cargar",items);
        //Comineza a pasarse al carro
        enableSpinner(true);
        //agregar al carro directo con sql
        let responsesd = await apiClient.updateShoppingCartLocal(items);
        // console.log("it's cart",responsesd);
        if(responsesd.status === 1){
            $('#orderDetailsModal').modal('hide');
            showAlert({type: 'success', message: ' Agregado a carrito correctamente ', timeOut: 8000});
            configReducer.history.goShoppingCart();
        }
        enableSpinner(false);
    }
    render() {
        const {order,guia} = this.props;
        
        return (
            <div className="modal fade" id="orderDetailsModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{border: "none", textAlign: 'center'}}>
                <div className="modal-dialog modal-xl" role="document" style={{margin: '1.75rem auto'}}>
                    <div className="modal-content">
                        <div className="modal-header" style={{background: '#0060EA'}}>
                            <h5 className="modal-title" style={{color: config.navBar.textColor2}}>Productos de la orden</h5>
                            <button type="button" style={{color: config.navBar.textColor2}} className="close"data-dismiss="modal"aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body bg3" style={{maxHeight: '70vh', overflow: 'auto', padding:'1.5rem'}}>
                            <ProgressBar guiaStatus = {guia} currentDocInfo = {Array.isArray(order.header) ? order.header[0] : order.header} type = {'ORDR'}/>
                            <h3 className="text-center font-weight-bold" style={{fontSize:'1.4rem'}}>Detalle del documento</h3>

                            <div>
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
                                                                    {item.ItemName}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row font-weight-bold">
                                                            <div className="col-md-12 table-responsive ">
                                                                <table className="table">
                                                                    <thead style={{textAlign: "-webkit-center"}}>
                                                                        <tr style={{backgroundColor: '#0060EA', color: "white", fontSize:'1rem'}}>
                                                                            <th scope="col">Cod. Fabricante</th>
                                                                            <th scope="col">Cantidad</th>

                                                                            <th scope="col">Cantidad entregada</th>
                                                                            <th scope="col">Cantidad faltante</th>

                                                                            <th scope="col">Precio</th>
                                                                            <th scope="col">Precio Total</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody style={{fontSize:"1rem"}}>
                                                                        <tr>
                                                                            <td> {item.SuppCatNum} </td>
                                                                            <td> {item.Quantity} </td>
                                                                             
                                                                            <td> {item.DelivrdQty !== null ? parseInt(item.DelivrdQty) : '--'} </td>
                                                                            <td> {item.OpenQty >=0 ? parseInt(item.OpenQty) : '--'} </td>

                                                                            <td>
                                                                                <CurrencyFormat 
                                                                                    value={item.Price} 
                                                                                    displayType={'text'} 
                                                                                    thousandSeparator={true} 
                                                                                    fixedDecimalScale={true} 
                                                                                    decimalScale={2}
                                                                                    prefix={"$ "}
                                                                                    suffix={`${config.general.currency} `}>
                                                                                </CurrencyFormat>   
                                                                            </td>
                                                                            <td>
                                                                                <CurrencyFormat 
                                                                                    value={item.LineTotal}
                                                                                    displayType={'text'} 
                                                                                    thousandSeparator={true} 
                                                                                    fixedDecimalScale={true} 
                                                                                    decimalScale={2}
                                                                                    prefix={"$ "}
                                                                                    suffix={`${config.general.currency} `}>
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

                            {/* {order.body.map(item => {
                                return <div key={item.ItemCode} className="row">
                                    <div className="col-md-4">
                                        <img className="img-fluid"
                                            style={{
                                                backgroundColor: 'white',
                                                maxHeight: 130
                                            }}
                                            src={item.PicturName ? (config.BASE_URL + SERVICE_API.getImage + '/' + item.PicturName) : require('../images/noImage.png')}
                                            alt=""
                                        />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="container p-0">
                                            <div className="row text-left">
                                                <div className="col-md-12" >
                                                    {item.Dscription}
                                                </div>
                                            </div>
                                            <div className="row font-weight-bold ">
                                                <div className="col-md-3">
                                                    Clave
                                                </div>
                                                <div className="col-md-3">
                                                    Cantidad
                                                </div>
                                                <div className="col-md-3">
                                                    Precio
                                                </div>
                                                <div className="col-md-3">
                                                    Precio Total
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    {item.ItemCode}
                                                </div>
                                                <div className="col-md-3">
                                                    {item.Quantity}
                                                </div>
                                                <div className="col-md-3">
                                                    <CurrencyFormat 
                                                        value={item.Price} 
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        fixedDecimalScale={true} 
                                                        decimalScale={2} 
                                                        prefix={`${config.general.currency} `}>
                                                    </CurrencyFormat>                                                    
                                                </div>
                                                <div className="col-md-3">
                                                    <CurrencyFormat 
                                                        value={item.LineTotal}
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        fixedDecimalScale={true} 
                                                        decimalScale={2} 
                                                        prefix={`${config.general.currency} `}>
                                                    </CurrencyFormat>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })} */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn text-white"  style={{background: "#86C03F"}} onClick={()=> this.addToShopingCart()}>
                                <i className="fas fa-cart-plus"/>
                                &nbsp; Agregar al carrito
                            </button>
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
)(OrderDetailsModal);