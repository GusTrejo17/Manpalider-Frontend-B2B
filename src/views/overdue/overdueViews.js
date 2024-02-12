import React, {Component} from 'react';
import {Session, OrderDetailsModal,BillDetailModel,overDueBillModal} from "../../components";
import {DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE, VIEW_NAME, config} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import moment from 'moment';
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';
import ExportReportOverDuePDF from '../../components/ExportReportOverDuePDF';
import { CSVLink, CSVDownload } from "react-csv";

const apiClient = ApiClient.getInstance();

require('datatables.net-bs4');

class overdueViews extends Component {

    constructor(props) {
        super(props);
        this.state = {
            overdueTwo: [],
            overdueThree: [],
            overdueFour: [],
            overdueFive: [],
            data: [],
            orderModal: [],
            mailToClient: '',

            facturaToSend: null,
            imagePreview: null,
            imagePreviewType: '',
        };
        this.tableOne = null;
        this.tableTwo = null;
        this.tableThree = null;
        this.tableFour = null;
        this.tableFive = null;
    }

    async componentDidMount() {
        this.createDataTabletablaOver('tablaOverOne'); 
    }

    dataTablas = () => ({
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
    })

    createDataTabletablaOver = (key) => {

        switch (key) {
             case 'tablaOverOne':
                 this.tableOne =  $(`#tablaOverOne`).DataTable(this.dataTablas());
             break;
             case 'tablaOverTwo':
                 this.tableTwo =  $(`#tablaOverTwo`).DataTable(this.dataTablas());
             break;
             case 'tablaOverThree':
                 this.tableThree =  $(`#tablaOverThree`).DataTable(this.dataTablas());
             break;
             case 'tablaOverFour':
                 this.tableFour =  $(`#tablaOverFour`).DataTable(this.dataTablas());
             break;
             case 'tablaOverFive':
                 this.tableFive =  $(`#tablaOverFive`).DataTable(this.dataTablas());
             break;
        } 
    }

