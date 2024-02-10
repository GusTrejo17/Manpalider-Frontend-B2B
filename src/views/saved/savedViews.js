import React, {Component} from 'react';
import {Session, SaveDetailModel} from "../../components";
import {DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE, VIEW_NAME, config} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import moment from 'moment';
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import ExportReportGeneral from '../../components/ExportReportGeneral';

let doc = new jsPDF();

const apiClient = ApiClient.getInstance();

require('datatables.net-bs4');

class savedViews extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            order: {},
            fechaInicio: '',
            fechaFinal: '',
            seller: JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser')),
            // docsToPrint: [],
            selectAll: false,
            currentCart: {}
        };
        this.table = null;
    }

    async componentDidMount() {
        
        let fechaInicio = moment(new Date()).format('YYYY-MM-DD')
        let fechaFinal = moment(new Date()).format('YYYY-MM-DD')
        this.setState({
            fechaInicio,
            fechaFinal
        });
        setTimeout(async  () => {
            await this.getData();
        },300);
        this.fillDataOrders();
    }

    refreshSate = (param) =>{
        
        for (let index = 0; index < param.body.length; index++) {
            const element = param.body[index];
            element.beforeTotal = (Number(element.Price) * parseInt(element.Quantity)).toFixed(2);
        }
        
        this.setState({
            order:param,
        })
    }

    fillDataOrders = () => {
        const {enableSpinner,data} = this.props;
        this.table =  $('#tablaSaved').DataTable({
                "paging": true,
                "info": false,
                "searching": false,
                //"bDestroy": true,	
                "order": [[ 1, 'desc' ]],
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
            doc = null;
        }
        return true;
    }

    componentDidUpdate() {
        if (this.table == null) {
            this.fillDataOrders();
        }
    }

    getData = async ()=>{

        const { fechaInicio,fechaFinal } = this.state;
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        
        enableSpinner(true);
        let response = await apiClient.getSaveds(fechaInicio,fechaFinal);
        enableSpinner(false);

        if (!Array.isArray(response.data)) {
            showAlert({type: 'error', message: 'Ocurrió un error al consultar la Información'});
            return;
        }

        if (response.data.length === 0) {
            // showAlert({type: 'info', message: 'No hay Información por mostrar'});
            return;
        }

        this.setState({
            orders: response.data,
        });
    }

    //Evento para capturar los valores de los campos
    handelChange = ({ target }) => {
        const { name, value } = target;
        this.setState({
            [name]: value
        });
    };

    openOrder = async (docEntry, date, updateCart, cart) => {
        const {enableSpinner, notificationReducer: {showAlert}, sessionReducer: { user }} = this.props;
        enableSpinner(true);
        let response = await apiClient.getDataProduct(docEntry);
        enableSpinner(false);
        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            await this.setState({
                order: response.data,
                date: moment(date).utc().format('DD-MM-YYYY'),
                user: user.CardName.toUpperCase(),
                updateCart : updateCart,
                currentCart: cart
            });
            $('#saveModal').modal('show');
            return;
        }

        showAlert({type: 'error', message: response.message})
    };

    handleInputDateInicio = event =>{
        let fechaInicio = event.nativeEvent.target.value;
        this.setState({
            fechaInicio
        });
    }
    handleInputDateFinal = event =>{
        let fechaFinal = event.nativeEvent.target.value;
        this.setState({
            fechaFinal
        });
    }

    exportPDFOrders = async (type,Cart,date) => {
        const { notificationReducer: {showAlert},sessionReducer: { user } } = this.props;
        let init = moment(date).utc().format('DD-MM-YYYY');
        setTimeout(async () => {
            let Carts = await apiClient.getDataProduct(Cart);
            if (Carts.data.body.length > 0){
                let bodyArray = [];
                let minNewOrders = [];
                let body2FullMinNewOrders = [];
                Carts.data.body.map((order, index) => {
                    minNewOrders.push(
                        {
                            "#": index+1,
                            "Código": order.ItemCode,
                            "Descripción": order.ItemName,
                            "Cantidad": order.Quantity,
                            "Precio": '$ ' + Number(order.Price).toFixed(2),
                            "Precio total": '$ ' + Number(order.Price * parseInt(order.Quantity)).toFixed(2),
                        }
                    );
                    bodyArray.push(Object.values(minNewOrders[0]));
                    body2FullMinNewOrders = minNewOrders.slice(0);
                    minNewOrders.length = 0;
                });

                doc = new jsPDF();

                doc.autoTable({
                    head: [
                        [
                        {
                            content: `COTIZACIÓN DEL CLIENTE ${user.CardName.toUpperCase()} FECHA: ${init}`,
                            colSpan: 6,
                            styles: { halign: 'center', fillColor: config.navBar.iconColor },
                        },
                        ],
                        Object.keys(body2FullMinNewOrders[0])
                    ],
                    body: bodyArray,
                    theme: 'striped',
                    headerStyles: {
                        fillColor: config.navBar.iconColor
                    },
                    alternateRowStyles: {
                        fillColor: "#cecece",
                    }
                });
                
                if(type === 1){
                    doc.save(`Carrito_${user.CardCode}_${init}.pdf`);
                } else {
                    doc.save(`Carrito_${user.CardCode}_${init}.pdf`);
                    window.open(doc.output('bloburl'));
                }
            } else {
                showAlert({type: 'info', message: 'No se ha podido generar sus archivo, porque no se encontraron resultado para su búsqueda'});
            }
            
        }, 500);
    }

    openModalMailPDF = async () => {
        setTimeout(() => {
            $('#ModalSendPDF').modal('show');
        }, 500);         
    };

    // sendEmailByOutlook = async () =>{
    // try{

    //     var theApp = new ActiveXObject("Outlook.Application");
    //     var objNS = theApp.GetNameSpace('MAPI');
    //     var theMailItem = theApp.CreateItem(0); // value 0 = MailItem
    //     theMailItem.to = ('test@gmail.com');
    //     theMailItem.Subject = ('test');
    //     theMailItem.Body = ('test');
    //     // theMailItem.Attachments.Add("C:\\file.txt");
    //     theMailItem.display();
    //    }
    //    catch (err) {
    //       alert(err.message);
    //    } 
    // }

    // changeDocsToPrint(docEntry){
    //     const index = this.state.docsToPrint.indexOf(docEntry);
    //     if (index === -1) {
    //         this.setState({
    //             docToPrint: this.state.docsToPrint.push(docEntry)
    //         })
    //     }else{
    //         this.setState({
    //             docToPrint: this.state.docsToPrint.splice(index,1)
    //         })
    //     }
    //     // this.setState({
    //     //     docToPrint:[...this.state.docToPrint, docEntry]
    //     // })
    // }

    selectAllPage(){
        this.setState({
            selectAll: !this.state.selectAll
        })
    }

    render() {
        const { order, date, seller, updateCart, currentCart} = this.state;
        const { orders,getData,handleInputDateInicio, handleInputDateFinal, fechaFinal,fechaInicio, fechamin, fechamax, isLoaded,openModalMailPDF, sessionReducer, enableSpinner, docsToPrint, changeDocsToPrint, docsToPrintCopy, changeDocsToPrintCopy, user}  = this.props;
        let mailToSend = sessionReducer.user.U_FMB_Handel_Email;
        return (
            <div>
                <SaveDetailModel 
                    order={order} 
                    date={date} 
                    user={user} 
                    seller={seller} 
                    updateCart={updateCart} 
                    getData={getData} 
                    refreshSate ={this.refreshSate}
                    currentCart = {currentCart}
                />
            <div className="content-fluid" style={{backgroundColor: config.Back.backgroundColor}}>

                <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>
                    <div className="col-md-12 pb-2">
                        <h3  style={{fontWeight:"bolder",fontSize:"2.5rem", color:"black"}}>CARRITOS GUARDADOS</h3>
                    </div>                    
                </div>
                <div className="row text-center" style={{marginBottom: 16, marginTop: 16}}>
                    <div className="col-md-2 pb-2">

                        <button
                            // onClick={()=>openModalMailPDF()}
                            // onClick={()=>sendEmailByOutlook()}

                            className="btn botonResumen" 
                            style={{
                                backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                color: config.navBar.textColor2,
                                fontWeight: "bold",
                            }}>
                            <a style={{color: "white"}} href={"mailto:"+mailToSend+"?subject=ARCHIVOS DIASA&body=ENVIADO DESDE E-HANDEL DIASA" }>Enviar correo</a>
                            <i class="fa fa-paper-plane" aria-hidden="true" style={{marginRight:5}}></i>
                            {/* Enviar correo */}
                        </button>

                    </div>
                    <div className=" row col-md-3 ">
                        <h4 className="pr-2">Desde:</h4>
                        <input 
                            type="date" 
                            className="form-control col-md-6" 
                            name="fechauno" 
                            // min={fechamin}
                            max={fechamax}
                            value = {!isLoaded ? fechamin : fechaInicio}
                            onChange = {(event) => handleInputDateInicio(event)}/>
                    </div>
                    <div className="row col-md-3 pb-3">
                        <h4 className="pr-2">Hasta:</h4>
                        <input 
                            type="date" 
                            className="form-control col-md-6" 
                            name="fechados" 
                            // min={fechamin}
                            max={fechamax}
                            value = {fechaFinal}
                            onChange = {(event) => handleInputDateFinal(event)}/>
                    </div>
                    <div className="col-md-2 pb-2">
                        <button
                            onClick={()=>getData(1)}
                            className="btn botonResumen" 
                            style={{
                                backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                color: config.navBar.textColor2,
                                fontWeight: "bold",
                            }}>
                            Ver resultados
                        </button>
                    </div>                    
                </div>
                <div className="row">
                    
                    <div className="col-md-12 table-responsive tableReports">
                        <div className="ml-1">
                            {docsToPrint.length > 0 &&
                                <ExportReportGeneral
                                    data={docsToPrint}
                                    typeDocs={"savedCarts"}
                                    enableSpinner={enableSpinner}
                                    savedCart={docsToPrintCopy}
                                    user={user}
                                    seller={seller}
                                />
                            }
                        </div>
                        <table id="tablaSaved" className="table table-striped scrolltable">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr style={{backgroundColor: config.shoppingList.summaryList, color: "white"}}>
                                    <th scope="col-lg-3" ></th>
                                    <th scope="col-lg-3" style={{width: '250px',fontSize: "14px"}}>Fecha de creación</th>
                                    <th scope="col-lg-3" style={{width: '250px',fontSize: "14px"}}>No. de carrito</th>
                                    <th scope="col-lg-3" style={{width: '250px',fontSize: "14px"}}>Estado</th>
                                    {/* <th scope="col-lg-3" style={{width: '250px'}}>Descargar PDF</th> */}
                                    <th scope="col-lg-3" style={{width: '250px'}}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => {
                                    return (<tr key={index}>
                                        <td className="text-center">
                                            <div class="form-check" style={{minWidth: "70px"}}>
                                                <input class="form-check-input" type="checkbox" value={order.id} onChange={(event)=>{changeDocsToPrint(event.nativeEvent.target.value);changeDocsToPrintCopy(order)}} id="ordersToPrint"/>
                                            </div>
                                        </td>
                                        <th className="text-center" scope="col-lg-3 row" style={{ width: '250px', fontSize: '14px' }}>
                                            {moment(order.DateCart).utc().format('YYYY-MM-DD')}
                                        </th>
                                        <td className="col-lg-3 text-center" style={{width: '250px',fontSize: "14px"}}>{order.id}</td>
                                        <td className="col-lg-3 text-center" style={{width: '250px',fontSize: "14px"}}>{order.Status}</td>
                                        <td className="col-lg-3 text-center" style={{width: '250px',fontSize: "14px"}}>
                                            <span onClick={() => this.openOrder(order.id, order.DateCart, order.updateCart, order)}>
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
)(savedViews);