import React, {Component} from 'react';
import {Footer, NavBar, Session, Suscription} from "../../components";
import {VIEW_NAME, config} from "../../libs/utils/Const";
import './Devolution.css';
import { animateScroll as scroll, scroller } from 'react-scroll';

class DevolutionView extends Component {


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
            <div className="content-fluid" style={{marginTop: 150,backgroundColor:"#FFFFFF"}}>
                <Session history={history} view={VIEW_NAME.DEVOLUTION_VIEW}/>
                <NavBar/>
                <div className="bannerRedCompensas margenS" style={{paddingLeft: 0, paddingRight: 0}}>
                    <img className="img-fluid"
                        src={require('../../images/diasa/devoluciones/banner.png')}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="col-md-12 pt-4 pb-4 tituloDevolution margenSuperiorRedAliado text-center">
                    <h1><strong> Opción 1 </strong></h1>
                    <span> Inconvenientes en el surtido o garantía del producto</span>
                </div>
                <div className="container devoluciones" style={{paddingBottom: 20, paddingTop: 20}}>
                    <div className="row">
                        <div className="col-lg-3 pt-2">
                            <div className="card" >
                                <div className="card-header"></div>
                                <img className="card-img-top img-fluid" style={{width: "80%", margin: 'auto'}} src={require('../../images/diasa/devoluciones/Devoluciones-02.png')} alt="Devoluciones1" />
                                <div className="card-body text-center">
                                    <h1><strong>1</strong></h1>
                                    <p className="contenido text-center">Póngase en contacto con uno de nuestros asesores de ventas.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3  pt-2">
                            <div className="card" >
                                <div className="card-header"></div>
                                <img className="card-img-top img-fluid" style={{width: "80%", margin: 'auto'}} src={require('../../images/diasa/devoluciones/Devoluciones-03.png')} alt="Devoluciones1" />
                                <div className="card-body text-center">
                                    <h1><strong>2</strong></h1>
                                    <p className="contenido text-center">Le <strong>proporcionaremos</strong> un código o una  etiqueta de envío para que la imprima y pegue en el paquete.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3  pt-2">
                            <div className="card" >
                                <div className="card-header"></div>
                                <img className="card-img-top img-fluid" style={{width: "80%", margin: 'auto'}} src={require('../../images/diasa/devoluciones/Devoluciones-04.png')} alt="Devoluciones1" />
                                <div className="card-body text-center">
                                    <h1><strong>3</strong></h1>
                                    <p className="contenido text-center">Lleva el paquete a la sucursal de la paquetería que corresponda.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3  pt-2">
                            <div className="card" >
                                <div className="card-header"></div>
                                <img className="card-img-top img-fluid" style={{width: "80%", margin: 'auto'}} src={require('../../images/diasa/devoluciones/Devoluciones-05.png')} alt="Devoluciones1" />
                                <div className="card-body text-center">
                                    <h1><strong>4</strong></h1>
                                    <p className="contenido text-center">Listo, te cambiamos el producto o hacemos tu reembolso.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 pt-4 pb-4 tituloDevolution margenSuperiorRedAliado text-center">
                    <h1><strong> Opción 2 </strong></h1>
                    <span> Falla al escoger el producto </span>
                </div>
                <div className="container devoluciones" style={{paddingBottom: 20, paddingTop: 20}}>
                    <div className="row">
                        <div className="col-lg-3 pt-2">
                            <div className="card" >
                                <div className="card-header"></div>
                                <img className="card-img-top img-fluid" style={{width: "80%", margin: 'auto'}} src={require('../../images/diasa/devoluciones/Devoluciones-06.png')} alt="Devoluciones1" />
                                <div className="card-body text-center">
                                    <h1><strong>1</strong></h1>
                                    <p className="contenido text-center">Póngase en contacto con uno de nuestros asesores de ventas.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3  pt-2">
                            <div className="card" >
                                <div className="card-header"></div>
                                <img className="card-img-top img-fluid" style={{width: "80%", margin: 'auto'}} src={require('../../images/diasa/devoluciones/Devoluciones-07.png')} alt="Devoluciones1" />
                                <div className="card-body text-center">
                                    <h1><strong>2</strong></h1>
                                    <p className="contenido text-center">Le <strong>cotizaremos</strong> un código o una  etiqueta de envío para que la imprima y pegue en el paquete.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3  pt-2">
                            <div className="card" >
                                <div className="card-header"></div>
                                <img className="card-img-top img-fluid" style={{width: "80%", margin: 'auto'}} src={require('../../images/diasa/devoluciones/Devoluciones-08.png')} alt="Devoluciones1" />
                                <div className="card-body text-center">
                                    <h1><strong>3</strong></h1>
                                    <p className="contenido text-center">Lleva el paquete a la sucursal de la paquetería que corresponda.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3  pt-2">
                            <div className="card" >
                                <div className="card-header"></div>
                                <img className="card-img-top img-fluid" style={{width: "80%", margin: 'auto'}} src={require('../../images/diasa/devoluciones/Devoluciones-09.png')} alt="Devoluciones1" />
                                <div className="card-body text-center">
                                    <h1><strong>4</strong></h1>
                                    <p className="contenido text-center">Listo, te cambiamos el producto o hacemos tu reembolso.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-fluid pt-4 pb-4 pl-2 pr-2 NotaDevolution margenSuperiorRedAliado ">
                    <div className="nota" >
                        <h1><strong> Nota </strong></h1>
                        <span> Para mayor información contacte a unos de nuestros asesores de venta. <strong>(81) 1253 3080</strong> </span>
                    </div>
                </div>
                <Suscription/>
            </div>
            
        );
    }
}

export default DevolutionView;