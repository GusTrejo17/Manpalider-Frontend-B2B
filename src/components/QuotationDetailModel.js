import React, {Component} from 'react';
import {config, SERVICE_API,DISPATCH_ID} from "../libs/utils/Const";
import {ApiClient} from "../libs/apiClient/ApiClient";
import { ProgressBar } from "./index";
import $ from 'jquery';
import {connect} from 'react-redux';

let apiClient = ApiClient.getInstance();

class QuotationDetailModel extends Component {
    async addToShopingCart(){
        //Los PROPS los consigues de abajo
        const {order,notificationReducer: {showAlert},configReducer,enableSpinner} = this.props;
        //Lista de los productos del documento
        //console.log("List of products",order);
        let items = [];
        //Evadir el Articulo de envio
        order.body.map(item => {
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
            $('#quotationModal').modal('hide');
            showAlert({type: 'success', message: ' Agregado a carrito correctamente ', timeOut: 8000});
            configReducer.history.goShoppingCart();
        }
        enableSpinner(false);
    }
    render() {
        const {order, guia} = this.props;
        // console.log("Datos para la factura 2",order);
        return (
            <div className="modal fade" id="quotationModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{border: "none", textAlign: 'center'}}>
                <div className="modal-dialog modal-xl" role="document" style={{margin: '1.75rem auto'}}>
                    <div className="modal-content">
                        <div className="modal-header" style={{background: '#0060EA'}}>
                            <h5 className="modal-title" style={{color: config.navBar.textColor2, fontSize:'1.2rem'}}>Productos de la cotización</h5>
                            <button type="button" style={{color: config.navBar.textColor2}} className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body bg3" style={{maxHeight: '70vh', overflow: 'auto', padding:'1.5rem'}}>
                            <ProgressBar guiaStatus = {guia} currentDocInfo = {Array.isArray(order.header) ? order.header[0] : order.header} type = {'OQUT'}/>
                            
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
                                                    <img className="img-fluid" style={{ backgroundColor: 'white', maxHeight: 130 }}
                                                        src={imagenShow}
                                                        alt="Imagen del producto"
                                                    />
                                                </div>
                                                <div className='col-sm-10'>
                                                    <div className="container p-0">
                                                        <div className="row">
                                                            <div className="col-12" style={{ }}>
                                                                <div className='text-left' style={{color: "#808080", fontSize:14}} >
                                                                    {item.ItemName}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row font-weight-bold">
                                                            <div className="col-md-12 table-responsive ">
                                                                <table className="table">
                                                                    <thead style={{textAlign: "-webkit-center"}}>
                                                                        <tr style={{backgroundColor: '#0060EA', color: "white", fontSize:"1rem"}}>
                                                                            <th scope="col">Clave</th>
                                                                            <th scope="col">Cantidad</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody style={{textAlign: "-webkit-center"}}>
                                                                        <tr>
                                                                            <td style={{fontSize:"1rem"}}> {item.ItemCode} </td>
                                                                            <td style={{fontSize:"1rem"}}> {item.Quantity} </td>                                                          
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
                                        <img className="img-fluid" style={{ backgroundColor: 'white', maxHeight: 130 }}
                                            src={item.PicturName ? (config.BASE_URL + SERVICE_API.getImage + '/' + item.PicturName) : require('../images/noImage.png')}
                                            alt=""
                                        />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="container p-0">
                                            <div className="row text-left">
                                                <div className="col-md-12"  style={{}}>
                                                    {item.ItemName}
                                                </div>
                                            </div>
                                            <div className="row font-weight-bold ">
                                                <div className="col-md-6">
                                                    Código
                                                </div>
                                                <div className="col-md-6">
                                                    Cantidad
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    {item.ItemCode}
                                                </div>
                                                <div className="col-md-6">
                                                    {parseInt(item.Quantity)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })} */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn btn-success" onClick={()=> this.addToShopingCart()}>
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
)(QuotationDetailModel);
