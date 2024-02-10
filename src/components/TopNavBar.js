import React, { Component } from 'react';
import { DISPATCH_ID, SERVICE_RESPONSE, config, ROLES, VIEW_NAME } from '../libs/utils/Const';
import { connect } from 'react-redux';
import { ApiClient } from "../libs/apiClient/ApiClient";
import $ from 'jquery';
import moment from 'moment';

let apiClient = ApiClient.getInstance();

class TopNavBar extends Component {

    handleViews = async (opcion, page = 0) => {
        const { itemsReducer, setIdCategory, setLocation, configReducer: { history } } = this.props;
        setIdCategory(null);
        setLocation(opcion);
        await itemsReducer.searchByKey(0, opcion, true);
    }


    render() {
        const { setSearch } = this.props;
        return (
            <div className="categorias" style={{ width: "auto", maxWidth: "100%" }}>
                <ul className="nav justify-content-center ">
                    <li className="nav-item col-lg-3 col-md-6" onClick={() => {  this.handleViews("promocion") }} style={{ marginTop: "auto", marginBottom: "auto" }}>
                        {/* <a className="nav-link text-white font-weight-bold botonePrincipales" value="Promociones" ></a> */}
                        {/* <img src={config.trademarks.prmoRed} className="Img-fluid"></img> */}
                    </li>
                    <li className="nav-item col-lg-3 col-md-6" onClick={() => { setSearch(""); this.handleViews("masvendidos") }} style={{ marginTop: "auto", marginBottom: "auto" }}>
                        {/* <a className="nav-link text-white font-weight-bold botonePrincipales" value="Más vendidos">NOVEDADES</a> */}
                        {/* <img src={config.trademarks.novedades} className="Img-fluid"></img> */}
                    </li>
                    <li className="nav-item col-lg-3 col-md-6" onClick={() => { setSearch(""); this.handleViews("nuevosproductos") }} style={{ marginTop: "auto", marginBottom: "auto" }}>
                        {/* <a className="nav-link text-white font-weight-bold botonePrincipales" value="Nuevos Productos">MÁS BUSCADOS</a> */}
                        {/* <img src={config.trademarks.buscados} className="Img-fluid"></img> */}
                    </li>
                    <li className="nav-item col-lg-3 col-md-6" onClick={() => { setSearch(""); this.handleViews("remates") }} style={{ marginTop: "auto", marginBottom: "auto" }}>
                        {/* <a className="nav-link text-white font-weight-bold botonePrincipales" value="Remates">NUEVAMENTE DISPONIBLES</a> */}
                        {/* <img src={config.trademarks.disponible} className="Img-fluid"></img> */}
                    </li>
                </ul>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        sessionReducer: store.SessionReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
        itemsReducer: store.ItemsReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_SEARCH, value }),
        setIdCategory: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value }),
        setLocation: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_LOCATION, value }),
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
        setItemsSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEMS, value }),
        setItemsFilterSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER, value }),
        setTotalRows: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_TOTALROWS, value }),
        setItemsCategories: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_CATEGORIES, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TopNavBar);