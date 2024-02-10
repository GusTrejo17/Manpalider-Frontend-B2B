import React, {Component} from 'react';
import { NavBar, Session} from "../../components";
import {VIEW_NAME, config} from "../../libs/utils/Const";
import { animateScroll as scroll, scroller } from 'react-scroll';

class AsesoriaView extends Component {


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
                <NavBar/><br/>
                <div className="bannerRedCompensas margenS" style={{backgroundColor:"#FFFFFF"}}>
                    <img className="img-fluid"
                        src={require('../../images/diasa/bannerPaginas/asesorias gratis.png')}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="container mt-5" style={{minHeight: '80vh'}}>
                    <div className="row">
                        <div className="col-md" style={{fontSize: '1.5rem'}}>
                            <p className="text-justify ">
                                Establecemos un programa de capacitación integral para acompañar al usuario. El cual comprende el conocimiento general del producto, 
                                aplicaciones, técnicas de uso del producto y herramientas, así como medidas de seguridad para asegurar la integridad de los operadores.
                            </p>
                            <p className="text-justify description2 ">
                            Nos puedes contactar al teléfono: <strong>{config.footer.info.phone}</strong> 
                        </p>
                        <p className="description2">
                        WhatsApp: <strong>(81) 83964633 o al correo <a style={{display:"inline-block", textAlign:"center"}} href="ventas@diasa.net">
                           <span>ventas@diasa.net</span></a></strong> 
                        </p>
                        <br/>
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}

export default AsesoriaView;