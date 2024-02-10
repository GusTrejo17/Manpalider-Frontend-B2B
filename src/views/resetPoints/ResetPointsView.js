import React, {Component} from 'react';
import {DISPATCH_ID, SERVICE_RESPONSE, config, ROLES,VIEW_NAME} from '../../libs/utils/Const';
import {connect} from 'react-redux';
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {Session, NavBar} from '../../components';
import { Redirect } from 'react-router';
import './ResetPoints.css';
import $ from 'jquery';
import moment from 'moment';
import CurrencyFormat from 'react-currency-format';
import { animateScroll as scroll, scroller } from 'react-scroll';

let apiClient = ApiClient.getInstance();
const EMAIL_FORMAT_REGEX = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
const RUT_FORMAT_REGEX = /^([0-9])+\-([A-Za-z0-9])$/;

class ResetPointsView extends Component {

    constructor(props){
        super(props);
        this.state = {
            resetPointsData : [],
            resetDate: ''
        };
        this.table = null;
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    async componentDidMount() {
        this.fillDataResetPoints();
        await this.resetPointsInfo();
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

    resetPointsInfo = async () => {
        const {sessionReducer, enableSpinner, notificationReducer:{showAlert}} = this.props;

        if(sessionReducer.user.CardCode){
            enableSpinner(true);
            let response = await apiClient.resetPoints();
            enableSpinner(false);
            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                this.setState({
                    resetPointsData : response.data.resetPoints,
                });
            } else {
                showAlert({type: 'warning', message: response.message || ' Ocurrió un error al traer los periodos de puntos', timeOut: 8000});                
            }
        }
    }

    fillDataResetPoints = () =>{
        this.table =  $('#resetPointsInfoTable').DataTable({
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

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.state.resetPointsData != nextState.resetPointsData) {
            this.table.destroy();
            this.table = null;
        }
        return true;
    }

    componentDidUpdate(): void {
        if (this.table == null) {
            this.fillDataResetPoints();
        }
    }

    changeResetDate = (event) => {
        let newDate =  event.nativeEvent.target.value;
        this.setState({
            resetDate : newDate
        });
    }

    newResetInterval = async () => {
        const {sessionReducer, enableSpinner, notificationReducer:{showAlert}} = this.props;
        const { resetDate } = this.state;
        
        if(resetDate === ''){
            showAlert({type: 'warning', message: ' Se debe elegir una fecha completa dd/mm/yyyy ', timeOut: 8000});
            return;
        }
    
        let parametersResetPoints = {
            DateReset : resetDate,
            CardCode : sessionReducer.user.CardCode
        }

        enableSpinner(true);
        let response = await apiClient.insertResetPoints(parametersResetPoints);
        enableSpinner(false);

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            showAlert({type: 'success', message: ' Nuevo periodo de puntos agregado de manera exitosa ', timeOut: 8000});
            await this.resetPointsInfo();
            this.setState({
                resetDate : ''
            });
        } else {
            showAlert({type: 'error', message: ' Error al crear el nuevo periodo de puntos ', timeOut: 8000});
        }
    }

    render() {
        const {loginReducer, sessionReducer, configReducer, history} = this.props;
        const { resetPointsData, resetDate } = this.state;

        if(!history || !sessionReducer || !sessionReducer.user.CardCode){
            return <Redirect to="/"/>;
        } else {
            if(sessionReducer.user.U_FMB_Handel_Admin !== '1'){
                return <Redirect to="/"/>;
            } else {
                
            return (
                <div className="container-fluid none-scroll" style={{marginTop: 150, paddingBottom: 20, backgroundColor:config.Back.backgroundColor , paddingLeft:0, paddingRight: 0}}>
                    <Session history={history} view={VIEW_NAME.RESET_POINTS_VIEW}/>
                    <NavBar/>
                    {/* Imagen de segundo NavBar */}
                    <div className="bannerRedCompensas margenS" style={{backgroundColor:config.Back.backgroundColor }}>
                        {/* <nav id="navFirst" className="​navbar navbar-expand-sm text-center" style={{ border: "none", background: config.navBar.backgroundColor }} > */}
                            <img className="img-fluid"
                                src={require('../../images/diasa/navBar/temporal.png')}
                                alt="Segundo NavBar"
                            />
                        {/* </nav> */}
                    </div>

                    <div className=" mt-md-0 mb-md-3" style = {{backgroundColor: '#eeeeee'}}>  
                        <div className="mb-md-3 row justify-content-center">
                            <div className = "col-md-10 ">
                                <h2 className = "text-right mt-md-3 mb-md-2 font-weight-bold" style = {{color:'#AFAFAF'}}>Periodo de puntos</h2>
                            </div>
                        </div>
                        <div className="row justify-content-center text-center">
                            <div className = "col-md-4 justify-content-center text-center">
                                <div className="row justify-content-center">
                                    <div className = "col-md-6">
                                        <h4 className="pr-2">Fecha de nuevo periodo:</h4>
                                        <input type="date" className="form-control form-control-lg"
                                            value = {resetDate || ''} 
                                            onChange={(event) => {this.changeResetDate(event)}}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className = "col-md-4 justify-content-center text-center">
                                <div className="row justify-content-center">
                                    <div className = "col-md-6">
                                        <h4 className="pr-2">Nuevo periodo de reseteo</h4>
                                        <button className="btn btn-light btn-lg" type="button" onClick={() => this.newResetInterval()} ><i className={config.icons.add}/></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center mt-md-3">
                            {/* Tabla de reseteo de puntos */}
                            <div className="col-md-8 table-responsive">
                                <table id="resetPointsInfoTable" className="table table-striped">
                                    <thead style={{textAlign: "-webkit-center"}}>
                                        <tr className = "text-center" style={{backgroundColor: '#AFAFAF', color: "white"}}>
                                            <th scope="col" className = 'text-center'>#</th>
                                            <th scope="col" className = 'text-center'>Fecha de inicio de periodo</th>
                                            <th scope="col" className = 'text-center'>Creador de periodo</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {resetPointsData && resetPointsData.length > 0 && resetPointsData.map((register, index) => {
                                            return (<tr>
                                                <th scope="row" className = 'text-center'>{register.id}</th>
                                                <td scope="row" className = 'text-center'>{moment(register.InitDate).utc().format('DD/MM/YYYY')}</td>
                                                <td scope="row" className = 'text-center'>{register.CardCode}</td>
                                            </tr>)})
                                        }
                                    </tbody>
                                </table>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ResetPointsView);