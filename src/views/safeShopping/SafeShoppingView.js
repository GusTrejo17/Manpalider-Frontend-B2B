import React, {Component} from 'react';
import {Footer, NavBar, Session, Suscription} from "../../components";
import {VIEW_NAME, config} from "../../libs/utils/Const";
import './SafeShopping.css';
import questions from './preguntas';
import { animateScroll as scroll, scroller } from 'react-scroll';

class SafeShoppingView extends Component {
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
                <Session history={history} view={VIEW_NAME.SAFE_SHOPPING_VIEW}/>
                <NavBar/>
                <div className="bannerRedCompensas margenS" style={{paddingLeft: 0, paddingRight: 0}}>
                    <img className="img-fluid"
                        src={require('../../images/diasa/compraSegura/banner.png')}
                        alt="Segundo NavBar"
                    />
                </div><br/>
                <div className="container" style={{paddingBottom: 20}}>
                    <div className="col-md-12 pt-4 pb-4 tituloSafeShopping margenSuperiorRedAliado text-center">
                        <h1 className="titleSpan"> Como realizar una compra efectiva en nuestra e-Commerce </h1>
                        <span style={{fontSize:"1.5rem"}}>Nosotros te apoyamos paso a paso</span>
                    </div>

                    <div className="pasosCompraSegura text-center">
                        <div className="row">
                            <div className="col-lg-4 pt-md-4 pb-md-4">
                                <img className="img-fluid" src={require('../../images/diasa/compraSegura/compras-02.png')} alt="Segundo NavBar" />
                                <h5 style={{fontSize:"1.5rem"}}>Paso 1</h5>
                                <span style={{fontSize:"1.5rem"}}>Regístrate en E-HANDEL.</span>
                            </div>
                            <div className="col-lg-4 pt-md-4 pb-md-4">
                                <img className="img-fluid" src={require('../../images/diasa/compraSegura/compras-03.png')} alt="Segundo NavBar" />
                                <h5 style={{fontSize:"1.5rem"}}>Paso 2</h5>
                                <span style={{fontSize:"1.5rem"}}>Selecciona tus productos y agrégalos al carrito.</span>
                            </div>
                            <div className="col-lg-4 pt-md-4 pb-md-4">
                                <img className="img-fluid" src={require('../../images/diasa/compraSegura/compras-04.png')} alt="Segundo NavBar" />
                                <h5 style={{fontSize:"1.5rem"}}>Paso 3</h5>
                                <span style={{fontSize:"1.5rem"}}>Registra o selecciona tu dirección de envío.</span>
                            </div>
                            <div className="col-lg-4 pt-md-4 pb-md-4">
                                <img className="img-fluid" src={require('../../images/diasa/compraSegura/compras-05.png')} alt="Segundo NavBar" />
                                <h5 style={{fontSize:"1.5rem"}}>Paso 4</h5>
                                <span style={{fontSize:"1.5rem"}}>Selecciona tu método de pago.</span>
                            </div>
                            <div className="col-lg-4 pt-md-4 pb-md-4">
                                <img className="img-fluid" src={require('../../images/diasa/compraSegura/compras-06.png')} alt="Segundo NavBar" />
                                <h5 style={{fontSize:"1.5rem"}}>Paso 5</h5>
                                <span style={{fontSize:"1.5rem"}}>Generamos tu número de orden.</span>
                            </div>
                            <div className="col-lg-4 pt-md-4 pb-md-4">
                                <img className="img-fluid" src={require('../../images/diasa/compraSegura/compras-07.png')} alt="Segundo NavBar" />
                                <h5 style={{fontSize:"1.5rem"}}>Paso 6</h5>
                                <span style={{fontSize:"1.5rem"}}>Enviamos tu paquete.</span>
                            </div>
                        </div>                        
                    </div>

                    {/* <div className="container pb-4 pt-4">
                        <div className="col-md-12 pt-4 pb-4 tituloSafeShopping margenSuperiorRedAliado text-center">
                            <h2> Preguntas recurrentes </h2>
                        </div>
                        <div className="container">
                            <div className="row">
                                <div className="accordion" id="accordionExample">
                                    {questions.map( (pregunta, index) => {
                                        return(
                                            <div className="card">
                                                <div className="card-header" id={`heading${index}`}>
                                                    <span className="mb-0">
                                                        <button className="btn btn-link" type="button" data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
                                                            <div className="text-justify">
                                                                <p className="m-0">{pregunta.question}</p>
                                                            </div>
                                                        </button>
                                                    </span>
                                                </div>
                                                <div id={`collapse${index}`} className="collapse" aria-labelledby={`heading${index}`} data-parent="#accordionExample">
                                                    <div className="card-body text-justify">
                                                        {pregunta.answer.length > 1 ?
                                                                <ul>
                                                                    {pregunta.answer.map((contenido, index) => {
                                                                        return(
                                                                            <li key={index}>{contenido}</li>
                                                                        );
                                                                    })}
                                                                </ul>
                                                            :<p>{pregunta.answer}</p>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
                <Suscription/>
            </div>
            
        );
    }
}

export default SafeShoppingView;