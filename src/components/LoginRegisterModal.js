import React, {Component} from 'react';
import {DISPATCH_ID, SERVICE_RESPONSE, config, ROLES} from '../libs/utils/Const';
import {connect} from 'react-redux';
import {Modal} from "./index";
import $ from 'jquery';
import {ApiClient} from "../libs/apiClient/ApiClient";
// import Inputmask from "inputmask";

let modal = new Modal();
let apiClient = ApiClient.getInstance();
const EMAIL_FORMAT_REGEX = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
const RUT_FORMAT_REGEX = /^([0-9])+\-([A-Za-z0-9])$/;

class LoginRegisterModal extends Component {
    state = {
        partRegister: 1,
        validateTax: true,
        countries: [],
        states: [],
        cfdi:[]
    };

    componentDidMount() {
        this.closeAction();
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
        modal.loginRegisterModal('hide');
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
            modal.loginRegisterModal('hide');
            this.submit();
        }else{
            this.setState({
                partRegister: 3
            })
        }
    };

    submit = async () => {
        const {
            loginReducer, 
            configReducer, 
            enableSpinner, 
            notificationReducer: {showAlert}, 
            setToken, 
            setUserSession, 
            setRememberUser,
            setShoppingCart,
            setRole, 
            shoppingCartReducer: {getShoppingCart}
        } = this.props;


        let user = {
            email: loginReducer.user,
            password: loginReducer.password,
        };

        let checkOrder = await apiClient.getNotifyOrder();
        ////console.log("Valores del order",checkOrder);
        ////console.log("Dato del group",checkOrder.groupCodeDefault );
        
        // //console.log('con> se va', user);
        let response = await apiClient.login(user);
        // //console.log('con> regresa',response);
        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            let user = response.data.user;
            ////console.log('dataUser',user);
            let token = response.data.token;
            let remember = $("#remember").prop('checked');
            showAlert({type: 'success', message: ' Bienvenido de nuevo ' + user.CardName, timeOut: 8000});
            localStorage.setItem(config.general.localStorageNamed + 'Token', JSON.stringify(token));
            localStorage.setItem(config.general.localStorageNamed + 'Role', ROLES.CLIENT);
            localStorage.setItem(config.general.localStorageNamed + 'CurrentUser', JSON.stringify(user));
            localStorage.setItem(config.general.localStorageNamed + 'RememberUser', remember );


            setRole(ROLES.CLIENT);
            setToken(token);
            setUserSession(user);
            setRememberUser(remember);
            let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');

            let responsesd = await apiClient.updateShoppingCartLocal(JSON.parse(localShoppingCart));
            ////console.log('RespuestaCart',responsesd.data.value);
            enableSpinner(false);
            localStorage.removeItem(config.general.localStorageNamed + 'shoppingCart');

            if (response.status === SERVICE_RESPONSE.ERROR) {
                showAlert({type: 'error', message: response.message, timeOut: 8000});
                return;
            }

            // consultar el localstorage para ingresarlo a la base de datos 
            //y poder cargar todos los articulos ya sea de la base de datos como los que tiene en la session
            ////console.log('EntroModalLoguinCart',response);
            setTimeout(()=> {
                getShoppingCart();
                if(responsesd.data.value > 0){
                    configReducer.history.goShoppingCart();
                }else{
                    configReducer.history.goHome();
                }
            },50);

            modal.loginModal('hide');
            modal.itemDetails('hide');
            return;
        }else{
            showAlert({type: 'error', message: response.message});
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
        // //console.log("Respuesta ", response);
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
                            <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.road} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_street_register"
                            placeholder="Calle y número"
                            style={{textAlign: 'center', height: 30}}
                            autoComplete={'new-street'}
                            value={loginReducer.addressOne.street}
                            onChange={(event) => setStreet(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.map} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_suburb_register"
                            placeholder="Colonia"
                            style={{textAlign: 'center', height: 30}}
                            value={loginReducer.addressOne.suburb}
                            onChange={(event) => setSuburb(event.target.value)}
                            
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.city} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_city_register"
                            placeholder="Ciudad"
                            autoComplete={'new-register'}
                            style={{textAlign: 'center', height: 30}}
                            value={loginReducer.addressOne.city}
                            onChange={(event) => setCity(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.envelope} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_cp_register"
                            placeholder="Código postal"
                            autoComplete={'new-cp_register'}
                            style={{textAlign: 'center', height: 30}}
                            value={loginReducer.addressOne.cp}
                            onChange={(event) => setCP(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.iconBackground}}>
                                <i className={config.icons.globalAmericas} style={{color: config.navBar.iconModal}}></i>
                        </span>
                        </div>
                        <select id="cars" name="handel_country_register" autoComplete={'new_country_register'}
                                placeholder="País" value={loginReducer.addressOne.country}
                                className="form-control text-left"
                                onChange={(event) => {
                                    setCountry(event.target.value);
                                    setTimeout(() => {
                                        this.getStates()
                                    }, 100);
                                    setState('');
                                }}
                                style={{textAlign: 'center', height: 30, padding: 0}}>
                            <option value=''>Selecciona un país</option>
                            {countries.map(country => {
                                return <option value={country.Code} key={country.Code}>{country.Name}</option>
                            })}
                        </select>
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.shield} style={{color: config.navBar.iconModal}} /></span>
                        </div>
                        <select id="cars" name="handel_state_register" 
                            autoComplete={'state_register'}
                            placeholder="País" 
                            value={loginReducer.addressOne.state} 
                            className="form-control text-left"
                            onChange={(event) => setState(event.target.value)}
                            style={{textAlign: 'center', height: 30, padding: 0}}>
                                <option value=''>Selecciona un estado</option>
                                {states.map(state => {
                                    return <option value={state.Code}  key={state.Code}>{state.Name}</option>
                                })}
                        </select>

                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <input type="checkbox" onChange={this.handleCheck} defaultChecked={this.state.validateTax} style={{margin: 7}}/>
                        <span style={{ fontSize: 14.5, marginTop: 4}}>Usar la dirección de envío también como dirección de facturación</span>
                    </div>
                    <div className="input-group col-xs-4" style={{marginTop: 10}}>
                        <button
                            onClick={this.validateSecondPart}
                            className="btn btn-block"
                            style={{
                                backgroundColor: config.navBar.iconBackground,
                                color: config.navBar.iconModal,
                                fontWeight: "bold"
                            }}>
                            {this.state.validateTax === true ? "Terminar y guardar" : "Registrar dirección de facturación"}
                        </button>
                    </div>
                    <div className="input-group col-xs-4" style={{marginTop: 10}}>
                        <button
                            onClick={() => {
                                this.setState({partRegister: 1})
                            }}
                            className="btn btn-block"
                            style={{
                                backgroundColor: config.navBar.iconBackground,
                                color: config.navBar.iconModal,
                            }}>
                            Regresar
                        </button>
                    </div>
                </div>
            </div>
        )
    };

    handleCheck = () => {
        this.setState({validateTax: !this.state.validateTax});
        /*if(!this.state.validateTax){
            ////console.log("Is true visible");
            ////console.log("jajajaja no is true is ",this.state.validateTax);
        }else{   
            ////console.log("is false visible");
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
                            <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.road} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_street_register"
                            placeholder="Calle y número"
                            style={{textAlign: 'center', height: 30}}
                            autoComplete={'new-street'}
                            value={loginReducer.billing.street}
                            onChange={(event) => setStreetBill(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.map} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_suburb_register"
                            placeholder="Colonia"
                            style={{textAlign: 'center', height: 30}}
                            value={loginReducer.billing.suburb}
                            onChange={(event) => setSuburbBill(event.target.value)}
                            
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.city} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_city_register"
                            placeholder="Ciudad"
                            autoComplete={'new-register'}
                            style={{textAlign: 'center', height: 30}}
                            value={loginReducer.billing.city}
                            onChange={(event) => setCityBill(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.envelope} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_cp_register"
                            placeholder="Código postal"
                            autoComplete={'new-cp_register'}
                            style={{textAlign: 'center', height: 30}}
                            value={loginReducer.billing.cp}
                            onChange={(event) => setCPBill(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.iconBackground}}>
                                <i className={config.icons.globalAmericas} style={{color: config.navBar.iconModal}}></i>
                        </span>
                        </div>
                        <select id="cars" name="handel_country_register" autoComplete={'new_country_register'}
                                placeholder="País" value={loginReducer.billing.country}
                                className="form-control text-left"
                                onChange={(event) => {
                                    setCountryBill(event.target.value);
                                    setTimeout(() => {
                                        this.getStates()
                                    }, 100);
                                    setStateBill('');
                                }}
                                style={{textAlign: 'center', height: 30, padding: 0}}>
                            <option value=''>Selecciona un país</option>
                            {countries.map(country => {
                                return <option value={country.Code} key={country.Code}>{country.Name}</option>
                            })}
                        </select>

                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.shield} style={{color: config.navBar.iconModal}} /></span>
                        </div>
                        <select id="cars" name="handel_state_register" 
                            autoComplete={'state_register'}
                            placeholder="País" 
                            value={loginReducer.billing.state} 
                            className="form-control text-left"
                            onChange={(event) => setStateBill(event.target.value)}
                            style={{textAlign: 'center', height: 30, padding: 0}}>
                                <option value=''>Selecciona un estado</option>
                                {states.map(state => {
                                    return <option value={state.Code}  key={state.Code}>{state.Name}</option>
                                })}
                        </select>

                    </div>
                    <div className="input-group col-xs-4" style={{marginTop: 10}}>
                        <button
                            onClick={this.validateThirdPart}
                            className="btn btn-block"
                            style={{
                                backgroundColor: config.navBar.iconBackground,
                                color: config.navBar.iconModal,
                                fontWeight: "bold"
                            }}>
                            Terminar
                        </button>
                    </div>
                    <div className="input-group col-xs-4" style={{marginTop: 10}}>
                        <button
                            onClick={() => {
                                this.setState({partRegister: 2})
                            }}
                            className="btn btn-block"
                            style={{
                                backgroundColor: config.navBar.iconBackground,
                                color: config.navBar.iconModal,
                            }}>
                            Regresar
                        </button>
                    </div>
                </div>
            </div>
        )
    };


    closeAction = () => {
        const {
            cleanLoginReducer
        } = this.props;
        let component = this;
        
        $('#loginRegisterModal').on('show.bs.modal', async function () {
            ////console.log("cerrar registro");
            cleanLoginReducer();
            component.setState({
                partRegister: 1,
                countries: [],
                states: [],
            })
            await component.getRegisterInfo();
        });
    };

    getRegisterInfo = async () => {
        ////console.log("Rgistro dos");
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;

        enableSpinner(true);
        let response = await apiClient.getCountries();
        let responseCFDI = await apiClient.getCFDI();
        ////console.log("GetCFDI",responseCFDI);
        ////console.log("Lo del conutri", response);
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
        }, 100)
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
                            <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.user} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_user_register"
                            placeholder="Correo"
                            autoComplete={'new_email_regiser'}
                            style={{textAlign: 'center', height: 30}}
                            value={loginReducer.user}
                            onChange={(event) => setUser(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.signature} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_name_register"
                            placeholder="Nombre Completo"
                            style={{textAlign: 'center', height: 30}}
                            value={loginReducer.name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.building} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_password"
                            placeholder="RFC (opcional)"
                            style={{textAlign: 'center', height: 30}}
                            value={loginReducer.rfc}
                            onChange={(event) => setRfc(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text" style={{background: config.navBar.iconBackground}}><i className={config.icons.cfdi} style={{color: config.navBar.iconModal}}></i></span>
                        </div>
                        <select id="cars" name="handel_country_register" autoComplete={'new_country_register'}
                                placeholder="País" value={loginReducer.cfdi}
                                className="form-control text-left"
                                onChange={(event) => {
                                    setCfdi(event.target.value);
                                }}
                                style={{textAlign: 'center', height: 30, padding: 0}}>
                                <option value="">Selecciona el uso de su CFDI</option>
                            {cfdi.map(cdfi => {
                                return <option value={cdfi.CfdiCode} key={cdfi.CfdiCode}>{cdfi.CfdiCode +" - "+ cdfi.CfdiName}</option>
                            })}
                        </select>
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.phone} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_password"
                            placeholder="Teléfono"
                            style={{textAlign: 'center', height: 30}}
                            value={loginReducer.phone}
                            onChange={(event) => setPhone(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.phone} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_password"
                            placeholder="Teléfono 2 (opcional)"
                            style={{textAlign: 'center', height: 30}}
                            value={loginReducer.phone2}
                            onChange={(event) => setPhone2(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.password} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="password"
                            className="form-control text-left"
                            name="handel_password_register"
                            placeholder="Contraseña"
                            style={{textAlign: 'center', height: 30}}
                            value={loginReducer.password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{marginTop: 10}}>
                        <div className="input-group-prepend" style={{width: 40}}>
                            <span className="input-group-text"  style={{background: config.navBar.iconBackground}}><i className={config.icons.password} style={{color: config.navBar.iconModal}}/></span>
                        </div>
                        <input
                            type="password"
                            className="form-control text-left"
                            name="handel_password"
                            placeholder="Validar Contraseña"
                            style={{textAlign: 'center', height: 30}}
                            value={loginReducer.validatePassword}
                            onChange={(event) => setValidatePassword(event.target.value)}
                        />
                    </div>
                    <div className="input-group col-xs-4" style={{marginTop: 10}}>
                        <button
                            onClick={this.validateFirstPart}
                            className="btn btn-block"
                            style={{
                                backgroundColor: config.navBar.iconBackground,
                                color: config.navBar.iconModal,
                                fontWeight: "bold",
                            }}>
                            Continuar
                        </button>
                    </div>
                </div>
            </div>
        )
    };

    render() {
        const {partRegister} = this.state;
        return (
            <div className="modal fade" id="loginRegisterModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document" style={{maxWidth: 500, margin: '1.75rem auto'}}>
                    <div className="modal-content">
                        <div className="modal-header" style={{background: config.navBar.backgroundColor}}>
                            <h5 className="modal-title" style={{color: config.navBar.textColor}}>Registro</h5>
                            <button type="button" style={{color: config.navBar.textColor}} className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body bg3">
                            {partRegister === 1 ? this.renderFirstPartRegister() : partRegister === 2 ? this.renderSecondPartRegister(): this.renderThirdPartRegister()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        loginReducer: store.LoginReducer,
        configReducer: store.ConfigReducer,
        shoppingCartReducer: store.ShoppingCartReducer,
        notificationReducer: store.NotificationReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setUser: value => dispatch({type: DISPATCH_ID.LOGIN_SET_USER, value}),
        setName: value => dispatch({type: DISPATCH_ID.LOGIN_SET_NAME, value}),
        setRfc: value => dispatch({type: DISPATCH_ID.LOGIN_SET_RFC, value}),
        setCfdi: value => dispatch({type: DISPATCH_ID.LOGIN_SET_CFDI, value}),
        setPhone: value => dispatch({type: DISPATCH_ID.LOGIN_SET_PHONE, value}),
        setPhone2: value => dispatch({type: DISPATCH_ID.LOGIN_SET_PHONE_2, value}),
        setPassword: value => dispatch({type: DISPATCH_ID.LOGIN_SET_PASSWORD, value}),
        setValidatePassword: value => dispatch({type: DISPATCH_ID.LOGIN_SET_VALIDATE_PASSWORD, value}),
        //Datos de la dirección
        setAddress: value => dispatch({type: DISPATCH_ID.LOGIN_SET_ADDRESS, value}),
        setStreet: value => dispatch({type: DISPATCH_ID.LOGIN_SET_STREET, value}),
        setSuburb: value => dispatch({type: DISPATCH_ID.LOGIN_SET_SUBURB, value}),
        setCity: value => dispatch({type: DISPATCH_ID.LOGIN_SET_CITY, value}),
        setCP: value => dispatch({type: DISPATCH_ID.LOGIN_SET_CP, value}),
        setCountry: value => dispatch({type: DISPATCH_ID.LOGIN_SET_COUNTRY, value}),
        setState: value => dispatch({type: DISPATCH_ID.LOGIN_SET_STATE, value}),
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        cleanLoginReducer: value => dispatch({type: DISPATCH_ID.LOGIN_CLEAN_REDUCER, value}),
        //Datos de la factura
        setAddressBill: value => dispatch({type: DISPATCH_ID.LOGIN_SET_ADDRESS_BILL, value}),
        setStreetBill: value => dispatch({type: DISPATCH_ID.LOGIN_SET_STREET_BILL, value}),
        setSuburbBill: value => dispatch({type: DISPATCH_ID.LOGIN_SET_SUBURB_BILL, value}),
        setCityBill: value => dispatch({type: DISPATCH_ID.LOGIN_SET_CITY_BILL, value}),
        setCPBill: value => dispatch({type: DISPATCH_ID.LOGIN_SET_CP_BILL, value}),
        setCountryBill: value => dispatch({type: DISPATCH_ID.LOGIN_SET_COUNTRY_BILL, value}),
        setStateBill: value => dispatch({type: DISPATCH_ID.LOGIN_SET_STATE_BILL, value}),

        setRole: value => dispatch({type: DISPATCH_ID.SESSION_SET_ROLE, value}),
        setToken: value => dispatch({type: DISPATCH_ID.SESSION_SET_TOKEN, value}),
        setRememberUser: value => dispatch({type: DISPATCH_ID.SESSION_SET_REMEMBER_USER, value}),
        setUserSession: value => dispatch({type: DISPATCH_ID.SESSION_SET_USER, value}),

        setShoppingCart: value => dispatch({type: DISPATCH_ID.SHOPPING_CART_SAVE_CART, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginRegisterModal);
