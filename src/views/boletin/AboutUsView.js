import React, {Component} from 'react';
import {Footer, NavBar, Session, Suscription} from "../../components";
import {DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE,VIEW_NAME, config} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import moment from 'moment';
import $, { parseJSON } from 'jquery';
import { CSVLink, CSVDownload } from "react-csv";
import CurrencyFormat from 'react-currency-format';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable'
import { animateScroll as scroll, scroller } from 'react-scroll';

let doc = new jsPDF();
require('datatables.net-bs4');

const apiClient = ApiClient.getInstance();


class AboutUsView1 extends Component {
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
            tableToExcel : []
        };
        this.table = null;
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }
    
    componentDidMount() {
        setTimeout(async  () => {
            await this.getData();
        },300);
        this.fillDataBilling();
        this.scrollToBottom();
    }

    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
    }

    fillDataBilling = () =>{
        this.table =  $('#tablaSellerItems').DataTable({
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

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.props.orders != nextProps.orders) {
            //console.log("hay nuevos datos");
            this.table.destroy();
            this.table = null;
            doc = null;
        }
        return true;
    }

    componentDidUpdate(){
        if (this.table == null) {
            this.fillDataBilling();
        }
    }

    getData = async () => {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        enableSpinner(true);
        let response = await apiClient.getAllEmails();
        

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            this.table.destroy();
            this.setState({
                orders: response.data,
            });
            enableSpinner(false);
            return;
        }
        enableSpinner(false);
        showAlert({type: 'error', message: response.message})

    }

    exportCSVOrders = async () => {
        const { notificationReducer: {showAlert}} = this.props;
        // this.getData();
        setTimeout(() => {
            const { orders } = this.state;
            if (orders.length > 0){
                let minNewOrders = [];
                orders.map((order, index) => {
                    minNewOrders.push(
                        {
                            "Correo": order.userEmail,
                            "Fecha de registro": moment(order.createDate).format('YYYY-MM-DD'),
                        }
                    );
                });
                this.setState({ tableToExcel: minNewOrders });
                setTimeout(() => {
                        this.csvLink.current.link.click();
                }, 500); 
            }else{
                showAlert({type: 'info', message: 'No se ha podido generar sus archivo, porque no se encontraron resultado para su búsqueda'});
            }
        }, 500);
    } 

    render() {
        const { order, tableToExcel, orders} = this.state;
        const {history} = this.props;

        return (
            <div className="content-fluid margenSuperiorMenuCategorias" style={{paddingRight:0, backgroundColor:"#fff" }}>
                <Session history={history} view={VIEW_NAME.ABOUT_US_VIEW}/>
                <NavBar/>
                <div className="content-fluid" style={{paddingTop: 120}} >
                {/* Descarga de CSV */}
                <CSVLink 
                    data={tableToExcel} 
                    filename ={`Correos_Boletin.csv`}                
                    className="hidden"
                    ref={this.csvLink}
                    target="_blank">
                </CSVLink>
                {/* Titulo del reporte */}
                <div className="row text-center" style={{paddingTop: 16, paddingBottom: 16}}>
                    <div className="col-md-12">
                        <h3>Clientes registrados en boletín</h3>
                    </div>
                </div>
                {/* Botones de fecha y de bsuqueda */}
                <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>
                    {/* <div className="col-md-2 pb-2">
                        <button
                            onClick={this.getData()}
                            className="btn botonResumen" 
                            style={{
                                backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                color: config.navBar.textColorCategorieHover,
                                fontWeight: "bold",
                            }}>
                            Actualizar
                        </button>
                    </div> */}
                    <div className="col-md-2 pb-2" >
                        <div className="input-group mb-3 justify-content-center">
                            <div className="input-group-prepend">
                                <div className="input-group-text">
                                    <i className="fas fa-file-excel " style = {{color: 'green'}}/>
                                </div>
                            </div>
                            <button
                                onClick={()=>this.exportCSVOrders()}
                                className="btn btn-outline-success botonResumen" 
                                style={{
                                    backgroundColor: 'green',
                                    color: 'white',
                                    fontWeight: "bold",
                                }}>
                                Exportar a Excel
                            </button>
                        </div>
                    </div>
                </div>
                {/* Tabla del resultado de la busqueda */}
                <div className="row">
                    <div className="col-md-12 table-responsive">
                        <table id="tablaSellerItems" className="table table-striped">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr style={{backgroundColor: '#0060EA', color: "white"}}>
                                    <th scope="col">Documento</th>
                                    <th scope="col">Fecha de registro</th>
                                </tr>
                            </thead>
                            <tbody style={{textAlign: "-webkit-center"}}>
                                {orders.map((item, index) => {
                                    return (<tr key={index}>
                                        <th scope="row">{item ? item.userEmail : ''}</th>
                                        <th scope="row">{moment(item.createDate).format('YYYY-MM-DD')}</th>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
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
)(AboutUsView1);