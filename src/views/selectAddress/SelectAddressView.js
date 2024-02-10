import React, {Component} from 'react';
import {Footer, NavBar, Session} from "../../components";
import {config, DISPATCH_ID, ROLES, VIEW_NAME, SERVICE_RESPONSE} from "../../libs/utils/Const";
import {connect} from "react-redux";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import { SessionReducer } from '../../redux/reducers/SessionReducer';
import CurrencyFormat from 'react-currency-format';
import { parseJSON } from 'jquery';
import { animateScroll as scroll, scroller } from 'react-scroll';
const apiClient = ApiClient.getInstance();
let totalCTax;
let CostoEnvio;
let fecha;

class SelectAddressView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAddress: false,
            showBill: false,
            addressType: '',
            address: {
                codeOrigin: '',
                address: '',
                name: '',
                email: '',
                phone: '',
                street: '',
                suburb: '',
                city: '',
                cp: '',
                country: '',
                countryName: '',
                state: '',
                stateName: '',
                typeOfAddress: '',
            },
            bill: {
                codeOrigin: '',
                address: '',
                name: '',
                email: '',
                phone: '',
                street: '',
                suburb: '',
                city: '',
                cp: '',
                country: '',
                countryName: '',
                state: '',
                stateName: '',
                taxID: '',
                cfdi:'',
                typeOfAddress: '',
            },
            addressKeySelect: '',
            addressKeyEnabled: true,
            billKeySelect: '',
            billKeyEnabled: true,
            paymentMethodSelect: '',
            paymentMethodEnabled: true,
            countries: [],
            cfdis: [],
            states: [],
            storePackage: [],
            toCollectKeySelect: '',
            toCollectKeyEnabled: true,
            validacionCobrar: false,
            comentario: '',
            colonias:[],
            coloniasBill:[],
            porCobrar: 'no',
            paqueteria: '',
        };

        this.scrollToBottom = this.scrollToBottom.bind(this);
    };
    //Evento para capturar los valores de los campos paqueterías
    handelChange = ({ target }) => {
        const { notificationReducer: {showAlert}} = this.props;
        const { name, value } = target;
        if(name === 'porCobrar'){
            this.setState({
                validacionCobrar: false
            });
        }
        if(name === 'NombrePaqueteria' && value === 'otro'){
            showAlert({type: 'warning', message: "Si no encuentras tu paquetería deseada, favor de contactar a tu asesor de ventas para mayor información"});
        }
        if(name === 'NombrePaqueteria' && value == '51' ){
            showAlert({type: 'warning', message: "Contacté a su asesor de ventas"});
            this.setState({
                paqueteria: value
            });
        }
        
        this.setState({
            [name]: value
        });
    };

    async componentDidMount() {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;

        enableSpinner(true);
        let response = await apiClient.getCountries();
        let responseCFDI = await apiClient.getCFDI();
        this.getPackageStore();
        enableSpinner(false);

        this.setState({
            countries: response.data || [],
            cfdis: responseCFDI.data || [],
        });

        this.scrollToBottom();
    }

    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
    }

    getStates = async () => {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        const {address: {country}} = this.state;
        enableSpinner(true);
        let response = await apiClient.getStates('MX');

        this.setState({
            states: response.data || [],
        });

        setTimeout(() => {
            enableSpinner(false);
        }, 100)
    };

    getPackageStore = async () => {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        enableSpinner(true);
        let response = await apiClient.getPackageStrore();

        this.setState({
            storePackage: response.data || [],
        });

        setTimeout(() => {
            enableSpinner(false);
        }, 100)
    };

    selectPackageStore = event => {
        this.setState({
            validacionCobrar: !this.state.validacionCobrar,
            porCobrar: 'no'
        })
    };

    // hadleChangeTable = key => {
    //     const {createPromo} = this.state;
    //    let  value= key.target.value;
    //    this.search(value)
    //    createPromo.buscarLikeTable = value

    //     this.setState({
    //         createPromo
    //     });
    // }

    getStatesBill = async () => {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        const {bill: {country}} = this.state;
        enableSpinner(true);
        let response = await apiClient.getStates('MX');

        this.setState({
            states: response.data || [],
        });

        setTimeout(() => {
            enableSpinner(false);
        }, 100)
    };

    setAddressKey = (key, value, value2 = '') => {
        let {address, countries, states} = this.state;
        address[key] = value;

        if (key === 'country') {
            countries.forEach(country => {
                if (country.Code === value) {
                    address.countryName = country.Name;
                }
            });
        }

        if (key === 'state') {
            states.forEach(state => {
                if (state.Name === value) {
                    address.stateName = state.Name;
                    address.state = state.Code;
                }
            });
        }

        this.setState({
            address
        })
    };

    setBillKey = (key, value, value2 = '') => {
        let {bill, countries, states, cfdis} = this.state;
        bill[key] = value;

        if (key === 'country') {
            countries.forEach(country => {
                if (country.Code === value) {
                    bill.countryName = country.Name;
                }
            });
        }

        if (key === 'state') {
            states.forEach(state => {
                if (state.Name === value) {
                    bill.stateName = state.Name;
                    bill.state = state.Code;
                }
            });
        }

        if (key === 'cfdi') {
            cfdis.forEach(cfdi => {
                if (cfdi.CfdiCode === value) {
                    bill.cfdi = cfdi.CfdiCode;
                }
            });
        }

        this.setState({
            bill
        })
    };

    saveAddress = async () => {
        const {enableSpinner, setAddresses, sessionReducer: {addresses,user}, notificationReducer: {showAlert}} = this.props;
        const {address} = this.state;

        let newAddresses = [];

        let addressFilter = {};

        if (address.cp.length >= 0 && address.cp.length <= 4) return showAlert({
            type: 'warning',
            message: 'El código postal debe incluir 5 digitos',
            timeOut: 8000
        });

        addressFilter.Address = address.address;
        addressFilter.Street = address.street;
        addressFilter.City = address.city;
        addressFilter.Country = address.country;
        addressFilter.CountryName = address.countryName;
        addressFilter.ZipCode = address.cp;
        addressFilter.State = address.state;
        addressFilter.StateName = address.stateName;
        addressFilter.Block = address.suburb;
        addressFilter.AdresType = address.typeOfAddress;

        for (let i = 0; i < addresses.length; i++) {
            if (addresses[i].Address !== address.codeOrigin) {
                if(addresses[i].AdresType === "B"){
                    addresses[i].TaxID = user.rfc; 
                }
                newAddresses.push(addresses[i]);
            }
        }

        newAddresses.push(addressFilter);

        enableSpinner(true);
        let response = await apiClient.updateAddress(newAddresses);
        enableSpinner(false);

        if (response.status === SERVICE_RESPONSE.ERROR) {
            showAlert({type: 'error', message: "Aviso: "+response.message, timeOut: 8000});
            return;
        }

        setAddresses(newAddresses);
        this.cancelAddress();

    };

    saveBill = async () => {
        const {enableSpinner, setAddresses, sessionReducer: {addresses, user}, notificationReducer: {showAlert}} = this.props;
        const {bill} = this.state;

        let newAddresses = [];

        let addressFilter = {};

        if (bill.cp.length >= 0 && bill.cp.length <= 4) return showAlert({
            type: 'warning',
            message: 'El código postal debe incluir 5 digitos',
            timeOut: 8000
        });

        addressFilter.Address = bill.address;
        addressFilter.Street = bill.street;
        addressFilter.City = bill.city;
        addressFilter.Country = bill.country;
        addressFilter.CountryName = bill.countryName;
        addressFilter.ZipCode = bill.cp;
        addressFilter.State = bill.state;
        addressFilter.StateName = bill.stateName;
        addressFilter.Block = bill.suburb;
        if (bill.taxID === ""){
            addressFilter.TaxID = user.rfc;
        }else{
            addressFilter.TaxID = bill.taxID;
        }

        if (bill.cfdi === ""){
            addressFilter.cfdi = user.cfdi;
        }else{
            addressFilter.cfdi = bill.cfdi;
        }

        addressFilter.AdresType = bill.typeOfAddress;

        for (let i = 0; i < addresses.length; i++) {
            if (addresses[i].Address !== bill.codeOrigin) {
                newAddresses.push(addresses[i]);
            }
        }

        newAddresses.push(addressFilter);

        enableSpinner(true);
        let response = await apiClient.updateAddress(newAddresses);
        enableSpinner(false);

        if (response.status === SERVICE_RESPONSE.ERROR) {
            showAlert({type: 'error', message: "Aviso: "+response.message, timeOut: 8000});
            return;
        }

        setAddresses(newAddresses);
        this.cancelBill();

    };

    createAddress = async () => {
        const {enableSpinner, setAddresses, sessionReducer: {addresses,user}, notificationReducer: {showAlert}} = this.props;
        const {address} = this.state;

        let newAddresses = [];

        let addressFilter = {};

        if (!address.address  || address.address === "") return showAlert({
            type: 'warning',
            message: 'El nombre de la dirección no puede ir vacío',
            timeOut: 8000
        });
        if (!address.country  || address.country === "") return showAlert({
            type: 'warning',
            message: 'Selecciona un país para continuar',
            timeOut: 8000
        });
        if (address.cp.length >= 0 && address.cp.length <= 4) return showAlert({
            type: 'warning',
            message: 'El código postal debe incluir 5 digitos',
            timeOut: 8000
        });
        if (!address.cp  || address.cp === "") return showAlert({
            type: 'warning',
            message: 'Ingrese un código postal para continuar',
            timeOut: 8000
        });
        if (!address.state  || address.state === "") return showAlert({
            type: 'warning',
            message: 'Ingrese el nombre de su estado para continuar',
            timeOut: 8000
        });
        if (!address.city  || address.city === "") return showAlert({
            type: 'warning',
            message: 'Ingrese el nombre de su ciudad para continuar',
            timeOut: 8000
        });
        if (!address.suburb  || address.suburb === "") return showAlert({
            type: 'warning',
            message: 'Seleccione una colonia para continuar',
            timeOut: 8000
        });
        if (!address.street  || address.street === "") return showAlert({
            type: 'warning',
            message: 'Ingrese su calle y número para terminar',
            timeOut: 8000
        });

        addressFilter.Address = address.address;
        addressFilter.Street = address.street;
        addressFilter.City = address.city;
        addressFilter.Country = address.country;
        addressFilter.CountryName = address.countryName;
        addressFilter.ZipCode = address.cp;
        addressFilter.State = address.state;
        addressFilter.StateName = address.stateName;
        addressFilter.Block = address.suburb;
        addressFilter.AdresType = "S";

        for (let i = 0; i < addresses.length; i++) {
            if (addresses[i].Address !== address.codeOrigin) {
                if(addresses[i].AdresType === "B"){
                    addresses[i].TaxID = user.rfc; 
                }
                newAddresses.push(addresses[i]);
            }
        }

        newAddresses.push(addressFilter);

        enableSpinner(true);
        let response = await apiClient.updateAddress(newAddresses);
        enableSpinner(false);


        if (response.status === SERVICE_RESPONSE.ERROR) {
            showAlert({type: 'error', message: "Aviso: "+response.message, timeOut: 8000});
            return;
        }

        setAddresses(newAddresses);
        this.cancelAddress();
        this.cancelBill();
    };
    createBill = async () => {
        const {enableSpinner, setAddresses, sessionReducer: {addresses,user}, notificationReducer: {showAlert}} = this.props;
        const {bill} = this.state;

        let newAddresses = [];

        let addressFilter = {};

        if (!bill.address  || bill.address === "") return showAlert({
            type: 'warning',
            message: 'El nombre de la dirección no puede ir vacío',
            timeOut: 8000
        });
        if (!bill.country  || bill.country === "") return showAlert({
            type: 'warning',
            message: 'Selecciona un país para continuar',
            timeOut: 8000
        });
        if (bill.cp.length >= 0 && bill.cp.length <= 4) return showAlert({
            type: 'warning',
            message: 'El código postal debe incluir 5 digitos',
            timeOut: 8000
        });
        if (!bill.cp  || bill.cp === "") return showAlert({
            type: 'warning',
            message: 'Ingrese un código postal para continuar',
            timeOut: 8000
        });
        if (!bill.state  || bill.state === "") return showAlert({
            type: 'warning',
            message: 'Ingrese el nombre de su estado para continuar',
            timeOut: 8000
        });
        if (!bill.city  || bill.city === "") return showAlert({
            type: 'warning',
            message: 'Ingrese el nombre de su ciudad para continuar',
            timeOut: 8000
        });
        if (!bill.suburb  || bill.suburb === "") return showAlert({
            type: 'warning',
            message: 'Seleccione una colonia para continuar',
            timeOut: 8000
        });
        if (!bill.street  || bill.street === "") return showAlert({
            type: 'warning',
            message: 'Ingrese su calle y número para terminar',
            timeOut: 8000
        });

        addressFilter.Address = bill.address;
        addressFilter.Street = bill.street;
        addressFilter.City = bill.city;
        addressFilter.Country = bill.country;
        addressFilter.CountryName = bill.countryName;
        addressFilter.ZipCode = bill.cp;
        addressFilter.State = bill.state;
        addressFilter.StateName = bill.stateName;
        addressFilter.Block = bill.suburb;
        if (bill.taxID === ""){
            addressFilter.TaxID = user.rfc;
        }else{
            addressFilter.TaxID = bill.taxID;
        }
        if (bill.cfdi === ""){
            addressFilter.cfdi = user.cfdi;
        }else{
            addressFilter.cfdi = bill.cfdi;
        }
        addressFilter.AdresType = "B";

        for (let i = 0; i < addresses.length; i++) {
            if (addresses[i].Address !== bill.codeOrigin) {
                newAddresses.push(addresses[i]);
            }
        }

        newAddresses.push(addressFilter);

        enableSpinner(true);
        let response = await apiClient.updateAddress(newAddresses);
        enableSpinner(false);


        if (response.status === SERVICE_RESPONSE.ERROR) {
            showAlert({type: 'error', message: "Aviso: "+response.message, timeOut: 8000});
            return;
        }

        setAddresses(newAddresses);
        this.cancelBill();
    };

    cancelAddress = () => {
        const {address} = this.state;
        address.codeOrigin = '';
        address.address = '';
        address.street = '';
        address.city = '';
        address.country = '';
        address.countryName = '';
        address.cp = '';
        address.state = '';
        address.stateName = '';
        address.suburb = '';

        this.setState({
            address,
            showAddress: false,
            addressType: '',
            states: [],
        })
    };
    cancelBill = () => {
        const {bill} = this.state;
        bill.codeOrigin = '';
        bill.address = '';
        bill.street = '';
        bill.city = '';
        bill.country = '';
        bill.countryName = '';
        bill.cp = '';
        bill.state = '';
        bill.stateName = '';
        bill.suburb = '';

        this.setState({
            bill,
            showBill: false,
            addressType: '',
            states: [],
        })
    };

    getDataCP = async () => {
        const {loginReducer , enableSpinner, notificationReducer: {showAlert}, setState, setCity} = this.props;
        const { states , address} = this.state;

        let estado = '';
        let ciudad = '';
        let colonia = [];

        if(address.cp.length === 5){
            await apiClient.getInfoCP(address.cp).then( infoCP => {
                if(infoCP.status === SERVICE_RESPONSE.SUCCESS){
                    estado = infoCP.data.edo;
                    ciudad = infoCP.data.cd;
                    colonia = infoCP.data.colonia;
                }else{
                    estado = '';
                    ciudad = '';
                    colonia = [];
                    showAlert({type: 'warning', message: "El código postal no es válido"});
                }
            });
            this.setAddressKey('state', estado);
            this.setAddressKey('city', ciudad);
            this.setState({
                colonias: colonia
            });

        }else{
            if(address.cp.length > 5){
                showAlert({type: 'warning', message: "El código postal no es válido"});
            }
            
        }
    };
    
    getDataCPBill = async () => {
        const {loginReducer , enableSpinner, notificationReducer: {showAlert}, setStateBill, setCityBill} = this.props;
        const { states,bill } = this.state;

        let estado = '';
        let ciudad = '';
        let colonia = [];

        if(bill.cp.length === 5){
            await apiClient.getInfoCP(bill.cp).then( infoCP => {
                if(infoCP.status === SERVICE_RESPONSE.SUCCESS){
                    estado = infoCP.data.edo;
                    ciudad = infoCP.data.cd;
                    colonia = infoCP.data.colonia;
                }else{
                    estado = '';
                    ciudad = '';
                    colonia = [];
                    showAlert({type: 'warning', message: "El código postal no es válido"});
                }
            });
            
            this.setBillKey('state', estado);
            this.setBillKey('city', ciudad);
            this.setState({
                coloniasBill: colonia
            });

        }else{
            if(bill.cp.length > 5){
                showAlert({type: 'warning', message: "El código postal no es válido"});
            }
            
        }
    };

    renderFormNewAddress = () => {
        const {sessionReducer: {role}} = this.props;
        const {address, countries, states, addressType, colonias} = this.state;

        let title = '';
        let action = '';

        if (addressType === 'save') {
            title = 'Editar';
            action = this.saveAddress;
        }

        if (addressType === 'new') {
            title = 'Nueva';
            action = this.createAddress;
        }

        return <div className="row" style={{margin: "0px auto", marginTop: 50}}>
            <div className="col-md-12">
                <div className="col-md-12">
                    <h2>{title + ' '}dirección de envío</h2>
                </div>
                {role === ROLES.CLIENT && <div className="input-group">
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.pin} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    {addressType === "new" ?
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_calle_register"
                            placeholder="Nombre de la dirección"
                            autoComplete={'new-id'}
                            style={{textAlign: "center", height: 30}}
                            value={address.address}
                            onChange={(event) => this.setAddressKey('address', event.target.value)}
                        />:
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_calle_register"
                            placeholder="Nombre de la dirección"
                            autoComplete={'new-id'}
                            style={{textAlign: "center", height: 30}}
                            value={address.address}
                            onChange={(event) => this.setAddressKey('address', event.target.value)}
                            disabled
                        />
                    }
                </div>}
                {role === ROLES.PUBLIC && <div className="input-group">
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.user} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <input
                        type="text"
                        className="form-control text-left"
                        name="handel_calle_register"
                        placeholder="Nombre del comprador"
                        autoComplete={'new-id'}
                        style={{textAlign: "center", height: 30}}
                        value={address.name}
                        onChange={(event) => this.setAddressKey('name', event.target.value)}
                    />
                </div>}
                {role === ROLES.PUBLIC && <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.envelope} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <input
                        type="text"
                        className="form-control text-left"
                        name="handel_calle_register"
                        placeholder="Correo del comprador"
                        autoComplete={'new-id'}
                        style={{textAlign: "center", height: 30}}
                        value={address.email}
                        onChange={(event) => this.setAddressKey('email', event.target.value)}
                    />
                </div>}
                {role === ROLES.PUBLIC && <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.phone} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <input
                        type="text"
                        className="form-control text-left"
                        name="handel_calle_register"
                        placeholder="Teléfono del comprador"
                        autoComplete={'new-id'}
                        style={{textAlign: "center", height: 30}}
                        value={address.phone}
                        onChange={(event) => this.setAddressKey('phone', event.target.value)}
                    />
                </div>}
                {/* De aqui en adelante se edita */}
                <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.globalAmericas} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <select id="cars" name="handel_country_register" autoComplete={'new_country_register'}
                        placeholder="País" value={address.country}
                        className="form-control text-left"
                        onChange={(event) => {
                            this.setAddressKey('country', event.target.value);
                        }}
                        style={{textAlign: 'center', height: 30, padding: 0}}>
                            <option value=''>Selecciona un país</option>
                            <option value='MX'>México</option>
                    </select>
                </div>
                <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.envelope} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <input
                        type="text"
                        className="form-control text-left"
                        name="handel_cp_register"
                        placeholder="Código postal"
                        autoComplete={'new-cp_register'}
                        style={{textAlign: 'center', height: 30}}
                        value={address.cp}
                        onChange={(event) => {
                            this.setAddressKey('cp', event.target.value)
                            setTimeout(() => {
                                this.getDataCP()
                            }, 250);
                        }}
                    />
                </div>
                <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.shield} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <input
                        type="text"
                        className="form-control text-left"
                        name="handel_state_register"
                        placeholder="Estado"
                        autoComplete={'state_register'}
                        style={{textAlign: 'center', height: 30}}
                        value={address.stateName}
                        onChange={(event) => this.setAddressKey('state', event.target.value)}
                    />
                </div>
                <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.city} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <input
                        type="text"
                        className="form-control text-left"
                        name="handel_city_register"
                        placeholder="Ciudad"
                        autoComplete={'new-register'}
                        style={{textAlign: "center", height: 30}}
                        value={address.city}
                        onChange={(event) => this.setAddressKey('city', event.target.value)}
                    />
                </div>
                <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.map} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <select id="cars" 
                        name="handel_suburb_register"
                        autoComplete={'new_country_register'}
                        placeholder="Colonia" value={address.suburb}
                        className="form-control text-left"
                        onChange={(event) => this.setAddressKey('suburb', event.target.value)}
                        style={{textAlign: 'center', height: 30, padding: 0}}>
                        <option value=''>Selecciona una colonia</option>
                        {colonias.map( (colonia, index) => {
                            return <option value={colonia} key={index}>{colonia}</option>
                        })}
                    </select>
                </div>
                <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.road} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <input
                        type="text"
                        className="form-control text-left"
                        name="handel_street_register"
                        placeholder="Calle"
                        style={{textAlign: 'center', height: 30}}
                        autoComplete={'new-street'}
                        value={address.street}
                        onChange={(event) => this.setAddressKey('street', event.target.value)}
                    />
                </div>
                {/* <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.globalAmericas} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <select id="cars" name="handel_country_register" autoComplete={'new_country_register'}
                            placeholder="País" value={address.country}
                            className="form-control text-left"
                            onChange={(event) => {
                                this.setAddressKey('country', event.target.value);
                                setTimeout(async () => {
                                    await this.getStates()
                                }, 100);
                            }}
                            style={{textAlign: "center", height: 30, padding: 0}}>
                        <option value=''>Selecciona un país</option>
                        {countries.map(country => {
                            return <option value={country.Code}>{country.Name}</option>
                        })}
                    </select>

                </div> */}
                {/* <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.shield} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <select id="cars" name="handel_state_register" autoComplete={'state_register'}
                            placeholder="País" value={address.state} className="form-control text-left"
                            onChange={(event) => this.setAddressKey('state', event.target.value)}
                            style={{textAlign: "center", height: 30, padding: 0}}>
                        <option value=''>Selecciona un estado</option>
                        {states.map(state => {
                            return <option value={state.Code}>{state.Name}</option>
                        })}
                    </select>
                </div> */}
                <div className="row">
                    <div className="col-12">
                        {role === ROLES.CLIENT && <div className="input-group col-xs-4" style={{marginTop: 10}}>
                            <button
                                onClick={this.cancelAddress}
                                className="btn btn-block text-white"
                                style={{
                                    backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                    color: config.navBar.textColorCategorieHover,
                                }}>
                                Cancelar
                            </button>
                        </div>}
                    </div>
                    <div className="col-12">
                        {role === ROLES.CLIENT && <div className="input-group col-xs-4" style={{marginTop: 10}}>
                            <button
                                onClick={action}
                                className="btn btn-block text-white"
                                style={{
                                    backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                    color: config.navBar.textColorCategorieHover,
                                    fontWeight: "bold",
                                }}>
                                Guardar
                            </button>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    };
    renderFormNewBill = () => {
        const {sessionReducer: {role, user}} = this.props;
        const {bill, countries, states, cfdis, addressType, coloniasBill} = this.state;

        let title = '';
        let action = '';

        if (addressType === 'save') {
            title = 'Editar';
            action = this.saveBill;
        }

        if (addressType === 'new') {
            title = 'Nueva';
            action = this.createBill;
        }

        return <div className="row" style={{margin: '0px auto', marginTop: 50}} id='selectBillViewForm'>
            <div className="col-md-12">
                <div className="col-md-12">
                    <h2>{title + ' '}dirección de facturación</h2>
                </div>
                {role === ROLES.CLIENT && <div className="input-group">
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.pin} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    {addressType === "new" ?
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_calle_register"
                            placeholder="Nombre de la dirección"
                            autoComplete={'new-id'}
                            style={{textAlign: "center", height: 30}}
                            value={bill.address}
                            onChange={(event) => this.setBillKey('address', event.target.value)}
                        />:
                        <input
                            type="text"
                            className="form-control text-left"
                            name="handel_calle_register"
                            placeholder="Nombre de la dirección"
                            autoComplete={'new-id'}
                            style={{textAlign: "center", height: 30}}
                            value={bill.address}
                            onChange={(event) => this.setBillKey('address', event.target.value)}
                            disabled
                        />
                    }
                </div>}
                {role === ROLES.PUBLIC && <div className="input-group">
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.user} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <input
                        type="text"
                        className="form-control text-left"
                        name="handel_calle_register"
                        placeholder="Nombre del comprador"
                        autoComplete={'new-id'}
                        style={{textAlign: "center", height: 30}}
                        value={bill.name}
                        onChange={(event) => this.setBillKey('name', event.target.value)}
                    />
                </div>}
                {role === ROLES.PUBLIC && <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.envelope} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <input
                        type="text"
                        className="form-control text-left"
                        name="handel_calle_register"
                        placeholder="Correo del comprador"
                        autoComplete={'new-id'}
                        style={{textAlign: "center", height: 30}}
                        value={bill.email}
                        onChange={(event) => this.setBillKey('email', event.target.value)}
                    />
                </div>}
                {role === ROLES.PUBLIC && <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.phone} style={{color: config.navBar.iconColor}}/>
                        </span>
                    </div>
                    <input
                        type="text"
                        className="form-control text-left"
                        name="handel_calle_register"
                        placeholder="Teléfono del comprador"
                        autoComplete={'new-id'}
                        style={{textAlign: "center", height: 30}}
                        value={bill.phone}
                        onChange={(event) => this.setBillKey('phone', event.target.value)}
                    />
                </div>}
                <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.user} style={{color: config.navBar.iconColor}}/>
                        </span>
                    </div>
                    <input
                        type="text"
                        className="form-control text-left"
                        name="handel_taxid_register"
                        placeholder="RFC"
                        autoComplete={'new-id'}
                        style={{textAlign: "center", height: 30}}
                        value={bill.taxID || user.rfc}
                        onChange={(event) => this.setBillKey('taxID', event.target.value)}
                    />
                </div>
                <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}>
                            <i className={config.icons.cfdi} style={{color: config.navBar.iconColor}}/>
                        </span>
                    </div>
                    <select id="cars" name="handel_country_register" autoComplete={'new_country_register'}
                            placeholder="País" value={bill.cfdi || user.cfdi}
                            className="form-control text-left"
                            onChange={(event) => {
                                this.setBillKey('cfdi', event.target.value);
                            }}
                            style={{textAlign: "center", height: 30, padding: 0}}>
                        <option value=''>Selecciona el uso de su CFDI</option>
                        {cfdis.map(cdfi => {
                            return <option value={cdfi.CfdiCode} key={cdfi.CfdiCode}>{cdfi.CfdiCode +" - "+ cdfi.CfdiName}</option>
                        })}
                    </select>
                </div>
                {/* Campos de dirección cambiantes */}
                <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.globalAmericas} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <select id="cars" name="handel_country_register" autoComplete={'new_country_register'}
                        placeholder="País" value={bill.country}
                        className="form-control text-left"
                        onChange={(event) => {
                            this.setBillKey('country', event.target.value);
                        }}
                        style={{textAlign: 'center', height: 30, padding: 0}}>
                            <option value=''>Selecciona un país</option>
                            <option value='MX'>México</option>
                    </select>
                </div>
                <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.envelope} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <input
                        type="text"
                        className="form-control text-left"
                        name="handel_cp_register"
                        placeholder="Código postal"
                        autoComplete={'new-cp_register'}
                        style={{textAlign: 'center', height: 30}}
                        value={bill.cp}
                        onChange={(event) =>{
                            this.setBillKey('cp', event.target.value)
                            setTimeout(() => {
                                this.getDataCPBill()
                            }, 250);
                        }}
                    />
                </div>
                <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.shield} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <input
                        type="text"
                        className="form-control text-left"
                        name="handel_state_register"
                        placeholder="Estado"
                        autoComplete={'state_register'}
                        style={{textAlign: 'center', height: 30}}
                        value={bill.stateName}
                        onChange={(event) => this.setBillKey('state', event.target.value)}
                    />
                </div>
                <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.city} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <input
                        type="text"
                        className="form-control text-left"
                        name="handel_city_register"
                        placeholder="Ciudad"
                        autoComplete={'new-register'}
                        style={{textAlign: 'center', height: 30}}
                        value={bill.city}
                        onChange={(event) => this.setBillKey('city', event.target.value)}
                    />
                </div>
                <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.map} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <select id="cars" 
                        name="handel_suburb_register"
                        autoComplete={'new_country_register'}
                        placeholder="Colonia" value={bill.suburb}
                        className="form-control text-left"
                        onChange={(event) => this.setBillKey('suburb', event.target.value)}
                        style={{textAlign: 'center', height: 30, padding: 0}}>
                        <option value=''>Selecciona una colonia</option>
                        {coloniasBill.map( (colonia, index) => {
                            return <option value={colonia} key={index}>{colonia}</option>
                        })}
                    </select>
                </div>
                <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.road} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <input
                        type="text"
                        className="form-control text-left"
                        name="handel_street_register"
                        placeholder="Calle"
                        style={{textAlign: 'center', height: 30}}
                        autoComplete={'new-street'}
                        value={bill.street}
                        onChange={(event) => this.setBillKey('street', event.target.value)}
                    />
                </div>
                {/* <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.globalAmericas} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <select id="cars" name="handel_country_register" autoComplete={'new_country_register'}
                            placeholder="País" value={bill.country}
                            className="form-control text-left"
                            onChange={(event) => {
                                this.setBillKey('country', event.target.value);
                                setTimeout(async () => {
                                    await this.getStatesBill()
                                }, 100);
                            }}
                            style={{textAlign: "center", height: 30, padding: 0}}>
                        <option value=''>Selecciona un país</option>
                        {countries.map(country => {
                            return <option key={country.Code} value={country.Code}>{country.Name}</option>
                        })}
                    </select>

                </div> */}
                {/* <div className="input-group" style={{marginTop: 10}}>
                    <div className="input-group-prepend" style={{width: 40}}>
                        <span className="input-group-text" style={{background: config.navBar.backgroundColor}}><i
                            className={config.icons.shield} style={{color: config.navBar.iconColor}}/></span>
                    </div>
                    <select id="cars" name="handel_state_register" autoComplete={'state_register'}
                            placeholder="País" value={bill.state} className="form-control text-left"
                            onChange={(event) => this.setBillKey('state', event.target.value)}
                            style={{textAlign: "center", height: 30, padding: 0}}>
                        <option value=''>Selecciona un estado</option>
                        {states.map(state => {
                            return <option key={state.Code} value={state.Code}>{state.Name}</option>
                        })}
                    </select>
                </div> */}
                <div className="row">
                    <div className="col-12">
                        {role === ROLES.CLIENT && <div className="input-group col-xs-4" style={{marginTop: 10}}>
                            <button
                                onClick={this.cancelBill}
                                className="btn btn-block text-white"
                                style={{
                                    backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                    color: config.navBar.textColorCategorieHover,
                                }}>
                                Cancelar
                            </button>
                        </div>}
                    </div>
                    <div className="col-12">
                        {role === ROLES.CLIENT && <div className="input-group col-xs-4" style={{marginTop: 10}}>
                            <button
                                onClick={action}
                                className="btn btn-block text-white"
                                style={{
                                    backgroundColor: config.navBar.menuCategoriesBackgroundHover,
                                    color: config.navBar.textColorCategorieHover,
                                    fontWeight: "bold",
                                }}>
                                Guardar
                            </button>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    };
    editAddress = addressValue => {
        const {address} = this.state;
        address.codeOrigin = addressValue.Address || '';
        address.address = addressValue.Address || '';
        address.street = addressValue.Street || '';
        address.city = addressValue.City || '';
        address.country = addressValue.Country || '';
        address.countryName = addressValue.CountryName || '';
        address.cp = addressValue.ZipCode || '';
        address.state = addressValue.State || '';
        address.stateName = addressValue.StateName || '';
        address.suburb = addressValue.Block || '';
        address.typeOfAddress = addressValue.AdresType || '';

        this.setState({
            address,
            showAddress: true,
            showBill: false,
            addressType: 'save',
        })

        setTimeout(async () => {
            await this.getStates();
        }, 50)
    };
    editBill = addressValue => {
        const {bill} = this.state;
        bill.codeOrigin = addressValue.Address || '';
        bill.address = addressValue.Address || '';
        bill.street = addressValue.Street || '';
        bill.city = addressValue.City || '';
        bill.country = addressValue.Country || '';
        bill.countryName = addressValue.CountryName || '';
        bill.cp = addressValue.ZipCode || '';
        bill.state = addressValue.State || '';
        bill.stateName = addressValue.StateName || '';
        bill.suburb = addressValue.Block || '';
        bill.typeOfAddress = addressValue.AdresType || '';

        this.setState({
            bill,
            showBill: true,
            showAddress: false,
            addressType: 'save',
        })

        setTimeout(async () => {
            await this.getStatesBill();
        }, 50)
    };

    newAddress = async () => {
        const {address} = this.state;
        address.codeOrigin = '';
        address.address = '';
        address.street = '';
        address.city = '';
        address.country = '';
        address.countryName = '';
        address.cp = '';
        address.state = '';
        address.stateName = '';
        address.suburb = '';
        address.typeOfAddress = 'S';

        await this.getStates();

        this.setState({
            address,
            showAddress: true,
            showBill: false,
            addressType: 'new',
            // states: [],
        })
    };

    newBill = async () => {
        const {bill} = this.state;
        bill.codeOrigin = '';
        bill.address = '';
        bill.street = '';
        bill.city = '';
        bill.country = '';
        bill.countryName = '';
        bill.cp = '';
        bill.state = '';
        bill.stateName = '';
        bill.suburb = '';
        bill.typeOfAddress = 'B';

        await this.getStatesBill();

        this.setState({
            bill,
            showBill: true,
            showAddress: false,
            addressType: 'new',
            // states: [],
        })
    };

    renderClientAddress = () => {
        const {sessionReducer: {addresses}} = this.props;
        
        return <div className="container-fluid row" style={{ margin: 0, padding: 0, display: 'flex', justifyContent: "center", alignItems: "center"}}>
            {config.modules.Address && 
                <div className="col-sm-12">
                    <p  onClick={this.newAddress} style={{cursor: 'pointer', color: config.navBar.iconColor}}>
                        <i style={{marginRight: 5}} className={ config.icons.backOrderTrue}></i>
                        <span style={{fontSize: 16}}>Agregar una nueva dirección de envío</span>
                    </p>
                </div>
            }
            {addresses.map(address => {
                if(address.AdresType === "S"){
                    return <div className="col-sm-12" key={address.Address}>
                        <div className="card text-center">
                            <div className="card-body">
                                <label for={address.AdresType+address.Address}>
                                    <h5 className="card-title">
                                        <input type="radio" id={address.AdresType+address.Address} name="address" value={address.Address} onClick={this.selectAddress} style={{marginRight: 5}}/>
                                        {address.Address}
                                    </h5>
                                    <p className="card-text">{(address.Street || '') + ', ' + (address.Block || '') + ', ' + (address.City || '') + ', ' + (address.StateName || '') + ', ' + (address.CountryName || '') + '. ' + (address.ZipCode || '')}</p>
                                </label><br/>
                                {config.modules.EditAddress && 
                                <button className="btn" style={{backgroundColor: config.navBar.menuCategoriesBackgroundHover,color: "white",fontWeight: "bold"}} onClick={() => this.editAddress(address)}>
                                    Editar dirección
                                </button>
                                }
                                {/* <button className="btn" style={{backgroundColor: config.navBar.menuCategoriesBackgroundHover,color: "white",fontWeight: "bold"}} onClick={() => this.deleteAddress(address, 'S')}>
                                    Eliminar dirección
                                </button> */}
                            </div>
                        </div>
                    </div>
                }
            })}
        </div>
    };
    renderClientABill = () => {
        const {sessionReducer: {addresses, user}} = this.props;
        return( <div className="container-fluid row" style={{ margin: 0, padding: 0, display: "flex", justifyContent: "center", alignItems: "center"}}>
            {config.modules.Address &&
                <div className="col-sm-12">
                    <p  onClick={this.newBill} style={{cursor: "pointer", color: config.navBar.iconColor}}>
                        <i style={{marginRight: 5}} className={ config.icons.backOrderTrue}></i>
                        <span style={{fontSize: 16}}>Agregar una nueva dirección de facturación</span>
                    </p>
                </div>
            }
            {/* <div className="col-sm-12">
                <div className="card text-center">
                    <div className="card-body">
                        <label for={'same'}>
                            <h5 className="card-title">
                                <input type="radio" id="same" name="bill" value="same" onClick={this.selectBill} style={{marginRight: 5}}/>
                                Misma dirección
                            </h5>
                            <p className="card-text">
                                Usar la misma dirección de envío como dirección de facturación
                            </p>
                        </label>
                    </div>
                </div>
            </div> */}

            {addresses.map(address => {
                let defaultFac = address.BillToDef;
                if(address.AdresType === "B" && address.Address === defaultFac){
                    return <div className="col-sm-12" key={address.Address}>
                        <div className="card text-center">
                            <div className="card-body">
                                <label for={address.AdresType+address.Address}>
                                    <h5 className="card-title">
                                        <input type="radio" id={address.AdresType+address.Address} name="bill" value={address.Address} onClick={this.selectBill} style={{marginRight: 5}} checked/>
                                        {address.Address}
                                    </h5>
                                    <p className="card-text">{(address.Street || '') + ', ' + (address.Block || '') + ', ' + (address.City || '') + ', ' + (address.StateName || '') + ', ' + (address.CountryName || '') + '. ' + (address.ZipCode || '')}</p>
                                </label><br/>
                                {config.modules.EditAddress && 
                                <button className="btn " style={{backgroundColor: config.navBar.menuCategoriesBackgroundHover,color: "white",fontWeight: "bold"}} onClick={() => this.editBill(address)}>
                                    Editar dirección
                                </button>
                                }
                                {/* <button className="btn" style={{backgroundColor: config.navBar.menuCategoriesBackgroundHover,color: "white",fontWeight: "bold"}} onClick={() => this.deleteAddress(address, 'B')}>
                                    Eliminar dirección
                                </button> */}
                            </div>
                        </div>
                    </div>
                }
            })}
        </div>)
    };

    package = () => {
        const { storePackage ,validacionCobrar, porCobrar, convenio} = this.state;
        return( <div className="container-fluid" style={{ margin: 0, padding: 0, }}>
            <div className="col-sm-12">
                {/* <div className="row">
                    <select name="NombrePaqueteria" placeholder="Selecciona una paquetería" className="form-control text-left" onChange={this.handelChange} style={{ textAlign: 'center', height: 30, padding: 0 }}>
                        <option value="">Selecciona una paquetería</option>
                            {
                                storePackage.map(NombrePaqueteria => {
                                    return <option value={NombrePaqueteria.TrnspCode} key={NombrePaqueteria.TrnspCode}>{NombrePaqueteria.TrnspName}</option>
                                })
                            }
                            <option value="otro">Otro</option>
                    </select>
                </div> */}
                {/* <div className="input-group" style={{paddingTop: 10, paddingBottom: 10}}>
                    <div style={{marginTop: 15, marginBottom:15, marginLeft: 5}}>
                        <label for='porCobrar'>
                            <input type="radio" id="porCobrar" onChange={this.selectPackageStore} defaultChecked={this.state.validacionCobrar} style={{marginTop: 'auto', marginBottom: 'auto'}}/>
                            <span style={{ fontSize: 17, marginTop: 'auto', marginBottom: 'auto', marginLeft: 4}}>Por cobrar</span>
                        </label>
                    </div>            
                </div> */}
                <div className="mt-2" style={{border: '2px solid rgb(239,239,239)'}} >
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">
                                <input type="radio" style={{marginRight: 5}} checked/>
                                Mensajeria DIASA
                            </h5>
                            <p className="card-text" style={{ color:'#bdbdbd'}}>
                                sin costo de envió
                            </p>
                        </div>
                    </div>

                    {/* <div style={{marginTop: 15, marginBottom:15, marginLeft: 5}}>
                        <label for='Convenio'>
                            <input id='Convenio' type="radio" name="porCobrar" style={{marginRight: 10}} value="si" onChange={this.handelChange}/>
                            <span style={{ fontSize: 18}}>Convenio</span>
                        </label>
                    </div>
                    <input type="text" style={{display:porCobrar === 'si' ? 'block' : 'none' }} className="form-control"  name="convenio" id="txtName" onChange={this.handelChange} placeholder="Número de convenio" autoComplete="off" value={convenio ? convenio : ''}/>  */}
                    {/* onChange={this.changeName}  */}

                </div>
                {/* <div className="mt-2" style={{border: '2px solid rgb(239,239,239)'}} >
                    <div className="text-center">
                        <h4>Tipo de Entrega</h4>                        
                    </div>

                    <div style={{marginTop: 15, marginBottom:15, marginLeft: 5}} >
                        <label for='aDomicilio'>
                            <input id='aDomicilio' type="radio" name="tipoEntrega" style={{marginRight: 10}} value="toAddress" onChange={this.handelChange}/>
                            <span style={{ fontSize: 18}} htmlFor="toAddress" >A Domicilio</span>
                        </label>
                    </div>

                    <div style={{marginTop: 15, marginBottom:15, marginLeft: 5}}>
                        <label for='aOcurre'>
                            <input id='aOcurre' type="radio" name="tipoEntrega" style={{marginRight: 10}} value="postOffice" onChange={this.handelChange}/>
                            <span style={{ fontSize: 18}} htmlFor="postOffice" >A Ocurre</span>
                        </label>
                    </div>

                </div> */}
            </div>
        </div>)
    };
    
    comments = () =>{
        const { comentario} = this.state;
        let total = 254;

        return( 
        <div className="container-fluid" style={{ margin: 0, padding: 0, }}>
            <div className="col-sm-12 coment">
                <textarea 
                    disabled = {comentario.length == 254 ? true : false}
                    name="comentario"
                    onChange={this.handelChange} 
                    style={{border: '2px solid rgb(239,239,239)', width: "100%", height: "165px"}} 
                    placeholder="Agrega un comentario"
                >
                </textarea>
                <label>{comentario.length + ' caracteres, te quedan '+ (total - comentario.length) + ' caracteres.'}</label>
            </div>
        </div>)
    };

    selectAddress = event => {
        const {sessionReducer: {role, addresses}} = this.props;
        let facturacion = '';
        addresses.map(add =>{
            facturacion = add.BillToDef;
        });

        this.setState({
            showAddress: false,
            addressKeyEnabled: true,
            addressKeySelect: event.nativeEvent.target.value || '',

            //FACTURACION
            showBill: false,
            billKeyEnabled: true,
            billKeySelect: facturacion,
        })
    };
    selectBill = event => {
        this.setState({
            showBill: false,
            billKeyEnabled: true,
            billKeySelect: event.nativeEvent.target.value || '',
        })
    };

    validateForm = () => {
        const {notificationReducer: {showAlert}} = this.props;
        const {address, addressKeySelect} = this.state;

        if (!address.name) {
            showAlert({type: 'warning', message: 'Introduzca un nombre de comprador'});
            return false;
        }

        if (!address.email) {
            showAlert({type: 'warning', message: 'Introduzca un correo de comprador'});
            return false;
        }

        if (!address.phone) {
            showAlert({type: 'warning', message: 'Introduzca un teléfono de comprador'});
            return false;
        }

        if (!address.name) {
            showAlert({type: 'warning', message: 'Introduzca un nombre de comprador'});
            return false;
        }

        if (!address.street) {
            showAlert({type: 'warning', message: 'Introduzca una calle'});
            return false;
        }

        if (!address.suburb) {
            showAlert({type: 'warning', message: 'Introduzca una colonia'});
            return false;
        }

        if (!address.city) {
            showAlert({type: 'warning', message: 'Introduzca una ciudad'});
            return false;
        }

        if (!address.cp) {
            showAlert({type: 'warning', message: 'Introduzca un código postal'});
            return false;
        }

        if (!address.country) {
            showAlert({type: 'warning', message: 'Introduzca un país'});
            return false;
        }

        if (!address.state) {
            showAlert({type: 'warning', message: 'Introduzca un estado'});
            return false;
        }

        return true;
    };

    continue = () => {
        const {sessionReducer: {role, addresses}, notificationReducer: {showAlert}, configReducer: {history}} = this.props;
        const {address, addressKeySelect,billKeySelect , paymentMethodSelect, toCollectKeySelect, NombrePaqueteria,comentario, validacionCobrar, tipoEntrega, porCobrar, convenio, paqueteria} = this.state;
        let validacionCobrarVar = validacionCobrar;
        let newAddress;
        let newBill;

        if (role === ROLES.CLIENT) {
            if (!addressKeySelect) return showAlert({type: 'warning', message: 'Selecciona una dirección de envío'})

            addresses.map(addressFilter => {
                if(addressFilter.Address === addressKeySelect){
                    newAddress = addressFilter
                }
            })
        }
        if (role === ROLES.CLIENT) {
            if (!billKeySelect) return showAlert({type: 'warning', message: 'Selecciona una dirección de facturación'})
            if(billKeySelect === "same"){
                addresses.map(addressFilter => {
                    if(addressFilter.Address === addressKeySelect){
                        newBill = addressFilter
                    }
                })
            }else{
                addresses.map(addressFilter => {
                    if(addressFilter.Address === billKeySelect){
                        newBill = addressFilter
                    }
                })
            }
        }

        if (role === ROLES.PUBLIC) {
            if (!this.validateForm()) return;
            newAddress = address;
        }

        // if (!paymentMethodSelect) return showAlert({type: 'warning', message: 'Selecciona un método de pago'});
        // if(!NombrePaqueteria) return showAlert({type: 'warning', message: 'Selecciona una paquetería de envío'});

        // if(!tipoEntrega) return showAlert({type: 'warning', message: 'Selecciona tipo de entrega'});

               
        let discPrcntLocalStorage = localStorage.getItem(config.general.localStorageNamed + 'Discount');
        let discPntLocalStorage = localStorage.getItem(config.general.localStorageNamed + 'DiscountPoints');

        let disc = null;
        try {
            disc = JSON.parse(discPrcntLocalStorage);
        } catch (error) {
        }
        // if(paqueteria == '51' ){
        //     validacionCobrarVar = true;
        // }
        // else{
        //     validacionCobrarVar = false;
        // }
        let data = {
            address: newAddress,
            bill: newBill,
            paymentMethod: paymentMethodSelect,
            date: new Date(),
            IdPackge: NombrePaqueteria,
            PorCobrar: validacionCobrarVar,
            tipoEntrega: tipoEntrega,
            comentario: comentario,
            discPrcnt: disc,
            convenio : porCobrar === 'si' ? convenio : '',
            discPnt: discPntLocalStorage,
        };

        sessionStorage.setItem('validateOrder', JSON.stringify(data));

        history.goValidateOrder();
    };

    selectPaymentMethod = event => {
        this.setState({
            paymentMethodEnabled: true,
            paymentMethodSelect: event.nativeEvent.target.value || '',
            
        })
    };

    render() {
        const {history, sessionReducer: {role}} = this.props;
        
        const {showAddress, showBill, addressKeyEnabled, paymentMethodEnabled, toCollectKeyEnabled} = this.state;
        
        return (
            <div className="content-fluid none-scroll" style={{marginTop: 95,backgroundColor: config.Back.backgroundColor}}>
                <Session history={history} view={VIEW_NAME.SELECT_ADDRESS_VIEW}/>
                <NavBar isShowMarcas={false}/>
                    <div className="row pb-4"  style={{marginLeft: 10, paddingTop:30, marginRight: 10,  minHeight: "70vh", paddingTop: 70}}>
                        <div className="col-lg-4 col-md-6 pb-2">
                            <div className="card style-articles-cart" style={{ borderColor: '#ADADAD', borderRadius: 20 }}>
                                <div className="card-header" style={{ background: "#ADADAD", borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                                    <h5 className="card-title" style={{color: config.navBar.textColor2}}>
                                        Seleccione una dirección de envío
                                    </h5>
                                </div>
                                <div className="card-body">
                                    {role !== ROLES.PUBLIC && this.renderClientAddress()}
                                    <div style={{textAlign: "center"}}>
                                        {(showAddress || role === ROLES.PUBLIC) && this.renderFormNewAddress()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 pb-2">
                            <div className="card style-articles-cart" style={{ borderColor: '#ADADAD', borderRadius: 20 }}>
                                <div className="card-header" style={{ background: "#ADADAD", borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                                    <h5 className="card-title text-white" style={{color: config.navBar.textColor2}}>
                                        Seleccione una dirección de facturación
                                    </h5>
                                </div>
                                <div className="card-body">
                                    {role !== ROLES.PUBLIC && this.renderClientABill()}
                                    <div style={{textAlign: "center"}}>
                                        {(showBill || role === ROLES.PUBLIC) && this.renderFormNewBill()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-lg-3 col-md-6 pb-2">
                            <div className="card " style={{ borderColor: '#ADADAD', borderRadius: 20 }}>
                                <div className="card-header" style={{ background: "#ADADAD", borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                                    <div  className="card-title">
                                        <h5 style={{color: config.navBar.textColor2}}>Paqueterías </h5>  
                                        <h6 className="card-subtitle text-white">Seleccione una paquetería</h6>                                      
                                    </div>
                                </div>
                                <div className="card-body">   
                                    {this.package()}
                                </div>
                            </div>
                        </div> */}
                        <div className="col-lg-4 col-md-6 pb-2">
                            <div className="card" style={{ borderColor: '#ADADAD', borderRadius: 20 }}>
                                <div className="card-header text-white" style={{ background: "#ADADAD", borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                                    <div  className="card-title">
                                        <h5 style={{color: config.navBar.textColor2}}>Comentarios </h5>  
                                        <h6 className="card-subtitle text-whiteS">Agrega un comentario adicional</h6>                                      
                                    </div>
                                    {/* <div className="card-title">
                                        <h5 style={{color: config.shoppingList.textsummaryList}}>Confirmación</h5>
                                    </div>
                                    <p className="small">Confirme su dirección</p> */}
                                </div>
                                <div className="card-body">
                                    {this.comments()}
                                    {config.paymentMethod.paypal.enable && <div>
                                        {/* <input type="radio" id="paypal" name="paymentMethod" value="paypal" onClick={this.selectPaymentMethod} style={{margin: 10}} checked/>
                                        <span style={{ fontSize: 18}} htmlFor="paypal" >Pasar a pagar</span> */}
                                    </div>}
                                    {config.paymentMethod.transbank.enable && <div onClick={this.selectPaymentMethod}>
                                        <input type="radio" id="transbank" name="paymentMethod" value="transbank" style={{margin: 10}}/>
                                        <span style={{ fontSize: 18}} htmlFor="transbank" >TransBank</span>
                                    </div>}

                                    {(addressKeyEnabled || role === ROLES.PUBLIC) && paymentMethodEnabled && <div style={{textAlign: "center"}}>
                                        <button
                                            onClick={this.continue}
                                            className="btn btn-block text-white"
                                            style={{
                                                marginTop:10,
                                                fontWeight: "bold",
                                                background: "#86C03F", borderRadius:10
                                            }}>
                                            Continuar
                                        </button>
                                    </div>}
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
        sessionReducer: store.SessionReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        setAddresses: value => dispatch({type: DISPATCH_ID.SESSION_SET_ADDRESSES, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectAddressView);
