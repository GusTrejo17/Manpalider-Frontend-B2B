import { DISPATCH_ID } from '../../libs/utils/Const';

export const NotificationReducer = (state = { showAlert: null }, action) => {
    switch (action.type) {
        case DISPATCH_ID.NOTIFICATION_SET_ALERT_REFERENCE:
            return Object.assign({}, state, { showAlert: action.value });
        default:
            return state;
    }
};