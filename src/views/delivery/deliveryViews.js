import React, {Component} from 'react';
import {Session, DeliveryDetailModel} from "../../components";
import {DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE, VIEW_NAME, config} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import moment from 'moment';
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';
import ExportReportGeneral from '../../components/ExportReportGeneral';

const apiClient = ApiClient.getInstance();

require('datatables.net-bs4');

class deliveryViews extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            orders: [],
            order: {
                header: {},
                body: []
            },
            guia: [],
            docsToPrint: [],
            selectAll: false
        };
        this.table = null;
    }

    async componentDidMount() {
        this.createDataTable();
    }
    // Se llena la tabla con la configuración
    createDataTable = () => {
        this.table =  $('#tablaDelivery').DataTable({
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

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.props.orders != nextProps.orders ||this.props.orders.length === 0 ) {
            this.table.destroy();
            this.table = null;
        }
        return true;
    }
    // se llena la tabla
    componentDidUpdate() {
        if (this.table == null) {
            this.createDataTable();
        }
    }

    openOrder = async docEntry => {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        enableSpinner(true);
        let response = await apiClient.getDataDelivery(docEntry);
        enableSpinner(false);

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            this.setState({
                order: response.data,
                guia: response.data.statusGuia || [],
            });

            $('#deliveryModal').modal('show');
            return;
        }

        showAlert({type: 'error', message: response.message})
    };

    docChangeName(status){
        let result = '';
        switch (status) {
            case 'O':
                result = "Abierta";
                break;
            case 'C':
                result = "Cerrada";
                break;
            default:
                break;
        }
        return result;
    };

    BaseType = (baseType)=>{
        let result = '';
        switch (baseType) {
            case 17:
                result = "Pedido";
                break;
            case 15:
                result = "Entrega";
                break;
            default:
                break;
        }
        return result
    };

    docChangeNameFMB(target,base){
        let result = '';
        let response = target != -1 ? target : base
        
        switch (response) {
        //     case 23:
        //         result = "Sin atender";
        //         break;
        //     case 17:
        //         result = "Atendido";
        //         break;
            case 15:
                result = "Surtido";
                break;
            case 13:
                result = "Facturado";
                break;
            default:
                result = 'Surtido';
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
        const {order, guia} = this.state;
        const { orders,getData,handleInputDateInicio, handleInputDateFinal, fechaFinal,fechaInicio, fechamin, fechamax, isLoaded, enableSpinner, docsToPrint, changeDocsToPrint}  = this.props;
        return (
            <div className="content-fluid" style={{backgroundColor: config.Back.backgroundColor}}>
                <DeliveryDetailModel order={order} guia={guia}/>
                <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>
                    <div className="col-md-12 pb-2">
                        <h3  style={{fontWeight:"bolder",fontSize:"2.5rem", color:"black"}}>ENTREGAS</h3>
                    </div>
                </div>
                <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>
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
                            onClick={()=>getData(6)}
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
                    <div className="col-md-12 table-responsive tableReports">
                        <div className="ml-1">
                            {docsToPrint.length > 0 &&
                                <ExportReportGeneral
                                    data={docsToPrint}
                                    typeDocs={"deliverys"}
                                    enableSpinner={enableSpinner}
                                />
                            }
                        </div>
                        <table id="tablaDelivery" className="table table-striped scrolltable">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white",fontSize:"1rem"}}>
                                    <th scope="col-lg-2" style={{width: '100px', maxWidth:'100px'}}></th>
                                    <th scope="col-lg-2" style={{width: '100px', maxWidth:'100px'}}>Fecha de creación</th>
                                    <th className="col-2" style={{width: '100px', maxWidth:'100px'}}>No. de entrega</th>
                                    {/* <th scope="col">Documento origen</th>
                                    <th scope="col">No. de relación</th> */}
                                    <th scope="col-lg-2" style={{width: '100px', maxWidth:'100px'}}>Estado</th>
                                    <th scope="col-lg-1" style={{width: '100px', maxWidth:'100px'}}>Estado del pedido</th>
                                    <th scope="col-lg-2" style={{width: '100px', maxWidth:'100px'}}>Valor total</th>
                                    <th scope="col-lg-2" style={{width: '100px', maxWidth:'100px'}}></th>
                                </tr>
                            </thead>
                            <tbody style={{textAlign: "-webkit-center"}}> 
                                {orders.map((order, index) => {
                                    return (
                                    <tr key={index}>
                                        <td className="text-center">
                                            <div class="form-check" style={{minWidth: "70px"}}>
                                                <input class="form-check-input" type="checkbox" value={order.DocEntry} onChange={(event)=>changeDocsToPrint(event.nativeEvent.target.value)} id="ordersToPrint"/>                                               
                                            </div>
                                        </td>
                                        <th scope="row" style={{width: '100px', maxWidth:'100px',fontSize:"1rem"}}>{moment(order.Fecha).utc().format('YYYY-MM-DD')}</th>
                                        <th style={{width: '100px', maxWidth:'100px',fontSize:"1rem"}}>{order.DocNum}</th>
                                        {/* <td>{this.BaseType(order.BaseType)}</td>
                                        <td>{order.BaseRef}</td> */}
                                        <td style={{width: '100px', maxWidth:'100px',fontSize:"1rem"}}>{this.docChangeName(order.DocStatus)}</td>
                                        <td className="col-lg-2" style={{width: '100px',fontSize:"1rem"}}>{this.docChangeNameFMB(order.TargetType, order.BaseType)}</td>
                                        <td style={{width: '100px', maxWidth:'100px',fontSize:"1rem"}}>
                                            <CurrencyFormat 
                                                value={order.Total} 
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </td>
                                        <td style={{width: '100px', maxWidth:'100px',fontSize:"1rem"}}>
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
)(deliveryViews);