import React, {Component} from 'react';
import {ApiClient} from "../libs/apiClient/ApiClient";
import {DISPATCH_ID, SERVICE_RESPONSE, config, ROLES} from '../libs/utils/Const';
import {connect} from 'react-redux';
import {Modal} from "./index";
import $, { trim } from 'jquery';

let modal = new Modal();
let apiClient = ApiClient.getInstance();

class TwoStepsVerificationModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            key0 : '',
            key1 : '',
            key2 : '',
            key3 : '',
            key4 : '',
            key5 : '',
            key6 : '',
        };
        this.key0Focus = React.createRef();
        this.key1Focus = React.createRef();
        this.key2Focus = React.createRef();
        this.key3Focus = React.createRef();
        this.key4Focus = React.createRef();
        this.key5Focus = React.createRef();
        this.key6Focus = React.createRef();
    }

    validateKey = async (event) => {
        const { enableSpinner, notificationReducer: {showAlert}, loginReducer, startSession} = this.props;
        const { key0, key1, key2, key3, key4, key5, key6 } = this.state;
        if(key0.length == 6){ // key1 !== '' && key2 !== '' && key3 !== '' && key4 !== '' && key5 !== '' && key6 !== ''){
            let key = key0; // key1 + key2 + key3 + key4 + key5 + key6;
            let user = {
                email: loginReducer.user,
                key: key,
            };

            enableSpinner(true);
            let response = await apiClient.loginTwoSteps(user);
            enableSpinner(false);

            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                if(response.data){
                    if(response.data.answer === 'Y'){
                        $('#TwoStepsModal').modal('hide');
                        startSession();
                    } else {
                        showAlert({type: 'error', message: ' Clave de correo ingresada incorrecta ' , timeOut: 8000});                        
                    }
                    this.setState({
                        key0: '',
                        key1: '', key2: '', key3: '', key4: '', key5: '', key6: ''
                    });
                    return;
                }                
            } else {
                showAlert({type: 'error', message: ' Ocurrió un error al consultar la clave de tu correo ' , timeOut: 8000});
                this.setState({
                    key0: '',
                    key1: '', key2: '', key3: '', key4: '', key5: '', key6: ''
                });
                return;
            }
            
        } else {
            showAlert({type: 'warning', message: ' Ingrese el código completo ', timeOut: 8000});
            return;
        }
    };

    changeKey = async (name, event) => {
        const { notificationReducer: {showAlert} } = this.props;
        let newKey = trim(event.nativeEvent.target.value);

        if(trim(newKey).length === 6){
            this.setState({
                key0: newKey,
                key1: trim(newKey).substring(0,1), key2: trim(newKey).substring(1,2), key3: trim(newKey).substring(2,3), 
                key4: trim(newKey).substring(3,4), key5: trim(newKey).substring(4,5), key6: trim(newKey).substring(5,6)
            });
            setTimeout(async() => {
                await this.validateKey();
                return;
            }, 150);        
        } else {
            if(newKey.length > 6){
                showAlert({type: 'warning', message: ' Solo se permiten 6 caractéres ', timeOut: 8000});
                return;
            }

            if(name === 'key1'){
                this.setState({
                    key1: newKey                
                });
                this.key2Focus.current.focus();
            } else if(name === 'key2'){
                this.setState({
                    key2: newKey,
                });
                this.key3Focus.current.focus();
            } else if(name === 'key3'){
                this.setState({
                    key3: newKey,
                });
                this.key4Focus.current.focus();
            } else if(name === 'key4'){
                this.setState({
                    key4: newKey,
                });
                this.key5Focus.current.focus();
            } else if(name === 'key5'){
                this.setState({
                    key5: newKey,
                });
                this.key6Focus.current.focus();
            } else if(name === 'key6'){
                this.setState({
                    key6: newKey,
                });
                this.key1Focus.current.focus();
            }
            else if(name === 'key0'){
                this.setState({
                    key0: newKey,
                });
            }
            
            setTimeout(async() => {
                if(name === 'key6'){
                    await this.validateKey();
                }
            }, 150);    
        }    
    }    

    render() {
        const {key0, key1, key2, key3, key4, key5, key6} = this.state;
        let ctrlKey = 17;
        let cmdKey = 91;
        let vKey = 86;
        let enterKey = 13;
        return (
            <div className="modal fade" id="TwoStepsModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document" style={{minWidth:300 ,maxWidth: 600, margin: '1.75rem auto', borderRadius: 15}}>
                    <div className="modal-content">
                        <div className="modal-header" style={{background: config.navBar.backgroundColor}}>
                            <h5 className="modal-title" style={{color: config.navBar.textColor}}>Verificación por correo</h5>
                            <button type="button" style={{color: config.navBar.textColor}} className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body bg3">
                            <div className = "row">
                                <div className = "col-md-12">
                                        <h3>Ingresa el código de verificación de 6 dígitos de tu correo electrónico:</h3><br/>
                                        <span>(El correo puede tardar hasta 1 minuto - Le recomendamos revisar la carpeta de Spam)</span><br/>
                                    <form class="form-inline justify-content-center text-center">
                                        <input ref={this.key0Focus} className = "form-group form-control-md mr-md-2 mt-md-4 inputTwoSteps1 text-center" type="text" value={key0 || ''} placeholder="" 
                                            onChange={(event) => { this.changeKey('key0', event) }} onKeyDown={event => (event.keyCode === enterKey) && this.validateKey(event)}/>
                                    </form>
                                    {/* <form class="form-inline justify-content-center text-center">
                                        <input ref={this.key1Focus} className = "form-group form-control-sm mr-md-2 mt-md-4 inputTwoSteps text-center" type="text" size="1" value={key1 || ''} placeholder="" 
                                            onChange={(event) => { this.changeKey('key1', event) }} onKeyDown={event => (event.keyCode === enterKey) && this.validateKey(event)}/>
                                        <input ref={this.key2Focus} className = "form-group form-control-sm mr-md-2 mt-md-4 inputTwoSteps text-center" type="text" size="1" value={key2 || ''} placeholder="" 
                                            onChange={(event) => { this.changeKey('key2', event) }} onKeyDown={event => (event.keyCode === enterKey) && this.validateKey(event)}/>
                                        <input ref={this.key3Focus} className = "form-group form-control-sm mr-md-2 mt-md-4 inputTwoSteps text-center" type="text" size="1" value={key3 || ''} placeholder="" 
                                            onChange={(event) => { this.changeKey('key3', event) }} onKeyDown={event => (event.keyCode === enterKey) && this.validateKey(event)}/>
                                        <input ref={this.key4Focus} className = "form-group form-control-sm mr-md-2 mt-md-4 inputTwoSteps text-center" type="text" size="1" value={key4 || ''} placeholder="" 
                                            onChange={(event) => { this.changeKey('key4', event) }} onKeyDown={event => (event.keyCode === enterKey) && this.validateKey(event)}/>
                                        <input ref={this.key5Focus} className = "form-group form-control-sm mr-md-2 mt-md-4 inputTwoSteps text-center" type="text" size="1" value={key5 || ''} placeholder="" 
                                            onChange={(event) => { this.changeKey('key5', event) }} onKeyDown={event => (event.keyCode === enterKey) && this.validateKey(event)}/>
                                        <input ref={this.key6Focus} className = "form-group form-control-sm mr-md-2 mt-md-4 inputTwoSteps text-center" type="text" size="1" value={key6 || ''} placeholder="" 
                                            onChange={(event) => { this.changeKey('key6', event) }} onKeyDown={event => (event.keyCode === enterKey) && this.validateKey(event)}/>
                                    </form> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
        loginReducer: store.LoginReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TwoStepsVerificationModal);