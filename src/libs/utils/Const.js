/*  Constantes del Proyecto */

//FMB
//import {default as configDefault} from '../empresas/fmbSolutions';

//JACUZZI
//import { default as configDefault } from '../empresas/jacuzzi';

//CIG
//import { default as configDefault } from '../empresas/cig';

//RedHogar
// import { default as configDefault } from '../empresas/redHogar';

//Casa instrumental
// import { default as configDefault } from '../empresas/casa';

//Diasa
import { default as configDefault } from '../empresas/diasa';



export const config = configDefault;

export const licence = '2025-01-16';

/* ===================== ACTIONS REDUCERS DISPATCH ==================== */

export const VIEW_NAME = {
    DASHBOARD_VIEW: 'dashboardView',
    LOGIN_VIEW: 'LoginView',
    RED_ZONE_VIEW: 'RedCompensasZoneView',
    TERMS_VIEW: 'TermsView',
    RED_ALIADO_VIEW: 'RedAliadoView',
    RESET_POINTS_VIEW: 'ResetPointsView',
    ITEMS_VIEW: 'itemsView',
    PRIVACY_VIEW: 'PrivacyView',
    ITEMS_DETAILS_VIEW: 'itemsDetailsView',
    SHOPPING_CART_VIEW: 'shoppingCartView',
    BACK_ORDER_VIEW: 'backOrderView',
    PROFILE_VIEW: 'profileView',
    ORDERS_VIEW: 'ordersView',
    CONTACT_US_VIEW: 'contactUsView',
    ABOUT_US_VIEW: 'aboutUsView',
    CLAIM_US_VIEW: 'claim',
    POLITICS_US_VIEW: 'politics',
    QUESTIONS_US_VIEW: 'questions',
    SELECT_ADDRESS_VIEW: 'selectAddressView',
    EDIT_ADDRESS_VIEW: 'EditAddressView',
    VALIDATE_ORDER_VIEW: 'validateOrderView',
    CREATE_ORDER_VIEW: 'createOrderView',
    PROMO_VIEW: 'PromocionalesView',
    AUTORIZA_VIEW: 'AutorizacionesView',
    CANALMODERNO_VIEW: 'MiddlewareView',

    ITEMS_POLAR_VIEW: 'ItemsPolarView',
    ITEMS_BLANCA_VIEW: 'ItemsBlancaView',
    ITEMS_ROUTLET_VIEW: 'ItemsRoutletView',
    ITEMS_MARCA_FOUR_VIEW: 'ItemsMarcaCuatro',
    ITEMS_MARCA_FIVE_VIEW: 'ItemsMarcaCinco',

    ADD_ADRESS_VIEW: 'AddAddress',
    ACCOUNT_DATA_VIEW: 'AccountData',
    JOB_VIEW: 'job',
    ABOUT_Red_VIEW: 'aboutRedView',
    SAFE_SHOPPING_VIEW: 'safeShoppingView',
    PAYMENT_METHOD_VIEW: 'paymentMethodView',
    DEVOLUTION_VIEW: 'devolutionView',
    SPECIAL_PRICES_VIEW: 'specialPricesView',
    NEW_BLOG_VIEW: 'newBlogView',
    SUCURSALES_VIEW: 'SucursalView',
    PLANTILLA_VIEW: 'plantillaView',

};

export const DISPATCH_ID = {
    /* Config */
    CONFIG_SET_SPINNER: 'CONFIG_SET_SPINNER',
    CONFIG_SET_HISTORY_REFERENCE: 'CONFIG_SET_HISTORY_REFERENCE',
    CONFIG_SET_LOG_OUT_REFERENCE: 'CONFIG_SET_LOG_OUT_REFERENCE',
    CONFIG_SET_BEFORE_UNLOAD_REFERENCE: 'CONFIG_SET_BEFORE_UNLOAD_REFERENCE',
    CONFIG_CLEAN_REDUCER: 'CONFIG_CLEAN_REDUCER',

    /* Notification */
    NOTIFICATION_SET_ALERT_REFERENCE: 'NOTIFICATION_SET_ALERT_REFERENCE',

    /* login */
    LOGIN_SET_USER: 'LOGIN_SET_USER',
    LOGIN_SET_NAME: 'LOGIN_SET_NAME',
    LOGIN_SET_RFC: 'LOGIN_SET_RFC',
    LOGIN_SET_PHONE: 'LOGIN_SET_PHONE',
    LOGIN_SET_PHONE_2: 'LOGIN_SET_PHONE_2',
    LOGIN_SET_PASSWORD: 'LOGIN_SET_PASSWORD',
    LOGIN_SET_VALIDATE_PASSWORD: 'LOGIN_SET_VALIDATE_PASSWORD',
    LOGIN_SET_ADDRESS: 'LOGIN_SET_ADDRESS',
    LOGIN_SET_STREET: 'LOGIN_SET_STREET',
    LOGIN_SET_SUBURB: 'LOGIN_SET_SUBURB',
    LOGIN_SET_CITY: 'LOGIN_SET_CITY',
    LOGIN_SET_CP: 'LOGIN_SET_CP',
    LOGIN_SET_COUNTRY: 'LOGIN_SET_COUNTRY',
    LOGIN_SET_STATE: 'LOGIN_SET_STATE',
    LOGIN_CLEAN_REDUCER: 'LOGIN_CLEAN_REDUCER',

    LOGIN_SET_CFDI: 'LOGIN_SET_CFDI',
    LOGIN_SET_BLOCK: 'LOGIN_SET_BLOCK',

    TRANSBANK_VALUE: 'TRANSBANK_VALUE',
    TRANSBANK_ACTION: 'TRANSBANK_ACTION',
    TRANSBANK_NAME: 'TRANSBANK_NAME',

    /* Data to billing */
    LOGIN_SET_ADDRESS_BILL: 'LOGIN_SET_ADDRESS_BILL',
    LOGIN_SET_STREET_BILL: 'LOGIN_SET_STREET_BILL',
    LOGIN_SET_SUBURB_BILL: 'LOGIN_SET_SUBURB_BILL',
    LOGIN_SET_CITY_BILL: 'LOGIN_SET_CITY_BILL',
    LOGIN_SET_CP_BILL: 'LOGIN_SET_CP_BILL',
    LOGIN_SET_COUNTRY_BILL: 'LOGIN_SET_COUNTRY_BILL',
    LOGIN_SET_STATE_BILL: 'LOGIN_SET_STATE_BILL',

    /* Session */
    SESSION_SET_ROLE: 'SESSION_SET_ROLE',
    SESSION_SET_USER: 'SESSION_SET_USER',
    SESSION_SET_ADDRESSES: 'SESSION_SET_ADDRESSES',
    SESSION_SET_TOKEN: 'SESSION_SET_TOKEN',
    SESSION_SET_REMEMBER_USER: 'SESSION_SET_REMEMBER_USER',
    SESSION_SET_BUSINESS_ID: 'SESSION_SET_BUSINESS_ID',
    SESSION_CLEAN_REDUCER: 'SESSION_CLEAN_REDUCER',

    /* ItemsReducer */
    ITEMS_SET_ITEMS: 'ITEMS_SET_ITEMS',
    ITEMS_SAVE_ITEMS_FILTER: 'ITEMS_SAVE_ITEMS_FILTER',
    ITEMS_SET_ITEM_DETAILS: 'ITEMS_SET_ITEM_DETAILS',
    ITEMS_SET_SEARCH: 'ITEMS_SET_SEARCH',
    ITEMS_SET_PAGINA: 'ITEMS_SET_PAGINA',
    ITEMS_SET_CATEGORY: 'ITEMS_SET_CATEGORY',
    ITEMS_SAVE_TAGS: 'ITEMS_SAVE_TAGS',
    ITEMS_OPEN_ITEM_DETAILS_REFERENCE: 'ITEMS_OPEN_ITEM_DETAILS_REFERENCE',
    ITEMS_UPDATE_FAVORITE_REFERENCE: 'ITEMS_UPDATE_FAVORITE_REFERENCE',
    ITEMS_ADD_SHOPPING_CART_REFERENCE: 'ITEMS_ADD_SHOPPING_CART_REFERENCE',
    ITEMS_ADD_BACK_ORDER_REFERENCE: 'ITEMS_ADD_BACK_ORDER_REFERENCE',
    ITEMS_DELETE_BACK_ORDER_REFERENCE: 'ITEMS_DELETE_BACK_ORDER_REFERENCE',
    ITEMS_DELETE_SHOPPING_CART_REFERENCE: 'ITEMS_DELETE_SHOPPING_CART_REFERENCE',
    ITEMS_SET_SEARCH_BY_KEY_REFERENCE: 'ITEMS_SET_SEARCH_BY_KEY_REFERENCE',
    ITEMS_SET_SEARCH_BY_KEY_PAGINACION_REFERENCE: 'ITEMS_SET_SEARCH_BY_KEY_PAGINACION_REFERENCE',
    ITEMS_SET_SEARCH_BY_CATEGORIES_REFERENCE: 'ITEMS_SET_SEARCH_BY_CATEGORIES_REFERENCE',
    ITEMS_SET_ITEMS1: 'ITEMS_SET_ITEMS1',
    ITEMS_SET_ITEMS2: 'ITEMS_SET_ITEMS2',
    ITEMS_SAVE_ITEMS_FILTER1: 'ITEMS_SAVE_ITEMS_FILTER1',
    ITEMS_SAVE_ITEMS_FILTER2: 'ITEMS_SAVE_ITEMS_FILTER2',
    ITEMS_SET_SEARCH_BY_DASH_OPTION : 'ITEMS_SET_SEARCH_BY_DASH_OPTION',
    ITEMS_CLEAN_REDUCER: 'ITEMS_CLEAN_REDUCER',
    ITEMS_SET_IDCATEGORY: 'ITEMS_SET_IDCATEGORY',
    ITEMS_SET_CATEGORIES: 'ITEMS_SET_CATEGORIES',
    ITEMS_SET_UNIQUE_FILTER: 'ITEMS_SET_UNIQUE_FILTER',
    ITEMS_SET_AUTO_COMPLETE:'ITEMS_SET_AUTO_COMPLETE',
    ITEMS_SPECIAL_PRICES: 'ITEMS_SPECIAL_PRICES',
    ITEMS_SET_RELATED_CART:'ITEMS_SET_RELATED_CART',
    ITEMS_BRANDS:'ITEMS_BRANDS',
    ITEMS_CATEGORY_1:'ITEMS_CATEGORY_1',
    ITEMS_CATEGORY_2:'ITEMS_CATEGORY_2',
    ITEMS_CATEGORY_3:'ITEMS_CATEGORY_3',
    ITEMS_CATEGORY_SEARCH:'ITEMS_CATEGORY_SEARCH',
    ITEMS_SHOW_BRANDS_COPY:'ITEMS_SHOW_BRANDS_COPY',
    ITEMS_BRANDS_COPY:'ITEMS_BRANDS_COPY',
    
    // Paginacion 
    ITEMS_SET_TOTALROWS: 'ITEMS_SET_TOTALROWS',
    ITEMS_SET_NEXTPAGE: 'ITEMS_SET_NEXTPAGE',
    ITEMS_SET_LOCATION: 'ITEMS_SET_LOCATION',

    /* ShoppingCart */
    SHOPPING_CART_SAVE_CART: 'SHOPPING_CART_SAVE_CART',
    SHOPPING_CART_SAVE_BACK_ORDER: 'SHOPPING_CART_SAVE_BACK_ORDER',
    SHOPPING_CART_GET_SHOPPING_CART_REFERENCE: 'SHOPPING_CART_GET_SHOPPING_CART_REFERENCE',
    SHOPPING_CART_ITEMS_GIFT: 'SHOPPING_CART_ITEMS_GIFT',

    /*SORT FILTER*/
    ITEMS_SET_SORT_FILTER:'ITEMS_SET_SORT_FILTER',
    
    /*12 Categories*/
    ITEMS_SET_CATEGORIES_BANNER: 'ITEMS_SET_CATEGORIES_BANNER',
};

export const SERVICE_API = {
    login: '/users/login',
    getBusinessPartnerInfo: '/users',
    loginTwoSteps: '/users/loginTwoSteps',
    loginTwoStepsMail: '/users/loginTwoStepsMail',
    subscribeUnsubscribe: '/newsletter/subscribeUnsubscribe',
    insertResetPoints: '/points/insertResetPoints',
    verifySubscription: '/newsletter',
    // loginTwoStepsMail: '/users/loginTwoStepsMail',
    resetPoints: '/points/resetPoints',
    register: '/users/create',
    validate: '/users/validate',
    updatePartner: '/users/updatePartner',
    updateAddresses: '/users/updateAddresses',
    sendJobMail: '/users/sendJobMail',
    //cambiar para abajo cuando jale
    sendFilesByEmail: '/users/sendFilesByEmail',

    getProfile: '/profile/',
    getCategories: '/categories/',
    getImage: '/item/getImage',
    getFile: '/item/getFile',
    searchByKey: '/items/searchByKey',
    searchByCategory: '/items/searchByCategory',
    openItemDetails: '/item',
    updateFavorite: '/favorite/update',
    updateShoppingCart: '/shoppingCart/update',
    updateBackOrder: '/backOrder/update',
    updateShoppingCarLocal: '/shoppingCart/updatelocal',
    deleteShoppingCart: '/shoppingCart/delete',
    deleteBackOrder: '/backOrder/delete',
    getShoppingCart: '/shoppingCart',
    createDocument: '/createDocument',
    SaveFileOV: '/saveFileOV',
    notifyOrders: '/users/UserNoite',
    getTaxEnvio: '/getTaxEnvio',
    getImageCategories: '/categories/getImage',
    getPolitics: '/categories/getPolitics',
    getBillspdf:'/bills/getBillspdf',
    getBillsxml:'/bills/getBillsxml',
    getOrderspdf:'/getOrderspdf',

    removeShopping: '/removeShopping',
    getCountries: '/catalog/countries',
    getStates: '/catalog/states',
    getCP: '/catalog/cp',
    getCFDI: '/catalog/cfdi',

    getRegions: '/getRegions',
    getCities: '/getCities',
    getComunas: '/getComunas',

    getProductsHome: '/getProductsHome',
    getCategoriesHome: '/getCategoriesHome',
    getBannerHome:'/getBannerHome',

    getCFDI: '/catalog/cfdi',

    getPayment: '/transbank',

    getOrders: '/orders',
    getOrdersSeller: '/ordersSeller',
    getOrder: '/order',
    getOrdersDetails: '/order',
    getFlete: '/item_flete',
    getOneOrder: '/getOneOrder',    // conF getOneOrder

    getDescuento: '/catalogs/getDescuento',

    getBillings: '/bill',
    getBillingsDue: '/billDue',
    getDataBillings: '/dataBill',
    getPDF: '/bills/getPDF/',
    getXML: '/bills/getXML/',
    getHistory: '/getHistory',

    getProdutcsDashBoard: '/items/dashBoard/',

    getBanners:'/admin/getbanners',

    getQuotation: '/quotations',
    getGeneralOrdersView: '/GeneralOrdersView',
    getDataQuotation: '/dataQuotation',
    createQuotation:'/createQuotations',

    getDelivery: '/deliverys',
    getDataDelivery: '/dataDelivery',
    createDelivery: '/createDelivery',

    getSaveds: '/saveds',
    getDataProduct: '/saved',
    getDataDocument: '/docuemntList',
    getDataExcel: '/documentExcel',
    createSavedCart: '/createSavedCart',
    updateSavedCart: '/updateSavedCart',

    getPreliminarys: '/preliminarys',
    getDataPreliminarys: '/dataPreliminarys',
    createPreliminar: '/createPreliminary',
    getFiltros : '/filtros',
    getMarcas:'/getMarcas',
    getAparatos:'/getAparato',
    getRefaccion:'/getRefaccion',
    getFabricante:'/getFabricante',
    getMaterial:'/getMaterial',
    getItemsAdvance:'/searchAdvance',
    getProductsEspecial:'/getProductsEspecial',
    ProductsEspecial:'/ProductsEspecial',

    getCollections: '/collections',

    getOverdueOne: '/overdueOne',
    getOverdueTwo: '/overdueTwo',
    getOverdueThree: '/overdueThree',
    getOverdueFour: '/overdueFour',
    getOverdueFive: '/overdueFive',

    getDataProfiled: '/dataProfiled',

    getDataReumen: '/getDataResumen',

    sendClaim: '/claimReports',
    mercadoUpdateItem : '',

    PostItemMercadoLibre: '/PostItemMercadoLibre',
    searchItemsMl: '/getItemToML',
    searchPublishedItemsML: '/getPublishedItemsML',
    darValor: '/DarValor',

    updateItemML: '/UpdateItemML',
    postearItem: '/postPublication',

    getInfoCoupon: '/getCoupon',
    seller: '/seller/login',
    listClient: '/seller/listClient',
    searchClient: '/seller/searchClient',
    searchItems:'/Items',
    getPromo:'/Promocionales',
    getPromocion : '/getPromocion',
    getPromocionDisparador :'/getPromocionDisparador',
    getConditions : '/getConditions',
    getBonificacion: '/catalogs/getBonificacion',
    tipoDisparadorVol : '/tipoDisparadorvol',
    tipoDisparadorMonto : '/tipoDisparadormonto',
    getPriceList : '/getPrices',
    //update Carrito guardado
    updateCart : '/updateCart',
    insertPromo : '/InsertPromo',
    updatePromo :'/UpdatePromo',
    aprobarPromo : '/AprobarPromo',
    activarPromo : '/ActivarPromo',
    //Update Partner
    detailsprofile: '/detailsprofile',
    //Autorizaciones
    getAutorizaciones : '/Autorizaciones',
    getAutorizacionesCanalModerno : '/AutorizacionesCanalModerno',
    getCreateCanalModerno : '/getCreateCanalModerno',
    createAutorization : '/createAutorization',
    rejectedAutorization : '/rejectedAutorization',
    updateAuthorization : '/updateAuthorization',
    
    getDatailsAuto: '/detailAuto',
    getDatailsAutoCanalModerno: '/detailAutoCanalModerno',
    loginousr : '/users/loginousr',
    //CANAL MODERNO
    validateMiddleware: '/validateProcess',
    middleware: '/process/',
    //canalModerno : '/canalModerno',
    //Conditions promocionales
    searchConditions : '/searchConditions',
    getPromocionales:'/Promo',
    getPackageStrore: '/catalog/packageStore',
    jobTypes: '/jobTypes',

    sendRaiting: '/raiting',
    getRaiting: '/getRaiting',
    AutoComplete: '/AutoComplete',
    sendData: '/sendData',
    getItemStock: '/getStockDetails',

    sendRequestCardMail: '/users/sendRequestCardMail',

 

    getValidationSpecialPrices: '/getValidationSpecialPrices',
    setSpecialPricesStatus: '/updateSPStatus',

    getSpecialPrice: '/SpecialPrice',

    createPayment: '/createPayment',

    getAllEmails: '/getAllEmails',
    getCartSaveds:'/CartSaved',
    getDetailsCartSaveds : '/DetailCartSaved',
    deleteCartSaved: '/deleteCartSaved',

    // 117 
    getOneOverdue: '/getOneOverdue',
    regresarAutorization : '/regresarAutorization',
    liberarCliente: '/liberarCliente',

    add2Favorites: '/addToFavorites',

    //New distributor
    sendDistributorData:'/sendDistributorData',

    //
    getRelatedCart:'/getRelatedCart',
    //getMenuCategories for menu
    getMenuCategories:'/getMenuCategories',
    sendEmail: '/sendEmail',
    //New image profle
    sendImageProfile:'/sendImageProfile',

    //Adm Categorias
    getCategorias:'/admin/getcategorias',
    getAllCategories:'/admin/getCategories',
};

export const SERVICE_RESPONSE = {
    SUCCESS: 1,
    EXPIRED_SESSION: -1,
    ERROR: 0,
};

export const ROLES = {
    PUBLIC: 'PUBLIC',
    CLIENT: 'CLIENT',
};

export const OBJ_TYPE = {
    ORDER: '23',
};