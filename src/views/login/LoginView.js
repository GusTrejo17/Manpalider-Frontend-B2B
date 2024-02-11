import React, {Component} from 'react';
import {DISPATCH_ID, SERVICE_RESPONSE, config, ROLES,VIEW_NAME, licence} from '../../libs/utils/Const';
import {connect} from 'react-redux';
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {TwoStepsVerificationModal,Session} from '../../components';
import { Redirect } from 'react-router';
import $ from 'jquery';
import './login.css';
import moment from 'moment';

let apiClient = ApiClient.getInstance();
const EMAIL_FORMAT_REGEX = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
const RUT_FORMAT_REGEX = /^([0-9])+\-([A-Za-z0-9])$/;

class LoginView extends Component {

    state = {
        partRegister: 1,
        validateTax: true,
        countries: [],
        states: [],
        cfdi:[],
        responseAPILogin:[],
        responseAPILoginSeller:[],
        responseAPILoginOUSR:[]
    };

    componentDidMount() {
        this.closeAction();
        this.closeActionRegister();
    }

    validateThirdPart = async () => {
        const {loginReducer, enableSpinner, setShoppingCart, notificationReducer: {showAlert}, shoppingCartReducer: {getShoppingCart}} = this.props;

        let shippingAddress = [];
        let billingAddress = [];
        let localShoppingCArt = [];
        //Validación de la direccion
        if (!loginReducer.billing.street) return showAlert({
            type: 'warning',
            message: 'El campo de calle y número estan vacíos',
            timeOut: 8000
        });
        if (!loginReducer.billing.suburb) return showAlert({
            type: 'warning',
            message: 'EL campo de colonia está vacío',
            timeOut: 8000
        });
        if (!loginReducer.billing.city) return showAlert({
            type: 'warning',
            message: 'EL campo de ciudad está vacío',
            timeOut: 8000
        });
        if (!loginReducer.billing.cp) return showAlert({
            type: 'warning',
            message: 'EL campo de código postal está vacío',
            timeOut: 8000
        });
        if (!loginReducer.billing.country) return showAlert({
            type: 'warning',
            message: 'EL campo de país está vacío',
            timeOut: 8000
        });
        if (!loginReducer.billing.state) return showAlert({
            type: 'warning',
            message: 'EL campo de estado está vacío',
            timeOut: 8000
        });

        if (loginReducer.addressOne.street) {
            if(this.state.validateTax){
                shippingAddress.push(loginReducer.addressOne);
                billingAddress.push(loginReducer.addressOne);
            }else{
                shippingAddress.push(loginReducer.addressOne);
                billingAddress.push(loginReducer.billing);
            }
        }

        let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');
        localShoppingCart = JSON.parse(localShoppingCart) || [];

        let register = {
            user: {
                name: loginReducer.name,
                email: loginReducer.user,
                rfc: loginReducer.rfc,
                cfdi: loginReducer.cfdi,
                phone: loginReducer.phone,
                phone2: loginReducer.phone2,
                password: loginReducer.password,
            },
            shipping: shippingAddress,
            billing: billingAddress,
            shoppingCart: localShoppingCart || [],
        };
        
        //console.log("Datos a enviar", register);
        enableSpinner(true);
        let response = await apiClient.register(register);
        enableSpinner(false);

        if (response.status == SERVICE_RESPONSE.ERROR) {
            showAlert({
                type: 'error',
                message: response.message,
                timeOut: 8000
            });
            return;
        }

        showAlert({
            type: 'success',
            message: response.message,
            timeOut: 8000
        });
        //modal.loginRegisterModal('hide');
        this.submit();
        //modal.loginModal('show');

        localStorage.setItem(config.general.localStorageNamed + 'shoppingCart', JSON.stringify([]));
        setShoppingCart([]);

    };

    validateSecondPart = async () => {
        const {loginReducer, enableSpinner, setShoppingCart, notificationReducer: {showAlert}, shoppingCartReducer: {getShoppingCart}} = this.props;

        let shippingAddress = [];
        let billingAddress = [];
        let localShoppingCArt = [];

        //Validación de la direccion
        if (!loginReducer.addressOne.street) return showAlert({
            type: 'warning',
            message: 'El campo de calle y número estan vacíos',
            timeOut: 8000
        });
        if (!loginReducer.addressOne.suburb) return showAlert({
            type: 'warning',
            message: 'EL campo de colonia está vacío',
            timeOut: 8000
        });
        if (!loginReducer.addressOne.city) return showAlert({
            type: 'warning',
            message: 'EL campo de ciudad está vacío',
            timeOut: 8000
        });
        if (!loginReducer.addressOne.cp) return showAlert({
            type: 'warning',
            message: 'EL campo de código postal está vacío',
            timeOut: 8000
        });
        if (!loginReducer.addressOne.country) return showAlert({
            type: 'warning',
            message: 'EL campo de país está vacío',
            timeOut: 8000
        });
        if (!loginReducer.addressOne.state) return showAlert({
            type: 'warning',
            message: 'EL campo de estado está vacío',
            timeOut: 8000
        });


        //Validacion del check
        if (loginReducer.addressOne.street) {
            if(this.state.validateTax){
                billingAddress.push(loginReducer.addressOne);
                shippingAddress.push(loginReducer.addressOne);
            }else{
                shippingAddress.push(loginReducer.addressOne);
            }
        }

        let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');
        localShoppingCart = JSON.parse(localShoppingCart) || [];

        let register = {
            user: {
                name: loginReducer.name,
                email: loginReducer.user,
                rfc: loginReducer.rfc,
                cfdi: loginReducer.cfdi,
                phone: loginReducer.phone,
                phone2: loginReducer.phone2,
                password: loginReducer.password,
            },
            shipping: shippingAddress,
            billing: billingAddress,
            shoppingCart: localShoppingCart || [],
        };
        
        if(this.state.validateTax){//Si se usa la misma dirección
            //console.log("Datos a enviar", register);
            enableSpinner(true);
            let response = await apiClient.register(register);
            enableSpinner(false);

            if (response.status == SERVICE_RESPONSE.ERROR) {
                showAlert({
                    type: 'error',
                    message: response.message,
                    timeOut: 8000
                });
                return;
            }

            showAlert({
                type: 'success',
                message: response.message,
                timeOut: 8000
            });
            enableSpinner(true);
            //modal.loginRegisterModal('hide');
            this.submit();
        }else{
            this.setState({
                partRegister: 3
            })
        }
    };

    validateFirstPart = async () => {
        const { loginReducer, enableSpinner, notificationReducer: {showAlert}} = this.props;

        if (!loginReducer.user) {
            return showAlert(
                {
                    type: 'warning',
                    message: 'El correo se encuentra vacío',
                    timeOut: 8000
                }
            );
        }

        if (!EMAIL_FORMAT_REGEX.test(loginReducer.user)) return showAlert({
            type: 'warning',
            message: 'Por favor, revisa el formato, Ejemplo: nombre@correo.com',
            timeOut: 8000
        });

        if (!loginReducer.name){
            return showAlert({
                type: 'warning', 
                message: 'El nombre se encuentra vacío', 
                timeOut: 8000
            });
        } 


        if (loginReducer.rfc && (loginReducer.rfc.length < 12 || loginReducer.rfc.length > 13)) return showAlert({
            type: 'warning',
            message: 'El RFC no tiene la longitud entre 12 y 13 caracteres',
            timeOut: 8000
        });

        if (!loginReducer.phone) return showAlert({
            type: 'warning',
            message: 'El teléfono se encuentra vacío',
            timeOut: 8000
        });

        if (!loginReducer.password) return showAlert({
            type: 'warning',
            message: 'La contraseña se encuentra vacía',
            timeOut: 8000
        });

        if (!loginReducer.validatePassword) return showAlert({
            type: 'warning',
            message: 'La validación de la contraseña se encuentra vacía',
            timeOut: 8000
        });

        if (!(loginReducer.password === loginReducer.validatePassword)) return showAlert({
            type: 'error',
            message: 'Las contraseñas no son iguales',
            timeOut: 8000
        });

        if (!loginReducer.cfdi) return showAlert({
            type: 'warning',
            message: 'Seleccione el uso de un CFDI',
            timeOut: 8000
        });
        
        //Definimos variables a enviar
        let register = {
            user: {
                name: loginReducer.name,
                email: loginReducer.user,
                rfc: loginReducer.rfc,
                cfdi: loginReducer.cfdi,
                phone: loginReducer.phone,
                phone2: loginReducer.phone2,
                password: loginReducer.password,
            }
        };
        //Iniciamos la validación
        enableSpinner(true);
        let response = await apiClient.validateUser(register);
        //console.log("Respuesta ", response);
        //Validamos la respuesta del Back
        if (response.status === SERVICE_RESPONSE.ERROR) {
            showAlert({
                type: 'error',
                message: response.message,
                timeOut: 8000
            });
            enableSpinner(false);
            return;
        }else{
            enableSpinner(false);

            this.setState({
                partRegister: 2
            })
        }
    };


    renderSecondPartRegister = () => {
        
        const {setAddress, setStreet, setSuburb, setCity, setCP, setCountry, setState, loginReducer} = this.props;
        const {countries, states} = this.state;
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="col-md-12">
                        <h4>Dirección de envío</h4>
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.road} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control form-control-lg text-left font-weight-light "
                            name="handel_street_register"
                            placeholder="Calle y número"
                            autoComplete={'new-street'}
                            value={loginReducer.addressOne.street}
                            onChange={(event) => setStreet(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.map} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control form-control-lg text-left font-weight-light "
                            name="handel_suburb_register"
                            placeholder="Colonia"
                            value={loginReducer.addressOne.suburb}
                            onChange={(event) => setSuburb(event.target.value)}
                            
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.city} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control form-control-lg text-left font-weight-light "
                            name="handel_city_register"
                            placeholder="Ciudad"
                            autoComplete={'new-register'}
                            value={loginReducer.addressOne.city}
                            onChange={(event) => setCity(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.envelope} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control form-control-lg text-left font-weight-light "
                            name="handel_cp_register"
                            placeholder="Código postal"
                            autoComplete={'new-cp_register'}
                            value={loginReducer.addressOne.cp}
                            onChange={(event) => setCP(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: '#136aa8'}}>
                                <i className={config.icons.globalAmericas} style={{color: config.navBar.iconModal}}></i>
                        </span>
                        </div>
                        <select id="cars" name="handel_country_register" autoComplete={'new_country_register'}
                                placeholder="País" value={loginReducer.addressOne.country}
                                className="form-control form-control-lg text-left font-weight-light "
                                onChange={(event) => {
                                    setCountry(event.target.value);
                                    setTimeout(() => {
                                        this.getStates()
                                    }, 250);
                                    setState('');
                                }}
                                >
                            <option value=''>Selecciona un país</option>
                            {countries.map(country => {
                                return <option value={country.Code} key={country.Code}>{country.Name}</option>
                            })}
                        </select>
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.shield} style={{color: config.navBar.iconModal}} /></span>
                        </div>
                        <select id="cars" name="handel_state_register" 
                            autoComplete={'state_register'}
                            placeholder="País" 
                            value={loginReducer.addressOne.state} 
                            className="form-control form-control-lg text-left font-weight-light "
                            onChange={(event) => setState(event.target.value)}>
                                <option value=''>Selecciona un estado</option>
                                {states.map(state => {
                                    return <option value={state.Code}  key={state.Code}>{state.Name}</option>
                                })}
                        </select>

