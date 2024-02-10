import React, { Component } from 'react';
import { Footer, NavBar, Session, NotificationsModal } from "../../components";
//import {VIEW_NAME, config} from "../../libs/utils/Const";
import { DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE, VIEW_NAME, config } from "../../libs/utils/Const";
import { ApiClient } from "../../libs/apiClient/ApiClient";
import CurrencyFormat from 'react-currency-format';
import { connect } from "react-redux";
import '../../index.css';
import * as XLSX from 'xlsx';
import { CSVLink, CSVDownload } from "react-csv";
import $ from 'jquery';
import './autorizaciones.css'
import moment from "moment";
import { animateScroll as scroll, scroller } from 'react-scroll';

let apiClient = ApiClient.getInstance();

const formatNumber = {
    separador: ',', // separador para los miles
    sepDecimal: '.', // separador para los decimales
    formatear: function (num) {
        num += '';
        let splitStr = num.split('.');
        let splitLeft = splitStr[0];
        let splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
        let regx = /(\d+)(\d{3})/;
        while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
        }
        return this.simbol + splitLeft + splitRight;
    },
    new: function (num, simbol) {
        this.simbol = simbol || '';
        if (typeof num == 'undefined') {
            num = 0;
        }
        if (isNaN(num)) {
            return num;
        }
        return this.formatear(Number(num).toFixed(2));
    },
};

class AutorizacionesView extends Component {
    // csvLink = React.createRef()
    constructor(props) {
        super(props);
        const f = new Date();
        const newDate = new Date(f.setMonth(f.getMonth() + +(-3)))
        this.state = {
            Codigo: '',
            Autorizaciones: [],
            Tipo: 'W',
            order: [],
            csvData: [],
            checkboxDataTables: new Map(),
            responseArray: [],
            editar: false,
            GroupNum: '',
            Total: '',
            fechaInicio: moment(newDate).format('YYYY-MM-DD'),
            fechaFinal: moment(new Date()).format('YYYY-MM-DD'),
            fechamin: moment(newDate).format('YYYY-MM-DD'),
            fechamax: moment(new Date()).format('YYYY-MM-DD'),
            isLoaded: false,
            infoSN: {},
            newComment: '',
            commentLengthError: false,
            comments: [],
            newIncident: '', // Agregamos un estado para la incidencia
            currentDateTime: "",

        };
        this.table = null;
        this.scrollToBottom = this.scrollToBottom.bind(this);
    };
    async componentDidMount() {
        const { enableSpinner } = this.props;
        enableSpinner(true);
        this.cargarDatos();
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
    DocTimeFormat = (docTime) => {
        let time = (docTime || '').toString();

        if (time.length > 2) {
            let position = time.length - 2;
            time = time.slice(0, position) + ":" + time.slice(position, time.length)
        } else {
            time = `00:${time}`;
        }

        return time;
    }

    DocInfo = (HandelCreator) => {
        let creador = HandelCreator.U_FMB_Handel_Creador || null;
        if (creador) {
            let info = creador.split(',');
            if (info.length > 2) {
                let response = `Creador: ${info[2]}`;
                response += info[3] ? `, Correo: ${info[3]}` : '';
                return response;
            } else if (info.length > 1) {
                let response = `Creador: ${info[1]}`;
                response += info[2] ? `, Correo: ${info[2]}` : '';
                return response;
            } else if (creador.includes('B2B:')) {
                let response = creador;
                return response;
            } else {
                return `Información no disponible`;
            }

        } else {
            return `Información no disponible`;
        }
    }

    async cargarDatos() {
        const { Tipo, fechaInicio, fechaFinal } = this.state;
        const { enableSpinner } = this.props;
        enableSpinner(true);
        let user = localStorage.getItem(config.general.localStorageNamed + 'CurrentUser');
        user = JSON.parse(user) || {};

        let usuario = user ? user.USERID : '1';
        document.getElementById("commentarios").value = '';
        document.getElementById("commentariosAutorizar").value = '';
        let data = {
            user: usuario,
            type: Tipo,
            fechaInicio,
            fechaFinal
        }
        let newdatas = await apiClient.getAutorizaciones(data);
        // let nuevos = [];
        // if(Tipo === 'W'){
        //     for (let i = 0; i < newdatas.data.list.length; i++) {
        //         const element = newdatas.data.list[i];
        //         let bandera = true;               
        //         nuevos.map((arr) => {
        //             if(arr.DocEntry === element.DocEntry){
        //                 bandera = false;
        //                 element.Disabled = true;
        //             }
        //         })
        //         if(bandera){
        //             nuevos.push(newdatas.data.list[i])
        //         }
        //     }
        // }
        for (let index = 0; index < newdatas.data.list.length; index++) {
            const element = newdatas.data.list[index];
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
            Autorizaciones: newdatas.data.list,
            usuario: usuario,
            hola: newdatas.data,
            user: user
        });

        this.table = $('#tablaAutorizaciones').DataTable({

            "paging": false,
            "info": false,
            "searching": false,
            "order": [[0, 'desc']],
            "language": {
                "lengthMenu": "Mostrar _MENU_ registros por página",
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



        enableSpinner(false);
    };

    async getProfileData(code) {
        // Información del modal
        await apiClient.dataProfileCode(code).then((response) => {
            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                this.setState({
                    infoSN: response.data.body[0]
                });
            };
        });
    }

    Details = async (valor, U_CurrStep, canal, tipo) => {
        const { enableSpinner } = this.props;
        const { usuario, Tipo, user, fechaInicio, fechaFinal, Autorizaciones } = this.state;
        enableSpinner(true);
        let credit = false;

        if (tipo === 'OV-LINEADECREDITO') {
            credit = true;
        }

        let data = {
            user: usuario,
            type: Tipo,
            fechaInicio,
            fechaFinal
        }

        let newdatas = await apiClient.getAutorizaciones(data);

        let articulos = '';
        newdatas.data.list.map(auto => {
            if (auto.DocEntry === valor) {
                articulos = auto.CartShop;
            }
        })
        let response = await apiClient.getDatailsAuto(valor);
        const selectAuto = Autorizaciones.find(({ DocEntry }) => DocEntry === valor);

        enableSpinner(false);
        let csvData = [];

        let infoCsv = response.data.body;
        infoCsv.map((item) => {
            let row = {
                'Producto': item.ItemName,
                'Código SAP': item.ItemCode,
                'Peso KG': parseFloat(item.SWeight1 || 0).toFixed(2) + ' KG',
                'Cantidad': item.Quantity,
                // 'Total Peso Neto' : parseFloat(item.Quantity * item.SWeight1).toFixed(2) + ' KG', 
                // 'Total Peso Bruto' : parseFloat(item.Quantity * item.IWeight1).toFixed(2) + ' KG',
                'Precio': item.Currency + ' ' + parseFloat(item.Price).toFixed(2),
                'Total Precio': item.Currency + ' ' + parseFloat(item.LineTotal).toFixed(2),
                'Info': ' '
            }
            csvData.push(row);
        });

        for (let index = 0; index < 3; index++) {
            csvData.push({ 'Info': ' ' });
        }

        let hoy = new Date();
        var Hora = hoy.getHours();
        var Min = hoy.getMinutes();
        var Fecha = hoy.toLocaleDateString();
        csvData[0].Info = "RUC " + response.data.body[0].CardCode.substring(1) + "        " + Fecha + "-" + Hora + ":" + Min + "hs        " + user.CardName;
        csvData[1].Info = "NRO.SOLICITUD: " + response.data.body[0].DocEntry + " - FECHA : " + response.data.body[0].DocDueDate;
        csvData[2].Info = "CLIENTE: " + response.data.body[0].CardName + "        EMISIÓN: " + response.data.body[0].DocDate.substring(0, 10) + " - F.DESPACHO : " + response.data.body[0].DocDueDate; // - O/C : "+response.data.body[0].NumAtCard;
        csvData[3].Info = "VENDEDOR: " + this.DocInfo(response.data.body[0]);

        let group = response ? response.data.group : [];
        response = response ? response.data.body : []
        this.setState({
            order: response,
            DocEntry: valor,
            U_CurrStep: U_CurrStep,
            tipo: tipo,
            csvData,
            credit,
            CreditLine: response[0].CreditLine,
            Balance: response[0].Balance,
            OrdersBal: response[0].OrdersBal,
            PymntGroup: response[0].PymntGroup,
            ListGroupNum: group,
            editar: false,
            newComment: selectAuto?.Comments ?? '',
        });
        $('#saveModal').modal('show');
    }

    Autorizar = async response => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        const { DocEntry, usuario, U_CurrStep, tipo } = this.state;

        let comment = document.getElementById("commentariosAutorizar").value;
        let data = '';
        enableSpinner(true);

        if (comment.length <= 200) {
            data = {
                DocEntry: DocEntry,
                Usuario: usuario,
                WstCode: U_CurrStep,
                tipo: tipo,
                Comentario: comment
            };
        } else {
            showAlert({ type: 'error', message: 'Has excedido más de 200 caracteres.' });
            return;
        }
        let apiResponse = await apiClient.createAutorization(data);
        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            enableSpinner(false);
            if (apiResponse.message === 'Documento autorizado para su creación') {
                showAlert({ type: 'success', message: apiResponse.message });
            } else {
                showAlert({ type: 'warning', message: apiResponse.message })
            }
            $('#commentsAutorizacionModal').modal('hide');
            $('#saveModal').modal('hide');
            this.table.destroy();
            this.cargarDatos();
            return;
        }

        showAlert({ type: 'error', message: "Aviso: " + apiResponse.message });
        enableSpinner(false)
    };

    Rechazar = async response => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        const { DocEntry, usuario, U_CurrStep } = this.state;
        let comment = document.getElementById("commentarios").value;
        let data = '';
        if (comment.length <= 200) {
            data = {
                DocEntry: DocEntry,
                Usuario: usuario,
                WstCode: U_CurrStep,
                Comentario: comment
            };
        }
        else {
            showAlert({ type: 'error', message: 'Has excedido más de 200 caracteres.' });
            return;
        }

        enableSpinner(true);

        let apiResponse = await apiClient.rejectedAutorization(data);
        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            enableSpinner(false);
            showAlert({ type: 'error', message: "Aviso: " + apiResponse.message });
            $('#commentsModale').modal('hide');
            $('#saveModal').modal('hide');
            this.table.destroy();
            this.cargarDatos();
            return;
        }

        showAlert({ type: 'error', message: "Aviso: " + apiResponse.message });
        enableSpinner(false)
    };

    async handleInputChange(event) {
        var archivo = event.target.files[0];
        if (!archivo) {
            return;
        }
        var lector = new FileReader();
        lector.onload = function (e) {
            var contenido = e.target.result;
            var lineas = contenido.split('\n');

            for (var linea of lineas) {
                if (linea.substr(0, 3) === 'LIN') {
                }
            }
            //mostrarContenido(contenido);
        };
        lector.readAsText(archivo);
    };

    handleCommentChange = (event) => {
        this.setState({
            newComment: event.target.value,
        });
    };

    addHora = () => {
        const currentDateTime = new Date().toLocaleString(); // Obtener fecha y hora actual
        this.setState({
            currentDateTime,
        });
    };
    addComment = async () => {
        const { notificationReducer: { showAlert }, enableSpinner } = this.props;
        const { order, newComment } = this.state;
        if (newComment.length <= 254) {
            let docEntry = order.length > 0 ? order[0].DocEntry : null;
            if (!docEntry) {
                showAlert({ type: 'warning', message: ' Error al cargar documento ', timeOut: 8000 });
                return;
            }
            enableSpinner(true);
            let response = await apiClient.updateAuthorization([], true, docEntry, '', '', newComment);
            showAlert({ type: 'info', message: ' Comentario guardado correctamente ', timeOut: 3000 });
            enableSpinner(false);
            this.table.destroy();
            this.cargarDatos();
        }
    };


    // Función para manejar cambios en la incidencia
    handleIncidentChange = (e) => {
        this.setState({ newIncident: e.target.value });
    }
    // Función para agregar una incidencia
    addIncident = () => {
        const { newIncident } = this.state;
        // Realiza cualquier lógica de manejo de incidencias aquí
        // Limpia el campo de texto después de agregar
        this.setState({ newIncident: '' });
    }

    renderShoppingCartTotal = () => {
        const { order, editar } = this.state;
        let subTotal = 0;
        let total = 0;
        let IVA = 0;
        let precios = 0;
        !!order && order.map(item => {
            subTotal = item.DocTotal - item.VatSum;
            precios += parseFloat(item.Price * item.Quantity);
            // subTotal = subTotal === 0 ? precios : subTotal;
            total = item.DocTotal;
            IVA = item.VatSum;
        });
        // 
        subTotal = order.length > 0 ? order[0].DocTotal - order[0].VatSum : 0;
        total = order.length > 0 ? order[0].DocTotal : 0;
        IVA = order.length > 0 ? order[0].VatSum : 0;
        return (
            <div className="container" style={{ fontSize: 18 }}>
                <div className="row">
                    <div className="col-6" style={{ padding: 0 }}>
                        <span className="font-weight-bold">Subtotal: </span>
                    </div>
                    <div className="col-6 text-right" style={{ padding: 0 }}>
                        <span className="text-right">
                            <CurrencyFormat
                                value={subTotal}
                                displayType={'text'}
                                thousandSeparator={true}
                                fixedDecimalScale={true}
                                decimalScale={2}
                                prefix={'$ '}
                                suffix={config.general.currency}>
                            </CurrencyFormat>
                        </span>
                    </div>
                </div>
                <div className="row border-bottom">
                    <div className="col-6" style={{ padding: 0 }}>
                        <span className="font-weight-bold">
                            I.V.A.:
                        </span>
                    </div>
                    <div className="col-6 text-right" style={{ padding: 0 }}>
                        <span className="text-right">
                            <CurrencyFormat
                                //taxTotal
                                value={IVA}
                                displayType={'text'}
                                thousandSeparator={true}
                                fixedDecimalScale={true}
                                decimalScale={2}
                                prefix={'$ '}
                                suffix={config.general.currency}>
                            </CurrencyFormat>
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6" style={{ padding: 0 }}>
                        <span className="font-weight-bold">Total: </span>
                    </div>
                    <div className="col-6 text-right" style={{ padding: 0 }}>
                        <span className="text-right">
                            {editar ? (
                                <input
                                    type="text"
                                    className=" form-control validarCant cantBlur btn-outline-secondary"
                                    disabled={!editar ? true : false}
                                    style={{
                                        backgroundColor: !editar ? '#ededed' : 'transparent',
                                        borderColor: '#ced4da',
                                        color: '#000',
                                        paddingTop: 1,
                                        paddingBottom: 2,
                                        width: 130,
                                        textAlign: 'right',
                                        fontSize: 17
                                    }}
                                    id={'total'}
                                    value={total}
                                    onChange={event => this.changeDocTotal(event)}
                                />)
                                :
                                <CurrencyFormat
                                    value={total}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    fixedDecimalScale={true}
                                    decimalScale={2}
                                    prefix={'$ '}
                                    suffix={config.general.currency}>
                                </CurrencyFormat>
                            }
                        </span>
                    </div>
                </div>
            </div>
        )
    };

    renderCreditLimit = () => {
        const { CreditLine, Balance, OrdersBal, order } = this.state;
        const { incidentDescription } = this.state;
        const incidentBoxStyle = {
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginLeft: '28px',
        };

        const textAreaStyle = {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
        };

        const buttonStyle = {
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
        };
        return (
            <div className="container" style={{ fontSize: 18 }}>
                <div className="row">
                    <div className="col-7" style={{ padding: 0 }}>
                        <span className="font-weight-bold">Linea de crédito: </span>
                    </div>
                    <div className="col-5 text-right" style={{ padding: 0 }}>
                        <span className="text-right">
                            <CurrencyFormat
                                value={CreditLine}
                                displayType={'text'}
                                thousandSeparator={true}
                                fixedDecimalScale={true}
                                decimalScale={2}
                                prefix={'$ '}
                                suffix={config.general.currency}>
                            </CurrencyFormat>
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-7" style={{ padding: 0 }}>
                        <span className="font-weight-bold">Crédito utilizado: </span>
                    </div>
                    <div className="col-5 text-right" style={{ padding: 0 }}>
                        <span className="text-right">
                            <CurrencyFormat
                                //taxTotal
                                value={Number(Balance) + Number(OrdersBal) + Number(order[0].DocTotal)}
                                displayType={'text'}
                                thousandSeparator={true}
                                fixedDecimalScale={true}
                                decimalScale={2}
                                prefix={'$ '}
                                suffix={config.general.currency}>
                            </CurrencyFormat>
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-7" style={{ padding: 0 }}>
                        <span className="font-weight-bold">Exceso: </span>
                    </div>
                    <div className="col-5 text-right" style={{ padding: 0, background: 'red', color: 'white' }}>
                        <span className="text-right font-weight-bold">
                            <CurrencyFormat
                                //taxTotal
                                value={Number(CreditLine) - (Number(Balance) + Number(OrdersBal) + Number(order[0].DocTotal))}
                                displayType={'text'}
                                thousandSeparator={true}
                                fixedDecimalScale={true}
                                decimalScale={2}
                                prefix={'$ '}
                                suffix={config.general.currency}>
                            </CurrencyFormat>
                        </span>
                    </div>
                </div>

            </div>
        )
    };

    search = async (event) => {
        await this.table.destroy();
        setTimeout(() => {
            this.cargarDatos();
        }, 250);
    }

    searchStatus = async (event) => {
        this.setState({
            Tipo: event.nativeEvent.target.value,
        });
        await this.table.destroy();
        setTimeout(() => {
            this.cargarDatos();
        }, 250);
    };

    closeConfirme = async () => {
        $('#commentsModale').modal('hide');
    }

    closeConfirmeAutoriza = async () => {
        $('#commentsAutorizacionModal').modal('hide');
    }

    closeRegresarAutorizacion = async () => {
        $('#RegresarAutorizacionModal').modal('hide');
    }

    RegresarAutorizacion = async response => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        const { DocEntry } = this.state;

        enableSpinner(true);

        let data = {
            DocEntry: DocEntry,
        };

        let apiResponse = await apiClient.regresarAutorization(data);
        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            enableSpinner(false);

            showAlert({ type: 'success', message: apiResponse.message });

            $('#RegresarAutorizacionModal').modal('hide');
            $('#saveModal').modal('hide');
            this.table.destroy();
            this.cargarDatos();
            return;
        }

        showAlert({ type: 'error', message: "Aviso: " + apiResponse.message });
        enableSpinner(false)
    };

    CheckboxActions = async (docEntryArray, action = null, usuario, U_CurrStep) => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;

        let responseArray = [];

        enableSpinner(true);
        for (let index = 0; index < docEntryArray.length; index++) {
            const document = docEntryArray[index];

            let statusAuthorization = 0;
            let message = "";
            if (action == 1) {
                message = "Autorizando";
                statusAuthorization = 1;
            }
            let Documento = document.DocNum + '-' + document.DocEntry;
            showAlert({ type: 'info', message: message + ': ' + Documento, timeOut: 8000 });

            let data = {
                DocEntry: document.DocEntry,
                Usuario: usuario,
                WstCode: document.U_StepCode,
                tipo: document.U_Remarks
            }
            let response = "";

            if (action == 1) {
                response = await apiClient.createAutorization(data);
            }

            try {
                responseArray.push({
                    docNum: Documento,
                    message: response.message ? response.message : '',
                });
            } catch (e) {
                responseArray.push({
                    docNum: '',
                    message: '',
                });
            }
        }
        enableSpinner(false);
        return responseArray;
    };

    AutorizarMasive = async response => {
        const { notificationReducer: { showAlert } } = this.props;
        const { Autorizaciones, usuario, U_CurrStep, checkboxDataTables } = this.state;

        let docEntryArray = [];
        let responseArray = [];
        for (let [id, value] of checkboxDataTables.entries()) {
            if (value) {
                docEntryArray.push(Autorizaciones[id]);
            }
        }
        $('#estasSeguroModal').modal('hide');
        if (docEntryArray.length > 0) {
            responseArray = await this.CheckboxActions(docEntryArray, 1, usuario, U_CurrStep);
            this.toggleDocumentSelectedAll(false);


            this.setState({
                checkboxDataTables: new Map(),
                responseArray
            })
            $('#notificationsModal').modal('show');
            this.table.destroy();
            this.cargarDatos();

        } else {
            showAlert({ type: 'error', timeOut: 8000, message: "Seleccione un documento valido" });
            return;
        }

    };



    closemodalestasSeguro = async response => {
        $('#estasSeguroModal').modal('hide');
    }
    closemodalSocioInfo = async response => {
        $('#InfoSnModalM').modal('hide');
    }

    async addToShopingCart() {
        const { notificationReducer: { showAlert }, configReducer, enableSpinner } = this.props;
        const { order, editar, GroupNum, Total, newComment } = this.state;
        let items = [];
        let docEntry = order.length > 0 ? order[0].DocEntry : null;
        if (!docEntry) {
            showAlert({ type: 'warning', message: ' Error al cargar documento ', timeOut: 8000 });
            return;
        }
        for (let index = 0; index < order.length; index++) {
            const item = order[index];
            if (item.ItemCode !== "ENVIO") {
                items.push({ itemCode: item.ItemCode, quantity: parseInt(item.Quantity), price: item.Price, DiscPrcnt: item.DiscPrcnt });
            }
        }
        enableSpinner(true);
        let response = await apiClient.updateAuthorization(items, true, docEntry, GroupNum, Total, newComment);
        enableSpinner(false);

        $('#saveModal').modal('hide');
        this.table.destroy();
        this.cargarDatos();
        this.setState({
            editar: !editar,
        });
    }

    editDraft = () => {
        this.setState({
            editar: !this.state.editar,
        });
    }

    changeQuantityItem = async (event, index) => {
        const { notificationReducer: { showAlert }, enableSpinner } = this.props;
        const { order } = this.state;
        let quantity = event.nativeEvent.target.value;
        if (quantity.indexOf(" ") !== -1 || quantity.indexOf("-") !== -1) {
            showAlert({ type: 'warning', message: "Carácter no permitido" });
            return;
        }

        order[index].Quantity = quantity;

        setTimeout(() => {
            this.setState({
                order,
            });
        }, 100);
    }

    validateStock = async (index) => {
        const { order } = this.state;
    }

    changePriceItem = async (event, index) => {
        const { notificationReducer: { showAlert } } = this.props;
        const { order } = this.state;

        let price = event.nativeEvent.target.value;

        if (!isNaN(price)) {
            order[index].Price = price;
            this.setState({
                order
            });
        } else {
            showAlert({ type: 'warning', message: "Carácter no permitido" });
            return;
        }

    }

    changeDiscountItem = async (event, index) => {
        const { notificationReducer: { showAlert } } = this.props;
        const { order } = this.state;

        let DiscPrcnt = event.nativeEvent.target.value;

        if (!isNaN(DiscPrcnt)) {
            order[index].DiscPrcnt = DiscPrcnt;
            this.setState({
                order
            });
        } else {
            showAlert({ type: 'warning', message: "Carácter no permitido" });
            return;
        }
    }

    toggleDocumentSelected = (id) => {
        this.setState(state => {
            const checkboxDataTables = new Map(state.checkboxDataTables);
            checkboxDataTables.set(id, !checkboxDataTables.get(id)); // toggle
            return { checkboxDataTables };
        });
    };

    toggleDocumentSelectedAll = (action) => {
        const { Autorizaciones } = this.state;
        let newCheckbox = (new Map(): Map<string, boolean>);
        Autorizaciones.map((register, index) => {
            if (register.U_Status != 'Y' && register.U_Status != 'N') {
                newCheckbox.set(index, action)
            }
        });
        this.setState({
            checkboxDataTables: newCheckbox
        });
    };

    handelChange = ({ target }) => {
        const { name, value } = target;
        this.setState({
            [name]: value
        });
    };

    changeDocTotal = async (event) => {
        const { notificationReducer: { showAlert } } = this.props;
        const { order } = this.state;

        let total = event.nativeEvent.target.value;

        if (!isNaN(total)) {
            order[0].DocTotal = total;
            this.setState({
                order,
                Total: total,
            });
        } else {
            showAlert({ type: 'warning', message: "Carácter no permitido" });
            return;
        }
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

    // Función para manejar cambios en el campo de entrada del comentario
    handleCommentChange = (event) => {
        const newComment = event.target.value;
        if (newComment.length <= 254) {
            this.setState({
                newComment,
                commentLengthError: false,
            });
        } else {
            this.setState({ commentLengthError: true });
        }
    };
    // Función para agregar un nuevo comentario
    // addComment = () => {
    //     const { newComment, comments } = this.state;
    //     if (newComment.length <= 255) {
    //         const currentDate = new Date(); // Obtiene la fecha actual
    //         const formattedDate = currentDate.toLocaleString(); // Formatea la fecha como texto
    //         const commentWithDate = `${formattedDate}: ${newComment}`; // Agrega la fecha al comentario
    //         this.setState((prevState) => ({
    //             comments: [...prevState.comments, commentWithDate],
    //             newComment: '',
    //         }));
    //     }
    // };

    render() {
        const { history } = this.props;
        const { newComment, commentLengthError, comments, newIncident, currentDateTime } = this.state;

        const { Autorizaciones,

            order,
            Tipo,
            editar,
            dataCsv,
            csvData,
            usuario,
            checkboxDataTables,
            responseArray,
            credit,
            PymntGroup,
            ListGroupNum,
            fechaInicio,
            fechaFinal,
            fechamin,
            fechamax,
            infoSN
        } = this.state;
        let checkbox = {
            data: checkboxDataTables,
            selectOne: this.toggleDocumentSelected,
            selectAll: this.toggleDocumentSelectedAll,
        }
        // this.InfoSNModal()

        return (
            <div className="content-fluid" style={{ marginTop: 150, backgroundColor: "#FFFFFF" }}>
                <Session history={history} view={VIEW_NAME.AUTORIZA_VIEW} />

                <NavBar />
                <NotificationsModal
                    responseArray={responseArray}
                ></NotificationsModal>

                <div className="container mb-4 margenSelector">
                    <div className="row">
                        <div className="col">
                            <div className="jumbotron" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                                <h2 className="display-6 text-center">{usuario === 167 || usuario === 208 || usuario === 206 ? 'Autorización de Transferencia Gratuita' : 'Autorización de Pedidos'}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container col-md-12" >
                    <div className="row">
                        <div className="col-md-2 ">
                            <select id="inputState" class="form-control btn-outline-secondary"
                                style={{ backgroundColor: 'transparent', borderColor: '#ced4da', color: '#000' }}
                                onChange={(event) => this.searchStatus(event)}>
                                <option value='W'>Pendientes</option>
                                <option value='Y'>Aprobados</option>
                                <option value='N'>Rechazados</option>
                            </select>
                        </div>
                        <div className="col-md-3 row">
                            <h4 className="pr-2">Desde:</h4>
                            <input
                                id="fechaInicio"
                                type="date"
                                className="form-control col-md-6"
                                name="fechauno"
                                // min={fechamin}
                                max={fechamax}
                                value={!this.state.isLoaded ? fechamin : fechaInicio}
                                onChange={(event) => this.handleInputDateInicio(event)} />
                        </div>
                        <div className="col-md-3 row">
                            <h4 className="pr-2">Hasta:</h4>
                            <input
                                id="FechaFin"
                                type="date"
                                className="form-control col-md-6"
                                name="fechados"
                                // min={fechamin}
                                max={fechamax}
                                value={fechaFinal}
                                onChange={(event) => this.handleInputDateFinal(event)} />
                        </div>
                        <div className="col-2">
                            <button
                                className="btn btn-active btn-focus"
                                data-toggle="tooltip"
                                data-placement="top"
                                // style={{boxShadow:`5px 5px ${config.mainColors.primaryColor}`}}
                                title="Buscar" onClick={this.search}>
                                <i className="fas fa-search"></i> Buscar
                            </button>
                        </div>
                        <div className="col-12">
                            {/* <button type="button" class="btn btn-success float-right" onClick={this.generateCSV}>Descargar plantilla</button> */}

                            <button type="button" class="btn btn-primary float-right" style={{ backgroundColor: 'rgb(0, 96, 234)', display: Tipo === 'W' ? 'block' : 'none' }} data-toggle="modal" data-target=".estasSeguro" onChange={this.AutorizarMasive}>Aprobación masiva</button>
                        </div>
                    </div>
                    <br></br>

                    <div className="table-responsive scrolltable" style={{ marginBottom: 0, height: 500, maxHeight: 800, overflow: 'auto', fontSize: "13px", fontWeight: "bold", overflowY: 'auto' }}>
                        <table id="tablaAutorizaciones" className="table table-hover scrolltable" >
                            <thead style={{ textAlign: "-webkit-center" }}>
                                <tr className="text-light">
                                    <th style={{ whiteSpace: 'nowrap' }}>#</th>
                                    <th className="sticky-column">
                                        <input type="checkbox" style={{ minWidth: '100%' }} id="cbox2" value="second_checkbox" onChange={(event) => checkbox.selectAll(event.target.checked)} />
                                    </th>
                                    <th className="text-center" style={{ whiteSpace: 'nowrap' }} scope="col">Documento</th>
                                    <th className="text-center" style={{ whiteSpace: 'nowrap' }} >Cliente</th>
                                    <th className="text-center" style={{ whiteSpace: 'pre-line' }} scope="col">Nombre cliente</th>
                                    <th className="text-center" style={{ whiteSpace: 'nowrap' }} scope="col">Saldo de cuenta</th>
                                    <th className="text-center" style={{ whiteSpace: 'nowrap' }}>Saldo vencido</th>
                                    <th className="text-center" style={{ whiteSpace: 'nowrap' }} >Días de atraso</th>
                                    <th className="text-center" style={{ whiteSpace: 'nowrap' }} scope="col">Límite de crédito</th>
                                    <th className="text-center" style={{ whiteSpace: 'nowrap' }} >Pendiente por facturar</th>
                                    <th className="text-center" style={{ whiteSpace: 'pre-line' }} scope="col">Comentarios</th>
                                    <th className="text-center" style={{ whiteSpace: 'nowrap' }} scope="col">Fecha</th>
                                    <th className="text-center" style={{ whiteSpace: 'nowrap' }} scope="col">Hora</th>
                                    <th className="text-center" style={{ whiteSpace: 'nowrap' }} scope="col">Total doc.</th>
                                    <th className="text-center" style={{ whiteSpace: 'nowrap' }} scope="col">Orden de compra</th>
                                    <th className="text-center" style={{ whiteSpace: 'pre-line' }} scope="col">Comprobante de pago</th>
                                    <th className="text-center" style={{ whiteSpace: 'nowrap' }} scope="col">Vendedor</th>
                                    {/* <th className="text-center" style={{ whiteSpace: 'nowrap'}} scope="col">Autorización</th> */}
                                    <th className="text-center" style={{ whiteSpace: 'nowrap' }} >Autorización 1</th>
                                    <th className="text-center" style={{ whiteSpace: 'nowrap' }} >Autorización 2</th>
                                    {/* <th className="text-center" style={{ whiteSpace: 'nowrap'}} >Incidencias</th>
                                    <th className="text-center" style={{ whiteSpace: 'nowrap'}} >Fecha de último seguimiento</th> */}
                                    <th className="text-center"></th>
                                    <th className="text-center"></th>
                                </tr>
                            </thead>
                            <tbody style={{ overflowY: 'auto' }}>
                                {Autorizaciones.map((auto, index) => {
                                    //Nombre del o los autorizadores
                                    let auto1 = '';
                                    let auto2 = '';
                                    const listaAutorizadores = auto.Autorizadores ? auto.Autorizadores.split("|") : [];
                                    if (listaAutorizadores.length === 1) {
                                        // Primer autorizador
                                        auto1 = listaAutorizadores[0];
                                    } else if (listaAutorizadores.length === 2) {
                                        // Primer y segundo autorizador
                                        auto1 = listaAutorizadores[0];
                                        auto2 = listaAutorizadores[1];
                                    }
                                    return (
                                        <tr key={index}>
                                            <th style={{ whiteSpace: 'nowrap' }}>{index + 1}</th>
                                            <td className="text-center">
                                                <input type="checkbox" style={{ minWidth: '100%' }} id={`cbox_${index}`} checked={!!checkbox.data.get(index)} onChange={() => checkbox.selectOne(index)} />
                                            </td>
                                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>{auto.DocNum + '-' + auto.DocEntry}</td>
                                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>{auto.CardCode}</td>
                                            <td className="text-center" style={{ whiteSpace: 'pre-line' }} >{auto.CardName}</td>
                                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {/* {'$ ' + parseFloat(auto.Balance || 0).toFixed(2)} */}
                                                <CurrencyFormat
                                                    value={auto.Balance || 0}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    fixedDecimalScale={true}
                                                    decimalScale={2}
                                                    prefix={'$ '}
                                                    suffix={config.general.currency}>
                                                </CurrencyFormat>
                                            </td>
                                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                <CurrencyFormat
                                                    value={auto.Vencido || 0}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    fixedDecimalScale={true}
                                                    decimalScale={2}
                                                    prefix={'$ '}
                                                    suffix={config.general.currency}>
                                                </CurrencyFormat>
                                            </td>
                                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>{auto.DIAS}</td>
                                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {/* {'$ ' + parseFloat(auto.CreditLine || 0).toFixed(2)} */}
                                                <CurrencyFormat
                                                    value={auto.CreditLine || 0}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    fixedDecimalScale={true}
                                                    decimalScale={2}
                                                    prefix={'$ '}
                                                    suffix={config.general.currency}>
                                                </CurrencyFormat>
                                            </td>
                                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                <CurrencyFormat
                                                    value={auto.PendienteFacturar || 0}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    fixedDecimalScale={true}
                                                    decimalScale={2}
                                                    prefix={'$ '}
                                                    suffix={config.general.currency}>
                                                </CurrencyFormat>
                                            </td>
                                            <td className="text-center" style={{ whiteSpace: 'pre-line' }}>{auto.Comments ? auto.Comments.substr(0, 25) : ''}</td>
                                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>{auto.DocDate.substr(0, 10)}</td>
                                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>{this.DocTimeFormat(auto.DocTime)}</td>
                                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                {/* $ {parseFloat(auto.DocTotal).toFixed(2) === '0.00' ? parseFloat(auto.DocTotal2).toFixed(2) : parseFloat(auto.DocTotal).toFixed(2)} */}
                                                <CurrencyFormat
                                                    value={parseFloat(auto.DocTotal).toFixed(2) === '0.00' ? parseFloat(auto.DocTotal2).toFixed(2) : parseFloat(auto.DocTotal).toFixed(2)}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    fixedDecimalScale={true}
                                                    decimalScale={2}
                                                    prefix={'$ '}
                                                    suffix={config.general.currency}>
                                                </CurrencyFormat>
                                            </td>
                                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                <a href={`${config.BASE_URL}/${SERVICE_API.getOrderspdf}/${auto.DownloadOrderPDF}`} target="_blank" style={{ fontSize: "1rem" }} hidden={auto.DownloadOrderPDF ? false : true}>
                                                    <span style={{ color: config.footer.iconColor }}>{auto.U_NumOC ? auto.U_NumOC : 'OC'}<img src="https://cdn-icons-png.flaticon.com/512/3997/3997593.png" style={{ maxHeight: 20 }} alt=''></img></span>
                                                </a>
                                            </td>
                                            <td className="text-center" style={{ whiteSpace: 'pre-line' }}>
                                                <a href={`${config.BASE_URL}/${SERVICE_API.getOrderspdf}/${auto.U_FMB_ComprobantePago}`} target="_blank" style={{ fontSize: "1rem" }} hidden={auto.U_FMB_ComprobantePago ? false : true}>
                                                    <img src="https://cdn-icons-png.flaticon.com/512/3997/3997593.png" style={{ maxHeight: 20 }} alt=''></img>
                                                </a>
                                            </td>
                                            <td className="text-center" style={{ whiteSpace: 'pre-line' }}>{this.DocInfo(auto)}</td>
                                            {/* <td className="text-center" style={{ whiteSpace: 'nowrap'}}>{auto.U_Remarks}</td> */}
                                            <td className="text-center" style={{ whiteSpace: 'nowrap', color: auto.CountAutorizadores >= 1 ? 'green' : 'red' }}>{auto.CountAutorizadores >= 1 ? auto.Autorizadores ? auto1 : 'AUTORIZADO' : 'PENDIENTE'}</td>
                                            <td className="text-center" style={{ whiteSpace: 'nowrap', color: auto.CountAutorizadores > 1 ? 'green' : 'red' }}>{auto.CountAutorizadores > 1 ? auto.Autorizadores ? auto2 : 'AUTORIZADO' : 'PENDIENTE'}</td>
                                            {/* <td className="text-center"></td> {/* Incidencias 
                                            <td className="text-center"></td> Fecha de último seguimiento */}
                                            <td>
                                                <button
                                                    className="btn btn-sm"
                                                    type="button"
                                                    style={{ backgroundColor: 'rgb(0, 96, 234)', color: 'white', fontFamily: 'Poppins' }}
                                                    onClick={() => this.Details(auto.DocEntry, auto.U_StepCode, auto.U_SYP_RICO_NCANAL, auto.U_Remarks)}>
                                                    Ver detalles
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm"
                                                    type="button"
                                                    // data-toggle="modal" data-target=".bd-example-modal-lg"
                                                    style={{ backgroundColor: 'rgb(0, 96, 234)', color: 'white', fontFamily: 'Poppins' }}
                                                    onClick={() => this.getProfileData(auto.CardCode)}
                                                    data-toggle="modal" data-target="#InfoSnModalM" >
                                                    Informacion del socio
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* <div className="pb-4">
                        <button type="button" className="btn btn-primary float-right" style={{ display: Tipo === 'W' ? 'block' : 'none' }} data-toggle="modal" data-target=".estasSeguro" onChange={this.AutorizarMasive}>Aprobación masiva</button>
                    </div> */}


                    <br></br>

                    <div class="modal fade bd-example-modal-xl" id="saveModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-xl">
                            <div className="modal-content">
                                <div className="modal-header text-light" style={{ background: 'rgb(0, 96, 234)', borderRadius: '0' }}>
                                    <h4 className="modal-title" id="modal-basic-title " style={{ fontFamily: 'Poppins' }}>Detalle de autorización</h4>
                                    {/* <label className="btn float-center" style={{color:"white"}} > <i class="fa fa-clock-o"></i> {this.DocTimeFormat(order.header.DocTime)}</label> */}
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span className="text-white" aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div>
                                    {!editar && (<button
                                        type="button"
                                        disabled={Tipo === 'W' ? false : true}
                                        className="btn btn-success"
                                        style={{ marginLeft: '10px', marginTop: '10px', display: Tipo === 'W' ? 'block' : 'none' }}
                                        onClick={this.editDraft}>
                                        <i className="fas fa-edit" />
                                        &nbsp; Editar
                                    </button>)}

                                    <div className="col-md-6" style={{ float: 'right', display: 'block', marginRight: '1%' }}>

                                        {editar ? (<select name="GroupNum" placeholder="Selecciona una marca" className="form-control text-left" onChange={this.handelChange} style={{ textAlign: "center", height: 30 }}>
                                            <option value="">Selecciona una condición de pago</option>
                                            {!!ListGroupNum &&
                                                ListGroupNum.map(group => {
                                                    return <option value={group.GroupNum} key={group.GroupNum}>{group.PymntGroup}</option>
                                                })
                                            }
                                        </select>)
                                            :
                                            <label>Condición de pago actual: <b>{PymntGroup}</b></label>
                                        }
                                    </div>
                                </div>

                                <div className="modal-body bg3">
                                    <div style={{ height: order.length >= 6 ? '600px' : '', overflowY: order.length >= 6 ? 'auto' : 'hidden', overflowX: 'hidden' }}>
                                        {!!order && order.map((item, index) => {
                                            let imagesArray = item.U_Handel_ImagesArray || '';
                                            imagesArray = imagesArray.split('|');
                                            let imagenShow = imagesArray[0] ? (config.BASE_URL + SERVICE_API.getImage + '/' + imagesArray[0]) : require('../../images/noImage.png');
                                            return (
                                                <div key={item.ItemCode} className="row">
                                                    <div className="col-md-3 text-center">
                                                        <img className="img-fluid" style={{ backgroundColor: 'white', maxHeight: 100 }}
                                                            src={imagenShow}
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="col-md-8">
                                                        <div className="table-responsive">
                                                            <table className="table">
                                                                <thead style={{borderBottom: "2px solid #dee2e600", borderTop:"1px solid #dee2e600"}}>
                                                                    <tr>
                                                                        <th scope="col">Artículo</th>
                                                                        <th scope="col" className="text-center">Código</th>
                                                                        <th scope="col" className="text-center">Cantidad</th>
                                                                        <th scope="col" className="text-center">Precio unitario</th>
                                                                        <th scope="col" className="text-center">% Descuento</th>
                                                                        <th scope="col" className="text-center">Precio Total</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>{item.ItemName}</td>
                                                                        <td className="text-center">{item.ItemCode}</td>
                                                                        <td className="text-center">
                                                                        {editar ? (<input
                                                                        type="text"
                                                                        className=" form-control validarCant cantBlur btn-outline-secondary"
                                                                        disabled={!editar ? true : false}
                                                                        style={{
                                                                            backgroundColor: !editar ? '#ededed' : 'transparent',
                                                                            borderColor: '#ced4da',
                                                                            color: '#000',
                                                                            paddingTop: 1,
                                                                            paddingBottom: 2,
                                                                            maxWidth: '100%',
                                                                            textAlign: "center",
                                                                        }}
                                                                        id={'itemCantidad' + index}
                                                                        value={item.Quantity}
                                                                        onChange={event => this.changeQuantityItem(event, index)}
                                                                        onBlur={event => this.validateStock(index)}
                                                                    />) :
                                                                        <label>{item.Quantity}</label>
                                                                    }
                                                                        </td>
                                                                        <td className="text-center">
                                                                        {editar ? (<input
                                                                        type="text"
                                                                        className=" form-control validarCant cantBlur btn-outline-secondary"
                                                                        disabled={!editar ? true : false}
                                                                        style={{
                                                                            backgroundColor: !editar ? '#ededed' : 'transparent',
                                                                            borderColor: '#ced4da',
                                                                            color: '#000',
                                                                            paddingTop: 1,
                                                                            paddingBottom: 2,
                                                                            width: 130,
                                                                            textAlign: 'right',
                                                                        }}
                                                                        id={'itemCantidad' + index}
                                                                        value={item.Price}
                                                                        onChange={event => this.changePriceItem(event, index)}
                                                                    />) :
                                                                                <label>
                                                                                   {/* {'$' + formatNumber.new(item.Price)} */}
                                                                            <CurrencyFormat
                                                                                value={item.Price || 0}
                                                                                displayType={'text'}
                                                                                thousandSeparator={true}
                                                                                fixedDecimalScale={true}
                                                                                decimalScale={2}
                                                                                prefix={'$ '}
                                                                                suffix={config.general.currency}>
                                                                            </CurrencyFormat>
                                                                        </label>
                                                                    }
                                                                        </td>
                                                                        <td className="text-center">
                                                                        {editar ? (<input
                                                                        type="text"
                                                                        className=" form-control validarCant cantBlur btn-outline-secondary"
                                                                        disabled={!editar ? true : false}
                                                                        style={{
                                                                            backgroundColor: !editar ? '#ededed' : 'transparent',
                                                                            borderColor: '#ced4da',
                                                                            color: '#000',
                                                                            paddingTop: 1,
                                                                            paddingBottom: 2,
                                                                            width: 130,
                                                                            textAlign: 'right',
                                                                        }}
                                                                        id={'itemDiscPrcnt' + index}
                                                                        value={Math.round(item.DiscPrcnt)}
                                                                        onChange={event => this.changeDiscountItem(event, index)}
                                                                    />) :
                                                                        <label>{Math.round(item.DiscPrcnt) || 0} %</label>
                                                                    }
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {/* {item.Currency + ' ' + parseFloat(item.LineTotal).toFixed(2)} */}
                                                                    <CurrencyFormat
                                                                        value={item.LineTotal || 0}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        fixedDecimalScale={true}
                                                                        decimalScale={2}
                                                                        prefix={'$ '}
                                                                        suffix={config.general.currency}>
                                                                    </CurrencyFormat>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <br></br>
                                    <div className="row">
                                    <div className="col-md-12 col-sm-12">
                                            {/* <div className="incident-box">
                                                <div>
                                                <h5>Incidencias</h5>
                                                <div>
                                                    <textarea
                                                        rows="4"
                                                        cols="35"
                                                        placeholder="Escribe tu incidencia aquí..."
                                                        value={newIncident}
                                                        onChange={this.handleIncidentChange}
                                                    />
                                                </div>
                                                <button style={{fontFamily: 'Poppins',backgroundColor:'rgb(0, 96, 234)',color:'white',marginTop: '20px' }} onClick={this.addIncident}>
                                                    Enviar incidencia
                                                </button>
                                                </div>
                                            </div>
                                            <br></br> */}
                                            <div className="comment-box">
                                                <div>
                                                    <h5>Comentarios</h5>
                                                    <div>
                                                        <textarea
                                                            rows="4"
                                                            cols="35"
                                                            placeholder="Escribe tu comentario aquí..."
                                                            value={newComment}
                                                            onChange={this.handleCommentChange}
                                                        />
                                                        {commentLengthError && (
                                                            <p style={{ color: 'red' }}>El comentario no debe superar los 254 caracteres.</p>
                                                        )}
                                                    </div>
                                                    <br></br>
                                                    <label>{newComment.length + ' caracteres, te quedan ' + (254 - newComment.length) + ' caracteres.'}</label>
                                                    <br></br>
                                                    {!editar && <button style={{ fontFamily: 'Poppins', backgroundColor: 'rgb(0, 96, 234)', color: 'white', marginTop: '20px' }} onClick={this.addComment}>
                                                        Guardar comentario
                                                    </button>}
                                                    <div className="comment-list">
                                                        {comments.map((comment, index) => (
                                                            <div key={index} className="comment">
                                                                {comment}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                                <p><br></br></p>
                                    <div className="row">
                                        <div className="col-md-7 col-sm-12">
                                            {credit ?
                                                <div className="card" style={{ borderColor: 'white', backgroundColor: 'transparent', border: '1px solid  rgba(124, 124, 125, 0.3)' }}>
                                                    <div className="card-header text-white"
                                                        style={{ background: config.shoppingList.summaryList }}>
                                                        <div className="card-title">
                                                            <h5 style={{ color: config.shoppingList.textsummaryList }}>Limite de crédito:</h5>
                                                        </div>
                                                    </div>

                                                    <div className="card-body" >
                                                        {this.renderCreditLimit()}
                                                    </div>
                                                </div>
                                             :
                                             <div></div>
                                            }
                                            <div className="card" style={{ borderColor: 'white', backgroundColor: 'transparent', border: '1px solid  rgba(124, 124, 125, 0.3)' }}>
                                                <div className="card-header text-white" style={{ background: 'rgb(0, 96, 234)' }}>
                                                    <div className="card-title">
                                                        <h5 style={{ fontFamily: 'Poppins', color: 'white' }}>Resumen:</h5>
                                                    </div>
                                                </div>

                                                <div className="card-body">
                                                    {this.renderShoppingCartTotal()}
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                                <div className="modal-footer justify-content-right">
                                    {editar && (<button
                                        type="button"
                                        className="btn btn-success"
                                        style={{ display: Tipo === 'W' ? 'block' : 'none' }}
                                        onClick={() => this.addToShopingCart()}>
                                        <i className="fas fa-edit" />
                                        &nbsp; Guardar
                                    </button>)}
                                    {/* <button
                                        type="button"
                                        className="btn btn-primary float-right"
                                        style={{ display: Tipo === 'W' ? 'block' : 'none' }}
                                        onClick={() => this.mostrarComentarios()}
                                    >
                                        Comentarios
                                    </button> */}

                                    {!editar && (<CSVLink
                                        className="btn btn-success float-right"
                                        data={csvData} filename={"Archivo.csv"}>
                                        Descargar orden CSV
                                    </CSVLink>)}
                                    {!editar && (<button type="button" class="btn btn-danger float-right" style={{ display: Tipo === 'W' ? 'block' : 'none' }} disabled={Tipo === 'W' ? false : true} data-toggle="modal" data-target=".comentarios" >Rechazar</button>)}
                                    {!editar && (<button type="button" class="btn btn-success float-right" style={{ display: Tipo === 'W' ? 'block' : 'none' }} disabled={Tipo === 'W' ? false : true} data-toggle="modal" data-target=".comentariosAutorizaciones" >Autorizar</button>)}
                                    {/* onClick={this.Autorizar} */}
                                    <button type="button" class="btn btn-warning float-right" style={{ display: Tipo === 'N' ? 'block' : 'none' }} disabled={Tipo === 'N' ? false : true} data-toggle="modal" data-target=".RegresarAutorizacion" >Volver a autorizar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade comentarios" tabindex="-1" role="dialog" id="commentsModale" >
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Escribe aqui tu comentario de rechazo.</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12">
                                            <div class="form-group" style={{ marginBottom: '2px' }}>
                                                <input type="text" class="form-control" id="commentarios" placeholder="Escribe aqui" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" className="btn btn-danger" onClick={this.closeConfirme}>Cerrar</button>
                                    <button type="button" className="btn btn-success" onClick={this.Rechazar}> Enviar </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade comentariosAutorizaciones" tabindex="-1" role="dialog" id="commentsAutorizacionModal" >
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Escribe aqui tu comentario de aprobación.</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12">
                                            <div class="form-group" style={{ marginBottom: '2px' }}>
                                                <input type="text" class="form-control" id="commentariosAutorizar" placeholder="Escribe aqui" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" className="btn btn-danger" onClick={this.closeConfirmeAutoriza}>Cerrar</button>
                                    <button type="button" className="btn btn-success" onClick={this.Autorizar}> Enviar </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade RegresarAutorizacion" tabindex="-1" role="dialog" id="RegresarAutorizacionModal" >
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    {/* <h5 class="modal-title"></h5> */}
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12">
                                            <div class="form-group" style={{ marginBottom: '2px' }}>
                                                <label>¿Estas seguro de regresar este documento al flujo de aprobación?</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" className="btn btn-danger" onClick={this.closeRegresarAutorizacion}>NO</button>
                                    <button type="button" className="btn btn-success" onClick={this.RegresarAutorizacion}> SI </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade estasSeguro" tabindex="-1" role="dialog" id="estasSeguroModal" >
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Mensaje de alerta.</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12">
                                            <h4>¿Estas seguro que deseas autorizar los documentos masivamente?</h4>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" className="btn btn-danger" onClick={this.closemodalestasSeguro}>Cerrar</button>
                                    <button type="button" className="btn btn-success" onClick={this.AutorizarMasive}> Crear los documentos </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade SocioInfo-main" tabindex="-1" role="dialog" id="InfoSnModalM" >
                        <div class="modal-dialog" id='modal-dialog-socio' role="document">
                            <div class="SocioInfo-modal">
                                <div class="modal-header">
                                    <h5 class="modal-title" style={{ marginTop: '-18px' }}>Información del socio de negocios</h5>
                                    <button type="button" class="close-btn" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>
                                </div>
                                <div class="modal-body infoSocio">
                                    <div>
                                        <span>Nombre:</span>
                                        <span> {infoSN.CardName}</span>
                                    </div>
                                    <div>
                                        <span>Número de la cuenta:</span>
                                        <span>{infoSN.CardCode}</span>
                                    </div>
                                    <div>
                                        <span>Dirección:</span>
                                        <span>{infoSN.BillAddres}</span>
                                    </div>
                                    <div>
                                        <span>Límite de crédito:</span>
                                        <span>
                                            {/* {infoSN.LimiteCredito} */}
                                            <CurrencyFormat
                                                value={infoSN.LimiteCredito || 0}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                fixedDecimalScale={true}
                                                decimalScale={2}
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </span>
                                    </div>
                                    <div>
                                        <span>Límite de crédito comprometido:</span>
                                        <span>
                                            {/* {infoSN.LineaCreditoComprometida} */}
                                            <CurrencyFormat
                                                value={infoSN.LineaCreditoComprometida || 0}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                fixedDecimalScale={true}
                                                decimalScale={2}
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </span>
                                    </div>
                                    <div>
                                        <span>Límite de crédito disponible:</span>
                                        <span>
                                            {/* {infoSN.LineaCreditoDisp} */}
                                            <CurrencyFormat
                                                value={infoSN.LineaCreditoDisp || 0}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                fixedDecimalScale={true}
                                                decimalScale={2}
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </span>
                                    </div>
                                    <div>
                                        <span>Saldo total:</span>
                                        <span>
                                            {/* {infoSN.SaldoTotal} */}
                                            <CurrencyFormat
                                                value={infoSN.SaldoTotal || 0}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                fixedDecimalScale={true}
                                                decimalScale={2}
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </span>
                                    </div>
                                    <div>
                                        <span>CIF:</span>
                                        <span>{infoSN.CFI}</span>
                                    </div>
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
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AutorizacionesView);