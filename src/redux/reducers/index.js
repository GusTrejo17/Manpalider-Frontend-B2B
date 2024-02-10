import { combineReducers } from 'redux';
import { LoginReducer } from './LoginReducer';
import { SessionReducer } from './SessionReducer';
import { SalesPersonReducer } from './SalesPersonReducer';
import { NotificationReducer } from './NotificationReducer';
import { ConfigReducer } from './ConfigReducer';
import { ShoppingCartReducer } from './ShoppingCartReducer';
import { ItemsReducer } from './ItemsReducer';

export const reducers = combineReducers({
    LoginReducer,
    SessionReducer,
    NotificationReducer,
    ConfigReducer,
    ShoppingCartReducer,
    ItemsReducer,
    SalesPersonReducer
});