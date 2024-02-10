import React, { Component } from 'react';
import { Footer, NavBar, Session, ProfieldModel, DocumentModel, ModaleMailPDF } from "../../components";
import { DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE, VIEW_NAME, config } from "../../libs/utils/Const";
import { ApiClient } from "../../libs/apiClient/ApiClient";
import { connect } from "react-redux";
import moment from 'moment';
import $ from 'jquery';
import {
    OrdersView,
    GeneralOrdersView,
    BillView,
    AbstractView,
    Quatiton,
    Delivery,
    Saveds,
    Preliminary,
    Collection,
    Overdue,
    SalesHistory,
} from '../index';

import { CSVLink, CSVDownload } from "react-csv";
import * as XLSX from 'xlsx';
import './reports.css';

let apiClient = ApiClient.getInstance();

class reportsView extends Component {
    csvLink = React.createRef();
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
            hoja: "",
            dataCsv: [],
            hojas: [],
            file: false,
            items: {
                header: {},
                body: []
            },
            usuario: '',
            data: [],
            fechaInicio: '',
            fechaFinal: '',
            overdueOne: [],
            opcion: 0,
            reportsData: [],
            fechamin: moment(newDate).format('YYYY-MM-DD'),
            fechamax: moment(new Date()).format('YYYY-MM-DD'),
            isLoaded: false,
            user: JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'CurrentUser')),
            oneOrder: '',   // Numero de orden a buscar
            itemCodeSearch: '',
            seller: JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser')),
            print:[],
            docsToPrint: [],
            docsToPrintCopy: [],
            filter: ''
        };
    }

    async componentDidMount() {
        const { enableSpinner } = this.props;
        enableSpinner(true);
        let response = await apiClient.getDataProfiel();
        try {
            let creatorUser = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
            this.setState({
                usuario: creatorUser
            });
        } catch (error) {

        }
        enableSpinner(false);
        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            this.setState({
                order: response.data,
            })
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        let fechaInicio = moment(new Date()).format('YYYY-MM-DD');
        let fechaFinal = moment(new Date()).format('YYYY-MM-DD');
        this.setState({
            fechaInicio,
            fechaFinal
        });
        //Obtener la información de la sección por defecto (Pedidos)
        this.onClickGetData(11)
    };
    async handleInputChange(event) {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        const this2 = this
        this.setState({
            [name]: value
        })
        let hojas = []
        if (name === 'file') {
            let reader = new FileReader()
            reader.readAsArrayBuffer(target.files[0])
            reader.onloadend = (e) => {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, { type: 'array' });
                workbook.SheetNames.forEach(function (sheetName) {
                    // Here is your object
                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    hojas.push({
                        data: XL_row_object,
                        sheetName
                    })
                });
                this2.setState({
                    selectedFileDocument: target.files[0],
                    hojas
                });
                if (hojas[0]) {
                    this.openDetail(hojas[0]);
                }
            }
        }
    };

    openDetail = async docEntry => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        enableSpinner(true);
        //console.log("las hojas",docEntry);
        let response = await apiClient.getDataDocuemt(docEntry);
        enableSpinner(false);

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            this.setState({
                items: response.data,
            });
            $('#docuementModal').modal('show');
            $("#file").val(null);
            return;
        }

        showAlert({ type: 'error', message: response.message })
    };

    openOrder = () => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        const { user } = this.state;
        enableSpinner(true);

        if (user !== null) {
            $('#dataProfiel').modal('show');
        } else {
            showAlert({ type: 'warning', message: "No hay un cliente seleccionado" })
        }

        enableSpinner(false);
        return;
    };

    onClickGetData = async (opcion) => {
        let fechaInicio = moment(new Date()).format('YYYY-MM-DD')
        let fechaFinal = moment(new Date()).format('YYYY-MM-DD')
        this.setState({
            fechaInicio,
            fechaFinal,
            data: [],
            isLoaded: false
        });
        setTimeout(async () => {
            await this.getData(opcion);
        }, 700);
    };

    getData = async (opcion, filter) => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        const { fechaInicio, fechaFinal, fechamin, usuario, oneOrder, itemCodeSearch } = this.state;
        let response = [];

        this.setState({
            docsToPrint: [],
            docsToPrintCopy: []
        });
        this.setState({
            print:[]
        })

        enableSpinner(true);
        if (opcion === 1) {
            response = await apiClient.getSaveds(!this.state.isLoaded ? fechamin : fechaInicio, fechaFinal);
        } else if (opcion === 2) {
            response = await apiClient.getPreliminarys(!this.state.isLoaded ? fechamin : fechaInicio, fechaFinal);
        }
        // if(opcion === 1){
        //     response = await apiClient.getOrders(fechaInicio,fechaFinal);
        // }else if(opcion === 2){
        //     response = await apiClient.getPreliminarys(fechaInicio,fechaFinal);
        // }
        else if (opcion === 3) {
            response = await apiClient.getBills(!this.state.isLoaded ? fechamin : fechaInicio, fechaFinal);
            if (response.status = SERVICE_RESPONSE.SUCCESS) {
                for (let index = 0; index < response.data.length; index++) {
                    const element = response.data[index];
                    if (element.DownloadFacturaPDF) {
                        let direccion = element.DownloadFacturaPDF;
                        let array = direccion.split('\\');
                        let sinpunto = array[(array.length) - 1].split('.');
                        element.DownloadFacturaPDF = sinpunto[0];
                        element.DownloadFacturaXML = sinpunto[0];
                    }
                }
            }
        } else if (opcion === 4) {
            response = await apiClient.getOverdueOne();
        } else if (opcion === 5) {
            response = await apiClient.getCollections(!this.state.isLoaded ? fechamin : fechaInicio, fechaFinal);
        } else if (opcion === 6) {
            response = await apiClient.getDelivery(!this.state.isLoaded ? fechamin : fechaInicio, fechaFinal);
            //response = await apiClient.getCollections(fechaInicio,fechaFinal);
            // let creatorUser = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
            // let data = {
            //     slpCode: creatorUser.salesPrson, 
            //     fechauno: moment(fechaInicio).format('YYYYMMDD') ,
            //     fechados: moment(fechaFinal).format('YYYYMMDD') ,
            // }
            // response = await apiClient.getDataResumen(data);
        } else if (opcion === 7) {
            response = await apiClient.getQuotation(!this.state.isLoaded ? fechamin : fechaInicio, fechaFinal);
        } else if (opcion === 8) {
            response = await apiClient.getGeneralOrdersView(!this.state.isLoaded ? fechamin : fechaInicio, fechaFinal, usuario.salesPrson);
            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                for (let index = 0; index < response.data.length; index++) {
                    const element = response.data[index];
                    if (element.DownloadOrderPDF) {
                        let direccion = element.DownloadOrderPDF;
                        let array = direccion.split('\\');
                        // let sinpunto = array[(array.length) - 1].split('.');
                        element.DownloadOrderPDF = array[(array.length) - 1];
                    }
                }
            } else {

            }
        } else if (opcion === 9) {
            if (oneOrder && oneOrder != '' && !isNaN(oneOrder)) {
                response = await apiClient.getOneOrder(oneOrder);
                this.setState({
                    oneOrder: ''
                });
            } else if (isNaN(oneOrder)) {
                showAlert({ type: 'error', message: 'El pedido debe ser número', timeOut: 8000 });
                enableSpinner(false);
                return
            }else{
                showAlert({ type: 'error', message: 'Escriba un No. de pedido', timeOut: 8000 });
                enableSpinner(false);
                return
            }
        } else if (opcion === 10) {
            const init = new Date(!this.state.isLoaded ? fechamin : fechaInicio);
            const final = new Date(fechaFinal)
            const difTime = final - init
            const secMonth = 30 * 24 * 60 * 60 * 1000
            const difMonth = difTime / secMonth
            if(difMonth > 18){
                showAlert({ type: 'error', message: 'Ingrese una fecha menor a 18 meses entre ellas', timeOut: 8000 });
                enableSpinner(false);
                return 
            }
            response = await apiClient.getHistory(!this.state.isLoaded ? fechamin : fechaInicio, fechaFinal, 'null', filter);

            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                // Verificar si hay un filtro
                if (filter) {

                    // Aplicar el filtro a response.data
                    const filteredData = response.data.filter(element => {
                        // Verificar si ItemCode o ItmsGrpNam(Marca) coincide con el filtro
                        return element.ItemCode.includes(filter) ||  element.ItemName.toLowerCase().includes(filter.toLowerCase()) || element.U_Linea.toLowerCase().includes(filter.toLowerCase());
                    });

                    // Verificar si se encontraron elementos que coinciden
                    if (filteredData.length > 0) {
                        // Actualizar response.data con los elementos filtrados
                        response.data = filteredData;

                        for (let index = 0; index < response.data.length; index++) {
                            const element = response.data[index];

                            if (element.DownloadOrderPDF) {
                                let direccion = element.DownloadOrderPDF;
                                let array = direccion.split('\\');
                                // let sinpunto = array[(array.length) - 1].split('.');
                                // element.DownloadOrderPDF = sinpunto[0];
                                element.DownloadOrderPDF = array[(array.length) - 1]
                            }
                            if (element.U_FMB_ComprobantePago) {
                                let direccion = element.U_FMB_ComprobantePago;
                                let array = direccion.split('\\');
                                // let sinpunto = array[(array.length) - 1].split('.');
                                // element.U_FMB_ComprobantePago = sinpunto[0];
                                element.U_FMB_ComprobantePago = array[(array.length) - 1]
                            }
                        }
                        this.setState({
                            docsToPrint: [],
                            docsToPrintCopy: []
                        })
                    } else {
                        // No se encontraron elementos que coincidan con el filtro
                        showAlert({ type: 'error', message: 'No se encontraron registros que coincidan con el filtro.' })
                        this.setState({
                            docsToPrint: [],
                            docsToPrintCopy: [],
                            filter: ''
                        })
                    }
                } else {
                    // No hay filtro, muestra la respuesta normal
                    for (let index = 0; index < response.data.length; index++) {
                        const element = response.data[index];
                        if (element.DownloadOrderPDF) {
                            let direccion = element.DownloadOrderPDF;
                            let array = direccion.split('\\');
                            // let sinpunto = array[(array.length) - 1].split('.');
                            // element.DownloadOrderPDF = sinpunto[0];
                            element.DownloadOrderPDF = array[(array.length) - 1]
                        }
                        if (element.U_FMB_ComprobantePago) {
                            let direccion = element.U_FMB_ComprobantePago;
                            let array = direccion.split('\\');
                            // let sinpunto = array[(array.length) - 1].split('.');
                            // element.U_FMB_ComprobantePago = sinpunto[0];
                            element.U_FMB_ComprobantePago = array[(array.length) - 1]
                        }
                    }
                    this.setState({
                        filter: ''
                    })
                }
            }
        }
         else if (opcion === 11) {
            response = await apiClient.getOrders(!this.state.isLoaded ? fechamin : fechaInicio, fechaFinal);
            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                for (let index = 0; index < response.data.length; index++) {
                    const element = response.data[index];
                    if (element.DownloadOrderPDF) {
                        let direccion = element.DownloadOrderPDF;
                        let array = direccion.split('\\');
                        // let sinpunto = array[(array.length) - 1].split('.');
                        // element.DownloadOrderPDF = sinpunto[0];
                        element.DownloadOrderPDF = array[(array.length) - 1]
                    }
                    if (element.U_FMB_ComprobantePago) {
                        let direccion = element.U_FMB_ComprobantePago;
                        let array = direccion.split('\\');
                        // let sinpunto = array[(array.length) - 1].split('.');
                        // element.U_FMB_ComprobantePago = sinpunto[0];
                        element.U_FMB_ComprobantePago = array[(array.length) - 1]
                    }
                }
            }
        }
        enableSpinner(false);

        if (response.status != SERVICE_RESPONSE.SUCCESS) {
            showAlert({ type: 'error', message: 'Ocurrió un error al consultar la Información' });
            return;
        }

        if (!Array.isArray(response.data)) {
            showAlert({ type: 'error', message: 'Ocurrió un error al consultar la Información' });

        }

        if (response.data.length === 0) {
            showAlert({ type: 'info', message: 'No hay Información por mostrar' });
            // return;
        }
        setTimeout(async () => {
            this.setState({
                data: response.data || [],
                opcion,
            });
        }, 50);

    }
    // Actualiza valor de no. orden conF
    inputDocNum = event => {
        let DocNum = event.nativeEvent.target.value;
        this.setState({
            oneOrder: DocNum
        });
    }

    inputItemCode = event => {
        let itemCodeSelect = event.nativeEvent.target.value;
        this.setState({
            itemCodeSearch: itemCodeSelect
        });
    }

    handleInputDateInicio = event => {
        let fechaInicio = event.nativeEvent.target.value;
        this.setState({
            isLoaded: true,
            fechaInicio
        });
    }

    handleInputDateFinal = event => {
        let fechaFinal = event.nativeEvent.target.value;
        this.setState({
            fechaFinal
        });
    }

    handleInputFilter = event => {
        this.setState({
            filter: event.nativeEvent.target.value
        });
    }

    generateCSV = async () => {
        let datacsv = [["", "DESCRIPCIÓN", "UNIDADES SOLICITADAS", "CODIGO EAN", "PTV-RINTI", "desde"],
        ["", "DESCRIPCIÓN", "UNIDADES SOLICITADAS", "CODIGO EAN", "PTV-RINTI", "desde"]]

        this.setState({ dataCsv: datacsv })

    };

    openModalMailPDF = async () => {
        setTimeout(() => {
            $('#ModalSendPDF').modal('show');
        }, 500);
    };

    changeDocsToPrint = async (docEntry) => {
        const { docsToPrint } = this.state;
        const index = docsToPrint.indexOf(docEntry);
      
        if (index === -1) {
          this.setState({
            docsToPrint: [...docsToPrint, docEntry]
          });
        } else {
          const updatedDocsToPrint = docsToPrint.slice();
          updatedDocsToPrint.splice(index, 1);
          this.setState({
            docsToPrint: updatedDocsToPrint
          });
        }  
    }

    changeDocsToPrintCopy = async (docEntry) => {
        const { docsToPrintCopy } = this.state;
        const index = docsToPrintCopy.indexOf(docEntry);
      
        if (index === -1) {
          this.setState({
            docsToPrintCopy: [...docsToPrintCopy, docEntry]
          });
        } else {
          const updatedDocsToPrint = docsToPrintCopy.slice();
          updatedDocsToPrint.splice(index, 1);
          this.setState({
            docsToPrintCopy: updatedDocsToPrint
          });
        }  
    }

    render() {
        const { history } = this.props;
        const { order, items, dataCsv, usuario, data, fechaInicio, fechaFinal, fechamin, fechamax, isLoaded, oneOrder, seller, docsToPrint, docsToPrintCopy, user, filter} = this.state;

        return (
            <div className="content-fluid reports" style={{ marginTop: 150, paddingBottom: 20, paddingRight: 0, backgroundColor: config.Back.backgroundColor }}>
                <Session history={history} view={VIEW_NAME.ABOUT_US_VIEW} />
                <NavBar isShowMarcas={false} />
                <ProfieldModel />
                <DocumentModel order={items} />

                <CSVLink
                    data={dataCsv}
                    filename={"plantilla.csv"}
                    className="hidden"
                    ref={this.csvLink}
                    target="_blank" />
                <ModaleMailPDF />

                <div className="content-fluid mx-3" >
                    <div className="row">
                        <div className="col-md-12 MargenSuperior">
                            {/* <h2>Reportessss</h2> */}
                        </div>

                    </div>
                    {/* <div className="row justify-content-end">
                        <div className="col-md-2 ms-auto" style={{cursor: 'pointer', color: 'blue', textAlign:'right'}} >
                            <a onClick={() => this.openOrder()} style={{cursor: 'pointer'}}>
                                <i className={config.icons.detail} style={{color: config.shoppingList.summaryList, paddingRight: 6}}></i>
                                Información de la cuenta
                            </a>
                        </div>
                    </div> */}
                    {/* <div className="row">
                        <div className="col-sm-6">
                            <label>Subir desde un excel</label>
                            <input type="file" name="file" id="file" onChange={this.handleInputChange}  placeholder="Archivo de excel" className="form-control-file" ></input>
                        </div>
                        <div className="col-sm-6">

                        </div>
                    </div> */}
                    <div className="row p-2">
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <ul className="nav nav-tabs" id="myTab" role="tablist" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                {seller ? seller.U_FMB_Handel_Perfil !== '0' ?
                                    <li className="nav-item">
                                        <a className="nav-link" id="quatations-tab" data-toggle="tab" href="#quatations" role="tab" aria-controls="quatations" onClick={() => this.onClickGetData(7)} aria-selected="false">Oferta de Venta</a>
                                    </li>
                                    : "" : ""
                                }
                                <li className="nav-item">
                                    {/* <a className="nav-link active" id="pedido-tab" data-toggle="tab" href="#pedido" role="tab" aria-controls="pedido" onClick={() => this.onClickGetData(1)} aria-selected="true">Pedidos</a> */}
                                    <a className="nav-link active" id="pedido-tab" data-toggle="tab" href="#pedido" role="tab" aria-controls="pedido" onClick={() => this.onClickGetData(11)} aria-selected="true">Pedidos</a>
                                </li>
                                {seller ? seller.U_FMB_Handel_Perfil !== '0' ?
                                    <li className="nav-item">
                                        <a className="nav-link" id="preliminar-tab" data-toggle="tab" href="#preliminar" role="tab" aria-controls="preliminar" onClick={() => this.onClickGetData(2)} aria-selected="false">Autorizaciones</a>
                                    </li>
                                    : "" : ""
                                }
                                <li className="nav-item">
                                    <a className="nav-link" id="entrega-tab" data-toggle="tab" href="#entrega" role="tab" aria-controls="entrega" onClick={() => this.onClickGetData(6)} aria-selected="false">Entregas</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="guardados-tab" data-toggle="tab" href="#guardados" role="tab" aria-controls="guardados" onClick={() => this.onClickGetData(1)} aria-selected="false">Guardados</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="factura-tab" data-toggle="tab" href="#factura" role="tab" aria-controls="factura" onClick={() => this.onClickGetData(3)} aria-selected="false">Facturas</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="vencidas-tab" data-toggle="tab" href="#vencidas" role="tab" aria-controls="vencidas" onClick={() => this.onClickGetData(4)} aria-selected="false">Facturas vencidas</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="cobranza-tab" data-toggle="tab" href="#cobranza" role="tab" aria-controls="cobranza" onClick={() => this.onClickGetData(5)} aria-selected="false">Cobranza</a>
                                </li>
                                {seller ? seller.U_FMB_Handel_Perfil !== '0' ?
                                    <li className="nav-item">
                                        <a className="nav-link" id="PedidosGenerales-tab" data-toggle="tab" href="#PedidosGenerales" role="tab" aria-controls="PedidosGenerales" onClick={() => this.onClickGetData(8)} aria-selected="false">Pedidos Generales</a>
                                    </li>
                                    : "" : ""
                                }
                                <li className="nav-item">
                                    <a className="nav-link" id="HistorialCompra-tab" data-toggle="tab" href="#HistorialCompra" role="tab" aria-controls="HistorialCompra" onClick={() => this.onClickGetData(10)} aria-selected="false">Historial de compra</a>
                                </li>
                                {/* {
                                    usuario.U_FMB_Handel_Perfil === "2" && */}
                                {/* <li className="nav-item">
                                        <a className="nav-link" id="resumen-tab" data-toggle="tab" href="#resumen" role="tab" aria-controls="resumen" aria-selected="false">Resumen</a>
                                    </li> */}
                                {/* } */}

                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="pedido" role="tabpanel" aria-labelledby="pedido-tab">
                                    {/* <OrdersView 
                                    orders={data} 
                                    getData = {this.getData} 
                                    handleInputDateInicio = {this.handleInputDateInicio} 
                                    handleInputDateFinal = {this.handleInputDateFinal} 
                                    fechaInicio = {fechaInicio} 
                                    fechaFinal = {fechaFinal}/> */}
                                    <OrdersView
                                        orders={data}
                                        getData={this.getData}
                                        handleInputDateInicio={this.handleInputDateInicio}
                                        handleInputDateFinal={this.handleInputDateFinal}
                                        fechaInicio={fechaInicio}
                                        fechaFinal={fechaFinal}
                                        fechamin={fechamin}
                                        fechamax={fechamax}
                                        isLoaded={isLoaded}
                                        docsToPrint={docsToPrint}
                                        changeDocsToPrint={this.changeDocsToPrint}
                                        inputDocNum={this.inputDocNum}
                                        oneOrder={oneOrder}/>

                                </div>
                                <div className="tab-pane fade" id="quatations" role="tabpanel" aria-labelledby="quatations-tab">
                                    <Quatiton
                                        orders={data}
                                        getData={this.getData}
                                        handleInputDateInicio={this.handleInputDateInicio}
                                        handleInputDateFinal={this.handleInputDateFinal}
                                        fechaInicio={fechaInicio}
                                        fechaFinal={fechaFinal}
                                        fechamin={fechamin}
                                        fechamax={fechamax}
                                        isLoaded={isLoaded}
                                        docsToPrint={docsToPrint}
                                        changeDocsToPrint={this.changeDocsToPrint}/>
                                </div>
                                <div className="tab-pane fade" id="factura" role="tabpanel" aria-labelledby="factura-tab">
                                    <BillView
                                        orders={data}
                                        getData={this.getData}
                                        handleInputDateInicio={this.handleInputDateInicio}
                                        handleInputDateFinal={this.handleInputDateFinal}
                                        fechaInicio={fechaInicio}
                                        fechaFinal={fechaFinal}
                                        fechamin={fechamin}
                                        fechamax={fechamax}
                                        isLoaded={isLoaded} 
                                        docsToPrint={docsToPrint}
                                        changeDocsToPrint={this.changeDocsToPrint}
                                        user={user}/>
                                </div>
                                {/* <div className="tab-pane fade" id="cotizacion" role="tabpanel" aria-labelledby="cotizacion-tab">
                                    <Quatiton/>
                                </div> */}
                                <div className="tab-pane fade" id="entrega" role="tabpanel" aria-labelledby="entrega-tab">
                                    <Delivery
                                        orders={data}
                                        getData={this.getData}
                                        handleInputDateInicio={this.handleInputDateInicio}
                                        handleInputDateFinal={this.handleInputDateFinal}
                                        fechaInicio={fechaInicio}
                                        fechaFinal={fechaFinal}
                                        fechamin={fechamin}
                                        fechamax={fechamax}
                                        isLoaded={isLoaded} 
                                        docsToPrint={docsToPrint}
                                        changeDocsToPrint={this.changeDocsToPrint}/>
                                </div>
                                <div className="tab-pane fade" id="guardados" role="tabpanel" aria-labelledby="guardados-tab">
                                    <Saveds
                                        orders={data}
                                        getData={this.getData}
                                        handleInputDateInicio={this.handleInputDateInicio}
                                        handleInputDateFinal={this.handleInputDateFinal}
                                        fechaInicio={fechaInicio}
                                        fechaFinal={fechaFinal}
                                        fechamin={fechamin}
                                        fechamax={fechamax}
                                        isLoaded={isLoaded}
                                        openModalMailPDF={this.openModalMailPDF} 
                                        docsToPrint={docsToPrint}
                                        changeDocsToPrint={this.changeDocsToPrint}
                                        docsToPrintCopy= {docsToPrintCopy}
                                        changeDocsToPrintCopy={this.changeDocsToPrintCopy}
                                        user={user}/>
                                </div>
                                <div className="tab-pane fade" id="preliminar" role="tabpanel" aria-labelledby="preliminar-tab">
                                    <Preliminary
                                        orders={data}
                                        getData={this.getData}
                                        handleInputDateInicio={this.handleInputDateInicio}
                                        handleInputDateFinal={this.handleInputDateFinal}
                                        fechaInicio={fechaInicio}
                                        fechaFinal={fechaFinal}
                                        fechamin={fechamin}
                                        fechamax={fechamax}
                                        isLoaded={isLoaded}
                                        docsToPrint={docsToPrint}
                                        changeDocsToPrint={this.changeDocsToPrint}
                                        docsToPrintCopy= {docsToPrintCopy}
                                        changeDocsToPrintCopy={this.changeDocsToPrintCopy}/>
                                </div>
                                {/* <div className="tab-pane fade" id="preliminar" role="tabpanel" aria-labelledby="preliminar-tab">
                                    <Preliminary/>
                                </div> */}
                                <div className="tab-pane fade" id="cobranza" role="tabpanel" aria-labelledby="cobranza-tab">
                                    <Collection
                                        orders={data}
                                        getData={this.getData}
                                        handleInputDateInicio={this.handleInputDateInicio}
                                        handleInputDateFinal={this.handleInputDateFinal}
                                        fechaInicio={fechaInicio}
                                        fechaFinal={fechaFinal}
                                        fechamin={fechamin}
                                        fechamax={fechamax}
                                        isLoaded={isLoaded}
                                        docsToPrint={docsToPrint}
                                        changeDocsToPrint={this.changeDocsToPrint}
                                        user={user}/>
                                </div>
                                {/* ##############################################Solis */}
                                <div className="tab-pane fade" id="PedidosGenerales" role="tabpanel" aria-labelledby="PedidosGenerales-tab">
                                    <GeneralOrdersView
                                        orders={data}
                                        getData={this.getData}
                                        handleInputDateInicio={this.handleInputDateInicio}
                                        handleInputDateFinal={this.handleInputDateFinal}
                                        oneOrder={oneOrder}  //  conF 
                                        fechaInicio={fechaInicio}
                                        fechaFinal={fechaFinal}
                                        fechamin={fechamin}
                                        fechamax={fechamax}
                                        isLoaded={isLoaded}
                                        inputDocNum={this.inputDocNum}   // actualizar DocNum
                                        docsToPrint={docsToPrint}
                                        changeDocsToPrint={this.changeDocsToPrint}
                                        docsToPrintCopy= {docsToPrintCopy}
                                        changeDocsToPrintCopy={this.changeDocsToPrintCopy}
                                    />
                                </div>

                                <div className="tab-pane fade" id="HistorialCompra" role="tabpanel" aria-labelledby="HistorialCompra-tab">
                                    <SalesHistory
                                        orders={data}
                                        getData={this.getData}
                                        handleInputDateInicio={this.handleInputDateInicio}
                                        handleInputDateFinal={this.handleInputDateFinal}
                                        fechaInicio={fechaInicio}
                                        fechaFinal={fechaFinal}
                                        fechamin={fechamin}
                                        fechamax={fechamax}
                                        isLoaded={isLoaded}
                                        inputItemCode={this.inputItemCode}
                                        docsToPrint={docsToPrint}
                                        changeDocsToPrint={this.changeDocsToPrint}
                                        user={user}
                                        handleInputFilter={this.handleInputFilter}
                                        filter={filter}
                                    />
                                </div>

                                <div className="tab-pane fade" id="vencidas" role="tabpanel" aria-labelledby="vencidas-tab">
                                    <Overdue overdueOne={data} getData={this.getData} openModalMailPDF={this.openModalMailPDF} />
                                </div>
                                {/* {
                                    usuario.U_FMB_Handel_Perfil === "2" && */}
                                <div className="tab-pane fade" id="resumen" role="tabpanel" aria-labelledby="resumen-tab">
                                    <AbstractView
                                        handleInputDateInicio={this.handleInputDateInicio}
                                        handleInputDateFinal={this.handleInputDateFinal}
                                        fechaInicio={fechaInicio}
                                        fechaFinal={fechaFinal} />
                                </div>
                                {/* } */}

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
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(reportsView);