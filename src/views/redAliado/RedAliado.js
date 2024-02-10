import React, {Component} from 'react';
import {Footer, NavBar, Session, Suscription} from "../../components";
import {VIEW_NAME, SERVICE_RESPONSE} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import { connect } from "react-redux";
import { animateScroll as scroll, scroller } from 'react-scroll'

let apiClient = ApiClient.getInstance();

const EMAIL_FORMAT_REGEX = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

class RedAliadoView extends Component {
    constructor(props){
        super(props);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    scrollToBottom() {
        scroll.scrollToTop({
            duration: 1500,
            delay: 100,
            smooth: 'easeOutQuart',
            isDynamic: true
          })
    }

    componentDidMount(){
        this.scrollToBottom();
    }

    render() {
        const {history} = this.props;
        // console.log('Valor del state', this.state);
        return (
            <div className="content-fluid" style={{marginTop: 150,backgroundColor:'#FFFFFF' }}>
                <Session history={history} view={VIEW_NAME.RED_ALIADO_VIEW}/>
                <NavBar/>
                <div className="bannerRedCompensas" style={{backgroundColor:'#FFFFFF'}}>
                    <img className="img-fluid"
                        src={require('../../images/diasa/redAliado/aliados.jpg')}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="container" style={{paddingBottom: 20}}>
                    <div className="col-md-12 pt-4 margenSuperiorRedAliado">
                        <h1 className="text-center font-weight-bold">Conviértete en aliado sin costo, y obtén grandes beneficios.</h1>
                    </div>
                    {/* <div className="bannerRedCompensas" style={{backgroundColor:config.Back.backgroundColor }}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/redAliado/icono-07.png')}
                            alt="Segundo NavBar"
                        />
                    </div> */}
                    <br/><br/>
                    <div className="text-justify" style={{fontSize: 20}}>
                        <p><strong>Aliado</strong> es un programa en el cual nuestros usuarios obtienen beneficios y descuentos dependiendo de las compras que realicen en E-HANDEL.</p>
                    </div><br/><br/>
                    {/* <div className="row col-12">
                        <div className="col-lg-2 col-md-6">
                            <img className="img-fluid"
                                src={require('../../images/diasa/redAliado/Red-aliado-bronze.png')}
                                alt="Segundo NavBar"
                            />
                        </div>
                        <div className="col-lg-2 col-md-6">
                            <img className="img-fluid"
                                src={require('../../images/diasa/redAliado/Red-aliado-silver.png')}
                                alt="Segundo NavBar"
                            />
                        </div>
                        <div className="col-lg-2 col-md-6">
                            <img className="img-fluid"
                                src={require('../../images/diasa/redAliado/Red-aliado-gold.png')}
                                alt="Segundo NavBar"
                            />
                        </div>
                        <div className="col-lg-2 col-md-6">
                            <img className="img-fluid"
                                src={require('../../images/diasa/redAliado/platinum.png')}
                                alt="Segundo NavBar"
                            />
                        </div>
                        <div className="col-lg-2 col-md-6">
                            <img className="img-fluid"
                                src={require('../../images/diasa/redAliado/Red-aliado-Diamond.png')}
                                alt="Segundo NavBar"
                            />
                        </div>
                    </div> <br/><br/>*/}                    
                    <div className="text-justify" style={{fontSize: 20}}>
                        <p><strong>Beneficios</strong></p>
                        <ul>
                            <li>Acceso a nuestro catálogo de productos.</li>
                            <li>Acceso a nuestro catálogo de productos.</li>    
                            <li>Control completo de tu compra.</li>    
                            <li>Seguimiento del estatus de tu pedido en todo momento.</li>    
                            <li>Maneja de forma más efectiva sus compras con nuestra sección de reportes.</li>        
                        </ul><br/>
                        <p><strong>Contacta a nuestro asesor</strong></p>
                        <p><strong>(81) 1253 3080</strong> o <strong> ventas@diasa.net</strong></p>
                    </div>
                </div>
                <Suscription/>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        notificationReducer: store.NotificationReducer,
        configReducer: store.ConfigReducer
    };
};

export default connect(
    mapStateToProps
)(RedAliadoView);