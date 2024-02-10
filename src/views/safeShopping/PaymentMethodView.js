import React, {Component} from 'react';
import {Footer, NavBar, Session, Suscription} from "../../components";
import {VIEW_NAME, config} from "../../libs/utils/Const";
import './SafeShopping.css';
import { animateScroll as scroll, scroller } from 'react-scroll';

class PaymentMethodView extends Component {

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
        const { locations } = config.contactUs;
        return (
            <div className="content-fluid" style={{marginTop: 150,backgroundColor:config.Back.backgroundColor }}>
                <Session history={history} view={VIEW_NAME.PAYMENT_METHOD_VIEW}/>
                <NavBar/>
                <div className="bannerRedCompensas margenS" style={{paddingLeft: 0, paddingRight: 0}}>
                    <img className="img-fluid"
                        src={require('../../images/diasa/metodosPago/banner.png')}
                        alt="Segundo NavBar"
                    />
                </div><br/>
                <div className="container" style={{paddingBottom: 20}}>
                    <div className="col-md-12 pt-4 pb-4 tituloSafeShopping margenSuperiorRedAliado text-center">
                        <h1 className="titleSpan"> Genera pagos rápidos y seguros con E-HANDEL </h1>
                        <span>Elige el método de pago que más te convenga</span>
                    </div>

                    <div className="pasosCompraSegura text-center">
                        <div className="row">
                            <div className="col-lg-6 pt-md-4 pb-md-4">
                                <img className="img-fluid" src={require('../../images/diasa/metodosPago/metodos-02.png')} alt="Segundo NavBar" />
                                <h5 style={{fontSize:"1.5rem"}} >Pago con tarjeta de crédito o débito</h5>
                                <span style={{fontSize:"1.5rem"}} >Paga de forma rápida y fácil con tu tarjeta de crédito y débito</span><br/>
                                {/* <img className="img-fluid" src={require('../../images/diasa/metodosPago/metodos--08.png')} alt="Segundo NavBar" /> */}
                            </div>
                            <div className="col-lg-6 pt-md-4 pb-md-4">
                                <img className="img-fluid" src={require('../../images/diasa/metodosPago/metodos-03.png')} alt="Segundo NavBar" />
                                <h5 style={{fontSize:"1.5rem"}}>¿Te gusta pagar en efectivo?</h5>
                                <span style={{fontSize:"1.5rem"}}>Haz tu pago en la tienda de conveniencia más cercana a ti</span><br/>
                                {/* <img className="img-fluid" src={require('../../images/diasa/metodosPago/metodos--09.png')} alt="Segundo NavBar" /> */}
                            </div>
                            <div className="col-lg-6 pt-md-4 pb-md-4">
                                <img className="img-fluid" src={require('../../images/diasa/metodosPago/metodos-04.png')} alt="Segundo NavBar" />
                                <h5 style={{fontSize:"1.5rem"}}>Haz un depósito o transferencia bancaria</h5>
                                <span style={{fontSize:"1.5rem"}}>Paga de manera inmediata con una tranferencia bancaria</span><br/>
                                {/* <img className="img-fluid" src={require('../../images/diasa/metodosPago/metodos--10.png')} alt="Segundo NavBar" /> */}
                            </div>
                            {/* <div className="col-lg-6 pt-md-4 pb-md-4">
                                <img className="img-fluid" src={require('../../images/diasa/metodosPago/metodos-05.png')} alt="Segundo NavBar" />
                                <h5>Puedes realizar tu pago con Mercado Pago</h5>
                                <span >Accede a tu cuenta de Mercado Pago y genera tu pago de forma ágil</span><br/>
                                <img className="img-fluid" src={require('../../images/diasa/metodosPago/metodos--11.png')} alt="Segundo NavBar" />
                            </div> */}
                            {/* <div className="col-lg-6 pt-md-4 pb-md-4">
                                <img className="img-fluid" src={require('../../images/diasa/metodosPago/metodos-06.png')} alt="Segundo NavBar" />
                                <h5>Paga con Paypal</h5>
                                <span>Paga fácil y rápido con tu cuenta de Paypal</span><br/>
                                <img className="img-fluid" src={require('../../images/diasa/metodosPago/metodos-12.png')} alt="Segundo NavBar" />
                            </div> */}
                            {/* <div className="col-lg-6 pt-md-4 pb-md-4">
                                <img className="img-fluid" src={require('../../images/diasa/metodosPago/metodos-07.png')} alt="Segundo NavBar" />
                                <h5>También puedes pagar con tus puntos de lealtad</h5>
                                <span>En ciertas campañas podrás pagar con puntos de cliente frecuente</span><br/>
                                <img className="img-fluid" src={require('../../images/diasa/metodosPago/metodos-13.png')} alt="Segundo NavBar" />
                            </div> */}
                        </div>                        
                    </div>
                </div>
                <Suscription/>
            </div>
                                    
            
        );
    }
}

export default PaymentMethodView;