import React, {Component} from 'react';
import {Footer, NavBar, Session} from "../../components";
import {VIEW_NAME, SERVICE_RESPONSE} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import { connect } from "react-redux";
import { animateScroll as scroll, scroller } from 'react-scroll';


let apiClient = ApiClient.getInstance();

const EMAIL_FORMAT_REGEX = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

class Reclamo extends Component {
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
    //Evento para capturar los valores de los campos
    handelChange = ({ target }) => {
        const { name, value } = target;
        this.setState({
            [name]: value
        });
    };
    //Evento clic en el boton de enviar
    handelSubmit = async (e) => {
        //Prevenimos un recargo de pagina
        e.preventDefault();
        //Definimos las variables que estan en el state
        const { nombre, apellido, remitente, contacto, destinatario, asunto, mensaje} = this.state;
        const { notificationReducer: { showAlert }, configReducer} = this.props;
        //Validamos que los campos esten llenos
        if(!nombre){
            showAlert({ type: 'warning', message: 'Introduzca un nombre' });
            return;
        }
        if(!apellido){
            showAlert({ type: 'warning', message: 'Introduzca un apellido' });
            return;
        }
        if(!remitente){
            showAlert({ type: 'warning', message: 'Introduzca un email' });
            return;
        }else{
            //Validamos el formato del email
            if (!EMAIL_FORMAT_REGEX.test(remitente)) return showAlert({
                type: 'warning',
                message: 'Por favor, revisa el formato, Ejemplo: nombre@correo.com',
                timeOut: 8000
            });
        }
        if(!contacto){
            showAlert({ type: 'warning', message: 'Introduzca un número de telefono' });
            return;
        }
        if(!destinatario){
            showAlert({ type: 'warning', message: 'Seleccione un departamento' });
            return;
        }
        if(!asunto){
            showAlert({ type: 'warning', message: 'Introduzca un asunto para le mansaje' });
            return;
        }
        if(!mensaje){
            showAlert({ type: 'warning', message: 'Introduzca un mensaje' });
            return;
        }
        //Preparamos los datos para pasarlos al back
        let reclamo = {
            contenido: {
                name: nombre,
                lastName: apellido,
                email: remitente,
                phone: contacto,
                destino: destinatario,
                heading: asunto,
                body: mensaje
            }
        };
        //Hace la petición al back
        let response = await apiClient.sendClaim(reclamo);
        //Validamos la respuesta del Back
        if (response.status === SERVICE_RESPONSE.ERROR) {
            showAlert({
                type: 'error',
                message: response.message,
                timeOut: 8000
            });
            return;
        }else{
            configReducer.history.goHome();
            showAlert({
                type: 'success',
                message: "Su comentario ha sido enviado",
                timeOut: 8000
            });
        }
    };
    render() {
        const {history} = this.props;
        // console.log('Valor del state', this.state);
        return (
            <div className="content-fluid" style={{marginTop: 150,backgroundColor:"#FFFFFF"}}>
                <Session history={history} view={VIEW_NAME.CLAIM_US_VIEW}/>
                <NavBar/>
                <div className="container" style={{paddingTop: 60, paddingBottom: 20}}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="jumbotron">
                                <h1 className="display-4 text-center">Enviar comentarios</h1>
                            </div>
                        </div>    
                    </div>
                    <form onSubmit={this.handelSubmit} method="post" encType="text/plain" className="container">
                        <div className="row">
                            <div className="form-group col-md">
                                <label>Nombre completo</label>
                                <input type="text" className="form-control" placeholder="Nombre(s)" name="nombre" onChange={this.handelChange}/>
                            </div>
                            <div className="form-group col-md">
                                <label>Apellido</label>
                                <input type="text" className="form-control" placeholder="Apellido" name="apellido" onChange={this.handelChange}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md">
                                <label>Correo electrónico</label>
                                <input type="email" className="form-control" placeholder="Email" name="remitente" onChange={this.handelChange}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md">
                                <label>Número de teléfono</label>
                                <input type="text" className="form-control" placeholder="Teléfono" name="contacto" onChange={this.handelChange}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md">
                                <label>¿Para que departamento va dirigida la sugerencias?</label>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="destinatario" id="exampleRadios1" value="Ventas" onChange={this.handelChange}/>
                                    <label className="form-check-label" for="exampleRadios1">
                                        Ventas
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="destinatario" id="exampleRadios2" value="Soporte" onChange={this.handelChange}/>
                                    <label className="form-check-label" for="exampleRadios2">
                                        Soporte
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="destinatario" id="exampleRadios3" value="Otro" onChange={this.handelChange}/>
                                    <label className="form-check-label" for="exampleRadios3">
                                        Otro
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md">
                                <label>Asunto</label>
                                <input type="text" className="form-control" placeholder="Asunto" name="asunto" onChange={this.handelChange}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md">
                                <label>Mensaje</label>
                                <textarea placeholder="Coloque aquí su comentario" name="mensaje" className="form-control" onChange={this.handelChange}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md">
                                <input type="submit" value="Enviar correo" className="btn btn-primary mb-2"/>
                            </div>
                        </div>
                    </form>
                </div>
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
)(Reclamo);