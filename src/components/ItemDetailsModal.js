import React, { Component } from 'react';
import { DISPATCH_ID, config, VIEW_NAME } from '../libs/utils/Const';
import { connect } from 'react-redux';
import { ApiClient } from "../libs/apiClient/ApiClient";
import { Modal } from './index';
import { Carousel } from '../components';
import CurrencyFormat from 'react-currency-format';

// import CursorZoom from 'react-cursor-zoom';


let modal = new Modal();
let apiClient = ApiClient.getInstance();

class ItemDetailsModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            images: [],
        };
    }
    
    changeQuantity = (item, event) => {
        const {itemsReducer : {deleteShoppingCart, addShoppingCart}, notificationReducer: {showAlert}} = this.props;
            let newQuantity =  event.nativeEvent.target.value;
            let onHand = item.OnHand;
            if(Number(newQuantity) > Number(onHand)) {
                if (Number(onHand) !== 0 ) {
                    showAlert({type: 'warning', message: "Se excede el número de articulos disponibles de este producto", timeOut: 8000});
                }
                newQuantity = onHand;
            }
            if(!newQuantity){
                deleteShoppingCart({item, deleteAll: false});
            }else{
                addShoppingCart({item, quantity: (newQuantity || '1')})
            }
    };
    
    changLocalQuantity = (item, event)=>{
        const {shoppingCartReducer: {items},itemsReducer: {items: itemDetails}} = this.props;
        let newQuantity =  event.nativeEvent.target.value;
        item.quantity = newQuantity;
        this.applyFilters(item);
    }
        
    applyFilters = data => {
        const {setItemDetailsSearch} = this.props;
        setItemDetailsSearch(data);
    };   

    changeBackOrder= (item, addItem) => {
        const {itemsReducer : {deleteBackOrder, addBackOrder}} = this.props;
        if(addItem){
            addBackOrder({item, quantity: 1})
        }else{
            deleteBackOrder({item, deleteAll: false});
        }
    };

    render() {
        const {itemsReducer: {itemDetails, deleteShoppingCart}, view} = this.props;
        itemDetails.files = itemDetails.files || [];
        return (
            <div className="modal fade" id="itemDetails" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ border: "none", textAlign: "center" }}>
                <div className="modal-dialog" role="document" style={{ maxWidth: "75%", margin: "40px auto" }}>
                    <div className="modal-content">
                        <div className="modal-header" style={{ backgroundColor: config.navBar.iconColor }}>
                            <h5 className="modal-title text-center" style={{ color: config.navBar.textColor2 }}>Detalle</h5>
                            <button type="button" style={{ color: config.navBar.textColor2 }} className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body bg3 row " style={{ backgroundColor: "rgba(248,249,250,0.6)", margin: 0, marginBottom: 20, padding: 0 }}>
                            <div className="col-12 col-lg-6">
                                <div className="row">
                                    <div className="geeks" style={{ margin: 0, padding: 0 }}>
                                        {/* <img  src="https://bytelesen.com/wp-content/uploads/logitech-g-703-lightspeed-kabellose-gaming-maus-1.jpg"></img> */}
                                         /*<Carousel images={itemDetails.images || []} itemCode={itemDetails.ItemCode} />*/
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6 text-left" style={{ color: "rgb(124, 124, 125)", marginTop: 20 }}>
                                <div>
                                    <h4>
                                        <a className="font-weight-bold">
                                            {itemDetails.ItemName}
                                        </a>
                                    </h4>
                                    {itemDetails.U_NomSud &&
                                        <div>
                                            <a className="font-italic">
                                                <b>NOM SUD : </b> {itemDetails.U_NomSud}
                                            </a>
                                        </div>
                                    }

                                    <a className="font-italic">
                                        {itemDetails.ItemCode}
                                    </a>
                                    <h6 className="card-subtitle font-weight-bold text-left" style={{ fontSize: 20, color: config.itemsList.textPrice }}>
                                        {itemDetails.U_web === 0 || itemDetails.U_web === null
                                            ? "Solicite su cotización"
                                            : <CurrencyFormat
                                                value={itemDetails.Price}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                fixedDecimalScale={true}
                                                decimalScale={2}
                                                prefix={'$ '}
                                                suffix={config.general.currency}
                                                >
                                            </CurrencyFormat>
                                        }
                                        {itemDetails.U_web === 1 &&
                                            " " + itemDetails.currency
                                        }
                                    </h6>


                                </div>
                                <div>
                                    <div>
                                        <a className="text-uppercase font-weight-bold">Descripción: </a>
                                    </div>
                                    {/* <textarea id="itemDescription" style={{ marginBottom: 15, border: 'none', width: '100%', height: '300px' }} disabled={true} value={itemDetails.UserText ? itemDetails.UserText : 'No hay descripción para este producto'}>
                                    
                                    </textarea> */}

                                    <div id="Layer1" style={{ marginBottom: 15, border: "none", width: "100%", height: "300px", overflow: "scroll" }}>

                                        {itemDetails.UserText &&
                                            <div>
                                                <a className="font-italic">
                                                    {itemDetails.UserText}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_FMB_Handel_Marca &&
                                            <div>
                                                <a className="font-italic">
                                                    <b> HANDEL MARCA : </b> {itemDetails.U_FMB_Handel_Marca}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_FMB_Handel_Apara &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>HANDEL APARA : </b> {itemDetails.U_FMB_Handel_Apara}
                                                </a>
                                                <br />
                                            </div>
                                        }
                                        {itemDetails.U_FMB_Handel_Refa &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>HANDEL REFA : </b> {itemDetails.U_FMB_Handel_Refa}
                                                </a>
                                                <br />
                                            </div>
                                        }
                                        {itemDetails.U_FMB_Handel_Fabrica &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>HANDEL FABRICA : </b> {itemDetails.U_FMB_Handel_Fabrica}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_Handel_Slogan &&
                                            <div>
                                                <a className="font-italic">
                                                    <b> SLOGAN : </b> {itemDetails.U_Handel_Slogan}
                                                </a>
                                                <br />
                                            </div>
                                        }
                                        {itemDetails.SVolume &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>  VOLUMEN : </b> {itemDetails.SVolume}
                                                </a>
                                                <br />
                                            </div>
                                        }
                                        {itemDetails.SLength1 &&
                                            <div>
                                                <a className="font-italic">
                                                    <b> LARGO : </b> {itemDetails.SLength1}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_SKU &&
                                            <div>
                                                <a className="font-italic">
                                                    <b> SKU : </b> {itemDetails.U_SKU}
                                                </a>
                                            </div>
                                        }
                                        {itemDetails.U_NoParte &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>  NO PARTE : </b> {itemDetails.U_NoParte}
                                                </a>
                                                <br />
                                            </div>
                                        }


                                        {itemDetails.U_FMB_Handel_Images &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>  FMB HANDEL IMAGES : </b> {itemDetails.U_FMB_Handel_Images}
                                                </a>
                                                < br />
                                            </div>
                                        }

                                        {itemDetails.U_COLOR &&
                                            <div>
                                                <a className="font-italic">
                                                    <b> COLOR : </b> {itemDetails.U_COLOR}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_video &&
                                            <div>
                                                <a className="font-italic">
                                                    <b> VIDEO : </b> {itemDetails.U_video}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_version &&
                                            <div>
                                                <a className="font-italic">
                                                    <b> VERSION : </b> {itemDetails.U_version}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_Voltaje &&
                                            <div>
                                                <a className="font-italic">
                                                    <b> VOLTAJE :</b> {itemDetails.U_Voltaje}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_Amperaje &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>  Amperaje :</b> {itemDetails.U_Amperaje}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_Watts &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>   Watts :</b> {itemDetails.U_Watts}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_Herts &&
                                            <div>
                                                <a className="font-italic">
                                                    <b> HERTS : </b> {itemDetails.U_Herts}
                                                </a>
                                                <br />
                                            </div>
                                        }
                                        {itemDetails.U_Hp &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>   HP :</b> {itemDetails.U_Hp}
                                                </a>
                                                <br />
                                            </div>
                                        }
                                        {itemDetails.U_Rpm &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>   RPM :</b> {itemDetails.U_Rpm}
                                                </a>
                                                <br />
                                            </div>
                                        }
                                        {itemDetails.U_Fases &&
                                            <div>
                                                <a className="font-italic">
                                                    <b> FASES :</b> {itemDetails.U_Fases}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_GasRefri &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>  GAS REFRI : </b>  {itemDetails.U_GasRefri}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_dificultad &&
                                            <div>
                                                <a className="font-italic">
                                                    <b> DIFICULTAD :</b>  {itemDetails.U_dificultad}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_Alternos &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>  ALTERNOS : </b>  {itemDetails.U_Alternos}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_alterno &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>alterno :</b>  {itemDetails.U_alterno}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_alterno_Act &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>   ALTERNOS act : </b>  {itemDetails.U_alterno_Act}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_Aux1 &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>  AUX 1 :</b> {itemDetails.U_Aux1}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_Aux2 &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>    AUX 2 :</b> {itemDetails.U_Aux2}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_Aux3 &&
                                            <div>
                                                <a className="font-italic">
                                                    <b> AUX 3 :</b> {itemDetails.U_Aux3}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_Aux4 &&
                                            <div>
                                                <a className="font-italic">
                                                    <b> AUX 4 :</b> {itemDetails.U_Aux4}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_modelos &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>    MODELOS : </b> {itemDetails.U_modelos}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_material &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>  MATERIALES : </b> {itemDetails.U_material}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {itemDetails.U_FMB_Handel_Promo &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>  HANDEL PROMO :</b> {itemDetails.U_FMB_Handel_Promo}
                                                </a>
                                                <br />
                                            </div>
                                        }
                                        {/* {itemDetails.U_FMB_Handel_Nuevo &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>   HANDEL NUEVO : </b> {itemDetails.U_FMB_Handel_Nuevo}
                                                </a>
                                                <br />
                                            </div>
                                        } */}
                                        {/* {itemDetails.U_FMB_Handel_Falta &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>  HANDEL FALTA : </b> {itemDetails.U_FMB_Handel_Falta}
                                                </a>
                                                <br />
                                            </div>
                                        } */}
                                        {itemDetails.U_FMB_Handel_Remate &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>  HANDEL REMATE :</b> {itemDetails.U_FMB_Handel_Remate}
                                                </a>
                                                <br />
                                            </div>
                                        }
                                        {itemDetails.SWidth1 &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>   ANCHO :</b> {itemDetails.SWidth1}
                                                </a>
                                                <br />
                                            </div>
                                        }
                                        {itemDetails.SHeight1 &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>  ALTURA :</b> {itemDetails.SHeight1}
                                                </a>
                                                <br />
                                            </div>
                                        }
                                        {itemDetails.SWeight1 &&
                                            <div>
                                                <a className="font-italic">
                                                    <b>  PESO :</b> {itemDetails.SWeight1}
                                                </a>
                                                <br />
                                            </div>
                                        }
                                        {itemDetails.U_sustitutos &&
                                            <div>
                                                <a className="font-italic">
                                                    <b> SUSTITUTOS :</b> {itemDetails.U_sustitutos}
                                                </a>
                                                <br />
                                            </div>
                                        }

                                        {
                                            itemDetails.U_Handel_Forma !== null &&
                                            <a className="font-italic">
                                                {itemDetails.U_Handel_Forma}
                                            </a>
                                        }

                                    </div>



                                    <div className="text-right" style={{ padding: 0, marginBottom: 10 }}>
                                        {itemDetails.files.map(file => {
                                            return <a key={file} href={file.path} target="_blank" >
                                                <i className={config.icons.datasheet} style={{ color: 'red', paddingRight: 5 }}></i>
                                                <span style={{ color: config.footer.iconColor }}>Ficha técnica</span>
                                            </a>
                                        })}
                                    </div>

                                    {view !== VIEW_NAME.BACK_ORDER_VIEW && <div style={{ textAlign: "center" }}>
                                        <div className="row text-center" style={{ margin: "auto", padding: 0, width: "80%" }}>
                                            {itemDetails.U_web === 0 || itemDetails.U_web === null
                                                ? <div className="col-12" style={{ padding: 0 }}>
                                                    <label style={{ textAlign: "center", marginTop: 12, fontSize: 16 }}>Llámenos o envíe un correo para cotización</label>
                                                </div>
                                                : <div className="col-10">
                                                    <input
                                                        // disabled={!(!!itemDetails.OnHand)}
                                                        disabled={itemDetails.OnHand >=1 ? false : itemDetails.OnHand === '0.0' ? true : true}
                                                        id={'input-quantity-details-' + itemDetails.ItemCode}
                                                        type="number"
                                                        min="1"
                                                        className="form-control"
                                                        name={'quantity' + itemDetails.ItemCode}
                                                        placeholder="Cantidad"
                                                        value={itemDetails.quantity ? Number(itemDetails.quantity) : ''}
                                                        style={{ textAlign: "center", marginTop: 8 }}
                                                        onChange={(event) => {this.changLocalQuantity(itemDetails, event)}}
                                                    />
                                                </div>
                                            }
                                            {itemDetails.U_web === 1 &&
                                                <div className="col-2" style={{ color: "red", fontSize: 30, padding: 0 }}>
                                                    {itemDetails.quantity && <i className="fa fa-trash" style={{ cursor: "pointer" }} onClick={() => deleteShoppingCart({ item: itemDetails, deleteAll: false })} />}
                                                </div>
                                            }
                                        </div>
                                        {itemDetails.U_web === 0 || itemDetails.U_web === null ?
                                            <div><br/></div>:
                                            <div className="col-10 text-center pt-2" style={{marginLeft: "auto", marginRight: "auto"}}>
                                                <button type="button" disabled={itemDetails.OnHand >=1 ? false : itemDetails.OnHand === '0.0' ? true : true} className="btn btn-success btn-block" value={(itemDetails.quantity ? Number(itemDetails.quantity): '1')} onClick={(event)=>{this.changeQuantity(itemDetails, event)}}>
                                                    <i className={config.icons.add}/>&nbsp; Agregar al carrito
                                                </button>
                                            </div>
                                        }
                                        {itemDetails.U_web === 1 &&
                                            itemDetails.wishlist === 1 &&
                                            <div className="row text-center" style={{ margin: "auto", padding: 0, width: "80%" }}>
                                                <div className="col-8">
                                                    <label style={{ textAlign: "center", marginTop: 12 }}>Lista de deseos</label>
                                                </div>
                                                <div className="col-2" style={{ color: "rgb(13, 98, 168)", fontSize: 30, padding: 0 }}>
                                                    {itemDetails.backOrder ?
                                                        <i className="fa fa-minus" style={{ cursor: "pointer", marginLeft: 7 }} onClick={() => this.changeBackOrder(itemDetails, false)} /> :
                                                        <i className="fa fa-plus" style={{ cursor: "pointer", marginLeft: 7 }} onClick={() => this.changeBackOrder(itemDetails, true)} />
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </div>}
                                </div>
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
        shoppingCartReducer: store.ShoppingCartReducer
    };
};

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
)(ItemDetailsModal);
