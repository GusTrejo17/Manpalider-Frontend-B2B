import React, {Component} from 'react';
import {Footer, NavBar, Session} from "../../components";
//import {VIEW_NAME, config} from "../../libs/utils/Const";
import {DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE, VIEW_NAME, config} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import $ from 'jquery';
import moment from "moment";
import { Redirect } from 'react-router';
import { animateScroll as scroll, scroller } from 'react-scroll';

let apiClient = ApiClient.getInstance();

class MyProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Codigo : '',
            Nombre : '',
            Correo : '',
            Password : '',

            Promos : [],
            items : [],
            itemsSelected : [],
            itemsSelectedBonification: [],
            finishItems : [],
            arr : [],
            createPromo: {
                Name : '',
                buscarLike : '',
                buscarBoniLike : '',
            },
            typeVisibility : true,
            typeVisibilitynew : true,
            typeVisibilityrepeat : true
        };

        this.scrollToBottom = this.scrollToBottom.bind(this);
    };

    async componentDidMount(){
        // const {enableSpinner} = this.props;
        // enableSpinner(true);
        this.cargarDatos();
        //this.cargarFecha();
        
        // enableSpinner(false);
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

    async cargarDatos (){
        //let newdatas = await apiClient.getPromo()
        let user = localStorage.getItem(config.general.localStorageNamed + 'CurrentUser');
        user = JSON.parse(user) || {};
        let newdatas = await apiClient.detailsprofile(user.U_FMB_Handel_Email);
        this.setState({   
            Codigo: user.CardCode,
            Password: newdatas.data[0].U_FMB_Handel_Pass,
            Nombre : user.CardName,
            Correo : user.U_FMB_Handel_Email 
        });
    };

    Actualizar = async response => {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        const {Codigo,Password} = this.state;
        
        let password = document.getElementById("actuallypassword").value;
        let pass1 = document.getElementById("password1").value;
        let pass2 = document.getElementById("password2").value;

        if(password == ''){
            showAlert({type: 'warning', message: 'Por favor escriba su contraseña actual'})
            return;
        }

        if(password != Password){
            showAlert({type: 'error', message: "Aviso: "+ 'La contraseña actual es incorrecta'})
            return;
        }

        if (pass1 == '') {
            showAlert({type: 'warning', message: "Aviso: "+ 'Escribe una contraseña nueva'})
            return;
        } 
        if (pass2 == '') {
            showAlert({type: 'warning', message: "Aviso: "+ 'Vuelve a escribir tu nueva contraseña'})
            return;
        } 

        if (pass1 != pass2) {
            showAlert({type: 'error', message: "Aviso: "+ 'Las contraseñas no coinciden'})
            return;
        } 

        if (pass1 === pass2 && password === Password) {

            enableSpinner(true)
            let data = {
                code : Codigo,
                password : pass1
            }

            let apiResponse = await apiClient.updatePartner(data);
            if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
                showAlert({type: 'success', message: apiResponse.message});
                document.getElementById("actuallypassword").value = '';
                document.getElementById("password1").value = '';
                document.getElementById("password2").value = '';
                enableSpinner(false);
                this.cargarDatos();
                return;
            }
            setTimeout(() => {
                enableSpinner(false);
            }, 100); 
        } 
    }

    eyeVisibility = async () => {
        const { typeVisibility } = this.state;
        this.setState({
            typeVisibility : !typeVisibility
        })
    }

    eyeVisibilitynew = async () => {
        const { typeVisibilitynew } = this.state;
        this.setState({
            typeVisibilitynew : !typeVisibilitynew
        })
    }

    eyeVisibilitynewrepeat = async () => {
        const { typeVisibilityrepeat } = this.state;
        this.setState({
            typeVisibilityrepeat : !typeVisibilityrepeat
        })
    }
    

    render() {
        const {history, sessionReducer} = this.props;
        const {Codigo,Nombre,Correo,typeVisibility, typeVisibilitynew, typeVisibilityrepeat} = this.state;
        // if(!sessionReducer){
        //     return <Redirect to="/"/>;
        // } else {
            return (
                <div className="content-fluid" style={{marginTop: 66}}>
                    {/* <Session history={history} view={VIEW_NAME.PROFILE_VIEW}/> */}
                    <NavBar/>
                    <div className="container mb-4">
                        <div className="row">
                            <div className="col margenMyProfile">
                                <div className="jumbotron">
                                    <h1 className="display-4 text-center">Mi perfil</h1>
                                </div>
                            </div>
                        </div>

                        <div className="row" style={{paddingRight: 0, marginBottom: 0, height: 300, maxHeight: 300, overflow: 'auto'}}>
                            
                            <div className="col-sm-12 col-md-6">
                                <div class="form-group" style={{marginBottom: '2px'}}> 
                                    <label for="full" class="control-label">Código del cliente</label>
                                    <input type="text" class="form-control" id="full" disabled="true" name="full_name" value={Codigo ? Codigo : ''} />
                                </div> 
                                <div class="form-group" style={{marginBottom: '2px'}}> 
                                    <label for="full_" class="control-label">Nombre</label>
                                    <input type="text" class="form-control" id="full_" disabled="true" value={Nombre ? Nombre : ''}/>
                                </div> 
                                <div class="form-group" style={{marginBottom: '2px'}}> 
                                    <label for="full_n" class="control-label">Correo</label>
                                    <input type="text" class="form-control" id="full_n" disabled="true" value={Correo ? Correo : ''}/>
                                </div> 
                            </div>

                            <div className="col-sm-12 col-md-6">
                                <div class="form-group" style={{marginBottom: '2px'}}> 
                                    <label for="full_na" class="control-label">Contraseña actual</label>
                                    <div className="input-group">                                        
                                        <input
                                            type={ typeVisibility === false ? 'text' : 'password' }
                                            className="form-control"
                                            name="actuallypassword"
                                            id="actuallypassword"
                                            autoComplete="off"
                                            placeholder="Escribe aqui tu contraseña actual"
                                        />
                                        <div className="input-group-prepend" style={{width: 40}}>
                                            <span className="input-group-text"  style={{background: ''}}
                                            onClick = {() => this.eyeVisibility()}><i className={typeVisibility === false ? 'fa fa-eye' : 'fa fa-eye-slash'}/></span>
                                        </div>
                                    </div>
                                </div> 
                                
                                <div class="form-group" style={{marginBottom: '2px'}}> 
                                    <label for="password1" class="control-label">Contraseña nueva</label>
                                    {/* <input type="password" class="form-control" id="password1" placeholder="Escribe aqui tu nueva contraseña" /> */}
                                    
                                    <div className="input-group">                                        
                                        <input
                                            type={ typeVisibilitynew === false ? 'text' : 'password' }
                                            className="form-control"
                                            name="password1"
                                            id="password1"
                                            autoComplete="off"
                                            placeholder="Escribe aqui tu nueva contraseña"
                                        />
                                        <div className="input-group-prepend" style={{width: 40}}>
                                            <span className="input-group-text"  style={{background: ''}}
                                            onClick = {() => this.eyeVisibilitynew()}><i className={typeVisibilitynew === false ? 'fa fa-eye' : 'fa fa-eye-slash'}/></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group" style={{marginBottom: '2px'}}> 
                                    <label for="password2" class="control-label">Confirma tu contraseña</label>
                                    {/* <input type="password" class="form-control" id="password2" placeholder="confirma tu contraseña" /> */}
                                    
                                    <div className="input-group">                                        
                                        <input
                                            type={ typeVisibilityrepeat === false ? 'text' : 'password' }
                                            className="form-control"
                                            name="password2"
                                            id="password2"
                                            autoComplete="off"
                                            placeholder="confirma aqui tu contraseña"
                                        />
                                        <div className="input-group-prepend" style={{width: 40}}>
                                            <span className="input-group-text"  style={{background: ''}}
                                            onClick = {() => this.eyeVisibilitynewrepeat()}><i className={typeVisibilityrepeat === false ? 'fa fa-eye' : 'fa fa-eye-slash'}/></span>
                                        </div>
                                    </div>
                                </div> 
                            </div>

                        </div>
                        <br></br>

                        <button type="button" class="btn btn-success float-right" data-toggle="modal" data-target=".bd-example-modal-lg" onClick={this.Actualizar} >Actualizar Perfil</button>
                        <br></br>
                    </div>
                </div>
            );
        // }
    }
}

const mapStateToProps = store => {
    return {
        sessionReducer: store.SessionReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
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
)(MyProfile);
