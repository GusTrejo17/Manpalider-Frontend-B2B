import React, {Component} from 'react';
import { NavBar, Session } from "../../components";
import {VIEW_NAME, config, SERVICE_API, DISPATCH_ID, SERVICE_RESPONSE, ROLES} from "../../libs/utils/Const";
import {connect} from 'react-redux';
import {ApiClient} from "../../libs/apiClient/ApiClient";
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';
import moment from 'moment';
import { animateScroll as scroll, scroller } from 'react-scroll';
import ExportReportPDF from '../../components/ExportReportPDF';
import { CSVLink, CSVDownload } from "react-csv";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

let doc = new jsPDF();
let apiClient = ApiClient.getInstance();

class CartSavedsView extends Component {
    csvLink= React.createRef();
    constructor(props) {
        super(props);
        // const f = new Date;
        // const newDate = new Date(f.setMonth(f.getMonth() + +(-3)))
        this.state = {
            CartSaveds : [],
            order: {
                header: {},
                body: []
            },
            fechaInicio: '',
            fechaFinal: '',
            fechaActual: '',
            checkboxDataTables: (new Map(): Map<string, boolean>),
            newOrder :[],
            updateCart : 'N',
            tableToExcel : [],
            date: '',
            user:'',
            seller: JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser')),
        };
        this.table = null;
        this.scrollToBottom = this.scrollToBottom.bind(this);
    };

    async componentDidMount(){
        const f = new Date;
        const newDate = new Date(f.setMonth(f.getMonth() + +(-3)));
        let fechaInicio = moment(newDate).format('YYYY-MM-DD');
        // moment(new Date()).format('YYYY-MM-DD');
        let fechaFinal = moment(new Date()).format('YYYY-MM-DD');
        this.setState({
            fechaInicio,
            fechaFinal
        });
        setTimeout(() => {
            this.cargarDatos();
        }, 2000);
        this.scrollToBottom();
    };

    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
    }

    async cargarDatos (){
        const {enableSpinner, sessionReducer} = this.props;
        // sessionReducer.user.U_FMB_Handel_Perfil
        const {fechaInicio,fechaFinal} = this.state;
        
        enableSpinner(true);
        let seller = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
        // U_FMB_Handel_Perfil
        // console.log("117>>>>seller.salesPrson",seller.salesPrson," sessionReducer.user.U_FMB_Handel_Perfil",sessionReducer.user.U_FMB_Handel_Perfil)
        let action = seller ? seller.U_FMB_Handel_Perfil === 3 ? 'CartSavedsAdmin' : 'CartSaveds' : '';
        
        
        let data ={
            action: action,
            usuario : seller.salesPrson,
            fechaInicio : fechaInicio,
            fechaFinal : fechaFinal
        }
        // CartSavedsAdmin
        let newdatas = await apiClient.getCartSaveds(data);
        
        let nuevos = [];
        for (let i = 0; i < newdatas.data.list.length; i++) {
            const element = newdatas.data.list[i];
            let bandera = true;               
            nuevos.map((arr) => {
                if(arr.id === element.id){
                    bandera = false;
                }
            })
            if(bandera){
                nuevos.push(newdatas.data.list[i])
            }
        }

        if (newdatas.status === SERVICE_RESPONSE.SUCCESS) {
            let user = localStorage.getItem(config.general.localStorageNamed + 'CurrentUser');
        
            user = JSON.parse(user) || {};
            this.setState({
                CartSaveds : nuevos,
                CardName : user.CardName,
                fechaActual : moment(new Date()).format('YYYY-MM-DD')
            });
    
            this.table = $('#CartsSaved').DataTable({
                "paging": false,
                "info": false,
                "searching": false,
                "language": {
                    "lengthMenu": "Registros por página  _MENU_ ",
                    "zeroRecords": "No se encontraron registros",
                    "info": "Mostrando página _PAGE_ de _PAGES_",
                    "infoEmpty": "No existen registros",
                    "infoFiltered": "(filtrado de _MAX_ entradas)",
                    "loadingRecords": "Buscando...",
                    "processing": "Procesando...",
                    "search": "Buscar:",
                    "paginate": {
                        "first": "Primero",
                        "last": "Último",
                        "next": "Siguiente",
                        "previous": "Anterior"
                    }
                }
            });
            enableSpinner(false);
            return;
        }
        enableSpinner(false);
    };
    
    Details = async (valor, items, cardCode, updateCart, date, cardName) => {
        const {notificationReducer: { showAlert }, enableSpinner} = this.props;
        
        enableSpinner(true);
        
        let data = {
            usuario : cardCode,
            Items : items,
            docEntry : valor,
        }
        
        let responses = await apiClient.getDetailsCartSaveds(data);
        if (responses.data.list.length > 0 && responses.status === SERVICE_RESPONSE.SUCCESS) {
            this.setState({
                order: responses.data.list,
                U_Handel_Email: cardCode,
                U_Handel_Password : responses.data.datos[0].U_Handel_Password,
                idCarrito : valor,
                updateCart:updateCart,
                date: moment(date).utc().format('DD-MM-YYYY'), // new PDF
                user: cardName.toUpperCase(),
            }); 
            $('#save').modal('show');
            enableSpinner(false);
            return;
        }
        else{
            this.setState({
                order: [],
            });
            showAlert({ type: 'error', message: 'Los artículos guardados en este carrito ya no son visibles para este cliente',timeOut: 5000 });
            enableSpinner(false);
            return;
        }
    }

    handleInputDateInicio = event =>{
        let fechaInicio = event.nativeEvent.target.value;
        this.setState({
            fechaInicio
        });
    }

    handleInputDateFinal = event =>{
        let fechaFinal = event.nativeEvent.target.value;
        this.setState({
            fechaFinal
        });
    }

    getData = async () =>{        
        this.table.destroy();
        this.cargarDatos();
    }

    CheckboxActions = async (docEntryArray, action = null) => {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        
        docEntryArray.map(nuevo =>{
        })
        let responseArray = [];

        for (let document in docEntryArray) {
            enableSpinner(true);

            let statusAuthorization = "";
            let message = "";
            if (action == 1) {
                message = "Eliminando carrito de";
                statusAuthorization = 1;
            }
            let Documento = docEntryArray[document].CardName;
            showAlert({type: 'warning', message: message + ': ' + Documento, timeOut: 2500});

            let Id = docEntryArray[document].id;
            let response = "";

            if (action == 1) {
                response = await apiClient.deleteCartSaved(Id);
            }

            enableSpinner(false);
            try {
                responseArray.push({
                    docNum: Documento,
                    message: response.message ? response.message : '',
                });
            } catch (e) {
                responseArray.push({
                    docNum: '',
                    message: '',
                });
            }
        }
        return responseArray;
    };

    // async addToShopingCart(){
    //     //Los PROPS los consigues de abajo
    //     const {order,notificationReducer: {showAlert},configReducer,enableSpinner, } = this.props;
    //     //Lista de los productos del documento
    //     let items = [];
    //     //Evadir el Articulo de envio
    //     order.body.map(item => {
    //         if(item.ItemCode !== "MANIOBRAS" && item.ItemCode !== "MANIOBRAS II"){
    //             if(updateCart === 'Y'){
    //                 items.push({ItemCode: item.ItemCode, quantity: parseInt(item.Quantity), Price : item.Price, Disc: item.Discount});
    //             }else{
    //                 items.push({ItemCode: item.ItemCode, quantity: parseInt(item.Quantity)});
    //             }
    //         }
    //     });
    //     //Lista sin el Envio o Traslado
    //     //Comineza a pasarse al carro
    //     enableSpinner(true);
    //     //agregar al carro directo con sql
    //     let responsesd = await apiClient.updateShoppingCartLocal(items);
    //     if(responsesd.status === 1){
    //         $('#saveModal').modal('hide');
    //         showAlert({type: 'success', message: ' Agregado a carrito correctamente ', timeOut: 8000});
    //         configReducer.history.goShoppingCart();
    //     }
    //     enableSpinner(false);
    // }

    async addToShopingCart(){
        const {notificationReducer: {showAlert},configReducer,enableSpinner, setRememberUser,setUserSession,setRole,setToken} = this.props;
        const {order,U_Handel_Email,U_Handel_Password, idCarrito,updateCart} = this.state;
        
        const orders = []; 

        for(var indice = 0; indice < order.length; indice++) {
            const arreglo = order[indice];
            let esDuplicado = false;
            for(var i = 0; i < orders.length; i++) {
                if (orders[i].ItemCode === arreglo.ItemCode) {
                    orders[i].Quantity += parseInt(arreglo.Quantity);
                    esDuplicado = true;
                    break;
                }
            }
            if (!esDuplicado) {
                orders.push(arreglo);
            }
        }

        let items = [];
        orders.map(item => {
            if(item.ItemCode !== "ENVIO"){

                if(updateCart === 'Y'){
                  
                    items.push({ItemCode: item.ItemCode, quantity: parseInt(item.Quantity), Price : item.Price, Disc: item.Discount || 0});
                }else{
                    items.push({ItemCode: item.ItemCode, quantity: parseInt(item.Quantity)});
                }
            }
        });
        
        enableSpinner(true);

        // Agregar cliente 
        let user = {
            email: U_Handel_Email,
            password: U_Handel_Password,
        };
        let response = await apiClient.login(user);
        if(response.status === 0){
            return;
        }

        let vendedor = {
            salesPerson: "0",
            firstName: "Vendedor",
            lastName: "Desde cliente"
        };
        
        enableSpinner(true);
        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            let user = response.data.user;
            let token = response.data.token;
            let remember = true;
            
            localStorage.setItem(config.general.localStorageNamed + 'Token', JSON.stringify(token));
            localStorage.setItem(config.general.localStorageNamed + 'Role', ROLES.CLIENT);
            localStorage.setItem(config.general.localStorageNamed + 'CurrentUser', JSON.stringify(user));
            localStorage.setItem(config.general.localStorageNamed + 'Vendor', JSON.stringify(vendedor));
            localStorage.setItem(config.general.localStorageNamed + 'RememberUser', remember );

            setRole(ROLES.CLIENT);
            setToken(token);
            setUserSession(user);
            setRememberUser(remember);

            let responsesd = await apiClient.updateShoppingCartLocal(items);

            localStorage.removeItem(config.general.localStorageNamed + 'shoppingCart');

            enableSpinner(false);
            setTimeout(async ()=> {
                if(responsesd.data.value > 0){
                    $('#save').modal('hide');
                    await apiClient.deleteCartSaved(idCarrito);
                    showAlert({type: 'success', message: ' Agregado a carrito correctamente ', timeOut: 0});
                    configReducer.history.goShoppingCart();
                }else{
                    configReducer.history.goHome();
                }
            },50);
            
            return;
        }
        // Agregar cliente
        enableSpinner(false);
    }

    DeleteMasive = async response => {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        const {CartSaveds, checkboxDataTables} = this.state;
        let docEntryArray = [];
        let responseArray = [];
        for (let [id, value] of checkboxDataTables.entries()) {
            if (value) {
                docEntryArray.push(CartSaveds[id]);
            }
        }
        if(docEntryArray.length>0){
            responseArray = await this.CheckboxActions(docEntryArray,1);
            this.toggleDocumentSelectedAll(false);
            
            this.setState({
                checkboxDataTables: (new Map(): Map<string, boolean>),
                responseArray 
            })
            this.table.destroy();
            this.cargarDatos();

        } else{
            showAlert({type: 'error', timeOut: 2000, message: "Seleccione un carrito"});
            return;
        }
    };

    toggleDocumentSelected = (id) => {
        this.setState(state => {
            const checkboxDataTables = new Map(state.checkboxDataTables);
            checkboxDataTables.set(id, !checkboxDataTables.get(id)); // toggle
            return {checkboxDataTables};
        });
    };

    toggleDocumentSelectedAll = (action) => {
        const {CartSaveds} = this.state;
        let newCheckbox = (new Map(): Map<string, boolean>);
        CartSaveds.map((register, index) => {
            newCheckbox.set(index, action)
        });
        this.setState({
            checkboxDataTables: newCheckbox
        });
    };

    changeQuantityItem = async (event, index) => {
        const {notificationReducer: {showAlert}} = this.props;
        const {order} = this.state;

        let quantity = event.nativeEvent.target.value;
        
        if (quantity.indexOf(" ") !== -1 || quantity.indexOf("-") !== -1) {
            showAlert({type: 'warning', message: "Carácter no permitido"});
            return;               
        }

        order[index].Quantity = parseInt(quantity);

        setTimeout(() => {
            this.setState({
                newOrder: order,
            });
        }, 100);
    }

    changePriceItem = async (event, index) => {
        const {notificationReducer: {showAlert}} = this.props;
        const {order} = this.state;
        let price = event.nativeEvent.target.value;
       
        if (!isNaN(price)) {
            order[index].Price = price;
            order[index].newTotal = ((order[index].Price - (order[index].Price * (order[index].Discount || 0 / 100) / 100)) * (order[index].Quantity));
            this.refreshSate(order);
            this.setState({
                newOrder: order,
            });  
        }else{
            showAlert({type: 'warning', message: "Carácter no permitido"});
            return;  
        }        
    }

    changeDiscountItem = async (event, index) => {
        const {notificationReducer: {showAlert}} = this.props;
        const {order} = this.state;
        let discount = event.nativeEvent.target.value;
        
        if (discount.indexOf(" ") !== -1 || discount.indexOf("-") !== -1) {
            showAlert({type: 'warning', message: "Carácter no permitido"});
            return;               
        }

        order[index].Discount = discount;
        order[index].newTotal = ((order[index].Price - (order[index].Price * (order[index].Discount || 0 / 100) / 100)) * (order[index].Quantity));
        this.refreshSate(order);
        setTimeout(() => {
            this.setState({
                newOrder: order,
            });
        }, 100);
    }

    UpdateCart = async () => {
        const {notificationReducer: {showAlert},configReducer,enableSpinner} = this.props;
        const {newOrder} = this.state;
        let items = [];

        let docEntry = newOrder.length > 0 ? newOrder[0].id : null;
        if(!docEntry){
            showAlert({type: 'warning', message: 'Aún no has hecho algún cambio ', timeOut: 8000});
            return;
        }
        for (let index = 0; index < newOrder.length; index++) {
            const item = newOrder[index];
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
            await this.getData()
            showAlert({type: 'success', message: response.message, timeOut: 8000});
            setTimeout(() => {
                $('#save').modal('hide');
            }, 1500);
        }else{
            showAlert({type: 'error', message: response.message, timeOut: 8000});
        }
        enableSpinner(false);

    }

    exportCSVOrders = async () => {
        const { notificationReducer: {showAlert}} = this.props;
        const {CartSaveds, order, fechaInicio, fechaFinal, fechaActual, checkboxDataTables} = this.state;
        setTimeout(() => {
            if (order.length > 0){
                let minNewOrders = [];
                order.map((saved, index) => {
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

    exportPDFOrders = async (type,Cart,date) => {
        const { notificationReducer: {showAlert},sessionReducer: { user } } = this.props;
        let init = moment(date).utc().format('DD-MM-YYYY');
        setTimeout(async () => {
            let Carts = await apiClient.getDataProduct(Cart);
            if (Carts.data.body.length > 0){
                let bodyArray = [];
                let minNewOrders = [];
                let body2FullMinNewOrders = [];
                Carts.data.body.map((order, index) => {
                    minNewOrders.push(
                        {
                            "#": index+1,
                            "Código": order.ItemCode,
                            "Descripción": order.ItemName,
                            "Cantidad": order.Quantity,
                            "Precio": '$ ' + Number(order.Price).toFixed(2),
                            "Precio total": '$ ' + Number(order.Price * parseInt(order.Quantity)).toFixed(2),
                        }
                    );
                    bodyArray.push(Object.values(minNewOrders[0]));
                    body2FullMinNewOrders = minNewOrders.slice(0);
                    minNewOrders.length = 0;
                });

                doc = new jsPDF();

                doc.autoTable({
                    head: [
                        [
                        {
                            content: `COTIZACIÓN DEL CLIENTE ${user.CardName.toUpperCase()} FECHA: ${init}`,
                            colSpan: 6,
                            styles: { halign: 'center', fillColor: config.navBar.iconColor },
                        },
                        ],
                        Object.keys(body2FullMinNewOrders[0])
                    ],
                    body: bodyArray,
                    theme: 'striped',
                    headerStyles: {
                        fillColor: config.navBar.iconColor
                    },
                    alternateRowStyles: {
                        fillColor: "#cecece",
                    }
                });
                
                if(type === 1){
                    doc.save(`Carrito_${user.CardCode}_${init}.pdf`);
                } else {
                    doc.save(`Carrito_${user.CardCode}_${init}.pdf`);
                    window.open(doc.output('bloburl'));
                }
            } else {
                showAlert({type: 'info', message: 'No se ha podido generar sus archivo, porque no se encontraron resultado para su búsqueda'});
            }
            
        }, 500);
    }

    changeTotalItem = async (index, item, event) => {
        const { notificationReducer: { showAlert }} = this.props;
        const {order} = this.state;
        let total = event.nativeEvent.target.value
        
        let DiscPrcnt = 100 - ( (total * 100) / order[index].beforeTotal);
        
        if (!isNaN(DiscPrcnt)) {
            order[index].Discount = DiscPrcnt;
            order[index].newTotal = total;
            this.refreshSate(order);
        }else{
            showAlert({type: 'warning', message: "Carácter no permitido"});
            return;  
        }
    }

    refreshSate = (param) =>{
        
        for (let index = 0; index < param.length; index++) {
            const element = param[index];
            element.beforeTotal = (Number(element.Price) * parseInt(element.Quantity)).toFixed(2);
            element.Quantity = parseInt(element.Quantity);
            // element.Price = parseFloat(element.Price).toFixed(2); 
            // element.Discount = parseFloat(element.Discount).toFixed(2);
            // element.newTotal = parseFloat(element.newTotal).toFixed(2);
            // console.log('con<<<<<<<<<<<<<',element.Discount);
        }
        
        this.setState({
            newOrder: param,
        })
    }

    render() {
        const {history} = this.props;
        const {tableToExcel,CartSaveds, order, fechaInicio, fechaFinal, fechaActual, checkboxDataTables, date, user,seller} = this.state;

        let valor = seller ? seller.U_FMB_Handel_Perfil : '0';
        let modificarPrecio = seller ? seller.U_FMB_Handel_Precio : '0';
        let modificarDescuento = seller ? seller.U_FMB_Handel_Desc : '0';
        
        let checkbox = {
            data: checkboxDataTables,
            selectOne: this.toggleDocumentSelected,
            selectAll: this.toggleDocumentSelectedAll,
        }

        let SubTotal = 0;
        order.length > 0 && !!order&& order.map(save =>{
            SubTotal += ((save.Price - (save.Price * (save.Discount || 0 / 100) / 100)).toFixed(2) * (save.Quantity))// save.Price * parseInt(save.Quantity);
        })
        return (
            <div className="content-fluid marginTable" style={{marginTop: 140}}>
                <Session history={history} view={VIEW_NAME.PROMO_VIEW}/>
                <NavBar/>

                <div className="container mb-4" style={{paddingTop: 60}}>
                    <div className="row">
                        <div className="col">
                            <div className="jumbotron" style={{paddingTop:'10px', paddingBottom:'10px'}}>
                                <h1 style={{fontWeight:"bolder",fontSize:"2.5rem",textAlign:"center", color:"black"}} className="display-6 text-center">Lista de carritos guardados</h1>
                            </div>
                        </div>    
                    </div>
                    <br></br>
                    <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>
                        <div className=" row col-md-4">
                            <h4 className="pr-2">Desde:</h4>
                            <input 
                                id="fechaInicio"
                                type="date" 
                                className="form-control col-md-6" 
                                name="fechauno" 
                                max={fechaActual}
                                value = {fechaInicio}
                                onChange = {(event) => this.handleInputDateInicio(event)}/>
                        </div>
                        <div className="row col-md-4 pb-3">
                            <h4 className="pr-2">Hasta:</h4>
                            <input 
                                id="FechaFin"
                                type="date" 
                                className="form-control col-md-6" 
                                name="fechados" 
                                max={fechaActual}
                                value = {fechaFinal}
                                onChange = {(event) => this.handleInputDateFinal(event)}/>
                        </div>
                        <div className="col-md-2 pb-2">
                            <button
                                onClick={()=>this.getData()}
                                className="btn botonResumen" 
                                style={{
                                    backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                    color: config.navBar.textColor2,
                                    fontWeight: "bold",
                                }}>
                                Ver carritos
                            </button>
                        </div>
                        <div className="col-md-2 pb-2">
                            <button type="button" class="btn btn-danger" onClick={()=>this.DeleteMasive()}>Eliminar carritos</button>
                        </div>
                    </div> 

                <div className="table-responsive" style={{ marginBottom: 0 }}>
                    <table id="CartsSaved" className="table table-hover scrolltable" style={{ marginRight: 0, marginLeft: 0 }}>
                        <thead style={{ textAlign: "-webkit-center" }}>
                            <tr className="text-light text-center" style={{ background: '#2d75bd', borderRadius: '0' }}>
                                <th scope="col">#</th>
                                <th className="sticky-column" >
                                    <input type="checkbox" style={{ minWidth: '100%' }} id="cbox2" value="second_checkbox"
                                        onChange={(event) => checkbox.selectAll(event.target.checked)} />
                                </th>
                                <th scope="col" style={{ width: '8rem' }}>Fecha</th>
                                <th scope="col" style={{ width: '8rem' }}>Código cliente</th>
                                <th scope="col">Cliente</th>
                                <th scope="col">Creador</th>
                                {/* <th scope="col">Dirección de envío</th>
                                <th scope="col">Peso neto</th>
                                <th scope="col">Valor</th> */}
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!!CartSaveds && CartSaveds.map((cart, index) => {
                                return (
                                    <tr className="text-center" key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td className="text-center">
                                            <input type="checkbox" style={{ minWidth: '100%' }} id="cbox2"
                                                checked={!!checkbox.data.get(index)} onChange={() => checkbox.selectOne(index)} />
                                        </td>
                                        <td style={{ width: '8rem' }}>{moment(cart.DateCart).utc().format('YYYY-MM-DD')}</td>
                                        <td style={{ width: '8rem' }}>{cart.CardCode}</td>
                                        <td>{cart.CardName}</td>
                                        <td>{cart.creator === 'B2B' ? 'B2B' : 'Vendedor'}</td>
                                        {/* <td>{cart.DirEnvio}</td>
                                            <td>{ parseFloat(cart.PesoNeto > 0 ? cart.PesoNeto : 0).toFixed(2) + ' KG' }</td>
                                            <td>
                                                <CurrencyFormat
                                                    value={cart.Valor > 0 ? cart.Valor : 0}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    fixedDecimalScale={true}
                                                    decimalScale={2}
                                                    prefix={'$ '}
                                                    suffix={config.general.currency}>
                                                </CurrencyFormat>
                                            </td> */}
                                        <td>
                                            <button
                                                className="btn btn-sm"
                                                type="button"
                                                style={{ backgroundColor: '#0060EA', color: config.navBar.iconModal }}
                                                onClick={() => this.Details(cart.id, cart.Cart, cart.CardCode, cart.updateCart, cart.DateCart, cart.CardName)}>
                                                Visualizar
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>


            </div>
            {/* Modal detalle lista de carritos guradados */}
                <div class="modal fade bd-example-modal-xl" id="save" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <CSVLink 
                        data={tableToExcel} 
                        filename ={`CotizacionCliente.csv`}                
                        className="hidden"
                        ref={this.csvLink}
                        target="_blank">
                    </CSVLink>
                    <div class="modal-dialog modal-xl">
                        <div className="modal-content" style={{ height:'auto' ,maxHeight:'80vh'}}>
                            <div className="modal-header text-light" style={{background: '#0060EA', borderRadius: '0' }}>
                                <h4 className="modal-title" id="modal-basic-title ">Detalle de carrito</h4>

                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span className="text-white" aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body bg3" style={{maxHeight: '70vh', overflow: 'auto', padding:'1.5rem'}}>
                                {order && order.length > 0 && order.map((item, index) => { 
                                    let imagesArray = item.U_Handel_ImagesArray || '';
                                    imagesArray = imagesArray.split('|');
                                    let imagenShow = imagesArray[0] ? (config.BASE_URL + SERVICE_API.getImage + '/' + imagesArray[0]) : require('../../images/noImage.png');
                                    return(
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
                                                            <div className="col-12" style={{  }}>
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
                                                                            <th scope="col">Cód de fabricante</th>                                                                        <th scope="col">Cantidad</th>
                                                                            <th scope="col">Precio</th>
                                                                            <th scope="col">Descuento</th>
                                                                            <th scope="col">Precio con descuento</th>
                                                                            <th scope="col">Precio Total</th>
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
                                                                                    style={{
                                                                                        backgroundColor: '#ededed',
                                                                                        //  'transparent',
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
                                                                                /> )
                                                                            :
                                                                                <label>{parseInt(item.Quantity)}</label>
                                                                            }
                                                                            </td> 
                                                                            <td>    
                                                                            {valor === 3 && modificarPrecio === '1' ?  (
                                                                                <input
                                                                                    type="number"                                                                                    
                                                                                    className=" form-control validarCant cantBlur btn-outline-secondary"
                                                                                    style={{
                                                                                        backgroundColor: '#ededed',
                                                                                        // 'transparent',
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
                                                                                /> )
                                                                            :
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
                                                                            <td>
                                                                            {valor === 3 && modificarDescuento === '1' ?  (
                                                                                <input
                                                                                    type="number"
                                                                                    className=" form-control validarCant cantBlur btn-outline-secondary"
                                                                                    style={{
                                                                                        backgroundColor: '#ededed',
                                                                                        //  'transparent',
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
                                                                                />)
                                                                                :
                                                                                <label>{item.Discount} %</label>
                                                                            }
                                                                            </td>
                                                                            <td>
                                                                                <CurrencyFormat
                                                                                    value={((item.Price - (item.Price * (item.Discount || 0 / 100) / 100)))} 
                                                                                    displayType={'text'} 
                                                                                    thousandSeparator={true} 
                                                                                    fixedDecimalScale={true} 
                                                                                    decimalScale={2} 
                                                                                    prefix={'$ '}
                                                                                    suffix={config.general.currency}>
                                                                                </CurrencyFormat>   
                                                                            </td>                     
                                                                            <td>
                                                                            {valor === 3 && modificarPrecio === '1' ?  (
                                                                                <input
                                                                                    type="number"                                                                                    
                                                                                    className=" form-control validarCant cantBlur btn-outline-secondary"
                                                                                   
                                                                                    style={{
                                                                                        backgroundColor: '#ededed',
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
                                                                                /> )
                                                                            :
                                                                                <CurrencyFormat 
                                                                                    value={item.newTotal} 
                                                                                    displayType={'text'} 
                                                                                    thousandSeparator={true} 
                                                                                    fixedDecimalScale={true} 
                                                                                    decimalScale={2} 
                                                                                    prefix={'$ '}
                                                                                    suffix={config.general.currency}>
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
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                
                                {order.length > 0 && 
                                    <ExportReportPDF 
                                        date={date} 
                                        data={order} 
                                        user={user} 
                                        SubTotal={SubTotal}
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
                                
                                
                                <button type="button" className="btn btn-success" onClick={()=> this.addToShopingCart()}>
                                    <i className="fas fa-cart-plus"/>
                                    &nbsp; Agregar al carrito
                                </button>
                                {valor === 3 && (modificarPrecio === '1' || modificarDescuento === '1') ?  (
                                    <button type="button" className="btn text-white" style={{background: "#86C03F"}} onClick={()=> this.UpdateCart()}>
                                        <i className="fas fa-edit"/>
                                        &nbsp; Modificar
                                    </button>)
                                :
                                    ""
                                }
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
        sessionReducer: store.SessionReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        setRememberUser: value =>  dispatch({type: DISPATCH_ID.SESSION_SET_REMEMBER_USER, value}),
        setUserSession: value => dispatch({type: DISPATCH_ID.SESSION_SET_USER, value}),
        setRole: value => dispatch({type: DISPATCH_ID.SESSION_SET_ROLE, value}),
        setToken: value => dispatch({type: DISPATCH_ID.SESSION_SET_TOKEN, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CartSavedsView);

