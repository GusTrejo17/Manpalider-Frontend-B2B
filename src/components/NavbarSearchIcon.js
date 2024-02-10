import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import {DISPATCH_ID} from "../libs/utils/Const";
import {SearchItemsActions} from './index';


class NavbarSearchIcon extends Component {

    componentDidMount() {
        $(".ico-nav-shearch").click(function(){
            $(".form-buscar").toggle();
            $(".input-search-responsive").focus();
        });
    }

    search = async () => {
        const {itemsReducer} = this.props;
        await itemsReducer.searchByKey();
        $(".input-search-responsive").blur();
    };

    render() {
        const {itemsReducer, setSearch, icon, iconColor} = this.props;
        return (
            <span>
                <i className={icon + " ico-nav-shearch d-md-none"} style={{color: iconColor, padding: 0, fontSize:25}}/>
                <span className="form-buscar" style={{display:'none' }}>
                    <input type="text"
                           className="form-control text-center input-search-responsive"
                           placeholder="Buscar"
                           value={itemsReducer.search}
                           onChange={(event) => setSearch(event.target.value)}
                           onKeyDown={event => event.keyCode === 13 && this.search() }
                           onBlur={ () => $(".form-buscar").toggle()}
                    />
                </span>

            </span>

        );
    };

}


const mapStateToProps = store => {
    return {
        configReducer: store.ConfigReducer,
        itemsReducer: store.ItemsReducer,
        shoppingCartReducer: store.ShoppingCartReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SET_SEARCH, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NavbarSearchIcon)

