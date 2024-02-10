import React, {Component} from 'react';
import { NavBar, Session} from "../../components";
import {VIEW_NAME, config} from "../../libs/utils/Const";
import { animateScroll as scroll, scroller } from 'react-scroll';

class PlantillaView extends Component {

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
        return (
            <div className="content-fluid" style={{marginTop: 120,backgroundColor:"#FFFFFF"}}>
                <Session history={history} view={VIEW_NAME.PLANTILLA_VIEW}/>
                <NavBar/>
                <div className="bannerRedCompensas margenS" style={{backgroundColor:"#FFFFFF"}}>
                    <img className="img-fluid"
                        src={require('../../images/diasa/bannerPaginas/carga.png')}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="container mt-3" style={{minHeight: '30vh'}}>
                    <div className="row">
                        <div className="col-md" style={{fontSize: '1.5rem'}}>
                            <ol>
                                <br/>
                                <li>Descargar el archivo Excel que se encuentra al final de esta página.</li>
                                <li>Ingresar los siguientes datos:
                                    <ul>
                                        {/* <dd>Ingresar los siguientes datos:</dd> */}
                                        <li style={{fontSize:'1.5rem'}}><strong>Cliente:</strong> Este es el número de cliente con el cual se inicia sesión en nuestra plataforma.</li>
                                        <li style={{fontSize:'1.5rem'}}><strong>ItemCode:</strong> Es el código del artículo que se desea agregar.</li>
                                        <li style={{fontSize:'1.5rem'}}><strong>Unidades solicitadas:</strong> Es la cantidad de unidades que se desean adquirir.</li>
                                    </ul>
                                </li>
                                <li>Guardar el archivo.</li>
                            </ol>
                        </div>
                        <div className="col-md" style={{fontSize: '1.5rem'}}>
                            <ol start='4'>
                                <br/>
                                <li>Dirigirse al apartado de “Carga Masiva”.</li>
                                <li>Dar clic en el botón de “Seleccionar archivo”.</li>
                                <li>Elegir el archivo.</li>
                                <li>Verificar el listado de artículos.</li>
                                <li>Dar clic en el botón de agregar al carrito.</li>
                                <li>Continuar con la compra. </li>
                            </ol>
                        </div>
                    </div>
                    <div className="row justify-content-start">
                        <div className="col-md-4 " style={{fontSize: '1.5rem'}}>
                            <p>
                                <a href={config.platilla.arhivoPlantila} download="plantillaDiasa">
                                    <img className="img-fluid" width='10%' height='10%' src={config.platilla.iconoExcel} style={{ padding: 1 }}></img>&nbsp;
                                    <span>Descargar plantilla</span>
                                </a>
                                <br/>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}

export default PlantillaView;