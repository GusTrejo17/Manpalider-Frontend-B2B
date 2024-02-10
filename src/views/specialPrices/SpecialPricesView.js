import React, {Component} from 'react';
import {Footer, NavBar, Session} from "../../components";
import {DISPATCH_ID, SERVICE_RESPONSE, config, ROLES,VIEW_NAME,SERVICE_API} from '../../libs/utils/Const';
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import { Redirect } from 'react-router';
import { animateScroll as scroll, scroller } from 'react-scroll'
import '../dashboard/Categories.css';

let apiClient = ApiClient.getInstance();

class SpecialPricesView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start : false, 
            stop : false,
            error: ''
        };
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.startButton = React.createRef();
        this.stopButton = React.createRef();
    };

    scrollToBottom() {
        scroll.scrollToTop({
            duration: 1500,
            delay: 100,
            smooth: 'easeOutQuart',
            isDynamic: true
          })
    }

    async componentDidMount(){
        await this.setValidationSpecialPrices();
        this.scrollToBottom();
    };

    setValidationSpecialPrices = async () => {
        const {sessionReducer, enableSpinner, notificationReducer:{showAlert}} = this.props;

        if(sessionReducer.user.CardCode){
            enableSpinner(true);
            let apiResponse = await apiClient.getValidationSpecialPrices();
            enableSpinner(false);

            if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
                //showAlert({ type: 'success', message: 'Se obtuvó correctamente el estatus de los precios especiales', timeOut: 3000 });
                let flag = apiResponse.data == 0 ? false : true;
                if(flag === true){
                    if(this.startButton.current){
                        this.startButton.current.style.opacity = ".2";
                        this.stopButton.current.style.opacity = "1";
                    }
                } else {
                    if(this.stopButton.current){
                        this.startButton.current.style.opacity = "1";
                        this.stopButton.current.style.opacity = ".2";
                    }
                }                
                this.setState({
                    start: flag === true ? false : true,
                    stop: flag === true ? true : false
                });
            } else {
                showAlert({ type: 'error', message: apiResponse.message || 'Ocurrió un error al obtener el estatus de los precios especiales', timeOut: 8000 });
                this.setState({
                    flagSpecialPrices: false,
                    start: true,
                    stop: true,
                    error: 'GET OUT!'
                });
            }
        }
    }

    start = async () => {
        const { enableSpinner, notificationReducer:{showAlert} } = this.props;

        enableSpinner(true);
        let apiResponse = await apiClient.setSpecialPricesStatus(1);
        enableSpinner(false);

        if (apiResponse.status !== SERVICE_RESPONSE.SUCCESS) {
            showAlert({ type: 'error', message: 'Ocurrió un error al activar los precios especiales', timeOut: 8000 });
        }

        this.setState({
            start: false,
            stop: true
        })
        this.startButton.current.style.opacity = ".2";
        this.stopButton.current.style.opacity = "1";
    }

    stop = async () => {
        const { enableSpinner, notificationReducer:{showAlert} } = this.props;

        enableSpinner(true);
        let apiResponse = await apiClient.setSpecialPricesStatus(0);
        enableSpinner(false);

        if (apiResponse.status !== SERVICE_RESPONSE.SUCCESS) {
            showAlert({ type: 'error', message: 'Ocurrió un error al desactivar los precios especiales', timeOut: 8000 });
        }

        this.setState({
            start: true,
            stop: false
        })
        this.startButton.current.style.opacity = "1";
        this.stopButton.current.style.opacity = ".2";
    }
    
    render() {
        const { configReducer: { history }, sessionReducer } = this.props;
        const { error, start, stop } = this.state;
        if(!sessionReducer || !history){
            return <Redirect to="/"/>;
        } else if(error !== ''){
            return <Redirect to="/"/>;
        } else {
            return (
                <div className="content-fluid" style={{ marginTop: 150, backgroundColor:config.Back.backgroundColor }}>
                    {/* <Session history={history} view={VIEW_NAME.PROFILE_VIEW}/> */}
                    <NavBar/>
                    {/* <div className="categorias margenSuperiorViewProfile mt-md-1">
                        <ul className="nav justify-content-center " style={{ color: "white"}}>
                            <li className="nav-item col-lg-3 col-md-6"  onClick={() => {this.handelSubmit("promocion")}}>
                                <a className="nav-link text-white font-weight-bold botonePrincipales" value="Promociones"><img src={config.trademarks.prmoRed} className="Img-fluid"></img></a>
                            </li>
                            <li className="nav-item col-lg-3 col-md-6"  onClick={() => {this.handelSubmit("masvendidos")}}>
                                <a className="nav-link text-white font-weight-bold botonePrincipales" value="Más vendidos"><img src={config.trademarks.novedades} className="Img-fluid"></img></a>
                            </li>
                            <li className="nav-item col-lg-3 col-md-6" onClick={() => {this.handelSubmit("nuevosproductos")}}>
                                <a className="nav-link text-white font-weight-bold botonePrincipales" value="Nuevos Productos"><img src={config.trademarks.buscados} className="Img-fluid"></img></a>
                            </li>
                            <li className="nav-item col-lg-3 col-md-6" onClick={() => {this.handelSubmit("remates")}}>
                                <a className="nav-link text-white font-weight-bold botonePrincipales"  value="Remates"><img src={config.trademarks.disponible} className="Img-fluid"></img></a>
                            </li>
                        </ul>
                    </div> */}
                    <div className="mb-md-5 justify-content-center" style={{marginTop: "300px"}}>
                        <div className="text-center pt-4">
                            <h1 className = "font-weight-bold">ACTIVACIÓN DE PRECIOS ESPECIALES</h1>
                        </div>
                    </div>
                    <div className="mb-md-4 mt-md-5 justify-content-center">
                        <div className="text-center pt-4 justify-content-center">
                            <button id="btnIniciar" ref={this.startButton} disabled = { !start }
                                style={{opacity:.2,border: '1px solid gray', width:200, height:200, color:'lightgreen', fontSize: '6em', borderRadius:100, backgroundColor:'white'}}
                                value="start" onClick={this.start}><i class="fas fa-play"></i>
                            </button>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button id="btnDetener" ref={this.stopButton} disabled = { !stop }
                                style={{opacity:.2,border:'1px solid gray', width:200, height:200, color:'red', fontSize:'6em', borderRadius:100, backgroundColor:'white'}}
                                value="stop" onClick={this.stop}><i class="fas fa-stop"></i>
                            </button>
                        </div>
                    </div>
                </div>
            );
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
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SpecialPricesView);