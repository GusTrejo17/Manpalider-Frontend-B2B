import React, {Component} from 'react';
import {OrderDetailsModal} from "../../components";
import {DISPATCH_ID, SERVICE_RESPONSE, config} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import moment from 'moment';
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';

require('datatables.net-bs4');

const apiClient = ApiClient.getInstance();

class OrdersSellerView extends Component {

    state = {
        orders: [],
        order: {
            header: {},
            body: []
        },
    };

    async componentDidMount() {
        const {enableSpinner} = this.props;
        enableSpinner(true);
        let Partner = localStorage.getItem(config.general.localStorageNamed + 'PartnerUser');
        //console.log(Partner);
        await apiClient.getOrdersSeller(Partner).then( response => {
            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                this.setState({
                    orders: response.data,
                });
                $('#tablaOrderSeller').DataTable({
                    "paging": false,
                    "info": false,
                    "searching": false
                });
            }
        });
        enableSpinner(false);
    }

    openOrder = async docEntry => {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        enableSpinner(true);
        let response = await apiClient.getOrder(docEntry);
        enableSpinner(false);

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            this.setState({
                order: response.data,
            });

            $('#orderDetailsModal').modal('show');
            return;
        }

        showAlert({type: 'error', message: "Aviso: "+response.message})
    };
    docChangeName(status){
        let result = '';
        switch (status) {
            case 'O':
                result = "Abierto";
                break;
            case 'C':
                result = "Cerrado";
                break;
            default:
                break;
        }
        return result;
    };
    docChangeNameFMB(status){
        let result = '';
        switch (status) {
            case '0':
                result = "Sin Atención";
                break;
            case '1':
                result = "Atendido";
                break;
            case '2':
                result = "Facturado";
                break;
            default:
                break;
        }
        return result;
    };

    render() {
        const {orders, order} = this.state;
        return (
            <div className="content-fluid">
                <OrderDetailsModal order={order}/>
                <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>
                    <div className="col-md-12">
                        <h3>Pedidos</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <table id="tablaOrderSeller" className="table table-striped">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white"}}>
                                    <th scope="col">No. de pedido</th>
                                    <th scope="col">Fecha de creación</th>
                                    <th scope="col">Dirección de entrega</th>
                                    <th scope="col">Estado del documento</th>
                                    <th scope="col">Estado del pedido</th>
                                    <th scope="col">Valor total</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => {
                                    return (<tr key={index}>
                                        <th scope="row">{order.DocNum}</th>
                                        <td>{moment(order.TaxDate).utc().format('YYYY-MM-DD')}</td>
                                        <td>{order.Address2}</td>
                                        <td>{this.docChangeName(order.DocStatus)}</td>
                                        <td>{this.docChangeNameFMB(order.U_FMB_Handel_Status)}</td>
                                        <td className="text-right">
                                            <CurrencyFormat 
                                                value={order.DocTotal} 
                                                displayType={'text'} 
                                                thousandSeparator={'.'}
                                                decimalSeparator={','}
                                                prefix={'$ '}
                                                suffix={config.general.currency}>
                                            </CurrencyFormat>
                                            
                                        </td>
                                        <td>
                                            <span onClick={() => this.openOrder(order.DocEntry)}>
                                                <i className={config.icons.detail} style={{color: '#0060EA', paddingRight: 6}}></i>
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
)(OrdersSellerView);