import React, {Component} from 'react';
import {NavBar, Session, ItemsList, ItemDetailsModal, Footer} from "../../components";
import {config, DISPATCH_ID, VIEW_NAME} from "../../libs/utils/Const";
import {connect} from "react-redux";

class ItemsView extends Component {

    search = '';

    changeQuantity = (index, item, newQuantity, addItem) => {
        const {itemsReducer : { addShoppingCart, deleteShoppingCart }} = this.props;
        if(addItem){
            addShoppingCart({item, quantity: (newQuantity || '1')})
        }else{
            deleteShoppingCart({item, deleteAll: false});
        }
    };

    changeBackOrder= (item, addItem) => {
        const {itemsReducer : {deleteBackOrder, addBackOrder}} = this.props;
        if(addItem){
            addBackOrder({item, quantity: 1})
        }else{
            deleteBackOrder({item, deleteAll: false});
        }
    };

    render() {
        const {history,itemsReducer : { itemsFilter, searchItemsFilter, updateFavorite, deleteShoppingCart, openItemDetails }} = this.props;
        // console.log("itemsfliter",itemsFilter);
        return (
            <div className="content-fluid" style={{marginTop: 69}}>
                <div className="row mb-4" style={{paddingTop:25,margin:0}}>
                    <div className="col-md-12 col-sm-12" style={{margin:0, minHeight: '70vh'}}>
                        {itemsFilter.length !== 0 ? (
                            <ItemsList
                                items={itemsFilter}
                                updateFavorite={updateFavorite}
                                openDetails={openItemDetails}
                                changeQuantity={this.changeQuantity}
                                deleteShoppingCart={deleteShoppingCart}
                                changeBackOrder={this.changeBackOrder}
                            />
                        ) : (
                            <div style={{paddingTop:100, margin:0, textAlign: 'center'}}>No se encontraron productos con su búsqueda: <strong>{searchItemsFilter}</strong>
                                <br/>
                                <br/>
                                <i style={{fontSize: 70}} className={config.icons.search}></i>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setItemsSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SET_ITEMS, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemsView);