import React, { Component } from 'react';
import { config, SERVICE_API, VIEW_NAME, DISPATCH_ID } from '../libs/utils/Const';
import { connect } from "react-redux";
import { ItemDetailsModal } from "./index";
import CurrencyFormat from 'react-currency-format';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './ItemSlider.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import moment from 'moment';
import { nodeName } from 'jquery';
import 'semantic-ui-css/semantic.min.css'
import { Header, Button, Popup, Label } from 'semantic-ui-react'
import { ApiClient } from '../libs/apiClient/ApiClient';

// definir las variables responsivas para el carrusel
let apiClient = ApiClient.getInstance();

class Carousel708 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemsPerRow: this.calculateItemsPerRow(window.innerWidth),
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const newItemsPerRow = this.calculateItemsPerRow(window.innerWidth);
        this.setState({ itemsPerRow: newItemsPerRow });
    };

    calculateItemsPerRow = (windowWidth) => {
        if (windowWidth >= 1550 && windowWidth <= 1850) {
            return 5;
        } else if (windowWidth >= 1200 && windowWidth <= 1550) {
            return 4;
        }
        return 6;
    };


    CarouselRows(itemsForRow, items) {
        // console.log('job items.length',items.length)
        let rows = Math.ceil(items?.length / itemsForRow)
        // console.log('job rowsrows', rows)
        let itemCount = 0
        let code = []
        for (let index = 0; index < rows; index++) {
            if (index == 0) {
                code[index] = (
                    <div class={"carousel-item active"} data-interval="10000" style={{ backgroundColor: "white !important" }}>
                        <div className='items708' style={{ display: "flex", background: "white", justifyContent: "center !important" }}>
                            {this.CarouselItems(itemCount, itemsForRow, items).map((item, index) => {
                                return (item)
                            })}
                        </div>
                    </div>
                )
            } else {
                code[index] = (
                    <div class="carousel-item" data-interval="10000" style={{ backgroundColor: "white !important" }}>
                        <div className='items708' style={{ display: "flex", background: "white", justifyContent: "center !important" }}>
                            {this.CarouselItems(itemCount, itemsForRow, items).map((item, index) => {
                                return (item)
                            })}
                        </div>
                    </div>
                )
            }

            // console.log('job ITEMSARRAY',this.CarouselItems(itemCount,itemsForRow, items))
            itemCount = itemCount + itemsForRow
        }
        // console.log('job', code)

        return code
    }
    async setFavorite(itemCode, list = 3) {
        const { items, setItemsSearch1, setItemsSearch2 } = this.props;
        let result = await apiClient.add2Fav(itemCode);
        let find = items.find(itm => {
            if (itm.ItemCode === itemCode) {
                itm.FAVORITE = !itm.FAVORITE
                itm.FAVORITES = !itm.FAVORITES
                return itm
            }
        })
        if (list === 1) {
            setItemsSearch1(items)
        } else if (list === 2) {
            setItemsSearch2(items)
        } else if (list === 3) {
                setItemsSearch2(items)
            } else {
    
            }
        
    }

    CarouselItems(itemCount, itemsForRow, items) {
        const { valor, seller, updateFavorite, openItemDetails, dashboard, changLocalQuantity, changeQuantity, list } = this.props
        let code = [];
        let imagesArray = ''
        let imagenShow = ''
        for (let index = 0; index < itemsForRow; index++) {
            if (items.length > itemCount + index) {
                const multiplo = items[itemCount + index].U_MultiploVenta
                imagesArray = items[itemCount + index].U_Handel_ImagesArray || '';
                imagesArray = imagesArray.split('|');
                imagenShow = imagesArray[0] ? (config.BASE_URL + SERVICE_API.getImage + '/' + imagesArray[0]) : require('../images/noImage.png');
                if (!items[itemCount + index].quantity) {
                    items[itemCount + index].quantity = items[itemCount + index].U_MultiploVenta ? items[itemCount + index].U_MultiploVenta : 1
                }
                code[index] = (
                    <div class="card m-3" style={{ width: "18rem", borderRadius: "10px" }}>
                        <div style={{ display: (!items[itemCount + index].U_FMB_Handel_Promo || items[itemCount + index].U_FMB_Handel_Promo === '' || items[itemCount + index].U_FMB_Handel_Promo == 0 ? 'none' : 'table') }}>
                            <div className="p-3" style={{ position: "absolute" }} onClick={() => openItemDetails(items[itemCount + index])}>
                                <span style={{ backgroundColor: "#ff0112", padding: "7px", borderRadius: "10px", fontSize: "12px", color: 'white' }}>
                                    Oferta
                                </span>
                            </div>
                        </div>
                        <div className='p-3' onClick={() => openItemDetails(items[itemCount + index])}>
                            <img src={imagenShow} class="card-img-top" alt="imageItems" style={{ background: "white", maxHeight: "16rem", borderTopRightRadius: "10px", borderTopLeftRadius: "10px" }} />
                        </div>
                        <div class="card-body pb-0">
                            <div className="d-flex justify-content-between align-items-end mb-2" style={{ fontSize: 11 }}>
                                <div>
                                    <span style={{ color: "#AFAFAF" }}>{items[itemCount + index].SuppCatNum !== null ? 'Cód.Fabr ' : 'SKU'}</span>
                                    <span className="" style={{ color: "#00aa08" }}>{items[itemCount + index].SuppCatNum !== null ? items[itemCount + index].SuppCatNum : items[itemCount + index].ItemCode}</span>
                                </div>
                                <div className="card-brand gray-text" style={{ color: "#AFAFAF" }}>{items[itemCount + index].U_Linea}</div>
                            </div>
                            <label className="card-title mb-0" style={{ fontSize: "12px" }}> {items[itemCount + index].ItemName || ''} </label>
                            <br></br>
                            <span className="card-text" style={{ color: "#AFAFAF" }}>Stock: </span>
                            <span className="card-text" style={{ color: "#0060ea" }}>{items[itemCount + index].Available != null ? items[itemCount + index].Available : 'Sin stock'}</span>
                            <br />
                            <span className="card-text" style={{ color: "#AFAFAF" }}>Multiplo de venta: </span>
                            <span className="card-text" style={{ color: "#0060ea" }}>{multiplo ? multiplo : '1'}</span>
                        </div>
                        <div className='card-footer pt-0' style={{ background: "white", borderTop: "none", borderBottomRightRadius: "10px", borderBottomLeftRadius: "10px" }}>
                            <label class="" style={{ fontSize: "18px", color: config.Back.color, fontWeight:'bolder' }}>
                                {items[itemCount + index].U_web === 0 || items[itemCount + index].U_web === null
                                    ? "Solicite su cotización"
                                    : (valor == '0' || !items[itemCount + index].U_FMB_Handel_Promo || items[itemCount + index].U_FMB_Handel_Promo === '' || items[itemCount + index].U_FMB_Handel_Promo == 0 || items[itemCount + index].DiscountPercentSpecial == 0 ?
                                        <CurrencyFormat
                                            value={items[itemCount + index].Price}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            fixedDecimalScale={true}
                                            decimalScale={2}
                                            prefix={'$'}>
                                        </CurrencyFormat>
                                        : <>
                                            {items[itemCount + index].DiscountPercentSpecial && <>
                                                <div style={{ textAlign: 'right', fontSize: 12, }}>
                                                    <span style={{color:'grey'}}>Antes </span>
                                                    <span className="text-left precioPromocion" style={{ fontSize: 12, color:'red' }} >
                                                        <CurrencyFormat
                                                            value={items[itemCount + index].PriceBeforeDiscount}
                                                            displayType={'text'}
                                                            thousandSeparator={true}
                                                            fixedDecimalScale={true}
                                                            decimalScale={2}
                                                            prefix={'$'}>
                                                        </CurrencyFormat>
                                                    </span>
                                                    {seller ? seller.U_FMB_Handel_Perfil != '0' && items[itemCount + index].DiscountPercentSpecial !== 0 ?
                                                        <span style={{ fontSize: 12 }} className="text-danger"> {parseFloat(items[itemCount + index].DiscountPercentSpecial).toFixed(2)}% OFF</span>
                                                        : "" : ""
                                                    }
                                                </div>
                                            </>}
                                            <span className="text-left  precioPromocionItemList">
                                                <div className="pricePromoItemSlider" style={{fontWeight: 'bolder'}}>
                                                    <CurrencyFormat
                                                        value={items[itemCount + index].Price}
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
                                {items[itemCount + index].U_web === 1 &&
                                    " " //+ item.currency
                                }
                            </label><br />
                            <div className='mb-2 footer-card'>
                                <div className='d-inline-block'>
                                    {items[itemCount + index].U_web === 0 || items[itemCount + index].U_web === null ?
                                        <label style={{ textAlign: "center", fontSize: 16 }}>Llámenos o envíe un correo</label>
                                        :
                                        items[itemCount + index].Unidades === "Unidades" ?
                                            <div class="input-group" style={{ width: "120px" }}>
                                                <div class="input-group-prepend">
                                                    <button
                                                        class="btn btn-outline-secondary"
                                                        style={{ borderRadius: "10px", border: "1px solid #ced4da" }}
                                                        type="button"
                                                        value={items[itemCount + index].quantity ? (Number(items[itemCount + index].quantity)).toFixed(0) : multiplo}
                                                        onClick={(event) => { changLocalQuantity(dashboard.toString() + index, items[itemCount + index], event, '-') }}
                                                    >-</button>
                                                </div>
                                                <input
                                                    type="text"
                                                    class="form-control  ml-2 mr-2"
                                                    placeholder="1"
                                                    style={{ borderRadius: "10px" }}
                                                    step={multiplo}
                                                    id={'input-quantity-' + dashboard.toString() + items[itemCount + index].ItemCode + index}
                                                    value={items[itemCount + index].quantity ? Number(items[itemCount + index].quantity).toFixed(0) : ''}
                                                    name={'quantity' + items[itemCount + index].ItemCode}
                                                    onChange={(event) => { changLocalQuantity(dashboard.toString() + index, items[itemCount + index], event) }}
                                                />
                                                <div class="input-group-append">
                                                    <button
                                                        class="btn btn-outline-secondary"
                                                        style={{ borderRadius: "10px", border: "1px solid #ced4da" }}
                                                        type="button"
                                                        value={items[itemCount + index].quantity ? (Number(items[itemCount + index].quantity)).toFixed(0) : ''}
                                                        onClick={(event) => { changLocalQuantity(dashboard.toString() + index, items[itemCount + index], event, '+') }}
                                                    >+</button>
                                                </div>
                                            </div>
                                            :
                                            <div class="input-group" style={{ width: "120px" }}>
                                                <div class="input-group-prepend">
                                                    <button
                                                        class="btn btn-outline-secondary"
                                                        style={{ borderRadius: "10px", border: "1px solid #ced4da" }}
                                                        type="button"
                                                        value={items[itemCount + index].quantity ? (Number(items[itemCount + index].quantity)).toFixed(0) : multiplo}
                                                    onClick={(event) => { changLocalQuantity(dashboard.toString() + index, items[itemCount + index], event, '-') }}
                                                >-</button>
                                                </div>
                                                <input
                                                    type="text"
                                                    class="form-control  ml-2 mr-2"
                                                    placeholder="1"
                                                    style={{ borderRadius: "10px" }}
                                                    step={multiplo}
                                                    id={'input-quantity-' + dashboard.toString() + items[itemCount + index].ItemCode + index}
                                                    value={items[itemCount + index].quantity ? items[itemCount + index].quantity : multiplo ? multiplo : 1}
                                                    name={'quantity' + items[itemCount + index].ItemCode}
                                                    onChange={(event) => { changLocalQuantity(dashboard.toString() + index, items[itemCount + index], event) }}
                                                />
                                                <button
                                                    class="btn btn-outline-secondary"
                                                    style={{ borderRadius: "10px", border: "1px solid #ced4da" }}
                                                    type="button"
                                                    value={items[itemCount + index].quantity ? (Number(items[itemCount + index].quantity)).toFixed(0) : ''}
                                                        onClick={(event) => { changLocalQuantity(dashboard.toString() + index, items[itemCount + index], event, '+') }}
                                                    >+</button>
                                            </div>
                                    }
                                </div>
                                {items[itemCount + index].U_web === 0 || items[itemCount + index].U_web===null ? '' :
                                <button
                                    href="#" class="btn btn-primary d-inline-block ml-2"
                                    style={{ borderRadius: "10px", background:config.Back.color, border: config.Back.color }}
                                    readOnly={items[itemCount + index].Available === 0 || items[itemCount + index].Available === '' ? true : false}
                                    value={(items[itemCount + index].quantity ? Number(items[itemCount + index].quantity) : multiplo)}
                                    onClick={(event) => { changeQuantity(index, items[itemCount + index], event) }}
                                >
                                    <img className='' src={config.cardIcons.carrito} style={{ width: "23px", height: "22px" }} alt='iconCart' />
                                </button>
                                }
                                <div onClick={() => this.setFavorite(items[itemCount + index].ItemCode, list)}>
                                    <img alt="" src={items[itemCount + index].FAVORITES ? config.cardIcons.redHeart : config.cardIcons.heart} style={{ width: "23px", height: "22px" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

        }
        return code;
    }

    Controls(view, size, position) {
        return (
            <>
                <a class="carousel-control-prev" href={"#" + view + "Carousel" + size} role="button" data-slide="prev" style={{ maxWidth: "50px", left: position }}>
                    <img className='mr-2' src={config.icons.prevDark} style={{ maxWidth: "30px" }} />
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href={"#" + view + "Carousel" + size} role="button" data-slide="next" style={{ maxWidth: "50px", right: position }}>
                    <img className='mr-2' src={config.icons.nextDark} style={{ maxWidth: "30px" }} />
                    <span class="sr-only">Next</span>
                </a>
            </>
        )
    }

    render() {
        const { items, view } = this.props;
        const { itemsPerRow } = this.state;





        return (
            <>
                <div className='d-md-none'>
                    <div id={view + "CarouselXS"} class="carousel slide" data-ride="carousel">
                        <div class="carousel-inner">
                            {this.CarouselRows(1, items).map((item, index) => {
                                return (item)
                            })}
                        </div>
                        {this.Controls(view, 'XS', "0px")}
                    </div>
                </div>
                <div className='d-none d-md-block d-lg-none '>
                    <div id={view + "CarouselMD"} class="carousel slide" data-ride="carousel">
                        <div class="carousel-inner">
                            {this.CarouselRows(2, items).map((item, index) => {
                                return (item)
                            })}
                        </div>
                        {this.Controls(view, 'MD', "0px")}
                    </div>
                </div>
                <div className='d-none d-lg-block d-xl-none '>
                    <div id={view + "CarouselLG"} class="carousel slide" data-ride="carousel">
                        <div class="carousel-inner">
                            {this.CarouselRows(3, items).map((item, index) => {
                                return (item)
                            })}
                        </div>
                        {this.Controls(view, 'LG', "-10px")}
                    </div>
                </div>


                <div className='d-none d-xl-block'>
                    <div id={view + "CarouselXL"} class="carousel slide" data-ride="carousel">
                        <div class="carousel-inner">
                            {this.CarouselRows(itemsPerRow, items).map((item, index) => {
                                return (item);
                            })}
                        </div>
                        {this.Controls(view, 'XL', "-28px")}
                    </div>
                </div>

            </>
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
        setUser: value => dispatch({ type: DISPATCH_ID.LOGIN_SET_USER, value }),
        setShoppingCart: value => dispatch({ type: DISPATCH_ID.SHOPPING_CART_SAVE_CART, value }),
        setItemsFilterSearch2: value => dispatch({ type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER2, value }),
        setItemsSearch1: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEMS1, value }),
        setItemsSearch2: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEMS2, value }),

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Carousel708);

