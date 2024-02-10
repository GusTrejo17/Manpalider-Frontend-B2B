import React, { Component } from 'react';

import $ from 'jquery';
import { connect } from 'react-redux';
import CurrencyFormat from 'react-currency-format';
import { config, SERVICE_API, DISPATCH_ID } from "../libs/utils/Const";
import { ApiClient } from "../libs/apiClient/ApiClient";

class ItemsPromoModal extends Component {

    ModalTitle = () => {
        const { items, selectorType } = this.props;
        let title;
        title = `Bonificacion`
        return title;
    }
    renderBonificaciones = (allItem, index, itemsSelect, indexPack) => {
        const { items, selectorType, addItemsPromo } = this.props;
        let item = allItem.bonificacion;
        let imagesArray = item.U_Handel_ImagesArray || '';
        imagesArray = imagesArray.split('|');
        let imagenShow = imagesArray[0] ? (config.BASE_URL + SERVICE_API.getImage + '/' + imagesArray[0]) : require('../images/noImage.png');
        return (
            <tr style={{ backgroundColor: `${indexPack % 2 === 0 ? 'white' : '#F0F0F0'}` }} key={index}>
                <td>{index + 1}</td>
                <img className="img-fluid" style={{ maxHeight: 80 }}
                    src={imagenShow}
                    alt=""
                />
                {/* <th scope="row">{index+1}</th> */}

                <td>{item.idProducto}</td>
                <td>{item.ItemName}</td>
                <td>{item.cantidad}</td>
                <td>
                    {/* <input type="checkbox" checked/> */}
                    <button
                        className="btn btn-sm"
                        type="button"
                        style={{ backgroundColor: config.navBar.iconBackground, color: config.navBar.iconModal }}
                        onClick={() => (addItemsPromo(itemsSelect))}>
                        <i className="fas fa-plus-circle"></i>
                    </button>
                </td>
            </tr>)
    }
    render() {
        const { items, selectorType } = this.props;
        let itemsBonificacion = items.length > 0 ? items : [];
        return (

            <div className="modal fade" id="boniModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header" style={{ background: '#2d75bd' }}>
                            <h5 className="modal-title text-white" id="exampleModalLabel">{this.ModalTitle()}</h5>
                            <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div style={{ marginBottom: 0, height: 370, maxHeight: 370, overflow: 'auto' }}>
                                <table className="table scrolltable" >
                                    <thead style={{ textAlign: "-webkit-center" }}>
                                        <tr className="text-light bg-primary" >
                                            {/* <th scope="col">#</th> */}
                                            <th scope="col" style={{/*width:10*/ }}>#</th>
                                            <th scope="col" style={{/*width:80*/ }}></th>
                                            <th scope="col" style={{/*width:80*/ }}>Artículo</th>
                                            <th scope="col" style={{/*width:80*/ }}>Descripción</th>
                                            <th scope="col" style={{/*width:80*/ }}>Cantidad</th>
                                            <th scope="col" style={{/*width:20*/ }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemsBonificacion.map((items, indexPack) => {
                                            return (
                                                items.map((item, index) => {
                                                    return this.renderBonificaciones(item, index, items, indexPack)
                                                })
                                            )
                                        })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {/* <button type="button" className="btn btn-success" data-dismiss="modal">Continuar compra</button> */}
                        </div>
                    </div>
                </div>
            </div>


        );
    }
}


const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
        notificationReducer: store.NotificationReducer,
        configReducer: store.ConfigReducer,
        shoppingCartReducer: store.ShoppingCartReducer
    };
}

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
        setItemDetailsSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEM_DETAILS, value }),
        setItemsSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEMS, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ItemsPromoModal);