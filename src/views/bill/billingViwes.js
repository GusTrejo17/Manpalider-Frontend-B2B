import React, {Component} from 'react';
import { BillDetailModel} from "../../components";
import {DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE, config} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import moment from 'moment';
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';
import { Button } from 'react-scroll';
import { CSVLink, CSVDownload } from "react-csv";
import ExportReportBillPDF from '../../components/ExportReportBillPDF';
import ExportReportGeneral from '../../components/ExportReportGeneral';

const apiClient = ApiClient.getInstance();

require('datatables.net-bs4');

class BillView extends Component {
    csvLink= React.createRef();
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

    componentDidMount() {
        let user = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'CurrentUser'));
        this.setState({
            typeCondition : user ? user.GroupNum : 0
        });
        this.fillDataBilling();
    }

    fillDataBilling = () =>{
        this.table =  $('#tablaBills').DataTable({
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
        let response = await apiClient.getDataBill(docEntry);
        enableSpinner(false);

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            this.setState({
                order: response.data,
                guia: response.data.statusGuia || [],
            });

            $('#billModal').modal('show');
            return;
        }

        showAlert({type: 'error', message: "Aviso: "+response.message})
    };

    openPDF = async docEntry => {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        enableSpinner(true);
        let response = await apiClient.getDataBill(docEntry);
        enableSpinner(false);

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            this.setState({
                order: response.data,
            });

            $('#billModal').modal('show');
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
    }
    docChangeNameFMB(target,base){
        let result = '';
        let response = target != -1 ? target : base
        switch (response) {
            // case 23:
            //     result = "Sin atender";
            //     break;
            // case 17:
            //     result = "Atendido";
            //     break;
            // case 15:
            //     result = "Surtido";
            //     break;
            case 13:
                result = "Facturado";
                break;
            case 14:
                result = "Nota de crédito";
                break;
            default:
                result = 'Facturado';
                break;
        }
        return result;
    };

    exportCSVOrders = async docEntry => {
        const { getData , notificationReducer: {showAlert}} = this.props;
        await getData(3);
        setTimeout(async() => {
            const { orders } = this.props;
            if (orders.length > 0){
                let minNewOrders = [];
                // orders.map((order, index) => {
                //     minNewOrders.push(
                //         {
                //             "Fecha de contabilización": moment(order.DocDate).format('YYYY-MM-DD'),
                //             "No. de factura": order.DocNum,
                //             "Documento origen": this.BaseType(order.BaseType),
                //             "No. de relación": order.BaseRef,
                //             "Fecha de vencimiento": moment(order.DocDueDate).format('YYYY-MM-DD'),
                //             "Valor total":  'MXN ' + Number(order.DocTotal).toFixed(2),
                //             "Total pagado": 'MXN ' + Number(order.PaidToDate).toFixed(2),
                //             "Estado del documento": this.docChangeName(order.DocStatus),
                //         }
                //     ); 
                // });
                // minNewOrders.push(
                //     {
                //         "Fecha de contabilización": '',
                //         "No. de factura": '',
                //         "Documento origen": '',
                //         "No. de relación": '',
                //         "Fecha de vencimiento": '',
                //         "Valor total": '',
                //         "Total pagado": '' ,
                //         "Estado del documento": '',
                //     }
                // );
                // minNewOrders.push(
                //     {
                //         "Fecha de contabilización": '',
                //         "No. de factura": '',
                //         "Documento origen": 'Clave',
                //         "No. de relación": 'Nombre',
                //         "Fecha de vencimiento": 'Cantidad',
                //         "Valor total": 'Precio',
                //         "Total pagado": 'Precio total' ,
                //         "Estado del documento": '',
                //     }
                // );
                let response = await apiClient.getDataBill(docEntry);
                response.data.body.map((body, index) =>{
                    minNewOrders.push(
                        {
                            "": '',
                            "Artículo": body.ItemCode,
                            "Nombre del artículo": body.Dscription,
                            "Cantidad": body.Quantity,
                            "Precio": Number(body.Price).toFixed(2) + ' MXN',
                            "Precio total": Number(body.Price).toFixed(2) + ' MXN',
                            "": '',
                        }
                    );
                })
                this.setState({ tableToExcel: minNewOrders });
                setTimeout(() => {
                        this.csvLink.current.link.click();
                }, 500); 
            }else{
                showAlert({type: 'info', message: 'No se ha podido generar sus archivo, porque no se encontraron resultado para su búsqueda'});
            }
        }, 500);
    }    

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
        const { order, typeCondition, tableToExcel, guia} = this.state;
        const { orders,getData,handleInputDateInicio, handleInputDateFinal, fechaFinal,fechaInicio, fechamin, fechamax, isLoaded, enableSpinner, docsToPrint, changeDocsToPrint, user}  = this.props;
        // console.log("Tipo del usuario", typeCondition);
        // console.log("Facturas", orders);
        return (
            <div className="content-fluid" style={{backgroundColor: config.Back.backgroundColor}}>
                <CSVLink 
                    data={tableToExcel} 
                    filename ={`Factura.csv`}                
                    className="hidden"
                    ref={this.csvLink}
                    target="_blank">
                </CSVLink>
                <BillDetailModel order={order} guia={guia}/>
                <div className="row text-center" style={{paddingTop: 16, paddingBottom: 16}}>
                    <div className="col-md-12 pb-2">
                        <h3 style={{fontWeight:"bolder",fontSize:"2.5rem", color:"black"}}>FACTURAS</h3>
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
                            onClick={()=>getData(3)}
                            className="btn botonResumen" 
                            style={{
                                backgroundColor: config.Back.color,
                                color: config.navBar.textColor2,
                                fontWeight: "bold",
                            }}>
                            Ver facturas
                        </button>
                    </div>
                    <div className="col-md-2 pb-2">
                        {orders.length > 0 &&
                            <ExportReportBillPDF
                                data={orders}
                                user={user}
                            />
                        }
                    </div>                    
                </div>
                <div className="row">
                <div className="col-md-12 table-responsive tableReports">
                        <div className="ml-1">
                            {docsToPrint.length > 0 &&
                                <ExportReportGeneral
                                    data={docsToPrint}
                                    typeDocs={"invoices"}
                                    enableSpinner={enableSpinner}
                                />
                            }
                        </div>
                        <table id="tablaBills" className="table table-striped scrolltable">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white", fontSize:"1rem"}}>
                                    <th scope="col-auto"></th>
                                    <th scope="col-auto">Fecha de contabilización</th>
                                    <th scope="col-1">No. de factura</th>
                                    <th scope="col-1">Documento origen</th>
                                    <th scope="col-1">No. de relación</th>
                                    <th scope="col-1">Fecha de vencimiento</th>
                                    {/* <th scope="col-1">Total peso neto</th>
                                    <th scope="col-1">Total peso bruto</th> */}
                                    <th scope="col-1">Cant. de articulos</th>
                                    <th scope="col-1">Cant. de unidades</th>
                                    <th scope="col-1">Valor total</th>
                                    <th scope="col-1">Total pagado</th>
                                    <th scope="col-1">Estado</th>
                                    <th scope="col-lg-1">Estado del pedido</th>
                                    <th scope="col-1">Entregado</th>
                                    <th scope="col-1">Guía cargada</th>
                                    <th scope="col-lg-3" style={{width: '250px'}}>Descargar</th>
                                    <th scope="col-lg-3" style={{width: '250px'}}>Desc. Factura</th>
                                    <th scope="col-lg-3" style={{width: '250px'}}></th>
                                    {/* <th scope="col"></th>
                                    <th scope="col"></th> */}
                                </tr>
                            </thead>
                            <tbody style={{textAlign: "-webkit-center"}}>
                                {!!orders && orders.map((order, index) => {
                                    return (<tr key={index}>
                                        <td className="text-center">
                                            <div class="form-check" style={{minWidth: "70px"}}>
                                                <input class="form-check-input" type="checkbox" value={order.DocEntry} onChange={(event)=>changeDocsToPrint(event.nativeEvent.target.value)} id="ordersToPrint"/>                                               
                                            </div>
                                        </td>
                                        <th style={{width: '250px', fontSize:"1rem"}} scope="col-lg-auto row">{moment(order.DocDate).utc().format('YYYY-MM-DD')}</th>
                                        <th style={{width: '250px', fontSize:"1rem"}} scope="col-lg-auto row">{order.DocNum}</th>
                                        <td style={{width: '250px', fontSize:"1rem"}}>{this.BaseType(order.BaseType)}</td>
                                        <td style={{width: '250px', fontSize:"1rem"}}>{order.BaseRef}</td>
                                        <td style={{width: '250px', fontSize:"1rem"}}>{moment(order.DocDueDate).utc().format('YYYY-MM-DD')}</td>
                                        {/* <td style={{width: '250px'}}>{order.Weight1 === null ? '0 KG' : parseFloat(order.Weight1).toFixed(2)+ ' KG'}</td>
                                        <td style={{width: '250px'}}>{order.Weight2 === null ? '0 KG' : parseFloat(order.Weight2).toFixed(2)+ ' KG'}</td> */}
                                        <td style={{width: '250px', fontSize:"1rem"}}>{parseInt(order.Cant)}</td>
                                        <td style={{width: '250px', fontSize:"1rem"}}>{parseInt(order.Unit)}</td>
                                        <td style={{width: '250px', fontSize:"1rem"}} className="">
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
                                        <td className="col-lg-3 text-center" style={{width: '250px', fontSize:"1rem"}}>
                                            <CurrencyFormat 
                                                value={order.PaidToDate} 
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </td>
                                        <td style={{width: '250px', fontSize:"1rem"}}>{this.docChangeName(order.DocStatus)}</td>
                                        <td className="col-lg-auto" style={{width: '250px', fontSize:"1rem"}}>{this.docChangeNameFMB(order.TargetType, order.BaseType)}</td>
                                        <td style={{width: '250px', fontSize:"1rem"}}>{order.U_Entregado || 'NO'}</td>
                                        <td scope="col-lg-3" style={{width: '250px', fontSize:"1rem"}}>{order.U_TipoarticuloOV || ''}</td>
                                        <td scope="col-lg-3" style={{width: '250px', fontSize:"1rem"}}>
                                            <button
                                                onClick={()=>this.exportCSVOrders(order.DocEntry)}
                                                className="btn btn-success" 
                                                style={{
                                                    color: 'white',
                                                    fontWeight: "bold",
                                                }}>
                                                Exportar a Excel
                                            </button>
                                        </td>
                                        <td className="col-lg-4" style={{width: '250px', fontSize:"1rem"}}>
                                        
                                            <a href={`${config.BASE_URL}/${SERVICE_API.getBillspdf}/${order.DownloadFacturaPDF}`} target="_blank" style={{fontSize:"1rem"}} hidden={order.DownloadFacturaPDF ? false : true}>
                                                <span style={{ color: config.footer.iconColor}}>Descargar pdf <img src="https://image.flaticon.com/icons/png/512/337/337946.png" style={{ maxHeight: 20 }}></img></span>
                                            </a>
                                            <a href={`${config.BASE_URL}/${SERVICE_API.getBillsxml}/${order.DownloadFacturaXML}`} target="_blank" style={{fontSize:"1rem"}} hidden={order.DownloadFacturaXML ? false : true}>
                                                <span style={{ color: config.footer.iconColor }}>Descargar xml <img src="https://image.flaticon.com/icons/png/512/1548/1548741.png" style={{ maxHeight: 20 }}></img></span>
                                            </a>
                                        </td>
                                        <td style={{width: '250px' , fontSize:"1rem"}}>
                                            <span onClick={() => this.openOrder(order.DocEntry)}>
                                                <i className={config.icons.detail} style={{color: config.Back.color, paddingRight: 6}}></i>
                                                Detalle
                                            </span>
                                        </td>
                                        {/* <td>
                                            <i className={config.icons.report} style={{color: config.shoppingList.summaryList, paddingRight: 6}}></i>
                                            <a href={config.BASE_URL+SERVICE_API.getPDF+order.DocNum+".pdf"} target="_blank" >PDF</a>
                                        </td>
                                        <td>
                                            <i className={config.icons.xml} style={{color: config.shoppingList.summaryList, paddingRight: 6}}></i>
                                            <a href={config.BASE_URL+SERVICE_API.getXML+order.DocNum+".xml"} target="_blank" >XML</a>
                                        </td> */}
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
)(BillView);