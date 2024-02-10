import React, {Component} from 'react';
import {Footer, NavBar, Session} from "../../components";
import {DISPATCH_ID, VIEW_NAME, config, SERVICE_RESPONSE,ROLES } from "../../libs/utils/Const";
import OrdersSellerView from '../orders/OrderSellerView';
import {connect} from 'react-redux';
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {Modal} from '../../components/index';
import $ from 'jquery';
import {OrderDetailsModal} from "../../components";
import CurrencyFormat from 'react-currency-format';
import moment from 'moment';
import { animateScroll as scroll, scroller } from 'react-scroll';

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
            fechaInicio: '',
            fechaFinal: '',
        };
        this.hadleChange = this.hadleChange.bind(this);
        this.table = null;
        this.scrollToBottom = this.scrollToBottom.bind(this);
    };
    async componentDidMount(){
        const {enableSpinner} = this.props;
        let fechaInicio = moment(new Date()).format('YYYY-MM-DD');
        let fechaFinal = moment(new Date()).format('YYYY-MM-DD');
        this.createDataTable(); 
        this.setState({
            fechaInicio,
            fechaFinal
        });
        enableSpinner(true);
        setTimeout(async  () => {
            await this.fillList();
            await this.fillOrder();
        },300);
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

    createDataTable = ()=>{
      this.table =  $('#tablaOrderSeller').DataTable({
            "paging": true,
            "info": false,
            "searching": false,
            "order": [[ 0, 'desc' ]],
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

    //Lista de los clientes del vendedor
    async fillList (){
        let empID  = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
        this.setState({
            empleado: empID.U_FMB_Handel_Perfil
        });
        await apiClient.listClient(empID.salesPrson).then(result => {
            let list = result.data.list;
            this.setState({
                costumers: list
            });
        });
    };
    //Cargar los pedidos por entrega
    async fillOrder (){
        const  {fechaInicio,fechaFinal} = this.state;
        let partner = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
        let data = {
            partner : partner.salesPrson,
            fechaInicio,
            fechaFinal
        }
        await apiClient.getOrdersSeller(data).then( response => {
            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                this.setState({
                    orders: response.data || [],
                });
               
            }
        });
    };

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.state.orders != nextState.orders) {
            //console.log("hay nuevos datos");
            this.table.destroy();
            this.table = null;
        }
        return true;
    }
    componentDidUpdate(): void {
        if (this.table == null) {
            this.createDataTable();
        }
    }

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
            shoppingCartReducer: {getShoppingCart},
            notificationReducer: {showAlert}
        } = this.props;
        const {costumers} = this.state;

        let costumer = document.getElementById('toggleCostumer');
        costumer = costumer.options[costumer.selectedIndex].value;
        //console.log(costumer);
        let user = {
            email: costumers[costumer].U_FMB_Handel_Email,
            password: costumers[costumer].U_FMB_Handel_Pass,
        };
        let vendedor = {
            salesPerson: costumers[costumer].SlpCode,
            firstName: costumers[costumer].firstName,
            lastName: costumers[costumer].lastName,
            serFac: costumers[costumer].U_SYP_SERFAC,
            serBol: costumers[costumer].U_SYP_SERBOL,
        };
        //console.log(user);
        enableSpinner(true);
        let response = await apiClient.login(user);
        if(response.type === 1){
            showAlert({type: 'warning', message: ' La cuenta no existe ', timeOut: 8000});
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

        showAlert({type: 'error', message: response.message})
    };
    //Esatdo del docuemnto 
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



    clientToSeller(){
        const {costumers,orders,order, fechaFinal,fechaInicio} = this.state;
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <OrderDetailsModal order={order}/>
                       <div className="row text-center" style={{marginBottom: 16, marginTop: 20}}>
                            <div className="col-md-12 mt-4">
                                <h2>Mis entregas</h2>
                            </div>
                        </div><br/>
                        <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>
                    <div className=" row col-md-4">
                    <h4 className="pr-2">Desde:</h4>
                        <input 
                            id="fechaInicio"
                            type="date" 
                            className="form-control col-md-6" 
                            name="fechauno" 
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
                            value = {fechaFinal}
                            onChange = {(event) => this.handleInputDateFinal(event)}/>
                    </div>
                    <div className="col-md-2">
                        <button
                            onClick={()=>this.fillOrder()}
                            className="btn botonResumen" 
                            style={{
                                backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                color: config.navBar.textColor2,
                                fontWeight: "bold",
                            }}>
                            Ver entregas
                        </button>
                    </div>
                </div>
                        <div className="row">
                            <div className="col-md-12 table-responsive">
                                <table id="tablaOrderSeller" className="table table-striped">
                                    <thead style={{textAlign: "-webkit-center"}}>
                                        <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white"}}>
                                            <th scope="col">Fecha de creación</th>
                                            <th scope="col">No. de pedido</th>
                                            <th scope="col">Cliente</th>
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
                                                <th scope="row">{moment(order.TaxDate).format('YYYY-MM-DD')}</th>
                                                <th scope="row">{order.DocNum}</th>
                                                <th scope="row">{order.CardName}</th>
                                                <td>{order.Address2}</td>
                                                <td>{this.docChangeName(order.DocStatus)}</td>
                                                <td>{this.docChangeNameFMB(order.U_FMB_Handel_Status)}</td>
                                                <td className="text-right">
                                                    <CurrencyFormat 
                                                        value={order.DocTotal} 
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        fixedDecimalScale={true} 
                                                        decimalScale={2} 
                                                        prefix={'$ '}
                                                        suffix={config.general.currency}>
                                                    </CurrencyFormat>
                                                </td>
                                                <td>
                                                    <span onClick={() => this.openOrder(order.DocEntry)}>
                                                        <i className={config.icons.detail} style={{color: '#0060EA', paddingRight: 6}}></i>
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
                </div>
            </div>
        );

    };
    async search(){
        let costumer = document.getElementById('searchCliente');
        costumer = costumer.value;
        //console.log("Buscar como",costumer);
        await apiClient.searchClient(costumer).then(result => {
            let list = result.data.list;
            //console.log("list to resukt",list);
            this.setState({
                listCostumers: list
            });
            $('#tablacliente').DataTable({
                "paging": false,
                "info": false,
                "searching": false,
                "retrieve": true,
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
        });
    };
    hadleChange(event){
        this.setState({
            buscarLike: event.target.value
        });
    };
    searchClient(){
        const {listCostumers} = this.state;
        return (
            <div>
                <h2>Buscar un cliente</h2>
                <div className="row">
                    <div className="col-md-6">
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
                    <div className="col-md-4">
                        <button
                            className="btn"
                            type="button"
                            style={{ backgroundColor: config.navBar.iconBackground, color: config.navBar.iconModal }}
                            onClick={() => this.search()}>
                            <strong>Buscar</strong>
                        </button>
                    </div>
                    <div className="col-md-2">
                        <button
                            className="btn"
                            type="button"
                            style={{ backgroundColor: config.navBar.iconBackground, color: config.navBar.iconModal }}
                            onClick={() => { modal.loginRegisterModal('show') }}>
                            <strong>Registra socio</strong>
                        </button>
                    </div>
                </div>
                <div className="row pt-2">
                    <div className="col-md-12">
                        <table id="tablacliente" className="table table-striped">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white"}}>
                                    <th scope="col">CardCode</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Direccion</th>
                                    <th scope="col">Número</th>
                                    <th scope="col">Vendedor</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {listCostumers && listCostumers.map((costumer, index) => {
                                    //console.log("valor de index",index);
                                    return (<tr key={index}>
                                        <th scope="row">{costumer.CardCode}</th>
                                        <td>{costumer.CardName}</td>
                                        <td>{costumer.Address}</td>
                                        <td>{costumer.Phone}</td>
                                        <td>{costumer.firstName+' '+costumer.lastName}</td>
                                        <td>
                                            <input id="posCliente" type="hidden" value={index}/>
                                            <button
                                                className="btn"
                                                type="button"
                                                style={{ backgroundColor: config.navBar.iconBackground, color: config.navBar.iconModal }}
                                                onClick={() => this.selectClient(index)}>
                                                Seleccionar
                                            </button>
                                        </td>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };
    selectClient = async (valor) => {
        const {
            loginReducer, 
            configReducer, 
            enableSpinner,
            setToken, 
            setUserSession, 
            setRememberUser, 
            setRole, 
            shoppingCartReducer: {getShoppingCart}
        } = this.props;
        const {listCostumers} = this.state;
        const { notificationReducer: {showAlert} } = this.props;
        //console.log("Valor de la seleccion",valor);
        let user = {
            email: listCostumers[valor].U_FMB_Handel_Email,
            password: listCostumers[valor].U_FMB_Handel_Pass,
        };
        //console.log("valores userio seleccionado",listCostumers[valor]);
        let vendedor = {
            salesPerson: listCostumers[valor].SlpCode,
            firstName: listCostumers[valor].firstName,
            lastName: listCostumers[valor].lastName,
        };
        // console.log("usuario login",user);
        enableSpinner(true);
        let response = await apiClient.login(user);
        if(response.type === 1){
            showAlert({type: 'warning', message: ' La cuenta no existe ', timeOut: 8000});
            return;
        }
        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            // console.log("valores usuario",response);
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
            <div className="content-fluid" style={{marginTop: 150, backgroundColor: config.Back.backgroundColor}}>
                <Session history={history} view={VIEW_NAME.CONTACT_US_VIEW}/>
                <NavBar/>
                <div style={{paddingTop: 40, paddingBottom: 140}}>
                    {this.clientToSeller()}
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
        shoppingCartReducer: store.ShoppingCartReducer
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