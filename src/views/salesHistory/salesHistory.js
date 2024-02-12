import React, { Component } from 'react';
import { GeneralOrderDetailsModal } from "../../components";
import { DISPATCH_ID, config, SERVICE_RESPONSE, SERVICE_API } from "../../libs/utils/Const";
import { ApiClient } from "../../libs/apiClient/ApiClient";
import { connect } from "react-redux";
import moment from 'moment';
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';
import ExportReportGeneral from '../../components/ExportReportGeneral';
require('datatables.net-bs4');

const apiClient = ApiClient.getInstance();


class SalesHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            order: {
                header: {},
                body: []
            },
            guia: [],
            seller: JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser')), // Propiedades del vendedor, se visulaizan en el aplication
            filter: ''
        };
        this.table = null;
    }

    componentDidMount() {
        this.fillDataGeneralOrders();
    }

    fillDataGeneralOrders = () => {
        const { enableSpinner, data } = this.props;
        this.table = $('#tablaHistorialCompra').DataTable({
            "paging": true,
            "info": false,
            "searching": false,
            "order": [[0, 'desc']],
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

            this.table.destroy();
            this.table = null;
        }
        return true;
    }
    componentDidUpdate(): void {
        if (this.table == null) {
            this.fillDataGeneralOrders();
        }
    }

    docChangeName(status) {
        let result = '';
        switch (status) {
            case 'O':
                result = 'Abierto';
                break;
            case 'C':
                result = 'Cerrado';
                break;
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

    openOrder = async docEntry => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        enableSpinner(true);
        let response = await apiClient.getOrder(docEntry);
        enableSpinner(false);

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            this.setState({
                order: response.data,
                guia: response.data.statusGuia || [],
            });

            $('#generalOrderDetailsModal').modal('show');
            return;
        }

        showAlert({ type: 'error', message: response.message })
    };

    docChangeNameFMB(target, base) {
        let result = '';
        let response = target !== -1 ? target : base

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
                result = 'Atendido';
                break;
        }
        return result;
    };

    // handleInputFilter = event => {
    //     this.setState({
    //         filter: event.nativeEvent.target.value
    //     });
    // }


    render() {
        const { enableSpinner, configReducer: { idCategoryFilter, idSubCategoryFilter } } = this.props; //redux
        const { order, guia, seller  } = this.state;
        const { orders, getData, handleInputDateInicio, handleInputDateFinal, fechaFinal, fechaInicio, fechamin, fechamax, isLoaded, inputItemCode, docsToPrint, changeDocsToPrint, user, filter, handleInputFilter} = this.props;
        return (
            
            <div className="content-fluid" style={{ backgroundColor: config.Back.backgroundColor }}>
                <GeneralOrderDetailsModal order={order} guia={guia} />
                <div className="row text-center" style={{ marginBottom: 16, marginTop: 16 }}>
                    <div className="col-md-12 pb-2">
                        <h3 style={{ fontWeight: "bolder", fontSize: "2.5rem", color: "black" }}>HISTORIAL DE COMPRA</h3>
                    </div>
                </div>

                <div className="row text-center" style={{ marginBottom: 16, marginTop: 16 }}>
                    {/* <div className="col-md-3 pb-2 " style={{ display:'flex' }}>
                        <h4 className="pr-2">ItemCode:</h4>
                        <div class="wrap " style={{ marginBottom: "1%", minWidth: '-webkit-fill-available' }}>
                            <div class="search">
                                <input
                                    id="inputSearch"
                                    className="form-control col-md-6 searchTerm"
                                    type="text"
                                    placeholder="ItemCode del articulo"
                                    onChange = {(event) => inputItemCode(event)}
                                />
                            </div>
                        </div>
                    </div> */}
                    <div className="col-md-3 pb-2">
                        <div class="wrap " style={{ marginBottom: "1%" }}>
                            <div class="search" style={{ justifyContent: "center" }}>
                            <div id="hover-message" style={{position: 'absolute', left: 0, right:5, top: '-35%', transform: 'translateY(-50%)', opacity: 0, transition: 'opacity 0.3s ease', pointerEvents: 'none'}}>
                                Filtrado por: ID de Artículo, Artículo o Marca
                            </div> 
                                <input
                                    id="inputSearch"
                                    className="form-control col-md-6 searchTerm"
                                    type="text"
                                    placeholder="Filtrado"
                                    value={filter}
                                    disabled={docsToPrint.length!==0}
                                    onChange={(event) => handleInputFilter(event)}
                                    // onBlur={this.onTextChanged}
                                    onKeyDown={event => event.keyCode === 13 && filter.trim() !== '' && getData(10, filter)}
                                    onFocus={(event) => event.target.placeholder = ''}
                                    onBlur={(event) => event.target.placeholder = 'Filtrado'}
                                    onMouseEnter={() => document.getElementById('hover-message').style.opacity = '1'}
                                    onMouseLeave={() => document.getElementById('hover-message').style.opacity = '0'}
                                />

                                <button type="button" className="searchButton" onClick={() => filter.trim() !== '' && getData(10, filter)} disabled={docsToPrint.length!==0}>
                                    <i style={{ fontSize: "1.3rem" }} className={config.icons.search} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className=" row col-md-3">
                        <h4 className="pr-2">Desde:</h4>
                        <input
                            id="fechaInicio"
                            type="date"
                            className="form-control col-md-6"
                            name="fechauno"
                            // min={fechamin}
                            max={fechamax}
                            value={!isLoaded ? fechamin : fechaInicio}
                            onChange={(event) => handleInputDateInicio(event)} />
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
                            value={fechaFinal}
                            onChange={(event) => handleInputDateFinal(event)} />
                    </div>
                    <div className="row col-md-2 pb-3">
                        <button
                            onClick={() => getData(10)}
                            className="btn botonResumen"
                            style={{
                                backgroundColor: config.Back.color,
                                color: config.navBar.textColor2,
                                fontWeight: "bold",
                            }}>
                            Consultar historial
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 table-responsive tableReports">
                        <div className="ml-1">
                            {docsToPrint.length > 0 &&
                                <ExportReportGeneral
                                    data={docsToPrint}
                                    typeDocs={"history"}
                                    enableSpinner={enableSpinner}
                                    user={user}
                                />
                            }
                        </div>
                        <table id="tablaHistorialCompra" className="table table-striped scrolltable" style={{ fontSize: "1.2rem" }}>
                            <thead style={{ textAlign: "-webkit-center" }}>
                                <tr style={{ backgroundColor: config.shoppingList.summaryList, color: "white", fontSize: "1rem" }}>
                                    <th scope="col-lg-auto"></th>
                                    <th scope="col-lg-auto">Fecha</th>
                                    <th scope="col-lg-auto">No. pedido</th>
                                    <th scope="col-lg-auto">ID del articulo</th>
                                    <th scope="col-lg-auto">Articulo</th>
                                    <th scope="col-lg-auto">Marca</th>
                                    <th scope="col-lg-auto">Cantidad</th>
                                    <th scope="col-lg-auto">Precio</th>
                                    {seller && (seller.U_FMB_Handel_Perfil !== 0 || seller.U_FMB_Handel_Perfil !== '0') && seller.U_FMB_Handel_Perfil != 5 ?
                                        <th scope="col-lg-auto">% Descuento</th> : <th></th>
                                    }
                                    <th scope="col-lg-auto">Precio con descuento</th>
                                    <th scope="col-lg-auto">Precio con IVA</th>
                                    <th scope="col-lg-auto">Orden de compra</th>
                                </tr>
                            </thead>
                            <tbody style={{ textAlign: "-webkit-center" }}>
                                {orders.map((order, index) => {
                                    let iva= ((order.TaxRate * .01) +1) * order.Price
                                    let descuento= Math.ceil(((Math.ceil(order.Price)/Math.ceil(order.OriginalPrice))*100)-100) * -1
                                    return (<tr key={index}>
                                        <td scope="col-lg-auto row" style={{ fontSize: "1rem", width: '250px' }}>
                                            <div class="form-check" style={{ minWidth: "70px" }}>
                                                <input class="form-check-input" type="checkbox" value={order.ItemCode} onChange={(event) =>changeDocsToPrint(order)} id="historyToPrint" />
                                            </div>
                                        </td>
                                        <th scope="col-lg-auto row" style={{ fontSize: "1rem", width: '250px' }}>{moment(order.DocDate).utc().format('YYYY-MM-DD')}</th>
                                        <td className="col-lg-auto" style={{ fontSize: "1rem", width: '250px' }}>{order.DocNum}</td>
                                        <td className="col-lg-auto" style={{ fontSize: "1rem", width: '250px' }}>{order.ItemCode}</td>
                                        <td className="col-lg-auto" style={{ fontSize: "1rem", width: '250px' }}>{order.ItemName}</td>
                                        <td className="col-lg-auto" style={{ fontSize: "1rem", width: '250px' }}>{order.U_Linea}</td>
                                        <td className="col-lg-auto" style={{ fontSize: "1rem", width: '250px' }}>{order.Quantity}</td>
                                        <td className="col-lg-auto" style={{ fontSize: "1rem", width: '250px' }}>
                                            <CurrencyFormat
                                                value={order.OriginalPrice}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                fixedDecimalScale={true}
                                                decimalScale={2}
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                        </td>
                                        {seller && (seller.U_FMB_Handel_Perfil !== 0 || seller.U_FMB_Handel_Perfil !== '0') && seller.U_FMB_Handel_Perfil !== 5 ?
                                            <td className="col-lg-auto" style={{ fontSize: "1rem", width: '250px' }}>{parseInt(order.DiscPrcnt)}%</td> : <td></td>
                                        }

                                        <td className="col-lg-auto" style={{ fontSize: "1rem", width: '250px' }}>
                                        <CurrencyFormat
                                                value={order.Price}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                fixedDecimalScale={true}
                                                decimalScale={2}
                                                prefix={'$ '}
                                                suffix={config.general.currency}
                                            />
                                        </td>
                                        <td className="col-lg-auto " style={{ fontSize: "1rem", width: '250px' }}>
                                            <CurrencyFormat
                                                value={iva}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                fixedDecimalScale={true}
                                                decimalScale={2}
                                                prefix={'$ '}
                                                suffix={config.general.currency}
                                            />
                                        </td>
                                        <td className="col-lg-auto" style={{ fontSize: "1rem", width: '250px' }}>
                                            <a href={`${config.BASE_URL}/${SERVICE_API.getOrderspdf}/${order.DownloadOrderPDF}`} target="_blank" style={{ fontSize: "1rem" }} hidden={order.DownloadOrderPDF ? false : true}>
                                                <span style={{ color: config.footer.iconColor }}>{order.U_NumOC ? order.U_NumOC : 'SN'}<img src="https://cdn-icons-png.flaticon.com/512/3997/3997593.png" style={{ maxHeight: 20 }}></img></span>
                                            </a>
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
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SalesHistory);