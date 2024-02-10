
import { DISPATCH_ID } from '../../libs/utils/Const';

export const LoginReducer = (
    state = { 
        user: '', 
        name: '', 
        rfc: '', 
        cfdi: '', 
        phone: '', 
        phone2: '',  
        password: '',
        validatePassword: '',
        addressOne:{
            address: '',
            street: '',
            suburb: '',
            city: '',
            cp: '',
            country: '',
            state: '',
        },
        billing:{
            address: '',
            street: '',
            suburb: '',
            city: '',
            cp: '',
            country: '',
            state: '',
        }
    }, action) => {
        const {addressOne,billing} = state;
        switch (action.type) {
            //Datos del Socio de negocios
            case DISPATCH_ID.LOGIN_SET_USER:
                return Object.assign({}, state, { user: action.value });
            case DISPATCH_ID.LOGIN_SET_NAME:
                return Object.assign({}, state, { name: action.value });
            case DISPATCH_ID.LOGIN_SET_RFC:
                return Object.assign({}, state, { rfc: action.value });
            case DISPATCH_ID.LOGIN_SET_CFDI:
                return Object.assign({}, state, { cfdi: action.value });
            case DISPATCH_ID.LOGIN_SET_PHONE:
                return Object.assign({}, state, { phone: action.value });
            case DISPATCH_ID.LOGIN_SET_PHONE_2:
                return Object.assign({}, state, { phone2: action.value });
            case DISPATCH_ID.LOGIN_SET_PASSWORD:
                return Object.assign({}, state, { password: action.value });
            case DISPATCH_ID.LOGIN_SET_VALIDATE_PASSWORD:
                return Object.assign({}, state, { validatePassword: action.value });
            //Datos de la direccion de envio
            case DISPATCH_ID.LOGIN_SET_ADDRESS:
                addressOne.address = action.value;
                return Object.assign({}, state, { addressOne: addressOne });
            case DISPATCH_ID.LOGIN_SET_STREET:
                addressOne.street = action.value;
                return Object.assign({}, state, { addressOne: addressOne });
            case DISPATCH_ID.LOGIN_SET_SUBURB:
                addressOne.suburb = action.value;
                return Object.assign({}, state, { addressOne: addressOne });
            case DISPATCH_ID.LOGIN_SET_CITY:
                addressOne.city = action.value;
                return Object.assign({}, state, { addressOne: addressOne });
            case DISPATCH_ID.LOGIN_SET_CP:
                addressOne.cp = action.value;
                return Object.assign({}, state, { addressOne: addressOne });
            case DISPATCH_ID.LOGIN_SET_COUNTRY:
                addressOne.country = action.value;
                return Object.assign({}, state, { addressOne: addressOne });
            case DISPATCH_ID.LOGIN_SET_STATE:
                addressOne.state = action.value;
                return Object.assign({}, state, { addressOne: addressOne });
            //Datos de la direccion de Facturacion
            case DISPATCH_ID.LOGIN_SET_ADDRESS_BILL:
                billing.address = action.value;
                return Object.assign({}, state, { billing: billing });
            case DISPATCH_ID.LOGIN_SET_STREET_BILL:
                billing.street = action.value;
                return Object.assign({}, state, { billing: billing });
            case DISPATCH_ID.LOGIN_SET_SUBURB_BILL:
                billing.suburb = action.value;
                return Object.assign({}, state, { billing: billing });
            case DISPATCH_ID.LOGIN_SET_CITY_BILL:
                billing.city = action.value;
                return Object.assign({}, state, { billing: billing });
            case DISPATCH_ID.LOGIN_SET_CP_BILL:
                billing.cp = action.value;
                return Object.assign({}, state, { billing: billing });
            case DISPATCH_ID.LOGIN_SET_COUNTRY_BILL:
                billing.country = action.value;
                return Object.assign({}, state, { billing: billing });
            case DISPATCH_ID.LOGIN_SET_STATE_BILL:
                billing.state = action.value;
                return Object.assign({}, state, { billing: billing });
            case DISPATCH_ID.LOGIN_CLEAN_REDUCER:
                return Object.assign({}, state, {  user: '', name: '', rfc: '', phone:'', phone2:'',  password: '', validatePassword: '',
                addressOne:{address: '', street: '', suburb: '', city: '', cp: '', country: '', state: ''},
                billing:{address: '', street: '', suburb: '', city: '', cp: '', country: '', state: ''}});
            default:
                return state;
        }
    }
;