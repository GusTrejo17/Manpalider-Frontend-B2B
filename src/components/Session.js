import React, {Component} from 'react';
import {DISPATCH_ID, ROLES, config, SERVICE_RESPONSE, VIEW_NAME} from '../libs/utils/Const';
import {connect} from "react-redux";
import History from './History';
import {ApiClient} from '../libs/apiClient/ApiClient.js';

let apiClient = ApiClient.getInstance();

class Session extends Component {

    async componentDidMount() {
        const {history, setHistoryReference, setGetShoppingCartReference} = this.props;

        setTimeout(() => {
            this.setupBeforeUnloadListener();
        }, 100);

        let historyClass = new History(history);
        await setHistoryReference(historyClass);
        await setGetShoppingCartReference(()=>{});//this.getShoppingCart

        await this.getShoppingCart();
        await this.getCategories();

    }

    getCategories = async () => {
        const {setTags} = this.props;
        let categories = localStorage.getItem(config.general.localStorageNamed + 'categories');
        categories = JSON.parse(categories);
        await setTags(categories || []);

        let response = await apiClient.getCategories();

        if(response.status === SERVICE_RESPONSE.SUCCESS){
            setTags(response.data.categories || []);
        }
    };

    getShoppingCart = async (isLogout = false) => {
        const {view, setRole, setAddresses, history, sessionReducer, enableSpinner, setShoppingCart, setBackOrder, notificationReducer: {showAlert}} = this.props;
        let shoppingCart = [];
        let backOrder = [];

        if ((view === VIEW_NAME.ABOUT_US_VIEW && !config.aboutUs.active) || (view === VIEW_NAME.CONTACT_US_VIEW && !config.contactUs.active )) {
            history.push('/');
            return;
        }

        if (!sessionReducer.token || !sessionReducer.user || isLogout) {
            setRole(ROLES.PUBLIC);
            if (view === VIEW_NAME.BACK_ORDER_VIEW || view === VIEW_NAME.PROFILE_VIEW || view === VIEW_NAME.ORDERS_VIEW) {
                history.push('/');
                return;
            }

            let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');

            localShoppingCart = JSON.parse(localShoppingCart);

            if (!localShoppingCart) {
                localStorage.setItem(config.general.localStorageNamed + 'shoppingCart', JSON.stringify([]));
            }
            shoppingCart = localShoppingCart || []
        } else {
            setRole(ROLES.CLIENT);
            let response = await apiClient.getProfile();
            if (response.status === SERVICE_RESPONSE.ERROR) {
            } else {
                shoppingCart = response.data.shoppingCart;
                backOrder = response.data.backOrder;
                setAddresses(response.data.addresses);
            }
        }

        if (view === VIEW_NAME.SHOPPING_CART_VIEW || view === VIEW_NAME.BACK_ORDER_VIEW || view === VIEW_NAME.VALIDATE_ORDER_VIEW) {
           
            let response = await apiClient.getShoppingCart(shoppingCart);
            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                shoppingCart = response.data.shoppingCart;
                backOrder = response.data.backOrder;
            } else {
                showAlert({type: 'error', message: "Aviso: "+response.message, timeOut: 8000});
            }

        }

        setShoppingCart(shoppingCart);
        setBackOrder(backOrder);
        
    };

    setupBeforeUnloadListener = () => {
        const {setBeforeUnloadReference} = this.props;
        setBeforeUnloadReference(
            window.addEventListener("beforeunload", (ev) => {
                ev.preventDefault();
                return this.doSomethingBeforeUnload();
            })
        );
    };

    doSomethingBeforeUnload = () => {
        const {sessionReducer, configReducer: {logOut}} = this.props;
        if (!sessionReducer.rememberUser) {
            logOut();
        }
    };

    render() {
        return (
            <div/>
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
        setRole: value => dispatch({type: DISPATCH_ID.SESSION_SET_ROLE, value}),
        setHistoryReference: value => dispatch({type: DISPATCH_ID.CONFIG_SET_HISTORY_REFERENCE, value}),
        setBeforeUnloadReference: value => dispatch({type: DISPATCH_ID.CONFIG_SET_BEFORE_UNLOAD_REFERENCE, value}),
        setGetShoppingCartReference: value => dispatch({type: DISPATCH_ID.SHOPPING_CART_GET_SHOPPING_CART_REFERENCE, value}),
        setShoppingCart: value => dispatch({type: DISPATCH_ID.SHOPPING_CART_SAVE_CART, value}),
        setBackOrder: value => dispatch({type: DISPATCH_ID.SHOPPING_CART_SAVE_BACK_ORDER, value}),
        setBusiness: value => dispatch({type: DISPATCH_ID.SESSION_SET_BUSINESS_ID, value}),
        setToken: value => dispatch({type: DISPATCH_ID.SESSION_SET_TOKEN, value}),
        setUser: value => dispatch({type: DISPATCH_ID.SESSION_SET_USER, value}),
        setAddresses: value => dispatch({type: DISPATCH_ID.SESSION_SET_ADDRESSES, value}),
        setRememberUser: value => dispatch({type: DISPATCH_ID.SESSION_SET_REMEMBER_USER, value}),
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        setTags: value => dispatch({type: DISPATCH_ID.ITEMS_SAVE_TAGS, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Session);