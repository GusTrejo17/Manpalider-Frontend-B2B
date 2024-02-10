import { DISPATCH_ID } from '../../libs/utils/Const';

export const ItemsReducer = (state = { items: [], itemsFilter: [], tags: [], itemDetails: {}, search: '', category: '', searchItemsFilter: '', searchByKey: null, searchByCategories: null, openItemDetails: null, updateFavorite: null, addShoppingCart:null, addBackOrder: null, deleteBackOrder:null, deleteShoppingCart: null, TotalPage: 0, nextPage: 0, idCategory: null,location:null, searchByDashOption:null, specialPrice:null, itemsCategories :{},itemsAutoComplete :[],uniqueFilter : {},items1: [],items2: [], itemsFilter2: [], searchItemsFilter1: '',searchItemsFilter2: '',sortFilterValue:'',itmsRelated:[],categories:[],category1:[],category2:[],category3:[],searchCategoryObj:{},showCopy:false,brandsCopy:[],categoryBanner:[]}, action) => {
    switch (action.type) {
        case DISPATCH_ID.ITEMS_SET_ITEMS:
            return Object.assign({}, state, { items: action.value, searchItemsFilter: state.search || state.category });
        case DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER:
            return Object.assign({}, state, { itemsFilter: action.value });
        case DISPATCH_ID.ITEMS_SET_ITEMS1:
            return Object.assign({}, state, { items1: action.value, searchItemsFilter1: state.search || state.category });
        case DISPATCH_ID.ITEMS_SET_ITEMS2:
            return Object.assign({}, state, { items2: action.value, searchItemsFilter2: state.search || state.category });

        case DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER2:
            return Object.assign({}, state, { itemsFilter2: action.value });
        case DISPATCH_ID.ITEMS_SET_ITEM_DETAILS:
            return Object.assign({}, state, { itemDetails: action.value });
        case DISPATCH_ID.ITEMS_SET_SEARCH:
            return Object.assign({}, state, { search: action.value, category: '' });
        case DISPATCH_ID.ITEMS_SET_CATEGORY:
            return Object.assign({}, state, { category: action.value, search: '' });
        case DISPATCH_ID.ITEMS_SAVE_TAGS:
            return Object.assign({}, state, { tags: action.value });
        case DISPATCH_ID.ITEMS_OPEN_ITEM_DETAILS_REFERENCE:
            return Object.assign({}, state, { openItemDetails: action.value });
        case DISPATCH_ID.ITEMS_UPDATE_FAVORITE_REFERENCE:
            return Object.assign({}, state, { updateFavorite: action.value });
        case DISPATCH_ID.ITEMS_ADD_SHOPPING_CART_REFERENCE:
            return Object.assign({}, state, { addShoppingCart: action.value });
        case DISPATCH_ID.ITEMS_ADD_BACK_ORDER_REFERENCE:
            return Object.assign({}, state, { addBackOrder: action.value });
        case DISPATCH_ID.ITEMS_DELETE_BACK_ORDER_REFERENCE:
            return Object.assign({}, state, { deleteBackOrder: action.value });
        case DISPATCH_ID.ITEMS_DELETE_SHOPPING_CART_REFERENCE:
            return Object.assign({}, state, { deleteShoppingCart: action.value });
        case DISPATCH_ID.ITEMS_SET_SEARCH_BY_KEY_REFERENCE:
            return Object.assign({}, state, { searchByKey: action.value });
        case DISPATCH_ID.ITEMS_SET_SEARCH_BY_CATEGORIES_REFERENCE:
            return Object.assign({}, state, { searchByCategories: action.value });
        case DISPATCH_ID.ITEMS_SET_SEARCH_BY_DASH_OPTION:
            return Object.assign({}, state, { searchByDashOption: action.value});
        case DISPATCH_ID.ITEMS_SET_TOTALROWS:
            return Object.assign({}, state, { TotalPage: action.value });
        case DISPATCH_ID.ITEMS_SET_NEXTPAGE:
            return Object.assign({}, state, { nextPage: action.value });
        case DISPATCH_ID.ITEMS_SET_IDCATEGORY:
            return Object.assign({}, state, { idCategory: action.value });
        case DISPATCH_ID.ITEMS_SET_LOCATION:
            return Object.assign({}, state, { location: action.value });
        case DISPATCH_ID.ITEMS_SET_CATEGORIES:
            return Object.assign({}, state, { itemsCategories: action.value });
        case DISPATCH_ID.ITEMS_SET_AUTO_COMPLETE:
            return Object.assign({}, state, { itemsAutoComplete: action.value });
        case DISPATCH_ID.ITEMS_SPECIAL_PRICES:
            return Object.assign({}, state, { specialPrice: action.value });
        case DISPATCH_ID.ITEMS_SET_UNIQUE_FILTER:
            return Object.assign({}, state, { uniqueFilter: action.value });
        case DISPATCH_ID.ITEMS_SET_SORT_FILTER:
            return Object.assign({}, state, { sortFilterValue: action.value });
        case DISPATCH_ID.ITEMS_SET_RELATED_CART:
            return Object.assign({}, state, { itmsRelated: action.value });
        case DISPATCH_ID.ITEMS_BRANDS:
            return Object.assign({}, state, { categories: action.value });
        case DISPATCH_ID.ITEMS_CATEGORY_1:
            return Object.assign({}, state, { category1: action.value });
        case DISPATCH_ID.ITEMS_CATEGORY_2:
            return Object.assign({}, state, { category2: action.value });
        case DISPATCH_ID.ITEMS_CATEGORY_3:
            return Object.assign({}, state, { category3: action.value });
        case DISPATCH_ID.ITEMS_CATEGORY_SEARCH:
            return Object.assign({}, state, { searchCategoryObj: action.value });
        case DISPATCH_ID.ITEMS_SHOW_BRANDS_COPY:
            return Object.assign({}, state, { showCopy: action.value });
        case DISPATCH_ID.ITEMS_BRANDS_COPY:
            return Object.assign({}, state, { brandsCopy: action.value });
        case DISPATCH_ID.ITEMS_SET_CATEGORIES_BANNER:
            return Object.assign({}, state, { categoryBanner: action.value });
        case DISPATCH_ID.ITEMS_CLEAN_REDUCER:
            return Object.assign({}, state, { items: [], itemsFilter: [], tags: [], itemDetails: {}, search: '', category: '', searchItemsFilter: '', searchByDashOption: null, searchByKey:null, searchByCategories: null, openItemDetails: null, updateFavorite: null, addShoppingCart:null, addBackOrder: null, deleteBackOrder:null, deleteShoppingCart: null , specialPrice: null, idCategory: null,sortFilterValue: '',itmsRelated:[],categories:[],category1:[],category2:[],category3:[],searchCategoryObj:{},showCopy:false,brandsCopy:[],categoryBanner:[]});
        default:
            return state;
    }
};
