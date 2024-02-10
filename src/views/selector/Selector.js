import React, {Component} from 'react';
import {Footer, NavBar, Session} from "../../components";
import {DISPATCH_ID, VIEW_NAME, config, SERVICE_RESPONSE,ROLES } from "../../libs/utils/Const";
import OrdersSellerView from '../orders/OrderSellerView';
import {connect} from 'react-redux';
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {Modal,Pagination} from '../../components/index';
import $ from 'jquery';
import {OrderDetailsModal,SaveCartModal} from "../../components";
import CurrencyFormat from 'react-currency-format';
import { animateScroll as scroll, scroller } from 'react-scroll';
import moment from 'moment';

let apiClient = ApiClient.getInstance();
let modal = new Modal();
require('datatables.net-bs4');

class Selector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            empleado:'',
            buscarLike:'',
            costumers: [],
            listCostumers: [],
            orders: [],
            order: {
                header: {},
                body: []
            },
            buscar:'',
            totalRows: 0,
            pageNumber: 0,
            pageNum: 1,
            valor : '',
            U_CAT: 0,
            empID: '',
        };
        this.hadleChange = this.hadleChange.bind(this);
        this.buscarCliente = this.buscarCliente.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    };
    async componentDidMount(){
        const {enableSpinner} = this.props;
        enableSpinner(true);
        this.fillList();
        this.fillOrder();
        enableSpinner(false);
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

    //Lista de los clientes del vendedor
    async fillList (){
        const {buscar} = this.state;
        let empID  = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
        this.setState({
            empleado: empID ? empID.U_FMB_Handel_Perfil : '',
            salesPerson : empID ? empID.salesPrson : '',
            U_CAT: empID ? empID.U_CAT : 0,
            empID: empID ? empID.empID : 0
        });
        await apiClient.listClient(empID ? empID.salesPrson && empID.U_CAT ? empID.empID : empID.salesPrson : '', buscar, empID.U_CAT ? empID.U_CAT : 0).then(result => {
            let list = result.data.list;
            
            this.setState({
                costumers: list,
                
            });
        });
    };
    //Cargar los pedidos por entrega
    async fillOrder (){
        let Partner = localStorage.getItem(config.general.localStorageNamed + 'PartnerUser');
        // console.log("Valor del local", Partner);
        await apiClient.getOrdersSeller(Partner).then( response => {
            // console.log("Respiueta de consulta", response);
            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                this.setState({
                    orders: response.data,
                });
                $('#tablaOrderSeller').DataTable({
                    "paging": false,
                    "info": false,
                    "searching": false
                });
            }
        });
    };
    //Seleccion de un cliente e inicio de sesión
    toggleCostumer = async () => {
        const {
            loginReducer, 
            configReducer, 
            enableSpinner,
            setToken, 
            setUserSession, 
            setRememberUser, 
            setRole, 
            shoppingCartReducer: {getShoppingCart,items},
            notificationReducer: {showAlert},
            sessionReducer
        } = this.props;
        const {costumers,salesPerson} = this.state;
        let costumer = document.getElementById('toggleCostumer');
        costumer = costumer.options[costumer.selectedIndex].value;
        
        if(sessionReducer.user.CardCode === 'C2029' || sessionReducer.user.CardCode === 'C4192'){
            if(items.length >= 1 ){
                $('#saveCartModal').modal('show');
                return;
            }
            await apiClient.liberarCliente(sessionReducer.user.CardCode);
        }
        let correoCliente = costumers[costumer].CardCode;
        let passwordCliente = costumers[costumer].U_FMB_Handel_Pass;
        
        if(correoCliente === null || passwordCliente === null){
            showAlert({type: 'error', message: "Aviso: "+'El cliente seleccionado no tiene un correo registrado.'})
            return;
        }

        let user = {
            email: costumers[costumer].CardCode,
            password: costumers[costumer].U_FMB_Handel_Pass,
            salesPerson : salesPerson,
        };
        
        let vendedor = {
            salesPerson: costumers[costumer].SlpCode,
            firstName: costumers[costumer].firstName,
            lastName: costumers[costumer].lastName
        };
        
        let response = await apiClient.login(user);
        if(response.status === 0){
            return;
        }

        if(response.data.clienteUniversal !== '' && response.data.clienteUniversal !== '[]'){            
            showAlert({type: 'error', message: "El cliente universal esta ocupado por el vendedor "+response.data.clienteUniversal+", espera a que concluya su compra.", timeOut: 8000})
            return;
        }

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

            let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');
            let responsesd = await apiClient.updateShoppingCartLocal(JSON.parse(localShoppingCart));

            localStorage.removeItem(config.general.localStorageNamed + 'shoppingCart');

            enableSpinner(false);
            setTimeout(()=> {
                getShoppingCart();
                if(responsesd.data.value > 0){
                    configReducer.history.goShoppingCart();
                }else{
                    configReducer.history.goHome();
                    window.location.reload();
                }
            },50);
            
            return;
        }
    };
    //Abrir ordenes 
    openOrder = async docEntry => {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        enableSpinner(true);
        let response = await apiClient.getOrder(docEntry);
        enableSpinner(false);

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            this.setState({
                order: response.data,
            });

            $('#orderDetailsModal').modal('show');
            return;
        }

        showAlert({type: 'error', message: "Aviso: "+response.message})
    };
    //Esatdo del documento 
    docChangeName(status){
        let result = '';
        switch (status) {
            case 'O':
                result = "Abierto";
                break;
            case 'C':
                result = "Cerrado";
                break;
            default:
                break;
        }
        return result;
    };
    //Estado del pedico 
    docChangeNameFMB(status){
        let result = '';
        switch (status) {
            case '0':
                result = "Sin Atención";
                break;
            case '1':
                result = "Atendido";
                break;
            case '2':
                result = "Facturado";
                break;
            default:
                break;
        }
        return result;
    };

    async buscarCliente(event){
        const {salesPerson, U_CAT, empID} = this.state;
        let buscare = event.target.value;
        await apiClient.listClient(salesPerson && U_CAT ? empID : salesPerson, buscare, U_CAT).then(result => {
            let list = result.data.list;
            this.setState({
                costumers: list,
                buscar: buscare
            });
        });
    };

    clientToSeller(){
        const {costumers, orders, order, buscar} = this.state;
        return (
            <div>
                <h2>Mis clientes</h2>
                <div className="row">
                    <div className="col-md-8">
                        
                        <select id="toggleCostumer" className="form-control" disabled>
                            {!buscar && <option>Busca y selecciona un cliente</option> }                       
                            {costumers.map((costumer, index) => {
                                return (
                                    <option key={index} value={index}>
                                        {costumer.CardCode}.- {costumer.CardName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <input
                            id="searchClientes"
                            type="text"
                            className="form-control"
                            placeholder="Buscar"
                            //value={this.state.buscar}
                            onChange={this.buscarCliente}
                            //onKeyDown={event => event.keyCode === 13 && this.toggleCostumer() }
                            />
                    </div>
                    <div className="col-md-2">
                        <button
                            className="btn"
                            type="button"
                            style={{ backgroundColor: config.navBar.iconBackground, color: config.navBar.iconModal }}
                            onClick={() => this.toggleCostumer()}>
                            <strong>Seleccionar</strong>
                        </button>
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col-md-12">
                        <OrderDetailsModal order={order}/>
                        <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>
                            <div className="col-md-12">
                                <h3>Pedidos</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <table id="tablaOrderSeller" className="table table-striped">
                                    <thead>
                                        <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white"}}>
                                            <th scope="col">No. de pedido</th>
                                            <th scope="col">Fecha de creación</th>
                                            <th scope="col">Dirección de entrega</th>
                                            <th scope="col">Estado del documento</th>
                                            <th scope="col">Estado del pedido</th>
                                            <th scope="col">Valor total</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order, index) => {
                                            return (<tr key={index}>
                                                <th scope="row">{order.DocNum}</th>
                                                <td>{moment(order.TaxDate).utc().format('DD-MM-YYYY')}</td>
                                                <td>{order.Address2}</td>
                                                <td>{this.docChangeName(order.DocStatus)}</td>
                                                <td>{this.docChangeNameFMB(order.U_FMB_Handel_Status)}</td>
                                                <td className="text-right">
                                                    <CurrencyFormat 
                                                        value={order.DocTotal} 
                                                        displayType={'text'} 
                                                        thousandSeparator={'.'}
                                                        decimalSeparator={','}
                                                        prefix={config.general.currency}>
                                                    </CurrencyFormat>
                                                </td>
                                                <td>
                                                    <span onClick={() => this.openOrder(order.DocEntry)}>
                                                        <i className={config.icons.detail} style={{color: config.shoppingList.summaryList, paddingRight: 6}}></i>
                                                        Detalle
                                                    </span>
                                                </td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        );

    };
    // async search(){
    search = async( page = 0)=>{
        const {pageNumber} = this.state;
        let costumer = document.getElementById('searchCliente');
        costumer = costumer.value;
        page = page === 1 || page === 0 ? 0 : ((page - 1) * 10);
        // let responseSeller = 
        await apiClient.searchClient(costumer,page || pageNumber).then(result => {   
            let list = result.data.list;
            let totalRows =  result.data.totalRows;
            this.setState({
                listCostumers: list,
                totalRows
            });
            $('#tablacliente').DataTable({
                "paging": false,
                "info": false,
                "searching": false
            });
        });
    };
    hadleChange(event){
        this.setState({
            buscarLike: event.target.value
        });
    };

    // onPageChanged = async data => {
    //     const {itemsReducer} = this.props;
    //     const { currentPage,nextPage, totalPages} = data;
    //     await itemsReducer.search(nextPage);
    //     this.setState({ currentPage, totalPages });
    // }


    searchClient(){
        const {listCostumers,totalRows} = this.state;
        return (
            <div>
                <div>
                    <h2 style={{fontWeight:" bolder",
  fontSize:"2.5rem !important" }}>Buscar un cliente</h2>
                    <div className="row">
                        <div className="col-md-8 pb-2">
                            <input
                                id="searchCliente"
                                type="text"
                                className="form-control"
                                placeholder="Ingrese nombre del cliente"
                                value={this.state.buscarLike}
                                onChange={this.hadleChange}
                                onKeyDown={event => event.keyCode === 13 && this.search() }
                                />
                        </div>
                        <div className="col-md-4 ">
                            <button
                                className="btn"
                                type="button"
                                style={{ backgroundColor: '#0060EA', color: config.navBar.iconModal }}
                                onClick={() => this.search()}>
                                <strong>Buscar</strong>
                            </button>
                        </div>
                    </div>
                    <div className="row pt-2 pb-2" >
                        <div className="table-responsive" style={{ height: 400, maxHeight: 400, overflow: 'auto'}}>
                            <table id="tablaQuotation" className="table table-hover scrolltable">
                        {/* <div className="table" >
                            <table id="tablaQuotation" className="table table-hover"> */}
                                <thead style={{textAlign: "-webkit-center"}}>
                                    <tr style={{backgroundColor: '#0060EA', color: "white"}}>
                                        <th scope="col"></th>
                                        <th scope="col">No. Cliente</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Direccion</th>
                                        <th scope="col">Número</th>
                                        <th scope="col">Vendedor</th>
                                        {/* <th scope="col"></th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {!!listCostumers && listCostumers.map((costumer, index) => {
                                        //console.log("valor de index",index);
                                        return (<tr key={index}>
                                            <td className="text-center">
                                                <input id="posCliente" type="hidden" value={index}/>
                                                <button
                                                    className="btn"
                                                    type="button"
                                                    style={{ backgroundColor: '#0060EA', color: config.navBar.iconModal }}
                                                    onClick={() => this.selectClient(index)}>
                                                    <span>
                                                        <i className={config.icons.select} style={{color: config.navBar.iconColor2}}/>
                                                    </span>
                                                </button>
                                            </td>
                                            <th className="text-center" scope="row">{costumer.CardCode}</th>
                                            <td className="text-center">{costumer.CardName}</td>
                                            <td className="text-center">{costumer.Address}</td>
                                            <td className="text-center">{costumer.Phone}</td>
                                            <td className="text-center">{costumer.firstName+' '+costumer.lastName}</td>
                                            {/* <td>
                                                <input id="posCliente" type="hidden" value={index}/>
                                                <button
                                                    className="btn"
                                                    type="button"
                                                    style={{ backgroundColor: config.navBar.iconBackground, color: config.navBar.iconModal }}
                                                    onClick={() => this.selectClient(index)}>
                                                    <span>
                                                        <i className={config.icons.select} style={{color: config.navBar.iconColor}}/>
                                                    </span>
                                                </button>
                                            </td> */}
                                        </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div >
                    <Pagination
                    refresh ={this.search}
                    totalRowsRefresh = {totalRows}/>
            
                </div>

                {/* <div class="row">
                    <div className="col-sm">
                    </div>
                    <div className="row justify-content-center col-sm">
                        <Paginations totalRecords={totalRows} pageLimit={10} pageNeighbours={1} onPageChanged={this.onPageChanged}/>
                    </div>
                    <div className="row justify-content-right col-sm">
                        { currentPage && (
                            <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                            Página <span className="font-weight-bold">{ currentPage }</span> / <span className="font-weight-bold">{  Math.ceil(totalRows/10)}</span>
                            </span>
                        ) }
                    </div>
                </div> */}
            </div>
        );
    };

    SaveCart = async (response = null) => {
        const {shoppingCartReducer: {items}, notificationReducer: {showAlert}, itemsReducer: { deleteShoppingCart }, setUser, sessionReducer: { user }} = this.props;
        const {valor} = this.state;
        let creatorUser = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
        if(response === 2){                     
            let data = {
                shoppingCart : items,
                createCard : creatorUser.U_FMB_Handel_Perfil !== '0' ? creatorUser.salesPrson : 'B2B',
            };
            
            let apiResponse = await apiClient.createSavedCart(data);
    
            if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
                deleteShoppingCart({ item: {}, deleteAll: true });
                localStorage.removeItem(config.general.localStorageNamed + 'CurrentUser');
                setUser({});
                await apiClient.liberarCliente(user.CardCode);
                this.toggleCostumer();
            }
        }else if(response !== 2 && response !== 4){
            let data = {
                shoppingCart : items,
                createCard : creatorUser.U_FMB_Handel_Perfil !== '0' ? creatorUser.salesPrson : 'B2B',
            };
            
            let apiResponse = await apiClient.createSavedCart(data);
    
            if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
                deleteShoppingCart({ item: {}, deleteAll: true });
                localStorage.removeItem(config.general.localStorageNamed + 'CurrentUser');
                setUser({});
                await apiClient.liberarCliente(user.CardCode);
                this.selectClient(valor);
            }
        }
        else{
            deleteShoppingCart({ item: {}, deleteAll: true });
            localStorage.removeItem(config.general.localStorageNamed + 'CurrentUser');
            setUser({});
            setTimeout(async()=> {
                let respuesta = await apiClient.liberarCliente(user.CardCode);
                if(respuesta.status  === SERVICE_RESPONSE.SUCCESS){
                    showAlert({type: 'success', message: "Aviso: "+respuesta.message})
                    if(creatorUser.U_FMB_Handel_Perfil !== 2 && creatorUser.U_FMB_Handel_Perfil !== 4){
                        this.selectClient(valor);
                    }else{
                        this.toggleCostumer();
                    }
                }else{
                    showAlert({type: 'error', message: "Error al liberar el cliente universal."})
                }
            },500);
        }
    }

    selectClient = async (valor) => {
        const {
            loginReducer, 
            configReducer, 
            enableSpinner,
            setToken, 
            setUserSession, 
            setRememberUser, 
            setRole, 
            shoppingCartReducer: {getShoppingCart,items},
            notificationReducer: {showAlert},
            sessionReducer
        } = this.props;
        const {listCostumers,salesPerson} = this.state;
        //console.log("Valor de la seleccion",valor);

        if(sessionReducer.user.CardCode === 'C2029' || sessionReducer.user.CardCode === 'C4192'){
            if(items.length >= 1 ){
                $('#saveCartModal').modal('show');
                this.setState({
                    valor
                });
                return;
            }
            await apiClient.liberarCliente(sessionReducer.user.CardCode);
        }
        let correoCliente = listCostumers[valor].CardCode;
        let passwordCliente = listCostumers[valor].U_FMB_Handel_Pass;
        
        if(correoCliente === null || passwordCliente === null){
            showAlert({type: 'error', message: "Aviso: "+'El cliente seleccionado no tiene un correo registrado.'})
            return;
        }

        let user = {
            email: listCostumers[valor].CardCode,
            password: listCostumers[valor].U_FMB_Handel_Pass,
            salesPerson : salesPerson,
        };
        //console.log("valores userio seleccionado",listCostumers[valor]);
        let vendedor = {
            salesPerson: listCostumers[valor].SlpCode,
            firstName: listCostumers[valor].firstName,
            lastName: listCostumers[valor].lastName
        };
        
        //console.log("usuario login",user);
        enableSpinner(true);
        let response = await apiClient.login(user);
        
        if(response.status === 0){
            showAlert({type: 'error', message: "Aviso: "+'La cuenta no existe.'})
            enableSpinner(false);
            return;
        }

        if(response.data.clienteUniversal !== '' && response.data.clienteUniversal !== '[]'){            
            showAlert({type: 'error', message: "El cliente universal esta ocupado por el vendedor "+response.data.clienteUniversal+", espera a que concluya su compra.", timeOut: 8000})
            enableSpinner(false);
            return;
        }
        
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

            let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');
            let responsesd = await apiClient.updateShoppingCartLocal(JSON.parse(localShoppingCart));

            localStorage.removeItem(config.general.localStorageNamed + 'shoppingCart');

            enableSpinner(false);
            setTimeout(()=> {
                getShoppingCart();
                if(responsesd.data.value > 0){
                    configReducer.history.goShoppingCart();
                }else{
                    configReducer.history.goHome();
                    window.location.reload(true)
                }
            },50);
            
            return;
        }
    };

    render() {
        const {history} = this.props;
        const {costumers,empleado} = this.state;
        //console.log("Clientes",costumers);
        return (
            <div className="content-fluid" style={{marginTop: 150, paddingBottom: 20,paddingRight:0, backgroundColor: config.Back.backgroundColor}}>
                <Session history={history} view={VIEW_NAME.CONTACT_US_VIEW}/>
                <NavBar/>
                <SaveCartModal
                SaveCart = {this.SaveCart}
                empleado = {empleado}
                />
                <div className="container mb-4 margenSelector">
                    {empleado === 2
                    ?this.clientToSeller()
                    :this.searchClient()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        loginReducer: store.LoginReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
        shoppingCartReducer: store.ShoppingCartReducer,
        sessionReducer: store.SessionReducer,
        itemsReducer: store.ItemsReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setUser: value => dispatch({type: DISPATCH_ID.LOGIN_SET_USER, value}),
        setPassword: value => dispatch({type: DISPATCH_ID.LOGIN_SET_PASSWORD, value}),
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        setRole: value => dispatch({type: DISPATCH_ID.SESSION_SET_ROLE, value}),
        setToken: value => dispatch({type: DISPATCH_ID.SESSION_SET_TOKEN, value}),
        setRememberUser: value =>  dispatch({type: DISPATCH_ID.SESSION_SET_REMEMBER_USER, value}),
        setUserSession: value => dispatch({type: DISPATCH_ID.SESSION_SET_USER, value}),
        cleanLoginReducer: value => dispatch({type: DISPATCH_ID.LOGIN_CLEAN_REDUCER, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Selector);