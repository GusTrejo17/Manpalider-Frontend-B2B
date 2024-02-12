import React, { Component } from 'react';
import { Footer, NavBar, Session, ProfieldModel, DocumentModel, ModaleMailPDF } from "../../components";
import { DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE, VIEW_NAME, config } from "../../libs/utils/Const";
import { ApiClient } from "../../libs/apiClient/ApiClient";
import { connect } from "react-redux";
import './ResumenCuenta.css';
import CurrencyFormat from 'react-currency-format';

let apiClient = ApiClient.getInstance();

class ResumenCuenta extends Component {
    csvLink = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            infoSN: {},
            billAdd: {},
            shipAdd: {},
        }
    }
    handleEstadoDeCuentaClick = () => {
        const { enableSpinner, notificationReducer: { showAlert },configReducer:{history} } = this.props;
        const { user } = this.state
        enableSpinner(true);
        if (user !== null) {
           history.goAccountStatus()
        } else {
            showAlert({ type: 'warning', message: "No hay un cliente seleccionado" })
        }
        enableSpinner(false);
        return;
    };

    async componentDidMount() {
        // Información del modal
        await apiClient.getDataProfiel().then((response) => {
            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                this.setState({
                    infoSN: response.data.body[0]
                });
            };
        });
    }

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
        // const billAddress = `${billAdd.Street}${', '+billAdd.Block}${', '+billAdd.City}${', '+billAdd.StateName}${billAdd.ZipCode&&'C.P '+billAdd.ZipCode}`
        // const shipAddress = `${shipAdd.Street}${', '+shipAdd.Block}${', '+shipAdd.City}${', '+shipAdd.StateName}${shipAdd.ZipCode&&'C.P '+shipAdd.ZipCode}`
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
        const { history } = this.props;
        const { infoSN } = this.state
        const Atig = this.formatFecha(infoSN.antiguedad);
        //const addr = this.renderClientAddress('.', 'C1294- FISCAL')
        const addr = [infoSN.BillAddres, infoSN.ShipAddres];
        return (
            <div className="content-fluid reports" style={{ marginTop: 150, paddingBottom: 20, paddingRight: 0, backgroundColor: config.Back.backgroundColor }}>
                <Session history={history} view={VIEW_NAME.ABOUT_US_VIEW} />
                <NavBar isShowMarcas={false} />
                <div className='data-container' style={{marginTop:'13rem'}}>
                    <h1>Datos de Cuenta y Crédito</h1>
                    <table className='account-data'>
                        <tr>
                            <th colSpan='6' style={{ background: config.Back.color, color: 'white' }}>DATOS DEL CLIENTE</th>
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
                        <tr className='just-one-h' style={{ background: config.Back.transparent}}>
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
                        <tr className='just-one-h' style={{ background: config.Back.transparent}}>
                            <td colSpan='3'>
                                <b>Responsable de Cuenta: </b><br />
                                <span>{infoSN.Responsable}</span>
                            </td>
                            <td colSpan='3'>
                                <b>Correo electrónico: </b><br />
                                <span>{infoSN.Email}</span>
                            </td>
                        </tr>
                        <tr className='just-one-h'>
                            <td colSpan='2'>
                                <b>Teléfono 1: </b>
                                <br />
                                <span>{infoSN.Phone1}</span>
                            </td>
                            <td colSpan='2'>
                                <b>Teléfono 2: </b>
                                <br />
                                <span>{infoSN.Phone2}</span>
                            </td>
                            <td colSpan='2'>
                                <b>Celular: </b>
                                <br />
                                <span >{infoSN.Cellular}</span>
                            </td>
                        </tr>
                        {/* <tr className='two-h' style={{ background: 'rgb(231,241,250)' }}>
                            <td colSpan='6' style={{fontWeight: 'bolder'}}>Comentario:
                                <br />
                                <span>{infoSN.Notes}</span>
                            </td>
                        </tr> */}
                    </table>
                    <div className='container-fluid p-0 m-0' style={{width: '100%'}}>
                        <div className='row justify-content-center'>
                            <div className='col-lg-4 col-md-6 col-12 mt-4'>
                                <div style={{ background: config.Back.transparent, padding: '10px 20px' }}>
                                    <b>Límite de Crédito</b> <br />
                                    <span style={{fontSize: '20px'}}>
                                        <CurrencyFormat 
                                            value={infoSN?.LimiteCredito ?? "0"} 
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            fixedDecimalScale={true} 
                                            decimalScale={2} 
                                            prefix={'$ '}
                                            suffix={''}>
                                        </CurrencyFormat>
                                    </span> 
                                    <span style={{fontSize: '10px'}}>{config.general.currency}</span>
                                </div> 
                            </div>
                            <div className='col-lg-4 col-md-6 col-12 mt-4'>
                                <div style={{ background: 'white', border: 'solid 1px grey', padding: '10px 20px'}}>
                                    <b>Crédito Disponible </b> <br />
                                    <span style={{fontSize: '20px'}}>
                                        <CurrencyFormat 
                                            value={infoSN?.LineaCreditoDisp ?? "0"} 
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            fixedDecimalScale={true} 
                                            decimalScale={2} 
                                            prefix={'$ '}
                                            suffix={''}>
                                        </CurrencyFormat>
                                    </span> 
                                    <span style={{fontSize: '10px'}}>{config.general.currency}</span>
                                </div>  
                            </div>
                            <div className='col-lg-4 col-md-6 col-12 mt-4'>
                                <div style={{ background: config.Back.transparent, padding: '10px 20px'}}>
                                    <b>Saldo Total</b> <br />
                                    <span style={{fontSize: '20px'}}>
                                        <CurrencyFormat 
                                            value={infoSN?.SaldoTotal ?? "0"} 
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            fixedDecimalScale={true} 
                                            decimalScale={2} 
                                            prefix={'$ '}
                                            suffix={''}>
                                        </CurrencyFormat>
                                    </span> 
                                    <span style={{fontSize: '10px'}}>{config.general.currency}</span>
                                </div>   
                            </div>
                            <div className='col-lg-4 col-md-6 col-12 mt-4'>
                                <div style={{ background: 'white', border: 'solid 1px grey', padding: '10px 20px'}}>
                                    <b>Crédito Comprometido</b> <br />
                                    <span style={{fontSize: '20px'}}>
                                        <CurrencyFormat 
                                            value={infoSN?.LineaCreditoComprometida ?? "0"} 
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            fixedDecimalScale={true} 
                                            decimalScale={2} 
                                            prefix={'$ '}
                                            suffix={''}>
                                        </CurrencyFormat>
                                    </span> 
                                    <span style={{fontSize: '10px'}}>{config.general.currency}</span>
                                </div>   
                            </div>
                            <div className='col-lg-4 col-md-6 col-12 mt-4'>
                                <div style={{ background: config.Back.transparent, padding: '10px 20px'}}>
                                    <b>Saldo Vencido</b> <br />
                                    <span style={{fontSize: '20px'}}>
                                        <CurrencyFormat 
                                            value={infoSN?.MontoVencido ?? "0"} 
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            fixedDecimalScale={true} 
                                            decimalScale={2} 
                                            prefix={'$ '}
                                            suffix={''}>
                                        </CurrencyFormat>
                                    </span> 
                                    <span style={{fontSize: '10px'}}>{config.general.currency}</span>
                                </div>    
                            </div>
                            <div className='col-lg-4 col-md-6 col-12 mt-4'>
                                <div style={{ background: 'white', border: 'solid 1px grey', padding: '10px 20px'}}>
                                    <b>Pendiente por Facturar</b> <br />
                                    <span style={{fontSize: '20px'}}>
                                        <CurrencyFormat 
                                            value={infoSN?.PendienteFacturar ?? "0"} 
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            fixedDecimalScale={true} 
                                            decimalScale={2} 
                                            prefix={'$ '}
                                            suffix={''}>
                                        </CurrencyFormat>
                                    </span> 
                                    <span style={{fontSize: '10px'}}>{config.general.currency}</span>
                                </div>  
                            </div>
                        </div>
                    </div>

                    <br />
                    <table>
                        <tr style={{ background: '#686868', color: 'white' }}> <th>Estado de Cuenta</th> </tr>
                        <tr style={{ border: 'solid 1px gray', textAlign: 'center', fontSize: '14px' }}> <td>FACTURAS VENCIDAS: {infoSN?.DocsVencidos ? (infoSN?.DocsVencidos > 0) ? <span style={{ color: 'red' }}> {infoSN?.DocsVencidos} </span> : <span> 0 </span> : <span> 0 </span>}</td> </tr>
                    </table>
                    <br />
                    <table className='account-data'>
                        <tr>
                            <th colSpan='6' style={{ background: config.Back.color, color: 'white' }}>ATENCIÓN A CUENTA</th>
                        </tr>
                        <tr className='just-one-h'>
                            <td>
                                <b>Asesor: </b><br />
                                <span>{infoSN.Responsable}</span>
                            </td>
                            <td>
                                <b>Tel: </b><br />
                                <span>{infoSN.ResponsablePhone}</span>
                            </td>
                            <td>
                                <b>Email: </b><br />
                                <span>{infoSN.ResponsableEmail}</span>
                            </td>
                        </tr>
                    </table>
                </div>
                <br></br>
                <div className='button-cont' >
                    <button className='btcont p-3 pl-5 pr-5' style={{ marginLeft:'50px', fontSize: '16px',backgroundColor:config.Back.color, borderRadius: '50px', color:'white',display: 'flex !important', justifyContent:'center !important', alignContent:'center !important'}} onClick={this.handleEstadoDeCuentaClick}>Estado de cuenta</button>
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
)(ResumenCuenta);