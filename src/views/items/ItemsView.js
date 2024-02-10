import React, {Component} from 'react';
import {NavBar, Session, ItemsList, ItemDetailsModal, Footer, Slider, CarouselDashboard, Suscription, TopNavBar, CarouselTrademarks} from "../../components";
import {config, DISPATCH_ID, VIEW_NAME, ROLES} from "../../libs/utils/Const";
import { ApiClient } from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import './ItemsView.css';
import { animateScroll as scroll, scroller } from 'react-scroll';

const apiClient = ApiClient.getInstance();

class ItemsView extends Component {
    
    constructor(props) {
        super(props);

        this.scrollToBottom = this.scrollToBottom.bind(this);
    };

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

    handelSubmit = async (opcion,page = 0) => {
        const { sessionReducer: {role}, enableSpinner, itemsReducer:{nextPage}, setTotalRows, setItemsSearch, configReducer: { history }, setItemsFilterSearch, setLocation, searchByDashOption } = this.props;
        //console.log("Valor boton", opcion);

        let whs = '';
        let user = {};
        // console.log('con>', nextPage);
        try {
            user = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
            whs = user.U_FMB_Handel_ALMA || '';
        } catch (error) {
            whs = '01'
        }
        let localShoppingCart = undefined;
        if (role === ROLES.PUBLIC) {
            localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');
            localShoppingCart = JSON.parse(localShoppingCart) || [];
        }
        //Hace la petición al back
        let busqueda = {
            contenido: {
                opcion: opcion
            }
        };
        setLocation('dash');
        searchByDashOption(opcion);

        enableSpinner(true);
        await apiClient.getProductsEspecial(busqueda,localShoppingCart, whs, page).then(result => {
            // console.log(result);
            enableSpinner(false);
            setItemsSearch(result.data.responseBody);
            setItemsFilterSearch(result.data.responseBody);
            setTotalRows(result.data.totalRows);
            history.goItems();
            return;
        });
        //Validamos la respuesta del Back
    };

    render() {
        const {history,itemsReducer : { itemsFilter, searchItemsFilter, updateFavorite, deleteShoppingCart, openItemDetails,location }} = this.props;
        //console.log(itemsFilter);
        //imprimir las variabls que recibe el itemList
        return (
            <div className="content-fluid" style={{marginTop: 130,backgroundColor:"#fff"}}>
                <Session history={history} view={VIEW_NAME.ITEMS_VIEW}/>
                <NavBar/>
                {/* <div style={{height:"1rem"}}></div> */}
                {/* Si es un video */}
                {config.dashboard === 'Video' && <Slider />}
                {/* Si es un video */}
                {/* {config.dashboard === 'Carousel' && <CarouselDashboard />} */}
                {/* sección de marcas */}
                {/* <TopNavBar/> */}
                <CarouselTrademarks/>
                {/**Comineza funcion */}
                <div className="row" style={{margin:0, paddingBottom: 20}}>
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
                            <div style={{paddingTop:100, margin:0, textAlign: 'center'}}>
                                {location==="favorites"?
                                <p> Aún no se tienen productos marcados como favoritos</p>:
                                <p>No se encontraron productos con su búsqueda: <strong>{searchItemsFilter}</strong></p>
                            }
                                <br/>
                                <br/>
                                <i style={{fontSize: 70}} className={config.icons.search}></i>
                            </div>
                        )}

                    </div>
                </div>
                <Suscription/>
                {/**Aqui termina la funcion  */}
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
        sessionReducer: store.SessionReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setItemsSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SET_ITEMS, value}),
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        setItemsFilterSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER, value}),
        setLocation:  value => dispatch({type: DISPATCH_ID.ITEMS_SET_LOCATION, value}),
        setTotalRows : value => dispatch({type: DISPATCH_ID.ITEMS_SET_TOTALROWS, value}),
        searchByDashOption: value => dispatch({type: DISPATCH_ID.ITEMS_SET_SEARCH_BY_DASH_OPTION, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemsView);