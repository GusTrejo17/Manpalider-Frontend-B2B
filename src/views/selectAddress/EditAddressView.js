import React, { Component } from 'react';
import { Footer, NavBar, Session } from "../../components";
import { config, DISPATCH_ID, ROLES, VIEW_NAME, SERVICE_RESPONSE } from "../../libs/utils/Const";
import { connect } from "react-redux";
import { ApiClient } from "../../libs/apiClient/ApiClient";
import { SessionReducer } from '../../redux/reducers/SessionReducer';
import CurrencyFormat from 'react-currency-format';
import './EditAddress.css';
import { animateScroll as scroll, scroller } from 'react-scroll'

const apiClient = ApiClient.getInstance();
let totalCTax;
let CostoEnvio;
let fecha;

class EditAddressView extends Component {

    constructor(props) {
        super(props);
        this.state = {
        partRegister: 1,
        validateTax: true,
        url_mp: '',
        countries: [],
        states: [],
        cities: [],
        comunas: [],
        statesBill: [],
        citiesBill: [],
        comunasBill: [],
        colonias:[],
        coloniasBill:[],
        cfdi: [],

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
            suburbName: '',
            city: '',
            cityName: '',
            cp: '',
            country: 'MX',
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
            country: 'MX',
            countryName: '',
            state: '',
            stateName: '',
            taxID: '',
            cfdi: '',
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
        addressCosto: [],
        addressEnvioBillType: 'Envio'
    };
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    scrollToBottom() {
        scroll.scrollToTop({
            duration: 1200,
            delay: 50,
            smooth: 'easeOutQuart',
            isDynamic: true
          })
    }

    async componentDidMount() {
        const { enableSpinner, notificationReducer: { showAlert }, sessionReducer: { addresses }} = this.props;
        
        enableSpinner(true);
        
        // let response = await apiClient.getCountries();
        await this.newAddress();
        await this.newBill();
        let responseCFDI = await apiClient.getCFDI();
        this.getCostosAddress();

        enableSpinner(false);

        this.setState({
            // countries: response.data || [],
            cfdis: responseCFDI.data || [],
        });

        this.scrollToBottom();
    }

    getCostosAddress = async () => {
        const { sessionReducer: { addresses }} = this.props;
        const { addressCosto } = this.state;
        let addressCostoNuevo = [];

        for (let i = 0; i < addresses.length; i++) {
            let address = addresses[i];
            addressCostoNuevo.push({
                AddrType: address.AddrType,
                Address: address.Address,
                Address2: address.Address2,
                Address3: address.Address3,
                AdresType: address.AdresType,
                AltCrdName: address.AltCrdName,
                AltTaxId: address.AltTaxId,
                Block: address.Block,
                Building: address.Building,
                CardCode: address.CardCode,
                City: address.City,
                Country: address.Country,
                CountryName: address.CountryName,
                County: address.County,
                GlblLocNum: address.GlblLocNum,
                LicTradNum: address.LicTradNum,
                LineNum: address.LineNum,
                LogInstanc: address.LogInstanc,
                Ntnlty: address.Ntnlty,
                ObjType: address.ObjType,
                State: address.State,
                StateName: address.StateName,
                Street: address.Street,
                StreetNo: address.StreetNo,
                TaxCode: address.TaxCode,
                TaxOffice: address.TaxOffice,
                UserSign: address.UserSign,
                ZipCode: address.ZipCode,
                // costoEnvio: resultData.costoEnvio,
                // costoTotal: resultData.total,
            });
        }
        this.setState({
            addressCosto : addressCostoNuevo
        });
    }

    getStates = async () => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        const { address: { country } } = this.state;
        enableSpinner(true);
        let response = await apiClient.getStates('MX');
        enableSpinner(false);

        this.setState({
            states: response.data || [],
        });  
    };

    getStatesBill = async () => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        const { bill: { country } } = this.state;
        enableSpinner(true);
        let response = await apiClient.getStates('MX');

        this.setState({
            states: response.data || [],
        });

        setTimeout(() => {
            enableSpinner(false);
        }, 100)
    };

    getCities = async () => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        const { address: { state } } = this.state;
        enableSpinner(true);
        let response = await apiClient.getCities(state);

        this.setState({
            cities: response.data || [],
        })

        setTimeout(() => {
            enableSpinner(false);
        }, 100)
    };

    getCitiesBill = async () => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        const { bill: { state } } = this.state;
        enableSpinner(true);
        let response = await apiClient.getCities(state);

        this.setState({
            cities: response.data || [],
        })

        setTimeout(() => {
            enableSpinner(false);
        }, 100)
    };

    getComunas = async () => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        const { address: { city } } = this.state;
        enableSpinner(true);
        let response = await apiClient.getComunas(city);

        this.setState({
            comunas: response.data || [],
        })

        setTimeout(() => {
            enableSpinner(false);
        }, 100)
    };

    getComunasBill = async () => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        const { bill: { city } } = this.state;
        enableSpinner(true);
        let response = await apiClient.getComunas(city);

        this.setState({
            comunas: response.data || [],
        })

        setTimeout(() => {
            enableSpinner(false);
        }, 100)
    };

    setAddressKey = (key, value, value2 = '') => {
        let { address, countries, states, cities, comunas } = this.state;
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
        if (key === "city") {
            cities.forEach(city => {
                if (city.Code === value) {
                    address.cityName = city.Name;
                }
            })
        }
        if (key === "suburb") {
            comunas.forEach(comuna => {
                if (comuna.Code === value) {
                    address.suburbName = comuna.Name;
                }
            })
        }

        this.setState({
            address
        })
    };

    setBillKey = (key, value, value2 = '') => {
        let { bill, countries, states, cfdis, cities, comunas } = this.state;
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

        if (key === "city") {
            cities.forEach(city => {
                if (city.Code === value) {
                    bill.cityName = city.Name;
                }
            })
        }

        if (key === "suburb") {
            comunas.forEach(comuna => {
                if (comuna.Code === value) {
                    bill.suburbName = comuna.Name;
                }
            })
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
        const { enableSpinner, setAddresses, sessionReducer: { addresses, user }, notificationReducer: { showAlert } } = this.props;
        const { address } = this.state;

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
                if (addresses[i].AdresType === "B") {
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
            showAlert({ type: 'error', message: response.message, timeOut: 8000 });
            return;
        }

        setTimeout(() => {
            setAddresses(newAddresses);
            this.cancelAddress();
            this.getCostosAddress();

        }, 200);
    };

    saveBill = async () => {
        const { enableSpinner, setAddresses, sessionReducer: { addresses, user }, notificationReducer: { showAlert } } = this.props;
        const { bill } = this.state;

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
        if (bill.taxID === "") {
            addressFilter.TaxID = user.rfc;
        } else {
            addressFilter.TaxID = bill.taxID;
        }

        if (bill.cfdi === "") {
            addressFilter.cfdi = user.cfdi;
        } else {
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
            showAlert({ type: 'error', message: response.message, timeOut: 8000 });
            return;
        }

        setAddresses(newAddresses);
        this.cancelBill();
        this.getCostosAddress();


    };

    createAddress = async () => {
        const { enableSpinner, setAddresses, sessionReducer: { addresses, user }, notificationReducer: { showAlert } } = this.props;
        const { address, addressCosto } = this.state;

        let newAddresses = [];
        let addressFilter = {};

        if (!address.address  || address.address === "") return showAlert({
            type: 'warning',
            message: 'El nombre de la dirección no puede ir vacío',
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
                if (addresses[i].AdresType === "B") {
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
            showAlert({ type: 'error', message: response.message, timeOut: 8000 });
            return;
        }

        setAddresses(newAddresses);
        this.cancelAddress();
        this.cancelBill();

        this.setState({
            addressCosto : [],
        })
        

        setTimeout(() => {
            this.getCostosAddress();
            this.renderClientAddress();
        }, 150);
    };

    createBill = async () => {
        const { enableSpinner, setAddresses, sessionReducer: { addresses, user }, notificationReducer: { showAlert } } = this.props;
        const { bill } = this.state;

        let newAddresses = [];

        let addressFilter = {};

        if (!bill.address  || bill.address === "") return showAlert({
            type: 'warning',
            message: 'El nombre de la dirección no puede ir vacío',
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
        if (bill.taxID === "") {
            addressFilter.TaxID = user.rfc;
        } else {
            addressFilter.TaxID = bill.taxID;
        }
        if (bill.cfdi === "") {
            addressFilter.cfdi = user.cfdi;
        } else {
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
            showAlert({ type: 'error', message: response.message, timeOut: 8000 });
            return;
        }

        setAddresses(newAddresses);
        this.cancelBill();
    };

    cancelAddress = () => {
        const { address } = this.state;
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
        const { bill } = this.state;
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
    /*/////////////////////////////////////NUEVA y edcion de la DIRECCION DE ENVIO/////////////////////////////////////////////////// */
    renderFormNewAddress = () => {
        const { setAddress, setStreet, setSuburb, setCity, setCP, setCountry, setState, loginReducer } = this.props;
        const { sessionReducer: { role } } = this.props;
        const { address, countries, states, addressType, cities, comunas, colonias } = this.state;

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

        /////////////////////////EMPIEZA Y ES PARA AMBOS FORMULARIOS//////////////////////
        return <div className='row justify-content-center' style={{ margin: '0px auto'}}>
                <div className="col-md-12">
                    <h2>{title + ' '}dirección de envío</h2>
                </div>
                <div className="col-md-12" style = {{backgroundColor: 'white', padding: 20, borderRadius: 20}}>     
                {/*No mover estos campos */}
                {role === ROLES.CLIENT && <>
                    <div className="row justify-content-start">
                        <div className="form__group">
                            <label htmlFor="name" className="form__label">Alias de la dirección</label>
                            {addressType === "new" ?
                                <input
                                    type="text"
                                    className="form__input text-left"
                                    name="handel_calle_register"
                                    placeholder="Alias de la dirección"
                                    autoComplete={'new-id'}
                                    style={{ textAlign: 'center', height: 30 , fontWeight: 'bold'}}
                                    value={address.address}
                                    id="name"
                                    onChange={(event) => this.setAddressKey('address', event.target.value)}
                                />
                                
                            :
                                <input
                                    type="text"
                                    className="form__input text-left"
                                    name="handel_calle_register"
                                    placeholder="Alias de la dirección"
                                    autoComplete={'new-id'}
                                    style={{ textAlign: 'center', height: 30 , fontWeight: 'bold'}}
                                    value={address.address}
                                    id="name"
                                    onChange={(event) => this.setAddressKey('address', event.target.value)}
                                    disabled
                                />
                            }
                            {/* <label htmlFor="name" className="form__label">Alias de la dirección</label> */}
                        </div>
                    </div>
                </>}
                {/**De aqui en adelante se edita */}
                <div className="" style={{marginTop: 10}}>
                     <div className="row justify-content-start">
                        <div className="form__group">
                            <label htmlFor="cp" className="form__label">Código postal</label>
                            <input
                                type="text"
                                className="form__input text-left"
                                name="handel_cp_register"
                                placeholder="Código postal"
                                autoComplete={'new-cp_register'}
                                style={{textAlign: 'center', height: 30}}
                                value={address.cp}
                                id="cp"
                                onChange={(event) => {
                                    this.setAddressKey('cp', event.target.value)
                                    setTimeout(() => {
                                        this.getDataCP()
                                    }, 250);
                                }}
                            />
                            {/* <label htmlFor="cp" className="form__label">Código postal</label> */}
                        </div>
                        <div className="form__group">
                            <label htmlFor="cars" className="form__label">Estado</label>
                            <input
                                type="text"
                                className="form__input text-left"
                                name="handel_state_register"
                                placeholder="Estado" 
                                autoComplete={'state_register'}
                                style={{textAlign: 'center', height: 30}}
                                value={address.stateName} 
                                onChange={(event) => this.setAddressKey('state', event.target.value)}
                                disabled
                            />
                            {/* <label htmlFor="cars" className="form__label">Estado</label> */}
                        </div>
                    </div>
                </div>
                <div className="" style={{marginTop: 10}}>
                    <div className="row justify-content-start">
                        <div className="form__group">
                            <label htmlFor="city" className="form__label">Ciudad</label>
                            <input
                                type="text"
                                className="form__input text-left"
                                name="handel_city_register"
                                placeholder="Ciudad"
                                autoComplete={'new-register'}
                                style={{textAlign: 'center', height: 30}}
                                value={address.city}
                                id="city"
                                onChange={(event) => this.setAddressKey('city', event.target.value)}
                                disabled
                            />
                            {/* <label htmlFor="city" className="form__label">Ciudad</label> */}
                        </div>
                        <div className="form__group">
                            <label htmlFor="suburb" className="form__label">Colonia</label>
                            <select id="cars" 
                                name="handel_suburb_register"
                                autoComplete={'state_register'}
                                placeholder="Colonia"
                                value={address.suburb}
                                autoComplete={'new-suburb'}
                                id="suburb"
                                className="form-control addressForm form-control-lg m-3 text-left"
                                onChange={(event) => this.setAddressKey('suburb', event.target.value)}
                                style={{textAlign: 'center', height: 30, padding: 0}}
                            >
                                <option value=''>Selecciona una colonia</option>
                                {colonias.map( (colonia, index) => {
                                    return <option value={colonia} key={index}>{colonia}</option>
                                })}
                            </select>
                            {/* <label htmlFor="suburb" className="form__label">Colonia</label> */}
                        </div>
                    </div>
                </div>
                <div className="" style={{marginTop: 10}}>
                    <div className="row justify-content-start">
                        <div className="form__group">
                            <label htmlFor="stree" className="form__label">Calle y número</label>
                            <input
                                type="text"
                                className="form__input text-left"
                                name="handel_street_register"
                                placeholder="Calle y número"
                                style={{textAlign: 'center', height: 30}}
                                autoComplete={'new-street'}
                                value={address.street}
                                id="street"
                                onChange={(event) => this.setAddressKey('street', event.target.value)}
                            />
                            {/* <label htmlFor="stree" className="form__label">Calle y número</label> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-12">
                <div className="row justify-content-start">
                    <div className="col-md-2">
                        {role === ROLES.CLIENT && <div className=" col-xs-4" style={{ marginTop: 10 }}>
                            <button
                                onClick={action}
                                className="btn btn-primary btn-lg"
                                style={{
                                    backgroundColor: config.navBar.backgroundColor,
                                    color: config.navBar.textColor,
                                    fontWeight: "bold",
                                }}>
                                Guardar
                            </button>
                        </div>}
                    </div>
                    <div className="col-md-2">
                        {role === ROLES.CLIENT && <div className=" col-xs-4" style={{ marginTop: 10 }}>
                            <button
                                onClick={this.cancelAddress}
                                className="btn btn-lg"
                                style={{
                                    backgroundColor: config.navBar.backgroundColor,
                                    color: config.navBar.textColor,
                                }}>
                                Cancelar
                            </button>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    };

    renderFormNewBill = () => {

        const { sessionReducer: { role, user } } = this.props;
        const { bill, countries, states, cfdis, addressType, cities, comunas, coloniasBill } = this.state;

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

        return <div className='row' style={{ margin: '0px auto'}} id='selectBillViewForm'>
            <div className="col-md-12">
                <h2>{title + ' '}dirección de facturación</h2>
            </div>
            <div className="col-md-12" style = {{backgroundColor: "white" , padding: 20, borderRadius: 20}}>
                {role === ROLES.CLIENT && <div className="">
                    <div className="row justify-content-start">
                        <div className="form__group">
                            <label htmlFor="name" className="form__label">Alias de la dirección</label>
                            {addressType === "new" ?
                                <input
                                    type="text"
                                    className="form__input text-left md-form"
                                    name="handel_calle_register"
                                    placeholder="Alias de la dirección"
                                    autoComplete={'new-id'}
                                    style={{ textAlign: 'center', height: 30 ,fontWeight: 'bold'}}
                                    value={bill.address}
                                    id="name"
                                    onChange={(event) => this.setBillKey('address', event.target.value)}
                                /> :
                                <input
                                    type="text"
                                    className="form__input text-left"
                                    name="handel_calle_register"
                                    placeholder="Alias de la dirección"
                                    autoComplete={'new-id'}
                                    style={{ textAlign: 'center', height: 30 ,fontWeight: 'bold'}}
                                    value={bill.address}
                                    id="name"
                                    onChange={(event) => this.setBillKey('address', event.target.value)}
                                    disabled
                                />
                            
                            }
                            {/* <label htmlFor="name" className="form__label">Alias de la dirección</label> */}
                        </div>
                    </div>
                </div>}
                <div className="" style={{ marginTop: 10 }}>
                    <div className="row justify-content-start">
                        <div className="form__group">
                            <label htmlFor="rfc" className="form__label">R.F.C.</label>
                            <input
                                type="text"
                                className="form__input text-left"
                                name="handel_taxid_register"
                                placeholder="R.F.C."
                                autoComplete={'new-id'}
                                style={{ textAlign: 'center', height: 30 }}
                                value={bill.taxID || user.rfc}
                                id="rfc"
                                onChange={(event) => this.setBillKey('taxID', event.target.value)}
                            />
                            {/* <label htmlFor="rfc" className="form__label">R.F.C.</label> */}
                        </div>
                    </div>
                </div>
                <div className="" style={{marginTop: 10}}>
                     <div className="row justify-content-start">
                        <div className="form__group">
                            <label htmlFor="cars" className="form__label">Uso de CFDI</label>
                            <select id="cars" 
                                name="handel_country_register" 
                                autoComplete={'new_country_register'}
                                placeholder="CFDI" value={bill.cfdi || user.cfdi}
                                className="form-control addressForm form-control-lg m-3 text-left"
                                onChange={(event) => {
                                    this.setBillKey('cfdi', event.target.value);
                                }}
                                style={{textAlign: 'center', height: 33, padding: 0}}
                            >
                                <option value=''>Selecciona el uso de su CFDI</option>
                                {cfdis.map(cdfi => {
                                    return <option value={cdfi.CfdiCode} key={cdfi.CfdiCode}>{cdfi.CfdiCode +" - "+ cdfi.CfdiName}</option>
                                })}
                            </select>
                            {/* <label htmlFor="cars" className="form__label">Uso de CFDI</label> */}
                        </div>
                    </div>
                </div>
                <div className="" style={{marginTop: 10}}>
                    <div className="row justify-content-start">
                        <div className="form__group">
                            <label htmlFor="cp" className="form__label">Código postal</label>
                            <input
                                type="text"
                                className="form__input text-left"
                                name="handel_cp_register"
                                placeholder="Código postal"
                                autoComplete={'new-cp_register'}
                                style={{textAlign: 'center', height: 30}}
                                value={bill.cp}
                                id="cp"
                                onChange={(event) => {
                                    this.setBillKey('cp', event.target.value);
                                    setTimeout(() => {
                                        this.getDataCPBill()
                                    }, 250);
                                }}
                            />
                            {/* <label htmlFor="cp" className="form__label">Código postal</label> */}
                        </div>
                        <div className="form__group">
                            <label htmlFor="cars" className="form__label">Estado</label>
                            <input
                                type="text"
                                className="form__input text-left"
                                name="handel_state_register"
                                placeholder="Estado" 
                                autoComplete={'state_register'}
                                style={{textAlign: 'center', height: 30}}
                                value={bill.stateName}
                                onChange={(event) => this.setBillKey('state', event.target.value)}
                                disabled
                            />
                            {/* <label htmlFor="cars" className="form__label">Estado</label> */}
                        </div>
                    </div>
                </div>
                <div className="" style={{marginTop: 10}}>
                    <div className="row justify-content-start">
                        <div className="form__group">
                            <label htmlFor="city" className="form__label">Ciudad</label>
                            <input
                                type="text"
                                className="form__input text-left"
                                name="handel_city_register"
                                placeholder="Ciudad"
                                autoComplete={'new-register'}
                                style={{textAlign: 'center', height: 30}}
                                value={bill.city}
                                id="city"
                                onChange={(event) => this.setBillKey('city', event.target.value)}
                                disabled
                            />
                            {/* <label htmlFor="city" className="form__label">Ciudad</label> */}
                        </div>
                        <div className="form__group">
                            <label htmlFor="suburb" className="form__label">Colonia</label>
                            <select id="cars" 
                                name="handel_suburb_register"
                                autoComplete={'state_register'}
                                placeholder="Colonia"
                                value={bill.suburb}
                                autoComplete={'new-suburb'}
                                id="suburb"
                                className="form-control addressForm form-control-lg m-3 text-left"
                                onChange={(event) => this.setBillKey('suburb', event.target.value)}
                                style={{textAlign: 'center', height: 30, padding: 0}}
                            >
                                <option value=''>Selecciona una colonia</option>
                                {coloniasBill.map( (colonia, index) => {
                                    return <option value={colonia} key={index}>{colonia}</option>
                                })}
                            </select>
                            {/* <label htmlFor="suburb" className="form__label">Colonia</label> */}
                        </div>
                    </div>
                </div>
                <div className="" style={{marginTop: 10}}>
                    <div className="row justify-content-start">
                        <div className="form-group">
                            <label htmlFor="stree" className="form__label">Calle y número</label>
                            <input
                                type="text"
                                className="form__input text-left"
                                name="handel_street_register"
                                placeholder="Calle y número"
                                style={{textAlign: 'center', height: 30}}
                                autoComplete={'new-street'}
                                value={bill.street}
                                id="street"
                                onChange={(event) => this.setBillKey('street', event.target.value)}
                            />
                            {/* <label htmlFor="stree" className="form__label">Calle y número</label> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-12">
                    <div className="row justify-content-start">
                        <div className="col-md-2">
                            {role === ROLES.CLIENT && <div className=" col-xs-4" style={{ marginTop: 10 }}>
                                <button
                                    onClick={action}
                                    className="btn btn-primary btn-lg"
                                    style={{
                                        backgroundColor: config.navBar.backgroundColor,
                                        color: config.navBar.textColor,
                                        fontWeight: "bold",
                                    }}>
                                    Guardar
                                </button>
                            </div>}
                        </div>
                        <div className="col-md-2">
                            {role === ROLES.CLIENT && <div className=" col-xs-4" style={{ marginTop: 10 }}>
                                <button
                                    onClick={this.cancelBill}
                                    className="btn btn-lg"
                                    style={{
                                        backgroundColor: config.navBar.backgroundColor,
                                        color: config.navBar.textColor,
                                    }}>
                                    Cancelar
                                </button>
                            </div>}
                        </div>
                    </div>
                </div>
        </div>
    };

    editAddress = addressValue => {
        const { address } = this.state;
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
        const { bill } = this.state;
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
        const { address } = this.state;
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
            //states: [],
        })
    };

    newBill = async () => {
        const { bill } = this.state;
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
            //states: [],
        })
    };

    renderClientAddress = () => {
        const { sessionReducer: { addresses } } = this.props;
        const { addressCosto } = this.state;
        return <div className='container-fluid row' style={{ margin: 0, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {config.modules.Address && 
            <div className="col-sm-12">
                <p onClick={this.newAddress} style={{ cursor: 'pointer', color: config.shoppingList.summaryList }}>
                    <i style={{ marginRight: 5 }} className={config.icons.backOrderTrue}></i>
                    <span style={{ fontSize: 16 }}>Agregar una nueva dirección de envío</span>
                </p>
            </div>
            }
            {addressCosto.map(address => {
                if (address.AdresType === "S") {
                    return <div className="col-sm-12" key={address.Address}>
                        {localStorage.setItem("CodigoPostal", address.ZipCode)}
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title">
                                    {address.Address}
                                </h5>
                                <p className="card-text">{(address.Street || '') + ', ' + (address.Block || '') + ', ' + (address.City || '') + ', ' + (address.StateName || '') + ', ' + (address.CountryName || '') + ', ' + (address.ZipCode || '')}</p>
                                {config.modules.EditAddress && 
                                <button className="btn btn-primary" style={{ backgroundColor: config.navBar.backgroundColor, color: config.navBar.textColor, fontWeight: "bold" }} onClick={() => this.editAddress(address)}>
                                    Editar dirección
                                </button>
                                }
                            </div>
                        </div>
                    </div>
                }
            })}
        </div>
    };
    renderClientABill = () => {
        const { sessionReducer: { addresses, user } } = this.props;
        return <div className='container-fluid row' style={{ margin: 0, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {config.modules.Address &&
            <div className="col-sm-12">
                <p onClick={this.newBill} style={{ cursor: 'pointer', color: config.shoppingList.summaryList }}>
                    <i style={{ marginRight: 5 }} className={config.icons.backOrderTrue}></i>
                    <span style={{ fontSize: 16 }}>Agregar una nueva dirección de facturación</span>
                </p>
            </div>
            }
            {addresses.map(address => {
                if (address.AdresType === "B") {
                    return <div className="col-sm-12" key={address.Address}>
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title">
                                    {address.Address}
                                </h5>
                                <p className="card-text">{(address.Street || '') + ', ' + (address.Block || '') + ', ' + (address.City || '') + ', ' + (address.StateName || '') + ', ' + (address.CountryName || '') + ', ' + (address.ZipCode || '')}</p>
                                {config.modules.EditAddress && 
                                <button className="btn btn-primary" style={{ backgroundColor: config.navBar.backgroundColor, color: config.navBar.textColor, fontWeight: "bold" }} onClick={() => this.editBill(address)}>
                                    Editar dirección
                                </button>
                                }
                            </div>
                        </div>
                    </div>
                }
            })}
        </div>
    };

    selectAddress = event => {
        this.setState({
            showAddress: false,
            addressKeyEnabled: true,
            addressKeySelect: event.nativeEvent.target.value || '',
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
        const { notificationReducer: { showAlert } } = this.props;
        const { address, addressKeySelect } = this.state;

        if (!address.name) {
            showAlert({ type: 'warning', message: 'Introduzca un nombre de comprador' });
            return false;
        }

        if (!address.email) {
            showAlert({ type: 'warning', message: 'Introduzca un correo de comprador' });
            return false;
        }

        if (!address.phone) {
            showAlert({ type: 'warning', message: 'Introduzca un teléfono de comprador' });
            return false;
        }

        if (!address.name) {
            showAlert({ type: 'warning', message: 'Introduzca un nombre de comprador' });
            return false;
        }

        if (!address.street) {
            showAlert({ type: 'warning', message: 'Introduzca una calle' });
            return false;
        }

        if (!address.suburb) {
            showAlert({ type: 'warning', message: 'Introduzca una colonia' });
            return false;
        }

        if (!address.city) {
            showAlert({ type: 'warning', message: 'Introduzca una ciudad' });
            return false;
        }

        if (!address.cp) {
            showAlert({ type: 'warning', message: 'Introduzca un código postal' });
            return false;
        }

        if (!address.country) {
            showAlert({ type: 'warning', message: 'Introduzca un país' });
            return false;
        }

        if (!address.state) {
            showAlert({ type: 'warning', message: 'Introduzca un estado' });
            return false;
        }

        return true;
    };

    continue = () => {
        const { sessionReducer: { role, addresses }, notificationReducer: { showAlert }, configReducer: { history } } = this.props;
        const { address, addressKeySelect, billKeySelect, paymentMethodSelect, addressCosto } = this.state;
        let newAddress;
        let newBill;
        let costototal;
        if (role === ROLES.CLIENT) {
            if (!addressKeySelect) return showAlert({ type: 'warning', message: 'Selecciona una dirección de envío' })

            addressCosto.map(addressFilter => {
                if (addressFilter.Address === addressKeySelect) {
                    newAddress = addressFilter;
                    costototal = addressFilter.costoTotal;
                }
            })
        }
        if (role === ROLES.CLIENT) {
            if (!billKeySelect) return showAlert({ type: 'warning', message: 'Selecciona una dirección de facturación' })
            if (billKeySelect === "same") {
                addresses.map(addressFilter => {
                    if (addressFilter.Address === addressKeySelect) {
                        newBill = addressFilter
                    }
                })
            } else {
                addresses.map(addressFilter => {
                    if (addressFilter.Address === billKeySelect) {
                        newBill = addressFilter
                    }
                })
            }
        }

        if (role === ROLES.PUBLIC) {
            if (!this.validateForm()) return;
            newAddress = address;
        }

        if (!paymentMethodSelect) return showAlert({ type: 'warning', message: 'Selecciona un método de pago' });

        let data = {
            address: newAddress,
            bill: newBill,
            paymentMethod: paymentMethodSelect,
            date: new Date(),
            total: costototal
        };
        localStorage.setItem("CodeEnvio", newAddress.ZipCode);
        if (paymentMethodSelect === 'mercadoPago') {
            this.getURLPayMercado(costototal);
        }

        sessionStorage.setItem('validateOrder', JSON.stringify(data));

        history.goValidateOrder();
    };
    getURLPayMercado = async (totalCTax = null) => {
        await apiClient.getPreferenceMP(totalCTax).then(response => {
            URL = response.data.sandbox_init_point;
            return response.data.sandbox_init_point;
        });
        localStorage.setItem(config.general.localStorageNamed + 'goToMP', URL);
        this.setState({
            url_mp: URL
        });
    }

    selectPaymentMethod = event => {
        this.setState({
            paymentMethodEnabled: true,
            paymentMethodSelect: event.nativeEvent.target.value || '',
        })
    };

    onChangeTypeAddress = event => {
        this.cancelAddress();
        this.cancelBill();
        this.setState({
            addressEnvioBillType: event.nativeEvent.target.value || 'Envio',
        })
    };
   
    render() {
        const { history, sessionReducer: { role } } = this.props;
        const { showAddress, showBill, addressKeyEnabled, paymentMethodEnabled,addressEnvioBillType } = this.state;
       
        return (
            <div className="content-fluid" style={{ marginTop: 150, backgroundColor: config.Back.backgroundColor }}>
                <Session history={history} view={VIEW_NAME.EDIT_ADDRESS_VIEW}></Session>
                <NavBar />
                <div className="row mb-sm-4" style={{ marginLeft: 10, marginRight: 10, paddingTop:120}}> 
                    <div className="col-sm-4">
                        <h4>Tipo de dirección: </h4>
                    </div>
                    <div className="col-sm-2">
                        <select id="typeAddress" name="typeAddress"
                                placeholder="Tipo de dirección" value={addressEnvioBillType} className="form-control form-control-lg text-left"
                                onChange={(event) => this.onChangeTypeAddress(event)}
                                style={{textAlign: 'center', height: 30, padding: 0}}>
                            <option defaultValue value='Envio'>Envío</option>
                            <option value='Bill'>Facturación</option>
                        </select>
                    </div>
                    {/* <div className="col-sm-7">
                        <div style={{ textAlign: 'center' }}>
                            {(showAddress || role == ROLES.PUBLIC) && this.renderFormNewAddress()}
                            {(showBill || role == ROLES.PUBLIC) && this.renderFormNewBill()}
                        </div>
                    </div> */}
                </div><br/>
                <div className="row pb-4 mt-2" style={{ marginLeft: 10, marginRight: 10, minHeight: '70vh'}}>
                    {addressEnvioBillType === 'Envio' &&
                        <>
                            <div className="col-sm-8 pb-2">
                                <div className="card style-articles-cart" style={{ borderColor: '#0060EA', borderRadius: 20}}>
                                    <div className="card-header" style={{ background: "#0060EA", borderTopRightRadius: 20, borderTopLeftRadius: 20  }}>
                                        <h5 className="card-title" style={{ color: config.shoppingList.textProductList }}>
                                            Direcciones de envío:
                                            </h5>
                                    </div>
                                    <div className="card-body">
                                        {role !== ROLES.PUBLIC && this.renderClientAddress()}
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-sm-8 pb-2">
                                {(showAddress || role == ROLES.PUBLIC) && this.renderFormNewAddress()}
                            </div> */}
                        </>
                    }
                    {addressEnvioBillType === 'Bill' &&
                        <>
                            <div className="col-sm-8 pb-2">
                                <div className="card style-articles-cart" style={{ borderColor: '#ADADAD', borderRadius: 20 }}>
                                    <div className="card-header" style={{ background: "#ADADAD", borderTopRightRadius: 20, borderTopLeftRadius: 20  }}>
                                        <h5 className="card-title" style={{ color: config.shoppingList.textProductList }}>
                                            Direcciones de facturación:
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        {role !== ROLES.PUBLIC && this.renderClientABill()}
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-sm-8 pb-2">
                                {(showBill || role == ROLES.PUBLIC) && this.renderFormNewBill()}
                            </div> */}
                        </>
                    }
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
        shoppingCartReducer: store.ShoppingCartReducer
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
        setAddresses: value => dispatch({ type: DISPATCH_ID.SESSION_SET_ADDRESSES, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditAddressView);