                    </div>
                    <div className="input-group mb-md-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id = "direccionFact" onChange={this.handleCheck} defaultChecked={this.state.validateTax}/>
                            <label class="form-check-label" for="direccionFact">
                                <h5>Usar la dirección de envío también como dirección de facturación</h5>
                            </label>
                        </div>
                    </div>
                    <div className="input-group col-xs-4" style={{marginTop: 10}}>
                        <button
                            onClick={this.validateSecondPart}
                            className="btn btn-block btn-md font-weight-bolder mb-md-2 align-middle"
                            style={{
                                backgroundColor: '#136aa8',
                                color: config.navBar.iconModal,
                            }}>
                            <h4 className = "align-middle">{this.state.validateTax === true ? "Terminar y guardar" : "Registrar dirección de facturación"}</h4>                            
                        </button>
                    </div>
                    <div className="input-group col-xs-4" style={{marginTop: 10}}>
                        <button
                            onClick={() => {
                                this.setState({partRegister: 1})
                            }}
                            className="btn btn-block btn-md font-weight-bolder mb-md-2 align-middle"
                            style={{
                                backgroundColor: '#136aa8',
                                color: config.navBar.iconModal,
                            }}>
                            <h4 className = "align-middle">Regresar</h4>
                        </button>
                    </div>
                </div>
            </div>
        )
    };

    handleCheck = () => {
        this.setState({validateTax: !this.state.validateTax});
        /*if(!this.state.validateTax){
            //console.log("Is true visible");
            //console.log("jajajaja no is true is ",this.state.validateTax);
        }else{   
            //console.log("is false visible");
        }*/
    }

    renderThirdPartRegister = () => {
        const {setAddressBill, setStreetBill, setSuburbBill, setCityBill, setCPBill, setCountryBill, setStateBill, loginReducer} = this.props;
        const {countries, states} = this.state;
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="col-md-12">
                        <h4>Dirección de Facturación</h4>
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.road} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control form-control-lg text-left font-weight-light "
                            name="handel_street_register"
                            placeholder="Calle y número"
                            autoComplete={'new-street'}
                            value={loginReducer.billing.street}
                            onChange={(event) => setStreetBill(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.map} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control form-control-lg text-left font-weight-light "
                            name="handel_suburb_register"
                            placeholder="Colonia"
                            value={loginReducer.billing.suburb}
                            onChange={(event) => setSuburbBill(event.target.value)}
                            
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.city} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control form-control-lg text-left font-weight-light "
                            name="handel_city_register"
                            placeholder="Ciudad"
                            autoComplete={'new-register'}
                            value={loginReducer.billing.city}
                            onChange={(event) => setCityBill(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.envelope} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control form-control-lg text-left font-weight-light "
                            name="handel_cp_register"
                            placeholder="Código postal"
                            autoComplete={'new-cp_register'}
                            value={loginReducer.billing.cp}
                            onChange={(event) => setCPBill(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: '#136aa8'}}>
                                <i className={config.icons.globalAmericas} style={{color: config.navBar.iconModal}}></i>
                        </span>
                        </div>
                        <select id="cars" name="handel_country_register" autoComplete={'new_country_register'}
                                placeholder="País" value={loginReducer.billing.country}
                                className="form-control form-control-lg text-left font-weight-light "
                                onChange={(event) => {
                                    setCountryBill(event.target.value);
                                    setTimeout(() => {
                                        this.getStates()
                                    }, 250);
                                    setStateBill('');
                                }}
                                >
                            <option value=''>Selecciona un país</option>
                            {countries.map(country => {
                                return <option value={country.Code} key={country.Code}>{country.Name}</option>
                            })}
                        </select>

                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.shield} style={{color: config.navBar.iconModal}} /></span>
                        </div>
                        <select id="cars" name="handel_state_register" 
                            autoComplete={'state_register'}
                            placeholder="País" 
                            value={loginReducer.billing.state} 
                            className="form-control form-control-lg text-left font-weight-light "
                            onChange={(event) => setStateBill(event.target.value)}
                            >
                                <option value=''>Selecciona un estado</option>
                                {states.map(state => {
                                    return <option value={state.Code}  key={state.Code}>{state.Name}</option>
                                })}
                        </select>

                    </div>
                    <div className="input-group col-xs-4" style={{marginTop: 10}}>
                        <button
                            onClick={this.validateThirdPart}
                            className="btn btn-block btn-md font-weight-bolder mb-md-2 align-middle"
                            style={{
                                backgroundColor: '#136aa8',
                                color: config.navBar.iconModal,
                            }}>
                            <h4 className = "align-middle">Terminar</h4>
                        </button>
                    </div>
                    <div className="input-group col-xs-4" style={{marginTop: 10}}>
                        <button
                            onClick={() => {
                                this.setState({partRegister: 2})
                            }}
                            className="btn btn-block btn-md font-weight-bolder mb-md-2 align-middle"
                            style={{
                                backgroundColor: '#136aa8',
                                color: config.navBar.iconModal,
                            }}>
                            <h4 className = "align-middle">Regresar</h4>
                        </button>
                    </div>
                </div>
            </div>
        )
    };

    closeActionRegister = async () => {
        const {
            cleanLoginReducer
        } = this.props;
        let component = this;
        
        //$('#loginRegisterModal').on('show.bs.modal', async function () {
            //console.log("cerrar registro");
            cleanLoginReducer();
            component.setState({
                partRegister: 1,
                countries: [],
                states: []
            });
            await component.getRegisterInfo();
        //});
    };

    getRegisterInfo = async () => {
        //console.log("Rgistro dos");
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;

        enableSpinner(true);
        let response = await apiClient.getCountries();
        let responseCFDI = await apiClient.getCFDI();
        //console.log("GetCFDI",responseCFDI);
        //console.log("Lo del conutri", response);
        enableSpinner(false);

        this.setState({
            partRegister: 1,
            countries: response.data || [],
            cfdi: responseCFDI.data || [],
        })
    };

    getStates = async () => {
        const {loginReducer: {addressOne: {country}}, enableSpinner, notificationReducer: {showAlert}} = this.props;

        enableSpinner(true);
        let response = await apiClient.getStates(country);

        this.setState({
            states: response.data || [],
        })

        setTimeout(() => {
            enableSpinner(false);
        }, 250)
    };
