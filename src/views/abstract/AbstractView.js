import React, {Component} from 'react';
import {Session, OrderDetailsModal} from "../../components";
import {DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE, VIEW_NAME, config} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import moment from 'moment';
import CurrencyFormat from 'react-currency-format';
import './resumen.css';

require('datatables.net-bs4');

const apiClient = ApiClient.getInstance();

class AbstractView extends Component {
    constructor(props){
        super(props);
        this.state = {
            totaldeliveries: [],
            totalinvoices: [],
            itemsdeliveries: [],
            itemsinvoices: [],
            itemsinvoicescredito: [],
            itemsdeliveriescredito: [],
            datare: [],
        };
    }

    async componentDidMount() {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        try {
            let creatorUser = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
            // console.log("parent", creatorUser);
            let fecha = moment(new Date()).format('YYYY-MM-DD')
            this.setState({
                datare: creatorUser
            });
        } catch (error) {
            showAlert({type: 'warning', message: 'Vendedor no encontrado ', timeOut: 8000});
        }  
        setTimeout( async () => {
            await this.fillDataOrders();
        },300);
       
    }

    fillDataOrders = async () => {
    //    const {enableSpinner, notificationReducer: {showAlert}, fechaFinal, fechaInicio} = this.props;
    //    const { datare } = this.state;
    //    let actualdate = moment().format('YYYYMMDD');
    //    // console.log("Fechas", fechauno, " - ",fechados);
    //    
    //    // console.log("Data en abstrat", datare) ;
    //    let data = {
    //        slpCode: datare.salesPrson, 
    //        fechauno: moment(fechaInicio).format('YYYYMMDD') || actualdate,
    //        fechados: moment(fechaFinal).format('YYYYMMDD') || actualdate,
    //    }
    //    // console.log("Va para el back", data);
    //    enableSpinner(true);
    //    await apiClient.getDataResumen(data).then( response => {
    //        //console.log("Se imprometodo", response);
    //        this.setState({
    //            itemsinvoices: response.data[0],
    //            itemsinvoicescredito: response.data[1],
    //            totalinvoices: response.data[2],
    //            itemsdeliveries: response.data[3],
    //            itemsdeliveriescredito: response.data[4],
    //            totaldeliveries: response.data[5]
    //        });
    //    });
    //    enableSpinner(false);
    //}
    //Evento para capturar los valores de los campos
    // handelChange = ({ target }) => {
    //     const { name, value } = target;
    //     this.setState({
    //         [name]: value
    //     });
    };

    printElement = (elem) => {
         
        var domClone = elem.cloneNode(true);
        
        var $printSection = document.getElementById("printSection");
        
        if (!$printSection) {
            var $printSection = document.createElement("div");
            $printSection.id = "printSection";
            document.body.appendChild($printSection);
        }
        
        $printSection.innerHTML = "";
        $printSection.appendChild(domClone);
        window.print();
    }
    
    render() {
        const {totaldeliveries, totalinvoices, itemsdeliveries,itemsinvoices, itemsdeliveriescredito, itemsinvoicescredito} = this.state;
        const { handleInputDateInicio, handleInputDateFinal, fechaFinal,fechaInicio}  = this.props;
        
        return (
            <div className="content-fluid vista" id="resumenVendor" style={{backgroundColor: config.Back.backgroundColor}}>
                <div className="row encabezado">
                    <div className="col-sm-12">
                        <img className="img-fluid" src={ config.navBar.icon }/>
                    </div>
                    <div className="col-sm-12">
                        <div className="row">
                            <div className="col-sm-12">
                                <h1 className="align-middle text-center">COSTA GAS</h1>
                            </div>
                            <div className="col-sm-12">
                                <div className="align-middle text-center"><strong>RUC 205073122777</strong></div>
                                <div className="align-middle text-center"><strong>JR. LOS GALLOS MZA LOTE 13</strong></div>
                                <div className="align-middle text-center">LIMA-LIMA-LURIN</div>
                            </div>                             
                        </div>
                    </div>
                </div>
                <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>
                    <div className="col-md-12">
                        <h3>Resumen</h3>
                    </div>
                </div>
                <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>
                    
                    <div className=" row col-md-4">
                        <h4 className="pb-3">Desde:</h4>
                        <input 
                            id="fechaInicio"
                            type="date" 
                            className="form-control col-md-6" 
                            name="fechauno" 
                            value = {fechaInicio}
                            onChange = {(event) => handleInputDateInicio(event)}/>
                    </div>
                    <div className="row col-md-4 pb-3">
                        <h4 className="pb-3">Hasta:</h4>
                        <input 
                            id="FechaFin"
                            type="date" 
                            className="form-control col-md-6" 
                            name="fechados" 
                            value = {fechaFinal}
                            onChange = {(event) => handleInputDateFinal(event)}/>
                    </div>
                    <div className="col-md-2 pb-3">
                        <button
                            onClick={ async () => {
                                await this.fillDataOrders();
                            }}
                            className="btn botonResumen" 
                            style={{
                                backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                color: config.navBar.textColor2,
                                fontWeight: "bold",
                            }}>
                            Ver resumen
                        </button>
                    </div>
                    <div className="col-md-2 pb-2">
                        <button
                            className="btn botonResumen"
                            onClick ={ ()=> this.printElement(document.getElementById("resumenVendor"))}
                            style={{
                                backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                color: config.navBar.textColor2,
                                fontWeight: "bold",
                            }}>
                            <i className="fas fa-print botonResumen"></i> Imprimir
                        </button>
                        {/* <label className="btn float-left" onClick ={ ()=> this.printElement(document.getElementById("resumenVendor"))}> <i className="fas fa-print"></i>Imprimir</label>  */}
                    </div>
                    
                </div>
                {/* Total facturas */}
                <div className="row">
                    <div className="col-md-12">
                        <h3>Facturas</h3>
                    </div>                    
                </div>
                <div className="row">
                    <div className="col-md-12 table-responsive">
                        <table className="table table-striped">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr className="cabecera1">
                                    <th scope="col">Total Contado</th>
                                    <th scope="col">Impuesto total</th>
                                    <th scope="col">Total de percepeción</th>
                                    <th scope="col">Total pagado</th>
                                    <th scope="col">Total sin impuestos</th>
                                    <th scope="col">Total a crédito</th>
                                </tr>
                            </thead>
                            <tbody>
                                {totalinvoices.map((item, index) => {
                                    return (<tr key={index}>
                                        <th scope="row">
                                            <CurrencyFormat 
                                                value={item ? Number(item.Total).toFixed(2) : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}
                                                >
                                            </CurrencyFormat>
                                        </th>
                                        <td>
                                            <CurrencyFormat 
                                                value={item ? Number(item.Impuetso18).toFixed(2) : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}
                                                >
                                            </CurrencyFormat>
                                        </td>
                                        <td>
                                            <CurrencyFormat 
                                                value={item ? Number(item.Percep).toFixed(2) : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </td>
                                        <td >
                                            <CurrencyFormat 
                                                value={item ? Number(item.TotalpAGADO).toFixed(2) : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </td>
                                        <td >
                                            <CurrencyFormat 
                                                value={item ? Number(item.SSinnada).toFixed(2) : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </td>
                                        <th scope="row">
                                            <CurrencyFormat 
                                                value={item ? Number(item.TotalCREDITO).toFixed(2) : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </th>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Detalles de facturas al contado */}
                <div className="row">
                    <div className="col-md-12">
                        <h3>Detalles de facturas (Contado)</h3>
                    </div>                    
                </div>
                <div className="row">
                    <div className="col-md-12 table-responsive">
                        <table className="table table-striped">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr className="cabecera1">
                                    <th scope="col">Artículo</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col">Unidad</th>
                                    <th scope="col">Valor sin impuesto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemsinvoices.map((item, index) => {
                                    return (<tr key={index}>
                                        <th scope="row">
                                            {item ? item.ItemCode : ''}
                                        </th>
                                        <th scope="row">
                                            {item ? item.Dscription : ''}
                                        </th>
                                        <th scope="row">
                                            {item ? item.TotalQuantity : ''}
                                        </th>
                                        <td>
                                            {item ? item.unitMsr : ''}
                                        </td>
                                        <td >
                                            <CurrencyFormat 
                                                value={item ? Number(item.Sinnada).toFixed(2) : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </td>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Detalles de facturas al credito */}
                <div className="row">
                    <div className="col-md-12">
                        <h3>Detalles de facturas (Crédito)</h3>
                    </div>                    
                </div>
                <div className="row">
                    <div className="col-md-12 table-responsive">
                        <table className="table table-striped">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr className="cabecera1">
                                    <th scope="col">Artículo</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col">Unidad</th>
                                    <th scope="col">Valor sin impuesto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemsinvoicescredito.map((item, index) => {
                                    return (<tr key={index}>
                                        <th scope="row">
                                            {item ? item.ItemCode : ''}
                                        </th>
                                        <th scope="row">
                                            {item ? item.Dscription : ''}
                                        </th>
                                        <th scope="row">
                                            {item ? item.TotalQuantity : ''}
                                        </th>
                                        <td>
                                            {item ? item.unitMsr : ''}
                                        </td>
                                        <td >
                                            <CurrencyFormat 
                                                value={item ? Number(item.Sinnada).toFixed(2) : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </td>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Total de entregas */}
                <div className="row">
                    <div className="col-md-12">
                        <h3>Entrega</h3>
                    </div>                    
                </div>
                <div className="row">
                    <div className="col-md-12 table-responsive">
                        <table className="table table-striped">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr className="cabecera1">
                                    <th scope="col">Total Contado</th>
                                    <th scope="col">Impuesto total</th>
                                    <th scope="col">Total de percepeción</th>
                                    <th scope="col">Total pagado</th>
                                    <th scope="col">Total sin impuestos</th>
                                    <th scope="col">Total a crédito</th>
                                </tr>
                            </thead>
                            <tbody>
                                {totaldeliveries.map((item, index) => {
                                    return (<tr key={index}>
                                        <th scope="row">
                                            <CurrencyFormat 
                                                value={item ? Number(item.Total).toFixed(2) : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </th>
                                        <td>
                                            <CurrencyFormat 
                                                value={item ? Number(item.Impuetso18).toFixed(2) : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </td>
                                        <td>
                                            <CurrencyFormat 
                                                value={item ? Number(item.Percep).toFixed(2) : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </td>
                                        <td >
                                            <CurrencyFormat 
                                                value={item ? Number(item.TotalpAGADO).toFixed(2) : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </td>
                                        <td >
                                            <CurrencyFormat 
                                                value={item ? Number(item.SSinnada).toFixed(2) : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </td>
                                        <th scope="row">
                                            <CurrencyFormat 
                                                value={item ? Number(item.TotalCREDITO).toFixed(2) : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </th>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detalles de entregas al contado */}
                <div className="row">
                    <div className="col-md-12">
                        <h3>Detalles de Entrega (Contado)</h3>
                    </div>                    
                </div>
                <div className="row">
                    <div className="col-md-12 table-responsive">
                        <table className="table table-striped">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr className="cabecera1">
                                    <th scope="col">Artículo</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col">Unidad</th>
                                    <th scope="col">Valor sin impuesto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemsdeliveries.map((item, index) => {
                                    return (<tr key={index}>
                                        <th scope="row">
                                            {item ? item.ItemCode : ''}
                                        </th>
                                        <th scope="row">
                                            {item ? item.Dscription : ''}
                                        </th>
                                        <th scope="row">
                                            {item ? item.TotalQuantity : ''}
                                        </th>
                                        <td>
                                            {item ? item.unitMsr : ''}
                                        </td>
                                        <td >
                                            <CurrencyFormat 
                                                value={item ? Number(item.Sinnada).toFixed(2) : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </td>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Detalles de entregas al credito */}
                <div className="row">
                    <div className="col-md-12">
                        <h3>Detalles de Entrega (Crédito)</h3>
                    </div>                    
                </div>
                <div className="row">
                    <div className="col-md-12 table-responsive">
                        <table className="table table-striped">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr className="cabecera1">
                                    <th scope="col">Artículo</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col">Unidad</th>
                                    <th scope="col">Valor sin impuesto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemsdeliveriescredito.map((item, index) => {
                                    return (<tr key={index}>
                                        <th scope="row">
                                            {item ? item.ItemCode : ''}
                                        </th>
                                        <th scope="row">
                                            {item ? item.Dscription : ''}
                                        </th>
                                        <th scope="row">
                                            {item ? item.TotalQuantity : ''}
                                        </th>
                                        <td>
                                            {item ? item.unitMsr : ''}
                                        </td>
                                        <td >
                                            <CurrencyFormat 
                                                value={item ? Number(item.Sinnada).toFixed(2) : 0}
                                                displayType={'text'} 
                                                thousandSeparator={true} 
                                                fixedDecimalScale={true} 
                                                decimalScale={2} 
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
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
)(AbstractView);