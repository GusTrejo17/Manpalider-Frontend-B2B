import React, {Component} from 'react';
import { VIEW_NAME, ROLES, OBJ_TYPE, DISPATCH_ID, config, SERVICE_API,SERVICE_RESPONSE } from "../../libs/utils/Const";
import {Footer, ItemDetailsModal, ItemsList, NavBar, Session, ShoppingCartList, CommentsModal, ItemsPromoModal} from "../../components";
import {connect} from "react-redux";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import CurrencyFormat from 'react-currency-format';
import {Modal} from '../../components/index';
import CreditLimitModal from '../../components/CreditLimitModal';
import $ from 'jquery';
import ValidateOrderView from '../validateOrder/ValidateOrderView';
import { parseJSON } from 'jquery';
import './quote.css';
import { animateScroll as scroll, scroller } from 'react-scroll';

let apiClient = ApiClient.getInstance();
// Definicion de un arreglo para el producto Flete
let responseFlete = {ItemCode:'',ItemName:'',Price:'0',PriceList:'0',PurchaseLimit:''};
let modal = new Modal();
let discPrcnt = 0;

class QuoteView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itemsBonificacion :[],
            selectorType : null,
            itemDisparador: null,
            itemsRegalos : [],
            itemsRegalosSelect: [],
            EitemsRegalos : [],
            boxes:[],
            itemsNotificacion:[],
            businessPartnerInfo: {},
            pointsInfo: {},
            activePoints : '',
            coupon: '',
            infoCoupon: {},
            discPrcnt: 0,
            resurtido : 'NO',
            numOrden : '',
            file: '',
            resetInputQuantity: 1,
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

    refeshState = (array,Notificacion) =>{
        //  console.log('con>Notificacion',Notificacion);
        const {history, shoppingCartReducer: {items}, itemsReducer: {addShoppingCart, deleteShoppingCart}} = this.props;
        const {itemsRegalosSelect} = this.state;

        // console.log('con>array',array);
        let itemsPromo = [];
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                // console.log('con>element',element);
                if (element.itemDisparador ===  item.ItemCode && element.tipoSeleccion === 1) {
                    if(element.tipoDisparador === 2){
                        let result = itemsPromo.find(itemDisp => (itemDisp.itemDisparador !== item.ItemCode) );
                        if(!result){
                            element.bonificacion.cantidad*= element.homeItemQuantity;
                            itemsPromo.push(element);
                        }
                    }else if(element.tipoDisparador === 1){
                        element.bonificacion.cantidad*= element.homeItemQuantity;
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
        
        if(itemsPromo.length > 0){
            let boxes = [];
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if(element.tipoSeleccion === 2){
                    let result = boxes.find(item => (item.itemDisparador === element.itemDisparador ));
                    if(!result){
                        boxes.push(element);
                    }
                }
            }
            for (let index = 0; index < itemsRegalosSelect.length; index++) {
                const element = itemsRegalosSelect[index];
                for (let index = 0; index < boxes.length; index++) {
                    const box = boxes[index];
                    if(element.itemDisparador === box.itemDisparador && element.idDisparador === box.idDisparador ){
                        boxes.splice(index,1);
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
            
        }else{
            let boxes = [];
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if(element.tipoSeleccion === 2){
                    let result = boxes.find(item => (item.itemDisparador === element.itemDisparador ));
                    if(!result){
                        boxes.push(element);
                    }
                }
            }
            for (let index = 0; index < itemsRegalosSelect.length; index++) {
                const element = itemsRegalosSelect[index];
                for (let index = 0; index < boxes.length; index++) {
                    const box = boxes[index];
                    if(element.itemDisparador === box.itemDisparador && element.idDisparador === box.idDisparador ){
                        boxes.splice(index,1);
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
   
    selectItemsPromo = (itemsPromo,ItemCode) =>{
        const {itemPromociones,itemsRegalos} = this.state;

        if(itemsPromo.selectorType === 1){
            let arrayPromo = itemPromociones;
            for (let index = 0; index < arrayPromo.length; index++) {
                const promo = arrayPromo[index];
                for (let index = 0; index < promo.bonificacion.length; index++) {
                    const element = promo.bonificacion[index];
                    for (let index = 0; index < itemsPromo.length; index++) {
                        const items = itemsPromo[index];
                        if(element.bonificacion === items.idDetallesPromo){
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
        }else{
            let boxes = [];
            for (let index = 0; index < itemPromociones.length; index++) {
                const element = itemPromociones[index];
                if(element.tipoSeleccion === 2){
                    if(element.idDisparador === itemsPromo.idDisparador && element.itemDisparador === ItemCode){
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
                if(!include){

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

    addItemsPromo = (item) =>{
        const {itemPromociones,itemsRegalos,itemDisparador,itemsBonificacion,boxes,itemsRegalosSelect} = this.state;
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
        element.bonificacion.cantidad*= element.homeItemQuantity;
        itemsRegalosSelect.push(element);
    }
    // console.log('con< itemsRegalosSelect', itemsRegalosSelect);


       if(item[0].tipoDisparador === 1){
            this.setState( prevState => ({
                itemsRegalosSelect,
                boxes: prevState.boxes.filter(box => (box.itemDisparador !== item[0].itemDisparador )),
            }));
       }else if(item[0].tipoDisparador === 2){
            this.setState( prevState => ({
                itemsRegalosSelect,
                boxes: prevState.boxes.filter(box => (box.idDisparador !== item[0].idDisparador )),
            }));
       }
        $('#boniModal').modal('hide');

    }

    deleteItemPromo = (element) =>{
        this.setState( (prevState) => ({
            boxes: [...prevState.boxes,element],
            itemsRegalosSelect: prevState.itemsRegalosSelect.filter(item => (item.itemDisparador !== element.itemDisparador )),
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

    async componentDidMount(){
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

    // Peticion del producto flete
    getRegisterPack = async () => {
        return await apiClient.getFlete();
    };

    // accountBusinessPartnerInfo = async () => {
    //     const {sessionReducer, enableSpinner, notificationReducer:{showAlert}} = this.props;

    //     if(sessionReducer.user.CardCode){
    //         let cardCode = sessionReducer.user.CardCode;
    //         enableSpinner(true);
    //         let response = await apiClient.getBusinessPartnerInfo(cardCode);
    //         enableSpinner(false);
    //         if (response.status === SERVICE_RESPONSE.SUCCESS) {
    //             this.setState({
    //                 businessPartnerInfo : response.data.resultData,
    //                 pointsInfo : response.data.resultInfoPoints,
    //                 activePoints : response.data.resultInfoPoints.totalPoints
    //             });
    //         } else {
    //             this.setState({
    //                 businessPartnerInfo : {permissions:'NO'},
    //             });
    //             showAlert({type: 'warning', message: response.message || ' Ocurrió un error al traer su info.', timeOut: 8000});                
    //         }
    //     }
    // }

    createDocument = async () => {
        const {shoppingCartReducer: {items}, notificationReducer: {showAlert}, configReducer: {history},setItemsGift} = this.props;
      //const {itemPromociones,Limit, Codigo, CardName, itemsRegalos, itemsBonificacion,selectorType,itemsRegalosSelect,,itemsNotificacion} = this.state;
        const {itemsRegalos,itemsRegalosSelect, infoCoupon, activePoints,boxes, resurtido, numOrden, file} = this.state;

        if(boxes.length > 0){
            boxes.map(articulosSeleccionados =>{
                showAlert({type: 'warning', message: 'No has seleccionado la bonificación del artículo: ' + articulosSeleccionados.itemDisparador, timeOut: 8000});
            })
            return;
        }        
        let data = {
            resurtido : resurtido, 
            numOrden : numOrden, 
            file : file
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
        if( infoCoupon.U_TIPO_DSCT === "1" || infoCoupon.U_TIPO_DSCT === "2" ){
            localStorage.setItem(config.general.localStorageNamed + 'Discount',JSON.stringify(infoCoupon));
        }else{
            localStorage.setItem(config.general.localStorageNamed + 'Discount',JSON.stringify(null));
        }
        // Descuento por puntos
        if (activePoints != 0){
            localStorage.setItem(config.general.localStorageNamed + 'DiscountPoints',activePoints);
        }else{
            localStorage.setItem(config.general.localStorageNamed + 'DiscountPoints',0);
        }

        history.goSelectAddress();
        //let response = await apiClient.createDocument({objType: OBJ_TYPE.ORDER, currency: 'MXP'});
    };

    changeActivePoints = (event) => {
        const { pointsInfo, activePoints } = this.state;
        const { notificationReducer:{showAlert} } = this.props;
        let newActivePoints =  event.nativeEvent.target.value;
        // console.log('######newActivePoints', newActivePoints);
        if(parseInt(newActivePoints) > parseInt(pointsInfo.totalPoints)){
            showAlert({type: 'warning', message: ' No puedes exceder el número de puntos: ' + pointsInfo.totalPoints, timeOut: 8000});
            this.setState({
                activePoints : pointsInfo.totalPoints
            });
            return;
        }else{
            this.setState({
                activePoints : newActivePoints
            });
        }
        // console.log('######activePoints', activePoints);
        
    }

    changeDiscount = (event) => {
        let newCoupon =  event.nativeEvent.target.value;
        this.setState({
            coupon : newCoupon
        });
        
    }

    renderPointsData = () => {
        const { pointsInfo, activePoints } = this.state;
        //console.log("Foca",pointsInfo.pointsMoney);
        let valueEquals = parseFloat(pointsInfo.pointsMoney);
        let valuePoints = parseFloat(pointsInfo.totalPoints * valueEquals);

        return (
            <div className="container" style={{ fontSize: 18}}>
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
                        <input type="text" className="form-control" maxLength = '70' size = '70'
                            value = {activePoints || 0} style={{borderRadius: 10}}
                            onChange={(event) => {this.changeActivePoints(event)}}
                            // Activo para usuarios SIN SESIÓN
                            disabled = {pointsInfo.totalPoints == 0 ? true : false}
                            />
                    </div>
                </div>
            </div>
        )
    };

    mostrar = async () => {
        const { shoppingCartReducer: {items},notificationReducer: {showAlert}, sessionReducer} = this.props;
        const { Balance, CreditLine, boxes, resurtido, numOrden, file} = this.state;

        

        let flag = true;
        let noEntrar = true;
        for (let index = 0; index < items.length; index++) {
            const element = items[index]; 
            let piv1 = 0;
            let piv2 = 0;
            if(element.quantity === 0 || element.quantity === "0"){
                showAlert({type: 'warning', message: 'El artículo ' + element.ItemCode + ' no puede ir en cantidad 0', timeOut: 5000});
                return;
            }
            if(element.U_MultiploVenta !== null && element.U_MultiploVenta !== 0){
                let multiplo = parseInt(element.quantity) %  element.U_MultiploVenta;
                if(multiplo == 0){
                    // showAlert({type: 'success', message: 'El artículo ' + element.ItemCode + ' si es multiplo', timeOut: 5000});
                    flag = true;
                }else{
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

                    showAlert({type: 'error', message: 'Al artículo ' + element.ItemCode + ' le faltan '+result1+' unidades', timeOut: 8000});// o compra +piv1
                    flag = false;
                    noEntrar = false;
                }
            }
        }
        
        if(flag && noEntrar){
            if(boxes.length > 0){
                boxes.map(articulosSeleccionados =>{
                    showAlert({type: 'warning', message: 'No has seleccionado la bonificación del artículo: ' + articulosSeleccionados.itemDisparador, timeOut: 8000});
                })
                return;
            }
            let limit = Balance- CreditLine;
            this.createDocument();   
        }
    };

    checkDiscount = async () => {
        // Recibir el cupon ingresado
        const { coupon } = this.state
        const { notificationReducer: { showAlert } } = this.props;
        // Buscar si el cupón existe
        if ( coupon != '') {
            let responseInfoCoupon = await apiClient.getInfoCoupon(coupon);
            if( responseInfoCoupon.status === 1 ){
                showAlert({type: 'success', message: "Cupón encontrado", timeOut: 8000});
                // Asiganar cupon
                this.setState({
                    infoCoupon: responseInfoCoupon.data,
                });
            }else{
                showAlert({type: 'warning', message: responseInfoCoupon.message, timeOut: 8000});
                // Asiganar cupon
                this.setState({
                    infoCoupon: [],
                });
            }
        }else{
            showAlert({type: 'warning', message: "No has colocadó un cupón", timeOut: 8000});
        }
        
        

    }

    // changeQuantity = async (index, item, newQuantity, addItem) => {
    //     const {enableSpinner, setShoppingCart, itemsReducer: {addShoppingCart, deleteShoppingCart}, shoppingCartReducer: {items}} = this.props;
        
    //     items.map(itemFilter => {
    //         if (item.ItemCode === itemFilter.ItemCode) {
    //             itemFilter.quantity = newQuantity;
    //         }
    //     });

    //     setShoppingCart(items);

    //     if (!newQuantity) return;

    //     if (addItem) {
    //         addShoppingCart({item, quantity: (newQuantity)})
    //     } else {
    //         //deleteShoppingCart({item, deleteAll: false});
    //     }

        
    // };

    renderShoppingCartTotal = () => {
        const {history, shoppingCartReducer: {items}, itemsReducer: {addShoppingCart, deleteShoppingCart}} = this.props;
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
        let peso=0;

        let activePointsNew = activePoints;
        items.map(item => {
            // //console.log("ITEMS MAP---",item)
            let totalPrice = parseFloat(item.Price * parseInt(item.quantity)).toFixed(2);
            if(item.SWeight1){
                peso = peso + Number(item.quantity) * item.SWeight1;
            }else{
                peso = 1;
            }
            localStorage.setItem("Peso",peso)
            subTotal += Number(totalPrice)
            tax = item.taxRate;
            taxTotal = parseFloat(subTotal * (tax * 0.01));
            // taxTotal = Math.round(taxTotal);
            localLanguage = item.localLanguage;
            currency = item.currency;
        });
        //Asignacion de valores para el flete
        limit = parseInt(responseFlete.PurchaseLimit);
        transport = parseFloat(responseFlete.Price);
        taxTransport = parseFloat(transport*(tax*0.01));
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
        if( infoCoupon.U_TIPO_DSCT === "1" && pointsInfo && activePoints){
            // Descuento por porcentaje
            let valueAux = parseFloat(infoCoupon.U_VALOR_DSCT);
            valueDiscount = valueAux;
            // valueDiscount = (total / 100) * valueAux;
            // total = total - valueDiscount;
        }
        if( infoCoupon.U_TIPO_DSCT === "2" && pointsInfo && activePoints){
            // Descuento en efectivo
            valueDiscount = parseFloat(infoCoupon.U_VALOR_DSCT);
            // discPrcnt = (valueDiscount * 100) / total;
            // total = total - valueDiscount;
        }

       // total = Math.round(total);
        localStorage.setItem(config.general.localStorageNamed + 'OrderTotal', total);
        return (
            <div className="container" style={{fontSize: 18}}>
                <div className="row">
                    <div className="col-6" style={{padding: 0}}>
                        <span className="font-weight-bold">Subtotal: </span>
                    </div>
                    <div className="col-6 text-right" style={{padding: 0}}>
                        <span className="text-right">
                            <CurrencyFormat 
                                value={subTotal} 
                                displayType={'text'} 
                                thousandSeparator={true} 
                                fixedDecimalScale={true} 
                                decimalScale={2} 
                                prefix={'$ '}
                                suffix={config.general.currency}>
                            </CurrencyFormat>
                        </span>
                    </div>
                </div>
                
                <div className="row border-bottom">
                    <div className="col-6" style={{padding: 0}}>
                        <span className="font-weight-bold">
                            I.V.A. ({tax}%): 
                        </span>
                    </div>
                    <div className="col-6 text-right" style={{padding: 0}}>
                        <span className="text-right">
                            <CurrencyFormat 
                                value={taxTotal} 
                                displayType={'text'} 
                                thousandSeparator={true} 
                                fixedDecimalScale={true} 
                                decimalScale={2} 
                                prefix={'$ '}
                                suffix={config.general.currency}>
                            </CurrencyFormat>
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6" style={{ padding: 0 }}>
                        <span className="font-weight-bold">Total sin envio: </span>
                    </div>
                    <div className="col-6 text-right" style={{ padding: 0 }}>
                        <span className="text-right font-weight-bold" style={{color: "#86C03F"}}>
                            {subTotal === 0 ?
                                <CurrencyFormat
                                    value={0}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    fixedDecimalScale={true}
                                    decimalScale={2}
                                    prefix={'$ '}
                                    suffix={config.general.currency}>
                                </CurrencyFormat> :
                                <CurrencyFormat
                                    value={total}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    fixedDecimalScale={true}
                                    decimalScale={2}
                                    prefix={'$ '}
                                    suffix={config.general.currency}>
                                </CurrencyFormat>
                            }
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
                            <span className="text-right" style={{color: "#86C03F"}}>
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
        const {itemsReducer: {addBackOrder, deleteShoppingCart}} = this.props;
        deleteShoppingCart({item, deleteAll: false});
        addBackOrder({item, quantity: (item.quantity || '1')})
    };

    cargarDatos = async () => {
        let user = localStorage.getItem(config.general.localStorageNamed + 'CurrentUser');
        user = JSON.parse(user) || {};
        let limit = user.Balance- user.CreditLine;
        this.setState({
            Codigo: user.CardCode,
            CardName : user.CardName,    
            Balance : user.Balance ,
            CreditLine : user.CreditLine,
            Limit : limit,
            CodOrder : user.U_MOC == 'SI' ? true : false, 
        });
    };

    renderShoppingCartDetail = () => {
        const {history, shoppingCartReducer: {items}, itemsReducer: {addShoppingCart, deleteShoppingCart}} = this.props;
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
            <div className="container" style={{fontSize: 18}}>
               
                <div className="row border-bottom">
                    <div className="col-6" style={{padding: 0}}>
                        <span className="font-weight-bold">Total de articulos:</span>
                    </div>
                    <div className="col-6 text-right" style={{padding: 0}}>
                        <span className="text-right">
                            {parseInt(articulos)}
                        </span>
                    </div>
                </div>
                <div className="row border-bottom">
                    <div className="col-6" style={{padding: 0}}>
                        <span className="font-weight-bold">Total de unidades:</span>
                    </div>
                    <div className="col-6 text-right" style={{padding: 0}}>
                        <span className="text-right">
                            {parseInt(unidades)}
                        </span>
                    </div>
                </div>
            </div>
        )
    };

    async handleInputChange (event) {
        const target = event.target
        const value = target.value
        const name = target.name
        this.setState({
            [name]: value.split('\\').pop()
        })
    };

    handelChange = ({ target }) => {
        const { name, value } = target;
        this.setState({
            [name]: value
        });
    };

    onTextChanged = async (e) => {
        const {setSearch, setIdCategory, setLocation} = this.props;
        let value = e.target.value;
        
        let inputSearch = document.getElementById("dropdownAutoComplete");
        let arrayValue = value.split("~");
        if(arrayValue.length === 3){
            value = value.replace(/ ~ /g, ", " );
        }
        setSearch(value)
        inputSearch.value = value;
        this.setState(() => ({ text: value}));
    };
    
    search = async () => {
        const {itemsReducer,setIdCategory,setLocation} = this.props;
        setIdCategory(null);
        // setLocation('navBar');
        await itemsReducer.searchByKey(0,'Lite',true);
        this.setState({
            resetInputQuantity: 1
        })
    };
    changLocalQuantity = (item, event)=>{
        const {shoppingCartReducer: {items},itemsReducer: {items: itemsSearch}} = this.props;
        let newQuantity =  event.nativeEvent.target.value;
        if (newQuantity % 1 == 0) {
            itemsSearch.map( itemFilter => {
                if (itemFilter.ItemCode === item.ItemCode) {
                    itemFilter.quantity = newQuantity;
                }
            });
            this.applyFilters(itemsSearch);
        } else {
            return;
        }
        this.setState({
            resetInputQuantity: newQuantity
        }) 
    };

    applyFilters = data => {
        const {setItemsFilterSearch} = this.props;
        setItemsFilterSearch(data);
    };

    changeQuantity = (item,event) =>{
        const { itemsReducer: {items: itemsSearch,addShoppingCart,deleteShoppingCart}} = this.props;
        let newQuantity;
        itemsSearch.map( itemFilter => {
            if (itemFilter.ItemCode === item.ItemCode) {
                newQuantity = itemFilter.quantity || '1';
            }
        });   
        // let piv1 = 0;
        // let piv2 = 0;
        // let flag = true;
        // let message = '';
        // if(item.U_MultiploVenta !== null){
        //     let multiplo = parseInt(newQuantity) % item.U_MultiploVenta;
        //     if(multiplo == 0){
        //         flag = true;
        //     }else{
        //         piv1 = parseInt(newQuantity);
        //         piv2 = parseInt(newQuantity);

        //         while (piv1 % item.U_MultiploVenta !== 0) {
        //             piv1++;                        
        //         }
        //         let result1 = piv1 - parseInt(newQuantity);

        //         while (piv2 % item.U_MultiploVenta !== 0) {
        //             piv2--;                        
        //         }
        //         let result2 = piv2 - parseInt(newQuantity);
        //         message = 'Al artículo le faltan '+result1+' unidades';
        //         flag = false;
        //     }
        // }

        // if(item.U_MultiploVenta !== null && item.U_MultiploVenta !== 'null' && item.U_MultiploVenta !== undefined && item.U_MultiploVenta !== 'undefined' && item.U_MultiploVenta > 1 && item.U_MultiploVenta !== parseInt(newQuantity)){
        //     if(flag === false) showAlert({type: 'warning', message: item.U_MultiploVenta <= parseInt(newQuantity) ? message : "La compra minima de este producto es de: "+ item.U_MultiploVenta + " unidades", timeOut: 8000});
        // }
        
        addShoppingCart({ item, quantity: (newQuantity || '1') })
        // changeQuantity(index,item, newQuantity, true); // add
        //     showAlert({type: 'warning', message: "Se excede el número de articulos disponibles de este producto", timeOut: 2500});
        // }
        this.setState({
            resetInputQuantity: 1
        })
    };

    render() {
        const {sessionReducer: {role}} = this.props;
        const {history, shoppingCartReducer: { items }, itemsReducer: {addShoppingCart, deleteShoppingCart}, itemsReducer} = this.props;
        const {itemPromociones,Limit, Codigo, CardName, itemsRegalos, itemsBonificacion,selectorType,itemsRegalosSelect,boxes,itemsNotificacion,businessPartnerInfo, pointsInfo, activePoints, CodOrder, resetInputQuantity} = this.state;

        let flagPoints = false;
        if(items){
            items.map(item => {
                if(item.U_FMB_Handel_PNTA == 1){
                    flagPoints = true;
                    return;
                }
            });
        }
        return (
            <div className="content-fluid" style={{ marginTop: 150, backgroundColor: config.Back.backgroundColor }}>
                <Session history={history} view={VIEW_NAME.SHOPPING_CART_VIEW}></Session>
                <NavBar/>
                <ItemsPromoModal
                    items = {itemsBonificacion}
                    selectorType = {selectorType}
                    addItemsPromo = {this.addItemsPromo}
                />
                <CreditLimitModal
                    Limit={Limit}
                    Codigo={Codigo}

                    CardName={CardName}
                    createDocument={this.createDocument}
                ></CreditLimitModal>
                <div className="hidden">
                </div>
                <div className="row mr-0 ml-0">
                    <div className="col-lg-8 pt-5 ">
                    <div class="wrap " style={{marginBottom: "1%"}}>
                            <div class="search">
                                <input 
                                    type="text" 
                                    class="searchTerm" 
                                    placeholder="No. de fabricante?"
                                    onChange={this.onTextChanged}
                                    onKeyDown={event => event.keyCode === 13 && this.search()}
                                >
                                </input>
                                <button type="submit" class="searchButton" onClick={this.search}> 
                                    <i style={{fontSize: "1.3rem"}} className={config.icons.search}/>
                                </button>
                            </div>
                    </div>
                    {/* <div className='container' style={{marginLeft:"160px"}}>
                        
                    </div> */}
                        <div className="card style-articles-cart" style={{borderRadius: 20, marginBottom:"3rem",border:"solid 1px rgb(	30, 98, 155"}}>
                        {/* cambios desde aqui */}
                            <div className="card-header" style={{paddingTop:16, background: "#0060EA", borderTopLeftRadius: 20, borderTopRightRadius: 20,}}>
                                <div className='row'>
                                    <p className="card-title col-12 col-sm-8 row" style={{ color: config.shoppingList.textProductList, justifyContent: "left" }}>Articulos resultantes&nbsp;&nbsp; <span className="small" style={{ color: "white", marginTop: "auto", marginBottom: "auto" }} ></span></p>
                                    <div className='text-right col-12 col-sm-4' style={{ width: '100%' }}>
                                        

                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{ height: items.length >= 6 ? '600px' : '', overflowY: items.length >= 6 ? 'auto' : 'hidden' }}>
                                {/* aqui se van a mapear  */}
                                <table className="table scroll border border-light" style={{ margin: '0px' }} >
                                    <thead style={{ textAlign: "center" }}>
                                        <tr className="black-text" style={{height:'70px'}}>
                                            <th scope="col" style={{ width: '20%', textAlign: 'center', fontWeight:'bolder', fontSize: '12', borderBottom: "1px solid #dee2e600" }}>Nombre</th>
                                            <th scope="col" style={{ width: '20%', textAlign: 'center', fontWeight:'bolder', fontSize: '12', borderBottom: "1px solid #dee2e600" }}>Cantidad</th>
                                            <th scope="col" style={{ width: '20%', textAlign: 'center', fontWeight:'bolder', fontSize: '12', borderBottom: "1px solid #dee2e600"  }}>Stock</th>
                                            <th scope="col" style={{ width: '20%', textAlign: 'center', fontWeight:'bolder', fontSize: '12', borderBottom: "1px solid #dee2e600" }}>Precio</th>
                                            <th scope="row" style={{ width: '20%', textAlign: 'center', fontWeight:'bolder' , fontSize: '12', borderBottom: "1px solid #dee2e600" }}>Agregar a carrito</th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {itemsReducer.items.map((itemLite) => {
                                        // console.log('jona> itemLite', itemLite);
                                            return (
                                                <tr>
                                                    <td style={{ width: '20%', fontSize: 12 }}>{itemLite.ItemName}</td>
                                                    <td style={{ width: '20%'}}>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        //min={itemLite.U_MultiploVenta || 1}
                                                        className="form-control"
                                                        // name={'quantity' + itemRegalo.idProducto}
                                                        value={resetInputQuantity || 1}
                                                        onChange={(event) => {this.changLocalQuantity(itemLite, event)}}
                                                        onKeyDown={event => event.keyCode === 13 && this.search()}
                                                        placeholder="Cantidad"
                                                        //step={itemLite.U_MultiploVenta || 1}
                                                        style={{ textAlign: 'center' }}
                                                    />
                                                    </td>
                                                    <td style={{ width: '20%', fontSize: 12, textAlign: 'center' }}>{itemLite.OnHandPrincipal}</td>
                                                    <td style={{ width: '20%', fontSize: 12, textAlign: 'center'  }}>{" $ " + Number.parseFloat(itemLite.Price).toFixed(2)}</td>
                                                    <td style={{ width: '20%', textAlign: 'center' }}>
                                                        <button
                                                            className="btn btn-sm"
                                                            type="button"
                                                            style={{backgroundColor:'rgb(0, 96, 234)', color: config.navBar.iconModal }}
                                                            onClick={(event) => this.changeQuantity(itemLite, event)}
                                                        >
                                                            <i className="fas fa-plus-circle"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>

                    {/* <div className="col-lg-4 pt-3 mb-3">
                        { config.modules.points && <div className="card" style={{
                            borderRadius: 20,
                            backgroundColor: config.navBar.backgroundColor,
                            border: '1px solid #ADADAD'
                        }}>
                            
                        </div>
                        }
                        
                       
                    </div> */}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state,props) => {
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
        setIdCategory: value => dispatch({type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value}),
        setLocation:  value => dispatch({type: DISPATCH_ID.ITEMS_SET_LOCATION, value}),
        setSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SET_SEARCH, value}),
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        setGetShoppingCartReference: value => dispatch({type: DISPATCH_ID.SHOPPING_CART_GET_SHOPPING_CART_REFERENCE, value}),
        setShoppingCart: value => dispatch({type: DISPATCH_ID.SHOPPING_CART_SAVE_CART, value}),
        setItemsFilterSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER, value}),
        setItemsGift: value => dispatch(
            {
                type: DISPATCH_ID.SHOPPING_CART_ITEMS_GIFT, 
                value
            }
            ),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QuoteView);