    // Se vacia la tabla
    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.props.overdueOne != nextProps.overdueOne) {
            this.tableOne.destroy();
            this.tableOne = null;
        }
        if (this.state.overdueTwo != nextState.overdueTwo) {
            this.tableTwo.destroy();
            this.tableTwo = null;
        }
        if (this.state.overdueThree != nextState.overdueThree) {
            this.tableThree.destroy();
            this.tableThree = null;
        }
        if (this.state.overdueFour != nextState.overdueFour) {
            this.tableFour.destroy();
            this.tableFour = null;
        }
        if (this.state.overdueFive != nextState.overdueFive) {
            this.tableFive.destroy();
            this.tableFive = null;
        }
        return true;
    }

    // se llena la tabla
    componentDidUpdate(): void {
        
        if (this.tableOne == null) {
            this.createDataTabletablaOver('tablaOverOne');
        }
        if (this.tableTwo == null) {
            this.createDataTabletablaOver('tablaOverTwo');
        }
        if (this.tableThree == null) {
            this.createDataTabletablaOver('tablaOverThree');
        }
        if (this.tableFour == null) {
            this.createDataTabletablaOver('tablaOverFour');
        }
        if (this.tableFive == null) {
            this.createDataTabletablaOver('tablaOverFive');
        }
        
    }
    
    getDataOverDoue = async (opcion) =>{
        const {enableSpinner,notificationReducer: {showAlert}} = this.props;
        
        let responseTwo = [];
        let responseThree  = [];
        let responseFour  = [];
        let responseFive = [];
        enableSpinner(true);
        if(opcion === 1){
            responseTwo = await  apiClient.getOverdueTwo();
            //console.log("hi", responseTwo);
            if (!Array.isArray(responseTwo.data)){
                showAlert({type: 'error', message: 'Ocurrió un error al consultar la Información de saldos de 30'});
                return;
            }else{
                if (responseTwo.data.length === 0) {
                    showAlert({type: 'info', message: 'No hay Información por mostrar'});
                }
            }
        }else if(opcion === 2){
            responseThree = await apiClient.getOverdueThree();
            //console.log("hi***", responseThree);
            if (!Array.isArray(responseThree.data)){
                showAlert({type: 'error', message: 'Ocurrió un error al consultar la Información de saldos de 60'});
                return;
            }else{
                if (responseThree.data.length === 0) {
                    showAlert({type: 'info', message: 'No hay Información por mostrar'});
                }
            }
        }else if(opcion === 3){
            responseFour = await apiClient.getOverdueFour();
            //console.log("hi////", responseFour);
            if (!Array.isArray(responseFour.data)){
                showAlert({type: 'error', message: 'Ocurrió un error al consultar la Información de saldos de 90'});
                return;
            }else{
                if (responseFour.data.length === 0) {
                    showAlert({type: 'info', message: 'No hay Información por mostrar'});
                }
            }
        } else if(opcion === 4){
            responseFive = await apiClient.getOverdueFIve();
            if (!Array.isArray(responseFive.data)){
                showAlert({type: 'error', message: 'Ocurrió un error al consultar la Información de saldos de a mas de 90'});
                return;
            }else{
                if (responseFive.data.length === 0) {
                    showAlert({type: 'info', message: 'No hay Información por mostrar'});
                }
            }
        } 
        enableSpinner(false);

        // if (!Array.isArray(responseTwo.data) || !Array.isArray(responseThree.data) || !Array.isArray(responseFour.data) || !Array.isArray(responseFive.data)) {
        //     showAlert({type: 'error', message: 'Ocurrió un error al consultar la Información de saldos'});
        //     return;
        // }

        // if (responseTwo.data.length === 0 || responseThree.data.length === 0 || responseFour.data.length === 0 || responseFive.data.length === 0) {
        //     showAlert({type: 'info', message: 'No hay Información por mostrar'});

        // }
        this.setState({
            overdueTwo : responseTwo.data || [],
            overdueThree:responseThree.data || [],
            overdueFour: responseFour.data || [],
            overdueFive: responseFive.data || []
        });
    };
    
    openOrder = async docEntry => {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        enableSpinner(true);
        let response = await apiClient.getOneOverdue(docEntry);

        enableSpinner(false);

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            this.setState({
                orderModal: response.data,
                guia: response.data.statusGuia || [],
            });

            $('#overDuebillModal').modal('show');
            // return;
        }
        // showAlert({type: 'error', message: "Aviso: "+response.message})
    };
    sendAttachment= async docEntry => {
        $('#sendByEMail').modal('show');
    };

    render() {
        const {overdueOne,getData,openModalMailPDF,sessionReducer} = this.props;
        const {overdueTwo, overdueThree, overdueFour, overdueFive,orderModal} = this.state;
        let mailToSend = sessionReducer.user.U_FMB_Handel_Email
        return (
        <div>
            <div className="content-fluid overdue" style={{backgroundColor: config.Back.backgroundColor}}>
                <div className="row text-center pb-2" style={{marginBottom: 16, marginTop: 16}}>
                    <div className="col-md-11 pb-2">
                        <h3 style={{fontWeight:"bolder",fontSize:"2.5rem", color:"black"}}>FACTURAS VENCIDAS</h3>
                    </div>
                    <div className="col-md-2 pb-2">
                        <button
                            // onClick={()=>openModalMailPDF()}
                            className="btn botonResumen" 
                            style={{
                                backgroundColor: config.Back.color,
                                color: config.navBar.textColor2,
                                fontWeight: "bold",
                            }}>
                            <a style={{color: "white"}} href={"mailto:"+mailToSend+"?subject=ARCHIVOS DIASA&body=ENVIADO DESDE E-HANDEL DIASA" }>Enviar correo</a>
                            <i class="fa fa-paper-plane" aria-hidden="true" style={{marginRight:5}}></i>
                            {/* Enviar correo */}
                        </button>
                    </div>
                </div>
                <div className="card" style={{background: 'transparent'}}>
                    <ul className="nav nav-tabs" id="myTab" role="tablist" style={{justifyContent:'center'}}>
                        <li className="nav-item">
                            <a className="nav-link active" id="vencer-tab" data-toggle="tab" href="#vencer" role="tab" aria-controls="vencer" onClick = {()=> getData(4)} aria-selected="true">Por vencer</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="uno-tab" data-toggle="tab" href="#uno" role="tab" aria-controls="uno" onClick = {()=> this.getDataOverDoue(1)} aria-selected="false">Saldo a 30 días</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="dos-tab" data-toggle="tab" href="#dos" role="tab" aria-controls="dos" onClick = {()=> this.getDataOverDoue(2)} aria-selected="false">Saldo a 60 días</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="tres-tab" data-toggle="tab" href="#tres" role="tab" aria-controls="tres" onClick = {()=> this.getDataOverDoue(3)} aria-selected="false">Saldo a 90 días</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="cuatro-tab" data-toggle="tab" href="#cuatro" role="tab" aria-controls="cuatro" onClick = {()=> this.getDataOverDoue(4)} aria-selected="false">Saldo a más de 90 días</a>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active table-responsive tableReports" id="vencer" role="tabpanel" aria-labelledby="vencer-tab">
                            <table id="tablaOverOne" className="table table-striped scrolltable">
                                <thead style={{textAlign: "-webkit-center"}}>
                                    <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white", width:'250px', fontSize:"1rem"}}>
                                        <th scope="col">No. documento</th>
                                        <th scope="col">Fecha del documento</th>
                                        <th scope="col">Fecha del vencimiento</th>
                                        {/* <th scope="col">Total peso neto</th>
                                        <th scope="col">Total peso bruto</th> */}
                                        <th scope="col">Cant. de articulos</th>
                                        <th scope="col">Cant. de unidades</th>
                                        <th scope="col">Adeudo</th>
                                        <th scope="col">Días transcurridos</th>
                                        <th scope="col">Total</th>
                                        <th scope="col" className="text-center">Detalle</th>
                                    </tr>
                                </thead>
                                <tbody style={{textAlign: "-webkit-center"}}>
                                    {overdueOne.map((order, index)=>{
                                        return (
                                            <tr key={index} style={{width:'250px', fontSize:"1rem"}}>
                                                <th scope="row" style={{width:'250px', fontSize:"1rem"}}>{order.DocNum}</th>
                                                <td style={{width:'250px', fontSize:"1rem"}}>{moment(order.DocDate).utc().format('YYYY-MM-DD')}</td>
                                                <td style={{width:'250px', fontSize:"1rem"}}>{moment(order.DocDueDate).utc().format('YYYY-MM-DD')}</td>
                                                {/* <td>{order.Weight1 === null ? '0 KG' : parseFloat(order.Weight1).toFixed(2)+ ' KG'}</td>
                                                <td>{order.Weight2 === null ? '0 KG' : parseFloat(order.Weight2).toFixed(2)+ ' KG'}</td> */}
                                                <td style={{width:'250px', fontSize:"1rem"}}>{parseInt(order.Cant)}</td>
                                                <td style={{width:'250px', fontSize:"1rem"}}>{parseInt(order.Unit)}</td>
                                                <td className="" style={{width:'250px', fontSize:"1rem"}}>
                                                    <CurrencyFormat 
                                                        value={order.PORVENCER || 0} 
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        fixedDecimalScale={true} 
                                                        decimalScale={2}
                                                        prefix={'$ '}
                                                        suffix={config.general.currency}
                                                    >
                                                    </CurrencyFormat>
                                                </td>
                                                <td className="" style={{width:'250px', fontSize:"1rem"}}>{order.DIAS}</td>
                                                <th scope="row" className="" style={{width:'250px', fontSize:"1rem"}}>
                                                    <CurrencyFormat 
                                                        value={order.DocTotal} 
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        fixedDecimalScale={true} 
                                                        decimalScale={2} 
                                                        prefix={'$ '}
                                                        suffix={config.general.currency}>
                                                    </CurrencyFormat>
                                                </th>
                                                <th scope="row" className="text-center" style={{width:'250px', fontSize:"1rem"}}>
                                                    <span onClick={() => this.openOrder(order.DocNum)}>
                                                        <i className={config.icons.detail} style={{color: config.Back.color, paddingRight: 6}}></i>
                                                        Detalle
                                                    </span>
                                                </th>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="tab-pane fade table-responsive tableReports" id="uno" role="tabpanel" aria-labelledby="uno-tab">
                            <table id="tablaOverTwo" className="table table-striped scrolltable">
                                <thead style={{textAlign: "-webkit-center"}}>
                                    <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white", width:'250px', fontSize:"1rem"}}>
                                        <th scope="col">No. documento</th>
                                        <th scope="col">Fecha del documento</th>
                                        <th scope="col">Fecha del vencimiento</th>
                                        {/* <th scope="col">Total peso neto</th>
                                        <th scope="col">Total peso bruto</th> */}
                                        <th scope="col">Cant. de articulos</th>
                                        <th scope="col">Cant. de unidades</th>
                                        <th scope="col">Adeudo</th>
                                        <th scope="col" classname="text-center">Días transcurridos</th>
                                        <th scope="col" className="text-center">Total</th>
                                        <th scope="col" className="text-center">Detalle</th>
                                    </tr>
                                </thead>
                                <tbody style={{textAlign: "-webkit-center"}}>
                                    {overdueTwo.map((order, index)=>{
                                        return (
                                            <tr key={index} style={{width:'250px', fontSize:"1rem"}}>
                                                <th scope="row" style={{width:'250px', fontSize:"1rem"}}>{order.DocNum}</th>
                                                <td style={{width:'250px', fontSize:"1rem"}}>{moment(order.DocDate).utc().format('YYYY-MM-DD')}</td>
                                                <td style={{width:'250px', fontSize:"1rem"}}>{moment(order.DocDueDate).utc().format('YYYY-MM-DD')}</td>
                                                {/* <td>{order.Weight1 === null ? '0 KG' : parseFloat(order.Weight1).toFixed(2)+ ' KG'}</td>
                                                <td>{order.Weight2 === null ? '0 KG' : parseFloat(order.Weight2).toFixed(2)+ ' KG'}</td> */}
                                                <td style={{width:'250px', fontSize:"1rem"}}>{parseInt(order.Cant)}</td>
                                                <td style={{width:'250px', fontSize:"1rem"}}>{parseInt(order.Unit)}</td>
                                                <td className="" style={{width:'250px', fontSize:"1rem"}}>
                                                    <CurrencyFormat 
                                                        value={order.PORVENCER || 0} 
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        fixedDecimalScale={true} 
                                                        decimalScale={2} 
                                                        prefix={'$ '}
                                                        suffix={config.general.currency}>
                                                    </CurrencyFormat>
                                                </td>
                                                <td className="text-center" style={{width:'250px', fontSize:"1rem"}}>{order.DIAS}</td>
                                                <th scope="row" className="text-center" style={{width:'250px', fontSize:"1rem"}}>
                                                    <CurrencyFormat 
                                                        value={order.DocTotal} 
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        fixedDecimalScale={true} 
                                                        decimalScale={2} 
                                                        prefix={'$ '}
                                                        suffix={config.general.currency}>
                                                    </CurrencyFormat>
                                                </th>
                                                <th scope="row" className="text-center" style={{width:'250px', fontSize:"1rem"}}>
                                                    <span onClick={() => this.openOrder(order.DocNum)}>
                                                        <i className={config.icons.detail} style={{color: config.Back.color, paddingRight: 6}}></i>
                                                        Detalle
                                                    </span>
                                                </th>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="tab-pane fade table-responsive tableReports" id="dos" role="tabpanel" aria-labelledby="dos-tab">
                            <table id="tablaOverThree" className="table table-striped scrolltable">
                                <thead style={{textAlign: "-webkit-center"}}>
                                    <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white", width:'250px', fontSize:"1rem"}}>
                                    <th scope="col">No. documento</th>
                                    <th scope="col">Fecha del documento</th>
                                    <th scope="col">Fecha del vencimiento</th>
                                    {/* <th scope="col">Total peso neto</th>
                                    <th scope="col">Total peso bruto</th> */}
                                    <th scope="col">Cant. de articulos</th>
                                    <th scope="col">Cant. de unidades</th>
                                    <th scope="col" className="text-center">Adeudo</th>
                                    <th scope="col">Días transcurridos 60 dias</th>
                                    <th scope="col" className="text-center">Total</th>
                                    <th scope="col" className="text-center">Detalle</th>
                                    </tr>
                                </thead>
                                <tbody style={{textAlign: "-webkit-center"}}>
                                    {overdueThree.map((order, index)=>{
                                        return (
                                            <tr key={index} style={{width:'250px', fontSize:"1rem"}}>
                                                <th scope="row" style={{width:'250px', fontSize:"1rem"}}>{order.DocNum}</th>
                                                <td style={{width:'250px', fontSize:"1rem"}}>{moment(order.DocDate).utc().format('YYYY-MM-DD')}</td>
                                                <td style={{width:'250px', fontSize:"1rem"}}>{moment(order.DocDueDate).utc().format('YYYY-MM-DD')}</td>
                                                {/* <td>{order.Weight1 === null ? '0 KG' : parseFloat(order.Weight1).toFixed(2)+ ' KG'}</td>
                                                <td>{order.Weight2 === null ? '0 KG' : parseFloat(order.Weight2).toFixed(2)+ ' KG'}</td> */}
                                                <td style={{width:'250px', fontSize:"1rem"}}>{parseInt(order.Cant)}</td>
                                                <td style={{width:'250px', fontSize:"1rem"}}>{parseInt(order.Unit)}</td>
                                                <td className="text-center" style={{width:'250px', fontSize:"1rem"}}>
                                                    <CurrencyFormat 
                                                        value={order.PORVENCER || 0} 
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        fixedDecimalScale={true} 
                                                        decimalScale={2} 
                                                        prefix={'$ '}
                                                        suffix={config.general.currency}>
                                                    </CurrencyFormat>
                                                </td>
                                                <td className="text-center" style={{width:'250px', fontSize:"1rem"}}>{order.DIAS}</td>
                                                <th scope="row" className="text-center" style={{width:'250px', fontSize:"1rem"}}>
                                                    <CurrencyFormat 
                                                        value={order.DocTotal} 
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        fixedDecimalScale={true} 
                                                        decimalScale={2} 
                                                        prefix={'$ '}
                                                        suffix={config.general.currency}>
                                                    </CurrencyFormat>
                                                </th>
                                                {/* 117 aqui perro  */}
                                                <th scope="row" className="text-center" style={{width:'250px', fontSize:"1rem"}}>
                                                    <span onClick={() => this.openOrder(order.DocNum)}>
                                                        <i className={config.icons.detail} style={{color: config.Back.color, paddingRight: 6}}></i>
                                                        Detalle
                                                    </span>
                                                </th>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="tab-pane fade table-responsive tableReports" id="tres" role="tabpanel" aria-labelledby="tres-tab">
                            <table id="tablaOverFour" className="table table-striped scrolltable">
                                <thead style={{textAlign: "-webkit-center"}}>
                                    <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white", width:'250px', fontSize:"1rem"}}>
                                    <th scope="col">No. documento</th>
                                    <th scope="col">Fecha del documento</th>
                                    <th scope="col">Fecha del vencimiento</th>
                                    {/* <th scope="col">Total peso neto</th>
                                    <th scope="col">Total peso bruto</th> */}
                                    <th scope="col">Cant. de articulos</th>
                                    <th scope="col">Cant. de unidades</th>
                                    <th scope="col">Adeudo</th>
                                    <th scope="col" className="text-center">Días transcurridos</th>
                                    <th scope="col" className="text-center">Total</th>
                                    <th scope="col" className="text-center">Detalle</th>
                                                
                                    </tr>
                                </thead>
                                <tbody style={{textAlign: "-webkit-center"}}>
                                    {overdueFour.map((order, index)=>{
                                        return (
                                            <tr key={index} style={{width:'250px', fontSize:"1rem"}}>
                                                <th scope="row" style={{width:'250px', fontSize:"1rem"}}>{order.DocNum}</th>
                                                <td style={{width:'250px', fontSize:"1rem"}}>{moment(order.DocDate).utc().format('YYYY-MM-DD')}</td>
                                                <td style={{width:'250px', fontSize:"1rem"}}>{moment(order.DocDueDate).utc().format('YYYY-MM-DD')}</td>
                                                {/* <td>{order.Weight1 === null ? '0 KG' : parseFloat(order.Weight1).toFixed(2)+ ' KG'}</td>
                                                <td>{order.Weight2 === null ? '0 KG' : parseFloat(order.Weight2).toFixed(2)+ ' KG'}</td> */}
                                                <td style={{width:'250px', fontSize:"1rem"}}>{parseInt(order.Cant)}</td>
                                                <td style={{width:'250px', fontSize:"1rem"}}>{parseInt(order.Unit)}</td>
                                                <td className="" style={{width:'250px', fontSize:"1rem"}}>
                                                    <CurrencyFormat 
                                                        value={order.PORVENCER || 0} 
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        fixedDecimalScale={true} 
                                                        decimalScale={2} 
                                                        prefix={'$ '}
                                                        suffix={config.general.currency}>
                                                    </CurrencyFormat>
                                                </td>
                                                <td className="text-center" style={{width:'250px', fontSize:"1rem"}}>{order.DIAS}</td>
                                                <th scope="row" className="text-center" style={{width:'250px', fontSize:"1rem"}}>
                                                    <CurrencyFormat 
                                                        value={order.DocTotal} 
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        fixedDecimalScale={true} 
                                                        decimalScale={2} 
                                                        prefix={'$ '}
                                                        suffix={config.general.currency}>
                                                    </CurrencyFormat>
                                                </th>
                                                <th scope="row" className="text-center" style={{width:'250px', fontSize:"1rem"}}>
                                                    <span onClick={() => this.openOrder(order.DocNum)}>
                                                        <i className={config.icons.detail} style={{color: config.Back.color, paddingRight: 6}}></i>
                                                        Detalle
                                                    </span>
                                                </th>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="tab-pane fade table-responsive tableReports" id="cuatro" role="tabpanel" aria-labelledby="cuatro-tab">
                            <table id="tablaOverFive" className="table table-striped scrolltable">
                                <thead style={{textAlign: "-webkit-center"}}>
                                    <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white", width:'250px', fontSize:"1rem"}}>
                                        <th scope="col">No. documento</th>
                                        <th scope="col">Fecha del documento</th>
                                        <th scope="col">Fecha del vencimiento</th>
                                        {/* <th scope="col">Total peso neto</th>
                                        <th scope="col">Total peso bruto</th> */}
                                        <th scope="col">Cant. de articulos</th>
                                        <th scope="col">Cant. de unidades</th>
                                        <th scope="col">Días transcurridos</th> 
                                        <th scope="col">Saldo actual</th>
                                        <th scope="col">Adeudo</th>
                                        <th scope="col">Total</th>
                                        <th scope="col">Detalle</th>
                                    </tr>
                                </thead>
                                <tbody style={{textAlign: "-webkit-center"}}>
                                    {overdueFive.map((order, index)=>{
                                        return (
                                            <tr key={index} style={{width:'250px', fontSize:"1rem"}}>
                                                <th scope="row" style={{width:'250px', fontSize:"1rem"}}>{order.DocNum}</th>
                                                <td style={{width:'250px', fontSize:"1rem"}}>{moment(order.DocDate).utc().format('YYYY-MM-DD')}</td>
                                                <td style={{width:'250px', fontSize:"1rem"}}>{moment(order.DocDueDate).utc().format('YYYY-MM-DD')}</td>
                                                {/* <td>{order.Weight1 === null ? '0 KG' : parseFloat(order.Weight1).toFixed(2)+ ' KG'}</td>
                                                <td>{order.Weight2 === null ? '0 KG' : parseFloat(order.Weight2).toFixed(2)+ ' KG'}</td> */}
                                                <td style={{width:'250px', fontSize:"1rem"}}>{parseInt(order.Cant)}</td>
                                                <td style={{width:'250px', fontSize:"1rem"}}>{parseInt(order.Unit)}</td>
                                                <td className="text-center" style={{width:'250px', fontSize:"1rem"}}>{order.DIAS}</td>
                                                <td className="" style={{width:'250px', fontSize:"1rem"}}>
                                                    <CurrencyFormat
                                                        value={order.PORVENCER || 0} 
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        fixedDecimalScale={true} 
                                                        decimalScale={2} 
                                                        prefix={'$ '}
                                                        suffix={config.general.currency}>
                                                    </CurrencyFormat>
                                                </td>
                                                <th scope="row" className="" style={{width:'250px', fontSize:"1rem"}}>
                                                    {
                                                        order.LineTotal ? 
                                                        <CurrencyFormat 
                                                            value={order.LineTotal} 
                                                            displayType={'text'} 
                                                            thousandSeparator={true} 
                                                            fixedDecimalScale={true} 
                                                            decimalScale={2} 
                                                            prefix={'$ '}
                                                            suffix={config.general.currency}>
                                                        </CurrencyFormat>
                                                        :<CurrencyFormat 
                                                            value={0} 
                                                            displayType={'text'} 
                                                            thousandSeparator={true} 
                                                            fixedDecimalScale={true} 
                                                            decimalScale={2} 
                                                            prefix={'$ '}
                                                            suffix={config.general.currency}>
                                                        </CurrencyFormat>
                                                    }
                                                </th>
                                                <th scope="row" className=""  style={{width:'250px', fontSize:"1rem"}}>
                                                    <CurrencyFormat 
                                                        value={order.DocTotal} 
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        fixedDecimalScale={true} 
                                                        decimalScale={2} 
                                                        prefix={'$ '}
                                                        suffix={config.general.currency}>
                                                    </CurrencyFormat>
                                                </th>
                                                <th scope="row" className="text-center" style={{width:'250px', fontSize:"1rem"}}>
                                                    <span onClick={() => this.openOrder(order.DocNum)}>
                                                        <i className={config.icons.detail} style={{color: config.Back.color, paddingRight: 6}}></i>
                                                        Detalle
                                                    </span>
                                                </th>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>


            <div>
                <div className="modal fade" id="overDuebillModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{border: "none", textAlign: 'center'}}>
                    <div className="modal-dialog modal-xl" role="document" style={{margin: '1.75rem auto'}}>
                        <div className="modal-content">
                            <div className="modal-header" style={{background: '#0060EA'}}>
                                <h5 className="modal-title" style={{color: config.navBar.textColor2}}>FACTURA DE RESERVA</h5>
                                <button type="button" style={{color: config.navBar.textColor2}} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body bg3" style={{maxHeight: '70vh', overflow: 'auto', padding:'1.5rem'}}>

                                <h3 className="text-center font-weight-bold" style={{fontSize:'1.4rem'}}>Detalle de la factura de reserva</h3> 
                               
                                    {/* {console.log("117>>>>>>>>>>>>>>>orderModal",orderModal)} */}
                                        <div className="tab-pane table-responsive tableReports" id="tres" role="tabpanel" aria-labelledby="tres-tab">
                                            <table id="tablaOverFour" className="table table-striped scrolltable">
                                                <thead style={{textAlign: "-webkit-center"}}>
                                                    <tr style={{backgroundColor: '#0060EA', color: "white", width:'250px', fontSize:"1rem"}}>
                                                    <th scope="col">No. documento</th>
                                                    <th scope="col">Fecha del documento</th>
                                                    <th scope="col">Fecha del vencimiento</th>
                                                    <th scope="col">Cant. de articulos</th>
                                                    <th scope="col">Cant. de unidades</th>
                                                    <th scope="col">Adeudo</th>
                                                    <th scope="col" className="text-center">Días transcurridos</th>
                                                    <th scope="col" className="text-center">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody style={{textAlign: "-webkit-center"}}>
                                                    {orderModal.map((order, index)=>{
                                                        return (
                                                            <tr key={index} style={{width:'250px', fontSize:"1rem"}}>
                                                                <th scope="row" style={{width:'250px', fontSize:"1rem"}}>{order.DocNum}</th>
                                                                <td style={{width:'250px', fontSize:"1rem"}}>{moment(order.DocDate).utc().format('YYYY-MM-DD')}</td>
                                                                <td style={{width:'250px', fontSize:"1rem"}}>{moment(order.DocDueDate).utc().format('YYYY-MM-DD')}</td>
                                                                {/* <td>{order.Weight1 === null ? '0 KG' : parseFloat(order.Weight1).toFixed(2)+ ' KG'}</td>
                                                                <td>{order.Weight2 === null ? '0 KG' : parseFloat(order.Weight2).toFixed(2)+ ' KG'}</td> */}
                                                                <td style={{width:'250px', fontSize:"1rem"}}>{parseInt(order.Cant)}</td>
                                                                <td style={{width:'250px', fontSize:"1rem"}}>{parseInt(order.Unit)}</td>
                                                                <td className="" style={{width:'250px', fontSize:"1rem"}}>
                                                                    <CurrencyFormat 
                                                                        value={order.PORVENCER || 0} 
                                                                        displayType={'text'} 
                                                                        thousandSeparator={true} 
                                                                        fixedDecimalScale={true} 
                                                                        decimalScale={2} 
                                                                        prefix={'$ '}
                                                                        suffix={config.general.currency}>
                                                                    </CurrencyFormat>
                                                                </td>
                                                                <td className="text-center" style={{width:'250px', fontSize:"1rem"}}>{order.DIAS}</td>
                                                                <th scope="row" className="text-center" style={{width:'250px', fontSize:"1rem"}}>
                                                                    <CurrencyFormat 
                                                                        value={order.DocTotal} 
                                                                        displayType={'text'} 
                                                                        thousandSeparator={true} 
                                                                        fixedDecimalScale={true} 
                                                                        decimalScale={2} 
                                                                        prefix={'$ '}
                                                                        suffix={config.general.currency}>
                                                                    </CurrencyFormat>
                                                                </th>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                            </div>
                            <div className="modal-footer">
                                <ExportReportOverDuePDF
                                    data={orderModal}
                                />
                                {/* <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    data-dismiss="modal"
                                    onClick={() => this.sendAttachment()} >
                                    ENVIAR POR CORREO
                                </button> */}
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            </div>
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
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(overdueViews);