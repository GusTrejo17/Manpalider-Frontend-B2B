import React, {Component} from 'react';
import {VIEW_NAME, OBJ_TYPE, config} from "../../libs/utils/Const";
import {Footer, NavBar, Session, BackOrderList} from "../../components";
import {connect} from "react-redux";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import { animateScroll as scroll, scroller } from 'react-scroll';

let apiClient = ApiClient.getInstance();

class BackOrderView extends Component {


    constructor(props) {
        super(props);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    };

    async componentDidMount(){
        this.scrollToBottom();
    };

    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
    }
    deleteItem = data => {
        const {itemsReducer: {deleteBackOrder}} = this.props;
        deleteBackOrder(data);
    };

    sendToShoppingCart = item => {
        const {shoppingCartReducer: {items},itemsReducer: {deleteBackOrder, addShoppingCart}} = this.props;
        deleteBackOrder({item, deleteAll: false});


        let exist = items.filter( itemFilter => {
            return (itemFilter.ItemCode === item.ItemCode)
        });
        //console.log("exist", exist);
        if (!exist.length) addShoppingCart({item, quantity: (item.quantity || '1')})
    };

    render() {
        const {history, shoppingCartReducer: {backOrder}, itemsReducer: {openItemDetails, deleteBackOrder}} = this.props;
        //console.log('render ', VIEW_NAME.BACK_ORDER_VIEW);

        return (
            <div className="content-fluid" style={{marginTop: 69, backgroundColor:"#FFFFFF"}}>
                <Session history={history} view={VIEW_NAME.BACK_ORDER_VIEW}/>
                <NavBar/>
                <div className="row mb-4" style={{paddingTop: 60, margin: 0}}>
                    <div className="col-md-10">
                        <div className="card style-articles-cart" style={{
                            marginBottom: 15,
                            borderColor: 'white',
                            border: '1px solid  rgba(124, 124, 125, 0.3)'
                        }}>

                            <div className="card-header" style={{background: config.shoppingList.productList}}>

                                <div className='row'>
                                    <h5 className="card-title col-12 col-sm-8" style={{color: config.shoppingList.textProductList}}> ARTÍCULOS EN TU
                                        LISTA DE DESEOS:</h5>
                                    <div className='text-right col-12 col-sm-4' style={{width: '100%'}}>
                                        {!!backOrder.length &&
                                        <div onClick={()=> deleteBackOrder({item: {}, deleteAll: true})} className='text-left text-sm-right'
                                             style={{cursor: 'pointer', color: 'red'}}>
                                            <i className="fa fa-trash"/> Eliminar todo
                                        </div>}
                                    </div>
                                </div>

                            </div>


                            <div className="card-body">
                                {!!backOrder.length ? <BackOrderList
                                        view={VIEW_NAME.BACK_ORDER_VIEW}
                                        data={backOrder}
                                        openDetails={openItemDetails}
                                        deleteItem={this.deleteItem}
                                        sendTo={this.sendToShoppingCart}
                                    /> :
                                    <div className='text-center' style={{fontSize: 30}}>
                                        Lista de deseos vacía
                                    </div>}
                            </div>


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
        sessionReducer: store.SessionReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
        shoppingCartReducer: store.ShoppingCartReducer
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BackOrderView);