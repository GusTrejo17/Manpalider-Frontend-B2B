import React, {Component} from 'react';
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {CommentsModal, NavBar, Session} from "../../components";
import {DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE, VIEW_NAME, config} from "../../libs/utils/Const";
import moment from "moment";
import {connect} from "react-redux";
import {CSVLink, CSVDownload} from "react-csv";
import $ from 'jquery';
import { animateScroll as scroll, scroller } from 'react-scroll';

let apiClient = ApiClient.getInstance();

class MiddlewareView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Autorizaciones : [],
            csvData: [],
        };
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    async componentDidMount(): void {
        //const {enableSpinner} = this.props;
        //enableSpinner(true);
        this.cargarDatos();
        //enableSpinner(false);

        let middlewareResponse = await apiClient.validateMiddleware();
        if(middlewareResponse.status === SERVICE_RESPONSE.ERROR){
            document.getElementById("btnDetener").style.setProperty("opacity",".2");
            document.getElementById("btnIniciar").style.setProperty("opacity","1");
            return;
        }
        document.getElementById("btnIniciar").style.setProperty("opacity",".2");
        document.getElementById("btnDetener").style.setProperty("opacity","1");

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

    async cargarDatos (){
        //const {Tipo} = this.state;
        let user = localStorage.getItem(config.general.localStorageNamed + 'CurrentUser');
        user = JSON.parse(user) || {};
        //let usuario = user ? user.USERID : '1';
        //document.getElementById("commentarios").value = '';
        let newdatas = await apiClient.getAutorizacionesCanalModerno();
        let creados = await apiClient.getCreateCanalModerno();
        this.setState({
            Autorizaciones: newdatas.data.list,
            usuario : user,
            DocumentosCreados : creados.data.list
            //hola : newdatas.data
        });
    };

    Details = async (valor,Comments) => {
        const {usuario} = this.state;
        const {enableSpinner} = this.props;
        enableSpinner(true);
        let data = {
            valor : valor,
            tipo : 'DetailsAutorizationCanalModerno'
        }

        let response = await apiClient.getDatailsAutoCanalModerno(data);
        

        let csvData = [];

        if(response.status === 1){
            // showAlert({type: 'success', message: ' Agregado a carrito correctamente ', timeOut: 0});
            let infoCsv = response.data.body;
            infoCsv.map((item)=>{
                // let precioFinal = item.U_SYP_CCCOMENT - (item.U_SYP_CCCOMENT * (item.U_SYP_NOMEMP / 100));
                let totalsinIgv = (item.U_SYP_CCCOMENT)*(item.Quantity);
                let row ={
                    'Producto': item.ItemName,
                    'EAN': item.ItemCode,
                    'Cantidad': item.Quantity,
                    'Precio': item.Currency+' '+parseFloat(item.U_SYP_CCCOMENT).toFixed(2),
                    'Descuentos': '0 %',// parseFloat(item.U_SYP_NOMEMP).toFixed(2) + ' %',
                    'Precio Final': item.Currency+' '+parseFloat(item.U_SYP_CCCOMENT).toFixed(2),
                    'Total sin IGV': item.Currency+' '+parseFloat(totalsinIgv).toFixed(2), 

                    'Precio Vigente (con descuento) SAP' : item.Currency+' '+parseFloat(item.Price).toFixed(2),
                    'Total sin IGV SAP' : item.Currency+' '+parseFloat(item.LineTotal).toFixed(2),
                    'Dif. de P. Unit': parseFloat(item.Price).toFixed(2) - item.U_SYP_CCCOMENT, //item.StockTxt,
                    'Dif. Total': parseFloat(item.LineTotal-totalsinIgv).toFixed(2),
                    'Info': ' '
                }
                csvData.push(row);
            });
            let hoy = new Date();
            var Hora = hoy.getHours();
            var Min = hoy.getMinutes();
            var Fecha = hoy.toLocaleDateString();
                
            csvData[0].Info = "RUC "+response.data.body[0].CardCode.substring(1)+"        "+Fecha+"-"+Hora+":"+Min+"hs        "+usuario.CardName;
            csvData[1].Info = "NRO.SOLICITUD: "+response.data.body[0].id+" - FECHA : "+response.data.body[0].fecha;
            csvData[2].Info = "CLIENTE: "+response.data.body[0].CardName+"        EMISIÓN: "+response.data.body[0].DocDate.substring(0,10)+" - F.DESPACHO : "+response.data.body[0].DocDueDate.substring(0,10)+" - O/C : "+response.data.body[0].NumAtCard;

            response = response ? response.data.body : []
                this.setState({
                    order: response,
                    DocEntry : valor,
                    csvData,
                    action : 1
                });
            $('#saveModal').modal('show');
        }

        enableSpinner(false);
        
    };
    
    DetailsOQUT = async (valor,tipo) => {
        const {usuario} = this.state;
        const {enableSpinner} = this.props;
        enableSpinner(true);
        let data = {
            valor : valor,
            tipo : tipo
        }

        let response = await apiClient.getDatailsAutoCanalModerno(data);
        
        let csvData = [];

        if(response.status === 1){
            // showAlert({type: 'success', message: ' Agregado a carrito correctamente ', timeOut: 0});
            let infoCsv = response.data.body;
            infoCsv.map((item)=>{
                let precioFinal = item.U_SYP_CCCOMENT - (item.U_SYP_CCCOMENT * (item.U_SYP_NOMEMP / 100));
                let totalsinIgv = (precioFinal)*(item.Quantity);
                let row ={
                    'Producto': item.ItemName,
                    'EAN': item.ItemCode,
                    'Cantidad': item.Quantity,
                    'Precio': item.Currency+' '+parseFloat(item.U_SYP_CCCOMENT).toFixed(2),
                    'Descuentos': parseFloat(item.U_SYP_NOMEMP).toFixed(2) + ' %',
                    'Precio Final': item.Currency+' '+parseFloat(precioFinal).toFixed(2),
                    'Total sin IGV': item.Currency+' '+parseFloat(totalsinIgv).toFixed(2), 

                    'Precio Vigente (con descuento) SAP' : item.Currency+' '+parseFloat(item.Price).toFixed(2),
                    'Total sin IGV SAP' : item.Currency+' '+parseFloat(item.LineTotal).toFixed(2),
                    'Dif. de P. Unit': precioFinal - parseFloat(item.Price).toFixed(2), //item.StockTxt,
                    'Dif. Total': parseFloat(totalsinIgv-item.LineTotal).toFixed(2)
                }
                csvData.push(row);
            });
            // let hoy = new Date();
            // var Hora = hoy.getHours();
            // var Min = hoy.getMinutes();
            // var Fecha = hoy.toLocaleDateString();
                
            // csvData[0].Info = "RUC "+response.data.body[0].CardCode.substring(1)+"        "+Fecha+"-"+Hora+":"+Min+"hs        "+usuario.CardName;
            // csvData[1].Info = "NRO.SOLICITUD: "+response.data.body[0].id+" - FECHA : "+response.data.body[0].fecha;
            // csvData[2].Info = "CLIENTE: "+response.data.body[0].CardName+"        EMISIÓN: "+response.data.body[0].DocDate.substring(0,10)+" - F.DESPACHO : "+response.data.body[0].DocDueDate.substring(0,10)+" - O/C : "+response.data.body[0].NumAtCard;

            response = response ? response.data.body : []
                this.setState({
                    order: response,
                    DocEntry : valor,
                    csvData,
                    action : 0
                });
            $('#saveModal').modal('show');
        }

        enableSpinner(false);
        
    };
    

    start = async () =>{
        let middlewareResponse = await apiClient.Middleware(1);
        if(middlewareResponse.status === SERVICE_RESPONSE.ERROR){
            return;
        };
        document.getElementById("btnIniciar").style.setProperty("opacity",".2");
        document.getElementById("btnDetener").style.setProperty("opacity","1");
    };

    stop = async () => {
        let middlewareResponse = await apiClient.Middleware(0);
        if(middlewareResponse.status === SERVICE_RESPONSE.ERROR){
            return;
        };
        document.getElementById("btnDetener").style.setProperty("opacity",".2");
        document.getElementById("btnIniciar").style.setProperty("opacity","1");
    };

    // async handleInputChange (event) {
    //     var archivo = event.target.files[0];
        
    //     if (!archivo) {
    //       return;
    //     }
    //     var lector = new FileReader();
    //     lector.onload = function(e) {
    //       var contenido = e.target.result;
    //       var lineas = contenido.split('\n');

    //       for(var linea of lineas) {
    //         if(linea.substr(0,3) === 'LIN') {
    //         }
    //         if(linea.substr(0,3) === 'PRI') {
    //         }
    //       }
    //       //mostrarContenido(contenido);
    //     };
    //     lector.readAsText(archivo);
    // };

    render() {
        const {history} = this.props;
        const {Autorizaciones,order,csvData, DocumentosCreados,action} = this.state;
        return (
            <div className="content-fluid" style={{marginTop: 66}}>
                <Session history={history} view={VIEW_NAME.CANALMODERNO_VIEW}/>
                <NavBar/>
                <div className="container mb-4" style={{paddingTop: 60}}>
                    <div className="row">
                        <div className="col">
                            <div className="jumbotron">
                                <h1 className="display-4 text-center">Canal moderno</h1>
                            </div>
                        </div>
                    </div>
                </div>
                {/* style={{paddingTop:'2%',paddingLeft:'5%'}} */}
                    <div align="center" >
                        <button id="btnIniciar"
                                style={{opacity:.1,border: '1px solid gray', width:200, height:200, color:'lightgreen', fontSize: '6em', borderRadius:100, backgroundColor:'white'}}
                                value="iniciar" onClick={()=>this.start()}><i class="fas fa-play"></i></button>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button id="btnDetener"
                                style={{opacity:.1,border:'1px solid gray', width:200, height:200, color:'red', fontSize:'6em', borderRadius:100, backgroundColor:'white'}}
                                value="detener" onClick={this.stop}><i class="fas fa-stop"></i></button>
                    </div>
                    <br></br>
                    <br></br>
                    <div className="col-md-12 col-sm-12 text-center"><h3>Documentos para revisar</h3></div>
                    {/* <input type="file" name="file" id="file" onChange={this.handleInputChange}  placeholder="Archivo de excel" className="form-control-file" ></input> */}
                    <div className="container col-md-10" >
                        <div className="table-responsive" style={{marginBottom: 0, height: 400, maxHeight: 400 , overflow: 'auto', fontSize:"13px", fontWeight:"bold"}}>
                            <table className="table table-hover scrolltable" >
                                <thead style={{textAlign: "-webkit-center"}}>
                                    <tr className="text-light" style={{/*background: '#2d75bd', borderRadius: '0' */}} >
                                        <th >#</th>
                                        {/* <th className="sticky-header"  scope="col">DocNum</th> */}
                                        <th className="text-center" >Cliente</th>
                                        <th className="text-center" scope="col">Nombre cliente</th>
                                        <th className="text-center" scope="col">Canal</th>
                                        <th className="text-center" scope="col">Comentarios</th>
                                        <th className="text-center" scope="col">Fecha</th>
                                        {/* <th className="text-center" scope="col">Total doc.</th>
                                        <th className="text-center" scope="col">Peso total bruto</th>
                                        <th className="text-center" scope="col">Autorización</th> */}
                                        <th className="text-center" scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody style={{overflowY:'auto'}}>
                                    {!!Autorizaciones && Autorizaciones.map((auto, index ) => {
                                            return(
                                                <tr >
                                                    <th >{index+1}</th>
                                                    {/* <td>{auto.DocNum}</td> */}
                                                    <td className="text-center">{auto.CardCode}</td>
                                                    <td className="text-center">{auto.CardName}</td>
                                                    <td className="text-center">{auto.U_SYP_RICO_NCANAL}</td>
                                                    <td className="text-center">{auto.Comments}</td>
                                                    <td className="text-center">{auto.DocDate.substr(0,10)}</td>
                                                    {/* <td className="text-center">S/. {parseFloat(auto.DocTotal).toFixed(2) === '0.00' ? parseFloat(auto.DocTotal2).toFixed(2) : parseFloat(auto.DocTotal).toFixed(2)}</td>
                                                    <td className="text-center">{parseFloat(auto.Weight2).toFixed(2)} KG</td>
                                                    <td className="text-center">{auto.U_Remarks}</td> */}
                                                    <td>
                                                        <button
                                                            className="btn btn-sm"
                                                            type="button"
                                                            // data-toggle="modal" data-target=".bd-example-modal-lg"
                                                            style={{ backgroundColor: config.navBar.iconBackground, color: config.navBar.iconModal }}
                                                            onClick={() => this.Details(auto.DocEntry,auto.Comments)}>
                                                        Ver detalles
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <br></br>
                    <div className="col-md-12 col-sm-12 text-center"><h3>Documentos creados</h3></div>
                    <div className="container col-md-8 col-sm-12" >
                        <div className="table-responsive" style={{marginBottom: 0, height: 400, maxHeight: 400 , overflow: 'auto', fontSize:"13px", fontWeight:"bold"}}>
                            <table className="table table-hover scrolltable" >
                                <thead style={{textAlign: "-webkit-center"}}>
                                    <tr className="text-light" style={{/*background: '#2d75bd', borderRadius: '0' */}} >
                                        <th >#</th>
                                        {/* <th className="sticky-header"  scope="col">DocNum</th> */}
                                        <th className="text-center" >Documento</th>
                                        <th className="text-center" scope="col">Oferta de ventas</th>
                                        <th className="text-center" scope="col">Orden de venta</th>
                                        <th className="text-center" scope="col">Notificación</th>
                                    </tr>
                                </thead>
                                <tbody style={{overflowY:'auto'}}>
                                    {!!DocumentosCreados && DocumentosCreados.map((create, index ) => {
                                            return(
                                                <tr >
                                                    <th >{index+1}</th>
                                                    <td className="text-center">{create.doc}</td>
                                                    {/* <td className="text-center">{create.docEntryOQUT}</td> */}
                                                    <td className="text-center">
                                                        <button
                                                            className="btn btn-sm"
                                                            type="button"
                                                            style={{ backgroundColor: config.navBar.iconBackground, color: config.navBar.iconModal }}
                                                            onClick={() => this.DetailsOQUT(create.docEntryOQUT, 'OQUT')}>
                                                        Ver Oferta
                                                        </button>
                                                    </td>
                                                    {/* <td className="text-center">{create.docEntryORDR}</td> */}
                                                    <td className="text-center">
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            disabled={create.borrador ===1 ? true : false }
                                                            type="button"
                                                            // data-toggle="modal" data-target=".bd-example-modal-lg"
                                                            // style={{ backgroundColor: config.navBar.iconBackground, color: config.navBar.iconModal }}
                                                            onClick={() => this.DetailsOQUT(create.docEntryORDR, 'ORDR')}>
                                                        Ver Orden
                                                        </button>
                                                    </td>
                                                    <td className="text-center">{create.autorizacion}</td>
                                                </tr>
                                            )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="modal fade bd-example-modal-xl" id="saveModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-xl">
                            <div className="modal-content">
                                <div className="modal-header text-light" style={{background: '#0060EA', borderRadius: '0' }}>
                                    <h4 className="modal-title" id="modal-basic-title " style={{fontSize:'1.4rem'}}>Detalle del documento</h4>

                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span className="text-white" aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <br></br>
                                {/* <div class="row">
                                    <div class="col-sm-12">
                                        <CSVLink
                                        className="btn btn-success float-right"
                                        data={csvData} filename={"Archivo.csv"}>
                                            Descargar orden CSV
                                        </CSVLink>
                                    </div>
                                </div> */}


                            <div className="container col-md-11">
                                <div className="table-responsive" style={{marginBottom: 0, height: 600, maxHeight: 600 , overflow: 'auto', fontSize:"13px", fontWeight:"bold"}}>
                                    <table className="table table-hover scrolltable" >
                                        <thead style={{textAlign: "-webkit-center"}}>
                                            <tr className="text-light" style={{/*background: '#2d75bd', borderRadius: '0' */}} >
                                                <th>#</th>
                                                {/* <th className="sticky-header"  scope="col">DocNum</th> */}
                                                <th className="text-center" >Artículo</th>
                                                <th className="text-center" scope="col">Código</th>
                                                <th className="text-center" scope="col">Cantidad</th>
                                                <th className="text-center" scope="col">Precio</th>
                                                <th className="text-center" scope="col">Total</th>
                                                {/* <th className="text-center" scope="col">Total doc.</th>
                                                <th className="text-center" scope="col">Peso total bruto</th>
                                                <th className="text-center" scope="col">Autorización</th> */}
                                            </tr>
                                        </thead>
                                        <tbody style={{overflowY:'auto'}}>
                                            {!!order && order.map((item, index ) => {
                                                    return(
                                                        <tr >
                                                            <th >{index+1}</th>
                                                            {/* <td>{auto.DocNum}</td> */}
                                                            <td className="text-left">{item.ItemName}</td>
                                                            <td className="text-center">{item.ItemCode}</td>
                                                            <td className="text-center">{parseInt(item.Quantity)}</td>
                                                            <td className="text-center">{item.Currency+' '+parseFloat(item.Price).toFixed(2)}</td>
                                                            <td className="text-center">{item.Currency+' '+parseFloat(item.LineTotal).toFixed(2)}</td>
                                                            {/* <td className="text-center">S/. {parseFloat(auto.DocTotal).toFixed(2) === '0.00' ? parseFloat(auto.DocTotal2).toFixed(2) : parseFloat(auto.DocTotal).toFixed(2)}</td>
                                                            <td className="text-center">{parseFloat(auto.Weight2).toFixed(2)} KG</td>
                                                            <td className="text-center">{auto.U_Remarks}</td> */}
                                                        </tr>
                                                    )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                                <div className="modal-footer justify-content-right">
                                {/* {editar ?
                                    <button type="button" className="btn btn-success" style={{display:Tipo === 'W' ? 'block' : 'none' }} onClick={()=> this.addToShopingCart()}>
                                        <i className="fas fa-cart-plus"/>
                                        &nbsp; Editar
                                    </button>
                                    :
                                    ''
                                } */}

                                <CSVLink
                                    className="btn btn-success float-right"
                                    style={{display:action === 1 ? 'block' : 'none' }}
                                    data={csvData} filename={"CanalModerno.csv"}>
                                        Descargar Excel <i class="fa fa-file-excel-o" aria-hidden="true"></i>
                                </CSVLink>
                                {/* <button type="button" class="btn btn-danger float-right" style={{display:Tipo === 'W' ? 'block' : 'none' }} disabled={Tipo === 'W' ? false : true} data-toggle="modal" data-target=".comentarios" >Rechazar</button>
                                <button type="button" class="btn btn-success float-right" style={{display:Tipo === 'W' ? 'block' : 'none' }} disabled={Tipo === 'W' ? false : true} onClick={this.Autorizar}>Autorizar</button> */}

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
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MiddlewareView);