import React, { Component, PureComponent } from 'react';
import { config, SERVICE_API, VIEW_NAME, DISPATCH_ID } from '../libs/utils/Const';
import { connect } from "react-redux";
import { ItemDetailsModal, Pagination, Paginations, SideBarItems, SortFilter } from "./index";
import CurrencyFormat from 'react-currency-format';
import "./ItemSlider.css";
import { animateScroll as scroll, scroller } from 'react-scroll';
import moment from 'moment';
import { getAllByAltText } from '@testing-library/dom';
import 'semantic-ui-css/semantic.min.css'
import { Header, Button, Popup, Label } from 'semantic-ui-react'
import { ApiClient } from '../libs/apiClient/ApiClient';



let apiClient = ApiClient.getInstance();


class ItemsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: null,
            card: true,
            list: false,
            seller: JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser')),
        };
        //this.addCartHover = React.createRef();
        this.mouseOverAddCart = this.mouseOverAddCart.bind(this);
        this.mouseOutAddCart = this.mouseOutAddCart.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.iconMouse = [];
        this.iconMouseOver = [];
    }

    componentDidMount = () => {
        this.scrollToBottom();
    }

    scrollToBottom() {
        scroll.scrollToTop({
            duration: 1500,
            delay: 100,
            smooth: 'easeOutQuart',
            isDynamic: true
        })
    }

    changeQuantity = (index, item, event) => {
        const { changeQuantity, notificationReducer: { showAlert }, itemsReducer: { items: itemsSearch } } = this.props;

        let newQuantity;
        itemsSearch.map(itemFilter => {
            if (itemFilter.ItemCode === item.ItemCode) {
                newQuantity = itemFilter.quantity || '1';
            }
        });


        //let piv1 = 0;
        //let piv2 = 0;
        let flag = true;
        let message = '';
        if (item.U_MultiploVenta !== null && item.U_MultiploVenta !== 0) {
            let multiplo = parseInt(newQuantity) % item.U_MultiploVenta;
            if (multiplo == 0) {
                flag = true;
            } else {
                //Calcular el multiplo mas cercano para la cantidad de un card
                const beforeMultiploCercano = parseInt(newQuantity)
                const multiploCercano = Math.ceil(parseInt(newQuantity) / item.U_MultiploVenta) * item.U_MultiploVenta;
                newQuantity = multiploCercano.toString();
                message = 'Al artículo ' + item.SuppCatNum + ' se agregaron ' + (newQuantity - beforeMultiploCercano) + ' unidades para poder agregarlo al carrito';
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
                message = 'Al artículo le faltan ' + result1 + ' unidades';
                flag = false;*/
            }
        }

        if (item.U_MultiploVenta !== null && item.U_MultiploVenta !== 'null' && item.U_MultiploVenta !== undefined && item.U_MultiploVenta !== 'undefined' && item.U_MultiploVenta > 1 && item.U_MultiploVenta !== parseInt(newQuantity)) {
            if (flag === false) showAlert({ type: 'warning', message: item.U_MultiploVenta <= parseInt(newQuantity) ? message : "La cantidad ingresada debe ser un múltiplo de " + item.U_MultiploVenta, timeOut: 8000 });
        }

        let onHand = item.Available;
        // if(Number(newQuantity) > Number(onHand)) {
        //     if (Number(onHand) !== 0 ) {
        //         showAlert({type: 'warning', message: "Se excede el número de articulos disponibles de este producto", timeOut: 2500});
        //     }
        //     newQuantity = onHand;
        // } 
        // if(Number(newQuantity) > Number(item.OnHand)) {
        //     if (Number(onHand) !== 0 ) {
        //         showAlert({type: 'warning', message: "No se cuenta con stock disponible, se surtirá el resto en cuanto se tenga el stock.", timeOut: 8000});
        //     }
        // } 

        // color azul rinti
        // document.getElementById(item.ItemCode).style.backgroundColor = "#005DA8";
        // document.getElementById(item.ItemCode).style.borderColor = "#005DA8";

        // if(!newQuantity){
        //     changeQuantity(index,item, newQuantity, false); //delete
        // }else{
        changeQuantity(index, item, newQuantity, true); // add
        // }
    };


    changLocalQuantity = (index, item, event, opcion = '') => {
        const { itemsReducer: { items: itemsSearch } } = this.props;
        let newQuantity = item.U_MultiploVenta;
        const multiplo = item.U_MultiploVenta ? item.U_MultiploVenta : 1
        switch (opcion) {
            case 'add':
                if (item.quantity % multiplo !== 0) {
                    newQuantity = multiplo
                } else {
                    newQuantity = (Number(event.nativeEvent.target.value) + multiplo) <= 0 ? multiplo : Number(event.nativeEvent.target.value) + multiplo;
                } break;

            case 'sub':
                if (item.quantity % multiplo !== 0) {
                    newQuantity = multiplo
                } else {
                    newQuantity = (Number(event.nativeEvent.target.value) - multiplo) <= 0 ? multiplo : Number(event.nativeEvent.target.value) - multiplo;
                } break;

            default:
                newQuantity = Number(event.nativeEvent.target.value) <= 0 ? multiplo : Number(event.nativeEvent.target.value);
                break;
        }
        if (newQuantity % 1 == 0) {
            itemsSearch.map(itemFilter => {
                if (itemFilter.ItemCode === item.ItemCode) {
                    itemFilter.quantity = newQuantity;
                }
            });
            this.applyFilters(itemsSearch);
        } else {
            return;
        }
    }

    applyFilters = (data) => {
        const { setItemsFilterSearch } = this.props;
        // enableSpinner(true);
        setItemsFilterSearch(data);
        // enableSpinner(false);

        // $("#menuCategories").removeClass('open-menu-categories');
    };

    searchPage = async (page = 0) => {
        const { setNextPage, itemsReducer: { searchByCategories, searchByKey, category, idCategory, location, searchCategoryObj }, items } = this.props;
        page = page === 1 ? 0 : ((page - 1) * 30);
        this.scrollToBottom();
        if (location === 'menuCategories') {
            setNextPage(page);
            await searchByCategories(idCategory, page);
        } else if (location === 'navBar') {
            await searchByKey(page);
        } else if (location === 'marcaOne') {
            await searchByKey(page, 'marcaOne');
        } else if (location === 'marcaTwo') {
            await searchByKey(page, 'marcaTwo');
        } else if (location === 'marcaThree') {
            await searchByKey(page, 'marcaThree');
        } else if (location === 'marcaFour') {
            await searchByKey(page, 'marcaFour');
        } else if (location === 'marcaFive') {
            await searchByKey(page, 'marcaFive');
        } else if (location === 'promocion') {
            await searchByKey(page, 'promocion');
        } else if (location === 'masvendidos') {
            await searchByKey(page, 'masvendidos');
        } else if (location === 'nuevosproductos') {
            await searchByKey(page, 'nuevosproductos');
        } else if (location === 'remates') {
            await searchByKey(page, 'remates');
        } else if (location === 'vitrinaView') {
            await searchByKey(page, 'vitrinaView');
        }else if (location === 'searchBrands') {
            await searchByCategories(searchCategoryObj, page, '', '');
        }
    }

    mouseOverAddCart = (index, flag, event) => {
        if (this.iconMouse && this.iconMouse.length > 0 && false) {
            this.iconMouse[index].style.display = "none";
            this.iconMouseOver[index].style.display = "block";
        }
    }

    mouseOutAddCart = (index, flag, event) => {
        if (flag == 'green') {
            event.currentTarget.style.backgroundColor = "#89c33f";
            event.currentTarget.className = "btn btn-block botonAgregar"
        } else if (flag == 'yellow') {
            event.currentTarget.style.backgroundColor = "#efc964";
            event.currentTarget.className = "btn btn-block botonAgregarYellow"
        } // else {
        //     event.currentTarget.style.backgroundColor = "#e27753";
        //     event.currentTarget.className = "btn btn-block botonAgregarAgotado"
        // }
        // Íconos
        if (this.iconMouse && this.iconMouse.length > 0) {
            this.iconMouse[index].style.display = "block";
            this.iconMouseOver[index].style.display = "none";
        }
    }

    changeFilter = (type) => {
        this.setState({
            card: type === 'card' ? true : false,
            list: type === 'list' ? true : false
        });
    }


    /*Mostrar y ocultar categorias en resolución 720px*/
    barraSide = () => {
        const linkFiltro = document.querySelectorAll(".linkFilter");
        const btnToggle = document.querySelector(".toggle-btn");

        btnToggle.addEventListener("click", (function () {
            document.getElementById("sidebar").classList.toggle("active");
            document.querySelector(".toggle-btn").classList.toggle("active");
        }()));

        linkFiltro.forEach((el) => el.addEventListener("click", function () {
            document.getElementById("sidebar").classList.remove("active");
            document.querySelector(".toggle-btn").classList.remove("active");
        }));
    }
    async setFavorite(itemCode) {
        const { itemsReducer: { items1, items2 }, items, setItemsSearch, setItemsSearch1, setItemsSearch2 } = this.props;
        let result = await apiClient.add2Fav(itemCode);
        let find = items.find(itm => {
            if (itm.ItemCode === itemCode) {
                itm.FAVORITE = !itm.FAVORITE
                itm.FAVORITES = !itm.FAVORITES
                return itm
            }
        })
        items1.find(itm => {
            if (itm.ItemCode === itemCode) {
                itm.FAVORITE = !itm.FAVORITE
                itm.FAVORITES = !itm.FAVORITES
                return itm
            }
        })
        items2.find(itm => {
            if (itm.ItemCode === itemCode) {
                itm.FAVORITE = !itm.FAVORITE
                itm.FAVORITES = !itm.FAVORITES
                return itm
            }
        })
        setItemsSearch1(items1)
        setItemsSearch2(items2)
        setItemsSearch(items)
    }
    /*Fin mostrar*/

    render() {
        const { items, type, changeBackOrder, updateFavorite, deleteShoppingCart, openDetails, itemsReducer: { location, TotalPage, itemsCategories }, viewOne } = this.props;
        const { card, list, seller } = this.state;
        let valor = seller ? seller.U_FMB_Handel_Perfil : '0';
        let x = window.matchMedia("(max-width: 50px)")
        const storedPage = localStorage.getItem('currentPage');
        const currentPage = storedPage ? parseInt(storedPage) : 0;
        return (
            <div id="scrollDownPlease" >
                <div className="row">
                    <div className="col-md-9">
                        <div className="row justify-content-md-end">
                            <div className="col-md-auto bg-white">
                                <div id='SORTFILER' className="row d-inline-block">
                                    <SortFilter items={items} viewOne={viewOne ? viewOne : ''}></SortFilter>
                                </div>
                                <div className="d-md text-right">
                                    {/* Esto se mostrará a la derecha en dispositivos responsivos */}
                                    <span className="font-weight-bold">Productos: </span>
                                    <span className="font-weight-bolder">{TotalPage}</span>
                                </div>
                                <div className="d-md text-right">
                                    {/* Esto se mostrará a la derecha en dispositivos responsivos */}
                                    <i onClick={() => { this.changeFilter('card') }} className="fas fa-th-list mb-2" style={{ color: card === true ? 'black' : 'grey', cursor: 'pointer', marginRight: '15px' }} />
                                    <i onClick={() => { this.changeFilter('list') }} className="fas fa-th-list" style={{ color: list === true ? 'black' : 'grey', cursor: 'pointer' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid row" style={{ margin: 0, display: "flex", justifyContent: "center", fontFamily: 'Poppins' }}>
                    {(!type || type !== 'RedCompensasView') &&
                        /* Lista categorias */
                        <div className="col-md-3 colmd" style={{ height: "auto", marginBottom: "1.5rem", top: "-1rem" }}>
                            <div className="toggle-btn" onClick={() => { this.barraSide() }}>
                                <span className="fa fa-filter"> Filtros</span>
                            </div>
                            <div id="sidebar" style={{ OverflowY: "scroll", marginTop: "28px", maxWidth: '370px' }}>
                                <div style={{ padding: "1rem 1rem 1rem 1rem" }}>
                                    <SideBarItems totalRows={TotalPage} dataCategories={itemsCategories} viewOne={viewOne ? viewOne : ''} />
                                </div>
                            </div>
                        </div>
                    }
                    <div className={(!type || type !== 'RedCompensasView') ? "col-md-8 row colmdd" : ""}>
                        {/* <ItemDetailsModal view={VIEW_NAME.ITEMS_VIEW}/> */}
                        {items && items.map((item, index) => {
                            item.ItemName = item.ItemName || '';
                            // Arreglo de imagenes del campo extra
                            let imagesArray = item.U_Handel_ImagesArray || '';
                            imagesArray = imagesArray.split('|');
                            let imagenShow = imagesArray[0] ? (config.BASE_URL + SERVICE_API.getImage + '/' + imagesArray[0]) : require('../images/noImage.png');
                            const multiplo = item.U_MultiploVenta
                            return (
                                /*See agregaron pading de top y dee bottom*/
                                <div
                                    id="CardItem"
                                    style={{
                                        margin: card ? 12 : "15px 15px",
                                        position: card ? "" : "",
                                        height: "auto",
                                        flexDirection: card ? "" : "column !important",
                                        width: card ? "" :"55rem",
                                    }}
                                    key={item.ItemCode + item.ItemName + item.Price}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div
                                            className={`card ${card ? "imageCard" : "list-card-container"}`}
                                            style={{
                                                aspectRatio: card ? "1/1" : "",
                                                width: card ? "18rem" : "100%", // Ancho fijo para tarjetas de lista
                                                height: card ? "488px" : "100%",
                                                borderRadius: card ? "10px" : "10px",
                                                maxWidth: card ? "100%" : "100%",
                                                display: "flex",
                                                flexWrap: "nowrap",
                                                padding: card ? "" : "0.8rem",
                                            }}
                                        >
                                            <div className='row'>
                                                <div style={{ display: (!item.U_FMB_Handel_Promo || item.U_FMB_Handel_Promo === '' || item.U_FMB_Handel_Promo == 0 ? 'none' : 'table') }}>
                                                    <div
                                                        className="p-3" style={{ position: "absolute" }}
                                                        onClick={() => openDetails(item)}
                                                    >
                                                        <span style={{ backgroundColor: "#ff0112", padding: "7px", borderRadius: "10px", fontSize: "12px", color: 'white' }}>
                                                            Oferta
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-4" onClick={() => openDetails(item)}>
                                                    <img
                                                        className={card === true ? "card-img-top" : "card-img-top list-card-image"}
                                                        style={{
                                                            height: card === true ? "15rem" : "100px",
                                                            width: card === true ? "15rem" : "100px", // Ajusta el ancho deseado para el modo lista
                                                            backgroundColor: "transparent",
                                                            borderTopRightRadius: "10px",
                                                            cursor: "pointer",
                                                            margin: "auto",
                                                            objectFit: "cover",
                                                        }}
                                                        src={imagenShow}
                                                        alt="imageItems"
                                                    />
                                                </div>
                                                <div className="card-body" style={{height:"fit-content",margin: 0,minHeight: card === true ?"180px":""}}>
                                                    <div className="d-flex justify-content-between align-items-end mb-2" style={{ fontSize: 11 }}>
                                                        <div>
                                                            <span style={{ color: "#AFAFAF" }}>{item.SuppCatNum !== null ? 'Cód.Fabr ' : 'SKU'}</span>
                                                            <span className="" style={{ color: "#00aa08" }}>{item.SuppCatNum !== null ? item.SuppCatNum : item.ItemCode}</span>
                                                        </div>
                                                        <div className="card-brand gray-text" style={{ color: "#AFAFAF" }}><span>{item.U_Linea !== null && item.U_Linea !== undefined ? item.U_Linea : ''}</span></div>
                                                    </div>
                                                    <div className="overflow-auto">
                                                        <p className="card-title mb-0" style={{ padding: 1, fontSize: 12, color: "#4e4e4e", cursor:'pointer' }}>
                                                            {item.ItemName ?
                                                                (item.ItemName).length > 25 ?
                                                                    <div>
                                                                        <span >{(item.ItemName).substring(0, 20)}</span>
                                                                        <Popup trigger={<Label className='ItemName' style={{ color: '#AFAFAF', backgroundColor: 'white', fontSize: 'small', display: !x.matches ? 'inline-block' : 'none', fontSize: 10, padding: '0px 0px 0px 1px' }}>ver más...</Label >} flowing hoverable position='top center'>
                                                                            <Popup.Content className='ItemName' style={{ width: 150, overflow: 'auto' }}>
                                                                                <span>{item.ItemName}</span>
                                                                            </Popup.Content>
                                                                        </Popup>
                                                                    </div>
                                                                    : item.ItemName
                                                                : " "}
                                                        </p>
                                                    </div>
                                                    <span className="card-text" style={{ color: "#AFAFAF" }}>Stock: </span>
                                                    <span className="card-text" style={{ color: "#0060ea" }}>{item.Available != null ? item.Available : 'Sin stock'}</span>
                                                    <br></br>
                                                    <span className="card-text" style={{ color: "#AFAFAF" }}>Multiplo de venta: </span>
                                                    <span className="card-text" style={{ color: "#0060ea" }}>{multiplo ? multiplo : '1'}</span>
                                                   <br></br>
                                                   <label class="" style={{ fontSize: "17px", color: "#00aa08", fontWeight: 'bolder',  marginTop:'5px' }}>
                                                        {item.U_web === 0 || item.U_web === null
                                                            ? "Solicite su cotización"
                                                            : (item.PriceBeforeDiscount === item.Price && (item.DiscountPercentSpecial === 0 || item.DiscountPercentSpecial == null)) ? (
                                                                <CurrencyFormat
                                                                    value={item.Price}
                                                                    displayType={'text'}
                                                                    thousandSeparator={true}
                                                                    fixedDecimalScale={true}
                                                                    decimalScale={2}
                                                                    prefix={'$'}>
                                                                </CurrencyFormat>
                                                            ) : (
                                                                <>
                                                                    <div style={{ textAlign: 'right', fontSize: 11, marginTop:'5px' }}>
                                                                        <span style={{ color: "grey" }}>Antes </span>
                                                                        <span className="text-left precioPromocion" style={{ fontSize: 11 }} >
                                                                            <CurrencyFormat
                                                                                value={item.PriceBeforeDiscount}
                                                                                displayType={'text'}
                                                                                thousandSeparator={true}
                                                                                fixedDecimalScale={true}
                                                                                decimalScale={2}
                                                                                prefix={'$'}>
                                                                            </CurrencyFormat>
                                                                        </span>
                                                                        {/*seller ? seller.U_FMB_Handel_Perfil != '0' && item.DiscountPercentSpecial !== 0 ?
                                                                <span style={{ fontSize: 12 }} className="text-danger"> {parseFloat(item.DiscountPercentSpecial).toFixed(2)}% OFF</span>
                                                                : "" : ""
                                                            */}
                                                                        <span style={{ fontSize: 12 }} className="text-danger"> {parseFloat(item.DiscountPercentSpecial).toFixed(2)}% OFF</span>
                                                                    </div>
                                                                    <span className="text-left  precioPromocionItemList" style={{ fontWeight: 'bolder',  marginTop:'5px' }}>
                                                                        <div className="pricePromoItemSlider" >
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
                                                    </label><br />
                                                </div>
                                                <div className='card-footer pb-0' style={{ background: "#ffffff00", borderTop: "none", borderBottomRightRadius: "10px", borderBottomLeftRadius: "10px" }}>
                                                    
                                                    <div className='mb-2 footer-card'>
                                                        <div className='d-inline-block'>
                                                            {item.U_web === 0 || item.U_web === null ?
                                                                <label style={{ textAlign: "center", fontSize: 16 }}>Llámenos o envíe un correo</label>
                                                                :
                                                                item.Unidades === "Unidades" ?
                                                                    <div class="input-group" style={{ width: "120px" }}>
                                                                        <div class="input-group-prepend">
                                                                            <button
                                                                                class="btn btn-outline-secondary"
                                                                                style={{ borderRadius: "10px", border: "1px solid #CED4DA" }}
                                                                                type="button"
                                                                                value={item.quantity ? (Number(item.quantity)).toFixed(0) : multiplo}
                                                                                onClick={(event) => { this.changLocalQuantity(index, item, event, 'sub') }}
                                                                            >-</button>
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            class="form-control  ml-2 mr-2"
                                                                            placeholder="1"
                                                                            style={{ borderRadius: "10px" }}
                                                                            id={'input-quantity-' + item.ItemCode + index}
                                                                            value={item.quantity ? Number(item.quantity).toFixed(0) : ''}
                                                                            name={'quantity' + item.ItemCode}
                                                                            onChange={(event) => { this.changLocalQuantity(index, item, event) }}
                                                                        />
                                                                        <div class="input-group-append">
                                                                            <button
                                                                                class="btn btn-outline-secondary"
                                                                                style={{ borderRadius: "10px", border: "1px solid #CED4DA" }}
                                                                                type="button"
                                                                                value={item.quantity ? (Number(item.quantity)).toFixed(0) : ''}
                                                                                onClick={(event) => { this.changLocalQuantity(index, item, event, 'add') }}
                                                                            >+</button>
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    <div class="input-group" style={{ width: "120px" }}>
                                                                        <div class="input-group-prepend">
                                                                            <button
                                                                                class="btn btn-outline-secondary"
                                                                                style={{ borderRadius: "10px", border: "1px solid #CED4DA" }}
                                                                                type="button"
                                                                                value={item.quantity ? (Number(item.quantity)).toFixed(0) : multiplo}
                                                                                onClick={(event) => { this.changLocalQuantity(index, item, event, 'sub') }}
                                                                            >-</button>
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            class="form-control  ml-2 mr-2"
                                                                            placeholder="1"
                                                                            style={{ borderRadius: "10px" }}
                                                                            id={'input-quantity-' + item.ItemCode + index}
                                                                            value={item.quantity ? item.quantity : multiplo ? multiplo : 1}
                                                                            name={'quantity' + item.ItemCode}
                                                                            onChange={(event) => { this.changLocalQuantity(index, item, event) }}
                                                                        />
                                                                        <button
                                                                            class="btn btn-outline-secondary"
                                                                            style={{ borderRadius: "10px", border: "1px solid #CED4DA" }}
                                                                            type="button"
                                                                            value={item.quantity ? (Number(item.quantity)).toFixed(0) : multiplo}
                                                                            onClick={(event) => { this.changLocalQuantity(index, item, event, 'add') }}
                                                                        >+</button>
                                                                    </div>
                                                            }
                                                        </div>
                                                        {item.U_web === 0 || item.U_web === null ? ''
                                                        :
                                                        <button
                                                            href="#" class="btn btn-primary d-inline-block ml-2"
                                                            style={{ borderRadius: "10px", background: "#00aa08", border: "#00aa08" }}
                                                            readOnly={item.Available === 0 || item.Available === '' ? true : false}
                                                            value={(item.quantity ? Number(item.quantity) : 1)}
                                                            onClick={(event) => { this.changeQuantity(index, item, event) }}
                                                            onMouseOver={event => { this.mouseOverAddCart(index, item, event) }}
                                                            onMouseOut={event => { this.mouseOutAddCart(index, item, event) }}
                                                        >
                                                            <img className='' src={config.cardIcons.carrito} style={{ width: "23px", height: "22px" }} alt='iconCart' />
                                                        </button>
                                                        }
                                                        <div onClick={() => this.setFavorite(item.ItemCode)}>
                                                            <img alt="" src={item.FAVORITE ? config.cardIcons.redHeart : config.cardIcons.heart} style={{ width: "23px", height: "22px" }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );

                        })}
                    </div>
                </div>
                <div className="row">
                    <Pagination
                        currentPage={currentPage}
                        refresh={this.searchPage}
                        totalRowsRefresh={TotalPage} />
                </div>
                <div class="row">

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
        setShoppingCart: value => dispatch({ type: DISPATCH_ID.SHOPPING_CART_SAVE_CART, value }),
        setItemsFilterSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER, value }),
        setNextPage: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_NEXTPAGE, value }),
        searchByDashOption: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_SEARCH_BY_DASH_OPTION, value }),
        setItemsSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEMS, value }),
        setItemsSearch1: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEMS1, value }),
        setItemsSearch2: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEMS2, value }),

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ItemsList);