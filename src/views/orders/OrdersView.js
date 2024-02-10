import React, {Component} from 'react';
import {Session, OrderDetailsModal} from "../../components";
import {DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE, VIEW_NAME, config} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import moment from 'moment';
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';
import "./OrdersView.css";
import { animateScroll as scroll, scroller } from 'react-scroll';
import ExportReportGeneral from '../../components/ExportReportGeneral';

require('datatables.net-bs4');

const apiClient = ApiClient.getInstance();

class OrdersView extends Component {
    constructor(props) {
        super(props);
        const f = new Date;
        const newDate = new Date(f.setMonth(f.getMonth() + +(-3)))
        this.state = {
            orders: [],
            order: {
                header: {},
                body: []
            },
            fechaInicio: '',
            fechaFinal: '',
            fechamin: moment(newDate).format('YYYY-MM-DD'),
            fechamax: moment(new Date()).format('YYYY-MM-DD'),
            isLoaded : false,
            guia: [],
            oneOrder: '',   // Numero de orden a buscar
            docsToPrint: [],
            selectAll: false
        };
        this.table = null;
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    // Se Manda a traer la funcion de definicion de tabla
    componentDidMount() {
        let fechaInicio = moment(new Date()).format('YYYY-MM-DD')
        let fechaFinal = moment(new Date()).format('YYYY-MM-DD')
        this.setState({
            fechaInicio,
            fechaFinal
        });
        // setTimeout(async  () => {
        //     await this.getData();
        // // },300);
        this.fillDataOrders();
        this.scrollToBottom();
    }

    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
    }

    // Se llena la tabla con la configuración
    fillDataOrders = () => {
        this.table =  $('#tablaOrder').DataTable({
            "paging": true,
            "info": false,
            "searching": false,
            //"bDestroy": true,	
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
    // Se vacia la tabla
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.props.orders != nextProps.orders) {
            //console.log("hay nuevos datos");
            this.table.destroy();
            this.table = null;
        }
        return true;
    }
    // se llena la tabla
    componentDidUpdate() {
        if (this.table == null) {
            this.fillDataOrders();
        }
    }

    // getData = async ()=>{
    //     const { fechaInicio,fechaFinal, fechamin } = this.state;
    //     const {enableSpinner, notificationReducer: {showAlert}} = this.props;
    //     enableSpinner(true);
    //     let response = await apiClient.getOrders(!this.state.isLoaded ? fechamin : fechaInicio,fechaFinal);
    //     enableSpinner(false);
    //     if (!Array.isArray(response.data)) {
    //         showAlert({type: 'error', message: 'Ocurrió un error al consultar la Información'});
    //         return;
    //     }

    //     if (response.data.length === 0) {
    //         showAlert({type: 'info', message: 'No hay Información por mostrar'});
    //         return;
    //     }
    //     // console.log("conF orders: ", response.data);
    //     for (let index = 0; index < response.data.length; index++) {
    //         const element = response.data[index];
    //         if(element.DownloadOrderPDF){
    //             let direccion = element.DownloadOrderPDF;
    //             let array = direccion.split('\\');
    //             let sinpunto = array[(array.length)-1].split('.');
    //             element.DownloadOrderPDF = sinpunto[0];
    //         }
    //     }

    //     this.setState({
    //         orders: response.data,
    //         oneOrder:''
    //     });
    // }

    // getOneData = async ()=>{
    //     const {oneOrder} = this.state;
    //     const {enableSpinner, notificationReducer: {showAlert}} = this.props;
    //     if(oneOrder === ''){
    //         showAlert({type: 'error', message: 'Escriba un No. de pedido', timeOut: 8000});
    //         return;
    //     }

    //     enableSpinner(true);
    //     let response = await apiClient.getOneOrder(oneOrder !== '' ? oneOrder : '');
    //     enableSpinner(false);

    //     if (!Array.isArray(response.data)) {
    //         showAlert({type: 'error', message: 'Ocurrió un error al consultar la Información'});
    //         this.setState({
    //             orders: [],
    //         });
    //         return;
    //     }

    //     if (response.data.length === 0) {
    //         showAlert({type: 'info', message: 'No hay Información por mostrar'});
    //         this.setState({
    //             orders: [],
    //         });
    //         return;
    //     }

    //     // console.log("conF orders: ", response.data);
    //     for (let index = 0; index < response.data.length; index++) {
    //         const element = response.data[index];
    //         if(element.DownloadOrderPDF){
    //             let direccion = element.DownloadOrderPDF;
    //             let array = direccion.split('\\');
    //             let sinpunto = array[(array.length)-1].split('.');
    //             element.DownloadOrderPDF = sinpunto[0];
    //         }
    //     }
    //     this.setState({
    //         orders: response.data,
    //     });
    // }

    //Evento para capturar los valores de los campos
    handelChange = ({ target }) => {
        const { name, value } = target;
        this.setState({
            [name]: value
        });
    };

    openOrder = async docEntry => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        enableSpinner(true);
        let response = await apiClient.getOrder(docEntry);
        enableSpinner(false);

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            this.setState({
                order: response.data,
                guia: response.data.statusGuia || [],
            });

            $('#orderDetailsModal').modal('show');
            return;
        }

        showAlert({ type: 'error', message: response.message })
    };

    handleInputDateInicio = event =>{
        let fechaInicio = event.nativeEvent.target.value;
        this.setState({
            isLoaded : true,
            fechaInicio
        });
    }
    handleInputDateFinal = event =>{
        let fechaFinal = event.nativeEvent.target.value;
        this.setState({
            fechaFinal
        });
    }

    // Actualiza valor de no. orden conF
    handleInputDocNum = event =>{
        let DocNum= event.nativeEvent.target.value;
        this.setState({
            oneOrder: DocNum
        });
    }

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

    docChangeNameFMB(target,base){
        let result = '';
        let response = target != -1 ? target : base
        
        switch (response) {
            // case 23:
            //     result = "Sin atender";
            //     break;
            case 17:
                result = "Atendido";
                break;
            case 15:
                result = "Surtido";
                break;
            case 13:
                result = "Facturado";
                break;
            default:
                result = 'Atendido';
                break;
        }
        return result;
    };

    // changeDocsToPrint(docEntry){
    //     const index = this.state.docsToPrint.indexOf(docEntry);
    //     if (index === -1) {
    //         this.setState({
    //             docToPrint: this.state.docsToPrint.push(docEntry)
    //         })
    //     }else{
    //         this.setState({
    //             docToPrint: this.state.docsToPrint.splice(index,1)
    //         })
    //     }
    //     // this.setState({
    //     //     docToPrint:[...this.state.docToPrint, docEntry]
    //     // })
    // }

    selectAllPage(){
        this.setState({
            selectAll: !this.state.selectAll
        })
    }

    render() {
        //const { orders, order, fechaInicio, fechaFinal, fechamin, fechamax, guia,oneOrder} = this.state;
        const {order, guia, fechaFinal,fechaInicio, fechamin, fechamax} = this.state;
        
        //const {inputDocNum, enableSpinner} = this.props;
        const { orders,getData, enableSpinner, docsToPrint, changeDocsToPrint, oneOrder, inputDocNum}  = this.props;
        // const { orders,getData,handleInputDateInicio, handleInputDateFinal, fechaFinal,fechaInicio}  = this.props;
        return (
            <div className="content-fluid" style={{backgroundColor: config.Back.backgroundColor}}>
                <OrderDetailsModal order={order} guia={guia}/>
                <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>
                    <div className="col-md-12 pb-2">
                        <h3  style={{fontWeight:"bolder",fontSize:"2.5rem", color:"black"}}>PEDIDOS</h3>
                    </div>
                </div>
                <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>


                    <div className="col-md-3 pb-2">
                        <div class="wrap " style={{marginBottom: "1%"}}>
                            <div class="search" style={{justifyContent: "center"}}>
                                <input
                                    id="inputSearch"
                                    className="form-control col-md-6 searchTerm" 
                                    type="text" 
                                    placeholder="No. de pedido"
                                    onChange = {(event) => inputDocNum(event)}
                                    value={oneOrder}
                                    disabled={docsToPrint.length!==0}
                                    // onBlur={this.onTextChanged}
                                    onKeyDown={event => event.keyCode === 13 && oneOrder.trim() !== '' && getData(9)}
                                />

                                <button type="button" className="searchButton" onClick={()=> oneOrder.trim() !== '' && getData(9)} disabled={docsToPrint.length!==0}>
                                    <i style={{fontSize: "1.3rem"}} className={config.icons.search}/>
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className=" row col-md-3">
                        <h4 className="pr-2">Desde:</h4>
                        <input 
                            id="fechaInicio"
                            type="date" 
                            className="form-control col-md-6" 
                            name="fechauno" 
                            // min={fechamin}
                            max={fechamax}
                            value = {!this.state.isLoaded ? fechamin : fechaInicio}
                            onChange = {(event) => this.handleInputDateInicio(event)}/>
                    </div>
                    <div className="row col-md-3 pb-3">
                        <h4 className="pr-2">Hasta:</h4>
                        <input 
                            id="FechaFin"
                            type="date" 
                            className="form-control col-md-6" 
                            name="fechados" 
                            // min={fechamin}
                            max={fechamax}
                            value = {fechaFinal}
                            onChange = {(event) => this.handleInputDateFinal(event)}/>
                    </div>
                    <div className="col-md-2 pb-2">
                        <button
                            onClick={()=> getData(11)}
                            className="btn botonResumen" 
                            style={{
                                backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                color: config.navBar.textColor2,
                                fontWeight: "bold",
                            }}>
                            Ver pedidos
                        </button>
                    </div>
                    
                    
                </div>
                <div className="row">
                    
                    <div className="col-md-12 table-responsive tableReports">
                        <div className="ml-1">
                            {(docsToPrint && docsToPrint.length > 0) &&
                                <ExportReportGeneral
                                    orders = {orders}
                                    data={docsToPrint}
                                    typeDocs={"orders"}
                                    enableSpinner={enableSpinner}
                                />
                            }
                        </div>
                        <table id="tablaOrder" className="table table-striped scrolltable">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white", fontSize:"1rem"}}>
                                    <th scope="col-lg-auto">
                                        {/* <div class="form-check" style={{minWidth: "70px"}}>
                                            <input class="form-check-input" type="checkbox" onChange={()=>this.selectAllPage()} id="ordersToPrintAll"/>                                               
                                        </div> */}
                                    </th>
                                    <th scope="col-lg-auto">Fecha de creación</th>
                                    <th scope="col-lg-1">No. de pedido</th>
                                    <th scope="col-lg-1">Dirección de entrega</th>
                                    <th scope="col-lg-1">Estado del documento</th>
                                    <th scope="col-lg-1">Estado del pedido</th>
                                    {/* <th scope="col-lg-1">Total peso neto</th>
                                    <th scope="col-lg-1">Total peso bruto</th> */}
                                    <th scope="col-lg-1">Unidades pedidas</th>
                                    <th scope="col-lg-1">Unidades surtidas</th>
                                    <th scope="col-lg-1">Unidades faltantes</th>
                                    {/* <th scope="col-lg-1">Cant. entregada</th>
                                    <th scope="col-lg-1">Cant. faltante</th> */}
                                    <th scope="col-lg-1">Tipo de Envío</th>
                                    <th scope="col-lg-1">N° de guía</th>
                                    <th scope="col-lg-1" className="text-center">Sujeto a backorder</th>
                                    <th scope="col-lg-1">Orden de compra</th>
                                    <th scope="col-lg-1">Valor total</th>
                                    <th scope="col-lg-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => {
                                    return (<tr key={index}>
                                        <td className="text-center">
                                            <div class="form-check" style={{minWidth: "70px"}}>
                                                <input class="form-check-input" type="checkbox" value={order.DocEntry} onChange={(event)=>changeDocsToPrint(event.nativeEvent.target.value)} id="ordersToPrint"/>                                               
                                            </div>
                                        </td>
                                        <th className="text-center" scope="col-lg-auto row" style={{fontSize:"1rem", width: '250px'}}>{moment(order.TaxDate).utc().format('YYYY-MM-DD')}</th>
                                        <td className="col-lg-auto text-center" style={{fontSize:"1rem", width: '250px'}}>{order.DocNum}</td>
                                        <td className="col-auto campo-direccion text-center" style={{fontSize:"1rem", width: '250px'}}>{order.Address2}</td>
                                        <td className="col-lg-auto text-center" style={{fontSize:"1rem", width: '250px'}}>{this.docChangeName(order.DocStatus)}</td>
                                        <td className="col-lg-auto text-center" style={{fontSize:"1rem", width: '250px'}}>{this.docChangeNameFMB(order.TargetType, order.BaseType)}</td>
                                        {/* <td className="col-lg-auto" style={{width: '250px'}}>{order.Weight1 === null ? '0 KG' : parseFloat(order.Weight1).toFixed(2)+ ' KG'}</td>
                                        <td className="col-lg-auto" style={{width: '250px'}}>{order.Weight2 === null ? '0 KG' : parseFloat(order.Weight2).toFixed(2)+ ' KG'}</td> */}
                                        <td className="col-lg-auto text-center" style={{fontSize:"1rem", width: '200px'}}>{parseInt(order.Cant)}</td>
                                        <td className="col-lg-auto text-center" style={{fontSize:"1rem", width: '200px'}}>{parseInt(order.Cant) - parseInt(order.Unit)}</td>
                                        <td className="col-lg-auto text-center" style={{fontSize:"1rem", width: '200px', color:'red'}}>{parseInt(order.Unit)}</td>
                                        {/* <td className="col-lg-auto" style={{fontSize:"1rem", width: '250px'}}>{order.DelivrdQty != null ? parseInt(order.DelivrdQty) : 'Sin registro'}</td>
                                        <td className="col-lg-auto" style={{fontSize:"1rem", width: '250px'}}>{order.OpenQty != null ? parseInt(order.OpenQty) : 'Sin registro'}</td> */}
                                        <td className="col-lg-auto text-center" style={{fontSize:"1rem", width: '250px'}}>{order.U_TipoEntrega ? order.U_TipoEntrega : '--'}</td>
                                        <td className="col-lg-auto text-center" style={{fontSize:"1rem", width: '250px'}}>{order.U_NumGuia ? order.U_NumGuia : '--'}</td>
                                        <td className="col-lg-auto text-center" style={{fontSize:"1rem", width: '250px'}}>{order.U_Resurtido ? order.U_Resurtido : '--' }</td>
                                        <td className="col-lg-auto text-center" style={{fontSize:"1rem", width: '250px'}}>
                                            <a href={`${config.BASE_URL}/${SERVICE_API.getOrderspdf}/${order.DownloadOrderPDF}`} target="_blank" style={{fontSize:"1rem"}} hidden={order.DownloadOrderPDF ? false : true}>
                                                <span style={{ color: config.footer.iconColor}}>{order.U_NumOC ? order.U_NumOC : 'SN'}<img src="https://cdn-icons-png.flaticon.com/512/3997/3997593.png" style={{ maxHeight: 20 }}></img></span>
                                            </a>
                                        </td>
                                        <td className="col-lg-auto text-center" style={{fontSize:"1rem", width: '250px'}}>
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
                                        <td className="col-lg-auto text-center" style={{fontSize:"1rem", width: '250px'}}>
                                            <span onClick={() => this.openOrder(order.DocEntry)}>
                                                <i className={config.icons.detail} style={{ fontSize:"1rem", color: '#0060EA', paddingRight: 6 }}></i>
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
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrdersView);