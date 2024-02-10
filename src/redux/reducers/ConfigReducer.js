import { DISPATCH_ID } from '../../libs/utils/Const';

export const ConfigReducer = (
    state = { spinner: false, promiseCount: 0, history: null, logOut: null, beforeUnload: null }, action) => {
    switch (action.type) {
        case DISPATCH_ID.CONFIG_SET_SPINNER:
            const { promiseCount } = state;
            let count = 0;
            let enable = false;

            if (action.value) {
                count = promiseCount + 1;
                enable = action.value;
            } else {
                count = promiseCount - 1;
            }

            if (count === 0) {
                enable = action.value;
            }

            return Object.assign({}, state, { spinner: enable, promiseCount: count });
        case DISPATCH_ID.CONFIG_SET_HISTORY_REFERENCE:
            return Object.assign({}, state, { history: action.value });
        case DISPATCH_ID.CONFIG_SET_LOG_OUT_REFERENCE:
            return Object.assign({}, state, { logOut: action.value });
        case DISPATCH_ID.CONFIG_SET_BEFORE_UNLOAD_REFERENCE:
            return Object.assign({}, state, { beforeUnload: action.value });
        case DISPATCH_ID.CONFIG_CLEAN_REDUCER:
            return Object.assign({}, state, { spinner: false, promiseCount: 0, history: null, logOut: null, beforeUnload: null });
        default:
            return state;
    }
};