import React, { Component } from 'react';
import { Footer, NavBar, Session } from "../../components";
import { config, DISPATCH_ID, SERVICE_API, VIEW_NAME, ROLES, SERVICE_RESPONSE, licence } from "../../libs/utils/Const";
import { connect } from "react-redux";
import { PayPalButton } from "react-paypal-button";
import { ApiClient } from "../../libs/apiClient/ApiClient";
import CurrencyFormat from 'react-currency-format';
import { Modal } from '../../components/index';
import CommentsModal from '../../components/CommentsModal';
import {CSVLink, CSVDownload} from "react-csv";
import './openPay.css'
import $ from 'jquery';
import { animateScroll as scroll, scroller } from 'react-scroll';
import moment from 'moment';
import ExportReportGeneral from '../../components/ExportReportGeneral';

const apiClient = ApiClient.getInstance();
const mercadopago = require('mercadopago');
var OpenPay = require('openpay');
let modal = new Modal();
let totalCTax;
let fecha;
// Definicion de un arreglo para el producto Flete
let responseFlete = { ItemCode: '', ItemName: '', Price: '0', PriceList: '0', PurchaseLimit: '' };
let discPrcnt = 0;

let paypalOptions = {
    clientId: config.paymentMethod.paypal.clienId,
    intent: 'capture',
    commit: true
};

const buttonStyles = {
    layout: 'vertical',
    shape: 'pill',
    color: 'silver'
};

class ValidateOrderView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: {},
            bill: {},
            paymentMethod: '',
            totalOrder: 0,
            cardNumber: '',
            userNName: '',
            expirationYear: '',
            expirationMont: '',
            cvv2: '',
            cv:'',
            auto: '',
            totalPagar: 0,
            currency: '',
            total: 0,
            insurance: 0,
            csvData : [],
            seller: JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser')),
            comentario : '',
            discPrcnt: 0,
            dsicCash: 0,
            businessPartnerInfo: {},
            pointsInfo: {},
            activePoints : '',
            Viewinsurance: false,
            datos : JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'DatosOrden')),
            numOrden : '',
            file: '',
            comprobantePago: false,
            contadoSelected:false,
            fileComprobante:''
        };

        this.scrollToBottom = this.scrollToBottom.bind(this);
    };
    

    async componentDidMount() {
        const { history, sessionReducer: { role, user } } = this.props;
        let data = sessionStorage.getItem('validateOrder');
        data = JSON.parse(data || '{}');

        const { date, paymentMethod, address, bill,IdPackge, tipoEntrega, comentario, discPrcnt, discPnt, PorCobrar, convenio } = data;

        let discPrcnt1 = discPrcnt;
        let discPnt1 = discPnt;

        let newDate = new Date();
        let diferent = newDate.getTime() - (date ? new Date(date).getTime() : 0);
        if (diferent > 30000) {
            history.push('/shoppingCart');
        }
        let newAddress = {};
        let newBill = {};
        if (role === ROLES.PUBLIC) {
            newAddress.name = address.name || '';
            newAddress.email = address.email || '';
            newAddress.phone = address.phone || '';
            newAddress.street = address.street || '';
            newAddress.block = address.suburb || '';
            newAddress.city = address.city || '';
            newAddress.cp = address.cp || '';
            newAddress.state = address.stateName || '';
            newAddress.country = address.countryName || '';
        }

        if (role === ROLES.CLIENT) {
            newAddress.address = address.Address || '';
            newAddress.street = address.Street || '';
            newAddress.block = address.Block || '';
            newAddress.city = address.City || '';
            newAddress.cp = address.ZipCode || '';
            newAddress.state = address.StateName || '';
            newAddress.country = address.CountryName || '';
        }
        if (role === ROLES.CLIENT) {
            newBill.address = bill.Address || '';
            newBill.street = bill.Street || '';
            newBill.block = bill.Block || '';
            newBill.city = bill.City || '';
            newBill.cp = bill.ZipCode || '';
            newBill.state = bill.StateName || '';
            newBill.country = bill.CountryName || '';
        }

        // console.log("1discPrcnt",discPrcnt);
        // console.log("1discPnt",discPnt);

        setTimeout(() => {
            //  console.log("con°-°",discPrcnt1,discPnt1);

            let totalOrderMethod = this.totalOrder(discPrcnt1 , discPnt1);
            // console.log("LogototalOrder method",totalOrderMethod);
            let currency = totalOrderMethod.currency;
            let total = totalOrderMethod.total;
            // let insurance = totalOrderMethod.insurance;
            let discPrcnt = totalOrderMethod.discPrcnt;
            let dsicCash = totalOrderMethod.dsicCash;
            let discPnt = totalOrderMethod.discPnt;
            
            this.setState({
                currency: currency,
                total: total,
                // insurance: user.U_FMB_Handel_PLZ == 1 || user.U_FMB_Handel_PLZ == null ? insurance : 0,
                discPrcnt: discPrcnt,
                dsicCash: dsicCash,
                discPnt: discPnt,
            })
        }, 500);

        this.setState({
            address: newAddress,
            bill: newBill,
            paymentMethod: paymentMethod || '',
            comentario : comentario,
            IdPackge,
            tipoEntrega,
            PorCobrar, 
            convenio,
            // Viewinsurance : user.U_FMB_Handel_PLZ == 1 || user.U_FMB_Handel_PLZ == null ? true : false,
        })

        this.scrollToBottom();
       
    }

    componentWillUnmount(){        
        sessionStorage.setItem('validateOrder', JSON.stringify({}));
    }

    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
    }

    accountBusinessPartnerInfo = async () => {
        const {sessionReducer, enableSpinner, notificationReducer:{showAlert}} = this.props;

        if(sessionReducer.user.CardCode){
            let cardCode = sessionReducer.user.CardCode;
            enableSpinner(true);
            let response = await apiClient.getBusinessPartnerInfo(cardCode);
            enableSpinner(false);
            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                this.setState({
                    businessPartnerInfo : response.data.resultData,
                    pointsInfo : response.data.resultInfoPoints,
                    activePoints : response.data.resultInfoPoints.totalPoints
                });
            } else {
                this.setState({
                    businessPartnerInfo : {permissions:'NO'},
                });
                showAlert({type: 'warning', message: response.message || ' Ocurrió un error al traer su info.', timeOut: 8000});                
            }
        }
    }

    CreateCardId = async () => {
        const { cardNumber, userNName, expirationMont, expirationYear, cvv2, auto, totalPagar } = this.state;
        const { enableSpinner, notificationReducer: { showAlert }, sessionReducer: { user }, history } = this.props;
        let total = totalPagar;
        enableSpinner(true);
        //console.log('Con> user', user);
        var openPay = new OpenPay('m1oc1lyztnwlna0m1mvb', 'sk_1508a10ba7c24304a1dbbdb5611b4044', false)
        //  var deviceSessionId = openPay.deviceData.setup("payment-form", "deviceIdHiddenFieldName");
        var cardRequest = {
            'card_number': cardNumber,
            'holder_name': userNName,
            'expiration_year': expirationYear,
            'expiration_month': expirationMont,
            'cvv2': cvv2,
        };
        let token = '';
        let fecha = new Date();
        let prueba = fecha.getFullYear() + (fecha.getMonth() + 1) + fecha.getDate() + fecha.getHours() + fecha.getMinutes() + fecha.getMilliseconds()
        let order_id = user.profile_id + '->' + fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate() + '/' + fecha.getHours() + ":" + fecha.getMinutes() + ':' + fecha.getSeconds()
        //console.log("HOLA PRUEBA 1 =>", order_id)
        let vares = '';
        var chargeRequest;
        let cardRequests = new Promise((resolve, reject) => {
            openPay.cards.create(cardRequest,
                function (error, card) {
                    if (error) {
                        showAlert({ type: 'error', message: error.description });
                        reject(error);
                    } else {
                        chargeRequest = {
                            'source_id': card.id,
                            'method': 'card',
                            'amount': total,
                            'currency': 'MXN',
                            'description': 'Cargo de OpenPay por acciones de compra en RedHogar',
                            'order_id': order_id,
                            'device_session_id': 'kR1MiQhz2otdIuUlQkbEyitIqVMiI16f',
                            'customer': {
                                'name': userNName,
                                'email': user.U_FMB_Handel_Email
                            }
                        }
                        resolve(chargeRequest);
                    }
                }
            );
        });
        this.chargeRequests(await cardRequests);
        enableSpinner(false);
        $('#openPayModal').modal('hide');

    }

    chargeRequests = async (cardRequest) => {
        const { enableSpinner, notificationReducer: { showAlert }, sessionReducer: { user }, history } = this.props;
        let vares;
        var openPay = new OpenPay('m1oc1lyztnwlna0m1mvb', 'sk_1508a10ba7c24304a1dbbdb5611b4044', false)
        let cardRequests = cardRequest || {};

        let chargeRequests = new Promise((resolve, reject) => {
            openPay.charges.create(cardRequests,
                function (error, body) {
                    if (error) {
                        showAlert({ type: 'error', message: error.description });
                        reject(error);
                    } else {
                        showAlert({ type: 'info', message: "Pago Exitoso con el numero: " + body.authorization, timeOut: 8000 });
                        vares = body.authorization;
                        resolve(vares);
                    }
                }
            );
        });
        let idPago = await chargeRequests;
        //console.log('con>',idPago);
        if (idPago) {
            this.sendOrder();
        }
    }

    getRegisterPack = async () => {
        //this.state(await apiClient.getFlete());
        return await apiClient.getFlete();
    }

    getRegisterPack = async () => {
        //this.state(await apiClient.getFlete());
        return await apiClient.getFlete();
    }

    renderItem = (item, index) => {
        // Arreglo de imagenes del campo extra
        let imagesArray = item.U_Handel_ImagesArray || '';
        imagesArray = imagesArray.split('|');
        let imagenShow = imagesArray[0] ? (config.BASE_URL + SERVICE_API.getImage + '/' + imagesArray[0]) : require('../../images/noImage.png');
        return <div key={index} className='row' style={{ padding: 0, textAlign: 'center' }}>
            { Number(item.quantity) > item.OnHandPrincipal &&
                <div className="col-12" style={{marginBottom: 5, padding: 5, color: 'red'}}>
                    Stock insuficiente
                </div>
            }
            <div className='col-sm-3' style={{ margin: 0 }}>
                <img
                    className="img-fluid "
                    style={{
                        backgroundColor: 'white',
                        maxHeight: 80
                    }}
                    src={imagenShow}
                    alt="Imagen del producto"
                />
            </div>


            <div className='col-sm-9'>
                <div className="container p-0">
                    <div className="row">
                        <div className="col-12" style={{  }}>
                            <div className='text-left'>
                                {item.ItemName}
                            </div>
                        </div>
                    </div>
                    <div className="row font-weight-bold">
                        <div className="col-md-12 table-responsive ">
                            <table className="table" style={{margin:'0px'}}>
                                <thead style={{textAlign: "-webkit-center"}}>
                                    <tr >
                                        <th scope="col" style={{padding:'0px'}}>Código</th>
                                        <th scope="col" style={{padding:'0px'}}>{item.SuppCatNum !== null ? 'Cód. Fabricante' : ''}</th>
                                        <th scope="col" style={{padding:'0px'}}>Cantidad</th>
                                        <th scope="col" style={{padding:'0px'}}>Precio unitario</th>
                                        {/* <th scope="col">Descuento</th> */}
                                        <th scope="col" style={{padding:'0px'}}>Precio total</th>
                                        {/* <th scope="col" style={{padding:'0px'}}>Peso neto</th>
                                        <th scope="col" style={{padding:'0px'}}>Peso bruto</th> */}
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <td style={{color: "#0076B8"}}>
                                        {item.ItemCode}
                                    </td>
                                    <td style={{color: "#0076B8"}}>
                                        {item.SuppCatNum !== null ? item.SuppCatNum : ''}
                                    </td>
                                    <td>
                                        <input
                                            //disabled={!(!!item.OnHand)}
                                            disabled={true}
                                            id={'input-quantity-' + item.ItemCode + index}
                                            type="number"
                                            min="1"
                                            value={item.quantity ? Number(item.quantity) : ''}
                                            className="form-control"
                                            name={'quantity' + item.ItemCode}
                                            placeholder="Cantidad"
                                            style={{ textAlign: 'center' }}
                                            onChange={(event) => {
                                                this.changeQuantity(index, item, event)
                                            }}
                                            onBlur={(e) => this.validateQuantity(index, item, e)} />
                                    </td>

                                    <td style={{color: "#666666"}}>
                                        <CurrencyFormat
                                            // value={item.Price}
                                            value={item.Price}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            fixedDecimalScale={true}
                                            decimalScale={2}
                                            //prefix={config.general.currency}
                                            prefix={'$ '}
                                            suffix={config.general.currency}>
                                        </CurrencyFormat>
                                    </td>

                                    {/* <td>
                                        {item.Discount === null ? '0 %' : item.Discount + ' %'}
                                    </td> */}

                                    <td style={{color: "#DF7654"}}>
                                        <CurrencyFormat
                                            // value={item.Price * item.quantity - (item.Price * item.quantity * (item.Discount / 100))}
                                            value={item.priceTax * item.quantity}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            fixedDecimalScale={true}
                                            decimalScale={2}
                                            //prefix={config.general.currency}
                                            prefix={'$ '}
                                            suffix={config.general.currency}>
                                        </CurrencyFormat>
                                    </td>

                                    {/* <td>
                                        {parseFloat(item.quantity * item.weight).toFixed(2) + ' KG'}
                                    </td>

                                    <td>
                                        {parseFloat(item.quantity * item.weight1).toFixed(2) + ' KG'}
                                    </td> */}

                                    
                                    <td></td>
                                </tbody>

                            </table>

                        </div>
                    </div>

                </div>
                {!(!!item.OnHandPrincipal) &&
                    <div className='row text-center' style={{ margin: 0, padding: 0 }}>
                        <div className='col-2' style={{
                            color: item.OnHandPrincipal ? 'rgb(13, 98, 168)' : 'rgb(124, 124, 125)',
                            fontSize: 30,
                            padding: 0
                        }}>
                        </div>
                    </div>}

            </div>

        </div>
    };

    renderItemPromo = element => {
        let item = element.bonificacion;
        let imagesArray = item.U_Handel_ImagesArray || '';
        imagesArray = imagesArray.split('|');
        let imagenShow = imagesArray[0] ? (config.BASE_URL + SERVICE_API.getImage + '/' + imagesArray[0]) : require('../../images/noImage.png');
        //    return  element.map((item,index) => {
                return (
                    <div key={1} className='row' style={{ padding: 0, textAlign: 'center' }}>
                {/* {!(!!item.OnHand) && <div className='col-12' style={{
                    marginBottom: 5,
                    padding: 5,
                    backgroundColor: config.navBar.backgroundColor, color: config.navBar.textColor
                }}>
                    Agotado
                </div>} */}
                <div className='col-sm-3' style={{ margin: 0 }}>
                    <img
                        className="img-fluid "
                        style={{
                            backgroundColor: 'white',
                            maxHeight: 80
                        }}
                        src={imagenShow}
                        alt=""
                    />
                </div>


                <div className='col-sm-9'>
                    <div className="container p-0">
                        <div className="row">
                            <div className="col-12" style={{  }}>
                                <div className='text-left'>
                                    {item.ItemName}
                                </div>
                            </div>
                        </div>
                        <div className="row font-weight-bold">
                            <div className="col-md-12 table-responsive">
                                <table className="table" style={{margin:'0px'}}>
                                    <thead style={{textAlign: "-webkit-center"}}>
                                        <tr >
                                            <th scope="col"style={{padding:'0px'}}>Código</th>
                                            <th scope="col"style={{padding:'0px'}}>Cantidad</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <td>
                                        <i className="fa fa-gift" data-toggle="tooltip"  title={'Artículo de regalo'} style={{ cursor: 'pointer', paddingRight:"5px", color:'#005DA8' }}/>
                                            {item.idProducto}
                                        </td>
                                        <td>
                                            <input
                                                //disabled={!(!!item.OnHand)}
                                                disabled={true}
                                                id={'input-quantity-' + item.idProducto + 1}
                                                type="number"
                                                min="1"
                                                value={item.cantidad ? Number(item.cantidad) : ''}
                                                className="form-control"
                                                name={'quantity' + item.idProducto}
                                                placeholder="Cantidad"
                                                style={{ textAlign: 'center' }}/>
                                        </td>    

                                        <td></td>
                                    </tbody>

                                </table>

                            </div>
                        </div>

                    </div>
                    {!(!!item.OnHand) &&
                        <div className='row text-center' style={{ margin: 0, padding: 0 }}>
                            <div className='col-2' style={{
                                color: item.OnHand ? 'rgb(13, 98, 168)' : 'rgb(124, 124, 125)',
                                fontSize: 30,
                                padding: 0
                            }}>
                            </div>
                        </div>}

                </div>

            </div>
                )    
    };

    renderAddress = () => {
        const { address } = this.state;

        let addressComplete = (address.street || '') + ' ' + (address.block || '') + ' ' + (address.city || '') + ' C.P. ' + (address.cp || '') + ', ' + (address.state || '') + ', ' + (address.country || '') + '.';
        let name = address.name;
        let email = address.email;
        let phone = address.phone;

        return <div>
            {name && <div className='col-12'>Nombre de comprador: {name}</div>}
            {email && <div className='col-12'>Email de comprador: {email}</div>}
            {phone && <div className='col-12'>Teléfono de comprador: {phone}</div>}

            <div>
                {addressComplete}
                <br />
            </div>
        </div>
    };

    enviarCorreo = async  (response = null) => {
        const { enableSpinner, sessionReducer: { role,user }, notificationReducer: { showAlert }, shoppingCartReducer:{items, itemsGift}, itemsReducer: { deleteShoppingCart }, configReducer: { history } } = this.props;
        const { address, bill, insurance, comentario, discPrcnt, discPnt, IdPackge, tipoEntrega, PorCobrar, convenio, Viewinsurance,datos,cv,numOrden,file,fileComprobante,contadoSelected} = this.state;

        let today = moment().format('YYYY-MM-DD');

        if(today > licence){
            showAlert({type: 'error', message: 'Error de conexión -(1548913-C SP11MV1)'});
            return;
        }
        let errors = items.filter((item) => {
            return (!(!!item.OnHand) || (item.quantity > item.OnHandPrincipal))
        });
        if(user.U_MOC == 'SI'){
                if (numOrden == '') {
                    showAlert({ type: 'warning', message: 'Por favor llene el número de la ORDEN DE COMPRA', timeOut: 8000 });
                    return;
                } 
                if (file == '') {
                    showAlert({ type: 'warning', message: 'Por favor seleccione el archivo de ORDEN DE COMPRA', timeOut: 8000 });
                    return;
                } 
        }
        if(contadoSelected){
            if(fileComprobante === ''){
                return showAlert({ type: 'warning', message: 'Por favor seleccione el archivo de Comprobante de Pago', timeOut: 8000 });
            }
        }
        if(!address || Object.keys(address).length === 0){
            showAlert({ type: 'error', message: 'Por favor selecciona una dirección de envío', timeOut: 8000 });
            return;
        }
        if(!bill || Object.keys(bill).length === 0 ){
            showAlert({ type: 'error', message: 'Por favor selecciona una dirección de facturación', timeOut: 8000 });
            return;
        }
        // if (errors.length)showAlert({
        //     message: 'No se cuenta con stock disponible, se surtirá el resto en cuanto se tenga el stock.',
        //     type: 'warning',
        //     timeOut: 10000
        // })
        let shoppingCart = [];
        enableSpinner(true);
        if (role === ROLES.PUBLIC) {
            let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');

            localShoppingCart = JSON.parse(localShoppingCart);

            if (!localShoppingCart) {
                localStorage.setItem(config.general.localStorageNamed + 'shoppingCart', JSON.stringify([]));
            }
            //console.log(localShoppingCart)
            shoppingCart = localShoppingCart || []
        }
        //Creador del documento
        let creatorUser = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
        let empID = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'Vendor'));
        let creator;
        if (creatorUser.U_FMB_Handel_Perfil === 1) {
            creator = "Telemarketing-SalesPrson:" + creatorUser.salesPrson + ", " + creatorUser.firstName + " " + creatorUser.lastName;
        } else if (creatorUser.U_FMB_Handel_Perfil === 2) {
            creator = "Vendedor-SalesPrson:" + creatorUser.salesPrson + ", " + creatorUser.firstName + " " + creatorUser.lastName;
        } else if (creatorUser.U_FMB_Handel_Perfil === 3) {
            creator = "Administrador-SalesPrson:" + creatorUser.salesPrson + ", " + creatorUser.firstName + " " + creatorUser.lastName;
        }else{
            creator = "B2B:" + user.CardName;
        }
        // else if (creatorUser.U_FMB_Handel_Perfil === 2 && creatorUser.U_CAT === 1) {
        //     creator = "Vendedor-SalesPrson:" + empID.salesPerson + ", " + empID.firstName + " " + empID.lastName;
        // }
        //Definicion del vendedor
        
        //console.log("Empleado en Cotizacion",empID);
        empID = empID.salesPerson;

        /////////////////////////////////////////////////////---------------Quitar Bonificacion sin Stock---------------/////////////////////////////////////////////////////
            
        // let deleteItems = [];

        for (let a = 0; a < items.length; a++) {
            const data = items[a];
            for (let i = 0; i < itemsGift.length; i++) {
                const stock = itemsGift[i];

                // console.log('con< itemsRegalos',data.ItemCode,data.quantity,data.OnHand, 'Bonificacion:', stock.bonificacion.idProducto, stock.bonificacion.Stock, stock.bonificacion.cantidad, parseInt(stock.bonificacion.Stock));
                let missing =  parseInt(data.OnHand - (data.quantity + stock.bonificacion.cantidad));

                if(data.ItemCode == stock.bonificacion.idProducto && missing < 0){ //Cualquera menor de 0 falta entregar

                    if(data.OnHand - data.quantity === 0){ //Identifico cuanto falta entregar
                        stock.bonificacion.stockMissing = Math.abs(missing);
                        stock.bonificacion.comment = 'Has regalado ' + 0 + '/' + stock.bonificacion.cantidad;
                        stock.bonificacion.quantity = 0;
                    } else if (data.OnHand - data.quantity > 0) {
                        stock.bonificacion.stockMissing = Math.abs(missing);
                        stock.bonificacion.comment = 'Has regalado ' + (data.OnHand- data.quantity) + '/' + stock.bonificacion.cantidad;
                    }
                } else if (stock.bonificacion.cantidad > stock.bonificacion.Stock){
                    if(stock.bonificacion.Stock <= 0){
                        stock.bonificacion.stockMissing =  stock.bonificacion.cantidad;
                        stock.bonificacion.comment = 'Has regalado ' + 0 + '/' + stock.bonificacion.cantidad;
                    // stock.bonificacion.comment = 'Has regalado ' + (stock.bonificacion.cantidad - stock.bonificacion.stockMissing) + '/' + stock.bonificacion.cantidad;
                        let inicio = stock.bonificacion.comment.indexOf('regalado ');
                        let final = stock.bonificacion.comment.indexOf('/');
                        let cantidadAntesDeOrden =  stock.bonificacion.comment.slice(inicio, final);
                        // console.log('con<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',cantidadAntesDeOrden);
                    }else {
                        let missing = stock.bonificacion.Stock - stock.bonificacion.cantidad;
                        stock.bonificacion.stockMissing =  Math.abs(missing);
                        stock.bonificacion.comment = 'Has regalado ' + stock.bonificacion.Stock + '/' + stock.bonificacion.cantidad;
                    }

                }            
            }
        }
                    
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
        // responseFlete.ItemCode = 'MANIOBRAS';
        // responseFlete.ItemName = 'MANIOBRAS';
        responseFlete = PorCobrar === false ? [] : responseFlete;
        let saveFileResponse;
        if(user.U_MOC == 'SI' && cv){  
            let fileN = document.getElementById('fileImput2')
            let formData = new FormData();     
            formData.append("id", 2);
            formData.append("archivo", fileN.files[0]);
            enableSpinner(true);
            saveFileResponse = await apiClient.SaveFileOV(formData);
            enableSpinner(false);
            if(saveFileResponse.status === 0){
                showAlert({ type: 'error', message: saveFileResponse.message });
                return;
            }
        }
        let comprobante = ''
        // if( contadoSelected && fileComprobante !== ''){  
        //     let fileN = document.getElementById('ComprobanteInput')
        //     let formData = new FormData();     
        //     formData.append("id", 2);
        //     formData.append("archivo", fileN.files[0]);
        //     enableSpinner(true);
        //     saveFileResponse = await apiClient.SaveFileOV(formData);
        //     enableSpinner(false);
        //     if(saveFileResponse.status === 0){
        //         showAlert({ type: 'error', message: saveFileResponse.message });
        //         return;
        //     }
        //     comprobante = fileComprobante.name
        // }else{
        //     comprobante = ''
        // }       
        
        let datas = sessionStorage.getItem('validateOrder');
        datas = JSON.parse(datas || '{}');
        let totalHandel = this.totalOrder(datas.discPrcnt, datas.discPnt).total;
        
        let data = {
            shoppingCart,
            address,
            bill,
            objType: '17',
            responseFlete,
            empID,
            creator,
            taxOnly: 0,
            venta: '01',
            comment : comentario,
            discPrcnt,
            discPnt,
            IdPackge,
            PorCobrar,
            tipoEntrega,
            convenio,
            itemsGift,
            datos,
            numOrden: numOrden || '',
            fileName : cv ? cv.name : '',
            GroupNum : user.GroupNum,
            totalHandel,
            sellerMail : creatorUser ? creatorUser.email : '',
            ordenCompraFile: comprobante
        };
      
        let apiResponse = await apiClient.sendEmail(data);

        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            deleteShoppingCart({ item: {}, deleteAll: true });
            enableSpinner(false);
            localStorage.setItem(config.general.localStorageNamed + 'createOrder', apiResponse.data.docNum);
            history.goCreateOrder();
            return;
        }

        showAlert({ type: 'error', message: apiResponse.message });
        enableSpinner(false)

    };

    enviar = async () => {            
        await this.sendOrder();
    }

    sendOrder = async  (response = null) => {
        const { enableSpinner, sessionReducer: { role,user }, notificationReducer: { showAlert }, shoppingCartReducer:{items, itemsGift}, itemsReducer: { deleteShoppingCart }, configReducer: { history } } = this.props;
        const { address, bill, insurance, comentario, discPrcnt, discPnt, IdPackge, tipoEntrega, PorCobrar, convenio, Viewinsurance,datos,cv,numOrden,file,fileComprobante,contadoSelected} = this.state;

        let today = moment().format('YYYY-MM-DD');

        if(today > licence){
            showAlert({type: 'error', message: 'Error de conexión -(1548913-C SP11MV1)'});
            return;
        }
        let errors = items.filter((item) => {
            return (!(!!item.OnHand) || (item.quantity > item.OnHandPrincipal))
        });
        if(user.U_MOC == 'SI'){
                if (numOrden == '') {
                    showAlert({ type: 'warning', message: 'Por favor llene el número de la ORDEN DE COMPRA', timeOut: 8000 });
                    return;
                } 
                if (file == '') {
                    showAlert({ type: 'warning', message: 'Por favor seleccione el archivo de ORDEN DE COMPRA', timeOut: 8000 });
                    return;
                } 
        }
        if(contadoSelected){
            if(fileComprobante === ''){
                return showAlert({ type: 'warning', message: 'Por favor seleccione el archivo de Comprobante de Pago', timeOut: 8000 });
            }
        }
        if(!address || Object.keys(address).length === 0){
            showAlert({ type: 'error', message: 'Por favor selecciona una dirección de envío', timeOut: 8000 });
            return;
        }
        if(!bill || Object.keys(bill).length === 0 ){
            showAlert({ type: 'error', message: 'Por favor selecciona una dirección de facturación', timeOut: 8000 });
            return;
        }
        // if (errors.length)showAlert({
        //     message: 'No se cuenta con stock disponible, se surtirá el resto en cuanto se tenga el stock.',
        //     type: 'warning',
        //     timeOut: 10000
        // })
        let shoppingCart = [];
        enableSpinner(true);
        if (role === ROLES.PUBLIC) {
            let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');

            localShoppingCart = JSON.parse(localShoppingCart);

            if (!localShoppingCart) {
                localStorage.setItem(config.general.localStorageNamed + 'shoppingCart', JSON.stringify([]));
            }
            //console.log(localShoppingCart)
            shoppingCart = localShoppingCart || []
        }
        //Creador del documento
        let creatorUser = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
        let empID = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'Vendor'));
        let creator;
        if (creatorUser.U_FMB_Handel_Perfil === 1) {
            creator = "Telemarketing-SalesPrson:" + creatorUser.salesPrson + ", " + creatorUser.firstName + " " + creatorUser.lastName;
        } else if (creatorUser.U_FMB_Handel_Perfil === 2) {
            creator = "Vendedor-SalesPrson:" + creatorUser.salesPrson + ", " + creatorUser.firstName + " " + creatorUser.lastName;
        } else if (creatorUser.U_FMB_Handel_Perfil === 3) {
            creator = "Administrador-SalesPrson:" + creatorUser.salesPrson + ", " + creatorUser.firstName + " " + creatorUser.lastName;
        }else{
            creator = "B2B:" + user.CardName;
        }
        // else if (creatorUser.U_FMB_Handel_Perfil === 2 && creatorUser.U_CAT === 1) {
        //     creator = "Vendedor-SalesPrson:" + empID.salesPerson + ", " + empID.firstName + " " + empID.lastName;
        // }
        //Definicion del vendedor
        
        //console.log("Empleado en Cotizacion",empID);
        empID = empID.salesPerson;

        /////////////////////////////////////////////////////---------------Quitar Bonificacion sin Stock---------------/////////////////////////////////////////////////////
            
        // let deleteItems = [];

        for (let a = 0; a < items.length; a++) {
            const data = items[a];
            for (let i = 0; i < itemsGift.length; i++) {
                const stock = itemsGift[i];

                // console.log('con< itemsRegalos',data.ItemCode,data.quantity,data.OnHand, 'Bonificacion:', stock.bonificacion.idProducto, stock.bonificacion.Stock, stock.bonificacion.cantidad, parseInt(stock.bonificacion.Stock));
                let missing =  parseInt(data.OnHand - (data.quantity + stock.bonificacion.cantidad));

                if(data.ItemCode == stock.bonificacion.idProducto && missing < 0){ //Cualquera menor de 0 falta entregar

                    if(data.OnHand - data.quantity === 0){ //Identifico cuanto falta entregar
                        stock.bonificacion.stockMissing = Math.abs(missing);
                        stock.bonificacion.comment = 'Has regalado ' + 0 + '/' + stock.bonificacion.cantidad;
                        stock.bonificacion.quantity = 0;
                    } else if (data.OnHand - data.quantity > 0) {
                        stock.bonificacion.stockMissing = Math.abs(missing);
                        stock.bonificacion.comment = 'Has regalado ' + (data.OnHand- data.quantity) + '/' + stock.bonificacion.cantidad;
                    }
                } else if (stock.bonificacion.cantidad > stock.bonificacion.Stock){
                    if(stock.bonificacion.Stock <= 0){
                        stock.bonificacion.stockMissing =  stock.bonificacion.cantidad;
                        stock.bonificacion.comment = 'Has regalado ' + 0 + '/' + stock.bonificacion.cantidad;
                    // stock.bonificacion.comment = 'Has regalado ' + (stock.bonificacion.cantidad - stock.bonificacion.stockMissing) + '/' + stock.bonificacion.cantidad;
                        let inicio = stock.bonificacion.comment.indexOf('regalado ');
                        let final = stock.bonificacion.comment.indexOf('/');
                        let cantidadAntesDeOrden =  stock.bonificacion.comment.slice(inicio, final);
                        // console.log('con<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',cantidadAntesDeOrden);
                    }else {
                        let missing = stock.bonificacion.Stock - stock.bonificacion.cantidad;
                        stock.bonificacion.stockMissing =  Math.abs(missing);
                        stock.bonificacion.comment = 'Has regalado ' + stock.bonificacion.Stock + '/' + stock.bonificacion.cantidad;
                    }

                }            
            }
        }
                    
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
        // responseFlete.ItemCode = 'MANIOBRAS';
        // responseFlete.ItemName = 'MANIOBRAS';
        responseFlete = PorCobrar === false ? [] : responseFlete;
        let saveFileResponse;
        if(user.U_MOC == 'SI' && cv){  
            let fileN = document.getElementById('fileImput2')
            let formData = new FormData();     
            formData.append("id", 2);
            formData.append("archivo", fileN.files[0]);
            enableSpinner(true);
            saveFileResponse = await apiClient.SaveFileOV(formData);
            enableSpinner(false);
            if(saveFileResponse.status === 0){
                showAlert({ type: 'error', message: saveFileResponse.message });
                return;
            }
        }
        let comprobante
        if( contadoSelected && fileComprobante !== ''){  
            let fileN = document.getElementById('ComprobanteInput')
            let formData = new FormData();     
            formData.append("id", 2);
            formData.append("archivo", fileN.files[0]);
            enableSpinner(true);
            saveFileResponse = await apiClient.SaveFileOV(formData);
            enableSpinner(false);
            if(saveFileResponse.status === 0){
                showAlert({ type: 'error', message: saveFileResponse.message });
                return;
            }
            comprobante = fileComprobante.name
        }else{
            comprobante = ''
        }       
        
        let datas = sessionStorage.getItem('validateOrder');
        datas = JSON.parse(datas || '{}');
        let totalHandel = this.totalOrder(datas.discPrcnt, datas.discPnt).total;
        const orderDate = moment().format("YYYY-MM-DD");
        const orderTime = moment().format("HHmm");
        
        let data = {
            shoppingCart,
            address,
            bill,
            objType: '17',
            responseFlete,
            empID,
            creator,
            taxOnly: 0,
            venta: '01',
            comment : comentario,
            discPrcnt,
            discPnt,
            IdPackge,
            PorCobrar,
            tipoEntrega,
            convenio,
            itemsGift,
            datos,
            numOrden: numOrden || '',
            fileName : cv ? cv.name : '',
            GroupNum : user.GroupNum,
            totalHandel,
            sellerMail : creatorUser ? creatorUser.email : '',
            ordenCompraFile: comprobante,
            orderDate,
            orderTime,
        };
      
        let apiResponse = await apiClient.createDocument(data);

        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            deleteShoppingCart({ item: {}, deleteAll: true });
            enableSpinner(false);
            localStorage.setItem(config.general.localStorageNamed + 'createOrder', apiResponse.data.docNum);
            history.goCreateOrder();
            return;
        }

        showAlert({ type: 'error', message: apiResponse.message });
        enableSpinner(false)

    };

    enviarVta = async () => {
        $('#commentsModal').modal('show');

        this.setState({
            comentario : 2
        })
    }

    sendOrderDiscount = async (response = null) => {
        const { enableSpinner, sessionReducer: { role }, notificationReducer: { showAlert }, itemsReducer: { deleteShoppingCart }, configReducer: { history } } = this.props;
        const { address, bill } = this.state;
        let shoppingCart = [];

        enableSpinner(true);

        if (role === ROLES.PUBLIC) {
            let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');

            localShoppingCart = JSON.parse(localShoppingCart);

            if (!localShoppingCart) {
                localStorage.setItem(config.general.localStorageNamed + 'shoppingCart', JSON.stringify([]));
            }
            //console.log(localShoppingCart)
            shoppingCart = localShoppingCart || []
        }
        //Creador del documento
        let creatorUser = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
        let creator;
        if (creatorUser.U_FMB_Handel_Perfil === "1") {
            creator = "Telemarketing-SalesPrson:" + creatorUser.salesPrson + ", " + creatorUser.firstName + " " + creatorUser.lastName;
        } else {
            creator = "Vendedor-SalesPrson:" + creatorUser.salesPrson + ", " + creatorUser.firstName + " " + creatorUser.lastName;
        }
        //Definicion del vendedor
        let empID = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'Vendor'));
        //console.log("Empleado en Cotizacion",empID);
        empID = empID.salesPerson;

        let data = {
            shoppingCart,
            address,
            bill,
            objType: '23',
            responseFlete,
            empID,
            creator,
            taxOnly: 1,
            venta: '02',
            comment : response
        };

        let apiResponse = await apiClient.createDocument(data);

        //console.log(apiResponse);

        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            deleteShoppingCart({ item: {}, deleteAll: true });
            enableSpinner(false);
            localStorage.setItem(config.general.localStorageNamed + 'createOrder', apiResponse.data.docNum);
            history.goCreateOrder();
            return;
        }

        showAlert({ type: 'error', message: apiResponse.message });
        enableSpinner(false)

    };

    sendQuotation = async response => {
        const { enableSpinner, sessionReducer: { role }, notificationReducer: { showAlert }, itemsReducer: { deleteShoppingCart }, configReducer: { history } } = this.props;
        const { address, bill } = this.state;
        let shoppingCart = [];

        enableSpinner(true);
        let empID = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'Vendor'));
        //console.log("Empleado en Cotizacion",empID);
        empID = empID.salesPerson;
        //Creador del documento
        let creatorUser = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
        let creator;
        if (creatorUser.U_FMB_Handel_Perfil === "1") {
            creator = "Telemarketing-SalesPrson:" + creatorUser.salesPrson + ", " + creatorUser.firstName + " " + creatorUser.lastName;
        } else {
            creator = "Vendedor-SalesPrson:" + creatorUser.salesPrson + ", " + creatorUser.firstName + " " + creatorUser.lastName;
        }

        if (role === ROLES.PUBLIC) {
            let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');

            localShoppingCart = JSON.parse(localShoppingCart);

            if (!localShoppingCart) {
                localStorage.setItem(config.general.localStorageNamed + 'shoppingCart', JSON.stringify([]));
            }
            //console.log(localShoppingCart)
            shoppingCart = localShoppingCart || []
        }

        let data = {
            shoppingCart,
            address,
            bill,
            objType: '23',
            responseFlete,
            empID,
            creator
        };

        //console.log("se va para crear",data);

        let apiResponse = await apiClient.createQuotation(data);

        //console.log(apiResponse);

        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            deleteShoppingCart({ item: {}, deleteAll: true });
            enableSpinner(false);
            localStorage.setItem(config.general.localStorageNamed + 'createOrder', apiResponse.data.docNum);
            history.goCreateOrder();
            return;
        }

        showAlert({ type: 'error', message: apiResponse.message });
        enableSpinner(false)

    };

    sendPreliminar = async response => {
        const { enableSpinner, sessionReducer: { role }, notificationReducer: { showAlert }, itemsReducer: { deleteShoppingCart }, configReducer: { history } } = this.props;
        const { address, bill } = this.state;
        let shoppingCart = [];

        enableSpinner(true);
        let empID = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'Vendor'));
        //console.log("Empleado en Cotizacion",empID);
        empID = empID.salesPerson;
        //Creador del documento
        let creatorUser = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
        let creator;
        if (creatorUser) {
            if (creatorUser.U_FMB_Handel_Perfil === "1") {
                creator = "Telemarketing-SalesPrson:" + creatorUser.salesPrson + ", " + creatorUser.firstName + " " + creatorUser.lastName;
            } else {
                creator = "Vendedor-SalesPrson:" + creatorUser.salesPrson + ", " + creatorUser.firstName + " " + creatorUser.lastName;
            }
        } else {
            creator = "Cleinte-Generate";
        }

        if (role === ROLES.PUBLIC) {
            let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');

            localShoppingCart = JSON.parse(localShoppingCart);

            if (!localShoppingCart) {
                localStorage.setItem(config.general.localStorageNamed + 'shoppingCart', JSON.stringify([]));
            }
            //console.log(localShoppingCart)
            shoppingCart = localShoppingCart || []
        }

        let data = {
            shoppingCart,
            address,
            bill,
            objType: '23',
            responseFlete,
            empID,
            creator
        };

        //console.log("se va para crear",data);

        let apiResponse = await apiClient.createPreliminar(data);

        //console.log(apiResponse);

        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            deleteShoppingCart({ item: {}, deleteAll: true });
            enableSpinner(false);
            localStorage.setItem(config.general.localStorageNamed + 'createOrder', apiResponse.data.docNum);
            history.goCreateOrder();
            return;
        }

        showAlert({ type: 'error', message: apiResponse.message });
        enableSpinner(false)

    };

    sendDelivery = async response => {
        const { enableSpinner, sessionReducer: { role }, notificationReducer: { showAlert }, itemsReducer: { deleteShoppingCart }, configReducer: { history } } = this.props;
        const { address, bill } = this.state;
        let shoppingCart = [];

        enableSpinner(true);
        let empID = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'Vendor'));
        //console.log("Empleado en Cotizacion",empID);
        empID = empID.salesPerson;
        //Creador del documento
        let creatorUser = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
        let creator;
        if (creatorUser.U_FMB_Handel_Perfil === "1") {
            creator = "Telemarketing-SalesPrson:" + creatorUser.salesPrson + ", " + creatorUser.firstName + " " + creatorUser.lastName;
        } else {
            creator = "Vendedor-SalesPrson:" + creatorUser.salesPrson + ", " + creatorUser.firstName + " " + creatorUser.lastName;
        }

        if (role === ROLES.PUBLIC) {
            let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');

            localShoppingCart = JSON.parse(localShoppingCart);

            if (!localShoppingCart) {
                localStorage.setItem(config.general.localStorageNamed + 'shoppingCart', JSON.stringify([]));
            }
            //console.log(localShoppingCart)
            shoppingCart = localShoppingCart || []
        }

        let data = {
            shoppingCart,
            address,
            bill,
            objType: '15',
            responseFlete,
            empID,
            creator
        };

        //console.log("se va para crear",data);

        let apiResponse = await apiClient.createDelivery(data);

        //console.log(apiResponse);

        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            deleteShoppingCart({ item: {}, deleteAll: true });
            enableSpinner(false);
            localStorage.setItem(config.general.localStorageNamed + 'createOrder', apiResponse.data.docNum);
            history.goCreateOrder();
            return;
        }

        showAlert({ type: 'error', message: apiResponse.message });
        enableSpinner(false)

    };

    sendSavedCart = async response => {
        const { enableSpinner, sessionReducer: { role,user }, notificationReducer: { showAlert }, shoppingCartReducer: { items,itemsGift }, itemsReducer: { deleteShoppingCart }, configReducer: { history }, setUser } = this.props;
        const { address, bill } = this.state;
        let shoppingCart = [];

        if(itemsGift.length > 0){
            showAlert({ type: 'warning', message: 'Los artículos de bonificación no se guardan' });
        }
        
        enableSpinner(true);
        let empID = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'Vendor'));
        //console.log("Empleado en Cotizacion",empID);
        empID = empID.salesPerson;
        //Creador del documento
        let creatorUser = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
        let creator;
        if (creatorUser.U_FMB_Handel_Perfil === "1") {
            creator = "Telemarketing-SalesPrson:" + creatorUser.salesPrson + ", " + creatorUser.firstName + " " + creatorUser.lastName;
        } else {
            creator = "Vendedor-SalesPrson:" + creatorUser.salesPrson + ", " + creatorUser.firstName + " " + creatorUser.lastName;
        }

        if (role === ROLES.PUBLIC) {
            let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');
            localShoppingCart = JSON.parse(localShoppingCart);

            if (!localShoppingCart) {
                localStorage.setItem(config.general.localStorageNamed + 'shoppingCart', JSON.stringify([]));
            }
            //console.log(localShoppingCart)
            shoppingCart = localShoppingCart || []
        }
        
        let data = {
            shoppingCart : items,
            address,
            bill,
            objType: '15',
            responseFlete,
            empID,
            creator,
            createCard : creatorUser.U_FMB_Handel_Perfil !== '0' ? creatorUser.salesPrson : 'B2B',
        };
        
        let apiResponse = await apiClient.createSavedCart(data);

        //console.log(apiResponse);

        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            deleteShoppingCart({ item: {}, deleteAll: true });
            enableSpinner(false);
            localStorage.setItem(config.general.localStorageNamed + 'createOrder', apiResponse.data.docNum);
            if(user.CardCode === 'C2029' || user.CardCode === 'C4192'){
                let CardCode = user.CardCode;
                localStorage.removeItem(config.general.localStorageNamed + 'CurrentUser');
                setUser({});
                await apiClient.liberarCliente(CardCode);
            }
            history.goCreateOrder();
            return;
        }

        showAlert({ type: 'error', message: apiResponse.message });
        enableSpinner(false)

    };

    obtenerFecha = () => {
        var f = new Date();
        let Nota;
        let hora;
        let minuto;
        let segundo;
        if (f.getHours() < 10) {
            hora = "0" + (f.getHours())
        } else {
            hora = f.getHours();
        }

        if (f.getMinutes() < 10) {
            minuto = "0" + (f.getMinutes())
        } else {
            minuto = f.getMinutes();
        }

        if (f.getSeconds() < 10) {
            segundo = "0" + (f.getSeconds())
        } else {
            segundo = f.getSeconds();
        }

        // console.log("Mostrar fecha 2");

        if (f.getDate() <= 8 && f.getDay() == 0) { //Si el dia es menor al 08 y el dia es domingo 
            //Y el mes en menor al 10 => Octubre
            if ((f.getMonth() + 1) < 10) {
                let Domingo = "0" + (f.getDate() + 1);
                let mes = "0" + (f.getMonth() + 1)
                fecha = f.getFullYear() + "-" + mes + "-" + Domingo + "T" + hora + ":" + minuto + ":" + segundo + "-" + "06:00"
                Nota = console.log("EL DIA CAE EN DOMINGO Y ES MENOR AL DIA 8 DEL MES, EL MES ES MENOR A 10")
            } else {
                //Si el mes es 10 o hasta 12, Octubre -Diciembre
                let Domingo = "0" + (f.getDate() + 1);
                let mes = (f.getMonth() + 1);
                fecha = f.getFullYear() + "-" + mes + "-" + Domingo + "T" + hora + ":" + minuto + ":" + segundo + "-" + "06:00"
                Nota = console.log("EL DIA CAE EN DOMINGO Y ES MENOR AL DIA 8 DEL MES,MES MAYOR O IGUAL A 10")
            }

        } else if (f.getDate() == 9 && f.getDay() == 0) {
            if ((f.getMonth() + 1) < 10) { // Si es de Antes de Octubre
                let Domingo = (f.getDate() + 1);
                let mes = "0" + (f.getMonth() + 1)
                fecha = f.getFullYear() + "-" + mes + "-" + Domingo + "T" + hora + ":" + minuto + ":" + segundo + "-" + "06:00"
                Nota = console.log("EL DIA CAE EN DOMINGO Y ES IGUAL AL DIA 9 DEL MES,MES MENOR A 10")
            } else {
                let Domingo = (f.getDate() + 1);
                let mes = (f.getMonth() + 1)
                fecha = f.getFullYear() + "-" + mes + "-" + Domingo + "T" + hora + ":" + minuto + ":" + segundo + "-" + "06:00"
                Nota = console.log("EL DIA CAE EN DOMINGO Y ES IGUAL AL DIA 9 DEL MES,MES IGUAL O MAYOR A 10")
            }
        }

        if (f.getDay() == 0 && f.getDate() >= 10 && f.getDate() < 30 && (f.getMonth() + 1) >= 10) {// Si es mayor a o igual al dia 10 y cae en domingo
            let Domingo = (f.getDate() + 1);
            let mes = (f.getMonth() + 1)
            fecha = f.getFullYear() + "-" + mes + "-" + Domingo + "T" + hora + ":" + minuto + ":" + segundo + "-" + "06:00"
            Nota = console.log("EL DIA CAE EN DOMINGO Y ES IGUAL O MAYOR AL DIA 10 DEL MES")
        } else if (f.getDay() == 0 && f.getDate() >= 10 && f.getDate() < 30 && (f.getMonth() + 1) < 10) {
            let Domingo = (f.getDate() + 1);
            let mes = "0" + (f.getMonth() + 1)
            fecha = f.getFullYear() + "-" + mes + "-" + Domingo + "T" + hora + ":" + minuto + ":" + segundo + "-" + "06:00"
            Nota = console.log("EL DIA CAE EN DOMINGO Y ES IGUAL O MAYOR AL DIA 10 DEL MES")
        } else if (f.getDate() == 30 && ((f.getMonth() + 1) == 4 || (f.getMonth() + 1) == 6)) { //Si es 30 de abril o de junio y cae un domingo, fin de mes
            let Domingo = "01";
            let mes = "0" + (f.getMonth() + 2);
            fecha = f.getFullYear() + "-" + mes + "-" + Domingo + "T" + hora + ":" + minuto + ":" + segundo + "-" + "06:00"
            Nota = console.log("EL DIA CAE EN DOMINGO, ES FIN DE MES, PASANDO EN ENVIO AL LUNES ")
        } else if (f.getDate() == 30 && ((f.getMonth() + 1) == 9 || (f.getMonth() + 1) == 11)) { //Si es 30 de septiembre o noviembre y cae domingo, fin de mes
            let Domingo = "01";
            let mes = (f.getMonth() + 2);
            fecha = f.getFullYear() + "-" + mes + "-" + Domingo + "T" + hora + ":" + minuto + ":" + segundo + "-" + "06:00"
            Nota = console.log("EL DIA CAE EN DOMINGO, ES FIN DE MES, PASANDO EN ENVIO AL LUNES ")

        } else if (f.getDate() == 31 && ((f.getMonth() + 1) == 1 || (f.getMonth() + 1) == 3 || (f.getMonth() + 1) == 5 || (f.getMonth() + 1) == 7 || (f.getMonth() + 1) == 8)) {
            //Si cae 31 en enero, marzo,mayo, julio, agosto en un domingo
            let Domingo = "01";
            let mes = "0" + (f.getMonth() + 2);
            fecha = f.getFullYear() + "-" + mes + "-" + Domingo + "T" + hora + ":" + minuto + ":" + segundo + "-" + "06:00"
            Nota = console.log("EL DIA CAE EN DOMINGO, ES FIN DE MES, PASANDO EN ENVIO AL LUNES ")
        } else if (f.getDate() == 31 && ((f.getMonth() + 1) == 10)) { //si cae 31 un domingo del mes de octubre
            let Domingo = "01";
            let mes = (f.getMonth() + 2);
            fecha = f.getFullYear() + "-" + mes + "-" + Domingo + "T" + hora + ":" + minuto + ":" + segundo + "-" + "06:00"
            Nota = console.log("EL DIA CAE EN DOMINGO, ES FIN DE MES, PASANDO EN ENVIO AL LUNES ")
        } else if (f.getDate() == 31 && (f.getMonth() + 1) == 12) { //Si cae un domingo el 31 de diciembre
            let Domingo = "01";
            let mes = "01";
            let year = (f.getFullYear() + 1)
            fecha = year + "-" + mes + "-" + Domingo + "T" + hora + ":" + minuto + ":" + segundo + "-" + "06:00"
            Nota = console.log("EL DIA CAE EN DOMINGO, ES FIN DE MES, PASANDO EN ENVIO AL LUNES ")
        } else if ((f.getDate() == 28) || (f.getDate() == 29) && (f.getMonth() + 1) == 2) {  // si es fin de febrero un domingo
            let Domingo = "01";
            let mes = "0" + (f.getMonth() + 2);
            fecha = f.getFullYear() + "-" + mes + "-" + Domingo + "T" + hora + ":" + minuto + ":" + segundo + "-" + "06:00"
            Nota = console.log("EL DIA CAE EN DOMINGO , ES FIN DE MES, PASANDO EN ENVIO AL LUNES ")
        }


        if (f.getDate() < 10 && f.getDay() != 0) {//Si el dia es menor de 10 pero no es Domingo
            if ((f.getMonth() + 1) < 10) { // Si el mes cae antes de octubre
                let dia = "0" + f.getDate();
                let mes = "0" + (f.getMonth() + 1);

                fecha = f.getFullYear() + "-" + mes + "-" + dia + "T" + hora + ":" + minuto + ":" + segundo + "-" + "06:00"
                Nota = console.log("EL DIA ES MENOR AL DIA 10 DEL MES Y NO CAE DOMINGO,MES MENOR QUE 10 ")
            } else { // Si el mes es despues de octubre o igual a este.
                let dia = f.getDate();
                let mes = (f.getMonth() + 1);

                fecha = f.getFullYear() + "-" + mes + "-" + dia + "T" + hora + ":" + minuto + ":" + segundo + "-" + "06:00"
                Nota = console.log("EL DIA ES MENOR AL DIA 10 DEL MES Y NO CAE DOMINGO,MES MAYOR O IGUAL A 10 ")
            }
        } else if (f.getDate() >= 10 && f.getDay() != 0) {
            if ((f.getMonth() + 1) < 10) { // Si el mes cae antes de octubre
                let dia = f.getDate();
                let mes = "0" + (f.getMonth() + 1);

                fecha = f.getFullYear() + "-" + mes + "-" + dia + "T" + hora + ":" + minuto + ":" + segundo + "-" + "06:00"
                Nota = console.log("EL DIA ES MENOR AL DIA 10 DEL MES Y NO CAE DOMINGO,MES MENOR QUE 10 ")
            } else { // Si el mes es despues de octubre o igual a este.
                let dia = f.getDate();
                let mes = (f.getMonth() + 1);

                fecha = f.getFullYear() + "-" + mes + "-" + dia + "T" + hora + ":" + minuto + ":" + segundo + "-" + "06:00"
                Nota = console.log("EL DIA ES MENOR AL DIA 10 DEL MES Y NO CAE DOMINGO,MES MAYOR O IGUAL A 10 ")
            }
        }

        return fecha;
    }

    renderPaymentMethod = (total = null, currency = null) => {
        const { paymentMethod, totalOrder , url_mp, address, bill } = this.state;
        const { enableSpinner, configReducer } = this.props;
        let shoppingCart = {};
        if (paymentMethod === 'paypal') {
            paypalOptions.currency = currency;

            if (total && currency) return <div>
                <PayPalButton
                    paypalOptions={paypalOptions}
                    buttonStyles={buttonStyles}
                    onPaymentStart={() => {
                        //console.log("start payment paypal");
                        enableSpinner(true)
                    }}
                    onPaymentCancel={() => {
                        //console.log("cancel payment paypal");
                        enableSpinner(false)
                    }}
                    onPaymentError={(msg) => {
                        //console.log("error payment paypal", msg);
                        enableSpinner(false)
                    }}
                    onPaymentSuccess={this.sendOrder}
                    amount={total}

                />
            </div>
        }

        if (paymentMethod === 'mercadoPago') {
            let url_mp = localStorage.getItem(config.general.localStorageNamed + 'goToMP');
            this.obtenerFecha();
            let data = {
                shoppingCart,
                address,
                bill,
                objType: '23',
                responseFlete,
                fecha: fecha
            };

            localStorage.setItem(config.general.localStorageNamed + "Envio", JSON.stringify(data));
            // console.log(url_mp);

            return <div>
                {/* <input type="button" className="btn btn-success" value="Pagar con MercadoPago" onClick={() => { modal.mercadoPagoModal('show') }} /> */}
                <a href={url_mp} >
                    <input type="button" className="btn btn-success" value="Mercado Pago" />
                </a>
            </div>
        }
        if (paymentMethod === 'openPay') {
            return <div>
                <input type="button" className="btn btn-success" value="OpenPay" onClick={() => { modal.openPayModal('show') }} />
            </div>
        }
    };

    download = () => {
        const { enableSpinner, sessionReducer: { user }, notificationReducer: { showAlert },shoppingCartReducer: { items }} = this.props;
        
        enableSpinner(true);

        // 'UNIDADES SOLICITADAS': ,
        // 'MASTER PACK (unidades)':'',
        // 'CODIGO EAN': '',
        // 'PTV-RINTI':,

        let csvData = [];

        if(items.length > 0){
            items.map((item)=>{
                let row ={
                    '':'',
                    'DESCRIPCIÓN':  item.ItemName,
                    'CÓDIGO' :  item.ItemCode,
                    'CANTIDAD' : item.quantity,
                    'PRECIO UNITARIO' : parseFloat(item.priceTax).toFixed(2), // parseFloat(item.Price).toFixed(2),
                    'DESCUENTO' : item.Discount === null ? '0 %' : item.Discount || 0 + ' %',
                    'PRECIO TOTAL' : parseFloat(item.priceTax * item.quantity).toFixed(2), // parseFloat(item.Price * item.quantity - (item.Price * item.quantity * (item.Discount / 100))).toFixed(2),
                    // 'PESO NETO' : parseFloat(item.quantity * item.weight).toFixed(2) + ' KG',
                    // 'PESO BRUTO' : parseFloat(item.quantity * item.weight1).toFixed(2) + ' KG',
                    'CLIENTE': '',
                    'NOMBRE': '',
                }
                csvData.push(row);
            });
            csvData[0].CLIENTE = user.CardCode;
            csvData[0].NOMBRE = user.CardName;

            this.setState({
                csvData,
                action : 1
            });
        }
        enableSpinner(false)

    };

    totalOrder = (discPrcnt = null, discPnt = null) => {
        const { shoppingCartReducer: { items } } = this.props;
        const { pointsInfo } = this.state;

        let subTotal = 0;
        let taxTotal = 0;
        let total = 0;
        let tax = 0;
        let localLanguage = '';
        let currency = '';
        // Puntos
        let aux1 = 0;
        let totalAux = 0;
        let valueDiscount = 0;
        // let valueEquals = parseFloat(pointsInfo.pointsMoney);
        //Variables para validacion del Flete
        let transport = 0;
        let taxTransport = 0;
        let limit = 0;
        items.map(item => {
            // let totalPrice = parseFloat(item.Price * parseInt(item.quantity)).toFixed(2);
            let totalPrice = item.newTotal;
            // if(item.U_FMB_Handel_PNTA == 1){
            //     let valuePoints = parseFloat(discPnt * valueEquals);
            //     valuePoints = Number.isNaN(valuePoints) ? 0 : valuePoints;
                // totalPrice -= valuePoints;
                // Formula para enviar DiscPrcnt a Back
                // let discPrcntBack = totalPrice == 0 ? Number(99.99).toFixed(2) : Number(((valuePoints * 100)) / (Number(itemPoints[i].Price * Number(itemPoints[i].quantity)))).toFixed(2);
            // }
            subTotal += Number(totalPrice)

            tax = item.taxRate;
            // taxTotal += Number(item.taxSum * item.quantity);
            // taxTotal = parseFloat(subTotal * (tax * 0.01));
            taxTotal += parseFloat(item.newTotal * (item.taxRate * 0.01));
            localLanguage = item.localLanguage;
            currency = item.currency;
        });

        // Descuento de puntos
        // valueDiscount = parseFloat(discPnt * valueEquals) || 0;

        // //Asignacion de valores para el flete
        // limit = parseInt(responseFlete.PurchaseLimit);
        // transport = parseFloat(responseFlete.Price);
        // taxTransport = parseFloat(transport * (tax * 0.01));
        // //Validacion del flete
        // if (subTotal < limit) {
        //     taxTotal = taxTotal + taxTransport;
        //     total = subTotal + transport + taxTotal;
        // } else {
        //     transport = 0;
        //     total = subTotal + transport + taxTotal;
        // }
        total = subTotal + taxTotal;

        // Seguro de artículo (total - envío)
        let totalWithoutTransport = total - transport;
        // let insurance = 0;
        // if(totalWithoutTransport >= 1000){
        //     let calc1 = parseInt(totalWithoutTransport / 1000);
        //     insurance += (calc1 * 20);
        //     let missingQuantity = totalWithoutTransport - (calc1 * 1000);
        //     if(missingQuantity >= 0.01 && missingQuantity <= 500){
        //         insurance += 10;
        //     } else {
        //         insurance += 20;
        //     }
        // } else {
        //     insurance = 0;
        // }

        // Agregar seguro a total final
        // total += insurance;

        let pointsDisc = valueDiscount;
        // Validación del descunto
        if ( discPrcnt ){
            if( discPrcnt.U_TIPO_DSCT === "1" ){
                // Descuento por porcentaje
                let valueAux = parseFloat(discPrcnt.U_VALOR_DSCT); //Porcentale
                // Guardamos el portentaje
                aux1 = valueAux;
                valueDiscount = Number(((Number(valueAux.toFixed(2)) * Number(total.toFixed(2))) / 100 )).toFixed(2);
                totalAux = total - valueDiscount;
            }
            if( discPrcnt.U_TIPO_DSCT === "2" ){
                // Descuento en efectivo
                valueDiscount = parseFloat(discPrcnt.U_VALOR_DSCT); //Efectivo
                totalAux = total - valueDiscount;
                // Guardamos el porcentaje
                // console.log("con°-°% efectivo", valueDiscount);
                // console.log("con°-°% Pprecio despues de desc", total);
                aux1 = (valueDiscount * 100) / (total + valueDiscount);
                // console.log("totalAux",totalAux);

            }
            total = Number(totalAux.toFixed(2));
        }else{
            total = Number((total - pointsDisc).toFixed(2));
        }
        //total = subTotal + taxTotal;
        return { 
            total: total,
            currency: currency === 'MXN' ? 'MXN' : currency, 
            // insurance : insurance,
            discPrcnt: aux1,
            dsicCash: valueDiscount,
            discPnt: discPnt,
            subTotal,
            taxTotal,
            tax,
        };
    };

    cardNumber = (event) => {
        let numCard = event.nativeEvent.target.value;
        this.setState({
            cardNumber: numCard
        });
    }

    userName = (event) => {
        let userName = event.nativeEvent.target.value;
        this.setState({
            userNName: userName
        });
    }

    expirationMonth = (event) => {
        let expMonth = event.nativeEvent.target.value;
        this.setState({
            expirationMont: expMonth
        });
    }

    ExpirationYear = (event) => {
        let expYear = event.nativeEvent.target.value;
        this.setState({
            expirationYear: expYear
        });
    }

    Cvv2 = (event) => {
        let cvV2 = event.nativeEvent.target.value;
        this.setState({
            cvv2: cvV2
        });
    }

    validaNumericos = (event) => {
        if (event.charCode >= 48 && event.charCode <= 57) {
            return true;
        }
        return false;
    }
    onChangeCV = (value,type,id) => {
        const { notificationReducer: {showAlert} } = this.props;
        if(!value){
            return
        }
        if(value.size > 1000000){
            showAlert({ type: 'warning', message: 'El archivo no puede pesar más de 1Mb', timeOut: 8000 });
            document.getElementById(id).value= null
            return;
        }

        let ext = value.name.lastIndexOf(".");
        let validateExt = value.name.substring(ext, value.name.length);
        let flagValidationExt = validateExt.toLowerCase()  === ".pdf" ? true : false;
        if(id === 'ComprobanteInput'){
            flagValidationExt = validateExt.toLowerCase()  === ".jpeg"  || validateExt.toLowerCase() === '.jpg' || validateExt.toLowerCase() === '.png' || validateExt.toLowerCase() === '.pdf'? true : false;
        }
        if(flagValidationExt === false){
            showAlert({ type: 'warning', message: 'El archivo debe estar en formato PDF', timeOut: 8000 });
            document.getElementById(id).value= null
            return;
        }
        showAlert({ type: 'success', message: 'Archivo adjuntado con éxito', timeOut: 8000 });
        if(type === 'OrdenCompra'){
            this.setState({
                cv: value,
                file:value
            })
        }else {
            this.setState({
                fileComprobante: value
            })           
        }
       
    }
    openPayModal = () => {
        const { marcas, aparatos, refacciones, fabricantes, cardNumber, userNName, expirationMont, expirationYear, cvv2 } = this.state;
        const { totalPagar } = this.state;

        //console.log('Valor del state', this.state);
        return (
            <div className="modal fade" id="openPayModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ border: "none", textAlign: 'center' }}>
                <div className="modal-dialog" role="document" style={{ margin: '1.75rem auto' }}>
                    <div className="modal-content">
                        <div className="modal-header" style={{ background: config.navBar.backgroundColor }}>
                            <h5 className="modal-title " style={{ color: config.navBar.textColor }}>Pago con OpenPay</h5>
                            <button type="button" style={{ color: config.navBar.textColor }} className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <script type="text/javascript" src="https://resources.openpay.mx/lib/openpay-data-js/1.2.38/openpay-data.v1.min.js"></script>

                        <div className="modal-body bg3">
                            <form onSubmit={this.handelSubmit} method="post" encType="text/plain" className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h5>Tarjetas de credito</h5>
                                        <img src={config.openPay.credit} className="img-fluid">
                                        </img>
                                    </div>
                                    <div className="col-md-12">
                                        <h5>Tarjetas de debito</h5>
                                        <img src={config.openPay.debit} className="img-fluid">
                                        </img>
                                    </div>
                                    <div className="col-md-12">
                                        <h4>Nombre del titular</h4>
                                        <input type="text" className="form-control text-left" style={{ textAlign: 'center', height: 30, padding: 0 }}
                                            placeholder="Como aparece en la tarjeta" autoComplete="off"
                                            value={userNName} onChange={(event) => { this.userName(event) }} />
                                    </div>
                                    <div className="col-md-12">
                                        <h4>Numero de tarjeta</h4>
                                        <input type="text" className="form-control text-left" autoComplete="off" maxLength="16" onKeyPress={this.solonumeros} style={{ textAlign: 'center', height: 30, padding: 0 }}
                                            value={cardNumber} onChange={(event) => { this.cardNumber(event) }} />
                                    </div>
                                    <div className="col-md-12">
                                        <h4>Fecha de expiración</h4>
                                    </div>
                                    <div className="col-md-6">
                                        <input type="text" className="form-control text-left" placeholder="Mes" maxLength="2" style={{ textAlign: 'center', height: 30, padding: 0 }}
                                            value={expirationMont} onChange={(event) => { this.expirationMonth(event) }} /></div>
                                    <div className="col-md-6"
                                    ><input type="text" className="form-control text-left" placeholder="Año" maxLength="2" style={{ textAlign: 'center', height: 30, padding: 0 }}
                                        value={expirationYear} onChange={(event) => { this.ExpirationYear(event) }} /></div>
                                    <div className="col-md-12">
                                        <h4>Codigo de seguridad</h4>
                                        <input type="text" className="form-control text-left" placeholder="3 dígitos" style={{ textAlign: 'center', height: 30, padding: 0 }}
                                            autoComplete="off" maxLength="3" pattern="[0-9]" value={cvv2} onChange={(event) => { this.Cvv2(event) }} />
                                    </div>
                                    <div className="col-md-12">
                                        <h4>Monto</h4>
                                        <input type="text" className="form-control text-left" style={{ textAlign: 'center', height: 30, padding: 0 }} name="monto" value={totalPagar} readOnly />
                                    </div>
                                    <div className="col-md-6">
                                        {/* <h5>Tarjetas de credito</h5> */}
                                        <p>Transacciones realizadas vía: </p>
                                        <img src={config.openPay.logo} className="img-fluid">
                                        </img>
                                    </div>
                                    <div className="col-md-6">
                                        <img src={config.openPay.security} className="img-fluid">
                                        </img>
                                        <p> Tus pagos se realizan de forma segura con encriptación de 256 bits </p>
                                    </div>


                                    <div className="row">
                                        <div className="form-group col-md-12">
                                            <a className="button rght" id="pay-button" onClick={this.CreateCardId}
                                                style={{ fontsize: 25, background: config.navBar.iconColor, color: 'white', marginTop: 15 }} >Pagar</a>
                                            {/* <input type="submit" value="Buscar" className="btn btn-primary mb-2 btn-block "
                                                style={{ fontsize: 25, background: config.navBar.iconColor, color: 'white', marginTop: 15 }} /> */}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            </div >
        )
    };
    changeNumOrden = async (event)=> {
        const {numOrden} = this.state;
        let numOrdens = event.nativeEvent.target.value;

        this.setState({
            numOrden:numOrdens
        });
    }

    dataForQuotation(){
        const { shoppingCartReducer: { items}} = this.props;
        let data = sessionStorage.getItem('validateOrder');
        let currency = this.totalOrder(data.discPrcnt, data.discPnt).currency;
        let total = this.totalOrder(data.discPrcnt, data.discPnt).total;
        let subTotal = this.totalOrder(data.discPrcnt, data.discPnt).subTotal;
        let taxTotal = this.totalOrder(data.discPrcnt, data.discPnt).taxTotal;
        let tax = this.totalOrder(data.discPrcnt, data.discPnt).tax;
        // console.log("job",items)
        let toPrint=[
            {
                data: {
                    body: items,
                    header: {
                        DocEntry: "",
                        DocTotal: total,
                        currency: currency,
                        subTotal: subTotal,
                        taxTotal: taxTotal,
                        tax: tax
                    },
                },
                
                message: "",
                status: 1
            }
        ]
        return toPrint
    }
    comprobantePagoShow = async () =>{
        const{ notificationReducer: {showAlert},sessionReducer: { user }}= this.props
        const {comprobantePago,contadoSelected,numOrden,cv,file,fileComprobante} = this.state
        if(user.U_MOC === 'SI' && (numOrden ==='' || cv==='' || file==='')){
            return showAlert({type: 'warning', message: "Favor de agregar su número de órden y anexar el archivo correspondiente", timeOut: 8000});
        }
        await this.setState({
            comprobantePago:!comprobantePago,
            contadoSelected:!contadoSelected,
            fileComprobante: contadoSelected ? fileComprobante : ''
        })
    }
    render() {
        const { history, sessionReducer: { role,user }, shoppingCartReducer: { items,itemsGift }, enableSpinner} = this.props;
        const { seller, comentario,csvData, totalPagar, discPrcnt, discPnt, dsicCash, PorCobrar, Viewinsurance, insurance,numOrden,comprobantePago,contadoSelected,fileComprobante,address,bill } = this.state;

        let data = sessionStorage.getItem('validateOrder');
        data = JSON.parse(data || '{}');
        items.sort(function (a,b){//REORDENAR || ARTICULOS SIN STOCK AL FINAL DEL ARRAY
            return a.OnHandPrincipal === 0 ? 1 : b.OnHandPrincipal === 0 ? -1 :0;
        })
        let currency = this.totalOrder(data.discPrcnt, data.discPnt).currency;
        let total = this.totalOrder(data.discPrcnt, data.discPnt).total;
        let subTotal = this.totalOrder(data.discPrcnt, data.discPnt).subTotal;
        let taxTotal = this.totalOrder(data.discPrcnt, data.discPnt).taxTotal;
        let tax = this.totalOrder(data.discPrcnt, data.discPnt).tax;
        
        const dataQuotation = this.dataForQuotation()
        
        // let dsicCash = this.totalOrder(discPrcnt, discPnt).dsicCash;
        return (
            <div className="content-fluid" style={{ marginTop: 150, backgroundColor: config.Back.backgroundColor }}>
                <Session history={history} view={VIEW_NAME.VALIDATE_ORDER_VIEW} />
                <NavBar isShowMarcas={false}/>
                <CommentsModal
                sendOrder = {this.sendOrder}
                sendOrderVta = {this.sendOrderDiscount}
                tipo = {comentario}
                />
                {this.openPayModal()}
                <div className="row" style={{marginLeft: 10, marginRight: 10, minHeight: '70vh', paddingTop: 15 }}>
                    <div className="col-lg-8 pb-2">
                        <div className="card style-articles-cart" style={{ borderColor: '#ADADAD', borderRadius: 20 }}>
                            <div className="card-header" style={{ background: "#ADADAD", borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                                <h4 className="card-title" style={{ color: config.shoppingList.textProductList }}>
                                    Últimos detalles <span className="small" style={{ color: config.shoppingList.textProductList }}>(precios sin I.V.A):</span>
                                </h4>
                            </div>
                            <div className="card-body" style={{height: items.length >= 6 ? '600px' : '',overflowY: items.length >= 6 ? 'auto' : 'hidden'}}>
                                {items.map((item, index) => {
                                    return this.renderItem(item, index);
                                })}
                            </div>
                           
                            {
                                PorCobrar &&
                                <div className="card-body">
                                    <div className='row' style={{ padding: 10, textAlign: 'center' }}>
                                        <div className='col-sm-3' style={{ margin: 0 }}>
                                            <img className="img-fluid " style={{ backgroundColor: 'white', maxHeight: 130 }}
                                                src={require('../../images/noImage.png')}
                                                alt="" />
                                        </div>
                                        <div className='col-sm-9'>
                                            <div className="container p-0">
                                                <div className="row">
                                                    <div className="col-12" style={{  }}>
                                                        <div className='text-center'>
                                                            <strong>{responseFlete.ItemName}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row font-weight-bold">
                                                    <div className="col-md-12 table-responsive ">
                                                        <table className="table">
                                                            <thead style={{textAlign: "-webkit-center"}}>
                                                                <tr >
                                                                    <th scope="col">Código</th>
                                                                    <th scope="col">Precio envio</th>
                                                                    <th scope="col"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <td style={{color: "#0076B8"}}>
                                                                    {responseFlete.ItemCode}
                                                                </td>
                                                                <td style={{color: "#666666"}}>
                                                                    <CurrencyFormat
                                                                        value={responseFlete.Price}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        fixedDecimalScale={true}
                                                                        decimalScale={2}
                                                                        // prefix={config.general.currency}
                                                                        prefix={'$ '}
                                                                        suffix={config.general.currency}>
                                                                    </CurrencyFormat>
                                                                </td>
                                                                <td></td>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {/* {
                                Viewinsurance && 
                                <div className="card-body">
                                    <div className='row' style={{ padding: 10, textAlign: 'center' }}>
                                        <div className='col-sm-3' style={{ margin: 0 }}>
                                            <img className="img-fluid " style={{ backgroundColor: 'white', maxHeight: 130 }}
                                                src={require('../../images/noImage.png')}
                                                alt="" />
                                        </div>
                                        <div className='col-sm-9'>
                                            <div className="container p-0">
                                                <div className="row">
                                                    <div className="col-12" style={{  }}>
                                                        <div className='text-center'>
                                                            <strong>MANIOBRAS II</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row font-weight-bold">
                                                    <div className="col-md-12 table-responsive ">
                                                        <table className="table">
                                                            <thead>
                                                                <tr >
                                                                    <th scope="col">Código</th>
                                                                    <th scope="col">Precio seguro</th>
                                                                    <th scope="col"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <td style={{color: "#0076B8"}}>
                                                                    MANIOBRAS II
                                                                </td>
                                                                <td style={{color: "#666666"}}>
                                                                    <CurrencyFormat
                                                                        value={insurance}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        fixedDecimalScale={true}
                                                                        decimalScale={2}
                                                                        prefix={'$ '}
                                                                        suffix={config.general.currency}>
                                                                    </CurrencyFormat>
                                                                </td>
                                                                <td></td>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            } */}
                        </div>
                        <div className="card style-articles-cart mt-4" style={{ borderColor: '#ADADAD', borderRadius: 20 }}>
                            <div className="card-header" style={{ background: "#ADADAD", borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                                <h4 className="card-title" style={{ color: config.shoppingList.textProductList }}> Articulos de regalo</h4>
                            </div>
                            <div className="card-body">
                                { itemsGift.map((items)=>{return this.renderItemPromo(items)})}
                            </div>
                        </div>

                    </div>
                    <div className="col-lg-3">
                        <div className="card" style={{borderRadius: 20 , borderColor: 'white', backgroundColor: 'white', border: '1px solid  rgba(124, 124, 125, 0.3)' }}>
                            <div className="card-header text-white" style={{ background: config.Back.color, borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                                <div className="card-title">
                                    <h5 style={{ color: config.shoppingList.textsummaryList }}>Detalles del envío</h5>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12">
                                        <span className="font-weight-bold" style={{ fontSize: 17 }}>Dirección de envío</span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        {this.renderAddress()}
                                    </div>
                                </div>
                                <div className="row" style={{backgroundColor: config.Back.backgroundColor}}>
                                    <div className="col-3" style={{ padding: 0 }}>
                                        <span className="font-weight-bold">
                                            Subtotal:
                                        </span>
                                    </div>
                                    <div className="col-9 text-right">
                                        <span className="text-right" style={{ fontSize: 18, color: config.itemsList.textPrice }}>
                                            <CurrencyFormat
                                                value={subTotal}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                fixedDecimalScale={true}
                                                decimalScale={2}
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                            {/*` ` +currency*/}
                                        </span>
                                    </div>
                                </div>
                                <div className="row" style={{backgroundColor: config.Back.backgroundColor}}>
                                    <div className="col-4" style={{ padding: 0 }}>
                                        <span className="font-weight-bold">
                                            I.V.A. ({tax}%): 
                                        </span>
                                    </div>
                                    <div className="col-8 text-right">
                                        <span className="text-right" style={{ fontSize: 18, color: config.itemsList.textPrice }}>
                                            <CurrencyFormat 
                                                value={taxTotal} 
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                            {/* {` ` +currency} */}
                                        </span>
                                    </div>
                                </div>
                                {
                                    PorCobrar && 
                                    <div className="row" style={{backgroundColor: config.Back.backgroundColor }}>
                                        <div className="col-3" style={{ padding: 0}}>
                                            <span className="font-weight-bold">
                                                Envío:
                                            </span>
                                        </div>
                                        <div className="col-9 text-right">
                                            <span className="text-right" style={{ fontSize: 18, color: config.itemsList.textPrice}}>
                                                <CurrencyFormat
                                                    value={PorCobrar === false ? 0 : responseFlete.Price}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    fixedDecimalScale={true}
                                                    decimalScale={2}
                                                    prefix={'$ '}
                                                    suffix={config.general.currency}>
                                                </CurrencyFormat>
                                                {/*` ` +currency*/}
                                            </span>
                                        </div>
                                    </div>
                                }
                                {/* {
                                    Viewinsurance && 
                                    <div className="row" style={{backgroundColor: config.Back.backgroundColor}}>
                                        <div className="col-6" style={{ padding: 0 }}>
                                            <span className="font-weight-bold">
                                                Seguro:
                                            </span>
                                        </div>
                                        <div className="col-6 text-right">
                                            <span className="text-right" style={{ fontSize: 18, color: config.itemsList.textPrice }}>
                                                <CurrencyFormat
                                                    value={Viewinsurance === true ? insurance : 0}
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
                                } */}
                                
                                {
                                    dsicCash !== 0 &&
                                    <div className="row bg-light">
                                       <div className="col-6" style={{ padding: 0 }}>
                                            <span className="font-weight-bold">
                                                Descuento:
                                            </span>
                                        </div>
                                        <div className="col-6 text-right">
                                            <span className="text-right" style={{ fontSize: 18, color: config.itemsList.textPrice }}>
                                                <CurrencyFormat
                                                    value={dsicCash}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    fixedDecimalScale={true}
                                                    decimalScale={2}
                                                    prefix={'- $'}>
                                                </CurrencyFormat>
                                                {/* {` ` +currency} */}
                                            </span>
                                        </div>
                                    </div>
                                }
                                <div className="row" style={{backgroundColor: config.Back.backgroundColor}}>
                                    <div className="col-6" style={{ padding: 0 }}>
                                        <span className="font-weight-bold">
                                            Total a pagar:
                                        </span>
                                    </div>
                                    <div className="col-6 text-right">
                                        <span className="text-right" style={{ fontSize: 18, color: config.itemsList.textPrice }}>
                                            <CurrencyFormat
                                                value={total}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                fixedDecimalScale={true}
                                                decimalScale={2}
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                            {/* {` ` +currency} */}
                                        </span>
                                    </div>
                                </div><br/>
                                 {/* <div className="row">
                                    <div className="col-12">
                                        <span className="font-weight-bold" style={{fontSize: 17}}>Método de pago</span>
                                    </div>
                                </div> */}
                                {user.U_MOC == 'SI' ?
                                    <div>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div className="input-group-text font-weight-bold">N°. de Orden de Compra</div>
                                            </div>
                                            <input type="text" class="form-control" id="inlineFormInputGroup" name="numOrden" id="numOrden"   onChange = {(event)=> {this.changeNumOrden(event)}} value = {numOrden || ''}/>
                                        </div>
                                        <input type="file" name="file" id="fileImput2" enctype="multipart/form-data"   placeholder="Archivo orden de compra"  onChange={(event) => {this.onChangeCV(event.target.files[0],'OrdenCompra','fileImput2')}} className="form-control-file" ></input>
                                    </div>
                                    : ''
                                }                                
                                {/* <button
                                    onClick={this.enviarCorreo}
                                    className="btn btn-block text-white"
                                    disabled={contadoSelected}
                                    style={{
                                        backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                        color: config.navBar.textColorCategorieHover,
                                        fontWeight: "bold",
                                    }}>
                                    TEST  CORREO
                                </button> */}
                               <button
                                    onClick={this.enviar}
                                    className="btn btn-success btn-block text-white"
                                    disabled={contadoSelected}
                                    style={{
                                        backgroundColor: config.navBar.btn_comprarCredito,
                                        color: config.navBar.textColorCategorieHover,
                                        fontWeight: "bold",
                                    }}>
                                    Comprar a Crédito
                                </button>

                                <button
                                    onClick={this.comprobantePagoShow}
                                    className="btn btn-success btn-block border border-2 border-success"
                                    style={{
                                        backgroundColor: config.navBar.btn_comprarContado,
                                        color: config.navBar.btn_comprarCredito,
                                        fontWeight: "bold",
                                    }}>
                                    Comprar a Contado
                                </button>
                                {comprobantePago?
                                    <div>
                                        <div class="d-block">
                                            <div className="font-weight-bold text-center">Comprobante de Pago</div>
                                        </div>
                                        <input type="file" name="file" id="ComprobanteInput" enctype="multipart/form-data"   placeholder="Comprobante de Pago" onChange={(event) => {this.onChangeCV(event.target.files[0],'comprobante','ComprobanteInput')}} className="form-control-file" ></input>
                                    </div>
                                    : ''
                                }  
                                {contadoSelected && fileComprobante !== '' ?
                                 <button
                                 onClick={this.enviar}
                                 className="btn btn-block text-white"
                                 disabled={!contadoSelected}
                                 style={{
                                     backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                     color: config.navBar.textColorCategorieHover,
                                     fontWeight: "bold",
                                 }}>
                                 Crear Orden (Comprobante de Pago)
                             </button>:''
                                }

                                {/* {seller ? seller.U_FMB_Handel_Perfil != 0 ?

                                    <button
                                        onClick={this.enviarVta}
                                        className="btn btn-block"
                                        style={{
                                            backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                            color: config.navBar.textColorCategorieHover,
                                            fontWeight: "bold",
                                        }}>
                                        Transferencia gratuita
                                </button>
                                    : "" : ""
                                } */}

                                {/* <button
                                    onClick={this.sendDelivery}
                                    className="btn btn-block"
                                    style={{
                                        backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                        color: config.navBar.textColorCategorieHover,
                                        fontWeight: "bold",
                                    }}>
                                    Crear entrega
                                </button>
                                <button
                                    onClick={this.sendQuotation}
                                    className="btn btn-block"
                                    style={{
                                        backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                        color: config.navBar.textColorCategorieHover,
                                        fontWeight: "bold",
                                    }}>
                                    Crear cotizacion
                                </button>
                                <button
                                    onClick={this.sendPreliminar}
                                    className="btn btn-block"
                                    style={{
                                        backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                        color: config.navBar.textColorCategorieHover,
                                        fontWeight: "bold",
                                    }}>
                                    Crear pedido preliminar
                                </button> */}
                                <button
                                    onClick={this.sendSavedCart}
                                    className="btn btn-block border border-2  border-primary"
                                    style={{
                                        backgroundColor: config.navBar.btn_guardarCarrito,
                                        color: config.navBar.textColorCategorieHover,
                                        fontWeight: "bold",
                                    }}>
                                    Guardar Carrito
                                </button> 
                                <div className='btn-block'>
                                    <ExportReportGeneral
                                        data={dataQuotation}
                                        typeDocs={"quotations2"}
                                        enableSpinner={enableSpinner}
                                        view={"validateOrder"}
                                        itemsGift={itemsGift}
                                        items={items}
                                        address={address}
                                        bill={bill}
                                    />
                                </div>                                                                 
                                
                                {/* <button
                                    onClick={this.download}
                                    className="btn btn-block btn-success"
                                    style={{
                                        // backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                        color: config.navBar.textColorCategorieHover,
                                        fontWeight: "bold",
                                    }}>
                                    Descargar Excel <i className="fa fa-file-excel-o" aria-hidden="true"></i>
                                </button> */}

                                {/* <CSVLink
                                    className="btn btn-block text-white"
                                    onClick={this.download}
                                    style={{
                                        color: config.navBar.textColorCategorieHover,
                                        fontWeight: "bold", background: "#86C03F"
                                    }}
                                    data={csvData} filename={"OrdenDeVenta.csv"}>
                                        Descargar Excel <i className="fa fa-file-excel-o" aria-hidden="true"></i>
                                </CSVLink> */}
                            </div>
                        </div>
                    </div>
                </div><br/>
            </div>
        );
    }
}


const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
        sessionReducer: store.SessionReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
        shoppingCartReducer: store.ShoppingCartReducer
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
        setUser: value => dispatch({ type: DISPATCH_ID.SESSION_SET_USER, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ValidateOrderView);