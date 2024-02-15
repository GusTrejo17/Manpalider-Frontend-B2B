import React, { Component } from 'react';
import { config, SERVICE_API, VIEW_NAME, DISPATCH_ID } from "../libs/utils/Const";
import CurrencyFormat from 'react-currency-format';
import { connect } from "react-redux";
import '../index.css';
import $ from 'jquery';
import { ApiClient } from "../libs/apiClient/ApiClient";
import ReactTooltip from 'react-tooltip';
import Tooltip from 'react-light-tooltip'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { Promociones } from '../components/index';

let apiClient = ApiClient.getInstance();


class ShoppingCartList extends Component {
    state = {
        promo: [],
        itemPromo: [],
        promociones: [],
        seller: JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser')),
        selected: [],        
        allSelected: false,
        typingTimeout: 0
    }

    componentDidMount = async () => {
        $(document).ready(function () {
            $('[data-toggle="popover"]').popover();
        });
        await this.cargarDatos();
    };

    // componentDidUpdate() {
    //     const {backOrder,data,changeBckOrdr} = this.props        
    //     if(backOrder){
    //         let isBck = false
    //         for (let index = 0; index < data.length; index++) {
    //             const itm = data[index];
    //             if(itm.OnHandPrincipal === 0){
    //                 isBck = true
    //                 index = data.length
    //             }
    //         }
    //         if(isBck){
    //             changeBckOrdr('SI')
    //         }else{
    //             changeBckOrdr('NO')
    //         }
    //     }
    // }
    cargarDatos = async () => {
        let user = localStorage.getItem(config.general.localStorageNamed + 'CurrentUser');
        user = JSON.parse(user) || {};
        let datos = {
            CardCode: user.CardCode,
            Canal: user.U_SYP_RICO_CCANAL || '',
            Region: user.U_SYP_RICO_CREGION || '',
            SubCanal: user.U_SYP_RICO_CSBCAN || ''
        }
        let newdatas = await apiClient.getPromo(datos);
        // console.log('con<<<****',newdatas.data);
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

    validateDisparador = async () => {
        const { promociones } = this.state;
        // const {enableSpinner, shoppingCartReducer: {items}} = this.props;
        const { enableSpinner, data, refeshState } = this.props;
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
                    for (let index = 0; index < data.length; index++) {//----Articulos por promoción
                        const item = data[index];
                        if (item.ItemCode === disparador.idProducto) {
                            arrayItems.push(disparador);
                        }
                    };
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
                for (let index = 0; index < data.length; index++) {
                    const item = data[index];
                    if ((parseInt(item.quantity, 10) >= element.cantidad) && (item.ItemCode === element.idProducto)) {
                        element.newQuantity = parseInt(parseInt(item.quantity, 10) / element.cantidad);
                        itemsPromo.push(element);
                    }
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

                for (let index = 0; index < data.length; index++) {
                    const item = data[index];

                    if (item.ItemCode === element.idProducto) {
                        sumTotal += parseInt(item.quantity, 10);
                    }

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
        //  console.log('con<arrayRelacional',arrayRelacional);
        refeshState(arrayRelacional, NotificacionIems);
    };

    changeQuantity = async (index, item, event) => {
        const { changeQuantity, notificationReducer: { showAlert } } = this.props;
        let newQuantity;
        if(!event || !event.nativeEvent) {
            newQuantity = item.quantity;
        }else{
            newQuantity = event.nativeEvent.target.value;
        }
        let onHand = item.Available;

        if (newQuantity == "" || Number(newQuantity) < 1) {
            // showAlert({type: 'warning', message: "No ha ingresado una cantidad.", timeOut: 2500});
            // newQuantity = 1;
            return;
        }

        let flag = true;
        let noEntrar = true;

        let piv1 = 0;
        let piv2 = 0;
        if (item.quantity == 0 || item.quantity == "0" || item.quantity == "") {
            showAlert({ type: 'warning', message: 'El artículo ' + item.ItemCode + ' no puede ir en cantidad 0', timeOut: 5000 });
            return;
        }
        if (item.U_MultiploVenta !== null && item.U_MultiploVenta !== 0) {
            let multiplo = parseInt(item.quantity) % item.U_MultiploVenta;
            if (multiplo == 0) {
                // showAlert({type: 'success', message: 'El artículo ' + element.ItemCode + ' si es multiplo', timeOut: 5000});
                flag = true;
            } else {
                piv1 = parseInt(item.quantity);
                piv2 = parseInt(item.quantity);

                while (piv1 % item.U_MultiploVenta !== 0) {
                    piv1++;
                }
                let result1 = piv1 - parseInt(item.quantity);

                while (piv2 % item.U_MultiploVenta !== 0) {
                    piv2--;
                }
                // let result2 = piv2 - parseInt(item.quantity);
                newQuantity = Number(newQuantity) + Number(result1);
                showAlert({ type: 'info', message: 'Al artículo ' + item.ItemCode + '-' + item.ItemName + ' se le agregaron ' + result1 + ' unidades para a completar el múltiplo sugerido', timeOut: 8000 });// o compra +piv1
                // showAlert({ type: 'error', message: 'Al artículo ' + item.ItemCode + ' le faltan ' + result1 + ' unidades', timeOut: 8000 });// o compra +piv1
                flag = false;
                noEntrar = false;
            }
        }        
        let user = localStorage.getItem(config.general.localStorageNamed + 'CurrentUser');
        user = JSON.parse(user) || {};

        let data = {
            CardCode: user.CardCode
        }

        await apiClient.getDescuento(data).then(result => {
            this.setState({
                promo: result.data
            })
        });

        // color azul rinti
        // document.getElementById(item.ItemCode).style.backgroundColor = "#005DA8";
        // document.getElementById(item.ItemCode).style.borderColor = "#005DA8";

        changeQuantity(index, item, newQuantity, true); // add
        this.validateDisparador();
    };


    //BOTON AGREGAR AL CARRITO

    changLocalQuantity = (index, item, event) => {
        // const {shoppingCartReducer: { items },setShoppingCart } = this.props;
        // let newQuantity =  event.nativeEvent.target.value;
        // if (newQuantity % 1 == 0) {
        //     items.map( itemLocal => {
        //         if (itemLocal.ItemCode === item.ItemCode) {
        //             itemLocal.quantity = newQuantity;
        //         }
        //     });
        //      // color success
        //     document.getElementById(item.ItemCode).style.backgroundColor = "#28a745"; 
        //     document.getElementById(item.ItemCode).style.borderColor = "#28a745"; 
        //     setShoppingCart(items);
        // }
        // else{
        //     return;
        // }
        //se limpia el timer cada que se accede a la funcion 
        clearTimeout(this.state.typingTimeout);
        const { shoppingCartReducer: { items }, setShoppingCart, notificationReducer: { showAlert }, backOrder} = this.props;
        let newQuantity = event.nativeEvent.target.value;

        if (newQuantity % 1 == 0) {
            items.map(items => {
                if (items.ItemCode === item.ItemCode) {
                    if (parseInt(newQuantity) === parseInt(item.Available) + 1) {
                        showAlert({ type: 'warning', message: "Se excede el número de articulos disponibles en stock.", timeOut: 2500 });
                        items.quantity = newQuantity;
                    } else {
                        items.quantity = newQuantity;
                    }

                }
            });
            setShoppingCart(items);
            //se crea uno nuevo para que al dejar de escribir se ejecute la funcion changeQuantity
            const newTimeout = setTimeout(() => {
                this.changeQuantity(index, item, event);
            }, 1250);

            this.setState({ typingTimeout: newTimeout });
        }
        else {
            return;
        }

    }

    //////////////////////////

    validateQuantity = (index, item, e) => {
        if (!e.target.value) {
            let event = {
                nativeEvent: {
                    target: {
                        value: 1,
                    }
                }
            };
            this.changeQuantity(index, item, event);
        }
    };

    validateStock = item => {
        if ((item.quantity > item.Available) && !!item.Available) {
            return (
                <div className='col-12' style={{ color: 'red', fontSize: 15, padding: 0 }}>
                    La cantidad seleccionada excede la existencia.
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

    deleteItemLocal = async ({ item = null, deleteAll = null }) => {
        const { deleteItem } = this.props;
        await deleteItem({ item, deleteAll: false });
        this.validateDisparador();
    };

    renderBonificaciones = (element, ItemCode) => {
        const { deleteItemPromo,itemsReducer : { openItemDetails } } = this.props;
        const { seller } = this.state;
        let item = {
            ItemCode
        }
        let itemRegalo = element.bonificacion;
        let imagesArray = itemRegalo.U_Handel_ImagesArray || '';
        imagesArray = imagesArray.split('|');
        let imagenShow = imagesArray[0] ? (config.BASE_URL + SERVICE_API.getImage + '/' + imagesArray[0]) : require('../images/noImage.png');
        if (ItemCode === element.itemDisparador) {
            return (
                
                <div className='row'>
                    <div className='col-sm-2' style={{ margin: 0,cursor:'pointer' }}>
                        <img
                            onClick={() => openItemDetails(item)}
                            className="img-fluid "
                            style={{
                                backgroundColor: 'white',
                                maxHeight: 80
                            }}
                            src={imagenShow}
                            alt=""
                        />
                    </div>
                    <div className='col-sm-10'>
                        <div className="container p-0">
                            <div className="row">
                                <div className="col-12" style={{}}>
                                    <div className='text-left'>
                                        {itemRegalo.ItemName}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 table-responsive" style={{marginTop:'6px', marginBottom:'6px'}}>
                                    <table className="table">
                                        <thead style={{ textAlign: "-webkit-center" }}>
                                            <tr >
                                                <th scope="col" style={{ padding: '0px' }}>Código</th>
                                                <th scope="col" style={{ padding: '0px' }}>Cantidad</th>
                                                {seller ? seller.U_FMB_Handel_Perfil != '0' ?
                                                    <th scope="col" style={{ padding: '0px' }}></th>
                                                    : "" : ""
                                                }
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <td style={{ padding: '0px' }}>
                                                <i className="fa fa-gift" data-toggle="tooltip" title={'Artículo de regalo'} style={{ cursor: 'pointer', paddingRight: "5px", color: '#005DA8' }} />
                                                {itemRegalo.idProducto}
                                            </td>
                                            <td style={{ padding: '0px' }}>

                                                <input
                                                    disabled={true}
                                                    id={'input-quantity-' + itemRegalo.idProducto + 1}
                                                    type="number"
                                                    min="1"
                                                    value={itemRegalo.cantidad ? Number(itemRegalo.cantidad) : ''}
                                                    className="form-control"
                                                    name={'quantity' + itemRegalo.idProducto}
                                                    placeholder="Cantidad"
                                                    style={{ textAlign: 'center' }} />
                                            </td>
                                            <td style={{ padding: '0px' }}>
                                                {itemRegalo.idTipoSeleccion === 2 &&
                                                    <i className="fa fa-trash" style={{ cursor: 'pointer' }} onClick={() => deleteItemPromo(element)} />}
                                            </td>
                                            {seller ? seller.U_FMB_Handel_Perfil != '0' ?
                                                <td style={{ padding: '0px' }}>
                                                    {this.validateStockBonificacion(itemRegalo)}
                                                </td>
                                                : "" : ""
                                            }
                                            <td></td>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    };

    renderBoxesProm = (itemPromo, itemCode) => {
        const { selectItemsPromo } = this.props;
        if ((itemPromo.itemDisparador === itemCode) && itemPromo.tipoSeleccion === 2) {
            return (
                <i className="fas fa-box-open" data-toggle="tooltip" title={itemPromo.bonificacion.nombre} style={{ cursor: 'pointer', paddingRight: "5px", color: '#28a745', fontSize: 'x-large' }} onClick={() => selectItemsPromo(itemPromo, itemCode)} />
            )
        }
    };

    // ########## REGION Modificar precio, descuento, total ##########
    changePriceItem = async (index, item, event) => {
        const { shoppingCartReducer: { items }, setShoppingCart, notificationReducer: { showAlert } } = this.props;
        let price = event.nativeEvent.target.value;

        if (!isNaN(price)) {
            items.map(items => {
                if (items.ItemCode === item.ItemCode) {
                    items.PriceBeforeDiscount = price;
                    items.Price = price;
                }
            });
            setShoppingCart(items);
        } else {
            showAlert({ type: 'warning', message: "Carácter no permitido" });
            return;
        }
    }

    changeLocalPrice = async (index, item, event) => {
        const { changeQuantity, shoppingCartReducer: { items }, setShoppingCart, notificationReducer: { showAlert } } = this.props;
        let price = event.nativeEvent.target.value;
        if (!isNaN(price)) {
            showAlert({ type: 'warning', message: "Los cambios realizados se veran reflejados" });
            item.PriceBeforeDiscount = price;
            item.Price = price;
            item.UpdateShopping = true;
            changeQuantity(index, item, item.quantity, true); // add
        }
    };

    changeDiscountItem = async (index, item, event) => {
        const { shoppingCartReducer: { items }, setShoppingCart, notificationReducer: { showAlert } } = this.props;

        let DiscPrcnt = event.nativeEvent.target.value;
        if (!isNaN(DiscPrcnt)) {
            items.map(items => {
                if (items.ItemCode === item.ItemCode) {
                    items.DiscountPercentSpecial = DiscPrcnt;
                }
            });
            setShoppingCart(items);
        } else {
            showAlert({ type: 'warning', message: "Carácter no permitido" });
            return;
        }
    }

    changeLocalDiscount = async (index, item, event) => {
        const { changeQuantity, shoppingCartReducer: { items }, setShoppingCart, notificationReducer: { showAlert } } = this.props;
        let DiscPrcnt = event.nativeEvent.target.value;
        if (!isNaN(DiscPrcnt)) {
            showAlert({ type: 'warning', message: "Los cambios realizados se veran reflejados" });
            item.DiscountPercentSpecial = parseFloat(DiscPrcnt).toFixed(2);
            item.UpdateShopping = true;
            changeQuantity(index, item, item.quantity, true); // add
        }
    };

    changeTotalItem = async (index, item, event) => {
        const { shoppingCartReducer: { items }, setShoppingCart, notificationReducer: { showAlert } } = this.props;
        let total = event.nativeEvent.target.value
        //  Se calcula el porcentaje de descuento en base al nuevo total asignado
        //              total nuevo             Antiguo total     
        // console.log("conF ###### ", item.beforeTotal, '|',(total * 100) / item.beforeTotal)
        let DiscPrcnt = 100 - ((total * 100) / item.beforeTotal)
        if (!isNaN(DiscPrcnt)) {
            items.map(items => {
                if (items.ItemCode === item.ItemCode) {
                    items.DiscountPercentSpecial = DiscPrcnt;
                    items.newTotal = total;
                }
            });
            setShoppingCart(items);
        } else {
            showAlert({ type: 'warning', message: "Carácter no permitido" });
            return;
        }
    }

    changeLocalTotalItem = async (index, item, event) => {
        const { changeQuantity, shoppingCartReducer: { items }, setShoppingCart, notificationReducer: { showAlert } } = this.props;
        let total = event.nativeEvent.target.value
        //  Se calcula el porcentaje de descuento en base al nuevo total asignado
        //              total nuevo             Antiguo total     
        // let DiscPrcnt = 100 - ((total*100) / (item.priceTax * parseInt(item.quantity))) ;
        // if (!isNaN(DiscPrcnt)) {
        //     item.DiscountPercentSpecial = DiscPrcnt;
        //     items.newTotal = total;
        // }
        if (!isNaN(total)) {
            showAlert({ type: 'warning', message: "Los cambios realizados se veran reflejados" });
            item.UpdateShopping = true;
            changeQuantity(index, item, item.quantity, true); // add
        }

    };
    // ######### FIN REGION ###############

    changeSelection=(event)=>{
        const {changeItemsToDelete,itemsToDelete}=this.props
        const {selected}=this.state

        const index = itemsToDelete.indexOf(event.id);
        if (index === -1) {
            changeItemsToDelete(event.id, index)
        }else{
            changeItemsToDelete(event.id, index)
        }
    }

    render() {
        const { backOrder, data, view, deleteItemPromo, sendTo, itemsReducer: { addShoppingCart, deleteShoppingCart,openItemDetails }, shoppingCartReducer: { items }, itemPromociones, selectItemsPromo, itemsRegalos, itemsRegalosSelect, itemDisparador, boxes, itemsNotificacion, allItems,itemsToDelete} = this.props;
        const { seller,selected } = this.state;
       
        let valor = seller ? seller.U_FMB_Handel_Perfil : '0';
        let modificarPrecio = seller ? seller.U_FMB_Handel_Precio : '0';
        let modificarDescuento = seller ? seller.U_FMB_Handel_Desc : '0';
        
    
        return (
            <div>
                {/* overflowY:'auto' */}
                <div >
                    {data.map((item, index) => {
                        // Arreglo de imagenes del campo extra
                        let imagesArray = item.U_Handel_ImagesArray || '';
                        imagesArray = imagesArray.split('|');
                        let imagenShow = imagesArray[0] ? (config.BASE_URL + SERVICE_API.getImage + '/' + imagesArray[0]) : require('../images/noImage.png');
                        item.priceTax = (Number(item.Price).toFixed(2) * ((Number(item.taxRate) / 100) + 1)) * item.quantity
                        // item.newTotal = parseFloat(item.newTotal).toFixed(2)
                        item.Price = Number(item.Price).toFixed(2)
                        // item.newTotal = parseFloat(item.newTotal).toFixed(2);
                        // item.DiscountPercentSpecial = parseFloat(item.DiscountPercentSpecial).toFixed(2);
                        // item.PriceBeforeDiscount = parseFloat(item.PriceBeforeDiscount).toFixed(2);
                        // let condition = (backOrder ? Number(item.quantity) > item.Available : Number(item.quantity) <= item.Available )
                        let condition = true;
                        if (condition) {
                            return (
                                <div key={index} className='text-left card m-2 scrollshadow' style={{ border: 'none', minWidth: "100rem"}} >
                                    <div className='row' style={{ textAlign: 'center' }}>
                                        {/* {item.U_FMB_Handel_Promo !== null && item.U_FMB_Handel_Promo !== '' && item.U_FMB_Handel_Promo !== 'null' && 
                                            <div className='col-12' style={{marginBottom: 5, padding: 5, backgroundColor: config.navBar.backgroundColor, color: config.navBar.textColor}}>
                                                Promoción--
                                            </div>
                                        } */}
                                        <div className='col-sm-2' style={{ margin: 0, alignSelf: 'center',cursor:'pointer' }}>
                                            <input className='m-3 mr-5' 
                                            type='checkbox' 
                                            id={item.ItemCode}
                                            value={item.ItemCode}
                                            checked={itemsToDelete.includes(item.ItemCode)} 
                                            //  name={"itemShoppingCart"+index} 
                                             onChange={(event)=>this.changeSelection(event.nativeEvent.target)}></input>
                                            <img
                                                onClick={() => openItemDetails(item)}
                                                className="img-fluid"
                                                style={{ backgroundColor: 'white', maxHeight: 80 }}
                                                src={imagenShow}
                                                alt="Imagen del producto"
                                            />

                                            {itemsNotificacion.map((element) => {
                                                return (
                                                    <div className="input-group details">
                                                        {item.ItemCode === element.idProducto &&
                                                            <Promociones
                                                                itemsNotificacion={element.notificacion} />}
                                                    </div>
                                                )
                                            })
                                            }
                                        </div>

                                        <div className='col-sm-10'>
                                            <div className="container p-0">
                                                {/* { Number(item.quantity) > item.OnHandPrincipal &&
                                                    <div className="col-12" style={{marginBottom: 5, padding: 5, color: 'red'}}>
                                                        Stock insuficiente
                                                    </div>
                                                } */}
                                                <div className="row">
                                                    <div className="col-12" style={{ display: 'flex' }}>
                                                        <div className='text-left' style={{ color: "#808080" }}>
                                                            {item.ItemName}
                                                        </div>
                                                        {Number(item.quantity) > item.Available &&
                                                            <div className="text-right ml-5" style={{ color: 'red' }}>
                                                                Stock insuficiente
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <table className="table m-0">
                                                            <thead style={{ textAlign: "-webkit-center", fontSize: 13 }}>
                                                                <tr>
                                                                    <th style={{ padding: '0px 5px 0px 5px', minWidth: '8rem', width: '8rem', maxWidth: '8rem' }}>Código</th>
                                                                    <th style={{padding: '0px', minWidth: '8rem', maxWidth: '8rem', width: '8rem'}}>Marca</th>
                                                                    {item.SuppCatNum !== null ? <th style={{ padding: '0px', minWidth: '8rem', maxWidth: '8rem', width: '8rem' }}> Cód. Fabricante </th> : ''}
                                                                    <th style={{ padding: '0px 5px 0px 5px', width: '6rem' }}>Cantidad</th>
                                                                    <th style={{ padding: '0px 5px 0px 5px', width: '6rem' }}>Multiplo</th>
                                                                    {/* <th style={{ padding: '0px 5px 0px 5px', width: '12rem' }}>Información de Cantidades</th>
                                                                    <th style={{ padding: '0px 5px 0px 5px', width: '12rem' }}>Stock Almacén CP</th> */}
                                                                    {seller ? seller.U_FMB_Handel_Perfil != '0' ?
                                                                        <th style={{ padding: '0px 5px 0px 5px', width: '7rem' }}>Cant. Disponible</th>
                                                                        : "" : ""
                                                                    }
                                                                    {seller ? seller.U_FMB_Handel_Perfil !== '0' ?
                                                                        <th style={{ padding: '0px 5px 0px 5px', width: '8rem' }}>Precio de Lista</th>
                                                                        : "" : ""
                                                                    }
                                                                    {seller ? seller.U_FMB_Handel_Perfil != '0' ?
                                                                        <th style={{ padding: '0px 5px 0px 5px', width: '8rem' }}>Precio</th>
                                                                        : "" : ""
                                                                    }
                                                                    {valor != '0' && item.DiscountPercentSpecial !== undefined &&
                                                                        <th style={{ padding: '0px 5px 0px 5px', width: '5rem' }}>% Descuento</th>
                                                                    }
                                                                    {item.DiscountPercentSpecial !== undefined &&
                                                                        <th style={{ padding: '0px 5px 0px 5px', width: '8rem' }}>{valor != '0' ? 'Precio con descuento' : 'Precio'}</th>
                                                                    }

                                                                    <th style={{ padding: '0px 5px 0px 5px', width: '8rem' }}>Precio con IVA</th>
                                                                    <th style={{ padding: '0px 5px 0px 5px', width: '8rem' }}>Total sin IVA</th>
                                                                    <th style={{ padding: '0px 5px 0px 5px', width: '8rem' }}>Total con IVA</th>
                                                                    <th ></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {/* Código */}
                                                                <td style={{ color: "#0076B8", width: '8rem', minWidth: '8rem', maxWidth: '8rem' }}>
                                                                    {item.ItemCode}
                                                                </td >
                                                                {/* Marca */}
                                                                <td style={{ color: "#0076B8", width: '8rem', minWidth: '8rem', maxWidth: '8rem' }}>
                                                                    {item.U_Linea !== null && item.U_Linea !== undefined && item.U_Linea.trim() !== '' ? item.U_Linea : ''}
                                                                </td>
                                                                {/* Cód. Fabricante */}
                                                                {item.SuppCatNum !== null ?
                                                                    <td style={{ color: "#0076B8", width: '8rem', minWidth: '8rem', maxWidth: '8rem' }}>
                                                                        {item.SuppCatNum}
                                                                    </td>
                                                                    : ''
                                                                }
                                                                {/* Cantidad */}
                                                                <td style={{ width: '6rem' }}>
                                                                    <input
                                                                        // disabled={!(!!item.OnHandPrincipal)}
                                                                        id={'input-quantity-' + item.ItemCode + index}
                                                                        type="number" min={item.U_MultiploVenta}
                                                                        value={item.quantity >0 ? Number(item.quantity) :
                                                                            " "}
                                                                        className="form-control mb-1" name={'quantity' + item.ItemCode}
                                                                        // placeholder="1" 

                                                                        style={{ textAlign: 'center', borderRadius: 20, borderColor: "#666666", color: "#666666", minWidth: "6rem" }}
                                                                        // onChange={(event) => {  this.changeQuantity(index, item, event) }}
                                                                        // onBlur={(e) => this.validateQuantity(index, item, e)} 
                                                                        onChange={(event) => { this.changLocalQuantity(index, item, event) }}
                                                                        //onBlur={(event) => { this.changeQuantity(index, item, event) }}
                                                                    />
                                                                </td>
                                                                {/* Multiplo */}
                                                                <td style={{ color: "#0076B8", width: '8rem', minWidth: '8rem', maxWidth: '8rem' }}>
                                                                {item.U_MultiploVenta ? item.U_MultiploVenta: '1'}
                                                                </td>
                                                                {/* Cant. Disponible */}
                                                                {seller ? seller.U_FMB_Handel_Perfil != '0' ?
                                                                    <td
                                                                        style={{ width: '7rem' }}
                                                                    >
                                                                        {item.Available}
                                                                    </td>
                                                                    : "" : ""
                                                                }
                                                                {/*Precio de Lista*/}
                                                                {seller ? seller.U_FMB_Handel_Perfil !== '0' ?
                                                                    <td style={{ color: "#666666", width: '8rem' }}>
                                                                    <CurrencyFormat
                                                                        value={item.PriceECommerce || 0}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        fixedDecimalScale={true}
                                                                        decimalScale={2}
                                                                        prefix={'$'}>
                                                                    </CurrencyFormat>
                                                                </td>:"":""
                                                                }
                                                                {/* Precio */}
                                                                {valor != '0' && modificarPrecio === '1' ?
                                                                    <td style={{ color: "#666666", width: '8rem' }}>
                                                                        <input
                                                                            type="text"
                                                                            className=" form-control validarCant cantBlur btn-outline-secondary"
                                                                            // disabled={!editar ? true : false}
                                                                            style={{
                                                                                backgroundColor: valor != '0' ? '#ededed' : 'transparent',
                                                                                borderColor: '#ced4da',
                                                                                color: '#000',
                                                                                paddingTop: 1,
                                                                                paddingBottom: 2,
                                                                                width: '8rem',
                                                                                textAlign: "center",
                                                                            }}
                                                                            id={'itemPrice' + index}
                                                                            // value={parseFloat(item.PriceBeforeDiscount).toFixed(2)}
                                                                            value={(item.PriceBeforeDiscount)}
                                                                            onChange={event => this.changePriceItem(index, item, event)}
                                                                            onBlur={(event) => { this.changeLocalPrice(index, item, event) }}
                                                                        // onFocus={(event) => event.target.select()}
                                                                        />
                                                                    </td>
                                                                    :
                                                                    valor != '0' &&
                                                                    <td style={{ color: "#666666", width: '8rem' }}>
                                                                        <CurrencyFormat
                                                                            value={item.PriceBeforeDiscount || 0}
                                                                            displayType={'text'}
                                                                            thousandSeparator={true}
                                                                            fixedDecimalScale={true}
                                                                            decimalScale={2}
                                                                            prefix={'$'}>
                                                                        </CurrencyFormat>
                                                                    </td>
                                                                }
                                                                {/* {item.DiscountPercentSpecial !== undefined && item.DiscountPercentSpecial != 0 &&
                                                                    <td style={{color: "#666666"}}>
                                                                        <CurrencyFormat
                                                                        value={item.PriceTaxBeforeDiscount || 0}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        fixedDecimalScale={true}
                                                                        decimalScale={2}
                                                                        prefix={'$'}>
                                                                        </CurrencyFormat>
                                                                    </td>
                                                                } */}
                                                                {/* % Descuento */}
                                                                {valor != '0' && modificarDescuento === '1' && item.DiscountPercentSpecial !== undefined
                                                                    ?
                                                                    <td scope="col">
                                                                        <input
                                                                            type="text"
                                                                            className=" form-control validarCant cantBlur btn-outline-secondary"
                                                                            // disabled={!editar ? true : false}
                                                                            style={{
                                                                                backgroundColor: valor != '0' ? '#ededed' : 'transparent',
                                                                                borderColor: '#ced4da',
                                                                                color: '#000',
                                                                                paddingTop: 1,
                                                                                paddingBottom: 2,
                                                                                width: '5rem',
                                                                                textAlign: 'right',
                                                                            }}
                                                                            id={'itemDiscPrcnt' + index}
                                                                            // value={parseFloat(item.DiscountPercentSpecial).toFixed(2)}
                                                                            value={(item.DiscountPercentSpecial)}
                                                                            onChange={event => this.changeDiscountItem(index, item, event)}
                                                                            onBlur={(event) => { this.changeLocalDiscount(index, item, event) }}
                                                                        />
                                                                    </td>
                                                                    :
                                                                    item.DiscountPercentSpecial !== undefined && valor != '0' && item.DiscountPercentSpecial !== undefined &&
                                                                    <td scope="col">{item.DiscountPercentSpecial} %</td>
                                                                }
                                                                {/* Precio con descuento o Precio */}
                                                                {item.DiscountPercentSpecial !== undefined &&
                                                                    <td style={{ color: "#666666", width: "8rem" }}>
                                                                        <CurrencyFormat
                                                                            value={item.Price}
                                                                            displayType={'text'}
                                                                            thousandSeparator={true}
                                                                            fixedDecimalScale={true}
                                                                            decimalScale={2}
                                                                            prefix={'$'}>
                                                                        </CurrencyFormat>
                                                                    </td>
                                                                }
                                                                {/* Precio con IVA */}
                                                                <td style={{ color: "#666666", width: "8rem" }}>
                                                                    <CurrencyFormat
                                                                        value={parseFloat(item.Price *(1+(item.taxRate)/100))}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        fixedDecimalScale={true}
                                                                        decimalScale={2}
                                                                        prefix={'$'}>
                                                                    </CurrencyFormat>
                                                                </td>
                                                                {/* Total sin IVA */}
                                                                {valor != '0' && modificarPrecio === '1' ?
                                                                    <td style={{ color: "#666666", width: '8rem' }}>
                                                                        <input
                                                                            type="text"
                                                                            className=" form-control validarCant cantBlur btn-outline-secondary"
                                                                            // disabled={!editar ? true : false}
                                                                            style={{
                                                                                backgroundColor: valor != '0' ? '#ededed' : 'transparent',
                                                                                borderColor: '#ced4da',
                                                                                color: '#000',
                                                                                paddingTop: 1,
                                                                                paddingBottom: 2,
                                                                                width: '8rem',
                                                                                textAlign: "center",
                                                                            }}
                                                                            id={'itemNewTotal' + index}
                                                                            // value={parseFloat(item.newTotal).toFixed(2)}
                                                                            value={item.newTotal}
                                                                            onChange={event => this.changeTotalItem(index, item, event)}
                                                                            onBlur={(event) => { this.changeLocalTotalItem(index, item, event) }}
                                                                        // onFocus={(event) => event.target.select()}
                                                                        />
                                                                    </td>
                                                                    :
                                                                    <td style={{ color: "#DF7654", width: "8rem" }}>
                                                                        <CurrencyFormat
                                                                            displayType={'text'}
                                                                            value={item.Price * parseInt(item.quantity)}
                                                                            thousandSeparator={true}
                                                                            fixedDecimalScale={true}
                                                                            decimalScale={2}
                                                                            prefix={'$'}>
                                                                        </CurrencyFormat>
                                                                    </td>
                                                                }
                                                                {/* Total editable */}


                                                                {/* {valor != '0' && modificarPrecio === '1' ?
                                                                    <td style={{color: "#666666", width:'8rem'}}>
                                                                        <input
                                                                            type="text"
                                                                            className=" form-control validarCant cantBlur btn-outline-secondary"
                                                                            // disabled={!editar ? true : false}
                                                                            style={{
                                                                                backgroundColor: valor != '0' ? '#ededed' : 'transparent',
                                                                                borderColor: '#ced4da',
                                                                                color: '#000',
                                                                                paddingTop: 1,
                                                                                paddingBottom: 2,
                                                                                width: '8rem',
                                                                                textAlign: "center",
                                                                            }}
                                                                            id={'itemNewTotal' + index}
                                                                            // value={parseFloat(item.newTotal).toFixed(2)}
                                                                            value={item.newTotal}
                                                                            onChange={event => this.changeTotalItem(index, item, event)}
                                                                            onBlur={(event) => { this.changeLocalTotalItem(index, item, event)}}
                                                                            // onFocus={(event) => event.target.select()}
                                                                        />
                                                                    </td>
                                                                    :  */}
                                                                {/* Total con IVA */}
                                                                <td style={{ color: "#DF7654", width: "8rem" }}>
                                                                    <CurrencyFormat
                                                                        displayType={'text'}
                                                                        value={ item.priceTax }
                                                                        thousandSeparator={true}
                                                                        fixedDecimalScale={true}
                                                                        decimalScale={2}
                                                                        prefix={'$'}>
                                                                    </CurrencyFormat>
                                                                </td>
                                                                {/* } */}
                                                                <td>
                                                                    {item.quantity &&
                                                                        <i className="fa fa-trash" style={{ cursor: 'pointer', color: '#DF7654', minWidth: "1rem" }} onClick={() => this.deleteItemLocal({ item, deleteAll: false })} />}
                                                                    {/* {this.validateStock(item)} */}
                                                                </td>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    { (itemsRegalos.find(element => element.itemDisparador == item.ItemCode) || itemsRegalosSelect.find(element => element.itemDisparador == item.ItemCode)) &&
                                                        <div className="col-md-12" style = {{ border: '2px solid black' }} >
                                                            {itemsRegalos.map((elemenet) => { return this.renderBonificaciones(elemenet, item.ItemCode) })}
                                                            {itemsRegalosSelect.map((elemenet) => { return this.renderBonificaciones(elemenet, item.ItemCode) })}
                                                        </div>
                                                    }
                                                    <div className="col-md-12" >
                                                        {boxes.map((itemPromo, index) => { return this.renderBoxesProm(itemPromo, item.ItemCode) })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }else{
                            return("")
                        }
                    })}
                </div>

                {/* <div className="card-body" style={{overflow:'auto'}}>
                    <table className="table scroll" style={{borderCollapse: 'collapse', borderSpacing: 0, width : '100%', border: '0 solid #ddd'}}>                       
                        <thead >
                            <tr className="text-light bg-primary" >
                            <th scope="col" style={{fontSize: 12, textAlign:'left', padding: '0px',border: '2px solid #000',borderRadius: '10px'}}></th> 
                            <th scope="col" style={{fontSize: 12, textAlign:'left', padding: '0px',border: '2px solid #000',borderRadius: '10px'}}></th> 
                            <th scope="col" style={{fontSize: 12, textAlign:'left', padding: '0px',border: '2px solid #000',borderRadius: '10px'}}>Clave</th> 
                            <th scope="col" style={{fontSize: 12, textAlign:'left', padding: '0px'}}>Nombre</th>
                            <th scope="col" style={{fontSize: 12, textAlign:'left', padding: '0px'}}>Cantidad</th>
                            <th scope="col" style={{fontSize: 12, textAlign:'left', padding: '0px'}}>Cant. Disponible</th>
                            <th scope="col" style={{fontSize: 12, textAlign:'left', padding: '0px'}}>Precio</th> 
                            <th scope="col" style={{fontSize: 12, textAlign:'left', padding: '0px'}}>Precio con IVA</th>
                            <th scope="col" style={{fontSize: 12, textAlign:'left', padding: '0px'}}>Total</th> 
                            <th scope="col" style={{fontSize: 12, textAlign:'left', padding: '0px'}}></th>                                       
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => {
                                return (
                                <tr key={index}>
                                    <td scope="col" style={{fontSize: 12, padding: '0px',border: '2px solid #000',borderRadius: '10px'}}>{index+1}</td>
                                    <td scope="col" style={{fontSize: 12, padding: '0px',border: '2px solid #000',borderRadius: '10px'}}>
                                        <img className="img-fluid " style={{backgroundColor: 'white',maxHeight: 70}} src={item.PicturName ? (config.BASE_URL + SERVICE_API.getImage + '/' + item.PicturName) : require('../images/noImage.png')}/>
                                        {itemsNotificacion.map((element)=>{
                                            return (
                                                <div className="input-group details">
                                                    {item.ItemCode === element.idProducto &&
                                                    <Promociones
                                                    itemsNotificacion = {element.notificacion}/>}
                                                </div>
                                            )})
                                        }
                                    </td>
                                    <td scope="col" style={{fontSize: 12, padding: '0px',border: '2px solid #000',borderRadius: '10px'}}>{item.ItemCode}</td>
                                    <td scope="col" style={{fontSize: 12, padding: '0px'}}>{item.ItemName}</td>
                                    <td scope="col" style={{fontSize: 12, padding: '0px'}}>
                                        <input
                                            disabled={!(!!item.OnHandPrincipal)}
                                            id={'input-quantity-' + item.ItemCode + index}
                                            type="number"
                                            min="1"
                                            value={item.quantity ? Number(item.quantity) : ''}
                                            className="form-control mb-1"
                                            name={'quantity' + item.ItemCode}
                                            placeholder="1"
                                            style={{ textAlign: 'center', borderRadius: 20, borderColor: "#666666", color: "#666666",width: '60%'}}
                                            onChange={(event) => {  this.changeQuantity(index, item, event) }}
                                            onBlur={(e) => this.validateQuantity(index, item, e)} />
                                    </td>
                                    {seller ? seller.U_FMB_Handel_Perfil != '0' ? 
                                        <td scope="col" style={{fontSize: 12, padding: '0px'}}>
                                            {item.OnHandPrincipal}
                                        </td>
                                        : "" : ""
                                    }
                                    <td scope="col" style={{fontSize: 12, padding: '0px'}}>
                                        <CurrencyFormat
                                            value={item.Price}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            fixedDecimalScale={true}
                                            decimalScale={2}
                                            prefix={'$'}>
                                        </CurrencyFormat>
                                    </td>
                                    <td scope="col" style={{fontSize: 12, padding: '0px'}}>
                                        <CurrencyFormat
                                            value={item.priceTax}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            fixedDecimalScale={true}
                                            decimalScale={2}
                                            prefix={'$'}>
                                        </CurrencyFormat>
                                    </td>
                                    <td scope="col" style={{fontSize: 12, padding: '0px'}}>
                                        <CurrencyFormat
                                            value={item.priceTax * item.quantity}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            fixedDecimalScale={true}
                                            decimalScale={2}
                                            prefix={'$'}>
                                        </CurrencyFormat>
                                    </td>
                                    <td scope="col" style={{padding: '0px'}}>
                                        {item.quantity &&
                                            <i className="fa fa-trash" style={{ cursor: 'pointer', color: '#DF7654' }} onClick={() => this.deleteItemLocal({ item, deleteAll: false })} />}
                                        {this.validateStock(item)}
                                    </td>
                                </tr>)
                            })}
                        </tbody>
                    </table>
                </div> */}
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
        shoppingCartReducer: store.ShoppingCartReducer,
        notificationReducer: store.NotificationReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
        setShoppingCart: value => dispatch({ type: DISPATCH_ID.SHOPPING_CART_SAVE_CART, value }),

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShoppingCartList);