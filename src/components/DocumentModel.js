import React, {Component} from 'react';
import {config, SERVICE_API,DISPATCH_ID} from "../libs/utils/Const";
import {ApiClient} from "../libs/apiClient/ApiClient";
import $ from 'jquery';
import {connect} from 'react-redux';

let apiClient = ApiClient.getInstance();

class DocumentModel extends Component {
    async addToShopingCart(){
        //Los PROPS los consigues de abajo
        const {order,notificationReducer: {showAlert},configReducer,enableSpinner} = this.props;
        //Lista de los productos del documento
        let items = [];
        //Evadir el Articulo de envio
        order.body.map(item => {
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
            $('#docuementModal').modal('hide');
            showAlert({type: 'success', message: ' Agregado a carrito correctamente ', timeOut: 8000});
            configReducer.history.goShoppingCart();
        }
        enableSpinner(false);
    }
    render() {
        const {order} = this.props;
        return (
            <div className="modal fade" id="docuementModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{border: "none", textAlign: 'center'}}>
                <div className="modal-dialog modal-lg" role="document" style={{margin: '1.75rem auto'}}>
                    <div className="modal-content">
                        <div className="modal-header" style={{background: config.navBar.iconColor}}>
                            <h5 className="modal-title" style={{color: config.navBar.textColor2}}>Productos de la plantilla</h5>
                            <button type="button" style={{color: config.navBar.textColor2}} className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body bg3" style={{maxHeight: '70vh', overflow: 'auto'}}>
                            {!!order.body && order.body.map(item => {
                                const quantityPrev = item.Quantity;
                                if (item.SalesMultiplier && item.SalesMultiplier !== 0) {
                                    if (parseInt(quantityPrev) % parseInt(item.SalesMultiplier) !== 0) {
                                        const nextQuantity = Math.ceil(parseInt(item.Quantity) / item.SalesMultiplier) * item.SalesMultiplier;
                                        item.Quantity = nextQuantity;
                                    }
                                }
                                // Arreglo de imagenes del campo extra
                                let imagesArray = item.U_Handel_ImagesArray || '';
                                imagesArray = imagesArray.split('|');
                                let imagenShow = imagesArray[0] ? (config.BASE_URL + SERVICE_API.getImage + '/' + imagesArray[0]) : require('../images/noImage.png');
                                return <div key={item.ItemCode} className="row">
                                    <div className="col-md-4">
                                        <img className="img-fluid" style={{ backgroundColor: 'white', maxHeight: 80 }}
                                            src={imagenShow}
                                            alt="Imagen del producto"
                                        />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="container p-0">
                                            <div className="row text-left">
                                                <div className="col-md-12" >
                                                    {item.ItemName}
                                                </div>
                                            </div>
                                            <div className="row font-weight-bold ">
                                                <div className="col-md-4">
                                                    Código
                                                </div>
                                                <div className="col-md-4">
                                                    Código de fabricante
                                                </div>
                                                <div className="col-md-4">
                                                    Cantidad
                                                </div>
                                                {/* <div className="col-md-3">
                                                    Marca
                                                </div> */}
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    {item.ItemCode}
                                                </div>
                                                <div className="col-md-4">
                                                    {item.SuppCatNum}
                                                </div>
                                                <div className="col-md-4">
                                                    {parseInt(quantityPrev)}
                                                    {(item.SalesMultiplier && item.SalesMultiplier !== 0 && (parseInt(quantityPrev) % parseInt(item.SalesMultiplier)) !== 0) &&<> <br /><span style={{color:'red'}}> (Múltiplo de venta: {parseInt(item.SalesMultiplier)}) </span> </>}
                                                </div>
                                                {/* <div className="col-md-3">
                                                    {item.U_Linea ? item.U_Linea : ''}
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
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
)(DocumentModel);