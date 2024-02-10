import React, {Component} from 'react';
import {Footer, NavBar, Session, Suscription} from "../../components";
import {VIEW_NAME, SERVICE_RESPONSE} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import { connect } from "react-redux";
import { animateScroll as scroll, scroller } from 'react-scroll'

let apiClient = ApiClient.getInstance();

const EMAIL_FORMAT_REGEX = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

class PoliticsView extends Component {
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
            <div className="content-fluid" style={{marginTop: 150,backgroundColor:"#FFFFFF" }}>
                <Session history={history} view={VIEW_NAME.ADD_ADRESS_VIEW}/>
                <NavBar/>
                <div className="bannerRedCompensas margenS" style={{backgroundColor:"#FFFFFF"}}>
                    <img className="img-fluid"
                        src={require('../../images/diasa/politicasVentas/icon-01.png')}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="container" style={{paddingTop: 60, paddingBottom: 20, fontSize: 18}}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="text-justify">
                                <ol>
                                    <li>Los precios se sujetarán a la publicación de nuestros productos en nuestro sitio web y quedarán sujetos a cambios sin previo aviso.</li><br/>
                                    <li>Todo pedido deberá especifcar:
                                        <ul style={{listStyleType: "circle"}}>
                                            <li>Nombre o razón social </li>
                                            <li>Domicilio fscal que contengan, calle, Número, colonia, código postal, ciudad, delegación y/o estado, teléfono y en su caso, domicilio de entrega.</li>
                                            <li>Especifcar la forma de pago que deberá ser, efectivo, transferencia, cheque, de otra manera se manejara como no especifcado. </li>
                                        </ul>
                                    </li><br/>
                                    <li>Toda operación a crédito deberá ser aprobada por el departamento de crédito y cobranza.</li><br/>
                                    <li>La mercancía viajara por cuenta y riesgo del cliente por lo que dichos embarques deberán contar con el seguro de daños correspondiente. Por lo que cualquier reclamación por daños en el embarque deberá ser realizada por el cliente.</li>
                                    <li>Los Pedidos consideradas en frme, no podrán ser canceladas o modifcadas sin previa autorización.</li><br/>
                                    <li>Los precios de venta no incluyen IVA (16%). Dicho impuesto será facturado en adición a los precios de la lista vigente de la empresa.</li><br/>
                                    <li>Las reclamaciones por faltantes o errores en envíos serán considerados únicamente mediante un escrito detallado dirigido al departamento de Ventas de
                                        Grupo Redhogar SA de CV. Este escrito tiene que ser enviado vía fax o correo electrónico ventas@redhogar.com.mx dentro de los siguientes 3 días hábiles a la
                                        fecha de recepción del pedido, debiendo anexar copia de la guía de embarque, así como el formato del acuse de recibo que podrá descargar en nuestro sitio
                                        web en la sección de descargas.
                                    </li><br/>
                                    <li>En caso de productos eléctricos o electrónicos, mercancía surtida sobre pedido y productos frágiles, No aplica devoluciones ni garantías. </li><br/>
                                    <li>Una vez autorizada las solicitudes por cambio o devolución y recibida la mercancía por nuestro almacén se elaborara la nota de crédito correspondiente,
                                        por lo que el cliente no se podrá descontar el valor de la devolución hasta que esté debidamente aplicada.
                                    </li><br/>
                                    <li>Las devoluciones de mercancía que se realicen por motivos imputables al cliente llevaran un cargo del 20% sobre el valor de dicha mercancía, así mismo el
                                        costo del fete por conceptos de envíos bajo cualquier circunstancia correrán a cargo del cliente.<br/><br/>
                                        NOTA: Únicamente se consideran casos imputables a la empresa, los faltantes y/o errores en el surtido de la mercancía en cuyo caso la misma se hará cargo de
                                        los gastos de envió.
                                    </li><br/>
                                    <li>La garantía del producto, solo se aplicarán las que ofrece el fabricante o representante de la marca o producto.</li><br/>
                                </ol>
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
)(PoliticsView);