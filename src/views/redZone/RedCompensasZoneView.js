import React, {Component} from 'react';
import {DISPATCH_ID, SERVICE_RESPONSE, config, ROLES,VIEW_NAME,SERVICE_API} from '../../libs/utils/Const';
import {connect} from 'react-redux';
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {Session, NavBar, ItemsList, Suscription} from '../../components';
import { Redirect } from 'react-router';
import './RedCompensasZoneView.css';
import $ from 'jquery';
import moment from 'moment';
import CurrencyFormat from 'react-currency-format';
import {scroller } from 'react-scroll';

let apiClient = ApiClient.getInstance();
const EMAIL_FORMAT_REGEX = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
const RUT_FORMAT_REGEX = /^([0-9])+\-([A-Za-z0-9])$/;

class RedCompensasZoneView extends Component {

    constructor(props){
        super(props);
        this.state = {
            businessPartnerInfo : {},
            pointsInfo : {},
            statusVitrina : false
        };
        this.table = null;
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    scrollToBottom() {
        scroller.scrollTo('scrollDownPlease', {
            duration: 2000,
            delay: 0,
            smooth: 'easeOutQuart',
            offset: 140,
            isDynamic: true
          })
    }

    async componentDidMount() {
        this.fillDataRedCompensas();
        await this.accountBusinessPartnerInfo();
        this.scrollToBottom();
    }

    accountBusinessPartnerInfo = async () => {
        const {sessionReducer, enableSpinner, notificationReducer:{showAlert}} = this.props;

        if(sessionReducer.user.CardCode){
            let cardCode = sessionReducer.user.CardCode;
            enableSpinner(true);
            let response = await apiClient.getBusinessPartnerInfo(cardCode);
            enableSpinner(false);
            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                this.setState({
                    businessPartnerInfo : response.data.resultData,
                    pointsInfo : response.data.resultInfoPoints, 
                });
            } else {
                if(response.data.resultData.Card){
                    this.setState({
                        businessPartnerInfo : {CardActive:'No-xistente'},
                    }); 
                }
                else{
                    this.setState({
                        businessPartnerInfo : {CardActive:'Inactiva'},
                    });                     
                }  
                showAlert({type: 'warning', message: response.message || ' Ocurrió un error al traer su info.', timeOut: 8000});                            
            }
        }
    }

    pointsItemsAvailable = async ()=>{
        const { configReducer: { history }} = this.props;
        const {itemsReducer,setIdCategory,setLocation} = this.props;
        
        setIdCategory(null);
        setLocation('vitrinaView');
        await itemsReducer.searchByKey(0,'vitrinaView');
        this.setState({
            statusVitrina: true
        })
    }

    fillDataRedCompensas = () =>{
        this.table =  $('#accountBusinessInfo').DataTable({
            "paging": true,
            "info": false,
            "searching": false,
            //"bDestroy": true,	
            "order": [[ 0, 'asc' ]],
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
        if (this.state.pointsInfo != nextState.pointsInfo) {
            ////console.log("hay nuevos datos");
            this.table.destroy();
            this.table = null;
        }
        return true;
    }

    componentDidUpdate() {
        if (this.table == null) {
            this.fillDataRedCompensas();
        }
    }

    changeQuantity = (index, item, newQuantity, addItem) => {
        const {itemsReducer : { addShoppingCart, deleteShoppingCart }} = this.props;
        if(addItem){
            addShoppingCart({item, quantity: (newQuantity || '1')})
        }else{
            deleteShoppingCart({item, deleteAll: false});
        }
    };

    changeBackOrder= (item, addItem) => {
        const {itemsReducer : {deleteBackOrder, addBackOrder}} = this.props;
        if(addItem){
            addBackOrder({item, quantity: 1})
        }else{
            deleteBackOrder({item, deleteAll: false});
        }
    };

    render() {
        const { configReducer: { history }, sessionReducer, itemsReducer : { itemsFilter, searchItemsFilter, updateFavorite, deleteShoppingCart, openItemDetails}  } = this.props;
        const { businessPartnerInfo, pointsInfo, statusVitrina } = this.state;
        
        if(!history || !sessionReducer || !sessionReducer.user.CardCode){
            return <Redirect to="/clientePreferente"/>;
        } else {
            if(businessPartnerInfo.CardActive){
                if(businessPartnerInfo.CardActive === 'No-xistente'){
                    return <Redirect to="/clientePreferente"/>;
                } else {
                    return <Redirect to="/"/>;
                }
            } else {
            return (
                <div className="container-fluid" style={{marginTop: 150, paddingBottom: 20, backgroundColor:"#fff", paddingLeft:0, paddingRight:0}}>
                    {/* <Session history={history} view={VIEW_NAME.RED_ZONE_VIEW}/> */}
                    <NavBar/>
                    {/* Imagen de segundo NavBar */}
                    <div className="bannerRedCompensas margenS" style={{backgroundColor:config.Back.backgroundColor }}>
                        {/* <nav id="navFirst" className="​navbar navbar-expand-sm text-center" style={{ border: "none", background: config.navBar.backgroundColor }} > */}
                            <img id = "scrollDownPlease" className="img-fluid"
                                src={config.recompensas.banner}
                                alt="Segundo NavBar"
                            />
                        {/* </nav> */}
                    </div>

                    <div className=" mt-md-0 mb-md-5" style = {{backgroundColor: '#eeeeee'}}>   
                        <div className="row justify-content-center">
                            {/* Columna de menú */}
                            <div className="MenuEstadoDeCuenta col-md-3 p-md-2 mr-md-2" style = {{backgroundColor: '#E2E2E2'}}>
                                <div className="list-group" role="tablist" >
                                    <a className="list-group-item list-group-item-action-1 active"
                                        id="list-estado-list" data-toggle="list" href="#list-estado"
                                        role="tab" aria-controls="home" style={{background: "#e9ecef"}}
                                        onClick={() => this.accountBusinessPartnerInfo()}>
                                            <h5>Estado de cuenta</h5>
                                    </a>
                                    <a className="list-group-item list-group-item-action-1"
                                        id="list-vitrina-list" data-toggle="list"
                                        href="#list-vitrina" role="tab"
                                        aria-controls="profile"
                                        onClick={() => this.pointsItemsAvailable()}>
                                            <h5>Vitrina de Recompensas</h5>
                                    </a>
                                    <a className="list-group-item list-group-item-action-1"
                                        id="list-politicas-list" data-toggle="list"
                                        href="#list-politicas" role="tab"
                                        aria-controls="profile">
                                            <h5>Políticas</h5>
                                    </a>
                                    <a className="list-group-item list-group-item-action-1"
                                        id="list-aviso-list" data-toggle="list"
                                        href="#list-aviso" role="tab"
                                        aria-controls="profile"
                                        onClick={() => history.goPrivacy()}>
                                            <h5>Aviso de privacidad</h5>
                                    </a>
                                    <a className="list-group-item list-group-item-action-1"
                                        id="list-promos-list" data-toggle="list"
                                        href="#list-promos" role="tab"
                                        aria-controls="profile">
                                            <h5>Promociones</h5>
                                    </a>
                                </div>
                            </div>
                            <br/>
                            <br/>
                            {/* Columna de tablas de info. */}
                            <div className="col-md-8">
                                <div className="tab-content">
                                    {/* Sección estado de cuenta */}
                                    <div className="tab-pane fade show active" id="list-estado" role="tabpanel" aria-labelledby="list-estado-list">
                                        <h2 className = "text-right mt-md-2 mb-md-2 font-weight-bold" style = {{color:'#AFAFAF'}}>ESTADO DE CUENTA</h2>
                                        <h5 className = "text-left font-weight-bold mb-md-4" style={{color: "#0078C0"}}>{'< Estado de cuenta'}</h5>
                                        {/* Rectangulo blanco */}
                                        <div className="DetallesEstadoDeCuenta">
                                            <div className="card rounded-lg text-center mb-md-4">
                                                <div className="card-body" style = {{backgroundColor: '#efefef'}}>
                                                    <div className="card border-light text-center mb-md-3">
                                                        <div className="card-body bg-white">
                                                            <div className="row">
                                                                <div className="col-lg-6" >
                                                                    <div className="row" style={{justifyContent: "left"}}>
                                                                        <div className = " col-auto">
                                                                            <div className = "mb-md-1 text-left"><h5 className = "font-weight-bold">Cliente: </h5></div>
                                                                        </div>
                                                                        <div className="col-auto">
                                                                            <div className = "mb-md-1 text-left" style={{color: "#0078C0"}}><h5 className = "font-weight-bold">{sessionReducer && sessionReducer.user.CardName || ''}</h5></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row" style={{justifyContent: "left"}}>
                                                                        <div className = " col-auto">
                                                                            <div className = "mb-md-1 text-left"><h5 className = "font-weight-bold">No. tarjeta: </h5></div>
                                                                        </div>
                                                                        <div className="col-auto">
                                                                            <div className = "mb-md-1 text-left" style={{color: "#0078C0"}}><h5 className = "font-weight-bold">{businessPartnerInfo.U_FMB_Handel_RedCard || ''}</h5></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row" style={{justifyContent: "left"}}>
                                                                        <div className = " col-auto">
                                                                            <div className = "mb-md-1 text-left"><h5 className = "font-weight-bold">Fecha de inicio: </h5></div>
                                                                        </div>
                                                                        <div className="col-auto">
                                                                            <div className = "mb-md-1 text-left" style={{color: "#0078C0"}}><h5 className = "font-weight-bold">{moment(businessPartnerInfo.CreateDate).utc().format('DD/MM/YYYY') || ''}</h5></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row" style={{justifyContent: "left"}}>
                                                                        <div className = " col-auto">
                                                                            <div className = "mb-md-1 text-left"><h5 className = "font-weight-bold">Total de puntos: </h5></div>
                                                                        </div>
                                                                        <div className="col-auto">
                                                                            <div className = "mb-md-1 text-left" style={{color: "#0078C0"}}><h5 className = "font-weight-bold">{pointsInfo.totalPoints || 0}</h5></div>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className=" row col-md-6" >
                                                                    <div className="mb-md-2" style={{maxWidth: 100}}>
                                                                        <div><h5 className="font-weight-bold">Programa Técnico</h5></div>
                                                                    </div>
                                                                    <div className="pl-3 text-right">
                                                                        <img className="img-fluid w-100"
                                                                            src={config.recompensas.card}
                                                                            alt="Tarjetita"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Tabla de estado de cuenta */}
                                            <div className="col-md-12 table-responsive">
                                                <table id="accountBusinessInfo" className="table table-striped">
                                                    <thead style={{textAlign: "-webkit-center"}}>
                                                        <tr style={{backgroundColor: '#AFAFAF', color: "white"}}>
                                                            <th scope="col" className = 'text-center'>#</th>
                                                            <th scope="col" className = 'text-center'>Fecha</th>
                                                            <th scope="col" className = 'text-center'># Documento</th>
                                                            <th scope="col" className = 'text-center'>Tipo</th>
                                                            <th scope="col" className = 'text-center'>Concepto</th>
                                                            <th scope="col" className = 'text-center'>Puntos</th>
                                                            <th scope="col" className = 'text-center'>Saldo Anterior</th>
                                                            <th scope="col" className = 'text-center'>Saldo Total</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {pointsInfo.resultsPoints && pointsInfo.resultsPoints.length > 0 && pointsInfo.resultsPoints.map((pointsInf, index) => {
                                                            return (<tr>
                                                                <th scope="row" className = 'text-center'>{index+1}</th>
                                                                <th scope="row" className = 'text-center'>{moment(pointsInf.CreateDate).utc().format('DD/MM/YYYY')}</th>
                                                                <th scope="row" className = 'text-center'>{pointsInf.DocNum}</th>
                                                                <th scope="row" className = 'text-center'>{pointsInf.UsedPoints !== null && pointsInf.UsedPoints !== '' ? pointsInf.DocType == 14 ? 'Puntos recuperados (Nota de crédito)' : 'Puntos redimidos (Oferta)' : pointsInf.DocType == 13 ? 'Factura pagada' : 'Nota de crédito'}</th>
                                                                <th scope="row" className = 'text-center'>{pointsInf.Type === 'suma' ? 'Sumar Puntos' : 'Restar Puntos'}</th>
                                                                <td className = 'text-center'>{pointsInf.Total}</td>
                                                                <td className = 'text-center'>{pointsInf.lastTotal}</td>
                                                                <td className = 'text-center'>{pointsInf.nextToLastTotal}</td>
                                                            </tr>)})
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>                                             
                                        </div>
               
                                    </div>
                                    {/* Seccion Vitrina de RedCompensas */}
                                    <div className="tab-pane fade" id="list-vitrina" role="tabpanel" aria-labelledby="list-vitrina-list">
                                        <h2 className = "text-right mt-md-2 mb-md-2 font-weight-bold" style = {{color:'#AFAFAF'}}>VITRINA DE RECOMPENSAS</h2>
                                        <h5 className = "text-left font-weight-bold mb-md-4" style={{color: "#0078C0"}}>{'< Vitrina de Recompensas'}</h5>
                                        <div className="DetallesEstadoDeCuenta">
                                            <div className="card rounded-lg text-center pb-pd-4">
                                                <div className="vitrina row col-12 pt-3 pb-3">
                                                    <div className="col-lg-2  col-md-4 col-sm-6 text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                                                        <img className="img-fluid"
                                                            src={config.recompensas.vitrina1}
                                                            alt="Segundo NavBar"
                                                        />
                                                    </div>
                                                    <div className="col-lg-2 col-md-4 col-sm-6 text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                                                        <img className="img-fluid"
                                                            src={config.recompensas.vitrina2}
                                                            alt="Segundo NavBar"
                                                        />
                                                    </div>
                                                    <div className="col-lg-2 col-md-4 col-sm-6 text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                                                        <img className="img-fluid"
                                                            src={config.recompensas.vitrina3}
                                                            alt="Segundo NavBar"
                                                        />
                                                    </div>
                                                    <div className="col-lg-2 col-md-4 col-sm-6 text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                                                        <img className="img-fluid"
                                                            src={config.recompensas.vitrina4}
                                                            alt="Segundo NavBar"
                                                        />
                                                    </div>
                                                    {/* <div className="col-lg-2 col-md-4 col-sm-6 text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                                                        <img className="img-fluid"
                                                            src={config.recompensas.vitrina5}
                                                            alt="Segundo NavBar"
                                                        />
                                                    </div>
                                                    <div className="col-lg-2 col-md-4 col-sm-6 text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                                                        <img className="img-fluid"
                                                            src={config.recompensas.vitrina6}
                                                            alt="Segundo NavBar"
                                                        />
                                                    </div> */}
                                                </div>
                                                {/* <div style={{background: "#0076BB"}}>
                                                    <ul className="nav justify-content-center " style={{ color: "white"}}>
                                                        <li className="nav-item col-lg-3 col-md-6"  >
                                                            <a className="nav-link text-white font-weight-bold botonePrincipales pt-2 pb-2" value="Enseres Menores"><h4><strong>Enseres Menores</strong></h4></a>
                                                        </li>
                                                        <li className="nav-item col-lg-3 col-md-6"  >
                                                            <a className="nav-link text-white font-weight-bold botonePrincipales pt-2 pb-2" value="Aparatos"><h4><strong>Aparatos</strong></h4></a>
                                                        </li>
                                                        <li className="nav-item col-lg-3 col-md-6">
                                                            <a className="nav-link text-white font-weight-bold botonePrincipales pt-2 pb-2" value="Herramientas"><h4><strong>Herramientas</strong></h4></a>
                                                        </li>
                                                        <li className="nav-item col-lg-3 col-md-6" >
                                                            <a className="nav-link text-white font-weight-bold botonePrincipales pt-2 pb-2"  value="Diversión"><h4><strong>Diversión</strong></h4></a>
                                                        </li>
                                                    </ul>
                                                </div> */}
                                                <div className="card-body" style = {{backgroundColor: '#fff'}}>
                                                    <div className="card border-light text-center mb-md-3">
                                                        <div className="card-body bg-white">
                                                        <div className="row" style={{margin:0, paddingBottom: 20}}>
                                                            <div className="col-md-12 col-sm-12">
                                                                {statusVitrina === true && itemsFilter && itemsFilter.length !== 0 ? (
                                                                        <ItemsList
                                                                            items={itemsFilter}
                                                                            updateFavorite={updateFavorite}
                                                                            openDetails={openItemDetails}
                                                                            changeQuantity={this.changeQuantity}
                                                                            deleteShoppingCart={deleteShoppingCart}
                                                                            changeBackOrder={this.changeBackOrder}
                                                                            type={'RedCompensasView'}
                                                                        />
                                                                    ) : (
                                                                        <div style={{paddingTop:100, margin:0, textAlign: 'center'}}>No se encontraron productos canjeables con puntos: <strong>{searchItemsFilter}</strong>
                                                                            <br/>
                                                                            <br/>
                                                                            <i style={{fontSize: 70}} className={config.icons.search}></i>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Sección de políticas */}
                                    <div className="tab-pane fade" id="list-politicas" role="tabpanel" aria-labelledby="list-politicas-list">
                                        <h2 className = "text-right mt-md-2 mb-md-2 font-weight-bold" style = {{color:'#b0b0b0'}}>POLÍTICAS</h2>
                                        <h5 className = "text-left font-weight-bold mb-md-4" style={{color: "#0078C0"}}>{'< Políticas'}</h5>
                                        <div className="DetallesEstadoDeCuenta">
                                            <div className="card rounded-lg text-center mb-md-4">
                                                <div className="card-body" style = {{backgroundColor: '#efefef'}}>
                                                    <div className="card border-light text-center mb-md-3">
                                                        <div className="card-body bg-white">
                                                            <i className={config.icons.datasheet} style={{ color: "red", paddingRight: 5 }}></i>
                                                            <a href={`${config.BASE_URL}/${SERVICE_API.getPolitics}/${config.pdf.politicasUsoAvisoPrivacidad}`} target="_blank"> Políticas de privacidad DIASA</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Sección de aviso de privacidad */}
                                    <div className="tab-pane fade" id="list-aviso" role="tabpanel" aria-labelledby="list-aviso-list">
                                        <h2 className = "text-right mt-md-2 mb-md-2 font-weight-bold" style = {{color:'#b0b0b0'}}>AVISO DE PRIVACIDAD</h2>
                                        <h5 className = "text-left font-weight-bold mb-md-4" style={{color: "#0078C0"}}>{'< Aviso de privacidad'}</h5>
                                        <div className="DetallesEstadoDeCuenta">
                                            <div className="card rounded-lg text-center mb-md-4">
                                                <div className="card-body" style = {{backgroundColor: '#efefef'}}>
                                                    <div className="card border-light text-center mb-md-3">
                                                        <div className="card-body bg-white">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Sección de promociones */}
                                    <div className="tab-pane fade" id="list-promos" role="tabpanel" aria-labelledby="list-promos-list">
                                        <h2 className = "text-right mt-md-2 mb-md-2 font-weight-bold" style = {{color:'#b0b0b0'}}>PROMOCIONES</h2>
                                        <h5 className = "text-left font-weight-bold mb-md-4" style={{color: "#0078C0"}}>{'< Promociones'}</h5>
                                        <div className="DetallesEstadoDeCuenta">
                                            <div className="card rounded-lg text-center mb-md-4">
                                                <div className="card-body" style = {{backgroundColor: '#efefef'}}>
                                                    <div className="card border-light text-center mb-md-3">
                                                        <div className="card-body bg-white">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
    }
}

const mapStateToProps = store => {
    return {
        sessionReducer: store.SessionReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
        itemsReducer: store.ItemsReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setItemsSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SET_ITEMS, value}),
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        setItemsFilterSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER, value}),
        setLocation:  value => dispatch({type: DISPATCH_ID.ITEMS_SET_LOCATION, value}),
        setTotalRows : value => dispatch({type: DISPATCH_ID.ITEMS_SET_TOTALROWS, value}),
        setIdCategory: value => dispatch({type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value}),
        setNextPage:  value => dispatch({type: DISPATCH_ID.ITEMS_SET_NEXTPAGE, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RedCompensasZoneView);