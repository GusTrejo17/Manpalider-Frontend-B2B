import React, {Component} from 'react';
import {ApiClient} from "../libs/apiClient/ApiClient";
import {config, DISPATCH_ID, ROLES, SERVICE_API, SERVICE_RESPONSE} from "../libs/utils/Const";
import {connect} from "react-redux";
import Modal from './Modal';
import $ from 'jquery';

let modal = new Modal();

let apiClient = ApiClient.getInstance();

class SearchItemsActions extends Component {

    componentDidMount() {
        const {setSearchItemsByKeyReference, setSearchItemsByCategoriesReference, updateFavoriteReference, addShoppingCartReference, addBackOrderReference,
             deleteShoppingCartReference, deleteBackOrderReference, openItemDetailsReference} = this.props;
        setSearchItemsByKeyReference(this.searchItemsByKey);
        updateFavoriteReference(this.updateFavorite);
        addShoppingCartReference(this.addShoppingCart);
        addBackOrderReference(this.addBackOrder);
        deleteBackOrderReference(this.deleteBackOrder);
        deleteShoppingCartReference(this.deleteShoppingCart);
        openItemDetailsReference(this.openItemDetails);
        setSearchItemsByCategoriesReference(this.searchItemsByCategories);
        this.searchAutoComplete();
        this.searchItemsByCategoriesHome2();
    }
    getSpecialPrice = async ()=>{
        const {sessionReducer: {role}, specialPrice, notificationReducer: {showAlert}, configReducer: {history}, enableSpinner} = this.props;
        let response = await apiClient.getSpecialPrice();
        response = response.data ? response.data : [];
        specialPrice(response);
    }

    searchAutoComplete = async () => {
        const {setItemsAutoComplete} = this.props;
      
        let suggestions = [];
            let apiResponse = await apiClient.AutoComplete();
          suggestions = apiResponse.data.data;
        setItemsAutoComplete(suggestions);
    }
    
    searchItemsByKey = async ( page = 0, view = null, isPagination = false ) => {
        const {setShowBrandsCopy,setLocation,sessionReducer: {role}, itemsReducer,setItemsCategories, setItemsFilters, setItemsSearch,setTotalRows, notificationReducer: {showAlert}, configReducer: {history}, enableSpinner,itemsReducer:{sortFilterValue,location}} = this.props;
        let key = 'FindAll';
        let uniqueFilter = '';
        let user = {};
        let whs = '';
        let currentUser = {};
        // if(location === 'menuCategories'){
        //     await setLocation('')
        // }
        try {
            user = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
            currentUser = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'CurrentUser'));
            whs = user.U_FMB_Handel_ALMA || '01';
        } catch (error) {
            whs = '01';
            currentUser = {};
        }
        if (itemsReducer.search && itemsReducer.search !== '') {
            
            key = itemsReducer.search;
        }

        // if(uniqueFilter.length !== 0  && page == 0){
        //     console.log('con>entra if view',view);
            
        //     if(view == null) {
        //         console.log("Filtros activos");
                //  setItemsFilters({});
                 
        //     }
        // } 

        if(itemsReducer.uniqueFilter && !isPagination){
            uniqueFilter = Object.entries(itemsReducer.uniqueFilter).length !== 0 ? itemsReducer.uniqueFilter : '';
        }else if(itemsReducer.uniqueFilter && isPagination){
            setItemsFilters({});
            uniqueFilter = '';
        }

        let localShoppingCart = undefined;
        if (role === ROLES.PUBLIC) {
            localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');
            localShoppingCart = JSON.parse(localShoppingCart) || [];
        }

        enableSpinner(true);
        let response = null;
        //comenar por si falla
        if(view === "Lite"){
            uniqueFilter = 
            {property: 'searchLite', value: '1'};
        }
        let k2 = key.split(/[~,]/)
        let key1 = ''  
        for (let index = 0; index < k2.length; index++) {
            const element = k2[index];
            if(element.trim() !== '' && element.length>=3){
                key1 = element.trim();
                index = k2.length
            }
            
        }
        // key1 = key1.replace(/[']/, '');
        let search = {
            key: key1 || key,
            localShoppingCart: localShoppingCart,
            whs: whs,
            page: page,
            uniqueFilter: uniqueFilter,
            view:view,
            sortFilterValue
        }
        response = await apiClient.searchByKey(search);
        page = page === 0 ? 1 : page / 30 + 1;
        localStorage.setItem('currentPage', page);
        enableSpinner(false);
        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            await setItemsSearch(response.data.results);            
            await setTotalRows(response.data.totalRows);
            await setItemsCategories(response.data.allCategories);
            await this.applyFilters(response.data.results);
            await setShowBrandsCopy(false)
            // setItemsFilters({});
            if(view === 'marcaOne'){
                history.goItemsPolar();
            }else if(view === 'marcaTwo' ){
                history.goItemsBlanca(); 
            }else if(view === 'marcaThree' ){
                history.goItemsRoutlet(); 
            }else if(view === 'vitrinaView' ){
                // history.goItemsRoutlet();
            }else if(view === 'marcaFour' ){
                history.goItemsMarcaFour();
            }else if(view === 'marcaFive' ){
                history.goItemsMarcaFive();
            }else if(view === 'Lite'){
                history.goQuote();
            }else{
                history.goItems();
            }
            return;
        }
        if (currentUser === null){
            showAlert({type: 'warning', message: "No se ha seleccioando un cliente", timeOut: 8000});

        }else{
            showAlert({type: 'error', message: response.message, timeOut: 8000});
            
        }
    };

    itemsSort = async (items)=>{
        const {itemsReducer:{sortFilterValue},setItemsSearch} = this.props
        if(sortFilterValue === 'maxprice'){
            items.sort((a, b) => b.PrecioFinal - a.PrecioFinal);
        }else if(sortFilterValue === 'minprice'){
            items.sort((a, b) => a.PrecioFinal - b.PrecioFinal);
        }else if (sortFilterValue === 'masnuevo'){

        }
        await setItemsSearch(items)
    }

    searchItemsByCategories = async (category, page = 0,view = null,isPagination = false) => {
        const {setShowBrandsCopy,itemsReducer,itemsReducer: { searchCategoryObj },sessionReducer: {role}, setItemsCategories,setItemsSearch,setTotalRows, notificationReducer: {showAlert}, configReducer: {history}, enableSpinner,setCategory,setIdCategory,setItemsFilters} = this.props;
        let whs = '';
        let user = {};
        let currentUser = {};
        let uniqueFilter = '';

        try {
            user = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
            currentUser = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'CurrentUser'));
            whs = user.U_FMB_Handel_ALMA || '01';
        } catch (error) {
            whs = '01';
            currentUser = {};

        }

        let localShoppingCart = undefined;
        if (role === ROLES.PUBLIC) {
            localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');
            localShoppingCart = JSON.parse(localShoppingCart) || [];
        }
        if(itemsReducer.uniqueFilter && !isPagination){
            uniqueFilter = Object.entries(itemsReducer.uniqueFilter).length !== 0 ? itemsReducer.uniqueFilter : '';
        }else if(itemsReducer.uniqueFilter && isPagination){
            setItemsFilters({});
            uniqueFilter = '';
        }
        enableSpinner(true);
        let response = await apiClient.searchByCategory( await searchCategoryObj,uniqueFilter, localShoppingCart, whs, page);
        page = page === 0 ? 1 : page / 30 + 1;
        localStorage.setItem('currentPage', page);
        enableSpinner(false);
        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            await setItemsSearch(response.data.results);
            await setTotalRows(response.data.totalRows);
            await setItemsCategories(response.data.allCategories);
            await setShowBrandsCopy(false)
            this.applyFilters(response.data.results);
            setTimeout(() => {
                if(view === 'marcaOne'){
                    history.goItemsPolar();
                }else if(view === 'marcaTwo' ){
                    history.goItemsBlanca(); 
                }else if(view === 'marcaThree' ){
                    history.goItemsRoutlet(); 
                }else if(view === 'vitrinaView' ){
                    // history.goItemsRoutlet();
                }else if(view === 'marcaFour' ){
                    history.goItemsMarcaFour();
                }else if(view === 'marcaFive' ){
                    history.goItemsMarcaFive();
                }else if(view === 'Lite' ){
                    history.goQuote();
                }else{
                    history.goItems();
                }
                
            }, 500);
            setCategory("");
            if(this.props.itemsReducer.location !== 'menuCategories'){
                setIdCategory("");
            }
            return;
        }
        if (currentUser === null){
            showAlert({type: 'warning', message: "No se ha seleccioando un cliente", timeOut: 8000});

        }else{
            showAlert({type: 'error', message: response.message, timeOut: 8000});
            
        }
    };
 

    applyFilters = async  (data) => {
        const {setItemsFilterSearch, enableSpinner} = this.props;
        // enableSpinner(true);
        await setItemsFilterSearch(data);
        // enableSpinner(false);

        $("#menuCategories").removeClass('open-menu-categories');
    };

    searchItemsByCategoriesHome2 = async category => {
        const {sessionReducer: {role}, setItemsSearch1, setItemsSearch2, notificationReducer: {showAlert}, enableSpinner} = this.props;
        
        let localShoppingCart = undefined;
        let whs = '';
        let user = {};
        if (role === ROLES.PUBLIC) {
            localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');
            localShoppingCart = JSON.parse(localShoppingCart) || [];
        }

        try {
            user = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
            whs = user.U_FMB_Handel_ALMA || '';
        } catch (error) {
            whs = '01'
        }

        enableSpinner(true);

        let busqueda2 = {
            contenido: {
                opcion: "nuevosproductos",
                limit: 20
            }
        };
        await apiClient.ProductsEspecial(busqueda2, localShoppingCart, whs, 0).then((result) => {
            setItemsSearch1(result.data.responseBody);
            setItemsSearch2(result.data.responseBody2);
        });
        enableSpinner(false);
    };

    // applyFilters1 = data => {
    //     const {setItemsFilterSearch1, enableSpinner} = this.props;
    //     enableSpinner(true);
    //     setItemsFilterSearch1(data);
    //     enableSpinner(false);
    //     $("#menuCategories").removeClass('open-menu-categories');
    // };

    // applyFilters2 = data => {
    //     const {setItemsFilterSearch2, enableSpinner} = this.props;
    //     enableSpinner(true);
    //     setItemsFilterSearch2(data);
    //     enableSpinner(false);

    //     $("#menuCategories").removeClass('open-menu-categories');
    // };

    updateFavorite = async item => {
        const {sessionReducer: {role}, itemsReducer: {items}, notificationReducer: {showAlert}, enableSpinner} = this.props;
        //console.log("addFavorite", item);


        if (role === ROLES.PUBLIC) {
            await this.needToCreateAccount();
            return;
        }
        enableSpinner(true);
        let response = await apiClient.updateFavorite(item);
        enableSpinner(false);
        if (response.status === SERVICE_RESPONSE.ERROR) {
            showAlert({type: 'error', message: response.message, timeOut: 8000});
            return;
        }
        item.favorite = response.data.value; // change item details

        items.filter(itemFilter => {
            if (item.ItemCode === itemFilter.ItemCode) {
                itemFilter.favorite = response.data.value;
            }
        });

        this.applyFilters(items);

    };

    needToCreateAccount = () => {
        modal.loginModal('show');
    };

    addShoppingCart = async data => {
        const {enableSpinner,itemsReducer: {items: itemsSearch}, sessionReducer: {role}, shoppingCartReducer: {items}, notificationReducer: {showAlert}, setShoppingCart} = this.props;

        if (role === ROLES.PUBLIC) {
            this.addShoppingCartPublic(data);
            return;
        }
        enableSpinner(true);
        //console.log('DBADDCART',data);
        let response = await apiClient.updateShoppingCart(data);
        enableSpinner(false);
        if (response.status === SERVICE_RESPONSE.ERROR) {
            showAlert({type: 'error', message: response.message, timeOut: 8000});
            return;
        }

        let exist = response.data.value;

        if (!exist) {
            items.push({ItemCode: data.item.ItemCode, quantity: data.quantity});
            setShoppingCart(items);
        }

        let newItem = undefined;
        itemsSearch.map(itemFilter => {
            if (itemFilter.ItemCode === data.item.ItemCode) {
                itemFilter.quantity = data.quantity;
                newItem = data.item;
                newItem.quantity = data.quantity;
            }
        });

 /*       let newItemShooping = undefined;
        items.map( itemShopping => {
            if (itemShopping.ItemCode === data.item.ItemCode) {
                itemShopping.quantity = data.quantity;
                newItemShooping = data.item;
                newItemShooping.quantity = data.quantity;
            }
        });
*/
        this.applyFilters(itemsSearch);
        //this.changeInfoDetails(newItem);
        //this.changeShoppingCart(items);
    };

    addShoppingCartPublic = async data => {
        const {itemsReducer: {items: itemsSearch}, shoppingCartReducer: {items}, setShoppingCart} = this.props;
        //console.log("addShoppingCart", data);

        let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');
        localShoppingCart = JSON.parse(localShoppingCart) || [];

        let exist = localShoppingCart.filter((itemFilter) => {
            return (itemFilter.ItemCode === data.item.ItemCode)
        });

        if (!exist.length) {
            localShoppingCart.push({ItemCode: data.item.ItemCode, quantity: data.quantity});
            items.push({ItemCode: data.item.ItemCode, quantity: data.quantity});
        } else {
            localShoppingCart.map((itemMap) => {
                if (data.item.ItemCode === itemMap.ItemCode) {
                    itemMap.quantity = data.quantity;
                }
            });
            items.map((itemMap) => {
                if (data.item.ItemCode === itemMap.ItemCode) {
                    itemMap.quantity = data.quantity;
                }
            });
        }


        let newItem = undefined;
        itemsSearch.map(itemFilter => {
            if (itemFilter.ItemCode === data.item.ItemCode) {
                itemFilter.quantity = data.quantity;
                newItem = data.item;
                newItem.quantity = data.quantity;
            }
        });

        /*let newItemShooping = undefined;
        localShoppingCart.map( itemShopping => {
            if (itemShopping.ItemCode === data.item.ItemCode) {
                itemShopping.quantity = data.quantity;
                newItemShooping = data.item;
                newItemShooping.quantity = data.quantity;
            }
        });
*/
        items.map( itemFilter => {
            if(data.item.ItemCode === itemFilter.ItemCode){
                itemFilter.quantity = data.quantity;
            }
        });

        localStorage.setItem(config.general.localStorageNamed + 'shoppingCart', JSON.stringify(localShoppingCart));
        setShoppingCart(items);

        this.applyFilters(itemsSearch);
        //this.changeInfoDetails(newItem);
    };


    deleteShoppingCart = async data => {
        const {itemsReducer: {items: itemsSearch}, sessionReducer: {role}, shoppingCartReducer: {items}, notificationReducer: {showAlert}, setShoppingCart} = this.props;

        if (role === ROLES.PUBLIC) {
            this.deleteShoppingCartPublic(data);
            return;
        }

        let response = await apiClient.deleteShoppingCart(data);
        if (response.status === SERVICE_RESPONSE.ERROR) {
            showAlert({type: 'error', message: response.message, timeOut: 8000});
            return;
        }

        let newItems = items.filter(itemFilter => {
            return (itemFilter.ItemCode !== data.item.ItemCode)
        });

        if (data.deleteAll) {
            newItems = [];
        }
        setShoppingCart(newItems);

        let newItem = undefined;
        itemsSearch.map(itemFilter => {
            if (itemFilter.ItemCode === data.item.ItemCode) {
                itemFilter.quantity = '';
                newItem = data.item;
                newItem.quantity = '';
            }
        });
        this.applyFilters(itemsSearch);
      //  this.changeInfoDetails(newItem);
    };

    deleteShoppingCartPublic = data => {
        const {itemsReducer: {items: itemsSearch},shoppingCartReducer: {items}, setItemsSearch, setShoppingCart} = this.props;
        //console.log("deleteShoppingCart", data);

        let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');

        localShoppingCart = JSON.parse(localShoppingCart) || [];

        let newItems = items.filter(itemFilter => {
            return (itemFilter.ItemCode !== data.item.ItemCode)
        });

        if (data.deleteAll) {
            newItems = [];
        }

        localStorage.setItem(config.general.localStorageNamed + 'shoppingCart', JSON.stringify(newItems));
        setShoppingCart(newItems);

        let newItem = undefined;
        itemsSearch.map(itemFilter => {
            if (itemFilter.ItemCode === data.item.ItemCode) {
                itemFilter.quantity = '';
                newItem = data.item;
                newItem.quantity = '';
            }
        });
        this.applyFilters(itemsSearch);
        //this.changeInfoDetails(newItem);
    };

    addBackOrder = async data => {
        const {itemsReducer: {items}, sessionReducer: {role}, shoppingCartReducer: {backOrder}, notificationReducer: {showAlert}, enableSpinner, setBackOrder} = this.props;
        //console.log("addBackOrder", data);

        if(Number(data.quantity) >= 100){
            items.map(itemFilter => {
                if (itemFilter.ItemCode === data.item.ItemCode) {
                    data.quantity = itemFilter.OnHandPrincipal >= 100 ? "100" : itemFilter.OnHandPrincipal;
                }
            });
            
            showAlert({type: 'warning', message: 'Se excede el número maximo de articulos ', timeOut: 8000});
        }

        if (role === ROLES.PUBLIC) {
            this.needToCreateAccount();
            return;
        }

        enableSpinner(true);
        let response = await apiClient.updateBackOrder(data);
        enableSpinner(false);
        if (response.status === SERVICE_RESPONSE.ERROR) {
            showAlert({type: 'error', message: response.message, timeOut: 8000});
            return;
        }

        let exist = response.data.value;
        if (!exist) {
            backOrder.push({ItemCode: data.item.ItemCode, quantity: data.quantity});
            setBackOrder(backOrder);
        }

        let newItem = undefined;
        items.map(itemFilter => {
            if (itemFilter.ItemCode === data.item.ItemCode) {
                itemFilter.backOrder = true;
                newItem = data.item;
                newItem.backOrder = true;
            }
        });
        this.applyFilters(items);
        //this.changeInfoDetails(newItem);
    };


    deleteBackOrder = async data => {
        const {itemsReducer: {items}, sessionReducer: {role}, shoppingCartReducer: {backOrder}, notificationReducer: {showAlert}, enableSpinner, setBackOrder} = this.props;
        //console.log("deleteBackOrder", data);

        if (role === ROLES.PUBLIC) {
            this.needToCreateAccount();
            return;
        }

        enableSpinner(true);
        let response = await apiClient.deleteBackOrder(data);
        enableSpinner(false);
        if (response.status === SERVICE_RESPONSE.ERROR) {
            showAlert({type: 'error', message: response.message, timeOut: 8000});
            return;
        }

        let newItems = backOrder.filter(itemFilter => {
            return (itemFilter.ItemCode !== data.item.ItemCode)
        });

        if (data.deleteAll) {
            newItems = [];
        }


        setBackOrder(newItems);

        let newItem = undefined;
        items.map(itemFilter => {
            if (itemFilter.ItemCode === data.item.ItemCode) {
                itemFilter.backOrder = false;
                newItem = data.item;
                newItem.backOrder = false;
            }
        });
        this.applyFilters(items);
        //this.changeInfoDetails(newItem);
    };

    openItemDetails = async item => {
        const {sessionReducer: {role}, setItemDetailsSearch, notificationReducer: {showAlert}, configReducer: {history}, enableSpinner} = this.props;
        let localShoppingCart = undefined;
        if (role === ROLES.PUBLIC) {
            localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');
            localShoppingCart = JSON.parse(localShoppingCart) || [];
        }

        enableSpinner(true);
        let response = await apiClient.openItemDetails(item.ItemCode, localShoppingCart);
        let stockDetails = await apiClient.getStockDetails(item.ItemCode);
        enableSpinner(false);
        if (response.status === SERVICE_RESPONSE.ERROR) {
            showAlert({type: 'error', message: response.message, timeOut: 8000});
            return;
        }

        let images = [];
        // Imagen del comentario en SAP
        // images.push({path: (response.data.PicturName ? (config.BASE_URL + SERVICE_API.getImage + '/' + response.data.PicturName) : require('../images/noImage.png'))});

        // Arreglo de imagenes del campo extra
        let imagesArray = response.data.U_Handel_ImagesArray || '';
        imagesArray = imagesArray.split('|');
        imagesArray.map( image => {
            if(image){
                images.push({path: (image ? (config.BASE_URL + SERVICE_API.getImage + '/' + image) : require('../images/noImage.png'))});
            }
        });

        // Arreglo de fichas tecnicas 
        let files = [];
        let fileArray = response.data.U_Handel_attachment || '';
        fileArray = fileArray.split('|');
        //console.log("splittttttttt", fileArray)
        fileArray.map( file => {
            if(file){
                files.push({path: (file ? (config.BASE_URL + SERVICE_API.getFile + '/' + file) : '' ), name: file});
            }
        });

        response.data.images = images;
        response.data.files = files;
        response.data.stockDetails = stockDetails?.data ?? [];

        setItemDetailsSearch(response.data);

        setTimeout(() => {
            // modal.itemDetails('show');
            history.goItemsDetails();
        }, 10)

    };

    changeInfoDetails = item => {
        const {setItemDetailsSearch} = this.props;
        if (item) {
            setItemDetailsSearch(item);
        }
    };

    render() {
        return (
            <div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
        sessionReducer: store.SessionReducer,
        shoppingCartReducer: store.ShoppingCartReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openItemDetailsReference: value => dispatch({type: DISPATCH_ID.ITEMS_OPEN_ITEM_DETAILS_REFERENCE, value}),
        updateFavoriteReference: value => dispatch({type: DISPATCH_ID.ITEMS_UPDATE_FAVORITE_REFERENCE, value}),
        addShoppingCartReference: value => dispatch({type: DISPATCH_ID.ITEMS_ADD_SHOPPING_CART_REFERENCE, value}),
        addBackOrderReference: value => dispatch({type: DISPATCH_ID.ITEMS_ADD_BACK_ORDER_REFERENCE, value}),
        deleteBackOrderReference: value => dispatch({type: DISPATCH_ID.ITEMS_DELETE_BACK_ORDER_REFERENCE, value}),
        deleteShoppingCartReference: value => dispatch({type: DISPATCH_ID.ITEMS_DELETE_SHOPPING_CART_REFERENCE, value}),
        setSearchItemsByKeyReference: value => dispatch({type: DISPATCH_ID.ITEMS_SET_SEARCH_BY_KEY_REFERENCE, value}),
        setSearchItemsByCategoriesReference: value => dispatch({type: DISPATCH_ID.ITEMS_SET_SEARCH_BY_CATEGORIES_REFERENCE, value}),
        setItemsSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SET_ITEMS, value}),
        setItemsFilterSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER, value}),
        setTotalRows : value => dispatch({type: DISPATCH_ID.ITEMS_SET_TOTALROWS, value}),
        setItemDetailsSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SET_ITEM_DETAILS, value}),
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        setShoppingCart: value => dispatch({type: DISPATCH_ID.SHOPPING_CART_SAVE_CART, value}),
        setBackOrder: value => dispatch({type: DISPATCH_ID.SHOPPING_CART_SAVE_BACK_ORDER, value}),
        setItemsCategories: value => dispatch({type: DISPATCH_ID.ITEMS_SET_CATEGORIES, value}), 
        setItemsFilters: value => dispatch({type: DISPATCH_ID.ITEMS_SET_UNIQUE_FILTER, value}), 
        setItemsAutoComplete: value => dispatch({type: DISPATCH_ID.ITEMS_SET_AUTO_COMPLETE, value}), 
        specialPrice : value => dispatch({type: DISPATCH_ID.ITEMS_SPECIAL_PRICES, value}),
        setItemsSearch1: value => dispatch({type: DISPATCH_ID.ITEMS_SET_ITEMS1, value}),
        setItemsSearch2: value => dispatch({type: DISPATCH_ID.ITEMS_SET_ITEMS2, value}),
        setItemsFilterSearch1: value => dispatch({type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER1, value}),
        setItemsFilterSearch2: value => dispatch({type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER2, value}), 
        setCategory: value => dispatch({type: DISPATCH_ID.ITEMS_SET_CATEGORY, value}),
        setIdCategory: value => dispatch({type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value}), 
        setLocation: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_LOCATION, value }),
        setShowBrandsCopy:  value => dispatch({ type: DISPATCH_ID.ITEMS_SHOW_BRANDS_COPY, value }),
        
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchItemsActions)