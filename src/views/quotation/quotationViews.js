import React, {Component} from 'react';
import {Session, QuotationDetailModel} from "../../components";
import {DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE, VIEW_NAME, config} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import moment from 'moment';
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';
import ExportReportGeneral from '../../components/ExportReportGeneral';

const apiClient = ApiClient.getInstance();

require('datatables.net-bs4');

class QuotaionViews extends Component {

     constructor(props) {
        super(props);
        this.state = {
            orders: [],
            order: {
                header: {},
                body: []
            },
            typeCondition : 0,
            tableToExcel : [],
            guia: [],
            docsToPrint: [],
            selectAll: false
        };
        this.table = null;
    }

    async componentDidMount() {
        // const {enableSpinner} = this.props;
        // enableSpinner(true);
        // let response = await apiClient.getQuotation();

        // enableSpinner(false);
        // if (response.status === SERVICE_RESPONSE.SUCCESS) {
        //     this.setState({
        //         orders: response.data,
        //     });
        //     $('#tablaQuotation').DataTable({
        //         "paging": true,
        //         "info": false,
        //         "searching": false,
        //         "language": {
        //             "lengthMenu": "Registros por página  _MENU_ ",
        //             "zeroRecords": "No se encontraron registros",
        //             "info": "Mostrando página _PAGE_ de _PAGES_",
        //             "infoEmpty": "No existen registros",
        //             "infoFiltered": "(filtrado de _MAX_ entradas)",
        //             "loadingRecords": "Buscando...",
        //             "processing": "Procesando...",
        //             "search": "Buscar:",
        //             "paginate": {
        //                 "first": "Primero",
        //                 "last": "Último",
        //                 "next": "Siguiente",
        //                 "previous": "Anterior"
        //             }
        //         }
        //     });
        // }
        let user = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'CurrentUser'));
        this.setState({
            typeCondition : user ? user.GroupNum : 0
        });
        this.fillDataBilling();
        

    }

    fillDataBilling = () =>{
        this.table =  $('#tablaQuotation').DataTable({
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
        if (this.props.orders != nextProps.orders) {
            //console.log("hay nuevos datos");
            this.table.destroy();
            this.table = null;
        }
        return true;
    }

    componentDidUpdate() {
        if (this.table == null) {
            this.fillDataBilling();
        }
    }

    openOrder = async docEntry => {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        enableSpinner(true);
        let response = await apiClient.getDataQuotation(docEntry);
        enableSpinner(false);

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            this.setState({
                order: response.data,
                guia: response.data.statusGuia || [],
            });

            $('#quotationModal').modal('show');
            return;
        }

        showAlert({type: 'error', message: "Aviso: "+response.message})
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
                result = 'Sin atender';
                break;
        }
        return result;
    };

    // changeDocsToPrint(docEntry){
    //     const {docsToPrint} = this.props;
    //     const index = docsToPrint.indexOf(docEntry);
    //     if (index === -1) {
    //         this.setState({
    //             docToPrint: docsToPrint.push(docEntry)
    //         })
    //     }else{
    //         this.setState({
    //             docToPrint: docsToPrint.splice(index,1)
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
        const { order, typeCondition, tableToExcel, guia} = this.state;
        const { orders,getData,handleInputDateInicio, handleInputDateFinal, fechaFinal,fechaInicio, fechamin, fechamax, isLoaded, enableSpinner, docsToPrint, changeDocsToPrint}  = this.props;

        return (
            <div className="content-fluid" style={{backgroundColor: config.Back.backgroundColor}}>
                <QuotationDetailModel order={order} guia = {guia}/>
                <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>
                    <div className="col-md-12">
                        <h3 style={{fontWeight:"bolder",fontSize:"2.5rem", color:"black"}}>OFERTAS DE VENTAS</h3>
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
                            onClick={()=>getData(7)}
                            className="btn botonResumen" 
                            style={{
                                backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                color: config.navBar.textColor2,
                                fontWeight: "bold",
                            }}>
                            Ver ofertas
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 table-responsive tableReports">
                        <div className="ml-1">
                            {docsToPrint.length > 0 &&
                                <ExportReportGeneral
                                    orders = {orders}
                                    data={docsToPrint}
                                    typeDocs={"quotations"}
                                    enableSpinner={enableSpinner}
                                />
                            }
                        </div>
                        <table id="tablaQuotation" className="table table-striped scrolltable">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white", fontSize:"1rem"}}>
                                    <th scope="col-lg-1"></th>
                                    <th scope="col-lg-1">No. de cotización</th>
                                    <th scope="col-lg-1">Fecha de creación</th>
                                    <th scope="col-lg-1">Estado</th>
                                    <th scope="col-lg-1">Estado del pedido</th>
                                    <th scope="col-lg-1">Valor total</th>
                                    <th scope="col-lg-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {!!orders && orders.map((order, index) => {
                                    return (<tr key={index}>
                                        <td className="text-center">
                                            <div class="form-check" style={{minWidth: "70px"}}>
                                                <input class="form-check-input" type="checkbox" value={order.DocEntry} onChange={(event)=>changeDocsToPrint(event.nativeEvent.target.value)} id="ordersToPrint"/>                                               
                                            </div>
                                        </td>
                                        <th className="col-lg-auto text-center" scope="col-lg-auto row" style={{fontSize:"1rem", width: '250px'}}>{order.DocNum} </th>
                                        <td className="col-lg-auto text-center" style={{fontSize:"1rem", width:'250px'}}>
                                            {moment(order.Fecha).utc().format('YYYY-MM-DD')}
                                        </td>
                                        <td className="col-lg-auto text-center" style={{fontSize:"1rem", width: '250px'}}>{this.docChangeName(order.DocStatus)}</td>
                                        <td className="col-lg-auto text-center" style={{width: '250px', fontSize:"1rem"}}>{this.docChangeNameFMB(order.TargetType, order.BaseType)}</td>
                                        <td className="col-lg-auto text-center" style={{fontSize:"1rem", width:'250px'}}>
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
                                        <td className="col-lg-auto text-center" style={{fontSize:"1rem", width:'250px'}}>
                                            <span onClick={() => this.openOrder(order.DocEntry)}>
                                                <i className={config.icons.detail} style={{fontSize:"1rem",color:'#0060EA', paddingRight: 6 }}></i>
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
)(QuotaionViews);