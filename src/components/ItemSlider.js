import React, { Component } from 'react';
import { config, SERVICE_API, VIEW_NAME, DISPATCH_ID} from '../libs/utils/Const';
import {connect} from "react-redux";
import {ItemDetailsModal, Carousel708} from "./index";
import CurrencyFormat from 'react-currency-format';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './ItemSlider.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import moment from 'moment';
import { nodeName } from 'jquery';
import 'semantic-ui-css/semantic.min.css'
import { Header, Button, Popup, Label  } from 'semantic-ui-react'

// definir las variables responsivas para el carrusel
const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1920 },
        items: 6,
        partialVisibilityGutter: 80 // this is needed to tell the amount of px that should be visible.
    },
    desktop2: {
        breakpoint: { max: 1920, min: 1200 },
        items: 5,
        partialVisibilityGutter: 0 // this is needed to tell the amount of px that should be visible.
    },
    tablet: {
      breakpoint: { max: 1200, min: 992 },
      items: 4,
      partialVisibilityGutter: 30 // this is needed to tell the amount of px that should be visible.
    },
    tablet1: {
      breakpoint: { max: 992, min: 767 },
      items: 3,
      partialVisibilityGutter: 30 // this is needed to tell the amount of px that should be visible.
    },
    tablet2: {
        breakpoint: { max: 767, min: 464 },
        items: 2,
        partialVisibilityGutter: 30 // this is needed to tell the amount of px that should be visible.
      },
    mobile: {
      breakpoint: { max: 463, min: 0 },
      items: 2,
      partialVisibilityGutter: 30 // this is needed to tell the amount of px that should be visible.
    }
}

class ItemSlider extends Component {

    constructor(props){
        super(props);
        this.state = {
            seller: JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser')),
        };
        this.mouseOverAddCart = this.mouseOverAddCart.bind(this);
        this.mouseOutAddCart = this.mouseOutAddCart.bind(this);
        this.iconMouse = [];     
        this.iconMouseOver = []; 
    }

    changeQuantity = (index, item, event) =>{
        const {changeQuantity, notificationReducer: {showAlert},itemsReducer: {relatedItems: itemsSearch}, relatedItems} = this.props; 
        let newQuantity;
        relatedItems.map( itemFilter => {
            if (itemFilter.ItemCode === item.ItemCode) {
                newQuantity = itemFilter.quantity || '1';
            }
        });

        let piv1 = 0;
        let piv2 = 0;
        let flag = true;
        let message = '';
        if(item.U_MultiploVenta !== null && item.U_MultiploVenta !== 0){
            let multiplo = parseInt(newQuantity) % item.U_MultiploVenta;
            if(multiplo == 0){
                flag = true;
            }else{
                //Calcular el multiplo mas cercano para la cantidad del input
                const beforeMultiploCercano = parseInt(newQuantity)
                const multiploCercano = Math.ceil(parseInt(newQuantity) / item.U_MultiploVenta) * item.U_MultiploVenta;
                newQuantity = multiploCercano.toString();
                message = 'Al artículo ' +item.SuppCatNum + ' se agregaron ' + (newQuantity -beforeMultiploCercano) + ' unidades para poder agregarlo al carrito';
                flag = false;
                /*piv1 = parseInt(newQuantity);
                piv2 = parseInt(newQuantity);

                while (piv1 % item.U_MultiploVenta !== 0) {
                    piv1++;                        
                }
                let result1 = piv1 - parseInt(newQuantity);

                while (piv2 % item.U_MultiploVenta !== 0) {
                    piv2--;                        
                }
                let result2 = piv2 - parseInt(newQuantity);
                message = 'Al artículo le faltan '+result1+' unidades';
                flag = false;*/
            }
        }

        if(item.U_MultiploVenta !== null && item.U_MultiploVenta !== 'null' && item.U_MultiploVenta !== undefined && item.U_MultiploVenta !== 'undefined' && item.U_MultiploVenta > 1 && item.U_MultiploVenta !== parseInt(newQuantity)){
            if(flag === false) showAlert({type: 'warning', message: item.U_MultiploVenta <= parseInt(newQuantity) ? message : "La cantidad ingresada debe ser un múltiplo de "+ item.U_MultiploVenta , timeOut: 8000});
        }
        
        // let onHand = item.OnHand;   
        // if(newQuantity > onHand) {
        //     newQuantity = onHand;
        // }   
        // if(!newQuantity){
        //     changeQuantity(index,item, newQuantity, false); //delete
        // }else{
        changeQuantity(index,item, newQuantity, true); // add
        //     showAlert({type: 'warning', message: "Se excede el número de articulos disponibles de este producto", timeOut: 2500});
        // }        
    };

    changLocalQuantity = (index, item, event, opcion='')=>{
        const {relatedItems} = this.props;
        let newQuantity = item.U_MultiploVenta;
        const multiplo = item.U_MultiploVenta? item.U_MultiploVenta:1
        switch (opcion) {
            case '+':
                if (item.quantity % multiplo !== 0) {
                    newQuantity = multiplo
                } else {
                    newQuantity = (Number(event.nativeEvent.target.value) + multiplo) <= 0 ? multiplo : Number(event.nativeEvent.target.value) + multiplo;
                } break;

            case '-':
                if (item.quantity % multiplo !== 0) {
                    newQuantity = multiplo
                } else {
                    newQuantity = (Number(event.nativeEvent.target.value) - multiplo) <= 0 ? multiplo : Number(event.nativeEvent.target.value) - multiplo;
                } break;

            default:
                newQuantity = Number(event.nativeEvent.target.value) <= 0 ? multiplo : Number(event.nativeEvent.target.value);
                break;
        }
        
        relatedItems.map( itemFilter => {
            if (itemFilter.ItemCode === item.ItemCode) {
                itemFilter.quantity = newQuantity;
            }
        });
        this.applyFilters(relatedItems);
    }

    // No aplica
    changeBackOrder= (item, addItem) => {
        const {itemsReducer : {deleteBackOrder, addBackOrder}} = this.props;
        if(addItem){
            addBackOrder({item, quantity: 1})
        }else{
            deleteBackOrder({item, deleteAll: false});
        }
    };
    
    applyFilters = data => {
        const {setItemsFilterSearch2} = this.props;
        setItemsFilterSearch2(data);
    };

    mouseOverAddCart = (index, flag, event)=>{
        if(this.iconMouse && this.iconMouse.length > 0  && false ){
            this.iconMouse[index].style.display = "none";
            this.iconMouseOver[index].style.display = "block";
        }
    }

    mouseOutAddCart = (index, flag, event)=>{
        if(flag == 'green'){
            event.currentTarget.style.backgroundColor = "#89c33f";
            event.currentTarget.className = "btn btn-block botonAgregar"
        } else if(flag == 'yellow'){
            event.currentTarget.style.backgroundColor = "#efc964";
            event.currentTarget.className = "btn btn-block botonAgregarYellow"
        } else {
            event.currentTarget.style.backgroundColor = "#e27753";
            event.currentTarget.className = "btn btn-block botonAgregarAgotado"
        }
        // Íconos
        if(this.iconMouse && this.iconMouse.length > 0){
            this.iconMouse[index].style.display = "block";
            this.iconMouseOver[index].style.display = "none";
        }
    }

    render() {
        const {relatedItems,itemsReducer : {searchItemsFilter, updateFavorite, deleteShoppingCart, openItemDetails }, dashboard, changeBackOrder } = this.props;
        const { seller} = this.state;
        let valor = seller ? seller.U_FMB_Handel_Perfil : '0';
        let x = window.matchMedia("(max-width: 50px)") 
        return (
            <div>
                <ItemDetailsModal view={VIEW_NAME.ITEMS_VIEW}/>
                <div className="" style={{}}>
                    {false? 
                        <Carousel autoPlay partialVisible={false} responsive={responsive} autoPlaySpeed={5000} infinite ={true} removeArrowOnDeviceType={["tablet", "mobile","tablet1","tablet2"]} >                        
                            {relatedItems && relatedItems.map((item, index) => {
                                item.ItemName = item.ItemName || '';
                                let dashboardForTwoSliders = dashboard ? dashboard : '';
                                let imagesArray = item.U_Handel_ImagesArray || '';
                                imagesArray = imagesArray.split('|');
                                let imagenShow = imagesArray[0] ? (config.BASE_URL + SERVICE_API.getImage + '/' + imagesArray[0]) : require('../images/noImage.png');

                                return (
                                    <div id="ItemsSlider" style={{ display:"flex", justifyContent:"center", maxWidth:"18rem", maxHeight:"28rem",textAlign:"center",position:"relative",paddingLeft:"1rem",paddingRight:"1rem", paddingBottom:'1rem'}} key={index}>
                                        <div className="item card" style={{ position:"relative",width: "380px", marginTop:"4px", minHeight:"303.41px", padding:"1rem", backgroundColor: config.itemsList.backgroundColor, border:"solid !important"}}>
                                            <div className="imageCard">
                                                <div style={{display: (!item.U_FMB_Handel_Promo || item.U_FMB_Handel_Promo === '' || item.U_FMB_Handel_Promo == 0 ? 'none' : 'table'), position:"relative"}}>
                                                    <div className="font-weight-bold ribbon" style={{position: "absolute"}} onClick={() => openItemDetails(item) }>
                                                        <span>
                                                            <blink>PROMOCIÓN</blink>
                                                        </span>
                                                    </div>
                                                </div>
                                                <img
                                                    onClick={() => openItemDetails(item)}
                                                    className="card-img-top cardImg"
                                                    // style={{
                                                    //     width: "270px",
                                                    //     height: "270px",
                                                    //     backgroundColor: "white",
                                                    //     cursor: "pointer",
                                                    //     marginRight: "auto",
                                                    //     marginLeft: "auto",
                                                    // }}
                                                    src={imagenShow}
                                                    alt="Imagen del articulo"
                                                />
                                                
                                                <div className="card-body" id={'idCardBody'+index} style={{height: "fit-content",margin: 0, padding: "2px",minHeight: "180px", color: config.itemsList.textColor/*margin: 0, padding: 0, color: config.itemsList.textColor*/}}>
                                                    <div>
                                                        {/* CAmbio en le tamaño de fuente del precio */}
                                                        <p className="card-subtitle text-left" style={{ /*fontSize: 36*/ fontSize:15, color: config.itemsList.textPrice2 }}>
                                                            {item.U_web === 0 || item.U_web === null
                                                                ? "Solicite su cotización"
                                                                : (valor == '0' || !item.U_FMB_Handel_Promo || item.U_FMB_Handel_Promo === '' || item.U_FMB_Handel_Promo == 0 || item.DiscountPercentSpecial == 0 ? 
                                                                    <CurrencyFormat
                                                                        value={item.Price}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        fixedDecimalScale={true}
                                                                        decimalScale={2}
                                                                        prefix={'$'}>
                                                                    </CurrencyFormat>
                                                                    : <>
                                                                        <div style={{textAlign:'right'}}>
                                                                            <span className="card-subtitle text-left precioPromocion" style={{fontSize:12, marginRight:10 }} >
                                                                                <CurrencyFormat
                                                                                    value={item.PriceBeforeDiscount}
                                                                                    displayType={'text'}
                                                                                    thousandSeparator={true}
                                                                                    fixedDecimalScale={true}
                                                                                    decimalScale={2}
                                                                                    prefix={'$'}>
                                                                                </CurrencyFormat>
                                                                            </span>
                                                                            {seller ? seller.U_FMB_Handel_Perfil != '0' && item.DiscountPercentSpecial !== 0 ? 
                                                                                    <span style={{fontSize:10 }} className = "text-danger">{parseFloat(item.DiscountPercentSpecial).toFixed(2)}% OFF</span>
                                                                                : "" : ""
                                                                            }
                                                                        </div>
                                                                        <span className="card-subtitle text-left  precioPromocionItemList">
                                                                            <div className="pricePromoItemSlider" style = {{fontSize: 15, fontWeight: 'bolder'}}>
                                                                                <CurrencyFormat
                                                                                    value={item.Price}
                                                                                    displayType={'text'}
                                                                                    thousandSeparator={true}
                                                                                    fixedDecimalScale={true}
                                                                                    decimalScale={2}
                                                                                    prefix={'$'}>
                                                                                </CurrencyFormat>
                                                                            </div>
                                                                        </span>
                                                                    </>
                                                                )
                                                            }
                                                            {item.U_web === 1 &&
                                                                " " //+ item.currency
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-12">
                                                            {/* cambio de tamaño y padding del cod. fabricante */}
                                                            <p className="text-left" style={{fontSize:11, padding:1,marginLeft: -4/*,fontSize: 18, paddingBottom: 0, marginBottom: 0,*/}}>
                                                                <span style={{color:"#AFAFAF"}}>{item.SuppCatNum !== null ? 'Cód. Fabricante ' : 'SKU '}</span>
                                                                <span className="font-weight-bold" style={{color: "#0078C0"}}>{item.SuppCatNum !== null ? item.SuppCatNum : item.ItemCode}</span>
                                                            </p>
                                                        </div>
                                                        <div className="col-3" style={{ padding: 0, margin: 0, }}>
                                                            <div onClick={() => updateFavorite(item)} style={{ padding: 0 }}>                                                            
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="overflow-auto ItemName">
                                                        <p className="card-title text-left" style={{ marginLeft: 1,maxWidth: "100%", fontSize: 12, color:"#4e4e4e"}}>
                                                            {/* {item.ItemName ? (item.ItemName).length > 32 ? 
                                                            (item.ItemName).substring(0, 31) + " ... ": item.ItemName : " "} */}
                                                            {item.ItemName ? 
                                                                (item.ItemName).length > 32 ? 
                                                                <div>
                                                                    <span >{(item.ItemName).substring(0, 31)}</span>
                                                                    <Popup trigger={<Label className='ItemName' style ={{color: '#AFAFAF', backgroundColor: 'white', fontSize: 'small', display:!x.matches ? 'inline-block' : 'none', fontSize: 11, padding:'0px 0px 0px 1px'}}>ver más...</Label >} flowing hoverable position='top center'>
                                                                        {/* <Popup.Header> <div className="card-header text-white" style={{backgroundColor: 'red'}}>Lotes seleccionados</div></Popup.Header> */}
                                                                        <Popup.Content style={{width:150, overflow:'auto'}}>
                                                                            <span className='ItemName'>{item.ItemName}</span>
                                                                        </Popup.Content>
                                                                    </Popup>
                                                                </div>
                                                                : item.ItemName 
                                                            : " "}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className=" card-title text-left" style={{fontSize:13, padding:1 /*marginLeft: 2,fontSize: 18, paddingBottom: 0, marginBottom: 0,*/}}>
                                                            <span style={{color:"#AFAFAF"}}>Stock: </span>
                                                            <span className="font-weight-bold" style={{color: "#0078C0"}}>{item.OnHand != null ? item.OnHand : 'Sin stock'}</span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="card-title text-left" style={{fontSize:13, padding:1 /*marginLeft: 2,fontSize: 18, paddingBottom: 0, marginBottom: 0,*/}}>
                                                            <span style={{color:"#AFAFAF"}}>Min. venta: </span>
                                                            <span className="font-weight-bold" style={{color: "#0078C0"}}>{item.U_MultiploVenta != null ? item.U_MultiploVenta : '1'}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* CAmbio del margen del card footer */}
                                            <div className="card-footer" style={{padding:0, border:"none" /*marginTop:5 borderTop: "transparent"*/}}>
                                                <div className="row text-center" style={{margin: 0, padding: 0}}>
                                                    {item.U_web === 0 || item.U_web === null ? 
                                                    <div className="col-12" style={{padding:0}}>
                                                            <label style={{textAlign: "center", fontSize: 16}}>Llámenos o envíe un correo</label>
                                                        </div> :
                                                        <div className="col-3 cantidad" style={{padding:0}}>
                                                            {item.Unidades === "Unidades" ? 
                                                                <input
                                                                    // disabled={!(!!item.OnHandPrincipal)}
                                                                    id={'input-quantity-' + dashboard.toString() + item.ItemCode + index}
                                                                    type="number"
                                                                    min="1"
                                                                    value={item.quantity ? Number(item.quantity).toFixed(0) : ''}
                                                                    className="form-control"
                                                                    name={'quantity' + item.ItemCode}
                                                                    placeholder="1"
                                                                    style={{textAlign: "left", marginTop: 1, height: 38.5}}
                                                                    onChange={(event) => {this.changLocalQuantity(dashboard.toString() + index, item, event)}}
                                                                    //onKeyDown={event => event.keyCode == 13 && this.addShoppingCart(item, 'input-quantity-' + item.ItemCode + index)}
                                                                />
                                                                :<input
                                                                    // disabled={!(!!item.OnHandPrincipal)}
                                                                    id={'input-quantity-' + dashboard.toString() + item.ItemCode + index}
                                                                    type="number"
                                                                    min="1"
                                                                    value={item.quantity ? item.quantity : ''}
                                                                    className="form-control"
                                                                    name={'quantity' + item.ItemCode}
                                                                    placeholder="1"
                                                                    style={{textAlign: "left", height: 38.5,width:"117%",fontSize:"84%"}}
                                                                    onChange={(event) => {this.changLocalQuantity(dashboard.toString() + index, item, event)}}
                                                                    //onKeyDown={event => event.keyCode == 13 && this.addShoppingCart(item, 'input-quantity-' + item.ItemCode + index)}
                                                                />
                                                            }
                                                        </div>
                                                    }
                                                    {item.U_web === 0 || item.U_web === null ? 
                                                        <div><label style={{textAlign: "center", fontSize: 16}}>Para cotización</label></div>: 
                                                        <div className="col-6 botonAgregar">
                                                            <button style={{textAlign: "center",marginLeft:"4px" }} 
                                                                type="button" 
                                                                readOnly = {item.OnHandPrincipal === 0 || item.OnHandPrincipal === '' ? true : false}
                                                                className= {item.flag === 'green' ? "btn btn-block botonAgregar": "btn btn-block botonAgregarYellow" }  
                                                                // className= {item.OnHandPrincipal === 0 ? "btn btn-block botonAgregarAgotado" : item.flag === 'green' ? "btn btn-block botonAgregar": "btn btn-block botonAgregarYellow"}  
                                                                value={(item.quantity ? Number(item.quantity): 1)} 
                                                                onClick={(event)=>{this.changeQuantity(index, item, event)}} 
                                                                onMouseOver={(event)=>{this.mouseOverAddCart(dashboardForTwoSliders.toString() +index, item.flag, event)}} 
                                                                onMouseOut={(event)=>{this.mouseOutAddCart(dashboardForTwoSliders.toString() +index, item.flag, event)}}
                                                            >
                                                            </button>
                                                        </div>
                                                    }
                                                    {((item.U_web !== 0 && item.U_web !== null) && (item.OnHandPrincipal == 0 || item.OnHandPrincipal == '')) &&
                                                            <div className="icoCarrito col-3 text-center align-middle" style={{fontSize: 33,padding:0, textAlign: "right",alignSelf:"center"}}>
                                                                <img ref={iconMouse => this.iconMouse[dashboardForTwoSliders.toString() +index] = iconMouse} src={config.shoppingCartIcons.carritoAgotado} style={{display: "block", color: "red", cursor: "pointer"}}/>
                                                                <img ref={iconMouseOver => this.iconMouseOver[dashboardForTwoSliders.toString() +index] = iconMouseOver} src={config.shoppingCartIcons.camionAgotado} style={{display: "none", color: "red", cursor: "pointer"}}/>
                                                            </div>
                                                    }
                                                    {((item.U_web !== 0 && item.U_web !== null) && item.OnHandPrincipal > 0 && (item.flag === 'green' || item.flag === 'yellow')) &&
                                                            <div className="icoCarrito col-3 text-center align-middle" style={{fontSize: 33,padding:0, textAlign: "right",alignSelf:"center"}}>
                                                                <img ref={iconMouse => this.iconMouse[dashboardForTwoSliders.toString() +index] = iconMouse} src={item.flag === 'green' ? config.shoppingCartIcons.carritoVerde : config.shoppingCartIcons.carritoAmarillo} style={{display: "block", cursor: "pointer"}}/>
                                                                <img ref={iconMouseOver => this.iconMouseOver[dashboardForTwoSliders.toString() +index] = iconMouseOver} src={item.flag === 'green' ? config.shoppingCartIcons.camionVerde : config.shoppingCartIcons.camionAmarillo} style={{display: "none", cursor: "pointer"}}/>
                                                            </div>
                                                    }
                                                </div>
                                                <div className="row text-center" style={{ margin: 0, padding: 0 }}>
                                                    {item.U_web === 0 || item.U_web === null 
                                                        ? item.wishlist === 1 &&
                                                            <div className="col-12" style={{ padding: 0 }}>
                                                                <label style={{ textAlign: "center", fontSize: 16 }}>para cotización</label>
                                                            </div>
                                                        : item.wishlist === 1 &&
                                                            <div className="col-10">
                                                                <label style={{ textAlign: "center", marginTop: 12, fontSize: 14 }}>Lista de deseos</label>
                                                            </div>
                                                    }
                                                    {item.U_web === 1 &&
                                                        item.wishlist === 1 &&
                                                            <div className="col-2" style={{ color: config.navBar.textColor2, fontSize: 20, padding: 0 }}>
                                                                {item.backOrder
                                                                    ? <i className={config.icons.backOrderFalse} style={{ cursor: "pointer", marginLeft: 7, marginTop: 15 }} onClick={() => changeBackOrder(item, false)} />
                                                                    : <i className={config.icons.backOrderTrue} style={{ cursor: "pointer", marginLeft: 7, marginTop: 15 }} onClick={() => changeBackOrder(item, true)} />
                                                                }
                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </Carousel>
                        :
                        <Carousel708 
                            items={relatedItems} 
                            valor={valor} 
                            seller={seller} 
                            updateFavorite={updateFavorite} 
                            openItemDetails={openItemDetails}
                            dashboard={dashboard}
                            changeQuantity={this.changeQuantity}
                            changLocalQuantity={this.changLocalQuantity}
                            view={"slider1"}
                            list={3}
                        />
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        notificationReducer: store.NotificationReducer,
        shoppingCartReducer: store.ShoppingCartReducer,
        itemsReducer: store.ItemsReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setUser: value => dispatch({type: DISPATCH_ID.LOGIN_SET_USER, value}),
        setShoppingCart: value => dispatch({type: DISPATCH_ID.SHOPPING_CART_SAVE_CART, value}),
        setItemsFilterSearch2: value => dispatch({type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER2, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ItemSlider);

