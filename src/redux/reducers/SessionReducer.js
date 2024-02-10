
import { DISPATCH_ID, ROLES } from '../../libs/utils/Const';

export const SessionReducer = (state = { role: ROLES.PUBLIC, user: {}, addresses: [], business: null, token: null, rememberUser: false, }, action) => {
    switch (action.type) {
        case DISPATCH_ID.SESSION_SET_ROLE:
            return Object.assign({}, state, { role: action.value });
        case DISPATCH_ID.SESSION_SET_USER:
            return Object.assign({}, state, { user: action.value });
        case DISPATCH_ID.SESSION_SET_ADDRESSES:
            return Object.assign({}, state, { addresses: action.value });
        case DISPATCH_ID.SESSION_SET_REMEMBER_USER:
            return Object.assign({}, state, { rememberUser: action.value });
        case DISPATCH_ID.SESSION_SET_TOKEN:
            return Object.assign({}, state, { token: action.value });
        case DISPATCH_ID.SESSION_SET_BUSINESS_ID:
            return Object.assign({}, state, { business: action.value });
        case DISPATCH_ID.SESSION_CLEAN_REDUCER:
            return Object.assign({}, state, { role: ROLES.PUBLIC, user: {}, business: null, token: null, rememberUser: false});
        default:
            return state;
    }
};