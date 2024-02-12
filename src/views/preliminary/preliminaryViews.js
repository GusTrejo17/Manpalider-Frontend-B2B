import React, {Component} from 'react';
import {Session, PreliminarDetailModel} from "../../components";
import {DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE, VIEW_NAME, config} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import moment from 'moment';
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';
import ExportReportGeneral from '../../components/ExportReportGeneral';

const apiClient = ApiClient.getInstance();

require('datatables.net-bs4');

class preliminaryViews extends Component {

    // Se agrego el contructor y la tabla para limpirar
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            order: {
                header: {},
                body: []
            },
            docsToPrint: [],
            selectAll: false
        };
        this.table = null;
    }

    async componentDidMount() {
        // const {enableSpinner} = this.props;
        // enableSpinner(true);
        // let response = await apiClient.getPreliminarys();

        // enableSpinner(false);
        // if (response.status === SERVICE_RESPONSE.SUCCESS) {
        //     this.setState({
        //         orders: response.data,
        //     })
        //     $('#tablaPreli').DataTable({
        //         "paging": false,
        //         "info": false,
        //         "searching": false
        //     });
        // }
        this.fillDataOrders();

    }
    // Se llena la tabla con la configuración
    fillDataOrders = () => {
        this.table =  $('#tablaPreli').DataTable({
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
    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.props.orders != nextProps.orders) {
            //console.log("hay nuevos datos");
            this.table.destroy();
            this.table = null;
        }
        return true;
    }
    // se llena la tabla
    componentDidUpdate(): void {
        if (this.table == null) {
            this.fillDataOrders();
        }
    }

    openOrder = async docEntry => {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        enableSpinner(true);
        let response = await apiClient.getDataPreliminary(docEntry);
        enableSpinner(false);

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            this.setState({
                order: response.data,
            });

            $('#preliminarModal').modal('show');
            return;
        }

        showAlert({type: 'error', message: "Aviso: "+response.message})
    };
    docChangeName(status){
        let result = '';
        switch (status) {
            // case 'O':
            //     result = "Abierta";
            //     break;
            // case 'C':
            //     result = "Cerrada";
            //     break;
            case 'W':
                result = "Pendiente";
                break;
            case 'Y':
                result = "Aprobado";
                break;
            case 'N':
                result = "Rechazado";
                break;
            default:
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
        const {/*orders,*/ order} = this.state;
        const { orders,getData,handleInputDateInicio, handleInputDateFinal, fechaFinal,fechaInicio, fechamin, fechamax, isLoaded, enableSpinner, docsToPrint, changeDocsToPrint,docsToPrintCopy, changeDocsToPrintCopy}  = this.props;
        return (
            <div className="content-fluid" style={{backgroundColor: config.Back.backgroundColor}}>
                <PreliminarDetailModel order={order}/>
                <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>
                    <div className="col-md-12">
                        <h3 style={{fontWeight:"bolder",fontSize:"2.5rem", color:"black"}}>DOCUMENTOS DE AUTORIZACIÓN</h3>
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
                            onClick={()=>getData(2)}
                            className="btn botonResumen text-white" 
                            style={{
                                backgroundColor: config.Back.color,
                                color: config.navBar.textColorCategorieHover,
                                fontWeight: "bold",
                            }}>
                            Ver pedidos
                        </button>
                    </div>
                </div>  
                <div className="row">
                    <div className="col-md-12 table-responsive tableReports">
                        <div className="ml-1">
                            {docsToPrint.length > 0 &&
                                <ExportReportGeneral
                                    orders = {docsToPrintCopy}
                                    data={docsToPrint}
                                    typeDocs={"auto"}
                                    enableSpinner={enableSpinner}
                                />
                            }
                        </div>
                        <table id="tablaPreli" className="table table-striped scrolltable">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white", fontSize:"1rem"}}>
                                    <th scope="col"></th>
                                    <th scope="col">Número</th>
                                    <th scope="col">Fecha de creación</th>
                                    <th scope="col">Estado</th>
                                    {/* <th scope="col">Total peso neto</th>
                                    <th scope="col">Total peso bruto</th> */}
                                    <th scope="col">Cant. de articulos</th>
                                    <th scope="col">Cant. de unidades</th>
                                    <th scope="col">Valor total</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody style={{textAlign: "-webkit-center", fontSize:'1rem'}}>
                                {!!orders && orders.map((order, index) => {
                                    return (<tr key={index}>
                                        <td className="text-center">
                                            <div class="form-check" style={{minWidth: "70px"}}>
                                                <input class="form-check-input" type="checkbox" value={order.DocEntry} onChange={(event)=>{changeDocsToPrint(event.nativeEvent.target.value);changeDocsToPrintCopy(order)}} id="ordersToPrint"/>                                               
                                            </div>
                                        </td>
                                        <th scope="row">{order.DocEntry}</th>
                                        <td>{moment(order.Fecha).utc().format('YYYY-MM-DD')}</td>
                                        <td>{this.docChangeName(order.U_Status)}</td>
                                        
                                        {/* <td>{order.Weight1 === null ? '0 KG' : parseFloat(order.Weight1).toFixed(2)+ ' KG'}</td>
                                        <td>{order.Weight2 === null ? '0 KG' : parseFloat(order.Weight2).toFixed(2)+ ' KG'}</td> */}
                                        <td>{parseInt(order.Cant)}</td>
                                        <td>{parseInt(order.Unit)}</td>
                                        <td className="">
                                            {/* <CurrencyFormat 
                                                value={order.Total} 
                                                displayType={'text'} 
                                                thousandSeparator={'.'}
                                                decimalSeparator={','}
                                                prefix={config.general.currency}>
                                            </CurrencyFormat> */}
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
                                        <td>
                                            <span onClick={() => this.openOrder(order.DocEntry)}>
                                                <i className={config.icons.detail} style={{color: config.Back.color, paddingRight: 6}}></i>
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
)(preliminaryViews);