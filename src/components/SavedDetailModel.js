import React, {Component} from 'react';
import {config, SERVICE_API,DISPATCH_ID,SERVICE_RESPONSE} from "../libs/utils/Const";
import {ApiClient} from "../libs/apiClient/ApiClient";
import $ from 'jquery';
import {connect} from 'react-redux';
import CurrencyFormat from 'react-currency-format';
import ExportReportPDF from './ExportReportPDF';
import { CSVLink, CSVDownload } from "react-csv";
let apiClient = ApiClient.getInstance();

class SaveDetailModel extends Component {
    csvLink= React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            // newOrder :[],
            tableToExcel : [],
        };
    };

    async addToShopingCart(){
        //Los PROPS los consigues de abajo
        const {order,notificationReducer: {showAlert},configReducer,enableSpinner, updateCart} = this.props;
        //Lista de los productos del documento
        let items = [];
        //Evadir el Articulo de envio
        order.body.map(item => {
            if(item.ItemCode !== "MANIOBRAS" && item.ItemCode !== "MANIOBRAS II"){
                if(updateCart === 'Y'){
                    items.push({ItemCode: item.ItemCode, quantity: parseInt(item.Quantity), Price : item.Price, Disc: item.Discount});
                }else{
                    items.push({ItemCode: item.ItemCode, quantity: parseInt(item.Quantity)});
                }
            }
        });
        //Lista sin el Envio o Traslado
        //Comineza a pasarse al carro
        enableSpinner(true);
        //agregar al carro directo con sql
        let responsesd = await apiClient.updateShoppingCartLocal(items);
        if(responsesd.status === 1){
            $('#saveModal').modal('hide');
            showAlert({type: 'success', message: ' Agregado a carrito correctamente ', timeOut: 8000});
            configReducer.history.goShoppingCart();
        }
        enableSpinner(false);
    }

    changeQuantityItem = async (event, index) => {
        const {notificationReducer: {showAlert},enableSpinner,order,refreshSate} = this.props;

        let quantity = event.nativeEvent.target.value;
        
        if (quantity.indexOf(" ") !== -1 || quantity.indexOf("-") !== -1) {
            showAlert({type: 'warning', message: "Carácter no permitido"});
            return;               
        }

        order.body[index].Quantity = parseInt(quantity);
        refreshSate(order);
        setTimeout(() => {
            this.setState({
                // newOrder: order.body,
            });
        }, 100);
    }

    changePriceItem = async (event, index) => {
        const {notificationReducer: {showAlert},order,refreshSate} = this.props;

        let price = event.nativeEvent.target.value;
       
        if (!isNaN(price)) {
            order.body[index].Price = price;
            order.body[index].newTotal = ((order.body[index].Price - (order.body[index].Price * (order.body[index].Discount || 0 / 100) / 100)) * (order.body[index].Quantity));
            refreshSate(order);
            this.setState({
                // newOrder: order.body,
            });  
        }else{
            showAlert({type: 'warning', message: "Carácter no permitido"});
            return;  
        }        
    }

    changeDiscountItem = async (event, index) => {
        const {notificationReducer: {showAlert},enableSpinner,order,refreshSate} = this.props;

        let discount = event.nativeEvent.target.value;
        
        if (discount.indexOf(" ") !== -1 || discount.indexOf("-") !== -1) {
            showAlert({type: 'warning', message: "Carácter no permitido"});
            return;               
        }

        order.body[index].Discount = discount;
        order.body[index].newTotal = ((order.body[index].Price - (order.body[index].Price * (order.body[index].Discount || 0 / 100) / 100)) * (order.body[index].Quantity));
        refreshSate(order);
        setTimeout(() => {
            this.setState({
                // newOrder: order.body,
            });
        }, 100);
    }

    changeTotalItem = async (index, item, event) => {
        const { notificationReducer: { showAlert }, order,refreshSate} = this.props;
        let total = event.nativeEvent.target.value
        
        let DiscPrcnt = 100 - ( (total * 100) / order.body[index].beforeTotal);
        
        if (!isNaN(DiscPrcnt)) {
            order.body[index].Discount = DiscPrcnt;
            order.body[index].newTotal = total;
            refreshSate(order);
            this.setState({
                // newOrder: order.body,
            });
        }else{
            showAlert({type: 'warning', message: "Carácter no permitido"});
            return;  
        }
    }

     UpdateCart = async () =>{
        const {notificationReducer: {showAlert},configReducer,enableSpinner,getData,order} = this.props;
        // const {newOrder} = this.state;
        let items = [];

        let docEntry = order.body.length > 0 ? order.body[0].id : null;
        if(!docEntry){
            showAlert({type: 'warning', message: 'Aún no has hecho algún cambio ', timeOut: 8000});
            return;
        }
        for (let index = 0; index < order.body.length; index++) {
            const item = order.body[index];
            if(item.ItemCode !== "ENVIO"){
                items.push({ItemCode: item.ItemCode, quantity: parseInt(item.Quantity), Price : item.Price, Disc: item.Discount});
            }
        }
        
        
        enableSpinner(true);
        let data = {
            docEntry,
            items,
            UpdateCart : 'Y',
        }
        
        let response = await apiClient.updateSavedCart(data);
        if(response.status === SERVICE_RESPONSE.SUCCESS){
            await getData(1);
            showAlert({type: 'success', message: response.message, timeOut: 8000});
            setTimeout(() => {
                $('#saveModal').modal('hide');
            }, 1500);
        }else{
            showAlert({type: 'error', message: response.message, timeOut: 8000});
        }
        enableSpinner(false);

    }

    exportCSVOrders = async () => {
        const { order,notificationReducer: {showAlert}} = this.props;
        setTimeout(() => {
            if (order.body.length > 0){
                let minNewOrders = [];
                order.body.map((saved, index) => {
                    minNewOrders.push(
                        {
                            "#": index+1,
                            "Código SAP": saved.ItemCode,
                            "Cód. fabricante": saved.SuppCatNum,
                            "Descripción": saved.ItemName,
                            "Cantidad": saved.Quantity,
                            "Precio": '$ '+ Number(saved.Price - (saved.Price * (saved.Discount || 0 / 100) / 100)).toFixed(2),
                            "Precio total": '$ '+ Number((saved.Price - (saved.Price * (saved.Discount || 0 / 100) / 100)).toFixed(2) * (saved.Quantity)).toFixed(2),
                        }
                    );
                });
                this.setState({ tableToExcel: minNewOrders });
                setTimeout(() => {
                        this.csvLink.current.link.click();
                }, 500); 
            }else{
                showAlert({type: 'info', message: 'No se ha podido generar sus archivo, porque no se encontraron resultado para su búsqueda'});
            }
        }, 500);
    } 

    render() {
        const {order, date, user, seller, currentCart} = this.props;
        const {tableToExcel} = this.state;
        let valor = seller ? seller.U_FMB_Handel_Perfil : '0';
        let modificarPrecio = seller ? seller.U_FMB_Handel_Precio : '0';
        let modificarDescuento = seller ? seller.U_FMB_Handel_Desc : '0';
        let SubTotal = 0;
        !!order.body && order.body.map(save =>{
            SubTotal += save.newTotal ? Number(save.newTotal) : Number((save.Price - (save.Price * (save.Discount || 0 / 100) / 100)).toFixed(2) * (save.Quantity))// save.Price * parseInt(save.Quantity);
        })
        if(!order.body){
            return (<div></div>)
        }
        
        return (
            <div className="modal fade" id="saveModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{border: "none", textAlign: 'center'}}>
                <CSVLink 
                    data={tableToExcel} 
                    filename ={`CotizacionCliente.csv`}                
                    className="hidden"
                    ref={this.csvLink}
                    target="_blank">
                </CSVLink>
                <div className="modal-dialog modal-xl" role="document" style={{margin: '1.75rem auto'}}>
                    <div className="modal-content">
                        <div className="modal-header" style={{background: '#0060EA'}}>
                            <h5 className="modal-title" style={{color: config.navBar.textColor2}}>Detalle del carrito</h5>
                            <button type="button" style={{color: config.navBar.textColor2}} className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body bg3" style={{maxHeight: '70vh', overflow: 'auto', padding:'1.5rem'}}>

                        <div>
                            {order.body.map((item, index) => {
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
                                                        <div className="col-12" style={{ }}>
                                                            <div className='text-left' style={{color: "#808080", fontSize:"14px"}}>
                                                                {item.ItemName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row font-weight-bold">
                                                        <div className="col-md-12 table-responsive ">
                                                            <table className="table" style={{fontSize: "12px"}}>
                                                                <thead style={{textAlign: "-webkit-center"}}>
                                                                    <tr style={{backgroundColor: '#0060EA', color: "white", fontSize:"1rem"}}>
                                                                        <th scope="col">Código</th>
                                                                        <th scope="col">Cód de fabricante</th>                                                                        
                                                                        <th scope="col">Cantidad</th>
                                                                        <th scope="col">Precio</th>
                                                                        {parseInt(seller.U_FMB_Handel_Perfil) != 0 && 
                                                                            <th scope="col">Descuento</th>
                                                                        }
                                                                        <th scope="col">Precio con descuento</th>
                                                                        <th scope="col">Total sin IVA</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody style={{fontSize:"1rem"}}>
                                                                    <tr>
                                                                        <td> {item.ItemCode} </td>
                                                                        <td> {item.SuppCatNum} </td>
                                                                        <td>
                                                                            {valor === 3 && modificarPrecio === '1' ?  ( 
                                                                                <input
                                                                                    type="number"
                                                                                    className=" form-control validarCant cantBlur btn-outline-secondary"
                                                                                    disabled={seller.U_FMB_Handel_Precio === '0' ? true : false}
                                                                                    style={{
                                                                                        backgroundColor: seller.U_FMB_Handel_Precio === '0' ? '#ededed' : 'transparent',
                                                                                        borderColor: '#ced4da',
                                                                                        color: '#000',
                                                                                        paddingTop: 1,
                                                                                        paddingBottom: 2,
                                                                                        maxWidth: '100%',
                                                                                        textAlign: "center",
                                                                                    }}
                                                                                    id={'itemCantidad' + index}
                                                                                    value={item.Quantity}
                                                                                    onChange={event => this.changeQuantityItem(event, index)}
                                                                                />): 
                                                                                <label>{parseInt(item.Quantity)}</label> 
                                                                            }
                                                                        </td> 
                                                                        <td>                                                                               
                                                                            {valor === 3 && modificarPrecio === '1' ? ( <input
                                                                                type="number"
                                                                                className=" form-control validarCant cantBlur btn-outline-secondary"
                                                                                disabled={seller.U_FMB_Handel_Precio === '0' ? true : false}
                                                                                style={{
                                                                                    backgroundColor: seller.U_FMB_Handel_Precio === '0' ? '#ededed' : 'transparent',
                                                                                    borderColor: '#ced4da',
                                                                                    color: '#000',
                                                                                    paddingTop: 1,
                                                                                    paddingBottom: 2,
                                                                                    maxWidth: '100%',
                                                                                    textAlign: "center",
                                                                                }}
                                                                                id={'itemPrice' + index}
                                                                                value={item.Price}
                                                                                onChange={event => this.changePriceItem(event, index)}
                                                                            />):
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
                                                                            }
                                                                        </td>
                                                                        {parseInt(seller.U_FMB_Handel_Perfil) != 0 && 
                                                                        <td> 
                                                                            {valor === 3 && modificarDescuento === '1' ? (
                                                                                <input
                                                                                    type="number"
                                                                                    className=" form-control validarCant cantBlur btn-outline-secondary"
                                                                                    disabled={seller.U_FMB_Handel_Desc === '0' ? true : false}
                                                                                    style={{
                                                                                        backgroundColor: seller.U_FMB_Handel_Desc === '0' ? '#ededed' : 'transparent',
                                                                                        borderColor: '#ced4da',
                                                                                        color: '#000',
                                                                                        paddingTop: 1,
                                                                                        paddingBottom: 2,
                                                                                        maxWidth: '100%',
                                                                                        textAlign: "center",
                                                                                    }}
                                                                                    id={'itemDiscount' + index}
                                                                                    value={item.Discount}
                                                                                    onChange={event => this.changeDiscountItem(event, index)}
                                                                                />): 
                                                                                <label>{item.Discount} %</label> 
                                                                            }
                                                                        </td>
                                                                        }
                                                                        <td>
                                                                            <CurrencyFormat 
                                                                                // value={item.PriceDiscount * parseInt(item.Quantity)} 
                                                                                value={((item.Price - (item.Price * (item.Discount || 0 / 100) / 100)))} 
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
                                                                        {valor === 3 && modificarPrecio === '1' ? ( 
                                                                                <input
                                                                                    type="number"
                                                                                    className=" form-control validarCant cantBlur btn-outline-secondary"
                                                                                    disabled={seller.U_FMB_Handel_Precio === '0' ? true : false}
                                                                                    style={{
                                                                                        backgroundColor: seller.U_FMB_Handel_Precio === '0' ? '#ededed' : 'transparent',
                                                                                        borderColor: '#ced4da',
                                                                                        color: '#000',
                                                                                        paddingTop: 1,
                                                                                        paddingBottom: 2,
                                                                                        maxWidth: '100%',
                                                                                        textAlign: "center",
                                                                                    }}
                                                                                    id={'itemNewTotal' + index}
                                                                                    value={item.newTotal}
                                                                                    onChange={event => this.changeTotalItem(index, item, event)}
                                                                                />
                                                                            )
                                                                            :
                                                                            <CurrencyFormat 
                                                                                // value={item.PriceDiscount * parseInt(item.Quantity)} 
                                                                                value={item.newTotal} 
                                                                                displayType={'text'} 
                                                                                thousandSeparator={true} 
                                                                                fixedDecimalScale={true} 
                                                                                decimalScale={2} 
                                                                                prefix={'$ '}
                                                                                suffix={config.general.currency}
                                                                                >
                                                                            </CurrencyFormat>   
                                                                        }
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
                                                <div className="col-md-3">
                                                    Código
                                                </div>
                                                <div className="col-md-3">
                                                    Cantidad
                                                </div>
                                                <div className="col-md-3">
                                                    Precio
                                                </div>
                                                <div className="col-md-3">
                                                    Precio total
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    {item.ItemCode}
                                                </div>
                                                <div className="col-md-3">
                                                    {parseInt(item.Quantity)}
                                                </div>
                                                <div className="col-md-3">
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
                                                </div>
                                                <div className="col-md-3">
                                                    <CurrencyFormat 
                                                        value={item.Price * parseInt(item.Quantity)} 
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        fixedDecimalScale={true} 
                                                        decimalScale={2} 
                                                        prefix={'$ '}
                                                        suffix={config.general.currency}
                                                        >
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
                            {order.body.length > 0 && 
                            <ExportReportPDF 
                                date={date} 
                                data={order.body} 
                                user={user} 
                                SubTotal={SubTotal}
                                seller={seller}
                                currentCart={currentCart}
                            />
                            }    
                            <button
                                onClick={()=>this.exportCSVOrders()}
                                className="btn btn-outline-success botonResumen" 
                                style={{
                                    backgroundColor: 'green',
                                    color: 'white',
                                    fontWeight: "bold",
                                }}>
                                Exportar a Excel <i class="fa fa-file-excel-o" aria-hidden="true"></i>
                            </button>            
                            <button type="button" className="btn text-white" style={{background: "#86C03F"}} onClick={()=> this.addToShopingCart()}>
                                <i className="fas fa-cart-plus"/>
                                &nbsp; Agregar al carrito
                            </button>
                            {
                                valor === 3 && (modificarPrecio === '1' || modificarDescuento === '1') ?
                                <button type="button" className="btn text-white" style={{background: "#86C03F"}} onClick={()=> this.UpdateCart()}>
                                    <i className="fas fa-edit"/>
                                    &nbsp; Modificar
                                </button>
                                : ''
                            }
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
        sessionReducer: store.SessionReducer,
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
)(SaveDetailModel);
