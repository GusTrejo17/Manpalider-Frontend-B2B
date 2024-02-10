import { DISPATCH_ID } from '../../libs/utils/Const';

export const ShoppingCartReducer = (state = { items: [],  backOrder: [], getShoppingCart: null, shoppingCartId: null, itemsGift: []}, action) => {
    //console.log('SHOPING-CART-REDIUCER',action.type,action.value);
    switch (action.type) {
        case DISPATCH_ID.SHOPPING_CART_SAVE_CART:
            return Object.assign({}, state, { items: action.value });
        case DISPATCH_ID.SHOPPING_CART_SAVE_BACK_ORDER:
            return Object.assign({}, state, { backOrder: action.value });
        case DISPATCH_ID.SHOPPING_CART_GET_SHOPPING_CART_REFERENCE:
            return Object.assign({}, state, { getShoppingCart: action.value });
            case DISPATCH_ID.SHOPPING_CART_ITEMS_GIFT:
            return Object.assign({}, state, { itemsGift: action.value });
        default:
            return state ;
    }
    
};
