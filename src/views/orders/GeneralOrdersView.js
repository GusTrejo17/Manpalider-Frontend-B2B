import React, {Component} from 'react';
import { GeneralOrderDetailsModal} from "../../components";
import {DISPATCH_ID,config, SERVICE_RESPONSE,SERVICE_API} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import moment from 'moment';
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';
import './OrdersView.css';
import ExportReportGeneral from '../../components/ExportReportGeneral';
require('datatables.net-bs4');

const apiClient = ApiClient.getInstance();

class GeneralOrdersView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            order: {
                header: {},
                body: []
            },
            guia:[] 
        };
        this.table = null;
    }

    componentDidMount() {
        this.fillDataGeneralOrders();
    }

    fillDataGeneralOrders = () => {
        const {enableSpinner,data} = this.props;
        this.table = $('#tablaGeneralOrders').DataTable({
            "paging": true,
            "info": false,
            "searching": false,
            "order": [[ 2, 'desc' ]],
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

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.props.orders != nextProps.orders) {
            //console.log("hay nuevos datos");
            this.table.destroy();
            this.table = null;
        }
        return true;
    }
    componentDidUpdate(): void {
        if (this.table == null) {
            this.fillDataGeneralOrders();
        }
    }

    docChangeName(status){
        let result = '';
        switch (status) {
            case 'O':
                result = 'Abierto';
                break;
            case 'C':
                result = 'Cerrado';
                break;
            case '13':
                result = "Factura";
                break;
            case '24':
                result = "Pago";
                break;
            default:
                break;
        }
        return result;
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

            $('#generalOrderDetailsModal').modal('show');
            return;
        }

        showAlert({ type: 'error', message: response.message })
    };

    docChangeNameFMB(target,base){
        let result = '';
        let response = target !== -1 ? target : base
        
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

    render() {
        const {order,guia} = this.state;
        const { orders,getData,handleInputDateInicio, handleInputDateFinal, fechaFinal,fechaInicio, fechamin, fechamax, isLoaded, inputDocNum,oneOrder, docsToPrint, enableSpinner, docsToPrintCopy, changeDocsToPrint, changeDocsToPrintCopy}  = this.props;

        return (
            <div className="content-fluid" style={{backgroundColor: config.Back.backgroundColor}}>
                 <GeneralOrderDetailsModal order={order} guia={guia}/>
                <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>
                    <div className="col-md-12 pb-2">
                        <h3 style={{fontWeight:"bolder",fontSize:"2.5rem", color:"black"}}>PEDIDOS GENERALES</h3>
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

                                <button type="button" className="searchButton" onClick={()=> oneOrder.trim() !== '' && getData(9)}> 
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
                            value = {!isLoaded ? fechamin : fechaInicio}
                            onChange = {(event) => handleInputDateInicio(event)}/>
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
                            onChange = {(event) => handleInputDateFinal(event)}/>
                    </div>
                    <div className="col-md-2 pb-2">
                        <button
                            onClick={()=>getData(8)}
                            className="btn botonResumen" 
                            style={{
                                backgroundColor: config.Back.color,
                                color: config.navBar.textColor2,
                                fontWeight: "bold",
                            }}>
                            Ver resumen
                        </button>
                    </div>
                </div>
                <div className="row">
                <div className="col-md-12 table-responsive tableReports">
                    <div className="ml-1">
                        {docsToPrint.length > 0 &&
                            <ExportReportGeneral
                                data={docsToPrint}
                                typeDocs={"generalOrders"}
                                enableSpinner={enableSpinner}
                                general={docsToPrintCopy}
                            />
                        }
                    </div>
                    <table id="tablaGeneralOrders" className="table table-striped scrolltable">
                        <thead style={{textAlign: "-webkit-center"}}>
                            <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white", fontSize:"1rem"}}>
                                <th scope="col-lg-auto"></th>
                                <th scope="col-lg-auto">Fecha de creación</th>
                                <th scope="col-lg-auto">Código del cliente</th>
                                <th scope="col-lg-auto">Nombre del cliente</th>
                                <th scope="col-lg-1">No. de pedido</th>
                                <th scope="col-lg-1">Dirección de entrega</th>
                                <th scope="col-lg-1">Estado del documento</th>
                                <th scope="col-lg-1">Estado del pedido</th>
                                <th scope="col-lg-1">Unidades pedidas</th>
                                <th scope="col-lg-1">Unidades surtidas</th>
                                <th scope="col-lg-1">Unidades faltantes</th>
                                <th scope="col-lg-1">Guía cargada</th>
                                <th scope="col-lg-1">Orden de compra</th>
                                <th scope="col-lg-1">Valor total</th>
                                <th scope="col-lg-1"></th>
                            </tr>
                        </thead>
                        <tbody style={{textAlign: "-webkit-center"}}>
                            {orders.map((order, index) => {
                                // console.log("conF orderGeneral", order);
                                return (<tr key={index}>
                                    <th scope="col-lg-auto row" style={{ fontSize: "1rem", width: '250px' }}>
                                        <div class="form-check" style={{ minWidth: "70px" }}>
                                            <input class="form-check-input" type="checkbox" value={order.DocEntry} onChange={(event) => { changeDocsToPrint(event.nativeEvent.target.value); changeDocsToPrintCopy(order) }} id="generalToPrint" />
                                        </div>
                                    </th>
                                    <th scope="col-lg-auto row" style={{fontSize:"1rem", width: '250px'}}>{moment(order.TaxDate).utc().format('YYYY-MM-DD')}</th>
                                    <td className="col-lg-auto" style={{fontSize:"1rem", width: '250px'}}>{order.CardCode}</td>
                                    <td className="col-lg-auto" style={{fontSize:"1rem", width: '250px'}}>{order.CardName}</td>
                                    <td className="col-lg-auto" style={{fontSize:"1rem", width: '250px'}}>{order.DocNum}</td>
                                    <td className="col-auto campo-direccion" style={{fontSize:"1rem", width: '250px'}}>{order.Address2}</td>
                                    <td className="col-lg-auto" style={{fontSize:"1rem", width: '250px'}}>{this.docChangeName(order.DocStatus)}</td>
                                    <td className="col-lg-auto" style={{fontSize:"1rem", width: '250px'}}>{this.docChangeNameFMB(order.TargetType, order.BaseType)}</td>
                                    <td className="col-lg-auto text-center" style={{fontSize:"1rem", width: '200px'}}>{parseInt(order.Cant)}</td>
                                    <td className="col-lg-auto text-center" style={{fontSize:"1rem", width: '200px'}}>{parseInt(order.Cant) - parseInt(order.Unit)}</td>
                                    <td className="col-lg-auto text-center" style={{fontSize:"1rem", width: '200px', color:'red'}}>{parseInt(order.Unit)}</td>
                                    {/* <td className="col-lg-auto" style={{fontSize:"1rem", width: '250px'}}>{order.DelivrdQty != null ? parseInt(order.DelivrdQty) : 'Sin registro'}</td>
                                    <td className="col-lg-auto" style={{fontSize:"1rem", width: '250px'}}>{order.OpenQty != null ? parseInt(order.OpenQty) : 'Sin registro'}</td> */}
                                    <td className="col-lg-auto" style={{fontSize:"1rem", width: '250px'}}>{order.U_TipoarticuloOV || ''}</td>
                                    <td className="col-lg-auto" style={{fontSize:"1rem", width: '250px'}}>
                                        <a href={`${config.BASE_URL}/${SERVICE_API.getOrderspdf}/${order.DownloadOrderPDF}`} target="_blank" style={{fontSize:"1rem"}} hidden={order.DownloadOrderPDF ? false : true}>
                                            <span style={{ color: config.footer.iconColor}}>{order.U_NumOC ? order.U_NumOC : 'SN'}<img src="https://cdn-icons-png.flaticon.com/512/3997/3997593.png" style={{ maxHeight: 20 }}></img></span>
                                        </a>
                                    </td>
                                    <td className="col-lg-auto" style={{fontSize:"1rem", width: '250px'}}>
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
                                    <td className="col-lg-auto" style={{fontSize:"1rem", width: '250px'}}>
                                        <span onClick={() => this.openOrder(order.DocEntry)}>
                                            <i className={config.icons.detail} style={{ fontSize:"1rem", color: config.Back.color, paddingRight: 6 }}></i>
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
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GeneralOrdersView);