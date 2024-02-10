import React, {Component} from 'react';
import {config, SERVICE_API,DISPATCH_ID,SERVICE_RESPONSE} from "../libs/utils/Const";
import {ApiClient} from "../libs/apiClient/ApiClient";
import $ from 'jquery';
import {connect} from 'react-redux';
import CurrencyFormat from 'react-currency-format';
let apiClient = ApiClient.getInstance();
const EMAIL_FORMAT_REGEX = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

class ModaleMailPDF extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cv: null,
        };
    };

    async UpdateCart(){
        $('#ModalSendPDF').modal('hide');
    }

    sendMail = async () => {
        const { enableSpinner, notificationReducer: {showAlert}, sessionReducer } = this.props;
        const { formStatus, typeForm, facturaToSend,mailToClient } = this.state;

        // if(jobType == '' || education == '' || address == '' || postalCode == '' || phone == '' || mail == '' || lastName == '' || name == ''){
        //     showAlert({ type: 'warning', message: 'Por favor, rellene todos los datos del formulario', timeOut: 8000 });
        //     return;
        // }
        if(!mailToClient.includes("@")){
            showAlert({ type: 'warning', message: 'Por favor, ingrese un correo válido', timeOut: 8000 });
            return;
        }

        if(facturaToSend === null){
            showAlert({ type: 'warning', message: 'Por favor, adjunte su factura', timeOut: 8000 });
            return;
        }

        const formData = new FormData();         
        formData.append("file", facturaToSend);
        formData.append("mail", mailToClient);


        enableSpinner(true);
        let apiResponse = await apiClient.sendFilesByEmail(formData);
        enableSpinner(false);

        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            showAlert({ type: 'success', message: 'Tu correo esta siendo enviado', timeOut: 8000 });
            this.setState({
                mailToClient: '',
                facturaToSend: null,
                cv:null,
            });   
        } else {
            showAlert({ type: 'error', message: apiResponse.message || 'Ocurrió un error al enviar sus datos', timeOut: 8000 });
        }
    };

    onChangeMail = (value) => {
        this.setState({
            mailToClient: value,
        })
    }

    onChangeCV = (value) => {
        const { notificationReducer: {showAlert} } = this.props;
        
        if(!value){
            showAlert({ type: 'warning', message: 'Por favor selecciona un archivo', timeOut: 5000 });
            return;
        }
        if(value.size > 3000000){
            showAlert({ type: 'warning', message: 'El archivo no puede pesar más de 3MB', timeOut: 8000 });
            return;
        }

        let ext = value.name.lastIndexOf(".");
        let validateExt = value.name.substring(ext, value.name.length);
        let flagValidationExt = validateExt == ".docx" || validateExt == ".pdf" || validateExt == ".jpg" || validateExt == ".jpeg" 
                                || validateExt == ".png" || validateExt == ".doc" ? true : false;
        if(flagValidationExt === false){
            showAlert({ type: 'warning', message: 'El CV debe estar en formato word, PDF o imagen', timeOut: 8000 });
            return;
        }
        
        this.setState({
            cv: value,
            facturaToSend: value,
            imagePreview: URL.createObjectURL(value),
            imagePreviewType: validateExt == ".png" || validateExt == ".jpg" || validateExt == ".jpeg" ? "image" : validateExt == ".docx" || validateExt == ".doc" ? "word" : validateExt == ".pdf" ? "pdf" : ""
        })

        showAlert({ type: 'success', message: 'Archivo adjuntado con éxito', timeOut: 8000 });
    };

    render() {
        const { mailToClient,cv } = this.state;
        
        return (
            <div className="modal fade" id="ModalSendPDF" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{border: "none", textAlign: 'center'}}>
                <div className="modal-dialog modal-xl" role="document" style={{margin: '1.75rem auto'}}>
                    <div className="modal-content">
                        <div className="modal-header" style={{background: config.shoppingList.summaryList}}>
                            <h5 className="modal-title" style={{color: config.navBar.textColor2}}>ENVIAR ARCHIVOS POR CORREO</h5>
                            <button type="button" style={{color: config.navBar.textColor2}} className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body bg3">
                            <div className="row justify-content-md-center my-3">
                                    
                                    <div className="col-md-12">
                                        {/* <input type="text" className="form-control" id="inppromoUniClient"  placeholder="Escribe el correro para quien es dirigido"/> */}
                                        <div className="row text-center">
                                            <div className="form-group col-md-6">
                                                <label className = "text-left">Correo electrónico del destinatario</label>
                                                <input type="email" style = {{borderRadius: 12}} className="form-control form-control-lg" placeholder="E-mail" value = {mailToClient || ''} onChange={(event) => {this.onChangeMail(event.target.value)}}/>
                                            </div>
                                            <div className="form-group col-md-6" style={{alignSelf:'end'}}>
                                                <label for="customFile" className="text-center justify-content-center">Adjunte su PDF aqui
                                                    <img style={{marginLeft:10}} className="img-fluid w-25"
                                                        src={require('../images/diasa/bolsaTrabajo/AgregarImagen.png')}
                                                        alt="ImgCV"
                                                    />
                                                </label>
                                                <input type="file" style={{ display: 'none' }} id="customFile" className="form-control form-control-lg" placeholder="CV" onChange={(event) => { this.onChangeCV(event.target.files[0]) }} />
                                                <label className = "text-center text-success font-weight-bold align-middle">{cv ? 'Archivo cargado: "'+cv.name+'"' : ''}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn btn-success" data-dismiss="modal" onClick={this.sendMail}>Enviar correo</button>                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
        notificationReducer: store.NotificationReducer,
        configReducer: store.ConfigReducer,
        sessionReducer: store.SessionReducer,
        shoppingCartReducer: store.ShoppingCartReducer
    };
}

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        setItemDetailsSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SET_ITEM_DETAILS, value}),
        setItemsSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SET_ITEMS, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModaleMailPDF);