/*Datos del usaurio*/
    renderFirstPartRegister = () => {
        const {setUser, setName, setRfc, setCfdi, setPhone, setPhone2, setPassword, setValidatePassword, loginReducer} = this.props;
        const {cfdi} = this.state;
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="input-group">
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.user} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control form-control-lg text-left font-weight-light "
                            name="handel_user_register"
                            placeholder="Correo electrónico"
                            autoComplete={'new_email_regiser'}
                            value={loginReducer.user}
                            onChange={(event) => setUser(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.signature} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control form-control-lg text-left font-weight-light "
                            name="handel_name_register"
                            placeholder="Nombre Completo"
                            value={loginReducer.name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.building} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control form-control-lg text-left font-weight-light "
                            name="handel_password"
                            placeholder="RFC (opcional)"
                            value={loginReducer.rfc}
                            onChange={(event) => setRfc(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text" style={{background: '#136aa8'}}><i className={config.icons.cfdi} style={{color: config.navBar.iconModal}}></i></span>
                        </div>
                        <select id="cars" name="handel_country_register" autoComplete={'new_country_register'}
                                placeholder="País" value={loginReducer.cfdi}
                                className="form-control form-control-lg text-left font-weight-light "
                                onChange={(event) => {
                                    setCfdi(event.target.value);
                                }}
                                >
                                <option value="">Selecciona el uso de su CFDI</option>
                            {cfdi.map(cdfi => {
                                return <option value={cdfi.CfdiCode} key={cdfi.CfdiCode}>{cdfi.CfdiCode +" - "+ cdfi.CfdiName}</option>
                            })}
                        </select>
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.phone} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control form-control-lg text-left font-weight-light "
                            name="handel_password"
                            placeholder="Teléfono"
                            value={loginReducer.phone}
                            onChange={(event) => setPhone(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.phone} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control form-control-lg text-left font-weight-light "
                            name="handel_password"
                            placeholder="Teléfono 2 (opcional)"
                            value={loginReducer.phone2}
                            onChange={(event) => setPhone2(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.password} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="password"
                            className="form-control form-control-lg text-left font-weight-light "
                            name="handel_password_register"
                            placeholder="Contraseña"
                            value={loginReducer.password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: '#136aa8'}}><i className={config.icons.password} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="password"
                            className="form-control form-control-lg text-left font-weight-light "
                            name="handel_password"
                            placeholder="Validar Contraseña"
                            value={loginReducer.validatePassword}
                            onChange={(event) => setValidatePassword(event.target.value)}
                        />
                    </div>
                    <div className="input-group col-xs-4" style={{marginTop: 10}}>
                        <button
                            onClick={this.validateFirstPart}
                            className="btn btn-block btn-md font-weight-bolder mb-md-2 align-middle"
                            style={{
                                backgroundColor: '#136aa8',
                                color: config.navBar.iconModal,
                            }}>
                            <h4 className = "align-middle">Continuar</h4>
                        </button>
                    </div>
                </div>
            </div>
        )
    };

    submit = async () => {        
        const {
            loginReducer, 
            enableSpinner,
            notificationReducer: {showAlert}
        } = this.props;

        let today = moment().format('YYYY-MM-DD');

        if(today > licence){
            showAlert({type: 'error', message: 'Error de conexión -(1548913-C SP11MV1)'});
            return;
        }

        let user = {
            email: loginReducer.user,
            password: loginReducer.password,
        };

        enableSpinner(true);
        let response = await apiClient.login(user);
        
        let responseSeller = await apiClient.loginSeller(user);
        let responseOUSR = await apiClient.loginousr(user);
        enableSpinner(false);

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            if(response.data){
                // console.log('con<',response.data);
                // Descomentar el modal --- Quitar el this.startSession(); y descomentar el if else para activar nuevamente la verificacion de dos pasos
                // $('#TwoStepsModal').modal('show');
                this.setState({
                    responseAPILogin : response
                });
                
                this.startSession();
                // if(response.data.sendEmail === 'Y'){
                //     enableSpinner(true);
                //     let responseMail = await apiClient.loginTwoStepsMail(user);
                //     enableSpinner(false);

                //     if (responseMail.status !== SERVICE_RESPONSE.SUCCESS) {
                //         showAlert({type: 'error', message: ' Ocurrió un error al enviar el código de confirmación por correo ' , timeOut: 2500});
                //         return;
                //     }
                // } else {
                //     showAlert({type: 'warning', message: ' Favor de revisar su correo, se envió un correo hace menos de 10 minutos con el código de confirmación ' , timeOut: 3500});
                //     return;
                // }
            } else {
                showAlert({type: 'error', message: ' Ocurrió un error al intentar ingresar con su cuenta ' , timeOut: 8000});
                return;
            }
        }else if (responseSeller.status === SERVICE_RESPONSE.SUCCESS) {
            if(responseSeller.data){
                this.setState({
                    responseAPILoginSeller : responseSeller
                });
                this.startSession();
            } else {
                showAlert({type: 'error', message: ' Ocurrió un error al intentar ingresar con su cuenta ' , timeOut: 8000});
                return;
            }
        }else if (responseOUSR.status === SERVICE_RESPONSE.SUCCESS) {
            if(responseOUSR.data){
                this.setState({
                    responseAPILoginOUSR : responseOUSR
                });
                this.startSession();
            } else {
                showAlert({type: 'error', message: ' Ocurrió un error al intentar ingresar con su cuenta ' , timeOut: 8000});
                return;
            }
        }
        else{
            showAlert({type: 'error', message: response.message});
            enableSpinner(false);
        }
    };

    startSession = async () => {
        const {
            loginReducer, 
            enableSpinner, 
            notificationReducer: {showAlert}, 
            setToken, 
            setUserSession, 
            setRememberUser, 
            setRole,
            configReducer,
            shoppingCartReducer
        } = this.props;

        const { responseAPILogin, responseAPILoginSeller, responseAPILoginOUSR } = this.state;
        let vendedor = {
            salesPerson: "0",
            firstName: "Vendedor",
            lastName: "Desde cliente"
        };

        let response = responseAPILogin || '';
        let responseSeller = responseAPILoginSeller || '';
        let responseOUSR = responseAPILoginOUSR || '';
        let remember = true;//$("#remember").prop('checked');

        if(response != ''){
            let user = response.data.user;
            let token = response.data.token;
            let limit = user.Balance-user.CreditLine;
            let partner = {empID:"1",firstName:"",lastName:"",salesPrson:2,password:"",email:"",U_FMB_Handel_Perfil:"0"}
            // remember = true;
            // console.log('con<<<<',user.CardName, user.Balance, user.OrdersBal, user.CreditLine, limit);
            showAlert({type: 'success', message: ' Bienvenido de nuevo ' + user.CardName, timeOut: 8000});
            // if(limit >0){
            //     // showAlert({type: 'error', message: ' Tu límite de crédito excedido en: $' + limit, timeOut: 20000});
            //     showAlert({type: 'error', message: ' Tu límite de crédito se ha excedido. Contacte a su gestor de cobranza.', timeOut: 20000});
            // }
            localStorage.setItem(config.general.localStorageNamed + 'Token', JSON.stringify(token));
            localStorage.setItem(config.general.localStorageNamed + 'Role', ROLES.CLIENT);
            localStorage.setItem(config.general.localStorageNamed + 'PartnerUser',JSON.stringify(partner));
            localStorage.setItem(config.general.localStorageNamed + 'CurrentUser', JSON.stringify(user));
            localStorage.setItem(config.general.localStorageNamed + 'Vendor', JSON.stringify(vendedor));   
            localStorage.setItem(config.general.localStorageNamed + 'RememberUser', remember );

            setRole(ROLES.CLIENT);
            setToken(token);
            setUserSession(user);
            setRememberUser(remember);

            let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');
            
            //let responsesd = await apiClient.updateShoppingCartLocal(JSON.parse(localShoppingCart));
            
            let today = moment().format('YYYY-MM-DD');
            let time = moment().format('h:mm:ss a');
            let data = {
                CardCode : user.CardCode,
                CardName : user.CardName,
                Date : today, 
                Time : time,
                TypeUser : 'Cliente',
                Email : user.U_FMB_Handel_Email,
                Business : 'Diasa',
                Session : 1
            }
            // await apiClient.sendData(data);
            enableSpinner(false);

            setTimeout(()=> {
                shoppingCartReducer.getShoppingCart();
                // if(responsesd.data.value > 0){
                    // configReducer.history.goShoppingCart();
                // }else{
                    configReducer.history.goHome();
                // }
            }, 250);
            return;
        }else if(responseSeller != ''){
            let user = responseSeller.data.user;
            let token = responseSeller.data.token;
            showAlert({type: 'success', message: ' Bienvenido de nuevo ' + user.firstName +" "+ user.lastName, timeOut: 8000});
            
            localStorage.setItem(config.general.localStorageNamed + 'Token', JSON.stringify(token));
            localStorage.setItem(config.general.localStorageNamed + 'Role', ROLES.CLIENT);
            localStorage.setItem(config.general.localStorageNamed + 'PartnerUser', JSON.stringify(user));
            localStorage.setItem(config.general.localStorageNamed + 'RememberUser', remember );

            setToken(token);
            setUserSession(user);
            setRememberUser(remember);
            enableSpinner(false);

            let today = moment().format('YYYY-MM-DD');
            let time = moment().format('h:mm:ss a');
            let data = {
                CardCode : user.salesPrson,
                CardName : user.lastName + ' ' + user.firstName,
                Date : today, 
                Time : time,
                TypeUser : 'Vendedor',
                Email : user.email,
                Business : 'Diasa',
                Session : 1
            }
            // await apiClient.sendData(data);

            setTimeout(()=> {
                configReducer.history.goSelector();
            },50);
            
            return;
        }else if(responseOUSR != ''){
            let user = responseOUSR.data.user;
            let token = responseOUSR.data.token;
            let partner = {empID:"1",firstName:"Autorizador",lastName:"B2B",salesPrson:0,password:"",email:"",U_FMB_Handel_Perfil:5}
            showAlert({type: 'success', message: ' Bienvenido de nuevo ' + user.CardName, timeOut: 8000});
            localStorage.setItem(config.general.localStorageNamed + 'Token', JSON.stringify(token));
            localStorage.setItem(config.general.localStorageNamed + 'Role', ROLES.CLIENT);
            localStorage.setItem(config.general.localStorageNamed + 'PartnerUser',JSON.stringify(partner));
            localStorage.setItem(config.general.localStorageNamed + 'CurrentUser', JSON.stringify(user));
            localStorage.setItem(config.general.localStorageNamed + 'Vendor', JSON.stringify(vendedor));
            localStorage.setItem(config.general.localStorageNamed + 'RememberUser', remember );
            
            setRole(ROLES.CLIENT);
            setToken(token);
            setUserSession(user);
            setRememberUser(remember);

            let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');
            let responsesd = await apiClient.updateShoppingCartLocal(JSON.parse(localShoppingCart));


            enableSpinner(false);
            setTimeout(()=> {
                configReducer.history.goAutorizaciones();
            },50);

            return;
        }
    }

    closeAction = () => {
        const {cleanLoginReducer} = this.props;
        //$('#loginModal').on('show.bs.modal', function () {
            //console.log("cerrar registro");
            cleanLoginReducer();
        //});
    };

    forgottenPassword = async () => {

        const {
            loginReducer, 
            enableSpinner, 
            notificationReducer: {showAlert}, 
        } = this.props;

        if(!loginReducer.user || loginReducer.user === '' || !(loginReducer.user.includes('@'))){
            showAlert({type: 'warning', message: ' Ingresa un correo válido para obtener tu contraseña ', timeOut: 8000});
            return;
        }

        let user = {
            email: loginReducer.user,
            password: loginReducer.password,
            forgottenPassword : 'YES',
        };

        enableSpinner(true);
        let responseMail = await apiClient.loginTwoStepsMail(user);
        enableSpinner(false);

        if (responseMail.status === SERVICE_RESPONSE.SUCCESS) {
            if(responseMail.data){
                if(responseMail.data.response === 'N'){
                    showAlert({type: 'warning', message: ' Favor de revisar su correo, la contraseña ya fue enviada a su correo hace menos de 10 minutos ', timeOut: 8000});
                    return;
                } else {
                    showAlert({type: 'success', message: ' La contraseña ha sido enviada a su correo ', timeOut: 8000});
                    return;
                }
            }            
        } else {
            showAlert({type: 'error', message: responseMail.message || ' Ocurrió un error al obtener la contraseña ', timeOut: 8000});
            return;
        }     
    }
    forgottenPassword2 = async () => {

        const {
            loginReducer, 
            enableSpinner, 
            notificationReducer: {showAlert}, 
        } = this.props;

        if(!loginReducer.user || loginReducer.user === '' || !(loginReducer.user.includes('@'))){
            showAlert({type: 'warning', message: ' Ingresa un correo válido para obtener tu contraseña ', timeOut: 2250});
            return;
        }

        let user = {
            email: loginReducer.user,
            password: loginReducer.password,
            forgottenPassword : 'YES',
        };

        enableSpinner(true);
        let responseMail = await apiClient.loginTwoStepsMail(user);
        enableSpinner(false);

        if (responseMail.status === SERVICE_RESPONSE.SUCCESS) {
            if(responseMail.data){
                if(responseMail.data.response === 'N'){
                    showAlert({type: 'warning', message: ' Favor de revisar su correo, la contraseña ya fue enviada a su correo hace menos de 10 minutos ', timeOut: 3500});
                    return;
                } else {
                    showAlert({type: 'success', message: ' La contraseña ha sido enviada a su correo ', timeOut: 2500});
                    return;
                }
            }            
        } else {
            showAlert({type: 'error', message: responseMail.message || ' Ocurrió un error al obtener la contraseña ', timeOut: 2500});
            return;
        }     
    }


    render() {
        const {setUser, setPassword, loginReducer, shoppingCartReducer, history} = this.props;
        const {partRegister} = this.state;
        if(!shoppingCartReducer || !shoppingCartReducer.getShoppingCart){
            return <Redirect to="/"/>;
        } else {
            return (
                <>
                    {false?
                        <div classNameName="content-fluid" style={{backgroundColor:config.Back.backgroundColor ,  paddingLeft:0, paddingRight:0}} >
                            {/* Div superior simple*/}
                            <div className=" logosLogin">
                                <nav id="navFirst" className="​navbar navbar-expand-sm " style={{ border: "none"}} >
                                    {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#NavBarLogin">
                                        <span className="navbar-toggler-icon"></span>
                                    </button>
                                    <div className="navbar-collapse collapse" id = "NavBarLogin"> */}
                                        <ul className="navbar-nav nav-fill">
                                            <li className="nav-item  logoEmpresa">
                                                <i className={config.icons.menu} style={{ color: config.navBar.iconColor, fontsize: 15}} />
                                                <a href="/" className="navbar-brand" onClick={() => { }}>
                                                    <img className = "img-fluid" src={config.navBar.icon} style={{maxWidth: 250, maxHeight: 95}} alt={'logo-empresa'}/>
                                                </a>
                                            </li>
                                            <li className="nav-item segundaImg">
                                                    <img className = "navbar-brand img-fluid" src={config.navBar.icono2Login} style={{maxWidth: 250, maxHeight: 95}} alt={'logo-empresa'}/>
                                            </li>
                                        </ul>
                                    {/* </div> */}
                                </nav>
                            </div>    
                        
                            <div className="row justify-content-center contenidoLogin" style = {{position: "relative", justifyContent: "center", alignItems: "center"}}>
                                {/* Modal de verificación */}
                                <TwoStepsVerificationModal startSession = {this.startSession}/>
                                {/* Columna de mensaje*/}
                                <div className="col-lg-6 mt-md-4">
                                    <div className="row">
                                        <div className="descripcion col-md-12">
                                            <p className = 'titulo col-md-10 text-white text-left text-decoration-underline mb-md-2 mt-md-2'>Crea tu cuenta en <strong>diasa.net</strong></p>
                                            <p className = 'subtitulo font-weight-bold text-white text-left mt-md-4'>Beneficios de registrarte</p>
                                            <ul className="text-white">
                                                <li className="text-white">
                                                    Obtén descuentos especiales
                                                </li>
                                                <li className="text-white">
                                                    Compra más rápido en tus siguientes visitas
                                                </li>
                                                <li className="text-white">
                                                    Revisa el historial de tus compras
                                                </li>
                                                <li className="text-white">
                                                    Contáctanos para proporcionar tu cuenta
                                                </li>
                                                {config.modules.points &&
                                                    <li className="text-white">
                                                        Revisa y canjea tus puntos
                                                    </li>
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Columna de Login/Registro*/}
                                <div className="col-lg-4 login justify-content-center" style={{ justifyContent: "center", alignItems: "center"}}>
                                    <div className="card border-light text-center mt-md-4 mb-md-4">
                                        <div className="card-header">
                                            <ul className="nav nav-tabs card-header-tabs justify-content-center">
                                                {/* <li className="nav-item">
                                                    <a className="nav-link font-weight-bolder text-dark" data-toggle="tab" href="#registro"><h3>Regístrate</h3></a>
                                                </li> */}
                                                <li className="nav-item">
                                                    <a className="nav-link font-weight-bolder text-dark" data-toggle="tab" href="#iniciar"><h3>Inicia Sesión</h3></a>
                                                </li>                                    
                                            </ul>
                                        </div>
                                        <div className="tab-content ">
                                            {/* Pestaña de inicio de sesión */}
                                            <div className="tab-pane fade show active card-body" id = "iniciar">
                                                {/* <h5 className="card-title">Ingresa con:</h5>
                                                <p className="card-text social-btn">
                                                    <a href="#" className="btn btn-secondary"><i className="fa fa-facebook"></i>&nbsp; Facebook</a>
                                                    <a href="#" className="ml-md-2 btn btn-danger"><i className="fa fa-google"></i>&nbsp; Google</a>
                                                </p> */}
                                                <div className="row justify-content-center">
                                                    <div className="col-md-10">
                                                        <div className="input-group mb-md-3 mt-md-1">
                                                            <div className="input-group-prepend" onClick={() => {}}>
                                                                <span className="input-group-text" style={{background: '#136aa8'}}><i className={config.icons.user} style={{color: config.navBar.iconModal}}/></span>
                                                            </div>
                                                            <input
                                                                id={'handel_user'}
                                                                type="text"
                                                                className="form-control form-control-lg text-left font-weight-light "
                                                                name="new_email_regiser"
                                                                placeholder="Usuario"
                                                                autoComplete={'new-user'}
                                                                value={loginReducer.user}
                                                                onChange={(event) => setUser(event.target.value)}
                                                            />
                                                        </div>
                                                        <div className="input-group mb-md-4">
                                                            <div className="input-group-prepend" onClick={() => {}}>
                                                                <span className="input-group-text" style={{background: '#136aa8'}}><i className={config.icons.password} style={{color: config.navBar.iconModal}}/></span>
                                                            </div>
                                                            <input
                                                                id={'handel_password'}
                                                                type="password"
                                                                className="form-control form-control-lg text-left font-weight-normal "
                                                                name="handel_password"
                                                                placeholder="Contraseña"
                                                                autoComplete={'new-password'}
                                                                onKeyDown={event => event.keyCode === 13 && this.submit()}
                                                                value={loginReducer.password}
                                                                onChange={(event) => setPassword(event.target.value)}
                                                            />
                                                        </div>
                                                        {/* <div className="input-group mb-md-4">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="checkbox" name="remember" id="remember"/>
                                                                <label htmlFor='remember' className="form-check-label" for="remember">
                                                                    <h5 style={{color: "#808080", fontSize:14}}>Recordar mi sesión</h5>
                                                                </label>
                                                            </div>
                                                        </div> */}
                                                        <div style={{textAlign: "center"}}>
                                                            <button
                                                                onClick={this.submit}
                                                                className="btn btn-block btn-md font-weight-bolder mb-md-2 align-middle"
                                                                style={{
                                                                    backgroundColor: '#136aa8',
                                                                    color: config.navBar.iconModal,
                                                                }}>
                                                                <h4 className = "align-middle">ENTRAR</h4>
                                                            </button>
                                                        </div>
                                                        {/* <div className="text-center mt-md-2">
                                                    <span className = "font-weight-normal" style={{cursor:"pointer"}} onClick = {this.forgottenPassword}>
                                                        ¿Olvidaste tu contraseña?
                                                    </span>
                                                </div> */}
                                                    </div>
                                                </div>
                                                {/* <div style={{textAlign: "center"}}>
                                                        <label style={{textAlign: "center"}}>¿Aún no tienes cuenta?<br></br></label>                                        
                                                        <a data-toggle="tab" href="#registro" style={{color: 'rgb(13, 98, 168)', cursor: 'pointer', textAlign: "center"}}>Registrarse</a>
                                                </div> */}
                                            </div>
                                            
                                            {/* Pestaña de registro */}
                                            {/* <div className="tab-pane fade show active card-body" id = "registro"> */}
                                                {/* <h5 className="card-title">Registrate con:</h5>
                                                <p className="card-text social-btn">
                                                    <a href="#" className="btn btn-secondary"><i className="fa fa-facebook"></i>&nbsp; Facebook</a>
                                                    <a href="#" className="ml-md-2 btn btn-danger"><i className="fa fa-google"></i>&nbsp; Google</a>
                                                </p> */}
                                                {/* <div className="row justify-content-center">
                                                    <div className="col-md-12">
                                                        {partRegister === 1 ? this.renderFirstPartRegister() : partRegister === 2 ? this.renderSecondPartRegister(): this.renderThirdPartRegister()}
                                                    </div>
                                                </div> */}
                                            {/* </div>                             */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 borderBotton"></div>
                        </div>
                        :
                        <div className='content-fluid' style={{backgroundColor: config.Back.backgroundColor ,  paddingLeft:0, paddingRight:0}} >
                            <div className='row justify-content-center' style = {{alignItems: "center", height: "100vh"}}>
                                {/* <img className='im-fluid' src = {require('../../images/backgroundLogin.jpg')} style={{position: "fixed"}} alt='background'/> */}
                                <div className='col-lg-5 text-center'>
                                    <img className = "img-fluid" onClick={() =>history.push('/')} src = {config.navBar.icon} style = {{maxWidth: 280, maxHeight: 130, cursor: "pointer"}} alt = {'logo-empresa'}/>
                                </div>
                                <div className='col-lg-7'>
                                    <div className='position-lg-fixed' style={{background: config.login.background, height: "100%", width: "100%",  top:"0"}}/>
                                    <div className='row'>
                                        <div className='col-12 text-center mb-3'>
                                            <h2 style={{fontWeight: "bolder", color: config.login.textColor}}>¡B I E N V E N I D O!</h2>
                                            <label style={{color: config.login.textColor}}>Por favor ingrese su información:</label>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-3 col-1'/>
                                        <div className='col-lg-6 col-10'>
                                            <div className="input-group mb-3" style={{borderRadius: "20px", boxShadow: "0px 0px 10px #3d3a3a33"}}>
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" style={{background: "white", borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px", borderRight: "none"}}><i className={config.icons.user + " pl-2 pr-2"} style={{color: config.login.colorIcons}}/></span>
                                                </div>
                                                <input
                                                    id={'handel_user'}
                                                    style={{background: "white", borderTopRightRadius: "20px", borderBottomRightRadius: "20px", borderLeft: "none"}}
                                                    type="text"
                                                    className="form-control form-control-lg text-left font-weight-light "
                                                    name="new_email_regiser"
                                                    placeholder="Usuario"
                                                    autoComplete={'new-user'}
                                                    value={loginReducer.user}
                                                    onChange={(event) => setUser(event.target.value)}
                                                />
                                            </div>
                                            <div className="input-group mb-3" style={{borderRadius: "20px", boxShadow: "0px 0px 10px #3d3a3a33"}}>
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" style={{background: "white", borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px", borderRight: "none"}}><i className={config.icons.password + " pl-2 pr-2"} style={{color: config.login.colorIcons}}/></span>
                                                </div>
                                                <input
                                                    id={'handel_password'}
                                                    style={{background: "white", borderTopRightRadius: "20px", borderBottomRightRadius: "20px", borderLeft: "none"}}
                                                    type="password"
                                                    className="form-control form-control-lg text-left font-weight-normal "
                                                    name="handel_password"
                                                    placeholder="Contraseña"
                                                    autoComplete={'new-password'}
                                                    onKeyDown={event => event.keyCode === 13 && this.submit()}
                                                    value={loginReducer.password}
                                                    onChange={(event) => setPassword(event.target.value)}
                                                />
                                            </div>
                                            <div className='row'>
                                                <button
                                                    onClick={this.submit}
                                                    className="btn btn-block btn-md font-weight-bolder mb-md-2 align-middle mt-4"
                                                    style={{
                                                        backgroundColor: config.login.buttons,
                                                        color: config.navBar.iconModal,
                                                        maxWidth: "200px",
                                                        borderRadius: "20px"
                                                    }}>
                                                    <h4 className = "align-middle" style={{fontWeight: "bolder"}}>INGRESAR</h4>
                                                </button>
                                            </div>
                                            <div className="text-center mt-md-2">
                                                    <span className = "font-weight-normal"  style={{cursor:'pointer', color: config.login.textColor}} onClick = {this.forgottenPassword}>
                                                        ¿Olvidaste tu contraseña?
                                                    </span>
                                                </div>
                                            {/* <div className="text-center mt-md-2">
                                                    <span className = "font-weight-normal" style={{color: "#808080"}} onClick = {this.forgottenPassword}>
                                                        ¿Olvidaste tu contraseña?
                                                    </span>
                                                </div> */}
                                            {/* <div className='row'>
                                                <label
                                                    className="mb-md-2 align-middle mt-4"
                                                    style={{
                                                        backgroundColor:'white',
                                                        cursor:'pointer',
                                                        color: 'black',
                                                    }}>
                                                    <h4 className = "align-middle" style={{fontWeight: "25"}}>Solicitud de Acceso</h4>
                                                </label>
                                            </div> */}
                                            {/* <div className='row'>
                                                <label
                                                    className="mb-md-2 align-middle mt-4"
                                                    style={{
                                                        backgroundColor:'white',
                                                        cursor:'pointer',
                                                        color: 'black',
                                                    }}>
                                                    <h4 className = "align-middle" style={{fontWeight: "25"}}>Olvidé mi contraseña</h4>
                                                </label>
                                            </div> */}
                                        </div>
                                        <div className='col-lg-3 col-1'/>
                                        <div className='row'>
                                            <div className='col-12 mt-4'>
                                                {/* <a className="input-group-text d-inline-block" style={{background: config.login.backIcons, borderRadius: "20px", height: "34px", border: config.login.borderIcons}}  href="https://wa.me/message/Z5RDIDIEZBJ2I1">
                                                    <i className="fa fa-whatsapp" style={{color: config.login.colorIcons}}/>
                                                </a> */}
                                                <a className="input-group-text d-inline-block mr-4 ml-4" style={{background: config.login.backIcons, borderRadius: "20px", height: "34px", border: config.login.borderIcons}} href= {config.socialMedia.facebook}>
                                                    <i className="fa fa-facebook" style={{color: config.login.colorIcons}}/>
                                                </a>
                                                <a className="input-group-text d-inline-block" style={{background: config.login.backIcons, borderRadius: "20px", height: "34px", border: config.login.borderIcons}}  href={config.socialMedia.instagram}>
                                                    <i className="fa fa-linkedin" style={{color: config.login.colorIcons}}/>
                                                </a>
                                            </div>
                                        </div>
                                        <div className='col-12 text-center mb-3'style={{marginTop: '20px', color: config.login.textColor}}>
                                            <label>Si tienes dudas o problemas llámanos al </label> {config.socialMedia.numberPhone}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </>
            );
        }
    }
}

const mapStateToProps = store => {
    return {
        loginReducer: store.LoginReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
        shoppingCartReducer: store.ShoppingCartReducer
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setUser: value => dispatch({type: DISPATCH_ID.LOGIN_SET_USER, value}),
        setPassword: value => dispatch({type: DISPATCH_ID.LOGIN_SET_PASSWORD, value}),
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        setRole: value => dispatch({type: DISPATCH_ID.SESSION_SET_ROLE, value}),
        setToken: value => dispatch({type: DISPATCH_ID.SESSION_SET_TOKEN, value}),
        setRememberUser: value =>  dispatch({type: DISPATCH_ID.SESSION_SET_REMEMBER_USER, value}),
        setUserSession: value => dispatch({type: DISPATCH_ID.SESSION_SET_USER, value}),
        cleanLoginReducer: value => dispatch({type: DISPATCH_ID.LOGIN_CLEAN_REDUCER, value}),
        setName: value => dispatch({type: DISPATCH_ID.LOGIN_SET_NAME, value}),
        setRfc: value => dispatch({type: DISPATCH_ID.LOGIN_SET_RFC, value}),
        setCfdi: value => dispatch({type: DISPATCH_ID.LOGIN_SET_CFDI, value}),
        setPhone: value => dispatch({type: DISPATCH_ID.LOGIN_SET_PHONE, value}),
        setPhone2: value => dispatch({type: DISPATCH_ID.LOGIN_SET_PHONE_2, value}),
        setValidatePassword: value => dispatch({type: DISPATCH_ID.LOGIN_SET_VALIDATE_PASSWORD, value}),
        //Datos de la dirección
        setAddress: value => dispatch({type: DISPATCH_ID.LOGIN_SET_ADDRESS, value}),
        setStreet: value => dispatch({type: DISPATCH_ID.LOGIN_SET_STREET, value}),
        setSuburb: value => dispatch({type: DISPATCH_ID.LOGIN_SET_SUBURB, value}),
        setCity: value => dispatch({type: DISPATCH_ID.LOGIN_SET_CITY, value}),
        setCP: value => dispatch({type: DISPATCH_ID.LOGIN_SET_CP, value}),
        setCountry: value => dispatch({type: DISPATCH_ID.LOGIN_SET_COUNTRY, value}),
        setState: value => dispatch({type: DISPATCH_ID.LOGIN_SET_STATE, value}),
        //Datos de la factura
        setAddressBill: value => dispatch({type: DISPATCH_ID.LOGIN_SET_ADDRESS_BILL, value}),
        setStreetBill: value => dispatch({type: DISPATCH_ID.LOGIN_SET_STREET_BILL, value}),
        setSuburbBill: value => dispatch({type: DISPATCH_ID.LOGIN_SET_SUBURB_BILL, value}),
        setCityBill: value => dispatch({type: DISPATCH_ID.LOGIN_SET_CITY_BILL, value}),
        setCPBill: value => dispatch({type: DISPATCH_ID.LOGIN_SET_CP_BILL, value}),
        setCountryBill: value => dispatch({type: DISPATCH_ID.LOGIN_SET_COUNTRY_BILL, value}),
        setStateBill: value => dispatch({type: DISPATCH_ID.LOGIN_SET_STATE_BILL, value}),
        setShoppingCart: value => dispatch({type: DISPATCH_ID.SHOPPING_CART_SAVE_CART, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoginView);