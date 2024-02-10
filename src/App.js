import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import {
    DashboardView,
    DashboardView2,
    ItemsView,
    ItemsDetailsView,
    LoginView,
    RedCompensasZoneView,
    ResetPointsView,
    ShoppingCartView,
    QuoteView,
    BackOrderView,
    ProfileView,
    OrdersView,
    BillView,
    AboutUsView,
    ContactUsView,
    MercadoLibreView,
    SelectAddressView,
    ValidateOrderView,
    CreteOrderView,
    BannerAdminIndex,
    Selector,
    reportsView,
    Quatiton,
    Delivery,
    Saveds,
    Preliminary,
    Collection,
    Overdue,
    MyProfile,
    AutorizacionesView,
    MiddlewareView,
    SubirArchivo,
    Reclamo,
    Politicas,
    Preguntas,
    Transbank,
    MercadoPago,
    ItemsPolarView,
    ItemsBlancaView,
    ItemsRoutletView,
    TermsView,
    AddAddressView,
    AccountDataView,
    PoliticsView,
    RedAliadoView,
    PrivacyView,
    EditAddressView,
    JobView,
    SucursalView,
    AboutRedCompensasZoneView,
    SafeShoppingView,
    PaymentMethodView,
    DevolutionView,
    adminNewsBlogsView,
    NewsBlogView,
    SpecialPricesView,
    PromocionalesView,
    PlantillaView,
    ItemsNumberFive,
    ItemsNumberFour,
    AsesoriaView,
    ClientAllItems,
    AboutUsView1,
    CardSavedsView,
    CarouselAdvantages,
    resumenCuenta,
    AccountStatusView,
    BrandsView,
    CategoriaAdminIndex,
} from './views';
import PostBanner from './views/banners/postbanner';
import PostCategoria from './views/categorias/postcategoria';
import { connect } from 'react-redux';
import './App.css';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import AWN from "awesome-notifications";
import { DISPATCH_ID, config, ROLES } from './libs/utils/Const';
import { SearchItemsActions, Footer } from './components';
import CacheBuster from './CacheBuster';
import { ApiClient } from './libs/apiClient/ApiClient';
const apiClient = ApiClient.getInstance();
// const Webpay = require('./controllers/WebpayNormalController');
class App extends Component {

    UNSAFE_componentWillMount() {
        const { setBusiness, setToken, setUser, setRememberUser, setRole, setLogOutReference } = this.props;

        //users
        let token = localStorage.getItem(config.general.localStorageNamed + 'Token');
        let role = localStorage.getItem(config.general.localStorageNamed + 'Role');
        let user = localStorage.getItem(config.general.localStorageNamed + 'CurrentUser');
        let rememberUser = localStorage.getItem(config.general.localStorageNamed + 'RememberUser');

      

        user = JSON.parse(user) || {};

        setRole(role || ROLES.PUBLIC);
        setBusiness(config.general.business);
        setToken(token);
        setUser(user);
        setRememberUser(rememberUser);
        //Comentar para pruebas para que NO se cierre la sesión
        // setLogOutReference(this.logOut);
    }

    logOut = () => {
        const { configReducer, setBusiness, setToken, setUser, setRememberUser, setRole, shoppingCartReducer: { getShoppingCart } } = this.props;
        localStorage.removeItem(config.general.localStorageNamed + 'Role');
        localStorage.removeItem(config.general.localStorageNamed + 'Token');
        localStorage.removeItem(config.general.localStorageNamed + 'CurrentUser');
        localStorage.removeItem(config.general.localStorageNamed + 'PartnerUser');
        localStorage.removeItem(config.general.localStorageNamed + 'RememberUser');
        localStorage.removeItem(config.general.localStorageNamed + 'vendor');
        localStorage.clear();
        configReducer.history.goHome();

        setRole(ROLES.PUBLIC);
        setBusiness(config.general.business);
        setToken(undefined);
        setUser({});
        setRememberUser(false);

        setTimeout(async () => {
            await getShoppingCart(true);
        }, 300);

    };

    async componentDidMount() {
        const { addNotificationReference,setBrands,setCategory1,setCategory2,setCategory3 } = this.props;
        addNotificationReference(this.createNotification);
        let response = await apiClient.getMenuCategories();
        localStorage.setItem(config.general.localStorageNamed + 'CATEGORIES-MENU', JSON.stringify(response));
        setBrands(response.data.arrCategory)
        setCategory1(response.data.arrSubCategory1)
        setCategory2(response.data.arrSubCategory2)
        setCategory3(response.data.arrSubCategory3)
        // let exist = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'CATEGORIES-MENU'));
        // if(!exist){
        //     let response = await apiClient.getMenuCategories();
        //     console.log('DARWIN>>response',response);
        //     localStorage.setItem(config.general.localStorageNamed + 'CATEGORIES-MENU', JSON.stringify(response));
        //     setBrands(response.data.categories)
        //     setCategory1(response.data.subC1Final)
        //     setCategory2(response.data.subC2Final)
        //     setCategory3(response.data.subC3Final)
        // }else{
        //     setBrands(exist.data.categories)
        //     setCategory1(exist.data.subC1Final)
        //     setCategory2(exist.data.subC2Final)
        //     setCategory3(exist.data.subC3Final)
        // }
    }

    createNotification = action => {
        let notifierOptions = {
            position: 'top-right',
            durations: {
                global: action.timeOut ? action.timeOut + 1000 : 8000
            },
            labels: {
                info: "Información",
                success: "Exitoso",
                warning: "Advertencia",
                alert: "ALERTA",
            }
        }
        let notifier = new AWN(notifierOptions);
        switch (action.type) {
            case 'info':
                notifier.info(
                    action.message ? action.message : ''
                );
                // NotificationManager.info(
                //     action.message ? action.message : '',
                //     action.title ? action.title : '',
                //     action.timeOut ? action.timeOut : 3000,
                //     action.callback ? action.callback : null
                // );
                break;
            case 'success':
                notifier.success(
                    action.message ? action.message : ''
                );
                // NotificationManager.success(
                //     action.message ? action.message : '',
                //     action.title ? action.title : '',
                //     action.timeOut ? action.timeOut : 3000,
                //     action.callback ? action.callback : null
                // );
                break;
            case 'warning':
                notifier.warning(
                    action.message ? action.message : ''
                );
                // NotificationManager.warning(
                //     action.message ? action.message : '',
                //     action.title ? action.title : '',
                //     action.timeOut ? action.timeOut : 3000,
                //     action.callback ? action.callback : null
                // );
                break;
            case 'error':
                notifier.alert(
                    action.message ? action.message : ''
                );
                // NotificationManager.error(
                //     action.message ? action.message : '',
                //     action.title ? action.title : '',
                //     action.timeOut ? action.timeOut : 3000,
                //     action.callback ? action.callback : null
                // );
                break;
            default:
                return;
        }
    };

    render() {
        const { spinner } = this.props.configReducer;
        const { addNotificationReference } = this.props;

        addNotificationReference(this.createNotification);
        return (
            <CacheBuster>
                {
                    ({loading, isLatestVersion, refreshCacheAndReload }) => {
                        if (loading) return null;
                        if (!loading && !isLatestVersion) {
                            refreshCacheAndReload();
                        }
                        return(
                        <div id="idRegresar" className="scroll-tip" style={{width: "100%"}}>
                            {spinner && (
                                <div className="loader" style={{ backgroundColor: config.general.loaderBackground }}>
                                    <div className="text-center">
                                        <div className={"spinner-border " + config.general.loaderColor} style={{ width: 45, height: 45 }} role="status">
                                            <span className="sr-only">{config.general.loaderImage}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <NotificationContainer />
                            <SearchItemsActions />
                            <Switch>
                                <Route exact path="/" component={DashboardView} />
                                {/* <Route exact path="/2" component={DashboardView2} />                                 */}
                                <Route exact path="/login" component={LoginView} />
                                <Route exact path="/zonaRecompensa" component={RedCompensasZoneView} />
                                <Route exact path="/resetPoints" component={ResetPointsView} />
                                <Route exact path="/items" component={ItemsView} />
                                <Route exact path="/itemsDetails" component={ItemsDetailsView} />

                                <Route exact path="/terms" component={TermsView} />
                                <Route exact path="/aliado" component={RedAliadoView} />
                                <Route exact path="/privacy" component={PrivacyView} />

                                <Route exact path="/shoppingCart" component={ShoppingCartView} />
                                <Route exact path="/quote" component={QuoteView} />
                                <Route exact path="/backOrder" component={BackOrderView} />
                                <Route exact path="/profile" component={ProfileView} />
                                <Route exact path="/orders" component={OrdersView} />
                                <Route exact path="/bill" component={BillView} />
                                <Route exact path="/aboutUs" component={AboutUsView} />
                                <Route exact path="/contactUs" component={ContactUsView} />
                                {/* <Route exact path="/mercadoLibre" component={MercadoLibreView} /> */}
                                <Route exact path="/selectAddress" component={SelectAddressView} />
                                <Route exact path="/validateOrder" component={ValidateOrderView} />
                                <Route exact path="/createOrder" component={CreteOrderView} />
                                <Route exact path="/adminBanners" component={BannerAdminIndex} />
                                <Route exact path="/postbanner/:id/:slug" component={PostBanner} />
                                <Route exact path="/selector" component={Selector} />
                                <Route exact path="/reports" component={reportsView} />
                                <Route exact path="/quotations" component={Quatiton} />
                                <Route exact path="/delivery" component={Delivery} />
                                <Route exact path="/saveds" component={Saveds} />
                                <Route exact path="/prelimnarys" component={Preliminary} />
                                <Route exact path="/collections" component={Collection} />
                                <Route exact path="/overs" component={Overdue} />
                                <Route exact path="/myprofile" component={MyProfile} />
                                <Route exact path="/autorizaciones" component={AutorizacionesView} />
                                <Route exact path='/canalModerno' component={MiddlewareView}/>
                                <Route exact path="/subirArchivo" component={SubirArchivo} />
                                {/* <Route exact path="/tranbank/init" component={Webpay.init}/> */}
                                <Route exact path="/claim" component={Reclamo}/>
                                <Route exact path="/politics" component={Politicas}/>
                                <Route exact path="/questions" component={Preguntas}/>
                                {/* <Route exact path="/transbank/:action/:name/:token" component={Transbank}/>
                                <Route exact path="/mercadoPago" component={MercadoPago}/>                     */}
                                <Route exact path="/itemsM1" component={ItemsPolarView} />
                                <Route exact path="/itemsM2" component={ItemsBlancaView} />
                                <Route exact path="/itemsM3" component={ItemsRoutletView} />
                                <Route exact path="/itemsM4" component={ItemsNumberFour} />
                                <Route exact path="/itemsM5" component={ItemsNumberFive} />

                                <Route exact path="/terms" component={TermsView} />
                                <Route exact path="/addAddress" component={AddAddressView}/>
                                <Route exact path="/accountData" component={AccountDataView}/>
                                <Route exact path="/sellingPolices" component={PoliticsView}/>
                                <Route exact path="/editAddress" component={EditAddressView}/>
                                <Route exact path="/job" component={JobView}/>
                                <Route exact path="/privacy" component={PrivacyView} />
                                <Route exact path="/sucursales" component={SucursalView} />
                                <Route exact path="/clientePreferente" component={AboutRedCompensasZoneView}/>
                                <Route exact path="/safeShoppig" component={SafeShoppingView}/>
                                <Route exact path="/paymentMethodView" component={PaymentMethodView}/>
                                <Route exact path="/devolutionView" component={DevolutionView}/>
                    
                                <Route exact path="/admiNewsBlog" component={adminNewsBlogsView} />
                                <Route exact path="/newsBlog" component={NewsBlogView} />

                                <Route exact path="/specialPrices" component={SpecialPricesView} />    

                                <Route exact path="/promocionales" component={PromocionalesView} />
                                <Route exact path="/platilla" component={PlantillaView} />
                                <Route exact path="/asesoria" component={AsesoriaView} />
                                <Route exact path="/boletin" component={AboutUsView1} />
                                <Route exact path="/cardsaved" component={CardSavedsView} />
                                <Route exact path="/resumenCuenta" component={resumenCuenta}/>
                                <Route exact path="/accountStatus" component={AccountStatusView}/>
                                <Route exact path="/brands" component={BrandsView}/>

                                <Route exact path="/adminCategorias" component={CategoriaAdminIndex} />
                                <Route exact path="/postcategoria/:id/:slug" component={PostCategoria} />

                                {/* Siempre al final */}
                                <Route exact path="*" component={DashboardView} />
                 
                            </Switch>
                            {/* <Footer /> */}
                        </div>
                        );
                    }
                }
            </CacheBuster>
        );
    }
}

const mapStateToProps = store => {
    return { 
        configReducer: store.ConfigReducer, 
        shoppingCartReducer: store.ShoppingCartReducer };
};

const mapDispatchToProps = dispatch => {
    return {
        setRole: value => dispatch({ type: DISPATCH_ID.SESSION_SET_ROLE, value }),
        addNotificationReference: value => dispatch({ type: DISPATCH_ID.NOTIFICATION_SET_ALERT_REFERENCE, value }),
        setBusiness: value => dispatch({ type: DISPATCH_ID.SESSION_SET_BUSINESS_ID, value }),
        setToken: value => dispatch({ type: DISPATCH_ID.SESSION_SET_TOKEN, value }),
        setUser: value => dispatch({ type: DISPATCH_ID.SESSION_SET_USER, value }),
        setRememberUser: value => dispatch({ type: DISPATCH_ID.SESSION_SET_REMEMBER_USER, value }),
        setLogOutReference: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_LOG_OUT_REFERENCE, value }),
        setBrands: value => dispatch({type: DISPATCH_ID.ITEMS_BRANDS, value}), 
        setCategory1: value => dispatch({type: DISPATCH_ID.ITEMS_CATEGORY_1, value}), 
        setCategory2: value => dispatch({type: DISPATCH_ID.ITEMS_CATEGORY_2, value}), 
        setCategory3: value => dispatch({type: DISPATCH_ID.ITEMS_CATEGORY_3, value}), 
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
