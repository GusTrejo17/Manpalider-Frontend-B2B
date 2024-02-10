import React, {Component} from 'react';
import {Footer, NavBar, Session, Suscription} from "../../components";
import {VIEW_NAME, SERVICE_RESPONSE, config} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import { connect } from "react-redux";
import { animateScroll as scroll, scroller } from 'react-scroll';

let apiClient = ApiClient.getInstance();

const EMAIL_FORMAT_REGEX = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

class PrivacyView extends Component {
    constructor(props) {
        super(props);

        this.scrollToBottom = this.scrollToBottom.bind(this);
    };


    async componentDidMount(){
        this.scrollToBottom();
    };

    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
    }
    render() {
        const {history} = this.props;
        // console.log('Valor del state', this.state);
        return (
            <div className="content-fluid" style={{marginTop: 150,backgroundColor:config.Back.backgroundColor }}>
                <Session history={history} view={VIEW_NAME.PRIVACY_VIEW}/>
                <NavBar/>
                <div className="bannerRedCompensas margenS" style={{backgroundColor:config.Back.backgroundColor }}>
                    <img className="img-fluid"
                        src={config.privacy.banner}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="container" style={{paddingTop: 60, paddingBottom: 20}}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="text-justify">
                                En cumplimiento con lo establecido por la Ley Federal de Protección de Datos Personales en Posesión de Particulares le informamos 
                                nuestra política de privacidad y manejo de datos personales y hacemos el siguiente compromiso:<br/><br/>
                                <ol>
                                    <li>DIASA Distribuidora Industrial de Abrasivos, S.A. de C.V., con domicilio en Av. 1a Avenida #1495 Piso 6 Col. Las Cumbres CP 64610, Monterrey, Nuevo León, es responsable de recabar sus datos personales, del uso que se le dé a los mismos y de su protección.</li>
                                    <br/>
                                    <li>Los datos que le solicitamos únicamente serán utilizados como referencia para fijar una postura con respecto a la viabilidad del otorgamiento de un posible crédito y para localización. </li>
                                    <br/>
                                    <li>Los datos que ingrese en el formulario de contacto no serán difundidos, distribuidos o comercializados. </li>
                                    <br/>
                                    <li>En caso de que desee ser removido de nuestra base de datos, se podrá, en cualquier momento, solicitar la baja de sus datos mediante correo electrónico a ventas@diasa.net o por escrito dirigido a Distribuidora Industrial de Abrasivos, S.A. de C.V. con domicilio en Av. 1a Avenida #1495 Piso 6 Col. Las Cumbres CP 64610, Monterrey, Nuevo León, Teléfono: {config.footer.info.phone}. Sus datos personales podrán ser proporcionados a terceros de acuerdo con lo estrictamente señalado en la Ley Federal de Protección de Datos Personales en Posesión de Particulares.</li>
                                    <br/>
                                    <li>Cualquier modificación a este aviso de privacidad podrá consultarlo en la presente página de Internet, (www.diasa.net)</li>
                                    <br/>
                                </ol>
                                <br/>
                                <p>Cualquier información adicional por favor escriba ventas@diasa.net</p>
                            </div>
                        </div>    
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
)(PrivacyView);