import React, {Component} from 'react';
import {DISPATCH_ID, SERVICE_API, config} from "../../libs/utils/Const";
import {connect} from "react-redux";
import moment from 'moment';
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';

const styles = {
    rowHeader: {
        backgroundColor: '#686868',
        border: 'solid 5px white',
        cursor: 'pointer'
    },
    row1: {
        backgroundColor: 'white',
        borderBottom: 'solid 3px #D8D8D8'
    },
    row2: {
        backgroundColor: 'white',
        borderBottom: 'solid 3px #D8D8D8',
        width: '250px', 
        fontSize:"1rem"
    }
};

require('datatables.net-bs4');

class AccountStatusData extends Component {
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

    // Se llena la tabla con la configuración
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

    changeDocsToPrint(docEntry, next){
        const index = this.state.docsToPrint.indexOf(docEntry);
        if (index === -1) {
            this.setState({
                docToPrint: this.state.docsToPrint.push(docEntry)
            })
        }else{
            this.setState({
                docToPrint: this.state.docsToPrint.splice(index,1)
            })
        }
        next(this.state.docsToPrint);
    }

    render() {
        const { orders, handleDocsChange, selectAllChecked, handleSelectAllChange}  = this.props;   
        const {docsToPrint} = this.state;     
        const date2 = new Date(moment(new Date()).utc().format('YYYY-MM-DD')); 

        return (
            <div className="content-fluid" style={{backgroundColor: config.Back.backgroundColor}}>
                <div className="row">
                    <div className="col-md-12 table-responsive tableReports">
                        {/* Checkbox para Seleccionar Todos */}
                            <div className="form-check ml-1" style={{ minWidth: "70px" }} hidden={docsToPrint.length > 0}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selectAllChecked}
                                    onChange={handleSelectAllChange}
                                    id="selectAllCheckbox"
                                />
                                <label className="form-check-label" htmlFor="selectAllCheckbox">
                                    Seleccionar Todo
                                </label>
                            </div>
                        <table id="tablaBills" className="table table-striped scrolltable">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr style={{color: "white", fontSize:"1rem"}}>
                                    <th scope="col-auto" style={styles.rowHeader} hidden={selectAllChecked}>Selección</th>
                                    <th scope="col-auto" style={styles.rowHeader}>Doc</th>
                                    <th scope="col-1" style={styles.rowHeader}>N° de Documento</th>
                                    <th scope="col-1" style={styles.rowHeader}>Fecha de Documento</th>
                                    <th scope="col-1" style={styles.rowHeader}>Fecha de Vencimiento</th>
                                    <th scope="col-1" style={styles.rowHeader}>Días de atraso</th>
                                    <th scope="col-1" style={styles.rowHeader}>Total</th>
                                    <th scope="col-1" style={styles.rowHeader}>Saldo Vencido</th>
                                </tr>
                            </thead>
                            <tbody style={{textAlign: "-webkit-center"}}>
                                {!!orders && orders.map((order, index) => {
                                    //if(index >= 10) return;                                    
                                    let date1 = new Date(moment(order?.DocDueDate).utc().format('YYYY-MM-DD'));
                                    let lateDays = (date2?.getTime() - date1?.getTime()) / (1000 * 3600 * 24); 

                                    return (<tr key={index}>
                                        <td className="text-center" style={styles.row1} hidden={selectAllChecked}>
                                            <div class="form-check" style={{minWidth: "70px"}}>
                                                <input class="form-check-input" type="checkbox" value={order.DocEntry} onChange={(event)=>this.changeDocsToPrint(event.nativeEvent.target.value, handleDocsChange)} id="ordersToPrint"/>                                               
                                            </div>
                                        </td>
                                        <td className="col-lg-4" style={styles.row2}>
                                        
                                            <a href={`${config.BASE_URL}/${SERVICE_API.getBillspdf}/${order.DownloadFacturaPDF}`} target="_blank" style={{fontSize:"1rem"}} hidden={order.DownloadFacturaPDF ? false : true}>
                                                <span style={{ color: config.footer.iconColor}}>Descargar pdf <img src="https://image.flaticon.com/icons/png/512/337/337946.png" style={{ maxHeight: 20 }}></img></span>
                                            </a>
                                            <a href={`${config.BASE_URL}/${SERVICE_API.getBillsxml}/${order.DownloadFacturaXML}`} target="_blank" style={{fontSize:"1rem"}} hidden={order.DownloadFacturaXML ? false : true}>
                                                <span style={{ color: config.footer.iconColor }}>Descargar xml <img src="https://image.flaticon.com/icons/png/512/1548/1548741.png" style={{ maxHeight: 20 }}></img></span>
                                            </a>
                                        </td>
                                        <td style={styles.row2}>{order.DocNum}</td>
                                        <td style={styles.row2}>{moment(order.DocDate).utc().format('YYYY-MM-DD')}</td>
                                        <td style={styles.row2}>{moment(order.DocDueDate).utc().format('YYYY-MM-DD')}</td>
                                        <td style={styles.row2}>{
                                            lateDays ?
                                                (lateDays > 0) ?
                                                    (order.DocStatus === 'C') ?
                                                        <span>FACTURA PAGADA</span>
                                                        :
                                                        <span style={{ color: 'red' }}>{lateDays}</span>
                                                    : <span>{lateDays}</span>
                                                : <span>0</span>
                                        }
                                        </td>
                                        <td style={styles.row2} className="">
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
                                        <td className="col-lg-3 text-center" style={styles.row2}>
                                            <CurrencyFormat 
                                                value={order.DueTotal} 
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
)(AccountStatusData);