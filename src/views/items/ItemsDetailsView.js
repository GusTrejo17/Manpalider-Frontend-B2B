import React, { Component } from 'react';
import { NavBar, Session, History, ItemsList, ItemDetailsModal, Footer, ItemSlider1 } from "../../components";
import { config, DISPATCH_ID, SERVICE_API, VIEW_NAME } from "../../libs/utils/Const";
import { connect } from "react-redux";
import { ItemSlider, ItemSliderResponsive } from '../../components';
import { BreadCrumb } from '../../index'
import CurrencyFormat from 'react-currency-format';
import { Redirect } from 'react-router';
import ReactImageMagnify from 'react-image-magnify';
import "./ItemsView.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import ReactStars from "react-rating-stars-component";
import { ApiClient } from '../../libs/apiClient/ApiClient';
import OpenOpinionsModal from '../../components/OpenOpinionsModal';
import { Header, Button, Popup, Label, Divider } from 'semantic-ui-react';
import { animateScroll as scroll, scroller } from 'react-scroll'
import $ from 'jquery';
import './itemsView2.css'
import moment from 'moment';
import { Column } from 'jspdf-autotable';

let apiClient = ApiClient.getInstance();

class ItemsDetailsView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images: [],
            rating: 0,
            comentario: '',
            Comentarios: [],
            titulo: '',
            valueStart: 0,
            comentar: false,
            mainImg: 0,
            promociones: [],
            itemsRegalosSelect: [],
            itemsRegalos: [],
            itemPromociones: [],
            selectorType: null,
            boxes: [],
            itemsNotificacion: [],
            stockDetails: [],
        };
        // this.scrollToBottom = this.scrollToBottom.bind(this);
        this.mouseOverAddCart = this.mouseOverAddCart.bind(this);
        this.mouseOutAddCart = this.mouseOutAddCart.bind(this);
        this.iconMouse = [];
        this.iconMouseOver = [];
    }

    scrollToBottom() {
        scroll.scrollToTop({
            duration: 1500,
            delay: 100,
            smooth: 'easeOutQuart',
            isDynamic: true
        })
    }

    async componentDidMount() {
        const { enableSpinner } = this.props;
        this.scrollToBottom();
        enableSpinner(true);
        // setTimeout(() => {
        //     this.cargarDatos(); 
        // }, 2000);
        this.cargarDatos();
        this.loadBonification();
        enableSpinner(false);
        // this.scrollToBottom();
    };

    // Se vacia la tabla
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.state.valueStart != nextState.valueStart) {
            this.valueStart = 1;
        }
        return true;
    }
    // se llena la tabla
    componentDidUpdate() {
        if (this.valueStart == 0) {
            this.cargarDatos();
        }
    }

    async cargarDatos() {
        const { itemsReducer: { itemDetails }, enableSpinner } = this.props;
        enableSpinner(true);
        let user = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'CurrentUser'));
        let newdatas = await apiClient.getRaiting(itemDetails.ItemCode, user ? user.CardCode : '');
        if (newdatas.status != 0) {
            this.setState({
                Comentarios: newdatas.data.data,
                Valores: newdatas.data.promedio,
                All: newdatas.data.All,
                Opinion: newdatas.data.All.length > 0 ? true : false,
                comentar: newdatas.data.comentar
            });
        }

        enableSpinner(false);
    };

    renderCarouselImage = (imagePath, index) => {
        const { itemCode } = this.props;
        return (
            <div className={"carousel-item" + (index === 0 ? ' active' : '')} style={{ backgroundColor: "#fff" }} id={index + 'Image' + itemCode}>
                <img className="img-fluid" src={imagePath} alt="First slide" />
            </div>
        );
    };

    imageZoom = (imagePath, index) => {
        const { itemCode } = this.props;
        let modal = document.getElementById("myModal");
        let img = document.getElementById(index + 'Image' + itemCode);
        let modalImg = document.getElementById("img01");
        modal.style.display = "block";
        modalImg.src = imagePath;
        let span = document.getElementsByClassName("close")[0];
    };

    cerrarModalImage = () => {
        let modal = document.getElementById("myModal");
        modal.style.display = "none";
    }

    renderCarouselImageMP = (imagePath, index) => {
        const { itemCode } = this.props;
        return (
            <a onClick={() => this.imageZoom(imagePath, index)} key={index} className="contenidoCarousel" style={{ justifyContent: "center", alignItems: "center" }}>
                <img className="img-fluid" id={index + 'Image' + itemCode} src={imagePath} alt="Carousel 2" style={{ cursor: 'pointer' }} />
            </a>
        );
    };

    changeQuantityDetails = (item, event) => {
        const { itemsReducer: { deleteShoppingCart, addShoppingCart }, notificationReducer: { showAlert } } = this.props;

        let newQuantity = event.nativeEvent.target.value;

        let piv1 = 0;
        let piv2 = 0;
        let flag = true;
        let message = '';
        if (item.U_MultiploVenta !== null && item.U_MultiploVenta !== 0) {
            let multiplo = parseInt(newQuantity) % item.U_MultiploVenta;
            if (multiplo == 0) {
                flag = true;
            } else {
                //Calcular el multiplo mas cercano
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
        let onHand = item.OnHandPrincipal;
        // if(Number(newQuantity) > Number(item.OnHand)) {
        //     if (Number(onHand) !== 0 ) {
        //         showAlert({type: 'warning', message: "No se cuenta con stock disponible, se surtirá el resto en cuanto se tenga el stock.", timeOut: 8000});
        //     }
        // } 
        // if(Number(newQuantity) > Number(onHand)) {
        //     if (Number(onHand) !== 0 ) {
        //         showAlert({type: 'warning', message: "Se excede el número de ARTÍCULOS disponibles de este producto", timeOut: 2500});
        //     }
        //     newQuantity = onHand;
        // }
        // if(!newQuantity){
        //     deleteShoppingCart({item, deleteAll: false});
        // }else{
        addShoppingCart({ item, quantity: (newQuantity || '1') })
        // }
    };

    directShopping = async (item, event) => {
        const {configReducer, itemsReducer: { deleteShoppingCart, addShoppingCart }, notificationReducer: { showAlert } } = this.props;
        let newQuantity = event.nativeEvent.target.value;

        let onHand = item.OnHandPrincipal;
        await addShoppingCart({ item, quantity: (newQuantity || '1') });

        setTimeout(() => {
            configReducer.history.goShoppingCart();
        }, 1000);     
    };

    changeQuantity = (index, item, newQuantity, addItem) => {
        const { itemsReducer: { addShoppingCart, deleteShoppingCart } } = this.props;
        if (addItem) {
            addShoppingCart({ item, quantity: (newQuantity || '1') })
        } else {
            deleteShoppingCart({ item, deleteAll: false });
        }
    };

    applyFilters = data => {
        const { setItemDetailsSearch } = this.props;
        setItemDetailsSearch(data);
    };
    searchByCategory = async (valor) => {
        const { setItemsFilters, setIdCategory, setLocation, itemsReducer: { searchByCategories }, setNextPage, setSearchCategoryObj } = this.props;
        setIdCategory(valor);
        setNextPage(0);
        setItemsFilters({ property: 'brand', value: '', value2: '' });
        setLocation('searchBrands')
        let search = {
            category: valor,
            subC1: '',
            subC2: '',
            subC3: '',
        }
        await setSearchCategoryObj(search)
        searchByCategories(search, 0, '', '');
    };

    changeBackOrder = (item, addItem) => {
        const { itemsReducer: { deleteBackOrder, addBackOrder } } = this.props;
        if (addItem) {
            addBackOrder({ item, quantity: 1 })
        } else {
            deleteBackOrder({ item, deleteAll: false });
        }
    };

    removeDuplicates(duplicated) {
        let returnArray = new Array();
        for (let a = duplicated.length - 1; a >= 0; a--) {
            for (let b = duplicated.length - 1; b >= 0; b--) {
                if (duplicated[a] && duplicated[b]) {
                    if (duplicated[a].ItemCode == duplicated[b].ItemCode && a != b) {
                        delete duplicated[b];
                    }
                }
            };
            if (duplicated[a] != undefined)
                returnArray.push(duplicated[a]);
        };
        return returnArray;
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
        }//  else {
        //     event.currentTarget.style.backgroundColor = "#e27753";
        //     event.currentTarget.className = "btn btn-block botonAgregarAgotado"
        // }
        // Íconos
        if (this.iconMouse && this.iconMouse.length > 0) {
            this.iconMouse[index].style.display = "block";
            this.iconMouseOver[index].style.display = "none";
        }
    }

    ratingChanged = (newRating) => {
        this.setState({
            rating: newRating
        })
    }

    handelChange = ({ target }) => {
        const { name, value } = target;
        this.setState({
            [name]: value
        });
    };

    sendComment = async (item = null) => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        const { titulo, comentario, rating } = this.state;
        let user = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'CurrentUser'));

        let data = {
            itemcode: item.ItemCode,
            cardcode: user.CardCode,
            titulo,
            comentario,
            rating
        };

        if (rating == '0') {
            showAlert({ type: 'warning', message: 'Por favor califique el producto.', timeOut: 8000 })
            return;
        }
        if (titulo == '') {
            showAlert({ type: 'warning', message: 'Por favor ponga un título.', timeOut: 8000 })
            return;
        }
        if (comentario == '') {
            showAlert({ type: 'warning', message: 'Escribe un comentario acerca del producto.', timeOut: 8000 })
            return;
        }

        enableSpinner(true);
        let apiResponse = await apiClient.sendRaiting(data);

        //console.log(apiResponse);

        if (apiResponse.status === 1) {
            enableSpinner(false);
            this.setState({
                titulo: '',
                comentario: '',
                rating: 0
            })
            this.cargarDatos();
            return;
        }
        showAlert({ type: 'error', message: apiResponse.message });
        enableSpinner(false)
    };

    OpenOpinions = async () => {
        $('#OpinionsModal').modal('show');
    }

    changLocalQuantity = (item, event, opcion = '') => {
        let newQuantity = event.nativeEvent.target.value;
        const multiplo = item.U_MultiploVenta ? item.U_MultiploVenta : 1
        item.quantity = item.quantity ? item.quantity : multiplo
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
        item.quantity = newQuantity;
        this.applyFilters(item);
    }

    setInitialQuantity() {
        const { itemsReducer: { itemDetails } } = this.props
        const multiplo = itemDetails.U_MultiploVenta ? itemDetails.U_MultiploVenta : 1
        itemDetails.quantity = multiplo
        return multiplo
    }

    async setFavorite(itemCode) {
        const { itemsReducer: { itemDetails, items1, items2 }, setItemDetailsSearch, setItemsSearch1, setItemsSearch2 } = this.props;

        await apiClient.add2Fav(itemCode);
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
        itemDetails.FAVORITE = !itemDetails.FAVORITE
        setItemsSearch1(items1)
        setItemsSearch2(items2)
        setItemDetailsSearch(itemDetails)
        this.applyFilters(itemDetails)
    }

    loadBonification = async () => {
        let user = localStorage.getItem(config.general.localStorageNamed + 'CurrentUser');
        user = JSON.parse(user) || {};
        let datos = {
            CardCode: user.CardCode,
            Canal: user.U_SYP_RICO_CCANAL || '',
            Region: user.U_SYP_RICO_CREGION || '',
            SubCanal: user.U_SYP_RICO_CSBCAN || ''
        }
        let newdatas = await apiClient.getPromo(datos);
        if (newdatas.status !== 1) {
            return;
        }
        if (newdatas.data.length > 0) {
            this.setState({
                promociones: newdatas.data,
            });
            await this.validateDisparador();
        }
    };

    refeshState = (array, Notificacion) => {
        const { itemsReducer: { itemDetails } } = this.props;
        const { itemsRegalosSelect } = this.state;
        let itemsPromo = [];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (element.itemDisparador === itemDetails.ItemCode && element.tipoSeleccion === 1) {
                if (element.tipoDisparador === 2) {
                    let result = itemsPromo.find(itemDisp => (itemDisp.itemDisparador !== itemDetails.ItemCode));
                    if (!result) {
                        element.bonificacion.cantidad *= element.homeItemQuantity;
                        itemsPromo.push(element);
                    }
                } else if (element.tipoDisparador === 1) {
                    element.bonificacion.cantidad *= element.homeItemQuantity;
                    itemsPromo.push(element);
                }

            }
        }

        if (itemsPromo.length > 0) {
            let boxes = [];
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if (element.tipoSeleccion === 2) {
                    let result = boxes.find(item => (item.itemDisparador === element.itemDisparador));
                    if (!result) {
                        boxes.push(element);
                    }
                }
            }
            for (let index = 0; index < itemsRegalosSelect.length; index++) {
                const element = itemsRegalosSelect[index];
                for (let index = 0; index < boxes.length; index++) {
                    const box = boxes[index];
                    if (element.itemDisparador === box.itemDisparador && element.idDisparador === box.idDisparador) {
                        boxes.splice(index, 1);
                    }
                }
            }
            this.setState({
                itemsRegalos: itemsPromo,
                itemPromociones: array,
                selectorType: 1,
                boxes: boxes,
                itemsRegalosSelect: [],
                itemsNotificacion: Notificacion

            });

        } else {
            let boxes = [];
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if (element.tipoSeleccion === 2) {
                    let result = boxes.find(item => (item.itemDisparador === element.itemDisparador));
                    if (!result) {
                        boxes.push(element);
                    }
                }
            }

            this.setState({
                itemsRegalos: itemsPromo,
                itemPromociones: array,
                boxes: boxes,
                itemsRegalosSelect: [],
                itemsNotificacion: Notificacion,

            });
        }



    }

    validateDisparador = async () => {
        const { promociones } = this.state;
        // const {enableSpinner, shoppingCartReducer: {items}} = this.props;
        const { enableSpinner, data, itemsReducer: { itemDetails } } = this.props;
        //let data = items;
        //  console.log('con>promociones',promociones);
        let arrayPromoVol = [];
        let NotificacionIems = [];
        let itemsNotificacion = [];
        //##########---VALIDA ARTICULOS POR TIPO DE DISPARADOR----###################
        for (let index = 0; index < promociones.length; index++) {//----promociones
            const promo = promociones[index];
            let arrayItems = [];
            for (let index = 0; index < promo.length; index++) {//----Articulos por promoción
                const disparador = promo[index];
                if (disparador.fkTipoDisparador === 1) {  //---VOLUMEN--------------------------------
                    if (itemDetails.ItemCode === disparador.idProducto) {
                        arrayItems.push(disparador);
                    }
                } else if (disparador.fkTipoDisparador === 2) { //--------------------------------MONTO--------------------------------

                }
            }
            if (arrayItems.length > 0) {
                arrayPromoVol.push(arrayItems);

            }
        }
        if (arrayPromoVol.length > 0) {
            let itemsPromo = [];

            let bonifNoti = [];
            for (let index = 0; index < arrayPromoVol.length; index++) {
                const promociones = arrayPromoVol[index];
                for (let index = 0; index < promociones.length; index++) {
                    const item = promociones[index];
                    itemsPromo.push(item);
                }
            }
            enableSpinner(true);
            bonifNoti = await apiClient.getBonificacion(itemsPromo);
            enableSpinner(false);
            for (let index = 0; index < itemsPromo.length; index++) {
                const element = itemsPromo[index];
                const result = NotificacionIems.find(itemDisp => itemDisp.idProducto === element.idProducto);
                if (!result) {
                    NotificacionIems.push(element);
                }
            }


            // console.log('con>--------###############################');
            if (bonifNoti.data.length > 0) {
                for (let index = 0; index < itemsPromo.length; index++) {
                    const item = itemsPromo[index];
                    let notificacion = {
                        itemDisparador: item.idProducto,
                        tipoVenta: item.fkSubTipo,
                        bonificacion: [],
                        idDisparador: item.disparador,
                        itemQuantity: item.cantidad,
                    }
                    // console.log('con>--------');
                    for (let index = 0; index < bonifNoti.data.length; index++) {
                        const element = bonifNoti.data[index];
                        let itemsTemp = [];
                        // console.log('con>element',element);
                        for (let index = 0; index < element.length; index++) {
                            const bonificacion = element[index];
                            if (item.disparador === bonificacion.disparador && item.relacion === bonificacion.relacion) {
                                itemsTemp.push(bonificacion);
                            }
                        }

                        //    console.log('con>*****************************************',itemsTemp);
                        let items = [];
                        let registrados = [];
                        for (let index = 0; index < itemsTemp.length; index++) {
                            const element = itemsTemp[index];
                            let include = registrados.includes(element.indexPack);
                            if (!include) {
                                let arrayTemp = itemsTemp.filter(item => (item.indexPack === element.indexPack));
                                registrados.push(element.indexPack);
                                items.push(arrayTemp);
                                // console.log('con>arrayTemp',arrayTemp);
                            }


                        }

                        if (itemsTemp.length > 0) {
                            notificacion.bonificacion = items;
                        }

                    }

                    itemsNotificacion.push(notificacion);
                }




                //  console.log('con<<>',itemsNotificacion);
                for (let index = 0; index < NotificacionIems.length; index++) {
                    const element = NotificacionIems[index];
                    let notificacion = [];
                    for (let index = 0; index < itemsNotificacion.length; index++) {
                        const promo = itemsNotificacion[index];
                        if (element.idProducto === promo.itemDisparador) {
                            notificacion.push(promo);
                        }
                    }
                    element.notificacion = notificacion;
                }
                // if(filters.length > 0){
                //     NotificacionIems.push(filters);
                // }
            }
        }
        //  console.log('con>NotificacionIems', NotificacionIems);
        //##########---DISPARADOR TIPO VOLUMEN VALIDA SUBTIPO----###################
        let promoECD = [];
        let promoEDC = [];
        for (let index = 0; index < arrayPromoVol.length; index++) {
            const itemsPromo = arrayPromoVol[index];
            for (let index = 0; index < itemsPromo.length; index++) {
                const item = itemsPromo[index];
                if (item.fkSubTipo === 1) {  //---En la compra de--------------------------------
                    promoECD.push(itemsPromo);
                    break;
                } else if (item.fkSubTipo === 2) {//---En la compra decualquera de--------------------------------
                    promoEDC.push(itemsPromo);
                    break;
                }
            }
        }

        // console.log('con<promoECD',promoECD);
        // console.log('con<promoEDC',promoEDC);


        let itemsPromo = [];
        //##########--- EN LA COMPRA DE, VALIDA STOCK----###################
        for (let index = 0; index < promoECD.length; index++) {
            const promo = promoECD[index];
            for (let index = 0; index < promo.length; index++) {
                const element = promo[index];
                if ((parseInt(itemDetails.quantity, 10) >= element.cantidad) && (itemDetails.ItemCode === element.idProducto)) {
                    element.newQuantity = parseInt(parseInt(itemDetails.quantity, 10) / element.cantidad);
                    itemsPromo.push(element);
                }
            }
        }
        //##########--- EN LA COMPRA DE CUALQUIERA DE, VALIDA STOCK  ----###################
        for (let index = 0; index < promoEDC.length; index++) {
            const promo = promoEDC[index];
            // console.log('con>*----');
            let sumTotal = 0;
            for (let index = 0; index < promo.length; index++) {
                const element = promo[index];
                if (itemDetails.ItemCode === element.idProducto) {
                    sumTotal += parseInt(itemDetails.quantity, 10);
                }
            }
            if (sumTotal >= promo[0].cantidad) {
                for (let index = 0; index < promo.length; index++) {
                    const elementPromo = promo[index];
                    elementPromo.newQuantity = parseInt(sumTotal / promo[0].cantidad);
                    itemsPromo.push(elementPromo);
                }
            }
        }

        let arrayRelacional = [];
        let itemsBonificacion;
        //  console.log('con<itemsPromo',itemsPromo);
        if (itemsPromo.length > 0) {
            enableSpinner(true);
            itemsBonificacion = await apiClient.getBonificacion(itemsPromo);
            //  console.log('con>itemsBonificacion.data',itemsBonificacion.data);
            enableSpinner(false);
            if (itemsBonificacion.data.length > 0) {
                for (let index = 0; index < itemsPromo.length; index++) {
                    const itemsList = itemsPromo[index];
                    // console.log('con>itemsList',itemsList);
                    for (let index = 0; index < itemsBonificacion.data.length; index++) {
                        const bonificacionList = itemsBonificacion.data[index];

                        for (let index = 0; index < bonificacionList.length; index++) {
                            const element = bonificacionList[index];
                            if (itemsList.bonificacion === element.bonificacion && itemsList.relacion === element.relacion) {
                                let promo = {
                                    itemDisparador: itemsList.idProducto,
                                    tipoDisparador: itemsList.fkSubTipo,
                                    bonificacion: element,
                                    tipoSeleccion: element.idTipoSeleccion,
                                    use: false,
                                    idDisparador: element.disparador,
                                    itemQuantity: itemsList.cantidad,
                                    homeItemQuantity: itemsList.newQuantity,
                                }
                                arrayRelacional.push(promo);
                            }
                        }

                    }
                }

            }
        }
        this.refeshState(arrayRelacional, NotificacionIems);
    };

    renderBonificaciones = (element, ItemCode) => {
        const { deleteItemPromo, itemsReducer: { openItemDetails } } = this.props;
        const { seller } = this.state;
        let item = {
            ItemCode
        }
        let itemRegalo = element.bonificacion;
        let imagesArray = itemRegalo.U_Handel_ImagesArray || '';
        imagesArray = imagesArray.split('|');
        let imagenShow = imagesArray[0] ? (config.BASE_URL + SERVICE_API.getImage + '/' + imagesArray[0]) : require('../../images/noImage.png');
        if (ItemCode === element.itemDisparador) {
            return (
                <div className=''>
                    <div className='container border border-gray rounded'>
                        <div className="row p-2 mb-0" style={{padding: '0.8rem !important'}}>
                            <div className='col-sm-auto text-center'>
                                <div className='row mr-auto'>
                                    <img
                                        onClick={() => openItemDetails(item)}
                                        src={imagenShow}
                                        alt="" style={{ width: '75px', height: '60px' }}
                                    />
                                </div>
                            </div>
                            <div className="col-sm text-center">
                                <div className='container bd-highlight' style={{padding: '1rem !important'}}>
                                    <div className='row'>
                                        <div className='col-lg-2 text-center pt-10'>
                                            <span id={'input-quantity-' + (itemRegalo.idProducto + 1)} style={{color:'rgb(0, 96, 234)'}}>
                                                {itemRegalo.cantidad ? Number(itemRegalo.cantidad) : ''}
                                            </span>
                                        </div>
                                        <div className='col pt-10'>
                                            <p className="mb-0" style={{color:'black'}}>
                                                {itemRegalo.ItemName ?
                                                    (itemRegalo.ItemName).length > 25 ?
                                                        <div>
                                                            <span >{(itemRegalo.ItemName).substring(0, 31)}</span>
                                                            <Popup trigger={<Label className='ItemName bg-transparent'>ver más...</Label >} flowing hoverable position='top center'>
                                                                <Popup.Content>
                                                                    <span className='ItemName'>{itemRegalo.ItemName}</span>
                                                                </Popup.Content>
                                                            </Popup>
                                                        </div>
                                                        : itemRegalo.ItemName
                                                    : " "}
                                            </p>
                                        </div>
                                        <div className='col-md-auto text-center pt-10'>
                                            <span style={{color:'gray'}}>{itemRegalo.idProducto}</span>
                                        </div>
                                        <div className='pt-0'>
                                            <span>
                                                {itemRegalo.idTipoSeleccion === 2 &&
                                                    <i className="fa fa-trash" />}
                                            </span>
                                        </div>
                                        <div>
                                            <span>
                                                {seller && seller.U_FMB_Handel_Perfil !== '0' ? (
                                                    <td>
                                                        {this.validateStockBonificacion(itemRegalo)}
                                                    </td>
                                                ) : (
                                                    ""
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            )
        }
    };

    validateStockBonificacion = item => {
        if ((item.cantidad > item.Stock) && !!item.Stock) {
            return (
                <div className='col-12 font-weight-bold ' style={{ color: 'red', fontSize: 15, padding: 0 }}>
                    El artículo no tiene stock para la bonificación.
                </div>
            )
        }
    };

    render() {
        const { configReducer: { history }, itemsReducer: { itemDetails, deleteShoppingCart, items, updateFavorite, openItemDetails, items2 }, view, images, itemCode } = this.props;
        const { titulo, Comentarios, comentario, rating, Valores, All, Opinion, comentar, itemsRegalos, itemsNotificacion } = this.state;
        const stockDetails = itemDetails?.stockDetails ?? [];
        const showStock = stockDetails ?
            [{ OnHand: stockDetails[0]?.OnHand ?? 0, IsCommited: stockDetails[0]?.IsCommited ?? 0, OnOrder: stockDetails[0]?.OnOrder ?? 0, },
             { OnHand: stockDetails[1]?.OnHand ?? 0, IsCommited: stockDetails[1]?.IsCommited ?? 0, OnOrder: stockDetails[1]?.OnOrder ?? 0, }]
        :   [{ OnHand: 0, IsCommited: 0, OnOrder: 0, }, { OnHand: 0, IsCommited: 0, OnOrder: 0, }];
        itemDetails.files = itemDetails.files || [];
        if (!itemDetails.quantity) {
            itemDetails.quantity = itemDetails.U_MultiploVenta ? itemDetails.U_MultiploVenta : 1
        }
        let sliderDetailsArrayNoDuplicated = items2;
        if (items && items.length > 0) {
            let sliderDetailsArray = [];
            let itemsCopy = items.slice();
            if (itemDetails.U_Handel_Tags) {
                let itemDetailsCopy = itemDetails.U_Handel_Tags.split(/[|,]/);
                itemsCopy.map(item => {
                    itemDetailsCopy.map(itemDetail => {
                        if ((itemDetail && itemDetail != '') && (item.U_Handel_Tags && item.U_Handel_Tags != '')) {
                            if (item.U_Handel_Tags.includes(itemDetail) && item.ItemCode !== itemDetails.ItemCode) {
                                sliderDetailsArray.push(item);
                                return;
                            }
                        }
                    });
                });

                if (sliderDetailsArray.length > 0) {
                    sliderDetailsArrayNoDuplicated = this.removeDuplicates(sliderDetailsArray);
                }
            } else {
                sliderDetailsArrayNoDuplicated = [];
            }
        }
        // Descuentos espec. por cantidad
        let quantityPromo = itemDetails.quantityPromoSN ? itemDetails.quantityPromoSN : itemDetails.quantityPromoPriceList ? itemDetails.quantityPromoPriceList : [];
        const multiplo = itemDetails.U_MultiploVenta ? itemDetails.U_MultiploVenta : 1
        if (!history || itemDetails.length == 0) {
            return <Redirect to="/" />;
        } else {
            return (
                <div id="zoom" className="content-fluid none-scroll" /*zoomMarginTop*/ style={{ backgroundColor: "#fff", marginTop: 146 }}>
                    <NavBar />
                    <OpenOpinionsModal
                        All={All}
                    />
                    <div className="pt-4 text-left">
                        <div className="col-md-12 mt-md-4 botonRegresar"> <h5 className="font-weight-bold TituloCategoria linkFilter" onClick={() => history.goItems()}><span style={{ color: "#0078c0" }}>{'< Regresar     |       '}</span><span style={{ color: "#666666" }}>{itemDetails.ItemName}</span></h5></div>
                    </div>
                    <div className="row justify-content-center borderB-details m-2">
                        <div className="col-md-6 mt-md-2">
                            {/* <div className="text-center">
                                <div className="geeks" style={{ margin: 'auto', padding: 0 }}>
                                    <Carousel autoPlay infiniteLoop showArrows={true}>f
                                        {itemDetails.images.length > 0 ? itemDetails.images.map((imagePath, index) => {
                                            if (imagePath.path) return this.renderCarouselImageMP(imagePath.path, index)
                                        })
                                            :
                                            this.renderCarouselImageMP([require('../../images/noImage.png')], 0)
                                        }
                                    </Carousel>
                                </div>
                            </div> */}
                            <div className='images-main-container'>
                                {itemDetails.images[0]?.path ?
                                    <>
                                        <div>
                                            {itemDetails.images.map((image, index) => (
                                                <img src={image.path} key={image.path} onClick={() => this.setState({ mainImg: index })} />
                                            ))}
                                        </div>
                                        <img src={itemDetails.images[this.state.mainImg].path} onClick={() => this.imageZoom(itemDetails.images[this.state.mainImg].path, this.state.mainImg)} />
                                    </> : <>
                                        <div>
                                            <img src={require('../../images/noImage.png')} />
                                        </div>
                                        <img src={require('../../images/noImage.png')} />
                                    </>
                                }
                            </div>
                        </div>
                        {/* Detalle Caracteristica*/}
                        <div className="Caracteristicas col-md-6 text-left mt-md-2" style={{ color: "rgb(124, 124, 125)", marginTop: 20 }}>
                            <div className="space-line description-main-container">
                                <div className='description-header'>
                                    <div className='tags-container'>
                                        <div className={!itemDetails.U_Descuento && 'hide'} style={{ background: 'red', color: 'white', borderRadius: '7px', width: '60px', padding: '5px 4px', paddingLeft: '15px' }}>-{itemDetails.U_Descuento}%</div>
                                        {itemsRegalos.length > 0 ? (
                                            <img className={itemDetails.U_FMB_Handel_Promo !== '1' && 'hide'} src={config.cardIcons.gift} style={{ maxWidth: '50px' }}  alt='Icono promoción'/>
                                        ): <></> }
                                    </div>
                                    {itemDetails.U_Linea && itemDetails.U_Linea.length > 0 ?
                                        <div>
                                            <span>Marca: </span>
                                            <span style={{ color: '#2eaefd', cursor:'pointer' }} onClick={() => this.searchByCategory(itemDetails?.U_Linea ?? '')}>{itemDetails?.U_Linea ?? ''}</span>
                                            {/* <span style={{ color: '#2eaefd' }}>{itemDetails.U_Linea && itemDetails.U_Linea.length > 0 ? itemDetails.U_Linea[0] : ''}</span> */}
                                        </div>
                                        : <></>
                                    }

                                    <h2 style={{ fontWeight: 'bold' }}>{itemDetails.ItemName}</h2>
                                    <div>
                                        <span>Cód. Prov.</span>
                                        <span style={{ color: 'green' }}>{` ${itemDetails.SuppCatNum}`}</span>
                                    </div>
                                    <div>
                                        <span>Cód. DIASA</span>
                                        <span style={{ color: 'green' }}>{` ${itemDetails.ItemCode}`}</span>
                                    </div>

                                </div>

                                <div>
                                    <div className={itemDetails.PriceBeforeDiscount !== itemDetails.Price ? '' : 'hide'}>
                                        <span>Antes </span>
                                        <span style={{ textDecorationLine: 'line-through', color: 'red', fontSize: '16px', fontWeight: 'bold' }}>$ {itemDetails.PriceBeforeDiscount.toFixed(2)}</span>
                                    </div>
                                    {itemDetails.U_web === 0 || itemDetails.U_web === null ?
                                    <label class="" style={{ fontSize: "18px", color: "#00aa08", fontWeight: 'bolder' }}>Solicite su cotización</label>
                                    : <div style={{ display: 'flex', alignItems: 'end' }}>
                                        <span style={{ fontSize: '40px', color: "rgb(0, 170, 8)", fontWeight: "bolder" }}>$ {itemDetails.Price.toFixed(2)}</span>
                                        <h4 style={{ marginBottom: '10px' }}>MXN</h4>
                                    </div>
                                    }
                                    <div>
                                        <span>Existencia:{' '}</span>
                                        <span style={{ color: '#0303a9' }}>{itemDetails.Available}</span>
                                    </div>
                                    <div>
                                        <span>Múltiplo de venta: {' '}</span>
                                        <span style={{ color: '#0303a9' }}>{itemDetails.U_MultiploVenta ? itemDetails.U_MultiploVenta : '1'}</span>
                                    </div>
                                </div>
                                <div className={itemDetails.U_web === 0 || itemDetails.U_web === null ? '' : 'buttons-description-container'}>
                                    {itemDetails.U_web === 0 || itemDetails.U_web === null ?
                                        <label style={{ fontSize: 16, fontWeight: 'bolder' }}>Llámenos o envíe un correo</label>
                                :<div className='quantity'>
                                        <button
                                            className='button-quantity'
                                            type="button"
                                            value={itemDetails.quantity ? (Number(itemDetails.quantity)).toFixed(0) : multiplo}
                                            onClick={(event) => { this.changLocalQuantity(itemDetails, event, '-') }}
                                        >-</button>
                                        <input
                                            type="text"
                                            // class="form-control  ml-2 mr-2"
                                            placeholder="1"
                                            step={multiplo}
                                            id={'input-quantity'}
                                            value={itemDetails.quantity ? Number(itemDetails.quantity).toFixed(0) : ''}
                                            name={'quantity' + itemDetails.ItemCode}
                                            onChange={(event) => { this.changLocalQuantity(itemDetails, event) }}
                                        />
                                        <button
                                            className='button-quantity'
                                            type="button"
                                            value={itemDetails.quantity ? (Number(itemDetails.quantity)).toFixed(0) : ''}
                                            onClick={(event) => { this.changLocalQuantity(itemDetails, event, '+') }}
                                        >+</button>
                                    </div>
                                    }
                                    {itemDetails.U_web === 0 || itemDetails.U_web === null ? '' :
                                    <button
                                        className='add-cart'
                                        type="button"
                                        value={(itemDetails.quantity ? Number(itemDetails.quantity) : multiplo)}
                                        onClick={(event) => { this.changeQuantityDetails(itemDetails, event) }}
                                    >AGREGAR <img src={config.icons.greenCart} style={{ maxWidth: '25px', pointerEvents: 'none' }} alt='' /></button>
                                    }
                                    {itemDetails.U_web === 0 || itemDetails.U_web === null ? '' :
                                    <button
                                        className='go-cart'
                                        style={{fontSize: '13px'}}
                                        value={(itemDetails.quantity ? Number(itemDetails.quantity) : 1)}
                                        onClick={(event) => { this.directShopping(itemDetails, event) }}
                                        readOnly={itemDetails.Available === 0 || itemDetails.Available === '' ? true : false}
                                    >COMPRAR AHORA</button>
                                    }
                                    <img
                                        alt=''
                                        className='favorites'
                                        src={itemDetails.FAVORITE ? config.cardIcons.redHeart : config.cardIcons.heart}
                                        style={{ maxWidth: '30px', color: 'red', marginLeft:itemDetails.U_web === 0 || itemDetails.U_web === null ? '10px': '0px'}}
                                        fill="red"
                                        onClick={() => this.setFavorite(itemDetails.ItemCode)}
                                    />
                                </div>

                                <div>
                                </div>
                                <div className='files-container'>
                                    {itemDetails.files.map(file => (
                                        <a key={file} href={file.path} target='_blank'>
                                            <img src={config.icons.pdfIcon} style={{ maxWidth: '30px' }} />
                                            <span>{file.name.includes('.pdf') ? file.name.slice(0, -4) : file.name}</span>
                                        </a>
                                    ))}
                                </div>
                                {itemsRegalos.length >0 ? 
                                <>
                                <hr style={{ height: '0.5px', width: '100%', background: '#d3c8c8' }} />
                                <div className='promo-container'>
                                    <img src={config.icons.giftSquare} style={{ maxWidth: '40px' }} />
                                    <span>En la compra de este producto te regalaremos: </span>
                                </div>
                                <div className=''>
                                    <div className='bonificaciones-container' style={{ overflowX: 'auto', overflowY: 'scroll', maxHeight: '300px', marginLeft:'15px', marginRight:'-10px' }}>
                                        {itemsRegalos.map((elemenet) => { return this.renderBonificaciones(elemenet, itemDetails.ItemCode) })}
                                    </div>
                                </div>
                                </>
                                :<></>}
                                
                            </div>
                        </div>
                    </div>
                    {/* AQUI COMIENZA LA DESCRIPCIÓN Y CARACTERÍSTICAS DEL ARTÍCULO */}
                    <div className="pl-1 pr-1 justify-content-left">
                        <div className="Descripciones mb-md-3" style={{ marginTop: "1rem" }}>
                            <ul className="nav nav-tabs mb-4" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" data-mdb-toggle="tab" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home-tab" aria-selected="false">Descripción</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Características</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="profile-tab" data-toggle="tab" href="#stock" role="tab" aria-controls="stock-tab" aria-selected="false">Stock</a>
                                </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show mt-md-3 text-justify" id="home" role="tabpanel" aria-labelledby="home-tab" style={{/*width:"auto !important"*/ marginBottom: "1rem", marginRight: "1rem", marginLeft: "1rem" }}>
                                    <div style={{ maxHeight: "332px", overflow: "auto", backgroundColor: "#fff" }}>{itemDetails.UserText}</div>
                                </div>
                                <div className="tab-pane fade mt-md-3" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                    {/* {itemDetails.U_Color &&
                                        <div>
                                            <a className="">
                                                <span className="nombreCaracteristica"> COLOR:  </span><b><span className="caracteristica">{itemDetails.U_Color}</span></b>
                                            </a>
                                        </div>
                                    } */}
                                </div>
                                <div className="tab-pane fade mt-md-3 text-center" id="stock" role="tabpanel" aria-labelledby="stock-tab">
                                    <div className='overflow-auto bg-white'>
                                        <table class="table table-borderless bg-white text-uppercase">
                                            <thead className='border-bottom'>
                                                <tr className='border-bottom border-2'>
                                                    <th className='text-start' scope="col">Almacén</th>
                                                    <th scope="col">En Almacén</th>
                                                    <th scope="col">En Tránsito</th>
                                                    {/* <th scope="col">Fecha de solicitud</th>
                                                    <th scope="col">Comprometido</th> */}
                                                    <th scope="col">Disponible</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>CENTRO DE DISTRIBUCIÓN SANTA CATARINA</td>
                                                    <td>{showStock[0].OnHand}</td>
                                                    <td>{showStock[0].OnOrder}</td>
                                                    {/* <td>DD/MM/AAAA</td> */}
                                                    {/* <td>{showStock[0].IsCommited}</td> */}
                                                    <td className='text-success'>{(showStock[0].OnHand - showStock[0].IsCommited + showStock[0].OnOrder)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Monterrey</td>
                                                    <td>{showStock[1].OnHand}</td>
                                                    <td>{showStock[1].OnOrder}</td>
                                                    {/* <td>DD/MM/AAAA</td> */}
                                                    {/* <td>{showStock[1].IsCommited}</td> */}
                                                    <td className='text-success'>{(showStock[1].OnHand - showStock[1].IsCommited + showStock[1].OnOrder)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comentarios y calificación del producto */}
                    {/* 
                    SQL=>
                        itemCode||CardCode||puntuación||Comentario
                    Insertes => todos los campos
                    Consultes => AVG (puntuación ) where itemcode = articulo secccionado
                            => comentarios where itemcode = articulo secccionado
                     */}

                    {/**comentarios  */}
                    {config.modules.Comments &&
                        <div className="container-fluid commentProduct">
                            <div className="col-md-11 container-fluid">
                                <div className="nombreArticulo font-weight-bold" style={{ textAlign: 'start' }}>
                                    <p>Opiniones sobre el producto</p>
                                </div>
                                <div className="text-center" style={{ display: Opinion === false ? 'block' : 'none', color: '#959595' }}>
                                    <h1>¡Nada por aquí!</h1>
                                    <br></br>
                                    <h2>Este producto aún no tiene opiniones</h2>
                                </div>

                                <div className=" justify-content-left pt-4" style={{ display: Opinion === true ? 'block' : 'none' }}>
                                    <div className="">
                                        <div className="col">
                                            {!!Valores && Valores.map((prom, index) => {
                                                return (
                                                    <div key={index}>
                                                        <span className="califProducto">{parseFloat(prom.Promedio || 0).toFixed(1)}</span >
                                                        <ReactStars
                                                            count={5}
                                                            value={parseInt(prom.Promedio || 0)}
                                                            edit={false}
                                                            size={60}
                                                            isHalf={true}
                                                            emptyIcon={<i className="far fa-star"></i>}
                                                            halfIcon={<i className="fa fa-star-half-alt"></i>}
                                                            fullIcon={<i className="fa fa-star"></i>}
                                                            activeColor="#ffd700"
                                                        />
                                                        <span className="promedioProducto">Promedio entre {parseInt(prom.NumCommnt)} opiniones</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div><hr />
                                <div style={{ display: Opinion === true ? 'block' : 'none' }}>
                                    <div className="row">
                                        <div className="col">
                                            {!!Comentarios && Comentarios.map((raiting, index) => {
                                                return (
                                                    <div>
                                                        <div style={{ paddingBottom: 0 }}>
                                                            <ReactStars
                                                                count={5}
                                                                onChange={(event) => { this.ratingChanged(event) }}
                                                                value={raiting.calificacion}
                                                                edit={false}
                                                                size={30}
                                                                isHalf={true}
                                                                emptyIcon={<i className="far fa-star"></i>}
                                                                halfIcon={<i className="fa fa-star-half-alt"></i>}
                                                                fullIcon={<i className="fa fa-star"></i>}
                                                                activeColor="#ffd700"
                                                            />
                                                        </div>
                                                        {/* <br></br> */}
                                                        <label><b>{raiting.titulo}</b></label>
                                                        <div className="text-justify" id="comment" role="tabpanel" aria-labelledby="home-tab" style={{ paddingBottom: 20 }}>
                                                            <div style={{ maxHeight: "332px", overflow: "scroll" }}>{raiting.comentario}</div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            }
                                        </div>
                                    </div>
                                    <u onClick={() => this.OpenOpinions()}>Ver todas las opiniones</u>
                                </div>
                                <div style={{ display: comentar === true ? 'block' : 'none' }}>
                                    <div className="row" style={{ justifyContent: "center", alignItems: "center" }}>
                                        <div className="col-lg-3">
                                            <ReactStars
                                                count={5}
                                                onChange={(event) => { this.ratingChanged(event) }}
                                                value={rating}
                                                size={60}
                                                isHalf={true}
                                                emptyIcon={<i className="far fa-star"></i>}
                                                halfIcon={<i className="fa fa-star-half-alt"></i>}
                                                fullIcon={<i className="fa fa-star"></i>}
                                                activeColor="#ffd700"
                                            />
                                        </div>
                                        <div className="col-lg-3 nuevoComentario">
                                            <label>Escribe un comentario.</label>
                                            <input type="text" className="form-control" name="titulo" placeholder="Pon aqui el título" autoComplete="off" onChange={this.handelChange} value={titulo ? titulo : ''} />
                                            <textarea placeholder="Coloque aquí su comentario" name="comentario" value={comentario ? comentario : ''} className="form-control mt-2" onChange={this.handelChange} />
                                            <div className="buttonEnviar mt-2">
                                                <button type="button" className="btn" onClick={(event) => { this.sendComment(itemDetails) }}>
                                                    Enviar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    {/**funcion y validacion para pintatr los productos */}
                    <div className="justify-content-center">
                        <div className="col-md-12">
                            <div style={{ paddingTop: 15, paddingBottom: 15 }}>
                                <div style={{ paddingTop: 30, paddingBottom: 100, margin: 0, justifyContent: "center", alignItems: "center" }}>
                                    <h2>Productos Relacionados</h2>
                                    {sliderDetailsArrayNoDuplicated &&
                                        sliderDetailsArrayNoDuplicated.length !== 0 ? (
                                        <ItemSlider
                                            relatedItems={sliderDetailsArrayNoDuplicated}
                                            changeQuantity={this.changeQuantity}
                                            dashboard={30}
                                            changeBackOrder={this.changeBackOrder}
                                        />
                                        /*
                                        <ItemSlider
                                            items={sliderDetailsArrayNoDuplicated}
                                            updateFavorite={updateFavorite}
                                            openDetails={openItemDetails}
                                            changeQuantity={this.changeQuantity}
                                            deleteShoppingCart={deleteShoppingCart}
                                            changeBackOrder={this.changeBackOrder}
                                            dashboard={30}
                                        />
                                        */
                                    ) : (
                                        <div style={{ paddingTop: 100, paddingBottom: 100, margin: 0, textAlign: "center" }}>No existen más artículos relacionados con esta categoría:
                                            <br />
                                            <br />
                                            <i style={{ fontSize: 70 }} className={config.icons.search}></i>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* : <div style={{ paddingTop: 15, paddingBottom: 15}}>
                                <div  style={{ paddingTop: 30, paddingBottom: 100, margin: 0, justifyContent: "center", alignItems: "center" }}>
                                    {sliderDetailsArrayNoDuplicated &&
                                        sliderDetailsArrayNoDuplicated.length !== 0 ? (
                                            <ItemSliderResponsive
                                                items={sliderDetailsArrayNoDuplicated}
                                                updateFavorite={updateFavorite}
                                                openDetails={openItemDetails}
                                                changeQuantity={this.changeQuantity}
                                                deleteShoppingCart={deleteShoppingCart}
                                                changeBackOrder={this.changeBackOrder}
                                            />
                                        ) : (
                                            <div style={{ paddingTop: 100, paddingBottom: 100, margin: 0, textAlign: "center" }}>No existen más ARTÍCULOS relacionados con esta categoría:
                                                <br />
                                                <br />
                                                <i style={{ fontSize: 70 }} className={config.icons.search}></i>
                                            </div>
                                        )}
                                </div>
                            </div>} */}
                        </div>
                    </div>
                    <div className="modalImagen">
                        <div id="myModal" className="modal">
                            <div className="modal-content">
                                <img id="img01" />
                                <span className="close" onClick={this.cerrarModalImage}>&times;</span>
                            </div>
                        </div>
                    </div>
                    {/* <button onClick={() => { console.log(this.props) }}>Pruebas</button> */}
                </div>
            );
        }
    }
}

const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
        shoppingCartReducer: store.ShoppingCartReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
        setIdCategory: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value }), 
        setItemDetailsSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEM_DETAILS, value }),
        setItemsSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEMS, value }),
        setItemsSearch1: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEMS1, value }),
        setItemsSearch2: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEMS2, value }),
        setNextPage: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_NEXTPAGE, value }),
        setLocation: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_LOCATION, value }),
        setItemsFilters: value => dispatch({type: DISPATCH_ID.ITEMS_SET_UNIQUE_FILTER, value}), 
        setSearchCategoryObj: value => dispatch({ type: DISPATCH_ID.ITEMS_CATEGORY_SEARCH, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemsDetailsView);