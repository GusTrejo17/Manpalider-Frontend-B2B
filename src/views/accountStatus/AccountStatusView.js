import React, { Component } from 'react';
import { NavBar, Session, ProfieldModel, ModaleMailPDF } from "../../components";
import { DISPATCH_ID, SERVICE_RESPONSE, VIEW_NAME, config } from "../../libs/utils/Const";
import { ApiClient } from "../../libs/apiClient/ApiClient";
import { connect } from "react-redux";
import moment from 'moment';
import { AccountStatusData } from '../index';
import { CSVLink } from "react-csv";
import * as XLSX from 'xlsx';
import './AccountStatusView.css';
import ExportReportGeneral from '../../components/ExportReportGeneral';
import CurrencyFormat from 'react-currency-format';

let apiClient = ApiClient.getInstance();

class AccountStatusView extends Component {
    csvLink = React.createRef();
    constructor(props) {
        super(props);
        const f = new Date();
        const newDate = new Date(f.setMonth(f.getMonth() -3))
        this.state = {
            infoSN: {},
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
            fechaMin: moment(newDate).format('YYYY-MM-DD'),
            fechaMax: moment(new Date()).format('YYYY-MM-DD'),
            isLoaded: false,
            user: JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'CurrentUser')),
            seller: JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser')),
            docsToPrint: [],
            selectAllChecked: false,
        };
    }

    async componentDidMount() {
        const { enableSpinner } = this.props;
        enableSpinner(true);
        await apiClient.getDataProfiel().then((response) => {
            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                this.setState({
                    infoSN: response.data.body[0]
                });
            };
        });

        let response = await apiClient.getDataProfiel();
        try {
            let creatorUser = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
            this.setState({
                usuario: creatorUser
            });
        } catch (error) {

        }
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
        await this.getData();
        enableSpinner(false);
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

    getData = async () => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        const { fechaInicio, fechaFinal, fechaMin } = this.state;
        let response = [];

        enableSpinner(true);
        response = await apiClient.getBillsDue(!this.state.isLoaded ? fechaMin : fechaInicio, fechaFinal);
        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            for (let index = 0; index < response.data.length; index++) {
                const element = response.data[index];
                if (element.DownloadFacturaPDF) {
                    let address = element.DownloadFacturaPDF;
                    let array = address.split('\\');
                    let withoutDot = array[(array.length) - 1].split('.');
                    element.DownloadFacturaPDF = withoutDot[0];
                    element.DownloadFacturaXML = withoutDot[0];
                }
            }
        }
        enableSpinner(false);

        if (response.status !== SERVICE_RESPONSE.SUCCESS) {
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
                data: response.data || []
            });
        }, 50);
    }

    handleDocsChange = newData => {
        const { data, infoSN } = this.state;
        let docs = [];
        if(newData && newData?.length > 0 && data?.length > 0) {
            newData.map((selectDoc, index) => {
                data.map((doc, index) => {
                    if(selectDoc == doc.DocEntry) docs.push(doc);
                });
            });
        } else { docs = [] }
        this.setState({
            docsToPrint: {
                clientData: infoSN,
                documents: docs
            }
        });
    }

    handleSelectAllChange = () => {
        const { data } = this.state;
        const selectAllChecked = !this.state.selectAllChecked;

        this.setState({
            selectAllChecked,
            docsToPrint: {
                clientData: this.state.infoSN,
                documents: selectAllChecked ? data : [],
            },
            selectedDocs: selectAllChecked ? data.map(doc => doc.DocEntry) : [],
        });
    };
    

    formatFecha(fechaString) {
        const fecha = new Date(fechaString);
        const day = fecha.getUTCDate();
        const month = fecha.getUTCMonth() + 1; // Los meses en JavaScript son base 0 (0 - enero, 11 - diciembre)
        const year = fecha.getUTCFullYear();

        // Asegurarse de que el día y el mes tengan dos dígitos
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;

        return `${formattedDay}/${formattedMonth}/${year}`;
    }

    renderClientAddress = (bill, ship) => {
        const { sessionReducer: { addresses } } = this.props;
        const billAdd = addresses.find((address) => address.Address === bill)
        const shipAdd = addresses.find((address) => address.Address === ship)
        return [this.formatAddress(billAdd), this.formatAddress(shipAdd)]
    };

    formatAddress(address) {

        let Street = '', Block = '', City = '', StateName = '', ZipCode = ''

        for (const iterator in address) {
            if (iterator === 'Street' && address[iterator]) {
                Street = address[iterator]
            } else if (iterator === 'Block' && address[iterator]) {
                Block = address[iterator]
            } else if (iterator === 'City' && address[iterator]) {
                City = address[iterator]
            } else if (iterator === 'StateName' && address[iterator]) {
                StateName = address[iterator]
            } else if (iterator === 'ZipCode' && address[iterator]) {
                ZipCode = address[iterator]
            }
        }
        const add = Street+' '+Block+' '+City+' '+StateName+' '+ZipCode
        return add
    }

    render() {        
        const { history, enableSpinner, notificationReducer: { showAlert }} = this.props;
        const { infoSN, dataCsv, data, fechaInicio, fechaFinal, fechaMin, fechaMax, isLoaded, docsToPrint, selectAllChecked } = this.state;

        const Atig = this.formatFecha(infoSN.antiguedad);
        // const addr = this.renderClientAddress('.', 'C1294- FISCAL')
        const addr = [infoSN.BillAddres, infoSN.ShipAddres];
        return (
            <div className="content-fluid reports" style={{ marginTop: 150, paddingBottom: 20, paddingRight: 0, backgroundColor: config.Back.backgroundColor }}>
                <Session history={history} view={VIEW_NAME.ABOUT_US_VIEW} />
                <NavBar isShowMarcas={false} />
                <ProfieldModel />

                <CSVLink
                    data={dataCsv}
                    filename={"plantilla.csv"}
                    className="hidden"
                    ref={this.csvLink}
                    target="_blank" />
                <ModaleMailPDF />

                <div className="content-fluid mx-3" style={{marginTop:'12rem'}} >
                    <div className='data-container'>
                        <h1>Estado de cuenta</h1>
                        <div className='row justify-content-end'>
                            {(docsToPrint?.length === 0  || !docsToPrint || docsToPrint?.documents?.length === 0) ?
                                <button className="btn float-left impr mr-sm-2" style={{ marginTop: "15px", background: "#686868", color: "white" }} onClick={() =>{
                                    showAlert({ type: 'error', message: 'Seleccione documentos para imprimir' });
                                }}>
                                    <i className="fas fa-print"/>
                                    Imprimir PDF
                                </button>
                            :
                                <ExportReportGeneral
                                    data={docsToPrint}
                                    typeDocs= "accountStatus"
                                    enableSpinner={enableSpinner}
                                    selectAllChecked={selectAllChecked}
                                />
                            }
                        </div>                        
                        <table className='account-data'>
                            <tr>
                                <th colSpan='6' style={{ background: 'rgb(40,111,218)', color: 'white' }}>DATOS DEL CLIENTE</th>
                            </tr>
                            <tr className='just-one-h'>
                                <td colSpan='3'>
                                    <b>Nombre de Razón Social: </b><br />
                                    <span>{infoSN.CardName}</span>
                                </td>
                                <td>
                                    <b>Núm de Cliente: </b><br />
                                    <span>{infoSN.CardCode}</span>
                                </td>
                                <td>
                                    <b>Atigüedad: </b><br />
                                    <span>{Atig}</span>
                                </td>
                                <td>
                                    <b>Plazo en Días:</b><br />
                                    <span >{infoSN.CondicionPago}</span>
                                </td>
                            </tr>
                            <tr className='just-one-h' style={{ background: 'rgb(231,241,250)' }}>
                                <td colSpan='3'>
                                    <b>RFC: </b><br />
                                    <span >{infoSN.RFC}</span>
                                </td>
                                <td colSpan='3'>
                                    <b>Cedula de Identificación Fiscal: </b><br />
                                    <span >{infoSN.CFI}</span>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan='3'>
                                    <b>Domicilio Fiscal: </b>
                                    <br />
                                    <p>{addr[0]}</p>
                                </td>
                                <td colSpan='3'>
                                    <b>Domicilio de entrega: </b>
                                    <br />
                                    <p>{addr[1]}</p>
                                </td>
                            </tr>
                        </table>
                        <br />
                        <table className='account-data'>
                            <tr>
                                <th colSpan='2' style={{ background: '#686868', color: 'white' }}>CARTERA</th>
                            </tr>
                            <tr className='just-one-h'>
                                <td>
                                    <div className='container-fluid'>
                                        <div className='row'>
                                            <div className='col-md-6 col-12 p-0'><b>Limite de crédito</b></div>
                                            <div className='col-md-6 col-12 p-0 text-md-right'> 
                                                <span>
                                                    <CurrencyFormat 
                                                        value={infoSN?.LimiteCredito ?? "0"} 
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
                                </td>
                                <td>
                                    <div className='container-fluid'>
                                        <div className='row'>
                                            <div className='col-md-6 col-12 p-0'><b>Saldo vencido</b></div>
                                            <div className='col-md-6 col-12 p-0 text-md-right'>
                                                <span>
                                                    <CurrencyFormat 
                                                        value={infoSN?.MontoVencido ?? "0"} 
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
                                </td>
                            </tr>
                            <tr className='just-one-h' style={{ background: 'rgb(231,241,250)' }}>
                                <td>
                                    <div className='container-fluid'>
                                        <div className='row'>
                                            <div className='col-md-6 col-12 p-0'><b>Crédito comprometido</b></div>
                                            <div className='col-md-6 col-12 p-0 text-md-right'>
                                                <span>
                                                    <CurrencyFormat 
                                                        value={infoSN?.LineaCreditoComprometida ?? "0"} 
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
                                </td>
                                <td>
                                    <div className='container-fluid'>
                                        <div className='row'>
                                            <div className='col-md-6 col-12 p-0'><b>Saldo total</b></div>
                                            <div className='col-md-6 col-12 p-0 text-md-right'>
                                                <span>
                                                    <CurrencyFormat 
                                                        value={infoSN?.SaldoTotal ?? "0"} 
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
                                </td>
                            </tr>
                            <tr className='just-one-h'>
                                <td>
                                    <div className='container-fluid'>
                                        <div className='row'>
                                            <div className='col-md-6 col-12 p-0'><b>Crédito disponible</b></div>
                                            <div className='col-md-6 col-12 p-0 text-md-right'>
                                                <span>
                                                    <CurrencyFormat 
                                                        value={infoSN?.LineaCreditoDisp ?? "0"} 
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
                                </td>
                                <td>
                                    <div className='container-fluid'>
                                        <div className='row'>
                                            <div className='col-md-6 col-12 p-0'><b>Pendiente por facturar</b></div>
                                            <div className='col-md-6 col-12 p-0 text-md-right'>
                                                <span>
                                                    <CurrencyFormat 
                                                        value={infoSN?.PendienteFacturar ?? "0"} 
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
                                </td>
                            </tr>
                        </table>
                        <br /> <br />
                        <AccountStatusData
                            orders={data}
                            getData={this.getData}
                            handleInputDateInicio={this.handleInputDateInicio}
                            handleInputDateFinal={this.handleInputDateFinal}
                            fechaInicio={fechaInicio}
                            fechaFinal={fechaFinal}
                            fechamin={fechaMin}
                            fechamax={fechaMax}
                            isLoaded={isLoaded} 
                            fromAccountStatus= {true}
                            handleDocsChange= {this.handleDocsChange}
                            selectAllChecked= {selectAllChecked}
                            handleSelectAllChange={this.handleSelectAllChange}
                            />
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
)(AccountStatusView);