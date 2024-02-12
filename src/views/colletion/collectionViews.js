import React, {Component} from 'react';
import {Session, OrderDetailsModal} from "../../components";
import {DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE, VIEW_NAME, config} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import moment from 'moment';
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';
import ExportReportGeneral from '../../components/ExportReportGeneral';

const apiClient = ApiClient.getInstance();

require('datatables.net-bs4');

class collectionViews extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            order: {
                header: {},
                body: [],
                
            },
            docsToPrint: [],
            selectAll: false,
            // collect:[]
        };
        this.table = null;
    }

    componentDidMount() {
        this.fillDataCollections();
    }

    fillDataCollections = () => {
        const {enableSpinner,data} = this.props;
        this.table = $('#tablaCollection').DataTable({
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
            this.fillDataCollections();
        }
    }

    docChangeName(status){
        let result = '';
        switch (status) {
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
    // data = async (order) =>{
    //     const {collect} = this.state
    //     let auxCollect  = collect.slice()
    //     auxCollect.push(order)
        
    //     this.setState({
    //         collect:auxCollect
    //     })
    // }
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
        const {/*orders, */order, collect} = this.state;
        const { orders,getData,handleInputDateInicio, handleInputDateFinal, fechaFinal,fechaInicio, fechamin, fechamax, isLoaded, enableSpinner, docsToPrint, changeDocsToPrint, user}  = this.props;

        return (
            <div className="content-fluid" style={{backgroundColor: config.Back.backgroundColor}}>
                <OrderDetailsModal order={order}/>
                <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>
                    <div className="col-md-12 pb-2">
                        <h3 style={{fontWeight:"bolder",fontSize:"2.5rem", color:"black"}}>COBRANZAS</h3>
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
                            onClick={()=>getData(5)}
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
                                    typeDocs={"collect"}
                                    enableSpinner={enableSpinner}
                                    // collect={collect}
                                    user={user}
                                />
                            }
                        </div>
                        <table id="tablaCollection" className="table table-striped scrolltable">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white", fontSize: "1rem"}}>
                                    <th scope="col"></th>
                                    <th scope="col">Fecha del documento</th>
                                    <th scope="col">Movimiento</th>
                                    <th scope="col">No. de transacción</th>
                                    <th scope="col">No. de cuenta</th>
                                    <th scope="col">Fecha de contabilización</th>
                                    <th scope="col">Cargo</th>
                                    <th scope="col">Abono</th>
                                    <th scope="col">Referencia</th>
                                </tr>
                            </thead>
                            <tbody style={{textAlign: "-webkit-center"}}>
                                {!!orders && orders.map((order, index) => {
                                    return (<tr key={index} style={{width:'250px', fontSize:"1rem"}}>
                                        <td className="text-center">
                                            <div class="form-check" style={{ minWidth: "70px" }}>
                                                {/* <input class="form-check-input" type="checkbox" value={order.Ref1} onChange={(event)=>{changeDocsToPrint(event.nativeEvent.target.value);this.data(order)}} id="ordersToPrint"/> */}
                                                <input class="form-check-input" type="checkbox" value={order.Ref1} onChange={(event) => changeDocsToPrint(order)} id="ordersToPrint" />
                                            </div>
                                        </td>
                                        <th scope="row" style={{width:'250px', fontSize:"1rem"}}>{moment(order.TaxDate).utc().format('YYYY-MM-DD')}</th>
                                        <th scope="row" style={{width:'250px', fontSize:"1rem"}}>{this.docChangeName(order.TransType)}</th>
                                        <td style={{width:'250px', fontSize:"1rem"}}>{order.TransId}</td>
                                        <td style={{width:'250px', fontSize:"1rem"}}>{order.Account}</td>
                                        <td style={{width:'250px', fontSize:"1rem"}}>{order.MthDate? moment(order.MthDate).utc().format('YYYY-MM-DD'): "SIN FECHA DE PAGO"}</td>
                                        <td className="text-center" style={{width:'250px', fontSize:"1rem"}}>
                                            <CurrencyFormat 
                                                value={order.Debit} 
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </td>
                                        <td className="text-center" style={{width:'250px', fontSize:"1rem"}}>
                                            <CurrencyFormat 
                                                value={order.Credit} 
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2}
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </td>
                                        <td style={{width:'250px', fontSize:"1rem", textAlign:"center"}}>{order.Ref1}</td>
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
)(collectionViews);