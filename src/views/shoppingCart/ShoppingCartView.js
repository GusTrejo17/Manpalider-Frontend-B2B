import React, { Component } from 'react';
import { VIEW_NAME, ROLES, OBJ_TYPE, DISPATCH_ID, config, SERVICE_API, SERVICE_RESPONSE } from "../../libs/utils/Const";
import { Footer, ItemDetailsModal, ItemsList, NavBar, Session, ShoppingCartList, CommentsModal, ItemsPromoModal, ItemRelatedSlider } from "../../components";
import { connect } from "react-redux";
import { ApiClient } from "../../libs/apiClient/ApiClient";
import CurrencyFormat from 'react-currency-format';
import { Modal } from '../../components/index';
import CreditLimitModal from '../../components/CreditLimitModal';
import $ from 'jquery';
import ValidateOrderView from '../validateOrder/ValidateOrderView';
import { parseJSON } from 'jquery';
import { animateScroll as scroll, scroller } from 'react-scroll';
import './scroll.css'

let apiClient = ApiClient.getInstance();
// Definicion de un arreglo para el producto Flete
let responseFlete = { ItemCode: '', ItemName: '', Price: '0', PriceList: '0', PurchaseLimit: '' };
let modal = new Modal();
let discPrcnt = 0;

class ShoppingCartView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            itemsBonificacion: [],
            selectorType: null,
            itemDisparador: null,
            itemsRegalos: [],
            itemsRegalosSelect: [],
            EitemsRegalos: [],
            boxes: [],
            itemsNotificacion: [],
            businessPartnerInfo: {},
            pointsInfo: {},
            activePoints: '',
            coupon: '',
            infoCoupon: {},
            discPrcnt: 0,
            resurtido: 'NO',
            numOrden: '',
            file: '',
            itemsRelated: null,
            itemsToDelete: [],
            firstCheckBO: false,
        };
        this.scrollToBottom = this.scrollToBottom.bind(this);
    };
    scrollToBottom() {
        scroll.scrollToTop({
            duration: 1000,
            delay: 100,
            smooth: 'easeOutQuart',
            isDynamic: true
        })
    }
    redirectLogin = async () => {
        const { shoppingCartReducer: { items }, notificationReducer: { showAlert }, configReducer: { history } } = this.props;
        history.goLogin();
    };

    redirectHome = async () => {
        const { shoppingCartReducer: { items }, notificationReducer: { showAlert }, configReducer: { history } } = this.props;
        history.goHome();
    };

    refeshState = (array, Notificacion) => {
        //  console.log('con>Notificacion',Notificacion);
        const { history, shoppingCartReducer: { items }, itemsReducer: { addShoppingCart, deleteShoppingCart } } = this.props;
        const { itemsRegalosSelect } = this.state;
        // console.log('con<array',array);
        // console.log('con>array',array);
        let itemsPromo = [];
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                // console.log('con>element',element);
                // console.log('con<----',element.itemDisparador,'--', item.ItemCode,'--', element.tipoSeleccion,'--',1);
                if (element.itemDisparador === item.ItemCode && element.tipoSeleccion === 1) {
                    if (element.tipoDisparador === 2) {
                        let result = itemsPromo.find(itemDisp => (itemDisp.itemDisparador !== item.ItemCode));
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
        }

        // let itesmSelect = [];
        // for (let index = 0; index < items.length; index++) {
        //     const item = items[index];
        //     for (let index = 0; index < itemsRegalosSelect.length; index++) {
        //         const gift = itemsRegalosSelect[index];
        //         if(item.ItemCode === gift.itemDisparador){
        //             if(parseInt(item.quantity) === gift.itemQuantity){
        //                 itesmSelect.push(gift);
        //             }
        //         }
        //     }
        // }

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
            /////////////////////////////////////////////////////---------------Quitar Bonificacion sin Stock---------------/////////////////////////////////////////////////////

            // let deleteItems : any = [];
            // console.log('con<<<<', itemsPromo);

            // for (let a = 0; a < items.length; a++) {
            //     const data = items[a];
            //     for (let i = 0; i < itemsPromo.length; i++) {
            //         const stock = itemsPromo[i];

            //         console.log('con< itemsRegalos',data.ItemCode,data.quantity,data.OnHand, 'Bonificacion:', stock.bonificacion.idProducto, stock.bonificacion.Stock, stock.bonificacion.cantidad, parseInt(stock.bonificacion.Stock));
            //         console.log('con<<<<<<<<<<<<<<<<<<<<<',parseInt(stock.bonificacion.Stock), '<<<<',stock.bonificacion.cantidad);
            //         if(data.ItemCode == stock.bonificacion.idProducto && parseInt(data.OnHand - data.quantity - stock.bonificacion.cantidad) < 0){
            //             if(data.OnHand - data.quantity != 0){
            //                 stock.bonificacion.stockMissing = (data.OnHand - data.quantity - stock.bonificacion.cantidad) * -1;
            //                 stock.bonificacion.comment = 'Has regalado ' + (data.OnHand - data.quantity) + '/' + stock.bonificacion.cantidad;

            //                 // let inicio = stock.bonificacion.comment.indexOf('regalado ');
            //                 // let final = stock.bonificacion.comment.indexOf('/');
            //                 // let cantidadAntesDeOrden =  stock.bonificacion.comment.slice(inicio, final);
            //             } 
            //         } 
            //         else if (stock.bonificacion.cantidad > stock.bonificacion.Stock){
            //             console.log('con<<< entre', i, stock.bonificacion.idProducto);
            //             stock.bonificacion.stockMissing =  stock.bonificacion.cantidad - stock.bonificacion.Stock;
            //             stock.bonificacion.comment = 'Has regalado ' + (stock.bonificacion.cantidad - stock.bonificacion.stockMissing) + '/' + stock.bonificacion.cantidad;
            //         }
            //     }
            // }

            // console.log('con<<<<<',itemsPromo);
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            

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
            // for (let index = 0; index < itemsRegalosSelect.length; index++) {
            //     const element = itemsRegalosSelect[index];
            //     for (let index = 0; index < boxes.length; index++) {
            //         const box = boxes[index];
            //         if(element.itemDisparador === box.itemDisparador && element.idDisparador === box.idDisparador ){
            //             boxes.splice(index,1);
            //         }
            //     }
            // }

            this.setState({
                itemsRegalos: itemsPromo,
                itemPromociones: array,
                boxes: boxes,
                itemsRegalosSelect: [],
                itemsNotificacion: Notificacion,

            });
        }



    }

    selectItemsPromo = (itemsPromo, ItemCode) => {
        const { itemPromociones, itemsRegalos } = this.state;

        if (itemsPromo.selectorType === 1) {
            let arrayPromo = itemPromociones;
            for (let index = 0; index < arrayPromo.length; index++) {
                const promo = arrayPromo[index];
                for (let index = 0; index < promo.bonificacion.length; index++) {
                    const element = promo.bonificacion[index];
                    for (let index = 0; index < itemsPromo.length; index++) {
                        const items = itemsPromo[index];
                        if (element.bonificacion === items.idDetallesPromo) {
                            promo.use = true;
                        }
                    }
                }
            }

            this.setState({
                itemsRegalos: [itemsPromo],
                itemPromociones: arrayPromo,
                selectorType: itemsPromo.selectorType
            });
        } else {
            let boxes = [];
            for (let index = 0; index < itemPromociones.length; index++) {
                const element = itemPromociones[index];
                if (element.tipoSeleccion === 2) {
                    if (element.idDisparador === itemsPromo.idDisparador && element.itemDisparador === ItemCode) {
                        boxes.push(element);
                    }
                }
            }

            let items = [];
            let registrados = [];
            for (let index = 0; index < boxes.length; index++) {
                const element = boxes[index];
                // console.log('con>element',element.bonificacion.indexPack);
                let include = registrados.includes(element.bonificacion.indexPack);
                if (!include) {

                    let arrayTemp = boxes.filter(item => (item.bonificacion.indexPack === element.bonificacion.indexPack));
                    registrados.push(element.bonificacion.indexPack);
                    items.push(arrayTemp);

                }
            }
            //  console.log('con>items',items);

            this.setState({
                itemsBonificacion: items,
                selectorType: itemsPromo.selectorType,
                itemDisparador: itemsPromo.itemDisparador
            });
            $('#boniModal').modal('show');
        }

    }

    addItemsPromo = (item) => {
        const { itemPromociones, itemsRegalos, itemDisparador, itemsBonificacion, boxes, itemsRegalosSelect } = this.state;
        // console.log('con>item',item);
        //    let newBoxes = [];
        //     for (let index = 0; index < boxes.length; index++) {
        //         const promo = boxes[index];
        //         if(promo.itemDisparador !== item.itemDisparador){
        //             newBoxes.push(promo);
        //         }
        //     }
        for (let index = 0; index < item.length; index++) {
            const element = item[index];
            element.bonificacion.cantidad *= element.homeItemQuantity;
            itemsRegalosSelect.push(element);
        }
        // console.log('con< itemsRegalosSelect', itemsRegalosSelect);


        if (item[0].tipoDisparador === 1) {
            this.setState(prevState => ({
                itemsRegalosSelect,
                boxes: prevState.boxes.filter(box => (box.itemDisparador !== item[0].itemDisparador)),
            }));
        } else if (item[0].tipoDisparador === 2) {
            this.setState(prevState => ({
                itemsRegalosSelect,
                boxes: prevState.boxes.filter(box => (box.idDisparador !== item[0].idDisparador)),
            }));
        }
        $('#boniModal').modal('hide');

    }

    deleteItemPromo = (element) => {
        this.setState((prevState) => ({
            boxes: [...prevState.boxes, element],
            itemsRegalosSelect: prevState.itemsRegalosSelect.filter(item => (item.itemDisparador !== element.itemDisparador)),
        }));
        // const {itemsRegalosSelect} = this.state;
        // let arrayPromo = itemPromociones;
        // let Regalos = itemsRegalosSelect;

        // let nRegalos = [];
        // for (let index = 0; index < itemsRegalosSelect.length; index++) {
        //     const item = itemsRegalosSelect[index];
        //     if(item.idDisparador === element.idDisparador && item.itemDisparador == element.itemDisparador){
        //     }else{
        //         nRegalos.push(item);
        //     }
        // }
        // // let result = ;
        // // if(result){
        // //     nRegalos= result;
        // // }
        // let box = [];
        // for (let index = 0; index < arrayPromo.length; index++) {
        //     const itemPromo = arrayPromo[index];
        //     if(element.idDisparador === itemPromo.idDisparador ){
        //         box.push(itemPromo);
        //     }
        // }
        // //let boxe = boxes || [];
        // let boxe = boxes.slice() || [];
        // for (let index = 0; index < box.length; index++) {
        //     const element = box[index];
        //     if(element.tipoSeleccion === 2){
        //         let result = boxe.find(item => (item.itemDisparador === element.itemDisparador ));
        //         if(!result){
        //             boxe.push(element);
        //         }
        //     }
        // }
        //items.filter(item => (item.itemDisparador !== element.itemDisparador)),  
    }

    async componentDidMount() {
        //Asiganacion del producto que viene de SAP al front
        // let responseApi = await this.getRegisterPack();
        //Tomando valores que vienen desde SAP
        // let item_code = responseApi.data[0].ItemCode;
        // let item_name = responseApi.data[0].ItemName;
        // let price = responseApi.data[0].Price;
        // let price_list = responseApi.data[0].PriceList;
        // let purchase_limit = responseApi.data[0].PurchaseLimit;
        //Asigancion de los valores al arreglo del front
        // responseFlete.ItemCode = item_code;
        // responseFlete.ItemName = item_name;
        // responseFlete.Price = price;
        // responseFlete.PriceList = price_list;
        // responseFlete.PurchaseLimit = purchase_limit;
        // console.log("Hola desde view",responseFlete);
        this.handleInputChange = this.handleInputChange.bind(this)
        this.cargarDatos();
        // await this.accountBusinessPartnerInfo();
        this.scrollToBottom();
    }
    checkBackOrder = () => {
        const { shoppingCartReducer: { items }, enableSpinner } = this.props;
        const { firstCheckBO } = this.state;
        let resurtido = 'NO';
        if (!firstCheckBO && items?.length > 0 && items[0]?.ItemName) {
            enableSpinner(true);
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.quantity > item.OnHandPrincipal) {
                    resurtido = 'SI';
                    break;
                }
            }
            this.setState({ resurtido, firstCheckBO: true});
            enableSpinner(false);
        }
    }

    // Peticion del producto flete
    getRegisterPack = async () => {
        return await apiClient.getFlete();
    };

    accountBusinessPartnerInfo = async () => {
        const { sessionReducer, enableSpinner, notificationReducer: { showAlert } } = this.props;

        if (sessionReducer.user.CardCode) {
            let cardCode = sessionReducer.user.CardCode;
            enableSpinner(true);
            let response = await apiClient.getBusinessPartnerInfo(cardCode);
            enableSpinner(false);
            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                this.setState({
                    businessPartnerInfo: response.data.resultData,
                    pointsInfo: response.data.resultInfoPoints,
                    activePoints: response.data.resultInfoPoints.totalPoints
                });
            } else {
                this.setState({
                    businessPartnerInfo: { permissions: 'NO' },
                });
                showAlert({ type: 'warning', message: response.message || ' Ocurrió un error al traer su info.', timeOut: 8000 });
            }
        }
    }

    createDocument = async () => {
        const { shoppingCartReducer: { items }, notificationReducer: { showAlert }, configReducer: { history }, setItemsGift } = this.props;
        //const {itemPromociones,Limit, Codigo, CardName, itemsRegalos, itemsBonificacion,selectorType,itemsRegalosSelect,,itemsNotificacion} = this.state;
        const { itemsRegalos, itemsRegalosSelect, infoCoupon, activePoints, boxes, resurtido, numOrden, file } = this.state;

        if (boxes.length > 0) {
            boxes.map(articulosSeleccionados => {
                showAlert({ type: 'warning', message: 'No has seleccionado la bonificación del artículo: ' + articulosSeleccionados.itemDisparador, timeOut: 8000 });
            })
            return;
        }
        let data = {
            resurtido: resurtido,
            numOrden: numOrden,
            file: file
        }
        localStorage.setItem(config.general.localStorageNamed + 'DatosOrden', JSON.stringify(data));

        setItemsGift(itemsRegalos.concat(itemsRegalosSelect));
        //Se va el arregle de regalos al local
        localStorage.setItem(config.general.localStorageNamed + 'Gift', JSON.stringify(itemsRegalos));
        let errors = items.filter((item) => {
            return (!(!!item.OnHandPrincipal) || (item.quantity > item.OnHandPrincipal))
        });

        // if (errors.length) return showAlert({
        //     message: 'Existen articulos agotados o en cantidad mayor en existencia. Para continuar elimine del carrito o paselos a su lista de deseos',
        //     type: 'warning',
        //     timeOut: 10000
        // })

        // Descuento por porcentaje
        if (infoCoupon.U_TIPO_DSCT === "1" || infoCoupon.U_TIPO_DSCT === "2") {
            localStorage.setItem(config.general.localStorageNamed + 'Discount', JSON.stringify(infoCoupon));
        } else {
            localStorage.setItem(config.general.localStorageNamed + 'Discount', JSON.stringify(null));
        }
        // Descuento por puntos
        if (activePoints != 0) {
            localStorage.setItem(config.general.localStorageNamed + 'DiscountPoints', activePoints);
        } else {
            localStorage.setItem(config.general.localStorageNamed + 'DiscountPoints', 0);
        }

        history.goSelectAddress();
        //let response = await apiClient.createDocument({objType: OBJ_TYPE.ORDER, currency: 'MXP'});
    };

    changeActivePoints = (event) => {
        const { pointsInfo, activePoints } = this.state;
        const { notificationReducer: { showAlert } } = this.props;
        let newActivePoints = event.nativeEvent.target.value;
        // console.log('######newActivePoints', newActivePoints);
        if (parseInt(newActivePoints) > parseInt(pointsInfo.totalPoints)) {
            showAlert({ type: 'warning', message: ' No puedes exceder el número de puntos: ' + pointsInfo.totalPoints, timeOut: 8000 });
            this.setState({
                activePoints: pointsInfo.totalPoints
            });
            return;
        } else {
            this.setState({
                activePoints: newActivePoints
            });
        }
        // console.log('######activePoints', activePoints);

    }

    changeDiscount = (event) => {
        let newCoupon = event.nativeEvent.target.value;
        this.setState({
            coupon: newCoupon
        });

    }

    renderPointsData = () => {
        const { pointsInfo, activePoints } = this.state;
        //console.log("Foca",pointsInfo.pointsMoney);
        let valueEquals = parseFloat(pointsInfo.pointsMoney);
        let valuePoints = parseFloat(pointsInfo.totalPoints * valueEquals);

        return (
            <div className="container" style={{ fontSize: 15 }}>
                <div className="row">
                    <div className="col-6" style={{ padding: 0 }}>
                        <span className="font-weight-bold">Total de puntos: </span>
                    </div>
                    <div className="col-6 text-right" style={{ padding: 0 }}>
                        <span className="text-right">
                            <CurrencyFormat
                                value={pointsInfo.totalPoints}
                                displayType={'text'}
                                thousandSeparator={true}
                                fixedDecimalScale={true}>
                            </CurrencyFormat>
                            {` puntos`}
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6" style={{ padding: 0 }}>
                        <span className="font-weight-bold">Valor del punto: </span>
                    </div>
                    <div className="col-6 text-right" style={{ padding: 0 }}>
                        <span className="text-right">
                            <CurrencyFormat
                                value={valueEquals || 0}
                                displayType={'text'}
                                thousandSeparator={true}
                                fixedDecimalScale={true}
                                decimalScale={2}
                                prefix={'$ '}>
                            </CurrencyFormat>
                            {` ${config.general.currency}`}
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6" style={{ padding: 0 }}>
                        <span className="font-weight-bold">Valor en pesos: </span>
                    </div>
                    <div className="col-6 text-right" style={{ padding: 0 }}>
                        <span className="text-right">
                            <CurrencyFormat
                                value={valuePoints || 0}
                                displayType={'text'}
                                thousandSeparator={true}
                                fixedDecimalScale={true}
                                decimalScale={2}
                                prefix={'$ '}>
                            </CurrencyFormat>
                            {` ${config.general.currency}`}
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6" style={{ padding: 0 }}>
                        <span className="font-weight-bold">Puntos a descontar: </span>
                    </div>
                    <div className="col-6 text-right" style={{ padding: 0 }}>
                        <input type="text" className="form-control" maxLength='70' size='70'
                            value={activePoints || 0} style={{ borderRadius: 10 }}
                            onChange={(event) => { this.changeActivePoints(event) }}
                            // Activo para usuarios SIN SESIÓN
                            disabled={pointsInfo.totalPoints == 0 ? true : false}
                        />
                    </div>
                </div>
            </div>
        )
    };

    mostrar = async () => {
        const { shoppingCartReducer: { items }, notificationReducer: { showAlert }, sessionReducer } = this.props;
        const { Balance, CreditLine, boxes, resurtido, numOrden, file } = this.state;



        let flag = true;
        let noEntrar = true;
        for (let index = 0; index < items.length; index++) {
            const element = items[index];
            let piv1 = 0;
            let piv2 = 0;
            if (element.quantity == 0 || element.quantity == "0" || element.quantity == "") {
                showAlert({ type: 'warning', message: 'El artículo ' + element.ItemCode + ' no puede ir en cantidad 0', timeOut: 5000 });
                return;
            }
            if (element.U_MultiploVenta !== null && element.U_MultiploVenta !== 0) {
                let multiplo = parseInt(element.quantity) % element.U_MultiploVenta;
                if (multiplo == 0) {
                    // showAlert({type: 'success', message: 'El artículo ' + element.ItemCode + ' si es multiplo', timeOut: 5000});
                    flag = true;
                } else {
                    piv1 = parseInt(element.quantity);
                    piv2 = parseInt(element.quantity);

                    while (piv1 % element.U_MultiploVenta !== 0) {
                        piv1++;
                    }
                    let result1 = piv1 - parseInt(element.quantity);

                    while (piv2 % element.U_MultiploVenta !== 0) {
                        piv2--;
                    }
                    let result2 = piv2 - parseInt(element.quantity);

                    showAlert({ type: 'error', message: 'Al artículo ' + element.ItemCode + ' le faltan ' + result1 + ' unidades', timeOut: 8000 });// o compra +piv1
                    flag = false;
                    noEntrar = false;
                }
            }
        }

        if (flag && noEntrar) {
            if (boxes.length > 0) {
                boxes.map(articulosSeleccionados => {
                    showAlert({ type: 'warning', message: 'No has seleccionado la bonificación del artículo: ' + articulosSeleccionados.itemDisparador, timeOut: 8000 });
                })
                return;
            }
            let limit = Balance - CreditLine;
            this.createDocument();
        }
    };

    checkDiscount = async () => {
        // Recibir el cupon ingresado
        const { coupon } = this.state
        const { notificationReducer: { showAlert } } = this.props;
        // Buscar si el cupón existe
        if (coupon != '') {
            let responseInfoCoupon = await apiClient.getInfoCoupon(coupon);
            if (responseInfoCoupon.status === 1) {
                showAlert({ type: 'success', message: "Cupón encontrado", timeOut: 8000 });
                // Asiganar cupon
                this.setState({
                    infoCoupon: responseInfoCoupon.data,
                });
            } else {
                showAlert({ type: 'warning', message: responseInfoCoupon.message, timeOut: 8000 });
                // Asiganar cupon
                this.setState({
                    infoCoupon: [],
                });
            }
        } else {
            showAlert({ type: 'warning', message: "No has colocadó un cupón", timeOut: 8000 });
        }



    }

    changeQuantity = async (index, item, newQuantity, addItem) => {
        const { enableSpinner, setShoppingCart, itemsReducer: { addShoppingCart, deleteShoppingCart }, shoppingCartReducer: { items } } = this.props;

        items.map(itemFilter => {
            if (item.ItemCode === itemFilter.ItemCode) {
                itemFilter.quantity = newQuantity;
            }
        });



        setShoppingCart(items);

        if (!newQuantity) return;

        if (addItem) {
            addShoppingCart({ item, quantity: (newQuantity) })
        } else {
            //deleteShoppingCart({item, deleteAll: false});
        }

        setTimeout(async () => {
            let shoppingCart = [];
            enableSpinner(true);
            let response = await apiClient.getShoppingCart(items);
            enableSpinner(false);

            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                shoppingCart = response.data.shoppingCart;
            } else {
                return;
                //showAlert({type: 'error', message: response.message, timeOut: 0});
            }
            setShoppingCart(shoppingCart);
        }, 150);
    };

    renderShoppingCartTotal = () => {
        const { history, shoppingCartReducer: { items }, itemsReducer: { addShoppingCart, deleteShoppingCart } } = this.props;
        const { infoCoupon, pointsInfo, activePoints } = this.state;

        let subTotal = 0;
        let taxTotal = 0;
        let total = 0;
        let tax = 0;
        let localLanguage = '';
        let currency = '';
        let valueDiscount = 0;
        let valueEquals = parseFloat(pointsInfo.pointsMoney);
        //Variables para validacion del Flete
        let transport = 0;
        let taxTransport = 0;
        let limit = 0;
        let peso = 0;

        let activePointsNew = activePoints;
        items.map(item => {
            // //console.log("ITEMS MAP---",item)
            //let totalPrice = item.newTotal; // parseFloat(item.Price * parseInt(item.quantity)).toFixed(2);
            let totalPrice = Number(item.Price * parseInt(item.quantity));
            if (item.SWeight1) {
                peso = peso + Number(item.quantity) * item.SWeight1;
            } else {
                peso = 1;
            }
            localStorage.setItem("Peso", peso)
            // PUNTOS
            // if(item.U_FMB_Handel_PNTA == 1 && pointsInfo && activePoints){
            //     let valuePoints = parseFloat(activePointsNew * valueEquals);
            //     if(valuePoints >= totalPrice){
            //         valuePoints = totalPrice;
            //     }

            //     totalPrice -= valuePoints;
            //     // Formula para enviar DiscPrcnt a Back
            //     // let discPrcntBack = totalPrice == 0 ? Number(99.99).toFixed(2) : Number(((valuePoints * 100)) / (Number(itemPoints[i].Price * Number(itemPoints[i].quantity)))).toFixed(2);

            //     //Restar puntos
            //     activePointsNew -= valuePoints/valueEquals;
            // }
            // console.log("Valor del item ", totalPrice);
            subTotal += totalPrice
            tax = item.taxRate;
            // taxTotal += Number(item.taxSum * item.quantity);
            // taxTotal = parseFloat(subTotal * (tax * 0.01));
            taxTotal += parseFloat(totalPrice * (item.taxRate * 0.01));
            // taxTotal = Math.round(taxTotal);
            localLanguage = item.localLanguage;
            currency = item.currency;
        });
        //Asignacion de valores para el flete
        limit = parseInt(responseFlete.PurchaseLimit);
        transport = parseFloat(responseFlete.Price);
        taxTransport = parseFloat(transport * (tax * 0.01));
        //Validacion del flete
        // if(subTotal < limit){
        //     taxTotal = taxTotal + taxTransport;
        //     total = subTotal + transport + taxTotal;
        // }else{
        //     transport = 0;
        //     total = subTotal + transport + taxTotal;
        // }

        // Total sin envio
        total = subTotal + taxTotal;


        // Validar cupon
        // console.log("InfoCopupon", infoCoupon);
        if (infoCoupon.U_TIPO_DSCT === "1" && pointsInfo && activePoints) {
            // Descuento por porcentaje
            let valueAux = parseFloat(infoCoupon.U_VALOR_DSCT);
            valueDiscount = valueAux;
            // valueDiscount = (total / 100) * valueAux;
            // total = total - valueDiscount;
        }
        if (infoCoupon.U_TIPO_DSCT === "2" && pointsInfo && activePoints) {
            // Descuento en efectivo
            valueDiscount = parseFloat(infoCoupon.U_VALOR_DSCT);
            // discPrcnt = (valueDiscount * 100) / total;
            // total = total - valueDiscount;
        }

        // total = Math.round(total);
        localStorage.setItem(config.general.localStorageNamed + 'OrderTotal', total);
        return (
            <div className="container" style={{ fontSize: 18 }}>
                <div className="row">
                    <div className="col-6" style={{ padding: 0 }}>
                        <span className="font-weight-bold">Subtotal: </span>
                    </div>
                    <div className="col-6 text-right" style={{ padding: 0 }}>
                        <span className="text-right">
                            <CurrencyFormat
                                value={subTotal || 0}
                                displayType={'text'}
                                thousandSeparator={true}
                                fixedDecimalScale={true}
                                decimalScale={2}
                                prefix={'$ '}>
                            </CurrencyFormat>
                            {/* {` ` +currency} */}
                        </span>
                    </div>
                </div>
                {/* Descomentar en caso de envio */}
                {/* <div className="row border-bottom">
                    <div className="col-6" style={{ padding: 0 }}>
                        <span className="font-weight-bold">Envío:</span>
                    </div>
                    <div className="col-6 text-right" style={{ padding: 0 }}>
                        <span className="text-right">
                            {subTotal === 0 ?
                                <CurrencyFormat
                                    value={0}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    fixedDecimalScale={true}
                                    decimalScale={2}
                                    prefix={'$'}>
                                </CurrencyFormat> :
                                <CurrencyFormat
                                    value={transport}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    fixedDecimalScale={true}
                                    decimalScale={2}
                                    prefix={'$'}>
                                </CurrencyFormat>
                            }
                            {` ` +currency}
                        </span>
                    </div>
                </div> */}
                <div className="row border-bottom">
                    <div className="col-6" style={{ padding: 0 }}>
                        <span className="font-weight-bold">
                            I.V.A. ({tax}%):
                        </span>
                    </div>
                    <div className="col-6 text-right" style={{ padding: 0 }}>
                        <span className="text-right">
                            <CurrencyFormat
                                value={taxTotal || 0}
                                displayType={'text'}
                                thousandSeparator={true}
                                fixedDecimalScale={true}
                                decimalScale={2}
                                prefix={'$ '}>
                            </CurrencyFormat>
                            {/* {` ` +currency} */}
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6" style={{ padding: 0 }}>
                        <span className="font-weight-bold">Total sin envio: </span>
                    </div>
                    <div className="col-6 text-right" style={{ padding: 0 }}>
                        <span className="text-right font-weight-bold" style={{ color: "#86C03F" }}>
                            {subTotal === 0 ?
                                <CurrencyFormat
                                    value={0}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    fixedDecimalScale={true}
                                    decimalScale={2}
                                    prefix={'$'}>
                                </CurrencyFormat> :
                                <CurrencyFormat
                                    value={total || 0}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    fixedDecimalScale={true}
                                    decimalScale={2}
                                    prefix={'$'}>
                                </CurrencyFormat>
                            }
                            {/* {` ` +currency} */}
                        </span>
                    </div>
                </div>
                {
                    infoCoupon.U_TIPO_DSCT &&
                    <div className="row">
                        <div className="col-6" style={{ padding: 0 }}>
                            <span className="font-weight-bold">
                                Descuento:
                            </span>
                        </div>
                        <div className="col-6 text-right" style={{ padding: 0 }}>
                            <span className="text-right" style={{ color: "#86C03F" }}>
                                <CurrencyFormat
                                    value={valueDiscount}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    fixedDecimalScale={true}
                                    decimalScale={2}
                                    prefix={infoCoupon.U_TIPO_DSCT == "1" ? '- ' : '- $'}>
                                </CurrencyFormat>
                                {infoCoupon.U_TIPO_DSCT == "1" ? ' %' : ''}
                            </span>
                        </div>
                    </div>
                }
            </div>
        )
    };

    sendToBackOrder = item => {
        const { itemsReducer: { addBackOrder, deleteShoppingCart } } = this.props;
        deleteShoppingCart({ item, deleteAll: false });
        addBackOrder({ item, quantity: (item.quantity || '1') })
    };

    cargarDatos = async () => {
        let user = localStorage.getItem(config.general.localStorageNamed + 'CurrentUser');
        user = JSON.parse(user) || {};
        let limit = user.Balance - user.CreditLine;
        this.setState({
            Codigo: user.CardCode,
            CardName: user.CardName,
            Balance: user.Balance,
            CreditLine: user.CreditLine,
            Limit: limit,
            CodOrder: user.U_MOC == 'SI' ? true : false,
        });
    };

    renderShoppingCartDetail = () => {
        const { history, shoppingCartReducer: { items }, itemsReducer: { addShoppingCart, deleteShoppingCart } } = this.props;
        let totalbruto = 0;
        let totalneto = 0;
        let unidades = 0;
        let articulos = items.length;
        items.map(item => {
            let bruto = Number(item.weight1 * item.quantity);
            totalbruto += bruto;
            let neto = Number(item.weight * item.quantity);
            totalneto += neto;
            let cantidadArti = Number(item.quantity);
            unidades += cantidadArti
        });

        return (
            <div className="container" style={{ fontSize: 18 }}>
                {/* <div className="row">
                    <div className="col-6" style={{padding: 0}}>
                        <span className="font-weight-bold">Total peso neto: </span>
                    </div>
                    <div className="col-6 text-right" style={{padding: 0}}>
                        <span className="text-right">
                             {parseFloat(totalneto).toFixed(2)} KG
                        </span>
                    </div>
                </div>
                <div className="row border-bottom">
                    <div className="col-6" style={{padding: 0}}>
                        <span className="font-weight-bold">Total peso bruto:</span>
                    </div>
                    <div className="col-6 text-right" style={{padding: 0}}>
                        <span className="text-right">
                            {parseFloat(totalbruto).toFixed(2)} KG
                        </span>
                    </div>
                </div> */}
                <div className="row border-bottom">
                    <div className="col-6" style={{ padding: 0 }}>
                        <span className="font-weight-bold">Total de articulos:</span>
                    </div>
                    <div className="col-6 text-right" style={{ padding: 0 }}>
                        <span className="text-right">
                            {parseInt(articulos)}
                        </span>
                    </div>
                </div>
                <div className="row border-bottom">
                    <div className="col-6" style={{ padding: 0 }}>
                        <span className="font-weight-bold">Total de unidades:</span>
                    </div>
                    <div className="col-6 text-right" style={{ padding: 0 }}>
                        <span className="text-right">
                            {parseInt(unidades)}
                        </span>
                    </div>
                </div>
            </div>
        )
    };

    async handleInputChange(event) {
        const target = event.target
        const value = target.value
        const name = target.name
        this.setState({
            [name]: value.split('\\').pop()
        })
    };

    handelChange = (value) => {      
        this.setState({
            resurtido: value
        });
    };

    async getItemsRelated() {
        const { shoppingCartReducer: { items },setItemsRelated } = this.props
        const brands = []
        for (const item of items) {
            brands.push(item.U_Linea)
        }
        const brandsL = [...new Set(brands)]
        let response = await apiClient.getRelatedCart(brandsL);
        const itemsLast = this.desordenarArray([...response.data]);
        if (itemsLast[0]) {
            if (!this.state.itemsRelated) {
                this.setState({ itemsRelated: itemsLast })
                setItemsRelated(itemsLast)
            }
        }

    }
    desordenarArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async deleteSelection() {
        const { itemsReducer: { deleteShoppingCart } } = this.props;
        const { itemsToDelete,itemsRegalos } = this.state
        let item = {}
        let newItmsGift
        if(itemsToDelete.length === 0){
            return
        }
        for (let index = 0; index < itemsToDelete.length; index++) {
            item.ItemCode = itemsToDelete[index]
            await deleteShoppingCart({ item, deleteAll: false });
                newItmsGift = itemsRegalos.filter((itmGift) => {
                    return (item.ItemCode  !== itmGift.itemDisparador )
                });
          }
        this.setState({
            itemsToDelete : [],
            itemsRegalos:newItmsGift
        })
    }

    changeItemsToDelete = async (value, index) => {
        const { itemsToDelete } = this.state
        if (index === -1) {
            let aux = itemsToDelete.slice()
            aux.push(value)
            this.setState({
                itemsToDelete: aux
            })
        } else {
            let aux = itemsToDelete.slice()
            aux.splice(index, 1)
            this.setState({
                itemsToDelete: aux
            })
        }
    }

    // const miArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // const arrayDesordenado = desordenarArray([...miArray]);
    refreshRelated(itemsRelated){
        this.setState({
            itemsRelated
        })
    }
    // console.log(arrayDesordenado);
    render() {
        const {  sessionReducer: { role } } = this.props;
        const { history, shoppingCartReducer: { items }, itemsReducer: { addShoppingCart, deleteShoppingCart, items1,itmsRelated },setItemsRelated,  } = this.props;
        const { itemPromociones, Limit, Codigo, CardName, itemsRegalos, itemsBonificacion, selectorType, itemsRegalosSelect, boxes, itemsNotificacion, businessPartnerInfo, pointsInfo, activePoints, CodOrder, itemsRelated,resurtido,itemsToDelete } = this.state;
        this.checkBackOrder();
        let flagPoints = false;
        if (items) {
            items.map(item => {
                if (item.U_FMB_Handel_PNTA == 1) {
                    flagPoints = true;
                    return;
                }
            });
        }
        this.getItemsRelated()
        return (
            <div className="content-fluid" style={{ marginTop: 60, backgroundColor: config.Back.backgroundColor }}>
                <Session history={history} view={VIEW_NAME.SHOPPING_CART_VIEW}></Session>
                <NavBar isShowMarcas={false} />
                <ItemsPromoModal
                    items={itemsBonificacion}
                    selectorType={selectorType}
                    addItemsPromo={this.addItemsPromo}
                />
                <CreditLimitModal
                    Limit={Limit}
                    Codigo={Codigo}
                    CardName={CardName}
                    createDocument={this.createDocument}
                />
                <div className="row" style={{ paddingTop: 90, margin: 0, minHeight: '70vh', paddingBottom: 20 }}>
                    <div className="col-lg-9 pt-3">
                    <div className='col-12' style={{ justifyContent: 'flex-end' }}>
                        {!!items.length && 
                            <div>
                            <div className='text-left' style={{ cursor: 'auto', color: 'black', marginTop: "4px" }}>
                            <i className="fa fa-trash" style={{ color: "#DF7654",  cursor: 'pointer'}} onClick={() => deleteShoppingCart({ item: {}, deleteAll: true })} />
                                <span  style={{cursor:'pointer', marginLeft:'4px'}} onClick={() => deleteShoppingCart({ item: {}, deleteAll: true })} >Eliminar todo</span>
                            </div>
                            </div>
                        }
                        </div>
                            <br></br>
                        <div className="card style-articles-cart" style={{
                            borderRadius: 20, border: '1px solid #ADADAD'
                        }}>
                            <div className="card-header" style={{ background: "#ADADAD", borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottom: "none" }}>
                                <div className='row'>
                                    <p className="card-title col-12 col-sm-8 row" style={{ color: config.shoppingList.textProductList, justifyContent: "left" }}>Artículos en tu carrito&nbsp;&nbsp; <span className="small" style={{ color: "white", marginTop: "auto", marginBottom: "auto" }} > (precios con I.V.A.):</span></p>
                                    <div className='text-right col-12 col-sm-4'>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12' style={{justifyContent:'flex-end'}}>
                                        {!!items.length &&
                                            <div onClick={() => this.deleteSelection()}
                                                className='text-left text-sm-right'
                                                style={{ cursor: 'pointer', color: 'white' }}>
                                                <i className="fa fa-trash" style={{ color: "#DF7654" }} /> Eliminar Seleccionados
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* ,border: '2px solid #000',borderRadius: '10px' */}
                            <div className="card-body screen" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                {!!items.length ? (
                                    <ShoppingCartList
                                        view={VIEW_NAME.SHOPPING_CART_VIEW}
                                        data={items}
                                        deleteItem={deleteShoppingCart}
                                        changeQuantity={this.changeQuantity}
                                        add={addShoppingCart}
                                        sendTo={this.sendToBackOrder}
                                        refeshState={this.refeshState}
                                        itemPromociones={itemPromociones}
                                        selectItemsPromo={this.selectItemsPromo}
                                        itemsRegalos={itemsRegalos}
                                        itemsRegalosSelect={itemsRegalosSelect}
                                        deleteItemPromo={this.deleteItemPromo}
                                        boxes={boxes}
                                        itemsNotificacion={itemsNotificacion}
                                        changeItemsToDelete={this.changeItemsToDelete}
                                        backOrder={false}
                                        itemsToDelete={itemsToDelete}
                                    />
                                ) : (
                                    <div className='text-center' style={{ fontSize: 30 }}>
                                        Carrito vacío
                                    </div>
                                )}
                            </div>
                        </div>
                        <br></br>
                        {/* <div className="card style-articles-cart" style={{
                            borderRadius: 20, border: '1px solid #ADADAD'
                        }}>
                            <div className="card-header" style={{background: "#ADADAD", borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottom: "none"}}>
                                <div className='row'>
                                    <p className="card-title col-12 col-sm-8 row" style={{ color: config.shoppingList.textProductList, justifyContent: "left" }}>&nbsp;&nbsp; <span className="small" style={{ color: "white", marginTop: "auto", marginBottom: "auto" }} >BackOrder</span></p>
                                    <div className='text-right col-12 col-sm-4' >
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-3'>
                                        <input className='ml-5 mr-2' type='checkbox'></input>
                                        <label style={{color: "white"}}>Seleccionar todo</label>
                                    </div>
                                    <div className='col-9'>
                                        {!!items.length &&
                                            <div onClick={() => deleteShoppingCart({ item: {}, deleteAll: true })}
                                                className='text-left text-sm-right'
                                                style={{ cursor: 'pointer', color: 'white' }}>
                                                <i className="fa fa-trash" style={{color: "#DF7654"}}/> Eliminar Seleccionados
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* ,border: '2px solid #000',borderRadius: '10px' */}
                        {/* <div className="card-body screen" style={{height: items.length >= 6 ? '600px' : ''}}>
                                {!!items.length ?
                                    <ShoppingCartList
                                    view={VIEW_NAME.SHOPPING_CART_VIEW}
                                    data={items}
                                    deleteItem={deleteShoppingCart}
                                    changeQuantity={this.changeQuantity}
                                    add={addShoppingCart}
                                    sendTo={this.sendToBackOrder}
                                    refeshState={this.refeshState}
                                    itemPromociones={itemPromociones}
                                    selectItemsPromo={this.selectItemsPromo}
                                    itemsRegalos={itemsRegalos}
                                    itemsRegalosSelect={itemsRegalosSelect}
                                    deleteItemPromo={this.deleteItemPromo}
                                    boxes={boxes}
                                    itemsNotificacion={itemsNotificacion}
                                    /> :
                                    <div className='text-center' style={{fontSize: 30}}>
                                        Carrito vacío
                                    </div>}
                            </div>
                        </div> */}
                        {/* BackOrder ESTO SE PUEDE BORRAR SOLO ES UNA PRUEBA 708 */}
                        {false ?
                            <div className="card style-articles-cart mt-5" style={{
                                borderRadius: 20, border: '1px solid #ADADAD'
                            }}>
                                <div className="card-header" style={{ background: "#ADADAD", borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottom: "none" }}>
                                    <div className='row' style={{justifyContent: "left", marginLeft:'3px'}}>
                                        <p className="card-title col-12 col-sm-8 row" style={{ color: config.shoppingList.textProductList, justifyContent: "left" }}>BACKORDER&nbsp;&nbsp; <span className="small" style={{ color: "white", marginTop: "auto", marginBottom: "auto", justifyContent: "left" }} > (precios con I.V.A.):</span></p>
                                        {/* <div className='text-right col-12 col-sm-4' style={{ width: '100%' }}>
                                            <label className="mr-3">
                                                Incluir en la orden
                                            </label>
                                            <label className="switch mt-3 mr-4" >
                                                <input type="checkbox"
                                                disabled={resurtido === 'SI' ? false : true}

                                                />
                                                <span className="sliderDC round"></span>
                                            </label>
                                        </div> */}
                                        {/* <div className='col-3 text-right'>
                                        
                                                    <label className="mr-3">
                                                        Datos temporales
                                                    </label>
                                                    <label className="switch mt-3 mr-4" >
                                                        <input type="checkbox"
                                                            // disabled={showTemporalData ? false : true}
                                                        
                                                        />
                                                        <span className="sliderDC round"></span>
                                                    </label>
                                                
                                        </div> */}

                                    </div>

                                    <div className='row'>
                                        <div className='col-3'>
                                            {/* <input className='ml-5 mr-2' type='checkbox'></input>
                                            <label style={{ color: "white" }}>Seleccionar todo</label> */}
                                        </div>
                                        <div className='col-9'>
                                            {!!items.length &&
                                                <div onClick={() => this.deleteSelection()}
                                                    className='text-left text-sm-right'
                                                    style={{ cursor: 'pointer', color: 'white' }}>
                                                    <i className="fa fa-trash" style={{ color: "#DF7654" }} /> Eliminar Seleccionados
                                                </div>
                                            }
                                        </div>

                                    </div>
                                </div>
                                {/* ,border: '2px solid #000',borderRadius: '10px' */}
                                <div className="card-body screen" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    {!!items.length ?
                                        <ShoppingCartList
                                            view={VIEW_NAME.SHOPPING_CART_VIEW}
                                            data={items}
                                            deleteItem={deleteShoppingCart}
                                            changeQuantity={this.changeQuantity}
                                            add={addShoppingCart}
                                            sendTo={this.sendToBackOrder}
                                            // businessPartnerInfo={businessPartnerInfo}

                                            refeshState={this.refeshState}
                                            itemPromociones={itemPromociones}
                                            selectItemsPromo={this.selectItemsPromo}
                                            itemsRegalos={itemsRegalos}
                                            itemsRegalosSelect={itemsRegalosSelect}
                                            deleteItemPromo={this.deleteItemPromo}
                                            boxes={boxes}
                                            itemsNotificacion={itemsNotificacion}
                                            changeItemsToDelete={this.changeItemsToDelete}
                                            backOrder={true}
                                            // changeBckOrdr = {this.handelChange}
                                            itemsToDelete={itemsToDelete}
                                        /> :
                                        <div className='text-center' style={{ fontSize: 30 }}>
                                            Carrito vacío
                                        </div>}
                                </div>

                            </div> : ""
                        }
                    </div>

                    <div className="col-lg-3 pt-3 mb-3" style={{marginTop:"40px"}}>
                        {config.modules.points && <div className="card" style={{
                            borderRadius: 20,
                            backgroundColor: config.navBar.backgroundColor,
                            border: '1px solid #ADADAD'
                        }}>
                            {
                                businessPartnerInfo.U_FMB_Handel_CardAct == "1" &&
                                businessPartnerInfo.U_FMB_Handel_RedCard != null &&
                                flagPoints === true &&
                                <>
                                    <div className="card-header text-white"
                                        style={{ background: "#ADADAD", borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottom: "none" }}>
                                        <div className="card-title">
                                            <h3 style={{ color: config.shoppingList.textsummaryList }}>Puntos</h3>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        {pointsInfo && this.renderPointsData()}
                                    </div>
                                </>
                            }
                        </div>
                        }
                        {config.modules.points && <br />}
                        <div className="card mb-4" style={{
                            borderColor: 'white', borderRadius: 20,
                            backgroundColor: "white",
                            border: '1px solid #ADADAD',
                            
                        }}>
                            <div className="card-header text-white"
                                style={{ background: "#ADADAD", borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottom: "none" }}>
                                <div className="card-title">
                                    <h3 style={{ color: config.shoppingList.textsummaryList }}>Resumen:</h3>
                                </div>
                            </div>

                            <div className="card-body">
                                {this.renderShoppingCartTotal()}
                                <div >
                                    <div class="input-group mb-2">
                                        <div class="input-group-prepend">
                                            <div className="input-group-text font-weight-bold">Backorder</div>
                                        </div>
                                        <select name="resurtido" value={resurtido} onChange={(event) => this.handelChange(event.nativeEvent.target.value)} placeholder="Selecciona una marca" className="form-control text-left" style={{ textAlign: "center", height: 30, padding: 0 }}>
                                            <option value="NO">NO</option>
                                            <option value="SI">SI</option>
                                        </select>
                                    </div>
                                </div>
                                {/* {CodOrder ?   
                                    <div>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div className="input-group-text font-weight-bold">N°. de Orden de Compra</div>
                                            </div>
                                            <input type="text" class="form-control" id="inlineFormInputGroup" name="numOrden" id="numOrden" onChange={this.handelChange}/>
                                        </div>
                                        <input type="file" name="file" id="fileImput" enctype="multipart/form-data" onChange={this.handleInputChange}  placeholder="Archivo orden de compra" className="form-control-file" ></input>
                                    </div>
                                    : ''
                                } */}
                                {items.length !== 0 &&
                                    role === ROLES.CLIENT ?
                                    <div className="col-12 text-right p-0 mt-3">
                                        <button type='button' onClick={this.mostrar} className="btn btn-block text-white" style={{ fontWeight: "bold", borderRadius: 10, background: "#86C03F" }}>Continuar compra</button>
                                    </div> :
                                    role === ROLES.PUBLIC && items.length === 0 ?
                                        <div className="col-12 text-right p-0 mt-3">
                                            <button type='button' onClick={this.redirectLogin} className="btn btn-block text-white" style={{ fontWeight: "bold", borderRadius: 10, background: "#86C03F" }}>Continuar compra</button>
                                        </div> :
                                        <div className="col-12 text-right p-0 mt-3">
                                            <button type='button' onClick={this.redirectHome} className="btn btn-block text-white" style={{ fontWeight: "bold", borderRadius: 10, background: "#86C03F" }}>Continuar compra</button>
                                        </div>
                                }
                                {config.modules.pasarelaCarrito && <div className="mt-3 row col-12 formasPagoImages text-center">
                                    <div className="col-lg-auto col-md-3 col-sm-auto col-3" style={{ marginTop: "auto", marginBottom: "auto" }}>
                                        <img className="img-fluid"
                                            src={require('../../images/diasa/carrito/icon-02.png')}
                                            alt="Segundo NavBar"
                                        />
                                    </div>
                                    <div className="col-lg-auto col-md-3 col-sm-auto col-3" style={{ marginTop: "auto", marginBottom: "auto" }}>
                                        <img className="img-fluid"
                                            src={require('../../images/diasa/carrito/icon-03.png')}
                                            alt="Segundo NavBar"
                                        />
                                    </div>
                                    <div className="col-lg-auto col-md-3 col-sm-auto col-3" style={{ marginTop: "auto", marginBottom: "auto" }}>
                                        <img className="img-fluid"
                                            src={require('../../images/diasa/carrito/icon-04.png')}
                                            alt="Segundo NavBar"
                                        />
                                    </div>
                                    <div className="col-lg-auto col-md-3 col-sm-auto col-3" style={{ marginTop: "auto", marginBottom: "auto" }}>
                                        <img className="img-fluid"
                                            src={require('../../images/diasa/carrito/icon-05.png')}
                                            alt="Segundo NavBar"
                                        />
                                    </div>
                                    <div className="col-lg-auto col-md-3 col-sm-auto col-3" style={{ marginTop: "auto", marginBottom: "auto" }}>
                                        <img className="img-fluid"
                                            src={require('../../images/diasa/carrito/icon-06.png')}
                                            alt="Segundo NavBar"
                                        />
                                    </div>
                                    <div className="col-lg-auto col-md-3 col-sm-auto col-3" style={{ marginTop: "auto", marginBottom: "auto" }}>
                                        <img className="img-fluid"
                                            src={require('../../images/diasa/carrito/icon-07.png')}
                                            alt="Segundo NavBar"
                                        />
                                    </div>
                                    <div className="col-lg-auto col-md-3 col-sm-auto col-3" style={{ marginTop: "auto", marginBottom: "auto" }}>
                                        <img className="img-fluid"
                                            src={require('../../images/diasa/carrito/icon-08.png')}
                                            alt="Segundo NavBar"
                                        />
                                    </div>
                                </div>
                                }
                                {config.modules.cupon &&
                                    <div className="text-center mb-4 seccionCupon">
                                        <span style={{ color: "#808080", fontFamily: 'Poppins', fontSize: 18 }}> ¿Cuentas con algún cupón?</span>
                                        <div className="mt-2">
                                            <div className="input-group mb-3" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "auto", marginRight: "auto" }}>
                                                <input type="text"
                                                    className="form-control form-control-lg"
                                                    placeholder=""
                                                    onChange={(event) => { this.changeDiscount(event) }} />
                                                <div className="input-group-append">
                                                    <button className="btn text-white btn-lg"
                                                        type="submit"
                                                        style={{ background: "#0076B8" }}
                                                        onClick={this.checkDiscount}
                                                    >
                                                        Aplicar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="mt-4" style={{ width: "60%", marginLeft: "auto", marginRight: "auto" }}>
                                    <img className="img-fluid"
                                        src={require('../../images/diasa/carrito/icon-09.png')}
                                        alt="Segundo NavBar"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="card mb-4" style={{
                            borderColor: 'white', borderRadius: 20,
                            backgroundColor: "white",
                            border: '1px solid #ADADAD'
                        }}>
                            <div className="card-header text-white"
                                style={{ background: "#ADADAD", borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottom: "none" }}>
                                <div className="card-title">
                                    <h3 style={{ color: config.shoppingList.textsummaryList }}>Detalles:</h3>
                                </div>
                            </div>

                            <div className="card-body">
                                {this.renderShoppingCartDetail()}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="PromoRedSlider" style={{ margin: 'auto', justifyContent: "center", alignItems: "center", maxWidth: '90%' }}>
                        {items.length !== 0 && 
                            itmsRelated.length !== 0 ? (
                            <ItemRelatedSlider changeQuantity={this.changeQuantity} dashboard={10} changeBackOrder={this.changeBackOrder} items1={itmsRelated} setItemsRelated={setItemsRelated} />
                        ) : (
                            <div style={{ paddingTop: 100, margin: 0, textAlign: "center" }}>No hay artículos disponibles de momento:
                                <br />
                                <br />
                                <i style={{ fontSize: 70 }} className={config.icons.search}></i>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        itemsReducer: state.ItemsReducer,
        sessionReducer: state.SessionReducer,
        configReducer: state.ConfigReducer,
        notificationReducer: state.NotificationReducer,
        shoppingCartReducer: state.ShoppingCartReducer
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
        setGetShoppingCartReference: value => dispatch({ type: DISPATCH_ID.SHOPPING_CART_GET_SHOPPING_CART_REFERENCE, value }),
        setShoppingCart: value => dispatch({ type: DISPATCH_ID.SHOPPING_CART_SAVE_CART, value }),
        setItemsGift: value => dispatch({type: DISPATCH_ID.SHOPPING_CART_ITEMS_GIFT,value}),
        setItemsRelated: value => dispatch({type: DISPATCH_ID.ITEMS_SET_RELATED_CART,value}),
    };
};



export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShoppingCartView);