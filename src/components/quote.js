import React, {Component} from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import { config, ROLES, DISPATCH_ID } from '../libs/utils/Const';

class Quote extends Component {

    componentDidMount() {
        $('.cont-cart').hide();
    }

    // refresh = () => {
    //     const {shoppingCartReducer} = this.props;

    //     setTimeout(() => {
    //         if (shoppingCartReducer.items.length === 0) {
    //             $('.cont-cart').hide();
    //         } else {
    //             $('.cont-cart').show();
    //         }
    //     }, 50);
    // }
    render() {
        const {shoppingCartReducer, configReducer: { history }, icon, textColor2, textColor} = this.props;
        return (
            <span className="shooping">
                <img src={config.navBar.quote} className="Img-fluid"  onClick={() => history.goQuote()} />
            </span>
        );
    }
}

const mapStateToProps = store => {
    return {
        configReducer: store.ConfigReducer,
        shoppingCartReducer: store.ShoppingCartReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
        setItemsSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEMS, value }),
        setItemsFilterSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER, value }),
        setIdCategory: value => dispatch({type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value}),
        setNextPage:  value => dispatch({type: DISPATCH_ID.ITEMS_SET_NEXTPAGE, value}),
        setLocation:  value => dispatch({type: DISPATCH_ID.ITEMS_SET_LOCATION, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Quote)